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
                    <View paddingBottom="10px">
                        <strong>2: Clues are icons on the left</strong><br />(tap to open)
                        <br /><strong>3: Puzzles are icons on the right</strong><br />(tap to open)<br />
                        <span className={"small italics"}>This is a screenshot of a game at jaycee park.</span>
                        <Image src={"https://escapeoutbucket2183723-dev.s3.amazonaws.com/public/ExampleGameLayout-CluesPuzzles.jpg"} alt={"clues and puzzles"}/>
                        <br />PUZZLES are forms - INPUT the answer into the appropriate field(s) to solve the puzzle.<br />
                            <br /><strong>4: Time</strong> is the amount of time it takes to solve (includes hint time) and is your score.
                    </View>

                </View>
                {!gameIntro && <Flex justifyContent="center" wrap='wrap'>
                    <Button textAlign="center" className="button" onClick={() => nextFunction()}>Next</Button>
                </Flex>}
            </>
        )
}