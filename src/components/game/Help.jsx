import {Accordion, Image, View} from "@aws-amplify/ui-react";
import React from "react";
import ExampleGame from "../home/ExampleGame";
import ExampleGame2 from "../home/ExampleGame2";
import ExampleGame3 from "../home/ExampleGame3";
import ExampleGame4 from "../home/ExampleGame4";
import ExampleGame5 from "../home/ExampleGame5";
import ExampleGame6 from "../home/ExampleGame6";
export default function Help() {
    console.log("How to Play");
    return (
        <View className={"modal-middle"}>
            <Accordion.Container allowMultiple defaultValue={['how-to-play']}>
                <Accordion.Item value="how-to-play">
                    <Accordion.Trigger>
                        <strong>Generally How to Play</strong>
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
                <Accordion.Item value="layout">
                    <Accordion.Trigger>
                        <strong>How to Play Game (Detailed)</strong>
                        <Accordion.Icon/>
                    </Accordion.Trigger>
                    <Accordion.Content>
                        <View>
                            <ExampleGame />
                            <ExampleGame2 />
                            <ExampleGame3 />
                            <ExampleGame4 />
                            <ExampleGame5 />
                            <ExampleGame6 />
                        </View>
                    </Accordion.Content>
                </Accordion.Item>
                <Accordion.Item value="levels">
                    <Accordion.Trigger>
                        <strong>Hints</strong>
                        <Accordion.Icon/>
                    </Accordion.Trigger>
                    <Accordion.Content>
                        <View>
                            <View paddingBottom="10px">
                               Choosing an Individual Hint adds <span
                                className="italics"> 5 Minutes!</span> Choosing the "Hints" button shows you what hints are available.</View>
                            <View paddingBottom="10px">
                                <Image src={"https://escapeoutbucket2183723-dev.s3.amazonaws.com/public/hint-button.png"} alt={"hint button"}/><br />
                                The "Hints" button opens the "Hints" screen. Choosing one these buttons costs 5 minutes and you get a hint:<br />
                                <Image src={"https://escapeoutbucket2183723-dev.s3.amazonaws.com/public/hint-modal.png"} alt={"hint modal"}/>
                            </View>
                        </View>
                    </Accordion.Content>
                </Accordion.Item>

            </Accordion.Container>
        </View>
    )
}