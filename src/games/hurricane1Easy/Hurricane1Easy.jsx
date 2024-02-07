import React, {useEffect, useState} from "react"
import {Button, View, Image, TextAreaField, TextField, Flex, Heading, Link, Text, SwitchField} from '@aws-amplify/ui-react';
import {useNavigate} from "react-router-dom";
import {
    toggleIntro,
    toggleHelp,
    toggleMap,
    toggleNotes,
    leaveComment,
    winGameFunction,
    toggleHint1,
    toggleHint2,
    toggleHint3,
    toggleHint4, setGameNotesFunction, setGameTimeFunction,
} from "../../components/helper";
import { format } from 'date-fns'
import {shallowEqual} from "../../components/ShallowEqual";
import {NotesOpen, TopRight, GameIntro, TimeBlock, CommentWindow} from "../../components/sharedComponents";
import {gameScoreByGameStatsID, getGame} from "../../graphql/queries";
import {generateClient} from "aws-amplify/api";

export function Hurricane1Easy() {
    const client = generateClient();
    /* for all games */
    const [isChecked, setIsChecked] = useState(false);
    const [lightDark, setLightDark] = useState("");
    const [game, setGame] = useState([]);
    const [gameHint, setGameHint] = useState([]);
    const [gameHintVisible, setGameHintVisible] = useState({});
    const [playZone, setPlayZone] = useState([]);
    const [zoneVisible, setZoneVisible] = useState("");

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
    const [gameBackpack, setGameBackpack] = useState([]);
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
                    let i = 0;
                    while (i <gamesFromAPI.gameHint.items.length) {
                        let key = "help" + (i + 1);
                        setGameHintVisibleFunction(key, false);
                        i++;
                    }
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
                    let i = 0;
                    while (i <gamesFromAPI.gameHint.items.length) {
                        let key = "help" + (i + 1);
                        setGameHintVisibleFunction(key, false);
                        i++;
                    }
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

    /* STOP 1 */
    /* guessing states and answers for 1st safe - 3 words */
    /* game answers */
    const [guess1, setGuess1] = useState('');
    const [haveGuessed1, setHaveGuessed1] = useState(false);
    const [isWrong1, setIsWrong1] = useState(true);
    const [answer1] = useState("Wesseling");

    const [guess2, setGuess2] = useState('');
    const [haveGuessed2, setHaveGuessed2] = useState(false);
    const [isWrong2, setIsWrong2] = useState(true);
    const [answer2] = useState("Guard");

    const [guess3, setGuess3] = useState('');
    const [haveGuessed3, setHaveGuessed3] = useState(false);
    const [isWrong3, setIsWrong3] = useState(true);
    const [answer3] = useState("baseball");

    /* end guessing states and answers for 1st safe - 3 words */

    function checkAnswer(guess1Val, guess2Val, guess3Val) {
        setGuess1(guess1Val);
        setGuess2(guess2Val);
        setGuess3(guess3Val);
        let x = 0;
        console.log("guess: " + guess1);
        if (guess1Val != '' && shallowEqual(guess1Val,answer1)) {
            console.log("guess 1 is right");
            setHaveGuessed1(true);
            setIsWrong1(false);
            x = x + 1;
        } else {
            console.log("wrong guess1");
            if (guess1Val != '') {
                setHaveGuessed1(true);
                setIsWrong1(true);
            }
        }
        if (guess2Val != '' && shallowEqual(guess2Val,answer2)) {
            console.log("guess 2 is right");
            setHaveGuessed2(true);
            setIsWrong2(false);
            x = x + 1;
        } else {
            console.log("wrong guess2");
            if (guess2Val != '') {
                setHaveGuessed2(true);
                setIsWrong2(true);
            }
        }
        if (guess3Val != '' && shallowEqual(guess3Val,answer3)) {
            console.log("guess 3 is right");
            setHaveGuessed3(true);
            setIsWrong3(false);
            x = x + 1;
        } else {
            console.log("wrong guess3");
            if (guess3Val != '') {
                setHaveGuessed3(true);
                setIsWrong3(true);
            }
        }
        /* set wingame */
        if (x == 3) {
            console.log("stop 1 open safe");
            /* set timeout to close window? */
            /* isSafeInfoVisible - close in 3 seconds because solved*/
            setTimeout(() => {
                setIsSafeInfoVisible(false);
            }, 3000);

        }
    }
    /* end guessing states and answers for 1st  safe - 3 words */

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

    /* game action */
    /* sign is hanging */
    const [isSignVisible, setIsSignVisible] = useState(false);
    function toggleSign() {
        isSignVisible ? setIsSignVisible(false) : setIsSignVisible(true);
     }
    /* torn diary with message */
    const [isTornDiaryVisible, setIsTornDiaryVisible] = useState(false);
    function toggleTornDiary() {
        isTornDiaryVisible ? setIsTornDiaryVisible(false) : setIsTornDiaryVisible(true);
    }
    /* diary with message */
    const [isDiaryVisible, setIsDiaryVisible] = useState(false);
    function toggleDiary() {
        isDiaryVisible ? setIsDiaryVisible(false) : setIsDiaryVisible(true);
     }
    /* need to click on safe */
    const [isSafeInfoVisible, setIsSafeInfoVisible] = useState(false);
    function toggleSafe() {
        isSafeInfoVisible ? setIsSafeInfoVisible(false) : setIsSafeInfoVisible(true);
    }
    /* need to select prybar and then click on cement marking */
    const [isCementSafeInfoVisible, setIsCementSafeInfoVisible] = useState(false);
    function toggleCementSafeInfo() {
        isCementSafeInfoVisible ? setIsCementSafeInfoVisible(false) : setIsCementSafeInfoVisible(true);
    }
    /* show 2nd safe and message */
    const [isCementSafeOpen, setIsCementSafeOpen] = useState(false);
    function toggleCementSafe() {
        isCementSafeOpen ? setIsCementSafeOpen(false) : setIsCementSafeOpen(true);
    }

    /* Finish Game (not move on to next stop) */
    const [isSandbagMessageVisible, setIsSandbagMessageVisible] = useState(false);
    function toggleSandbagMessages() {
        isSandbagMessageVisible ? setIsSandbagMessageVisible(false) : setIsSandbagMessageVisible(true);
    }
    /* backpack functions */
    /* backpack items: key */
    /* key is used to open sandbag vault */
    const [isKeyOn, setIsKeyOn] = useState(false);
    function showItemContents(value) {
        console.log("show contents value: " + value);
        switch (value) {
            case 'key':
                console.log("isKeyOn 1: " + isKeyOn);
                setIsKeyOn(!isKeyOn);
                // change image
                for (var i = 0; i < gameBackpack.length; i++) {
                    if (gameBackpack[i].key === "key") {
                        console.log("turn on/off key - state");
                        if (!isKeyOn) {
                            gameBackpack[i].src = "https://escapeoutbucket213334-staging.s3amazonaws.com/public/hurricane/key-using.png"
                            localStorage.setItem("key", "https://escapeoutbucket213334-staging.s3amazonaws.com/public/hurricane/key-using.png");
                        } else {
                            gameBackpack[i].src = "https://escapeoutbucket213334-staging.s3amazonaws.com/public/hurricane/key-not-using.png"
                            localStorage.setItem("key", "https://escapeoutbucket213334-staging.s3amazonaws.com/public/hurricane/key-not-using.png");
                        }
                    }
                }
                break;
            default:
        }
    }
    /* remove key from window and put in backpack and turn off on in backpack */
    const [isKeyVisible, setIsKeyVisible] = useState(true);
    function keyInBackpack() {
        setIsKeyVisible(false);
        setIsAlertVisible(true);
        setAlertText('Key is in backpack')
        setTimeout(() => {
            setIsAlertVisible(false);
         }, 3000);
        console.log("put key in backpack");
        localStorage.setItem("key", "https://escapeoutbucket213334-staging.s3amazonaws.com/public/hurricane/key-not-using.png");
        /* check if there */
        if (gameBackpack.length > 0) {
            for (var i = 0; i < gameBackpack.length; i++) {
                var bptest = true;
                if (gameBackpack[i].key === "key") {
                    console.log("key is already there");
                    bptest = false;
                }
            }
            if (bptest === true) {
                console.log("push key to backpack");
                gameBackpack.push({
                    src: 'https://escapeoutbucket213334-staging.s3amazonaws.com/public/hurricane/key-not-using.png',
                    key: 'key'
                })
            }
        } else {
            console.log("push key to backpack (1st item)");
            gameBackpack.push({
                src: 'https://escapeoutbucket213334-staging.s3amazonaws.com/public/hurricane/key-not-using.png',
                key: 'key'
            })
        }
    }
    /* end stop 1 - game specific */
    const backgroundImage = (src) => (
        "url("+ src + ")");
    const keyID = (src,name) => (
        name + "_"+ src);
    const divStyle = (src) => ({
        background:  "url(" + src + ") 0 0 / contain no-repeat"
    });


   const clueTopArray = {
        items: [
               {
                   clue_id: 1,
                   clue_name: "clue name 1",
                   clue_image: "/hanging-sign-tree.png",
                   clue_text: "The hanging sign on tree clue is don't come around here no more.",
                   playzone_id: "b2972f95-7b36-4e81-aaeb-baa7d9ccd440",
                   position: "top",
                   order: 2
               },
               {
                   clue_id: 2,
                   clue_name: "clue name 2",
                   clue_image: "/torndiarypage.png",
                   clue_text: "the torn diary page clue is mysterious.",
                   playzone_id: "b2972f95-7b36-4e81-aaeb-baa7d9ccd440",
                   position: "top",
                   order: 3
               },
                {
                    clue_id: 3,
                    clue_name: "clue name 3",
                    clue_image: "/torndiarypage.png",
                    clue_text: "the torn diary page clue is mysterious.",
                    playzone_id: "f06d403c-54bf-4dca-8041-d64c09dd473f",
                    position: "top",
                    order: 3
                },
       ]};
   /* remove below */
    const [clues, setClues] = useState();
    /* end */

    const [gameClueVisible, setGameClueVisible] = useState({});

    /* create function,  useeffect on load? */
    /* will move up to 103 or where hintArray is set */
    const clueTopArraySorted = clueTopArray.items.sort((a, b) => {
        return a.order - b.order;
    });
    const [gameTopClues, setGameTopClues] = useState(clueTopArraySorted);
    //setGameClues(clueHintArray);
    //console.log("gamesFromAPI.gameClue.items.length: " + gamesFromAPI.gameClue.items.length);
    /* set up state visibility for clues */
    let i = 0;
    while (i < clueTopArraySorted) {
        /* should key be hint id? */
        let key = "clue" + (i + 1);
        setGameClueVisibleFunction(key, false);
        i++;
    }

    function setGameClueVisibleFunction(key, value) {
        console.log("setGameClueVisibleFunction: " + key);
        if (key) {
            setGameClueVisible({...gameClueVisible, [key]: value})
        }
    }

    function toggleClue(clueID) {
        isSignVisible ? setIsSignVisible(false) : setIsSignVisible(true);
    }
    return (
        <View position="relative" height="100%">
            <View className={isChecked? "game-container " : "game-container light-dark"}>
                <View className="top-bar light-dark">
                    <Flex className="zone-holder"
                          direction="row"
                          justifyContent="flex-start"
                          alignItems="flex-start"
                          alignContent="center"
                          wrap="nowrap"
                          gap="1rem">
                        {playZone.map((zone,index) => (
                            <View key={zone.id} ariaLabel={zone.id}>
                                <Image className={(zoneVisible==zone.id)? "zone-border show" : "show"} src={zone.gameZoneDescription}  onClick={() => setZoneVisible(zone.id)} />
                            </View>
                                ))}
                    </Flex>
                    <View className="backpack-holder">
                        <Image src='/backpack-new.png' />
                    </View>

                </View>

               <View className="play-area">
                <View className="image-mask light-dark-mask"></View>

                   {playZone.map((zone,index) => (
                       <View aria-label={keyID(zone.id,"zone")} key={keyID(zone.id,"zone")} className={(zoneVisible==zone.id)? "image-holder show" : "hide"} backgroundImage={backgroundImage(zone.gameZoneImage)}></View>
                   ))}

                    <View className="clue-holder-bottom">
                            <Image src='/torndiarypage.png' />
                            <Image src='/diary.png' />
                    </View>


                   {gameTopClues.map((clue,index) => (
                       <View key={clue.clue_id} ariaLabel={clue.clue_id}>
                           <View ariaLabel={clue.clue_name} top={((index)*60) + "px"} className="clickable clue-top" onClick={()=>setGameClueVisibleFunction(["clue" + (index + 1)], true)}>
                               <Image src = {clue.clue_image} />
                           </View>
                           <View className={gameClueVisible["clue" + (index+1)]? "cover-screen show-gradual" : "cover-screen hide-gradual"}>
                               <View className="all-screen light-dark">
                                   <Button className="close-button light-dark" onClick={()=>setGameClueVisibleFunction(["clue" + (index + 1)], false)}>X</Button>
                                   <Heading level={"6"} className="heading  light-dark" paddingTop="10px">{clue.clue_name}</Heading>
                                   <View paddingTop="10px">{clue.clue_text}</View>
                                   <Flex className="window-button-bottom" justifyContent="center" gap="1rem">
                                       <Button className="button small" onClick={()=>setCluesFunction("  ** start clue (" + clue.clue_name + ") ==> " +
                                           clue.clue_text + " <== end clue ** ")}>add clue to notes</Button>
                                       <Button className="button action-button small" onClick={()=>setGameClueVisibleFunction(["clue" + (index + 1)], false)}>close clue</Button>
                                   </Flex>
                               </View>
                           </View>
                       </View>
                   ))}
                    {gameTopClues.map((clue,index) => (
                        <View key={keyID(clue.clue_id,"clue")} ariaLabel={keyID(clue.clue_id,"clue")}>
                            <View ariaLabel={clue.clue_name} top={((index)*60) + "px"} className="clickable clue-top" onClick={()=>setGameClueVisibleFunction(["clue" + (index + 1)], true)}>
                                <Image src = {clue.clue_image} />
                            </View>
                            <View className={gameClueVisible["clue" + (index+1)]? "cover-screen show-gradual" : "cover-screen hide-gradual"}>
                                <View className="all-screen light-dark">
                                    <Button className="close-button light-dark" onClick={()=>setGameClueVisibleFunction(["clue" + (index + 1)], false)}>X</Button>
                                    <Heading level={"6"} className="heading  light-dark" paddingTop="10px">{clue.clue_name}</Heading>
                                    <View paddingTop="10px">{clue.clue_text}</View>
                                    <Flex className="window-button-bottom" justifyContent="center" gap="1rem">
                                        <Button className="button small" onClick={()=>setCluesFunction("  ** start clue (" + clue.clue_name + ") ==> " +
                                            clue.clue_text + " <== end clue ** ")}>add clue to notes</Button>
                                        <Button className="button action-button small" onClick={()=>setGameClueVisibleFunction(["clue" + (index + 1)], false)}>close clue</Button>
                                    </Flex>
                                </View>
                            </View>
                        </View>
                    ))}
                    <View className="puzzle-holder-bottom">
                        <Image src='/safe.png' />
                    </View>
                    <View className="right-side"></View>
                {/* all games */}
                <TopRight isHelpVisible={isHelpVisible} setIsHelpVisible={setIsHelpVisible}
                          areNotesVisible={areNotesVisible} setAreNotesVisible={setAreNotesVisible}
                          isBackpackVisible={isBackpackVisible} setIsBackpackVisible={setIsBackpackVisible}
                          gameBackpack={gameBackpack} showItemContents={showItemContents} />
                {/* end all games */}
                {/* static, non-clickable items */}

                {/* end static, non-clickable items */}
                <View ariaLabel="Torn Diary" className="torn-diary-jaycee clickable" onClick={()=>toggleTornDiary()}>
                    <Image src="https://escapeoutbucket213334-staging.s3amazonaws.com/public/hurricane/torndiarypage.png" />
                </View>
                <View className={isTornDiaryVisible? "cover-screen show-gradual" : "hide-gradual"}>
                    <View className="all-screen show">
                        <Button className="close-button" onClick={()=>toggleTornDiary()}>X</Button>
                        <View textAlign="center">
                            <Button className="button small" onClick={()=>setCluesFunction(
                                "  ** start clue (torn diary page) ==> What is the name of the house Northwest" +
                                "of here? (not a bathroom) <== end clue ** "
                                ,setAlertText,setIsAlertVisible,setClues)}>add clue below to notes</Button>
                        </View>
                     <View className="torn-diary-big-jaycee">
                        What is the name of the <br /><br />house Northwest <br /><br />of here? (not a bathroom)
                    </View>
                        <View width="100%" textAlign='center' marginTop="5px">
                            <Button className="button action-button small" onClick={()=>toggleTornDiary()}>tap to close this window</Button>
                        </View>
                    </View>
                </View>



                <View ariaLabel="Diary" className="diary-jaycee clickable" onClick={()=>toggleDiary()}>
                    <Image src="https://escapeoutbucket213334-staging.s3amazonaws.com/public/hurricane/diary.png" />
                </View>
                <View className={isDiaryVisible? "cover-screen show-gradual" : "all-screen hide"}>
                    <View className="all-screen show">
                        <View textAlign="center">
                            <Button className="button small" onClick={()=>setCluesFunction(
                                "  ** start clue (diary) ==> Dear Diary, I love playing" +
                                " the sport on the field closest to the shelter. <== end clue ** "
                                ,setAlertText,setIsAlertVisible,setClues)}>add clue below to notes</Button>
                        </View>
                    <Button className="close-button" onClick={()=>toggleDiary()}>X</Button>
                    <View className="diary-big-jaycee">
                        Dear Diary, <br /><br />I love playing.<br/><br/>the sport<br /><br />on the field<br /><br />closest to the shelter.
                    </View>
                        <View width="100%" textAlign='center' marginTop="5px">
                            <Button className="button action-button small" onClick={()=>toggleDiary()}>tap to close this window</Button>
                        </View>
                    </View>
                </View>

                { (!isWrong1 && !isWrong2 && !isWrong3)  ? (
                    <View>
                        <View className="safe-shelter clickable show">
                            <Image src="https://escapeoutbucket213334-staging.s3amazonaws.com/public/hurricane/open-safe.png" />
                            <View marginBottom="10px" marginRight="10px" className={isKeyVisible ? "safe-shelter inside-safe clickable show" : "hide"}
                                  onClick={()=>keyInBackpack()}>
                                <Image src="https://escapeoutbucket213334-staging.s3amazonaws.com/public/hurricane/key.png"/>
                            </View>
                        </View>
                    </View>
                ) :  <View ariaLabel="Safe Shelter" className="safe-shelter clickable" onClick={()=>toggleSafe()}>
                    <Image src="https://escapeoutbucket213334-staging.s3amazonaws.com/public/hurricane/safe.png"/>
                </View> }

                <View className={!isKeyOn? "cement-safe  z-Index-not-clicked show" : "hide"}>
                    <Image alt="test" src="https://escapeoutbucket213334-staging.s3amazonaws.com/public/hurricane/cementsafe-closed-keyhole.png" />
                </View>
                <View className={isKeyOn? "cement-safe clickable show" : "hide"}
                      onClick={()=>toggleCementSafe()}>
                    <Image alt="test" src="https://escapeoutbucket213334-staging.s3amazonaws.com/public/hurricane/cementsafe-closed-keyhole.png" />
                </View>
                <View className={isCementSafeOpen && isKeyOn? "cement-safe clickable show" : "hide"}
                      onClick={()=>toggleCementSafeInfo()}>
                    <Image alt="test" src="https://escapeoutbucket213334-staging.s3amazonaws.com/public/hurricane/cementsafeopencode.png" />
                </View>

                <View className={(!isWrong4)? "cement-safe show" : "hide"}
                      onClick={()=>toggleSandbagMessages()}>
                    <Image alt="test" src="https://escapeoutbucket213334-staging.s3amazonaws.com/public/hurricane/cementsafe-shelter-easy-discs.png" />
                </View>
            </View>

                <View ariaLabel="Time" className="time light-dark">
                    <View className="small">hint time: {gameTimeHint} mins | time started: {realTimeStart ? format(realTimeStart, "MM/dd/yyyy H:mma") : null} </View>
                    <Button marginRight={"10px"} className="button button-small" onClick={() => isHelpVisible? setIsHelpVisible(false) : setIsHelpVisible(true)}>Help</Button>
                    <Button marginRight={"10px"} className="button button-small"  onClick={() => {console.log("noteclick"); areNotesVisible ? setAreNotesVisible(false) : setAreNotesVisible(true)}}>Notes</Button>
                    <Button marginRight={"10px"} className="button button-small">Map</Button>
                    <SwitchField
                        isDisabled={false}
                        label="light/dark"
                        isChecked={isChecked}
                        labelPosition="start"
                        onChange={(e) => {
                            setIsChecked(e.target.checked);
                        }}
                    />
                </View>
                <NotesOpen areNotesVisible={areNotesVisible} clues={clues} setClues={setClues} setAreNotesVisible={setAreNotesVisible} toggleNotes={toggleNotes} gameNotes={gameNotes} setGameNotes={setGameNotes} setGameNotesFunction={setGameNotesFunction}/>

           {/* puzzle solving */}
            <View className={isSafeInfoVisible ? "cover-screen show-gradual" : "all-screen hide"}>
                <View className="all-screen show">
                <Button className="close-button" onClick={()=>toggleSafe()}>X</Button>
                <br />
                <TextField
                    label="Word 1 (9 letters - hanging sign)"
                    value={guess1}
                    onChange={(e) => checkAnswer(e.currentTarget.value,guess2,guess3)}/>
                {
                    (haveGuessed1 && isWrong1 && !showComment)  ? (
                        <span className="red"> Wrong Answer!</span>
                    ) : null
                }
                {
                    (!isWrong1 && !showComment)  ? (
                        <span className="green"> Right Answer!</span>
                    ) : null
                }
                <TextField
                    label="Word 2 (5 letters - torn diary page)"
                    value={guess2}
                    onChange={(e) => checkAnswer(guess1,e.currentTarget.value,guess3)}/>
                {
                    (haveGuessed2 && isWrong2 && !showComment)  ? (
                        <span className="red"> Wrong Answer!</span>
                    ) : null
                }
                {
                    (!isWrong2 && !showComment)  ? (
                        <span className="green"> Right Answer!</span>
                    ) : null
                }
                <TextField
                    label="Word 3 (8 letters - diary)"
                    value={guess3}
                    onChange={(e) => checkAnswer(guess1,guess2,e.currentTarget.value)}/>
                {
                    (haveGuessed3 && isWrong3 && !showComment)   ? (
                        <span className="red"> Wrong Answer!</span>
                    ) : null
                }
                {
                    (!isWrong3 && !showComment)  ? (
                        <span className="green"> Right Answer!</span>
                    ) : null
                }
                <View width="100%" textAlign='center' marginTop="5px">
                    <Button className="button action-button small" onClick={()=>toggleSafe()}>tap to close this window</Button>
                    <br/><Button className={areNotesVisible ? "hide" : "link-button small"}
                                 onClick={() => toggleNotes(areNotesVisible, setAreNotesVisible)}>open
                    notes</Button>
                </View>
                    {(!isWrong1 && !isWrong2 && !isWrong3 && !showComment) ? (
                        <View textAlign="center" marginTop="1em">
                            <View className="green"> Right Answer! <br/>(window will close in 3 seconds)</View>
                        </View>
                    ) : (
                        <NotesOpen areNotesVisible={areNotesVisible} clues={clues} setClues={setClues} setAreNotesVisible={setAreNotesVisible} toggleNotes={toggleNotes} gameNotes={gameNotes} setGameNotes={setGameNotes} setGameNotesFunction={setGameNotesFunction}/>

                    )
                    }
            </View>
            </View>
            {/* puzzle solving */}
            <View className={isCementSafeInfoVisible ? "cover-screen show-gradual" : "all-screen hide"}>
                <View className="all-screen show">
                <Button className="close-button" onClick={()=>toggleCementSafeInfo()}>X</Button>
                <TextField
                    label="Try to Open Floor Safe! (3 letters)"
                    value={guess4}
                    onChange={(e) => checkAnswer2(e.currentTarget.value)}/>
                {
                    haveGuessed4 && isWrong4 && !showComment ? (
                        <span className="red"> Wrong Answer!</span>
                    ) : null
                }

                { !isWrong4  && !showComment  ? (
                    <View textAlign="center" marginTop="1em">
                        <View className="green"> Right Answer! <br/>(window will close in 3 seconds)</View>
                    </View>
                ) : (
                    <View>
                        <div>
                            <br /><h3>Engraved on Panel:</h3>
                            The <span className="bold-underline">first</span> thing I did was visit <br />
                            the named field.<br />
                            The <span className="bold-underline">second</span> thing I did was visit the house.<br />
                            The <span className="bold-underline">third</span> thing I did was<br />
                            play a sport.
                        </div>
                        <View width="100%" textAlign='center' marginTop="5px">
                        <Button className="button action-button small" onClick={()=>toggleCementSafeInfo()}>tap to close this window</Button>
                        <br/><Button className={areNotesVisible ? "hide" : "link-button small"}
                        onClick={() => toggleNotes(areNotesVisible, setAreNotesVisible)}>open
                        notes</Button>
                        </View>
                        <NotesOpen areNotesVisible={areNotesVisible} clues={clues} setClues={setClues} setAreNotesVisible={setAreNotesVisible} toggleNotes={toggleNotes} gameNotes={gameNotes} setGameNotes={setGameNotes} setGameNotesFunction={setGameNotesFunction}/>

                    </View>

                )}
                </View>
            </View>
            {(!isWrong4 && !showComment)? (
                    <View className={isWinnerScreenVisible ? "show" : "hide"}>
                        <View className="black-box">
                            <h3>WINNER!</h3>
                        <View>Now you have lots of Discs!</View>
                            <View marginTop="20px">
                                <Image src="https://escapeoutbucket213334-staging.s3amazonaws.com/public/hurricane/cementsafe-shelter-easy-discs.png"/>
                            </View>
                        </View>

                        <View className="bottom z-index125">
                            <View color="white">Total Time: {gameTimeTotal}</View>
                            <Button className="button" onClick={() => leaveComment(setShowComment)}>Please Tap to Leave
                                Comment</Button>
                        </View>
                    </View>
                ): null }


            {(showComment) ? (
                <CommentWindow setGameComments={setGameComments} gameComments={gameComments}/>
            ) : null}

            <View className={isHelpVisible ? "cover-screen show-gradual help" : "help hide"}>
                <View className="all-screen show">
                    <Button className="close-button"
                            onClick={() => toggleHelp(isHelpVisible, setIsHelpVisible)}>X</Button>
                    <View width="100%" padding="10px">
                        <View paddingBottom="10px">
                            <strong>How to Play:</strong> Click around - some items will disappear and then appear
                            in your backpack. If it is in your backpack you may be able to use it by clicking on it.
                        </View>
                        <View paddingBottom="10px">
                            <strong>Goal for this stop:</strong> {game.gameGoals}
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
                           src="https://escapeoutbucket213334-staging.s3amazonaws.com/public/hurricane/jaycee-park-map.png"/>
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
