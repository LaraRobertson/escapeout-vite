import {Accordion, Button, Heading, Image, View} from "@aws-amplify/ui-react";
import React, {useState} from "react";
import {ReactModalFromBottomGI} from "../Modals";
import Waiver from "./Waiver";
import Help from "../game/Help";
import Hints from "../game/Hints";
import {Map} from "../game/Map";

export default function GameDetail(props) {
    let gameDetails=props.gameDetails;
    let gameIntro = props.gameIntro;
    const [modalContentGI, setModalContentGI] = useState({show:false, content:""});
    return (
        <View className={"game-details-content"}>
            <Heading level={5}>Goals</Heading>
            <View className={"end-paragraph"}>{gameDetails.gameGoals}</View>
            <Heading level={5}>Summary</Heading>
            <View className={"end-paragraph"}>{gameDetails.gameSummary}</View>
            <Heading level={5}>Game Starts Here at Zone 1:</Heading>
            <View className={"end-paragraph"}>
                <Image maxHeight="150px" src={gameDetails.gamePlayZoneImage1}/><br />
                <Button className="quit-button dark"
                        onClick={() => setModalContentGI({
                            open: true,
                            content: "Map"
                        })}>
                    Map</Button>
            </View>
            <ReactModalFromBottomGI modalContentGI={modalContentGI} setModalContentGI={setModalContentGI}>
                {(modalContentGI.content == "Map") && <Map gameDetails={gameDetails}/>}
            </ReactModalFromBottomGI>
            <Accordion.Container allowMultiple defaultValue={['logisitcs']}>
                <Accordion.Item value="logisitcs">
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
                                Choosing an Individual Hint adds <span
                                className="italics"> 5 Minutes!</span> Choosing the "Hints" button shows you what hints are available.</View>
                            <View paddingBottom="10px">
                                For Example, choosing this button while playing game (see yellow circled button below), is okay and it does not cost any time:<br />
                                <Image src={"https://escapeoutbucket2183723-dev.s3.amazonaws.com/public/hint-button.png"} alt={"hint button"}/><br />
                                Choosing one these buttons (which appear after you choose the first button) costs 5 minutes and you get a hint:<br />
                                <Image src={"https://escapeoutbucket2183723-dev.s3.amazonaws.com/public/hint-modal.png"} alt={"hint modal"}/>
                            </View>
                        </View>
                    </Accordion.Content>
                </Accordion.Item>

            </Accordion.Container>

        </View>
    )
}