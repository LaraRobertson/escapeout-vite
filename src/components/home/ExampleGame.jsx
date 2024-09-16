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
                        <View className={"example"}><strong>Zones - icons at the top of screen</strong></View>
                        <View className={"example"}>Tap Zone # icon to show Clues and Puzzles in Other Zones</View>
                        <View className={"example"}>Clues are within 100 feet of Zone.</View>
                        <View className={"example"}>Find the other Zones during game play.</View>
                        <Image src={"https://escapeoutbucket2183723-dev.s3.amazonaws.com/public/ExampleGameLayout-Zones.jpg"} alt={"clues and puzzles"}/><br />

                    </View>
                </View>
            </>
        )
}