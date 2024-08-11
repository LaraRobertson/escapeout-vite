import {Button, Flex, Input, SwitchField, TextAreaField, TextField, View} from "@aws-amplify/ui-react";
import React, {useContext, useEffect, useState} from "react";
import {getGame, getGameClue, getGamePlayZone, getGamePuzzle} from "../../graphql/queries";
import * as mutations from "../../graphql/mutations";
import {MyAuthContext} from "../../MyContext";
import {generateClient} from "aws-amplify/api";
import {createGamePuzzle} from "../../graphql/mutations";

export default function ClueForm() {
    const client = generateClient();
    const { setModalContent, modalContent } = useContext(MyAuthContext);
    console.log("zoneID (puzzle form): " + modalContent.zoneID);
    let action = modalContent.action;
    let clueID = modalContent.id;
    let zoneID = modalContent.gamePlayZoneID;
    let gameID = modalContent.gameID;

    const initialStateCreateClue = {
        gameID: gameID,
        gamePlayZoneID: zoneID,
        gameClueName: '',
        gameClueImage: '',
        gameClueText: '',
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

    return (
        <View id="gameClueForm" className="show" as="form" margin=".5rem 0">
            <View><strong>Game Clue Form</strong></View>
            <View className={"small"}>Game ID: {formCreateClueState.gameID}</View>
            <View className={"small"}>Zone ID: {formCreateClueState.gamePlayZoneID}</View>
            <Flex direction="column" justifyContent="center" gap="1rem">
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
                <TextField
                    onChange={(event) => setInputCreateClue('gameClueImage', event.target.value)}
                    name="gameClueImage"
                    placeholder="Game Clue Image"
                    label="Game Clue Image"
                    variation="quiet"
                    value={formCreateClueState.gameClueImage}
                    required
                />
            </Flex>
            <Flex direction="row" justifyContent="center" marginTop="20px">
                <Flex direction="row" justifyContent="center" marginTop="20px">
                    {(action == "add") &&
                    <Button id="createClue" className="show" onClick={addClue}
                            variation="primary">
                        Create Clue
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