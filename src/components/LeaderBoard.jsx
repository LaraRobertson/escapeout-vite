// components/LeaderBoard.js
import React, {useEffect, useState} from 'react';
import {
    Button,
    Heading,
    View,
} from '@aws-amplify/ui-react';
import {gameScoreByGameID} from "../graphql/queries";
import { format } from 'date-fns'
import {generateClient} from "aws-amplify/api";

export function LeaderBoard(props) {
    const client = generateClient();
    const [leaderBoardGameID, setLeaderBoardGameID] = useState(props.gameID);
    const [leaderBoard, setLeaderBoard] = useState([]);
    const [showAllTimeButton, setShowAllTimeButton] = useState(false);

    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    async function leaderBoardFunction(date) {
        console.log("date: " + date);
        console.log("gameID: " + leaderBoardGameID);
        console.log("leaderboard");
        /* show all time button if today is selected */
        (date !== "2021-04-01" )? setShowAllTimeButton(true) : setShowAllTimeButton(false);
        let filter = {
            completed: {
                eq: true
            },
            firstTime: {
                eq: true
            },
            createdAt: {
                gt: date
            }
        };
        /* get leaderBoard details */

        try {
            const apiData = await client.graphql({
                query: gameScoreByGameID,
                variables: {filter: filter, sortDirection: "ASC", gameID:leaderBoardGameID}
            });

        const leaderBoardFromAPI = apiData.data.gameScoreByGameID.items;
        /* may have to do the 10 limit here */
            /* it looks like "limit" on api call limits after filter so all the non-first times
            will counted in limit and then the api call filters....
            so, just set length here -  but not yet:
             */
            /*let topTen = leaderBoardFromAPI;
            topTen.length = 2;
            setLeaderBoard(topTen);*/
            setLeaderBoard(leaderBoardFromAPI);
        } catch (err) {
            console.log('error fetching gameScoreByGameID', err);
        }
    }

    useEffect(() => {
        console.log("***useEffect***:  LeaderBoard(): " + leaderBoardGameID);
        leaderBoardFunction("2021-04-01");
    }, []);


    return (
        <View className={"overlay"}>
        <View className="popup"
              ariaLabel="LeaderBoard"
              textAlign="center">
            <View width="100%" margin="0 auto" lineHeight="17px">
                <Button className="close-button light" onClick={() =>  props.setIsGameLeaderBoardVisible(false)}>X</Button>
            </View>
                <Heading level={4} className="heading light">Leaderboard for {props.gameName} game</Heading>
                <View className="small">Only games played the first time will show on leaderboard.</View>

                <Button className={showAllTimeButton ? "hide" : "button"} onClick={() => leaderBoardFunction(today.toLocaleDateString('en-CA'))}>
                    tap to see today</Button>&nbsp;
                <Button className={showAllTimeButton ? "button" : "hide"} onClick={() => leaderBoardFunction("2021-04-01")}>
                    tap to see all time</Button>
                <Heading level={3} className={showAllTimeButton ? "heading light" : "hide"} >Today</Heading>
                <Heading level={3} className={showAllTimeButton ? "hide" : "heading light"} >All Time</Heading>
                <div className="table-container" role="table" aria-label="Destinations">
                    <div className="flex-table header" role="rowgroup">
                        <div className="flex-row first fourths" role="columnheader">Display Name</div>
                        <div className="flex-row fourths" role="columnheader">Rank</div>
                        <div className="flex-row fourths" role="columnheader">Team Score</div>
                        <div className="flex-row fourths" role="columnheader">Played</div>
                    </div>
                    {leaderBoard.map((game, index) => (
                        <div className="flex-table row" role="rowgroup" key={game.id}>
                            <div className="flex-row  fourths" role="cell">{game.teamName}</div>
                            <div className="flex-row fourths" role="cell">{Number(index) + 1}</div>
                            <div className="flex-row fourths" role="cell">{game.gameTotalTime} mins</div>
                            <div className="flex-row fourths" role="cell"> {format(new Date(game.createdAt), "MM/dd/yyyy H:mma")}</div>
                        </div>
                    ))}
                </div>
            <View marginTop="10px">
                <Button className="close light" onClick={() => props.setIsGameLeaderBoardVisible(false)}>close</Button>
            </View>
        </View>
        </View>
    );
}