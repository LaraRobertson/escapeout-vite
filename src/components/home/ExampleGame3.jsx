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
                            <View className={"example"}>In this case the Clue called "Magnifying Glass" asked a question, this is where you answer it.</View>
                                <View className={"example"}>Not all
                            answers follow this pattern but the goal is to input the right answers.</View>
                            <View className={"example"}>If you answer one field correctly there will be a green check. If you answer all the fields correctly
                                the puzzle is solved. You can close puzzle popup without completing it, your correct answers will still be there.</View>
                            <View className={"example"}>After puzzle closes there may be a Clue available, so be alert.</View>
                        </View>
                </View>
            </>
        )
}