// components/Home.js
import React, {useRef, useEffect, useState} from "react";
import {
    Flex,
    Button,
    Heading,
    View,
    Card,
    Text,
    Image,
    useAuthenticator,
    Alert,
    Accordion, Tabs, Link, TextField, ToggleButton, Icon
} from '@aws-amplify/ui-react';
import {
    gamesByCity,
    usersByEmail,
    userGamePlaysByUserId,
    gameStatsByGameID,
    gameScoreByGameStatsID,
    getGameStats,
    getGameScore, gameStatsSortedByGameName, getGameHint, getGame, gameScoreByGameID, listGameStats
} from "../graphql/queries";
import {
    createGameScore,
    createGameStats,
    createUser,
    createUserGamePlay, updateGameStats
} from "../graphql/mutations";
import { useNavigate } from 'react-router-dom';
import { createPortal } from 'react-dom';
import {
    RegExpMatcher,
    TextCensor,
    englishDataset,
    englishRecommendedTransformers
} from "obscenity";
import {removeLocalStorage, goHomeQuit} from "./helper";
import {generateClient} from "aws-amplify/api";
import { format } from 'date-fns'
import {fetchUserAttributes} from "aws-amplify/auth";
import {LeaderBoard} from "./LeaderBoard";
import {MyStats} from "./MyStats";
import emailjs from "@emailjs/browser";
import {Modal2} from "./sharedComponents";
import Modal from 'react-modal';

