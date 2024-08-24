import {Button, Flex, Heading, View, Image,
    Table, TableCell, TableBody, TableHead, TableRow, SelectField} from "@aws-amplify/ui-react";
import React, {useContext, useEffect, useState} from "react";
import * as mutations from "../../graphql/mutations";
import {
    listGames
} from "../../graphql/queries";
import {generateClient} from "aws-amplify/api";
import {MyAuthContext} from "../../MyContext";
import copyGame from "./copyGame";

export default function GameSection(props) {
    const client = generateClient();
    let formCreateGameStateBackup = props.formCreateGameStateBackup;
    let setFormCreateGameStateBackup = props.setFormCreateGameStateBackup;
    const { setModalContent, modalContent, setBackupIDArray, backupIDArray  } = useContext(MyAuthContext);
    const [cityValue, setCityValue] = React.useState("");
    const [games, setGames] = useState([]);
    const [gameType, setGameType] = useState("all");
    const [gameVisible, setGameVisible] = useState("");
    const [gameDesigner, setGameDesigner] = useState("");
    const [backupsVisible, setBackupsVisible] = useState(false);
    const [gamePlayZoneObject, setGamePlayZoneObject] = useState({});
    const [gamePlayZoneObjectBackup, setGamePlayZoneObjectBackup] = useState({});
    const [zoneBackup, setZoneBackup] = useState(false);
    const [puzzleBackup, setPuzzleBackup] = useState(false);
    const [clueBackup, setClueBackup] = useState(false);
    const [hintBackup, setHintBackup] = useState(false);
    const [gamePlayZoneArray, setGamePlayZoneArray] = useState([]);

    const [disabledGame, setDisabledGame] = useState();
    const initialStateShowHideLabel = {
        gameForm: 'Hide',
        gameSection: 'Hide',
        userSection: 'Hide',
        clueSection: 'Show',
        puzzleSection: 'Hide',
        toolSection: 'Hide',
        imageSection: 'Hide'
    };
    const [showHideLabel, setShowHideLabel] = useState(initialStateShowHideLabel)
    function divShowHide(divID) {
        console.log("divShowHide - divID: "+ divID)
        let element =  document.getElementById(divID);
        /* check if "hide */
        if (element.classList.contains("hide")) {
            console.log("hide is there");
            element.classList.remove('hide');
            element.classList.add('show');
            setShowHideLabel(showHideLabel => ({
                ...showHideLabel,
                [divID]:"Hide"
            }));
        } else if (element.classList.contains("show")) {
            console.log("show is there");
            element.classList.remove('show');
            element.classList.add('hide');
            setShowHideLabel(showHideLabel => ({
                ...showHideLabel,
                [divID]:"Show"
            }));
        }
    }
    const [gamesFilter, setGamesFilter] = useState({type: {eq:"game"}});
    function setFilterCreateGame(key, value) {
        console.log("setFilterCreateGame: " + key);
        if (key) {
            setGamesFilter({...gamesFilter, [key]: value})
        } else {
            setGamesFilter({
                type: {eq:"game"}
            });
            setDisabledGame();
            setGameType("all");
        }
    }
    async function fetchGames() {
        console.log("gamesFilter");
        for (const key in gamesFilter) {
            console.log(`${key}: ${gamesFilter[key]}`);
            for (const key1 in gamesFilter[key]) {
                console.log(`${key1}: ${gamesFilter[key][key1]}`);
                if (key === "gameType") {
                    setGameType(gamesFilter[key][key1] );
                }
                if (key === "disabled") {
                    setDisabledGame(gamesFilter[key][key1] );
                }
            }
        }
        try {
            const apiData = await client.graphql({
                query: listGames,
                variables: {filter: gamesFilter}
            });
            const gamesFromAPI = apiData.data.listGames.items;
            setGames(gamesFromAPI);
        } catch (err) {
            console.log('error fetching games', err);
        }
    }
    async function deleteGame(props) {
        console.log("props.gameID: " + props.gameID);
        try {
            const gameDetails = {
                id: props.gameID
            };
            await client.graphql({
                query: mutations.deleteGame,
                variables: { input: gameDetails }
            });
        } catch (err) {
            console.log('error deleting games:', err);
        }
        fetchGames();
    }
    async function deleteZone(props) {
        console.log("props.zoneID: " + props.zoneID);
        try {
            const zoneDetails = {
                id: props.zoneID
            };
            await client.graphql({
                query: mutations.deleteGamePlayZone,
                variables: { input:zoneDetails }
            });
        } catch (err) {
            console.log('error deleting zone:', err);
        }
        fetchGames();
    }

    async function deleteHint(props) {
        console.log("props.hintID: " + props.hintID);
        try {
            const hintDetails = {
                id: props.hintID
            };
            await client.graphql({
                query: mutations.deleteGameHint,
                variables: { input: hintDetails }
            });
        } catch (err) {
            console.log('error deleting hint:', err);
        }
        fetchGames();
    }

    async function deleteClue(props) {
        console.log("props.clueID: " + props.clueID);
        try {
            const clueDetails = {
                id: props.clueID
            };
            await client.graphql({
                query: mutations.deleteGameClue,
                variables: { input: clueDetails }
            });
        } catch (err) {
            console.log('error deleting clue:', err);
        }
        fetchGames();
    }
    async function deletePuzzle(props) {
        console.log("props.puzzleID: " + props.puzzleID);
        try {
            const puzzleDetails = {
                id: props.puzzleID
            };
            await client.graphql({
                query: mutations.deleteGamePuzzle,
                variables: { input: puzzleDetails }
            });
        } catch (err) {
            console.log('error deleting puzzle:', err);
        }
        fetchGames();
    }
    async function deleteTextField(props) {
        console.log("props.textFieldID: " + props.textFieldID);
        try {
            const textFieldDetails = {
                id: props.textFieldID
            };
            await client.graphql({
                query: mutations.deleteTextField,
                variables: { input: textFieldDetails  }
            });
        } catch (err) {
            console.log('error deleting textField:', err);
        }
        fetchGames();
    }
    async function addGameFromFile() {
        try {
            const gameString = '{"gameName":"Disc Golf Hunt and Think2","gameDescriptionH2":"You want to play disc golf but have no discs.",' +
                '"gameDescriptionH3":"Try and find some discs!",' +
                '"gameDescriptionP":"This is a level 2 game. It is a short game with some logic. There are 2 play zones.",' +
                '"gameLocationPlace":"Jaycee Park","gameLocationPlaceDetails":null,"gameLocationCity":"Tybee Island",' +
                '"gameDesigner":"EscapeOut.games","gameLevel":"level 2","walkingDistance":"500 feet","playZones":null,' +
                '"gameImage":"https://escapeoutbucket213334-staging.s3.amazonaws.com/public/Jaycee-Park-Game-Image.jpg",' +
                '"gameType":"free","gameWinMessage":"Great Job On Winning!!!","gameWinImage":null,"gameGoals":"Find Discs!",' +
                '"gameIntro":"Discs are hidden somewhere.  Use the clues to find the discs.",' +
                '"gameMap":"https://escapeoutbucket213334-staging.s3.amazonaws.com/public/game-maps/jaycee-park-2pz-map.jpg",' +
                '"type":"game","createdAt":"2024-01-07T20:21:02.214Z","disabled":false}'
            console.log("addGame: " + gameString);
            await client.graphql({
                query: mutations.createGame,
                variables: {
                    input: JSON.parse(gameString)
                }
            });
            fetchGames();
        } catch (err) {
            console.log('error creating games:', err);
        }
    }
    useEffect(() => {
        console.log("***useEffect***:  fetchGames() (on load)");
        fetchGames();
        /* check for backup */
        if (localStorage.getItem("backup")!=null) {
            setFormCreateGameStateBackup(JSON.parse(localStorage.getItem("backup")));
            let backupGame = {};
            backupGame = JSON.parse(localStorage.getItem("backup"));
            let newObject = {};
            for (let i=0; i<backupGame.gamePlayZone.items.length; i++) {
                let key = "id-" + backupGame.gamePlayZone.items[i].id;
                let value = backupGame.gamePlayZone.items[i].gameZoneName;
                newObject = {...newObject,[key]:value};
            }
            setGamePlayZoneObjectBackup(newObject);
        }
    }, []);
    useEffect(() => {
        console.log("***useEffect***:  fetchGames() (gamesFilter)");
        fetchGames();
    }, [gamesFilter]);
    useEffect(() => {
        console.log("***useEffect***:  fetchGames() (updatedDB");
        setModalContent({
            open: false,
            content: "",
            id: "",
            action: "",
            updatedDB:false
        })
        fetchGames();
    }, [modalContent.updatedDB]);

    function setGameVisibleFunction(gameID,index,gameDesigner) {
        setGameVisible(gameID);
        setGameDesigner(gameDesigner);
        console.log("games[index].gamePlayzone.items: " + JSON.stringify(games[index].gamePlayZone.items));
        let newObject = {};
        for (let i=0; i<games[index].gamePlayZone.items.length; i++) {
            let key = "id-" + games[index].gamePlayZone.items[i].id;
            let value = games[index].gamePlayZone.items[i].gameZoneName;
            newObject = {...newObject,[key]:value};
        }
        setGamePlayZoneObject(newObject);
    }
    function handleStats(props) {
        setModalContent({
            open: true,
            content: "Stats",
            id: props.gameID,
            gameID:"",
            zoneID:"",
            action: props.gameName,
            updatedDB:false
        })
    }
    function handleGameForm(props) {
        setModalContent({
            open: true,
            content: "Game Form",
            id: props.gameID,
            gameID:"",
            zoneID:"",
            action: props.action,
            updatedDB:false
        })
    }
    function handleZoneForm(props) {
        setModalContent({
            open: true,
            content: "Zone Form",
            zone: props.zone,
            id: props.zoneID,
            gameID:props.gameID,
            zoneID:"",
            action: props.action,
            gameDesigner: gameDesigner,
            updatedDB:false
        })
    }
    function handlePuzzleForm(props) {
        console.log("zoneID (handle puzzle form): " + props.zoneID);
        if (props.action === "addPuzzle" && (props.zoneID == "select zone" || props.zoneID == "" || props.zoneID == undefined)) {
            alert("Please select zone")
        } else {
            setModalContent({
                open: true,
                content: "Puzzle Form",
                puzzle: props.puzzle,
                id: props.puzzleID,
                gameID:props.gameID,
                gamePlayZoneID:props.zoneID,
                action: props.action,
                gameDesigner: gameDesigner,
                updatedDB:false
            })
        }
    }
    function handleTextFieldForm(props) {
        if (props.action === "addTextField" && (props.puzzleID == "select puzzle" || props.puzzleID == "" || props.puzzleID == undefined)) {
            alert("Please select puzzle")
        } else {
            setModalContent({
                open: true,
                content: "TextField Form",
                textField: props.textField,
                id: props.textFieldID,
                puzzleID: props.puzzleID,
                action: props.action,
                updatedDB: false
            })
        }
    }
    function handleClueForm(props) {
        console.log("zoneID (handle clue form): " + props.zoneID);
        if (props.action === "addClue" && (props.zoneID == "select zone" || props.zoneID == "" || props.zoneID == undefined)) {
            alert("Please select zone")
        } else {
            console.log("zoneID (handle clue form): " + props.zoneID);
            setModalContent({
                open: true,
                content: "Clue Form",
                clue: props.clue,
                id: props.clueID,
                gameID: props.gameID,
                gamePlayZoneID: props.zoneID,
                action: props.action,
                gameDesigner: gameDesigner,
                updatedDB: false
            })
        }
    }
    function handleHintForm(props) {
        console.log("zoneID (handle hint form): " + props.zoneID);
        if (props.action === "addHint" && (props.zoneID == "select zone" || props.zoneID == "" || props.zoneID == undefined)) {
            alert("Please select zone")
        } else {
            setModalContent({
                open: true,
                content: "Hint Form",
                hint: props.hint,
                id: props.hintID,
                gameID: props.gameID,
                gamePlayZoneID: props.zoneID,
                action: props.action,
                updatedDB: false
            })
        }
    }
    const [backupPuzzleValue, setBackupPuzzleValue] = useState("select puzzle");
    const [backupZoneValue, setBackupZoneValue] = useState("select zone");
    const [puzzleZoneValue, setPuzzleZoneValue] = useState("select zone");
    const [clueZoneValue, setClueZoneValue] = useState("select zone")
    const [hintZoneValue, setHintZoneValue] = useState("select zone")
    const BackupPuzzleDropDown = (props) => {
        return (
            <SelectField
                className={"city-dropdown"}
                paddingTop={"3px"}
                value={backupPuzzleValue}
                onChange={(e) => setBackupPuzzleValue(e.target.value)}>
                <option value="select zone">select puzzle</option>
                {props.visibleGame.gamePuzzle.items.map((puzzle) => (
                    <option key={puzzle.id} value={puzzle.id}>{puzzle.puzzleName}</option>
                ))}
            </SelectField>)
    }
    const BackupZoneDropDown = (props) => {
        return (
            <SelectField
                className={"city-dropdown"}
                paddingTop={"3px"}
                value={backupZoneValue}
                onChange={(e) => setBackupZoneValue(e.target.value)}>
                <option value="select zone">select zone</option>
                {props.visibleGame.gamePlayZone.items.map((zone) => (
                    <option key={zone.id} value={zone.id}>{zone.gameZoneName}</option>
                ))}
            </SelectField>)
    }
    const PuzzleZoneDropDown = (props) => {
        return (
            <SelectField
            className={"city-dropdown"}
            paddingTop={"3px"}
            value={puzzleZoneValue}
            onChange={(e) => setPuzzleZoneValue(e.target.value)}>
                <option value="select zone">select zone</option>
                {props.visibleGame.gamePlayZone.items.map((zone) => (
                <option key={zone.id} value={zone.id}>{zone.gameZoneName}</option>
                ))}
            </SelectField>)
    }
    const ClueZoneDropDown = (props) => {
        return (
            <SelectField
                className={"city-dropdown"}
                paddingTop={"3px"}
                value={clueZoneValue}
                onChange={(e) => setClueZoneValue(e.target.value)}>
                <option value="select zone">select zone</option>
                {props.visibleGame.gamePlayZone.items.map((zone) => (
                    <option key={zone.id} value={zone.id}>{zone.gameZoneName}</option>
                ))}
            </SelectField>)
    }
    const HintZoneDropDown = (props) => {
        return (
            <SelectField
                className={"city-dropdown"}
                paddingTop={"3px"}
                value={hintZoneValue}
                onChange={(e) => setHintZoneValue(e.target.value)}>
                <option value="select zone">select zone</option>
                {props.visibleGame.gamePlayZone.items.map((zone) => (
                    <option key={zone.id} value={zone.id}>{zone.gameZoneName}</option>
                ))}
            </SelectField>)
    }

    return (
        <View>
            <View id="gameSection" className="show section">
                <Flex>
                    <Heading level={4} color="black">Games</Heading>
                <Button gap="0.1rem" marginBottom="1rem"  size="small" className={"blue-duke"}
                        onClick={() => handleGameForm({"gameID": "", "action": "add"})}>
                    <span style={{fontSize: "20px"}}>+</span> add new game</Button>
                    <Button gap="0.1rem" marginBottom="1rem"  size="small" className={"blue-duke"}
                            onClick={() => handleGameForm({"gameID": "", "action": "addFromFile"})}>
                        <span style={{fontSize: "20px"}}>+</span> add copy of game</Button>
                    {
                        (formCreateGameStateBackup.gameName != "New" && formCreateGameStateBackup.gameName != "") &&
                        <View paddingTop={"10px"} className={"small"}><strong>{formCreateGameStateBackup.gameName}</strong> backup is available.</View>
                    }
                </Flex>
            <Flex gap={".2rem"} >
                <Button gap="0.1rem" size="small" className={(gameType==="all")? "active":""} backgroundColor="lightgrey"
                        onClick={() => setFilterCreateGame()}>all</Button>
                <Button gap="0.1rem" size="small" className={(disabledGame === false) ? "active":""} backgroundColor="lightgrey"
                        onClick={() => setFilterCreateGame("disabled", {eq: false})}>live</Button>
                <Button gap="0.1rem" size="small" className={(disabledGame === true)? "active":""} backgroundColor="lightgrey"
                        onClick={() => setFilterCreateGame("disabled", {eq: true})}>disabled</Button>
                <Button gap="0.1rem" size="small" className={(gameType === "free")? "active":""} backgroundColor="lightgrey"
                        onClick={() => setFilterCreateGame("gameType", {eq: "free"})}>free</Button>
                <SelectField
                    className={"city-dropdown"}
                    placeholder="choose a city"
                    value={cityValue}
                    onChange={(e) => {
                        setCityValue(e.target.value),setFilterCreateGame("gameLocationCity", {eq: e.target.value})}}>
                    <option value="Tybee Island">Tybee Island</option>
                    <option value="Savannah">Savannah</option>
                </SelectField>


            </Flex>
                <Table
                    highlightOnHover={true}
                    size={"default"}
                    variation={"striped"}
                >
                    {(gameVisible === "") && <TableHead>
                    <TableRow>
                        <TableCell as="th"></TableCell>
                        <TableCell as="th">Game Name</TableCell>
                        <TableCell as="th">Type</TableCell>
                        <TableCell as="th">Place</TableCell>
                        <TableCell as="th">City</TableCell>
                        <TableCell as="th">Level</TableCell>
                        <TableCell as="th">Designer</TableCell>
                        <TableCell as="th">Live</TableCell>
                        <TableCell as="th">Actions</TableCell>

                    </TableRow>
                </TableHead>}
                    <TableBody>
                {games.map((game, index) => (
                    <TableRow key={game.id}>
                        {(gameVisible === "") &&
                        <>
                        <TableCell><Button gap="0.1rem" size="large"  className="plus-minus"  onClick={() => setGameVisibleFunction(game.id, index, game.gameDesigner)}>+</Button>
                        </TableCell>
                        <TableCell>{game.gameName}</TableCell>
                        <TableCell>{game.gameType}</TableCell>
                        <TableCell>{game.gameLocationPlace}</TableCell>
                        <TableCell>{game.gameLocationCity}</TableCell>
                        <TableCell>{game.gameLevel}</TableCell>
                        <TableCell>{game.gameDesigner}</TableCell>
                            <TableCell>{game.disabled ? "no" : "yes"}</TableCell>
                        <TableCell>

                            <Button gap="0.1rem" marginRight="10px" size="small"
                                    onClick={() => handleGameForm({"gameID": game.id, "action": "edit"})}>edit</Button>
                            <Button gap="0.1rem" size="small" onClick={() => copyGame({
                                "gameID": game.id,
                                "gameName": game.gameName
                            })}>copy</Button>
                            <Button gap="0.1rem" size="small" onClick={() => handleStats({"gameID": game.id, "gameName": game.gameName})}>stats</Button>


                            {/*<Button gap="0.1rem" size="small" color="red" onClick={() => deleteGame({"gameID": game.id})}>
                                x
                            </Button>*/}

                        </TableCell>

                        </>}

                    {(gameVisible == game.id) &&
                        <TableCell colSpan={9} className={"border1"}>
                            <Flex  direction="row"
                                   justifyContent="flex-start"
                                   marginBottom={"30px"}
                                   gap={".1rem"}
                                   className={"game-detail-row"}>
                                <Button gap="0.1rem" size="small" className="plus-minus" onClick={() => setGameVisible("")}>-</Button>
                                <Heading level={5} color="black" marginRight={"1rem"}>

                                    {game.gameName}:  </Heading>
                                <Button gap="0.1rem" marginRight="10px" size="small"
                                        onClick={() => handleGameForm({"gameID": game.id, "action": "edit"})}>edit</Button>
                                <Button gap="0.1rem" size="small" onClick={() => copyGame({
                                    "gameID": game.id,
                                    "gameName": game.gameName
                                })}>copy</Button>
                                <Button gap="0.1rem" size="small" onClick={() => handleStats({"gameID": game.id, "gameName": game.gameName})}>stats</Button>

                                {/* <Button gap="0.1rem" size="small" color="red" onClick={() => deleteGame({"gameID": game.id})}>
                                    x
                                </Button>*/}

                            </Flex>
                            <Table
                                highlightOnHover={true}
                                size={"default"}
                                variation={"striped"}
                            >
                                <TableHead>
                                    <TableRow>
                                        <TableCell as="th">Name</TableCell>
                                        <TableCell as="th">Type</TableCell>
                                        <TableCell as="th">Place</TableCell>
                                        <TableCell as="th">City</TableCell>
                                        <TableCell as="th">Level</TableCell>
                                        <TableCell as="th">Live</TableCell>
                                        <TableCell as="th">Designer</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                            <TableRow>
                                <TableCell><strong>{game.gameName}</strong> | {game.id}</TableCell>
                                <TableCell>{game.gameType}</TableCell>
                                <TableCell>{game.gameLocationPlace}</TableCell>
                                <TableCell>{game.gameLocationCity}</TableCell>
                                <TableCell>{game.gameLevel}</TableCell>
                                <TableCell>{game.disabled ? "No" : "Yes"}</TableCell>
                                <TableCell>{game.gameDesigner}  </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell colSpan={2}><strong>Description</strong>:<br /> {game.gameDescriptionH2} </TableCell>
                                <TableCell><strong>Goals</strong>:<br /> {game.gameGoals} </TableCell>
                                <TableCell><strong>Summary</strong>:<br /> {game.gameDescriptionP} </TableCell>
                                <TableCell><strong>Walking Distance</strong>: <br />{game.walkingDistance} </TableCell>
                                <TableCell><strong>Logistic Information</strong>: <br /> {game.gameDescriptionH2}  </TableCell>
                                <TableCell><strong>Win Message: </strong>: <br />{game.gameWinMessage} </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell colSpan={7}>
                                    <Flex>
                                        <Heading level={4} color="black">Zones</Heading>
                                        <Button gap="0.1rem" marginBottom="1rem"  size="small" className={"blue-duke"}
                                                onClick={() => handleZoneForm({"gameID": game.id, "zoneID": "", "action": "add"})}>
                                            <span style={{fontSize: "20px"}}>+</span> add zone</Button>

                                    </Flex>
                                    {
                                        (formCreateGameStateBackup.gameName != "New" && formCreateGameStateBackup.gamePlayZone.items.length > 0) &&
                                        <Button  onClick={() => setZoneBackup(!zoneBackup)}>
                                            {(zoneBackup)? "these are backup zones, show zones already backed up" : "these are live zones, show zones available for backup"}</Button>
                                    }
                                    {zoneBackup?
                                        (<Table
                                        highlightOnHover={true}
                                        size={"default"}
                                        variation={"bordered"}
                                        className={"zone"}
                                    >
                                        <TableHead>
                                            <TableRow>
                                                <TableCell as="th">Name</TableCell>
                                                <TableCell as="th">Ord</TableCell>
                                                <TableCell as="th">Lat</TableCell>
                                                <TableCell as="th">Long</TableCell>
                                                <TableCell as="th">Image</TableCell>
                                                <TableCell as="th">Description</TableCell>
                                                <TableCell as="th">Disabled</TableCell>
                                                <TableCell as="th">Actions</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                        {formCreateGameStateBackup.gamePlayZone.items.map((zone) => (
                                            <TableRow key={zone.id}>
                                                <TableCell> {zone.gameZoneName}</TableCell>
                                                <TableCell> {zone.order}</TableCell>
                                                <TableCell> {zone.latitude}</TableCell>
                                                <TableCell> {zone.longitude}</TableCell>
                                                <TableCell><Image width={"50px"} src={zone.gameZoneImage}/></TableCell>
                                                <TableCell> {zone.gameZoneDescription}</TableCell>
                                                <TableCell>  {zone.disabled ? "true" : "false"} </TableCell>
                                                <TableCell>
                                                    <Button gap="0.1rem" marginBottom="1rem"  size="small" className={"blue-duke"}
                                                            onClick={() => handleZoneForm({"gameID": game.id, "zoneID": "", "zone":zone, "action": "addZone"})}>
                                                        <span style={{fontSize: "20px"}}>+</span> add backup zone</Button>

                                                </TableCell>


                                            </TableRow>
                                        ))}{/* gamePlayZone */}
                                        </TableBody>
                                    </Table>):
                                        (<Table
                                            highlightOnHover={true}
                                            size={"default"}
                                            variation={"bordered"}
                                            className={"zone"}
                                        >
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell as="th">Name</TableCell>
                                                    <TableCell as="th">Ord</TableCell>
                                                    <TableCell as="th">Lat</TableCell>
                                                    <TableCell as="th">Long</TableCell>
                                                    <TableCell as="th">Image</TableCell>
                                                    <TableCell as="th">Description</TableCell>
                                                    <TableCell as="th">Disabled</TableCell>
                                                    <TableCell as="th">Actions</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {game.gamePlayZone.items.map((zone) => (
                                                    <TableRow key={zone.id}>
                                                        <TableCell> {zone.gameZoneName}</TableCell>
                                                        <TableCell> {zone.order}</TableCell>
                                                        <TableCell> {zone.latitude}</TableCell>
                                                        <TableCell> {zone.longitude}</TableCell>
                                                        <TableCell><Image width={"50px"} src={zone.gameZoneImage}/></TableCell>
                                                        <TableCell> {zone.gameZoneDescription}</TableCell>
                                                        <TableCell>  {zone.disabled ? "true" : "false"} </TableCell>
                                                        <TableCell>
                                                            <Button gap="0.1rem" size="small"
                                                                    onClick={() => handleZoneForm({"zoneID": zone.id, "action": "edit"})}>edit</Button>
                                                            <Button gap="0.1rem" size="small"
                                                                    onClick={() => handlePuzzleForm({"puzzleID": "", "gameID": game.id, "zoneID": zone.id, "action": "add"})}>
                                                                <span style={{fontSize: "12px"}}>+</span> puzzle</Button>
                                                            <Button  gap="0.1rem" size="small"
                                                                     onClick={() => handleHintForm({"hintID": "", "gameID": game.id, "zoneID": zone.id, "action": "add"})}>
                                                                <span style={{fontSize: "12px"}}>+</span> hint</Button>
                                                            <Button  gap="0.1rem" size="small"
                                                                     onClick={() => handleClueForm({"clueID": "", "gameID": game.id, "zoneID": zone.id, "action": "add"})}>
                                                                <span style={{fontSize: "12px"}}>+</span> clue</Button>
                                                            <Button  gap="0.1rem" size="small" color={"red"}
                                                                     onClick={() => deleteZone({"zoneID": zone.id})}>x</Button>
                                                        </TableCell>


                                                    </TableRow>
                                                ))}{/* gamePlayZone */}
                                            </TableBody>
                                        </Table>)}


                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell colSpan={7}>
                                    <Flex>
                                        <Heading level={4} color="black">Puzzles</Heading>
                                        {!puzzleBackup && <PuzzleZoneDropDown visibleGame={game}/>}
                                    </Flex>
                                    {
                                        (formCreateGameStateBackup.gameName != "New" && formCreateGameStateBackup.gamePuzzle.items.length > 0) &&
                                        <Button  onClick={() => setPuzzleBackup(!puzzleBackup)}>
                                            {(puzzleBackup)? "these are backup puzzles, show puzzles already backed up" : "these are live puzzles, show puzzles available for backup"}</Button>
                                    }
                                    {puzzleBackup ?
                                        (<>
                                            {formCreateGameStateBackup.gamePuzzle.items.map((puzzle) => (
                                                <View className={"border1"} key={puzzle.id}>
                                                    <Table
                                                        highlightOnHover={true}
                                                        size={"default"}
                                                        variation={"bordered"}
                                                        key={puzzle.id}
                                                        className={(puzzleZoneValue != puzzle.gamePlayZoneID) && puzzleZoneValue != "select zone" ? "hide" : "puzzle"}
                                                    >
                                                        <TableHead>
                                                            <TableRow>
                                                                <TableCell as="th">Name</TableCell>
                                                                <TableCell as="th">Order</TableCell>
                                                                <TableCell as="th">PlayZone</TableCell>
                                                                <TableCell as="th">Clue Text Revealed</TableCell>
                                                                <TableCell as="th">Clue Image Revealed</TableCell>
                                                                <TableCell as="th">WinGame</TableCell>
                                                                <TableCell as="th">Disabled</TableCell>
                                                                <TableCell as="th">Actions</TableCell>
                                                            </TableRow>
                                                        </TableHead>
                                                        <TableBody>
                                                            <TableRow key={puzzle.id}>
                                                                <TableCell>{puzzle.puzzleName}</TableCell>
                                                                <TableCell>{puzzle.order}</TableCell>
                                                                <TableCell>{gamePlayZoneObjectBackup[("id-" + puzzle.gamePlayZoneID)]}</TableCell>
                                                                <TableCell>{puzzle.puzzleClueText}</TableCell>
                                                                <TableCell>
                                                                    <Image width={"50px"}
                                                                           src={puzzle.puzzleClueRevealed}/></TableCell>
                                                                <TableCell>{puzzle.winGame ? "true" : "false"}</TableCell>
                                                                <TableCell>{puzzle.disabled ? "true" : "false"}</TableCell>
                                                                <TableCell>
                                                                    <Button gap="0.1rem" size="small"
                                                                            onClick={() => handlePuzzleForm({
                                                                                "puzzleID": "",
                                                                                "puzzle": puzzle,
                                                                                "gameID": game.id,
                                                                                "zoneID": backupZoneValue,
                                                                                "action": "addPuzzle"
                                                                            })}>add backup puzzle</Button>
                                                                    <BackupZoneDropDown visibleGame={game}/>


                                                                </TableCell>
                                                            </TableRow>
                                                            <TableRow>
                                                                <TableCell colSpan={8}>
                                                                    <Flex>
                                                                        <Heading level={6} color="black"
                                                                                 paddingTop={"5px"}>TextFields</Heading>
                                                                    </Flex>
                                                                    <Table
                                                                        highlightOnHover={true}
                                                                        size={"default"}
                                                                        variation={"bordered"}
                                                                        className={"textfield"}
                                                                    >
                                                                        <TableHead>
                                                                            <TableRow>
                                                                                <TableCell as="th">Name</TableCell>
                                                                                <TableCell as="th">Order</TableCell>
                                                                                <TableCell as="th">Label</TableCell>
                                                                                <TableCell as="th">Answer</TableCell>
                                                                                <TableCell as="th">Disabled</TableCell>
                                                                                <TableCell as="th">Actions</TableCell>
                                                                            </TableRow>
                                                                        </TableHead>
                                                                        <TableBody>
                                                                            {puzzle.textField.items.map((textField) => (
                                                                                <TableRow key={textField.id}>
                                                                                    <TableCell>{textField.name}</TableCell>
                                                                                    <TableCell> {textField.order}</TableCell>
                                                                                    <TableCell> {textField.label}</TableCell>
                                                                                    <TableCell>{textField.answer}</TableCell>
                                                                                    <TableCell>{textField.disabled ? "true" : "false"}</TableCell>
                                                                                    <TableCell>
                                                                                        <Flex>
                                                                                            <Button gap="0.1rem" marginBottom="0"
                                                                                                    size="small" className={"blue-duke"}
                                                                                                    onClick={() => handleTextFieldForm({
                                                                                                        "puzzleID": backupPuzzleValue,
                                                                                                        "textField": textField,
                                                                                                        "action": "addTextField"
                                                                                                    })}><span style={{fontSize: "20px"}}>+</span> add backup textfield</Button>
                                                                                            <BackupPuzzleDropDown visibleGame={game}/>
                                                                                        </Flex>
                                                                                    </TableCell>
                                                                                </TableRow>

                                                                            ))}{/* textField */}
                                                                        </TableBody>
                                                                    </Table>
                                                                </TableCell>
                                                            </TableRow>
                                                        </TableBody>
                                                    </Table>
                                                </View>
                                            ))}{/* gamePuzzle */}</>) :
                                        (<>{game.gamePuzzle.items.map((puzzle) => (
                                            <View className={"border1"} key={puzzle.id}>
                                                <Table
                                                    highlightOnHover={true}
                                                    size={"default"}
                                                    variation={"bordered"}
                                                    key={puzzle.id}
                                                    className={(puzzleZoneValue != puzzle.gamePlayZoneID) && puzzleZoneValue != "select zone" ? "hide" : "puzzle"}
                                                >
                                                    <TableHead>
                                                        <TableRow>
                                                            <TableCell as="th">Name</TableCell>
                                                            <TableCell as="th">Order</TableCell>
                                                            <TableCell as="th">PlayZone</TableCell>
                                                            <TableCell as="th">Clue Text Revealed</TableCell>
                                                            <TableCell as="th">Clue Image Revealed</TableCell>
                                                            <TableCell as="th">WinGame</TableCell>
                                                            <TableCell as="th">Disabled</TableCell>
                                                            <TableCell as="th">Actions</TableCell>
                                                        </TableRow>
                                                    </TableHead>
                                                    <TableBody>
                                                        <TableRow key={puzzle.id}>
                                                            <TableCell>{puzzle.puzzleName}</TableCell>
                                                            <TableCell>{puzzle.order}</TableCell>
                                                            <TableCell>{gamePlayZoneObject[("id-" + puzzle.gamePlayZoneID)]}</TableCell>
                                                            <TableCell>{puzzle.puzzleClueText}</TableCell>
                                                            <TableCell>
                                                                <Image width={"50px"}
                                                                       src={puzzle.puzzleClueRevealed}/></TableCell>
                                                            <TableCell>{puzzle.winGame ? "true" : "false"}</TableCell>
                                                            <TableCell>{puzzle.disabled ? "true" : "false"}</TableCell>
                                                            <TableCell>
                                                                <Button gap="0.1rem" size="small"
                                                                        onClick={() => handlePuzzleForm({
                                                                            "puzzleID": puzzle.id,
                                                                            "gameID": game.id,
                                                                            "zoneID": puzzle.gamePlayZoneID,
                                                                            "action": "edit"
                                                                        })}>edit</Button>
                                                                <Button gap="0.1rem" size="small" color={"red"}
                                                                        onClick={() => deletePuzzle({"puzzleID": puzzle.id})}>x</Button>

                                                            </TableCell>
                                                        </TableRow>
                                                        <TableRow>
                                                            <TableCell colSpan={7}>
                                                                <Flex>
                                                                    <Heading level={6} color="black"
                                                                             paddingTop={"5px"}>TextFields</Heading>
                                                                    <Button gap="0.1rem" marginBottom="1rem"
                                                                            size="small" className={"blue-duke"}
                                                                            onClick={() => handleTextFieldForm({
                                                                                "puzzleID": puzzle.id,
                                                                                "action": "add"
                                                                            })}>
                                                                            <span
                                                                                style={{fontSize: "20px"}}>+</span> add
                                                                        textfield</Button>
                                                                </Flex>
                                                                <Table
                                                                    highlightOnHover={true}
                                                                    size={"default"}
                                                                    variation={"bordered"}
                                                                    className={"textfield"}
                                                                >
                                                                    <TableHead>
                                                                        <TableRow>
                                                                            <TableCell as="th">Name</TableCell>
                                                                            <TableCell as="th">Order</TableCell>
                                                                            <TableCell as="th">Label</TableCell>
                                                                            <TableCell as="th">Answer</TableCell>
                                                                            <TableCell as="th">Disabled</TableCell>
                                                                            <TableCell as="th">Actions</TableCell>
                                                                        </TableRow>
                                                                    </TableHead>
                                                                    <TableBody>
                                                                        {puzzle.textField.items.map((textField) => (
                                                                            <TableRow key={textField.id}>
                                                                                <TableCell>{textField.name}</TableCell>
                                                                                <TableCell> {textField.order}</TableCell>
                                                                                <TableCell> {textField.label}</TableCell>
                                                                                <TableCell>{textField.answer}</TableCell>
                                                                                <TableCell>{textField.disabled ? "true" : "false"}</TableCell>
                                                                                <TableCell>
                                                                                    <>
                                                                                        <Button gap="0.1rem"
                                                                                                size="small"
                                                                                                onClick={() => handleTextFieldForm({
                                                                                                    "textFieldID": textField.id,
                                                                                                    "action": "edit"
                                                                                                })}>edit</Button>
                                                                                        <Button gap="0.1rem"
                                                                                                size="small"
                                                                                                color={"red"}
                                                                                                onClick={() => deleteTextField({"textFieldID": textField.id})}>x</Button>
                                                                                    </>
                                                                                </TableCell>
                                                                            </TableRow>

                                                                        ))}{/* textField */}
                                                                    </TableBody>
                                                                </Table>
                                                            </TableCell>
                                                        </TableRow>
                                                    </TableBody>
                                                </Table>
                                            </View>
                                        ))}{/* gamePuzzle */}</>)
                                    }
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell colSpan={7}>
                                <Flex>
                                <Heading level={4} color="black" >Clues</Heading><ClueZoneDropDown visibleGame={game}/>
                                </Flex>
                                {
                                    (formCreateGameStateBackup.gameName != "New" && formCreateGameStateBackup.gameClue.items.length > 0) &&
                                    <Button  onClick={() => setClueBackup(!clueBackup)}>
                                        {(clueBackup)? "these are backup clues, show clues already backed up" : "these are live clues, show clues available for backup"}</Button>
                                }
                                <Table
                                    highlightOnHover={true}
                                    size={"default"}
                                    variation={"bordered"}

                                >
                                <TableHead>
                                        <TableRow>
                                            <TableCell as="th">Name</TableCell>
                                            <TableCell as="th">Zone</TableCell>
                                            <TableCell as="th">Text</TableCell>
                                            <TableCell as="th">Icon</TableCell>
                                            <TableCell as="th">Image</TableCell>
                                            <TableCell as="th">Disabled</TableCell>
                                            <TableCell as="th">Actions</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    {(clueBackup) ?
                                        (
                                            <TableBody>

                                {formCreateGameStateBackup.gameClue.items.map((clue) => (
                                    <TableRow key={clue.id} className={(clueZoneValue != clue.gamePlayZoneID) && clueZoneValue != "select zone"? "hide":"clue"}>
                                        <TableCell>{clue.gameClueName}{backupIDArray.includes(clue.id) && <span className={"small"}> backed up</span>}</TableCell>
                                        <TableCell>{gamePlayZoneObjectBackup[("id-" + clue.gamePlayZoneID)]}</TableCell>
                                        <TableCell>{clue.gameClueText} </TableCell>
                                        <TableCell>{clue.gameClueIcon} </TableCell>
                                        <TableCell><Image width={"50px"} src={clue.gameClueImage}/></TableCell>
                                        <TableCell>{clue.disabled ? "true" : "false"}</TableCell>
                                        <TableCell>
                                            <Button gap="0.1rem" size="small"
                                                    onClick={() => handleClueForm({
                                                        "clueID": "",
                                                        "clue": clue,
                                                        "gameID": game.id,
                                                        "zoneID": backupZoneValue,
                                                        "action": "addClue"
                                                    })}>add backup clue</Button>
                                            <BackupZoneDropDown visibleGame={game}/>

                                        </TableCell>
                                    </TableRow>
                                ))}{/* gameClue */}
                                    </TableBody>) :
                                        ( <TableBody>

                                    {game.gameClue.items.map((clue) => (
                                        <TableRow key={clue.id} className={(clueZoneValue != clue.gamePlayZoneID) && clueZoneValue != "select zone"? "hide":"clue"}>
                                        <TableCell>{clue.gameClueName}</TableCell>
                                        <TableCell>{gamePlayZoneObject[("id-" + clue.gamePlayZoneID)]}</TableCell>
                                        <TableCell>{clue.gameClueText} </TableCell>
                                        <TableCell>{clue.gameClueIcon} </TableCell>
                                        <TableCell><Image width={"50px"} src={clue.gameClueImage}/></TableCell>
                                        <TableCell>{clue.disabled ? "true" : "false"}</TableCell>
                                        <TableCell>
                                        <Button gap="0.1rem" size="small"
                                        onClick={() => handleClueForm({"clueID": clue.id, "gameID": game.id, "zoneID": clue.gamePlayZoneID, "action": "edit"})}>edit</Button>
                                        <Button gap="0.1rem" size="small" color={"red"}
                                        onClick={() => deleteClue({"clueID": clue.id})}>x</Button>

                                        </TableCell>
                                        </TableRow>
                                        ))}{/* gameClue */}
                                        </TableBody>)}



                                </Table>
                            </TableCell>
                        </TableRow>
                                <TableRow>
                                    <TableCell colSpan={7}>
                                        <Flex>
                                            <Heading level={4} color="black" >Hints</Heading><HintZoneDropDown visibleGame={game}/>
                                        </Flex>
                                        {
                                            (formCreateGameStateBackup.gameName != "New" && formCreateGameStateBackup.gameHint.items.length > 0) &&
                                            <Button  onClick={() => setHintBackup(!hintBackup)}>
                                                {(hintBackup)? "these are backup hints, show hints already backed up" : "these are live hints, show hints available for backup"}</Button>
                                        }
                                        <Table
                                            highlightOnHover={true}
                                            size={"default"}
                                            variation={"bordered"}
                                            className={"zone"}
                                        >
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell as="th">Name</TableCell>
                                                    <TableCell as="th">Order</TableCell>
                                                    <TableCell as="th">Zone</TableCell>
                                                    <TableCell as="th">Description</TableCell>
                                                    <TableCell as="th">Disabled</TableCell>
                                                    <TableCell as="th">Actions</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            {(hintBackup) ?
                                                (
                                            <TableBody>
                                {formCreateGameStateBackup.gameHint.items.map((hint) => (
                                        <TableRow key={hint.id} className={(hintZoneValue != hint.gamePlayZoneID) && hintZoneValue != "select zone"? "hide":"clue"}>
                                            <TableCell>{hint.gameHintName}{backupIDArray.includes(hint.id) && <span className={"small"}> backed up</span>}</TableCell>
                                            <TableCell>{hint.order}</TableCell>
                                            <TableCell>{gamePlayZoneObjectBackup[("id-" + hint.gamePlayZoneID)]}</TableCell>
                                            <TableCell>{hint.gameHintDescription}</TableCell>
                                            <TableCell>{hint.disabled ? "true" : "false"}</TableCell>
                                            <TableCell>
                                                <Button gap="0.1rem" size="small"
                                                        onClick={() => handleHintForm({
                                                            "hintID": "",
                                                            "hint": hint,
                                                            "gameID": game.id,
                                                            "zoneID": backupZoneValue,
                                                            "action": "addHint"})}>add backup hint</Button>

                                                <BackupZoneDropDown visibleGame={game}/>
                                            </TableCell>
                                        </TableRow>
                                ))}{/* gameHint */}
                                            </TableBody>):(
                                                    <TableBody>
                                                        {game.gameHint.items.map((hint) => (
                                                            <TableRow key={hint.id} className={(hintZoneValue != hint.gamePlayZoneID) && hintZoneValue != "select zone"? "hide":"clue"}>
                                                                <TableCell>{hint.gameHintName}</TableCell>
                                                                <TableCell>{hint.order}</TableCell>
                                                                <TableCell>{gamePlayZoneObject[("id-" + hint.gamePlayZoneID)]}</TableCell>
                                                                <TableCell>{hint.gameHintDescription}</TableCell>
                                                                <TableCell>{hint.disabled ? "true" : "false"}</TableCell>
                                                                <TableCell>
                                                                    <Button gap="0.1rem" size="small"
                                                                            onClick={() => handleHintForm({"hintID": hint.id, "gameID": game.id, "zoneID": hint.gamePlayZoneID, "action": "edit"})}>edit</Button>
                                                                    <Button gap="0.1rem" size="small" color={"red"}
                                                                            onClick={() => deleteHint({"hintID": hint.id})}>x</Button>
                                                                </TableCell>
                                                            </TableRow>
                                                        ))}{/* gameHint */}
                                                    </TableBody>
                                                )}
                                        </Table>
                            </TableCell>
                        </TableRow>
                                </TableBody>
                            </Table>
                            <Flex  direction="row"
                                   justifyContent="center"
                                   marginBottom={"30px"}
                                   gap={".1rem"}
                                   className={"game-detail-row"}>
                                <Heading level={5} color="black" marginRight={"1rem"}>End Game Detail: {game.gameName}:  </Heading>
                                <Button gap="0.1rem" size="small"
                                        onClick={() => showGameStats({
                                            "gameID": game.id,
                                            "gameName": game.gameName
                                        })}>stats</Button>
                                <Button gap="0.1rem" size="small"
                                        onClick={() => handleGameForm({"gameID": game.id, "action": "edit"})}>edit</Button>
                                <Button gap="0.1rem" size="small" onClick={() => copyGame({
                                    "gameID": game.id,
                                    "gameName": game.gameName
                                })}>copy</Button>
                                <Button gap="0.1rem" size="small" onClick={() => setGameVisible("")}>close</Button>
                                <Button gap="0.1rem" size="small" color="red" onClick={() => deleteGame({"gameID": game.id})}>
                                    x
                                </Button>

                           </Flex>
                        </TableCell>

                    }{/* gameVisible == game.id */}
                    </TableRow>
                ))}{/* games */}
                   </TableBody>
                </Table>
            </View>
            <View className={backupsVisible ? "overlay" : "hide"}>
                <View className="popup">
                    backups:

                    <Flex direction="row" justifyContent="center" marginTop="20px">
                        <Button className="show" onClick={() => setBackupsVisible(false)}
                                variation="primary">
                            Close
                        </Button>

                    </Flex>
                </View>
            </View>
            <hr />
            {/* not sure what to do with this yet */}
            <Button marginRight="5px"
                    onClick={() => divShowHide("clueSection")}>{showHideLabel.clueSection} Backup Section</Button>

            <View id={"clueSection"} className={"hide section"}>
                <Heading
                    width='30vw'
                    level={6}
                    marginTop={"1rem"}
                >Backup Section</Heading>
                (<Button className={"show-button blue-duke small"}
                         onClick={() => addGameFromFile()}>add game from file (paste text)</Button>)
                <br/>
                <Button className={"show-button blue-duke"}
                        onClick={() => handleGameFormBackup({"action":"add"})}>Game Form Backup</Button>
                <View>type: "game"</View>
                {(gameType) ? (<View>gameType: {gameType}</View>) : null}
                {(disabledGame === true) ? (<View>disabled: true</View>) : null}
                {(disabledGame === false) ? (<View>disabled: false</View>) : null}
            </View>


        </View>)
}