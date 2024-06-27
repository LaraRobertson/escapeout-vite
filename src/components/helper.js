import React, {useEffect, useState} from "react";
import {gameScoreByGameStatsID} from "../graphql/queries";
import {updateGameScore, deleteGameScore, deleteGameStats} from "../graphql/mutations";
import {generateClient} from "aws-amplify/api";

const client = generateClient();

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

export function setGameTimeFunction(gameTime, setGameTime, gameTimeValue) {
    let gameTimeNum = Number( gameTimeValue);
    console.log("gametimefunction: " + gameTimeNum.toFixed(2));
    localStorage.setItem("gameTime",gameTimeNum.toFixed(2));
    setGameTime(gameTimeNum);
}

export function setCommentsFunction(notes,setGameComments) {
    console.log('comments: ' + notes);
    /* set localhost variable */
    setGameComments(notes);
}

export async function goHomeQuit(navigate) {
    removeLocalStorage();
    localStorage.removeItem("gameScoreID");
    /* remove gameStat and gameScore - why?? lnr 3/23/24 */
    /* do not set numberOfTimes in local storage and not sure why doing this because it never fires */
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

export function removeLocalStorage() {
    localStorage.removeItem("agreeToWaiver");
    localStorage.removeItem("userAttributes");
    localStorage.removeItem("gameStatsID");
    /* leave it for comments
    localStorage.removeItem("gameScoreID");
     */
    localStorage.removeItem("gameID");
    localStorage.removeItem("gameName");
    localStorage.removeItem("teamName");
    localStorage.removeItem("gameTime")
    localStorage.removeItem("gameHintVisible");
    localStorage.removeItem("realTimeStart");
    localStorage.removeItem("realTimeEnd");
    localStorage.removeItem("gameNotes");
    localStorage.removeItem("clues");
    localStorage.removeItem("gameDescriptionP");
    localStorage.removeItem("gameDescriptionH2");
    localStorage.removeItem("gameDescriptionH3");
    localStorage.removeItem("gamePuzzleSolved");
    localStorage.removeItem("backpackObject");
}