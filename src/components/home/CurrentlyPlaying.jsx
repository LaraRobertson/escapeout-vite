import {Button, View} from "@aws-amplify/ui-react";
import {goHomeQuit, removeLocalStorage} from "../helper";
import React from "react";
import {useNavigate} from "react-router-dom";
import {getGameScore, getGameStats} from "../../graphql/queries";
import {generateClient} from "aws-amplify/api";

export default function CurrentlyPlaying() {
    const navigate = useNavigate();
    const client = generateClient();
    async function goToCurrentGame(gameDetails) {
        /* check if gameStats entry */
        const apiGameStats =  await client.graphql({
            query: getGameStats,
            variables: { id: gameDetails.gameStatsID}
        });
        if (apiGameStats) {
            console.log("game stat there");
            console.log("check waiver");
            console.log("gapiGameStats.data.getGameStats.gameStates: " + apiGameStats.data.getGameStats.gameStates);
            if (apiGameStats.data.getGameStats.gameStates != "") {
                /* check if gameScore entry */
                const apiGameScore = await client.graphql({
                    query: getGameScore,
                    variables: {id: gameDetails.gameScoreID}
                });
                if (apiGameScore) {
                    /* good to go! */
                    console.log("current game: go to page: " + "/V3game");
                    navigate("/gameV3");
                }
            }
        } else {
            removeLocalStorage();
        }
    }
    return (
        <>
{(localStorage.getItem("gameID") !== null &&
    localStorage.getItem("gameName") !== null &&
    localStorage.getItem("realTimeStart") !== null &&
    localStorage.getItem("gameStatsID") !== null &&
    localStorage.getItem("gameScoreID") !== null) ? (
    <View className="overlay">
        <View className="popup"
              ariaLabel="Currently Playing">

            <View textAlign="center" border="1px solid white" padding="10px">
                Currently Playing: {localStorage.getItem("gameName")} &nbsp;&nbsp;<br/><br/>
                <Button className="go-to-game-button light" onClick={() => goToCurrentGame({
                    gameName: localStorage.getItem("gameLink"),
                    gameID: localStorage.getItem("gameID"),
                    gameScoreID: localStorage.getItem("gameScoreID"),
                    gameStatsID: localStorage.getItem("gameStatsID")
                })}>
                    go back to game
                </Button><br/><br/>
                <Button className="go-to-game-button light" onClick={() => goHomeQuit(navigate)}>
                    Quit Game (if this is your first time playing you will not have a "first time"
                    score - no chance for leaderboard)
                </Button>
            </View></View></View>) : null}
        </>
)
}