import {gameScoreByGameStatsID, gameStatsByGameID} from "../../graphql/queries";
import {generateClient} from "aws-amplify/api";

const client = generateClient();

export async function checkWaiver(gameDetailsVar) {
    let filter = {
        userEmail: {
            eq: gameDetailsVar.email
        }
    };
    try {
        const apiGameStats = await client.graphql({
            query: gameStatsByGameID,
            variables: {filter: filter, gameID: gameDetailsVar.gameID}
        });
        if (apiGameStats.data.gameStatsByGameID.items.length > 0) {
            /* means user has signed waiver and there is a gameStat and user has either signed waiver or played before */
            /* check gameScore and get number of times */
            const gamesStatsFromAPI = apiGameStats.data.gameStatsByGameID.items[0];
            /* get game score */
            try {
                const apiGameScore = await client.graphql({
                    query: gameScoreByGameStatsID,
                    variables: {gameStatsID: gamesStatsFromAPI.id}
                });
                if (apiGameScore) {
                    /* user has played before */
                    const gamesScoreFromAPI = apiGameScore.data.gameScoreByGameStatsID.items;
                    console.log("gamesScoreFromAPI (home): " + gamesScoreFromAPI.length);
                    if (Array.isArray(gamesScoreFromAPI)) {
                        console.log(gamesScoreFromAPI.length);
                        return {waiverSigned: true, numberOfTimes: gamesScoreFromAPI.length};
                    } else {
                        return {waiverSigned: true, numberOfTimes: 0};
                    }
                } else {
                    return {waiverSigned: false, numberOfTimes: 0};
                }

            } catch (err) {
                console.log("error gameScoreByGameStatsID..", err);
                return null;
            }

        } else {
            /* first time */
            console.log("first time");
            return {waiverSigned: false, numberOfTimes: 0};
        }
    } catch (err) {
        console.log("error gameScoreByGameStatsID..", err);
        return null;
    }
}