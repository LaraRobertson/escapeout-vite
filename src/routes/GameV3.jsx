import React, {useEffect, useState} from "react"
import {
    Button,
    View,
    Image,
    Flex, useAuthenticator
} from '@aws-amplify/ui-react';
import {Navigate, useLocation, useNavigate} from "react-router-dom";
import DOMPurify from "dompurify";
import Modal from "react-modal";
import {generateClient} from "aws-amplify/api";
import { format } from 'date-fns'
import {
    setGameNotesFunction,
    goHomeQuit,
    removeLocalStorage,
    keyID
} from "../components/helper";
import {NotesOpen} from "../components/sharedComponents";
import { ReactModalFromBottom,ReactModalWinner, ModalClue, ModalPuzzle } from "../components/Modals";
import {gameScoreByGameStatsID, getGame} from "../graphql/queries";
import * as mutations from "../graphql/mutations";
import GameClue from "../components/game/GameClue";
import {GamePuzzle, ModalPuzzleContent} from "../components/game/GamePuzzle";
import Hints from "../components/game/Hints";
import {MapGame} from "../components/game/Map";
import Winner from "../components/game/Winner";
import Help from "../components/game/Help";
import zoneIcon from "../assets/noun-zone-3097481-FFFFFF.svg";
import {MyGameContext} from "../MyContext";

