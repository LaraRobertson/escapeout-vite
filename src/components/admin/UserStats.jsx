// components/admin/UserStats.jsx
import React, {useContext, useEffect, useState} from 'react';
import {
    Button,
    Heading,
    View,
    Flex
} from '@aws-amplify/ui-react';
import {generateClient} from "aws-amplify/api";
import {gamesByCity, gameScoreByGameID, gameStatsByGameID,gameStatsByUserEmail,gameStatsSortedByGameName} from "../../graphql/queries";
import { format } from 'date-fns'
import {MyAuthContext} from "../../MyContext";
import * as mutations from "../../graphql/mutations";

export default function UserStats() {
    const client = generateClient();
    const { modalContent, setModalContent } = useContext(MyAuthContext);
    console.log("User Stats email: " + modalContent.userEmail);
    const [myStats, setMyStats] = useState([]);
    const [showAllTimeButton, setShowAllTimeButton] = useState(false);
    const [date, setDate] = useState();

        async function myStatsFunction(date) {
        //const email = localStorage.getItem("email");
            /* show all time button if today is selected */
            (date !== "2021-04-01" )? setShowAllTimeButton(true) : setShowAllTimeButton(false);
        //console.log("gameStats: " + props.gameID);
        let filter = {
            userEmail: {
                eq: modalContent.userEmail
            }
        };
        try {
            const apiData = await client.graphql({
                query: gameStatsSortedByGameName,
                variables: {filter: filter, sortDirection: "DESC", type: "gameStats"}
            });
            const myStatsFromAPI = apiData.data.gameStatsSortedByGameName.items;
            console.log("myStatsFromAPI: " + myStatsFromAPI);
           /* for (const key in myStatsFromAPI) {
                console.log(`${key}: ${ myStatsFromAPI[key]}`);
                 for (const key1 in myStatsFromAPI[key]) {
                     console.log(`${key1}: ${myStatsFromAPI[key][key1]}`);
                 }
            }*/
            /* need to filter gameScore by date */
            /*if (!showAllTimeButton) {
            let myStatsFromAPIToday = gameListByCity.filter(game => game.gameLocationPlace === gameLocationPlaceTemp)
                .sort((a, b) => {
                    return a.gameLevel - b.gameLevel;
                });
            } else {
                setMyStats(myStatsFromAPI);
            }*/
            setMyStats(myStatsFromAPI);
        } catch (err) {
            console.log("error fetching gameStatsSortedByGameName", err);
        }
    }

    useEffect(() => {
        console.log("***useEffect***:  myStatsFunction(): " + modalContent.userEmail);
        //myStatsFunction();
        myStatsFunction("2021-04-01");
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
        myStatsFunction("2021-04-01");
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
        myStatsFunction("2021-04-01");
    }
    const GameScoreView = (props) => {
        console.log("gameScoreArray: " + JSON.stringify(props.gameScoreArray));
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        return (
            <div className="table-container" role="table" aria-label="game score" key={props.gameName}>
                <div className="flex-table header" role="rowgroup">
                    <div className="flex-row " role="columnheader">Team Name</div>
                    <div className="flex-row " role="columnheader">Team Score</div>
                    <div className="flex-row" role="columnheader">Total Time</div>
                    <div className="flex-row" role="columnheader">Hint Time</div>
                    <div className="flex-row" role="columnheader">Finished</div>
                </div>
                {props.gameScoreArray.map((score, index) => (
                    <>
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
                            <div className="flex-row small" role="cell"> {format(new Date(score.updatedAt), "MM/dd/yy h:mma")}<br />


                                <div style={{backgroundColor:"white"}}>{score.id}
                                    <Button gap="0.1rem" marginLeft="5px" size="small" color="red" onClick={() => deleteGameScore({"gameScoreID": score.id})}>
                                        x
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                    </>
                ))}
            </div>
        )
    }

    return (
        <>
            <Heading level={5} >{modalContent.userEmail}</Heading>
            {/*<Flex>
            <Button className={showAllTimeButton ? "hide" : "button"} onClick={() =>  myStatsFunction()}>
                tap to see today</Button>&nbsp;
            <Button className={showAllTimeButton ? "button" : "hide"} onClick={() =>  myStatsFunction("2021-04-01")}>
                tap to see all time</Button></Flex>
            <Heading level={3} className={showAllTimeButton ? "heading light" : "hide"} >Completed Today</Heading>
            <Heading level={3} className={showAllTimeButton ? "hide" : "heading light"} >All Time</Heading>*/}

            <View>
                {myStats.map((userStat, index) => (
                    <View key={userStat.id}>
                        <div>Game: {userStat.gameName} | {userStat.gameLocationCity} | {userStat.gameStates}
                            <Button gap="0.1rem" marginLeft="5px" size="small" color="red" onClick={() => deleteGameStats({"gameStatsID": userStat.id})}>
                                x
                            </Button> <span className={"small"}>(delete if no game scores)</span></div>
                    {(userStat.gameScore.items.length>0) &&
                        (<View key={index}>
                            <GameScoreView gameScoreArray = {userStat.gameScore.items} gameName={userStat.gameName} />
                        </View>)
                    }
                    </View>
                ))}
            </View>
        </>
    );
}