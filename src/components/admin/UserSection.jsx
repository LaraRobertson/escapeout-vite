import {Button, Flex, Heading, TextField, View} from "@aws-amplify/ui-react";
import React, {useEffect, useState} from "react";
import {listUsers} from "../../graphql/queries";
import * as mutations from "../../graphql/mutations";
import {generateClient} from "aws-amplify/api";

export default function UserSection(props) {
    const [users, setUsers] = useState([]);
    const [statsTitle, setStatsTitle] = useState('');
    const [isUserStatVisible, setIsUserStatVisible] = useState(false);
    const [statsGameName, setStatsGameName] = useState('');
    const [userEmail, setUserEmail] = useState();
    const [userStats, setUserStats] = useState([]);
    const client = generateClient();
    useEffect(() => {
        console.log("***useEffect***:  fetchUsers()");
        fetchUsers();
    }, []);
    function showUserStats(props) {
        window.scrollTo(0, 0);
        console.log("props.email: " + props.email);
        setIsUserStatVisible(true);
        setIsCoverScreenVisible(true);
        setUserEmail(props.email);
        userStatsFunction(props.email);
    }

    function hideUserStats() {
        setIsUserStatVisible(false);
        setIsCoverScreenVisible(false);
        console.log("IsUserStatVisible: " + isUserStatVisible);
        UserStatsView({title:"User Stats"});
    }
    async function deleteGameStatFunction(gameStatIDvar,userEmail) {
        console.log("gameStatIDvar: " + gameStatIDvar);
        const gameStatDetails = {
            id: gameStatIDvar,
        };
        const apiData3 = await API.graphql({
            query: deleteGameStats,
            variables: { input:gameStatDetails }
        });
        /* should probably delete all gamescores with this game stat */
        userStatsFunction(userEmail);
    }
    async function deleteGameScoreFunction(gameScoreIDvar,userEmail) {
        console.log("gameScoreIDvar: " + gameScoreIDvar);
        //  gameStopTimeByGameScoreID
        // deleteGameStopTime
        const apiDataGameStop = await client.graphql({
            query: gameStopTimeByGameScoreID,
            variables: {gameScoreID: gameScoreIDvar }
        });
        const apiData1 = apiDataGameStop.data.gameStopTimeByGameScoreID.items;
        if (apiData1.length>0) {
            apiData1.map(arrItem => {
                console.log("gamestop id: " + arrItem.id);
                deleteGameStopTimeFunction(arrItem.id)
            })
        }
        //gameHintTimeByGameScoreID
        //deleteGameHintTime
        const apiDataGameHint = await client.graphql({
            query: gameHintTimeByGameScoreID,
            variables: {gameScoreID: gameScoreIDvar }
        });
        const apiData2 = apiDataGameHint.data.gameHintTimeByGameScoreID.items;
        if (apiData2.length>0) {
            apiData2.map(arrItem => {
                console.log("gamehint id: " + arrItem.id);
                deleteGameHintTimeFunction(arrItem.id)
            })
        }

        const gameScoreDetails = {
            id: gameScoreIDvar,
        };
        const apiData3 = await client.graphql({
            query: deleteGameScore,
            variables: { input: gameScoreDetails }
        });
        userStatsFunction(userEmail);
    }
    //create item in createUserGamePlay
    async function createUserGamePlay(event) {
        event.preventDefault();
        const form = new FormData(event.target);
        const data = {
            gameId: form.get("GameID"),
            userId: form.get("UserID"),
        };
        await client.graphql({
            query: createUserGamePlay,
            variables: { input: data },
        });
        event.target.reset();
    }
    //create new user
    async function createUser(event) {
        event.preventDefault();
        const form = new FormData(event.target);
        const data = {
            userName: form.get("UserName"),
            email: form.get("Email"),
        };
        await client.graphql({
            query: createUser,
            variables: { input: data },
        });
        fetchUsers();
        event.target.reset();
    }
    async function deleteUser(props) {
        console.log("props.userID: " + props.userID);
        try {
            const userDetails = {
                id: props.userID
            };
            await client.graphql({
                query: mutations.deleteUser,
                variables: { input: userDetails }
            });
        } catch (err) {
            console.log('error deleting user:', err);
        }
        fetchUsers();
    }
    async function fetchUsers() {
        const apiData = await client.graphql({ query: listUsers });
        const usersFromAPI = apiData.data.listUsers.items;
        setUsers(usersFromAPI);
    }
    async function userStatsFunction(email) {
        console.log("user stats");
        let filter = {
            userEmail: {
                eq: userEmail
            }
        };
        const apiData = await client.graphql({
            query: gameStatsSortedByGameName,
            variables: {filter: filter, sortDirection: "DESC", type: "gameStats"}
        });
        const userStatsFromAPI = apiData.data.gameStatsSortedByGameName.items;
        setUserStats(userStatsFromAPI);
        setStatsTitle("User Stats");
        UserStatsView();
    }
    const UserStatsView = () => {
        console.log("title: " + statsTitle);
        let gameDetailClass = "all-screen hide-gradual";
        if (isUserStatVisible) {
            gameDetailClass = "all-screen show-gradual";
        }
        return (
            <View className={gameDetailClass}>
                <Button className="close-button" onClick={() => hideUserStats()}>X</Button>
                <Button className="button" onClick={() => showGameStats({"gameID": "3e8eb9fb-6b78-4c90-9a45-657125e4ced3", "gameName": "Thief"})}>
                    Game Stats - test - {statsGameName}</Button>
                <View
                    maxWidth="800px"
                    margin="10px auto 10px auto"
                >
                    <Heading level={2}>{statsTitle}</Heading>
                    <Heading level={5}>{userEmail}</Heading>
                    {userStats.map((userStat, index) => (
                        <View key={userStat.id}>
                            <Button onClick={() => deleteGameStatFunction(userStat.id,userEmail)} className="button button-small delete">Delete Stat for: {userStat.gameName}</Button>
                            <GameScoreView gameScoreArray = {userStat.gameScore.items} gameName={userStat.gameName} userEmail={userStat.userEmail}/>
                        </View>
                    ))}
                </View>
            </View>
        )
    }
    return (
        <>
            <View id="userSection" className="show section">
                <Heading level={3} color="black">Users</Heading>
            </View>
        <UserStatsView title={statsTitle}/>
        <View as="form" margin="3rem 0" onSubmit={createUserGamePlay}>
            <Flex direction="row" justifyContent="center">
                <TextField
                    name="GameID"
                    placeholder="Game ID"
                    label="Game ID"
                    labelHidden
                    variation="quiet"
                    required
                />
                <TextField
                    name="UserID"
                    placeholder="User ID"
                    label="User ID"
                    labelHidden
                    variation="quiet"
                    required
                />
                <Button type="submit" variation="primary">
                    createUserGamePlay
                </Button>
                <Button variation="primary">
                    createUserGamePlay
                </Button>
            </Flex>
            {users.map((user) => (
                <View key={user.id}>
                    <div><strong>user
                        id</strong>: {user.id} | <strong>email</strong>: {user.email} | <strong>userName</strong>: {user.userName}
                    </div>
                    <div><Button marginRight="5px" className="button"
                                 onClick={() => showUserStats({"email": user.email})}>User
                        Stat</Button>
                        <Button className="button"
                                onClick={() => deleteUser({"userID": user.id})}>Delete
                            User</Button>

                        <hr/>
                    </div>
                </View>
            ))}
            <View as="form" margin="3rem 0" onSubmit={createUser}>
                <Flex direction="row" justifyContent="center" gap="1rem">
                    <TextField
                        name="UserName"
                        placeholder="User Name"
                        label="User Name"
                        labelHidden
                        variation="quiet"
                        required
                    />
                    <TextField
                        name="Email"
                        placeholder="Email"
                        label="Type"
                        labelHidden
                        variation="quiet"
                        required
                    />
                    <Button marginBottom="10px" type="submit" variation="primary">
                        Create User
                    </Button>
                </Flex>
            </View>
        </View></>)
}