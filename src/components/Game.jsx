import React, {useEffect, useState} from "react"
import {Button, View, Image, TextAreaField, TextField, Flex, Heading, Link, Text, SwitchField, Radio, RadioGroupField, Icon,ToggleButton, ToggleButtonGroup} from '@aws-amplify/ui-react';
import {useNavigate} from "react-router-dom";
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

export function Game() {
    const client = generateClient();
    /* for all games */
    const [isChecked, setIsChecked] = useState(false);
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
    const [areNotesVisible, setAreNotesVisible] = useState(false);
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


    useEffect(() => {
        let backpackObjectTest = JSON.stringify(backpackObject);
        console.log("***useEffect***: backpackObject: " +  backpackObjectTest);
        if (backpackObjectTest != "{}" &&  backpackObjectTest != "" &&  backpackObjectTest != null) {
            localStorage.setItem("backpackObject", backpackObjectTest);
        }
    }, [backpackObject]);

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

    function objectInBackpackFunction(key) {
        setToolVisible({...toolVisible, [key]:false});
        setBackpackObject({...backpackObject, [key]:"off"});
        setIsAlertVisible(true);
        setAlertText(key + " is in backpack");
        setTimeout(() => {
            setIsAlertVisible(false);
         }, 3000);
        console.log(key + " is in backpack");
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

    return (
        <View position="relative" height="100%">
            <View className={isChecked? "game-container dark" : "game-container light"}>
                <View className="top-bar">
                    <Flex className="zone-holder"
                          direction="row"
                          justifyContent="flex-start"
                          alignItems="flex-start"
                          alignContent="center"
                          wrap="nowrap"
                          gap="1rem">
                        {playZone.map((zone,index) => (
                            <View key={zone.id} ariaLabel={zone.id}>
                                <Image className={(zoneVisible==zone.id)? "zone-border show" : "show"} src={zone.gameZoneIcon}  onClick={() => setZoneVisibleFunction(zone.id, zone.gameZoneName)} />
                            </View>
                                ))}
                    </Flex>
                    <View className="backpack-holder">
                        <Image src='https://escapeoutbucket213334-staging.s3.amazonaws.com/public/backpack-new.png' onClick={()=>setIsBackpackVisible(true)} />
                    </View>

                </View>

               <View className="play-area">

                <View className="image-mask"></View>

                   {playZone.map((zone,index) => (
                       <View aria-label={keyID(zone.id,"zone")} key={keyID(zone.id,"zone")} className={(zoneVisible==zone.id)? "image-holder show" : "hide"} backgroundImage={backgroundImage(zone.gameZoneImage)}></View>
                   ))}

                   <View className={isBackpackVisible? "cover-screen show-gradual" : "cover-screen hide-gradual"}>
                       <View className={isChecked? "all-screen dark" : "all-screen light"}>
                           <Button className={isChecked? "close-button dark" : "close-button light"} onClick={()=>setIsBackpackVisible(false)}>X</Button>
                           <Heading level={"6"} className={isChecked? "heading dark" : "heading light"} paddingTop="10px">Backpack Contents</Heading>
                           <View paddingTop="10px">
                           {Object.entries(backpackObject).map(([key, value]) => (
                               <View key={key}>

                                   <Image className={(value==="on")? "red-border show" : "hide"} src={tool[key]}
                                          onClick={()=>setBackpackObject({...backpackObject, [key]:"off"})} />
                                   <Image className={(value==="off")? "show" : "hide"} src={tool[key]}
                                          onClick={()=>setBackpackObject({...backpackObject, [key]:"on"})} />
                                  <span className={"small"}>{key}:{value}</span>
                                   <br />

                               </View>
                               ))}
                            </View>
                       </View>
                   </View>

                   {gameTopRightClues.map((clue,index) => (
                       <View aria-label={"gameTopRightClues: " + clue.gameClueName} key={clue.id} ariaLabel={clue.id}>
                           {/* if clue.gameTool then Tool is required and must be turned on and using clue.gameImage for now */
                               (clue.gameClueToolNeeded != '' && clue.gameClueToolNeeded !=null)? (

                                           <View ariaLabel={clue.gameClueName} top={((clue.order-1)*60) + "px"}
                                                 className={(zoneVisible==clue.gamePlayZoneID)? "puzzle-holder-top" : "hide"}>
                                               <Image src = {clue.gameClueIcon}  className={(backpackObject.hasOwnProperty(clue.gameClueToolNeeded) && backpackObject[clue.gameClueToolNeeded] === "on")? "clickable" : "hide"} onClick={()=>setGameClueVisibleFunction(["clue" + (clue.id)], true)}/>
                                               <Image src = {clue.gameClueIcon}  className={((backpackObject.hasOwnProperty(clue.gameClueToolNeeded) && backpackObject[clue.gameClueToolNeeded] === "off") || !backpackObject.hasOwnProperty(clue.gameClueToolNeeded))? "clickable" : "hide"} onClick={()=>setAlertTextFunction("object needed")}/>
                                           </View>

                               ) : (
                                   <View ariaLabel={clue.gameClueName} top={((clue.order-1)*60) + "px"}
                                         className={(zoneVisible==clue.gamePlayZoneID)? "clickable puzzle-holder-top" : "hide"}>
                                       <Image src = {clue.gameClueIcon} onClick={()=>setGameClueVisibleFunction(["clue" + (clue.id)], true)}/>
                                   </View>

                               )


                           }

                           <View className={gameClueVisible["clue" + (clue.id)]? "cover-screen show-gradual" : "cover-screen hide-gradual"}>
                               <View className={isChecked? "all-screen dark" : "all-screen light"}>
                                   <Button className={isChecked? "close-button dark" : "close-button light"} onClick={()=>setGameClueVisibleFunction(["clue" + (clue.id)], false)}>X</Button>
                                   <Heading level={"6"} className={isChecked? "heading dark" : "heading light"} paddingTop="10px">Clue Name: {clue.gameClueName}</Heading>
                                   <View  dangerouslySetInnerHTML={ {__html: DangerouslySetInnerHTMLSanitized(clue.gameClueText)}} paddingTop="10px"></View>
                                   <Flex className="window-button-bottom" justifyContent="center" gap="1rem">
                                       <Button className="button small" onClick={()=>setCluesFunction("<strong>" + clue.gameClueName + " </strong> ==> " +
                                           clue.gameClueText + " <br />")}>add clue to notes</Button>
                                       <Button className={isChecked? "close dark" : "close light"} onClick={()=>setGameClueVisibleFunction(["clue" + (clue.id)], false)}>close clue</Button>
                                   </Flex>
                               </View>
                           </View>
                       </View>
                   ))}
                    {gameTopClues.map((clue,index) => (
                        <View aria-label={"gameBottomClues: " + clue.gameClueName} key={keyID(clue.id,"clue")} >
                            {/* if clue.gameTool then Tool is required and must be turned on and using clue.gameImage for now */
                                (clue.gameClueToolNeeded != '' && clue.gameClueToolNeeded !=null)? (

                                    <View ariaLabel={clue.gameClueName} top={((clue.order-1)*60) + "px"}
                                          className={(zoneVisible==clue.gamePlayZoneID)? "clue-top" : "hide"}>
                                        <Image src = {clue.gameClueIcon}  className={(backpackObject.hasOwnProperty(clue.gameClueToolNeeded) && backpackObject[clue.gameClueToolNeeded] === "on")? "clickable" : "hide"} onClick={()=>setGameClueVisibleFunction(["clue" + (clue.id)], true)}/>
                                        <Image src = {clue.gameClueIcon}  className={((backpackObject.hasOwnProperty(clue.gameClueToolNeeded) && backpackObject[clue.gameClueToolNeeded] === "off") || !backpackObject.hasOwnProperty(clue.gameClueToolNeeded))? "clickable" : "hide"} onClick={()=>setAlertTextFunction("object needed")}/>
                                    </View>

                                ) : (
                                    <View ariaLabel={clue.gameClueName} top={((clue.order-1)*60) + "px"}
                                          className={(zoneVisible==clue.gamePlayZoneID)? "clickable clue-top" : "hide"}>
                                        <Image src = {clue.gameClueIcon} onClick={()=>setGameClueVisibleFunction(["clue" + (clue.id)], true)}/>
                                    </View>

                                )


                            }
                            <View className={gameClueVisible["clue" + (clue.id)]? "cover-screen show-gradual" : "cover-screen hide-gradual"}>
                                <View className={isChecked? "all-screen dark" : "all-screen light"}>
                                    <Button  className={isChecked? "close-button dark" : "close-button light"}  onClick={()=>setGameClueVisibleFunction(["clue" + (clue.id)], false)}>X</Button>
                                    <Heading level={"6"} className={isChecked? "heading dark" : "heading light"} paddingTop="10px">Clue Name: {clue.gameClueName}</Heading>
                                    <View  dangerouslySetInnerHTML={ {__html: DangerouslySetInnerHTMLSanitized(clue.gameClueText)}} paddingTop="10px"></View>
                                    <Flex className="window-button-bottom" justifyContent="center" gap="1rem">
                                        <Button className="button button-small" onClick={()=>setCluesFunction("<strong>" + clue.gameClueName + " </strong> ==> " +
                                            clue.gameClueText + " <br />")}>add clue to notes</Button>
                                        <Button className={isChecked? "close dark" : "close light"} onClick={()=>setGameClueVisibleFunction(["clue" + (clue.id)], false)}>close clue</Button>
                                    </Flex>
                                </View>
                            </View>
                        </View>
                    ))}
                   {gameBottomClues.map((clue,index) => (
                       <View aria-label={"gameTopClues: " + clue.gameClueName} key={keyID(clue.id,"clue")} >
                           {/* if clue.gameTool then Tool is required and must be turned on and using clue.gameImage for now */
                               (clue.gameClueToolNeeded != '' && clue.gameClueToolNeeded !=null)? (

                                   <View ariaLabel={clue.gameClueName} left={((clue.order-1)*60) + "px"}
                                         className={(zoneVisible==clue.gamePlayZoneID)? "clue-holder-bottom" : "hide"}>
                                       <Image src = {clue.gameClueIcon}  className={(backpackObject.hasOwnProperty(clue.gameClueToolNeeded) && backpackObject[clue.gameClueToolNeeded] === "on")? "clickable" : "hide"} onClick={()=>setGameClueVisibleFunction(["clue" + (clue.id)], true)}/>
                                       <Image src = {clue.gameClueIcon}  className={((backpackObject.hasOwnProperty(clue.gameClueToolNeeded) && backpackObject[clue.gameClueToolNeeded] === "off") || !backpackObject.hasOwnProperty(clue.gameClueToolNeeded))? "clickable" : "hide"} onClick={()=>setAlertTextFunction("object needed")}/>
                                   </View>

                               ) : (
                                   <View ariaLabel={clue.gameClueName} left={((clue.order-1)*60) + "px"}
                                         className={(zoneVisible==clue.gamePlayZoneID)? "clickable clue-holder-bottom" : "hide"}>
                                       <Image src = {clue.gameClueIcon} onClick={()=>setGameClueVisibleFunction(["clue" + (clue.id)], true)}/>
                                   </View>

                               )


                           }
                           <View className={gameClueVisible["clue" + (clue.id)]? "cover-screen show-gradual" : "cover-screen hide-gradual"}>
                               <View className={isChecked? "all-screen dark" : "all-screen light"}>
                                   <Button  className={isChecked? "close-button dark" : "close-button light"}  onClick={()=>setGameClueVisibleFunction(["clue" + (clue.id)], false)}>X</Button>
                                   <Heading level={"6"} className={isChecked? "heading dark" : "heading light"} paddingTop="10px">Clue Name: {clue.gameClueName}</Heading>
                                   <View  dangerouslySetInnerHTML={ {__html: DangerouslySetInnerHTMLSanitized(clue.gameClueText)}} paddingTop="10px"></View>
                                   <Flex className="window-button-bottom" justifyContent="center" gap="1rem">
                                       <Button className="button button-small" onClick={()=>setCluesFunction("<strong>" + clue.gameClueName + " </strong> ==> " +
                                           clue.gameClueText + " <br />")}>add clue to notes</Button>
                                       <Button className={isChecked? "close dark" : "close light"} onClick={()=>setGameClueVisibleFunction(["clue" + (clue.id)], false)}>close clue</Button>
                                   </Flex>
                               </View>
                           </View>
                       </View>
                   ))}
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

                   <View className="right-side"></View>


               </View>
                {/* end play area */}
                <View ariaLabel="Time" className="time">
                    <View className="small">hint time: {gameTimeHint} mins | time started: {realTimeStart ? format(realTimeStart, "MM/dd/yy h:mma") : null} </View>
                    <Button marginRight={"10px"} className="button button-small" onClick={() => isHelpVisible? setIsHelpVisible(false) : setIsHelpVisible(true)}>Hints</Button>
                    <Button marginRight={"10px"} className="button button-small"  onClick={() => {setAlertTextFunction("Notes Below"); setAreNotesVisible(true)}}>Notes</Button>
                    <Button marginRight={"10px"} className="button button-small" onClick={() => isMapVisible? setIsMapVisible(false) : setIsMapVisible(true)}>Map</Button>
                    <Button marginRight={"10px"} className="button button-small quit-button"onClick={()=>setIsGoHomeQuitVisible(true)}>Quit</Button>

                    <ToggleButton
                        className={isChecked? "dark-light-toggle dark-toggle" : "dark-light-toggle light"}
                        isPressed={isChecked}
                        onChange={() => setIsChecked(!isChecked)}
                    >
                        <Icon
                            height={"30px"}
                            width={"40px"}
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

            <View className={isHelpVisible ? "cover-screen show-gradual" : "cover-screen hide-gradual"}>
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
                            <strong>Hints:</strong> Clicking on a Hint costs <span
                            className="italics"> 5 Minutes!</span> Use Hints if you really need them.
                        </View>

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
                        <View width="100%" textAlign='center'>
                            <Button className={isChecked? "close dark" : "close light"}  marginTop={"10px"}
                                    onClick={() => isHelpVisible ? setIsHelpVisible(false) : setIsHelpVisible(true)}>close</Button>

                        </View>
                    </View>
                </View>
            </View>

            <View className={isAlertVisible ? "alert-container show" : "hide"}>
                <div className='alert-inner'>{alertText}</div>
            </View>
                <View className={isGoHomeQuitVisible ? "alert-container show" : "hide"}>
                    <div className='alert-inner'>Do You Really Want To Quit?<br />
                    <Button marginRight={"10px"} className="button button-small quit-button"onClick={()=>{setIsGoHomeQuitVisible(false);goHomeQuit(navigate)}}>Yes, I Want Quit</Button>
                    <Button marginRight={"10px"} className="button button-small quit-button"onClick={()=>{setIsGoHomeQuitVisible(false)}}>No, I Want to Play</Button>
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
