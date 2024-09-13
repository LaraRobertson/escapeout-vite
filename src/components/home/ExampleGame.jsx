// components/ExampleGame.jsx
import React, {useContext} from "react"
import {Button, View, Alert, Flex, Message, Image, Heading} from '@aws-amplify/ui-react';
import {MyAuthContext} from "../../MyContext";

export default function ExampleGame(props) {
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
                    <View paddingBottom="10px">
                        <View className={"example"}><strong>Zones - icons at the top of screen</strong> <br />(tap zone # icon to change Zones)</View>
                        <View className={"example"}>A game can have 1 Zone or many Zones.</View>
                        <View className={"example"}>A Zone indicates the area that Clues reference so that you can answer Puzzles in that Zone. The area is roughly 250 feet diameter with Zone location at center.</View>
                        <View className={"example"}>You only know where the first Zone is when you start the game, during the game you must find the other Zones.</View>
                        <Image src={"https://escapeoutbucket2183723-dev.s3.amazonaws.com/public/ExampleGameLayout-Zones.jpg"} alt={"clues and puzzles"}/><br />
                        <span className={"small italics"}>This is a screenshot of a Zone in a game at Jaycee Park (excluding yellow).</span>
                    </View>
                </View>
            </>
        )
}