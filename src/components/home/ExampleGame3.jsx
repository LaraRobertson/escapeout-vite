// components/ExampleGame.jsx
import React, {useContext} from "react"
import {Button, View, Alert, Flex, Message, Image} from '@aws-amplify/ui-react';
import {MyAuthContext} from "../../MyContext";

export default function ExampleGame3(props) {
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
                            <strong>5: Clues/Notes Area</strong><br />Use this area to add your clues (see button on clue popup) if you need
                            to see things in a different way.<br />
                            Take notes too.<br />
                            <span className={"small italics"}>This is a screenshot of a game at jaycee park.</span><br />
                            <Image src={"https://escapeoutbucket2183723-dev.s3.amazonaws.com/public/ExampleGameLayout-Notes.jpg"} alt={"clues and puzzles"}/>
                        </View>

                    </View>

                </View>
            </>
        )
}