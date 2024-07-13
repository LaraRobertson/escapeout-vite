import {Accordion, Link, View} from "@aws-amplify/ui-react";
import React from "react";

export default function HowToPlay() {
    console.log("How to Play");
    return (
        <View className={"modal-middle"}>
            <Accordion.Container allowMultiple>
                <Accordion.Item value="start-game">
                    <Accordion.Trigger>
                        <strong>Start Game</strong>
                        <Accordion.Icon/>
                    </Accordion.Trigger>
                    <Accordion.Content>
                        <View>
                            <ul className={"how-to-play-bullets"}>
                                <li>Sign in or create a FREE account with your smartphone:<br/>
                                    <View className="small italics">Currently you can sign in with
                                        email/password. It's probably best to set an easy password,
                                        there will be no sensitive data to steal here or you can use
                                        your google account to sign in. We will not do anything with your email.
                                    </View>
                                </li>
                                <li>Select game</li>
                                <li>Go to Location</li>
                                <li>Hit Play, agree to waiver, and select a team name to use as your
                                    team name.
                                </li>
                                <li>Start game and solve the puzzles.</li>
                                <li>The BACK BUTTON is not needed - please do not use.</li>
                            </ul>
                        </View>
                    </Accordion.Content>
                </Accordion.Item>
                <Accordion.Item value="levels">
                    <Accordion.Trigger>
                        <strong>What are Levels?</strong>
                        <Accordion.Icon/>
                    </Accordion.Trigger>
                    <Accordion.Content>
                        <View>
                            <View marginTop={"10px"}>Games have different levels -</View>
                            <ul className={"how-to-play-bullets"}>
                                <li><strong>level 1</strong> is more like a scavenger hunt. You try
                                    to find items referenced in clues and provide numbers, or
                                    colors, or lists of things that match a certain criteria.<br/>
                                    <View className="small italics"> Requirements - reading
                                        comprehension, understanding orientation, counting, some
                                        light math.</View></li>
                                <li><strong>level 2</strong> is more like an escape-room style
                                    puzzle with elements of a scavenger hunt.
                                    You try to find items referenced in clues and use deduction to
                                    figure out the clues. <br/>
                                    <View className="small italics"> Requirements: Attention to
                                        detail, knowing a little math, and understanding
                                        orientation, like north, south, etc is useful</View></li>
                                <li><strong>level 3</strong> are more elaborate escape-room style
                                    puzzles with elements of a scavenger hunt.
                                    Find referenced items and use deduction to figure out the
                                    clues. <br/>
                                    <View className="small italics">Requirements: Observation, Using
                                        Logic, Attention to detail, knowing a little math, and
                                        understanding orientation, like north, south, etc is
                                        useful.</View></li>
                            </ul>
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
        </View>
    )
}
