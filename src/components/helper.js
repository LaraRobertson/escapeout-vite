import React, {useEffect, useState} from "react";
import {gameScoreByGameStatsID} from "../graphql/queries";
import {updateGameScore, deleteGameScore, deleteGameStats} from "../graphql/mutations";
import {generateClient} from "aws-amplify/api";

const client = generateClient();

export function intervalFunction(gameTime,stopClock,setGameTime,hintTime1,hintTime2,hintTime3,hintTime4,setGameTimeHint,isIntroVisible) {
    console.log('Logs every 3 seconds');
    console.log('gameTime: ' + gameTime);
    let gameTimeNum = Number((gameTime + .05).toFixed(2));
    console.log('gameTimeNum: ' + gameTimeNum);
    if (!stopClock) {
        localStorage.setItem("gameTime", gameTimeNum);
        setGameTime(gameTimeNum);
        let hintTimeTotalNum = Number(hintTime1 + hintTime2 + hintTime3 + hintTime4);
        console.log("hint time total: " + hintTimeTotalNum);
        localStorage.setItem("gameTimeHint", hintTimeTotalNum);
        setGameTimeHint(hintTimeTotalNum);
    }
    console.log("stopClock: " + stopClock);
}

export function setGameNotesFunction(gameNotes,setGameNotes) {
    console.log("gameNotes: " + gameNotes);
    setGameNotes(gameNotes);
    localStorage.setItem("gameNotes", gameNotes);
}
export function toggleNotes(areNotesVisible,setAreNotesVisible,isCoverScreenVisible,setIsCoverScreenVisible) {
    areNotesVisible ? setAreNotesVisible(false) : setAreNotesVisible(true);
}

export function setNumPlayerFunction(numPlayerValue, setNumberOfPlayers) {
    console.log("numPlayerFunction: " + numPlayerValue);
    localStorage.setItem("numberOfPlayers", numPlayerValue);
    setNumberOfPlayers(numPlayerValue);
}

export function toggleGameIntro(isGameIntroVisible, teamName, setIsGameIntroVisible, setNumberOfPlayersError, setIsIntroVisible) {
    console.log("toggleGameIntro: " + setNumberOfPlayersError);
    if (teamName != '') {
        isGameIntroVisible ? setIsGameIntroVisible(false) : setIsGameIntroVisible(true);
        setIsIntroVisible(true);
    } else {
        setNumberOfPlayersError("Please provide a Display Name");
    }
}

export function setGameTimeFunction(gameTime, setGameTime, gameTimeValue) {
    let gameTimeNum = Number( gameTimeValue);
    console.log("gametimefunction: " + gameTimeNum.toFixed(2));
    localStorage.setItem("gameTime",gameTimeNum.toFixed(2));
    setGameTime(gameTimeNum);
}

