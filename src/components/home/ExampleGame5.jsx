// components/ExampleGame.jsx
import React, {useContext} from "react"
import {Button, View, Alert, Flex, Message, Image} from '@aws-amplify/ui-react';
import {MyAuthContext} from "../../MyContext";

export default function ExampleGame5(props) {
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
                        <strong>6: Help Button</strong><br />Tap on Help button for some simple game advice and Hints.<br />
                        <span className={"small italics"}>This is a screenshot of a game (excluding yellow type).</span><br />
                        <Image src={"https://escapeoutbucket2183723-dev.s3.amazonaws.com/public/ExampleGameLayout-help.jpg"} alt={"help and hints"}/>
                        <br /><strong>7:  Hints </strong>Tap On A Hint if you are stuck but it adds 5 minutes to your time<br />
                        <Image width="232" src={"https://escapeoutbucket2183723-dev.s3.amazonaws.com/public/hint-modal.png"} alt={"hints"} />
                        <br /><strong>8:  Zone Map </strong>shows where the zones are located (you can also identify zones by central image).<br />
                    </View>
                </View>

            </>
        )
}