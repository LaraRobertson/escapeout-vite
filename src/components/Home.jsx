// components/Home.js
import React, {useEffect, useState} from "react";
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

export function Home() {
    const client = generateClient();
    const matcher = new RegExpMatcher({
        ...englishDataset.build(),
        ...englishRecommendedTransformers,
    });
    /* game is the game being played */
    const [game,setGame] = useState({});
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

    useEffect(() => {
        console.log("***useEffect***:  fetchGames():");
        fetchGames();
    }, []);

    /* get email and other user information using amplify's methods */
    /* https://docs.amplify.aws/react/build-a-backend/auth/manage-user-session/ */
    /* https://docs.amplify.aws/react/build-a-backend/auth/manage-user-profile/ */
    useEffect(() => {
        if (user) {
            console.log("***useEffect***: fetchUserDB user.username: " + user.username);
            /*for (const key in user) {
                console.log(`${key}: ${ user[key]}`);
            }*/
            handleFetchUserAttributes({"userName": user.username});

        }
    },[user]);

    async function handleFetchUserAttributes(props) {
        try {
            const userAttributes = await fetchUserAttributes();
            console.log("userAttributes.email (home) " + userAttributes.email);
            setEmail(userAttributes.email);
            fetchUserDB({"email":userAttributes.email, "userName": props.userName});
        } catch (error) {
            console.log(error);
        }
    }

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

    useEffect( () => {
        fetchUserGamePlay();
    }, [userDB]);

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
        setGameDetails(gameDetails);
        /*setGameID(gameDetails.gameID);*/
        setIsGameDetailVisible(true);
    }

    function goToLeaderBoard(gameDetails) {
        /* set states */
        console.log("goToLeaderBoard: " + gameDetails.gameID);
        setGameDetails(gameDetails);
        /*setGameID(gameDetails.gameID);*/
        setIsGameLeaderBoardVisible(true);
    }

    function setTeamNameFunction(teamNameValue) {
        console.log("setTeamNameFunction: " + teamNameValue);
        /* check for obscenities */
        if (matcher.hasMatch(teamNameValue)) {
            setNumberOfPlayersError("The Display Name contains profanities. Please choose another.");
            setTeamName("");
        } else {
            setNumberOfPlayersError("");
            localStorage.setItem("teamName", teamNameValue);
            setTeamName(teamNameValue);
        }
    }

    async function goToWaiver(gameDetailsVar) {
        /* set gameDetails state */
        setGame(gameDetailsVar);
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
                        setNumberOfTimes(0);
                    }

                } catch (err) {
                    console.log('error gameScoreByGameStatsID..', err)
                }
                /* go to game intro */
                console.log("show game intro: gotowaiver()");
                setTeamName('');
                setNumberOfPlayersError("");
                setIsGameIntroVisible(true);
            } else {
                /* go to waiver */
                console.log("show waiver");
                setIsWaiverVisible(true);
            }
        } catch (err) {
            console.log('error gameScoreByGameStatsID..', err)
        }

    }

    async function agreeToWaiverFunction() {
        console.log("agreeToWaiverFunction");
        if (isWaiverVisible) {
            console.log ("agreeToWaiverFunction");
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
                        setIsWaiverVisible(false);
                        /* go to game intro */
                        console.log("show game intro - agreetowaiver()");
                        setTeamName('');
                        setNumberOfPlayersError("");
                        setIsGameIntroVisible(true);
                    } else {
                        /* go to waiver */
                        console.log("show waiver");
                        setIsWaiverVisible(true);
                    }
                } catch (err) {
                    console.log('error gameScoreByGameStatsID..', err)
                }
            } catch (err) {
                console.log('error createGameStats..', err)
            }
        }

    }

    async function goToGame() {
        console.log("goToGame: " + game.gameID);
        /* A GameStats entry is added the first time a player plays and signs Waiver */
        /* if player agrees to Waiver there will be an entry in GameStats and a GameScore entry is created in goToGame below */
        /* a player may have multiple GameScore entries because they can play more than once */
        /* check for team name */
        if (teamName != "") {
            /* get game score */
                setIsGameIntroVisible(false);
                setNumberOfPlayersError("");
                let firstTime = true;
                if (numberOfTimes > 0) {
                    firstTime = false;
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
                    localStorage.setItem("gameName",game.gameName);
                    console.log("go to page: " + '/game');
                    navigate('/game');
                } catch (err) {
                    console.log('error createGameScore..', err)
                }
        } else {
            console.log("show game intro: gotogame()");
            setTeamName('');
            setNumberOfPlayersError("Please provide a Display Name");
            setIsGameIntroVisible(true);
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

    const divStyle = (src) => ({
        background:  "url(" + src + ") 0 0 / contain no-repeat"
    })

    return (
        <View className="main-container">
                <View className="topNav">
                    <Flex justifyContent="center">
                        <View marginTop="10px">
                            <Image src="https://escapeoutbucket213334-staging.s3.amazonaws.com/public/new-logo-light-smaller.png" />
                        </View>
                    </Flex>
                    <Flex justifyContent="center">
                            <View>
                                {authStatus !== 'authenticated' ? (
                                    <Button className="topLink" onClick={() => navigate('/login')}>Sign in to Play</Button>
                                ):(
                                   <Button className="topLink" onClick={() => logOut()}>Sign Out</Button>
                                )
                                }

                                {authStatus === 'authenticated' ? (
                                <Button className="topLink" onClick={() => goToMyStats()}>
                                    My Stats
                                </Button> ):(null)}
                                <Button className="topLink " onClick={() => {setIsHowToPlayVisible(true);}}>
                                    How to Play
                                </Button>
                                {(authStatus === 'authenticated')&&(email === "lararobertson70@gmail.com") ? (
                                    <Button className="topLink" onClick={() => navigate('/admin')}>Admin</Button>
                                ): null}
                            </View>
                    </Flex>
                </View>
            <View className="main-content top-main"  marginBottom="1em">
                <View className="hero">
                    <Heading
                        level={5}
                        textAlign="center"
                        className="heading">
                        Go Outside and play an <span className="blue-light">Intriguing Problem-Solving Game</span> with your family and friends!
                    </Heading>
                    <View className="hero-paragraph">
                        Grab your phone, round up your family and friends, and head outside for a fun-filled day of creative puzzles, exploration, and excitement!
                        <View className="italics" paddingTop={"2px"} fontSize={".8em"} textAlign={"center"}>Games are meant to be played on smartphone at locations in Game List below.</View>
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
                        Currently Playing: {localStorage.getItem("gameName")} &nbsp;&nbsp;<br />
                        <Button className="go-to-game-button dark" onClick={() => goToCurrentGame({
                            gameName:localStorage.getItem("gameLink"),
                            gameID:localStorage.getItem("gameID"),
                            gameScoreID:localStorage.getItem("gameScoreID"),
                            gameStatsID:localStorage.getItem("gameStatsID")})}>
                            go back to game
                        </Button><br />
                        <Button className="go-to-game-button dark" onClick={() => goHomeQuit(navigate)}>
                            Quit Game (if this is your first time playing you will not have a "first time" score - no chance for leaderboard)
                        </Button>
                    </View></View></View>): null}
                <View id="game-list"  className={isWaiverVisible ? "hide" : "show"}>
                    <View className={"blue-alert"} margin="0 auto 5px auto" textAlign={"center"} fontSize={".8em"} padding="5px" lineHeight="1.2em">
                        <strong>GAMES ARE IN TESTING MODE</strong>
                    </View>
                    <Heading level={"6"} className="heading" marginBottom={"10px"}>
                        Game List (select city) -
                        <Button className={hidePlayedGames? "hide": "close dark small"} marginLeft="5px" padding="2px 4px" onClick={() => setHidePlayedGames(true)}>hide played games</Button>
                        <Button className={hidePlayedGames? "close dark small": "hide"} marginLeft="5px"padding="2px 4px" onClick={() => setHidePlayedGames(false)}>show all games</Button>
                    </Heading>

                    <Flex
                        direction="row"
                        justifyContent="flex-start"
                        alignItems="stretch"
                        alignContent="flex-start"
                        wrap="wrap"
                        gap="1rem"
                    >
                    <Button marginRight="5px" className={"button-small small"} backgroundColor={(localStorage.getItem("gameLocationCity") === "Tybee Island")? ("#0d5189" ): ("transparent")} color="white" onClick={() => setGameLocationCityFunction("Tybee Island")}>Tybee Island, GA
                        {(localStorage.getItem("gameLocationCity") === "Tybee Island")? (<View>&nbsp;- selected</View> ): (null)}
                    </Button>
                        {/*}   <Button marginRight="5px" className={"button-small small"} backgroundColor={(localStorage.getItem("gameLocationCity") === "Savannah")? ("#7e0b0b" ): ("transparent")} color="white"  onClick={() => setGameLocationCityFunction("Savannah")}>Savannah, GA
                            {(localStorage.getItem("gameLocationCity") === "Savannah")? (<View>&nbsp;- selected</View> ): (null)}
                        </Button>*/}
                    </Flex>

                    <Flex className="flex-games">
                        {loading ? (<View>loading</View>):null}
                        {gameListByCity.map((game,index) => (
                            <Card style={divStyle(game.gameImage)} className={(gamesIDUserPlayed.includes(game.id) && hidePlayedGames)? "hide" : "game-card"} variation="elevated" key={game.id || game.gameName}>

                                <View className="inner-game-card">
                                    <View className="game-card-full">
                                        {gamesIDUserPlayed.includes(game.id) ? (
                                            <Text className="game-card-header played">{game.gameName} <span className="small">(played)</span></Text>

                                        ):(
                                            <Text className="game-card-header">{game.gameName} <span className="small">({game.gameType})</span></Text>
                                        )}

                                    </View>
                                    <View className="game-card-full">
                                        <Text color="white" ><span className="italics">Location</span>: {game.gameLocationPlace}</Text>
                                    </View>
                                    <View className="game-card-full">
                                        <Text color="white"><span className="italics">City</span>: {game.gameLocationCity}</Text>
                                    </View>
                                    <View className="game-card-full">
                                        <Text color="white"><span className="italics">Level</span>:  {game.gameLevel}
                                           &nbsp; <Button className="help" onClick={() => isHowToPlayVisible ? setIsHowToPlayVisible(false) : setIsHowToPlayVisible(true)}>
                                                <Icon
                                                    height={"20px"}
                                                    width={"20px"}
                                                    ariaLabel="Help"
                                                    viewBox={{ minX: 0,
                                                        minY: 0,
                                                        width: 400,
                                                        height: 400 }}
                                                    paths={[
                                                        {
                                                            d: 'M199.996,0C89.719,0,0,89.72,0,200c0,110.279,89.719,200,199.996,200C310.281,400,400,310.279,400,200,C400,89.72,310.281,0,199.996,0z M199.996,373.77C104.187,373.77,26.23,295.816,26.23,200,c0-95.817,77.957-173.769,173.766-173.769c95.816,0,173.772,77.953,173.772,173.769,C373.769,295.816,295.812,373.77,199.996,373.77z',
                                                            stroke: '#202020',
                                                        },
                                                        {
                                                            d: 'M199.996,91.382c-35.176,0-63.789,28.616-63.789,63.793c0,7.243,5.871,13.115,13.113,13.115,c7.246,0,13.117-5.873,13.117-13.115c0-20.71,16.848-37.562,37.559-37.562c20.719,0,37.566,16.852,37.566,37.562,c0,20.714-16.849,37.566-37.566,37.566c-7.242,0-13.113,5.873-13.113,13.114v45.684c0,7.243,5.871,13.115,13.113,13.115,s13.117-5.872,13.117-13.115v-33.938c28.905-6.064,50.68-31.746,50.68-62.427C263.793,119.998,235.176,91.382,199.996,91.382z',
                                                            stroke: '#202020',
                                                        },
                                                        {
                                                            d: 'M200.004,273.738c-9.086,0-16.465,7.371-16.465,16.462s7.379,16.465,16.465,16.465c9.094,0,16.457-7.374,16.457-16.465,S209.098,273.738,200.004,273.738z',
                                                            stroke: '#202020',
                                                        },
                                                    ]}
                                                /></Button>
                                        </Text>
                                    </View>
                                    <View className="game-card-full">
                                        <Text color="white">{game.walkingDistance} walking distance</Text>
                                    </View>
                                </View>

                                <Flex justifyContent="center">
                                    {authStatus !== 'authenticated' ? (
                                    <View textAlign="center">
                                        <Button className="button button-center button-small show button-light-dark"  onClick={() => navigate('/login')}>
                                            Sign in to Play Game
                                        </Button>
                                    </View> ):(
                                    <View textAlign="center">


                                    {(gamesIDUser.includes(game.id) || game.gameType === "free" || game.gameType === "free-test") ?
                                        (<div>
                                            <Button className="button button-small button-center button-light-dark show" onClick={() => goToWaiver({gameName:game.gameName,gameID:game.id,gameLocationCity:game.gameLocationCity,gameLink:game.gameLink,gameDescriptionP:game.gameDescriptionP,gameDescriptionH3:game.gameDescriptionH3,gameDescriptionH2:game.gameDescriptionH2,gamePlayZoneImage1: game.gamePlayZone.items[0].gameZoneImage,gameMap: game.gameMap})}>
                                                Play Game
                                            </Button>
                                        </div>) :
                                        (<div></div>)
                                    }
                                     </View>)}
                                    <View ariaLabel={"leaderboard-"+ game.id}>
                                        {(game.gameLocationPlace == "memorial")? (
                                            <Button className="button button-small button-center show" onClick={() => leaderBoard2({gameName:game.gameName,gameID:game.id})}>
                                                Leaderboard
                                            </Button>
                                        ):(<Button className="button button-small button-center show" onClick={() => goToLeaderBoard({gameName:game.gameName,gameID:game.id})}>
                                            Leaderboard
                                        </Button>)}
                                    </View>

                                </Flex>
                                <View className="game-card-full light-dark">
                                    <View id={game.id} >
                                        <Heading level={"6"} className="heading light-dark" margin="0">{game.gameDescriptionH2}</Heading>
                                        <Heading level={"7"} className="heading light-dark"  marginBottom=".4em">{game.gameDescriptionH3}</Heading>
                                        <View lineHeight="1">

                                            <Button className="button button-small button-center button-light-dark show" onClick={() => goToGameDetail({gameName:game.gameName,gameID:game.id,gameLocationCity:game.gameLocationCity,gameLink:game.gameLink,gameDescriptionP:game.gameDescriptionP,gameDescriptionH3:game.gameDescriptionH3,gameDescriptionH2:game.gameDescriptionH2,gamePlayZoneImage1: game.gamePlayZone.items[0].gameZoneImage,gameMap: game.gameMap})}>
                                                More Game Detail
                                            </Button>

                                        </View>

                                        <span className="italics">Tap on Leaderboard to see average time.</span>
                                    </View>
                                </View>
                            </Card>
                        ))}
                    </Flex>
                </View>
                {isGameLeaderBoardVisible && <LeaderBoard gameID = {gameDetails.gameID} gameName={gameDetails.gameName} isGameLeaderBoardVisible = {isGameLeaderBoardVisible} setIsGameLeaderBoardVisible = {setIsGameLeaderBoardVisible}/>}

                {/* How To Play View */}
                <View className={isHowToPlayVisible ? "overlay" : "hide"}>
                    <View className="popup"
                          ariaLabel="How to Play">
                        <Heading level={4} marginBottom="10px">How To Play</Heading>
                        <View width="100%" margin="0 auto" lineHeight="17px">
                            <Button className="close-button light" onClick={() => isHowToPlayVisible ? setIsHowToPlayVisible(false) : setIsHowToPlayVisible(true)}>X</Button>

                            <View className={"blue-alert"} margin="10px auto" padding="5px" width="90%" lineHeight="1em" fontSize={".8em"}>
                                <strong>GAMES ARE IN BETA/TESTING MODE<br /> - no guarantees for a perfect experience (but we hope you like them)</strong>
                            </View>
                            <Accordion.Container allowMultiple  defaultValue={['levels']}>
                                <Accordion.Item value="how-to-play">
                                    <Accordion.Trigger>
                                        <strong>How to Play?</strong>
                                        <Accordion.Icon />
                                    </Accordion.Trigger>
                                    <Accordion.Content>
                                        <View>
                                            <ol className={"how-to-play-bullets"}>
                                                <li>Sign in or create an account with your smartphone:<br />
                                                    <View className="small italics">Currently you can sign in with email/password. It's probably best to set an easy password, there will be no sensitive data to steal here or you can use your google account to sign in.
                                                    </View>
                                                </li>
                                                <li>Go To Location.</li>
                                                <li>Select game.</li>
                                                <li>Hit Play, agree to waiver, and select a display name to use as your team name.</li>
                                                <li>Start game and solve the puzzles.</li>
                                                <li>The BACK BUTTON is not needed - please do not use.</li>
                                            </ol>
                                        </View>
                                    </Accordion.Content>
                                </Accordion.Item>
                                <Accordion.Item value="levels">
                                    <Accordion.Trigger>
                                        <strong>What are Levels?</strong>
                                        <Accordion.Icon />
                                    </Accordion.Trigger>
                                    <Accordion.Content>
                                        <View>
                                            <View marginTop={"10px"}>Games have different levels -</View>
                                            <ul className={"how-to-play-bullets"}>
                                                <li><strong>level 1</strong> is more like a scavenger hunt. You try to find items referenced in clues and provide numbers, or colors, or lists of things that match a certain criteria.<br />
                                                    <View className="small italics"> Requirements - reading comprehension, understanding orientation, counting, some light math.</View></li>
                                                <li><strong>level 2</strong> is more like an escape-room style puzzle with elements of a scavenger hunt.
                                                    You try to find items referenced in clues and use deduction to figure out the clues. <br />
                                                    <View className="small italics"> Requirements: Attention to detail, knowing a little math, and understanding orientation, like north, south, etc is useful</View></li>
                                                <li><strong>level 3</strong> are more elaborate escape-room style puzzles with elements of a scavenger hunt.
                                                    Find referenced items and use deduction to figure out the clues. <br />
                                                    <View className="small italics">Requirements: Observation, Using Logic, Attention to detail, knowing a little math, and understanding orientation, like north, south, etc is useful.</View></li>
                                            </ul>
                                        </View>
                                    </Accordion.Content>
                                </Accordion.Item>
                                <Accordion.Item value="About-Games">
                                    <Accordion.Trigger>
                                        <strong>About Games</strong>
                                        <Accordion.Icon />
                                    </Accordion.Trigger>
                                    <Accordion.Content>
                                        <ul className={"how-to-play-bullets"}>
                                            <li>Our games are played on location with your smartphone. </li>
                                            <li>Gameplay has elements of geocaching, scavenger hunts, and even escape room style puzzles that involve logic, finding patterns, deciphering codes, and more.</li>
                                            <li>Gameplay is limited to a certain walkable area like a public park or business and surrounding area.</li>
                                            <li>All information needed to solve puzzles in game are located within that area except for basic knowledge like reading comprehension and some math and navigation skills.</li>
                                            <li>Once you start playing your time starts - time ends when you complete the game. Your time is your score.</li>

                                            <li>View the leaderboard on individual game to see best times.</li>
                                        </ul>
                                    </Accordion.Content>
                                </Accordion.Item>
                                <Accordion.Item value="group-play">
                                    <Accordion.Trigger>
                                        <strong>Group Play vs Individual Play</strong>
                                        <Accordion.Icon />
                                    </Accordion.Trigger>
                                    <Accordion.Content>
                                        <View>
                                            Play can be group or individual -
                                            <ul className={"how-to-play-bullets"}>
                                                <li>For individual play, sign in and select a display name that reflects your individuality.</li>
                                                <li>For group play, one person signs in and selects the display name (or team name) and hits play - the official timed game starts.
                                                    The other players can use the same sign in and select the same game (and it doesn't matter what team name you select - probably best to choose the same one) because
                                                    the only official score is the first time a single sign in (by email) plays a game.</li>
                                                <li>That 2nd or 3rd attempt with with same credentials can play a game multiple times but it does not go on the leaderboard.</li>
                                                <li>If a group wants to do team play it is best to choose an email that can be easily verified and an easy password</li>

                                            </ul>
                                        </View>
                                    </Accordion.Content>
                                </Accordion.Item>
                                <Accordion.Item value="play-zones">
                                    <Accordion.Trigger>
                                        <strong>What are Play Zones?</strong>
                                        <Accordion.Icon />
                                    </Accordion.Trigger>
                                    <Accordion.Content>
                                        <View>
                                            <ul className={"how-to-play-bullets"}>
                                                <li>Play zones indicate the area that the clue references.  </li>
                                                <li>Most clues can be solved within a few hundred feet of the play zone image.</li>
                                            </ul>
                                        </View>
                                    </Accordion.Content>
                                </Accordion.Item>
                                <Accordion.Item value="about-escapeoutgames">
                                    <Accordion.Trigger>
                                        <strong>About EscapeOut.Games</strong>
                                        <Accordion.Icon />
                                    </Accordion.Trigger>
                                    <Accordion.Content>
                                        <View>

                                            <ul className={"how-to-play-bullets"}>
                                                <li>EscapeOut.Games used to run the Escape Room on Tybee:<br />
                                                    <Link  href={"https://escapetybee.com/"} isExternal={true} >Escape Tybee</Link> <br />
                                                    - where friends and families had good experiences solving puzzles together.</li>
                                                <li>Due to Covid and other factors Escape Tybee closed, but the joy in creating fun experiences is still a goal so
                                                    EscapeOut.games was started.
                                                </li>
                                                <li>EscapeOut.Game's Mission: Getting friends and families outdoors and having fun experiences solving puzzles together.<br />
                                                    <strong> Any and all feedback is appreciated so this goal can be realized.</strong></li>
                                                <li>More information at: <br />
                                                    <Link href={"https://escapeout.games/"}>EscapeOut.games</Link> </li>
                                            </ul>
                                        </View>
                                    </Accordion.Content>
                                </Accordion.Item>
                            </Accordion.Container>
                        <View>


                        </View>



                    </View>
                        <View paddingTop="10px" textAlign={"center"} width={"100%"}>
                        <Button className="close light" onClick={() => setIsHowToPlayVisible(false)}>close</Button>
                        </View>
                    </View>
                    {/*<View className={"bottom-popup-button"}>
                        <View className="inside-bottom-popup-button">
                        <Button className="button right-button small" onClick={() => setIsHowToPlayVisible(false)}>close</Button>
                        </View>
                    </View>*/}
                </View>
                {/* end How to Play */}

                {/* Game Detail View */}
                <View className={isGameDetailVisible ? "overlay" : "hide"}>
                    <View className="popup"
                        ariaLabel="Game detail"
                        textAlign="center">
                        <Heading level={4} marginBottom="10px" className={"heading light"}>Game Name:<br /> {gameDetails.gameName}</Heading>
                        <Button className="close-button light" onClick={() => setIsGameDetailVisible(false)}>X</Button>

                        <View className={"blue-alert"} margin="10px auto" padding="5px" width="90%" lineHeight="18px">
                            <View color="#0D5189"><strong>{gameDetails.gameIntro}</strong></View>
                            <View>{gameDetails.gameGoals}</View>
                            <View className="small italics">{gameDetails.gameDescriptionP}</View>
                        </View>
                        <View width="90%" margin="0 auto" lineHeight="13px">
                            <Flex direction="row" justifyContent="center">
                                <View marginBottom={"10px"}><strong>SCORE</strong>: <span className="small">Your score is your time. Time doesn't stop until you complete the game.</span>
                                </View>
                                <View>
                                    <strong>HINTS</strong>: <span className="small">  The HINT POPUP contains helpful information and some hints that cost you time.</span>
                                </View>
                                 <View>
                                     <strong>NOTES</strong>: <span className="small">Click on <strong>Notes</strong> to write notes during
            game. These notes are not saved once you complete game.</span>
                                </View>
                            </Flex>
                        </View>

                        <View  marginBottom={"10px"} className={"blue-alert alert small"}>If you <span className="italics"> select a a single Hint in the HINTS popup you get <strong>5 minutes</strong> </span>added to your time.</View>

                        <View lineHeight={".8em"} marginBottom={"5px"}>
                            <span className="small"> <strong>Remember, your time to complete the game is your score and is calculated when you start playing. Hints add 5 minutes.</strong> </span><br />

                        </View>

                        <View>
                            <strong>Start Playing when you are here:</strong><br />
                            <Image maxHeight="150px" src={gameDetails.gamePlayZoneImage1} />
                        </View>
                        <View>
                            <strong>Game Map</strong><br />
                            <Image maxHeight="150px" src={gameDetails.gameMap} />
                        </View>

                        <View marginTop="10px">
                            <Button className="close small" onClick={() => setIsGameDetailVisible(false)}>close</Button>
                        </View>
                    </View>
                </View>
                {/* end Game Detail */}

                {isMyStatsVisible && <MyStats email={email} isMyStatsVisible={isMyStatsVisible} setIsMyStatsVisible={setIsMyStatsVisible} />}

                <View className={(isWaiverVisible) ? "overlay" : "hide"}>
                    <View className="popup">
                        <Heading level={4} marginBottom="10px">Waiver for {game.gameName}</Heading>
                        <Alert variation="info" hasIcon={false}><strong>I will respect all laws, rules, and property rights of the area.
                            I will try not to annoy those around me.</strong></Alert>
                        <View>
                            <View margin="10px 0">
                                <span className="italics bold">Game play is entirely up to me and at my discretion and I assume all of the risks of participating in this activity.</span>
                            </View>
                            <View margin="10px 0">
                                <strong>I WAIVE, RELEASE, AND DISCHARGE </strong> from any and all liability for EscapeOut.Games and
                                its parent company (Coastal Initiative, LLC).
                            </View>
                            <View width="95%"  margin="10px auto" textAlign="center" >
                                <strong>I certify that I have read this document and I fully understand its content.
                                    I am aware that this is a release of liability and a contract and I sign it of my own free will.
                                </strong>
                            </View>

                        </View>
                        <Flex justifyContent="center" wrap='wrap'>
                            <Button textAlign="center" className="button" onClick={() =>  agreeToWaiverFunction()}>I agree to Waiver - clicking indicates signing</Button>
                            <Button textAlign="center" className="button" onClick={() => {removeLocalStorage();setIsWaiverVisible(false)}}>Close Waiver</Button>
                        </Flex>
                    </View>
                </View>
                <View className={(isGameIntroVisible) ? "overlay" : "hide"}>
                    <View
                        ariaLabel="Game intro"
                        textAlign="center"
                        className="popup">
                        <Heading level={4} marginBottom="10px">Game Name: {game.gameName}</Heading>

                        <View className={"blue-alert"} margin="0 auto" padding="5px" width="90%" >
                            <View color="#0D5189"><strong>{game.gameIntro}</strong></View>
                            <View>{game.gameGoals}</View>
                            <View className="small italics">{game.gameDescriptionP}</View>
                        </View>
                        <View>
                            <strong>Game Map</strong><br />
                            <Image maxHeight="100px" src={game.gameMap} />
                        </View>
                        <View lineHeight={".9em"}>
                            <span className="small"> <strong>Remember, your time to complete the game is your score and is calculated when you start playing. Each Hint adds 5 minutes to your time.</strong> </span><br />

                        </View>
                        <View>
                            <strong>Start Playing when you are here:</strong><br />
                            <Image maxHeight="100px" src={game.gamePlayZoneImage1} />
                        </View>

                        {(numberOfTimes != 0) ? (
                            <View className="small italics"  margin="0 0 5px 0"> You have played {numberOfTimes} time(s) before - good luck this time! </View>
                        ) : <View className="small italics"  color={"red"}>This is your first time playing this game. Once you hit <strong>PLAY</strong> the game starts. Only first time game scores are competitive with others.</View>}

                        <TextField
                            name="TeamNameField"
                            margin="10px auto"
                            maxWidth="300px"
                            placeholder=""
                            label="Your Display Name for this game?"
                            required
                            value={teamName}
                            onChange={(e) => setTeamNameFunction(e.target.value)}
                        />
                         <View className={"red-alert"}>{numberOfPlayersError}</View>
                        <View marginTop="10px">
                            <Button margin="0 0 0 0" className="button small" onClick={() => goToGame(gameDetails)}>PLAY</Button>
                            <View className="small" marginBottom={".5em"}>(when you hit play, time starts, so make sure you are in the right place)</View>
                            <Button className="button right-button small" onClick={() => {removeLocalStorage();setIsWaiverVisible(false);setIsGameIntroVisible(false)}}>Don't Play. Go Back Home</Button>
                        </View>
                    </View>
                </View>
            </View>

            <View ariaLabel={"footer"} className={"main-content"} marginTop="1em">
                <View textAlign="center"> © 2022 - {format(Date(), "yyyy")} EscapeOut.Games<br />
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
    );
};