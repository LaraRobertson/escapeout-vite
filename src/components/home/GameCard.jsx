import {Button, Card, Flex, Heading, Text, View, Image} from "@aws-amplify/ui-react";
import React, {useContext, useEffect, useState} from "react";
import {checkWaiver} from "./checkWaiver";
import {MyAuthContext} from "../../MyContext";
import {useNavigate} from "react-router-dom";

export default function GameCard({game, gameDetails, hidePlayedGames}) {
    const navigate = useNavigate();
    let {
        gameLogisticInfo,
        gameSummary,
        gameDescription,
        gameIntro,
        gameLevel,
        gameLocationCity,
        gameLocationPlace,
        gameName,
        gameGoals,
        gamePlayZone,
        gameType,
        id,
        walkingDistance
    } = game;

    const { authStatus, email, gamesIDUserPlayed, gamesIDUser, setModalContent, setGameDetails  } = useContext(MyAuthContext);

    function handleGameDetail(gameDetailsVar) {
        setGameDetails(gameDetailsVar);
        setModalContent({
            open: true,
            content: "Game Detail"
        })
    }

    function handleMapDetail(gameDetailsVar) {
        setGameDetails(gameDetailsVar);
        setModalContent({
            open: true,
            content: "Map"
        })
    }

    function handleLeaderboard(gameDetailsVar) {
        setGameDetails(gameDetailsVar);
        setModalContent({
            open: true,
            content: "Leaderboard"
        })
    }

    async function handlePlayGameList(gameDetailsVar) {
        console.log("handlePlayGameList: " + gameDetailsVar.gameName);
        console.log("waiverSigned: " + gameDetailsVar.waiverSigned);
        console.log("gameID: " + gameDetailsVar.gameID);
        if (gameDetailsVar.waiverSigned != gameDetailsVar.gameID) {
            /* check if waiver signed (there is a gameStats entry) and set numberOfTimes */
            /* check if gameStats entry in database */
            let checkWaiverObject = {};
            checkWaiverObject = await checkWaiver(gameDetailsVar);
            console.log("checkWaiverObject.waiverSigned: " + checkWaiverObject.waiverSigned);
            if (checkWaiverObject.waiverSigned) {
                console.log("numberOfTimes: " + checkWaiverObject.numberOfTimes + " waiverSigned: " + gameDetailsVar.waiverSigned);
                setGameDetails({
                    ...gameDetailsVar,
                    waiverSigned: gameDetailsVar.gameID,
                    numberOfTimes: checkWaiverObject.numberOfTimes
                });
                /* open game intro */
                setModalContent({
                    open: true,
                    content: "Game Intro"
                })
            } else {
                setGameDetails(gameDetailsVar);
                /* open up waiver modal */
                setModalContent({
                    open: true,
                    content: "Waiver"
                })
            }
        } else {
            setGameDetails(gameDetailsVar);
            /* open game intro */
            setModalContent({
                open: true,
                content: "Game Intro"
            })
        }
    }

    const divStyle = (src) => ({
        backgroundImage:  "url(" + src + ")"
    });
    return (
        <Card style={divStyle(gamePlayZone.items[0].gameZoneImage)}
              className={(gamesIDUserPlayed.includes(id) && hidePlayedGames) ? "hide" : "game-card"}
              variation="elevated">
            <View className="inner-game-card">
                <View className="game-card-full level" backgroundColor={"white"}>
                    <Text color="black"><span className="italics">level</span>: {gameLevel}
                    </Text>
                </View>
                <View className="game-card-full">
                    {gamesIDUserPlayed.includes(id) ? (
                        <Text className="game-card-header played">{gameName} <span
                            className="small">(played)</span></Text>
                    ) : (
                        <Text className="game-card-header">{gameName} <span
                            className="small">({gameType})</span></Text>
                    )}
                </View>
                <View className="game-card-full">
                    <Text color="white"><span
                        className="italics">Location</span>: {gameLocationPlace}</Text>
                </View>
                <View className="game-card-full">
                    <Text color="white"><span
                        className="italics">City</span>: {gameLocationCity}</Text>
                </View>
                <View className="game-card-full">
                    <Text color="white">{walkingDistance} walking distance</Text>
                </View>
            </View>
            <View className="inner-game-card1">
                <Flex justifyContent="center">
                    {authStatus !== "authenticated" ? (
                        <View textAlign="center">
                            <Button
                                className="button button-center show button-light-dark"
                                onClick={() => navigate("/login")}>
                                Sign in to Play Game
                            </Button>
                        </View>) : (
                        <View textAlign="center">
                            {/* can include free and free-test in gamesIDUser */}
                            {(gamesIDUser.includes(id) || gameType === "free" || gameType === "free-test") &&
                            <View textAlign="center">
                                    <Button
                                        className="button button-center-gc button-light-dark show"
                                        onClick={() => handlePlayGameList({
                                            email: email,
                                            gameName: gameName,
                                            gameID: id,
                                            gameLocationCity: gameLocationCity,
                                            gameDescription: gameDescription,
                                            gameSummary: gameSummary,
                                            gameIntro: gameIntro,
                                            gameLogisticInfo: gameLogisticInfo,
                                            gamePlayZoneImage1: gamePlayZone.items[0].gameZoneImage,
                                            waiverSigned: gameDetails.waiverSigned,
                                            numberOfTimes: gameDetails.numberOfTimes,
                                            latitude1: gamePlayZone.items[0].latitude,
                                            longitude1: gamePlayZone.items[0].longitude,
                                        })}>
                                        Play Game
                                    </Button>
                                <span className={"small"}>time doesn't start yet</span>
                                </View>
                            }
                        </View>)}

                </Flex>
                <View className="game-card-full light-dark">
                    <View id={id}>
                        <Heading level={"7"} className="light-dark"
                                 marginTop="0em"><strong>Goal: </strong> {gameGoals}</Heading>
                        <Heading level={"7"} className="light-dark"
                                 marginBottom=".4em"><strong>Description</strong> {gameDescription}</Heading>
                        <Flex justifyContent="center">
                            <Button className="button button-small show"
                                    onClick={() => handleLeaderboard({
                                        gameName: gameName,
                                        gameID: id
                                    })}>
                                Leaderboard
                            </Button>

                            <Button
                                className="button button-small show"
                                onClick={() => handleGameDetail({
                                    gameName: gameName,
                                    gameID: id,
                                    gameLocationCity: gameLocationCity,
                                    gameDescription: gameDescription,
                                    gameSummary: gameSummary,
                                    gameLogisticInfo: gameLogisticInfo,
                                    gameGoals: gameGoals,
                                    gamePlayZoneImage1: gamePlayZone.items[0].gameZoneImage,
                                    latitude1: gamePlayZone.items[0].latitude,
                                    longitude1: gamePlayZone.items[0].longitude,
                                })}>
                                Game Details
                            </Button>
                        </Flex>
                        <span className="italics small">tap on Leaderboard to see average time.</span>
                    </View>
                </View>
            </View>
        </Card>
    )
}