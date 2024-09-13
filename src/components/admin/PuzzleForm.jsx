import {Button, Flex, Input, SelectField, SwitchField, TextAreaField, TextField, View} from "@aws-amplify/ui-react";
import React, {useContext, useEffect, useState} from "react";
import {getGame, getGamePlayZone, getGamePuzzle} from "../../graphql/queries";
import * as mutations from "../../graphql/mutations";
import {MyAuthContext} from "../../MyContext";
import {generateClient} from "aws-amplify/api";
import {createGamePuzzle} from "../../graphql/mutations";
import {uploadData} from "aws-amplify/storage";

export default function PuzzleForm(props) {
    const client = generateClient();
    const { setModalContent, modalContent } = useContext(MyAuthContext);
    console.log("zoneID (puzzle form): " + modalContent.zoneID);
    let formCreateGameStateBackup = props.formCreateGameStateBackup;
    let puzzle = modalContent.puzzle;
    let action = modalContent.action;
    let puzzleID = modalContent.id;
    let zoneID = modalContent.gamePlayZoneID;
    let gameID = modalContent.gameID;
    let gameDesigner = modalContent.gameDesigner;
    let gamePlayZoneObject = props.gamePlayZoneObject;
    const [puzzleBackup, setPuzzleBackup] = useState(false);
    const initialStateCreatePuzzle = {
        gameID: gameID,
        gamePlayZoneID: zoneID,
        puzzleName: '',
        puzzleClueRevealed: '',
        puzzleClueText: '',
        winGame: false,
        order: 1,
        disabled: false
    };
    const [formCreatePuzzleState, setFormCreatePuzzleState] = useState(initialStateCreatePuzzle);
    function setInputCreatePuzzle(key, value) {
        setFormCreatePuzzleState({ ...formCreatePuzzleState, [key]: value });
    }
    useEffect(() => {
        if (action === "edit") {
            populatePuzzleForm();
        } else if (action === "addBackupPuzzle") {
            setFormCreatePuzzleState(puzzle);
            console.log("zone: " + JSON.stringify(puzzle));
            let key = "gameID";
            let value = gameID;
            let key2 = "gamePlayZoneID";
            let value2 = zoneID;
            setFormCreatePuzzleState({...puzzle,[key]:value,[key2]:value2});
            console.log("puzzle2: " + JSON.stringify(formCreatePuzzleState));
        }
    },[]);
    async function populatePuzzleForm() {
        try {
            const apiData = await client.graphql({
                query: getGamePuzzle,
                variables: {id: puzzleID}
            });
            const puzzlesFromAPI = apiData.data.getGamePuzzle;
            setFormCreatePuzzleState(puzzlesFromAPI);
        } catch (err) {
            console.log('error fetching getGamePuzzle', err);
        }
    }
    async function addPuzzleFromFile() {
        try {
            if (!formCreatePuzzleState.puzzleName ) return;
            const puzzle = { ...formCreatePuzzleState };
            console.log("addPuzzle: " + puzzle);
            /* setGames([...games, game]);*/
            setFormCreatePuzzleState(initialStateCreatePuzzle);
            delete puzzle.id;
            delete puzzle.textField;
            delete puzzle.updatedAt;
            delete puzzle.__typename;
            await client.graphql({
                query: mutations.createGamePuzzle,
                variables: {
                    input: puzzle
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
            console.log('error creating puzzles:', err);
        }
    }
    async function addPuzzle() {
        try {
            if (!formCreatePuzzleState.puzzleName ) return;
            const puzzle = { ...formCreatePuzzleState };
            console.log("addPuzzle: " + puzzle);
            /* setGames([...games, game]);*/
            setFormCreatePuzzleState(initialStateCreatePuzzle);
            await client.graphql({
                query: mutations.createGamePuzzle,
                variables: {
                    input: puzzle
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
            console.log('error creating puzzles:', err);
        }
    }
    async function updatePuzzle() {
        try {
            if (!formCreatePuzzleState.gameID|| !formCreatePuzzleState.gamePlayZoneID) return;
            const puzzle = { ...formCreatePuzzleState };
            console.log("formCreatePuzzleState - update gamePuzzle")
            setFormCreatePuzzleState(initialStateCreatePuzzle);
            delete puzzle.textField;
            delete puzzle.updatedAt;
            delete puzzle.__typename;
            await client.graphql({
                query: mutations.updateGamePuzzle,
                variables: {
                    input: puzzle
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
            console.log('error updating GamePuzzle:', err);
        }

    }

    async function handleGamePuzzleClueImageChange(e) {
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
                        path: "public/" + gameDesignerCleaned + "/puzzles/" + file.name,
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
                setInputCreatePuzzle('puzzleClueRevealed', "https://escapeoutbucket2183723-dev.s3.amazonaws.com/public/" + gameDesignerCleaned + "/puzzles/" + file.name)
            }
        }

    }
    function removeFunction(inputString) {
        return inputString.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
    }
    return (
        <View id="gamePuzzleForm" className="show" as="form" margin=".5rem 0">
            <View><strong>Game Puzzle Form</strong></View>
            <View className={"small"}>Game ID: {formCreatePuzzleState.gameID}</View>
            <View className={"small"}>Zone ID: {gamePlayZoneObject[formCreatePuzzleState.gamePlayZoneID]}|{formCreatePuzzleState.gamePlayZoneID}</View>
            <Flex direction="column" justifyContent="center" gap="1rem" className={"game-form"}>
                <SelectField
                    className={"city-dropdown"}
                    paddingTop={"3px"}
                    value={modalContent.zoneID}
                    onChange={(e) =>  setInputCreatePuzzle('gamePlayZoneID', e.target.value)} label={""}>
                    <option value="change zone">select zone</option>
                    {Object.entries(gamePlayZoneObject).map(([key, value], i) => (
                        <option key={key} value={key}>{value}</option>
                    ))}
                </SelectField>
                <SwitchField
                    label="disabled"
                    isChecked={formCreatePuzzleState.disabled}
                    onChange={(e) => {
                        console.log("e.target.checked: " + e.target.checked)
                        setInputCreatePuzzle('disabled', e.target.checked);
                    }}
                />
                <SwitchField
                    label="winGame"
                    isChecked={formCreatePuzzleState.winGame}
                    onChange={(e) => {
                        console.log("e.target.checked: " + e.target.checked)
                        setInputCreatePuzzle('winGame', e.target.checked);
                    }}
                />

                <Input
                    name="order"
                    type="number"
                    size="small"
                    width="50px"
                    onChange={(event) => setInputCreatePuzzle('order', event.target.value)}
                    value={formCreatePuzzleState.order}
                />
                <TextField
                    onChange={(event) => setInputCreatePuzzle('puzzleName', event.target.value)}
                    name="puzzleName"
                    placeholder="Puzzle Name"
                    label="Puzzle Name"
                    variation="quiet"
                    value={formCreatePuzzleState.puzzleName}
                    required
                />
                <TextField
                    onChange={(event) => setInputCreatePuzzle('puzzleClueText', event.target.value)}
                    name="puzzleClueText"
                    placeholder="Puzzle Clue Text (revealed)"
                    label="Clue Text Revealed"
                    variation="quiet"
                    value={formCreatePuzzleState.puzzleClueText}
                />
                <TextField
                    onChange={(event) => setInputCreatePuzzle('puzzleClueRevealed', event.target.value)}
                    name="puzzleClueRevealed"
                    placeholder="Puzzle Clue Revealed (image)"
                    label="Puzzle Image Revealed"
                    variation="quiet"
                    value={formCreatePuzzleState.puzzleClueRevealed}
                />
                <label>Puzzle Image Revealed</label>
                <Flex direction="row" justifyContent="flex-start">
                    <img width="50px" src={formCreatePuzzleState.puzzleClueRevealed} />
                    {formCreatePuzzleState.puzzleClueRevealed}</Flex>
                <label htmlFor="file-upload" className="custom-file-upload">
                    Upload File
                </label>
                <input id="file-upload" type="file" accept="image/*" onChange={handleGamePuzzleClueImageChange} />
            </Flex>
            <Flex direction="row" justifyContent="center" marginTop="20px" className={"game-form"}>
                <Flex direction="row" justifyContent="center" marginTop="20px" className={"game-form"}>
                    {(action == "add") &&
                    <Button id="createPuzzle" className="show" onClick={addPuzzle}
                            variation="primary">
                        Create Puzzle
                    </Button>}
                    {(action == "addBackupPuzzle") &&
                    <Button id="createPuzzle" className="show" onClick={addPuzzleFromFile}
                            variation="primary">
                        Create Puzzle From File
                    </Button>}
                    {(action == "edit") &&
                    <Button id="updatePuzzle" className="show" onClick={updatePuzzle}
                            variation="primary">
                        Update Puzzle
                    </Button>}
                </Flex>
            </Flex>
        </View>)
}