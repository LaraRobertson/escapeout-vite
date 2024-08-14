import {Accordion, Link, View} from "@aws-amplify/ui-react";
import React from "react";

export default function HowToPlay() {
    console.log("How to Play");
    return (
        <View className={"modal-middle"}>
            <Accordion.Container allowMultiple defaultValue={['start-game']}>
                <Accordion.Item value="start-game">
                    <Accordion.Trigger>
                        <strong>Overview of Game</strong>
                        <Accordion.Icon/>
                    </Accordion.Trigger>
                    <Accordion.Content>
                        <View>
                            <View marginBottom={"5px"}><strong>-> Create a FREE account and Sign in to Play</strong>
                                    <View className="small italics">Currently you can sign in with
                                        email/password. It's probably best to set an easy password,
                                        there will be no sensitive data to steal here or you can use
                                        your google account to sign in. Your email will not be used for anything other than managing your account here.
                                    </View></View>
                            <View marginBottom={"5px"}><strong>-> Review available games on the list and go to the
                                Game Location before playing.</strong></View>
                            <View marginBottom={"5px"}><strong>-> Hit Play, agree to Waiver, and select a Team Name to use as your
                                team name.</strong></View>
                            <View marginBottom={"5px"}><strong>-> Start game and solve the puzzles.</strong></View>
                            <View marginBottom={"5px"}><strong>-> The BACK BUTTON is not needed (please do not use back button).</strong></View>

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
                                <li>For group play, one person signs in and selects the Team Name
                                    and hits play which causes the official timed game to start.
                                    The other players on the Team can use the same sign in and select the same
                                    game (and it doesn't matter what team name you select - probably
                                    best to choose the same one) because
                                    the only official score is the first time a single sign plays a game (see Leader Board).
                                </li>
                                <li>If doing Group Play with a Team others can use their own phone and select the same sign in as the first person
                                    for the same game so that they can see all the clues and puzzles. Seeing all the same information and solving
                                    as quick as you can helps your Team complete the game faster - just let the person with the official sign in know your answers!
                               </li>
                                <li>If a group wants to do team play it is best to choose an email
                                    that can be easily verified and an easy password that can be entered easily. There is no sensitive information on this account.
                                    Please contact us at info@escapeout.games if you have questions.
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
                                <li>Play Zones (Zones) indicates the area where the answer to the clue is located.</li>
                                <li>Most clues can be solved within a few hundred feet of the Play
                                    Zone.
                                </li>
                            </ul>
                        </View>
                    </Accordion.Content>
                </Accordion.Item>
                <Accordion.Item value="play-zones">
                    <Accordion.Trigger>
                        <strong>Leader Board</strong>
                        <Accordion.Icon/>
                    </Accordion.Trigger>
                    <Accordion.Content>
                        <View>
                            <ul className={"how-to-play-bullets"}>
                                <li>The Leader Board tracks the top times for each game.</li>
                                <li>A time can only be eligible for the
                                Leader Board if the person playing the game has never played that game before (or has never even started that game before).</li>

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
