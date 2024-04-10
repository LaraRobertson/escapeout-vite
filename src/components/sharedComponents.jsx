import {Button, Image, SelectField, TextAreaField, TextField, View, Flex, Heading} from "@aws-amplify/ui-react";
import React from "react";
import {
    toggleNotes,
    setCommentsFunction, goHome
} from "./helper";

import {useNavigate} from "react-router-dom";
import DOMPurify from "dompurify";

export const ToolObject = {
    key: 'https://escapeoutbucket213334-staging.s3.amazonaws.com/public/object-tools/key.png',
    discs: 'https://escapeoutbucket213334-staging.s3.amazonaws.com/public/object-tools/discs.png',
    prybar: 'https://escapeoutbucket213334-staging.s3.amazonaws.com/public/object-tools/prybar.png',
    keyTubular: 'https://escapeoutbucket213334-staging.s3.amazonaws.com/public/object-tools/key-tubular.png'
};

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

export const NotesOpen = (props) => {
    return (
        <View className="notes show-gradual">
            <View className={props.isChecked? "all-screen dark" : "all-screen light"} height={"auto"}>
              <strong>Notes</strong>
            <View className={(props.clues != '' && props.clues != undefined)?"small show":"hide"}>
                <strong>clues</strong>:
                <View dangerouslySetInnerHTML={ {__html: DangerouslySetInnerHTMLSanitized(props.clues)}}  color={"black"}  padding={"0 10px"}>
                </View>
                <View textAlign="center"><Button className={props.isChecked? "link-button small dark" : "link-button small light"} onClick={() => props.setClues('')}>clear clues</Button></View>
            </View>
            <TextAreaField
                label="Notes"
                labelHidden
                value={props.gameNotes}
                rows="5"
                onChange={(e) =>  props.setGameNotesFunction(e.currentTarget.value,props.setGameNotes)}
                descriptiveText="Take some Notes - close when done, they will still be here"
            />

                <View width="100%" textAlign='center' paddingTop="10px">
                    <Button  className={props.isChecked? "close small dark" : "close small light"} onClick={() => props.setAreNotesVisible(false)}>close notes</Button>
                </View>
            </View>
        </View>
    )
}

