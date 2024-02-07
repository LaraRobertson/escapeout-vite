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
    Accordion, Tabs, Link, TextField
} from '@aws-amplify/ui-react';
import {
    gamesByCity,
    usersByEmail,
    userGamePlaysByUserId,
    gameStatsByGameID,
    gameScoreByGameStatsID,
    getGameStats,
    getGameScore, gameStatsSortedByGameName, getGameHint, getGame
} from "../graphql/queries";
import {
    createGameScore,
    createGameStats,
    createUser,
    createUserGamePlay, updateGameStats
} from "../graphql/mutations";
import { useNavigate } from 'react-router-dom';
import {removeLocalStorage, goHomeQuit} from "./helper";
import {generateClient} from "aws-amplify/api";
import {fetchUserAttributes} from "aws-amplify/auth";

export function Home() {
    const client = generateClient();
    const initialStateGame = {
        gameName: '',
        gameDescriptionH2:'',
        gameDescriptionH3: '',
        gameDescriptionP: '',
        gameGoals: '',
        gameIntro:'',
        gameMap: '',
        gamePlayZoneImage1:''
    };
    const [game,setGame] = useState(initialStateGame);
    const [gamesTybee, setGamesTybee] = useState([]);
    const [userDB, setUserDB] = useState({});
    const [gamesIDUser, setGamesIDUser] = useState([]);
    const [gameID, setGameID] = useState();
    const [gameLocationCity, setGameLocationCity] = useState();
    const [email, setEmail] = useState("");
    const [userName, setUserName] = useState("");
    const [isGameDetailVisible, setIsGameDetailVisible] = useState(false);
    const [isWaiverVisible, setIsWaiverVisible] = useState(false);
    const [isGameIntroVisible, setIsGameIntroVisible] = useState(false);
    const [loading, setLoading] = useState(false);
    const [isHowToPlayVisible, setIsHowToPlayVisible] = useState(true);
    const [teamName, setTeamName] = useState('');
    const [numberOfTimes, setNumberOfTimes] = useState(0);
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
    useEffect(() => {
        console.log("***useEffect***:  fetchGames()");
        fetchGames();
    }, []);

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

    async function logOut() {
        console.log("logout");
        /* save everything for game? */
        /* warning? */
        removeLocalStorage();
        signOut();
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
            console.log("userFromAPI: " + userFromAPI);
            setUserDB(userFromAPI);
        } catch (err) {
            console.log('error fetchUserDB..', err)
        }
    }

    async function fetchGames() {
        console.log("fetchGames");
        setLoading(true);
        let filter = {
            gameType: {
                eq: "free"
            },
            disabled: {
                eq: false
            }
        };
        try {
            const apiData = await client.graphql({
                query: gamesByCity,
                variables: {filter: filter, sortDirection: "DESC", type: "game"}
            });
            const gamesFromAPI = apiData.data.gamesByCity.items;
            setGamesTybee(gamesFromAPI);
            setLoading(false);
        } catch (err) {
            console.log('error fetching gamesByCity', err);
        }
    }

    async function fetchUserGamePlay() {
        console.log("fetchUserGamePlay - userID: " + userDB.id);
        /* check if user in database, if not create user and games */
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
        }
    }
    /*function showMapDetail(cardID) {
        console.log("cardID: " + cardID);
        let detail =  document.getElementById("map"+cardID);
        detail.classList.add('show');
        let buttonShow = document.getElementById("mapButtonShow"+cardID);
        let buttonHide = document.getElementById("mapButtonHide"+cardID);
        buttonHide.classList.add('show');
        buttonHide.classList.remove('hide');
        buttonShow.classList.remove('show');
        buttonShow.classList.add('hide');
    }
    function hideMapDetail(cardID) {
        console.log("cardID: " + cardID);
        let element =  document.getElementById("map"+cardID);
        element.classList.remove('show');
        let buttonShow = document.getElementById("mapButtonShow"+cardID);
        let buttonHide = document.getElementById("mapButtonHide"+cardID);
        buttonHide.classList.add('hide');
        buttonHide.classList.remove('show');
        buttonShow.classList.remove('hide');
        buttonShow.classList.add('show');
    }*/
    async function leaderBoard(gameDetails) {
        localStorage.setItem("gameID",gameDetails.gameID);
        localStorage.setItem("gameName",gameDetails.gameName);
        navigate('/leaderboard');
    }

    function setTeamNameFunction(teamNameValue) {
        console.log("setTeamNameFunction: " + teamNameValue);
        localStorage.setItem("teamName", teamNameValue);
        setTeamName(teamNameValue);
    }
    async function agreeToWaiverFunction() {
        /* check for Team Name */
        console.log("agreeToWaiverFunction - check team name: " + teamName);
        if (teamName != '') {
            isWaiverVisible ? setIsWaiverVisible(false) : setIsWaiverVisible(true);
            isGameIntroVisible ? setIsGameIntroVisible(false) : setIsGameIntroVisible(true);
            console.log ("agreeToWaiverFunction");
            console.log("add game stat");
            const gameStatsValues = {
                waiverSigned: true
            }
            const data = {
                gameID: gameID,
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
                goToGame();
            } catch (err) {
                console.log('error createGameStats..', err)
            }
        } else {
            setNumberOfPlayersError("Please provide a Display Name");
        }
    }
    async function goToGameDetail(gameDetails) {
        try {
            const apiData = await client.graphql({
                query: getGame,
                variables: {id: gameDetails.gameID}
            });
            const gameFromAPI = apiData.data.getGame;
            const gamePlayZones = gameFromAPI.gamePlayZone.items;
            let playZoneImage1 ="xxx";
            console.log("gamePlayZones for loop");
            /* need to figure out a better way... maybe with::
            myArray.filter(item => item.type === 'beta').map(item => item.name) */
            for (const key in gamePlayZones) {
                //console.log(`${key}: ${ gamePlayZones[key]}`);
                for (const key1 in gamePlayZones[key]) {
                    // console.log(`${key1}: ${ gamePlayZones[key][key1]}`);
                    if (key1 === "order" && gamePlayZones[key][key1] === 1) {
                        playZoneImage1 = gamePlayZones[key]["gameZoneImage"]
                    }
                }
            }
            console.log("playzoneImage: " + playZoneImage1);
            const gameStateGame = {
                gameName: gameFromAPI.gameName,
                gameDescriptionH2: gameFromAPI.gameDescriptionH2,
                gameDescriptionH3: gameFromAPI.gameDescriptionH3,
                gameDescriptionP: gameFromAPI.gameDescriptionP,
                gameGoals: gameFromAPI.gameGoals,
                gameIntro: gameFromAPI.gameIntro,
                gameMap: gameFromAPI.gameMap,
                gamePlayZoneImage1: playZoneImage1
            };
            /* set states */
            setGame(gameStateGame);
            setGameID(gameDetails.gameID);
            setIsGameDetailVisible(true);
        } catch (err) {
            console.log('error fetching getGame', err);
        }
    }
    async function goToGame(gameDetails) {
        /* A GameStats entry is added the first time a player chooses to goToGame and signs Waiver */
        /* if player agrees to Waiver there will be an entry in GameStats and a GameScore entry is created in goToGame below */
        /* a player may have multiple GameScore entries because they can play more than once */
        let gameIDFunction = gameID;
        if (gameDetails) {
            console.log("set states because gameDetails");
            try {
                const apiData = await client.graphql({
                    query: getGame,
                    variables: {id: gameDetails.gameID}
                });
                const gameFromAPI = apiData.data.getGame;
                const gamePlayZones = gameFromAPI.gamePlayZone.items;
                let playZoneImage1 ="xxx";
                console.log("gamePlayZones for loop");
                /* need to figure out a better way... maybe with::
                myArray.filter(item => item.type === 'beta').map(item => item.name) */
                for (const key in gamePlayZones) {
                    //console.log(`${key}: ${ gamePlayZones[key]}`);
                    for (const key1 in gamePlayZones[key]) {
                       // console.log(`${key1}: ${ gamePlayZones[key][key1]}`);
                        if (key1 === "order" && gamePlayZones[key][key1] === 1) {
                            playZoneImage1 = gamePlayZones[key]["gameZoneImage"]
                        }
                    }
                }
                console.log("playzoneImage: " + playZoneImage1);
                const gameStateGame = {
                    gameName: gameFromAPI.gameName,
                    gameDescriptionH2: gameFromAPI.gameDescriptionH2,
                    gameDescriptionH3: gameFromAPI.gameDescriptionH3,
                    gameDescriptionP: gameFromAPI.gameDescriptionP,
                    gameGoals: gameFromAPI.gameGoals,
                    gameIntro: gameFromAPI.gameIntro,
                    gameMap: gameFromAPI.gameMap,
                    gameLocationCity: gameFromAPI.gameLocationCity,
                    gamePlayZoneImage1: playZoneImage1
                };
                /* set states */
                setGame(gameStateGame);
                setGameID(gameDetails.gameID);
                gameIDFunction = gameDetails.gameID;
                /*
                setGameName(gameDetails.gameName);
                setGameLink(gameDetails.gameLink);
                setGameLocationCity(gameDetails.gameLocationCity);
                localStorage.setItem("gameDescriptionP", gameDetails.gameDescriptionP);
                localStorage.setItem("gameDescriptionH2", gameDetails.gameDescriptionH2);
                localStorage.setItem("gameDescriptionH3", gameDetails.gameDescriptionH3);
                localStorage.setItem("gameLink", gameDetails.gameLink);
                */
                localStorage.setItem("gameName", gameDetails.gameName);
                localStorage.setItem("gameID", gameDetails.gameID)
            } catch (err) {
                console.log('error fetching getGame', err);
            }
        } else {
            console.log("no gameDetails - back from waiver");
        }
        /* check if gameStats entry */
        let filter = {
            userEmail: {
                eq: email
            }
        };
        try {
            const apiGameStats = await client.graphql({
                query: gameStatsByGameID,
                variables: {filter: filter, gameID: gameIDFunction}
            });
            if (apiGameStats.data.gameStatsByGameID.items.length > 0) {
                /* means user has signed waiver and there is a gameStat and user has either signed waiver or played before */
                /* create a new gameScore and get number of times */
                const gamesStatsFromAPI = apiGameStats.data.gameStatsByGameID.items[0];
                localStorage.setItem("gameStatsID",gamesStatsFromAPI.id);
                try {
                    const apiGameScore = await client.graphql({
                        query: gameScoreByGameStatsID,
                        variables: {gameStatsID: gamesStatsFromAPI.id}
                    });
                    let firstTime = true;
                    if (apiGameScore) {
                        /* user has played before */
                        const gamesScoreFromAPI = apiGameScore.data.gameScoreByGameStatsID.items;
                        console.log("gamesScoreFromAPI (home): " + gamesScoreFromAPI.length);
                        if (Array.isArray(gamesScoreFromAPI)) {
                            //localStorage.setItem("numberOfTimes", gamesScoreFromAPI.length);
                            setNumberOfTimes(gamesScoreFromAPI.length);
                        }
                        /* 2nd or more times for user */
                        firstTime = false;
                    } else {
                       // localStorage.setItem("numberOfTimes", 0);
                        setNumberOfTimes(0);
                    }
                    /* add new game score */
                    const data = {
                        gameStatsID: gamesStatsFromAPI.id,
                        gameID: gamesStatsFromAPI.gameID,
                        gameTotalTime: 0,
                        gameHintTime: 0,
                        completed: false,
                        disabled: false,
                        firstTime: firstTime
                    };
                    try {
                        await client.graphql({
                            query: createGameScore,
                            variables: {input: data},
                        });
                        localStorage.setItem("gameStatsID", gamesStatsFromAPI.id);
                        console.log("go to page: " + '/game');
                        navigate('/game');
                    } catch (err) {
                        console.log('error createGameScore..', err)
                    }
                } catch (err) {
                    console.log('error gameScoreByGameStatsID..', err)
                }
            } else {
                /* no apiGameStats so have to sign waiver */
                console.log("show waiver");
                window.scrollTo(0, 0);
                setIsWaiverVisible(true);
            }
        } catch (err) {
            console.log('error gameStatsByGameID..', err)
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

    function showHowToPlay() {
        console.log("showHowToPlay: ");
        setIsHowToPlayVisible(true);
        window.scrollTo(0, 0);
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
                                    <Button className="topLink" onClick={() => navigate('/login')}>Login to Play</Button>
                                ):(
                                    <Button className="topLink" onClick={() => logOut()}>Logout</Button>
                                )
                                }
                                {(authStatus === 'authenticated')&&(email === "lararobertson70@gmail.com") ? (
                                    <Button className="topLink" onClick={() => navigate('/admin')}>Admin</Button>
                                ): null}
                                <Button className="topLink" onClick={() => showHowToPlay()}>
                                    How to Play
                                </Button>
                                <Button className="topLink" onClick={() =>setIsHowToPlayVisible(false)}>
                                    Game List
                                </Button>
                            </View>
                    </Flex>
                </View>
            <View className={isHowToPlayVisible && !isWaiverVisible ? "main-content light-dark top-main show" : "hide"}  marginBottom="1em">
                <View className="hero">
                    <Heading
                        level={3}
                        textAlign="center"
                        className="hero-heading light-dark">
                        Go Outside and play an <span className="blue blue-light-dark">Intriguing Problem-Solving Game</span> with your family and friends!
                    </Heading>
                    <View className="hero-paragraph light-dark-2">
                        Grab your phone, round up your family and friends, and head outside for a fun-filled day of creative problem-solving, exploration, and excitement!
                        <View className="italics" paddingTop={"2px"}>Games are played at locations in Game List below.</View>
                    </View>
                    <View className="hero-accordion">
                        <Accordion className="light-dark-accordion" allowMultiple
                                   items={[
                                       {
                                           trigger: 'Where to Park?',
                                           value: 'accessible',
                                           content: 'Yes! It uses HTML native elements: <details> and <summary>.'
                                       },
                                       {
                                           trigger: 'Can I customize the styling?',
                                           value: 'styling',
                                           content: 'Of course! See the section on CSS Styling below.'
                                       },
                                       {
                                           trigger: 'Is it a great way to organize content?',
                                           value: 'content',
                                           content: 'Most definitely!'
                                       },
                                       {
                                           trigger: 'Is it a great way to organize content?',
                                           value: 'content!',
                                           content: 'Most definitely!!!'
                                       }
                                   ]}
                        />
                        <Tabs>
                            <Tabs.Item title="How to Play">
                                <View>
                                    <ul>
                                        <li>Our games are played on location with your smartphone. </li>
                                        <li>Gameplay has elements of geocaching, scavenger hunts, and even escape room style puzzles.</li>
                                        <li>Gameplay is limited to a certain walkable area like a public park or restaurant and surrounding area.</li>
                                        <li>All information needed to solve puzzles in game are located within that area.</li>
                                        <li>Once you start playing your time starts - time ends when you complete the game. Your time is your score.</li>

                                        <li>View the leaderboard on individual game to see best times.</li>
                                    </ul>


                                </View>
                            </Tabs.Item>
                            <Tabs.Item title="Group Play">
                                <View>
                                    <ol>
                                        <li>Login or create an account with your smartphone and go to location.</li>
                                        <li>Select game.</li>
                                        <li>Hit Play and select a display name</li>
                                        <li>Start game and solve the puzzles.</li>
                                    </ol>
                                </View>
                            </Tabs.Item>
                            <Tabs.Item title="Levels">
                                <View>
                                    Games have different levels -
                                    <ul>
                                        <li><strong>level 1</strong> is more like a scavenger hunt.</li>
                                        <li>Attention to detail, knowing a little math, and understanding orientation, like north, south, etc is useful.</li>
                                    </ul>
                                </View>
                            </Tabs.Item>
                            <Tabs.Item title="How long?"><View>item 2</View></Tabs.Item>
                        </Tabs>
                    </View>
                    <View>

                        <View className={"light-dark"}>
                            Questions?&nbsp;
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
            <View className={isHowToPlayVisible ? "main-content light-dark" : "main-content light-dark top-main"}>
                {(localStorage.getItem("gameID") !== null &&
                    localStorage.getItem("gameName") !== null &&
                    localStorage.getItem("realTimeStart") !== null &&
                    localStorage.getItem("gameStatsID") !== null &&
                    localStorage.getItem("gameScoreID") !== null) ? (
                    <View textAlign="center" border="1px solid white" padding="10px">
                        Currently Playing: {localStorage.getItem("gameName")} &nbsp;&nbsp;
                        <Button className="go-to-game-button" onClick={() => goToCurrentGame({
                            gameName:localStorage.getItem("gameLink"),
                            gameID:localStorage.getItem("gameID"),
                            gameScoreID:localStorage.getItem("gameScoreID"),
                            gameStatsID:localStorage.getItem("gameStatsID")})}>
                            go back to game
                        </Button><br />
                        <Button className="go-to-game-button" onClick={() => goHomeQuit(navigate)}>
                            Quit Game and See Game List (you will not have a "first time" score)
                        </Button>
                    </View>): null}
                <Heading level={"5"} className={"heading light-dark"} paddingTop={"10px"}>
                    Cities:
                </Heading>
                <Flex wrap="wrap" gap="1rem" direction="row" justifyContent="flex-start" className="light-dark city-links">
                    <View>Tybee Island, GA</View>
                </Flex>
                <View id="game-list"  className={isWaiverVisible ? "hide" : "show"}>
                    <Heading level={"5"} className={"heading light-dark"} marginTop={"15px"}>
                        Game List: Tybee Island, GA
                    </Heading>
                    <Flex className="flex-games">
                        {loading ? (<View>loading</View>):null}
                        {gamesTybee.map((game,index) => (
                            <Card style={divStyle(game.gameImage)} className="game-card" variation="elevated" key={game.id || game.gameName}>
                                <View className="inner-game-card">
                                    <View className="game-card-full">
                                        <Text className="game-card-header">{game.gameName} <span className="small">({game.gameType})</span></Text>
                                    </View>
                                    <View className="game-card-full">
                                        <Text color="white" ><span className="italics">Location</span>: {game.gameLocationPlace}</Text>
                                    </View>
                                    <View className="game-card-full">
                                        <Text color="white"><span className="italics">City</span>: {game.gameLocationCity}</Text>
                                    </View>
                                    <View className="game-card-full">
                                        <Text color="white"><span className="italics">level</span>: {game.gameLink}</Text>
                                    </View>
                                </View>
                                <Flex justifyContent="center">
                                    {authStatus !== 'authenticated' ? (
                                    <View textAlign="center">
                                        <Button className="button button-center button-small show button-light-dark"  onClick={() => navigate('/login')}>
                                            Login to Play Game
                                        </Button>
                                    </View> ):(
                                    <View textAlign="center">
                                    {(gamesIDUser.includes(game.id) || game.gameType === "free" || game.gameType === "free-test") ?
                                        (<div>
                                            <Button className="button button-small button-center button-light-dark show" onClick={() => goToGame({gameName:game.gameName,gameID:game.id,gameLocationCity:game.gameLocationCity,gameLink:game.gameLink,gameDescriptionP:game.gameDescriptionP,gameDescriptionH3:game.gameDescriptionH3,gameDescriptionH2:game.gameDescriptionH2})}>
                                                Play Game
                                            </Button>
                                        </div>) :
                                        (<div></div>)
                                    }
                                     </View>)}
                                    <View>
                                        {(game.gameLink == "memorial")? (
                                            <Button className="button button-small button-center show" onClick={() => leaderBoard2({gameName:game.gameName,gameID:game.id})}>
                                                Leaderboard
                                            </Button>
                                        ):(<Button className="button button-small button-center show" onClick={() => leaderBoard({gameName:game.gameName,gameID:game.id})}>
                                            Leaderboard
                                        </Button>)}
                                    </View>
                                </Flex>
                                <View className="game-card-full light-dark">
                                    <View id={game.id} >
                                        <Heading level={"6"} className="heading light-dark" margin="0">{game.gameDescriptionH2}</Heading>
                                        <Heading level={"7"} className="heading light-dark"  marginBottom=".4em">{game.gameDescriptionH3}</Heading>
                                        <View lineHeight="1">
                                            <Button className="button button-small button-center button-light-dark show" onClick={() => goToGameDetail({gameName:game.gameName,gameID:game.id,gameLocationCity:game.gameLocationCity,gameLink:game.gameLink,gameDescriptionP:game.gameDescriptionP,gameDescriptionH3:game.gameDescriptionH3,gameDescriptionH2:game.gameDescriptionH2})}>
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
                {/* Game Detail View */}
                <View className={isGameDetailVisible ? "cover-screen show-gradual" : "hide"}>
                    <View
                        ariaLabel="Game intro"
                        textAlign="center"
                        className="all-screen show-gradual">
                        <Heading level={4} marginBottom="10px" color="black">Game Name: {game.gameName}</Heading>

                        <View className={"blue-alert"} margin="10px auto" padding="5px" width="90%" lineHeight="18px">
                            <View color="#0D5189"><strong>{game.gameIntro}</strong></View>
                            <View>{game.gameGoals}</View>
                            <View className="small italics">{game.gameDescriptionP}</View>
                        </View>


                        <View width="90%" margin="0 auto" lineHeight="16px">
                            <Flex direction="row" justifyContent="center">
                                <View marginBottom={"10px"}><strong>SCORE</strong>: <span className="small">Your score is your time. Time doesn't stop until you complete the game.</span>
                                </View>
                                <View>
                                    <strong>HELP</strong>: <span className="small">  Click on <strong>Help</strong> for more
                    information and links to Hints.</span>
                                    <View  marginBottom={"10px"} className={"blue-alert alert small"}>If you <span className="italics"> click/tap/press a Hint you get <strong>5 minutes</strong> </span>added to your time.</View>
                                </View>
                                 <View>
                                     <strong>NOTES</strong>: <span className="small">Click on <strong>Notes</strong> to write notes during
            game. These notes are not saved once you complete game.</span>
                                </View>
                            </Flex>
                        </View>
                        <View>
                            <span className="small"> <strong>Remember, your time to complete the game is your score and is calculated when you start playing. Hints add 5 minutes.</strong> </span><br />
                            <strong>Start Playing when you are here:</strong>
                        </View>

                        <View>
                            <Image maxHeight="150px" src={game.gamePlayZoneImage1} />
                        </View>
                        <View>
                            <Image maxHeight="150px" src={game.gameMap} />
                        </View>

                        <View marginTop="10px">
                            <Button className="button right-button small" onClick={() => setIsGameDetailVisible()}>Back To Game List</Button>
                        </View>
                    </View>
                </View>
                {/* end Game Detail */}
                <View className={isWaiverVisible ? "cover-screen show-gradual" : "hide"}>
                    <View className={isGameIntroVisible? "hide" : "all-screen show-gradual" }>
                        <Heading level={4} marginBottom="10px" color="black">Waiver for {game.gameName}</Heading>
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
                            <Button textAlign="center" className="button" onClick={() => setIsGameIntroVisible(true)}>I agree to Waiver - clicking indicates signing</Button>
                            <Button textAlign="center" className="button" onClick={() => {removeLocalStorage();setIsWaiverVisible(false)}}>Close Waiver</Button>
                        </Flex>
                    </View>
                    {/* Game Intro: after agreeing to waiver set team name */}
                    <View
                        ariaLabel="Game intro"
                        textAlign="center"
                        className={isGameIntroVisible? "all-screen show-gradual" : "hide"}>
                        <Heading level={4} marginBottom="10px" color="black">Game Name: {game.gameName}</Heading>

                        <View className={"blue-alert"} margin="10px auto" padding="5px" width="90%" lineHeight="18px">
                            <View color="#0D5189"><strong>{game.gameIntro}</strong></View>
                            <View>{game.gameGoals}</View>
                            <View className="small italics">{game.gameDescriptionP}</View>
                        </View>

                        <View className={"red-alert"}>{numberOfPlayersError}</View>

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
                        {(numberOfTimes != 0) ? (
                            <View className="small italics"  margin="0 0 5px 0"> You have played {localStorage.getItem("numberOfTimes")} time(s) before - good luck this time! </View>
                        ) : <View color={"red"}>This is your first time playing this game. Once you hit <strong>PLAY</strong> the game starts. Only first time game scores are competitive with others.</View>}

                        <View width="90%" margin="0 auto" lineHeight="16px">
                            <Flex direction="row" justifyContent="center">
                                <View marginBottom={"10px"}><strong>SCORE</strong>: <span className="small">Your score is your time. Time doesn't stop until you complete the game.</span>
                                </View>
                                <View>
                                    <strong>HELP</strong>: <span className="small">  Click on <strong>Help</strong> for more
                    information and links to Hints.</span>
                                    <View  marginBottom={"10px"} className={"blue-alert alert small"}>If you <span className="italics"> click/tap/press a Hint you get <strong>5 minutes</strong> </span>added to your time.</View>
                                </View>
                                <View>
                                    <strong>NOTES</strong>: <span className="small">Click on <strong>Notes</strong> to write notes during
            game. These notes are not saved once you complete game.</span>
                                </View>
                            </Flex>
                        </View>
                        <View>
                            <span className="small"> <strong>Remember, your time to complete the game is your score and is calculated when you start playing. Hints add 5 minutes.</strong> </span><br />
                            <strong>Start Playing when you are here:</strong>
                        </View>

                        <View>
                            <Image maxHeight="150px" src={game.gamePlayZoneImage1} />
                        </View>


                        <View marginTop="10px">
                            <Button margin="0 0 0 0" className="button small" onClick={() => agreeToWaiverFunction()}>PLAY</Button>
                            <View className="small" marginBottom={".5em"}>(time does not start yet)</View>
                            <Button className="button right-button small" onClick={() => {removeLocalStorage();setIsWaiverVisible(false);setIsGameIntroVisible(false)}}>Back Home</Button>
                        </View>
                    </View>
                </View>
            </View>

            <View className={isWaiverVisible ? "hide" : "main-content light-dark show"} marginTop="1em">
                <View textAlign="center" className={"light-dark"}> © 2023 EscapeOut.Games<br />
                    <Link
                        href="https://escapeout.games/privacy-policy/"
                        className={"light-dark"}
                        isExternal={true}
                        textDecoration="underline"
                    >
                        Privacy Policy
                    </Link> |&nbsp;
                    <Link
                        href="https://escapeout.games/terms-of-service/"
                        className={"light-dark"}
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