export function toggleIntro(isIntroVisible,setIsIntroVisible,setStopClock,gameTime, setGameTime, setRealTimeStart) {
    isIntroVisible ? setIsIntroVisible(false) : setIsIntroVisible(true);
    setStopClock(false);
    let startDate = new Date();
    setRealTimeStart(startDate);
    localStorage.setItem("realTimeStart",startDate);
    setGameTimeFunction(gameTime, setGameTime, .00);
}
export function toggleMap(isMapVisible,setIsMapVisible) {
    isMapVisible ? setIsMapVisible(false) : setIsMapVisible(true);
}
export function toggleHelp(isHelpVisible,setIsHelpVisible,isCoverScreenVisible,setIsCoverScreenVisible) {
    isHelpVisible ? setIsHelpVisible(false) : setIsHelpVisible(true);
    //isCoverScreenVisible ? setIsCoverScreenVisible(false) : setIsCoverScreenVisible(true);
}
export function toggleBackpack(isBackpackVisible,setIsBackpackVisible,isCoverScreenVisible,setIsCoverScreenVisible) {
    isBackpackVisible ? setIsBackpackVisible(false) : setIsBackpackVisible(true);
    // isCoverScreenVisible ? setIsCoverScreenVisible(false) : setIsCoverScreenVisible(true);
}
export function toggleHint1(setHintTime1, isHint1Visible, setIsHint1Visible, hintTime1,  setGameTimeHint, gameTimeHint) {
    /* if not set add 5 to total */
    if (hintTime1 < 5) {
        setHintTime1(5);
        localStorage.setItem("HintTime1", 5);
        let hintTimeTotalNum = Number(gameTimeHint + 5);
        setGameTimeHint(hintTimeTotalNum);
        console.log("hint time total: " + hintTimeTotalNum);
        localStorage.setItem("gameTimeHint", hintTimeTotalNum);
    }
    isHint1Visible ? setIsHint1Visible(false) : setIsHint1Visible(true);
}
export function toggleHint2(setHintTime2,isHint2Visible,setIsHint2Visible, hintTime2,  setGameTimeHint, gameTimeHint) {
    /* if not set add 5 to total */
    if (hintTime2 < 5) {
        setHintTime2(5);
        localStorage.setItem("HintTime2",5);
        let hintTimeTotalNum = Number(gameTimeHint + 5);
        setGameTimeHint(hintTimeTotalNum);
        console.log("hint time total: " + hintTimeTotalNum);
        localStorage.setItem("gameTimeHint", hintTimeTotalNum);
    }
    isHint2Visible ? setIsHint2Visible(false) : setIsHint2Visible(true);
}
export function toggleHint3(setHintTime3,isHint3Visible,setIsHint3Visible, hintTime3,  setGameTimeHint, gameTimeHint) {
    /* if not set add 5 to total */
    if (hintTime3 < 5) {
        setHintTime3(5);
        localStorage.setItem("HintTime3",5);
        let hintTimeTotalNum = Number(gameTimeHint + 5);
        setGameTimeHint(hintTimeTotalNum);
        console.log("hint time total: " + hintTimeTotalNum);
        localStorage.setItem("gameTimeHint", hintTimeTotalNum);
    }
    isHint3Visible ? setIsHint3Visible(false) : setIsHint3Visible(true);
}
export function toggleHint4(setHintTime4,isHint4Visible,setIsHint4Visible, hintTime4,  setGameTimeHint, gameTimeHint) {
    /* if not set add 5 to total */
    if (hintTime4 < 5) {
        setHintTime4(5);
        localStorage.setItem("HintTime4",5);
        let hintTimeTotalNum = Number(gameTimeHint + 5);
        setGameTimeHint(hintTimeTotalNum);
        console.log("hint time total: " + hintTimeTotalNum);
        localStorage.setItem("gameTimeHint", hintTimeTotalNum);
    }
    isHint4Visible ? setIsHint4Visible(false) : setIsHint4Visible(true);
}

export function setCluesFunction(clue,clues,setAlertText,setIsAlertVisible,setClues) {
    setAlertText("clue added to notes");
    setIsAlertVisible(true);
    console.log("clue: " + clue);
    setTimeout(() => {
        setIsAlertVisible(false);
    }, 3000);
    setClues(clues + clue);
    localStorage.setItem("clues",clues + clue);
}

export function setCommentsFunction(notes,setGameComments) {
    console.log('comments: ' + notes);
    /* set localhost variable */
    setGameComments(notes);
}

export async function goHomeQuit(navigate) {
    removeLocalStorage();
    /* remove gameStat and gameScore */
    if (localStorage.getItem("numberOfTimes") == 0) {
        const gameStatDetails = {
            id: localStorage.getItem("gameStatsID"),
        };
        try {
            await client.graphql({
                query: deleteGameStats,
                variables: {input: gameStatDetails}
            });
        } catch (err) {
            console.log('error deleteGameStats..', err)
        }
        const gameScoreDetails = {
            id: localStorage.getItem("gameScoreID"),
        };
        try {
            await client.graphql({
                query: deleteGameScore,
                variables: {input: gameScoreDetails}
            });
        } catch (err) {
            console.log('error deleteGameScore..', err)
        }
    }
    navigate('/');
}

