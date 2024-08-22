import {Image, View} from "@aws-amplify/ui-react";
import React from "react";
import diary from "../../assets/noun-diary-6966311.svg";
import messageInABottle from "../../assets/noun-message-in-a-bottle-5712014.svg";
import clueIcon from "../../assets/noun-clue-4353248.svg";
import clueNoteIcon from "../../assets/noun-note-question-1648398.svg";
import envelope from "../../assets/noun-message-6963433.svg";
import tornPaper from "../../assets/noun-torn-paper-3017230.svg";
import {keyID} from "../helper";

export default function GameClue(props) {
    let zoneVisible=props.zoneVisible;
    let clue=props.clue;
    let index=props.index;
    let setModalClueContent=props.setModalClueContent;
    let setClueDetails=props.setClueDetails;

    function handleClueDetail(clueDetailsVar) {
        setClueDetails(clueDetailsVar);
        setModalClueContent({
            show: true,
            content: "clue"
        })
    }


    const IconClueDisplay = (props) => {
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
        } else {
            switch (true) {
                case (props.index == 0):
                    return (
                        <Image height="70px" width="70px" src={diary} alt="diary"/>
                    );
                case (props.index == 1):
                    return (
                        <Image height="70px" width="70px" src={tornPaper} alt="torn paper"/>
                    );
                case (props.index % 5 == 0):
                    return (
                        <Image height="70px" width="70px" src={messageInABottle} alt="message in a bottle"/>
                    );
                case (props.index % 4 == 0):
                    return (
                        <Image height="70px" width="70px" src={clueIcon} alt="clue icon"/>
                    );
                case (props.index % 3 == 0):
                    return (
                        <Image height="70px" width="70px" src={clueNoteIcon} alt="clue Note icon"/>
                    );
                case (props.index % 2 == 0):
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
    if (zoneVisible==clue.gamePlayZoneID) {
        return (
            <View ariaLabel={clue.gameClueName} key={keyID(clue.id,"clue")}
                  className={"clue"+ index}
                  onClick={() => handleClueDetail({
                      gameClueName: clue.gameClueName,
                      gameClueText: clue.gameClueText,
                      gameClueImage: clue.gameClueImage,
                      gameClueID: clue.id
                  })}
            >
                <IconClueDisplay index={index} hide="true" gameClueIcon={clue.gameClueIcon}/>
            </View>

        )
    }
}