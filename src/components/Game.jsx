import React, {useEffect, useState} from "react"
import {Button, View, Image, TextAreaField, TextField, Flex, Heading, Link, Text, SwitchField} from '@aws-amplify/ui-react';
import {useNavigate} from "react-router-dom";
import {
    toggleHelp,
    toggleMap,
    toggleNotes,
    leaveComment,
    winGameFunction,
    toggleHint1,
    toggleHint2,
    toggleHint3,
    toggleHint4, setGameNotesFunction, setGameTimeFunction, goHomeQuit,
} from "./helper";
import { format } from 'date-fns'
import {shallowEqual} from "./ShallowEqual";
import {ToolObject, NotesOpen, TopRight, GameIntro, TimeBlock, CommentWindow} from "./sharedComponents";
import {gameScoreByGameStatsID, getGame} from "../graphql/queries";
import {generateClient} from "aws-amplify/api";
import * as mutations from "../graphql/mutations";
import {updateGameScore} from "../graphql/mutations";

export function Game() {
    const client = generateClient();
    /* for all games */
    const [isChecked, setIsChecked] = useState(false);
    const [lightDark, setLightDark] = useState("");
    const [game, setGame] = useState([]);
    const [gameHint, setGameHint] = useState([]);
    const [gameHintVisible, setGameHintVisible] = useState({});
    const [playZone, setPlayZone] = useState([]);
    const [zoneVisible, setZoneVisible] = useState("");
    const [clues, setClues] = useState();
    const [gameClueVisible, setGameClueVisible] = useState({});

    const [gamePuzzleVisible, setGamePuzzleVisible] = useState({});
    const [gamePuzzleClueVisible, setGamePuzzleClueVisible] = useState({});
    const [gameTopClues, setGameTopClues] = useState([]);
    const [gameBottomClues, setGameBottomClues] = useState([]);
    const [gameBottomPuzzle, setGameBottomPuzzle] = useState([]);
    /* guesses and answers */
    const [gamePuzzleGuess, setGamePuzzleGuess] = useState({});
    const [gamePuzzleAnswer, setGamePuzzleAnswer] = useState({});
    const [gamePuzzleAnswerCorrect, setGamePuzzleAnswerCorrect] = useState({});
    const [gamePuzzleSolved, setGamePuzzleSolved] = useState({});
    const [tool, setTool] = useState(ToolObject);
    const [toolVisible, setToolVisible] = useState({});
    const [backpackObject, setBackpackObject] = useState({});
    /* new above */


    const [isAlertVisible, setIsAlertVisible] = useState(false);
    const [isWinnerScreenVisible, setIsWinnerScreenVisible] = useState(false);
    const [alertText, setAlertText] = useState('');
    const [showComment, setShowComment] = useState(false);
    const [areNotesVisible, setAreNotesVisible] = useState(false);
    const [isHelpVisible, setIsHelpVisible] = useState(false);
    const [gameNotes,setGameNotes] = useState('');
    const [isMapVisible, setIsMapVisible] = useState(false);
    const [gameComments,setGameComments] = useState('');
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
    /* arrays */
    const [isHint1Visible, setIsHint1Visible] = useState(false);
    const [isHint2Visible, setIsHint2Visible] = useState(false);
    const [isHint3Visible, setIsHint3Visible] = useState(false);
    const [isHint4Visible, setIsHint4Visible] = useState(false);
    const [hintTime1,setHintTime1] = useState(0);
    const [hintTime2,setHintTime2] = useState(0);
    const [hintTime3,setHintTime3] = useState(0);
    const [hintTime4,setHintTime4] = useState(0);
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
            setGameTime(Number(localStorage.getItem('gameTime')));
            setGameTimeHint(Number(localStorage.getItem('gameTimeHint')));
            setGamePuzzleSolved(JSON.parse(localStorage.getItem("gamePuzzleSolved")));
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
                    setZoneVisible(gameZoneArray[0].id);
                    console.log("gamesFromAPI.gamePlayZone.items.length: " + gamesFromAPI.gamePlayZone.items.length);
                }
                /* set up game hints: */
                if (gamesFromAPI.gameHint.items.length > 0) {

                    let gameHintArray = gamesFromAPI.gameHint.items.sort((a, b) => {
                        return a.order - b.order;
                    });
                    setGameHint(gameHintArray);
                    console.log("gamesFromAPI.gameHint.items.length: " + gamesFromAPI.gameHint.items.length);
                    /* set up state visibility */
                    for (let i=0; i <gamesFromAPI.gameHint.items.length; i++) {
                        let key = "help" + (i + 1);
                        setGameHintVisibleFunction(key, false);
                    }
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
            //console.log("gamesFromAPI.gameClue.items.length: " + gamesFromAPI.gameClue.items.length);
            /* set up state visibility for clues */
                    for (let i = 0; i < gamesFromAPI.gameClue.items; i++) {
                        let key = "clue" + (gamesFromAPI.gameClue.items[i].id);
                        setGameClueVisibleFunction(key, false);
                    }
                }
                /* set up game Puzzle: */
                if (gamesFromAPI.gamePuzzle.items.length > 0) {
                    console.log("setGameBottomPuzzle: " + JSON.stringify(gamesFromAPI.gamePuzzle.items));
                    /* filter by position */
                    setGameBottomPuzzle(gamesFromAPI.gamePuzzle.items);
                    console.log("gamesFromAPI.gamePuzzle.items[0].id: " + gamesFromAPI.gamePuzzle.items[0].id);
                    //let gamePuzzleSolveID = gamesFromAPI.gamePuzzle.items[0].id;
                   // setGamePuzzleSolved({...gamePuzzleSolved, [gamePuzzleSolveID]:false});
                    //console.log("gamesFromAPI.gameClue.items.length: " + gamesFromAPI.gameClue.items.length);

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
                    setZoneVisible(gameZoneArray[0].id);
                    console.log("gamesFromAPI.gamePlayZone.items.length: " + gamesFromAPI.gamePlayZone.items.length);
                }
                /* set up game hints: */
                if (gamesFromAPI.gameHint.items.length > 0) {

                    let gameHintArray = gamesFromAPI.gameHint.items.sort((a, b) => {
                        return a.order - b.order;
                    });
                    setGameHint(gameHintArray);
                    console.log("gamesFromAPI.gameHint.items.length: " + gamesFromAPI.gameHint.items.length);
                    /* set up state visibility */
                    for (let i=0; i <gamesFromAPI.gameHint.items.length; i++) {
                        let key = "help" + (i + 1);
                        setGameHintVisibleFunction(key, false);
                    }
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
                    //console.log("gamesFromAPI.gameClue.items.length: " + gamesFromAPI.gameClue.items.length);
                    /* set up state visibility for clues */
                    for (let i = 0; i < gamesFromAPI.gameClue.items; i++) {
                        let key = "clue" + (gamesFromAPI.gameClue.items[i].id);
                        setGameClueVisibleFunction(key, false);
                    }
                }
                /* set up game Puzzle: */
                if (gamesFromAPI.gamePuzzle.items.length > 0) {
                    console.log("setGameBottomPuzzle: " + JSON.stringify(gamesFromAPI.gamePuzzle.items));
                    /* filter by position */
                    setGameBottomPuzzle(gamesFromAPI.gamePuzzle.items);
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
        let backpackObjectTest = JSON.stringify(backpackObject);
        console.log("***useEffect***: backpackObject: " +  backpackObjectTest);
        if (backpackObjectTest != "{}" &&  backpackObjectTest != "" &&  backpackObjectTest != null) {
            localStorage.setItem("backpackObject", backpackObjectTest);
        }
    }, [backpackObject]);
    /* always scroll to top */
    useEffect(() => {
        window.scrollTo(0, 0);
    });

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
    /* end for all games */



    /* FINAL: guessing states and answers for 2nd safe - 1 word */
    const [guess4,setGuess4] = useState('');
    const [haveGuessed4,setHaveGuessed4] = useState();
    const [isWrong4, setIsWrong4] = useState(true);
    const [answer4] = useState('wus');

    function checkAnswer2(guess4Val) {
        setGuess4(guess4Val);
        console.log("guess: " + guess4Val);
        if (shallowEqual(guess4Val,answer4)) {
            console.log("guess 4 is right");
            setHaveGuessed4(true);
            setIsWrong4(false);
            console.log("stop 1 win game");
            setGameComplete(true);
            /* set timeout to close window? */
            /* isSafeInfoVisible */
            setTimeout(() => {
                setIsCementSafeInfoVisible(false);
                setIsWinnerScreenVisible(true);
            }, 3000);
            winGameFunction(true,gameScoreID,gameTime,gameTimeTotal,setGameTimeTotal,gameTimeHint,numberOfPlayers,teamName, realTimeStart,
                hintTime1,hintTime2,hintTime3,hintTime4);
        } else {
            console.log("wrong guess 4");
            setHaveGuessed4(true);
            setIsWrong4(true);
        }
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
    const backgroundImage = (src) => (
        "url("+ src + ")");
    const keyID = (src,name) => (
        name + "_"+ src);
    const divStyle = (src) => ({
        background:  "url(" + src + ") 0 0 / contain no-repeat"
    });

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
    function setGamePuzzleGuessFunction(textFieldID, guess, answer, puzzleID, puzzleToolRevealed, winGame) {
        console.log("setPuzzleGuessFunction - puzzleTool: " + puzzleToolRevealed);
        console.log("setPuzzleGuessFunction - puzzleID: " + puzzleID);
        if (textFieldID) {
            setGamePuzzleGuess({...gamePuzzleGuess, [textFieldID]: guess})
            setGamePuzzleAnswer({...gamePuzzleAnswer, [textFieldID]: answer})
            let val = shallowEqual(guess,answer);
            setGamePuzzleAnswerCorrect({...gamePuzzleAnswerCorrect, [textFieldID]: val})
            /* loop through puzzle array */
            console.log("gameBottomPuzzle.length: " + gameBottomPuzzle.length);
            for (let i = 0; i < gameBottomPuzzle.length; i++) {
                console.log("gameBottomPuzzle[i].id: " + gameBottomPuzzle[i].id + " | puzzleID: " + puzzleID);
                if (gameBottomPuzzle[i].id == puzzleID) {
                    /* check if all correct --> textfields have unique ids */
                   let textFieldKey = false;
                   let allTrue = true;
                   let allCorrect = false;
                   console.log("gameBottomPuzzle[i].textField.items.length: " + gameBottomPuzzle[i].textField.items.length);
                   for (let j = 0; j < gameBottomPuzzle[i].textField.items.length; j++) {
                       let key = gameBottomPuzzle[i].textField.items[j].id;
                       console.log("key in for loop: " + key);
                       console.log("textFieldID in puzzle check: " + textFieldID);
                       /* is key in object? */
                       if (gamePuzzleAnswerCorrect.hasOwnProperty(key) & key != textFieldID) {
                           console.log("key in gamePuzzleAnswerCorrect: " + key);
                           /* check if false */
                           if (!gamePuzzleAnswerCorrect[key]) allTrue = false;
                       } else {
                           console.log("key not in gamePuzzleAnswerCorrect: " + key)
                           if (key === textFieldID) {
                               if (!val) {
                                   console.log("key === textfieldID - !val");
                                   allTrue = false;
                               } else {
                                   textFieldKey = true;
                               }
                           } else {
                               allTrue = false;
                           }
                       }

                   }
                   /* if (allTrue) {
                        console.log("allTrue is true! (test2)");
                    } else  console.log("allTrue is false! (test2)");
                    if (textFieldKey) {
                        console.log(" textFieldKey is true! (test2)");
                    } else  console.log(" textFieldKey is false! (test2)");*/
                    if (allTrue &&  textFieldKey) {
                        console.log("allCorrect is true! (test2)");
                        allCorrect = true;
                    } else  console.log("allCorrect is false! (test2)");
                   /* should be set in useeffect (as a callback)
                   let gamePuzzleSolvedLocal = gamePuzzleSolved;

                   gamePuzzleSolvedLocal[puzzleID] = allCorrect;
                   localStorage.setItem("gamePuzzleSolved", JSON.stringify(gamePuzzleSolvedLocal));
                   */
                   setGamePuzzleSolved({...gamePuzzleSolved, [puzzleID]:allCorrect});

                   /* set an alert or something */
                   if (allCorrect) {
                       console.log("close puzzle window: " + puzzleToolRevealed);
                       /* set toolVisible */
                       setToolVisible({...toolVisible, [puzzleToolRevealed]:true});
                       setTimeout(() => {
                           setGamePuzzleVisibleFunction("puzzle" + puzzleID,false);
                       }, 1000);
                       setIsAlertVisible(true);
                       setAlertText('puzzle solved');
                       setTimeout(() => {
                           setIsAlertVisible(false);
                       }, 2000);
                       if (winGame) {
                           setTimeout(() => {
                               setIsWinnerScreenVisible(true);
                           }, 1000);
                           setTimeout(() => {
                               goHomeQuit(navigate);;
                           }, 15000);
                           console.log("winGameFunction");
                           updateGameScore();
                       }
                   }

                break;
                }
            }
        }
    }

    async function updateGameScore() {
        console.log("updateGameScore ");
        let startDate = new Date(realTimeStart);
        // Do your operations to calculate time
        let endDate   = new Date();
        localStorage.setItem("realTimeEnd",endDate);
        let seconds = (endDate.getTime() - startDate.getTime()) / 60000;
        let hintTimeTotalNum = Number(hintTime1 + hintTime2 + hintTime3 + hintTime4);
        let GameTimeTotal = Number(seconds + hintTimeTotalNum).toFixed(2);
        setGameTimeTotal(GameTimeTotal);

        try {
            const data = {
                id: gameScoreID,
                gameTotalTime: GameTimeTotal,
                completed:true
            };
            await client.graphql({
                query: mutations.updateGameScore,
                variables: {
                    input: data
                }
            });
            console.log("gameTime = seconds: " + seconds);
        } catch (err) {
            console.log('error updating gamescore:', err);
        }
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
                                <Image className={(zoneVisible==zone.id)? "zone-border show" : "show"} src={zone.gameZoneIcon}  onClick={() => setZoneVisible(zone.id)} />
                            </View>
                                ))}
                    </Flex>
                    <View className="backpack-holder">
                        <Image src='/backpack-new.png' onClick={()=>setIsBackpackVisible(true)} />
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

                   {gameTopClues.map((clue,index) => (
                       <View aria-label={"gameTopClues: " + clue.gameClueName} key={clue.id} ariaLabel={clue.id}>
                           {/* if clue.gameTool then Tool is required and must be turned on and using clue.gameImage for now */
                               (clue.gameClueImage != '' && clue.gameClueImage !=null)? (

                                           <View ariaLabel={clue.gameClueName} top={((clue.order-1)*60) + "px"}
                                                 className={(zoneVisible==clue.gamePlayZoneID)? "clue-top" : "hide"}>
                                               <Image src = {clue.gameClueIcon}  className={(backpackObject.hasOwnProperty(clue.gameClueImage) && backpackObject[clue.gameClueImage] === "on")? "clickable" : "hide"} onClick={()=>setGameClueVisibleFunction(["clue" + (clue.id)], true)}/>
                                               <Image src = {clue.gameClueIcon}  className={((backpackObject.hasOwnProperty(clue.gameClueImage) && backpackObject[clue.gameClueImage] === "off") || !backpackObject.hasOwnProperty(clue.gameClueImage))? "clickable" : "hide"} onClick={()=>setAlertTextFunction("object needed")}/>
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
                                   <Button className={isChecked? "close-button dark" : "close-button light"} onClick={()=>setGameClueVisibleFunction(["clue" + (clue.id)], false)}>X</Button>
                                   <Heading level={"6"} className={isChecked? "heading dark" : "heading light"} paddingTop="10px">{clue.gameClueName}</Heading>
                                   <View paddingTop="10px">{clue.gameClueText}</View>
                                   <Flex className="window-button-bottom" justifyContent="center" gap="1rem">
                                       <Button className="button small" onClick={()=>setCluesFunction("  ** start clue (" + clue.id + ") ==> " +
                                           clue.gameClueText + " <== end clue ** ")}>add clue to notes</Button>
                                       <Button className="button action-button small" onClick={()=>setGameClueVisibleFunction(["clue" + (clue.id)], false)}>close clue</Button>
                                   </Flex>
                               </View>
                           </View>
                       </View>
                   ))}
                    {gameBottomClues.map((clue,index) => (
                        <View aria-label={"gameTopClues: " + clue.gameClueName} key={keyID(clue.id,"clue")} >
                            <View ariaLabel={clue.gameClueName} left={((clue.order-1)*60) + "px"}
                                  className={(zoneVisible==clue.gamePlayZoneID)? "clickable clue-holder-bottom" : "hide"}
                                  onClick={()=>setGameClueVisibleFunction(["clue" + (clue.id)], true)}>
                                <Image src = {clue.gameClueIcon} />
                            </View>
                            <View className={gameClueVisible["clue" + (clue.id)]? "cover-screen show-gradual" : "cover-screen hide-gradual"}>
                                <View className={isChecked? "all-screen dark" : "all-screen light"}>
                                    <Button  className={isChecked? "close-button dark" : "close-button light"}  onClick={()=>setGameClueVisibleFunction(["clue" + (clue.id)], false)}>X</Button>
                                    <Heading level={"6"} className={isChecked? "heading dark" : "heading light"} paddingTop="10px">{clue.gameClueName}</Heading>
                                    <View paddingTop="10px">{clue.gameClueText}</View>
                                    <Flex className="window-button-bottom" justifyContent="center" gap="1rem">
                                        <Button className="button small" onClick={()=>setCluesFunction("  ** start clue (" + clue.gameClueName + ") ==> " +
                                            clue.gameClueText + " <== end clue ** ")}>add clue to notes</Button>
                                        <Button className="button action-button small" onClick={()=>setGameClueVisibleFunction(["clue" + (clue.id)], false)}>close clue</Button>
                                    </Flex>
                                </View>
                            </View>
                        </View>
                    ))}

                   {gameBottomPuzzle.map(puzzle => (
                       <View key = {puzzle.id} >
                           <View className={(zoneVisible==puzzle.gamePlayZoneID)? "puzzle-holder-bottom" : "hide"}>
                               <Image src={puzzle.puzzleImage} onClick={()=>setGamePuzzleVisibleFunction(["puzzle" + (puzzle.id)], true)} className={gamePuzzleSolved[puzzle.id]? "hide" : "show puzzle-item"} />
                               <Image src={puzzle.puzzleImageSolved} className={gamePuzzleSolved[puzzle.id]? "show puzzle-item" : "hide"} />
                               <Image src={puzzle.puzzleObjectClue} onClick={()=>setGamePuzzleVisibleFunction(["puzzle" + (puzzle.id)], true)} className={gamePuzzleSolved[puzzle.id]? "show clue-on-puzzle" : "hide"} />
                               <Image className={(gamePuzzleSolved[puzzle.id] && puzzle.puzzleObjectClue != "")? "puzzle-object-tool show" : "hide"} src={puzzle.puzzleObjectClue} onClick={()=>setGamePuzzleClueVisibleFunction(["puzzle" + (puzzle.id)], true)} />
                               {puzzle.winGame? (
                                       <Image className={(gamePuzzleSolved[puzzle.id] && puzzle.puzzleToolRevealed != "")? "puzzle-object-tool show" : "hide"} src={puzzle.puzzleToolRevealed} />
                                   ):
                                   (
                               <Image className={(gamePuzzleSolved[puzzle.id] && puzzle.puzzleToolRevealed != "" && toolVisible[puzzle.puzzleToolRevealed])? "puzzle-object-tool yellow-border show" : "hide"} src={tool[puzzle.puzzleToolRevealed]} onClick={()=>objectInBackpackFunction(puzzle.puzzleToolRevealed)} />
                                   )}
                           </View>
                           <View className={gamePuzzleVisible["puzzle" + (puzzle.id)]? "cover-screen show-gradual" : "cover-screen hide-gradual"}>
                               <View className={isChecked? "all-screen dark" : "all-screen light"}>
                                   <Button  className={isChecked? "close-button dark" : "close-button light"}  onClick={()=>setGamePuzzleVisibleFunction(["puzzle" + (puzzle.id)], false)}>X</Button>
                                   <Heading level={"6"} className={isChecked? "heading dark" : "heading light"} paddingTop="10px">{puzzle.gameClueName}</Heading>
                                   <View paddingTop="10px" className={gamePuzzleSolved[puzzle.id]? "hide" : "show"}>
                                       {puzzle.textField.items.map((field,index) => (
                                           <View key={field.id}>
                                               {gamePuzzleGuess.hasOwnProperty(field.id) ?
                                                   (<TextField
                                                       label={field.label}
                                                       value={gamePuzzleGuess[field.id]}
                                                       onChange={(event) => setGamePuzzleGuessFunction(field.id, event.target.value, field.answer, puzzle.id, puzzle.puzzleToolRevealed, puzzle.winGame)}
                                                   />) : (
                                                       <TextField
                                                           label={field.label}
                                                           value=""
                                                           onChange={(event) => setGamePuzzleGuessFunction(field.id, event.target.value, field.answer, puzzle.id, puzzle.puzzleToolRevealed, puzzle.winGame)}
                                                       />)
                                               }
                                               { (gamePuzzleAnswerCorrect[field.id]  && gamePuzzleAnswer[field.id] != null && gamePuzzleGuess[field.id] != null) ? (
                                                   <span className="green"> Right Answer!</span>
                                               ) : null
                                               }
                                           </View>
                                       ))}

                                   </View>

                                   <Flex className="window-button-bottom" justifyContent="center" gap="1rem">
                                       <Button className="button action-button small" onClick={()=>setGamePuzzleVisibleFunction(["puzzle" + (puzzle.id)], false)}>close</Button>
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
                                           <Button className="button small" onClick={()=>setCluesFunction("  ** start clue (" + puzzle.id + ") ==> " +
                                               puzzle.puzzleClueText + " <== end clue ** ")}>add clue to notes</Button>
                                           <Button className="button action-button small" onClick={()=>setGamePuzzleClueVisibleFunction(["puzzle" + (puzzle.id)], false)}>close </Button>
                                       </Flex>
                                   </View>

                               </View>
                           </View>
                           <View className={isWinnerScreenVisible? "cover-screen show-gradual" : "cover-screen hide-gradual"}>
                               <View className={isChecked? "all-screen " : "all-screen light-dark"}>

                                   <View className="black-box">
                                       <h3>WINNER!</h3>
                                       <View>puzzle.winnerMessage</View>

                                   </View>
                                   <View className="bottom z-index125">
                                       <View color="white">Total Time: {gameTimeTotal}</View>
                                       <Button className="button small" onClick={() => leaveComment(setShowComment)}>Tap to Leave Comment (to help make game better)</Button>
                                       <br /><Button className="button right-button small" onClick={() => goHomeQuit(navigate)}>Back Home</Button>
                                   </View>

                               </View>
                           </View>
                       </View>
                   ))}

                    <View className="right-side"></View>
                {/* all games */}
            </View>

                <View ariaLabel="Time" className="time">
                    <View className="small">hint time: {gameTimeHint} mins | time started: {realTimeStart ? format(realTimeStart, "MM/dd/yyyy h:mma") : null} </View>
                    <Button marginRight={"10px"} className="button button-small" onClick={() => isHelpVisible? setIsHelpVisible(false) : setIsHelpVisible(true)}>Help</Button>
                    <Button marginRight={"10px"} className="button button-small"  onClick={() => {console.log("noteclick"); areNotesVisible ? setAreNotesVisible(false) : setAreNotesVisible(true)}}>Notes</Button>
                    <Button marginRight={"10px"} className="button button-small">Map</Button>
                    <SwitchField
                        isDisabled={false}
                        label="dark/light"
                        isChecked={isChecked}
                        labelPosition="start"
                        onChange={(e) => {
                            setIsChecked(e.target.checked);
                        }}
                    />
                </View>
                <NotesOpen areNotesVisible={areNotesVisible} clues={clues} setClues={setClues} setAreNotesVisible={setAreNotesVisible} toggleNotes={toggleNotes} gameNotes={gameNotes} setGameNotes={setGameNotes} setGameNotesFunction={setGameNotesFunction}/>




            {(showComment) ? (
                <CommentWindow setGameComments={setGameComments} gameComments={gameComments}/>
            ) : null}

            <View className={isHelpVisible ? "cover-screen show-gradual" : "cover-screen hide-gradual"}>
                <View className={isChecked? "all-screen dark" : "all-screen light"}>
                    <SwitchField
                        isDisabled={false}
                        label="dark/light"
                        isChecked={isChecked}
                        labelPosition="start"
                        onChange={(e) => {
                            setIsChecked(e.target.checked);
                        }}
                    />
                    <Button  className={isChecked? "close-button dark" : "close-button light"}
                             onClick={() => toggleHelp(isHelpVisible, setIsHelpVisible)}>X</Button>
                    <View width="100%" padding="20px 10px">
                        <View paddingBottom="10px">
                            <strong>How to Play:</strong> Click around to open clues and get items. Click on puzzles to solve. If an item is in your backpack click on it to use.
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
                                 <Button onClick={() => setGameHintVisibleFunction(["hint" + (index + 1)], true)}>{hint.gameHintName}</Button>
                                 <View className={gameHintVisible.hint1 ? "show" : "hide"}>{hint.gameHintDescription}</View>
                            </Flex>
                        ))}
                        <View>state hint1: {gameHintVisible.hint1 ? "true" : "false"}</View>
                        <View>state hint2: {gameHintVisible.hint2 ? "true" : "false"}</View>
                        <View>state hint3: {gameHintVisible.hint3 ? "true" : "false"}</View>
                        <View>state hint4: {gameHintVisible.hint4 ? "true" : "false"}</View>
                        <Flex wrap="wrap">

                            <Button className={(hintTime1 == 0) ? "button small" : "hide"}
                                    onClick={() => toggleHint1(setHintTime1, isHint1Visible, setIsHint1Visible, hintTime1, setGameTimeHint, gameTimeHint)}>Open Hint (engraved on panel) - adds 5 minutes</Button>
                            <Button className={(hintTime1 == 0) ? "hide" : "button small"}
                                    onClick={() => toggleHint1(setHintTime1, isHint1Visible, setIsHint1Visible, hintTime1, setGameTimeHint, gameTimeHint)}>Open Hint (engraved on panel) - free now</Button>
                            <Button className={(hintTime2 == 0) ? "button small" : "hide"}
                                    onClick={() => toggleHint2(setHintTime2, isHint2Visible, setIsHint2Visible, hintTime2, setGameTimeHint, gameTimeHint)}>Open Hint (name of house) - adds 5 minutes</Button>
                            <Button className={(hintTime2 == 0) ? "hide" : "button small"}
                                    onClick={() => toggleHint2(setHintTime2, isHint2Visible, setIsHint2Visible, hintTime2, setGameTimeHint, gameTimeHint)}>Open Hint (name of house) - free now</Button>
                            <Button className={(hintTime3 == 0) ? "button small" : "hide"}
                                    onClick={() => toggleHint3(setHintTime3, isHint3Visible, setIsHint3Visible, hintTime3, setGameTimeHint, gameTimeHint)}>Open Hint (sport) - adds 5 minutes</Button>
                            <Button className={(hintTime3 == 0) ? "hide" : "button small"}
                                    onClick={() => toggleHint3(setHintTime3, isHint3Visible, setIsHint3Visible, hintTime3, setGameTimeHint, gameTimeHint)}>Open Hint (sport) - free now</Button>
                            <Button className={(hintTime4 == 0) ? "button small" : "hide"}
                                    onClick={() => toggleHint4(setHintTime4, isHint4Visible, setIsHint4Visible, hintTime4, setGameTimeHint, gameTimeHint)}>Open Hint (name of field) - adds 5 minutes</Button>
                            <Button className={(hintTime4 == 0) ? "hide" : "button small"}
                                    onClick={() => toggleHint4(setHintTime4, isHint4Visible, setIsHint4Visible, hintTime4, setGameTimeHint, gameTimeHint)}>Open Hint (name of field) - free now</Button>
                        </Flex>
                        <br/><br/>
                        <View className={isHint4Visible ? "cover-screen show-gradual" : "hide"}>
                            <View className="winner show">
                                <strong>Hint for somewhere order of numbers for safe:</strong>
                                <strong>Hint for name of field</strong>
                                <br /><br />There is a large sign on the fence at the field with the name.
                                <br /><br /><View width="100%" textAlign='center'>
                                    <Button className="button action-button"
                                            onClick={() => toggleHint4(setHintTime4, isHint4Visible, setIsHint4Visible, hintTime4, setGameTimeHint, gameTimeHint)}>tap
                                        to close hint 4</Button>
                                </View>
                            </View>
                        </View>
                        <View className={isHint3Visible ? "cover-screen show-gradual" : "hide"}>
                            <View className="winner show">
                                <strong>Hint for Sport:</strong>
                                <br /><br />People do play soccer and disc golf but the closest field to the shelter is the baseball field.
                                <br/><br/>
                                <View width="100%" textAlign='center'>
                                    <Button className="button action-button"
                                            onClick={() => toggleHint3(setHintTime3, isHint3Visible, setIsHint3Visible, hintTime3, setGameTimeHint, gameTimeHint)}>tap
                                        to close hint 3</Button>
                                </View>
                            </View>
                        </View>
                        <View className={isHint2Visible ? "cover-screen show-gradual" : "hide"}>
                            <View className="winner show">
                                <Button className="close-button" onClick={() => toggleHint2(setHintTime2,isHint2Visible,setIsHint2Visible)}>X</Button>
                                <strong>Hint for name of house:</strong> <br /><br />
                                Near the intersection of Solomon and N. Campbell there is a house that people use for events.<br /><br />
                                Go over there and look for the name.
                            <br /><br />
                                <View width="100%" textAlign='center'>
                                    <Button className="button action-button"
                                            onClick={() => toggleHint2(setHintTime2, isHint2Visible, setIsHint2Visible, hintTime2, setGameTimeHint, gameTimeHint)}>tap
                                        to close hint 2</Button>
                                </View>
                            </View>
                        </View>
                        <View className={isHint1Visible ? "cover-screen show-gradual" : "hide"}>
                            <div className="winner show">
                                <strong>Hint for engraved on panel:</strong> <br /><br />
                                The <span className="bold-underline">first</span> is in reference to the first letter of the named field.
                                And the pattern continues with name of house and name of sport.
                                <br /><br />
                                <View width="100%" textAlign='center'>
                                    <Button className="button action-button"
                                            onClick={() => toggleHint1(setHintTime1, isHint1Visible, setIsHint1Visible, hintTime1, setGameTimeHint, gameTimeHint)}>tap
                                        to close hint 1</Button>
                                </View>
                            </div>
                        </View>
                        <View width="100%" textAlign='center'>
                            <Button className="button action-button"
                                    onClick={() => toggleHelp(isHelpVisible, setIsHelpVisible)}>tap to close
                                help</Button>
                            <Button className="link-button"
                                    onClick={() => toggleMap(isMapVisible, setIsMapVisible)}>tap to see location on
                                map</Button>
                        </View>
                    </View>
                </View>
            </View>

            <View className={isAlertVisible ? "alert-container show" : "hide"}>
                <div className='alert-inner'>{alertText}</div>
            </View>

            <View className={isMapVisible ? "cover-screen show-gradual" : "hide"}>
                <View textAlign="center" className="all-screen show">
                    <Image maxHeight="300px"
                           src="/jaycee-park-2pz-map.png"/>
                    <Link href="https://goo.gl/maps/4FHz3mx5zdQjeGwy8?coh=178571&entry=tt" isExternal={true}>link to
                        google maps</Link><br/>
                    <Button className="button action-button"
                            onClick={() => toggleHelp(isMapVisible, setIsMapVisible)}>tap to close map</Button>
                </View>
            </View>


        </View> {/* end main-container */}


        </View>
    )
}
