// components/ExampleGame.jsx
import React, {useContext} from "react"
import {Button, View, Alert, Flex, Message, Image} from '@aws-amplify/ui-react';
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
                        The Game has 8 Basic Elements
                        <br /><strong>1: Zones are icons at the top</strong> <br />(tap to change Zones)<br /><br />
                        A game can have 1 Zone or many Zones.<br /><br />
                        A Zone indicates the area (roughly 100 feet diameter) in which you can find the answers for Clues and Puzzles in that Zone.<br />
                        <span className={"small italics"}>This is a screenshot of a game at jaycee park.</span>
                        <Image src={"https://escapeoutbucket2183723-dev.s3.amazonaws.com/public/ExampleGameLayout-Zones.jpg"} alt={"clues and puzzles"}/>
                    </View>
                </View>
                {!gameIntro && <Flex justifyContent="center" wrap='wrap'>
                    <Button textAlign="center" className="button" onClick={() => nextFunction()}>Next</Button>
                </Flex>}
            </>
        )
}