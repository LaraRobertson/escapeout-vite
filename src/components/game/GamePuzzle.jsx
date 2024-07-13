import {Flex, Icon, Image, TextField, View} from "@aws-amplify/ui-react";
import React, {useContext, useState} from "react"
import puzzleIconClosed from "../../assets/noun-locker-6097531.svg";
import puzzleIconOpen from "../../assets/noun-locker-6097523.svg";
import {MyGameContext} from "../../MyContext";
import {shallowEqual} from "../ShallowEqual";

export function ModalPuzzleContent(props) {
    const { setGamePuzzleGuess, isChecked, setGamePuzzleAnswer, setGamePuzzleAnswerCorrect, setGamePuzzleSolved, gamePuzzles, setModalPuzzleContent, setClueDetails } = useContext(MyGameContext);
    const [modalMessage, setModalMessage] = useState("");
    function setGamePuzzleGuessFunction(textFieldID, guess, answer, puzzleID, winGame, gamePuzzleSolved) {
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
                            setModalMessage("You Solved the Puzzle!");
                            setTimeout(() => {
                                setModalPuzzleContent({show:false,content:""});
                            }, 2000);

                            /*setIsAlertVisible(true);
                            setAlertText('puzzle solved');
                            setTimeout(() => {
                                setIsAlertVisible(false);
                            }, 2000);*/
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
    let puzzleDetails=props.puzzleDetails;
    let gamePuzzleGuess=props.gamePuzzleGuess;
    let gamePuzzleSolved=props.gamePuzzleSolved;
    let gamePuzzleAnswer=props.gamePuzzleAnswer;
    let gamePuzzleAnswerCorrect=props.gamePuzzleAnswerCorrect;
    return(
        <View paddingTop="10px">
            {(modalMessage !== "") &&
            <Flex
                direction="row"
                justifyContent="flex-start"
                alignItems="flex-start"
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
                            onChange={(event) => setGamePuzzleGuessFunction(field.id, event.target.value, field.answer, puzzleDetails.puzzleID, puzzleDetails.winGame, gamePuzzleSolved)}
                        />) : (
                            <TextField
                                className={isChecked? "puzzleTextField light-label" : 'puzzleTextField dark-label '}
                                label={field.label}
                                value=""
                                onChange={(event) => setGamePuzzleGuessFunction(field.id, event.target.value, field.answer, puzzleDetails.puzzleID, puzzleDetails.winGame, gamePuzzleSolved)}
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
    const { setClueDetails, setModalClueContent } = useContext(MyGameContext);
    let zoneVisible=props.zoneVisible;
    let puzzle=props.puzzle;
    let gamePuzzleSolved=props.gamePuzzleSolved;
    let index=props.index;
    let setModalPuzzleContent=props.setModalPuzzleContent;
    let setPuzzleDetails=props.setPuzzleDetails;

    const IconPuzzleDisplay = (props) => {
        switch (true) {
            case (props.index == 0):
                return (
                    <Image height="100px" width="100px" src={puzzleIconClosed} alt="puzzle icon closed" />
                );
            default:
                return "default"
        }
    }
    const IconPuzzleDisplayOpen = (props) => {
        switch (true) {
            case (props.index == 0):
                return (
                    <Image height="100px" width="100px" src={puzzleIconOpen} alt="puzzle icon open" />
                );
            default:
                return "default"
        }
    }

    function handlePuzzleDetail(puzzleDetails) {
        console.log("handlePuzzleDetail");
        let statePuzzleDetails = {
            puzzleID: puzzleDetails.puzzleID,
            winGame: puzzleDetails.winGame,
            textFields: puzzleDetails.textField,
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
    return (
        <View key = {puzzle.id} >
            <View className={(zoneVisible==puzzle.gamePlayZoneID)? "puzzle-holder-bottom" : "hide"}>
                <View>
                    {/* if clue or wingame */}
                    {gamePuzzleSolved[puzzle.id] ? (
                        <View onClick={() => handlePuzzleClue({
                            gameClueName: puzzle.puzzleName,
                            gameClueText: puzzle.puzzleClueText,
                            gameClueImage: ""
                        })}
                              className={gamePuzzleSolved[puzzle.id]? "show puzzle-item" : "hide"}
                       >
                            <View  style={{position:"absolute", top:"10px", right:"30px", color:"yellow", fontSize:"3.5em"}}>?</View>
                            <IconPuzzleDisplayOpen index={index} />
                        </View>

                    ):(
                        <View onClick={() => handlePuzzleDetail({
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
                {(puzzle.winGame)? (
                        <Image className={(gamePuzzleSolved[puzzle.id])? "puzzle-object-tool show" : "hide"} src={puzzle.puzzleToolRevealed} />
                    ):null}
            </View>
        </View>
    )
}