export function leaveComment(setShowComments) {
    console.log('showComments');
    //isCoverScreenVisible ? setIsCoverScreenVisible(false) : setIsCoverScreenVisible(true);
    setShowComments(true);
}

export async function goHome(navigate,gameComments) {
    console.log("game comments: " + gameComments);
    const newGameStats = {
        id: localStorage.getItem("gameScoreID"),
        gameComments: gameComments,
        completed: true
    };
    try {
        await client.graphql({ query: updateGameScore, variables: {input: newGameStats}});
        removeLocalStorage();
        navigate('/');
    } catch (err) {
        console.log('error updateGameScore..', err)
    }

}

export async function setGamePlayFunction(setNumberOfTimes,setGameID,setGameStatsID,setGameScoreID,setIsGameIntroVisible,setIsIntroVisible,gameTime,setGameTime,setGameTimeHint,
                                          setIsAlertVisible,setAlertText,setTeamName, setStopClock, setHintTime1, setHintTime2, setHintTime3, setHintTime4,setRealTimeStart,
                                          setGameNotes,setClues) {
    console.log("setGamePlayFunction - only on mount");
    //* check if already playing */
    console.log ("localStorage.getItem('gameTime'): " + localStorage.getItem('gameTime'));
    console.log ("gameTime: " + gameTime);
    if (localStorage.getItem("realTimeStart")) {
        setStopClock(false);
        setIsGameIntroVisible(false);
        setIsIntroVisible(false);
        setIsAlertVisible(true);
        setAlertText('resuming game');
        setTimeout(() => {
            setIsAlertVisible(false);
        }, 3000);
        setGameNotes(localStorage.getItem("gameNotes"));
        setClues(localStorage.getItem("clues"));
        setRealTimeStart(localStorage.getItem("realTimeStart"));
        setTeamName(localStorage.getItem("teamName"));
        setGameScoreID(localStorage.getItem("gameScoreID"));
        setGameTime(Number(localStorage.getItem('gameTime')));
        setGameTimeHint(Number(localStorage.getItem('gameTimeHint')));
        setHintTime1(Number(localStorage.getItem('HintTime1')));
        setHintTime2(Number(localStorage.getItem('HintTime2')));
        setHintTime3(Number(localStorage.getItem('HintTime3')));
        setHintTime4(Number(localStorage.getItem('HintTime4')));
        /* end check */
    } else {
        console.log("get GameID: " + localStorage.getItem("gameID"));
        console.log("get GameStatsID: " + localStorage.getItem("gameStatsID"));
        /* why need numberoftimes here?*/
        //setNumberOfTimes(localStorage.getItem("numberOfTimes"));
        setGameID(localStorage.getItem("gameID"));
        setGameStatsID(localStorage.getItem("gameStatsID"));
        setGameScoreID(localStorage.getItem("gameScoreID"));
        setStopClock(false);
        let startDate = new Date();
        setRealTimeStart(startDate);
        localStorage.setItem("realTimeStart",startDate);
        setGameTimeFunction(gameTime, setGameTime, .00);
    }
}

export async function winGameFunction(props,gameScoreID,gameTime,gameTimeTotal,setGameTimeTotal,gameTimeHint,numberOfPlayers,teamName, realTimeStart,
                                      hintTime1,hintTime2,hintTime3,hintTime4) {
    console.log("props: " + props);
    console.log("gameTimeTotal: " + gameTimeTotal);
    console.log("winGameFunction");
    /* for end of game: clearInterval(interval);*/
    /* get realTimeStart and get time now and calculate gametime */
    var startDate = new Date(realTimeStart);
    // Do your operations to calculate time
    var endDate   = new Date();
    localStorage.setItem("realTimeEnd",endDate);
    var seconds = (endDate.getTime() - startDate.getTime()) / 60000;
    let hintTimeTotalNum = Number(hintTime1 + hintTime2 + hintTime3 + hintTime4);
    console.log("seconds: " + seconds);
    console.log("gameTime: " + gameTime);
    console.log("stop has been won");
    /* update gameScore based on stop - */
   //updateGameScoreFunction(props,gameScoreID,gameTime,seconds,gameTimeTotal,setGameTimeTotal,gameTimeHint,hintTimeTotalNum,numberOfPlayers,teamName);
   // createGameHintFunction(gameScoreID,gameTimeHint,hintTimeTotalNum);
}


