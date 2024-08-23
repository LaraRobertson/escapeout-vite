import {
    Button,
    Flex,
    Heading,
    Input,
    SelectField,
    SwitchField,
    TextAreaField,
    TextField,
    View
} from "@aws-amplify/ui-react";
import React, {useContext, useEffect, useState} from "react";
import {getGame, getGamePlayZone} from "../../graphql/queries";
import * as mutations from "../../graphql/mutations";
import {MyAuthContext} from "../../MyContext";
import {generateClient} from "aws-amplify/api";
import {createGamePlayZone} from "../../graphql/mutations";
import { getProperties } from 'aws-amplify/storage';
import { StorageManager } from '@aws-amplify/ui-react-storage';
import { uploadData } from 'aws-amplify/storage';

export default function ZoneForm() {
    const client = generateClient();
    const { setModalContent, modalContent } = useContext(MyAuthContext);
    let action = modalContent.action;
    let zoneID = modalContent.id;
    let gameID = modalContent.gameID;
    let zone = modalContent.zone;
    let gameDesigner = modalContent.gameDesigner;

    const initialStateCreateZone = {
        gameID: gameID,
        gameZoneName: '',
        gameZoneImage: '',
        gameZoneDescription: '',
        longitude: '',
        latitude: '',
        order: 1,
        disabled: false
    };
    const [formCreateZoneState, setFormCreateZoneState] = useState(initialStateCreateZone);
    function setInputCreateZone(key, value) {
        setFormCreateZoneState({ ...formCreateZoneState, [key]: value });
    }
    useEffect(() => {
        if (action === "edit") {
            populateZoneForm();
        } else if (action === "addZone") {
            setFormCreateZoneState(zone);
            console.log("zone: " + JSON.stringify(zone));
            let key = "gameID";
            let value = gameID;
            setFormCreateZoneState({...zone,[key]:value});
            console.log("zone2: " + JSON.stringify(formCreateZoneState));
        }
    },[]);
    async function populateZoneForm() {
        try {
            const apiData = await client.graphql({
                query: getGamePlayZone,
                variables: {id: zoneID}
            });
            const zonesFromAPI = apiData.data.getGamePlayZone;
            setFormCreateZoneState(zonesFromAPI);
        } catch (err) {
            console.log('error fetching getGamePlayZone', err);
        }
    }
    async function addZoneFromFile() {
        try {
            if (!formCreateZoneState.gameZoneName ) return;
            const zone = { ...formCreateZoneState };
            console.log("addZone: " + zone);
            /* setGames([...games, game]);*/
            setFormCreateZoneState(initialStateCreateZone);
            delete zone.updatedAt;
            delete zone.__typename;
            delete zone.id;
            await client.graphql({
                query: mutations.createGamePlayZone,
                variables: {
                    input: zone
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
            console.log('error creating gamePlayZone:', err);
        }
    }
    async function addZone() {
        try {
            if (!formCreateZoneState.gameZoneName ) return;
            const zone = { ...formCreateZoneState };
            console.log("addZone: " + zone);
            /* setGames([...games, game]);*/
            setFormCreateZoneState(initialStateCreateZone);
            await client.graphql({
                query: mutations.createGamePlayZone,
                variables: {
                    input: zone
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
            console.log('error creating gamePlayZone:', err);
        }
    }
    async function updateZone() {
        try {
            if (!formCreateZoneState.gameID|| !formCreateZoneState.gameZoneName) return;
            const gamePlayZone = { ...formCreateZoneState };
            console.log("formCreateZoneState - update gamePlayZone")
            for (const key in gamePlayZone) {
                console.log(`${key}: ${gamePlayZone[key]}`);
            }
            setFormCreateZoneState(initialStateCreateZone);
            delete gamePlayZone.updatedAt;
            delete gamePlayZone.__typename;
            await client.graphql({
                query: mutations.updateGamePlayZone,
                variables: {
                    input: gamePlayZone
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
            console.log('error updating GamePlayZone:', err);
        }

    }

    async function handleGameZoneImageChange(e) {
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
                        path: "public/" + gameDesignerCleaned + "/zones/" + file.name,
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

                setInputCreateZone('gameZoneImage', "https://escapeoutbucket2183723-dev.s3.amazonaws.com/public/" + gameDesignerCleaned + "/zones/" + file.name)
            }
        }
    }
    function removeFunction(inputString) {
        return inputString.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
    }

    return (
        <View id="gamePlayZoneForm" className="show" as="form" margin=".5rem 0">
            <View><strong>Game Play Zone Form</strong></View>
            <View className={"small"}>Game ID: {formCreateZoneState.gameID}</View>
            <Flex direction="column" justifyContent="center" gap="1rem" className={"game-form"}>
                <SwitchField
                    label="disabled"
                    isChecked={formCreateZoneState.disabled}
                    onChange={(e) => {
                        console.log("e.target.checked: " + e.target.checked)
                        setInputCreateZone('disabled', e.target.checked);
                    }}
                />
                <View>Order</View>
                <Input
                    name="order"
                    type="number"
                    size="small"
                    width="50px"
                    onChange={(event) => setInputCreateZone('order', event.target.value)}
                    value={formCreateZoneState.order}
                />
                <TextField
                    onChange={(event) => setInputCreateZone('gameZoneName', event.target.value)}
                    name="gameZoneName"
                    placeholder="Game Zone Name"
                    label="Game Zone Name"
                    variation="quiet"
                    value={formCreateZoneState.gameZoneName}
                    required
                />
                <TextField
                    onChange={(event) => setInputCreateZone('gameZoneDescription', event.target.value)}
                    name="gameZoneDescription"
                    placeholder="Game Zone Description"
                    label="Game Zone Description"
                    variation="quiet"
                    value={formCreateZoneState.gameZoneDescription}
                    required
                />
                <TextField
                    onChange={(event) => setInputCreateZone('latitude', event.target.value)}
                    name="latitude"
                    placeholder="latitude"
                    label="latitude"
                    variation="quiet"
                    value={formCreateZoneState.latitude}
                    required
                />
                <TextField
                    onChange={(event) => setInputCreateZone('longitude', event.target.value)}
                    name="longitude"
                    placeholder="longitude"
                    label="longitude"
                    variation="quiet"
                    value={formCreateZoneState.longitude}
                    required
                />
                <TextField
                    onChange={(event) => setInputCreateZone('gameZoneImage', event.target.value)}
                    name="Zone Image"
                    placeholder="Zone Image"
                    label="Zone Image"
                    variation="quiet"
                    value={formCreateZoneState.gameZoneImage}
                    required
                />
                <label>Zone Image</label>
                <Flex direction="row" justifyContent="flex-start">
                <img width="50px" src={formCreateZoneState.gameZoneImage} />
                    {formCreateZoneState.gameZoneImage}</Flex>
                <label htmlFor="file-upload" className="custom-file-upload">
                    Upload File
                </label>
                <input id="file-upload" type="file" accept="image/*" onChange={handleGameZoneImageChange} />
            </Flex>
            <Flex direction="row" justifyContent="center" marginTop="20px" className={"game-form"}>
                {(action == "add") &&
                <Button id="createZone" onClick={addZone}
                        variation="primary">
                    Create Zone
                </Button>}
                {(action == "addZone") &&
                <Button id="createZone" onClick={addZoneFromFile}
                        variation="primary">
                    Create Zone from File
                </Button>}
                {(action == "edit") &&
                <Button id="updateZone" onClick={updateZone}
                        variation="primary">
                    Update Zone
                </Button>}
            </Flex>
        </View>)
}