// components/LeaderBoard.js
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
    useAuthenticator, Image
} from '@aws-amplify/ui-react';
import {gameScoreByGameID, getGame} from "../graphql/queries";
import { format } from 'date-fns'
import { useNavigate } from 'react-router-dom';
import {generateClient} from "aws-amplify/api";

export function LeaderBoard(props) {
    const client = generateClient();
    const [leaderBoard, setLeaderBoard] = useState([]);
    const [showAllTimeButton, setShowAllTimeButton] = useState(false);

    /**
     * @param {string} date
     */
    async function leaderBoardFunction(date) {
        console.log("date: " + date);
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
                variables: {filter: filter, sortDirection: "ASC", gameID:props.gameDetails.gameID}
            });

        const leaderBoardFromAPI = apiData.data.gameScoreByGameID.items;
        setLeaderBoard(leaderBoardFromAPI);
        } catch (err) {
            console.log('error fetching gameScoreByGameID', err);
        }
    }

    const navigate = useNavigate();
    /*useEffect(() => {
        console.log("***useEffect***:  LeaderBoard()");
        leaderBoardFunction("2021-04-01");
    }, []);*/

    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    return (
        <View>

                <Heading level={4} className="heading">Leader Board for {props.gameDetails.gameName} game</Heading>
                <View className="small">Only games played the first time will show on leaderboard.</View>

                <Button className={showAllTimeButton ? "hide" : "button"} onClick={() => leaderBoardFunction(today.toLocaleDateString('en-CA'))}>
                    tap to see today</Button>&nbsp;
                <Button className={showAllTimeButton ? "button" : "hide"} onClick={() => leaderBoardFunction("2021-04-01")}>
                    tap to see all time</Button>
                <Heading level={3} className={showAllTimeButton ? "heading" : "hide"} >Today</Heading>
                <Heading level={3} className={showAllTimeButton ? "hide" : "heading"} >All Time</Heading>
                <div className="table-container" role="table" aria-label="Destinations">
                    <div className="flex-table header" role="rowgroup">
                        <div className="flex-row first fourths" role="columnheader">Display Name</div>
                        <div className="flex-row fourths" role="columnheader">Rank</div>
                        <div className="flex-row fourths" role="columnheader">Team Score</div>
                        <div className="flex-row fourths" role="columnheader">Played</div>
                    </div>
                    {props.leaderBoard.map((game, index) => (
                        <div className="flex-table row" role="rowgroup" key={game.id}>
                            <div className="flex-row  fourths" role="cell">{game.teamName}</div>
                            <div className="flex-row fourths" role="cell">{Number(index) + 1}</div>
                            <div className="flex-row fourths" role="cell">{game.gameTotalTime} mins</div>
                            <div className="flex-row fourths" role="cell"> {format(new Date(game.createdAt), "MM/dd/yyyy H:mma")}</div>
                        </div>
                    ))}
                </div>

        </View>
    );
}