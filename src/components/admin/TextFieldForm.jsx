import {Button, Flex, Input, SwitchField, TextAreaField, TextField, View} from "@aws-amplify/ui-react";
import React, {useContext, useEffect, useState} from "react";
import {getGame, getGamePlayZone, getGamePuzzle, getTextField} from "../../graphql/queries";
import * as mutations from "../../graphql/mutations";
import {MyAuthContext} from "../../MyContext";
import {generateClient} from "aws-amplify/api";

export default function TextFieldForm() {
    const client = generateClient();
    const { setModalContent, modalContent } = useContext(MyAuthContext);
    console.log("zoneID (puzzle form): " + modalContent.zoneID);
    let action = modalContent.action;
    let puzzleID = modalContent.puzzleID;
    let zoneID = modalContent.gamePlayZoneID;
    let gameID = modalContent.gameID;
    let textFieldID = modalContent.id;

    const initialStateCreateTextField = {
        puzzleID: puzzleID,
        name: '',
        label: '',
        answer: '',
        order: 1,
        disabled: false
    };
    const [formCreateTextFieldState, setFormCreateTextFieldState] = useState(initialStateCreateTextField);
    function setInputCreateTextField(key, value) {
        setFormCreateTextFieldState({ ...formCreateTextFieldState, [key]: value });
    }
    useEffect(() => {
        if (action === "edit") {
            populateTextFieldForm();
        }
    },[]);
    async function populateTextFieldForm() {
        try {
            const apiData = await client.graphql({
                query: getTextField,
                variables: {id: textFieldID}
            });
            const textFieldFromAPI = apiData.data.getTextField;
            setFormCreateTextFieldState(textFieldFromAPI);
        } catch (err) {
            console.log('error fetching getTextField', err);
        }
    }
    async function addTextField() {
        try {
            if (!formCreateTextFieldState.puzzleID || !formCreateTextFieldState.name) return;
            const gameTextField = { ...formCreateTextFieldState };
            console.log("addZone - gameTextField: " + gameTextField);
            // setGames([...games, game]);
            setFormCreateTextFieldState(initialStateCreateTextField);
            await client.graphql({
                query: mutations.createTextField,
                variables: {
                    input: gameTextField
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
            console.log('error creating textfields:', err);
        }
    }
    async function updateTextField() {
        try {
            if (!formCreateTextFieldState.puzzleID|| !formCreateTextFieldState.name) return;
            const gameTextField = { ...formCreateTextFieldState };
            console.log("formCreateTextFieldState - update gameTextField")
            setFormCreateTextFieldState(initialStateCreateTextField);
            delete gameTextField.updatedAt;
            delete gameTextField.__typename;
            await client.graphql({
                query: mutations.updateTextField,
                variables: {
                    input: gameTextField
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
        <View id="gameTextFieldForm" className="show" as="form" margin=".5rem 0">
            <View><strong>TextField Form</strong></View>
            <View className={"small"}>Puzzle ID: {formCreateTextFieldState.puzzleID}</View>
            <Flex direction="column" justifyContent="center" gap="1rem">
                <SwitchField
                    label="disabled"
                    isChecked={formCreateTextFieldState.disabled}
                    onChange={(e) => {
                        console.log("e.target.checked: " + e.target.checked)
                        setInputCreateTextField('disabled', e.target.checked);
                    }}
                />
                <View>Order</View>
                <Input
                    name="order"
                    type="number"
                    size="small"
                    width="50px"
                    onChange={(event) => setInputCreateTextField('order', event.target.value)}
                    value={formCreateTextFieldState.order}
                />
                <TextField
                    onChange={(event) => setInputCreateTextField('puzzleID', event.target.value)}
                    name="puzzleID"
                    placeholder="Puzzle ID"
                    label="Puzzle ID"
                    variation="quiet"
                    value={formCreateTextFieldState.puzzleID}
                    required
                />
                <TextField
                    name="Name"
                    onChange={(event) => setInputCreateTextField('name', event.target.value)}
                    placeholder="Name"
                    label="Name"
                    variation="quiet"
                    value={formCreateTextFieldState.name}
                    required
                />
                <TextField
                    name="Label"
                    onChange={(event) => setInputCreateTextField('label', event.target.value)}
                    placeholder="Label"
                    label="Label"
                    variation="quiet"
                    value={formCreateTextFieldState.label}
                    required
                />
                <TextField
                    name="Answer"
                    onChange={(event) => setInputCreateTextField('answer', event.target.value)}
                    placeholder="Answer"
                    label="Answer"
                    variation="quiet"
                    value={formCreateTextFieldState.answer}
                    required
                />

            </Flex>
            <Flex direction="row" justifyContent="center" marginTop="20px">
                <Flex direction="row" justifyContent="center" marginTop="20px">
                    {(action == "add") &&
                    <Button id="createPuzzle" className="show" onClick={addTextField}
                            variation="primary">
                        Create TextField
                    </Button>}
                    {(action == "edit") &&
                    <Button id="updatePuzzle" className="show" onClick={updateTextField}
                            variation="primary">
                        Update TextField
                    </Button>}
                </Flex>
            </Flex>
        </View>)
}