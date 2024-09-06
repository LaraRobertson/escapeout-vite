import {Button, Flex, Input, SelectField, SwitchField, TextAreaField, TextField, View} from "@aws-amplify/ui-react";
import React, {useContext, useEffect, useState} from "react";
import {getGame, listCities} from "../../graphql/queries";
import * as mutations from "../../graphql/mutations";
import {MyAuthContext} from "../../MyContext";
import {generateClient} from "aws-amplify/api";
import diary from "../../assets/noun-diary-6966311.svg";
import messageInABottle from "../../assets/noun-message-in-a-bottle-5712014.svg";
import clueIcon from "../../assets/noun-clue-4353248.svg";
import clueNoteIcon from "../../assets/noun-note-question-1648398.svg";
import envelope from "../../assets/noun-message-6963433.svg";
import tornPaper from "../../assets/noun-torn-paper-3017230.svg";

export default function GameForm(props) {
    const client = generateClient();
    const { setModalContent, modalContent } = useContext(MyAuthContext);
    const [cities, setCities] = useState([]);
    let action = modalContent.action;
    let gameID = modalContent.id;
    let formCreateGameStateBackup = props.formCreateGameStateBackup;
    let setFormCreateGameStateBackup = props.setFormCreateGameStateBackup;
    const initialStateCreateGame = {
        gameName: '',
        gameType: '',
        gameLocationPlace: '',
        gameLocationCity: '',
        gameDesigner: '',
        gameLevel: '',
        walkingDistance: '',
        gameWinMessage: '',
        type: "game",
        gameDescription: '',
        gameLogisticInfo: '',
        gameSummary: '',
        gameIntro: '',
        gameGoals: '',
        disabled: false
    };
    const [formCreateGameState, setFormCreateGameState] = useState(initialStateCreateGame);
    useEffect(() => {
        if (action === "edit") {
            populateGameForm();
        }
        fetchCities();
    },[]);
    async function populateGameForm() {
        console.log("gameID : " + gameID );
        try {
            const apiData = await client.graphql({
                query: getGame,
                variables: {id: gameID}
            });
            const gamesFromAPI = apiData.data.getGame;
            setFormCreateGameState(gamesFromAPI);
        } catch (err) {
            console.log('error fetching getGame', err);
        }
    }
    async function addGame() {
        try {
            if (!formCreateGameState.gameName ) return;
            const game = { ...formCreateGameState };
            console.log("addGame: " + game);
            /* setGames([...games, game]);*/
            setFormCreateGameState(initialStateCreateGame);
            await client.graphql({
                query: mutations.createGame,
                variables: {
                    input: game
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
            console.log('error creating games:', err);
        }
    }
    async function addGameFromFile() {
        try {
            if (!formCreateGameState.gameName ) return;
            const game = { ...formCreateGameState };
            console.log("addGame: " + game);
            /* setGames([...games, game]);*/
            setFormCreateGameState(initialStateCreateGame);
            delete game.updatedAt;
            delete game.user;
            delete game.__typename;
            delete game.gameHint;
            delete game.gamePlayZone;
            delete game.gameClue;
            delete game.gamePuzzle;
            await client.graphql({
                query: mutations.createGame,
                variables: {
                    input: game
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
            console.log('error creating games:', err);
        }
    }
    async function updateGame() {
        console.log("updateGame: " + formCreateGameState.gameName)
        try {
            if (!formCreateGameState.gameName) return;
            const game = { ...formCreateGameState };
            console.log("formCreateGameState - update game")
            for (const key in game) {
                console.log(`${key}: ${game[key]}`);
            }
            setFormCreateGameState(initialStateCreateGame);
            delete game.updatedAt;
            delete game.user;
            delete game.__typename;
            delete game.gameHint;
            delete game.gamePlayZone;
            delete game.gameClue;
            delete game.gamePuzzle;
            await client.graphql({
                query: mutations.updateGame,
                variables: {
                    input: game
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
            console.log('error updating games:', err);
        }
    }
    function setInputCreateGame(key, value) {
        setFormCreateGameState({ ...formCreateGameState, [key]: value });
    }
    const [files, setFiles] = useState("");
    async function handleUploadBackup(e) {
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
            const fileReader = new FileReader();
            fileReader.readAsText(e.target.files[0], "UTF-8");
            fileReader.onload = e => {
                console.log("e.target.result", e.target.result);
                setFormCreateGameStateBackup(JSON.parse(e.target.result));
                setFormCreateGameState(JSON.parse(e.target.result));
                localStorage.setItem("backup",e.target.result);
            };
        }
    }
    async function fetchCities() {
        try {
            const apiData = await client.graphql({
                query: listCities,
                variables: {filter: {}}
            });
            const citiesFromAPI = apiData.data.listCities.items;
            setCities(citiesFromAPI);
        } catch (err) {
            console.log('error fetching cities', err);
        }
    }
    return (
        <View id="gameForm" className="show" as="form" margin=".5rem 0">
            <Flex direction="column" justifyContent="center" gap="1rem" className={"game-form"}>
                {(action == "addFromFile") && <View>
                <label htmlFor="file-upload-txt" className="custom-file-upload">
                    Upload File
                </label>
                <input id="file-upload-txt" type="file" accept=".txt" onChange={handleUploadBackup} />
                </View>}
                {(action == "edit") && <View>
                    game id: {gameID}
                </View>}
                <SwitchField
                    label={formCreateGameState.disabled? "disabled" : "live"}
                    isChecked={formCreateGameState.disabled}
                    onChange={(e) => {
                        console.log("e.target.checked: " + e.target.checked)
                        setInputCreateGame('disabled', e.target.checked);
                    }}
                />
                <View>Order</View>
                <Input
                    name="order"
                    type="number"
                    size="small"
                    width="50px"
                    placeholder="order"
                    onChange={(event) =>  setInputCreateGame('order', event.target.value)}
                    value={formCreateGameState.order}
                />
                <TextField
                    onChange={(event) => setInputCreateGame('gameName', event.target.value)}
                    name="gameName"
                    placeholder="Game Name"
                    label="Game Name"
                    variation="quiet"
                    value={formCreateGameState.gameName}
                    required
                />
                <TextField
                    onChange={(event) => setInputCreateGame('gameType', event.target.value)}
                    name="GameType"
                    placeholder="free/not free"
                    label="Game Type"
                    variation="quiet"
                    value={formCreateGameState.gameType}
                    required
                />
                <TextField
                    onChange={(event) => setInputCreateGame('gameLocationPlace', event.target.value)}
                    name="GameLocationPlace"
                    placeholder="Place"
                    label="Game Location Place"
                    variation="quiet"
                    value={formCreateGameState.gameLocationPlace}
                    required
                />
                <SelectField
                    className={"city-dropdown"}
                    label="Game Location City"
                    placeholder="choose a city"
                    value={formCreateGameState.gameLocationCity}
                    onChange={(event) => setInputCreateGame('gameLocationCity', event.target.value)}>
                    {cities.map((city, index) => (
                        <option key={city.id} value={city.cityName}>{city.cityName}</option>
                    ))}
                </SelectField>
                <TextField
                    onChange={(event) => setInputCreateGame('latitude', event.target.value)}
                    name="latitude"
                    placeholder="latitude"
                    label="latitude"
                    variation="quiet"
                    value={formCreateGameState.latitude}
                    required
                />
                <TextField
                    onChange={(event) => setInputCreateGame('longitude', event.target.value)}
                    name="longitude"
                    placeholder="longitude"
                    label="longitude"
                    variation="quiet"
                    value={formCreateGameState.longitude}
                    required
                />
                <TextField
                    onChange={(event) => setInputCreateGame('gameWinMessage', event.target.value)}
                    name="GameWinMessage"
                    placeholder="game win message"
                    label="Game Win Message"
                    variation="quiet"
                    value={formCreateGameState.gameWinMessage}
                />
                <TextField
                    onChange={(event) => setInputCreateGame('gameDescription', event.target.value)}
                    name="GameDescription"
                    placeholder="Game Description (on Game Card)"
                    label="Game Description (on Game Card)"
                    variation="quiet"
                    value={formCreateGameState.gameDescription}
                    required
                />
                <TextField
                    onChange={(event) => setInputCreateGame('gameGoals', event.target.value)}
                    name="GameGoals"
                    placeholder="Game Goals (on Game Card)"
                    label="Game Goals (on Game Card)"
                    variation="quiet"
                    value={formCreateGameState.gameGoals}
                />
                <TextField
                    onChange={(event) => setInputCreateGame('gameLevel', event.target.value)}
                    name="Game Level"
                    placeholder="Game Level"
                    label="Game Level"
                    variation="quiet"
                    value={formCreateGameState.gameLevel}
                />
                <TextField
                    onChange={(event) => setInputCreateGame('walkingDistance', event.target.value)}
                    name="GameGoals"
                    placeholder="Walking Distance"
                    label="Walking Distance"
                    variation="quiet"
                    value={formCreateGameState.walkingDistance}
                />
                <TextAreaField
                    autoComplete="off"
                    label="Game Summary (on Game Detail)"
                    direction="column"
                    hasError={false}
                    isDisabled={false}
                    isReadOnly={false}
                    isRequired={false}
                    labelHidden={false}
                    name="GameSummary"
                    placeholder="Game Summary"
                    rows="3"
                    size="small"
                    wrap="nowrap"
                    value={formCreateGameState.gameSummary}
                    onChange={(e) => setInputCreateGame('gameSummary', e.currentTarget.value)}
                />
                <TextAreaField
                    autoComplete="off"
                    direction="column"
                    label="Game Logistics Info (on Game Detail)"
                    hasError={false}
                    isDisabled={false}
                    isReadOnly={false}
                    isRequired={false}
                    labelHidden={false}
                    name="Game Logistics Info"
                    placeholder="Game Logistics Info"
                    rows="3"
                    size="small"
                    wrap="nowrap"
                    value={formCreateGameState.gameLogisticInfo}
                    onChange={(e) => setInputCreateGame('gameLogisticInfo', e.currentTarget.value)}
                />
                <TextAreaField
                    autoComplete="off"
                    direction="column"
                    label="Game Intro (on Game Intro)"
                    hasError={false}
                    isDisabled={false}
                    isReadOnly={false}
                    isRequired={false}
                    labelHidden={false}
                    name="Game Intro"
                    placeholder="Game Intro"
                    rows="3"
                    size="small"
                    wrap="nowrap"
                    value={formCreateGameState.gameIntro}
                    onChange={(e) => setInputCreateGame('gameIntro', e.currentTarget.value)}
                />
                <TextField
                    onChange={(event) => setInputCreateGame('gameDesigner', event.target.value)}
                    name="GameGoals"
                    placeholder="Game Designer"
                    label="Game Designer"
                    variation="quiet"
                    value={formCreateGameState.gameDesigner}
                />
            </Flex>
            <Flex direction="row" justifyContent="center" marginTop="20px" className={"game-form"}>
                {(action == "add") &&
                <Button id="createGame" className="show" onClick={addGame}
                        variation="primary">
                    Create Game
                </Button>}
                {(action == "addFromFile") &&
                <Button id="createGame" className="show" onClick={addGameFromFile}
                        variation="primary">
                    Add Game From File
                </Button>}
                {(action == "edit") &&
                <Button id="updateGame" className="show" onClick={updateGame}
                        variation="primary">
                    Update Game
                </Button>}
            </Flex>
        </View>)
}