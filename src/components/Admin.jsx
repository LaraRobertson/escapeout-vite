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
    useAuthenticator, Image
} from '@aws-amplify/ui-react';
import {
    gamesByCity,
    usersByEmail,
    listUsers, getGame, listGames,
    getGamePlayZone,getGameHint,getGameClue, getGamePuzzle,
    getTextField
} from "../graphql/queries";
import { format } from 'date-fns'
import * as mutations from '../graphql/mutations';

import { useNavigate } from 'react-router-dom';

import {generateClient} from "aws-amplify/api";
import { fetchUserAttributes } from 'aws-amplify/auth';
import {deleteGameHint} from "../graphql/mutations";
import { saveAs } from 'file-saver';
/* backups - manual */
import * as backups from "../backups/backups";
import data from '../backups/data.json';
import data2 from '../backups/SecretPapersAll.json';

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
    const [gameVisible, setGameVisible] = useState("");
    const [gamePlayZoneObject, setGamePlayZoneObject] = useState({});
    const [gameFormVisible, setGameFormVisible] = useState(false);
    const [gameZoneFormVisible, setGameZoneFormVisible] = useState(false);
    const [gameHintFormVisible, setGameHintFormVisible] = useState(false);
    const [gameClueFormVisible, setGameClueFormVisible] = useState(false);
    const [gamePuzzleFormVisible, setGamePuzzleFormVisible] = useState(false);
    const [gameTextFieldFormVisible, setGameTextFieldFormVisible] = useState(false);
    const [backupsVisible, setBackupsVisible] = useState(false);

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
    async function deleteZone(props) {
        console.log("props.zoneID: " + props.zoneID);
        try {
            const zoneDetails = {
                id: props.zoneID
            };
            await client.graphql({
                query: mutations.deleteGamePlayZone,
                variables: { input:zoneDetails }
            });
        } catch (err) {
            console.log('error deleting zone:', err);
        }
        fetchGames();
    }

    async function deleteHint(props) {
        console.log("props.hintID: " + props.hintID);
        try {
            const hintDetails = {
                id: props.hintID
            };
            await client.graphql({
                query: mutations.deleteGameHint,
                variables: { input: hintDetails }
            });
        } catch (err) {
            console.log('error deleting hint:', err);
        }
        fetchGames();
    }

    async function deleteClue(props) {
        console.log("props.clueID: " + props.clueID);
        try {
            const clueDetails = {
                id: props.clueID
            };
            await client.graphql({
                query: mutations.deleteGameClue,
                variables: { input: clueDetails }
            });
        } catch (err) {
            console.log('error deleting clue:', err);
        }
        fetchGames();
    }
    async function deletePuzzle(props) {
        console.log("props.puzzleID: " + props.puzzleID);
        try {
            const puzzleDetails = {
                id: props.puzzleID
            };
            await client.graphql({
                query: mutations.deleteGamePuzzle,
                variables: { input: puzzleDetails }
            });
        } catch (err) {
            console.log('error deleting puzzle:', err);
        }
        fetchGames();
    }
    async function deleteTextField(props) {
        console.log("props.textFieldID: " + props.textFieldID);
        try {
            const textFieldDetails = {
                id: props.textFieldID
            };
            await client.graphql({
                query: mutations.deleteTextField,
                variables: { input: textFieldDetails  }
            });
        } catch (err) {
            console.log('error deleting textField:', err);
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
        gameDesigner: '',
        gameLevel: '',
        walkingDistance: '',
        gameImage: '',
        gameWinMessage: '',
        gameWinImage: '',
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
            setGameFormVisible(true);
            /*for (const key in gamesFromAPI) {
                console.log(`${key}: ${gamesFromAPI[key]}`);
            }*/
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
    async function addGameFromFile() {
        try {
        const gameString = '{"gameName":"Disc Golf Hunt and Think2","gameDescriptionH2":"You want to play disc golf but have no discs.",' +
            '"gameDescriptionH3":"Try and find some discs!",' +
            '"gameDescriptionP":"This is a level 2 game. It is a short game with some logic. There are 2 play zones.",' +
            '"gameLocationPlace":"Jaycee Park","gameLocationPlaceDetails":null,"gameLocationCity":"Tybee Island",' +
            '"gameDesigner":"EscapeOut.games","gameLevel":"level 2","walkingDistance":"500 feet","playZones":null,' +
            '"gameImage":"https://escapeoutbucket213334-staging.s3.amazonaws.com/public/Jaycee-Park-Game-Image.jpg",' +
            '"gameType":"free","gameWinMessage":"Great Job On Winning!!!","gameWinImage":null,"gameGoals":"Find Discs!",' +
            '"gameIntro":"Discs are hidden somewhere.  Use the clues to find the discs.",' +
            '"gameMap":"https://escapeoutbucket213334-staging.s3.amazonaws.com/public/game-maps/jaycee-park-2pz-map.jpg",' +
            '"type":"game","createdAt":"2024-01-07T20:21:02.214Z","disabled":false}'
            console.log("addGame: " + gameString);
            await client.graphql({
                query: mutations.createGame,
                variables: {
                    input: JSON.parse(gameString)
                }
            });
            fetchGames();
        } catch (err) {
            console.log('error creating games:', err);
        }
    }
     async function addGame() {
        try {
            if (!formCreateGameState.gameName ) return;
            const game = { ...formCreateGameState };

            console.log("addGame: " + game);
           /* setGames([...games, game]);*/
            setFormCreateGameState(initialStateCreateGame);
            await client.graphql({
                query: mutations.createGame,
                variables: {
                    input: game
                }
            });
            setGameFormVisible(false);
            fetchGames();
        } catch (err) {
            console.log('error creating games:', err);
        }
    }
    async function updateGame() {
        console.log("updateGame: " + formCreateGameState.gameName)
        try {
            if (!formCreateGameState.gameName) return;
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
            delete game.gameClue;
            delete game.gamePuzzle;
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
        setGameFormVisible(false);
    }

    /* GamePLayZone */
    const initialStateCreateZone = {
        gameID: 'xxxx',
        gameZoneName: '',
        gameZoneImage: '',
        gameZoneIcon: '',
        gameZoneDescription: '',
        order: 1,
        disabled: false
    };
    const [formCreateZoneState, setFormCreateZoneState] = useState(initialStateCreateZone);
    function setInputCreateZoneInitial(key, value) {
        setFormCreateZoneState({ ...initialStateCreateZone, [key]: value });
        setGameZoneFormVisible(true);
    }
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
            setGameZoneFormVisible(false);
            fetchGames();
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
            setGameZoneFormVisible(true);
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
            setGameZoneFormVisible(false);
            fetchGames();

        } catch (err) {
            console.log('error updating GamePlayZone:', err);
        }
    }
    /* end GamePlayZone */
    /* GameHint */

    const initialStateCreateHint = {
        gameID: 'xxxx',
        gamePlayZoneID: '',
        gameHintName: '',
        gameHintDescription: '',
        order: 1,
        disabled: false
    };
    const [formCreateHintState, setFormCreateHintState] = useState(initialStateCreateHint);
    function setInputCreateHintInitial(key1, value1, key2, value2) {
        setFormCreateHintState({ ...formCreateHintState, [key1]: value1, [key2]: value2});
        setGameHintFormVisible(true);
    }
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
            setGameHintFormVisible(true);
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

    /* GameClue */
    const initialStateCreateClue = {
        gameID: 'xxx',
        gamePlayZoneID: '',
        gameClueName: '',
        gameClueIcon: '',
        gameClueImage: '',
        gameClueText: '',
        gameCluePosition: '',
        order: 1,
        disabled: false
    };
    const [formCreateClueState, setFormCreateClueState] = useState(initialStateCreateClue);
    function setInputCreateClueInitial(key1, value1, key2, value2) {
        let element =  document.getElementById("updateClue");
        element.classList.remove('show');
        element.classList.add('hide');
        let element2 =  document.getElementById("createClue");
        element2.classList.remove('hide');
        element2.classList.add('show');
        console.log("formCreateClueInitial: " + key1 + "|" + value1 + "|" + key2 + "|" + value2 );
        setFormCreateClueState({ ...formCreateClueState, [key1]: value1, [key2]: value2});
        setGameClueFormVisible(true);
    }

    function setInputCreateClue(key, value) {
        console.log("setInputCreateClue: " + key +"|" + value);
        setFormCreateClueState({ ...formCreateClueState, [key]: value });
    }
    useEffect(() => {
        console.log("***useEffect***:  formCreateClueState");
        for (const key in formCreateClueState) {
            console.log(`${key}: ${formCreateClueState[key]}`);
        }
    }, [formCreateClueState]);

    // create clue
    async function addClue() {
        console.log("addClue");
        try {
            if (!formCreateClueState.gameID || !formCreateClueState.gameClueName) return;
            const gameClue = { ...formCreateClueState };
            console.log("addClue - gameClue: " + gameClue);
            setFormCreateClueState(initialStateCreateClue);
            await client.graphql({
                query: mutations.createGameClue,
                variables: {
                    input: gameClue
                }
            });
            setGameClueFormVisible(false);
            setFormCreateClueState(initialStateCreateClue);
            fetchGames();
        } catch (err) {
            console.log('error creating gameClue:', err);
        }
    }
    async function showUpdateClue(props) {
        console.log("props.clueID: " + props.clueID);
        /* first load up FormCreateGameState */
        try {
            const apiData = await client.graphql({
                query: getGameClue,
                variables: {id: props.clueID}
            });
            const cluesFromAPI = apiData.data.getGameClue;
            setFormCreateClueState(cluesFromAPI);
            console.log("cluesFromAPI - update clue")
            for (const key in cluesFromAPI) {
                console.log(`${key}: ${cluesFromAPI[key]}`);
            }
            let element =  document.getElementById("updateClue");
            element.classList.remove('hide');
            element.classList.add('show');
            let element2 =  document.getElementById("createClue");
            element2.classList.remove('show');
            element2.classList.add('hide');
            setGameClueFormVisible(true);
        } catch (err) {
            console.log('error fetching getGameClue', err);
        }
    }

    async function updateClue() {
        try {
            if (!formCreateClueState.gameID|| !formCreateClueState.gamePlayZoneID) return;
            const gameClue = { ...formCreateClueState };
            console.log("formCreateClueState - update gameClue")
            for (const key in gameClue) {
                console.log(`${key}: ${gameClue[key]}`);
            }
            setFormCreateClueState(initialStateCreateClue);
            delete gameClue.updatedAt;
            delete gameClue.__typename;
            await client.graphql({
                query: mutations.updateGameClue,
                variables: {
                    input: gameClue
                }
            });
            /* change the buttons back */
            /* use state variable? */
            let element =  document.getElementById("updateClue");
            element.classList.remove('show');
            element.classList.add('hide');
            let element2 =  document.getElementById("createClue");
            element2.classList.remove('hide');
            element2.classList.add('show');
            setGameClueFormVisible(false);
            setFormCreateClueState(initialStateCreateClue);
            fetchGames();

        } catch (err) {
            console.log('error updating GameClue:', err);
        }
    }


    /* Game Puzzle */
    const initialStateCreatePuzzle = {
        gameID: 'xxx',
        gamePlayZoneID: '',
        puzzleName: '',
        puzzlePosition: '',
        puzzleImage: '',
        puzzleImageOpen: '',
        puzzleImageSolved: '',
        puzzleClueRevealed: '',
        puzzleClueText: '',
        puzzleToolRevealed: '',
        puzzleToolNeeded: '',
        winGameImage: '',
        winGameMessage: '',
        winGame: false,
        order: 0,
        disabled: false
    };
    const [formCreatePuzzleState, setFormCreatePuzzleState] = useState(initialStateCreatePuzzle);
    function setInputCreatePuzzleInitial(key1, value1, key2, value2) {
        let element =  document.getElementById("updatePuzzle");
        element.classList.remove('show');
        element.classList.add('hide');
        let element2 =  document.getElementById("createPuzzle");
        element2.classList.remove('hide');
        element2.classList.add('show');
        console.log("formCreatePuzzleInitial: " + key1 + "|" + value1 + "|" + key2 + "|" + value2 );
        let dynamicObject = {
            [key1]: value1,
            [key2]: value2,
            puzzleName: '',
            puzzlePosition: '',
            puzzleImage: '',
            puzzleImageOpen: '',
            puzzleImageSolved: '',
            puzzleToolRevealed: '',
            puzzleToolNeeded: '',
            winGameImage: '',
            winGameMessage: '',
            winGame: false,
            order: 0,
            disabled: false
        };
        setFormCreatePuzzleState(dynamicObject);
        setGamePuzzleFormVisible(true);
    }

    function setInputCreatePuzzle(key, value) {
        console.log("setInputCreatePuzzle: " + key +"|" + value);
        setFormCreatePuzzleState({ ...formCreatePuzzleState, [key]: value });
    }
    useEffect(() => {
        console.log("***useEffect***:  formCreatePuzzleState");
        for (const key in formCreatePuzzleState) {
            console.log(`${key}: ${formCreatePuzzleState[key]}`);
        }
    }, [formCreatePuzzleState]);
    // create puzzle
    async function addPuzzle() {
        console.log("addPuzzle");
        try {
            if (!formCreatePuzzleState.gameID || !formCreatePuzzleState.puzzleName) return;
            const gamePuzzle = { ...formCreatePuzzleState };
            console.log("addPuzzle - gamePuzzle: " + JSON.stringify(gamePuzzle));
            setFormCreatePuzzleState(initialStateCreatePuzzle);
            await client.graphql({
                query: mutations.createGamePuzzle,
                variables: {
                    input: gamePuzzle
                }
            });
            setGamePuzzleFormVisible(false);
            setFormCreatePuzzleState(initialStateCreatePuzzle);
            fetchGames();
        } catch (err) {
            console.log('error creating gamePuzzle:', err);
        }
    }
    async function showUpdatePuzzle(props) {
        console.log("props.puzzleID: " + props.puzzleID);
        /* first load up FormCreateGameState */
        try {
            const apiData = await client.graphql({
                query: getGamePuzzle,
                variables: {id: props.puzzleID}
            });
            const puzzlesFromAPI = apiData.data.getGamePuzzle;
            setFormCreatePuzzleState(puzzlesFromAPI);
            console.log("puzzleFromAPI - update puzzle")
            for (const key in puzzlesFromAPI) {
                console.log(`${key}: ${puzzlesFromAPI[key]}`);
            }
            let element =  document.getElementById("updatePuzzle");
            element.classList.remove('hide');
            element.classList.add('show');
            let element2 =  document.getElementById("createPuzzle");
            element2.classList.remove('show');
            element2.classList.add('hide');
            setGamePuzzleFormVisible(true);
        } catch (err) {
            console.log('error fetching getGamePuzzle', err);
        }
    }

    async function updatePuzzle() {
        try {
            if (!formCreatePuzzleState.gameID|| !formCreatePuzzleState.gamePlayZoneID) return;
            const gamePuzzle = { ...formCreatePuzzleState };
            console.log("formCreatePuzzleState - update gamePuzzle")
            for (const key in gamePuzzle) {
                console.log(`${key}: ${gamePuzzle[key]}`);
            }
            setFormCreatePuzzleState(initialStateCreatePuzzle);
            delete gamePuzzle.textField;
            delete gamePuzzle.updatedAt;
            delete gamePuzzle.__typename;
            await client.graphql({
                query: mutations.updateGamePuzzle,
                variables: {
                    input: gamePuzzle
                }
            });
            /* change the buttons back */
            /* use state variable? */
            let element =  document.getElementById("updatePuzzle");
            element.classList.remove('show');
            element.classList.add('hide');
            let element2 =  document.getElementById("createPuzzle");
            element2.classList.remove('hide');
            element2.classList.add('show');
            setGamePuzzleFormVisible(false);
            setFormCreatePuzzleState(initialStateCreatePuzzle);
            fetchGames();

        } catch (err) {
            console.log('error updating GamePuzzle:', err);
        }
    }
    /* end puzzle */

    /* textField */
    const initialStateCreateTextField = {
        puzzleID: 'xxxx',
        name: '',
        label: '',
        answer: '',
        order: 1,
        disabled: false
    };
    const [formCreateTextFieldState, setFormCreateTextFieldState] = useState(initialStateCreateTextField);
    function setInputCreateTextFieldInitial(key, value) {
        setFormCreateTextFieldState({ ...initialStateCreateTextField, [key]: value });
        let element =  document.getElementById("updateTextField");
        element.classList.remove('show');
        element.classList.add('hide');
        let element2 =  document.getElementById("createTextField");
        element2.classList.remove('hide');
        element2.classList.add('show');
        setGameTextFieldFormVisible(true);
    }
    function setInputCreateTextField(key, value) {
        setFormCreateTextFieldState({ ...formCreateTextFieldState, [key]: value });
        setGameTextFieldFormVisible(true);
    }
    useEffect(() => {
        console.log("***useEffect***:  formCreateTextFieldState");
        for (const key in formCreateTextFieldState) {
            console.log(`${key}: ${formCreateTextFieldState[key]}`);
        }
    }, [formCreateTextFieldState]);

    // createTextField
    async function addTextField() {
        console.log("addTextField");
        try {
            if (!formCreateTextFieldState.puzzleID || !formCreateTextFieldState.name) return;
            const gameTextField = { ...formCreateTextFieldState };
            console.log("addZone - gameTextField: " + gameTextField);
            // setGames([...games, game]);
            setFormCreateTextFieldState(initialStateCreateTextField);
            await client.graphql({
                query: mutations.createTextField,
                variables: {
                    input: gameTextField
                }
            });
            setGameTextFieldFormVisible(false);
            fetchGames();
        } catch (err) {
            console.log('error creating gameTextField:', err);
        }
    }
    async function showUpdateTextField(props) {
        console.log("props.textFieldID: " + props.textField);
        /* first load up FormCreateGameState */
        try {
            const apiData = await client.graphql({
                query: getTextField,
                variables: {id: props.textFieldID}
            });
            const textFieldFromAPI = apiData.data.getTextField;
            setFormCreateTextFieldState(textFieldFromAPI);
            console.log("gamesFromAPI - update game")
            for (const key in textFieldFromAPI) {
                console.log(`${key}: ${textFieldFromAPI[key]}`);
            }
            let element =  document.getElementById("updateTextField");
            element.classList.remove('hide');
            element.classList.add('show');
            let element2 =  document.getElementById("createTextField");
            element2.classList.remove('show');
            element2.classList.add('hide');
            setGameTextFieldFormVisible(true);
        } catch (err) {
            console.log('error fetching getTextField', err);
        }
    }

    async function updateTextField() {
        console.log("updateTextField");
        try {
            if (!formCreateTextFieldState.puzzleID|| !formCreateTextFieldState.name) return;
            const gameTextField = { ...formCreateTextFieldState };
            console.log("formCreateTextFieldState - update gameTextField")
            for (const key in gameTextField) {
                console.log(`${key}: ${gameTextField[key]}`);
            }
            setFormCreateTextFieldState(initialStateCreateTextField);
            delete gameTextField.updatedAt;
            delete gameTextField.__typename;
            await client.graphql({
                query: mutations.updateTextField,
                variables: {
                    input: gameTextField
                }
            });
            /* put the buttons back */
            let element =  document.getElementById("updateTextField");
            element.classList.remove('show');
            element.classList.add('hide');
            let element2 =  document.getElementById("createTextField");
            element2.classList.remove('hide');
            element2.classList.add('show');
            setGameTextFieldFormVisible(false);
            fetchGames();

        } catch (err) {
            console.log('error updating GameTextField:', err);
        }
    }
    /* end TextField */

    function setGameVisibleFunction(gameID,index) {
        setGameVisible(gameID);
        console.log("games[index].gamePlayzone.items: " + JSON.stringify(games[index].gamePlayZone.items));
        let newObject = {};
        for (let i=0; i<games[index].gamePlayZone.items.length; i++) {
            let key = "id-" + games[index].gamePlayZone.items[i].id;
            let value = games[index].gamePlayZone.items[i].gameZoneName;
            newObject = {...newObject,[key]:value};
        }
       setGamePlayZoneObject(newObject);
    }

    useEffect(() => {
        console.log("***useEffect***: gamePlayZoneObject: " + JSON.stringify(gamePlayZoneObject));
        for (const key in gamePlayZoneObject) {
            console.log(`${key}: ${ gamePlayZoneObject[key]}`);
        }
    }, [gamePlayZoneObject]);
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
        userSection: 'Hide',
        clueSection: 'Hide',
        puzzleSection: 'Hide',
        toolSection: 'Hide',
        imageSection: 'Hide'
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

    async function copyGame(props) {
        console.log("gameName: " + props.gameName);
        const fileName1 = props.gameName + ".txt";
        const fileName2 = props.gameName + "-All.json";
        try {
            const apiData = await client.graphql({
                query: getGame,
                variables: {id: props.gameID}
            });
            const gamesFromAPI = apiData.data.getGame;
           /* const fs = require('fs');
            fs.writeFileSync(
                'data.json',
                JSON.stringify(objJson)
            )*/
            const file = new Blob([apiData], { type: 'application/json' });
            saveAs(file, fileName2);
            /*delete gamesFromAPI.updatedAt;
            delete gamesFromAPI.user;
            delete gamesFromAPI.__typename;
            delete gamesFromAPI.gameHint;
            delete gamesFromAPI.gamePlayZone;
            delete gamesFromAPI.gameClue;
            delete gamesFromAPI.gamePuzzle;*/
            delete gamesFromAPI.id;
            const file2 = new Blob([JSON.stringify(gamesFromAPI)], { type: 'text/plain;charset=utf-8' });
            saveAs(file2, fileName1);
        } catch (err) {
            console.log('error fetching getGame', err);
        }

    }

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
                            <Button marginRight="5px" onClick={() =>  divShowHide("userSection")}>{showHideLabel.userSection} Users</Button>
                            <Button marginRight="5px" onClick={() => divShowHide("imageSection")}>{showHideLabel.imageSection} Images</Button>
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
                        <View id={"imageSection"} className={"show section"}>
                            <Button marginRight="5px" onClick={() => divShowHide("toolSection")}>{showHideLabel.toolSection} Tools</Button>
                            <Button marginRight="5px" onClick={() =>  divShowHide("clueSection")}>{showHideLabel.clueSection} Clues</Button>
                            <Button marginRight="5px" onClick={() => divShowHide("puzzleSection")}>{showHideLabel.puzzleSection} Puzzles</Button>

                            <View id={"toolSection"} className={"show section"}>
                                <strong>tool section</strong><br />
                                <Image src={"https://escapeoutbucket213334-staging.s3.amazonaws.com/public/object-tools/discs.png"} /><br />
                                "discs": https://escapeoutbucket213334-staging.s3.amazonaws.com/public/object-tools/discs.png
                                <hr />
                                <Image src={"https://escapeoutbucket213334-staging.s3.amazonaws.com/public/object-tools/key.png"} /><br />
                                "key": https://escapeoutbucket213334-staging.s3.amazonaws.com/public/object-tools/key.png
                                <hr />
                            </View>
                            <View id={"clueSection"} className={"show section"}>
                                <strong>clue section</strong><br />
                            </View>
                            <View id={"puzzleSection"} className={"show section"}>
                                <strong>puzzle section</strong><br />
                            </View>

                        </View>
                        <View id="gameSection" className="show section">
                            <Heading level={3} color="black">Games</Heading>

                            <Button marginRight="5px" backgroundColor="#B8CEF9" onClick={() => setFilterCreateGame()}>All Games</Button>
                            <Button marginRight="5px" backgroundColor="#B8CEF9" onClick={() => setFilterCreateGame("disabled",{eq:false})}>live</Button>
                            <Button marginRight="5px" backgroundColor="#B8CEF9" onClick={() => setFilterCreateGame("disabled",{eq:true})}>disabled</Button>
                            <Button backgroundColor="#B8CEF9" onClick={() => setFilterCreateGame("gameType",{eq:"free"})}>Get Free Games</Button>
                            <View>type: "game"</View>
                            {(gameType) ? (<View>gameType: {gameType}</View>):null}
                            {(disabledGame === true)? (<View>disabled: true</View>):null}
                            {(disabledGame === false)? (<View>disabled: false</View>):null}
                            <Button className={"show-button blue-duke"} onClick={() => {setFormCreateGameState(initialStateCreateGame);setGameFormVisible(true)}}>add game</Button>
                            (<Button className={"show-button blue-duke small"} onClick={() => addGameFromFile()}>add game from file (paste text)</Button>)
                            <br /><Button className={"show-button blue-duke"} onClick={() =>  setBackupsVisible(true)}>Show Backups</Button>
                            {games.map((game,index) => (
                                <View key={game.id} >
                                    <View className={(gameVisible==game.id)? "hide" : "show"}>

                                        <Button className={"show-button blue-duke"} onClick={() => setGameVisibleFunction(game.id,index)}>show game detail:</Button>
                                        <strong>name</strong>: {game.gameName} | <strong>type</strong>: {game.gameType} | <strong>place</strong>: {game.gameLocationPlace} | <strong>city</strong>: {game.gameLocationCity}|<strong>disabled</strong>: { game.disabled ? "true":"false"}
                                    </View>
                                    <View className={(gameVisible==game.id)? "show" : "hide"}>
                                        <hr />
                                        <Button marginRight="5px" className="button" onClick={() => showGameStats({"gameID": game.id, "gameName": game.gameName})}>Game Stats</Button>
                                        <Button marginRight="5px" className="button" onClick={() => deleteGame({"gameID": game.id})}>Delete Game</Button>
                                        <Button marginRight="5px" className="button" onClick={() => showUpdateGame({"gameID": game.id})}>Update Game</Button>
                                        <Button marginRight="5px" className="button" onClick={() => copyGame({"gameID": game.id, "gameName": game.gameName})}>Copy Game</Button>
                                        <Button marginRight="5px" className="button" onClick={() => setInputCreateZoneInitial('gameID',game.id)}>Add Game Play Zone</Button>
                                        <br />
                                        <Button className={"show-button blue-duke"} onClick={() => setGameVisible("")}>close game:</Button>
                                        <strong>name</strong>: {game.gameName} | <strong>type</strong>: {game.gameType} | <strong>place</strong>: {game.gameLocationPlace} | <strong>city</strong>: {game.gameLocationCity}|<strong>disabled</strong>: { game.disabled ? "true":"false"}
                                        <br /><strong>game id</strong>: {game.id}| <strong>game level</strong>: {game.gameLevel}
                                        <br />
                                    <strong>gameDescriptionH2</strong>: {game.gameDescriptionH2} <br />
                                    <strong>gameDescriptionH3</strong>: {game.gameDescriptionH3} <br />
                                    <strong>gameDescriptionP</strong> {game.gameDescriptionP} <br />
                                    <strong>gameIntro: </strong>{game.gameIntro} <br />
                                    <strong>gameGoals: </strong>{game.gameGoals} <br />
                                        <strong>gameLevels: </strong>{game.gameLevels} <br />
                                        <strong>gameDesigner: </strong>{game.gameDesigner} <br />
                                        <strong>walkingDistance: </strong>{game.walkingDistance} <br />
                                    <strong>gameImage: </strong><Image src={game.gameImage} /> <br />
                                        <strong>gameWinMessage: </strong>{game.gameWinMessage} <br />
                                    <strong>gameMap: </strong>{game.gameMap} <br />
                                        <hr />
                                    <strong>How many zones: {game.gamePlayZone.items.length}</strong><br />
                                    {game.gamePlayZone.items.map((zone) => (
                                        <View key={zone.id}>
                                            <strong>name:</strong> {zone.gameZoneName} | <strong>disabled</strong>: {zone.disabled ? "true" : "false"} | <strong>order: </strong>{zone.order}<br />
                                            <Image src={zone.gameZoneIcon}/><Image src={zone.gameZoneImage}/>
                                            <br />
                                            <Button marginRight="5px" className="button-small" onClick={() => showUpdateZone({"zoneID": zone.id})}>Update Zone</Button>
                                            <Button marginRight="5px" className="button-small" onClick={() => deleteZone({"zoneID": zone.id})}>Delete Zone</Button>
                                            <Button marginRight="5px" className="button-small" onClick={() => setInputCreateHintInitial('gameID',game.id,'gamePlayZoneID',zone.id)}>Add Game Hint</Button>
                                            <Button marginRight="5px" className="button-small" onClick={() => setInputCreateClueInitial('gameID',game.id,'gamePlayZoneID',zone.id)}>Add Clue</Button>
                                            <Button marginRight="5px" className="button-small" onClick={() => setInputCreatePuzzleInitial('gameID',game.id,'gamePlayZoneID',zone.id)}>Add Puzzle</Button>
                                        </View>
                                    ))}
                                        <hr />
                                        <strong>Puzzles: {game.gamePuzzle.items.length}</strong><br />
                                        {game.gamePuzzle.items.map((puzzle) => (
                                            <View key={puzzle.id}>
                                                <strong>puzzle name:</strong>  {puzzle.puzzleName} | <strong>ord:</strong> {puzzle.order} | <strong>zone name:</strong>  {gamePlayZoneObject[("id-"+ puzzle.gamePlayZoneID)]} | <strong>winGame</strong>: {puzzle.winGame? "true" : "false"} | <strong>disabled</strong>: {puzzle.disabled ? "true" : "false"} <br />
                                                <strong>puzzle position</strong> {puzzle.puzzlePosition} | <strong>puzzleToolNeeded</strong> {puzzle.puzzleToolNeeded} | <strong>puzzle tool revealed</strong> {puzzle.puzzleToolRevealed} | <strong>clue revealed</strong> {puzzle.puzzleClueRevealed} |
                                                <br /><Image src={puzzle.puzzleImage} /> <Image src={puzzle.puzzleImageOpen} /> <Image src={puzzle.puzzleImageSolved} />
                                                <br /><Button marginRight="5px" className="button-small" onClick={() => showUpdatePuzzle({"puzzleID": puzzle.id})}>Update Puzzle</Button>
                                                <Button marginRight="5px" className="button-small" onClick={() => deletePuzzle({"puzzleID": puzzle.id})}>Delete Puzzle</Button>
                                                <Button marginRight="5px" className="button-small" onClick={() => {setInputCreateTextFieldInitial('puzzleID',puzzle.id);}}>Add TextField</Button>

                                                <br />
                                                <hr />
                                                <View paddingLeft="10px"><strong>TextFields: {puzzle.textField.items.length}</strong><br />
                                                {puzzle.textField.items.map((textField) => (
                                                    <View key={textField.id}>
                                                        <strong>textfield name:</strong>  {textField.name} | <strong>order:</strong> {textField.order} |
                                                        <strong>label:</strong>  {textField.label} | <strong>disabled</strong>: {textField.disabled ? "true" : "false"} | <strong>{textField.answer}</strong>
                                                        <br /><Button marginRight="5px" className="button-small" onClick={() => showUpdateTextField({"textFieldID": textField.id})}>Update TextField</Button>
                                                        <Button marginRight="5px" className="button-small" onClick={() => deleteTextField({"textFieldID": textField.id})}>Delete TextField</Button>

                                                    </View>
                                                ))}
                                                 <hr />
                                                </View>
                                            </View>
                                        ))}

                                        <hr />
                                        <strong>Clues: {game.gameClue.items.length}</strong><br />
                                        {game.gameClue.items.map((clue) => (
                                            <View key={clue.id}>
                                                <strong>clue name:</strong>  {clue.gameClueName} | <strong>zone name:</strong>  {gamePlayZoneObject[("id-"+ clue.gamePlayZoneID)]}| <strong>disabled</strong>: {clue.disabled ? "true" : "false"} |
                                                <strong>ord:</strong>  {clue.order} |
                                                <strong>clue position: </strong>{clue.gameCluePosition} <br />
                                                <strong>clue text: </strong>{clue.gameClueText} <br />
                                                <strong>clue Icon: </strong><Image src={clue.gameClueIcon} />
                                                <strong>Tool Needed: </strong>{clue.gameClueToolNeeded}&nbsp;
                                                <strong>clue Image: </strong><Image src={clue.gameClueImage} />
                                                <br /><Button marginRight="5px" className="button-small" onClick={() => showUpdateClue({"clueID": clue.id})}>Update Clue</Button>
                                                <Button marginRight="5px" className="button-small" onClick={() => deleteClue({"clueID": clue.id})}>Delete Clue</Button>
                                            </View>
                                        ))}
                                        <hr />
                                        <strong>Hints: {game.gameHint.items.length}</strong><br />
                                        {game.gameHint.items.map((hint) => (
                                            <View key={hint.id}>
                                                <strong>hint name:</strong>  {hint.gameHintName} | <strong>ord:</strong> {hint.order} | <strong>zone name:</strong>  {gamePlayZoneObject[("id-"+ hint.gamePlayZoneID)]} | <strong>disabled</strong>: {hint.disabled ? "true" : "false"} | <strong>hint description: </strong> {hint.gameHintDescription}
                                                <br /><Button marginRight="5px" className="button-small" onClick={() => showUpdateHint({"hintID": hint.id})}>Update Hint</Button>
                                                <Button marginRight="5px" className="button-small" onClick={() => deleteHint({"hintID": hint.id})}>Delete Hint</Button>
                                            </View>
                                        ))}
                                        <hr />


                                </View>
                                </View>

                            ))}
                            <View>
                                <View className={gameFormVisible? "overlay" : "hide"}>
                                    <View className="popup">
                                <View id="gameForm" className="show" as="form" margin="3rem 0" >
                                    <View><strong>Game Form</strong></View>
                                    <Flex direction="column" justifyContent="center" gap="1rem">
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
                                            variation="quiet"
                                            value={formCreateGameState.gameName}
                                            required
                                        />
                                        <TextField
                                            onChange={(event) => setInputCreateGame('gameType', event.target.value)}
                                            name="GameType"
                                            placeholder="free/not free"
                                            label="Game Type"
                                            variation="quiet"
                                            value={formCreateGameState.gameType}
                                            required
                                        />
                                        <TextField
                                            onChange={(event) => setInputCreateGame('gameLocationPlace', event.target.value)}
                                            name="GameLocationPlace"
                                            placeholder="Place"
                                            label="Game Location Place"
                                            variation="quiet"
                                            value={formCreateGameState.gameLocationPlace}
                                            required
                                        />

                                        <TextField
                                            name="GameLocationCity"
                                            onChange={(event) => setInputCreateGame('gameLocationCity', event.target.value)}
                                            placeholder="City"
                                            label="Game Location City"
                                            variation="quiet"
                                            value={formCreateGameState.gameLocationCity}
                                            required
                                        />

                                        <TextField
                                            onChange={(event) => setInputCreateGame('gameImage', event.target.value)}
                                            name="GameImage"
                                            placeholder="game Image - don't need anymore, just using first playzoneimage"
                                            label="Game Image"
                                            variation="quiet"
                                            value={formCreateGameState.gameImage}
                                        />
                                        <TextField
                                            onChange={(event) => setInputCreateGame('gameWinMessage', event.target.value)}
                                            name="GameWinMessage"
                                            placeholder="game win message"
                                            label="Game Win Message"
                                            variation="quiet"
                                            value={formCreateGameState.gameWinMessage}
                                        />
                                        <TextField
                                            onChange={(event) => setInputCreateGame('gameWinImage', event.target.value)}
                                            name="GameWinImage"
                                            placeholder="game Win Image"
                                            label="Game Win Image"
                                            variation="quiet"
                                            value={formCreateGameState.gameWinImage}
                                        />
                                        <TextField
                                            onChange={(event) => setInputCreateGame('gameDescriptionH2', event.target.value)}
                                            name="GameDescriptionH2"
                                            placeholder="Game Description H2"
                                            label="Game Description H2"
                                            variation="quiet"
                                            value={formCreateGameState.gameDescriptionH2}
                                            required
                                        />
                                        <TextField
                                            onChange={(event) => setInputCreateGame('gameDescriptionH3', event.target.value)}
                                            name="GameDescriptionH3"
                                            placeholder="Game Description H3"
                                            label="Game Description H3"
                                            variation="quiet"
                                            value={formCreateGameState.gameDescriptionH3}
                                            required
                                        />
                                        <TextField
                                            onChange={(event) => setInputCreateGame('gameMap', event.target.value)}
                                            name="GameMap"
                                            placeholder="Game Map"
                                            label="Game Map"
                                            variation="quiet"
                                            value={formCreateGameState.gameMap}
                                            required
                                        />

                                        <TextAreaField
                                            autoComplete="off"
                                            label="Game Description P"
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
                                            label="Game Intro"
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
                                            variation="quiet"
                                            value={formCreateGameState.gameGoals}
                                        />

                                        <TextField
                                            onChange={(event) => setInputCreateGame('gameLevel', event.target.value)}
                                            name="Game Level"
                                            placeholder="Game Level"
                                            label="Game Level"
                                            variation="quiet"
                                            value={formCreateGameState.gameLevel}
                                        />
                                        <TextField
                                            onChange={(event) => setInputCreateGame('walkingDistance', event.target.value)}
                                            name="GameGoals"
                                            placeholder="Walking Distance"
                                            label="Walking Distance"
                                            variation="quiet"
                                            value={formCreateGameState.walkingDistance}
                                        />
                                        <TextField
                                            onChange={(event) => setInputCreateGame('gameDesigner', event.target.value)}
                                            name="GameGoals"
                                            placeholder="Game Designer"
                                            label="Game Designer"
                                            variation="quiet"
                                            value={formCreateGameState.gameDesigner}
                                        />
                                    </Flex>
                                    <Flex direction="row" justifyContent="center" marginTop="20px">
                                        <Button className="show" onClick={() => setGameFormVisible(false)} variation="primary">
                                            Close
                                        </Button>
                                        <Button id="createGame" className="show" onClick={addGame} variation="primary">
                                            Create Game
                                        </Button>
                                        <Button id="updateGame"  className="hide" onClick={updateGame} variation="primary">
                                            Update Game
                                        </Button>
                                    </Flex>
                                </View>
                                    </View>
                                </View>

                        <View>
                            <View className={gameZoneFormVisible? "overlay" : "hide"}>
                                <View className="popup">
                                <View id="gamePlayZoneForm" className="show" as="form" margin="3rem 0" >
                                    <View><strong>Game Play Zone Form</strong></View>

                                    <Flex direction="column" justifyContent="center" gap="1rem">
                                        <SwitchField
                                            label="disabled"
                                            isChecked={formCreateZoneState.disabled}
                                            onChange={(e) => {
                                                console.log("e.target.checked: " + e.target.checked)
                                                setInputCreateZone('disabled',e.target.checked);
                                            }}
                                        />
                                        <View>Order</View>
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
                                            variation="quiet"
                                            value={formCreateZoneState.gameID}
                                            required
                                        />
                                        <TextField
                                            onChange={(event) => setInputCreateZone('gameZoneName', event.target.value)}
                                            name="gameZoneName"
                                            placeholder="Game Zone Name"
                                            label="Game Zone Name"
                                            variation="quiet"
                                            value={formCreateZoneState.gameZoneName}
                                            required
                                        />
                                        <TextField
                                            name="GameLocationImage"
                                            onChange={(event) => setInputCreateZone('gameZoneImage', event.target.value)}
                                            placeholder="Game Zone Image"
                                            label="Game Zone Image"
                                            variation="quiet"
                                            value={formCreateZoneState.gameZoneImage}
                                            required
                                        />
                                        <TextField
                                            name="GameLocationIcon"
                                            onChange={(event) => setInputCreateZone('gameZoneIcon', event.target.value)}
                                            placeholder="Game Zone Icon"
                                            label="Game Zone Icon"
                                            variation="quiet"
                                            value={formCreateZoneState.gameZoneIcon}
                                            required
                                        />
                                        <TextField
                                            onChange={(event) => setInputCreateZone('gameZoneDescription', event.target.value)}
                                            name="GameZoneDescription"
                                            placeholder="Game Zone Description"
                                            label="Game Zone Description"
                                            variation="quiet"
                                            value={formCreateZoneState.gameZoneDescription}
                                            required
                                        />
                                    </Flex>
                                    <Flex direction="row" justifyContent="center" marginTop="20px">
                                        <Button className="show" onClick={() => setGameZoneFormVisible(false)} variation="primary">
                                            Close
                                        </Button>
                                        <Button id="createZone" className="show" onClick={addZone} variation="primary">
                                            Create Zone
                                        </Button>
                                        <Button id="updateZone" className="hide" onClick={updateZone} variation="primary">
                                            Update Zone
                                        </Button>
                                    </Flex>
                                </View>
                                </View>
                            </View>
                        </View>


                            <View className={gameHintFormVisible? "overlay" : "hide"}>
                               <View className="popup">
                                       <View id="gameHintForm" className="show" as="form" margin="1rem" >
                                            <View><strong>Game Hint Form</strong></View>
                                            <Flex direction="column" justifyContent="center" gap="1rem">
                                                <SwitchField
                                                    label="disabled"
                                                    isChecked={formCreateHintState.disabled}
                                                    onChange={(e) => {
                                                        console.log("e.target.checked: " + e.target.checked)
                                                        setInputCreateHint('disabled',e.target.checked);
                                                    }}
                                                />
                                                <View>Order</View>
                                                <Input
                                                    name="order"
                                                    type="number"
                                                    size="small"
                                                    width="50px"
                                                    placeholder="order"
                                                    onChange={(event) => setInputCreateHint('order', event.target.value)}
                                                    value={formCreateHintState.order}
                                                />
                                                <TextField
                                                    onChange={(event) => setInputCreateHint('gameID', event.target.value)}
                                                    name="gameID"
                                                    placeholder="Game ID"
                                                    label="Game ID"
                                                    variation="quiet"
                                                    value={formCreateHintState.gameID}
                                                    required
                                                />

                                                <TextField
                                                    onChange={(event) => setInputCreateHint('gamePlayZoneID', event.target.value)}
                                                    name="gamePlayZoneID"
                                                    placeholder="gamePlayZoneID"
                                                    label="gamePlayZoneID"
                                                    variation="quiet"
                                                    value={formCreateHintState.gamePlayZoneID}
                                                    required
                                                />
                                                <TextField
                                                    onChange={(event) => setInputCreateHint('gameHintName', event.target.value)}
                                                    name="gameHintName"
                                                    placeholder="Game Hint Name"
                                                    label="Game Hint Name"
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
                                                    variation="quiet"
                                                    value={formCreateHintState.gameHintDescription}
                                                    required
                                                />
                                            </Flex>
                                            <Flex direction="row" justifyContent="center" marginTop="20px">
                                                <Button className="show" onClick={() => setGameHintFormVisible(false)} variation="primary">
                                                    Close
                                                </Button>
                                                <Button id="createHint" className="show" onClick={addHint} variation="primary">
                                                    Create Hint
                                                </Button>
                                                <Button id="updateHint" className="hide" onClick={updateHint} variation="primary">
                                                    Update Hint
                                                </Button>
                                            </Flex>
                                        </View>
                                    </View>
                                </View>


                            <View className={gameClueFormVisible? "overlay" : "hide"}>
                                    <View className="popup">
                                        <View id="gameClueForm" className="show" as="form" margin="3rem 0" >
                                            <View><strong>Game Clue Form</strong></View>
                                            <Flex direction="column" justifyContent="center" gap="1rem">
                                                <SwitchField
                                                    label="disabled"
                                                    isChecked={formCreateClueState.disabled}
                                                    onChange={(e) => {
                                                        console.log("e.target.checked: " + e.target.checked)
                                                        setInputCreateClue('disabled',e.target.checked);
                                                    }}
                                                />
                                                <View>Order - for "top" clue is 60px times "order" from Top on left side, for "bottom", 60px times order from right</View>
                                                <Input
                                                    name="order"
                                                    type="number"
                                                    size="small"
                                                    width="50px"
                                                    onChange={(event) => setInputCreateClue('order', event.target.value)}
                                                    value={formCreateClueState.order}
                                                />
                                                <TextField
                                                    onChange={(event) => setInputCreateClue('gameID', event.target.value)}
                                                    name="gameID"
                                                    placeholder="Game ID"
                                                    label="Game ID"
                                                    variation="quiet"
                                                    value={formCreateClueState.gameID}
                                                    required
                                                />
                                                <TextField
                                                    onChange={(event) => setInputCreateClue('gamePlayZoneID', event.target.value)}
                                                    name="gamePlayZoneID"
                                                    placeholder="gamePlayZoneID"
                                                    label="gamePlayZoneID"
                                                    variation="quiet"
                                                    value={formCreateClueState.gamePlayZoneID}
                                                    required
                                                />
                                                <TextField
                                                    onChange={(event) => setInputCreateClue('gameClueName', event.target.value)}
                                                    name="gameClueName"
                                                    placeholder="Game Clue Name"
                                                    label="Game Clue Name"
                                                    variation="quiet"
                                                    value={formCreateClueState.gameClueName}
                                                    required
                                                />
                                                <TextField
                                                    onChange={(event) => setInputCreateClue('gameClueIcon', event.target.value)}
                                                    name="gameClueIcon"
                                                    placeholder="Game Clue Icon"
                                                    label="Game Clue Icon"
                                                    variation="quiet"
                                                    value={formCreateClueState.gameClueIcon}
                                                    required
                                                />
                                                <TextField
                                                    onChange={(event) => setInputCreateClue('gameClueText', event.target.value)}
                                                    name="gameClueText"
                                                    placeholder="Game Clue Text"
                                                    label="Game Clue Text"
                                                    variation="quiet"
                                                    value={formCreateClueState.gameClueText}
                                                    required
                                                />
                                                <TextField
                                                    onChange={(event) => setInputCreateClue('gameCluePosition', event.target.value)}
                                                    name="gameCluePosition"
                                                    placeholder="Game Clue Position"
                                                    label="Game Clue Position - top or bottom or tRight"
                                                    variation="quiet"
                                                    value={formCreateClueState.gameCluePosition}
                                                    required
                                                />
                                                <TextField
                                                    onChange={(event) => setInputCreateClue('gameClueImage', event.target.value)}
                                                    name="gameClueImage"
                                                    placeholder="Game Clue Image"
                                                    label="Game Clue Image"
                                                    variation="quiet"
                                                    value={formCreateClueState.gameClueImage}
                                                    required
                                                />
                                                <TextField
                                                    onChange={(event) => setInputCreateClue('gameClueToolNeeded', event.target.value)}
                                                    name="gameClueToolNeeded"
                                                    placeholder="Game Clue Tool Needed"
                                                    label="Game Clue Tool Needed (keyword)"
                                                    variation="quiet"
                                                    value={formCreateClueState.gameClueToolNeeded}
                                                    required
                                                />
                                            </Flex>
                                            <Flex direction="row" justifyContent="center" marginTop="20px">
                                                <Button className="show" onClick={() => setGameClueFormVisible(false)} variation="primary">
                                                    Close
                                                </Button>
                                                <Button id="createClue" className="show" onClick={addClue} variation="primary">
                                                    Create Clue
                                                </Button>
                                                <Button id="updateClue" className="hide" onClick={() => {updateClue()}} variation="primary">
                                                    Update Clue
                                                </Button>
                                            </Flex>
                                        </View>
                                    </View>
                                </View>

                            <View className={gameTextFieldFormVisible? "overlay" : "hide"}>
                                <View className="popup">
                                    <View id="gameTextFieldForm" className="show" as="form" margin="3rem 0" >
                                        <View><strong>TextField Form</strong></View>

                                        <Flex direction="column" justifyContent="center" gap="1rem">
                                            <SwitchField
                                                label="disabled"
                                                isChecked={formCreateTextFieldState.disabled}
                                                onChange={(e) => {
                                                    console.log("e.target.checked: " + e.target.checked)
                                                    setInputCreateTextField('disabled',e.target.checked);
                                                }}
                                            />
                                            <View>Order</View>
                                            <Input
                                                name="order"
                                                type="number"
                                                size="small"
                                                width="50px"
                                                onChange={(event) => setInputCreateTextField('order', event.target.value)}
                                                value={formCreateTextFieldState.order}
                                            />
                                            <TextField
                                                onChange={(event) => setInputCreateTextField('puzzleID', event.target.value)}
                                                name="puzzleID"
                                                placeholder="Puzzle ID"
                                                label="Puzzle ID"
                                                variation="quiet"
                                                value={formCreateTextFieldState.puzzleID}
                                                required
                                            />
                                            <TextField
                                                name="Name"
                                                onChange={(event) => setInputCreateTextField('name', event.target.value)}
                                                placeholder="Name"
                                                label="Name"
                                                variation="quiet"
                                                value={formCreateTextFieldState.name}
                                                required
                                            />
                                            <TextField
                                                name="Label"
                                                onChange={(event) => setInputCreateTextField('label', event.target.value)}
                                                placeholder="Label"
                                                label="Label"
                                                variation="quiet"
                                                value={formCreateTextFieldState.label}
                                                required
                                            />
                                            <TextField
                                                name="Answer"
                                                onChange={(event) => setInputCreateTextField('answer', event.target.value)}
                                                placeholder="Answer"
                                                label="Answer"
                                                variation="quiet"
                                                value={formCreateTextFieldState.answer}
                                                required
                                            />

                                        </Flex>
                                        <Flex direction="row" justifyContent="center" marginTop="20px">
                                            <Button className="show" onClick={() => setGameTextFieldFormVisible(false)} variation="primary">
                                                Close
                                            </Button>
                                            <Button id="createTextField" className="show" onClick={addTextField} variation="primary">
                                                Create TextField
                                            </Button>
                                            <Button id="updateTextField" className="hide" onClick={updateTextField} variation="primary">
                                                Update TextField
                                            </Button>
                                        </Flex>
                                    </View>
                                </View>
                            </View>

                                <View className={gamePuzzleFormVisible? "overlay" : "hide"}>
                                    <View className="popup">
                                        <View id="gamePuzzleForm" className="show" as="form" margin="3rem 0" >
                                            <View><strong>Game Puzzle Form</strong></View>

                                            <Flex direction="column" justifyContent="center" gap="1rem">
                                                <SwitchField
                                                    label="disabled"
                                                    isChecked={formCreatePuzzleState.disabled}
                                                    onChange={(e) => {
                                                        console.log("e.target.checked: " + e.target.checked)
                                                        setInputCreatePuzzle('disabled',e.target.checked);
                                                    }}
                                                />
                                                <SwitchField
                                                    label="winGame"
                                                    isChecked={formCreatePuzzleState.winGame}
                                                    onChange={(e) => {
                                                        console.log("e.target.checked: " + e.target.checked)
                                                        setInputCreatePuzzle('winGame',e.target.checked);
                                                    }}
                                                />
                                                <View>Order - for "top" clue is 60px times "order" from Top on left side, for "bottom", 60px times order from right</View>
                                                <Input
                                                    name="order"
                                                    type="number"
                                                    size="small"
                                                    width="50px"
                                                    onChange={(event) => setInputCreatePuzzle('order', event.target.value)}
                                                    value={formCreatePuzzleState.order}
                                                />
                                                <TextField
                                                    onChange={(event) => setInputCreatePuzzle('gameID', event.target.value)}
                                                    name="gameID"
                                                    placeholder="Game ID"
                                                    label="Game ID"
                                                    variation="quiet"
                                                    value={formCreatePuzzleState.gameID}
                                                    required
                                                />
                                                <TextField
                                                    onChange={(event) => setInputCreatePuzzle('gamePlayZoneID', event.target.value)}
                                                    name="gamePlayZoneID"
                                                    placeholder="gamePlayZoneID"
                                                    label="gamePlayZoneID"
                                                    variation="quiet"
                                                    value={formCreatePuzzleState.gamePlayZoneID}
                                                    required
                                                />
                                                <TextField
                                                    onChange={(event) => setInputCreatePuzzle('puzzleName', event.target.value)}
                                                    name="puzzleName"
                                                    placeholder="Puzzle Name"
                                                    label="Puzzle Name"
                                                    variation="quiet"
                                                    value={formCreatePuzzleState.puzzleName}
                                                    required
                                                />
                                                <TextField
                                                    onChange={(event) => setInputCreatePuzzle('puzzlePosition', event.target.value)}
                                                    name="puzzlePosition"
                                                    placeholder="puzzlePosition"
                                                    label="puzzle position"
                                                    variation="quiet"
                                                    value={formCreatePuzzleState.puzzlePosition}
                                                    required
                                                />
                                                <TextField
                                                    onChange={(event) => setInputCreatePuzzle('puzzleImage', event.target.value)}
                                                    name="puzzleImage"
                                                    placeholder="puzzle image"
                                                    label="puzzle image"
                                                    variation="quiet"
                                                    value={formCreatePuzzleState.puzzleImage}
                                                    required
                                                />
                                                <TextField
                                                    onChange={(event) => setInputCreatePuzzle('puzzleImageOpen', event.target.value)}
                                                    name="puzzleImageOpen"
                                                    placeholder="puzzle Image Open"
                                                    label="puzzle Image Open"
                                                    variation="quiet"
                                                    value={formCreatePuzzleState.puzzleImageOpen}
                                                    required
                                                />
                                                <TextField
                                                    onChange={(event) => setInputCreatePuzzle('puzzleImageSolved', event.target.value)}
                                                    name="puzzleImageSolved"
                                                    placeholder="puzzle Image Solved"
                                                    label="puzzle Image Solved"
                                                    variation="quiet"
                                                    value={formCreatePuzzleState.puzzleImageSolved}
                                                    required
                                                />
                                                <TextField
                                                    onChange={(event) => setInputCreatePuzzle('puzzleClueText', event.target.value)}
                                                    name="puzzleClueText"
                                                    placeholder="puzzle Clue Text"
                                                    label="puzzle Clue Text"
                                                    variation="quiet"
                                                    value={formCreatePuzzleState.puzzleClueText}
                                                />
                                                <TextField
                                                    onChange={(event) => setInputCreatePuzzle('puzzleToolRevealed', event.target.value)}
                                                    name="puzzleToolRevealed"
                                                    placeholder="puzzle Tool Revealed"
                                                    label="puzzle Tool Revealed"
                                                    variation="quiet"
                                                    value={formCreatePuzzleState.puzzleToolRevealed}
                                                />
                                                <TextField
                                                    onChange={(event) => setInputCreatePuzzle('puzzleToolNeeded', event.target.value)}
                                                    name="puzzleToolNeeded"
                                                    placeholder="puzzle Tool Needed"
                                                    label="puzzle Tool Needed"
                                                    variation="quiet"
                                                    value={formCreatePuzzleState.puzzleToolNeeded}
                                                />

                                                <TextField
                                                    onChange={(event) => setInputCreatePuzzle('winGameImage', event.target.value)}
                                                    name="winGameImage"
                                                    placeholder="win game image"
                                                    label="win game image"
                                                    variation="quiet"
                                                    value={formCreatePuzzleState.winGameImage}
                                                />
                                                <TextField
                                                    onChange={(event) => setInputCreatePuzzle('winGameMessage', event.target.value)}
                                                    name="winGameMessage"
                                                    placeholder="win game message"
                                                    label="win game message"
                                                    variation="quiet"
                                                    value={formCreatePuzzleState.winGameMessage}
                                                />
                                                <TextField
                                                    onChange={(event) => setInputCreatePuzzle('puzzleClueText', event.target.value)}
                                                    name="puzzleClueText"
                                                    placeholder="puzzle clue Text"
                                                    label="puzzle Clue Text"
                                                    variation="quiet"
                                                    value={formCreatePuzzleState.puzzleClueText}
                                                />
                                            </Flex>
                                            <Flex direction="row" justifyContent="center" marginTop="20px">
                                                <Button className="show" onClick={() => setGamePuzzleFormVisible(false)} variation="primary">
                                                    Close
                                                </Button>
                                                <Button id="createPuzzle" className="show" onClick={addPuzzle} variation="primary">
                                                    Create Puzzle
                                                </Button>
                                                <Button id="updatePuzzle" className="hide" onClick={updatePuzzle} variation="primary">
                                                    Update Puzzle
                                                </Button>
                                            </Flex>
                                        </View>
                                    </View>
                                </View>
                                <View className={backupsVisible? "overlay" : "hide"}>
                                    <View className="popup">
                                        backups:
                                        <View>
                                            <Button onClick={() => divShowHide("backup1")}>{showHideLabel.backup1} Disc Golf Hunt And Think</Button>
                                            <View id="backup1" className="hide">
                                                <pre>{JSON.stringify(backups.discGolfHunt2, null, 2)}</pre>
                                            </View>
                                        </View>
                                        <View>
                                            <Button onClick={() => divShowHide("backup2")}>{showHideLabel.backup2} Disc Golf Hunt</Button>
                                            <View id="backup2" className="hide">
                                                <pre>{JSON.stringify(backups.discGolfHunt1, null, 2)}</pre>
                                            </View>
                                        </View>
                                        <View>
                                            <Button onClick={() => divShowHide("backup3")}>{showHideLabel.backup3} Secret Papers</Button>
                                            <View id="backup3" className="hide">
                                                <pre>{JSON.stringify(backups.secretPapers, null, 2)}</pre>
                                            </View>
                                        </View>
                                        <Flex direction="row" justifyContent="center" marginTop="20px">
                                            <Button className="show" onClick={() => setBackupsVisible(false)} variation="primary">
                                                Close
                                            </Button>

                                        </Flex>
                                    </View>
                                </View>
                            </View>
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