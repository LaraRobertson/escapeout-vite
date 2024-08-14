import {shallowEqual} from "./ShallowEqual";
import {useContext} from "react";
import {MyGameContext} from "../MyContext";
//const { setGamePuzzleGuess, setGamePuzzleAnswer, setGamePuzzleAnswerCorrect, setGamePuzzleSolved, gamePuzzleArray, setModalPuzzleContent, setGameComplete } = useContext(MyGameContext);


export function setGamePuzzleGuessFunction(textFieldID, guess, answer, puzzleID, winGame, gamePuzzleGuess, setGamePuzzleGuess, setGamePuzzleAnswer,
                                           gamePuzzleAnswer, setGamePuzzleAnswerCorrect, gamePuzzleAnswerCorrect, gamePuzzleArray, setGamePuzzleSolved, gamePuzzleSolved, setModalMessage, setModalPuzzleContent, setGameComplete) {
    console.log("setPuzzleGuessFunction - puzzleID: " + puzzleID);
    console.log("setPuzzleGuessFunction - textFieldID: " + textFieldID);
    console.log("setPuzzleGuessFunction - answer: " + answer);
    if (textFieldID) {
        let newObject = {...gamePuzzleGuess, [textFieldID]: guess};
        let gamePuzzleGuessTest = JSON.stringify(newObject);
        if (gamePuzzleGuessTest != "{}" &&  gamePuzzleGuessTest != "" &&  gamePuzzleGuessTest != null) {
            localStorage.setItem("gamePuzzleGuess", gamePuzzleGuessTest);
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