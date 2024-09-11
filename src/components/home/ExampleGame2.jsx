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
                        <strong>2: Clues - icons on the left</strong><br />(tap to open to see clue)
                        <br /><strong>3: Puzzles - icons on the right</strong><br />(tap to open to see puzzle form)<br />
                        <span className={"small italics"}>This is a screenshot of a game at jaycee park (excluding yellow type).</span>
                        <Image src={"https://escapeoutbucket2183723-dev.s3.amazonaws.com/public/ExampleGameLayout-CluesPuzzles.jpg"} alt={"clues and puzzles"}/>
                        <br />Puzzle are forms - Type in the answer into the appropriate field(s) to solve the puzzle.<br />
                    </View>

                </View>
                {!gameIntro && <Flex justifyContent="center" wrap='wrap'>
                    <Button textAlign="center" className="button" onClick={() => nextFunction()}>Next</Button>
                </Flex>}
            </>
        )
}