async function createGameHintFunction(gameScoreID,gameTimeHint,hintTimeTotalNum) {
    const data = {
        gameScoreID: gameScoreID,
        gameHintTime: hintTimeTotalNum
    };
    try {
        await client.graphql({
            query: createGameHintTime,
            variables: { input: data },
        });
    } catch (err) {
        console.log('error createGameHintTime..', err)
    }
}

async function updateGameScoreFunction(props,gameScoreID,gameTime,seconds,gameTimeTotal,setGameTimeTotal,gameTimeHint,
                                       hintTimeTotalNum,numberOfPlayers,teamName) {
    console.log("gameScoreID (update):" + gameScoreID);
    let GameTimeTotalVar = Number(gameTimeTotal + seconds + hintTimeTotalNum).toFixed(2);
    console.log("gameTimeTotalVar: " +  GameTimeTotalVar);
    setGameTimeTotal(GameTimeTotalVar);
    const data = {
        id: gameScoreID,
        teamName: teamName,
        gameTotalTime: GameTimeTotalVar,
        completed: props
    };
    console.log("data: " + data);
    /*let testObject = data;
    for (const key in testObject) {
        console.log(`${key}: ${ testObject[key]}`);
        for (const key1 in testObject[key]) {
            //console.log(`${key1}: ${testObject[key][key1]}`);
        }
    }*/
    try {
        const apiUpdateGameScore = await client.graphql({
            query: updateGameScore,
            variables: { input: data }
        });
    } catch (err) {
        console.log('error udpateGameScore', err);
    }
    return(apiUpdateGameScore);
}

export function setTeamNameFunction(teamNameValue,setTeamName) {
    console.log("setTeamNameFunction: " + teamNameValue);
    localStorage.setItem("teamName", teamNameValue);
    setTeamName(teamNameValue);
}

