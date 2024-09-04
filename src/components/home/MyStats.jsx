// components/MyStats.jsx
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

export default function MyStats(props) {
    const client = generateClient();
    const { email } = useContext(MyAuthContext);
    const [myStats, setMyStats] = useState([]);
    const [myStatsEmail, setMyStatsEmail] = useState(email);
    const [showAllTimeButton, setShowAllTimeButton] = useState(false);
    const [date, setDate] = useState();



        async function myStatsFunction(date) {
        const email = localStorage.getItem("email");
            /* show all time button if today is selected */
            (date !== "2021-04-01" )? setShowAllTimeButton(true) : setShowAllTimeButton(false);
        //console.log("gameStats: " + props.gameID);
        let filter = {
            userEmail: {
                eq: email
            }
        };
        try {
            const apiData = await client.graphql({
                query: gameStatsSortedByGameName,
                variables: {filter: filter, sortDirection: "DESC", type: "gameStats"}
            });
            const myStatsFromAPI = apiData.data.gameStatsSortedByGameName.items;
            setMyStats(myStatsFromAPI);
        } catch (err) {
            console.log("error fetching gameStatsSortedByGameName", err);
        }
    }

    useEffect(() => {
        console.log("***useEffect***:  myStatsFunction(): " + myStatsEmail);
        //myStatsFunction();
        myStatsFunction("2021-04-01");
    }, []);


    const GameScoreView = (props) => {
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
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
                    <>
                        <div role="rowgroup" key={score.id} className={((showAllTimeButton) && (format(new Date(score.updatedAt), "yyyy-MM-dd") != today.toLocaleDateString('en-CA'))) ? "hide" : "show"}>
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
                    </>
                ))}
            </div>
        )
    }

    return (
        <>
            <Heading level={5} >{myStatsEmail}</Heading>
            <Flex>
                {(!showAllTimeButton) &&
                <Button className={"button"} onClick={() =>  myStatsFunction()}>
                    tap to see today</Button>}
                {(showAllTimeButton) && <Button className={"button"} onClick={() =>  myStatsFunction("2021-04-01")}>
                    tap to see today</Button>}
            </Flex>
            <Heading level={3} className={showAllTimeButton ? "heading light" : "hide"} >Completed Today</Heading>
            <Heading level={3} className={showAllTimeButton ? "hide" : "heading light"} >All Time</Heading>

            <View>
                {myStats.map((userStat, index) => (
                    <>
                    {(userStat.gameScore.items.length>0) &&
                        (<View key={index}>
                            <div>Game: {userStat.gameName} | {userStat.gameLocationCity}</div>
                            <GameScoreView gameScoreArray = {userStat.gameScore.items} gameName={userStat.gameName} />
                        </View>)
                    }
                    </>
                ))}
            </View>
        </>
    );
}