// components/Home.js
import React, {createContext, useEffect, useState, useMemo} from "react";
import {
    View,
    useAuthenticator,
    TextField
} from "@aws-amplify/ui-react";
import {
    usersByEmail,
    userGamePlaysByUserId,
    getGameStats,
    getGameScore, listGameStats
} from "../graphql/queries";
import {
    createUser
} from "../graphql/mutations";
import emailjs from "@emailjs/browser";
import {generateClient} from "aws-amplify/api";
import {fetchUserAttributes} from "aws-amplify/auth";
import { MyAuthContext } from '../MyContext';
import LeaderBoard from "../components/home/LeaderBoard";
import MyStats from "../components/home/MyStats";
import GameList from "../components/home/GameList";
import GameIntro from "../components/home/GameIntro";
import GameDetail from "../components/home/GameDetail";
import Hero from "../components/home/Hero";
import { ReactModal } from "../components/Modals";
import TopNav from '../components/home/TopNav';
import CurrentlyPlaying from '../components/home/CurrentlyPlaying';
import HowToPlay from '../components/home/HowToPlay';
import Waiver from '../components/home/Waiver';
import Footer from '../components/home/Footer';

export function Home() {
    const client = generateClient();
    /* route isn't working right 1/14/24 */
    const {  authStatus, user, route, signOut } = useAuthenticator((context) => [
        context.authStatus,
        context.user,
        context.route,
        context.signOut,
    ]);

    /* password for dev */
    const [password,setPassword] = useState("");

    /* gameDetails are for info about the game to be played */
    const [gameDetails, setGameDetails] = useState({});

    /* Modal Content */
    const [modalContent, setModalContent] = useState({open:false, content:""});

    /* logged in user */
    const [email, setEmail] = useState("");
    const [emailStats, setEmailStats] = useState("");
    const [userName, setUserName] = useState("");
    const [userDB, setUserDB] = useState({});
    const [gamesIDUser, setGamesIDUser] = useState([]);
    const [gamesIDUserPlayed, setGamesIDUserPlayed] = useState([]);

    /*const emailRef = useRef<HTMLInputElement>();
    const nameRef = useRef<HTMLInputElement>();*/
    const [loadingEmailJS, setLoadingEmailJS] = useState(false);

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
                    console.log("error createUser..", err)
                }
            }
            /* get userID */
            const userFromAPI = apiUserDB.data.usersByEmail.items[0];
            setUserDB(userFromAPI);
        } catch (err) {
            console.log("error fetchUserDB..", err)
        }
    }

    /* email stuff */
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

    /* userDB - set above */
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
                console.log("gameIDsUserArray: " + gameIDsUserArray);
                setGamesIDUser(gameIDsUserArray);
            } catch (err) {
                console.log("error fetchUserGamePlay..", err)
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
                const gameStatsByID = apiListGameStats.data.listGameStats.items;
                const gameIDUserPlayedArray = gameStatsByID.map(item => {
                    return item.gameID
                })
                console.log("gameIDUserPlayedArray: " + JSON.stringify(gameIDUserPlayedArray));
                setGamesIDUserPlayed(gameIDUserPlayedArray);
            } catch (err) {
                console.log("error listGameStats..", err)
            }
        }

    }

    if ((password != ("go" || "Go")) && authStatus != "authenticated" && window.location.hostname === 'dev.play.escapeout.games') {
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
            <MyAuthContext.Provider value={{ authStatus, email, gamesIDUserPlayed, gamesIDUser, setGameDetails, setModalContent }}>
                <View className="main-container">
                    <TopNav setModalContent={setModalContent} signOut={signOut} />
                    <View className="main-content top-main" marginBottom="1em">
                        <Hero />
                    </View>
                    <View className="main-content">
                        <CurrentlyPlaying />
                        <GameList gameDetails={gameDetails} />
                        <ReactModal modalContent={modalContent} >
                            {(modalContent.content == "Waiver") && <Waiver gameDetails={gameDetails} gameIntro={false}/>}
                            {(modalContent.content == "How To Play") && <HowToPlay />}
                            {(modalContent.content == "Game Intro") && <GameIntro gameDetails={gameDetails} />}
                            {(modalContent.content == "Game Detail") && <GameDetail gameDetails={gameDetails} />}
                            {(modalContent.content == "Leaderboard") && <LeaderBoard gameDetails={gameDetails}/>}
                            {(modalContent.content == "My Stats") && <MyStats /> }
                        </ReactModal>
                        <Footer />
                    </View>
                </View>
            </MyAuthContext.Provider>
        );
    }
}