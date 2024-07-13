import {Heading, Image, View} from "@aws-amplify/ui-react";
import React from "react";

export default function GameDetail(props) {
    let gameDetails=props.gameDetails;
    let gameIntro = props.gameIntro;
    return (
        <View className={"game-details-content"}>
            <Heading level={5}>Mission</Heading>
            <View className={"end-paragraph"}>{gameDetails.gameDescriptionP}</View>
            {(gameIntro) && <><Heading level={5}>Scoring</Heading>
            <View className={"end-paragraph"}>Your score is your time. Time doesn't stop until you complete the
                game.</View></>}
            <Heading level={5}>Hints</Heading>
            <View className={"end-paragraph"}>Click on <strong>Hints</strong> to see if you want to use available hints.
                Once you choose a <strong>Hint</strong> <span
                    className="italics"><strong> 5 minutes</strong></span> is added to your time.</View>
            <Heading level={5}>Notes</Heading>
            <View className={"end-paragraph"}>The <strong>Notes</strong> area can be used to write custom notes or save
                certain information to help you solve the puzzles.</View>
            <Heading level={5}>Game Starts Here:</Heading>
            <View className={"end-paragraph"}>
                <Image maxHeight="150px" src={gameDetails.gamePlayZoneImage1}/>
            </View>
            <Heading level={5}>Game Map:</Heading>
            <View className={"end-paragraph"}>
                <Image maxHeight="150px" src={gameDetails.gameMap}/>
            </View>

        </View>
    )
}