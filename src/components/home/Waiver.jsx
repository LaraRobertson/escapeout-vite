// components/Waiver.jsx
import React, {useContext, useEffect, useState} from "react"
import {Button, View, Alert, Flex, Message} from '@aws-amplify/ui-react';
import {MyAuthContext} from "../../MyContext";

export default function Waiver(props) {
    let gameDetails = props.gameDetails;
    let gameIntro = props.gameIntro;
    const { setModalContent, setGameDetails  } = useContext(MyAuthContext);
    const [isAlertVisible, setIsAlertVisible] = useState(false);
    const [alertText, setAlertText] = useState('');

    useEffect(() => {
        console.log("***useEffect***: alert user about signing waiver");
        setIsAlertVisible(true);
        setAlertText('Please agree to Waiver before playing the game.');
        setTimeout(() => {
            setIsAlertVisible(false);
        }, 3000);
    }, []);


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
                        <span>Game play is entirely up to me and at my discretion and I assume all of the risks of participating in this activity.</span>
                    </View>
                    <View margin="10px 0">
                        <strong>I WAIVE, RELEASE, AND DISCHARGE </strong> from any and all liability for EscapeOut.Games and
                        its parent company (Coastal Initiative, LLC).
                    </View>
                    <View margin="10px auto" >
                        I certify that I have read this document and I fully understand its content.
                            I am aware that this is a release of liability and a contract and I sign it of my own free will.
                    </View>
                    <View className={isAlertVisible ? "alert-container show" : "hide"}>
                        <div className='alert-inner'>{alertText}</div>
                    </View>
                </View>
                {!gameIntro && <Flex justifyContent="center" wrap='wrap'>
                    <Button textAlign="center" className="button" onClick={() => agreeToWaiverFunction()}>I agree to Waiver
                        <br />(clicking indicates signing)</Button>
                </Flex>}
            </>
        )
}