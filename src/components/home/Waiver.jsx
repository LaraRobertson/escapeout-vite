// components/Waiver.jsx
import React, {useContext} from "react"
import {Button, View, Alert, Flex, Message} from '@aws-amplify/ui-react';
import {MyAuthContext} from "../../MyContext";

export default function Waiver(props) {
    let gameDetails = props.gameDetails;
    let gameIntro = props.gameIntro;
    const { setModalContent, setGameDetails  } = useContext(MyAuthContext);

    async function agreeToWaiverFunction() {
        /* just set in gameDetails */
        setGameDetails({...gameDetails, waiverSigned: gameDetails.gameID, numberOfTimes: 0});
        setModalContent({
            open: true,
            content: "Game Intro"
        });
    }

    return (
            <>
                <Alert variation="neutral" hasIcon={false} textAlign={"center"}><strong>I will respect all laws, rules, and property rights of the area.
                    I will try not to annoy those around me.</strong></Alert>
                <View>
                    <View margin="10px 0">
                        <span className="italics bold">Game play is entirely up to me and at my discretion and I assume all of the risks of participating in this activity.</span>
                    </View>
                    <View margin="10px 0">
                        <strong>I WAIVE, RELEASE, AND DISCHARGE </strong> from any and all liability for EscapeOut.Games and
                        its parent company (Coastal Initiative, LLC).
                    </View>
                    <View width="95%"  margin="10px auto" textAlign="center" >
                        <strong>I certify that I have read this document and I fully understand its content.
                            I am aware that this is a release of liability and a contract and I sign it of my own free will.
                        </strong>
                    </View>

                </View>
                {!gameIntro && <Flex justifyContent="center" wrap='wrap'>
                    <Button textAlign="center" className="button" onClick={() => agreeToWaiverFunction()}>I agree to Waiver - clicking indicates signing</Button>
                </Flex>}
            </>
        )
}