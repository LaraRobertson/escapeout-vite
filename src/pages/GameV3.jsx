import React, {useEffect, useState} from "react"
import {
    Button,
    View,
    Image,
    TextAreaField,
    TextField,
    Flex,
    Heading,
    Radio,
    RadioGroupField,
    Icon,
    ToggleButton,
    ToggleButtonGroup,
    Accordion,
    Link
} from '@aws-amplify/ui-react';
import { useNavigate } from "react-router-dom";
import DOMPurify from "dompurify";
import {createPortal} from "react-dom";
import Modal from "react-modal";
import {generateClient} from "aws-amplify/api";
import { format } from 'date-fns'
import {
    setGameNotesFunction,
    goHomeQuit,
    removeLocalStorage,
    keyID
} from "../components/helper";
import {shallowEqual} from "../components/ShallowEqual";
import {NotesOpen, Modal2, Modal3} from "../components/sharedComponents";
import { ReactModal, ModalClue, ModalPuzzle } from "../components/Modals";
import {gameScoreByGameStatsID, getGame} from "../graphql/queries";
import * as mutations from "../graphql/mutations";
import GameClue from "../components/game/GameClue";
import {GamePuzzle, ModalPuzzleContent} from "../components/game/GamePuzzle";

import puzzleIconClosed from "../assets/noun-locker-6097531.svg";
import puzzleIconOpen from "../assets/noun-locker-6097523.svg";
import zoneIcon from "../assets/noun-zone-3097481-FFFFFF.svg";
import {MyGameContext} from "../MyContext";

