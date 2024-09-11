import {Button, Flex, Heading, View, Card, Link} from "@aws-amplify/ui-react";
import React, {useEffect, useState, useContext} from "react";
import {gameByGameOrder, gamesByCity, listCities} from "../../graphql/queries";
import GameCard from "./GameCard";
import {generateClient} from "aws-amplify/api";
import {MyAuthContext} from "../../MyContext";

export default function GameList(props) {
    let gameDetails = props.gameDetails;
    const client = generateClient();
    const { authStatus, setModalContent, setGameLocationPlace, gameLocationPlace } = useContext(MyAuthContext);
    const [hidePlayedGames, setHidePlayedGames] = useState(false);
    const [loading, setLoading] = useState(false);
    const [gameListByCity, setGameListByCity] = useState([]);
    const [cities, setCities] = useState([]);
    const [gameListByCityPlace, setGameListByCityPlace] = useState([]);
    const [gameLocationPlaceArray, setGameLocationPlaceArray] = useState([]);
    const [gamesFilter, setGamesFilter] = useState({disabled: {eq:false}});
    const [gameLocationCity, setGameLocationCity] = useState("");
    const [placeView, setPlaceView] = useState("list");

    /* fetchgames() - on load only */
    useEffect(() => {
        console.log("***useEffect***:  fetchGames():");
        fetchGames();
        fetchCities();
    }, []);

    useEffect(() => {
        let gameLocationPlaceTemp = localStorage.getItem("gameLocationPlace");
        if (gameLocationPlaceTemp !== "" && gameLocationPlaceTemp != null){
            setGameLocationPlace(gameLocationPlaceTemp);
        }
        console.log("***useEffect***:  fetchGames() - gameLocationPlace: " + gameLocationPlaceTemp);
        let gameListByCityPlaceArray = gameListByCity.filter(game => game.gameLocationPlace === gameLocationPlaceTemp)
            .sort((a, b) => {
                return a.gameLevel - b.gameLevel;
            });
        console.log("gameListByCityPlaceArray: " + JSON.stringify(gameListByCityPlaceArray));
        setGameListByCityPlace(gameListByCityPlaceArray);
    }, [gameListByCity]);

    useEffect(() => {
        let gameListByCityPlaceArray = gameListByCity.filter(game => game.gameLocationPlace === gameLocationPlace)
            .sort((a, b) => {
                return a.gameLevel - b.gameLevel;
            });
        console.log("gameListByCityPlaceArray: " + JSON.stringify(gameListByCityPlaceArray));
        setGameListByCityPlace(gameListByCityPlaceArray);
    }, [gameLocationPlace]);

    function setGameLocationCityFunction(city) {
        console.log("setGameLocationCityFunction: " + city);
        localStorage.setItem("gameLocationCity",city);
        setGameLocationCity(city);
        fetchGames();
    }

    function setGameLocationPlaceFunction(location){
        /* filter gameListByCity by Place and sort by level */
        console.log("setGameLocationPlaceFunction: " + location);
        localStorage.setItem("gameLocationPlace",location);
        setGameLocationPlace(location);
        let gameListByCityPlaceArray = gameListByCity.filter(game => game.gameLocationPlace === location)
            .sort((a, b) => {
                return a.gameLevel - b.gameLevel;
            });
        console.log("gameListByCityPlaceArraySortByLevel: " + JSON.stringify(gameListByCityPlaceArray));
        setGameListByCityPlace(gameListByCityPlaceArray);
    }
    function handleMapPlaceView() {
       // setGameDetails(gameDetailsVar);
        setModalContent({
            open: true,
            content: "MapPlaceView"
        })
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
        let gameLocationCityTemp = localStorage.getItem("gameLocationCity");
        setGameLocationCity(gameLocationCityTemp);
        console.log("gamesFilter: " + gamesFilter);
        setLoading(true);
        console.log("gameLocationCity: " + gameLocationCity);
        let filterTemp = {
            disabled: {
                eq: false
            }
        };
        if (gameLocationCityTemp !== "" && gameLocationCityTemp != null) {
            try {
                const apiData = await client.graphql({
                    query: gameByGameOrder,
                    variables: {
                        filter: filterTemp,
                        gameLocationCity: gameLocationCityTemp,
                        sortDirection: "ASC"
                    }
                });
                const gamesFromAPI = apiData.data.gameByGameOrder.items;
                setGameListByCity(gamesFromAPI);
                /* get locations */
                if (gamesFromAPI.length > 0) {
                    let gameLocationArray = gamesFromAPI.sort((a, b) => {
                        return a.gameLocationPlace - b.gameLocationPlace;
                    });
                    console.log("sorted by gameLocationPlace: " + JSON.stringify(gameLocationArray));
                    let locationTestArray = [];
                    let locationTest = gameLocationArray[0].gameLocationPlace;
                        locationTestArray.push(locationTest);
                    for (let i=0; i<gameLocationArray.length; i++) {
                        if (!locationTestArray.includes(gameLocationArray[i].gameLocationPlace) ) {
                            locationTestArray.push(gameLocationArray[i].gameLocationPlace);
                        }
                    }
                    setGameLocationPlaceArray(locationTestArray);
                   console.log("gameLocationPlace:" + gameLocationPlace);
                }
                setLoading(false);
            } catch (err) {
                console.log("error fetching gamesByCity", err);
            }
        } else {
            setLoading(false);
        }
    }
    async function fetchCities() {
        let filter = {
            disabled: {
                eq: false
            }
        };
        try {
            const apiData = await client.graphql({
                query: listCities,
                variables: {filter: filter}
            });
            const citiesFromAPI = apiData.data.listCities.items;
            setCities(citiesFromAPI);
        } catch (err) {
            console.log('error fetching cities', err);
        }
    }
    return (
    <View id="game-list">
        <View  className={"blue-light"} margin="0 auto 5px auto" textAlign={"center"} fontSize={".7em"}
              padding="5px" lineHeight="1.1em">
            <strong>GAMES ARE IN TESTING MODE</strong>

        </View>
        <Heading level={"6"} className="heading" marginBottom={"5px"}>
            Select Game City:&nbsp;&nbsp;  {((gameListByCity.length === 0) && !loading)?
            "Click on a City!":gameLocationCity}
        </Heading>
        <Flex
            direction="row"
            justifyContent="flex-start"
            alignItems="stretch"
            alignContent="flex-start"
            wrap="wrap"
            gap="1rem"
            className={"select-game"}
        >
            {cities.map((city, index) => (
                <Card key={city.id} className={"game-card city"} variation="elevated">
                    <Flex
                        direction="row"
                        justifyContent="flex-start"
                        alignItems="center"
                        alignContent="flex-start"
                        wrap="wrap"
                        gap=".1rem"
                    >
                        <Button marginRight="5px"  className={"button-small"}
                            backgroundColor={(localStorage.getItem("gameLocationCity") == city.cityName) ? ("#0d5189") : ("#b8cef9")}
                            color={(localStorage.getItem("gameLocationCity") == city.cityName) ? ("#ffffff") : ("#000000")} onClick={() => setGameLocationCityFunction(city.cityName)}>{city.cityName}
                        </Button>
                        <Link className="city-map-link" color="#ffffff" href={city.cityMap} isExternal={true}>see game locations on map</Link>
                    </Flex>
                </Card>
            ))}
        </Flex>


        {(gameLocationCity !== "" && gameLocationPlaceArray.length > 0) &&
        <>
            <Heading level={"6"} className="heading" marginTop={"10px"} marginBottom={"5px"}>Select Location:</Heading>
            <Flex
                direction="row"
                justifyContent="flex-start"
                alignItems="stretch"
                alignContent="flex-start"
                wrap="wrap"
                gap="1rem"
            >
                {gameLocationPlaceArray.map((location) => (
                    <View className={"amplify-card--elevated"} marginRight="5px">
                    <Button key={location}  className={"button-small amplify-card--elevated"}
                            backgroundColor={(localStorage.getItem("gameLocationPlace") === location) ? ("#0d5189") : ("#b8cef9")}
                            color={(localStorage.getItem("gameLocationPlace") == location) ? ("#ffffff") : ("#000000")}
                            onClick={() => setGameLocationPlaceFunction(location)}>{location}
                    </Button>
                    </View>
                ))}
            </Flex>
            <Flex
                direction="column"
                justifyContent="flex-start"
                alignItems="stretch"
                alignContent="flex-start"
                wrap="wrap"
                gap="0rem"
                className={"level-list"}
            >
                <Heading level={"6"} className="heading" marginBottom={"5px"}>Game Levels:</Heading>
                <View><strong>level 0:</strong> simple, for learning how game works</View>
                <View><strong>level 1:</strong> similar to a scavenger hunt</View>
                <View><strong>level 2:</strong> escape-room style puzzles - some scavenger hunt, some deduction</View>
                <View><strong>level 3:</strong> more complicated with most puzzles requiring deduction</View>
            </Flex>
            <Heading level={"6"} className="heading" marginTop={"10px"}>Game List:</Heading>
            {(authStatus === "authenticated")  &&
            <Button className="button-small amplify-card--elevated" padding="5px" marginTop={"10px"}
                    onClick={() => (hidePlayedGames ? setHidePlayedGames(false) : setHidePlayedGames(true))}
                    backgroundColor={(hidePlayedGames) ? ("#0d5189") : ("#b8cef9")}
                    color={(hidePlayedGames) ? ("#ffffff") : ("#000000")}
            >
                {hidePlayedGames ? "show" : "hide"} played games
            </Button>
            }
        </>
        }





        <Flex className="flex-games">
            {loading && (<View>loading</View>)}

            {(gameLocationPlace != "") &&
                <>
            {gameListByCityPlace.map((game) => (
               <GameCard
                   game={game}
                   gameDetails = {gameDetails}
                   hidePlayedGames={hidePlayedGames}
                   key={game.id}/>
            ))}</>}
        </Flex>
    </View>
    )
}