import {Button, Flex, Heading, View} from "@aws-amplify/ui-react";
import React, {useEffect, useState, useContext} from "react";
import {gamesByCity} from "../../graphql/queries";
import GameCard from "./GameCard";
import {generateClient} from "aws-amplify/api";
import {MyAuthContext} from "../../MyContext";

export default function GameList(props) {
    let gameDetails = props.gameDetails;
    const client = generateClient();
    const { authStatus } = useContext(MyAuthContext);

    const [hidePlayedGames, setHidePlayedGames] = useState(false);
    const [loading, setLoading] = useState(false);
    const [gameListByCity, setGameListByCity] = useState([]);
    const [gamesFilter, setGamesFilter] = useState({disabled: {eq:false}});

    /* fetchgames() - on load only */
    useEffect(() => {
        console.log("***useEffect***:  fetchGames():");
        fetchGames();
    }, []);

    function setGameLocationCityFunction(city) {
        console.log("setGameLocationCityFunction: " + city);
        localStorage.setItem("gameLocationCity",city);
        //setGameLocationCity(city);
        fetchGames();
    }
    /* useEffects */
    /*
    So if you want to perform an action immediately after setting state on a state variable,
    we need to pass a callback function to the setState function (use [state variable] at end).
    But in a functional component no such callback is allowed with useState hook.
    In that case we can use the useEffect hook to achieve it.
     */
    /*
    using localStorage instead...
    useEffect(() => {
        console.log("***useEffect***:  fetchGames() - gameLocationCity: " + gameLocationCity);
        fetchGames();
    }, [gameLocationCity]);*/

    async function fetchGames() {
        console.log("fetchGames: by gamesLocationCity: " + localStorage.getItem("gameLocationCity"));
        let gameLocationCity = localStorage.getItem("gameLocationCity");
        console.log("gamesFilter: " + gamesFilter);
        setLoading(true);
        let filterTemp = {
            disabled: {
                eq: false
            }
        };
        if (gameLocationCity !== "" && gameLocationCity != null) {
            try {
                const apiData = await client.graphql({
                    query: gamesByCity,
                    variables: {
                        filter: filterTemp,
                        gameLocationCity: {eq: gameLocationCity},
                        sortDirection: "DESC",
                        type: "game"
                    }
                });
                const gamesFromAPI = apiData.data.gamesByCity.items;
                setGameListByCity(gamesFromAPI);
                setLoading(false);
            } catch (err) {
                console.log("error fetching gamesByCity", err);
            }
        } else {
            setLoading(false);
        }
    }

    return (
    <View id="game-list">
        <View className={"blue-alert"} margin="0 auto 5px auto" textAlign={"center"} fontSize={".8em"}
              padding="5px" lineHeight="1.2em">
            <strong>GAMES ARE IN TESTING MODE</strong>
        </View>
        <Heading level={"6"} className="heading" marginBottom={"10px"}>
            Game List (select city):
            {(authStatus === "authenticated")  &&
                <Button className="close dark small" marginLeft="5px" padding="2px 4px"
                        onClick={() => (hidePlayedGames ? setHidePlayedGames(false) : setHidePlayedGames(true))}>
                    {hidePlayedGames ? "show" : "hide"} played games
                </Button>
            }
        </Heading>
        <Flex
            direction="row"
            justifyContent="flex-start"
            alignItems="stretch"
            alignContent="flex-start"
            wrap="wrap"
            gap="1rem"
        >
            <Button marginRight="5px" className={"button-small small"}
                    backgroundColor={(localStorage.getItem("gameLocationCity") === "Tybee Island") ? ("#0d5189") : ("transparent")}
                    color="white" onClick={() => setGameLocationCityFunction("Tybee Island")}>Tybee
                Island, GA
                {(localStorage.getItem("gameLocationCity") === "Tybee Island") ? (
                    <View>&nbsp;- selected</View>) : null}
            </Button>
            {/*
              <Button marginRight="5px" className={"button-small small"} backgroundColor={(localStorage.getItem("gameLocationCity") === "Savannah")? ("#7e0b0b" ): ("transparent")} color="white"  onClick={() => setGameLocationCityFunction("Savannah")}>Savannah, GA
                {(localStorage.getItem("gameLocationCity") === "Savannah")? (<View>&nbsp;- selected</View> ): (null)}
              </Button>*/}
        </Flex>

        <Flex className="flex-games">
            {loading && (<View>loading</View>)}
            {((gameListByCity.length === 0) && !loading) && <View>Games Coming Soon!</View>}

            {gameListByCity.map((game) => (
               <GameCard
                   game={game}
                   gameDetails = {gameDetails}
                   hidePlayedGames={hidePlayedGames}
                   key={game.id}/>
            ))}
        </Flex>
    </View>
    )
}