export function GameV3() {
    const client = generateClient();
    const location = useLocation();
    const { authStatus } = useAuthenticator((context) => [
        context.authStatus])
    /* dark / light */
    const [isChecked, setIsChecked] = useState(true);

    const [game, setGame] = useState([]);
    const [gameHint, setGameHint] = useState([]);

    const [playZone, setPlayZone] = useState([]);
    const [zoneVisible, setZoneVisible] = useState("");
    const [zoneName, setZoneName] = useState("");
    const [clues, setClues] = useState("");
    const [cluesArray, setCluesArray] = useState([]);
    const [gameClues, setGameClues] = useState([]);
    const [gamePuzzleArray, setGamePuzzleArray] = useState([]);

    /* guesses and answers */
    const [gamePuzzleGuess, setGamePuzzleGuess] = useState({});
    const [gamePuzzleAnswer, setGamePuzzleAnswer] = useState({});
    const [gamePuzzleAnswerCorrect, setGamePuzzleAnswerCorrect] = useState({});
    const [gamePuzzleSolved, setGamePuzzleSolved] = useState({});

    const [isGoHomeQuitVisible, setIsGoHomeQuitVisible] = useState(false);
    const [isAlertVisible, setIsAlertVisible] = useState(false);
    const [alertText, setAlertText] = useState('');

    const [modalContent, setModalContent] = useState({open:false, content:""});
    const [modalClueContent, setModalClueContent] = useState({show:false, content:""});
    const [modalPuzzleContent, setModalPuzzleContent] = useState({show:false, content:""});


    const [gameHintVisible, setGameHintVisible] = useState({});
    const [gameNotes,setGameNotes] = useState('');
    const [gameTimeHint, setGameTimeHint] = useState(0);
    const [gameTimeTotal, setGameTimeTotal] = useState(0);
    const [gameStatsID, setGameStatsID] = useState('');
    const [gameScoreID, setGameScoreID] = useState('');
    const [gameID, setGameID] = useState('');
    const [gameComplete, setGameComplete] = useState(false);
    const [realTimeStart, setRealTimeStart] = useState();
    /*****/

    const navigate = useNavigate();

    /* get gamestats and set localstorage */
    async function setGamePlayFunction() {
        console.log("setGamePlayFunction - only on mount");
        //* check if already playing */
        if (localStorage.getItem("realTimeStart")) {
            /* have already started game - user refreshed (or something) and wants to continue */
            setIsAlertVisible(true);
            setAlertText('resuming game');
            setTimeout(() => {
                setIsAlertVisible(false);
            }, 3000);
            setGameNotes(localStorage.getItem("gameNotes"));
            //setClues(localStorage.getItem("clues"));
            setRealTimeStart(localStorage.getItem("realTimeStart"));
            setGameScoreID(localStorage.getItem("gameScoreID"));
            if (localStorage.getItem("gameTimeHint")!=null) {
                setGameTimeHint(Number(localStorage.getItem('gameTimeHint')));
            }
            if (localStorage.getItem("gameHintVisible")!=null) {
                setGameHintVisible(JSON.parse(localStorage.getItem("gameHintVisible")));
            }
            if (localStorage.getItem("gamePuzzleSolved")!=null) {
                setGamePuzzleSolved(JSON.parse(localStorage.getItem("gamePuzzleSolved")));
            }
            if (localStorage.getItem("gamePuzzleGuess")!=null) {
                setGamePuzzleGuess(JSON.parse(localStorage.getItem("gamePuzzleGuess")));
            }
            if (localStorage.getItem("gamePuzzleAnswer")!=null) {
                setGamePuzzleAnswer(JSON.parse(localStorage.getItem("gamePuzzleAnswer")));
            }
            if (localStorage.getItem("gamePuzzleAnswerCorrect")!=null) {
                setGamePuzzleAnswerCorrect(JSON.parse(localStorage.getItem("gamePuzzleAnswerCorrect")));
            }
            if (localStorage.getItem("cluesArray")!=null) {
                setCluesArray(JSON.parse(localStorage.getItem("cluesArray")));
            }

            /* end check */
        } else {
            console.log("loading game: get GameID: " + localStorage.getItem("gameID"));
            console.log("loading game: get GameStatsID: " + localStorage.getItem("gameStatsID"));
            /* get gamescoreid */
            let filter = {
                gameID: {
                    eq: localStorage.getItem("gameID")
                },
                gameTotalTime: {
                    eq: 0
                },
                gameHintTime: {
                    eq: 0
                },
                completed: {
                    eq: false
                },
                disabled: {
                    eq: false
                }
            };
            try {
                const apiGameScore = await client.graphql({
                    query: gameScoreByGameStatsID,
                    variables: {filter: filter, sortDirection: "DESC", gameStatsID: localStorage.getItem("gameStatsID")}
                });
                const gamesScoreID = apiGameScore.data.gameScoreByGameStatsID.items[0];
                localStorage.setItem("gameScoreID", gamesScoreID.id);
            } catch (err) {
                console.log('error createGameScore..', err)
            }
            setGameID(localStorage.getItem("gameID"));
            setGameStatsID(localStorage.getItem("gameStatsID"));
            setGameScoreID(localStorage.getItem("gameScoreID"));
            let startDate = new Date();
            setRealTimeStart(startDate);
            localStorage.setItem("realTimeStart", startDate);
        }
        /* get game details */
        try {
            const apiData = await client.graphql({
                query: getGame,
                variables: {id: localStorage.getItem("gameID")}
            });
            const gamesFromAPI = apiData.data.getGame;
            setGame(gamesFromAPI);
            console.log("getGameDetails initial: " + gamesFromAPI.gameName);
            /* first time */
            /* set up Play Zones: */
            if (gamesFromAPI.gamePlayZone.items.length > 0) {
                let gameZoneArray = gamesFromAPI.gamePlayZone.items.sort((a, b) => {
                    return a.order - b.order;
                });
                setPlayZone(gameZoneArray);
                setZoneVisibleFunction(gameZoneArray[0].id,gameZoneArray[0].gameZoneName );
                console.log("gamesFromAPI.gamePlayZone.items.length: " + gamesFromAPI.gamePlayZone.items.length);
            }
            /* set up game hints: */
            if (gamesFromAPI.gameHint.items.length > 0) {
                let gameHintArray = gamesFromAPI.gameHint.items.sort((a, b) => {
                    return a.order - b.order;
                });
                setGameHint(gameHintArray);
                console.log("gamesFromAPI.gameHint.items.length: " + gamesFromAPI.gameHint.items.length);
            }
            /* set up game clues: */
            if (gamesFromAPI.gameClue.items.length > 0) {
                /* filter by position */
                let gameClueArray = gamesFromAPI.gameClue.items.sort((a, b) => {
                        return a.order - b.order;
                    });
                setGameClues(gameClueArray);
                console.log("gameClueTopArray: " + gameClueArray);
            }
            /* set up game Puzzle: */
            console.log("gamePuzzle.length: "  + gamesFromAPI.gamePuzzle.items.length);
            if (gamesFromAPI.gamePuzzle.items.length > 0) {
                console.log("setGamePuzzleArray: " + JSON.stringify(gamesFromAPI.gamePuzzle.items));
                /* filter by position - does this matter? */
                /* is there an Inactive */
                let gamePuzzleArrayTest = gamesFromAPI.gamePuzzle.items.sort((a, b) => {
                        return a.order - b.order;
                    });
                setGamePuzzleArray(gamePuzzleArrayTest);
                console.log("gamesFromAPI.gamePuzzle.items[0].id: " + gamesFromAPI.gamePuzzle.items[0].id);
                let gamePuzzleSolveID = gamesFromAPI.gamePuzzle.items[0].id;
                setGamePuzzleSolved({...gamePuzzleSolved, [gamePuzzleSolveID]:false});
                //console.log("gamesFromAPI.gameClue.items.length: " + gamesFromAPI.gameClue.items.length);
            }

        } catch (err) {
            console.log('error fetching getGame', err);
        }

    }

    useEffect(() => {
        console.log("***useEffect***: setGamePlayFunction (only on mount)");
        /* set local storage for gameStop - only on mount - to recover from refresh */
        setGamePlayFunction();
    }, []);

    useEffect(() => {
        console.log("***useEffect***: updateGameScoreFunction");
        /* set local storage for gameStop - only on mount - to recover from refresh */
        updateGameScoreFunction();
    }, [gameComplete]);

    async function updateGameScoreFunction() {
        console.log("updateGameScore:  " + gameTimeHint);
        let startDate = new Date(realTimeStart);
        // Do your operations to calculate time
        let endDate   = new Date();
        localStorage.setItem("realTimeEnd",endDate);
        let minutes = (endDate.getTime() - startDate.getTime()) / 60000;
        let GameTimeTotal = Number(minutes + gameTimeHint).toFixed(2);
        console.log("GameTimeTotal: " + GameTimeTotal);
        setGameTimeTotal(GameTimeTotal);

        try {
            const data = {
                id: gameScoreID,
                gameTotalTime: GameTimeTotal,
                gameHintTime: gameTimeHint,
                completed:true
            };
            await client.graphql({
                query: mutations.updateGameScore,
                variables: {
                    input: data
                }
            })
            const gameStatsValues = {
                waiverSigned: true, completed: true
            }
            const data2 = {
                id: gameStatsID,
                gameStates: JSON.stringify(gameStatsValues),
            };
            console.log("data for createGameStats: " + JSON.stringify(data));
            try {
                await client.graphql({
                    query: mutations.updateGameStats,
                    variables: {input: data2},
                });

            } catch (err) {
                console.log("error updateGameStats..", err)
            }
            removeLocalStorage();

            setTimeout(() => {
                //goHomeQuit(navigate);
            }, 15000);
            console.log("winGameFunction");
            //console.log("gameTime = seconds: " + seconds);
        } catch (err) {
            console.log('error updating gamescore:', err);
        }
    }

    function setCluesFunction(gameClueName,gameClueText,gameClueID,gameClueImage) {
        setAlertText("clue added to notes");
        setIsAlertVisible(true);
        console.log("setCluesFunction");
        setTimeout(() => {
            setIsAlertVisible(false);
        }, 3000);
        let clueTemp = "<strong>" + gameClueName + " </strong> ==> " +
            gameClueText + " <br />";

        let cluesArrayObject = {
            gameClueName: gameClueName,
            gameClueText: gameClueText,
            gameClueID: gameClueID,
            gameClueImage: gameClueImage,
        };
        let cluesArrayTemp = cluesArray;
        cluesArrayTemp.push(cluesArrayObject);
        console.log("json cluesArrayTemp Z2: " + JSON.stringify(cluesArrayTemp))
        setCluesArray(cluesArrayTemp);
        setClues(clues + clueTemp);
        localStorage.setItem("clues",clues + clueTemp);
        localStorage.setItem("cluesArray",JSON.stringify(cluesArrayTemp));
    }
    function setCluesArrayRemoveFunction(index) {
        console.log("setCluesArrayFunction");
        const cluesArrayTemp = cluesArray;
        console.log("json cluesArrayTemp 1: " + JSON.stringify(cluesArrayTemp))
        //const index = cluesArrayTemp.indexOf(clueObject);
        const x = cluesArrayTemp.splice(index,1);
        console.log("json cluesArrayTemp 2: " + JSON.stringify(cluesArrayTemp))
        localStorage.setItem("cluesArray",JSON.stringify(cluesArrayTemp));
        cluesArray.splice(index, 1); // 1 means remove one item only
        setCluesArray([...cluesArray]);
    }

    function setAlertTextFunction(alertText) {
        setIsAlertVisible(true);
        setAlertText(alertText);
        setTimeout(() => {
            setIsAlertVisible(false);
        }, 3000);
    }

    function setZoneVisibleFunction(zoneID, zoneName) {
        setZoneVisible(zoneID);
        setZoneName(zoneName);
        setAlertTextFunction("Clues reference things near " + zoneName);
    }

    const backgroundImage = (src) => (
        "url("+ src + ")");

    const initialStateClueDetails = {
        gameClueName: '',
        gameClueText: '',
        gameClueImage: ''
    };
    const [clueDetails, setClueDetails] = useState(initialStateClueDetails);
    const initialStatePuzzleDetails = {
        puzzleID: '',
        winGame: '',
        textFields: [],
    };
    const [puzzleDetails, setPuzzleDetails] = useState(initialStatePuzzleDetails);

    Modal.setAppElement('#modal');

    function DangerouslySetInnerHTMLSanitized(htmlContent) {
        const sanitizedHtmlContent = DOMPurify.sanitize(htmlContent);
        return (sanitizedHtmlContent)
    }
    return (
        <MyGameContext.Provider value={{
            isChecked,
            client,
            navigate,
            gameScoreID,
            setGamePuzzleGuess,
            setGamePuzzleAnswer,
            setGamePuzzleAnswerCorrect,
            setGamePuzzleSolved,
            gamePuzzleArray,
            setModalPuzzleContent,
            setClueDetails,
            setModalClueContent,
            setModalContent,
            setGameComplete
        }}>
            <View position="relative">
                {(authStatus != 'authenticated') | (authStatus === "configuring") ? (
                    <View>
                        {authStatus === "configuring" ?
                            (<View>Loading</View>):(
                                <View>
                                    <View paddingTop="30px" textAlign={"center"}>Game is not available</View>
                                    <Flex justifyContent="center">
                                        <Button className="topLink" onClick={() => navigate('/')}>Back to Home</Button>
                                    </Flex>
                                </View>
                            )}
                    </View>
                ) : (
                <>
                <View className={isChecked ? "game-container dark" : "game-container light"}>
                    <View className={"logo-top"}>EscapeOut.Games</View>
                    <View className="top-bar top-bar-change">

                        <Flex className="zone-holder zone-holder-change"
                              direction="row"
                              justifyContent="center"
                              alignItems="center"
                              alignContent="center"
                              wrap="nowrap"
                              gap="1rem">
                            {playZone.map((zone, index) => (
                                <View
                                    className={(zoneVisible == zone.id) ? "zone-border zone-icon-container" : "zone-icon-container"}
                                    key={zone.id} ariaLabel={zone.id}
                                    onClick={() => setZoneVisibleFunction(zone.id, zone.gameZoneName)}>
                                    <Image height="40px" width="40px" src={zoneIcon} alt="zone icon"/>
                                    <View className={"zone-text"}>zone {index + 1}</View>
                                </View>
                            ))}
                        </Flex>
                    </View>
                    <View className="play-area play-area-change">
                        <View className="image-mask image-mask-change"></View>
                        {playZone.map((zone, index) => (
                            <View aria-label={keyID(zone.id, "zone")} key={keyID(zone.id, "zone")}
                                  className={(zoneVisible == zone.id) ? "image-holder image-holder-change show" : "hide"}
                                  backgroundImage={backgroundImage(zone.gameZoneImage)}>
                            </View>
                        ))}
                        <View className={"game-container-top"}>
                            {zoneName}
                        </View>
                        <View className={"clue-sidebar"}>
                            {gameClues.map((clue, index) => (
                                <GameClue clue={clue}
                                          zoneVisible={zoneVisible}
                                          index={index}
                                          setModalClueContent={setModalClueContent}
                                          setClueDetails={setClueDetails}
                                          key={clue.id}/>
                            ))}
                        </View>
                        <ModalClue
                            modalClueContent={modalClueContent}
                            setModalClueContent={setModalClueContent}
                            clueDetails={clueDetails}
                            setCluesFunction={setCluesFunction}>
                            <>
                            <View
                                dangerouslySetInnerHTML={{__html: DangerouslySetInnerHTMLSanitized(clueDetails.gameClueText)}}
                                paddingTop="10px"></View>
                            {(clueDetails.gameClueImage != "" && clueDetails.gameClueImage != null) &&
                            <Image src={clueDetails.gameClueImage}/>}</>
                        </ModalClue>
                        <View className={"puzzle-sidebar"}>

                            {gamePuzzleArray.map((puzzle, index) => (
                                <GamePuzzle puzzle={puzzle}
                                            zoneVisible={zoneVisible}
                                            index={index}
                                            setPuzzleDetails={setPuzzleDetails}
                                            gamePuzzleSolved={gamePuzzleSolved}
                                            gamePuzzleGuess={gamePuzzleGuess}
                                            gamePuzzleAnswer={gamePuzzleAnswer}
                                            gamePuzzleAnswerCorrect={gamePuzzleAnswerCorrect}
                                            setClueDetails={setClueDetails}
                                            key={puzzle.id}/>
                            ))}

                        </View>
                        <ModalPuzzle
                            modalPuzzleContent={modalPuzzleContent}
                            setModalPuzzleContent={setModalPuzzleContent}
                            puzzleDetails={puzzleDetails}>
                            <ModalPuzzleContent
                                puzzleDetails={puzzleDetails}
                                gamePuzzleGuess={gamePuzzleGuess}
                                gamePuzzleSolved={gamePuzzleSolved}
                                gamePuzzleAnswer={gamePuzzleAnswer}
                                gamePuzzleAnswerCorrect={gamePuzzleAnswerCorrect}
                                setClueDetails={setClueDetails}
                                setModalClueContent={setModalClueContent}
                                updateGameScoreFunction={updateGameScoreFunction}
                            />
                        </ModalPuzzle>
                        <View className="right-side"></View>
                        <View className="game-container-bottom">
                        </View>
                    </View>
                    {/* end play area */}
                    <View className={"notes-area"}>
                        <View ariaLabel="Time" className="time time-change">
                            <View className="small">hint time: {gameTimeHint} mins | time
                                started: {realTimeStart ? format(realTimeStart, "MM/dd/yy h:mma") : null}</View>
                        </View>
                        <NotesOpen clues={clues} setClues={setClues} cluesArray={cluesArray} setCluesArray={setCluesArray} gameNotes={gameNotes}
                                   setGameNotes={setGameNotes} setGameNotesFunction={setGameNotesFunction}
                                   setCluesArrayRemoveFunction={setCluesArrayRemoveFunction}
                                   isChecked={isChecked}/>

                    </View>
                </View> {/* end game-container */}


                <ReactModalFromBottom modalContent={modalContent}>
                    {/*(modalContent.content == "Help") && <Help/>*/}
                    {(modalContent.content == "Help") &&
                    <Hints gameHint={gameHint} setGameTimeHint={setGameTimeHint} gameHintVisible={gameHintVisible}
                           setGameHintVisible={setGameHintVisible}
                           DangerouslySetInnerHTMLSanitized={DangerouslySetInnerHTMLSanitized}/>}
                    {(modalContent.content == "Map") && <MapGame playZone={playZone}/>}
                </ReactModalFromBottom>
                <ReactModalWinner gameTimeTotal={gameTimeTotal}>
                    {(gameComplete) &&
                    <Winner game={game} gameTimeTotal={gameTimeTotal} gameTimeHint={gameTimeHint}/>}
                </ReactModalWinner>

                <View className={isAlertVisible ? "alert-container show" : "hide"}>
                    <div className='alert-inner'>{alertText}</div>
                </View>
                <View className={isGoHomeQuitVisible ? "alert-container show" : "hide"}>
                    <div className='alert-inner'>Do You Really Want To Quit?<br/>
                        <Button marginRight={"10px"} className="button button-small quit-button-alert "
                                onClick={() => {
                                    setIsGoHomeQuitVisible(false);
                                    goHomeQuit(navigate)
                                }}>Yes, I Want Quit</Button>
                        <Button marginRight={"10px"} className="button button-small quit-button-alert"
                                onClick={() => {
                                    setIsGoHomeQuitVisible(false)
                                }}>No, I Want to Play</Button>
                    </div>
                </View>
                <View className={"game-bottom-bar-container"}>
                    <View className={"game-bottom-bar"}>
                        <Button className="quit-button dark"
                                onClick={() => setModalContent({
                                    open: true,
                                    content: "Map"
                                })}>
                            Zone Map</Button>
                        <Button className="quit-button dark"
                                onClick={() => setModalContent({
                                    open: true,
                                    content: "Help"
                                })}>
                            Help</Button>
                        <Button className={isChecked ? "quit-button dark " : "quit-button light "} onClick={() => {
                            setIsGoHomeQuitVisible(true)
                        }}>Quit</Button>
                        {/*<ToggleButton
                className={isChecked? "dark-light-toggle dark-toggle" : "dark-light-toggle light"}
                isPressed={isChecked}
                onChange={() => setIsChecked(!isChecked)}
            >
                <Icon
                    height={"30px"}
                    width={"40px"}
                    ariaLabel="Sun"
                    viewBox={{ minX: 0,
                        minY: 0,
                        width: 64,
                        height: 64 }}
                    paths={[
                        {
                            d: 'M36.4 20.4a16 16 0 1 0 16 16 16 16 0 0 0-16-16zm0 28a12 12 0 0 1-10.3-5.8l2.5.3A13.7 13.7 0 0 0 42 25.8a12 12 0 0 1-5.6 22.6z',
                            stroke: '#202020',
                        },
                        {
                            d: 'M36.4 16.4a2 2 0 0 0 2-2v-8a2 2 0 1 0-4 0v8a2 2 0 0 0 2 2zm-20 20a2 2 0 0 0-2-2h-8a2 2 0 0 0 0 4h8a2 2 0 0 0 2-2zm3-14.1a2 2 0 0 0 2.8-2.8l-5.7-5.7a2 2 0 0 0-2.8 2.8zM59 13.8a2 2 0 0 0-2.8 0l-5.7 5.7a2 2 0 1 0 2.8 2.8l5.7-5.7a2 2 0 0 0 0-2.8zM19.4 50.5l-5.7 5.7a2 2 0 1 0 2.9 2.8l5.7-5.7a2 2 0 1 0-2.8-2.8z',
                            stroke: '#202020',
                        },
                    ]}
                />
            </ToggleButton>*/}
                    </View>
                </View>
                <View className={"logo"}>EscapeOut.Games</View>
                </>
             )}
            </View>
        </MyGameContext.Provider>
    )
}