export function Home() {
    const client = generateClient();
    const matcher = new RegExpMatcher({
        ...englishDataset.build(),
        ...englishRecommendedTransformers,
    });
    /* password */
    const [password,setPassword] = useState('');
    /* game is the game being played */
    const [game,setGame] = useState({});
    /* modal test */
    const [modal, setModal] = useState(false);
    const Toggle = () => setModal(!modal);
    /* gamesFilter is for game list */
    const [gamesFilter, setGamesFilter] = useState({disabled: {eq:false}});
    /* for filter/game list -> decided to use local storage instead of state for city so if choice has been made in past that city will load right away */
    /* const [gameLocationCity, setGameLocationCity] = useState();*/
    /* display game list by city? */
    const [gameListByCity, setGameListByCity] = useState([]);

    /* display game detail */
    /* gameDetails are for info about the game to be played */
    const [gameDetails, setGameDetails] = useState({});
    const [isGameDetailVisible, setIsGameDetailVisible] = useState(false);
    const [gameID, setGameID] = useState();

    /* display leaderboard */
    const [isGameLeaderBoardVisible, setIsGameLeaderBoardVisible] = useState(false);
   // const [leaderBoard, setLeaderBoard] = useState([]);
    /* display mystats */
    const [isMyStatsVisible, setIsMyStatsVisible] = useState(false);

    /* logged in user */
    const [email, setEmail] = useState("");
    const [emailStats, setEmailStats] = useState("");
    const [userName, setUserName] = useState("");
    const [userDB, setUserDB] = useState({});
    const [gamesIDUser, setGamesIDUser] = useState([]);
    const [gamesIDUserPlayed, setGamesIDUserPlayed] = useState([]);
    const [hidePlayedGames, setHidePlayedGames] = useState(false);
    /* display waiver */
    const [isWaiverVisible, setIsWaiverVisible] = useState(false);
    const [waiverSigned, setWaiverSigned] = useState("");
    /* display game intro */
    const [isGameIntroVisible, setIsGameIntroVisible] = useState(false);
    /* while game list is loading... maybe should use an icon */
    const [loading, setLoading] = useState(false);
    /* how to play is a popup */
    const [isHowToPlayVisible, setIsHowToPlayVisible] = useState(false);
    /* team name is required before play */
    const [teamName, setTeamName] = useState('');
    /* number of times is useful info - could put by each game for each user? */
    const [numberOfTimes, setNumberOfTimes] = useState(0);
    /* error message if don't provide team name */
    const [numberOfPlayersError, setNumberOfPlayersError] = useState('');
    /* route isn't working right 1/14/24 */
    const {  authStatus, user, route, signOut } = useAuthenticator((context) => [
        context.authStatus,
        context.user,
        context.route,
        context.signOut,
    ]);

    const navigate = useNavigate();

    /*const emailRef = useRef<HTMLInputElement>();
    const nameRef = useRef<HTMLInputElement>();*/
    const [loadingEmailJS, setLoadingEmailJS] = useState(false);
    /* useEffects */
    /*
    So if you want to perform an action immediately after setting state on a state variable,
    we need to pass a callback function to the setState function (use [state variable] at end).
    But in a functional component no such callback is allowed with useState hook.
    In that case we can use the useEffect hook to achieve it.
     */
    /*
    using localStorage instead...
    useEffect(() => {
        console.log("***useEffect***:  fetchGames() - gameLocationCity: " + gameLocationCity);
        fetchGames();
    }, [gameLocationCity]);*/

    /* fetchgames() - on load only */
    useEffect(() => {
        console.log("***useEffect***:  fetchGames():");
        fetchGames();
    }, []);

    useEffect(() => emailjs.init("S1A6humzl0zJ6Jerb"), []);
    /* get email and other user information using amplify's methods */
    /* https://docs.amplify.aws/react/build-a-backend/auth/manage-user-session/ */
    /* https://docs.amplify.aws/react/build-a-backend/auth/manage-user-profile/ */
    /* user - set by authenticator*/
    useEffect(() => {
        if (user) {
            console.log("***useEffect***: fetchUserDB user.username: " + user.username);
            handleFetchUserAttributes({"userName": user.username});
        }
    },[user]);

    /* called from useEffect above */
    async function handleFetchUserAttributes(props) {
        try {
            const userAttributes = await fetchUserAttributes();
            console.log("userAttributes.email (home) " + userAttributes.email);
            setEmail(userAttributes.email);
            localStorage.setItem("email",userAttributes.email);
            fetchUserDB({"email":userAttributes.email, "userName": props.userName});

          /*  if (userAttributes.email === ("lararobertson70@gmail.com") ||
                userAttributes.email === ("rosyrobertson@gmail.com") ||
                userAttributes.email === ("lara@tybeewebdesign.com") ||
                userAttributes.email === ("coastalinitiativellc@gmail.com") ||
                userAttributes.email === ("lara@lararobertson.com")
            ) {*/
                /* handleSubmit({"email": userAttributes.email});*/
                /*console.log("hi lara");*/
                /* alert("hi lara");*/
            /*} else {
                if (userAttributes.email != localStorage.getItem("email")) {
                     alert(userAttributes.email);
                }
            }*/
        } catch (error) {
            console.log(error);
        }
    }


    /* called from handleFetchUserAttributes above */
    async function fetchUserDB(props) {
        /* check if user in database, if not create user and games */
        try {
            const apiUserDB =  await client.graphql({
                query: usersByEmail,
                variables: { email: props.email}
            });
            console.log("apiUserDB: " + JSON.stringify(apiUserDB.data.usersByEmail.items[0]));
            /* if nothing is returned (check if username changed??)  */
            if (apiUserDB.data.usersByEmail.items.length === 0) {
                console.log("need to add user");
                const data = {
                    userName: props.userName,
                    email: props.email,
                };
                try {
                    await client.graphql({
                        query: createUser,
                        variables: { input: data },
                    });
                } catch (err) {
                    console.log('error createUser..', err)
                }
            }
            /* get userID */
            const userFromAPI = apiUserDB.data.usersByEmail.items[0];
            setUserDB(userFromAPI);
        } catch (err) {
            console.log('error fetchUserDB..', err)
        }
    }

    /* userDB - set above */
    useEffect( () => {
        fetchUserGamePlay();
    }, [userDB]);

    const handleSubmit = async (e) => {
        /*e.preventDefault();*/
        const serviceId = "service_adu68mo";
        const templateId = "template_9qbop4t";
        try {
            setLoadingEmailJS(true);
            await emailjs.send(serviceId, templateId, {
                from_name: e.email,
                to_name: "Lara"
            });
            console.log("email successfully sent check inbox");
        } catch (error) {
            console.log(error);
        } finally {
            setLoadingEmailJS(false);
        }
    };

    async function fetchUserGamePlay() {
        console.log("fetchUserGamePlay - userID: " + userDB.id);
        /* check if user in database, if not create user and games */
        /* not sure this is doing that above */
        /* this appears to be checking PAY list */
        if (userDB.id != null){
            try {
                const apiUserGamePlay =  await client.graphql({
                    query: userGamePlaysByUserId,
                    variables: { userId: userDB.id}
                });
                console.log("apiUserGamePlay: " + JSON.stringify(apiUserGamePlay.data.userGamePlaysByUserId.items));
                /* create array of gameIDs */
                const gameIDsUser = apiUserGamePlay.data.userGamePlaysByUserId.items;
                const gameIDsUserArray = gameIDsUser.map(item => {
                    return item.gameId
                })
                console.log('gameIDsUserArray: ' + gameIDsUserArray);
                setGamesIDUser(gameIDsUserArray);
            } catch (err) {
                console.log('error fetchUserGamePlay..', err)
            }
            /* now create a play list */
            /* create gameStats if play game */
            /* search on gameStats */
            /* listGameStats filter is userEmail */
            let filter = {
                userEmail: {
                    eq: email
                }
            };
            try {
                const apiListGameStats = await client.graphql({
                    query:listGameStats,
                    variables: {filter: filter}
                    });
                const gameIDUserPlayed = apiListGameStats.data.listGameStats.items;
                const gameIDUserPlayedArray = gameIDUserPlayed.map(item => {
                    return item.gameID
                })
                console.log('gameIDUserPlayedArray: ' + JSON.stringify(gameIDUserPlayedArray));
                setGamesIDUserPlayed(gameIDUserPlayedArray);
            } catch (err) {
                console.log('error listGameStats..', err)
            }
        }

    }

    function setFilterFetchGame(key, value) {
        console.log("setFilterCreateGame: " + key);
        if (key) {
            setGamesFilter({...gamesFilter, [key]: value})
        } else {
            setGamesFilter({gameType: {eq:"free"},disabled: {eq:false}});
            // setDisabledGame();
            //setGameType();
        }
    }

    async function logOut() {
        console.log("logout");
        /* save everything for game? */
        /* warning? */
        removeLocalStorage();
        signOut();
    }

    function setGameLocationCityFunction (city) {
        console.log("setGameLocationCityFunction: " + city);
        localStorage.setItem("gameLocationCity",city);
        //setGameLocationCity(city);
        fetchGames();

    }

    async function fetchGames() {
        console.log("fetchGames: by gamesLocationCity: " + localStorage.getItem("gameLocationCity"));
        let gameLocationCity = localStorage.getItem("gameLocationCity");
        console.log("gamesFilter: " + gamesFilter);
        setLoading(true);
        let filterTemp = {
            disabled: {
                eq: false
            }
        };
        if (gameLocationCity != "" && gameLocationCity != null) {
            try {
                const apiData = await client.graphql({
                    query: gamesByCity,
                    variables: {
                        filter: filterTemp,
                        gameLocationCity: {eq: gameLocationCity},
                        sortDirection: "DESC",
                        type: "game"
                    }
                });
                const gamesFromAPI = apiData.data.gamesByCity.items;
                setGameListByCity(gamesFromAPI);
                setLoading(false);
            } catch (err) {
                console.log('error fetching gamesByCity', err);
            }
        } else {
            setLoading(false);
        }
    }

    async function goToMyStats() {
        console.log("goToMyStats (email): " + email);
        setIsMyStatsVisible(true);
    }

    function goToGameDetail(gameDetails) {
        /* set states */
        console.log("goToGameDetail: " + gameDetails.gameID);
        setGameDetails(gameDetails);
        /*setIsGameDetailVisible(true);*/
        openModalGameDetail();
    }

    function goToLeaderBoard(gameDetails) {
        /* set states */
        console.log("goToLeaderBoard: " + gameDetails.gameID);
        setGameDetails(gameDetails);
        setIsGameLeaderBoardVisible(true);
        openModalLeaderBoard();
    }

    function setTeamNameFunction(teamNameValue) {
        console.log("setTeamNameFunction: " + teamNameValue);
        /* check for obscenities */
        if (matcher.hasMatch(teamNameValue)) {
            setNumberOfPlayersError("The Team Name contains profanities. Please choose another.");
            setTeamName("");
        } else {
            setNumberOfPlayersError("");
            localStorage.setItem("teamName", teamNameValue);
            setTeamName(teamNameValue);
        }
    }

    async function goToWaiver(gameDetailsVar) {
        console.log("goToWaiver");
        /* set gameDetails state */
        setGame(gameDetailsVar);
        setGameDetails(gameDetailsVar);
        /* check if waiver signed */
        /* check if gameStats entry in database */
        let filter = {
            userEmail: {
                eq: email
            }
        };
        try {
            const apiGameStats = await client.graphql({
                query: gameStatsByGameID,
                variables: {filter: filter, gameID: gameDetailsVar.gameID}
            });
            if (apiGameStats.data.gameStatsByGameID.items.length > 0) {
                /* means user has signed waiver and there is a gameStat and user has either signed waiver or played before */
                /* create a new gameScore and get number of times */
                const gamesStatsFromAPI = apiGameStats.data.gameStatsByGameID.items[0];
                localStorage.setItem("gameStatsID", gamesStatsFromAPI.id);
                /* set waiver signed for game */
                setWaiverSigned(gameDetailsVar.gameID);

                /* check number of times */
                /* get game score */
                try {
                    const apiGameScore = await client.graphql({
                        query: gameScoreByGameStatsID,
                        variables: {gameStatsID: localStorage.getItem("gameStatsID")}
                    });
                    if (apiGameScore) {
                        /* user has played before */
                        const gamesScoreFromAPI = apiGameScore.data.gameScoreByGameStatsID.items;
                        console.log("gamesScoreFromAPI (home): " + gamesScoreFromAPI.length);
                        if (Array.isArray(gamesScoreFromAPI)) {
                            //localStorage.setItem("numberOfTimes", gamesScoreFromAPI.length);
                            setNumberOfTimes(gamesScoreFromAPI.length);
                        }
                    } else {
                        // localStorage.setItem("numberOfTimes", 0);
                        /* shouldn't happen now */
                        setNumberOfTimes(0);
                    }

                } catch (err) {
                    console.log('error gameScoreByGameStatsID..', err)
                }

            } else {
                /* first time */
                console.log("first time");
                setNumberOfTimes(0);
                /*setIsWaiverVisible(true);
                openModalWaiver();*/
            }
            /* go to game intro */
            console.log("show game intro: gotowaiver()");
            setTeamName("");
            setNumberOfPlayersError("");
            setIsGameIntroVisible(true);
            openModalGameIntro();
        } catch (err) {
            console.log('error gameScoreByGameStatsID..', err)
        }

    }

    async function agreeToWaiverFunction() {
        console.log("agreeToWaiverFunction");
        /* set waiver signed for game */
        setWaiverSigned(game.gameID);
        {/* don't need this? setTeamName("");*/}
        setNumberOfPlayersError("");
        setIsWaiverVisible(false);
        closeModalWaiver();
        setIsGameIntroVisible(true);

    }

    async function goToGame() {
        console.log("goToGame: " + game.gameID);
        /* A GameStats entry is added the first time a player plays and signs Waiver */
        /* if player agrees to Waiver there will be an entry in GameStats and a GameScore entry is created in goToGame below */
        /* a player may have multiple GameScore entries because they can play more than once */
        /*
        /* check for team name */
        if ((teamName != "" && waiverSigned === game.gameID)) {
            /* get game score */
            setNumberOfPlayersError("");
            let firstTime=false;
            /* if first time */
            if (numberOfTimes === 0) {
                firstTime=true;
                console.log("add game stat: (gameID): " + game.gameID);
                const gameStatsValues = {
                    waiverSigned: true
                }
                const data = {
                    gameID: game.gameID,
                    userEmail: email,
                    gameName: game.gameName,
                    gameLocationCity: game.gameLocationCity,
                    gameStates: JSON.stringify(gameStatsValues),
                    type: "gameStats",
                    disabled: false
                };
                console.log("data for createGameStats: " + JSON.stringify(data));
                try {
                    await client.graphql({
                        query: createGameStats,
                        variables: {input: data},
                    });
                    /* get gameStatsID */
                    let filter = {
                        userEmail: {
                            eq: email
                        }
                    };
                    try {
                        const apiGameStats = await client.graphql({
                            query: gameStatsByGameID,
                            variables: {filter: filter, gameID: game.gameID}
                        });
                        if (apiGameStats.data.gameStatsByGameID.items.length > 0) {
                            /* means user has signed waiver and there is a gameStat and user has either signed waiver or played before */
                            const gamesStatsFromAPI = apiGameStats.data.gameStatsByGameID.items[0];
                            localStorage.setItem("gameStatsID", gamesStatsFromAPI.id);
                        } else {
                            /* go to waiver */
                            /* should not happen */
                            console.log("show waiver2");
                            setIsWaiverVisible(true);
                            openModalWaiver();
                        }
                    } catch (err) {
                        console.log('error gameScoreByGameStatsID..', err)
                    }
                } catch (err) {
                    console.log('error createGameStats..', err)
                }
            }
            /* add new game score */
            const data = {
                gameStatsID: localStorage.getItem("gameStatsID"),
                gameID: game.gameID,
                gameTotalTime: 0,
                gameHintTime: 0,
                teamName: teamName,
                completed: false,
                disabled: false,
                firstTime: firstTime
            };
            try {
                await client.graphql({
                    query: createGameScore,
                    variables: {input: data},
                });
                localStorage.setItem("gameID", game.gameID);
                localStorage.setItem("gameName", game.gameName);
                setIsGameIntroVisible(false);
                /* new ui */
                if (game.gameName === "Disc Golf Hunt and Think") {
                    console.log("game.gameName");
                    console.log("go to page: " + '/gameV3');
                    navigate('/gameV3');
                } else {
                    console.log("go to page: " + '/game');
                    navigate('/game');
                }
            } catch (err) {
                console.log('error createGameScore..', err)
            }


        } else {
            console.log("show game intro: gotogame()");
            /* don't need this? setTeamName("");*/
            /* check if waiver signed - do in modal*/
            if (waiverSigned === game.gameID) {
                console.log("waiver signed (go to game)");
                setNumberOfPlayersError("Please provide a Team Name");
                setIsGameIntroVisible(true);
                openModalGameIntro();
            } else {
                /* go to waiver */
                /* may never happen */
                console.log("show waiver (go to game)");
                setIsGameIntroVisible(false);
                setIsWaiverVisible(true);
                openModalWaiver();
            }
        }
    }

    async function goToCurrentGame(gameDetails) {
        /* check if gameStats entry */
        const apiGameStats =  await client.graphql({
            query: getGameStats,
            variables: { id: gameDetails.gameStatsID}
        });
        if (apiGameStats) {
            console.log("game stat there");
            console.log("check waiver");
            console.log("gapiGameStats.data.getGameStats.gameStates: " + apiGameStats.data.getGameStats.gameStates);
            if (apiGameStats.data.getGameStats.gameStates != "") {
                /* check if gameScore entry */
                const apiGameScore = await client.graphql({
                    query: getGameScore,
                    variables: {id: gameDetails.gameScoreID}
                });
                if (apiGameScore) {
                    /* good to go! */
                    console.log("current game: go to page: " + '/game');
                    navigate('/game');

                }
            }
        } else {
            removeLocalStorage();
        }
    }

    function showGameList() {
        console.log("showGameList");
       // setIsHowToPlayVisible(true);
        window.scrollTo({
            top: 1800,
            left: 0,
            behavior: "smooth",
        });
    }

    function closeIt(element) {
        console.log("element: " + element);
        if (element === "how-to-play") setIsHowToPlayVisible(false);
    }

    const divStyle = (src) => ({
        background:  "url(" + src + ") 0 0 / contain no-repeat"
    });

    let subtitle;
    const [modalIsOpenHowTo, setIsOpenHowTo] = React.useState(false);
    const [modalIsOpenGameDetail, setIsOpenGameDetail] = React.useState(false);
    const [modalIsOpenStats, setIsOpenStats] = React.useState(false);
    const [modalIsOpenWaiver, setIsOpenWaiver] = React.useState(false);
    const [modalIsOpenGameIntro, setIsOpenGameIntro] = React.useState(false);
    const [modalIsOpenLeaderBoard, setIsOpenLeaderBoard] = React.useState(false);

    function openModalLeaderBoard() {
        setIsOpenLeaderBoard(true);
    }

    function closeModalLeaderBoard() {
        setIsOpenLeaderBoard(false);
    }
    function openModalGameIntro() {
        setIsOpenGameIntro(true);
    }

    function closeModalGameIntro() {
        setIsOpenGameIntro(false);
    }
    function openModalWaiver() {
        setIsOpenWaiver(true);
    }

    function closeModalWaiver() {
        setIsOpenWaiver(false);
    }

    function openModalStats() {
        setIsOpenStats(true);
    }

    function closeModalStats() {
        setIsOpenStats(false);
    }
    function openModalHowTo() {
        setIsOpenHowTo(true);
    }

    function closeModalHowTo() {
        setIsOpenHowTo(false);
    }
    function openModalGameDetail() {
        setIsOpenGameDetail(true);
    }

    function closeModalGameDetail() {
        setIsOpenGameDetail(false);
    }

    Modal.setAppElement('#modal');

    if (password != "go" && authStatus != 'authenticated') {
        return (
            <View className="main-container">
                <View className="main-content top-main" marginBottom="1em">
                    <TextField
                        className ="light-label"
                        label={"password"}
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                    />
                </View>
            </View>
        )
    } else {
        return (
            <View className="main-container">
                <View className="topNav">
                    <Flex justifyContent="center">
                        <View marginTop="10px">
                            <Image
                                src="https://escapeoutbucket213334-staging.s3.amazonaws.com/public/new-logo-light-smaller.png"/>
                        </View>
                    </Flex>
                    <Flex justifyContent="center">
                        <View>
                            {authStatus !== 'authenticated' ? (
                                <Button className="topLink" onClick={() => navigate('/login')}>Sign in to Play</Button>
                            ) : (
                                <Button className="topLink" onClick={() => logOut()}>Sign Out</Button>
                            )
                            }

                            {authStatus === 'authenticated' ? (
                                <Button className="topLink" onClick={openModalStats}>
                                    My Stats
                                </Button>) : (null)}
                            <Button className="topLink " onClick={openModalHowTo}>
                                How to Play
                            </Button>
                            {/*<Button onClick={() => Toggle()}>ModalLink</Button>*/}
                            {(authStatus === 'authenticated') && (email === "lararobertson70@gmail.com") ? (
                                <Button className="topLink" onClick={() => navigate('/admin')}>Admin</Button>
                            ) : null}
                        </View>
                    </Flex>
                </View>
                <View className="main-content top-main" marginBottom="1em">
                    <View className="hero">
                        <Heading
                            level={5}
                            textAlign="center"
                            className="heading">
                            Go Outside and play an <span
                            className="blue-light">Intriguing Problem-Solving Game</span> with your family and friends!
                        </Heading>
                        <View className="hero-paragraph">
                            Grab your phone, round up your family and friends, and head outside for a fun-filled day of
                            creative puzzles, exploration, and excitement!
                            <View className="italics" paddingTop={"2px"} fontSize={".8em"} textAlign={"center"}>Games
                                are meant to be played on smartphone at locations in Game List below.</View>
                        </View>
                        <View>

                            <View className={"light-dark hide"}>
                                More Questions?&nbsp;
                                <Link
                                    href="https://escapeout.games/faqs/"
                                    className={"light-dark"}
                                    isExternal={true}
                                    textDecoration="underline"
                                >
                                    Visit FAQs
                                </Link>
                            </View>
                        </View>
                    </View>
                </View>
                <View className="main-content">
                    {(localStorage.getItem("gameID") !== null &&
                        localStorage.getItem("gameName") !== null &&
                        localStorage.getItem("realTimeStart") !== null &&
                        localStorage.getItem("gameStatsID") !== null &&
                        localStorage.getItem("gameScoreID") !== null) ? (
                        <View className="overlay">
                            <View className="popup"
                                  ariaLabel="Currently Playing">

                                <View textAlign="center" border="1px solid white" padding="10px">
                                    Currently Playing: {localStorage.getItem("gameName")} &nbsp;&nbsp;<br/><br/>
                                    <Button className="go-to-game-button light" onClick={() => goToCurrentGame({
                                        gameName: localStorage.getItem("gameLink"),
                                        gameID: localStorage.getItem("gameID"),
                                        gameScoreID: localStorage.getItem("gameScoreID"),
                                        gameStatsID: localStorage.getItem("gameStatsID")
                                    })}>
                                        go back to game
                                    </Button><br/><br/>
                                    <Button className="go-to-game-button light" onClick={() => goHomeQuit(navigate)}>
                                        Quit Game (if this is your first time playing you will not have a "first time"
                                        score - no chance for leaderboard)
                                    </Button>
                                </View></View></View>) : null}
                    <View id="game-list" >
                        <View className={"blue-alert"} margin="0 auto 5px auto" textAlign={"center"} fontSize={".8em"}
                              padding="5px" lineHeight="1.2em">
                            <strong>GAMES ARE IN TESTING MODE</strong>
                        </View>
                        <Heading level={"6"} className="heading" marginBottom={"10px"}>
                            Game List (select city):
                            {authStatus === 'authenticated' ? (
                                <Button className="close dark small" marginLeft="5px" padding="2px 4px"
                                        onClick={() => (hidePlayedGames ? setHidePlayedGames(false) : setHidePlayedGames(true))}>
                                    {hidePlayedGames ? "show" : "hide"} played games
                                </Button>
                            ) : (<View></View>)}
                        </Heading>

                        <Flex
                            direction="row"
                            justifyContent="flex-start"
                            alignItems="stretch"
                            alignContent="flex-start"
                            wrap="wrap"
                            gap="1rem"
                        >
                            <Button marginRight="5px" className={"button-small small"}
                                    backgroundColor={(localStorage.getItem("gameLocationCity") === "Tybee Island") ? ("#0d5189") : ("transparent")}
                                    color="white" onClick={() => setGameLocationCityFunction("Tybee Island")}>Tybee
                                Island, GA
                                {(localStorage.getItem("gameLocationCity") === "Tybee Island") ? (
                                    <View>&nbsp;- selected</View>) : (null)}
                            </Button>
                            {/*}   <Button marginRight="5px" className={"button-small small"} backgroundColor={(localStorage.getItem("gameLocationCity") === "Savannah")? ("#7e0b0b" ): ("transparent")} color="white"  onClick={() => setGameLocationCityFunction("Savannah")}>Savannah, GA
                            {(localStorage.getItem("gameLocationCity") === "Savannah")? (<View>&nbsp;- selected</View> ): (null)}
                        </Button>*/}
                        </Flex>

                        <Flex className="flex-games">
                            {loading ? (<View>loading</View>) : null}
                            {((gameListByCity.length === 0) & !loading) ? (<View>Games Coming Soon!</View>) : null}
                            {gameListByCity.map((game, index) => (
                                <Card style={divStyle(game.gamePlayZone.items[0].gameZoneImage)}
                                      className={(gamesIDUserPlayed.includes(game.id) && hidePlayedGames) ? "hide" : "game-card"}
                                      variation="elevated" key={game.id || game.gameName}>

                                    <View className="inner-game-card">
                                        <View className="game-card-full">
                                            {gamesIDUserPlayed.includes(game.id) ? (
                                                <Text className="game-card-header played">{game.gameName} <span
                                                    className="small">(played)</span></Text>

                                            ) : (
                                                <Text className="game-card-header">{game.gameName} <span
                                                    className="small">({game.gameType})</span></Text>
                                            )}

                                        </View>
                                        <View className="game-card-full">
                                            <Text color="white"><span
                                                className="italics">Location</span>: {game.gameLocationPlace}</Text>
                                        </View>
                                        <View className="game-card-full">
                                            <Text color="white"><span
                                                className="italics">City</span>: {game.gameLocationCity}</Text>
                                        </View>
                                        <View className="game-card-full">
                                            <Text color="white"><span className="italics">Level</span>: {game.gameLevel}

                                            </Text>
                                        </View>
                                        <View className="game-card-full">
                                            <Text color="white">{game.walkingDistance} walking distance</Text>
                                        </View>
                                    </View>
                                    <View className="inner-game-card1">
                                    <Flex justifyContent="center">
                                        {authStatus !== 'authenticated' ? (
                                            <View textAlign="center">
                                                <Button
                                                    className="button button-center button-small show button-light-dark"
                                                    onClick={() => navigate('/login')}>
                                                    Sign in to Play Game
                                                </Button>
                                            </View>) : (
                                            <View textAlign="center">


                                                {(gamesIDUser.includes(game.id) || game.gameType === "free" || game.gameType === "free-test") ?
                                                    (<div>
                                                        <Button
                                                            className="button button-small button-center button-light-dark show"
                                                            onClick={() => goToWaiver({
                                                                gameName: game.gameName,
                                                                gameID: game.id,
                                                                gameLocationCity: game.gameLocationCity,
                                                                gameLink: game.gameLink,
                                                                gameDescriptionP: game.gameDescriptionP,
                                                                gameDescriptionH3: game.gameDescriptionH3,
                                                                gameDescriptionH2: game.gameDescriptionH2,
                                                                gamePlayZoneImage1: game.gamePlayZone.items[0].gameZoneImage,
                                                                gameMap: game.gameMap
                                                            })}>
                                                            Play Game
                                                        </Button>
                                                    </div>) :
                                                    (<div></div>)
                                                }
                                            </View>)}
                                        <View ariaLabel={"leaderboard-" + game.id}>
                                            {(game.gameLocationPlace == "memorial") ? (
                                                <Button className="button button-small button-center show"
                                                        onClick={() => leaderBoard2({
                                                            gameName: game.gameName,
                                                            gameID: game.id
                                                        })}>
                                                    Leaderboard
                                                </Button>
                                            ) : (<Button className="button button-small button-center show"
                                                         onClick={() => goToLeaderBoard({
                                                             gameName: game.gameName,
                                                             gameID: game.id
                                                         })}>
                                                Leaderboard
                                            </Button>)}
                                        </View>

                                    </Flex>

                                    <View className="game-card-full light-dark">
                                        <View id={game.id}>
                                            <Heading level={"6"} className="heading light-dark"
                                                     margin="0">{game.gameDescriptionH2}</Heading>
                                            <Heading level={"7"} className="heading light-dark"
                                                     marginBottom=".4em">{game.gameDescriptionH3}</Heading>
                                            <View lineHeight="1">

                                                <Button
                                                    className="button button-small button-center button-light-dark show"
                                                    onClick={() => goToGameDetail({
                                                        gameName: game.gameName,
                                                        gameID: game.id,
                                                        gameLocationCity: game.gameLocationCity,
                                                        gameLink: game.gameLink,
                                                        gameDescriptionP: game.gameDescriptionP,
                                                        gameDescriptionH3: game.gameDescriptionH3,
                                                        gameDescriptionH2: game.gameDescriptionH2,
                                                        gamePlayZoneImage1: game.gamePlayZone.items[0].gameZoneImage,
                                                        gameMap: game.gameMap
                                                    })}>
                                                    More Game Detail
                                                </Button>

                                            </View>

                                            <span className="italics">Tap on Leaderboard to see average time.</span>
                                        </View>
                                    </View>
                                    </View>
                                </Card>
                            ))}
                        </Flex>
                    </View>

                    {createPortal(<Modal
                        closeTimeoutMS={200}
                        isOpen={modalIsOpenLeaderBoard}
                        onRequestClose={closeModalLeaderBoard}
                        className={"modalContent"}
                        contentLabel={"Leader Board"}
                        overlayClassName={"slide-from-top"}
                        parentSelector={() => document.querySelector('#modal')}
                        preventScroll={
                            false
                            /* Boolean indicating if the modal should use the preventScroll flag when
                               restoring focus to the element that had focus prior to its display. */}
                    >
                            <View className={"modal-top-bar"}>
                                <Heading level={4} marginBottom="10px" className={"modal-header"}>Leaderboard</Heading>
                                <Button className="close-button-modal light"
                                        onClick={closeModalLeaderBoard}>X</Button>
                            </View>
                    <LeaderBoard gameID={gameDetails.gameID} gameName={gameDetails.gameName}
                                 isGameLeaderBoardVisible={isGameLeaderBoardVisible}
                                 setIsGameLeaderBoardVisible={setIsGameLeaderBoardVisible}/>
                            <View paddingTop="10px" textAlign={"center"} width={"100%"}>
                                <Button className="close light" onClick={closeModalLeaderBoard}>close</Button>
                            </View>
                    </Modal>,
                        document.getElementById("modal")
                    )}

                    {/* testing modals */}
                    {createPortal(
                        <Modal2 show={modal} title="How to Play" close={Toggle}>
                          this is a modal!
                        </Modal2>,
                        document.getElementById("modal")
                    )}
                    {createPortal(<Modal
                            closeTimeoutMS={200}
                        isOpen={modalIsOpenHowTo}
                        onRequestClose={closeModalHowTo}
                        className={"modalContent"}
                        contentLabel={"How To Play"}
                            overlayClassName={"slide-from-top"}
                        parentSelector={() => document.querySelector('#modal')}
                        preventScroll={
                            false
                            /* Boolean indicating if the modal should use the preventScroll flag when
                               restoring focus to the element that had focus prior to its display. */}
                        >


                            <View className={"modal-top-bar"}>
                                <Heading level={4} marginBottom="10px" className={"modal-header"}>How To Play</Heading>
                                <Button className="close-button-modal light"
                                        onClick={closeModalHowTo}>X</Button>
                            </View>
                            <Accordion.Container allowMultiple>
                                <Accordion.Item value="start-game">
                                    <Accordion.Trigger>
                                        <strong>Start Game</strong>
                                        <Accordion.Icon/>
                                    </Accordion.Trigger>
                                    <Accordion.Content>
                                        <View>
                                            <ul className={"how-to-play-bullets"}>
                                                <li>Sign in or create a FREE account with your smartphone:<br/>
                                                    <View className="small italics">Currently you can sign in with
                                                        email/password. It's probably best to set an easy password,
                                                        there will be no sensitive data to steal here or you can use
                                                        your google account to sign in. We will not do anything with your email.
                                                    </View>
                                                </li>
                                                <li>Select game</li>
                                                <li>Go to Location</li>
                                                <li>Hit Play, agree to waiver, and select a team name to use as your
                                                    team name.
                                                </li>
                                                <li>Start game and solve the puzzles.</li>
                                                <li>The BACK BUTTON is not needed - please do not use.</li>
                                            </ul>
                                        </View>
                                    </Accordion.Content>
                                </Accordion.Item>
                                <Accordion.Item value="levels">
                                    <Accordion.Trigger>
                                        <strong>What are Levels?</strong>
                                        <Accordion.Icon/>
                                    </Accordion.Trigger>
                                    <Accordion.Content>
                                        <View>
                                            <View marginTop={"10px"}>Games have different levels -</View>
                                            <ul className={"how-to-play-bullets"}>
                                                <li><strong>level 1</strong> is more like a scavenger hunt. You try
                                                    to find items referenced in clues and provide numbers, or
                                                    colors, or lists of things that match a certain criteria.<br/>
                                                    <View className="small italics"> Requirements - reading
                                                        comprehension, understanding orientation, counting, some
                                                        light math.</View></li>
                                                <li><strong>level 2</strong> is more like an escape-room style
                                                    puzzle with elements of a scavenger hunt.
                                                    You try to find items referenced in clues and use deduction to
                                                    figure out the clues. <br/>
                                                    <View className="small italics"> Requirements: Attention to
                                                        detail, knowing a little math, and understanding
                                                        orientation, like north, south, etc is useful</View></li>
                                                <li><strong>level 3</strong> are more elaborate escape-room style
                                                    puzzles with elements of a scavenger hunt.
                                                    Find referenced items and use deduction to figure out the
                                                    clues. <br/>
                                                    <View className="small italics">Requirements: Observation, Using
                                                        Logic, Attention to detail, knowing a little math, and
                                                        understanding orientation, like north, south, etc is
                                                        useful.</View></li>
                                            </ul>
                                        </View>
                                    </Accordion.Content>
                                </Accordion.Item>
                                <Accordion.Item value="About-Games">
                                    <Accordion.Trigger>
                                        <strong>About Games</strong>
                                        <Accordion.Icon/>
                                    </Accordion.Trigger>
                                    <Accordion.Content>
                                        <ul className={"how-to-play-bullets"}>
                                            <li>Our games are played on location with your smartphone.</li>
                                            <li>Gameplay has elements of geocaching, scavenger hunts, and even
                                                escape room style puzzles that involve logic, finding patterns,
                                                deciphering codes, and more.
                                            </li>
                                            <li>Gameplay is limited to a certain walkable area like a public park or
                                                business and surrounding area.
                                            </li>
                                            <li>All information needed to solve puzzles in game are located within
                                                that area except for basic knowledge like reading comprehension and
                                                some math and navigation skills.
                                            </li>
                                            <li>Once you start playing your time starts - time ends when you
                                                complete the game. Your time is your score.
                                            </li>

                                            <li>View the leaderboard on individual game to see best times.</li>
                                        </ul>
                                    </Accordion.Content>
                                </Accordion.Item>
                                <Accordion.Item value="group-play">
                                    <Accordion.Trigger>
                                        <strong>Group Play vs Individual Play</strong>
                                        <Accordion.Icon/>
                                    </Accordion.Trigger>
                                    <Accordion.Content>
                                        <View>
                                            Play can be group or individual -
                                            <ul className={"how-to-play-bullets"}>
                                                <li>For individual play, sign in and select a team name that
                                                    reflects your individuality.
                                                </li>
                                                <li>For group play, one person signs in and selects the team name
                                                    and hits play - the official timed game starts.
                                                    The other players can use the same sign in and select the same
                                                    game (and it doesn't matter what team name you select - probably
                                                    best to choose the same one) because
                                                    the only official score is the first time a single sign in (by
                                                    email) plays a game.
                                                </li>
                                                <li>That 2nd or 3rd attempt with with same credentials can play a
                                                    game multiple times but it does not go on the leaderboard.
                                                </li>
                                                <li>If a group wants to do team play it is best to choose an email
                                                    that can be easily verified and an easy password
                                                </li>

                                            </ul>
                                        </View>
                                    </Accordion.Content>
                                </Accordion.Item>
                                <Accordion.Item value="play-zones">
                                    <Accordion.Trigger>
                                        <strong>What are Play Zones?</strong>
                                        <Accordion.Icon/>
                                    </Accordion.Trigger>
                                    <Accordion.Content>
                                        <View>
                                            <ul className={"how-to-play-bullets"}>
                                                <li>Play zones indicate the area that the clue references.</li>
                                                <li>Most clues can be solved within a few hundred feet of the play
                                                    zone image.
                                                </li>
                                            </ul>
                                        </View>
                                    </Accordion.Content>
                                </Accordion.Item>
                                <Accordion.Item value="about-escapeoutgames">
                                    <Accordion.Trigger>
                                        <strong>About EscapeOut.Games</strong>
                                        <Accordion.Icon/>
                                    </Accordion.Trigger>
                                    <Accordion.Content>
                                        <View>

                                            <ul className={"how-to-play-bullets"}>
                                                <li>EscapeOut.Games used to run the Escape Room on Tybee:<br/>
                                                    <Link href={"https://escapetybee.com/"} isExternal={true}>Escape
                                                        Tybee</Link> <br/>
                                                    - where friends and families had good experiences solving
                                                    puzzles together.
                                                </li>
                                                <li>Due to Covid and other factors Escape Tybee closed, but the joy
                                                    in creating fun experiences is still a goal so
                                                    EscapeOut.games was started.
                                                </li>
                                                <li>EscapeOut.Game's Mission: Getting friends and families outdoors
                                                    and having fun experiences solving puzzles together.<br/>
                                                    <strong> Any and all feedback is appreciated so this goal can be
                                                        realized.</strong></li>
                                                <li>More information at: <br/>
                                                    <Link href={"https://escapeout.games/"}>EscapeOut.games</Link>
                                                </li>
                                            </ul>
                                        </View>
                                    </Accordion.Content>
                                </Accordion.Item>
                            </Accordion.Container>
                        <View paddingTop="10px" textAlign={"center"} width={"100%"}>
                            <Button className="close light" onClick={closeModalHowTo}>close</Button>
                        </View>
                    </Modal>,
                        document.getElementById("modal")
                    )}



                    {/* Stats View */}
                    {createPortal(<Modal
                            closeTimeoutMS={200}
                            isOpen={modalIsOpenStats}
                            onRequestClose={closeModalStats}
                            className={"modalContent"}
                            contentLabel={"Stats"}
                            overlayClassName={"slide-from-top"}
                            parentSelector={() => document.querySelector('#modal')}
                            preventScroll={
                                false
                                /* Boolean indicating if the modal should use the preventScroll flag when
                                   restoring focus to the element that had focus prior to its display. */}
                        >
                    <MyStats email={email} closeModalStats={closeModalStats} /> </Modal>,
                        document.getElementById("modal")
                        )}


                    {/* Game Intro */}
                    {createPortal(<Modal
                        closeTimeoutMS={200}
                        isOpen={modalIsOpenGameIntro}
                        onRequestClose={closeModalGameIntro}
                        className={"modalContent"}
                        contentLabel={"Waiver"}
                        overlayClassName={"slide-from-top"}
                        parentSelector={() => document.querySelector('#modal')}
                        preventScroll={
                            false
                            /* Boolean indicating if the modal should use the preventScroll flag when
                               restoring focus to the element that had focus prior to its display. */}
                    >
                            <View className={"modal-top-bar"}>
                                <Heading level={4} marginBottom="10px" className={"modal-header"}>{game.gameName}</Heading>
                                <Button className="close-button-modal light"
                                        onClick={closeModalGameIntro}>X</Button>
                            </View>
                            <Heading level={5} marginBottom="10px">Your score is your time.</Heading>
                            <View className={"end-paragraph"}>Time doesn't stop until you complete the game.
                                <Heading level={6} marginTop={"10px"} textDecoration={"underline"} onClick={openModalGameDetail}>See All Game Details</Heading>
                            </View>
                            <Heading level={5} marginTop={"10px"}>Start Playing when you are here:</Heading>
                            <View className={"end-paragraph"} textAlign={"center"}>

                                <Image maxHeight="100px" src={game.gamePlayZoneImage1}/>
                            </View>

                            {(numberOfTimes != 0) ? (
                                <View className="small italics end-paragraph" marginTop={"10px"} textAlign={"center"}> You have
                                    played {numberOfTimes} time(s) before - this game's score will not be on the leaderboard. </View>
                            ) :null}
                            <View className={"end-paragraph"}
                               onClick={openModalWaiver} marginTop="10px" textAlign={"center"} textDecoration={"underline"}><strong>{(waiverSigned === game.gameID) ? "You have signed waiver -  View Waiver " : "Please Sign Waiver"}</strong>
                            </View>
                            <View className={"end-paragraph"}>
                            <TextField
                                name="TeamNameField"
                                margin="10px auto"
                                maxWidth="300px"
                                placeholder=""
                                label="Your Team Name for this game?"
                                required
                                value={teamName}
                                onChange={(e) => setTeamNameFunction(e.target.value)}
                            />
                            </View>
                            <View className={"red-alert"} textAlign={"center"}><strong>{numberOfPlayersError}</strong></View>
                            <View className={"modal-bottom-bar"}>
                                    <Button margin="0 0 0 0" className="button small"
                                            onClick={() => goToGame(gameDetails)}>PLAY - time starts</Button>

                                    <Button className="close light" onClick={closeModalGameIntro}>close</Button>
                            </View>

                        </Modal>,
                        document.getElementById("modal")
                        )}
                    {/* Game Detail View - make sure after game intro */}
                    {createPortal(<Modal
                            closeTimeoutMS={200}
                            isOpen={modalIsOpenGameDetail}
                            onRequestClose={closeModalGameDetail}
                            className={"modalContent"}
                            contentLabel={"Game Details"}
                            overlayClassName={"slide-from-bottom"}
                            parentSelector={() => document.querySelector('#modal')}
                            preventScroll={
                                false
                                /* Boolean indicating if the modal should use the preventScroll flag when
                                   restoring focus to the element that had focus prior to its display. */}
                        >
                            <View className={"modal-top-bar"}>
                                <Heading level={4} marginBottom="10px" className={"modal-header"}>{gameDetails.gameName}</Heading>
                                <Button className="close-button-modal light"
                                        onClick={closeModalGameDetail}>X</Button>
                            </View>


                            <View className={"game-details-content"}>
                                <Heading level={5}>Mission</Heading>
                                <View className={"end-paragraph"}>{gameDetails.gameDescriptionP}</View>

                                <Heading level={5} >Scoring</Heading>
                                <View className={"end-paragraph"}>Your score is your time. Time doesn't stop until you complete the game.</View>
                                <Heading level={5} >Hints</Heading>
                                <View className={"end-paragraph"}>Click on <strong>Hints</strong> to see if you want to use available hints. Once you choose a <strong>Hint</strong>  <span
                                    className="italics"><strong> 5 minutes</strong></span> is added to your time.</View>
                                <Heading level={5} >Notes</Heading>
                                <View className={"end-paragraph"}>The <strong>Notes</strong> area can be used to write custom notes or save certain information to help you solve the puzzles.</View>
                                <Heading level={5} >Game Starts Here:</Heading>
                                <View className={"end-paragraph"}>
                                    <Image maxHeight="150px" src={gameDetails.gamePlayZoneImage1}/>
                                </View>
                                <Heading level={5} >Game Map:</Heading>
                                <View className={"end-paragraph"}>
                                    <Image maxHeight="150px" src={gameDetails.gameMap}/>
                                </View>

                            </View>

                            <View className={"modal-bottom-bar"}>
                                <Button className="close light" onClick={closeModalGameDetail}>close</Button>
                            </View>
                        </Modal>,
                        document.getElementById("modal")
                    )}
                    {/* end Game Detail */}
                    {/* waiver - make sure this is the last portal so it goes over game intro */}
                    {createPortal(<Modal
                            closeTimeoutMS={200}
                            isOpen={modalIsOpenWaiver}
                            onRequestClose={closeModalWaiver}
                            className={"modalContent"}
                            contentLabel={"Waiver"}
                            overlayClassName={"slide-from-top"}
                            parentSelector={() => document.querySelector('#modal')}
                            preventScroll={
                                false
                                /* Boolean indicating if the modal should use the preventScroll flag when
                                   restoring focus to the element that had focus prior to its display. */}
                        >
                            <View className={"modal-top-bar"}>
                                <Heading level={4} marginBottom="10px" className={"modal-header"}>Waiver for {game.gameName}</Heading>
                                <Button className="close-button-modal light"
                                        onClick={closeModalWaiver}>X</Button>
                            </View>

                            <View className={"end-paragraph"} paddingTop={"20px"}><strong>I will respect all laws, rules, and property
                                rights of the area.</strong> I will try not to annoy those around me.</View>

                            <View className={"end-paragraph"} paddingTop={"20px"}><strong>Game play is entirely up to me</strong> and at my discretion and I assume all of the risks of participating in this activity.
                            </View>
                            <View className={"end-paragraph"} paddingTop={"20px"}>
                                <strong>I WAIVE, RELEASE, AND DISCHARGE </strong> from any and all liability for
                                EscapeOut.Games and
                                its parent company (Coastal Initiative, LLC).
                            </View>
                            <View className={"end-paragraph"} paddingTop={"20px"}><strong>I certify that I have read this document and I fully understand its content.
                                I am aware that this is a release of liability and a contract and I sign it of
                                my own free will.
                            </strong>
                            </View>

                            <Flex width={"100%"} marginTop={"10px"} alignItems={"center"} justifyContent="center"  direction="column">
                                {(waiverSigned === game.gameID) ? (<View maxWidth={"200px"} ><strong>You have signed waiver.</strong></View>) : (
                                    <Button maxWidth={"200px"} textAlign="center" marginTop={"10px"} className="button" onClick={() => agreeToWaiverFunction()}>I
                                        agree to Waiver - clicking indicates signing</Button>)}
                                <Button maxWidth={"200px"} textAlign="center" marginTop={"10px"}  className="button" onClick={() => {
                                    /* removeLocalStorage();*/
                                    closeModalWaiver();
                                }}>Close Waiver</Button>
                            </Flex>
                        </Modal>,
                        document.getElementById("modal")
                    )}
                <View ariaLabel={"footer"} className={"main-content"} marginTop="1em">
                    <View textAlign="center"> © 2022 - {format(Date(), "yyyy")} EscapeOut.Games<br/>
                        <Link
                            href="https://escapeout.games/privacy-policy/"
                            isExternal={true}
                            textDecoration="underline"
                        >
                            Privacy Policy
                        </Link> |&nbsp;
                        <Link
                            href="https://escapeout.games/terms-of-service/"
                            isExternal={true}
                            textDecoration="underline"
                        >
                            Terms of Service
                        </Link>
                    </View>
                </View>

            </View>
            </View>
        );
    }
}