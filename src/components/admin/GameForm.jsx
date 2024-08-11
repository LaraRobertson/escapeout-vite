import {Button, Flex, SwitchField, TextAreaField, TextField, View} from "@aws-amplify/ui-react";
import React, {useContext, useEffect, useState} from "react";
import {getGame} from "../../graphql/queries";
import * as mutations from "../../graphql/mutations";
import {MyAuthContext} from "../../MyContext";
import {generateClient} from "aws-amplify/api";

export default function GameForm() {
    const client = generateClient();
    const { setModalContent, modalContent } = useContext(MyAuthContext);
    let action = modalContent.action;
    let gameID = modalContent.id;
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
    return (
        <View id="gameForm" className="show" as="form" margin=".5rem 0">
            <Flex direction="column" justifyContent="center" gap="1rem">
                <SwitchField
                    label="disabled"
                    isChecked={formCreateGameState.disabled}
                    onChange={(e) => {
                        console.log("e.target.checked: " + e.target.checked)
                        setInputCreateGame('disabled', e.target.checked);
                    }}
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

                <TextField
                    name="GameLocationCity"
                    onChange={(event) => setInputCreateGame('gameLocationCity', event.target.value)}
                    placeholder="City"
                    label="Game Location City"
                    variation="quiet"
                    value={formCreateGameState.gameLocationCity}
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
            <Flex direction="row" justifyContent="center" marginTop="20px">
                {(action == "add") &&
                <Button id="createGame" className="show" onClick={addGame}
                        variation="primary">
                    Create Game
                </Button>}
                {(action == "edit") &&
                <Button id="updateGame" className="show" onClick={updateGame}
                        variation="primary">
                    Update Game
                </Button>}
            </Flex>
        </View>)
}