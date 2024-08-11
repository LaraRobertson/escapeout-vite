import {Button, Flex, View} from "@aws-amplify/ui-react";
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
        if (key) {
            setGameHintVisible({...newObject, [key]: value})
        }
    }
    return (
        <View>
            <View paddingBottom="10px">
                <strong>Hints:</strong> Clicking on a Hint Below adds <span
                className="italics"> 5 Minutes!</span> Use Hints if you really need them.
            </View>
            {/* HINTS */}
            <hr />
            {gameHint.map((hint,index) => (
                <Flex wrap="wrap" key={hint.id} ariaLabel={hint.id}>
                    <View>
                        {gameHintVisible["hint" + (hint.id)]? (
                            <View backgroundColor={"lightgray"} color={"black"} marginTop={"10px"} padding={"0 5px"}><strong>{hint.gameHintName} - used</strong></View>
                        ) : (
                            <Button className={"button small"} marginTop={"10px"} onClick={() => setGameHintVisibleFunction(["hint" + (hint.id)], true)}>{hint.gameHintName} - adds 5 minutes</Button>
                        )
                        }

                        <View dangerouslySetInnerHTML={ {__html: DangerouslySetInnerHTMLSanitized(hint.gameHintDescription)}} backgroundColor={"lightgray"}  color={"black"}  padding={"0 10px"} className={gameHintVisible["hint" + (hint.id)]? "show" : "hide"}>
                        </View>
                    </View>
                </Flex>
            ))}
            <hr />
        </View>
    )
}