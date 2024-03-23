// components/MyStats.jsx
import React, {useEffect, useState} from 'react';
import {
    Flex,
    Button,
    useTheme,
    Heading,
    View,
    Card,
    Text,
    TextField,
    TextAreaField,
    useAuthenticator
} from '@aws-amplify/ui-react';
import {generateClient} from "aws-amplify/api";
import {gamesByCity, gameScoreByGameID, gameStatsByGameID,gameStatsByUserEmail,gameStatsSortedByGameName} from "../graphql/queries";
import { format } from 'date-fns'
import { useNavigate } from 'react-router-dom';

export function MyStats(props) {
    const client = generateClient();
    //const [myStats, setMyStats] = useState([]);

    /*async function myStatsFunction() {
       // const email = localStorage.getItem("email");
        console.log("myStats: " + props.email);
        let filter = {
            userEmail: {
                eq: props.email
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
        setMyStats(myStatsFromAPI);

    }*/

    const navigate = useNavigate();

  /*  useEffect(() => {
        if (myStats.length>0) console.log("***useEffect***:  myStats" + myStats);
    });*/
    /*useEffect(() => {
        console.log("***useEffect***:  fetchGames()");
        //myStatsFunction();
        myStatsFunction();
    }, []);*/


    const GameScoreView = (props) => {
        console.log("gameScoreArray: " + JSON.stringify(props.gameScoreArray));
        return (
            <div className="table-container" role="table" aria-label="game score">
                <div className="flex-table header" role="rowgroup">
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
                            <div className="flex-row four-width" role="cell">{score.gameComments}</div>
                            <div className="flex-row" role="cell"> {format(new Date(score.updatedAt), "MM/dd/yyyy H:mma")}</div>
                        </div>
                    </div>
                ))}
            </div>
        )
    }

    return (
        <View className={props.isMyStatsVisible ? "overlay" : "hide"}>
            <View className="popup light-dark"
                  ariaLabel="MyStats"
                  textAlign="center">
                <Heading level={2} className="heading">Stats</Heading>
                <Heading level={5} className="heading2">{localStorage.getItem("email")}</Heading>
                <View>
                    {props.myStats.map((userStat, index) => (
                        <View>
                            <div>Game: {userStat.gameName} | {userStat.gameLocationCity}</div>
                            <GameScoreView gameScoreArray = {userStat.gameScore.items} gameName={userStat.gameName}/>
                        </View>
                    ))}
                </View>
                <View marginTop="10px">
                    <Button className="button right-button small" onClick={() => props.setIsMyStatsVisible(false)}>close</Button>
                </View>
            </View>
        </View>
    );
}