export function showItemContents(value,gameBackpack,isShovelOn,setIsShovelOn,isPrybarOn,setIsPrybarOn,isKeyOn,setIsKeyOn,isKey2On,setIsKey2On) {
    console.log("show contents value: " + value);
    console.log("backpack: " + JSON.stringify(gameBackpack));
    switch (value) {
        case 'shovel':
            console.log("isShovelOn 1: " + isShovelOn);
            setIsShovelOn(!isShovelOn);
            // change image
            for (var i = 0; i < gameBackpack.length; i++) {
                if (gameBackpack[i].key === "shovel") {
                    console.log("turn on/off shovel - state");
                    if (!isShovelOn) {
                        gameBackpack[i].src = "https://escapeoutbucket213334-staging.s3.amazonaws.com/public/hurricane/shovel-using.png"
                        localStorage.setItem("shovel", "https://escapeoutbucket213334-staging.s3.amazonaws.com/public/hurricane/shovel-using.png");
                    } else {
                        gameBackpack[i].src = "https://escapeoutbucket213334-staging.s3.amazonaws.com/public/hurricane/shovel-not-using.png"
                        localStorage.setItem("shovel", "https://escapeoutbucket213334-staging.s3.amazonaws.com/public/hurricane/shovel-not-using.png");
                    }
                }
            }
            break;
        case 'prybar':
            console.log("isPrybarOn 1: " + isPrybarOn);
            setIsPrybarOn(!isPrybarOn);
            // change image
            for (var i = 0; i < gameBackpack.length; i++) {
                if (gameBackpack[i].key === "prybar") {
                    console.log("turn on/off prybar - state");
                    if (!isPrybarOn) {
                        gameBackpack[i].src = "https://escapeoutbucket213334-staging.s3.amazonaws.com/public/hurricane/prybar-using.png"
                        localStorage.setItem("prybar", "https://escapeoutbucket213334-staging.s3.amazonaws.com/public/hurricane/prybar-using.png");
                    } else {
                        gameBackpack[i].src = "https://escapeoutbucket213334-staging.s3.amazonaws.com/public/hurricane/prybar-not-using.png"
                        localStorage.setItem("prybar", "https://escapeoutbucket213334-staging.s3.amazonaws.com/public/hurricane/prybar-not-using.png");
                    }
                }
            }
            break;
        case 'key':
            console.log("isKeyOn 1: " + isKeyOn);
            setIsKeyOn(!isKeyOn);
            // change image
            for (var i = 0; i < gameBackpack.length; i++) {
                if (gameBackpack[i].key === "key") {
                    console.log("turn on/off key - state");
                    if (!isKeyOn) {
                        gameBackpack[i].src = "https://escapeoutbucket213334-staging.s3.amazonaws.com/public/hurricane/key-using.png"
                        localStorage.setItem("key", "https://escapeoutbucket213334-staging.s3.amazonaws.com/public/hurricane/key-using.png");
                    } else {
                        gameBackpack[i].src = "https://escapeoutbucket213334-staging.s3.amazonaws.com/public/hurricane/key-not-using.png"
                        localStorage.setItem("key", "https://escapeoutbucket213334-staging.s3.amazonaws.com/public/hurricane/key-not-using.png");
                    }
                }
            }
            break;
        case 'key2':
            console.log("isKey2On 1: " + isKeyOn);
            setIsKey2On(!isKey2On);
            // change image
            for (var i = 0; i < gameBackpack.length; i++) {
                if (gameBackpack[i].key === "key2") {
                    console.log("turn on/off key2 - state");
                    if (!isKey2On) {
                        gameBackpack[i].src = "https://escapeoutbucket213334-staging.s3.amazonaws.com/public/hurricane/key2-using.png"
                        localStorage.setItem("key2", "https://escapeoutbucket213334-staging.s3.amazonaws.com/public/hurricane/key2-using.png");
                    } else {
                        gameBackpack[i].src = "https://escapeoutbucket213334-staging.s3.amazonaws.com/public/hurricane/key2-not-using.png"
                        localStorage.setItem("key2", "https://escapeoutbucket213334-staging.s3.amazonaws.com/public/hurricane/key2-not-using.png");
                    }
                }
            }
            break;
        default:
    }
}


export function removeLocalStorage() {
    localStorage.removeItem("agreeToWaiver");
    localStorage.removeItem("userAttributes");
    localStorage.removeItem("gameStatsID");
    localStorage.removeItem("gameScoreID");
    localStorage.removeItem("gameID");
    localStorage.removeItem("gameName");
    localStorage.removeItem("gameLink");
    localStorage.removeItem("teamName");
    localStorage.removeItem("gameNameID");
    localStorage.removeItem("gameTime")
    localStorage.removeItem("gameTimeHint");
    localStorage.removeItem("gameTimeTotal");
    localStorage.removeItem("numberOfTimes");
    localStorage.removeItem("numberOfPlayers");
    localStorage.removeItem("key");
    localStorage.removeItem("prybar");
    localStorage.removeItem("shovel");
    localStorage.removeItem("key2");
    localStorage.removeItem("light");
    localStorage.removeItem("HintTime1");
    localStorage.removeItem("HintTime2");
    localStorage.removeItem("HintTime3");
    localStorage.removeItem("HintTime4");
    localStorage.removeItem("realTimeStart");
    localStorage.removeItem("realTimeEnd");
    localStorage.removeItem("gameNotes");
    localStorage.removeItem("clues");
    localStorage.removeItem("gameDescriptionP");
    localStorage.removeItem("gameDescriptionH2");
    localStorage.removeItem("gameDescriptionH3");
}