import {Button, Image, SelectField, TextAreaField, TextField, View, Flex, Heading} from "@aws-amplify/ui-react";
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

export const NotAvailable = (props) => {
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

export const Modal2 = ({ show, close, title, setCluesFunction, modalClass, children }) => {
    return (
        <>
             <div
                        className={`modalContainer ${show ? "showModal" : ""} `}
                        onClick={() => close()}
                    >
                        <div className={`modal dark ${modalClass}`} onClick={(e) => e.stopPropagation()}>
                            <header className="modal_header">
                                <h2 className="modal_header-clueDetails"> Clue </h2>
                                <button className="close" onClick={() => close()}>
                                    <img src={Close} alt="close" />
                                </button>
                            </header>
                            <main className="modal_content"> {children} </main>
                            <footer className="modal_footer">
                                <button className="modal-close" onClick={() => close()}>
                                    Close
                                </button>
                                <button className="submit" onClick={()=>setCluesFunction("<strong>" + title.gameClueName + " </strong> ==> " +
                                    title.gameClueText + " <br />")}>add clue to notes!</button>

                            </footer>
                        </div>
                    </div>
        </>
    );
};
export const Modal3 = ({ show, modalClass, setModalPuzzleContent, children }) => {
    function close() {
        setModalPuzzleContent({show:false,content:""});
    }
    return (
        <>
            <div
                className={`modalContainer ${show ? "showModal" : ""} `}
                onClick={() => close()}
            >
                <div className={`modal dark ${modalClass}`} onClick={(e) => e.stopPropagation()}>
                    <header className="modal_header">
                        <h2 className="modal_header-clueDetails">Puzzle</h2>
                        <button className="close" onClick={() => close()}>
                            <img src={Close} alt="close" />
                        </button>
                    </header>
                    <main className="modal_content"> {children} </main>
                    <footer className="modal_footer">
                        <button className="modal-close" onClick={() => close()}>
                            Close
                        </button>


                    </footer>
                </div>
            </div>
        </>
    );
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
    let cluesArray=props.cluesArray;
    let setCluesArrayRemoveFunction=props.setCluesArrayRemoveFunction;
    return (
        <View className="notes notes-change show-gradual">
            <View className={props.isChecked? "dark" : "light"} height={"auto"}>
                <View className="notes notes-change show-gradual">
                    <View className={"small show"} height={"auto"}>
                        <strong>Clues</strong>
                        {cluesArray.map((clue,index) => (
                            <Flex key={clue.gameClueID+"-"+index} className={"clue-row"}>
                                <View className={"italics"}>{clue.gameClueName}:</View>
                                <View  dangerouslySetInnerHTML={ {__html: DangerouslySetInnerHTMLSanitized(clue.gameClueText)}}   padding={"0 10px"}>

                                </View>
                                <Image src={clue.gameClueImage}/>
                                <Button className={"link-button small delete-notes" } onClick={() => setCluesArrayRemoveFunction(index)}>x</Button>
                            </Flex>
                        ))}
                    </View>
                </View>

                <View className={(props.clues != '' && props.clues != undefined)?"small show":"hide"}>
                    <View textAlign="center"><Button className={props.isChecked? "link-button small dark" : "link-button small light"}
                                                     onClick={() => props.setCluesArray([])}>clear all clues</Button></View>
                </View>
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
    )
}

