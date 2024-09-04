import {Accordion, Button, Flex, Image, View} from "@aws-amplify/ui-react";
import React, {useState} from "react";
export default function Hints(props) {
    console.log("Hints");
    let gameHint=props.gameHint;
    let setGameTimeHint=props.setGameTimeHint;
    let DangerouslySetInnerHTMLSanitized=props.DangerouslySetInnerHTMLSanitized;
    let setGameHintVisible=props.setGameHintVisible;
    let gameHintVisible=props.gameHintVisible;


    function setGameHintVisibleFunction(key, value) {
        console.log("setGameHintVisibleFunction: " + key);
        let newObject = {...gameHintVisible,[key]:value};
        let gameHintVisibleTest = JSON.stringify(newObject);
        if (gameHintVisibleTest != "{}" &&  gameHintVisibleTest != "" &&  gameHintVisibleTest != null) {
            localStorage.setItem("gameHintVisible", gameHintVisibleTest);
        }
        /* add 5 minutes */
        /* check for true to calculate gameTimeHint */
        /* is this excessive, can't I just add 5 minutes? */
        let hintTime = 0;
        for (const key in newObject) {
            console.log(`${key}: ${ newObject[key]}`);
            if ( newObject[key] === true) {
                hintTime = hintTime + 5;
            }
        }
        setGameTimeHint(hintTime);
        localStorage.setItem("gameTimeHint", hintTime);
        if (key) {
            setGameHintVisible({...newObject, [key]: value})
        }
    }
    return (
        <Accordion.Container allowMultiple defaultValue={['hints']}>
            <Accordion.Item value="how-to-play">
                <Accordion.Trigger>
                    <strong>How to Play?</strong>
                    <Accordion.Icon/>
                </Accordion.Trigger>
                <Accordion.Content>
                    <View>
                        <View paddingBottom="10px">
                            Tap around to open clues which will enable you to solve puzzles.</View>
                        <View paddingBottom="10px">Tap on puzzles to open and then solve.</View>
                        <View paddingBottom="10px">Clues shown in each Zone are near the Zone image on the screen and near the
                            marker on the Map for that Zone (within 100 feet or so).</View>
                    </View>
                </Accordion.Content>
            </Accordion.Item>
            <Accordion.Item value="hints">
                <Accordion.Trigger>
                    <strong>Available Hints</strong>
                    <Accordion.Icon/>
                </Accordion.Trigger>
                <Accordion.Content>
                    <View>
                        <View paddingBottom="10px" paddingTop={"10px"}>
                            Clicking on a Hint Below adds <span
                            className="italics"> 5 Minutes!</span></View>
                        <View paddingBottom="10px">
                            Use Hints if you really need them.
                        </View>
                        {/* HINTS */}

                        {gameHint.map((hint,index) => (
                            <Flex wrap="wrap" key={hint.id} ariaLabel={hint.id}>
                                <View>
                                    {gameHintVisible["hint" + (hint.id)]? (
                                        <View backgroundColor={"lightgray"} color={"black"} marginTop={"10px"} padding={"0 5px"}><strong>{hint.gameHintName} - used</strong></View>
                                    ) : (
                                        <Button className={"button"} marginTop={"10px"} onClick={() => setGameHintVisibleFunction(["hint" + (hint.id)], true)}>{hint.gameHintName} - adds 5 minutes</Button>
                                    )
                                    }

                                    <View dangerouslySetInnerHTML={ {__html: DangerouslySetInnerHTMLSanitized(hint.gameHintDescription)}} backgroundColor={"lightgray"}  color={"black"}  padding={"0 10px"} className={gameHintVisible["hint" + (hint.id)]? "show" : "hide"}>
                                    </View>
                                </View>
                            </Flex>
                        ))}
                    </View>
                </Accordion.Content>
            </Accordion.Item>

        </Accordion.Container>


    )
}