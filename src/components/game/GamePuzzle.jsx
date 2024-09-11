import {Flex, Icon, Image, TextField, View} from "@aws-amplify/ui-react";
import React, {useContext, useEffect, useState} from "react"
import puzzleIconClosed from "../../assets/noun-locker-6097531.svg";
import puzzleIconOpen from "../../assets/noun-locker-6097523.svg";
import {MyGameContext} from "../../MyContext";
import {shallowEqual} from "../ShallowEqual";
import safeBoxClosed from "../../assets/noun-safebox-closed-319680.svg";
import safeBoxOpen from "../../assets/noun-safebox-open-319684.svg";
import boxClosed from "../../assets/noun-box-locked-4427162.svg";
import boxOpen from "../../assets/noun-open-package-6999076.svg";
import safeDepositBoxOpen from "../../assets/noun-safe-deposit-box-open-5414386.svg";
import safeDepositBoxClosed from "../../assets/noun-safe-deposit-box-closed-6008306.svg";
import padlockClosed from "../../assets/noun-padlock-closed-2186012.svg";
import padlockOpen from "../../assets/noun-padlock-open-2185952.svg";
//import {setGamePuzzleGuessFunction} from "../GamePuzzleGuessFunction";

export function ModalPuzzleContent(props) {
    const { setGamePuzzleGuess, isChecked, setGamePuzzleAnswer, setGamePuzzleAnswerCorrect, setGamePuzzleSolved, gamePuzzleArray, setModalPuzzleContent, setGameComplete } = useContext(MyGameContext);
    const [modalMessage, setModalMessage] = useState("");
    let puzzleDetails=props.puzzleDetails;
    let gamePuzzleGuess=props.gamePuzzleGuess;
    let gamePuzzleSolved=props.gamePuzzleSolved;
    let gamePuzzleAnswer=props.gamePuzzleAnswer;
    let setClueDetails=props.setClueDetails;
    let setModalClueContent=props.setModalClueContent;
    let gamePuzzleAnswerCorrect=props.gamePuzzleAnswerCorrect;

    function setGamePuzzleGuessFunction(textFieldID, guess, answer, puzzleID, setClueDetails, setModalClueContent, puzzleName, puzzleClueText, winGame) {
        console.log("setPuzzleGuessFunction - puzzleID: " + puzzleID);
        console.log("setPuzzleGuessFunction - textFieldID: " + textFieldID);
        console.log("setPuzzleGuessFunction - answer: " + answer);
        if (textFieldID) {
            let newObject = {...gamePuzzleGuess, [textFieldID]: guess};
            let gamePuzzleGuessTest = JSON.stringify(newObject);
            if (gamePuzzleGuessTest != "{}" &&  gamePuzzleGuessTest != "" &&  gamePuzzleGuessTest != null) {
                localStorage.setItem("gamePuzzleGuess", gamePuzzleGuessTest);
            }
            let newAnswerObject = {...gamePuzzleAnswer,  [textFieldID]: answer};
            let gamePuzzleAnswerTest = JSON.stringify(newAnswerObject);
            if (gamePuzzleAnswerTest != "{}" &&  gamePuzzleAnswerTest != "" &&  gamePuzzleAnswerTest != null) {
                localStorage.setItem("gamePuzzleAnswer", gamePuzzleGuessTest);
            }
            setGamePuzzleGuess({...gamePuzzleGuess, [textFieldID]: guess})
            setGamePuzzleAnswer({...gamePuzzleAnswer, [textFieldID]: answer})

            const valArray = [];
            /* loop through answer object - know it is an object if { in answer */
                    if (answer.includes("{")) {
                        console.log("answer has multiple options");
                        let answerObject = JSON.parse(answer);
                        for (const key in answerObject) {
                           // console.log("loop: " + `${key}: ${answerObject[key]}`);
                            let val2 = shallowEqual(guess, String(answerObject[key]));
                            console.log("val2: " + val2);
                            valArray.push(val2);
                        }
                    } else {
                        let val = shallowEqual(guess, answer);
                        valArray.push(val);
                    }
                    console.log("valArray: " + valArray);
                    if (valArray.includes(true)) {
                        setGamePuzzleAnswerCorrect({...gamePuzzleAnswerCorrect, [textFieldID]: true});
                        let newAnswerObject = {...gamePuzzleAnswerCorrect,  [textFieldID]: true};
                        let gamePuzzleAnswerTest = JSON.stringify(newAnswerObject);
                        if (gamePuzzleAnswerTest != "{}" &&  gamePuzzleAnswerTest != "" &&  gamePuzzleAnswerTest != null) {
                            localStorage.setItem("gamePuzzleAnswerCorrect", gamePuzzleAnswerTest);
                        }
                        /* loop through puzzle array if answer is correct */
                        console.log("gamePuzzleArray.length: " + gamePuzzleArray.length);
                        for (let i = 0; i < gamePuzzleArray.length; i++) {
                            console.log("gamePuzzleArray.length[i].id: " + gamePuzzleArray[i].id + " | puzzleID: " + puzzleID);
                            /* find which puzzle */
                            if (gamePuzzleArray[i].id == puzzleID) {
                                /* check if all correct --> textfields have unique ids */
                                const allCorrectArray = [];
                                let textFieldLength = gamePuzzleArray[i].textField.items.length;
                                console.log("gamePuzzle[i].textField.items.length: " + textFieldLength);
                                if (textFieldLength > 1) {
                                    for (let j = 0; j < gamePuzzleArray[i].textField.items.length; j++) {
                                        let key = gamePuzzleArray[i].textField.items[j].id;
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
                                    let newObject2 = {...gamePuzzleSolved, [puzzleID]: true};
                                    let gamePuzzleSolvedTest = JSON.stringify(newObject2);
                                    if (gamePuzzleSolvedTest != "{}" &&  gamePuzzleSolvedTest != "" &&  gamePuzzleSolvedTest != null) {
                                        localStorage.setItem("gamePuzzleSolved", gamePuzzleSolvedTest);
                                    }
                                    setModalMessage('puzzle solved');
                                    setTimeout(() => {
                                        setModalPuzzleContent({
                                            show: false,
                                            content: "puzzle"
                                        })
                                        setModalMessage('');
                                    }, 2000);
                                    /* check if all puzzles are solved */
                                    let numberOfPuzzlesSolved=0;
                                    for (const [key, value] of Object.entries(newObject2)) {
                                        console.log(`Key: ${key}, Value: ${value}`);
                                        if (value === true) numberOfPuzzlesSolved=numberOfPuzzlesSolved+1;
                                    }
                                    if (numberOfPuzzlesSolved===gamePuzzleArray.length) {
                                        console.log("win");
                                        setTimeout(() => {
                                            setGameComplete(true);
                                            setModalMessage('');
                                        }, 3000);

                                    } else {
                                        /* open clue for puzzle? */
                                        console.log("handlePuzzleClue: ");
                                        let puzzleClue = {
                                            gameClueName: puzzleName,
                                            gameClueText: puzzleClueText,
                                        }
                                        setClueDetails(puzzleClue);
                                        setModalClueContent({
                                            show: true,
                                            content: "clue"
                                        })
                                    }

                                } else {
                                    /* puzzle is not solved */
                                    setGamePuzzleSolved({...gamePuzzleSolved, [puzzleID]: false});
                                    let newObject2 = {...gamePuzzleSolved, [puzzleID]: false};
                                    let gamePuzzleSolvedTest = JSON.stringify(newObject2);
                                    if (gamePuzzleSolvedTest != "{}" &&  gamePuzzleSolvedTest != "" &&  gamePuzzleSolvedTest != null) {
                                        localStorage.setItem("gamePuzzleSolved", gamePuzzleSolvedTest);
                                    }
                                }
                                break;
                            }
                        }

                    } else {
                        console.log("answer is not correct");
                        setGamePuzzleAnswerCorrect({...gamePuzzleAnswerCorrect, [textFieldID]: false});
                    }

        }
    }

    return(
        <View paddingTop="10px">
            {(modalMessage !== "") &&
            <Flex
                direction="row"
                justifyContent="flex-start"
                alignItems="center"
                wrap="nowrap"
                gap="1rem"><View className={"blue-alert"} margin="0 auto 5px auto" textAlign={"center"}
                  padding="10px" lineHeight="1.2em">
               <strong>{modalMessage}</strong>
            </View><View className="right-answer">
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
                </View></Flex>}
            {puzzleDetails.textFields.map((field,index) => (
                <Flex
                    direction="row"
                    justifyContent="flex-start"
                    alignItems="center"
                    wrap="nowrap"
                    gap="1rem"
                    key={field.id}>
                    {gamePuzzleGuess.hasOwnProperty(field.id) ?
                        (<TextField
                            className={isChecked? "puzzleTextField light-label" : 'puzzleTextField dark-label '}
                            label={field.label}
                            value={gamePuzzleGuess[field.id]}
                            placeholder={"input answer for above"}
                            onChange={(event) => setGamePuzzleGuessFunction(
                                field.id, event.target.value, field.answer, puzzleDetails.puzzleID, setClueDetails, setModalClueContent, puzzleDetails.puzzleName, puzzleDetails.puzzleClueText, puzzleDetails.winGame)}
                        />) : (
                            <TextField
                                className={isChecked? "puzzleTextField light-label" : 'puzzleTextField dark-label '}
                                label={field.label}
                                placeholder={"input answer for above"}
                                value=""
                                onChange={(event) => setGamePuzzleGuessFunction(
                                    field.id, event.target.value, field.answer, puzzleDetails.puzzleID, setClueDetails, setModalClueContent, puzzleDetails.puzzleName, puzzleDetails.puzzleClueText, puzzleDetails.winGame)}
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

    )
}

export function GamePuzzle(props) {
    const { setModalPuzzleContent, setModalClueContent } = useContext(MyGameContext);
    let zoneVisible=props.zoneVisible;
    let puzzle=props.puzzle;
    let gamePuzzleSolved=props.gamePuzzleSolved;
    let index=props.index;
    let setPuzzleDetails=props.setPuzzleDetails;
    let setClueDetails=props.setClueDetails;

    const IconPuzzleDisplay = (props) => {
        switch (true) {
            case (props.index == 0):
                return (
                    <Image height="100px" width="100px" src={puzzleIconClosed} alt="puzzle icon closed" />
                );
            case (props.index == 1):
                return (
                    <Image height="70px" width="70px" src={safeBoxClosed} alt="safe box closed" />
                );
            case (props.index % 5 == 0):
                return (
                    <Image height="70px" width="70px" src={padlockClosed} alt="padlock closed" />
                );
            case (props.index % 3 == 0):
                return (
                    <Image height="70px" width="70px" src={boxClosed} alt="box closed" />
                );
            case (props.index % 2 == 0):
                return (
                    <Image height="70px" width="70px" src={safeDepositBoxClosed} alt="safe deposit box closed" />
                );
            default:
                return (
                    <Image height="100px" width="100px" src={puzzleIconClosed} alt="puzzle icon closed" />
                );
        }
    }
    const IconPuzzleDisplayOpen = (props) => {
        switch (true) {
            case (props.index == 0):
                return (
                    <Image height="100px" width="100px" src={puzzleIconOpen} alt="puzzle icon open" />
                );
            case (props.index == 1):
                return (
                    <Image height="70px" width="70px" src={safeBoxOpen} alt="safe box open" />
                );
            case (props.index % 5 == 0):
                return (
                    <Image height="70px" width="70px" src={padlockOpen} alt="padlockOpen" />
                );
            case (props.index % 3 == 0):
                return (
                    <Image height="70px" width="70px" src={boxOpen} alt="box open" />
                );
            case (props.index % 2 == 0):
                return (
                    <Image height="70px" width="70px" src={safeDepositBoxOpen} alt="safe deposit box open" />
                );
            default:
                return (
                    <Image height="100px" width="100px" src={puzzleIconOpen} alt="puzzle icon open" />
                );
        }
    }

    function handlePuzzleDetail(puzzleDetails) {
        console.log("handlePuzzleDetail");
        let statePuzzleDetails = {
            puzzleID: puzzleDetails.puzzleID,
            winGame: puzzleDetails.winGame,
            textFields: puzzleDetails.textField,
            puzzleName: puzzleDetails.puzzleName,
            puzzleClueText: puzzleDetails.puzzleClueText
        };
        setPuzzleDetails(statePuzzleDetails);
        setModalPuzzleContent({
            show: true,
            content: "puzzle"
        })
    }
    function handlePuzzleClue(puzzleDetails) {
        console.log("handlePuzzleClue: ");
        setClueDetails(puzzleDetails);
        setModalClueContent({
            show: true,
            content: "clue"
        })
    }
    if (zoneVisible==puzzle.gamePlayZoneID) {
        return (
            <View key={puzzle.id}>
                <View className={(zoneVisible == puzzle.gamePlayZoneID) ? "show" : "hide"}>
                    <View>
                        {/* if clue or wingame */}
                        {gamePuzzleSolved[puzzle.id] ? (
                            <View onClick={() => handlePuzzleClue({
                                gameClueName: puzzle.puzzleName,
                                gameClueText: puzzle.puzzleClueText,
                                gameClueImage: ""
                            })}
                                  className={gamePuzzleSolved[puzzle.id] ? "show puzzle-item" : "hide"}
                            >
                                {(puzzle.winGame) ? (
                                    <View style={{position: "relative"}}>
                                        <View style={{
                                            position: "absolute",
                                            top: "10px",
                                            right: "30px",
                                            color: "red",
                                            fontSize: "1em"
                                        }}>Final Puzzle!</View>
                                        <IconPuzzleDisplayOpen index={index}/></View>
                                ) : (

                                    <View style={{position: "relative"}}>
                                        <View style={{
                                            position: "absolute",
                                            top: "00px",
                                            right: "30px",
                                            color: "yellow",
                                            fontSize: "3.5em"
                                        }}>?</View>
                                        <IconPuzzleDisplayOpen index={index}/></View>
                                )}
                            </View>

                        ) : (
                            <View onClick={() => handlePuzzleDetail({
                                textField: puzzle.textField.items,
                                puzzleID: puzzle.id,
                                puzzleName: puzzle.puzzleName,
                                puzzleClueText: puzzle.puzzleClueText
                            })}
                                  className={gamePuzzleSolved[puzzle.id] ? "hide" : "show puzzle-item"}>
                                <IconPuzzleDisplay index={index}/>
                            </View>
                        )}
                    </View>

                    {/*<Image src={puzzle.puzzleObjectClue} onClick={()=>setGamePuzzleVisibleFunction(["puzzle" + (puzzle.id)], true)} className={gamePuzzleSolved[puzzle.id]? "show clue-on-puzzle" : "hide"} />
                                        <Image className={(gamePuzzleSolved[puzzle.id] && puzzle.puzzleObjectClue != "")? "puzzle-object-tool show" : "hide"} src={puzzle.puzzleClueRevealed} onClick={()=>setGamePuzzleClueVisibleFunction(["puzzle" + (puzzle.id)], true)} />*/}
                    {/*(puzzle.winGame)? (
                        <Image className={(gamePuzzleSolved[puzzle.id])? "puzzle-object-tool show" : "hide"} src={puzzle.puzzleToolRevealed} />
                    ):null*/}
                </View>
            </View>
        )
    }
}