export function GameV3() {
    const client = generateClient();
    /* dark / light */
    const [isChecked, setIsChecked] = useState(true);
    /* comments */
    const [exclusiveValue1, setExclusiveValue1] = useState('');
    const [exclusiveValue2, setExclusiveValue2] = useState('');
    const [exclusiveValue3, setExclusiveValue3] = useState('');
    const [exclusiveValue4, setExclusiveValue4] = useState('');
    const [exclusiveValue5, setExclusiveValue5] = useState('');

    const [game, setGame] = useState([]);
    const [gameHint, setGameHint] = useState([]);
    const [gameHintVisible, setGameHintVisible] = useState({});
    const [playZone, setPlayZone] = useState([]);
    const [zoneVisible, setZoneVisible] = useState("");
    const [zoneName, setZoneName] = useState("");
    const [clues, setClues] = useState("");
    const [gamePuzzleImageOpen, setGamePuzzleImageOpen] = useState({});
    const [gamePuzzleVisible, setGamePuzzleVisible] = useState({});
    const [gamePuzzleClueVisible, setGamePuzzleClueVisible] = useState({});
    const [gameClues, setGameClues] = useState([]);
    const [gamePuzzles, setGamePuzzles] = useState([]);
    /* guesses and answers */
    const [gamePuzzleGuess, setGamePuzzleGuess] = useState({});
    const [gamePuzzleAnswer, setGamePuzzleAnswer] = useState({});
    const [gamePuzzleAnswerCorrect, setGamePuzzleAnswerCorrect] = useState({});
    const [gamePuzzleSolved, setGamePuzzleSolved] = useState({});
    const [toolVisible, setToolVisible] = useState({});
    const [backpackObject, setBackpackObject] = useState({});
    const [isGoHomeQuitVisible, setIsGoHomeQuitVisible] = useState(false);
    /* new above */
    const [isAlertVisible, setIsAlertVisible] = useState(false);
    const [isWinnerScreenVisible, setIsWinnerScreenVisible] = useState(false);
    const [isCommentScreenVisible, setIsCommentScreenVisible] = useState(false);
    const [alertText, setAlertText] = useState('');
    const [showComment, setShowComment] = useState(false);
    const [areNotesVisible, setAreNotesVisible] = useState(true);
    const [isHelpVisible, setIsHelpVisible] = useState(false);
    const [gameNotes,setGameNotes] = useState('');
    const [isMapVisible, setIsMapVisible] = useState(false);
    const [gameComments,setGameComments] = useState({});
    const [isBackpackVisible, setIsBackpackVisible] = useState(false);
    const [gameTime, setGameTime] = useState(0);
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
        console.log ("localStorage.getItem('gameTime'): " + localStorage.getItem('gameTime'));
        console.log ("gameTime: " + gameTime);

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
                /* check for all puzzles solved, need to do wingame? */
                setGamePuzzleSolved(JSON.parse(localStorage.getItem("gamePuzzleSolved")));
            }
            if (localStorage.getItem("gamePuzzleGuess")!=null) {
                /* check for all puzzles solved, need to do wingame? */
                setGamePuzzleGuess(JSON.parse(localStorage.getItem("gamePuzzleGuess")));
            }
            /* if there */
            if (localStorage.getItem("backpackObject")!=null) {
                setBackpackObject(JSON.parse(localStorage.getItem("backpackObject")));
            }
            /* get game details */
            try {
                const apiData = await client.graphql({
                    query: getGame,
                    variables: {id: localStorage.getItem("gameID")}
                });
                const gamesFromAPI = apiData.data.getGame;
                setGame(gamesFromAPI);
                console.log("getGameDetails resuming: " + gamesFromAPI.gameName);
                /* already playing - need to make this a function... */
                //should probably set everything in localstorage...
                //encrypt answers?
                /* set up Play Zones: */
                if (gamesFromAPI.gamePlayZone.items.length > 0) {
                    let gameZoneArray = gamesFromAPI.gamePlayZone.items.sort((a, b) => {
                        return a.order - b.order;
                    });
                    setPlayZone(gameZoneArray);
                    setZoneVisibleFunction(gameZoneArray[0].id, gameZoneArray[0].gameZoneName);
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
                    console.log("gameClueArray: " + gameClueArray);
                }
                /* set up game Puzzle: */
                console.log("gamePuzzle.length: "  + gamesFromAPI.gamePuzzle.items.length);
                if (gamesFromAPI.gamePuzzle.items.length > 0) {
                    console.log("setGamePuzzles: " + JSON.stringify(gamesFromAPI.gamePuzzle.items));
                    /* filter by position */
                    let gamePuzzleArray = gamesFromAPI.gamePuzzle.items.sort((a, b) => {
                            return a.order - b.order;
                        });
                    setGamePuzzles(gamePuzzleArray);

                }
            } catch (err) {
                console.log('error fetching getGame', err);
            }
            /* end check */
        } else {
            console.log("loading game: get GameID: " + localStorage.getItem("gameID"));
            console.log("loading game: get GameStatsID: " + localStorage.getItem("gameStatsID"));
            /* why need numberoftimes here?*/
            //setNumberOfTimes(localStorage.getItem("numberOfTimes"));
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
                localStorage.setItem("gameScoreID",gamesScoreID.id);
            } catch (err) {
                console.log('error createGameScore..', err)
            }
            setGameID(localStorage.getItem("gameID"));
            setGameStatsID(localStorage.getItem("gameStatsID"));
            setGameScoreID(localStorage.getItem("gameScoreID"));
            let startDate = new Date();
            setRealTimeStart(startDate);
            localStorage.setItem("realTimeStart",startDate);
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
                    console.log("setGamePuzzles: " + JSON.stringify(gamesFromAPI.gamePuzzle.items));
                    /* filter by position */
                    let gamePuzzleArray = gamesFromAPI.gamePuzzle.items.sort((a, b) => {
                            return a.order - b.order;
                        });
                    setGamePuzzles(gamePuzzleArray);
                    console.log("gamesFromAPI.gamePuzzle.items[0].id: " + gamesFromAPI.gamePuzzle.items[0].id);
                    let gamePuzzleSolveID = gamesFromAPI.gamePuzzle.items[0].id;
                    setGamePuzzleSolved({...gamePuzzleSolved, [gamePuzzleSolveID]:false});
                    //console.log("gamesFromAPI.gameClue.items.length: " + gamesFromAPI.gameClue.items.length);
                }

            } catch (err) {
                console.log('error fetching getGame', err);
            }
        }
    }

    function setGameHintVisibleFunction(key, value) {
        console.log("setGameHintVisibleFunction: " + key);
        if (key) {
            setGameHintVisible({...gameHintVisible, [key]: value})
        }
    }

    useEffect(() => {
        console.log("***useEffect***: setGamePlayFunction (only on mount)");
        /* set local storage for gameStop - only on mount - to recover from refresh */
        setGamePlayFunction();
    }, []);

    useEffect(() => {
        let gamePuzzleSolvedTest = JSON.stringify(gamePuzzleSolved);
        console.log("***useEffect***:gamePuzzleSolved: " + gamePuzzleSolvedTest);
        if (gamePuzzleSolvedTest != "{}" &&  gamePuzzleSolvedTest != "" &&  gamePuzzleSolvedTest != null) {
            localStorage.setItem("gamePuzzleSolved", gamePuzzleSolvedTest);
        }
    }, [gamePuzzleSolved]);

    useEffect(() => {
        let gamePuzzleGuessTest = JSON.stringify(gamePuzzleGuess);
        console.log("***useEffect***:gamePuzzleGuess: " + gamePuzzleGuessTest);
        if (gamePuzzleGuessTest != "{}" &&  gamePuzzleGuessTest != "" &&  gamePuzzleGuessTest != null) {
            localStorage.setItem("gamePuzzleGuess", gamePuzzleGuessTest);
        }
    }, [gamePuzzleGuess]);

    useEffect(() => {
        let gameHintVisibleTest = JSON.stringify(gameHintVisible);
        console.log("***useEffect***:gameHintVisible: " + gameHintVisibleTest);
        if (gameHintVisibleTest != "{}" &&  gameHintVisibleTest != "" &&  gameHintVisibleTest != null) {
            localStorage.setItem("gameHintVisible", gameHintVisibleTest);
        }
        /* add 5 minutes */
        /* check for true to calculate gameTimeHint */
        let hintTime = 0;
        for (const key in gameHintVisible) {
            console.log(`${key}: ${gameHintVisible[key]}`);
            if (gameHintVisible[key] === true) {
                hintTime = hintTime + 5;
            }
        }
        setGameTimeHint(hintTime);
    }, [gameHintVisible]);

    /* always scroll to top */
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    function setCluesFunction(clue) {
        setAlertText("clue added to notes");
        setIsAlertVisible(true);
        console.log("clue: " + clue);
        setTimeout(() => {
            setIsAlertVisible(false);
        }, 3000);
        setClues(clues + clue);
        localStorage.setItem("clues",clues + clue);
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
    function setGameClueVisibleFunction(key, value) {
        console.log("setGameClueVisibleFunction: " + key);
        if (key) {
            setGameClueVisible({...gameClueVisible, [key]: value})
        }
    }
    function setGamePuzzleVisibleFunction(key, value) {
        console.log("setGamePuzzleVisibleFunction: " + key);
        if (key) {
            setGamePuzzleVisible({...gamePuzzleVisible, [key]: value})
        }
    }
    function setGamePuzzleClueVisibleFunction(key, value) {
        console.log("setGamePuzzleClueVisibleFunction: " + key);
        if (key) {
            setGamePuzzleClueVisible({...gamePuzzleClueVisible, [key]: value})
        }
    }
    function setGamePuzzleImageOpenFunction(key, value) {
        console.log("setGamePuzzleImageOpenFunction: " + key);
        if (key) {
            setGamePuzzleImageOpen({...gamePuzzleImageOpen, [key]: value})
        }
    }

    async function updateGameScoreFunction() {
        console.log("updateGameScore:  " + gameTimeHint);
        let startDate = new Date(realTimeStart);
        // Do your operations to calculate time
        let endDate   = new Date();
        localStorage.setItem("realTimeEnd",endDate);
        let minutes = (endDate.getTime() - startDate.getTime()) / 60000;
        let GameTimeTotal = Number(minutes + gameTimeHint).toFixed(2);
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
            removeLocalStorage();
            setTimeout(() => {
                setIsWinnerScreenVisible(true);
            }, 1000);
            setTimeout(() => {
                //goHomeQuit(navigate);
            }, 15000);
            console.log("winGameFunction");
            console.log("gameTime = seconds: " + seconds);
        } catch (err) {
            console.log('error updating gamescore:', err);
        }
    }

    function setGameCommentsFunction(key, value) {
        setGameComments({...gameComments, [key]: value})
    }
    async function updateGameScoreCommentsFunction(comment) {
        removeLocalStorage();
        try {
            const data = {
                id: gameScoreID,
                gameComments: JSON.stringify(gameComments)
            };
            await client.graphql({
                query: mutations.updateGameScore,
                variables: {
                    input: data
                }
            })
            console.log("update comments");
            localStorage.removeItem("gameScoreID");
            if (comment) {
                setIsAlertVisible(true);
                setAlertText('Thank you for your comment');
                setTimeout(() => {
                    setIsAlertVisible(false);
                    navigate('/');
                }, 2000);
            } else {
                navigate('/');
            }

        } catch (err) {
            console.log('error updating gamescore:', err);
        }
    }

    const backgroundImage = (src) => (
        "url("+ src + ")");

    const divStyle = (src) => ({
        background:  "url(" + src + ") 0 0 / contain no-repeat"
    });


    const [isModalClueOpen, setIsModalClueOpen] = useState(false);
    const [isModalPuzzleOpen, setIsModalPuzzleOpen] = useState(false);
    const [isModalHelpOpen, setIsModalHelpOpen] = useState(false);
    const [isModalHintOpen, setIsModalHintOpen] = useState(false);

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

    const [puzzleID, setPuzzleID] = useState("");
    const [puzzleWinGame, setPuzzleWinGame] = useState(false);
    const [puzzleTextFields, setPuzzleTextFields] = useState([]);
    const ToggleClue = () => setIsModalClueOpen(!isModalClueOpen);
    const TogglePuzzle = () => setIsModalPuzzleOpen(!isModalPuzzleOpen);

    function closeModalPuzzle() {
        setIsModalPuzzleOpen(false);
    }
    function closeModalHelp() {
        setIsModalHelpOpen(false);
    }
    function closeModalHint() {
        setIsModalHintOpen(false);
    }

    function goToPuzzleDetail(puzzleDetails) {
        /* set states */
        console.log("goToPuzzle: ");
        setPuzzleTextFields(puzzleDetails.textField);
        setPuzzleID(puzzleDetails.puzzleID);
        setPuzzleWinGame(puzzleDetails.winGame);
        setIsModalPuzzleOpen(true);
    }

    function goToPuzzleClue(puzzleDetails) {
        /* set states */
        console.log("goToPuzzle: ");
        setPuzzleTextFields(puzzleDetails.textField);
        setPuzzleID(puzzleDetails.puzzleID);
        setPuzzleWinGame(puzzleDetails.winGame);
        setIsModalPuzzleOpen(true);
    }

    Modal.setAppElement('#modal');

    function DangerouslySetInnerHTMLSanitized(htmlContent) {
        const sanitizedHtmlContent = DOMPurify.sanitize(htmlContent);
        return (sanitizedHtmlContent)
    }

    /* Modal Clue Content */
    const [modalClueContent, setModalClueContent] = useState({show:false, content:""});
    /* Modal Puzzle Content */
    const [modalPuzzleContent, setModalPuzzleContent] = useState({show:false, content:""});

    return (
        <MyGameContext.Provider value={{ isChecked, setGamePuzzleGuess, setGamePuzzleAnswer, setGamePuzzleAnswerCorrect, setGamePuzzleSolved, gamePuzzles, setModalPuzzleContent, setClueDetails, setModalClueContent }}>
        <View position="relative">
            <View className={isChecked? "game-container dark" : "game-container light"}>
                <View className="top-bar top-bar-change">
                    <Flex className="zone-holder zone-holder-change"
                          direction="row"
                          justifyContent="center"
                          alignItems="center"
                          alignContent="center"
                          wrap="nowrap"
                          gap="1rem">
                            {playZone.map((zone,index) => (
                                <View className={(zoneVisible==zone.id)? "zone-border zone-icon-container" : "zone-icon-container"} key={zone.id} ariaLabel={zone.id}  onClick={() => setZoneVisibleFunction(zone.id, zone.gameZoneName)}>
                                    <Image height="40px" width="40px" src={zoneIcon} alt="zone icon" />
                                    <View className={"zone-text"}>zone {index+1}</View>
                                </View>
                            ))}
                    </Flex>
                </View>
                <View className="play-area play-area-change">
                    <View className="image-mask image-mask-change"></View>
                    {playZone.map((zone,index) => (
                       <View aria-label={keyID(zone.id,"zone")} key={keyID(zone.id,"zone")} className={(zoneVisible==zone.id)? "image-holder image-holder-change show" : "hide"} backgroundImage={backgroundImage(zone.gameZoneImage)}>
                       </View>
                    ))}
                    <View className={"game-container-top"}>
                       {zoneName}
                    </View>
                   <View className={"clue-sidebar"}>
                   {gameClues.map((clue,index) => (
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
                           <View dangerouslySetInnerHTML={ {__html: DangerouslySetInnerHTMLSanitized(clueDetails.gameClueText)}} paddingTop="10px"></View>
                           {(clueDetails.gameClueImage != "" && clueDetails.gameClueImage != null) && <Image src={clueDetails.gameClueImage} />}
                   </ModalClue>
                   <View className={"puzzle-sidebar"}>
                       {gamePuzzles.map((puzzle,index) => (
                           <GamePuzzle puzzle={puzzle}
                                     zoneVisible={zoneVisible}
                                     index={index}
                                     setModalPuzzleContent={setModalPuzzleContent}
                                     setPuzzleDetails={setPuzzleDetails}
                                     gamePuzzleSolved={gamePuzzleSolved}
                                     key={puzzle.id}/>
                       ))}
                   </View>
                   <ModalPuzzle
                        modalPuzzleContent={modalPuzzleContent}
                        setModalPuzzleContent={setModalPuzzleContent}>
                        <ModalPuzzleContent
                            puzzleDetails={puzzleDetails}
                            gamePuzzleGuess={gamePuzzleGuess}
                            gamePuzzleSolved={gamePuzzleSolved}
                            gamePuzzleAnswer={gamePuzzleAnswer}
                            gamePuzzleAnswerCorrect={gamePuzzleAnswerCorrect}


                            />
                    </ModalPuzzle>
                   <View className="right-side"></View>
                   <View className="game-container-bottom"></View>
                </View>
                {/* end play area */}
                <View className={"notes-area"}>
                    <View ariaLabel="Time" className="time time-change">
                        <View className="small">hint time: {gameTimeHint} mins | time started: {realTimeStart ? format(realTimeStart, "MM/dd/yy h:mma") : null}

                            {/* | <ToggleButton
                                className={isChecked? "dark-light-toggle dark-toggle" : "dark-light-toggle light"}
                                isPressed={isChecked}
                                onChange={() => setIsChecked(!isChecked)}
                            >
                            <Icon
                                    height={"25px"}
                                    width={"25px"}
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
                    <View className={isWinnerScreenVisible? "cover-screen show-gradual" : "cover-screen hide"}>
                        <View className="all-screen dark">
                            <View className="black-box">
                                <strong>WINNER!</strong>
                                <View marginBottom={"10px"}>{game.gameWinMessage}</View>
                                <Image height="100px" src={game.gameWinImage} />
                                <View color="white">Total Time: {gameTimeTotal} minutes</View>
                                <View color="white">Hint Time: {gameTimeHint} minutes </View>

    <hr />
                                <Flex   direction="column"
                                        justifyContent="flex-start"
                                        alignItems="center"
                                        alignContent="flex-start"
                                        wrap="nowrap"
                                        gap=".4em" marginBottom={"10px"} className={"flex-container"}>

                                    <Heading level={"6"} className={"heading"} paddingTop="5px" paddingBottom={"5px"}>Did you like Game?</Heading>
                                    <ToggleButtonGroup
                                        value={exclusiveValue1}
                                        onChange={(value) => {setGameCommentsFunction("like",value);setExclusiveValue1(value)}}
                                        isExclusive
                                        id={"1"}
                                    >
                                        <ToggleButton value="yes">
                                            Yes
                                        </ToggleButton>
                                        <ToggleButton value="no">
                                           No
                                        </ToggleButton>
                                        <ToggleButton value="a little">
                                            a little
                                        </ToggleButton>
                                    </ToggleButtonGroup>


                                    <Heading level={"6"} className={"heading"} paddingTop="5px" paddingBottom={"5px"}>Was it Fun?</Heading>
                                    <ToggleButtonGroup
                                        value={exclusiveValue2}
                                        onChange={(value) => {setGameCommentsFunction("fun",value);setExclusiveValue2(value)}}
                                        isExclusive
                                        id={"1"}
                                    >
                                        <ToggleButton value="it was fun">
                                           it was fun
                                        </ToggleButton>
                                        <ToggleButton value="not fun">
                                            not fun
                                        </ToggleButton>
                                        <ToggleButton value="a little">
                                          a little
                                        </ToggleButton>
                                    </ToggleButtonGroup>


                                    <Heading level={"6"} className={"heading"} paddingTop="5px" paddingBottom={"5px"}>Was it Hard?</Heading>
                                    <ToggleButtonGroup
                                        value={exclusiveValue3}
                                        onChange={(value) => {setGameCommentsFunction("Hard",value);setExclusiveValue3(value)}}
                                        isExclusive
                                        id={"2"}
                                    >
                                        <ToggleButton value="too hard">
                                            too hard
                                        </ToggleButton>
                                        <ToggleButton value="just right">
                                            just right
                                        </ToggleButton>
                                        <ToggleButton value="too easy">
                                           too easy
                                        </ToggleButton>
                                    </ToggleButtonGroup>

                                    <Heading level={"6"} className={"heading"} paddingTop="5px" paddingBottom={"5px"}>Would you play another?</Heading>
                                    <ToggleButtonGroup
                                        value={exclusiveValue4}
                                        onChange={(value) => {setGameCommentsFunction("another",value);setExclusiveValue4(value)}}
                                        isExclusive
                                        id={"2"}
                                    >
                                        <ToggleButton value="too hard">
                                           YES!
                                        </ToggleButton>
                                        <ToggleButton value="just right">
                                           never
                                        </ToggleButton>
                                        <ToggleButton value="too easy">
                                            maybe
                                        </ToggleButton>
                                    </ToggleButtonGroup>
                                    <Heading level={"6"} className={"heading"} paddingTop="5px" paddingBottom={"5px"}>Can I contact you for more feedback?</Heading>

                                    <ToggleButtonGroup
                                        value={exclusiveValue5}
                                        onChange={(value) => {setGameCommentsFunction("contact-you",value);setExclusiveValue5(value)}}
                                        isExclusive
                                        id={"2"}
                                    >
                                        <ToggleButton value="Yes!">
                                            YES!
                                        </ToggleButton>
                                        <ToggleButton value="never">
                                            never
                                        </ToggleButton>

                                    </ToggleButtonGroup>

                                    {/*<RadioGroupField className="comments" legend="Did You Like Game?" name="likeGame" onChange={(e) => setGameCommentsFunction("likeGame",e.currentTarget.value)}>
                                        <Radio value="Yes">Yes</Radio>
                                        <Radio value="No">No</Radio>
                                        <Radio value="a little">a little</Radio>
                                    </RadioGroupField>
                                    <RadioGroupField legend="Would you play another?" name="playAnother"  onChange={(e) => setGameCommentsFunction("playAnother",e.currentTarget.value)}>
                                        <Radio value="Yes">Yes</Radio>
                                        <Radio value="No">No</Radio>
                                        <Radio value="Maybe">Maybe</Radio>
                                    </RadioGroupField>
                                </Flex>
                                <Flex   direction="row"
                                        justifyContent="flex-start"
                                        alignItems="stretch"
                                        alignContent="flex-start"
                                        wrap="nowrap"
                                        gap="1rem" marginBottom={"10px"} className={"flex-container"}>
                                    <RadioGroupField className="custom-radio" legend="Was it Too Hard?" name="tooHard" onChange={(e) => setGameCommentsFunction("tooHard",e.currentTarget.value)}>
                                        <Radio value="Yes">Yes</Radio>
                                        <Radio value="No">No</Radio>
                                        <Radio value="a little">a little</Radio>
                                    </RadioGroupField>
                                    <RadioGroupField legend="Was it Fun?" name="fun"  onChange={(e) => setGameCommentsFunction("fun",e.currentTarget.value)}>
                                        <Radio value="Yes">Yes</Radio>
                                        <Radio value="No">No</Radio>
                                        <Radio value="Maybe">Maybe</Radio>
                                    </RadioGroupField>*/}

                                <TextAreaField
                                    rows="2"
                                    onChange={(e) => setGameCommentsFunction("textAreaField",e.currentTarget.value)}
                                    descriptiveText="Any Issues or Problems?  Suggestions for improvement?"
                                />
                                </Flex>
                                <Flex marginTop={"20px"} justifyContent="center" gap="1rem">
                                    <Button className="button small" onClick={() => updateGameScoreCommentsFunction(true)}>Submit Comment</Button>
                                    <Button className="button right-button small" onClick={() => updateGameScoreCommentsFunction(false)}>Back To Game List</Button>
                                </Flex>
                                {/*<Button className="button right-button small" onClick={() => setIsCommentScreenVisible(true)}>Back To Game List</Button>*/}

                            </View>

                        </View>
                    </View>
                    <View className={isCommentScreenVisible? "cover-screen show-gradual" : "cover-screen hide"}>
                        <View className={isChecked? "all-screen " : "all-screen light-dark"}>
                            <Heading level={"4"} className={"heading light"} paddingTop="10px" paddingBottom={"10px"}>Comments</Heading>

                            <Flex   direction="row"
                                    justifyContent="flex-start"
                                    alignItems="stretch"
                                    alignContent="flex-start"
                                    wrap="nowrap"
                                    gap="1rem" marginBottom={"10px"} className={"flex-container"}>
                                <RadioGroupField legend="Did You Like Game?" name="likeGame" onChange={(e) => setGameCommentsFunction("likeGame",e.currentTarget.value)}>
                                    <Radio value="Yes">Yes</Radio>
                                    <Radio value="No">No</Radio>
                                    <Radio value="a little">a little</Radio>
                                </RadioGroupField>
                                <RadioGroupField legend="Would you play another?" name="playAnother"  onChange={(e) => setGameCommentsFunction("playAnother",e.currentTarget.value)}>
                                    <Radio value="Yes">Yes</Radio>
                                    <Radio value="No">No</Radio>
                                    <Radio value="Maybe">Maybe</Radio>
                                </RadioGroupField>
                            </Flex>
                                <Flex   direction="row"
                                        justifyContent="flex-start"
                                        alignItems="stretch"
                                        alignContent="flex-start"
                                        wrap="nowrap"
                                        gap="1rem" marginBottom={"10px"} className={"flex-container"}>
                                <RadioGroupField legend="Was it Too Hard?" name="tooHard" onChange={(e) => setGameCommentsFunction("tooHard",e.currentTarget.value)}>
                                    <Radio value="Yes">Yes</Radio>
                                    <Radio value="No">No</Radio>
                                    <Radio value="a little">a little</Radio>
                                </RadioGroupField>
                                <RadioGroupField legend="Was it Fun?" name="fun"  onChange={(e) => setGameCommentsFunction("fun",e.currentTarget.value)}>
                                    <Radio value="Yes">Yes</Radio>
                                    <Radio value="No">No</Radio>
                                    <Radio value="Maybe">Maybe</Radio>
                                </RadioGroupField>
                            </Flex>
                            <TextAreaField
                                rows="6"
                                onChange={(e) => setGameCommentsFunction("textAreaField",e.currentTarget.value)}
                                descriptiveText="Any Issues or Problems?  Suggestions for improvement?"
                            />
                            <Flex className="window-button-bottom" justifyContent="center" gap="1rem">
                                <Button className="button small" onClick={() => updateGameScoreCommentsFunction(true)}>Submit Comment</Button>
                                <Button className="button right-button small" onClick={() => updateGameScoreCommentsFunction(false)}>Back To Game List</Button>
                            </Flex>
                        </View>
                    </View>
                    <NotesOpen clues={clues} setClues={setClues} gameNotes={gameNotes} setGameNotes={setGameNotes} setGameNotesFunction={setGameNotesFunction} isChecked={isChecked} setAreNotesVisible={setAreNotesVisible}/>
                </View>
            </View> {/* end game-container */}


                {/* Modals - use state to show different content or different modals?
                 Help Modal and Hint Modal are similar*/}
                {createPortal(<Modal
                        closeTimeoutMS={200}
                        isOpen={isModalHelpOpen}
                        onRequestClose={closeModalHelp}
                        className={"modalContent"}
                        contentLabel={"Example Modal"}
                        overlayClassName={"slide-from-bottom"}
                        parentSelector={() => document.querySelector('#modal')}
                        preventScroll={
                            false
                            /* Boolean indicating if the modal should use the preventScroll flag when
                               restoring focus to the element that had focus prior to its display. */}
                    >
                        <Button className="close-button light"
                                onClick={closeModalHelp}>X</Button>


                        <Heading level={4} marginBottom="10px">How To Play</Heading>
                        <Accordion.Container allowMultiple defaultValue={['levels']}>
                            <Accordion.Item value="how-to-play">
                                <Accordion.Trigger>
                                    <strong>How to Play?</strong>
                                    <Accordion.Icon/>
                                </Accordion.Trigger>
                                <Accordion.Content>
                                    <View>
                                        <ol className={"how-to-play-bullets"}>
                                            <li>Sign in or create an account with your smartphone:<br/>
                                                <View className="small italics">Currently you can sign in with
                                                    email/password. It's probably best to set an easy password,
                                                    there will be no sensitive data to steal here or you can use
                                                    your google account to sign in.
                                                </View>
                                            </li>
                                            <li>Go To Location.</li>
                                            <li>Select game.</li>
                                            <li>Hit Play, agree to waiver, and select a team name to use as your
                                                team name.
                                            </li>
                                            <li>Start game and solve the puzzles.</li>
                                            <li>The BACK BUTTON is not needed - please do not use.</li>
                                        </ol>
                                    </View>
                                </Accordion.Content>
                            </Accordion.Item>
                            <Accordion.Item value="levels">
                                <Accordion.Trigger>
                                    <strong>Hints</strong>
                                    <Accordion.Icon/>
                                </Accordion.Trigger>
                                <Accordion.Content>
                                    <View>
                                        <View paddingBottom="10px">
                                            <strong>Hints:</strong> Clicking on a Hint Below adds <span
                                            className="italics"> 5 Minutes!</span> Use Hints if you really need them.
                                        </View>
                                        {/* HINTS */}
                                        <hr />
                                        {gameHint.map((hint,index) => (
                                            <Flex wrap="wrap" key={hint.id} ariaLabel={hint.id}>
                                                <View>
                                                    {gameHintVisible["hint" + (hint.id)]? (
                                                        <View backgroundColor={"lightgray"} color={"black"} marginTop={"10px"} padding={"0 5px"}><strong>{hint.gameHintName} - used</strong></View>
                                                    ) : (
                                                        <Button className={"button small"} marginTop={"10px"} onClick={() => setGameHintVisibleFunction(["hint" + (hint.id)], true)}>{hint.gameHintName} - adds 5 minutes</Button>
                                                    )
                                                    }

                                                    <View dangerouslySetInnerHTML={ {__html: DangerouslySetInnerHTMLSanitized(hint.gameHintDescription)}} backgroundColor={"lightgray"}  color={"black"}  padding={"0 10px"} className={gameHintVisible["hint" + (hint.id)]? "show" : "hide"}>
                                                    </View>
                                                </View>
                                            </Flex>
                                        ))}
                                    </View>
                                </Accordion.Content>
                            </Accordion.Item>
                            <Accordion.Item value="About-Games">
                                <Accordion.Trigger>
                                    <strong>About Games</strong>
                                    <Accordion.Icon/>
                                </Accordion.Trigger>
                                <Accordion.Content>
                                    <ul className={"how-to-play-bullets"}>
                                        <li>Our games are played on location with your smartphone.</li>
                                        <li>Gameplay has elements of geocaching, scavenger hunts, and even
                                            escape room style puzzles that involve logic, finding patterns,
                                            deciphering codes, and more.
                                        </li>
                                        <li>Gameplay is limited to a certain walkable area like a public park or
                                            business and surrounding area.
                                        </li>
                                        <li>All information needed to solve puzzles in game are located within
                                            that area except for basic knowledge like reading comprehension and
                                            some math and navigation skills.
                                        </li>
                                        <li>Once you start playing your time starts - time ends when you
                                            complete the game. Your time is your score.
                                        </li>

                                        <li>View the leaderboard on individual game to see best times.</li>
                                    </ul>
                                </Accordion.Content>
                            </Accordion.Item>
                            <Accordion.Item value="group-play">
                                <Accordion.Trigger>
                                    <strong>Group Play vs Individual Play</strong>
                                    <Accordion.Icon/>
                                </Accordion.Trigger>
                                <Accordion.Content>
                                    <View>
                                        Play can be group or individual -
                                        <ul className={"how-to-play-bullets"}>
                                            <li>For individual play, sign in and select a team name that
                                                reflects your individuality.
                                            </li>
                                            <li>For group play, one person signs in and selects the team name
                                                and hits play - the official timed game starts.
                                                The other players can use the same sign in and select the same
                                                game (and it doesn't matter what team name you select - probably
                                                best to choose the same one) because
                                                the only official score is the first time a single sign in (by
                                                email) plays a game.
                                            </li>
                                            <li>That 2nd or 3rd attempt with with same credentials can play a
                                                game multiple times but it does not go on the leaderboard.
                                            </li>
                                            <li>If a group wants to do team play it is best to choose an email
                                                that can be easily verified and an easy password
                                            </li>

                                        </ul>
                                    </View>
                                </Accordion.Content>
                            </Accordion.Item>
                            <Accordion.Item value="play-zones">
                                <Accordion.Trigger>
                                    <strong>What are Play Zones?</strong>
                                    <Accordion.Icon/>
                                </Accordion.Trigger>
                                <Accordion.Content>
                                    <View>
                                        <ul className={"how-to-play-bullets"}>
                                            <li>Play zones indicate the area that the clue references.</li>
                                            <li>Most clues can be solved within a few hundred feet of the play
                                                zone image.
                                            </li>
                                        </ul>
                                    </View>
                                </Accordion.Content>
                            </Accordion.Item>
                            <Accordion.Item value="about-escapeoutgames">
                                <Accordion.Trigger>
                                    <strong>About EscapeOut.Games</strong>
                                    <Accordion.Icon/>
                                </Accordion.Trigger>
                                <Accordion.Content>
                                    <View>

                                        <ul className={"how-to-play-bullets"}>
                                            <li>EscapeOut.Games used to run the Escape Room on Tybee:<br/>
                                                <Link href={"https://escapetybee.com/"} isExternal={true}>Escape
                                                    Tybee</Link> <br/>
                                                - where friends and families had good experiences solving
                                                puzzles together.
                                            </li>
                                            <li>Due to Covid and other factors Escape Tybee closed, but the joy
                                                in creating fun experiences is still a goal so
                                                EscapeOut.games was started.
                                            </li>
                                            <li>EscapeOut.Game's Mission: Getting friends and families outdoors
                                                and having fun experiences solving puzzles together.<br/>
                                                <strong> Any and all feedback is appreciated so this goal can be
                                                    realized.</strong></li>
                                            <li>More information at: <br/>
                                                <Link href={"https://escapeout.games/"}>EscapeOut.games</Link>
                                            </li>
                                        </ul>
                                    </View>
                                </Accordion.Content>
                            </Accordion.Item>
                        </Accordion.Container>
                        <View paddingTop="10px" textAlign={"center"} width={"100%"}>
                            <Button className="close light" onClick={closeModalHelp}>close</Button>
                        </View>
                    </Modal>,
                    document.getElementById("modal")
                )}
                {createPortal(<Modal
                        closeTimeoutMS={200}
                        isOpen={isModalHintOpen}
                        onRequestClose={closeModalHint}
                        className={"modalContent"}
                        contentLabel={"Example Modal"}
                        overlayClassName={"slide-from-bottom"}
                        parentSelector={() => document.querySelector('#modal')}
                        preventScroll={
                            false
                            /* Boolean indicating if the modal should use the preventScroll flag when
                               restoring focus to the element that had focus prior to its display. */}
                    >
                        <Button className="close-button light"
                                onClick={closeModalHint}>X</Button>


                        <Heading level={4} marginBottom="10px">Hints</Heading>

                        <strong>Hints</strong>

                        <View>
                            <View paddingBottom="10px">
                                <strong>Hints:</strong> Clicking on a Hint Below adds <span
                                className="italics"> 5 Minutes!</span> Use Hints if you really need them.
                            </View>
                            {/* HINTS */}
                            <hr />
                            {gameHint.map((hint,index) => (
                                <Flex wrap="wrap" key={hint.id} ariaLabel={hint.id}>
                                    <View>
                                        {gameHintVisible["hint" + (hint.id)]? (
                                            <View backgroundColor={"lightgray"} color={"black"} marginTop={"10px"} padding={"0 5px"}><strong>{hint.gameHintName} - used</strong></View>
                                        ) : (
                                            <Button className={"button small"} marginTop={"10px"} onClick={() => setGameHintVisibleFunction(["hint" + (hint.id)], true)}>{hint.gameHintName} - adds 5 minutes</Button>
                                        )
                                        }

                                        <View dangerouslySetInnerHTML={ {__html: DangerouslySetInnerHTMLSanitized(hint.gameHintDescription)}} backgroundColor={"lightgray"}  color={"black"}  padding={"0 10px"} className={gameHintVisible["hint" + (hint.id)]? "show" : "hide"}>
                                        </View>
                                    </View>
                                </Flex>
                            ))}
                        </View>

                        <View paddingTop="10px" textAlign={"center"} width={"100%"}>
                            <Button className="close light" onClick={closeModalHint}>close</Button>
                        </View>
                    </Modal>,
                    document.getElementById("modal")
                )}

               <View className={isAlertVisible ? "alert-container show" : "hide"}>
                    <div className='alert-inner'>{alertText}</div>
               </View>
               <View className={isGoHomeQuitVisible ? "alert-container show" : "hide"}>
                    <div className='alert-inner'>Do You Really Want To Quit?<br />
                    <Button marginRight={"10px"} className="button button-small quit-button-alert " onClick={()=>{setIsGoHomeQuitVisible(false);goHomeQuit(navigate)}}>Yes, I Want Quit</Button>
                    <Button marginRight={"10px"} className="button button-small quit-button-alert" onClick={()=>{setIsGoHomeQuitVisible(false)}}>No, I Want to Play</Button>
                    </div>
               </View>

            <View className={"game-bottom-bar"}>

                    <View className={"logo"}>EscapeOut.Games</View>
                <Button  className="quit-button dark" onClick={() => isModalHintOpen? setIsModalHintOpen(false) : setIsModalHintOpen(true)}>Hints</Button>
                <Button  className={isChecked? "quit-button dark" : "help-button light"} onClick={() => isModalHelpOpen? setIsModalHelpOpen(false) : setIsModalHelpOpen(true)}>
                    Help
                </Button>
                        <Button className={isChecked? "quit-button dark " : "quit-button light "} onClick={()=>{setIsGoHomeQuitVisible(true)}}>Quit</Button>


            </View>
        </View>
        </MyGameContext.Provider>
    )
}
