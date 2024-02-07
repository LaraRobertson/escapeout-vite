// components/Admin.jsx
import React, {useEffect, useState} from 'react';
import {
    Flex,
    Button,
    Heading,
    View,
    TextField,
    TextAreaField,
    SwitchField,
    Input,
    useAuthenticator
} from '@aws-amplify/ui-react';
import {
    gamesByCity,
    usersByEmail,
    listUsers, getGame, listGames,
    getGamePlayZone,getGameHint
} from "../graphql/queries";
import { format } from 'date-fns'
import * as mutations from '../graphql/mutations';

import { useNavigate } from 'react-router-dom';

import {generateClient} from "aws-amplify/api";
import { fetchUserAttributes } from 'aws-amplify/auth';

export function Admin() {
    const [email, setEmail] = useState();
    const [games, setGames] = useState([]);
    const [users, setUsers] = useState([]);
    const [userID, setUserID] = useState('');
    const [userStats, setUserStats] = useState([]);
    const [isUserStatVisible, setIsUserStatVisible] = useState(false);
    const [statsTitle, setStatsTitle] = useState('');
    const [statsGameName, setStatsGameName] = useState('');
    const [userEmail, setUserEmail] = useState();
    const [gameID, setGameID] = useState();
    const [gameName, setGameName] = useState();
    const [gameType, setGameType] = useState();
    const [disabledGame, setDisabledGame] = useState();


    const client = generateClient();
    const {  authStatus, user, route } = useAuthenticator((context) => [
        context.authStatus,
        context.user,
        context.route
    ]);
    const navigate = useNavigate();

    async function getUserGamePlay() {
        const apiData = await client.graphql({
            query: getUserGamePlay,
            variables: { gameId: "1"}
        });
        const gamesFromAPI = apiData.data.gamesByDate.items;
        /*await Promise.all(
            gamesFromAPI.map(async (game) => {
                if (game.gameImage) {
                    const url = await Storage.get(game.gameName);
                    game.gameImage = url;
                    console.log("url: " + url);
                }
                return game;
            })
        );*/
        // setGames(gamesFromAPI);
    }

    async function handleFetchUserAttributes(props) {
        try {
            const userAttributes = await fetchUserAttributes();
            console.log("userAttributes.email (home) " + userAttributes.email);
            setEmail(userAttributes.email);
        } catch (error) {
            console.log(error);
        }
    }
    const [gamesFilter, setGamesFilter] = useState({type: {eq:"game"}});
    function setFilterCreateGame(key, value) {
        console.log("setFilterCreateGame: " + key);
        if (key) {
            setGamesFilter({...gamesFilter, [key]: value})
        } else {
            setGamesFilter({type: {eq:"game"}});
            setDisabledGame();
            setGameType();
        }
    }
    async function fetchGames() {
        console.log("gamesFilter");
        for (const key in gamesFilter) {
            console.log(`${key}: ${gamesFilter[key]}`);
            for (const key1 in gamesFilter[key]) {
                console.log(`${key1}: ${gamesFilter[key][key1]}`);
                if (key === "gameType") {
                    setGameType(gamesFilter[key][key1] );
                }
                if (key === "disabled") {
                    setDisabledGame(gamesFilter[key][key1] );
                }
            }
        }
        try {
            const apiData = await client.graphql({
                query: listGames,
                variables: {filter: gamesFilter}
            });
            const gamesFromAPI = apiData.data.listGames.items;
            setGames(gamesFromAPI);
        } catch (err) {
            console.log('error fetching games', err);
        }
    }


    /* ADMIN */
    async function fetchUsers() {
        const apiData = await client.graphql({ query: listUsers });
        const usersFromAPI = apiData.data.listUsers.items;
        setUsers(usersFromAPI);
    }

    async function deleteGameHintTimeFunction(gameHintTimeID) {
        const data = {
            id: gameHintTimeID
        }
        await client.graphql({
            query: deleteGameHintTime,
            variables: { input: data },
        });
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

    async function deleteGame(props) {
        console.log("props.gameID: " + props.gameID);
        try {
        const gameDetails = {
            id: props.gameID
        };
            await client.graphql({
                query: mutations.deleteGame,
                variables: { input: gameDetails }
            });
        } catch (err) {
            console.log('error deleting games:', err);
        }
        fetchGames();
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
    /* GAME */
    const initialStateCreateGame = {
        gameName: '',
        gameType: '',
        gameLocationPlace: '',
        gameLocationCity: '',
        gameLink: '',
        gameImage: '',
        type: "game",
        gameDescriptionH2: '',
        gameDescriptionH3: '',
        gameDescriptionP: '',
        gameMap: '',
        gameIntro: '',
        gameGoals: '',
        disabled: false
    };
    const [formCreateGameState, setFormCreateGameState] = useState(initialStateCreateGame);
    function setInputCreateGame(key, value) {
        setFormCreateGameState({ ...formCreateGameState, [key]: value });
    }
    useEffect(() => {
        console.log("***useEffect***:  formCreateGameState");
        for (const key in formCreateGameState) {
            console.log(`${key}: ${formCreateGameState[key]}`);
        }
    }, [formCreateGameState]);

    async function showUpdateGame(props) {
        console.log("props.gameID: " + props.gameID);
        setGameID(props.gameID);
        /* first load up FormCreateGameState */
        try {
            const apiData = await client.graphql({
                query: getGame,
                variables: {id: props.gameID}
            });
            const gamesFromAPI = apiData.data.getGame;
            setFormCreateGameState(gamesFromAPI);
            console.log("gamesFromAPI - update game")
            for (const key in gamesFromAPI) {
                console.log(`${key}: ${gamesFromAPI[key]}`);
            }
            let element =  document.getElementById("updateGame");
            element.classList.remove('hide');
            element.classList.add('show');
            let element2 =  document.getElementById("createGame");
            element2.classList.remove('show');
            element2.classList.add('hide');
        } catch (err) {
            console.log('error fetching getGame', err);
        }
    }

    async function addGame() {
        try {
            if (!formCreateGameState.gameName || !formCreateGameState.gameLink) return;
            const game = { ...formCreateGameState };

            console.log("addGame: " + game);
            setGames([...games, game]);
            setFormCreateGameState(initialStateCreateGame);
            await client.graphql({
                query: mutations.createGame,
                variables: {
                    input: game
                }
            });
        } catch (err) {
            console.log('error creating games:', err);
        }
    }
    async function updateGame() {
        try {
            if (!formCreateGameState.gameName || !formCreateGameState.gameLink) return;
            const game = { ...formCreateGameState };
            console.log("formCreateGameState - update game")
            for (const key in game) {
                console.log(`${key}: ${game[key]}`);
            }
            setFormCreateGameState(initialStateCreateGame);
            delete game.updatedAt;
            delete game.user;
            delete game.__typename;
            delete game.gameHint;
            delete game.gamePlayZone;
            delete game.gamePuzzles;
            await client.graphql({
                query: mutations.updateGame,
                variables: {
                    input: game
                }
            });
            let element =  document.getElementById("updateGame");
            element.classList.remove('show');
            element.classList.add('hide');
            let element2 =  document.getElementById("createGame");
            element2.classList.remove('hide');
            element2.classList.add('show');
            fetchGames();

        } catch (err) {
            console.log('error updating games:', err);
        }
    }

    /* GamePLayZone */
    const initialStateCreateZone = {
        gameID: 'xxxx',
        gameZoneName: '',
        gameZoneImage: '',
        gameZoneDescription: '',
        order: 1,
        disabled: false
    };
    const [formCreateZoneState, setFormCreateZoneState] = useState(initialStateCreateZone);
    function setInputCreateZone(key, value) {
        setFormCreateZoneState({ ...formCreateZoneState, [key]: value });
    }
    useEffect(() => {
        console.log("***useEffect***:  formCreateZoneState");
        for (const key in formCreateZoneState) {
            console.log(`${key}: ${formCreateZoneState[key]}`);
        }
    }, [formCreateZoneState]);

    // createGamePlayZone
    async function addZone() {
        console.log("addZone");
        try {
            if (!formCreateZoneState.gameID || !formCreateZoneState.gameZoneName) return;
            const gameZone = { ...formCreateZoneState };
            console.log("addZone - gameZone: " + gameZone);
           // setGames([...games, game]);
            setFormCreateZoneState(initialStateCreateZone);
            await client.graphql({
                query: mutations.createGamePlayZone,
                variables: {
                    input: gameZone
                }
            });
        } catch (err) {
            console.log('error creating gamePlayZone:', err);
        }
    }
    async function showUpdateZone(props) {
        console.log("props.zoneID: " + props.zoneID);
        /* first load up FormCreateGameState */
        try {
            const apiData = await client.graphql({
                query: getGamePlayZone,
                variables: {id: props.zoneID}
            });
            const zonesFromAPI = apiData.data.getGamePlayZone;
            setFormCreateZoneState(zonesFromAPI);
            console.log("gamesFromAPI - update game")
            for (const key in zonesFromAPI) {
                console.log(`${key}: ${zonesFromAPI[key]}`);
            }
            let element =  document.getElementById("updateZone");
            element.classList.remove('hide');
            element.classList.add('show');
            let element2 =  document.getElementById("createZone");
            element2.classList.remove('show');
            element2.classList.add('hide');
        } catch (err) {
            console.log('error fetching getPlayZone', err);
        }
    }

    async function updateZone() {
        try {
            if (!formCreateZoneState.gameID|| !formCreateZoneState.gameZoneName) return;
            const gamePlayZone = { ...formCreateZoneState };
            console.log("formCreateZoneState - update gamePlayZone")
            for (const key in gamePlayZone) {
                console.log(`${key}: ${gamePlayZone[key]}`);
            }
            setFormCreateZoneState(initialStateCreateZone);
            delete gamePlayZone.updatedAt;
            delete gamePlayZone.__typename;
            await client.graphql({
                query: mutations.updateGamePlayZone,
                variables: {
                    input: gamePlayZone
                }
            });
            /* put the buttons back */
            let element =  document.getElementById("updateZone");
            element.classList.remove('show');
            element.classList.add('hide');
            let element2 =  document.getElementById("createZone");
            element2.classList.remove('hide');
            element2.classList.add('show');
            fetchGames();

        } catch (err) {
            console.log('error updating GamePlayZone:', err);
        }
    }
    /* end GamePlayZone */
    /* GameHint */
    const initialStateCreateHint = {
        gameID: 'xxxx',
        gameHintName: '',
        gameHintDescription: '',
        order: 1,
        disabled: false
    };
    const [formCreateHintState, setFormCreateHintState] = useState(initialStateCreateHint);
    function setInputCreateHint(key, value) {
        setFormCreateHintState({ ...formCreateHintState, [key]: value });
    }
    useEffect(() => {
        console.log("***useEffect***:  formCreateHintState");
        for (const key in formCreateHintState) {
            console.log(`${key}: ${formCreateHintState[key]}`);
        }
    }, [formCreateHintState]);
    // createGameHint
    async function addHint() {
        console.log("addHint");
        try {
            if (!formCreateHintState.gameID || !formCreateHintState.gameHintName) return;
            const gameHint = { ...formCreateHintState };
            console.log("addHint - gameHint: " + gameHint);
            // setGames([...games, game]);
            setFormCreateHintState(initialStateCreateHint);
            await client.graphql({
                query: mutations.createGameHint,
                variables: {
                    input: gameHint
                }
            });
        } catch (err) {
            console.log('error creating gameHint:', err);
        }
    }
    async function showUpdateHint(props) {
        console.log("props.hintID: " + props.hintID);
        /* first load up FormCreateGameState */
        try {
            const apiData = await client.graphql({
                query: getGameHint,
                variables: {id: props.hintID}
            });
            const hintsFromAPI = apiData.data.getGameHint;
            setFormCreateHintState(hintsFromAPI);
            console.log("hintsFromAPI - update hint")
            for (const key in hintsFromAPI) {
                console.log(`${key}: ${hintsFromAPI[key]}`);
            }
            let element =  document.getElementById("updateHint");
            element.classList.remove('hide');
            element.classList.add('show');
            let element2 =  document.getElementById("createHint");
            element2.classList.remove('show');
            element2.classList.add('hide');
        } catch (err) {
            console.log('error fetching getGameHint', err);
        }
    }

    async function updateHint() {
        try {
            if (!formCreateHintState.gameID|| !formCreateHintState.gameHintName) return;
            const gameHint = { ...formCreateHintState };
            console.log("formCreateHintState - update gameHint")
            for (const key in gameHint) {
                console.log(`${key}: ${gameHint[key]}`);
            }
            setFormCreateHintState(initialStateCreateHint);
            delete gameHint.updatedAt;
            delete gameHint.__typename;
            await client.graphql({
                query: mutations.updateGameHint,
                variables: {
                    input: gameHint
                }
            });
            /* change the buttons back */
            let element =  document.getElementById("updateHint");
            element.classList.remove('show');
            element.classList.add('hide');
            let element2 =  document.getElementById("createHint");
            element2.classList.remove('hide');
            element2.classList.add('show');
            fetchGames();

        } catch (err) {
            console.log('error updating GameHint:', err);
        }
    }
    /* END ADMIN

     */
    /* useEffects */
    /*
    So if you want to perform an action immediately after setting state on a state variable,
    we need to pass a callback function to the setState function.
    But in a functional component no such callback is allowed with useState hook.
    In that case we can use the useEffect hook to achieve it.
     */

    useEffect(() => {
        console.log("***useEffect***:  fetchGames()");
        fetchGames();
    }, [gamesFilter]);

    useEffect(() => {
        console.log("***useEffect***:  fetchUsers()");
        fetchUsers();
    }, []);

    useEffect(() => {
        if (user) {
            console.log("***useEffect***: handleFetchUserAttribues: " + user.userName);
            handleFetchUserAttributes({"userName": user.userName});
        }
    },[user]);

    const HeadingComponent = props => {
        console.log("props.userName: " + props);
        for (const key in props) {
            console.log(`${key}: ${ props[key]}`);
        }
        return (
            <Heading level={4} marginBottom="10px" color="black">Welcome {props.userName} </Heading>
        )
    }

    function showGameStats(props) {
        window.scrollTo(0, 0);
        console.log("props.gameName: " + props.gameName);
        setIsUserStatVisible(true);
        setIsCoverScreenVisible(true);
        gameStatsFunction({gameName:props.gameName});
    }
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
    async function gameStatsFunction(props) {
        console.log("game stats: " + props.gameName);

        const apiData = await client.graphql({
            query: gameStatsSortedByGameName,
            variables: {gameName: {eq:  props.gameName}, sortDirection: "ASC", type: "gameStats"}
        });
        const userStatsFromAPI = apiData.data.gameStatsSortedByGameName.items;
        setUserStats(userStatsFromAPI);
        setStatsTitle("Game Stats");
        setStatsGameName(props.gameName);
        UserStatsView();
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
    const GameScoreView = (props) => {
        console.log("gameScoreArray: " + JSON.stringify(props.gameScoreArray));
        return (
            <div className="table-container" role="table" aria-label="game score">
                <div className="flex-table header" role="rowgroup">
                    <div className="flex-row " role="columnheader">Team Name</div>
                    <div className="flex-row " role="columnheader">Team Score</div>
                    <div className="flex-row" role="columnheader">Stop Time</div>
                    <div className="flex-row" role="columnheader">Hint Time</div>
                    <div className="flex-row" role="columnheader">Completed/Played</div>
                </div>
                {props.gameScoreArray.map((score, index) => (
                    <div role="rowgroup" key={score.id}>
                        <div className="flex-table row">
                            <div className="flex-row first" role="cell"><Button onClick={() => deleteGameScoreFunction(score.id,props.userEmail)} className="button button-small delete">X</Button>  {score.teamName}</div>
                            <div className="flex-row " role="cell">{score.gameTotalTime}</div>
                            <div className="flex-row" role="cell">
                                {score.gameStopTime.items.map((gameStop,index) => (
                                    <div key={gameStop.id}>stop: {gameStop.gameStop}: {gameStop.gameStopTime}<br /></div>
                                ))}
                            </div>
                            <div className="flex-row" role="cell">
                                {score.gameHintTime.items.map((gameHint,index) => (
                                    <div key={gameHint.id}>stop: {gameHint.gameStop}: {gameHint.gameHintTime}<br /></div>
                                ))}
                            </div>
                            <div className="flex-row" role="cell">{score.completed ? ("true"):("false")}<br />{score.firstTime ? ("1st") :null}</div>
                        </div>
                        <div className="flex-table row">
                            <div className="flex-row four-width" role="cell">{props.userEmail}: "{score.gameComments}"</div>
                            <div className="flex-row" role="cell"> {format(new Date(score.updatedAt), "MM/dd/yyyy H:mma")}</div>
                        </div>
                    </div>
                ))}
            </div>
        )
    }

    const initialStateShowHideLabel = {
        gameForm: 'Hide',
        gameSection: 'Hide',
        userSection: 'Hide'
    };
    const [showHideLabel, setShowHideLabel] = useState(initialStateShowHideLabel)
    function divShowHide(divID) {
        console.log("divShowHide - divID: "+ divID)
        let element =  document.getElementById(divID);
        /* check if "hide */
        if (element.classList.contains("hide")) {
            console.log("hide is there");
            element.classList.remove('hide');
            element.classList.add('show');
            setShowHideLabel(showHideLabel => ({
                ...showHideLabel,
                [divID]:"Hide"
            }));
        } else if (element.classList.contains("show")) {
            console.log("show is there");
            element.classList.remove('show');
            element.classList.add('hide');
            setShowHideLabel(showHideLabel => ({
                ...showHideLabel,
                [divID]:"Show"
            }));
        }
    }
    useEffect(() => {
        console.log("***useEffect***:  showHideLabel");
        for (const key in showHideLabel) {
            console.log(`${key}: ${showHideLabel[key]}`);
        }
    }, [showHideLabel]);



    return (
            <View className="main-container" >
                <View className="main-content admin" >
                <HeadingComponent userName = {user.userName} />
                {email === "lararobertson70@gmail.com" ? (
                    <View>
                        <Heading level={3} color="black">Admin</Heading>
                        <View padding=".5rem 0">
                            <Button marginRight="5px" onClick={() => navigate('/')}>Home</Button>
                            <Button marginRight="5px" onClick={() => divShowHide("gameSection")}>{showHideLabel.gameSection} Games</Button>
                            <Button onClick={() =>  divShowHide("userSection")}>{showHideLabel.userSection} Users</Button>
                        </View>
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
                                <Button variation="primary" >
                                    createUserGamePlay
                                </Button>
                            </Flex>
                        </View>
                        <UserStatsView title={statsTitle} />
                        <View id="gameSection" className="show section">
                            <Heading level={3} color="black">Games</Heading>
                            <Button marginRight="5px" id="gameFormButton" backgroundColor="#B8CEF9" onClick={() => divShowHide("gameForm")}>{showHideLabel.gameForm} Form</Button>
                            <View>
                                <View id="gameForm" className="show" as="form" margin="3rem 0" >
                                    <View><strong>Game Form</strong></View>
                                    <Flex direction="row" justifyContent="center" gap="1rem">
                                        <SwitchField
                                            label="disabled"
                                            isChecked={formCreateGameState.disabled}
                                            onChange={(e) => {
                                                console.log("e.target.checked: " + e.target.checked)
                                                setInputCreateGame('disabled',e.target.checked);
                                            }}
                                        />
                                        <TextField
                                            onChange={(event) => setInputCreateGame('gameName', event.target.value)}
                                            name="gameName"
                                            placeholder="Game Name"
                                            label="Game Name"
                                            labelHidden
                                            variation="quiet"
                                            value={formCreateGameState.gameName}
                                            required
                                        />
                                        <TextField
                                            onChange={(event) => setInputCreateGame('gameType', event.target.value)}
                                            name="GameType"
                                            placeholder="free/not free"
                                            label="Game Type"
                                            labelHidden
                                            variation="quiet"
                                            value={formCreateGameState.gameType}
                                            required
                                        />
                                        <TextField
                                            onChange={(event) => setInputCreateGame('gameLink', event.target.value)}
                                            name="GameLink"
                                            placeholder="GameLink in app.js"
                                            label="Game Link"
                                            labelHidden
                                            variation="quiet"
                                            value={formCreateGameState.gameLink}
                                            required
                                        />
                                    </Flex>
                                    <Flex direction="column" justifyContent="center" gap="1rem">
                                        <TextField
                                            onChange={(event) => setInputCreateGame('gameLocationPlace', event.target.value)}
                                            name="GameLocationPlace"
                                            placeholder="Place"
                                            label="Game Location Place"
                                            labelHidden
                                            variation="quiet"
                                            value={formCreateGameState.gameLocationPlace}
                                            required
                                        />

                                        <TextField
                                            name="GameLocationCity"
                                            onChange={(event) => setInputCreateGame('gameLocationCity', event.target.value)}
                                            placeholder="City"
                                            label="Game Location City"
                                            labelHidden
                                            variation="quiet"
                                            value={formCreateGameState.gameLocationCity}
                                            required
                                        />

                                        <TextField
                                            onChange={(event) => setInputCreateGame('gameImage', event.target.value)}
                                            name="GameImage"
                                            placeholder="game Image"
                                            label="Game Image"
                                            labelHidden
                                            variation="quiet"
                                            value={formCreateGameState.gameImage}
                                        />
                                        <TextField
                                            onChange={(event) => setInputCreateGame('gameDescriptionH2', event.target.value)}
                                            name="GameDescriptionH2"
                                            placeholder="Game Description H2"
                                            label="Game Description H2"
                                            labelHidden
                                            variation="quiet"
                                            value={formCreateGameState.gameDescriptionH2}
                                            required
                                        />
                                        <TextField
                                            onChange={(event) => setInputCreateGame('gameDescriptionH3', event.target.value)}
                                            name="GameDescriptionH3"
                                            placeholder="Game Description H3"
                                            label="Game Description H3"
                                            labelHidden
                                            variation="quiet"
                                            value={formCreateGameState.gameDescriptionH3}
                                            required
                                        />
                                        <TextField
                                            onChange={(event) => setInputCreateGame('gameMap', event.target.value)}
                                            name="GameMap"
                                            placeholder="Game Map"
                                            label="Game Map"
                                            labelHidden
                                            variation="quiet"
                                            value={formCreateGameState.gameMap}
                                            required
                                        />

                                        <TextAreaField
                                            autoComplete="off"
                                            direction="column"
                                            hasError={false}
                                            isDisabled={false}
                                            isReadOnly={false}
                                            isRequired={false}
                                            labelHidden={false}
                                            name="GameDescriptionP"
                                            placeholder="Game Description P"
                                            rows="3"
                                            size="small"
                                            wrap="nowrap"
                                            value={formCreateGameState.gameDescriptionP}
                                            onChange={(e) => setInputCreateGame('gameDescriptionP', e.currentTarget.value)}
                                        />
                                        <TextAreaField
                                            autoComplete="off"
                                            direction="column"
                                            hasError={false}
                                            isDisabled={false}
                                            isReadOnly={false}
                                            isRequired={false}
                                            labelHidden={false}
                                            name="Game Intro"
                                            placeholder="Game Intro"
                                            rows="3"
                                            size="small"
                                            wrap="nowrap"
                                            value={formCreateGameState.gameIntro}
                                            onChange={(e) => setInputCreateGame('gameIntro', e.currentTarget.value)}
                                        />
                                        <TextField
                                            onChange={(event) => setInputCreateGame('gameGoals', event.target.value)}
                                            name="GameGoals"
                                            placeholder="Game Goals"
                                            label="Game Goals"
                                            labelHidden
                                            variation="quiet"
                                            value={formCreateGameState.gameGoals}
                                        />
                                    </Flex>
                                    <Flex direction="row" justifyContent="center" marginTop="20px">
                                        <Button id="createGame" className="show" onClick={addGame} variation="primary">
                                            Create Game
                                        </Button>
                                        <Button id="updateGame" className="hide" onClick={updateGame} variation="primary">
                                            Update Game
                                        </Button>
                                    </Flex>
                                </View>
                                <View id="gamePlayZoneForm" className="show" as="form" margin="3rem 0" >
                                    <View><strong>Game Play Zone Form</strong></View>

                                    <Flex direction="row" justifyContent="center" gap="1rem">
                                        <SwitchField
                                            label="disabled"
                                            isChecked={formCreateZoneState.disabled}
                                            onChange={(e) => {
                                                console.log("e.target.checked: " + e.target.checked)
                                                setInputCreateZone('disabled',e.target.checked);
                                            }}
                                        />
                                        <Input
                                            name="order"
                                            type="number"
                                            size="small"
                                            width="50px"
                                            onChange={(event) => setInputCreateZone('order', event.target.value)}
                                            value={formCreateZoneState.order}
                                        />
                                        <TextField
                                            onChange={(event) => setInputCreateZone('gameID', event.target.value)}
                                            name="gameID"
                                            placeholder="Game ID"
                                            label="Game ID"
                                            labelHidden
                                            variation="quiet"
                                            value={formCreateZoneState.gameID}
                                            required
                                        />
                                        <TextField
                                            onChange={(event) => setInputCreateZone('gameZoneName', event.target.value)}
                                            name="gameZoneName"
                                            placeholder="Game Zone Name"
                                            label="Game Zone Name"
                                            labelHidden
                                            variation="quiet"
                                            value={formCreateZoneState.gameZoneName}
                                            required
                                        />
                                    </Flex>
                                    <Flex direction="column" justifyContent="center" gap="1rem">

                                        <TextField
                                            name="GameLocationCity"
                                            onChange={(event) => setInputCreateZone('gameZoneImage', event.target.value)}
                                            placeholder="Game Zone Image"
                                            label="Game Zone Image"
                                            labelHidden
                                            variation="quiet"
                                            value={formCreateZoneState.gameZoneImage}
                                            required
                                        />
                                        <TextField
                                            onChange={(event) => setInputCreateZone('gameZoneDescription', event.target.value)}
                                            name="GameZoneDescription"
                                            placeholder="Game Zone Description"
                                            label="Game Zone Description"
                                            labelHidden
                                            variation="quiet"
                                            value={formCreateZoneState.gameZoneDescription}
                                            required
                                        />
                                    </Flex>
                                    <Flex direction="row" justifyContent="center" marginTop="20px">
                                        <Button id="createZone" className="show" onClick={addZone} variation="primary">
                                            Create Zone
                                        </Button>
                                        <Button id="updateZone" className="hide" onClick={updateZone} variation="primary">
                                            Update Zone
                                        </Button>
                                    </Flex>
                                </View>
                            <View id="gameHintForm" className="show" as="form" margin="3rem 0" >
                                <View><strong>Game Hint Form</strong></View>

                                <Flex direction="row" justifyContent="center" gap="1rem">
                                    <SwitchField
                                        label="disabled"
                                        isChecked={formCreateHintState.disabled}
                                        onChange={(e) => {
                                            console.log("e.target.checked: " + e.target.checked)
                                            setInputCreateHint('disabled',e.target.checked);
                                        }}
                                    />
                                    <Input
                                        name="order"
                                        type="number"
                                        size="small"
                                        width="50px"
                                        onChange={(event) => setInputCreateHint('order', event.target.value)}
                                        value={formCreateHintState.order}
                                    />
                                    <TextField
                                        onChange={(event) => setInputCreateHint('gameID', event.target.value)}
                                        name="gameID"
                                        placeholder="Game ID"
                                        label="Game ID"
                                        labelHidden
                                        variation="quiet"
                                        value={formCreateHintState.gameID}
                                        required
                                    />
                                    <TextField
                                        onChange={(event) => setInputCreateHint('gameHintName', event.target.value)}
                                        name="gameHintName"
                                        placeholder="Game Hint Name"
                                        label="Game Hint Name"
                                        labelHidden
                                        variation="quiet"
                                        value={formCreateHintState.gameHintName}
                                        required
                                    />
                                </Flex>
                                <Flex direction="column" justifyContent="center" gap="1rem">

                                    <TextField
                                        onChange={(event) => setInputCreateHint('gameHintDescription', event.target.value)}
                                        name="GameHintDescription"
                                        placeholder="Game Hint Description"
                                        label="Game Hint Description"
                                        labelHidden
                                        variation="quiet"
                                        value={formCreateHintState.gameHintDescription}
                                        required
                                    />
                                </Flex>
                                <Flex direction="row" justifyContent="center" marginTop="20px">
                                    <Button id="createHint" className="show" onClick={addHint} variation="primary">
                                        Create Hint
                                    </Button>
                                    <Button id="updateHint" className="hide" onClick={updateHint} variation="primary">
                                        Update Hint
                                    </Button>
                                </Flex>
                            </View>
                        </View>

                            <Button marginRight="5px" backgroundColor="#B8CEF9" onClick={() => setFilterCreateGame()}>All Games</Button>
                            <Button marginRight="5px" backgroundColor="#B8CEF9" onClick={() => setFilterCreateGame("disabled",{eq:false})}>live</Button>
                            <Button marginRight="5px" backgroundColor="#B8CEF9" onClick={() => setFilterCreateGame("disabled",{eq:true})}>disabled</Button>
                            <Button backgroundColor="#B8CEF9" onClick={() => setFilterCreateGame("gameType",{eq:"free"})}>Get Free Games</Button>
                            <View>type: "game"</View>
                            {(gameType) ? (<View>gameType: {gameType}</View>):null}
                            {(disabledGame === true)? (<View>disabled: true</View>):null}
                            {(disabledGame === false)? (<View>disabled: false</View>):null}

                            {games.map((game) => (
                                <div key={game.id}> <strong>disabled</strong>: { game.disabled ? "true":"false"} | <strong>type</strong>: {game.type} | <strong>game id</strong>: {game.id}
                                    <br /> <strong>game name</strong>: {game.gameName} | <strong>game type</strong>: {game.gameType} |
                                    <strong>game link</strong>: {game.gameLink}
                                    <br /><strong>gameLocationPlace</strong>: {game.gameLocationPlace} | <strong>gameLocationCity</strong>: {game.gameLocationCity}<br />
                                    <strong>gameDescriptionH2</strong>: {game.gameDescriptionH2} <br />
                                    <strong>gameDescriptionH3</strong>: {game.gameDescriptionH3} <br />
                                    <strong>gameDescriptionP</strong> {game.gameDescriptionP} <br />
                                    <strong>gameIntro: </strong>{game.gameIntro} <br />
                                    <strong>gameGoals: </strong>{game.gameGoals} <br />
                                    <strong>gameImage: </strong>{game.gameImage} <br />
                                   <strong>gameMap: </strong>{game.gameMap} <br />
                                    <strong>How many zones: {game.gamePlayZone.items.length}</strong><br />
                                    {game.gamePlayZone.items.map((zone) => (
                                        <View key={zone.id}>
                                            <strong>disabled</strong>: {zone.disabled ? "true" : "false"} | <strong>order: {zone.order} </strong> | <strong>gameZoneName: {zone.gameZoneName}</strong>
                                        <br /><Button marginRight="5px" className="button-small" onClick={() => showUpdateZone({"zoneID": zone.id})}>Update Zone</Button>
                                        </View>
                                    ))}
                                    <strong>Hints: {game.gameHint.items.length}</strong><br />
                                    {game.gameHint.items.map((hint) => (
                                        <View key={hint.id}>
                                            <strong>disabled</strong>: {hint.disabled ? "true" : "false"} | <strong>order: {hint.order} </strong> | <strong>hintName: {hint.gameHintName}</strong> <strong>hint Description: {hint.gameHintDescription}</strong>
                                            <br /><Button marginRight="5px" className="button-small" onClick={() => showUpdateHint({"hintID": hint.id})}>Update Hint</Button>
                                        </View>
                                    ))}
                                        <Button marginRight="5px" className="button" onClick={() => showGameStats({"gameID": game.id, "gameName": game.gameName})}>Game Stats</Button>
                                        <Button marginRight="5px" className="button" onClick={() => deleteGame({"gameID": game.id})}>Delete Game</Button>
                                        <Button marginRight="5px" className="button" onClick={() => showUpdateGame({"gameID": game.id})}>Update Game</Button>
                                        <Button marginRight="5px" className="button" onClick={() => setInputCreateZone('gameID',game.id)}>Add Game Play Zone</Button>
                                        <Button marginRight="5px" className="button" onClick={() => setInputCreateHint('gameID',game.id)}>Add Game Hint</Button>
                                    <hr />
                                </div>

                            ))}
                        </View>
                        <View id="userSection" className="show section">
                        <Heading level={3} color="black">Users</Heading>

                            {users.map((user) => (
                                <View key={user.id}>
                                    <div><strong>user id</strong>: {user.id} | <strong>email</strong>: {user.email} | <strong>userName</strong>: {user.userName}
                                    </div>
                                    <div><Button marginRight="5px" className="button" onClick={() => showUserStats({"email": user.email})}>User Stat</Button>
                                        <Button className="button" onClick={() => deleteUser({"userID": user.id})}>Delete User</Button>

                                        <hr />
                                    </div>
                                </View>
                            ))}
                        </View>


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


                    </View>) : (<div></div>)
                }
                </View>
            </View>
    );
}