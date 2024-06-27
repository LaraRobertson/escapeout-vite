import React, {useEffect, useState} from "react"
import {
    Button,
    View,
    Image,
    TextAreaField,
    TextField,
    Flex,
    Heading,
    Radio,
    RadioGroupField,
    Icon,
    ToggleButton,
    ToggleButtonGroup,
    Accordion, Link
} from '@aws-amplify/ui-react';
import { useNavigate } from "react-router-dom";
import DOMPurify from "dompurify";
import {
    toggleNotes,
    leaveComment,
    setGameNotesFunction,
    setGameTimeFunction,
    goHomeQuit, removeLocalStorage, setCommentsFunction, goHome,
} from "./helper";
import { format } from 'date-fns'
import {shallowEqual} from "./ShallowEqual";
import {ToolObject, NotesOpen, CommentWindow, Modal2, Modal3} from "./sharedComponents";
import {gameScoreByGameStatsID, getGame} from "../graphql/queries";
import {generateClient} from "aws-amplify/api";
import * as mutations from "../graphql/mutations";
import {updateGameScore} from "../graphql/mutations";
import {createPortal} from "react-dom";
import Modal from "react-modal";

export function GameV3() {
    const client = generateClient();
    /* for all games */
    const [isChecked, setIsChecked] = useState(true);
    const [isPressed1, setIsPressed1] = useState(false);
    const [isPressed2, setIsPressed2] = useState(false);
    const [isPressed3, setIsPressed3] = useState(false);
    const [multipleValue, setMultipleValue] = useState('')
    const [exclusiveValue1, setExclusiveValue1] = useState('');
    const [exclusiveValue2, setExclusiveValue2] = useState('');
    const [exclusiveValue3, setExclusiveValue3] = useState('');
    const [exclusiveValue4, setExclusiveValue4] = useState('');
    const [exclusiveValue5, setExclusiveValue5] = useState('');
    const [lightDark, setLightDark] = useState("");
    const [game, setGame] = useState([]);
    const [gameHint, setGameHint] = useState([]);
    const [gameHintVisible, setGameHintVisible] = useState({});
    const [gameHintUsed, setGameHintUsed] = useState({});
    const [playZone, setPlayZone] = useState([]);
    const [zoneVisible, setZoneVisible] = useState("");
    const [zoneName, setZoneName] = useState("");
    const [clues, setClues] = useState("");
    const [gameClueVisible, setGameClueVisible] = useState({});
    const [gamePuzzleImageOpen, setGamePuzzleImageOpen] = useState({});
    const [gamePuzzleVisible, setGamePuzzleVisible] = useState({});
    const [gamePuzzleClueVisible, setGamePuzzleClueVisible] = useState({});
    const [gameClues, setGameClues] = useState([]);
    const [gamePuzzles, setGamePuzzles] = useState([]);
    /* guesses and answers */
    const [gamePuzzleGuess, setGamePuzzleGuess] = useState({});
    const [gamePuzzleAnswer, setGamePuzzleAnswer] = useState({});
    const [gamePuzzleAnswerCorrect, setGamePuzzleAnswerCorrect] = useState({});
    const [gamePuzzleSolved, setGamePuzzleSolved] = useState({});
    const [tool, setTool] = useState(ToolObject);
    const [toolVisible, setToolVisible] = useState({});
    const [backpackObject, setBackpackObject] = useState({});
    const [isGoHomeQuitVisible, setIsGoHomeQuitVisible] = useState(false);
    /* new above */
    const [isAlertVisible, setIsAlertVisible] = useState(false);
    const [isWinnerScreenVisible, setIsWinnerScreenVisible] = useState(false);
    const [isCommentScreenVisible, setIsCommentScreenVisible] = useState(false);
    const [alertText, setAlertText] = useState('');
    const [showComment, setShowComment] = useState(false);
    const [areNotesVisible, setAreNotesVisible] = useState(true);
    const [isHelpVisible, setIsHelpVisible] = useState(false);
    const [gameNotes,setGameNotes] = useState('');
    const [isMapVisible, setIsMapVisible] = useState(false);
    const [gameComments,setGameComments] = useState({});
    const [isBackpackVisible, setIsBackpackVisible] = useState(false);
    const [gameTime, setGameTime] = useState(0);
    const [gameTimeHint, setGameTimeHint] = useState(0);
    const [gameTimeTotal, setGameTimeTotal] = useState(0);
    const [gameStatsID, setGameStatsID] = useState('');
    const [gameScoreID, setGameScoreID] = useState('');
    const [gameID, setGameID] = useState('');
    const [numberOfTimes, setNumberOfTimes] = useState(0);
    const [gameComplete, setGameComplete] = useState(false);
    const [stopClock, setStopClock] = useState(true);
    const [realTimeStart, setRealTimeStart] = useState();
    const [numberOfPlayers, setNumberOfPlayers] = useState('');
    const [numberOfPlayersError, setNumberOfPlayersError] = useState('');
    const [teamName, setTeamName] = useState('');
    /*****/

    const navigate = useNavigate();
    /* get gamestats and set localstorage */
    async function setGamePlayFunction() {
        console.log("setGamePlayFunction - only on mount");
        //* check if already playing */
        console.log ("localStorage.getItem('gameTime'): " + localStorage.getItem('gameTime'));
        console.log ("gameTime: " + gameTime);

        if (localStorage.getItem("realTimeStart")) {
            /* have already started game - user refreshed (or something) and wants to continue */
            setStopClock(false);
            setIsAlertVisible(true);
            setAlertText('resuming game');
            setTimeout(() => {
                setIsAlertVisible(false);
            }, 3000);
            setGameNotes(localStorage.getItem("gameNotes"));
            //setClues(localStorage.getItem("clues"));
            setRealTimeStart(localStorage.getItem("realTimeStart"));
            setTeamName(localStorage.getItem("teamName"));
            setGameScoreID(localStorage.getItem("gameScoreID"));
            if (localStorage.getItem("gameTimeHint")!=null) {
                setGameTimeHint(Number(localStorage.getItem('gameTimeHint')));
            }
            if (localStorage.getItem("gameHintVisible")!=null) {
                setGameHintVisible(JSON.parse(localStorage.getItem("gameHintVisible")));
            }
            if (localStorage.getItem("gamePuzzleSolved")!=null) {
                /* check for all puzzles solved, need to do wingame? */
                setGamePuzzleSolved(JSON.parse(localStorage.getItem("gamePuzzleSolved")));
            }
            if (localStorage.getItem("gamePuzzleGuess")!=null) {
                /* check for all puzzles solved, need to do wingame? */
                setGamePuzzleGuess(JSON.parse(localStorage.getItem("gamePuzzleGuess")));
            }
            /* if there */
            if (localStorage.getItem("backpackObject")!=null) {
                setBackpackObject(JSON.parse(localStorage.getItem("backpackObject")));
            }
            /* get game details */
            try {
                const apiData = await client.graphql({
                    query: getGame,
                    variables: {id: localStorage.getItem("gameID")}
                });
                const gamesFromAPI = apiData.data.getGame;
                setGame(gamesFromAPI);
                console.log("getGameDetails resuming: " + gamesFromAPI.gameName);
                /* already playing - need to make this a function... */
                //should probably set everything in localstorage...
                //encrypt answers?
                /* set up Play Zones: */
                if (gamesFromAPI.gamePlayZone.items.length > 0) {
                    let gameZoneArray = gamesFromAPI.gamePlayZone.items.sort((a, b) => {
                        return a.order - b.order;
                    });
                    setPlayZone(gameZoneArray);
                    setZoneVisibleFunction(gameZoneArray[0].id, gameZoneArray[0].gameZoneName);
                    console.log("gamesFromAPI.gamePlayZone.items.length: " + gamesFromAPI.gamePlayZone.items.length);
                }
                /* set up game hints: */
                if (gamesFromAPI.gameHint.items.length > 0) {

                    let gameHintArray = gamesFromAPI.gameHint.items.sort((a, b) => {
                        return a.order - b.order;
                    });
                    setGameHint(gameHintArray);
                    console.log("gamesFromAPI.gameHint.items.length: " + gamesFromAPI.gameHint.items.length);
                }
                /* set up game clues: */
                if (gamesFromAPI.gameClue.items.length > 0) {
                    /* filter by position */
                    let gameClueArray = gamesFromAPI.gameClue.items.sort((a, b) => {
                        return a.order - b.order;
                    });
                    setGameClues(gameClueArray);
                    console.log("gameClueArray: " + gameClueArray);
                }
                /* set up game Puzzle: */
                console.log("gamePuzzle.length: "  + gamesFromAPI.gamePuzzle.items.length);
                if (gamesFromAPI.gamePuzzle.items.length > 0) {
                    console.log("setGamePuzzles: " + JSON.stringify(gamesFromAPI.gamePuzzle.items));
                    /* filter by position */
                    let gamePuzzleArray = gamesFromAPI.gamePuzzle.items.sort((a, b) => {
                            return a.order - b.order;
                        });
                    setGamePuzzles(gamePuzzleArray);

                }
            } catch (err) {
                console.log('error fetching getGame', err);
            }
            /* end check */
        } else {
            console.log("loading game: get GameID: " + localStorage.getItem("gameID"));
            console.log("loading game: get GameStatsID: " + localStorage.getItem("gameStatsID"));
            /* why need numberoftimes here?*/
            //setNumberOfTimes(localStorage.getItem("numberOfTimes"));
            /* get gamescoreid */
            let filter = {
                gameID: {
                    eq: localStorage.getItem("gameID")
                },
                gameTotalTime: {
                    eq: 0
                },
                gameHintTime: {
                    eq: 0
                },
                completed: {
                    eq: false
                },
                disabled: {
                    eq: false
                }
            };
            try {
                const apiGameScore = await client.graphql({
                    query: gameScoreByGameStatsID,
                    variables: {filter: filter, sortDirection: "DESC", gameStatsID: localStorage.getItem("gameStatsID")}
                });
                const gamesScoreID = apiGameScore.data.gameScoreByGameStatsID.items[0];
                localStorage.setItem("gameScoreID",gamesScoreID.id);
            } catch (err) {
                console.log('error createGameScore..', err)
            }
            setGameID(localStorage.getItem("gameID"));
            setGameStatsID(localStorage.getItem("gameStatsID"));
            setGameScoreID(localStorage.getItem("gameScoreID"));
            setStopClock(false);
            let startDate = new Date();
            setRealTimeStart(startDate);
            localStorage.setItem("realTimeStart",startDate);
            /* get game details */
            try {
                const apiData = await client.graphql({
                    query: getGame,
                    variables: {id: localStorage.getItem("gameID")}
                });
                const gamesFromAPI = apiData.data.getGame;
                setGame(gamesFromAPI);
                console.log("getGameDetails initial: " + gamesFromAPI.gameName);
                /* first time */
                /* set up Play Zones: */
                if (gamesFromAPI.gamePlayZone.items.length > 0) {
                    let gameZoneArray = gamesFromAPI.gamePlayZone.items.sort((a, b) => {
                        return a.order - b.order;
                    });
                    setPlayZone(gameZoneArray);
                    setZoneVisibleFunction(gameZoneArray[0].id,gameZoneArray[0].gameZoneName );
                    console.log("gamesFromAPI.gamePlayZone.items.length: " + gamesFromAPI.gamePlayZone.items.length);
                }
                /* set up game hints: */
                if (gamesFromAPI.gameHint.items.length > 0) {

                    let gameHintArray = gamesFromAPI.gameHint.items.sort((a, b) => {
                        return a.order - b.order;
                    });
                    setGameHint(gameHintArray);
                    console.log("gamesFromAPI.gameHint.items.length: " + gamesFromAPI.gameHint.items.length);
                }
                /* set up game clues: */
                if (gamesFromAPI.gameClue.items.length > 0) {
                    /* filter by position */
                    let gameClueArray = gamesFromAPI.gameClue.items.sort((a, b) => {
                            return a.order - b.order;
                        });
                    setGameClues(gameClueArray);
                    console.log("gameClueTopArray: " + gameClueArray);
                }
                /* set up game Puzzle: */
                console.log("gamePuzzle.length: "  + gamesFromAPI.gamePuzzle.items.length);
                if (gamesFromAPI.gamePuzzle.items.length > 0) {
                    console.log("setGamePuzzles: " + JSON.stringify(gamesFromAPI.gamePuzzle.items));
                    /* filter by position */
                    let gamePuzzleArray = gamesFromAPI.gamePuzzle.items.sort((a, b) => {
                            return a.order - b.order;
                        });
                    setGamePuzzles(gamePuzzleArray);
                    console.log("gamesFromAPI.gamePuzzle.items[0].id: " + gamesFromAPI.gamePuzzle.items[0].id);
                    let gamePuzzleSolveID = gamesFromAPI.gamePuzzle.items[0].id;
                    setGamePuzzleSolved({...gamePuzzleSolved, [gamePuzzleSolveID]:false});
                    //console.log("gamesFromAPI.gameClue.items.length: " + gamesFromAPI.gameClue.items.length);
                }

            } catch (err) {
                console.log('error fetching getGame', err);
            }
        }
    }

    function setGameHintVisibleFunction(key, value) {
        console.log("setGameHintVisibleFunction: " + key);
        if (key) {
            setGameHintVisible({...gameHintVisible, [key]: value})
        }

    }

    useEffect(() => {
        console.log("***useEffect***: setGamePlayFunction (only on mount)");
        /* set local storage for gameStop - only on mount - to recover from refresh */
        setGamePlayFunction();
    }, []);

    useEffect(() => {
        console.log("***useEffect***: isChecked: " + isChecked);
        /* set local storage for gameStop - only on mount - to recover from refresh */
        isChecked? setLightDark("background:white"): setLightDark("background:black");
    }, [isChecked]);

    useEffect(() => {
        let gamePuzzleSolvedTest = JSON.stringify(gamePuzzleSolved);
        console.log("***useEffect***:gamePuzzleSolved: " + gamePuzzleSolvedTest);
        if (gamePuzzleSolvedTest != "{}" &&  gamePuzzleSolvedTest != "" &&  gamePuzzleSolvedTest != null) {
            localStorage.setItem("gamePuzzleSolved", gamePuzzleSolvedTest);
        }
    }, [gamePuzzleSolved]);

    useEffect(() => {
        let gamePuzzleGuessTest = JSON.stringify(gamePuzzleGuess);
        console.log("***useEffect***:gamePuzzleGuess: " + gamePuzzleGuessTest);
        if (gamePuzzleGuessTest != "{}" &&  gamePuzzleGuessTest != "" &&  gamePuzzleGuessTest != null) {
            localStorage.setItem("gamePuzzleGuess", gamePuzzleGuessTest);
        }
    }, [gamePuzzleGuess]);

    useEffect(() => {
        let gameHintVisibleTest = JSON.stringify(gameHintVisible);
        console.log("***useEffect***:gameHintVisible: " + gameHintVisibleTest);
        if (gameHintVisibleTest != "{}" &&  gameHintVisibleTest != "" &&  gameHintVisibleTest != null) {
            localStorage.setItem("gameHintVisible", gameHintVisibleTest);
        }
        /* add 5 minutes */
        /* check for true to calculate gameTimeHint */
        let hintTime = 0;
        for (const key in gameHintVisible) {
            console.log(`${key}: ${gameHintVisible[key]}`);
            if (gameHintVisible[key] === true) {
                hintTime = hintTime + 5;
            }
        }
        setGameTimeHint(hintTime);
    }, [gameHintVisible]);

    /* always scroll to top */
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    function setCluesFunction(clue) {
        setAlertText("clue added to notes");
        setIsAlertVisible(true);
        console.log("clue: " + clue);
        setTimeout(() => {
            setIsAlertVisible(false);
        }, 3000);
        setClues(clues + clue);
        localStorage.setItem("clues",clues + clue);
    }

    function setAlertTextFunction(alertText) {
        setIsAlertVisible(true);
        setAlertText(alertText);
        setTimeout(() => {
            setIsAlertVisible(false);
        }, 3000);
    }

    function setZoneVisibleFunction(zoneID, zoneName) {
        setZoneVisible(zoneID);
        setZoneName(zoneName);
        setAlertTextFunction("Clues reference things near " + zoneName);
    }
    function setGameClueVisibleFunction(key, value) {
        console.log("setGameClueVisibleFunction: " + key);
        if (key) {
            setGameClueVisible({...gameClueVisible, [key]: value})
        }
    }
    function setGamePuzzleVisibleFunction(key, value) {
        console.log("setGamePuzzleVisibleFunction: " + key);
        if (key) {
            setGamePuzzleVisible({...gamePuzzleVisible, [key]: value})
        }
    }
    function setGamePuzzleClueVisibleFunction(key, value) {
        console.log("setGamePuzzleClueVisibleFunction: " + key);
        if (key) {
            setGamePuzzleClueVisible({...gamePuzzleClueVisible, [key]: value})
        }
    }
    function setGamePuzzleImageOpenFunction(key, value) {
        console.log("setGamePuzzleImageOpenFunction: " + key);
        if (key) {
            setGamePuzzleImageOpen({...gamePuzzleImageOpen, [key]: value})
        }
    }
    function setGamePuzzleGuessFunction(textFieldID, guess, answer, puzzleID, winGame) {
        console.log("setPuzzleGuessFunction - puzzleID: " + puzzleID);
        console.log("setPuzzleGuessFunction - textFieldID: " + textFieldID);
        console.log("setPuzzleGuessFunction - answer: " + answer);
        if (textFieldID) {
            setGamePuzzleGuess({...gamePuzzleGuess, [textFieldID]: guess})
            setGamePuzzleAnswer({...gamePuzzleAnswer, [textFieldID]: answer})
            const valArray = [];
            /* loop through answer object - know it is an object if { in answer */
            if (answer.includes("{")) {
                console.log("answer has multiple options");
                let answerObject = JSON.parse(answer);
                for (const key in answerObject) {
                    console.log("loop: " + `${key}: ${answerObject[key]}`);
                    let val2 = shallowEqual(guess,String(answerObject[key]));
                    console.log("val2: " + val2);
                    valArray.push(val2);
                }
            } else {
                let val = shallowEqual(guess,answer);
                valArray.push(val);
            }
            console.log("valArray: " + valArray);
            if (valArray.includes(true)) {
                setGamePuzzleAnswerCorrect({...gamePuzzleAnswerCorrect, [textFieldID]: true});
                /* loop through puzzle array if answer is correct */
                console.log("gamePuzzle.length: " + gamePuzzles.length);
                for (let i = 0; i < gamePuzzles.length; i++) {
                    console.log("gamePuzzles.length[i].id: " + gamePuzzles[i].id + " | puzzleID: " + puzzleID);
                    /* find which puzzle */
                    if (gamePuzzles[i].id == puzzleID) {
                        /* check if all correct --> textfields have unique ids */
                        const allCorrectArray = [];
                        let textFieldLength = gamePuzzles[i].textField.items.length;
                        console.log("gamePuzzles[i].textField.items.length: " + textFieldLength);
                        if (textFieldLength > 1) {
                            for (let j = 0; j < gamePuzzles[i].textField.items.length; j++) {
                                let key = gamePuzzles[i].textField.items[j].id;
                                console.log("key in for loop: " + key);
                                console.log("textFieldID in puzzle check: " + textFieldID);
                                /* is key in object? */
                                if (gamePuzzleAnswerCorrect.hasOwnProperty(key) & key != textFieldID) {
                                    console.log("key in gamePuzzleAnswerCorrect: " + key);
                                    /* check if false */
                                    if (gamePuzzleAnswerCorrect[key]) {
                                        allCorrectArray.push(true);
                                    } else {
                                        allCorrectArray.push(false);
                                    }
                                } else if (key != textFieldID) {
                                    console.log("textfield is not in correct array");
                                    allCorrectArray.push(false);
                                }
                            }

                        } else {
                            /* only 1 textfield so puzzle solved!*/
                            allCorrectArray.push(true);
                        }
                        if (!allCorrectArray.includes(false)) {
                            setGamePuzzleSolved({...gamePuzzleSolved, [puzzleID]: true});
                            /* set an alert or something */
                            setTimeout(() => {
                                TogglePuzzle();
                            }, 1000);
                            setIsAlertVisible(true);
                            setAlertText('puzzle solved');
                            setTimeout(() => {
                                setIsAlertVisible(false);
                            }, 2000);
                            if (winGame) {
                                updateGameScoreFunction();
                            }
                        } else {
                            /* puzzle is not solved */
                            setGamePuzzleSolved({...gamePuzzleSolved, [puzzleID]: false});
                        }
                        break;
                    }
                }


            } else {
                setGamePuzzleAnswerCorrect({...gamePuzzleAnswerCorrect, [textFieldID]: false});
            }

        }
    }

    async function updateGameScoreFunction() {
        console.log("updateGameScore:  " + gameTimeHint);
        let startDate = new Date(realTimeStart);
        // Do your operations to calculate time
        let endDate   = new Date();
        localStorage.setItem("realTimeEnd",endDate);
        let minutes = (endDate.getTime() - startDate.getTime()) / 60000;
        let GameTimeTotal = Number(minutes + gameTimeHint).toFixed(2);
        setGameTimeTotal(GameTimeTotal);

        try {
            const data = {
                id: gameScoreID,
                gameTotalTime: GameTimeTotal,
                gameHintTime: gameTimeHint,
                completed:true
            };
            await client.graphql({
                query: mutations.updateGameScore,
                variables: {
                    input: data
                }
            })
            removeLocalStorage();
            setTimeout(() => {
                setIsWinnerScreenVisible(true);
            }, 1000);
            setTimeout(() => {
                //goHomeQuit(navigate);
            }, 15000);
            console.log("winGameFunction");
            console.log("gameTime = seconds: " + seconds);
        } catch (err) {
            console.log('error updating gamescore:', err);
        }
    }
    function setGameCommentsFunction(key, value) {
        setGameComments({...gameComments, [key]: value})
    }
    async function updateGameScoreCommentsFunction(comment) {
        removeLocalStorage();
        try {
            const data = {
                id: gameScoreID,
                gameComments: JSON.stringify(gameComments)
            };
            await client.graphql({
                query: mutations.updateGameScore,
                variables: {
                    input: data
                }
            })
            console.log("update comments");
            localStorage.removeItem("gameScoreID");
            if (comment) {
                setIsAlertVisible(true);
                setAlertText('Thank you for your comment');
                setTimeout(() => {
                    setIsAlertVisible(false);
                    navigate('/');
                }, 2000);
            } else {
                navigate('/');
            }

        } catch (err) {
            console.log('error updating gamescore:', err);
        }
    }
    const backgroundImage = (src) => (
        "url("+ src + ")");

    const keyID = (src,name) => (
        name + "_"+ src);

    const divStyle = (src) => ({
        background:  "url(" + src + ") 0 0 / contain no-repeat"
    });

   function DangerouslySetInnerHTMLSanitized(htmlContent) {
        const sanitizedHtmlContent = DOMPurify.sanitize(htmlContent);
        return (sanitizedHtmlContent)
    }

    const [isModalClueOpen, setIsModalClueOpen] = useState(false);
    const [isModalPuzzleOpen, setIsModalPuzzleOpen] = useState(false);
    const [isModalHelpOpen, setIsModalHelpOpen] = useState(false);
    const [isModalHintOpen, setIsModalHintOpen] = useState(false);
    const initialStateClueDetails = {
        gameClueName: '',
        gameClueText: '',
        gameClueImage: ''
    };
    const [clueDetails, setClueDetails] = useState(initialStateClueDetails);
    const [puzzleID, setPuzzleID] = useState("");
    const [puzzleWinGame, setPuzzleWinGame] = useState(false);
    const [puzzleTextFields, setPuzzleTextFields] = useState([]);
    const ToggleClue = () => setIsModalClueOpen(!isModalClueOpen);
    const TogglePuzzle = () => setIsModalPuzzleOpen(!isModalPuzzleOpen);

    function closeModalPuzzle() {
        setIsModalPuzzleOpen(false);
    }
    function closeModalHelp() {
        setIsModalHelpOpen(false);
    }
    function closeModalHint() {
        setIsModalHintOpen(false);
    }
    function goToClueDetail(clueDetails) {

        /* set states */
        console.log("goToClueDetail: ");
        setClueDetails(clueDetails);
        setIsModalClueOpen(true);
    }
    function goToPuzzleDetail(puzzleDetails) {
        /* set states */
        console.log("goToPuzzle: ");
        setPuzzleTextFields(puzzleDetails.textField);
        setPuzzleID(puzzleDetails.puzzleID);
        setPuzzleWinGame(puzzleDetails.winGame);
        setIsModalPuzzleOpen(true);
    }

    function goToPuzzleClue(puzzleDetails) {
        /* set states */
        console.log("goToPuzzle: ");
        setPuzzleTextFields(puzzleDetails.textField);
        setPuzzleID(puzzleDetails.puzzleID);
        setPuzzleWinGame(puzzleDetails.winGame);
        setIsModalPuzzleOpen(true);
    }
    Modal.setAppElement('#modal');

    const IconClueDisplay = (props) => {
        console.log("props.index: " + props.index);
        console.log("props.hide: " + props.hide);
        switch (true) {
            case (props.index == 0):
                return (
                    <svg style={{width: "70px", height: "70px"}} aria-label={"Diary"} version="1.1" viewBox="0 0 1200 1200" xmlns="http://www.w3.org/2000/svg">
                        <g>
                            <rect width="1200" height="1200" fill="transparent"/>
                            <path d="m864.8 252.38h-469.66c-37.785 0-68.457 26.688-68.457 59.395v539.04c0 0.91406 0.23437 1.7422 0.29687 2.6562-0.23437 1.9766-0.29687 4.0156-0.29687 6.0508 0 33.562 27.277 60.84 60.84 60.84h123.48v13.816c0 5.0781 2.7148 9.5938 7.0273 11.867 4.8984 2.4805 10.746 1.3594 14.438-2.8047l25.477-28.426 26.895 28.871c2.4219 2.5664 5.5781 3.9258 8.8555 3.9258 1.8906 0 3.7773-0.44141 5.5195-1.3594 4.2227-2.1836 6.8789-6.7305 6.8789-11.777l-0.03125-14.051h258.74c4.6953 0 8.4727-3.7773 8.4727-8.4727v-27.129c0-4.6953-3.7773-8.4727-8.4727-8.4727h-18.656v-33.477h18.656c4.6953 0 8.4727-3.7773 8.4727-8.4727v-573.55c0.089844-4.6953-3.7773-8.4727-8.4727-8.4727zm-8.4414 546.3h-417.92v-529.29h417.92zm-512.71-486.91c0-23.438 23.113-42.391 51.453-42.391h26.301v529.39h-33.918c-17.238 0-32.797 7.2617-43.895 18.805v-505.8zm167.32 564.51h-123.48c-9.0625 0-16.77-7.7031-16.77-16.77 0-9.0625 7.7031-16.77 16.77-16.77h123.48zm78.141 47.172-19.719-21.168c-3.1016-3.3359-7.1719-5.1367-11.484-5.1367h-0.14844c-4.3672 0.089844-8.5312 1.9766-11.57 5.3711l-18.215 20.34v-80.059h61.137zm267.24-20.043h-250.24v-10.215h250.27l0.03125 10.215zm-27.16-27.129h-223.09v-33.477h223.17v33.477zm27.16-50.48h-468.87c-18.598 0-33.711 15.113-33.711 33.711 0 18.598 15.113 33.711 33.711 33.711h123.48v10.215l-123.48-0.03125c-24.176 0-43.895-19.66-43.895-43.895 0-24.176 19.66-43.895 43.895-43.895h468.84zm-369.03-100.34c17.152 0 31.055 13.992 31.055 31.055 0 4.6953 3.7773 8.4727 8.4727 8.4727h240.91c4.6953 0 8.4727-3.7773 8.4727-8.4727 0-17.152 13.992-31.055 31.055-31.055 4.6953 0 8.4727-3.7773 8.4727-8.4727v-365.84c0-4.6953-3.7773-8.4727-8.4727-8.4727-17.152 0-31.055-13.992-31.055-31.055 0-4.6953-3.7773-8.4727-8.4727-8.4727h-240.86c-4.6953 0-8.4727 3.7773-8.4727 8.4727 0 17.152-13.992 31.055-31.055 31.055-4.6953 0-8.4727 3.7773-8.4727 8.4727v365.84c-0.058594 4.6055 3.7188 8.4727 8.4141 8.4727zm8.5312-366.61c19.719-3.543 35.305-19.129 38.848-38.848h225.5c3.543 19.719 19.129 35.305 38.848 38.848v350.34c-19.719 3.543-35.305 19.129-38.848 38.848h-225.57c-3.543-19.719-19.129-35.305-38.848-38.848v-350.34zm52.754 161.8h197.55c4.6953 0 8.4727-3.7773 8.4727-8.4727v-94.465c0-4.6953-3.7773-8.4727-8.4727-8.4727l-197.55 0.03125c-4.6953 0-8.4727 3.7773-8.4727 8.4727v94.375c0 4.7539 3.7773 8.5312 8.4727 8.5312zm8.4727-94.465h180.55v77.461h-180.55zm4.6055 188.78c0-4.6953 3.7773-8.4727 8.4727-8.4727h85.168c4.6953 0 8.4727 3.7773 8.4727 8.4727 0 4.6953-3.7773 8.4727-8.4727 8.4727h-85.109c-4.6641 0-8.5312-3.7773-8.5312-8.4727zm132.19 8.4727c-4.6953 0-8.4727-3.7773-8.4727-8.4727 0-4.6953 3.7773-8.4727 8.4727-8.4727h28.637c4.6953 0 8.4727 3.7773 8.4727 8.4727 0 4.6953-3.7773 8.4727-8.4727 8.4727zm-72.414 34.895c0 4.6953-3.7773 8.4727-8.4727 8.4727h-42.773c-4.6953 0-8.4727-3.7773-8.4727-8.4727 0-4.6953 3.7773-8.4727 8.4727-8.4727h42.773c4.6055 0.03125 8.4727 3.8086 8.4727 8.4727zm109.49 0c0 4.6953-3.7773 8.4727-8.4727 8.4727h-71.023c-4.6953 0-8.4727-3.7773-8.4727-8.4727 0-4.6953 3.7773-8.4727 8.4727-8.4727h71.023c4.6953 0.03125 8.4727 3.8086 8.4727 8.4727z"/>
                        </g>
                    </svg>
                );
            case (props.index % 5 == 0):
                return (
                    <svg style={{width: "70px", height: "70px"}} aria-label={"Message in a Bottle"} version="1.1" viewBox="0 0 1200 1200" xmlns="http://www.w3.org/2000/svg">
                        <g>
                            <rect width="1200" height="1200" fill="transparent"/>
                            <path d="m439.06 939.16c-15.668 0-30.406-6.1094-41.492-17.191l-119.53-119.53c-11.082-11.082-17.18-25.809-17.18-41.488 0-15.668 6.0938-30.406 17.176-41.488l256.47-256.46c37.551-37.551 93.723-49.172 143.09-29.594 6 2.3711 12.824 0.97266 17.379-3.5859l93.039-93.051c3.0352-3.0352 7.9531-3.0352 10.988 0 3.0352 3.0352 3.0352 7.9414 0 10.977l-93.047 93.047c-8.9414 8.9414-22.316 11.703-34.074 7.0508-43.602-17.301-93.211-7.0391-126.38 26.129l-256.47 256.47c-8.1445 8.1562-12.633 18.984-12.633 30.5 0 11.527 4.4883 22.355 12.633 30.512l119.52 119.52c8.1562 8.1562 18.984 12.648 30.512 12.648 11.516 0 22.355-4.4883 30.5-12.648l256.47-256.47c33.168-33.156 43.43-82.762 26.145-126.38-4.6641-11.758-1.9023-25.133 7.0391-34.074l93.051-93.051c3.0352-3.0352 7.9414-3.0352 10.973 0 3.0352 3.0352 3.0352 7.9531 0 10.988l-93.035 93.047c-4.5586 4.543-5.9766 11.367-3.5898 17.367 19.566 49.375 7.957 105.54-29.598 143.09l-256.47 256.47c-11.082 11.082-25.82 17.191-41.488 17.191z" fill-rule="evenodd"/>
                            <path d="m890.19 392.24h0.011719zm-98.453-62.727 78.758 78.758 17.867-17.863-78.746-78.758zm78.758 95.355c-3.4688 0-6.7188-1.3359-9.1562-3.7891l-82.41-82.41c-2.4375-2.4414-3.7891-5.6914-3.7891-9.1562 0-3.4531 1.3477-6.7031 3.7891-9.1406l21.535-21.535c5.043-5.043 13.254-5.043 18.297 0l82.426 82.41c2.4414 2.4414 3.7891 5.6914 3.7891 9.1562 0 3.4531-1.3477 6.7031-3.7891 9.1406l-21.531 21.531c-2.4531 2.4414-5.7031 3.7891-9.1523 3.7891z" fill-rule="evenodd"/>
                            <path d="m875.32 374.13c-2.8594 0-5.6094-1.5781-6.9727-4.3164-1.9023-3.8438-0.33594-8.5078 3.5039-10.41l50.293-24.957-56.605-56.59-24.945 50.293c-1.8984 3.8438-6.5547 5.4219-10.41 3.5039-3.8398-1.9023-5.4062-6.5664-3.5039-10.41l26.266-52.949c1.9141-3.8555 5.5938-6.5781 9.8438-7.2812 4.25-0.6875 8.5898 0.71484 11.637 3.75l60.797 60.797c3.0352 3.0469 4.4375 7.4023 3.75 11.648-0.69922 4.2461-3.4258 7.9141-7.2812 9.8281l-52.934 26.277c-1.1055 0.55078-2.293 0.80859-3.4375 0.80859z" fill-rule="evenodd"/>
                            <path d="m622.09 510.99c-0.875 0-1.5273 0.16406-1.918 0.44531-2.2227 2.9648 3.8164 21.789 25.199 43.188 21.387 21.383 40.223 27.426 43.199 25.172 2.2383-2.9688-3.8008-21.789-25.199-43.188-18.633-18.633-35.328-25.617-41.285-25.617zm64.637 84.715c-15.168 0-35.988-13.754-52.344-30.109-21.746-21.75-38.914-51.426-25.172-65.152 13.73-13.738 43.391 3.4258 65.152 25.188h0.003906c21.762 21.75 38.91 51.426 25.184 65.152-3.4102 3.4102-7.8086 4.9219-12.824 4.9219z" fill-rule="evenodd"/>
                            <path d="m442.7 837.71c-4.9102 0-10.438-1.1445-16.398-3.4531-11.797-4.5703-24.539-13.336-35.891-24.676-25.738-25.754-35.258-55.078-22.125-68.211l240.94-240.94c3.0352-3.0352 7.9375-3.0352 10.973 0 3.0352 3.0352 3.0352 7.957 0 10.988l-240.92 240.92c-4.8008 4.8008 1.5781 25.699 22.125 46.246 9.707 9.707 20.832 17.434 30.516 21.168 8.8867 3.4375 14.023 2.668 15.734 0.97266l240.92-240.92c3.0352-3.0352 7.9531-3.0352 10.988 0 3.0352 3.0312 3.0352 7.957 0 10.988l-240.93 240.91c-3.9805 3.9922-9.4258 6-15.926 6z" fill-rule="evenodd"/>
                            <path d="m386.04 800.73c-1.9805 0-3.9805-0.75391-5.4883-2.2656-3.0352-3.0352-3.0352-7.957 0-10.988l243.88-243.88c3.0352-3.0352 7.9414-3.0352 10.973 0 3.0352 3.0352 3.0352 7.957 0 10.988l-243.88 243.88c-1.5117 1.5117-3.5078 2.2656-5.4883 2.2656z" fill-rule="evenodd"/>
                        </g>
                    </svg>
                );
            case (props.index % 4 == 0):
                return (
                    <svg style={{width: "70px", height: "70px"}} aria-label={"Clue Icon"} className={"amplify-icon"} version="1.1" viewBox="0 0 1200 1200" xmlns="http://www.w3.org/2000/svg">
                        <rect width="1200" height="1200" fill="transparent"/>
                        <path d="m407.85 726c0 7.8125-3.1055 15.309-8.6289 20.832-5.5273 5.5273-13.02 8.6289-20.836 8.6289-7.8125 0-15.305-3.1016-20.832-8.6289-5.5234-5.5234-8.6289-13.02-8.6289-20.832s3.1055-15.309 8.6289-20.832c5.5273-5.5273 13.02-8.6289 20.832-8.6289 7.8125 0.007813 15.301 3.1133 20.824 8.6367 5.5234 5.5234 8.6328 13.012 8.6406 20.824zm306.3-60.875c-26.82 26.984-64.262 40.629-102.16 37.223-37.891-3.4023-72.301-23.496-93.887-54.828-21.582-31.332-28.094-70.645-17.77-107.27 10.32-36.617 36.414-66.738 71.184-82.18 0.48437-0.26562 0.98828-0.5 1.5039-0.69922 36.695-15.887 78.711-13.688 113.55 5.9453 34.84 19.633 58.48 54.438 63.895 94.055 5.4141 39.621-8.0234 79.492-36.316 107.75zm-16.691-164.18c-14.895-14.887-33.949-24.91-54.652-28.746-20.703-3.8359-42.086-1.3086-61.32 7.2539-6.168 43.043-27.75 82.383-60.738 110.71 4.9688 33.066 25.504 61.746 55.207 77.098 29.707 15.355 64.977 15.523 94.828 0.45312 29.852-15.074 50.656-43.555 55.938-76.574s-5.6016-66.57-29.262-90.199zm248.38 344.73-51.129 51.129c-5.418 5.3672-12.738 8.3828-20.367 8.3828s-14.949-3.0156-20.371-8.3828l-111.82-111.82v-0.003907c-5.3867-5.4102-8.4141-12.734-8.4141-20.367 0-7.6367 3.0273-14.961 8.4141-20.371l4.7227-4.6055-22.125-22.125c-35.094 24.871-78.117 35.945-120.86 31.109-42.738-4.8359-82.199-25.242-110.85-57.324-28.648-32.086-44.477-73.594-44.465-116.61 0.039062-10.367 0.99219-20.711 2.8438-30.91-8.7969 5.6953-18.223 10.359-28.09 13.895-4.4609 1.4336-8.3555 4.2344-11.133 8.0078-2.7773 3.7734-4.293 8.3281-4.3359 13.012v53.609c0 10.547-5.6289 20.289-14.762 25.562-9.1328 5.2734-20.387 5.2734-29.52 0-9.1328-5.2734-14.758-15.016-14.758-25.562v-53.609c0.13281-16.891 5.4805-33.328 15.305-47.066 9.8281-13.734 23.66-24.105 39.602-29.688 16.754-5.8086 30.938-17.309 40.086-32.496 9.1484-15.191 12.68-33.105 9.9805-50.633-2.7422-17.16-11.195-32.895-23.988-44.656-12.789-11.766-29.176-18.871-46.508-20.168-18.121-1.207-36.078 4.1016-50.629 14.973-14.551 10.871-24.738 26.582-28.719 44.305-1.7109 7.207-6.0703 13.504-12.215 17.645-6.1406 4.1367-13.617 5.8086-20.938 4.6836-7.3242-1.125-13.949-4.9648-18.566-10.758-5.7461-7.1602-7.8398-16.586-5.668-25.504 6.2305-27.07 20.715-51.535 41.445-70.023 24.773-22.191 56.859-34.48 90.121-34.52 33.262-0.039062 65.371 12.18 90.199 34.316 24.824 22.137 40.629 52.645 44.387 85.695 0.83984 7.9805 0.99609 16.02 0.46875 24.031 32.824-26.73 74.223-40.656 116.53-39.203 42.305 1.4492 82.648 18.184 113.56 47.102 30.914 28.918 50.301 68.059 54.57 110.17 4.2695 42.113-6.8711 84.348-31.352 118.88l22.055 22.055 4.7227-4.7227h0.003906c5.4102-5.3867 12.734-8.4102 20.367-8.4102 7.6367 0 14.961 3.0234 20.371 8.4102l111.82 111.82v0.003906c5.3867 5.4102 8.4141 12.734 8.4141 20.367 0 7.6367-3.0273 14.961-8.4141 20.371zm-214.99-163.85c28.414-28.414 44.379-66.953 44.379-107.14 0-40.188-15.965-78.727-44.379-107.14-28.414-28.414-66.953-44.375-107.14-44.375s-78.723 15.961-107.14 44.375c-28.418 28.414-44.379 66.953-44.379 107.14 0 40.184 15.965 78.723 44.379 107.14 28.438 28.371 66.965 44.305 107.14 44.305 40.168 0 78.699-15.934 107.14-44.305z"/>
                    </svg>
                );
            case (props.index % 3 == 0):
                return (
                    <svg style={{width: "70px", height: "70px"}} aria-label={"Clue Note Icon"} className={"amplify-icon"} version="1.1" viewBox="0 0 1200 1200" xmlns="http://www.w3.org/2000/svg">
                        <g>
                            <rect width="1200" height="1200" fill="transparent"/>
                            <path d="m599.3 680.63c-9.168 0-16.605-7.4375-16.605-16.605v-15.707c0-25.223 15.34-42.484 28.875-57.719 11.266-12.672 21.902-24.648 24.527-40.637 2.1523-13.059 2.6797-31.016-6.9727-42.387-8.9297-10.531-23.957-12.734-34.992-12.734-11.277 0-19.523 2.8008-24.508 8.3242-8.0859 8.9609-6.9961 23.371-6.9844 23.512 0.94141 9.125-5.6875 17.285-14.809 18.227-9.1016 0.875-17.285-5.6875-18.227-14.809-0.30078-2.9531-2.4648-29.414 15.363-49.168 11.547-12.809 28.086-19.297 49.168-19.297 25.879 0 46.734 8.4531 60.312 24.453 9.8711 11.621 20.379 33.082 14.434 69.262-4.1953 25.48-19.223 42.398-32.477 57.316-12.715 14.293-20.496 23.664-20.496 35.652v15.707c-0.007812 9.168-7.4453 16.609-16.609 16.609z"/>
                            <path d="m600 738.38c-9.168 0-16.605-7.4375-16.605-16.605v-6.0664c0-9.168 7.4375-16.605 16.605-16.605s16.605 7.4375 16.605 16.605v6.0664c0 9.1641-7.4375 16.605-16.605 16.605z"/>
                            <path d="m849.08 954.24h-498.15c-9.168 0-16.605-7.4375-16.605-16.605v-630.99c0-9.168 7.4375-16.605 16.605-16.605h498.15c9.168 0 16.605 7.4375 16.605 16.605v630.99c0 9.168-7.4375 16.605-16.605 16.605zm-481.55-33.211h464.94v-597.78h-464.94z"/>
                            <path d="m450.55 367.53c-9.168 0-16.605-7.4375-16.605-16.605v-88.559c0.003906-9.168 7.4414-16.605 16.605-16.605 9.168 0 16.605 7.4375 16.605 16.605v88.559c0 9.168-7.4375 16.605-16.605 16.605z"/>
                            <path d="m550.19 367.53c-9.168 0-16.605-7.4375-16.605-16.605v-88.559c0-9.168 7.4375-16.605 16.605-16.605s16.605 7.4375 16.605 16.605v88.559c0 9.168-7.4375 16.605-16.605 16.605z"/>
                            <path d="m649.82 367.53c-9.168 0-16.605-7.4375-16.605-16.605v-88.559c0-9.168 7.4375-16.605 16.605-16.605 9.168 0 16.605 7.4375 16.605 16.605v88.559c0 9.168-7.4375 16.605-16.605 16.605z"/>
                            <path d="m749.45 367.53c-9.168 0-16.605-7.4375-16.605-16.605v-88.559c0.003906-9.168 7.4414-16.605 16.605-16.605 9.168 0 16.605 7.4375 16.605 16.605v88.559c0 9.168-7.4375 16.605-16.605 16.605z"/>
                        </g>
                    </svg>
                );
            case (props.index % 2 == 0):
                return (
                    <svg style={{width: "70px", height: "70px"}} aria-label={"Envelope"} version="1.1" viewBox="0 0 1200 1200" xmlns="http://www.w3.org/2000/svg">
                        <defs>
                            <clipPath id="c">
                                <path d="m472 222.14h254v111.86h-254z"/>
                            </clipPath>
                            <clipPath id="b">
                                <path d="m262 434h676v543.86h-676z"/>
                            </clipPath>
                            <clipPath id="a">
                                <path d="m265 635h670v342.86h-670z"/>
                            </clipPath>
                        </defs>
                        <rect width="1200" height="1200" fill="transparent"/>
                        <g clip-path="url(#c)">
                            <path d="m709.73 333.11c-3.0703 0-6.4648-0.91406-9.2383-3.0703l-100.16-73.652-103.59 70.23c-6.7617 4.6328-16.324 2.7734-21.254-4.3086-4.6328-7.0859-2.7734-16.648 4.0156-21.254l112.8-76.129c5.5508-3.6914 12.637-3.6914 17.891 0.29687l108.79 80.145c6.7891 4.9297 8.3242 14.789 3.3945 21.578-3.1016 3.9844-7.7031 6.168-12.637 6.168z"/>
                        </g>
                        <g clip-path="url(#b)">
                            <path d="m879.85 977.86h-559.7c-31.734 0-57.328-25.891-57.328-57.328v-408.05c0-4.6328 2.1562-8.9453 5.8438-12.016l69.344-56.09c6.4648-5.2266 16.324-4.3086 21.578 2.1562 5.2266 6.4648 4.3086 16.324-2.1562 21.578l-63.793 51.75v400.68c0 14.496 11.719 26.508 26.508 26.508h559.7c14.496 0 26.508-12.016 26.508-26.508v-401.27l-64.117-57.328c-6.4648-5.5508-6.7891-15.41-1.2383-21.875s15.41-6.7891 21.875-1.2383l69.344 61.961c3.3945 2.7734 5.2266 7.0859 5.2266 11.395v408.05c-0.26562 31.734-25.859 57.625-57.594 57.625z"/>
                        </g>
                        <g clip-path="url(#a)">
                            <path d="m879.85 977.86h-559.7c-23.41 0-44.988-14.789-53.312-36.988-2.1562-5.8438-0.62109-12.637 4.0156-16.945l319-284.49c5.8438-5.2266 14.789-5.2266 20.664 0l319 284.49c4.6328 4.3086 6.4648 11.102 4.0156 16.945-8.6797 22.199-29.934 36.988-53.668 36.988zm-579.12-39.438c4.9297 5.2266 12.016 8.6211 19.426 8.6211h559.7c7.4102 0 14.496-3.3945 19.426-8.6211l-299.28-266.89z"/>
                        </g>
                        <path d="m698.01 751.64c-4.3086 0-8.3242-1.8594-11.395-5.2266-5.5508-6.4648-5.2266-16.031 1.2383-21.875l220.66-196.93c6.4648-5.5508 16.031-5.2266 21.875 1.2383 5.5508 6.4648 5.2266 16.031-1.2383 21.875l-220.66 196.93c-3.0703 2.7461-6.7891 3.9844-10.48 3.9844z"/>
                        <path d="m503.53 753.18c-3.6914 0-7.4102-1.2383-10.184-4.0156l-222.23-198.5c-6.4648-5.5508-6.7891-15.41-1.2383-21.875 5.5508-6.4648 15.41-6.7891 21.875-1.2383l222.23 198.5c6.4648 5.5508 6.7891 15.41 1.2383 21.875-3.3672 3.7188-7.6758 5.2539-11.691 5.2539z"/>
                        <path d="m848.41 616.95c-8.6211 0-15.41-6.7891-15.41-15.41v-267.21h-466v267.21c0 8.6211-6.7891 15.41-15.41 15.41s-15.41-6.7891-15.41-15.41v-282.62c0-8.6211 6.7891-15.41 15.41-15.41h496.82c8.6211 0 15.41 6.7891 15.41 15.41v282.62c0 8.3242-6.7891 15.41-15.41 15.41z"/>
                        <path d="m426.78 379.34h329.77v30.82h-329.77z"/>
                        <path d="m426.78 435.43h329.77v30.82h-329.77z"/>
                        <path d="m426.78 491.81h329.77v30.82h-329.77z"/>
                        <path d="m426.78 547.93h329.77v30.82h-329.77z"/>
                        <path d="m426.78 604.31h329.77v30.82h-329.77z"/>
                    </svg>
                );
            default:
                return (
                    <svg style={{width: "70px", height: "70px"}} aria-label={"Torn Paper"} version="1.1" viewBox="0 0 1200 1200" xmlns="http://www.w3.org/2000/svg">
                        <g>
                            <rect width="1200" height="1200" fill="transparent"/>
                            <path d="m348.1 867.65c0 3.4062 1.1055 6.7188 3.1484 9.4453l59.039 78.719c2.9727 3.9648 7.6406 6.2969 12.598 6.2969 4.9531 0 9.6211-2.332 12.594-6.2969l46.445-61.953 46.445 61.953c3.0938 3.7695 7.7148 5.957 12.594 5.957 4.8789 0 9.5-2.1875 12.598-5.957l46.441-61.953 46.445 61.953c3.0977 3.7695 7.7188 5.957 12.598 5.957 4.8789 0 9.5-2.1875 12.594-5.957l46.445-61.953 46.445 61.953c2.9727 3.9648 7.6406 6.2969 12.594 6.2969 4.957 0 9.6211-2.332 12.598-6.2969l59.039-78.719c2.043-2.7266 3.1484-6.0391 3.1484-9.4453v-472.32c0.12109-0.96484 0.12109-1.9453 0-2.9102-0.26562-1.3438-0.71875-2.6406-1.3398-3.8594l-0.78516-1.1016c-0.67969-1.2148-1.5273-2.3281-2.5195-3.3047l-141.7-141.7v-0.003906c-0.96094-0.95703-2.0469-1.7773-3.2266-2.4375l-0.86719-0.47266c-1.2266-0.73828-2.5508-1.2969-3.9375-1.6562-1.0195-0.13281-2.0508-0.13281-3.0703 0h-299.14c-12.527 0-24.539 4.9766-33.398 13.836-8.8555 8.8594-13.832 20.871-13.832 33.398zm450.04-488.07h-77.934c-2.6523 0-5.1953-1.0547-7.0703-2.9297s-2.9258-4.418-2.9258-7.0703v-77.93zm-418.55-94.465c0-4.1758 1.6562-8.1797 4.6094-11.133 2.9531-2.9531 6.957-4.6133 11.133-4.6133h283.39v100.21c0 11.004 4.3711 21.555 12.148 29.336 7.7812 7.7812 18.332 12.152 29.336 12.152h100.21v451.3l-43.297 57.781-46.523-61.953c-2.957-3.9414-7.5859-6.2734-12.516-6.2969-4.957 0-9.6211 2.332-12.594 6.2969l-46.445 61.953-46.445-61.953c-3.0977-3.7695-7.7188-5.957-12.598-5.957-4.875 0-9.5 2.1875-12.594 5.957l-46.445 61.953-46.445-61.953c-2.9727-3.9648-7.6406-6.2969-12.594-6.2969-4.957 0-9.6211 2.332-12.598 6.2969l-46.441 61.953-43.297-57.781z"/>
                            <path d="m426.82 379.59h181.06c5.625 0 10.82-3 13.633-7.8711 2.8125-4.875 2.8125-10.875 0-15.746s-8.0078-7.8711-13.633-7.8711h-181.06c-5.625 0-10.82 3-13.633 7.8711s-2.8125 10.871 0 15.746c2.8125 4.8711 8.0078 7.8711 13.633 7.8711z"/>
                            <path d="m426.82 497.66h338.5c5.625 0 10.824-3 13.637-7.8711 2.8125-4.8711 2.8125-10.871 0-15.742-2.8125-4.8711-8.0117-7.875-13.637-7.875h-338.5c-5.625 0-10.82 3.0039-13.633 7.875-2.8125 4.8711-2.8125 10.871 0 15.742 2.8125 4.8711 8.0078 7.8711 13.633 7.8711z"/>
                            <path d="m426.82 586.23h338.5c5.625 0 10.824-3 13.637-7.8711 2.8125-4.875 2.8125-10.875 0-15.746s-8.0117-7.8711-13.637-7.8711h-338.5c-5.625 0-10.82 3-13.633 7.8711s-2.8125 10.871 0 15.746c2.8125 4.8711 8.0078 7.8711 13.633 7.8711z"/>
                            <path d="m426.82 674.79h338.5c5.625 0 10.824-3 13.637-7.8711 2.8125-4.8711 2.8125-10.871 0-15.746-2.8125-4.8711-8.0117-7.8711-13.637-7.8711h-338.5c-5.625 0-10.82 3-13.633 7.8711-2.8125 4.875-2.8125 10.875 0 15.746 2.8125 4.8711 8.0078 7.8711 13.633 7.8711z"/>
                            <path d="m765.31 763.35c5.625 0 10.824-3.0039 13.637-7.875s2.8125-10.871 0-15.742c-2.8125-4.8711-8.0117-7.8711-13.637-7.8711h-338.5c-5.625 0-10.82 3-13.633 7.8711-2.8125 4.8711-2.8125 10.871 0 15.742s8.0078 7.875 13.633 7.875z"/>
                        </g>
                    </svg>
                );
        }

    }
    const IconPuzzleDisplay = (props) => {
        switch (true) {
            case (props.index == 0):
                return (
                        <svg style={{width: "100px", height: "100px"}} aria-label={"Puzzle Icon Closed"} version="1.1" viewBox="0 0 1200 1200" xmlns="http://www.w3.org/2000/svg">
                            <g>
                                <rect width="1200" height="1200" fill="transparent"/>
                                <path d="m839.8 323.2h-479.61c-11.562 0-22.09 4.6719-29.715 12.191-7.6328 7.5195-12.371 17.887-12.371 29.285v411.08c0 11.395 4.7383 21.766 12.371 29.285 7.6328 7.5195 18.152 12.191 29.715 12.191h479.61c11.562 0 22.09-4.6719 29.715-12.191 7.6328-7.5195 12.371-17.887 12.371-29.285v-411.08c0-11.395-4.7383-21.766-12.371-29.285-7.6328-7.5195-18.152-12.191-29.715-12.191zm-463.49 88.375c4.3594 0 8.3359 1.7617 11.215 4.6094 2.8867 2.8398 4.6797 6.7578 4.6797 11.055v63.547c0 4.3008-1.793 8.2148-4.6797 11.055s-6.8555 4.6094-11.215 4.6094-8.3359-1.7695-11.215-4.6094c-2.8867-2.8398-4.6797-6.7578-4.6797-11.055v-63.547c0-4.3008 1.793-8.2148 4.6797-11.055 2.8867-2.8398 6.8555-4.6094 11.215-4.6094zm0 222.42c4.3594 0 8.3359 1.7695 11.215 4.6094 2.8867 2.8398 4.6797 6.7578 4.6797 11.055v63.547c0 4.3008-1.793 8.2148-4.6797 11.055-2.8867 2.8398-6.8555 4.6094-11.215 4.6094s-8.3359-1.7617-11.215-4.6094c-2.8789-2.8477-4.6797-6.7578-4.6797-11.055v-63.547c0-4.3008 1.793-8.2148 4.6797-11.055 2.8867-2.8398 6.8555-4.6094 11.215-4.6094zm-8.2891 110.15c-5.6211-1.4648-10.656-4.3906-14.652-8.3359-5.8789-5.7969-9.5312-13.801-9.5312-22.609v-63.547c0-8.8125 3.6484-16.816 9.5312-22.609 3.9961-3.9375 9.0312-6.8633 14.652-8.3359v-96.996c-5.6211-1.4648-10.656-4.3906-14.652-8.3359-5.8789-5.7969-9.5312-13.801-9.5312-22.609v-63.547c0-8.8125 3.6484-16.816 9.5312-22.609 3.9961-3.9375 9.0312-6.8633 14.652-8.3359v-26.648c0-4.5117 3.7109-8.168 8.2891-8.168h447.36c4.5781 0 8.2891 3.6562 8.2891 8.168v401.15c0 4.5117-3.7109 8.168-8.2891 8.168l-447.36-0.003906c-4.5781 0-8.2891-3.6562-8.2891-8.168v-26.648zm16.582-125.43v-96.996c5.6211-1.4648 10.656-4.3906 14.652-8.3359 5.8789-5.7969 9.5312-13.801 9.5312-22.609v-63.547c0-8.8125-3.6484-16.816-9.5312-22.609-3.9961-3.9375-9.0312-6.8633-14.652-8.3359v-18.477h430.78v384.81l-430.78-0.003906v-18.477c5.6211-1.4648 10.656-4.3906 14.652-8.3359 5.8789-5.7969 9.5312-13.801 9.5312-22.609v-63.547c0-8.8125-3.6484-16.816-9.5312-22.609-3.9961-3.9375-9.0312-6.8633-14.652-8.3359zm306.92 53.09 10.066 44.535c0.1875 0.72656 0.28125 1.4805 0.25781 2.2656-0.12891 4.4961-3.9219 8.0391-8.4883 7.9141l-43.18-1.2305c-0.55859 0.007813-1.125-0.039063-1.6914-0.13672-4.4883-0.83203-7.4453-5.0859-6.6055-9.5156l8.125-41.98c-2.9609-2.2812-5.4922-5.0547-7.4805-8.1992-3.0469-4.8359-4.8047-10.52-4.8047-16.59 0-8.6914 3.5742-16.559 9.3555-22.254 5.7812-5.6992 13.762-9.2188 22.582-9.2188 8.8203 0 16.801 3.5234 22.582 9.2188 5.7812 5.6992 9.3555 13.566 9.3555 22.254 0 5.4648-1.4297 10.625-3.9453 15.137-1.625 2.9102-3.6953 5.5391-6.1289 7.793zm-31.566 37.469 7.3242-37.824c0.11328-0.53516 0.17188-1.0898 0.17969-1.625v-0.17188-0.007812c-0.015625-1.125-0.27344-2.2148-0.72656-3.2109v-0.023437l-0.066406-0.12109-0.039063-0.082031-0.039062-0.074219-0.054688-0.10547-0.03125-0.054687-0.074218-0.13672c-0.53516-0.96094-1.2695-1.8203-2.1758-2.5078h-0.007812l-0.14453-0.11328c-0.42188-0.30859-0.88281-0.58203-1.3672-0.80859-2.5156-1.2539-4.6484-3.1875-6.1445-5.5625-1.4453-2.2969-2.2812-5.0273-2.2812-7.9648 0-4.1797 1.7148-7.9648 4.4961-10.699s6.6211-4.4297 10.859-4.4297 8.0781 1.6914 10.859 4.4297c2.7812 2.7344 4.4961 6.5234 4.4961 10.699 0 2.6602-0.67969 5.1445-1.875 7.2852-1.2461 2.2383-3.0625 4.1328-5.2539 5.5-3.2266 2.0195-4.5586 5.8711-3.4766 9.3047l8.8125 38.973-23.27-0.66406zm-128.73-232.87c25.383 0 48.367 10.141 65 26.531 16.633 16.391 26.926 39.039 26.926 64.055s-10.285 47.664-26.926 64.055c-16.633 16.391-39.613 26.531-65 26.531-25.383 0-48.359-10.141-65-26.531-16.633-16.391-26.926-39.039-26.926-64.055s10.285-47.664 26.926-64.055c16.633-16.391 39.613-26.531 65-26.531zm34.469 56.617c8.8203 8.6914 14.277 20.707 14.277 33.969 0 13.27-5.457 25.277-14.277 33.969-8.8203 8.6914-21.008 14.07-34.469 14.07-13.461 0-25.648-5.3789-34.469-14.07-8.8203-8.6914-14.277-20.707-14.277-33.969 0-13.27 5.457-25.277 14.277-33.969 8.8203-8.6914 21.008-14.07 34.469-14.07 13.461 0 25.648 5.3789 34.469 14.07zm-74.301-17.062-7.1055-7.043c10.844-8.5234 24.121-14.156 38.648-15.727v9.9297c-11.781 1.4727-22.582 6.0312-31.543 12.84zm-24.977 42.863h-10.074c1.6094-14.457 7.4297-27.668 16.219-38.414l7.1055 7.043c-7.0273 8.8867-11.742 19.633-13.254 31.371zm11.949 46.016-7.3398 6.8086c-7.9336-10.375-13.18-22.875-14.691-36.477h10.074c1.4141 10.996 5.6445 21.129 11.949 29.668zm44.566 26.027v9.9297c-15.395-1.6641-29.391-7.8906-40.566-17.281l7.3398-6.8086c9.2812 7.5352 20.699 12.598 33.23 14.16zm48.125-12.84 7.1055 7.043c-10.844 8.5234-24.121 14.156-38.648 15.727v-9.9297c11.781-1.4727 22.582-6.0312 31.543-12.84zm24.977-42.863h10.074c-1.6094 14.457-7.4297 27.668-16.219 38.414l-7.1055-7.043c7.0273-8.8867 11.742-19.633 13.246-31.371zm-11.949-46.016 7.3398-6.8086c7.9336 10.375 13.18 22.875 14.691 36.477h-10.074c-1.4141-10.996-5.6445-21.129-11.949-29.668zm-44.566-26.027v-9.9297c15.395 1.6641 29.391 7.8906 40.566 17.281l-7.3398 6.8086c-9.2812-7.5352-20.699-12.598-33.23-14.16zm223.96-12.113c2.3516 0 4.4961 0.95312 6.0547 2.4922 1.5586 1.5352 2.5312 3.6484 2.5312 5.9688v133.55c0 2.3203-0.96875 4.4297-2.5312 5.9688-1.5625 1.543-3.7031 2.4922-6.0625 2.4922s-4.4961-0.95312-6.0547-2.4922c-1.5586-1.5352-2.5312-3.6484-2.5312-5.9688v-133.55c0-2.3203 0.96875-4.4375 2.5312-5.9688 1.5586-1.5352 3.7031-2.4922 6.0625-2.4922zm0-16.34c6.9297 0 13.227 2.7891 17.781 7.2773 4.5586 4.4883 7.3828 10.691 7.3828 17.523v133.55c0 6.832-2.8281 13.027-7.3828 17.523-4.5586 4.4883-10.852 7.2773-17.781 7.2773-6.9297 0-13.227-2.7891-17.781-7.2773-4.5586-4.4883-7.3828-10.691-7.3828-17.523v-133.55c0-6.832 2.8281-13.027 7.3828-17.523 4.5586-4.4883 10.852-7.2773 17.781-7.2773zm-214.38 74.719c4.5703 4.5039 7.3984 10.73 7.3984 17.609s-2.8281 13.105-7.3984 17.609c-4.5703 4.5039-10.891 7.293-17.863 7.293-6.9766 0-13.293-2.7891-17.863-7.293-4.5703-4.5039-7.3984-10.73-7.3984-17.609s2.8281-13.105 7.3984-17.609c4.5703-4.5039 10.891-7.293 17.863-7.293 6.9766 0 13.293 2.7891 17.863 7.293zm-17.863-23.633c11.555 0 22.016 4.6172 29.594 12.078 7.5703 7.4648 12.258 17.773 12.258 29.164 0 11.387-4.6836 21.695-12.258 29.164-7.5703 7.4648-18.039 12.078-29.594 12.078-11.555 0-22.016-4.6172-29.594-12.078-7.5703-7.4648-12.258-17.773-12.258-29.164 0-11.387 4.6836-21.695 12.258-29.164 7.5703-7.4648 18.039-12.078 29.594-12.078zm-98.719 307.82h-43.871v43.234h43.871zm380.86 0h-43.871v43.234h43.871z" fillRule="evenodd"/>
                            </g>
                        </svg>
                );
            default:
                return "default"
        }
    }
    const IconPuzzleDisplayOpen = (props) => {
        switch (true) {
            case (props.index == 0):
                return (
                    <svg style={{width: "100px", height: "100px"}} aria-label={"Puzzle Icon Open"}  version="1.1" viewBox="0 0 1200 1200" xmlns="http://www.w3.org/2000/svg">
                        <g>
                            <rect width="1200" height="1200" fill="transparent"/>
                            <path d="m377.11 653.51h-17.426c-0.37109 0-0.71875 0.16016-0.97656 0.40625-0.25781 0.25-0.41406 0.58984-0.41406 0.96094v70.598c0 0.37109 0.16016 0.71094 0.41406 0.96094 0.25781 0.25 0.60547 0.40625 0.97656 0.40625h17.426c0.37109 0 0.71875-0.16016 0.97656-0.40625 0.25781-0.25 0.41406-0.58984 0.41406-0.96094v-70.598c0-0.37109-0.16016-0.71094-0.41406-0.96094-0.25781-0.25-0.60547-0.40625-0.97656-0.40625zm0-179.36h-17.426c-0.37109 0-0.71875 0.16016-0.97656 0.40625-0.25781 0.25-0.41406 0.58984-0.41406 0.96094v70.598c0 0.37109 0.16016 0.71094 0.41406 0.96094 0.25781 0.25 0.60547 0.40625 0.97656 0.40625h17.426c0.37109 0 0.71875-0.16016 0.97656-0.40625 0.25781-0.25 0.41406-0.58984 0.41406-0.96094v-70.598c0-0.37109-0.16016-0.71094-0.41406-0.96094-0.25781-0.25-0.60547-0.40625-0.97656-0.40625zm-0.42188 342.82v-73.781h0.42188c4.9492 0 9.4453-1.9883 12.695-5.1992 3.25-3.2031 5.2734-7.6328 5.2734-12.516v-70.598c0-4.8828-2.0195-9.3086-5.2734-12.516-3.25-3.2031-7.7461-5.1992-12.695-5.1992h-0.42188v-73.336h0.42188c4.9492 0 9.4453-1.9883 12.695-5.1992 3.25-3.2031 5.2734-7.6328 5.2734-12.516v-70.598c0-4.8828-2.0195-9.3086-5.2734-12.516-3.25-3.2031-7.7461-5.1992-12.695-5.1992h-0.42188v-73.781l208.01-38.012v508.93l-208.01-37.977zm248.72-474.97h-23.707c-0.10547 0-0.21094 0.046875-0.28906 0.12891-0.074218 0.074219-0.12891 0.17188-0.12891 0.28125v515.18c0 0.11328 0.054688 0.21094 0.12891 0.28906 0.082032 0.074219 0.17969 0.12891 0.28906 0.12891h23.707c0.10547 0 0.21094-0.054687 0.28906-0.12891 0.082031-0.074218 0.12891-0.17969 0.12891-0.28906l-0.003906-515.17c0-0.10547-0.054688-0.20312-0.12891-0.28906-0.082031-0.074218-0.17969-0.12891-0.28906-0.12891zm17.004 43.422v34.348h200.33c4.5781 0 8.2891 3.6562 8.2891 8.168v345.09c0 4.5117-3.7109 8.168-8.2891 8.168h-200.33v34.348h221.56c4.8828 0 9.3242-2.0391 12.551-5.3281 3.3086-3.3789 5.3672-8.0469 5.3672-13.219v-393.03c0-5.1602-2.0547-9.8398-5.3672-13.219-3.2266-3.2891-7.6719-5.3281-12.551-5.3281zm-180.38 188.84c-2.9258-4.8594-6.543-7.8594-10.156-7.8594s-7.2305 3-10.156 7.8594c-3.7031 6.1445-5.9922 14.812-5.9922 24.531s2.2891 18.387 5.9922 24.531c2.9258 4.8594 6.543 7.8594 10.156 7.8594s7.2305-3 10.156-7.8594c3.7031-6.1445 5.9922-14.812 5.9922-24.531s-2.2891-18.387-5.9922-24.531zm-1.6641 85.594-0.054688-13.875c6.3242-2.3945 11.805-7.4531 15.961-14.352 4.0352-6.6953 6.8633-15.289 7.8906-24.801l4.4883-0.015625c4.5664 0 8.2617-3.6406 8.2617-8.1406 0-4.4961-3.6953-8.1406-8.2617-8.1406l-4.5117 0.015625c-1.0508-9.4219-3.8633-17.941-7.8672-24.582-4.2383-7.0352-9.8555-12.152-16.332-14.488l-0.054687-13.738c0-4.4961-3.6953-8.1406-8.2617-8.1406s-8.2617 3.6406-8.2617 8.1406l0.054688 13.875c-6.3164 2.3945-11.805 7.4531-15.961 14.352-4.0352 6.6953-6.8633 15.289-7.8906 24.801l-4.4883 0.015625c-4.5664 0-8.2617 3.6406-8.2617 8.1406 0 4.4961 3.6953 8.1406 8.2617 8.1406l4.5117-0.015625c1.0508 9.4219 3.8711 17.941 7.8672 24.582 4.2383 7.0352 9.8555 12.152 16.332 14.488l0.054688 13.738c0 4.4961 3.6953 8.1406 8.2617 8.1406 4.5664 0 8.2617-3.6406 8.2617-8.1406zm88.797-132.07h-5.8047c-1.1719 0-2.2461 0.47656-3.0234 1.2461-0.77734 0.76953-1.2695 1.8281-1.2695 2.9844v124.02c0 1.1562 0.48438 2.2148 1.2695 2.9844 0.77734 0.76953 1.8516 1.2461 3.0234 1.2461h5.8047c1.1719 0 2.2461-0.47656 3.0234-1.2461 0.77734-0.76953 1.2695-1.8281 1.2695-2.9844v-124.02c0-1.1562-0.48438-2.2148-1.2695-2.9844-0.78516-0.76953-1.8516-1.2461-3.0234-1.2461zm-5.8047-16.34c-5.75 0-10.973 2.3125-14.75 6.0391-3.7773 3.7266-6.1289 8.8711-6.1289 14.539v124.02c0 5.668 2.3438 10.812 6.1289 14.539 3.7773 3.7266 9 6.0391 14.75 6.0391h5.8047c5.75 0 10.973-2.3125 14.75-6.0391 3.7773-3.7266 6.1289-8.8711 6.1289-14.539v-124.02c0-5.668-2.3438-10.812-6.1289-14.539-3.7773-3.7266-9-6.0391-14.75-6.0391zm247.77 228.74v24.68h-105.39v-24.68zm-20.828-41.02v24.68h-105.39v-24.68zm26.141-41.02v24.68h-105.39v-24.68zm-25.172-41.02v24.68h-105.39v-24.68zm29.527-41.02v24.68h-105.39v-24.68zm-113.68-16.34c-4.5781 0-8.2891 3.6562-8.2891 8.168v32.852h-21.234c-4.5781 0-8.2891 3.6562-8.2891 8.168v41.02c0 4.5117 3.7109 8.168 8.2891 8.168h16.883v24.68h-17.852c-4.5781 0-8.2891 3.6562-8.2891 8.168v41.02c0 4.5117 3.7109 8.168 8.2891 8.168h12.539v24.68h-26.746v-328.73h192.04v328.75h-26.746v-32.852c0-4.5117-3.7109-8.168-8.2891-8.168h-12.539v-24.68h17.852c4.5781 0 8.2891-3.6562 8.2891-8.168v-41.02c0-4.5117-3.7109-8.168-8.2891-8.168h-16.883v-24.68h21.234c4.5781 0 8.2891-3.6562 8.2891-8.168v-41.02c0-4.5117-3.7109-8.168-8.2891-8.168h-121.97zm-327-101.95h-0.42188c-4.9492 0-9.4453 1.9883-12.695 5.1992-3.25 3.2031-5.2734 7.6328-5.2734 12.516v70.598c0 4.8828 2.0195 9.3086 5.2734 12.516 3.2578 3.2031 7.7461 5.1992 12.695 5.1992h0.42188v73.336h-0.42188c-4.9492 0-9.4453 1.9883-12.695 5.1992-3.25 3.2109-5.2734 7.6328-5.2734 12.516v70.598c0 4.8828 2.0195 9.3086 5.2734 12.516 3.2578 3.2031 7.7461 5.1992 12.695 5.1992h0.42188v72.383h-24.078c-4.8828 0-9.3242-2.0391-12.551-5.3281-3.3086-3.3789-5.3672-8.0469-5.3672-13.219v-393.07c0-5.1602 2.0547-9.8398 5.3672-13.219 3.2266-3.2891 7.6719-5.3281 12.551-5.3281h24.078z" fill-rule="evenodd"/>
                        </g>
                    </svg>
                );
            default:
                return "default"
        }
    }
    return (
        <View position="relative">
            <View className={isChecked? "game-container dark" : "game-container light"}>
                <View className="top-bar top-bar-change">
                    <View className={"logo-container"}>
                        <View className={"logo"}>EscapeOut.Games</View>
                        <View className={"right-buttons"}>
                            <Button margin={"0"} lineHeight={"1em"} padding={"0"} border={"none"} fontWeight={"normal"} className={isChecked? "quit-button dark " : "quit-button light "} onClick={()=>{setIsGoHomeQuitVisible(true)}}>Quit</Button>
                        </View>
                    </View>
                    <Flex className="zone-holder zone-holder-change"
                          direction="row"
                          justifyContent="center"
                          alignItems="center"
                          alignContent="center"
                          wrap="nowrap"
                          gap="1rem">
                        {playZone.map((zone,index) => (
                            <View className={(zoneVisible==zone.id)? "zone-border zone-icon-container" : "zone-icon-container"} key={zone.id} ariaLabel={zone.id}  onClick={() => setZoneVisibleFunction(zone.id, zone.gameZoneName)}>

                                <Icon ariaLabel="Zone Icon"
                                      viewBox={{ width: 1200, height: 1200 }}
                                        width="40px" height="40px"

                                >
                                    <path d="m902.29 686.15c-0.75391-7.5586-5.2891-14.359-12.848-17.383l-163.23-82.371c31.738-64.992 55.922-126.96 55.922-163.99 0-99.754-81.617-181.37-181.37-181.37-99.754 0-181.37 81.617-181.37 181.37 0 40.809 29.473 111.85 65.746 184.39l-107.31 18.137c-7.5586 1.5117-13.602 6.0469-17.383 12.848l-59.703 131.5c-5.2891 10.578-0.75391 24.184 9.8242 29.473l284.9 156.43c3.7773 1.5117 7.5586 3.0234 11.336 3.0234 1.5117 0 3.0234 0 4.5352-0.75391l243.34-49.879c6.8008-1.5117 12.848-6.0469 15.871-12.09 3.0234-6.0469 3.0234-13.602 0.75391-19.648l-48.367-108.07 72.547-62.723c4.543-3.7891 7.5664-11.344 6.8125-18.902zm-302.29-399.02c74.816 0 135.27 60.457 135.27 135.27 0 40.809-46.098 145.1-123.18 278.86-3.7773 6.0469-9.8242 6.8008-12.09 6.8008s-8.3125-0.75391-12.09-6.8008c-77.086-133.76-123.18-238.05-123.18-278.86 0-74.816 60.457-135.27 135.27-135.27zm179.11 457.96c-7.5586 6.8008-9.8242 17.383-6.0469 26.449l43.832 97.488-207.07 42.32-259.21-142.07 46.098-101.27 109.58-18.895c13.602 25.695 27.961 51.387 41.562 74.816 10.578 18.895 30.23 30.23 52.145 30.23s40.809-11.336 52.145-30.23c17.383-30.23 36.273-63.48 53.656-96.73l133 66.504z" fill={"#fff"}/>
                                    <path d="m687.66 422.41c0-48.367-39.297-87.664-87.664-87.664s-87.664 39.297-87.664 87.664c0.003906 48.363 39.301 87.66 87.664 87.66 48.367 0 87.664-39.297 87.664-87.66zm-129.23 0c0-22.672 18.895-41.562 41.562-41.562 22.672 0 41.562 18.895 41.562 41.562 0.003906 22.672-18.891 41.562-41.562 41.562-22.668 0-41.562-18.137-41.562-41.562z" fill="#fff"/>
                                </Icon>
                                <View className={"zone-text"}>zone {index+1}</View>
                            </View>
                        ))}
                    </Flex>

                </View>
                <View className="play-area play-area-change">
                    <View className="image-mask image-mask-change"></View>
                   {playZone.map((zone,index) => (
                       <View aria-label={keyID(zone.id,"zone")} key={keyID(zone.id,"zone")} className={(zoneVisible==zone.id)? "image-holder image-holder-change show" : "hide"} backgroundImage={backgroundImage(zone.gameZoneImage)}>
                       </View>
                   ))}
                   <View className={"game-container-top"}>
                       {zoneName}
                   </View>
                   <View className={"clue-sidebar"}>
                   {gameClues.map((clue,index) => (
                       <View ariaLabel={clue.gameClueName} key={keyID(clue.id,"clue")}
                             className={(zoneVisible==clue.gamePlayZoneID)? "" : "hide"}
                             onClick={() => goToClueDetail({
                                 gameClueName: clue.gameClueName,
                                 gameClueText: clue.gameClueText,
                                 gameClueImage: clue.gameClueImage
                             })}
                       >
                           {(zoneVisible==clue.gamePlayZoneID)?
                               <IconClueDisplay index={index} hide="false" /> :
                               <IconClueDisplay index={index} hide="true" />
                           }

                       </View>
                   ))}
                   </View>
                   <View className={"game-container-bottom"}>
                        <Button  className="quit-button dark" onClick={() => isModalHintOpen? setIsModalHintOpen(false) : setIsModalHintOpen(true)}>Hints</Button>
                        <Button  className={isChecked? "quit-button dark" : "help-button light"} onClick={() => isModalHelpOpen? setIsModalHelpOpen(false) : setIsModalHelpOpen(true)}>
                            Help
                        </Button><br />
                   </View>
                   <View className={"puzzle-sidebar"}>
                   {gamePuzzles.map((puzzle,index) => (
                       <View key = {puzzle.id} >
                           <View className={(zoneVisible==puzzle.gamePlayZoneID)? "puzzle-holder-bottom" : "hide"}>
                               <View>
                                   {/* if clue or wingame */}
                                   {gamePuzzleSolved[puzzle.id] ? (
                                       <View onClick={() => goToPuzzleClue({
                                           textField: puzzle.textField.items,
                                           puzzleID: puzzle.id
                                       })}
                                             className={gamePuzzleSolved[puzzle.id]? "show puzzle-item" : "hide"} >
                                            <IconPuzzleDisplayOpen index={index} />
                                       </View>

                                   ):(
                                       <View onClick={() => goToPuzzleDetail({
                                                 textField: puzzle.textField.items,
                                                 puzzleID: puzzle.id
                                             })}
                                             className={gamePuzzleSolved[puzzle.id]? "hide" : "show puzzle-item"} >
                                           <IconPuzzleDisplay index={index}/>
                                       </View>
                                   )}
                               </View>

                               {/*<Image src={puzzle.puzzleObjectClue} onClick={()=>setGamePuzzleVisibleFunction(["puzzle" + (puzzle.id)], true)} className={gamePuzzleSolved[puzzle.id]? "show clue-on-puzzle" : "hide"} />
                                <Image className={(gamePuzzleSolved[puzzle.id] && puzzle.puzzleObjectClue != "")? "puzzle-object-tool show" : "hide"} src={puzzle.puzzleClueRevealed} onClick={()=>setGamePuzzleClueVisibleFunction(["puzzle" + (puzzle.id)], true)} />*/}
                               {(puzzle.winGame && puzzle.puzzleToolRevealed != "")? (
                                       <Image className={(gamePuzzleSolved[puzzle.id])? "puzzle-object-tool show" : "hide"} src={puzzle.puzzleToolRevealed} />
                                   ):
                                   (
                               <Image className={(gamePuzzleSolved[puzzle.id] && toolVisible[puzzle.puzzleToolRevealed])? "puzzle-object-tool yellow-border show" : "hide"} src={tool[puzzle.puzzleToolRevealed]} onClick={()=>objectInBackpackFunction(puzzle.puzzleToolRevealed)} />
                                   )}
                               {/* haven't finished yet... showing clue icon that opens a picture .. will do later*/
                                   (puzzle.winGame && puzzle.puzzleClueText != "")? (

                                       <Image className={(gamePuzzleSolved[puzzle.id])? "puzzle-object-tool show" : "hide"} src={puzzle.puzzleToolRevealed} />
                                   ):
                                   (
                                       <Image className={(gamePuzzleSolved[puzzle.id] && toolVisible[puzzle.puzzleToolRevealed])? "puzzle-object-tool yellow-border show" : "hide"} src={tool[puzzle.puzzleToolRevealed]} onClick={()=>objectInBackpackFunction(puzzle.puzzleToolRevealed)} />
                                   )}
                           </View>
                           <View className={gamePuzzleVisible["puzzleVisible-" + (puzzle.id)]? "cover-screen show-gradual" : "cover-screen hide-gradual"}>
                               <View className={isChecked? "all-screen dark" : "all-screen light"}>
                                   <Button  className={isChecked? "close-button dark" : "close-button light"}  onClick={()=>setGamePuzzleVisibleFunction(["puzzleVisible-" + (puzzle.id)], false)}>X</Button>
                                   <Heading level={"6"} className={isChecked? "heading dark" : "heading light"} paddingTop="10px">{puzzle.gameClueName}</Heading>
                                   <View paddingTop="10px" className={gamePuzzleSolved[puzzle.id]? "hide" : "show"}>
                                       {puzzle.textField.items.map((field,index) => (
                                           <Flex
                                               direction="row"
                                               justifyContent="flex-start"
                                               alignItems="flex-start"
                                               alignItems="center"
                                               wrap="nowrap"
                                               gap="1rem"
                                               key={field.id}>
                                               {gamePuzzleGuess.hasOwnProperty(field.id) ?
                                                   (<TextField
                                                       className={isChecked? "puzzleTextField light-label" : 'puzzleTextField dark-label '}
                                                       label={field.label}
                                                       value={gamePuzzleGuess[field.id]}
                                                       onChange={(event) => setGamePuzzleGuessFunction(field.id, event.target.value, field.answer, puzzle.id, puzzle.puzzleToolRevealed, puzzle.winGame)}
                                                   />) : (
                                                       <TextField
                                                           className={isChecked? "puzzleTextField light-label" : 'puzzleTextField dark-label '}
                                                           label={field.label}
                                                           value=""
                                                           onChange={(event) => setGamePuzzleGuessFunction(field.id, event.target.value, field.answer, puzzle.id, puzzle.puzzleToolRevealed, puzzle.winGame)}
                                                       />)
                                               }
                                               { (gamePuzzleAnswerCorrect[field.id]  && gamePuzzleAnswer[field.id] != null && gamePuzzleGuess[field.id] != null) ? (
                                                   <View className="right-answer">
                                                       <Icon
                                                           height={"20px"}
                                                           width={"20px"}
                                                           ariaLabel="CheckMark"
                                                           viewBox={{ minX: 0,
                                                               minY: 0,
                                                               width: 500,
                                                               height: 500 }}
                                                           paths={[
                                                               {
                                                                   d: "m7.7,404.6c0,0 115.2,129.7 138.2,182.68l99,0c41.5-126.7 202.7-429.1 340.92-535.1c28.6-36.8-43.3-52-101.35-27.62-87.5,36.7-252.5,317.2-283.3,384.64-43.7,11.5-89.8-73.7-89.84-73.7z",
                                                                   fill:"#6c4",
                                                               },
                                                           ]}
                                                       />
                                                   </View>
                                               ) : (<View className="right-answer"></View>)
                                               }
                                           </Flex>
                                       ))}

                                   </View>

                                   <Flex className="window-button-bottom" justifyContent="center" gap="1rem">
                                       <Button className={isChecked? "close dark" : "close light"} onClick={()=>setGamePuzzleVisibleFunction(["puzzleVisible-" + (puzzle.id)], false)}>close puzzle</Button>
                                   </Flex>
                               </View>
                           </View>

                           <View className={gamePuzzleClueVisible["puzzle" + (puzzle.id)]? "cover-screen show-gradual" : "cover-screen hide-gradual"}>
                               <View className={isChecked? "all-screen " : "all-screen light-dark"}>

                                   <Button  className={isChecked? "close-button " : "close-button light-dark"}  onClick={()=>setGamePuzzleClueVisibleFunction(["puzzle" + (puzzle.id)], false)}>X</Button>
                                   <Heading level={"6"} className={isChecked? "heading dark" : "heading light"} paddingTop="10px">{puzzle.gameClueName}</Heading>

                                   <View paddingTop="10px" className={(gamePuzzleSolved[puzzle.id] && puzzle.puzzleClueText != "")? "show" : "hide"}>
                                       {puzzle.puzzleClueText}
                                       <Flex className="window-button-bottom" justifyContent="center" gap="1rem">
                                           <Button className="button small" onClick={()=>setCluesFunction("<strong>" + clue.gameClueName + " </strong> ==> " +
                                               clue.gameClueText + " <br />")}>add clue to notes</Button>
                                           <Button className="button action-button small" onClick={()=>setGamePuzzleClueVisibleFunction(["puzzle" + (puzzle.id)], false)}>close </Button>
                                       </Flex>
                                   </View>

                               </View>
                           </View>

                       </View>
                   ))}
                   </View>
                   <View className="right-side"></View>
                </View>
                {/* end play area */}
                <View className={"notes-area"}>
                    <View ariaLabel="Time" className="time time-change">
                        <View className="small">hint time: {gameTimeHint} mins | time started: {realTimeStart ? format(realTimeStart, "MM/dd/yy h:mma") : null}

                            {/* | <ToggleButton
                                className={isChecked? "dark-light-toggle dark-toggle" : "dark-light-toggle light"}
                                isPressed={isChecked}
                                onChange={() => setIsChecked(!isChecked)}
                            >
                            <Icon
                                    height={"25px"}
                                    width={"25px"}
                                    ariaLabel="Sun"
                                    viewBox={{ minX: 0,
                                        minY: 0,
                                        width: 64,
                                        height: 64 }}
                                    paths={[
                                        {
                                            d: 'M36.4 20.4a16 16 0 1 0 16 16 16 16 0 0 0-16-16zm0 28a12 12 0 0 1-10.3-5.8l2.5.3A13.7 13.7 0 0 0 42 25.8a12 12 0 0 1-5.6 22.6z',
                                            stroke: '#202020',
                                        },
                                        {
                                            d: 'M36.4 16.4a2 2 0 0 0 2-2v-8a2 2 0 1 0-4 0v8a2 2 0 0 0 2 2zm-20 20a2 2 0 0 0-2-2h-8a2 2 0 0 0 0 4h8a2 2 0 0 0 2-2zm3-14.1a2 2 0 0 0 2.8-2.8l-5.7-5.7a2 2 0 0 0-2.8 2.8zM59 13.8a2 2 0 0 0-2.8 0l-5.7 5.7a2 2 0 1 0 2.8 2.8l5.7-5.7a2 2 0 0 0 0-2.8zM19.4 50.5l-5.7 5.7a2 2 0 1 0 2.9 2.8l5.7-5.7a2 2 0 1 0-2.8-2.8z',
                                            stroke: '#202020',
                                        },
                                    ]}
                                />
                            </ToggleButton>*/}
                        </View>

                    </View>
                    <View className={isWinnerScreenVisible? "cover-screen show-gradual" : "cover-screen hide"}>
                        <View className="all-screen dark">
                            <View className="black-box">
                                <strong>WINNER!</strong>
                                <View marginBottom={"10px"}>{game.gameWinMessage}</View>
                                <Image height="100px" src={game.gameWinImage} />
                                <View color="white">Total Time: {gameTimeTotal} minutes</View>
                                <View color="white">Hint Time: {gameTimeHint} minutes </View>

    <hr />
                                <Flex   direction="column"
                                        justifyContent="flex-start"
                                        alignItems="center"
                                        alignContent="flex-start"
                                        wrap="nowrap"
                                        gap=".4em" marginBottom={"10px"} className={"flex-container"}>

                                    <Heading level={"6"} className={"heading"} paddingTop="5px" paddingBottom={"5px"}>Did you like Game?</Heading>
                                    <ToggleButtonGroup
                                        value={exclusiveValue1}
                                        onChange={(value) => {setGameCommentsFunction("like",value);setExclusiveValue1(value)}}
                                        isExclusive
                                        id={"1"}
                                    >
                                        <ToggleButton value="yes">
                                            Yes
                                        </ToggleButton>
                                        <ToggleButton value="no">
                                           No
                                        </ToggleButton>
                                        <ToggleButton value="a little">
                                            a little
                                        </ToggleButton>
                                    </ToggleButtonGroup>


                                    <Heading level={"6"} className={"heading"} paddingTop="5px" paddingBottom={"5px"}>Was it Fun?</Heading>
                                    <ToggleButtonGroup
                                        value={exclusiveValue2}
                                        onChange={(value) => {setGameCommentsFunction("fun",value);setExclusiveValue2(value)}}
                                        isExclusive
                                        id={"1"}
                                    >
                                        <ToggleButton value="it was fun">
                                           it was fun
                                        </ToggleButton>
                                        <ToggleButton value="not fun">
                                            not fun
                                        </ToggleButton>
                                        <ToggleButton value="a little">
                                          a little
                                        </ToggleButton>
                                    </ToggleButtonGroup>


                                    <Heading level={"6"} className={"heading"} paddingTop="5px" paddingBottom={"5px"}>Was it Hard?</Heading>
                                    <ToggleButtonGroup
                                        value={exclusiveValue3}
                                        onChange={(value) => {setGameCommentsFunction("Hard",value);setExclusiveValue3(value)}}
                                        isExclusive
                                        id={"2"}
                                    >
                                        <ToggleButton value="too hard">
                                            too hard
                                        </ToggleButton>
                                        <ToggleButton value="just right">
                                            just right
                                        </ToggleButton>
                                        <ToggleButton value="too easy">
                                           too easy
                                        </ToggleButton>
                                    </ToggleButtonGroup>

                                    <Heading level={"6"} className={"heading"} paddingTop="5px" paddingBottom={"5px"}>Would you play another?</Heading>
                                    <ToggleButtonGroup
                                        value={exclusiveValue4}
                                        onChange={(value) => {setGameCommentsFunction("another",value);setExclusiveValue4(value)}}
                                        isExclusive
                                        id={"2"}
                                    >
                                        <ToggleButton value="too hard">
                                           YES!
                                        </ToggleButton>
                                        <ToggleButton value="just right">
                                           never
                                        </ToggleButton>
                                        <ToggleButton value="too easy">
                                            maybe
                                        </ToggleButton>
                                    </ToggleButtonGroup>
                                    <Heading level={"6"} className={"heading"} paddingTop="5px" paddingBottom={"5px"}>Can I contact you for more feedback?</Heading>

                                    <ToggleButtonGroup
                                        value={exclusiveValue5}
                                        onChange={(value) => {setGameCommentsFunction("contact-you",value);setExclusiveValue5(value)}}
                                        isExclusive
                                        id={"2"}
                                    >
                                        <ToggleButton value="Yes!">
                                            YES!
                                        </ToggleButton>
                                        <ToggleButton value="never">
                                            never
                                        </ToggleButton>

                                    </ToggleButtonGroup>

                                    {/*<RadioGroupField className="comments" legend="Did You Like Game?" name="likeGame" onChange={(e) => setGameCommentsFunction("likeGame",e.currentTarget.value)}>
                                        <Radio value="Yes">Yes</Radio>
                                        <Radio value="No">No</Radio>
                                        <Radio value="a little">a little</Radio>
                                    </RadioGroupField>
                                    <RadioGroupField legend="Would you play another?" name="playAnother"  onChange={(e) => setGameCommentsFunction("playAnother",e.currentTarget.value)}>
                                        <Radio value="Yes">Yes</Radio>
                                        <Radio value="No">No</Radio>
                                        <Radio value="Maybe">Maybe</Radio>
                                    </RadioGroupField>
                                </Flex>
                                <Flex   direction="row"
                                        justifyContent="flex-start"
                                        alignItems="stretch"
                                        alignContent="flex-start"
                                        wrap="nowrap"
                                        gap="1rem" marginBottom={"10px"} className={"flex-container"}>
                                    <RadioGroupField className="custom-radio" legend="Was it Too Hard?" name="tooHard" onChange={(e) => setGameCommentsFunction("tooHard",e.currentTarget.value)}>
                                        <Radio value="Yes">Yes</Radio>
                                        <Radio value="No">No</Radio>
                                        <Radio value="a little">a little</Radio>
                                    </RadioGroupField>
                                    <RadioGroupField legend="Was it Fun?" name="fun"  onChange={(e) => setGameCommentsFunction("fun",e.currentTarget.value)}>
                                        <Radio value="Yes">Yes</Radio>
                                        <Radio value="No">No</Radio>
                                        <Radio value="Maybe">Maybe</Radio>
                                    </RadioGroupField>*/}

                                <TextAreaField
                                    rows="2"
                                    onChange={(e) => setGameCommentsFunction("textAreaField",e.currentTarget.value)}
                                    descriptiveText="Any Issues or Problems?  Suggestions for improvement?"
                                />
                                </Flex>
                                <Flex marginTop={"20px"} justifyContent="center" gap="1rem">
                                    <Button className="button small" onClick={() => updateGameScoreCommentsFunction(true)}>Submit Comment</Button>
                                    <Button className="button right-button small" onClick={() => updateGameScoreCommentsFunction(false)}>Back To Game List</Button>
                                </Flex>
                                {/*<Button className="button right-button small" onClick={() => setIsCommentScreenVisible(true)}>Back To Game List</Button>*/}

                            </View>

                        </View>
                    </View>
                    <View className={isCommentScreenVisible? "cover-screen show-gradual" : "cover-screen hide"}>
                        <View className={isChecked? "all-screen " : "all-screen light-dark"}>
                            <Heading level={"4"} className={"heading light"} paddingTop="10px" paddingBottom={"10px"}>Comments</Heading>

                            <Flex   direction="row"
                                    justifyContent="flex-start"
                                    alignItems="stretch"
                                    alignContent="flex-start"
                                    wrap="nowrap"
                                    gap="1rem" marginBottom={"10px"} className={"flex-container"}>
                                <RadioGroupField legend="Did You Like Game?" name="likeGame" onChange={(e) => setGameCommentsFunction("likeGame",e.currentTarget.value)}>
                                    <Radio value="Yes">Yes</Radio>
                                    <Radio value="No">No</Radio>
                                    <Radio value="a little">a little</Radio>
                                </RadioGroupField>
                                <RadioGroupField legend="Would you play another?" name="playAnother"  onChange={(e) => setGameCommentsFunction("playAnother",e.currentTarget.value)}>
                                    <Radio value="Yes">Yes</Radio>
                                    <Radio value="No">No</Radio>
                                    <Radio value="Maybe">Maybe</Radio>
                                </RadioGroupField>
                            </Flex>
                                <Flex   direction="row"
                                        justifyContent="flex-start"
                                        alignItems="stretch"
                                        alignContent="flex-start"
                                        wrap="nowrap"
                                        gap="1rem" marginBottom={"10px"} className={"flex-container"}>
                                <RadioGroupField legend="Was it Too Hard?" name="tooHard" onChange={(e) => setGameCommentsFunction("tooHard",e.currentTarget.value)}>
                                    <Radio value="Yes">Yes</Radio>
                                    <Radio value="No">No</Radio>
                                    <Radio value="a little">a little</Radio>
                                </RadioGroupField>
                                <RadioGroupField legend="Was it Fun?" name="fun"  onChange={(e) => setGameCommentsFunction("fun",e.currentTarget.value)}>
                                    <Radio value="Yes">Yes</Radio>
                                    <Radio value="No">No</Radio>
                                    <Radio value="Maybe">Maybe</Radio>
                                </RadioGroupField>
                            </Flex>
                            <TextAreaField
                                rows="6"
                                onChange={(e) => setGameCommentsFunction("textAreaField",e.currentTarget.value)}
                                descriptiveText="Any Issues or Problems?  Suggestions for improvement?"
                            />
                            <Flex className="window-button-bottom" justifyContent="center" gap="1rem">
                                <Button className="button small" onClick={() => updateGameScoreCommentsFunction(true)}>Submit Comment</Button>
                                <Button className="button right-button small" onClick={() => updateGameScoreCommentsFunction(false)}>Back To Game List</Button>
                            </Flex>
                        </View>
                    </View>
                    <NotesOpen clues={clues} setClues={setClues} gameNotes={gameNotes} setGameNotes={setGameNotes} setGameNotesFunction={setGameNotesFunction} isChecked={isChecked} setAreNotesVisible={setAreNotesVisible}/>
                </View>
            </View> {/* end game-container */}

                {createPortal(
                <Modal2 show={isModalClueOpen} title={clueDetails} setCluesFunction={setCluesFunction} modalClass={"from-left"} close={ToggleClue}>
                        <View className={isChecked? "dark" : "light"}>
                            <View  dangerouslySetInnerHTML={ {__html: DangerouslySetInnerHTMLSanitized(clueDetails.gameClueText)}} paddingTop="10px"></View>
                            {(clueDetails.gameClueImage != "" && clueDetails.gameClueImage != null)?
                                (
                                    <Image src={clueDetails.gameClueImage} />

                                ):(null)}

                        </View>
                    </Modal2>,
                    document.getElementById("modal")
                )}

            {createPortal(
                <Modal3 show={isModalPuzzleOpen} modalClass={"from-left"} close={TogglePuzzle}>
                    <View className={isChecked? "dark" : "light"}>
                        <View paddingTop="10px" className={gamePuzzleSolved[puzzleID]? "hide" : "show"}>
                            {puzzleTextFields.map((field,index) => (
                                <Flex
                                    direction="row"
                                    justifyContent="flex-start"
                                    alignItems="flex-start"
                                    alignItems="center"
                                    wrap="nowrap"
                                    gap="1rem"
                                    key={field.id}>
                                    {gamePuzzleGuess.hasOwnProperty(field.id) ?
                                        (<TextField
                                            className={isChecked? "puzzleTextField light-label" : 'puzzleTextField dark-label '}
                                            label={field.label}
                                            value={gamePuzzleGuess[field.id]}
                                            onChange={(event) => setGamePuzzleGuessFunction(field.id, event.target.value, field.answer, puzzleID, puzzleWinGame)}
                                        />) : (
                                            <TextField
                                                className={isChecked? "puzzleTextField light-label" : 'puzzleTextField dark-label '}
                                                label={field.label}
                                                value=""
                                                onChange={(event) => setGamePuzzleGuessFunction(field.id, event.target.value, field.answer, puzzleID, puzzleWinGame)}
                                            />)
                                    }
                                    { (gamePuzzleAnswerCorrect[field.id]  && gamePuzzleAnswer[field.id] != null && gamePuzzleGuess[field.id] != null) ? (
                                        <View className="right-answer">
                                            <Icon
                                                height={"20px"}
                                                width={"20px"}
                                                ariaLabel="CheckMark"
                                                viewBox={{ minX: 0,
                                                    minY: 0,
                                                    width: 500,
                                                    height: 500 }}
                                                paths={[
                                                    {
                                                        d: "m7.7,404.6c0,0 115.2,129.7 138.2,182.68l99,0c41.5-126.7 202.7-429.1 340.92-535.1c28.6-36.8-43.3-52-101.35-27.62-87.5,36.7-252.5,317.2-283.3,384.64-43.7,11.5-89.8-73.7-89.84-73.7z",
                                                        fill:"#6c4",
                                                    },
                                                ]}
                                            />
                                        </View>
                                    ) : (<View className="right-answer"></View>)
                                    }
                                </Flex>
                            ))}

                        </View>
                    </View>
                </Modal3>,
                document.getElementById("modal")
            )}

                {/* Modals - use state to show different content or different modals?
                 Help Modal and Hint Modal are similar*/}
                {createPortal(<Modal
                        closeTimeoutMS={200}
                        isOpen={isModalHelpOpen}
                        onRequestClose={closeModalHelp}
                        className={"modalContent"}
                        contentLabel={"Example Modal"}
                        parentSelector={() => document.querySelector('#modal')}
                        preventScroll={
                            false
                            /* Boolean indicating if the modal should use the preventScroll flag when
                               restoring focus to the element that had focus prior to its display. */}
                    >
                        <Button className="close-button light"
                                onClick={closeModalHelp}>X</Button>


                        <Heading level={4} marginBottom="10px">How To Play</Heading>
                        <Accordion.Container allowMultiple defaultValue={['levels']}>
                            <Accordion.Item value="how-to-play">
                                <Accordion.Trigger>
                                    <strong>How to Play?</strong>
                                    <Accordion.Icon/>
                                </Accordion.Trigger>
                                <Accordion.Content>
                                    <View>
                                        <ol className={"how-to-play-bullets"}>
                                            <li>Sign in or create an account with your smartphone:<br/>
                                                <View className="small italics">Currently you can sign in with
                                                    email/password. It's probably best to set an easy password,
                                                    there will be no sensitive data to steal here or you can use
                                                    your google account to sign in.
                                                </View>
                                            </li>
                                            <li>Go To Location.</li>
                                            <li>Select game.</li>
                                            <li>Hit Play, agree to waiver, and select a team name to use as your
                                                team name.
                                            </li>
                                            <li>Start game and solve the puzzles.</li>
                                            <li>The BACK BUTTON is not needed - please do not use.</li>
                                        </ol>
                                    </View>
                                </Accordion.Content>
                            </Accordion.Item>
                            <Accordion.Item value="levels">
                                <Accordion.Trigger>
                                    <strong>Hints</strong>
                                    <Accordion.Icon/>
                                </Accordion.Trigger>
                                <Accordion.Content>
                                    <View>
                                        <View paddingBottom="10px">
                                            <strong>Hints:</strong> Clicking on a Hint Below adds <span
                                            className="italics"> 5 Minutes!</span> Use Hints if you really need them.
                                        </View>
                                        {/* HINTS */}
                                        <hr />
                                        {gameHint.map((hint,index) => (
                                            <Flex wrap="wrap" key={hint.id} ariaLabel={hint.id}>
                                                <View>
                                                    {gameHintVisible["hint" + (hint.id)]? (
                                                        <View backgroundColor={"lightgray"} color={"black"} marginTop={"10px"} padding={"0 5px"}><strong>{hint.gameHintName} - used</strong></View>
                                                    ) : (
                                                        <Button className={"button small"} marginTop={"10px"} onClick={() => setGameHintVisibleFunction(["hint" + (hint.id)], true)}>{hint.gameHintName} - adds 5 minutes</Button>
                                                    )
                                                    }

                                                    <View dangerouslySetInnerHTML={ {__html: DangerouslySetInnerHTMLSanitized(hint.gameHintDescription)}} backgroundColor={"lightgray"}  color={"black"}  padding={"0 10px"} className={gameHintVisible["hint" + (hint.id)]? "show" : "hide"}>
                                                    </View>
                                                </View>
                                            </Flex>
                                        ))}
                                    </View>
                                </Accordion.Content>
                            </Accordion.Item>
                            <Accordion.Item value="About-Games">
                                <Accordion.Trigger>
                                    <strong>About Games</strong>
                                    <Accordion.Icon/>
                                </Accordion.Trigger>
                                <Accordion.Content>
                                    <ul className={"how-to-play-bullets"}>
                                        <li>Our games are played on location with your smartphone.</li>
                                        <li>Gameplay has elements of geocaching, scavenger hunts, and even
                                            escape room style puzzles that involve logic, finding patterns,
                                            deciphering codes, and more.
                                        </li>
                                        <li>Gameplay is limited to a certain walkable area like a public park or
                                            business and surrounding area.
                                        </li>
                                        <li>All information needed to solve puzzles in game are located within
                                            that area except for basic knowledge like reading comprehension and
                                            some math and navigation skills.
                                        </li>
                                        <li>Once you start playing your time starts - time ends when you
                                            complete the game. Your time is your score.
                                        </li>

                                        <li>View the leaderboard on individual game to see best times.</li>
                                    </ul>
                                </Accordion.Content>
                            </Accordion.Item>
                            <Accordion.Item value="group-play">
                                <Accordion.Trigger>
                                    <strong>Group Play vs Individual Play</strong>
                                    <Accordion.Icon/>
                                </Accordion.Trigger>
                                <Accordion.Content>
                                    <View>
                                        Play can be group or individual -
                                        <ul className={"how-to-play-bullets"}>
                                            <li>For individual play, sign in and select a team name that
                                                reflects your individuality.
                                            </li>
                                            <li>For group play, one person signs in and selects the team name
                                                and hits play - the official timed game starts.
                                                The other players can use the same sign in and select the same
                                                game (and it doesn't matter what team name you select - probably
                                                best to choose the same one) because
                                                the only official score is the first time a single sign in (by
                                                email) plays a game.
                                            </li>
                                            <li>That 2nd or 3rd attempt with with same credentials can play a
                                                game multiple times but it does not go on the leaderboard.
                                            </li>
                                            <li>If a group wants to do team play it is best to choose an email
                                                that can be easily verified and an easy password
                                            </li>

                                        </ul>
                                    </View>
                                </Accordion.Content>
                            </Accordion.Item>
                            <Accordion.Item value="play-zones">
                                <Accordion.Trigger>
                                    <strong>What are Play Zones?</strong>
                                    <Accordion.Icon/>
                                </Accordion.Trigger>
                                <Accordion.Content>
                                    <View>
                                        <ul className={"how-to-play-bullets"}>
                                            <li>Play zones indicate the area that the clue references.</li>
                                            <li>Most clues can be solved within a few hundred feet of the play
                                                zone image.
                                            </li>
                                        </ul>
                                    </View>
                                </Accordion.Content>
                            </Accordion.Item>
                            <Accordion.Item value="about-escapeoutgames">
                                <Accordion.Trigger>
                                    <strong>About EscapeOut.Games</strong>
                                    <Accordion.Icon/>
                                </Accordion.Trigger>
                                <Accordion.Content>
                                    <View>

                                        <ul className={"how-to-play-bullets"}>
                                            <li>EscapeOut.Games used to run the Escape Room on Tybee:<br/>
                                                <Link href={"https://escapetybee.com/"} isExternal={true}>Escape
                                                    Tybee</Link> <br/>
                                                - where friends and families had good experiences solving
                                                puzzles together.
                                            </li>
                                            <li>Due to Covid and other factors Escape Tybee closed, but the joy
                                                in creating fun experiences is still a goal so
                                                EscapeOut.games was started.
                                            </li>
                                            <li>EscapeOut.Game's Mission: Getting friends and families outdoors
                                                and having fun experiences solving puzzles together.<br/>
                                                <strong> Any and all feedback is appreciated so this goal can be
                                                    realized.</strong></li>
                                            <li>More information at: <br/>
                                                <Link href={"https://escapeout.games/"}>EscapeOut.games</Link>
                                            </li>
                                        </ul>
                                    </View>
                                </Accordion.Content>
                            </Accordion.Item>
                        </Accordion.Container>
                        <View paddingTop="10px" textAlign={"center"} width={"100%"}>
                            <Button className="close light" onClick={closeModalHelp}>close</Button>
                        </View>
                    </Modal>,
                    document.getElementById("modal")
                )}
                {createPortal(<Modal
                        closeTimeoutMS={200}
                        isOpen={isModalHintOpen}
                        onRequestClose={closeModalHint}
                        className={"modalContent"}
                        contentLabel={"Example Modal"}
                        parentSelector={() => document.querySelector('#modal')}
                        preventScroll={
                            false
                            /* Boolean indicating if the modal should use the preventScroll flag when
                               restoring focus to the element that had focus prior to its display. */}
                    >
                        <Button className="close-button light"
                                onClick={closeModalHint}>X</Button>


                        <Heading level={4} marginBottom="10px">Hints</Heading>

                        <strong>Hints</strong>

                        <View>
                            <View paddingBottom="10px">
                                <strong>Hints:</strong> Clicking on a Hint Below adds <span
                                className="italics"> 5 Minutes!</span> Use Hints if you really need them.
                            </View>
                            {/* HINTS */}
                            <hr />
                            {gameHint.map((hint,index) => (
                                <Flex wrap="wrap" key={hint.id} ariaLabel={hint.id}>
                                    <View>
                                        {gameHintVisible["hint" + (hint.id)]? (
                                            <View backgroundColor={"lightgray"} color={"black"} marginTop={"10px"} padding={"0 5px"}><strong>{hint.gameHintName} - used</strong></View>
                                        ) : (
                                            <Button className={"button small"} marginTop={"10px"} onClick={() => setGameHintVisibleFunction(["hint" + (hint.id)], true)}>{hint.gameHintName} - adds 5 minutes</Button>
                                        )
                                        }

                                        <View dangerouslySetInnerHTML={ {__html: DangerouslySetInnerHTMLSanitized(hint.gameHintDescription)}} backgroundColor={"lightgray"}  color={"black"}  padding={"0 10px"} className={gameHintVisible["hint" + (hint.id)]? "show" : "hide"}>
                                        </View>
                                    </View>
                                </Flex>
                            ))}
                        </View>

                        <View paddingTop="10px" textAlign={"center"} width={"100%"}>
                            <Button className="close light" onClick={closeModalHint}>close</Button>
                        </View>
                    </Modal>,
                    document.getElementById("modal")
                )}

               <View className={isAlertVisible ? "alert-container show" : "hide"}>
                    <div className='alert-inner'>{alertText}</div>
               </View>
               <View className={isGoHomeQuitVisible ? "alert-container show" : "hide"}>
                    <div className='alert-inner'>Do You Really Want To Quit?<br />
                    <Button marginRight={"10px"} className="button button-small quit-button-alert " onClick={()=>{setIsGoHomeQuitVisible(false);goHomeQuit(navigate)}}>Yes, I Want Quit</Button>
                    <Button marginRight={"10px"} className="button button-small quit-button-alert" onClick={()=>{setIsGoHomeQuitVisible(false)}}>No, I Want to Play</Button>
                    </div>
               </View>

                <View className={isMapVisible ? "cover-screen show-gradual" : "cover-screen hide-gradual"}>
                    <View height="400px" className={isChecked? "all-screen dark" : "all-screen light"}>
                        <Button className={isChecked? "close-button dark" : "close-button light"}
                                 onClick={() => isMapVisible ? setIsMapVisible(false) : setIsMapVisible(true)}>X</Button>
                        <View width="100%" padding="50px 10px">
                            <Image maxHeight="400px"
                                   src={game.gameMap}/>

                            <View width="100%" textAlign='center'>
                                <Button className={isChecked? "close dark" : "close light"}  marginTop={"10px"}
                                        onClick={() => isMapVisible ? setIsMapVisible(false) : setIsMapVisible(true)}>close</Button>

                            </View>
                        </View>
                    </View>
                </View>


        </View>
    )
}
