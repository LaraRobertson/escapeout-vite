import {Button, Heading, View, TextField, Image, Accordion} from "@aws-amplify/ui-react";
import React, {useContext, useEffect, useState} from "react";
import { useNavigate } from "react-router-dom";
import {
    RegExpMatcher,
    englishDataset,
    englishRecommendedTransformers
} from "obscenity";
import {createGameScore, createGameStats} from "../../graphql/mutations";
import {gameStatsByGameID} from "../../graphql/queries";
import {MyAuthContext} from "../../MyContext";
import {generateClient} from "aws-amplify/api";
import GameDetail from "./GameDetail";
import Waiver from "./Waiver";
import ExampleGame from "./ExampleGame";
import ExampleGame2 from "./ExampleGame2";
import ExampleGame3 from "./ExampleGame3";
import ExampleGame4 from "./ExampleGame4";
import DOMPurify from "dompurify";
import {ModalGameIntro, ModalWaiver, ReactModalFromBottomMap, ModalExampleGame, ModalExampleGame2, ModalExampleGame3, ModalExampleGame4} from "../Modals";
import {Map} from "../game/Map";

export default function GameIntro(props) {
    let gameDetails=props.gameDetails;
    const client = generateClient();
    const navigate = useNavigate();
    const { authStatus, email, gamesIDUserPlayed, gamesIDUser, setModalContent, setGameDetails  } = useContext(MyAuthContext);
    /* Modal Content */
    const [modalContentGI, setModalContentGI] = useState({show:false, content:""});
    const [modalContentWaiver, setModalContentWaiver] = useState({show:false, content:""});
    const [modalContentEG, setModalContentEG] = useState({show:false, content:""});
    const [modalContentEG2, setModalContentEG2] = useState({show:false, content:""});
    const [modalContentEG3, setModalContentEG3] = useState({show:false, content:""});
    const [modalContentEG4, setModalContentEG4] = useState({show:false, content:""});
    const [modalContentMap, setModalContentMap] = useState({open:false, content:""});
    const [ isGameDetailOpen, setIsGameDetailOpen ] = useState(false);
    const [ isWaiverOpen, setIsWaiverOpen ] = useState(false);
    console.log('gameDetails.gameName: ' + gameDetails.gameName);
    /* error message if don"t provide team name */
    /* team name is required before play */
    const matcher = new RegExpMatcher({
        ...englishDataset.build(),
        ...englishRecommendedTransformers,
    }), [numberOfPlayersError, setNumberOfPlayersError] = useState(""), [teamName, setTeamName] = useState("");

    async function handlePlayGameIntro() {
        console.log("goToGame: " + gameDetails.gameName);
        /* check for team name */
        if ((teamName !== "" && gameDetails.waiverSigned === gameDetails.gameID)) {
            setNumberOfPlayersError("");
            let firstTime=false;
            /* if first time create gameStats */
            if (gameDetails.numberOfTimes === 0) {
                firstTime=true;
                console.log("add game stat: (gameID): " + gameDetails.gameID);
                const gameStatsValues = {
                    waiverSigned: true
                }
                const data = {
                    gameID: gameDetails.gameID,
                    userEmail: email,
                    gameName: gameDetails.gameName,
                    gameLocationCity: gameDetails.gameLocationCity,
                    gameStates: JSON.stringify(gameStatsValues),
                    type: "gameStats",
                    disabled: false
                };
                console.log("data for createGameStats: " + JSON.stringify(data));
                try {
                    await client.graphql({
                        query: createGameStats,
                        variables: {input: data},
                    });

                } catch (err) {
                    console.log("error createGameStats..", err)
                }
            }
            /* get gameStatsID */
            let filter = {
                userEmail: {
                    eq: email
                }
            };
            try {
                const apiGameStats = await client.graphql({
                    query: gameStatsByGameID,
                    variables: {filter: filter, gameID: gameDetails.gameID}
                });
                if (apiGameStats.data.gameStatsByGameID.items.length > 0) {
                    /* means user has signed waiver and there is a gameStat and user has either signed waiver or played before */
                    const gamesStatsFromAPI = apiGameStats.data.gameStatsByGameID.items[0];
                    localStorage.setItem("gameStatsID", gamesStatsFromAPI.id);
                } else {
                    setNumberOfPlayersError("Please Try Again - the system is not able to access database");
                }
            } catch (err) {
                console.log("error gameScoreByGameStatsID..", err)
            }
            /* add new game score */
            /* set state variable for gameStatsID */
            const data = {
                gameStatsID: localStorage.getItem("gameStatsID"),
                gameID: gameDetails.gameID,
                gameTotalTime: 0,
                gameHintTime: 0,
                teamName: teamName,
                completed: false,
                disabled: false,
                firstTime: firstTime
            };
            try {
                await client.graphql({
                    query: createGameScore,
                    variables: {input: data},
                });
                localStorage.setItem("gameID", gameDetails.gameID);
                localStorage.setItem("gameName", gameDetails.gameName);
                /* and gamestatsID? */
                /* close modal */
                setModalContent({
                    open: false,
                    content: ""
                })
                /* new ui */
                if (gameDetails.gameName === "xxx") {
                    console.log("go to game: " + gameDetails.gameName + "page: /game");
                    navigate("/game");
                } else {
                    console.log(`go to game: ${gameDetails.gameName}page: /gameV3`);
                    navigate("/gameV3");
                }
            } catch (err) {
                console.log("error createGameScore..", err)
            }


        } else {
            console.log("show teamName error message: HandlePlayGameIntro");
            /* don't need this? setTeamName("");*/
            /* check if waiver signed - do in modal*/
            if (gameDetails.waiverSigned === gameDetails.gameID) {
                console.log("waiver signed (handlePlayGameIntro)");
                setNumberOfPlayersError("Please provide a Team Name");
            } else {
                /* go to waiver */
                /* open up waiver modal */
                setModalContent({
                    open: true,
                    content: "Waiver"
                })
            }
        }
    }

    useEffect(() => {
        console.log("***useEffect***:  fetchGames():");
        handleExampleGame();
    }, []);
    function handleViewWaiver() {
        console.log("handleViewWaiver");
        setModalContentWaiver({
            show: true,
            content: "Waiver"
        })
    }
    function handleExampleGame() {
        console.log("handleExampleGame");
        setModalContentEG({
            show: true,
            content: "Example Game"
        })
    }
    function handleViewGameIntro() {
        console.log("handleViewGameIntro");
        if ((teamName !== "" && gameDetails.waiverSigned === gameDetails.gameID)) {
            setModalContentGI({
                show: true,
                content: "Game Intro"
            })
        } else {
            console.log("show teamName error message: HandlePlayGameIntro");
            /* don't need this? setTeamName("");*/
            /* check if waiver signed - do in modal*/
            if (gameDetails.waiverSigned === gameDetails.gameID) {
                console.log("waiver signed (handlePlayGameIntro)");
                setNumberOfPlayersError("Please provide a Team Name");
            } else {
                /* go to waiver */
                /* open up waiver modal */
                setModalContent({
                    open: true,
                    content: "Waiver"
                })
            }
        }
    }

    function setTeamNameFunction(teamNameValue) {
        console.log("setTeamNameFunction: " + teamNameValue);
        /* check for obscenities */
        if (matcher.hasMatch(teamNameValue)) {
            setNumberOfPlayersError("The Team Name contains profanities. Please choose another.");
            setTeamName("");
        } else {
            setNumberOfPlayersError("");
            localStorage.setItem("teamName", teamNameValue);
            setTeamName(teamNameValue);
        }
    }

    function DangerouslySetInnerHTMLSanitized(htmlContent) {
        const sanitizedHtmlContent = DOMPurify.sanitize(htmlContent);
        return (sanitizedHtmlContent)
    }

    return (
            <>
                <>
                    <View className={"end-paragraph"} textAlign={"center"}><Heading level={5} textAlign={"center"} marginBottom="10px" paddingTop="10px">{gameDetails.gameName}</Heading>
                    </View>

                    <Heading level={6} textAlign={"center"} marginBottom="0">Your score is based on your time to complete game. You must complete ALL the puzzles in ALL the zones to win.</Heading>
                    <View className={"small end-paragraph"}><strong>You Have Signed Waiver</strong>:
                        <Button onClick={() => handleViewWaiver()} variation={"link"}>view waiver</Button>
                    </View>
                    <View className={"small end-paragraph"}><strong>Example Game</strong>:
                        <Button onClick={() => handleExampleGame()} variation={"link"}>view Example</Button>
                    </View>
                    <Heading level={6} textAlign={"center"} marginTop={"10px"} marginBottom={"5px"}>Start Playing when you are here:</Heading>
                    <View className={"end-paragraph"} textAlign={"center"}>
                        <Image alt={gameDetails.gameName} maxHeight="100px" src={gameDetails.gamePlayZoneImage1}/><br />
                        <Button className="quit-button dark"
                                onClick={() => setModalContentMap({
                                    open: true,
                                    content: "Map"
                                })}>
                            Map of First Zone</Button>
                    </View>

                </>
                {/*<Accordion.Container allowMultiple>
                    <Accordion.Item value="game-details">
                        <Accordion.Trigger>
                            <strong>Game Details</strong>
                            <Accordion.Icon/>
                        </Accordion.Trigger>
                        <Accordion.Content>
                            <GameDetail gameDetails={gameDetails} gameIntro={true}/>
                        </Accordion.Content>
                    </Accordion.Item>
                    <Accordion.Item value="signed-waiver">
                        <Accordion.Trigger>
                            <strong>You Have Signed Waiver:</strong>
                            <Accordion.Icon/>
                        </Accordion.Trigger>
                        <Accordion.Content>
                            <Waiver gameDetails={gameDetails} gameIntro={true}/>
                        </Accordion.Content>
                    </Accordion.Item>
                </Accordion.Container>*/}


                {(gameDetails.numberOfTimes !== 0) ? (
                    <View className="small italics end-paragraph" marginTop={"10px"} textAlign={"center"}> You have
                        played {gameDetails.numberOfTimes} time{(gameDetails.numberOfTimes !== 1)? "(s)": null} before - this game's score will not be on the leaderboard. </View>
                ) :null}

                <View className={"end-paragraph"}>
                <TextField
                    name="TeamNameField"
                    margin="10px auto"
                    maxWidth="300px"
                    placeholder=""
                    label="Your Public Team Name for this game?"
                    required
                    value={teamName}
                    onChange={(e) => setTeamNameFunction(e.target.value)}
                />
                </View>

                <View className={"red-alert"} textAlign={"center"}><strong>{numberOfPlayersError}</strong></View>

                <View className={"modal-bottom-bar"}>

                    <Button margin="0 0 0 0" className="button" onClick={() => handleViewGameIntro()} variation={"link"}>Next</Button>

                </View>

                <ModalWaiver
                    modalContentGI={modalContentWaiver}
                    setModalContentGI={setModalContentWaiver}>
                    {(modalContentWaiver.content == "Waiver") && <Waiver gameIntro={true}/>}
                </ModalWaiver>

                <ModalExampleGame4
                    modalContentEG4={modalContentEG4}
                    setModalContentEG4={setModalContentEG4}
                    setModalContentEG3={setModalContentEG3}>
                    {(modalContentEG4.content == "Example Game4") && <ExampleGame4 gameIntro={true}/>}
                </ModalExampleGame4>

                <ModalExampleGame3
                    modalContentEG3={modalContentEG3}
                    setModalContentEG3={setModalContentEG3}
                    setModalContentEG2={setModalContentEG2}
                    setModalContentEG4={setModalContentEG4}>
                    {(modalContentEG3.content == "Example Game3") &&<ExampleGame3 gameIntro={true}/>}
                </ModalExampleGame3>

                <ModalExampleGame2
                    modalContentEG2={modalContentEG2}
                    setModalContentEG2={setModalContentEG2}
                    setModalContentEG3={setModalContentEG3}
                    setModalContentEG={setModalContentEG}>
                    {(modalContentEG2.content == "Example Game2") && <ExampleGame2 gameIntro={true}/>}
                </ModalExampleGame2>

                <ModalExampleGame
                    modalContentEG={modalContentEG}
                    setModalContentEG={setModalContentEG}
                    setModalContentEG2={setModalContentEG2}>
                    {(modalContentEG.content == "Example Game") && <ExampleGame gameIntro={true}/>}
                </ModalExampleGame>

                <ModalGameIntro
                    modalContentGI={modalContentGI}
                    setModalContentGI={setModalContentGI}
                    handlePlayGameIntro = {handlePlayGameIntro}>
                    {(modalContentGI.content == "Game Intro") &&
                    <View dangerouslySetInnerHTML={ {__html: DangerouslySetInnerHTMLSanitized(gameDetails.gameIntro)}}  padding={"0 10px"}></View>
                    }
                </ModalGameIntro>
                <ReactModalFromBottomMap modalContentMap={modalContentMap} setModalContentMap={setModalContentMap}>
                    {(modalContentMap.content == "Map") && <Map gameDetails={gameDetails}/>}
                </ReactModalFromBottomMap>

         </>
        )
}
