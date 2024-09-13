// components/ExampleGame.jsx
import React, {useContext} from "react"
import {Button, View, Alert, Flex, Message, Image, Heading} from '@aws-amplify/ui-react';
import {MyAuthContext} from "../../MyContext";

export default function ExampleGame4(props) {
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
                        <View paddingBottom="10px">
                            <View className={"example"}><strong>Your Time is Your Score</strong></View>

                            <View className={"example"}>Your total time is calculated from the time you start game and how many hints you use</View>
                            <View className={"example"}>Time information is right below Zone Game Area and above Clues/Notes area.</View>
                            <Image src={"https://escapeoutbucket2183723-dev.s3.amazonaws.com/public/ExampleGameLayout-time.jpg"} alt={"clues and puzzles"}/>
                            <View className={"example"}>Note: Each hint you use adds 5 minutes to your score.</View>
                        </View>

                    </View>

                </View>
            </>
        )
}