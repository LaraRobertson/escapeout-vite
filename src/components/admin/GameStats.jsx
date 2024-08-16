// components/GameStats.jsx
import React, {useContext, useEffect, useState} from 'react';
import {
    Button,
    Heading,
    View
} from '@aws-amplify/ui-react';
import {generateClient} from "aws-amplify/api";
import {gamesByCity, gameScoreByGameID, gameStatsByGameID,gameStatsByUserEmail,gameStatsSortedByGameName} from "../../graphql/queries";
import { format } from 'date-fns'
import * as mutations from "../../graphql/mutations";


export default function GameStats(props) {
    const client = generateClient();
    let modalContent = props.modalContent;
    const [gameStats, setGameStats] = useState([]);

    async function myStatsFunction() {
        console.log("myStatsFunction: " + modalContent.id);
        let filter = {
            gameID: {
                eq: modalContent.id
            }
        };
        const apiData = await client.graphql({
            query: gameStatsSortedByGameName,
            variables: {filter: filter, sortDirection: "DESC", type: "gameStats"}
        });
        const myStatsFromAPI = apiData.data.gameStatsSortedByGameName.items;
        console.log("myStatsFromAPI: " + myStatsFromAPI);
        /*for (const key in myStatsFromAPI) {
            console.log(`${key}: ${ myStatsFromAPI[key]}`);
             for (const key1 in myStatsFromAPI[key]) {
                 console.log(`${key1}: ${myStatsFromAPI[key][key1]}`);
             }
        }*/
        setGameStats(myStatsFromAPI);
    }

    useEffect(() => {
        console.log("***useEffect***:  myStatsFunction(): (gameStats)");
        //myStatsFunction();
        myStatsFunction();
    }, []);

    async function deleteGameScore(props) {
        console.log("props.gameScoreID: " + props.gameScoreID);
        try {
            const gameDetails = {
                id: props.gameScoreID
            };
            await client.graphql({
                query: mutations.deleteGameScore,
                variables: {input: gameDetails}
            });
        } catch (err) {
            console.log('error deleting games:', err);
        }
        myStatsFunction();
    }
    async function deleteGameStats(props) {
        console.log("props.gameStatsID: " + props.gameStatsID);
        try {
            const gameDetails = {
                id: props.gameStatsID
            };
            await client.graphql({
                query: mutations.deleteGameStats,
                variables: {input: gameDetails}
            });
        } catch (err) {
            console.log('error deleting games:', err);
        }
        myStatsFunction();
    }

    const GameScoreView = (props) => {
        //console.log("gameScoreArray: " + JSON.stringify(props.gameScoreArray));
        return (
            <div className="table-container" role="table" aria-label="game score">
                <div className="flex-table header-table" role="rowgroup">
                    <div className="flex-row " role="columnheader">Team Name</div>
                    <div className="flex-row " role="columnheader">Team Score</div>
                    <div className="flex-row" role="columnheader">Total Time</div>
                    <div className="flex-row" role="columnheader">Hint Time</div>
                    <div className="flex-row" role="columnheader">Finished</div>
                </div>
                {(props.gameScoreArray.length === 0) && <div><strong>No Game Scores</strong><hr /></div>}
                {props.gameScoreArray.map((score, index) => (
                    <div role="rowgroup" key={score.id}>
                        <div className="flex-table row">
                            <div className="flex-row first" role="cell">{index+1}: {score.teamName} <br />
                                <span className={"small"}>{props.userEmail}</span></div>
                            <div className="flex-row " role="cell">{score.gameTotalTime}</div>
                            <div className="flex-row" role="cell">
                                {score.gameTotalTime}
                            </div>
                            <div className="flex-row" role="cell">
                                {score.gameHintTime}
                            </div>
                            <div className="flex-row" role="cell">{score.completed ? ("true"):("false")}  {score.firstTime ? (" - 1st time") :null}</div>

                        </div>
                        <div className="flex-table row">
                            <div className="flex-row four-width" role="cell">Comments: {score.gameComments}</div>
                            <div className="flex-row small" role="cell"> updated: {format(new Date(score.updatedAt), "MM/dd/yy h:mma")}<br />


                                <div style={{backgroundColor:"white"}}>{score.id}
                                    <Button gap="0.1rem" marginLeft="5px" size="small" color="red" onClick={() => deleteGameScore({"gameScoreID": score.id})}>
                                    x
                                </Button></div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        )
    }

    return (
        <>
            <Heading level={5} className="header">{modalContent.action}</Heading>
            <View>
                {gameStats.map((gameStat, index) => (
                    <View key={gameStat.id}>
                        <div>Game: {gameStat.gameName} | {gameStat.gameLocationCity} |
                            <Button gap="0.1rem" marginLeft="5px" size="small" color="red" onClick={() => deleteGameStats({"gameStatsID": gameStat.id})}>
                            x
                        </Button> <span className={"small"}>(delete if no game scores)</span></div>
                        <GameScoreView gameScoreArray = {gameStat.gameScore.items} gameName={gameStat.gameName} index={index} userEmail={gameStat.userEmail}/>
                    </View>
                ))}
            </View>
        </>
    );
}