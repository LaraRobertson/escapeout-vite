// components/Admin.jsx
import React, {useEffect, useState} from 'react';
import {
    Button,
    View,
    useAuthenticator, Image
} from '@aws-amplify/ui-react';
import {
    gamesByCity,
    usersByEmail,
    listUsers, getGame, listGames,
    getGamePlayZone, getGameHint, getGameClue, getGamePuzzle,
    getTextField, userGamePlaysByUserId, listGameStats
} from "../../graphql/queries";
import { format } from 'date-fns'
import * as mutations from '../../graphql/mutations';

import {Navigate, useLocation, useNavigate} from 'react-router-dom';
import {generateClient} from "aws-amplify/api";
import { fetchUserAttributes } from 'aws-amplify/auth';
import {deleteGameHint} from "../../graphql/mutations";
import { saveAs } from 'file-saver';
import {HeadingComponent, AdminNav} from "../../components/admin/pageElements";
import "../../assets/admin.css";
import {NotAvailable} from "../../components/sharedComponents";
import HomeSection from "../../components/admin/HomeSection";
import UserSection from "../../components/admin/UserSection";
import GameSection from "../../components/admin/GameSection";
import { MyAuthContext } from '../../MyContext';
import {ReactModalFromRight} from "../../components/Modals";
import GameForm from "../../components/admin/GameForm";
import ZoneForm from "../../components/admin/ZoneForm";
import PuzzleForm from "../../components/admin/PuzzleForm";
import TextFieldForm from "../../components/admin/TextFieldForm";
import ClueForm from "../../components/admin/ClueForm";
import HintForm from "../../components/admin/HintForm";
import GameStats from "../../components/admin/GameStats";
import UserStats from "../../components/admin/UserStats";
import CityForm from "../../components/admin/CityForm";

export function Users() {
    const initialStateDisplaySection = {
        gameSection: false,
        userSection: true,
        adminSection: false,
        homeSection: false,
    };
    const [displaySection, setDisplaySection] = useState(initialStateDisplaySection);
    const [email, setEmail] = useState();
    const [modalContent, setModalContent] = useState({open:false, content:"",id:"",action:"", gameID:"",zoneID:"",updatedDB:false});
    const [formCreateGameStateBackup, setFormCreateGameStateBackup] = useState({"gameName":"New"});
    const [userID, setUserID] = useState('');
    const [gameID, setGameID] = useState();
    const [gameName, setGameName] = useState();
    const [backupIDArray, setBackupIDArray] = useState([]);
    const client = generateClient();
    const {  authStatus, user, route } = useAuthenticator((context) => [
        context.authStatus,
        context.user,
        context.route
    ]);
    const navigate = useNavigate();
    const location = useLocation();
    /* userDB - set above */


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


    /* ADMIN */

    async function deleteGameHintTimeFunction(gameHintTimeID) {
        const data = {
            id: gameHintTimeID
        }
        await client.graphql({
            query: deleteGameHintTime,
            variables: { input: data },
        });
    }

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
        if (user) {
            console.log("***useEffect***: handleFetchUserAttribues: " + user.userName);
            handleFetchUserAttributes({"userName": user.userName});
        }
    },[user]);

    function showGameStats(props) {
        window.scrollTo(0, 0);
        console.log("props.gameName: " + props.gameName);
        setIsUserStatVisible(true);
        setIsCoverScreenVisible(true);
        gameStatsFunction({gameName:props.gameName});
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


    return (
        <MyAuthContext.Provider value={{ authStatus, email, setModalContent, modalContent, setBackupIDArray, backupIDArray }}>
                {(authStatus != 'authenticated') | (authStatus === "configuring") ? (
                    <NotAvailable authStatus={authStatus} />
                ) : (
                          <View className={"admin-content"}>
                            {(displaySection.homeSection) && <HomeSection />}
                            {(displaySection.userSection) && <UserSection />}
                            {(displaySection.gameSection) && <GameSection  setFormCreateGameStateBackup={setFormCreateGameStateBackup} formCreateGameStateBackup={formCreateGameStateBackup}/>}
                            <ReactModalFromRight>
                                {(modalContent.content == "Game Form") && <GameForm  setFormCreateGameStateBackup={setFormCreateGameStateBackup} />}
                                {(modalContent.content == "Stats") && <GameStats modalContent={modalContent} />}
                                {(modalContent.content == "Zone Form") && <ZoneForm formCreateGameStateBakcup={formCreateGameStateBackup}/>}
                                {(modalContent.content == "Puzzle Form") && <PuzzleForm formCreateGameStateBackup={formCreateGameStateBackup}/>}
                                {(modalContent.content == "TextField Form") && <TextFieldForm />}
                                {(modalContent.content == "Clue Form") && <ClueForm />}
                                {(modalContent.content == "Hint Form") && <HintForm />}
                                {(modalContent.content == "User Stats") && <UserStats />}
                                {(modalContent.content == "City Form") && <CityForm />}
                            </ReactModalFromRight>
                        </View>

                    )}
        </MyAuthContext.Provider>
    )

}