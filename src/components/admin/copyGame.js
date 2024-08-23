import {getGame} from "../../graphql/queries";
import {generateClient} from "aws-amplify/api";

export default async function copyGame(props) {
    console.log("gameName: " + props.gameName);
    const client = generateClient();
    const fileName1 = props.gameName + ".txt";
    const fileName2 = props.gameName + "-All.json";
    try {
        const apiData = await client.graphql({
            query: getGame,
            variables: {id: props.gameID}
        });
        const gamesFromAPI = apiData.data.getGame;
        /* const fs = require('fs');
         fs.writeFileSync(
             'data.json',
             JSON.stringify(objJson)
         )*/
        const file = new Blob([apiData], { type: 'application/json' });
        saveAs(file, fileName2);
        /*delete gamesFromAPI.updatedAt;
        delete gamesFromAPI.user;
        delete gamesFromAPI.__typename;
        delete gamesFromAPI.gameHint;
        delete gamesFromAPI.gamePlayZone;
        delete gamesFromAPI.gameClue;
        delete gamesFromAPI.gamePuzzle;*/
        delete gamesFromAPI.id;
        const file2 = new Blob([JSON.stringify(gamesFromAPI)], { type: 'text/plain;charset=utf-8' });
        saveAs(file2, fileName1);
    } catch (err) {
        console.log('error fetching getGame', err);
    }

}