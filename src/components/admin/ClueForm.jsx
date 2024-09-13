import {
    Button,
    Flex,
    Image,
    Input,
    SelectField,
    SwitchField,
    TextAreaField,
    TextField,
    View
} from "@aws-amplify/ui-react";
import React, {useContext, useEffect, useState} from "react";
import {getGame, getGameClue, getGamePlayZone, getGamePuzzle} from "../../graphql/queries";
import * as mutations from "../../graphql/mutations";
import {MyAuthContext} from "../../MyContext";
import {generateClient} from "aws-amplify/api";
import {createGamePuzzle} from "../../graphql/mutations";
import {uploadData} from "aws-amplify/storage";
import {IconClueDisplay} from "../sharedComponents";
import clueIcon from "../../assets/noun-clue-4353248.svg";
import diary from "../../assets/noun-diary-6966311.svg";
import tornPaper from "../../assets/noun-torn-paper-3017230.svg";
import messageInABottle from "../../assets/noun-message-in-a-bottle-5712014.svg";
import clueNoteIcon from "../../assets/noun-note-question-1648398.svg";
import envelope from "../../assets/noun-message-6963433.svg";

export default function ClueForm(props) {
    const client = generateClient();
    const { setModalContent, modalContent, setBackupIDArray, backupIDArray  } = useContext(MyAuthContext);
    console.log("zoneID (clue form): " + modalContent.gamePlayZoneID);
    let clue = modalContent.clue;
    let action = modalContent.action;
    let clueID = modalContent.id;
    let zoneID = modalContent.gamePlayZoneID;
    let gameID = modalContent.gameID;
    let gameDesigner = modalContent.gameDesigner;
    let gamePlayZoneObject = props.gamePlayZoneObject;

    const initialStateCreateClue = {
        gameID: gameID,
        gamePlayZoneID: zoneID,
        gameClueName: '',
        gameClueImage: '',
        gameClueText: '',
        gameClueIcon: '',
        order: 1,
        disabled: false
    };
    const [formCreateClueState, setFormCreateClueState] = useState(initialStateCreateClue);
    function setInputCreateClue(key, value) {
        setFormCreateClueState({ ...formCreateClueState, [key]: value });
    }
    useEffect(() => {
        if (action === "edit") {
            populateClueForm();
        } else if (action === "addBackupClue") {
            setFormCreateClueState(clue);
            console.log("clue: " + JSON.stringify(clue));
            let key = "gameID";
            let value = gameID;
            let key2 = "gamePlayZoneID";
            let value2 = zoneID;
            setFormCreateClueState({...clue,[key]:value,[key2]:value2});
            console.log("clue2: " + JSON.stringify(formCreateClueState));
        }
    },[]);
    async function populateClueForm() {
        try {
            const apiData = await client.graphql({
                query: getGameClue,
                variables: {id: clueID}
            });
            const cluesFromAPI = apiData.data.getGameClue;
            setFormCreateClueState(cluesFromAPI);
        } catch (err) {
            console.log('error fetching getGameClue', err);
        }
    }
    async function addClueFromFile() {
        try {
            if (!formCreateClueState.gameID || !formCreateClueState.gameClueName) return;
            const gameClue = { ...formCreateClueState };
            console.log("addClue - gameClue: " + gameClue);
            /* add backup clue id to an array and check if backup in an array... */
            // - did a different way: setBackupIDArray( [...backupIDArray,gameClue.id]);
            setFormCreateClueState(initialStateCreateClue);
            delete gameClue.updatedAt;
            delete gameClue.id;
            delete gameClue.__typename;
            await client.graphql({
                query: mutations.createGameClue,
                variables: {
                    input: gameClue
                }
            });
            setModalContent({
                open: false,
                content: "",
                id: "",
                action: "",
                updatedDB:true
            })
        } catch (err) {
            console.log('error creating clue:', err);
        }
    }
    async function addClue() {
        try {
            if (!formCreateClueState.gameID || !formCreateClueState.gameClueName) return;
            const gameClue = { ...formCreateClueState };
            console.log("addClue - gameClue: " + gameClue);
            setFormCreateClueState(initialStateCreateClue);
            await client.graphql({
                query: mutations.createGameClue,
                variables: {
                    input: gameClue
                }
            });
            setModalContent({
                open: false,
                content: "",
                id: "",
                action: "",
                updatedDB:true
            })
        } catch (err) {
            console.log('error creating clue:', err);
        }
    }
    async function updateClue() {
        try {
            if (!formCreateClueState.gameID|| !formCreateClueState.gamePlayZoneID) return;
            const gameClue = { ...formCreateClueState };
            console.log("formCreateClueState - update gameClue")
            for (const key in gameClue) {
                console.log(`${key}: ${gameClue[key]}`);
            }
            setFormCreateClueState(initialStateCreateClue);
            delete gameClue.updatedAt;
            delete gameClue.__typename;
            await client.graphql({
                query: mutations.updateGameClue,
                variables: {
                    input: gameClue
                }
            });
            setModalContent({
                open: false,
                content: "",
                id: "",
                action: "",
                updatedDB:true
            })
        } catch (err) {
            console.log('error updating GameClue:', err);
        }

    }
    async function handleGameClueImageChange(e) {
        console.log("uploaded file: " + e.target.files[0].name);
        if (e?.target?.files) {
            const file = e.target.files[0];
            // Get the file size in bytes
            var fileSize = file.size;

            // Convert the file size to a human-readable format
            var sizeInKB = Math.round(fileSize / 1024);
            var sizeInMB = Math.round(fileSize / (1024 * 1024));

            // Display the file size in the console
            console.log('File Size: ' + fileSize + ' bytes');
            console.log('File Size: ' + sizeInKB + ' KB');
            console.log('File Size: ' + sizeInMB + ' MB');
            if (sizeInKB > 100) {
                alert("file is too big - it is " + sizeInKB + 'KB. Must be less than 100KB');

            } else {
                console.log("gameDesigner: " + gameDesigner);
                let gameDesignerCleaned = removeFunction(gameDesigner);
                console.log("gameDesigner (cleaned): " + gameDesignerCleaned);
                try {
                    const result = await uploadData({
                        path: "public/" + gameDesignerCleaned + "/clues/" + file.name,
                        // Alternatively, path: ({identityId}) => `protected/${identityId}/album/2024/1.jpg`
                        data: file,
                        options: {
                            onProgress: ({transferredBytes, totalBytes}) => {
                                if (totalBytes) {
                                    console.log(
                                        `Upload progress ${
                                            Math.round((transferredBytes / totalBytes) * 100)
                                        } %`
                                    );
                                }
                            }
                        }
                    }).result;
                    console.log('Path from Response: ', result.path);
                } catch (error) {
                    console.log('Error : ', error);
                }
                setInputCreateClue('gameClueImage', "https://escapeoutbucket2183723-dev.s3.amazonaws.com/public/" + gameDesignerCleaned + "/clues/" + file.name)
            }
        }

    }
    function removeFunction(inputString) {
        return inputString.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
    }
    return (
        <View id="gameClueForm" className="show" as="form" margin=".5rem 0">
            <View><strong>Game Clue Form</strong></View>
            <View className={"small"}>Game ID: {formCreateClueState.gameID}</View>
            <View className={"small"}>Zone ID: {gamePlayZoneObject[formCreateClueState.gamePlayZoneID]}|{formCreateClueState.gamePlayZoneID}</View>
            <Flex direction="column" justifyContent="center" gap="1rem" className={"game-form"}>
                <SelectField
                    className={"city-dropdown"}
                    paddingTop={"3px"}
                    value={modalContent.zoneID}
                    onChange={(e) =>  setInputCreateClue('gamePlayZoneID', e.target.value)} label={""}>
                    <option value="change zone">select zone</option>
                    {Object.entries(gamePlayZoneObject).map(([key, value], i) => (
                        <option key={key} value={key}>{value}</option>
                    ))}
                </SelectField>
                <SwitchField
                    label="disabled"
                    isChecked={formCreateClueState.disabled}
                    onChange={(e) => {
                        console.log("e.target.checked: " + e.target.checked)
                        setInputCreateClue('disabled', e.target.checked);
                    }}
                />
                <Input
                    name="order"
                    type="number"
                    size="small"
                    width="50px"
                    onChange={(event) => setInputCreateClue('order', event.target.value)}
                    value={formCreateClueState.order}
                />
                <TextField
                    onChange={(event) => setInputCreateClue('gameClueName', event.target.value)}
                    name="gameClueName"
                    placeholder="Game Clue Name"
                    label="Game Clue Name"
                    variation="quiet"
                    value={formCreateClueState.gameClueName}
                    required
                />
                <TextField
                    onChange={(event) => setInputCreateClue('gameClueText', event.target.value)}
                    name="gameClueText"
                    placeholder="Game Clue Text"
                    label="Game Clue Text"
                    variation="quiet"
                    value={formCreateClueState.gameClueText}
                    required
                />
                <SelectField
                    className={"city-dropdown"}
                    label="Game Clue Icon"
                    placeholder="choose an icon"
                    value={formCreateClueState.gameClueIcon}
                    onChange={(event) => setInputCreateClue('gameClueIcon', event.target.value)}>
                        <option key={"1"} value={"clueIcon"}>clueIcon</option>
                        <option key={"2"} value={"tornPaper"}>tornPaper</option>
                    <option key={"3"} value={"envelope"}>envelope</option>
                    <option key={"4"} value={"messageInABottle"}>messageInABottle</option>
                    <option key={"5"} value={"clueNoteIcon"}>clueNoteIcon</option>
                    <option key={"6"} value={"diary"}>diary</option>
                </SelectField>
                <IconClueDisplay hide="true" gameClueIcon={formCreateClueState.gameClueIcon}/>
                <TextField
                    onChange={(event) => setInputCreateClue('gameClueImage', event.target.value)}
                    name="gameClueImage"
                    placeholder="Game Clue Image"
                    label="Game Clue Image"
                    variation="quiet"
                    value={formCreateClueState.gameClueImage}
                    required
                />
                <label>Game Clue Image</label>
                <Flex direction="row" justifyContent="flex-start">
                    <img width="50px" src={formCreateClueState.gameClueImage} />
                    {formCreateClueState.gameClueImage}</Flex>
                <label htmlFor="file-upload" className="custom-file-upload">
                    Upload File
                </label>
                <input id="file-upload" type="file" accept="image/*" onChange={handleGameClueImageChange} />
            </Flex>
            <Flex direction="row" justifyContent="center" marginTop="20px" className={"game-form"}>
                <Flex direction="row" justifyContent="center" marginTop="20px" className={"game-form"}>
                    {(action == "add") &&
                    <Button id="createClue" className="show" onClick={addClue}
                            variation="primary">
                        Create Clue
                    </Button>}
                    {(action == "addBackupClue") &&
                    <Button id="createClue" className="show" onClick={addClueFromFile}
                            variation="primary">
                        Create Clue from File
                    </Button>}
                    {(action == "edit") &&
                    <Button id="updateClue" className="show" onClick={updateClue}
                            variation="primary">
                        Update Clue
                    </Button>}
                </Flex>
            </Flex>
        </View>)
}