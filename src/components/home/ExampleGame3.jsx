// components/ExampleGame.jsx
import React, {useContext} from "react"
import {Button, View, Alert, Flex, Message, Image} from '@aws-amplify/ui-react';
import {MyAuthContext} from "../../MyContext";

export default function ExampleGame2(props) {
    let gameDetails = props.gameDetails;
    let gameIntro = props.gameIntro;
    const { setModalContent, setGameDetails  } = useContext(MyAuthContext);

    async function nextFunction() {
        /* just set in gameDetails */
        console.log("next function");
        /*setGameDetails({...gameDetails, waiverSigned: gameDetails.gameID, numberOfTimes: 0});*/

    }

    return (
            <>
                <View>
                        <View>
                            <Image width="180px" src={"https://escapeoutbucket2183723-dev.s3.amazonaws.com/public/ExampleLayout-PuzzlePopup.jpg"} alt={"puzzle popup"}/>
                            <View className={"example"}>Puzzle are forms - type in the answer into the appropriate field(s) to solve the puzzle.</View>
                                <View className={"example"}>You have to figure out answers based on clues.</View>
                            <View className={"example"}>If you answer one field correctly there will be a green check. If you answer all the fields correctly
                                there will be a puzzle is solved message and the puzzle will close.</View>
                            <View className={"example"}>   You can close puzzle popup without completing it, your correct answers will still be there.</View>
                            <View className={"example"}>After puzzle closes there may be a Clue available, so be alert.</View>
                        </View>
                </View>
            </>
        )
}