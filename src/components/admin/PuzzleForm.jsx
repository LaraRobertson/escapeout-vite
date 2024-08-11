import {Button, Flex, Input, SwitchField, TextAreaField, TextField, View} from "@aws-amplify/ui-react";
import React, {useContext, useEffect, useState} from "react";
import {getGame, getGamePlayZone, getGamePuzzle} from "../../graphql/queries";
import * as mutations from "../../graphql/mutations";
import {MyAuthContext} from "../../MyContext";
import {generateClient} from "aws-amplify/api";
import {createGamePuzzle} from "../../graphql/mutations";

export default function PuzzleForm() {
    const client = generateClient();
    const { setModalContent, modalContent } = useContext(MyAuthContext);
    console.log("zoneID (puzzle form): " + modalContent.zoneID);
    let action = modalContent.action;
    let puzzleID = modalContent.id;
    let zoneID = modalContent.gamePlayZoneID;
    let gameID = modalContent.gameID;

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
            const gamePuzzle = { ...formCreatePuzzleState };
            console.log("formCreatePuzzleState - update gamePuzzle")
            for (const key in gamePuzzle) {
                console.log(`${key}: ${gamePuzzle[key]}`);
            }
            setFormCreatePuzzleState(initialStateCreatePuzzle);
            delete gamePuzzle.textField;
            delete gamePuzzle.updatedAt;
            delete gamePuzzle.__typename;
            await client.graphql({
                query: mutations.updateGamePuzzle,
                variables: {
                    input: gamePuzzle
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

    return (
        <View id="gamePuzzleForm" className="show" as="form" margin=".5rem 0">
            <View><strong>Game Puzzle Form</strong></View>
            <View className={"small"}>Game ID: {formCreatePuzzleState.gameID}</View>
            <View className={"small"}>Zone ID: {formCreatePuzzleState.gamePlayZoneID}</View>
            <Flex direction="column" justifyContent="center" gap="1rem">
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
                    placeholder="Clue Text Revealed"
                    label="Clue Text Revealed"
                    variation="quiet"
                    value={formCreatePuzzleState.puzzleClueText}
                />
                <TextField
                    onChange={(event) => setInputCreatePuzzle('puzzleClueReavealed', event.target.value)}
                    name="puzzleClueRevealed"
                    placeholder="Clue Image Revealed"
                    label="Clue Image Revealed"
                    variation="quiet"
                    value={formCreatePuzzleState.puzzleClueRevealed}
                />
            </Flex>
            <Flex direction="row" justifyContent="center" marginTop="20px">
                <Flex direction="row" justifyContent="center" marginTop="20px">
                    {(action == "add") &&
                    <Button id="createPuzzle" className="show" onClick={addPuzzle}
                            variation="primary">
                        Create Puzzle
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