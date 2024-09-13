import {Button, Flex, Input, SelectField, SwitchField, TextAreaField, TextField, View} from "@aws-amplify/ui-react";
import React, {useContext, useEffect, useState} from "react";
import {getGame, getGameClue, getGameHint, getGamePlayZone, getGamePuzzle} from "../../graphql/queries";
import * as mutations from "../../graphql/mutations";
import {MyAuthContext} from "../../MyContext";
import {generateClient} from "aws-amplify/api";
import {createGamePuzzle} from "../../graphql/mutations";

export default function HintForm(props) {
    const client = generateClient();
    const { setModalContent, modalContent, setBackupIDArray, backupIDArray  } = useContext(MyAuthContext);
    console.log("zoneID (puzzle form): " + modalContent.zoneID);
    let hint = modalContent.hint;
    let action = modalContent.action;
    let hintID = modalContent.id;
    let zoneID = modalContent.gamePlayZoneID;
    let gameID = modalContent.gameID;
    let gamePlayZoneObject = props.gamePlayZoneObject;

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
        } else if (action === "addBackupHint") {
            setFormCreateHintState(hint);
            console.log("hint: " + JSON.stringify(hint));
            let key = "gameID";
            let value = gameID;
            let key2 = "gamePlayZoneID";
            let value2 = zoneID;
            setFormCreateHintState({...hint,[key]:value,[key2]:value2});
            console.log("hint2: " + JSON.stringify(formCreateHintState));
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
            console.log('error fetching getGameHint', err);
        }
    }
    async function addHintFromFile() {
        try {
            if (!formCreateHintState.gameID || !formCreateHintState.gameHintName) return;
            const gameHint = { ...formCreateHintState };
            console.log("addHint - gameHint: " + gameHint);
            /* add backup id to an array and check if backup in an array... */
            // did a different way - setBackupIDArray( [...backupIDArray,gameHint.id]);
            // setGames([...games, game]);
            setFormCreateHintState(initialStateCreateHint);
            delete gameHint.updatedAt;
            delete gameHint.__typename;
            delete gameHint.id;
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
            <View className={"small"}>Zone ID: {gamePlayZoneObject[formCreateHintState.gamePlayZoneID]}|{formCreateHintState.gamePlayZoneID}</View>
            <Flex direction="column" justifyContent="center" gap="1rem" className={"game-form"}>
                <SelectField
                    className={"city-dropdown"}
                    paddingTop={"3px"}
                    value={modalContent.zoneID}
                    onChange={(e) =>  setInputCreateHint('gamePlayZoneID', e.target.value)} label={""}>
                    <option value="change zone">select zone</option>
                    {Object.entries(gamePlayZoneObject).map(([key, value], i) => (
                        <option key={key} value={key}>{value}</option>
                    ))}
                </SelectField>
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
            <Flex direction="column" justifyContent="center" gap="1rem" className={"game-form"}>

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
                    {(action == "addBackupHint") &&
                    <Button id="createHint" className="show" onClick={addHintFromFile}
                            variation="primary">
                        Create Hint From File
                    </Button>}
                    {(action == "edit") &&
                    <Button id="updateHint" className="show" onClick={updateHint}
                            variation="primary">
                        Update Hint
                    </Button>}
                </Flex>

        </View>)
}