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
                        <View className={"example"}><strong>Clue Icons on Left, Puzzle Icons on Right.</strong></View>
                        <Image width="200px" src={"https://escapeoutbucket2183723-dev.s3.amazonaws.com/public/ExampleGameLayout-CluesPuzzles.jpg"} alt={"clues and puzzles"}/>
                        <Image width="180px" src={"https://escapeoutbucket2183723-dev.s3.amazonaws.com/public/ExampleGameLayout-CluesPopup.jpg"} alt={"clue popup"}/>
                        <View className={"example"}>The Clue title is <strong>"Envelope"</strong>. The Clue Popup will ask a question, or show an image, or provide some words.
                            You have to figure out what it means.</View>
                        <View className={"example"}>You can add the Clue information to the Clues/Notes Area to use later too.</View>
                    </View>

                </View>
            </>
        )
}