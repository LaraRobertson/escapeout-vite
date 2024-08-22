import React, {useEffect, useState} from 'react';
import {
 Flex,
 Button,
 Heading,
 View,
 TextField,
 TextAreaField,
 SwitchField,
 Input,
 useAuthenticator, Image
} from '@aws-amplify/ui-react';
import {listGameStats} from "../../graphql/queries";
import {generateClient} from "aws-amplify/api";
import { format } from 'date-fns';

export default function HomeSection(props) {
    const [showAllTimeButton, setShowAllTimeButton] = useState(true);
    const client = generateClient();
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    useEffect( () => {
        console.log("useeffect (fetchUserGamePlayNow) - date: " + today.toLocaleDateString('en-CA'));
        fetchUserGamePlayNow(today.toLocaleDateString('en-CA'));
    }, []);
   const [usersPlayingNow, setUsersPlayingNow] = useState([]);

    async function fetchUserGamePlayNowNotCompleted(date, completed) {
       let filter = {
            gameStates: {
                eq: "{\"waiverSigned\":true}"
            },
            updatedAt: {
                gt: date
            }
        }

        try {
            const apiListGameStats = await client.graphql({
                query:listGameStats,
                variables: {filter: filter}
            });
            const gameStatsByID = apiListGameStats.data.listGameStats.items;
            let usersPlayingNowArray = [];
            console.log("gameStatsByID.length: " + gameStatsByID.length);
            for (let i=0; i<gameStatsByID.length; i++) {
                let userEmail = gameStatsByID[i].userEmail;
                let gameName = gameStatsByID[i].gameName;
                let city = gameStatsByID[i].gameLocationCity;
                let gameStates = gameStatsByID[i].gameStates;
                // loop thru gameStat.items  - no gamescores!*/
                let playingNowObject = {
                    id: i,
                    userEmail: userEmail,
                    gameName: gameName,
                    gameStates: gameStates,
                    city: city,
                    updatedAt: gameStatsByID[i].updatedAt,
                    createdAt: gameStatsByID[i].createdAt
                }
                usersPlayingNowArray.push(playingNowObject);
            }
            setUsersPlayingNow(usersPlayingNowArray);
        } catch (err) {
            console.log("error listGameStats..", err)
        }

    }
   async function fetchUserGamePlayNow(date, completed) {

       let filter = {
           gameStates: {
               eq: "{\"waiverSigned\":true,\"completed\":true}"
           },
           updatedAt: {
               gt: date
           }
       }

      try {
       const apiListGameStats = await client.graphql({
        query:listGameStats,
        variables: {filter: filter}
       });
       const gameStatsByID = apiListGameStats.data.listGameStats.items;
          let usersPlayingNowArray = [];
          console.log("gameStatsByID.length: " + gameStatsByID.length);
          for (let i=0; i<gameStatsByID.length; i++) {
              let userEmail = gameStatsByID[i].userEmail;
              let gameName = gameStatsByID[i].gameName;
              let city = gameStatsByID[i].gameLocationCity;
              let gameStates = gameStatsByID[i].gameStates;
              // loop thru gameScore.items */
              console.log("gameStatsByID[i].gameScore.items.length: " + gameStatsByID[i].gameScore.items.length);
              for (let j=0; j < gameStatsByID[i].gameScore.items.length; j++) {
                  console.log("gameStatsByID[i].gameScore.items[j].createdAt: " + gameStatsByID[i].gameScore.items[j].createdAt);
                  console.log("gameStatsByID[i].gameScore.items[j].completed: " + gameStatsByID[i].gameScore.items[j].completed);
                /* check createdAt, updatedAt, completed */
                 if (gameStatsByID[i].gameScore.items[j].completed) {
                     let playingNowObject = {
                         id: j,
                         userEmail: userEmail,
                         gameName: gameName,
                         gameStates: gameStates,
                         city: city,
                         createdAt:  gameStatsByID[i].gameScore.items[j].createdAt,
                         updatedAt:  gameStatsByID[i].gameScore.items[j].updatedAt,

                     }
                     //console.log("j: " + j + " playingNowObject: " + JSON.stringify(playingNowObject));
                     usersPlayingNowArray.push(playingNowObject);
                     break;
                  }
              }
          }
          setUsersPlayingNow(usersPlayingNowArray);
      } catch (err) {
       console.log("error listGameStats..", err)
      }

   }
   return (
       <>
           <Heading level={4} marginBottom={"20px"}>Home Section</Heading>

           <View>
           <Button className={showAllTimeButton ? "button small" : "hide"} onClick={() => {
               fetchUserGamePlayNow("2021-04-01");
               setShowAllTimeButton(false)}
           }>show all time</Button>
           <Button className={showAllTimeButton ? "hide" : "button small"} onClick={() => {
               fetchUserGamePlayNow(today.toLocaleDateString('en-CA'));
               setShowAllTimeButton(true)}
           }>show today</Button>
               <Button className={"button small"} onClick={() => {
                   fetchUserGamePlayNowNotCompleted(today.toLocaleDateString('en-CA'),"not completed");}
               }>playing now</Button>
           </View>
           <Heading level={6} marginTop="10px" marginBottom={"10px"}>{showAllTimeButton? "Today":"All Time"}</Heading>
           <View><hr /></View>
        {usersPlayingNow.map((user, index) => (
            <View key={index}>{index+1}: email: {user.userEmail} | gameName: {user.gameName} <br />
                city: {user.city} | gameStates: {user.gameStates}
                <br /> createdAt: {format(user.createdAt, "MM/dd/yyyy H:mma")} | updatedAt: {format(user.updatedAt, "MM/dd/yyyy H:mma")}<br />
            <hr /></View>
        ))}
       </>
   )
}