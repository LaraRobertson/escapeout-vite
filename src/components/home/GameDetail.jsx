import {Accordion, Button, Heading, Image, View} from "@aws-amplify/ui-react";
import React, {useState} from "react";
import {ReactModalFromBottomMap} from "../Modals";
import Waiver from "./Waiver";
import Help from "../game/Help";
import Hints from "../game/Hints";
import {Map} from "../game/Map";
import ExampleGame from "./ExampleGame";
import ExampleGame2 from "./ExampleGame2";
import ExampleGame3 from "./ExampleGame3";
import ExampleGame5 from "./ExampleGame5";
import ExampleGame4 from "./ExampleGame4";
import ExampleGame6 from "./ExampleGame6";
export default function GameDetail(props) {
    let gameDetails=props.gameDetails;
    let gameIntro = props.gameIntro;
    const [modalContentMap, setModalContentMap] = useState({open:false, content:""});
    return (
        <View className={"game-details-content"}>
            <Heading level={5}>Goal:</Heading>
            <View className={"end-paragraph"}>{gameDetails.gameGoals}</View>
            <Heading level={5}>Summary</Heading>
            <View className={"end-paragraph"}>{gameDetails.gameSummary}</View>
            <Heading level={5}>This Game Starts Here at Zone 1:</Heading>
            <View className={"end-paragraph"}>
                <Image maxHeight="150px" src={gameDetails.gamePlayZoneImage1}/><br />
                <Button className="quit-button dark"
                        onClick={() => setModalContentMap({
                            open: true,
                            content: "Map"
                        })}>
                    Location of First Zone on Map</Button>
                <br />You must find the other Zone Locations while playing the game.<br /><br />
            </View>
            <ReactModalFromBottomMap modalContentMap={modalContentMap} setModalContentMap={setModalContentMap}>
                {(modalContentMap.content == "Map") && <Map gameDetails={gameDetails}/>}
            </ReactModalFromBottomMap>
            <Accordion.Container allowMultiple defaultValue={['logistics']}>
                <Accordion.Item value="layout">
                    <Accordion.Trigger>
                        <strong>How to Play Game</strong>
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
                <Accordion.Item value="logistics">
                    <Accordion.Trigger>
                        <strong>Logistics</strong>
                        <Accordion.Icon/>
                    </Accordion.Trigger>
                    <Accordion.Content>
                        <View>
                            <View paddingBottom="10px">
                                {gameDetails.gameLogisticInfo}

                            </View>
                        </View>
                    </Accordion.Content>
                </Accordion.Item>
                <Accordion.Item value="Scoring">
                    <Accordion.Trigger>
                        <strong>Scoring</strong>
                        <Accordion.Icon/>
                    </Accordion.Trigger>
                    <Accordion.Content>
                        <View>
                            <View paddingBottom="10px">
                                Your score is your time. Time doesn't stop until you complete the
                                game. Using a Hint adds 5 minutes.

                            </View>
                        </View>
                    </Accordion.Content>
                </Accordion.Item>
                <Accordion.Item value="Notes">
                    <Accordion.Trigger>
                        <strong>Notes</strong>
                        <Accordion.Icon/>
                    </Accordion.Trigger>
                    <Accordion.Content>
                        <View>
                            <View paddingBottom="10px">
                                The <strong>Notes</strong> area can be used to write custom notes or save
                               clues to help you solve the puzzles.

                            </View>
                        </View>
                    </Accordion.Content>
                </Accordion.Item>
                <Accordion.Item value="Hints">
                    <Accordion.Trigger>
                        <strong>Hints</strong>
                        <Accordion.Icon/>
                    </Accordion.Trigger>
                    <Accordion.Content>
                        <View>
                            <View paddingBottom="10px">
                                See Available hints in <strong>"Help"</strong> window.
                                Choosing an Individual Hint adds <span
                                className="italics"> 5 Minutes!</span></View>
                            <View paddingBottom="10px">
                                <Image src={"https://escapeoutbucket2183723-dev.s3.amazonaws.com/public/hint-modal.png"} alt={"hint modal"}/>
                            </View>
                        </View>
                    </Accordion.Content>
                </Accordion.Item>

            </Accordion.Container>

        </View>
    )
}