import {Heading, Link, View} from "@aws-amplify/ui-react";
import React from "react";

export default function Hero() {
    return (
        <View className="hero">
            <Heading
                level={5}
                textAlign="center"
                className="heading">
                Go Outside and play an <span
                className="blue-light">Intriguing Problem-Solving Game</span> with your family and friends!
            </Heading>
            <View className="hero-paragraph">
                Grab your phone, round up your family and friends, and head outside for a fun-filled day of
                creative puzzles, exploration, and excitement!
                <View className="italics" paddingTop={"2px"} fontSize={".8em"} textAlign={"center"}>Games
                    are meant to be played on smartphone at locations in Game List below.</View>
            </View>
            <View>

                <View className={"light-dark hide"}>
                    More Questions?&nbsp;
                    <Link
                        href="https://escapeout.games/faqs/"
                        className={"light-dark"}
                        isExternal={true}
                        textDecoration="underline"
                    >
                        Visit FAQs
                    </Link>
                </View>
            </View>
        </View>
    )
}