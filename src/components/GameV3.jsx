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
    goHomeQuit, removeLocalStorage, setCommentsFunction,
} from "./helper";
import { format } from 'date-fns'
import {shallowEqual} from "./ShallowEqual";
import {ToolObject, NotesOpen, CommentWindow} from "./sharedComponents";
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
    const [clues, setClues] = useState("");
    const [gameClueVisible, setGameClueVisible] = useState({});
    const [gamePuzzleImageOpen, setGamePuzzleImageOpen] = useState({});
    const [gamePuzzleVisible, setGamePuzzleVisible] = useState({});
    const [gamePuzzleClueVisible, setGamePuzzleClueVisible] = useState({});
    const [gameTopClues, setGameTopClues] = useState([]);
    const [gameTopRightClues, setGameTopRightClues] = useState([]);
    const [gameBottomClues, setGameBottomClues] = useState([]);
    const [gameBottomPuzzle, setGameBottomPuzzle] = useState([]);
    const [gameTopPuzzle, setGameTopPuzzle] = useState([]);
    const [gamePuzzle, setGamePuzzle] = useState([]);
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
                    let gameClueTopArray = gamesFromAPI.gameClue.items.filter(clue => clue.gameCluePosition === "top")
                        .sort((a, b) => {
                        return a.order - b.order;
                    });
                    setGameTopClues(gameClueTopArray);
                    console.log("gameClueTopArray: " + gameClueTopArray);
                    let gameClueBottomArray = gamesFromAPI.gameClue.items.filter(clue => clue.gameCluePosition === "bottom")
                        .sort((a, b) => {
                            return a.order - b.order;
                        });
                    setGameBottomClues(gameClueBottomArray);
                    let gameClueTopRightArray = gamesFromAPI.gameClue.items.filter(clue => clue.gameCluePosition === "tRight")
                        .sort((a, b) => {
                            return a.order - b.order;
                        });
                    setGameTopRightClues(gameClueTopRightArray);
                }
                /* set up game Puzzle: */
                setGamePuzzle(gamesFromAPI.gamePuzzle.items);
                console.log("gamePuzzle.length: "  + gamesFromAPI.gamePuzzle.items.length);
                if (gamesFromAPI.gamePuzzle.items.length > 0) {
                    console.log("setGameBottomPuzzle: " + JSON.stringify(gamesFromAPI.gamePuzzle.items));
                    /* filter by position */
                    let gameBottomPuzzleArray = gamesFromAPI.gamePuzzle.items.filter(puzzle => puzzle.puzzlePosition === "bottom")
                        .sort((a, b) => {
                            return a.order - b.order;
                        });
                    setGameBottomPuzzle(gameBottomPuzzleArray);
                    let gameTopPuzzleArray = gamesFromAPI.gamePuzzle.items.filter(puzzle => puzzle.puzzlePosition === "top")
                        .sort((a, b) => {
                            return a.order - b.order;
                        });
                    setGameTopPuzzle(gameTopPuzzleArray);
                    /* gamePuzzleSolved set in localStorage above */

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
                    let gameClueTopArray = gamesFromAPI.gameClue.items.filter(clue => clue.gameCluePosition === "top")
                        .sort((a, b) => {
                            return a.order - b.order;
                        });
                    setGameTopClues(gameClueTopArray);
                    console.log("gameClueTopArray: " + gameClueTopArray);
                    let gameClueBottomArray = gamesFromAPI.gameClue.items.filter(clue => clue.gameCluePosition === "bottom")
                        .sort((a, b) => {
                            return a.order - b.order;
                        });
                    setGameBottomClues(gameClueBottomArray);
                    let gameClueTopRightArray = gamesFromAPI.gameClue.items.filter(clue => clue.gameCluePosition === "tRight")
                        .sort((a, b) => {
                            return a.order - b.order;
                        });
                    setGameTopRightClues(gameClueTopRightArray);
                }
                /* set up game Puzzle: */
                setGamePuzzle(gamesFromAPI.gamePuzzle.items);
                console.log("gamePuzzle.length: "  + gamesFromAPI.gamePuzzle.items.length);
                if (gamesFromAPI.gamePuzzle.items.length > 0) {
                    console.log("setGameBottomPuzzle: " + JSON.stringify(gamesFromAPI.gamePuzzle.items));
                    /* filter by position */
                    let gameBottomPuzzleArray = gamesFromAPI.gamePuzzle.items.filter(puzzle => puzzle.puzzlePosition === "bottom")
                        .sort((a, b) => {
                            return a.order - b.order;
                        });
                    setGameBottomPuzzle(gameBottomPuzzleArray);
                    let gameTopPuzzleArray = gamesFromAPI.gamePuzzle.items.filter(puzzle => puzzle.puzzlePosition === "top")
                        .sort((a, b) => {
                            return a.order - b.order;
                        });
                    setGameTopPuzzle(gameTopPuzzleArray);
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
    function setGamePuzzleGuessFunction(textFieldID, guess, answer, puzzleID, puzzleToolRevealed, winGame) {
        console.log("setPuzzleGuessFunction - puzzleTool: " + puzzleToolRevealed);
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
                console.log("gamePuzzle.length: " + gamePuzzle.length);
                for (let i = 0; i < gamePuzzle.length; i++) {
                    console.log("gamePuzzle.length[i].id: " + gamePuzzle[i].id + " | puzzleID: " + puzzleID);
                    /* find which puzzle */
                    if (gamePuzzle[i].id == puzzleID) {
                        /* check if all correct --> textfields have unique ids */
                        const allCorrectArray = [];
                        let textFieldLength = gamePuzzle[i].textField.items.length;
                        console.log("gamePuzzle[i].textField.items.length: " + textFieldLength);
                        if (textFieldLength > 1) {
                            for (let j = 0; j < gamePuzzle[i].textField.items.length; j++) {
                                let key = gamePuzzle[i].textField.items[j].id;
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
                            console.log("close puzzle window: " + puzzleToolRevealed);
                            /* close notes */
                            setAreNotesVisible(false);
                            /* set toolVisible */
                            setToolVisible({...toolVisible, [puzzleToolRevealed]: true});
                            setTimeout(() => {
                                setGamePuzzleVisibleFunction("puzzleVisible-" + puzzleID, false);
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

    const [modalIsOpen, setIsOpen] = React.useState(false);
    const [clueDetails, setClueDetails] = useState({});
    function openModal() {
        console.log("modal is open");
        setIsOpen(true);
    }
    function closeModal() {
        setIsOpen(false);
        setIsHelpVisible(false);
    }
    function goToClueDetail(clueDetails) {
        /* set states */
        console.log("goToClueDetail: ");
        setClueDetails(clueDetails);
        setIsOpen(true);
    }
    let zoneColor = "red";
    return (
        <View position="relative" height="100%">
            <View className={isChecked? "game-container dark" : "game-container light"}>
                <View className="top-bar top-bar-change">
                    <Flex className="zone-holder zone-holder-change"
                          direction="row"
                          justifyContent="flex-start"
                          alignItems="flex-start"
                          alignContent="center"
                          wrap="nowrap"
                          gap="1rem">
                        {playZone.map((zone,index) => (
                            <View className={(zoneVisible==zone.id)? "zone-border show" : "show"} paddingBottom="10px" key={zone.id} ariaLabel={zone.id} position={"relative"} height={"50xp"} width={"50px"} onClick={() => setZoneVisibleFunction(zone.id, zone.gameZoneName)}>

                                <Icon ariaLabel="Zone Icon"
                                      viewBox={{ width: 1200, height: 1200 }}
                                        width="50px" height="50px"

                                >
                                    <path d="m902.29 686.15c-0.75391-7.5586-5.2891-14.359-12.848-17.383l-163.23-82.371c31.738-64.992 55.922-126.96 55.922-163.99 0-99.754-81.617-181.37-181.37-181.37-99.754 0-181.37 81.617-181.37 181.37 0 40.809 29.473 111.85 65.746 184.39l-107.31 18.137c-7.5586 1.5117-13.602 6.0469-17.383 12.848l-59.703 131.5c-5.2891 10.578-0.75391 24.184 9.8242 29.473l284.9 156.43c3.7773 1.5117 7.5586 3.0234 11.336 3.0234 1.5117 0 3.0234 0 4.5352-0.75391l243.34-49.879c6.8008-1.5117 12.848-6.0469 15.871-12.09 3.0234-6.0469 3.0234-13.602 0.75391-19.648l-48.367-108.07 72.547-62.723c4.543-3.7891 7.5664-11.344 6.8125-18.902zm-302.29-399.02c74.816 0 135.27 60.457 135.27 135.27 0 40.809-46.098 145.1-123.18 278.86-3.7773 6.0469-9.8242 6.8008-12.09 6.8008s-8.3125-0.75391-12.09-6.8008c-77.086-133.76-123.18-238.05-123.18-278.86 0-74.816 60.457-135.27 135.27-135.27zm179.11 457.96c-7.5586 6.8008-9.8242 17.383-6.0469 26.449l43.832 97.488-207.07 42.32-259.21-142.07 46.098-101.27 109.58-18.895c13.602 25.695 27.961 51.387 41.562 74.816 10.578 18.895 30.23 30.23 52.145 30.23s40.809-11.336 52.145-30.23c17.383-30.23 36.273-63.48 53.656-96.73l133 66.504z" fill={"#fff"}/>
                                    <path d="m687.66 422.41c0-48.367-39.297-87.664-87.664-87.664s-87.664 39.297-87.664 87.664c0.003906 48.363 39.301 87.66 87.664 87.66 48.367 0 87.664-39.297 87.664-87.66zm-129.23 0c0-22.672 18.895-41.562 41.562-41.562 22.672 0 41.562 18.895 41.562 41.562 0.003906 22.672-18.891 41.562-41.562 41.562-22.668 0-41.562-18.137-41.562-41.562z" fill="#fff"/>
                                </Icon>
                                <View position={"absolute"} bottom="0px" left={"0"} width={"50px"} textAlign={"center"}>zone {index+1}</View>
                            </View>
                        ))}
                    </Flex>
                    <View className={"right-buttons"}>






                        <Button  className={isChecked? "help-button dark-toggle" : "help-button light"} onClick={() => isHelpVisible? setIsHelpVisible(false) : setIsHelpVisible(true)}>

                            <Icon
                                height={"40px"}
                                width={"40px"}
                                ariaLabel="Help"
                                viewBox={{ minX: 0,
                                    minY: 0,
                                    width: 1200,
                                    height: 1200 }}

                                paths={[
                                    {
                                        d:"m600 269.38c-87.684 0-171.78 34.836-233.79 96.84s-96.84 146.1-96.84 233.79c0 87.688 34.836 171.79 96.84 233.79 62.004 62.004 146.1 96.836 233.79 96.836 87.688 0 171.79-34.832 233.79-96.836 62.004-62.004 96.836-146.1 96.836-233.79-0.09375-87.656-34.957-171.7-96.941-233.68-61.98-61.98-146.02-96.848-233.68-96.941zm0 614.02c-75.16 0-147.24-29.855-200.39-83.004-53.148-53.145-83.004-125.23-83.004-200.39 0-75.16 29.855-147.24 83.004-200.39 53.145-53.148 125.23-83.004 200.39-83.004 75.164 0 147.25 29.855 200.39 83.004 53.148 53.145 83.004 125.23 83.004 200.39-0.082031 75.137-29.965 147.17-83.094 200.3-53.129 53.129-125.16 83.012-200.3 83.094z",
                                        stroke: "#fff",
                                    },
                                    {
                                        d:"m616.86 436.2c-22.074-4.0117-44.855-0.039063-64.266 11.211-19.41 11.254-34.184 29.043-41.676 50.191-2.2461 5.9375-2.0117 12.527 0.65625 18.285 2.6641 5.7578 7.5391 10.203 13.516 12.328 5.9805 2.1289 12.562 1.7578 18.27-1.0234 5.7031-2.7852 10.047-7.7461 12.051-13.766 5.3164-15.09 17.91-26.457 33.461-30.215 15.551-3.7539 31.945 0.61719 43.559 11.617 11.617 11 16.879 27.129 13.977 42.863-2.9023 15.73-13.566 28.926-28.344 35.059-12.555 5.4258-23.219 14.453-30.637 25.941-7.4219 11.492-11.266 24.926-11.043 38.602v9.9414c0 8.4375 4.5 16.234 11.809 20.453 7.3047 4.2188 16.309 4.2188 23.613 0 7.3086-4.2188 11.809-12.016 11.809-20.453v-9.918c-0.16016-4.3242 0.9375-8.5977 3.1602-12.309 2.2227-3.707 5.4727-6.6953 9.3555-8.5938 19.988-8.1719 36.551-22.98 46.898-41.93 10.348-18.953 13.852-40.891 9.9219-62.121-3.4805-18.906-12.617-36.312-26.203-49.91-13.59-13.602-30.984-22.754-49.887-26.254z",
                                        stroke: "#fff",
                                    },
                                    {
                                        d:"m600 694.46c-6.2617 0-12.27 2.4883-16.699 6.918-4.4258 4.4297-6.9141 10.438-6.9141 16.699v23.617c0 8.4375 4.5 16.23 11.809 20.449 7.3047 4.2188 16.309 4.2188 23.613 0 7.3086-4.2188 11.809-12.012 11.809-20.449v-23.617c0-6.2617-2.4883-12.27-6.918-16.699-4.4258-4.4297-10.434-6.918-16.699-6.918z",
                                        stroke: "#fff",
                                    },
                                ]}
                            />
                        </Button>


                    </View>
                </View>

               <View className="play-area play-area-change">

                <View className="image-mask image-mask-change"></View>

                   {playZone.map((zone,index) => (
                       <View aria-label={keyID(zone.id,"zone")} key={keyID(zone.id,"zone")} className={(zoneVisible==zone.id)? "image-holder image-holder-change show" : "hide"} backgroundImage={backgroundImage(zone.gameZoneImage)}></View>
                   ))}

                   {gameBottomClues.map((clue,index) => (
                       <View aria-label={"gameBottomClues: " + clue.gameClueName} key={keyID(clue.id,"clue")} >
                             <View ariaLabel={clue.gameClueName} left={((clue.order-1)*60) + "px"}
                                     className={(zoneVisible==clue.gamePlayZoneID)? "clue-holder-bottom clue-holder-bottom-change" : "hide"}>

                                       <Icon ariaLabel="Clue Icon"
                                             viewBox={{ width: 1200, height: 1200 }}
                                             width="70px" height="70px"
                                             onClick={() => goToClueDetail({
                                                 gameClueName: clue.gameClueName,
                                                 gameClueText: clue.gameClueText,
                                                 gameClueImage: clue.gameClueImage
                                             })}
                                       >
                                           <path d="m407.85 726c0 7.8125-3.1055 15.309-8.6289 20.832-5.5273 5.5273-13.02 8.6289-20.836 8.6289-7.8125 0-15.305-3.1016-20.832-8.6289-5.5234-5.5234-8.6289-13.02-8.6289-20.832s3.1055-15.309 8.6289-20.832c5.5273-5.5273 13.02-8.6289 20.832-8.6289 7.8125 0.007813 15.301 3.1133 20.824 8.6367 5.5234 5.5234 8.6328 13.012 8.6406 20.824zm306.3-60.875c-26.82 26.984-64.262 40.629-102.16 37.223-37.891-3.4023-72.301-23.496-93.887-54.828-21.582-31.332-28.094-70.645-17.77-107.27 10.32-36.617 36.414-66.738 71.184-82.18 0.48437-0.26562 0.98828-0.5 1.5039-0.69922 36.695-15.887 78.711-13.688 113.55 5.9453 34.84 19.633 58.48 54.438 63.895 94.055 5.4141 39.621-8.0234 79.492-36.316 107.75zm-16.691-164.18c-14.895-14.887-33.949-24.91-54.652-28.746-20.703-3.8359-42.086-1.3086-61.32 7.2539-6.168 43.043-27.75 82.383-60.738 110.71 4.9688 33.066 25.504 61.746 55.207 77.098 29.707 15.355 64.977 15.523 94.828 0.45312 29.852-15.074 50.656-43.555 55.938-76.574s-5.6016-66.57-29.262-90.199zm248.38 344.73-51.129 51.129c-5.418 5.3672-12.738 8.3828-20.367 8.3828s-14.949-3.0156-20.371-8.3828l-111.82-111.82v-0.003907c-5.3867-5.4102-8.4141-12.734-8.4141-20.367 0-7.6367 3.0273-14.961 8.4141-20.371l4.7227-4.6055-22.125-22.125c-35.094 24.871-78.117 35.945-120.86 31.109-42.738-4.8359-82.199-25.242-110.85-57.324-28.648-32.086-44.477-73.594-44.465-116.61 0.039062-10.367 0.99219-20.711 2.8438-30.91-8.7969 5.6953-18.223 10.359-28.09 13.895-4.4609 1.4336-8.3555 4.2344-11.133 8.0078-2.7773 3.7734-4.293 8.3281-4.3359 13.012v53.609c0 10.547-5.6289 20.289-14.762 25.562-9.1328 5.2734-20.387 5.2734-29.52 0-9.1328-5.2734-14.758-15.016-14.758-25.562v-53.609c0.13281-16.891 5.4805-33.328 15.305-47.066 9.8281-13.734 23.66-24.105 39.602-29.688 16.754-5.8086 30.938-17.309 40.086-32.496 9.1484-15.191 12.68-33.105 9.9805-50.633-2.7422-17.16-11.195-32.895-23.988-44.656-12.789-11.766-29.176-18.871-46.508-20.168-18.121-1.207-36.078 4.1016-50.629 14.973-14.551 10.871-24.738 26.582-28.719 44.305-1.7109 7.207-6.0703 13.504-12.215 17.645-6.1406 4.1367-13.617 5.8086-20.938 4.6836-7.3242-1.125-13.949-4.9648-18.566-10.758-5.7461-7.1602-7.8398-16.586-5.668-25.504 6.2305-27.07 20.715-51.535 41.445-70.023 24.773-22.191 56.859-34.48 90.121-34.52 33.262-0.039062 65.371 12.18 90.199 34.316 24.824 22.137 40.629 52.645 44.387 85.695 0.83984 7.9805 0.99609 16.02 0.46875 24.031 32.824-26.73 74.223-40.656 116.53-39.203 42.305 1.4492 82.648 18.184 113.56 47.102 30.914 28.918 50.301 68.059 54.57 110.17 4.2695 42.113-6.8711 84.348-31.352 118.88l22.055 22.055 4.7227-4.7227h0.003906c5.4102-5.3867 12.734-8.4102 20.367-8.4102 7.6367 0 14.961 3.0234 20.371 8.4102l111.82 111.82v0.003906c5.3867 5.4102 8.4141 12.734 8.4141 20.367 0 7.6367-3.0273 14.961-8.4141 20.371zm-214.99-163.85c28.414-28.414 44.379-66.953 44.379-107.14 0-40.188-15.965-78.727-44.379-107.14-28.414-28.414-66.953-44.375-107.14-44.375s-78.723 15.961-107.14 44.375c-28.418 28.414-44.379 66.953-44.379 107.14 0 40.184 15.965 78.723 44.379 107.14 28.438 28.371 66.965 44.305 107.14 44.305 40.168 0 78.699-15.934 107.14-44.305z"/>
                                       </Icon>
                             </View>


                       </View>
                   ))}

                   {createPortal(<Modal
                           closeTimeoutMS={200}
                           isOpen={modalIsOpen}
                           onRequestClose={closeModal}
                           className={isChecked? "modalContent dark" : "modalContent light"}
                           contentLabel={"Example Modal"}
                           parentSelector={() => document.querySelector('#modal')}
                           preventScroll={
                               false
                               /* Boolean indicating if the modal should use the preventScroll flag when
                                  restoring focus to the element that had focus prior to its display. */}
                       >
                           <Button className={isChecked? "close-button dark" : "close-button light"} onClick={closeModal}>X</Button>
                           <View className={isChecked? "dark" : "light"}>
                               <Button  className={isChecked? "close-button dark" : "close-button light"}  onClick={closeModal}>X</Button>
                               <Heading level={"6"} className={isChecked? "heading dark" : "heading light"} paddingTop="10px">Clue Name: {clueDetails.gameClueName}</Heading>
                               <View  dangerouslySetInnerHTML={ {__html: DangerouslySetInnerHTMLSanitized(clueDetails.gameClueText)}} paddingTop="10px"></View>
                               {(clueDetails.gameClueImage != "" && clueDetails.gameClueImage != null)?
                                   (
                                       <Image src={clueDetails.gameClueImage} />

                                   ):(null)}
                               <Flex className="window-button-bottom" justifyContent="center" gap="1rem">
                                   <Button className="button button-small" onClick={()=>setCluesFunction("<strong>" + clueDetails.gameClueName + " </strong> ==> " +
                                       clueDetails.gameClueText + " <br />")}>add clue to notes</Button>
                                   <Button className="close light"  onClick={closeModal}>close!</Button>
                               </Flex>
                           </View>

                       </Modal>,
                       document.getElementById("modal")
                   )}
                   {gameTopPuzzle.map(puzzle => (
                       <View key = {puzzle.id} >
                           <View className={(zoneVisible==puzzle.gamePlayZoneID)? "puzzle-holder-top" : "hide"}>
                               {(puzzle.puzzleToolNeeded != '' && puzzle.puzzleToolNeeded != null) ? (
                                   <View>
                                       {(puzzle.puzzleImageOpen != '' && puzzle.puzzleImageOpen != null) ? (
                                           <View>
                                               <Image src = {puzzle.puzzleImage}  className={(backpackObject.hasOwnProperty(puzzle.puzzleToolNeeded) && backpackObject[puzzle.puzzleToolNeeded] === "on")? "clickable" : "hide"} onClick={()=>setGamePuzzleImageOpenFunction(["puzzleImageOpen-" + (puzzle.id)], true)}/>
                                               <Image src = {puzzle.puzzleImage}  className={((backpackObject.hasOwnProperty(puzzle.puzzleToolNeeded) && backpackObject[puzzle.puzzleToolNeeded] === "off") || !backpackObject.hasOwnProperty(puzzle.puzzleToolNeeded))? "clickable" : "hide"} onClick={()=>setAlertTextFunction("object needed")}/>
                                               <Image src = {puzzle.puzzleImageOpen}  className={gamePuzzleImageOpen["puzzleImageOpen-" + (puzzle.id)]? "clickable" : "hide"} onClick={()=>setGamePuzzleVisibleFunction(["puzzleVisible-" + (puzzle.id)], true)}/>
                                           </View>

                                       ):(
                                           <View>
                                               <Image src = {puzzle.puzzleImage}  className={(backpackObject.hasOwnProperty(puzzle.puzzleToolNeeded) && backpackObject[puzzle.puzzleToolNeeded] === "on")? "clickable" : "hide"} onClick={()=>setGamePuzzleClueVisibleFunction(["puzzleClueVisible-" + (puzzle.id)], true)}/>
                                               <Image src = {puzzle.puzzleImage}  className={((backpackObject.hasOwnProperty(puzzle.puzzleToolNeeded) && backpackObject[puzzle.puzzleToolNeeded] === "off") || !backpackObject.hasOwnProperty(puzzle.puzzleToolNeeded))? "clickable" : "hide"} onClick={()=>setAlertTextFunction("object needed")}/>
                                           </View>
                                       )}
                                   </View>
                               ):(
                                   <View>
                                       {/* puzzle tool NOT needed */}
                                       {(puzzle.puzzleImageOpen != '' && puzzle.puzzleImageOpen != null) ? (
                                           <View>
                                               <Image src = {puzzle.puzzleImage}  className={gamePuzzleImageOpen["puzzle" + (puzzle.id)]? "hide" : "clickable"} onClick={()=>setGamePuzzleImageOpenFunction(["puzzleImageOpen-" + (puzzle.id)], true)}/>
                                               <Image src = {puzzle.puzzleImageOpen}  className={gamePuzzleImageOpen["puzzle" + (puzzle.id)]? "clickable" : "hide"} onClick={()=>setGamePuzzleVisibleFunction(["puzzleVisible-" + (puzzle.id)], true)}/>
                                           </View>

                                       ):(
                                           <View>
                                               <Image src={puzzle.puzzleImage} onClick={()=>setGamePuzzleVisibleFunction(["puzzleVisible-" + (puzzle.id)], true)} className={gamePuzzleSolved[puzzle.id]? "hide" : "show puzzle-item"} />
                                           </View>
                                       )}
                                   </View>
                               )}

                               <Image src={puzzle.puzzleImageSolved} className={gamePuzzleSolved[puzzle.id]? "show puzzle-item" : "hide"} />
                               {/*<Image src={puzzle.puzzleObjectClue} onClick={()=>setGamePuzzleVisibleFunction(["puzzle" + (puzzle.id)], true)} className={gamePuzzleSolved[puzzle.id]? "show clue-on-puzzle" : "hide"} />
                                <Image className={(gamePuzzleSolved[puzzle.id] && puzzle.puzzleObjectClue != "")? "puzzle-object-tool show" : "hide"} src={puzzle.puzzleClueRevealed} onClick={()=>setGamePuzzleClueVisibleFunction(["puzzle" + (puzzle.id)], true)} />*/}
                               {puzzle.winGame? (
                                       <Image className={(gamePuzzleSolved[puzzle.id] && puzzle.puzzleToolRevealed != "")? "puzzle-object-tool show" : "hide"} src={puzzle.puzzleToolRevealed} />
                                   ):
                                   (
                                       <Image className={(gamePuzzleSolved[puzzle.id] && puzzle.puzzleToolRevealed != "" && toolVisible[puzzle.puzzleToolRevealed])? "puzzle-object-tool yellow-border show" : "hide"} src={tool[puzzle.puzzleToolRevealed]} onClick={()=>objectInBackpackFunction(puzzle.puzzleToolRevealed)} />
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


                   {gameBottomPuzzle.map(puzzle => (
                       <View key = {puzzle.id} >
                           <View className={(zoneVisible==puzzle.gamePlayZoneID)? "puzzle-holder-bottom" : "hide"}>
                               {(puzzle.puzzleToolNeeded != '' && puzzle.puzzleToolNeeded != null) ? (
                               <View>
                                   {(puzzle.puzzleImageOpen != '' && puzzle.puzzleImageOpen != null) ? (
                                       <View>
                                           <Image src = {puzzle.puzzleImage}  className={(backpackObject.hasOwnProperty(puzzle.puzzleToolNeeded) && backpackObject[puzzle.puzzleToolNeeded] === "on")? "clickable" : "hide"} onClick={()=>setGamePuzzleImageOpenFunction(["puzzleImageOpen-" + (puzzle.id)], true)}/>
                                           <Image src = {puzzle.puzzleImage}  className={((backpackObject.hasOwnProperty(puzzle.puzzleToolNeeded) && backpackObject[puzzle.puzzleToolNeeded] === "off") || !backpackObject.hasOwnProperty(puzzle.puzzleToolNeeded))? "clickable" : "hide"} onClick={()=>setAlertTextFunction("object needed")}/>
                                           <Image src = {puzzle.puzzleImageOpen}  className={gamePuzzleImageOpen["puzzleImageOpen-" + (puzzle.id)]? "clickable" : "hide"} onClick={()=>setGamePuzzleVisibleFunction(["puzzleVisible-" + (puzzle.id)], true)}/>
                                       </View>

                                   ):(
                                   <View>
                                       <Image src = {puzzle.puzzleImage}  className={(backpackObject.hasOwnProperty(puzzle.puzzleToolNeeded) && backpackObject[puzzle.puzzleToolNeeded] === "on")? "clickable" : "hide"} onClick={()=>setGamePuzzleClueVisibleFunction(["puzzleClueVisible-" + (puzzle.id)], true)}/>
                                       <Image src = {puzzle.puzzleImage}  className={((backpackObject.hasOwnProperty(puzzle.puzzleToolNeeded) && backpackObject[puzzle.puzzleToolNeeded] === "off") || !backpackObject.hasOwnProperty(puzzle.puzzleToolNeeded))? "clickable" : "hide"} onClick={()=>setAlertTextFunction("object needed")}/>
                                   </View>
                                   )}
                               </View>
                               ):(
                               <View>
                                   {/* puzzle tool NOT needed */}
                                   {(puzzle.puzzleImageOpen != '' && puzzle.puzzleImageOpen != null) ? (
                                       <View>
                                           <Image src = {puzzle.puzzleImage}  className={gamePuzzleImageOpen["puzzle" + (puzzle.id)]? "hide" : "clickable"} onClick={()=>setGamePuzzleImageOpenFunction(["puzzleImageOpen-" + (puzzle.id)], true)}/>
                                           <Image src = {puzzle.puzzleImageOpen}  className={gamePuzzleImageOpen["puzzle" + (puzzle.id)]? "clickable" : "hide"} onClick={()=>setGamePuzzleVisibleFunction(["puzzleVisible-" + (puzzle.id)], true)}/>
                                       </View>

                                   ):(
                                       <View>
                                           <Image src={puzzle.puzzleImage} onClick={()=>setGamePuzzleVisibleFunction(["puzzleVisible-" + (puzzle.id)], true)} className={gamePuzzleSolved[puzzle.id]? "hide" : "show puzzle-item"} />
                                       </View>
                                   )}
                               </View>
                               )}

                               <Image src={puzzle.puzzleImageSolved} className={gamePuzzleSolved[puzzle.id]? "show puzzle-item" : "hide"} />
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

                   <View className="right-side"></View>


               </View>
                {/* end play area */}
                <View ariaLabel="Time" className="time time-change">
                    <View className="small">hint time: {gameTimeHint} mins | time started: {realTimeStart ? format(realTimeStart, "MM/dd/yy h:mma") : null} |
<Button marginRight={"10px"} className={isChecked? "quit-button dark " : "quit-button light "} onClick={()=>{setIsGoHomeQuitVisible(true)}}>Quit</Button>
                                         | <ToggleButton
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
                        </ToggleButton>
                    </View>

                </View>

                <View className={isWinnerScreenVisible? "cover-screen show-gradual" : "cover-screen hide-gradual"}>
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
                <View className={isCommentScreenVisible? "cover-screen show-gradual" : "cover-screen hide-gradual"}>
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
            {/*(showComment) ? (
                <CommentWindow setGameComments={setGameComments} gameComments={gameComments}/>
            ) : null*/}
                {/*<View className={areNotesVisible ? "cover-screen show-gradual" : "cover-screen hide-gradual"}>
                    <View className={isChecked? "all-screen dark" : "all-screen light"}>
                        <NotesOpen clues={clues} setClues={setClues} gameNotes={gameNotes} setGameNotes={setGameNotes} setGameNotesFunction={setGameNotesFunction} isChecked={isChecked}/>
                        <View width="100%" textAlign='center' paddingTop="10px">
                            {/*<Button className="button small" marginRight={"5px"} onClick={() => {setAreNotesVisibleBottom(true);setAreNotesVisible(false)}}>move notes under game</Button>
                            <Button className={isChecked? "close small dark" : "close small light"} onClick={() => setAreNotesVisible(false)}>close notes</Button>
                         </View>
                    </View>
                </View>*/}
                {areNotesVisible && <NotesOpen clues={clues} setClues={setClues} gameNotes={gameNotes} setGameNotes={setGameNotes} setGameNotesFunction={setGameNotesFunction} isChecked={isChecked} setAreNotesVisible={setAreNotesVisible}/>}

                <View className={/*isHelpVisible ? "cover-screen show-gradual" : "cover-screen hide-gradual"*/"hide"}>
                <View className={isChecked? "all-screen dark" : "all-screen light"}>
                    <Button  className={isChecked? "close-button dark" : "close-button light"}
                            onClick={() => isHelpVisible ? setIsHelpVisible(false) : setIsHelpVisible(true)}>X</Button>
                    <View width="100%" padding="40px 10px">
                        <View paddingBottom="10px">
                            <strong>How to Play:</strong> Click around to open clues and get items. Click on puzzles to solve. If an item is in your backpack click on it to use. Clues on near Play Zone Image (around 100 feet or so)

                        </View>
                        <View paddingBottom="10px">
                            <strong>Game Goals:</strong> {game.gameGoals}
                        </View>
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
                        <hr />
                        <View width="100%" textAlign='center'>
                            <Button className={isChecked? "close dark" : "close light"}  marginTop={"10px"}
                                    onClick={() => isHelpVisible ? setIsHelpVisible(false) : setIsHelpVisible(true)}>close</Button>

                        </View>
                    </View>
                </View>

                </View>
                {createPortal(<Modal
                        closeTimeoutMS={200}
                        isOpen={isHelpVisible}
                        onRequestClose={closeModal}
                        className={"modalContent"}
                        contentLabel={"Example Modal"}
                        parentSelector={() => document.querySelector('#modal')}
                        preventScroll={
                            false
                            /* Boolean indicating if the modal should use the preventScroll flag when
                               restoring focus to the element that had focus prior to its display. */}
                    >
                        <Button className="close-button light"
                                onClick={closeModal}>X</Button>


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
                            <Button className="close light" onClick={closeModal}>close</Button>
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


        </View> {/* end main-container */}


        </View>
    )
}
