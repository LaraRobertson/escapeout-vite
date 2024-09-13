import {Button, Image, SelectField, TextAreaField, TextField, View, Flex, Heading, Icon} from "@aws-amplify/ui-react";
import React, {useState} from "react";
import {
    toggleNotes,
    setCommentsFunction,
    goHome
} from "./helper";
import {useNavigate} from "react-router-dom";
import DOMPurify from "dompurify";
import Close from "../assets/times-solid-svgrepo-com.svg";
import zoneIcon from "../assets/noun-zone-3097481-FFFFFF.svg";
import diary from "../assets/noun-diary-6966311.svg";
import tornPaper from "../assets/noun-torn-paper-3017230.svg";
import messageInABottle from "../assets/noun-message-in-a-bottle-5712014.svg";
import clueIcon from "../assets/noun-clue-4353248.svg";
import clueNoteIcon from "../assets/noun-note-question-1648398.svg";
import envelope from "../assets/noun-message-6963433.svg";

export const NotAvailable = (props) => {
    const navigate = useNavigate();
    return (
        <View>
            {props.authStatus === "configuring" ?
                (<View>Loading</View>):(
                    <View>
                        <View textAlign={"center"}>Admin is not available</View>
                        <Flex justifyContent="center">
                            <Button className="topLink" onClick={() => navigate('/')}>Back to Home</Button>
                        </Flex>
                    </View>
                )}
        </View>
    )
}

export const GreenIcon = (props) => {
    return (
        <Icon
            height={"20px"}
            width={"20px"}
            ariaLabel="CheckMark"
            viewBox={{ minX: 0,
                minY: 0,
                width: 500,
                height: 500 }}
            paths={[
                {
                    d: "m7.7,404.6c0,0 115.2,129.7 138.2,182.68l99,0c41.5-126.7 202.7-429.1 340.92-535.1c28.6-36.8-43.3-52-101.35-27.62-87.5,36.7-252.5,317.2-283.3,384.64-43.7,11.5-89.8-73.7-89.84-73.7z",
                    fill:"#6c4",
                },
            ]}
        />
    )
}

export const TimeBlock = (props) => {
    console.log("props.realTimeStart: " + props.realTimeStart);
    let realTimeStart = new Date(props.realTimeStart).toLocaleString();
    return (
        <View ariaLabel="stop 1 Time" className="time">
                   <View className="small">hint time: {props.gameTimeHint} mins | time started: {realTimeStart} </View>
            <Button  onClick={() => toggleHelp(props.isHelpVisible,props.setIsHelpVisible)}>Help</Button>
            <Button onClick={() => toggleNotes(props.areNotesVisible,props.setAreNotesVisible)}>Notes</Button>
        </View>
    )
}


export const CommentWindow = (props) => {
    const navigate = useNavigate();
    return (
        <View className="cover-screen">
            <View className="winner comment-screen">
                <h3>Thank you for playing. </h3>
                We really want to know any and all comments you have about the game.
                <TextAreaField
                    rows="6"
                    onChange={(e) => setCommentsFunction(e.currentTarget.value,props.setGameComments)}
                    descriptiveText="Any Issues or Problems?  Suggestions for improvement?"
                /><br />
                <Button className="button small" onClick={() => goHome(navigate,props.gameComments)}>Back to Games Page</Button>
            </View>
        </View>
    )
}

function DangerouslySetInnerHTMLSanitized(htmlContent) {
    const sanitizedHtmlContent = DOMPurify.sanitize(htmlContent);
    return (sanitizedHtmlContent)
}
export const IconClueDisplay = (props) => {
    console.log("props.gameClueIcon: " + props.gameClueIcon);
    if (props.gameClueIcon != "") {
        switch (true) {
            case (props.gameClueIcon == "diary"):
                return (
                    <Image height="70px" width="70px" src={diary} alt="diary"/>
                );
            case (props.gameClueIcon == "tornPaper"):
                return (
                    <Image height="70px" width="70px" src={tornPaper} alt="torn paper"/>
                );
            case (props.gameClueIcon == "messageInABottle"):
                return (
                    <Image height="70px" width="70px" src={messageInABottle} alt="message in a bottle"/>
                );
            case (props.gameClueIcon == "clueIcon"):
                return (
                    <Image height="70px" width="70px" src={clueIcon} alt="clue icon"/>
                );
            case (props.gameClueIcon == "clueNoteIcon"):
                return (
                    <Image height="70px" width="70px" src={clueNoteIcon} alt="clue Note icon"/>
                );
            case (props.gameClueIcon == "envelope"):
                return (
                    <Image height="70px" width="70px" src={envelope} alt="envelope"/>
                );
            default:
                return (
                    <Image height="70px" width="70px" src={tornPaper} alt="torn paper"/>
                );
        }

    }
}
export const NotesOpen = (props) => {
    let cluesArray=props.cluesArray;
    let setCluesArrayRemoveFunction=props.setCluesArrayRemoveFunction;
    return (
        <View className="notes notes-change show-gradual">
            <View className={props.isChecked? "dark" : "light"} height={"auto"}>
                <View className="notes notes-change show-gradual">
                    <View height={"auto"}>
                        <strong>Clues/Notes</strong>
                        {cluesArray.map((clue,index) => (
                            <>
                            <Flex key={clue.gameClueID+"-"+index} className={"clue-row small"}>
                                <View className={"italics"}>{clue.gameClueName}:</View>
                                <View  dangerouslySetInnerHTML={ {__html: DangerouslySetInnerHTMLSanitized(clue.gameClueText)}}   padding={"0 10px"}>

                                </View>
                                <Button className={"link-button small delete-notes" } onClick={() => setCluesArrayRemoveFunction(index)}>x</Button>
                            </Flex>
                            <Image src={clue.gameClueImage}/></>

                        ))}
                    </View>
                </View>

                <View className={(props.clues != '' && props.clues != undefined)?"small show":"hide"}>
                    <View textAlign="center"><Button className={props.isChecked? "link-button small dark" : "link-button small light"}
                                                     onClick={() => props.setCluesArray([])}>clear all clues</Button></View>
                </View>
                <View className={"textArea-Container"}>
                    <TextAreaField
                        label="Notes"
                        labelHidden
                        value={props.gameNotes}
                        rows="5"
                        onChange={(e) =>  props.setGameNotesFunction(e.currentTarget.value,props.setGameNotes)}
                        descriptiveText="Take some Notes - close when done, they will still be here"
                    />
                </View>
            </View>
        </View>
    )
}

