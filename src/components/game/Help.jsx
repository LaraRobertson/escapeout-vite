import {Accordion, Button, Flex, Link, View} from "@aws-amplify/ui-react";
import React from "react";
export default function Help() {
    console.log("How to Play");
    return (
        <View className={"modal-middle"}>
            <Accordion.Container allowMultiple defaultValue={['levels']}>
                <Accordion.Item value="how-to-play">
                    <Accordion.Trigger>
                        <strong>How to Play?</strong>
                        <Accordion.Icon/>
                    </Accordion.Trigger>
                    <Accordion.Content>
                        <View>
                            <View paddingBottom="10px">
                                <strong>How to Play:</strong> Click around to open clues and to solve puzzles. Click on puzzles to solve. Clues shown in each zone are near Image Shown and location on Map (within 100 feet or so)

                            </View>
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
                                <strong>Hints:</strong> Clicking on an Individual Hint adds <span
                                className="italics"> 5 Minutes!</span> Clicking on HINTS button just shows you what hints are available - it does NOT cost time
                            </View>
                        </View>
                    </Accordion.Content>
                </Accordion.Item>

            </Accordion.Container>
        </View>
    )
}