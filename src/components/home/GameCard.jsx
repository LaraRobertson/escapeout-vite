import {Button, Card, Flex, Heading, Text, View, Image} from "@aws-amplify/ui-react";
import React, {useContext, useEffect, useState} from "react";
import {checkWaiver} from "./checkWaiver";
import {MyAuthContext} from "../../MyContext";

export default function GameCard({game, gameDetails, hidePlayedGames}) {
    let {
        gameLogisticInfo,
        gameSummary,
        gameDescription,
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
        background:  "url(" + src + ") 0 0 / contain no-repeat"
    });
    return (
        <Card style={divStyle(gamePlayZone.items[0].gameZoneImage)}
              className={(gamesIDUserPlayed.includes(id) && hidePlayedGames) ? "hide" : "game-card test"}
              variation="elevated">
            <View className="inner-game-card">
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
                    <Text color="white"><span className="italics">Level</span>: {gameLevel}
                    </Text>
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
                                className="button button-center button-small show button-light-dark"
                                onClick={() => navigate("/login")}>
                                Sign in to Play Game
                            </Button>
                        </View>) : (
                        <View textAlign="center">
                            {/* can include free and free-test in gamesIDUser */}
                            {(gamesIDUser.includes(id) || gameType === "free" || gameType === "free-test") &&
                            <View textAlign="center">
                                    <Button
                                        className="button button-small button-center button-light-dark show"
                                        onClick={() => handlePlayGameList({
                                            email: email,
                                            gameName: gameName,
                                            gameID: id,
                                            gameLocationCity: gameLocationCity,
                                            gameDescription: gameDescription,
                                            gameSummary: gameSummary,
                                            gameLogisticInfo: gameLogisticInfo,
                                            gamePlayZoneImage1: gamePlayZone.items[0].gameZoneImage,
                                            waiverSigned: gameDetails.waiverSigned,
                                            numberOfTimes: gameDetails.numberOfTimes,
                                        })}>
                                        Play Game
                                    </Button>
                                </View>
                            }
                        </View>)}
                    <View ariaLabel={"leaderboard-" + id}>
                        <Button className="button button-small button-center show"
                                     onClick={() => handleLeaderboard({
                                         gameName: gameName,
                                         gameID: id
                                     })}>
                            Leaderboard
                        </Button>
                    </View>
                </Flex>
                <View className="game-card-full light-dark">
                    <View id={id}>
                        <Heading level={"6"} className="heading light-dark"
                                 margin="0">{gameDescription}</Heading>
                        <Heading level={"7"} className="heading light-dark"
                                 marginBottom=".4em">{gameGoals}</Heading>
                        <Flex justifyContent="center">
                            <View textAlign="center">
                            <Button
                                className="button button-small button-center button-light-dark show"
                                onClick={() => handleGameDetail({
                                    gameName: gameName,
                                    gameID: id,
                                    gameLocationCity: gameLocationCity,
                                    gameDescription: gameDescription,
                                    gameSummary: gameSummary,
                                    gameLogisticInfo: gameLogisticInfo,
                                    gameGoals: gameGoals,
                                    gamePlayZoneImage1: gamePlayZone.items[0].gameZoneImage
                                })}>
                                Game Details
                            </Button>
                            </View>
                        </Flex>
                        <span className="italics">Tap on Leaderboard to see average time.</span>
                    </View>
                </View>
            </View>
        </Card>
    )
}