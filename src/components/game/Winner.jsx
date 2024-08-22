import {
    Button,
    Flex,
    Heading,
    Image,
    Radio,
    RadioGroupField,
    TextAreaField, ToggleButton,
    ToggleButtonGroup,
    View
} from "@aws-amplify/ui-react";
import React, {useContext, useState} from "react";
import * as mutations from "../../graphql/mutations";
import {MyGameContext} from "../../MyContext";



export default function Winner(props) {
    console.log("Winner");
    let game=props.game;
    let gameTimeHint=props.gameTimeHint;
    let gameTimeTotal=props.gameTimeTotal;
    return (
        <View className="black-box">
            <strong>WINNER!</strong>
            <View marginBottom={"10px"}>{game.gameWinMessage}</View>
            <View color="white">Total Time: {gameTimeTotal} minutes</View>
            <View color="white">Hint Time: {gameTimeHint} minutes </View>

        <CommentSection />
        </View>
    )
}
export function CommentSection() {
    const { client, navigate, gameScoreID } = useContext(MyGameContext);
    const [gameComments,setGameComments] = useState({});
    const [isAlertVisible, setIsAlertVisible] = useState(false);
    const [alertText, setAlertText] = useState('');
    function setGameCommentsFunction(key, value) {
        setGameComments({...gameComments, [key]: value})
    }
    async function updateGameScoreCommentsFunction(comment) {
        //removeLocalStorage();
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
    /* comments */
    const [exclusiveValue1, setExclusiveValue1] = useState('');
    const [exclusiveValue2, setExclusiveValue2] = useState('');
    const [exclusiveValue3, setExclusiveValue3] = useState('');
    const [exclusiveValue4, setExclusiveValue4] = useState('');
    const [exclusiveValue5, setExclusiveValue5] = useState('');
    return (
        <>

            <View className={isAlertVisible ? "alert-container show" : "hide"}>
                <div className='alert-inner'>{alertText}</div>
            </View>
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
    </Flex>
            <View className="modal-from-top-close" paddingTop="10px" textAlign={"center"} width={"100%"}>
                <Button className="close dark" onClick={() => updateGameScoreCommentsFunction(true)}>close</Button>
            </View>
        </>
    )
}