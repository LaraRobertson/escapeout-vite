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


export default function GameStats(props) {
    const client = generateClient();
    let modalContent = props.modalContent;
    const [gameStats, setGameStats] = useState([]);

    async function myStatsFunction() {
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
        for (const key in myStatsFromAPI) {
            console.log(`${key}: ${ myStatsFromAPI[key]}`);
             for (const key1 in myStatsFromAPI[key]) {
                 console.log(`${key1}: ${myStatsFromAPI[key][key1]}`);
             }
        }
        setGameStats(myStatsFromAPI);
    }

    useEffect(() => {
        console.log("***useEffect***:  myStatsFunction(): (gameStats)");
        //myStatsFunction();
        myStatsFunction();
    }, []);


    const GameScoreView = (props) => {
        console.log("gameScoreArray: " + JSON.stringify(props.gameScoreArray));
        return (
            <div className="table-container" role="table" aria-label="game score">
                <div className="flex-table header-table" role="rowgroup">
                    <div className="flex-row " role="columnheader">Team Name</div>
                    <div className="flex-row " role="columnheader">Team Score</div>
                    <div className="flex-row" role="columnheader">Total Time</div>
                    <div className="flex-row" role="columnheader">Hint Time</div>
                    <div className="flex-row" role="columnheader">Finished</div>
                </div>
                {props.gameScoreArray.map((score, index) => (
                    <div role="rowgroup" key={score.id}>
                        <div className="flex-table row">
                            <div className="flex-row first" role="cell"> {score.teamName}</div>
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
                            <div className="flex-row small" role="cell"> {format(new Date(score.updatedAt), "MM/dd/yy h:mma")}</div>
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
                    <View key={index}>
                        <div>Game: {gameStat.gameName} | {gameStat.gameLocationCity}</div>
                        <GameScoreView gameScoreArray = {gameStat.gameScore.items} gameName={gameStat.gameName}/>
                    </View>
                ))}
            </View>
        </>
    );
}