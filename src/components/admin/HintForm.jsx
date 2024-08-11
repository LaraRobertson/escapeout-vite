import {Button, Flex, Input, SwitchField, TextAreaField, TextField, View} from "@aws-amplify/ui-react";
import React, {useContext, useEffect, useState} from "react";
import {getGame, getGameClue, getGameHint, getGamePlayZone, getGamePuzzle} from "../../graphql/queries";
import * as mutations from "../../graphql/mutations";
import {MyAuthContext} from "../../MyContext";
import {generateClient} from "aws-amplify/api";
import {createGamePuzzle} from "../../graphql/mutations";

export default function HintForm() {
    const client = generateClient();
    const { setModalContent, modalContent } = useContext(MyAuthContext);
    console.log("zoneID (puzzle form): " + modalContent.zoneID);
    let action = modalContent.action;
    let hintID = modalContent.id;
    let zoneID = modalContent.gamePlayZoneID;
    let gameID = modalContent.gameID;

    const initialStateCreateHint = {
        gameID: gameID,
        gamePlayZoneID: zoneID,
        gameHintName: '',
        gameHintDescription: '',
        order: 1,
        disabled: false
    };
    const [formCreateHintState, setFormCreateHintState] = useState(initialStateCreateHint);
    function setInputCreateHint(key, value) {
        setFormCreateHintState({ ...formCreateHintState, [key]: value });
    }
    useEffect(() => {
        if (action === "edit") {
            populateHintForm();
        }
    },[]);
    async function populateHintForm() {
        try {
            const apiData = await client.graphql({
                query: getGameHint,
                variables: {id: hintID}
            });
            const hintsFromAPI = apiData.data.getGameHint;
            setFormCreateHintState(hintsFromAPI);
        } catch (err) {
            console.log('error fetching getGameClue', err);
        }
    }
    async function addHint() {
        try {
            if (!formCreateHintState.gameID || !formCreateHintState.gameHintName) return;
            const gameHint = { ...formCreateHintState };
            console.log("addHint - gameHint: " + gameHint);
            // setGames([...games, game]);
            setFormCreateHintState(initialStateCreateHint);
            await client.graphql({
                query: mutations.createGameHint,
                variables: {
                    input: gameHint
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
    async function updateHint() {
        try {
            if (!formCreateHintState.gameID|| !formCreateHintState.gameHintName) return;
            const gameHint = { ...formCreateHintState };
            console.log("formCreateHintState - update gameHint")
            setFormCreateHintState(initialStateCreateHint);
            delete gameHint.updatedAt;
            delete gameHint.__typename;
            await client.graphql({
                query: mutations.updateGameHint,
                variables: {
                    input: gameHint
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
            console.log('error updating GameHint:', err);
        }

    }

    return (
        <View id="gameHintForm" className="show" as="form" margin=".5rem">
            <View><strong>Game Hint Form</strong></View>
            <View className={"small"}>Game ID: {formCreateHintState.gameID}</View>
            <View className={"small"}>Zone ID: {formCreateHintState.gamePlayZoneID}</View>
            <Flex direction="column" justifyContent="center" gap="1rem">
                <SwitchField
                    label="disabled"
                    isChecked={formCreateHintState.disabled}
                    onChange={(e) => {
                        console.log("e.target.checked: " + e.target.checked)
                        setInputCreateHint('disabled', e.target.checked);
                    }}
                />
                <View>Order</View>
                <Input
                    name="order"
                    type="number"
                    size="small"
                    width="50px"
                    placeholder="order"
                    onChange={(event) => setInputCreateHint('order', event.target.value)}
                    value={formCreateHintState.order}
                />

                <TextField
                    onChange={(event) => setInputCreateHint('gameHintName', event.target.value)}
                    name="gameHintName"
                    placeholder="Game Hint Name"
                    label="Game Hint Name"
                    variation="quiet"
                    value={formCreateHintState.gameHintName}
                    required
                />
            </Flex>
            <Flex direction="column" justifyContent="center" gap="1rem">

                <TextField
                    onChange={(event) => setInputCreateHint('gameHintDescription', event.target.value)}
                    name="GameHintDescription"
                    placeholder="Game Hint Description"
                    label="Game Hint Description"
                    variation="quiet"
                    value={formCreateHintState.gameHintDescription}
                    required
                />
            </Flex>

                <Flex direction="row" justifyContent="center" marginTop="20px">
                    {(action == "add") &&
                    <Button id="createHint" className="show" onClick={addHint}
                            variation="primary">
                        Create Hint
                    </Button>}
                    {(action == "edit") &&
                    <Button id="updateHint" className="show" onClick={updateHint}
                            variation="primary">
                        Update Hint
                    </Button>}
                </Flex>

        </View>)
}