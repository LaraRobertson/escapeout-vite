// components/ExampleGame.jsx
import React, {useContext} from "react"
import {Button, View, Alert, Flex, Message, Image, Heading} from '@aws-amplify/ui-react';
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
                            <Heading level={"6"} className="heading" marginTop={"10px"} marginBottom={"5px"}>4: Your Time is Your Score</Heading>
                            (see information at bottom of screenshot)<br />
                            <br />Your total time is calculated from the time you start game and how many hints you use.<br />
                            <span className={"small italics"}>This is a screenshot of a game at jaycee park (excluding yellow type).</span>
                            <Image src={"https://escapeoutbucket2183723-dev.s3.amazonaws.com/public/ExampleGameLayout-CluesPuzzles.jpg"} alt={"clues and puzzles"}/>
                            <br />Each hint adds 5 minutes to your score.
                        </View>

                    </View>

                </View>
            </>
        )
}