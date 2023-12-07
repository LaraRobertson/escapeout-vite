// components/Layout.js
import React, {useEffect, useState} from 'react';
import { Outlet, useNavigate, NavLink as ReactRouterLink, useLocation } from 'react-router-dom';
import {useAuthenticator, Link, Button, useTheme, Heading, View, Image, Flex, Card, Text, Tabs,
    ThemeProvider, createTheme, TextField, TextAreaField} from '@aws-amplify/ui-react';
//import {updateGameStats as updateGameStatsMutation} from "../graphql/mutations";
//import {removeLocalStorage} from "./helper";
import { fetchUserAttributes } from 'aws-amplify/auth';
//import { AuthUser } from 'aws-amplify/auth';
//const userAttributes = await fetchUserAttributes();

export function Layout() {
    const [errorInternet, setErrorInternet] = useState(false);
    // hook below is only reevaluated when `user` changes
    const { route, signOut, user } = useAuthenticator((context) => [
        context.route,
        context.signOut,
        context.user
    ]);

    async function handleFetchUserAttributes() {
        try {
            const userAttributes = await fetchUserAttributes();
            console.log("userAttributes.email",userAttributes.email);
            localStorage.setItem("email",userAttributes.email);
        } catch (error) {
            console.log(error);
        }
    }
    useEffect(() => {
        console.log("***useEffect***:  handleFetchUserAttributes()");
        handleFetchUserAttributes();
    }, [user]);

    async function logOut() {
        console.log("logout");
        /* save everything for game? */
        /* get values from local variables - need gamename */
        const gameStatID = localStorage.getItem("gameStatsID");
        const waiverSigned = localStorage.getItem("agreeToWaiver");
        /* update game state */
        //removeLocalStorage();
        /* don't save game stats from home page */
        /* get values from local variables - need gamename and email */
        /*
        const gameStatsValues = {
            waiverSigned: waiverSigned,
            gamePage: "test",
            guessedPuzzle12: false
        }
        const newGameStats = {
            id: gameStatID,
            gameStates: JSON.stringify(gameStatsValues)
        };
        const apiGameStatsUpdate = await API.graphql({ query: updateGameStatsMutation, variables: {input: newGameStats}});*/
        /* end save game stats */
        signOut();
    }

    function goHome() {
        localStorage.setItem("gameName","");
        navigate('/');
    }

    function myStats() {
        navigate('/myStats');
    }


    const ErrorComponent = () => {
        console.log("error in component: " + errorInternet);
        let className = "hide";
        errorInternet ? className ="show" : className="hide";
        return (
            <View className={className} >
                <div>There are errors (probably no internet) and your data did not save.
                    <br />
                    Your progress is not lost.
                    <br />
                    Please do not close window so that your progress can be saved.
                </div>
            </View>
        )
    }


    /* useEffects */
    /*
    So if you want to perform an action immediately after setting state on a state variable,
    we need to pass a callback function to the setState function.
    But in a functional component no such callback is allowed with useState hook.
    In that case we can use the useEffect hook to achieve it.
     */

    const css = `.custom-card-class {
  border: none; background: #262626; 
}.topLink {text-decoration:none;color:#B8CEF9!important}.topNav{ background:#000;
  position: fixed;
  z-index:1;
  top: 0;
  width: 100%; max-width:900px;text-align:center; padding-bottom:10px }`;
    const location = useLocation();
    const navigate = useNavigate();


    // const { tokens } = useTheme();
    console.log("location: " + location.pathname);
    const NavigationButtons = (props) => {
        console.log("props.user.email: " + typeof(props.userAttributes));
        // userAttributes is json
        const userA =  props.userAttributes;
        for (const key in userA) {
             console.log(`${key}: ${userA[key]}`);
            for (const key1 in userA[key]) {
                console.log(`(key1)/${key1}: ${userA[key][key1]}`);
            }
         }
        return (
            <View padding=".5rem 0">
                <Heading level={1}>Hello {user.username} </Heading>
            </View>
        )
    }

    return (
        <View>
            {(route === 'authenticated') && ((location.pathname === '/')||(location.pathname === '/leaderboard')||(location.pathname === '/leaderboard2')||(location.pathname === '/myStats')) ? (
                <View className="main-container">
                    <View className="main-content" padding="100px 0 0 0">
                        <header>
                            <View marginTop="10px">
                                <Image src="https://escapeoutbucket213334-staging.s3.amazonaws.com/public/new-logo-light-smaller.png" />
                            </View>
                        </header>
                        <hr />
                        {(location.pathname === '/') ? (
                            <View>
                                <View color="white" paddingBottom="15px">
                                    <Heading level={"4"} className="heading" textAlign="center">
                                        Play the ultimate outdoor adventure game!
                                    </Heading>
                                    Grab your phone, round up your family and friends, and head outside for a fun-filled day of problem-solving, exploration, and excitement!
                                    <br />(<span className="italics">games are played at locations below</span> )
                                </View>
                                <hr />
                            </View>):null}

                        <NavigationButtons user={user} userAttributes={localStorage.getItem("userAttributes")}/>
                        <View padding=".5rem 0">
                            {(location.pathname === '/leaderboard' || location.pathname === '/leaderboard2') ?
                                ( <View><Button marginBottom="10px" className="button" onClick={() => navigate('/')}>Back to Game List</Button>
                                        | <Button className="button" onClick={() => myStats()}>My Stats</Button> </View>
                                ) : null}
                            {location.pathname === '/' ?
                                (<View><Button className="button" onClick={() => myStats()}>My Stats</Button> |
                                    &nbsp;<Button className="button" onClick={() => logOut()}>Logout</Button>
                                    &nbsp;|
                                    &nbsp;<Button className="button" onClick={() => handleFetchUserAttributes()}>get email</Button></View>)
                                :null}
                            {location.pathname === '/myStats' ?
                                (<Button marginBottom="10px" className="button" onClick={() => navigate('/')}>Back to Game List</Button>)
                                :null}

                        </View>
                    </View>
                </View>
            ): null}
            {(route !== 'authenticated') && ((location.pathname === '/')||(location.pathname === '/login')||(location.pathname === '/leaderboard')||(location.pathname === '/leaderboard2')) ? (
                <View className="main-container">
                    <a id="howtoplay"></a>
                    <View className="main-content" padding="80px 0 0 0">
                        <View className="topNav">
                            <Flex justifyContent="center">
                                <View marginTop="10px">
                                    <Image src="https://escapeoutbucket213334-staging.s3.amazonaws.com/public/new-logo-light-smaller.png" />
                                </View>
                            </Flex>

                            <Flex justifyContent="center">
                                <ReactRouterLink to="/login" className="topLink" component={Link}>Login</ReactRouterLink>
                                <Link
                                    href="#howtoplay"
                                    className="topLink"
                                >
                                    How to Play
                                </Link>
                                <Link
                                    href="#tybeeIsland"
                                    className="topLink"
                                >
                                    Game List
                                </Link>
                            </Flex>
                        </View>

                        {location.pathname != '/login' ? (
                            <View padding="10px 10px 40px 10px">
                                <style>{css}</style>
                                <Heading
                                    level={4}
                                    textAlign="center"
                                    padding="20px 20px 10px 20px">
                                    Go Outside and play a <span className="blue">Puzzling Game</span> with your family and friends!
                                </Heading>

                                <View>
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
                                    <View paddingBottom="10px">Feel free to Test:</View>
                                    <Button marginBottom="10px" className="button bouncy" onClick={() => navigate('/login')}>Login or Create an
                                        Account</Button><br />
                                    Questions?&nbsp;
                                    <Link
                                        href="https://escapeout.games/faqs/"
                                        color="white"
                                        isExternal={true}
                                        textDecoration="underline"
                                    >
                                        Visit FAQs
                                    </Link>
                                </View>
                                <a id="tybeeIsland"></a>
                            </View>):null}
                        <View padding="15px 0 0 0">
                            {(location.pathname === '/login' || location.pathname === '/leaderboard' || location.pathname === '/leaderboard2') ? (
                                <Button marginBottom="10px" className="button" onClick={() => navigate('/')}>Back to Game List</Button>
                            ) : null
                            }
                        </View>

                    </View>
                </View>) : null}

            <ErrorComponent />
            <Outlet />
            {(location.pathname === '/')||(location.pathname === '/login')||(location.pathname === '/leaderboard')||(location.pathname === '/leaderboard2') ? (
                <View className="main-container">
                    <View className="main-content">
                        <View padding="40px 10px 10px 10px" textAlign="center"> © 2023 EscapeOut.Games<br />
                            <Link
                                href="https://escapeout.games/privacy-policy/"
                                color="white"
                                isExternal={true}
                                textDecoration="underline"
                            >
                                Privacy Policy
                            </Link> |
                            <Link
                                href="https://escapeout.games/terms-of-service/"
                                color="white"
                                isExternal={true}
                                textDecoration="underline"
                            >
                                Terms of Service
                            </Link>
                        </View>
                    </View>
                </View>
            ) : null}
        </View>
    );
}