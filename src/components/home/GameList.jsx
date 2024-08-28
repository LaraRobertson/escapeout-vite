import {Button, Flex, Heading, View, Card, Link} from "@aws-amplify/ui-react";
import React, {useEffect, useState, useContext} from "react";
import {gameByGameOrder, gamesByCity} from "../../graphql/queries";
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
    const [gameListByCityPlace, setGameListByCityPlace] = useState([]);
    const [gameLocationPlaceArray, setGameLocationPlaceArray] = useState([]);
    const [gamesFilter, setGamesFilter] = useState({disabled: {eq:false}});
    const [gameLocationCity, setGameLocationCity] = useState("");
    const [placeView, setPlaceView] = useState("list");

    /* fetchgames() - on load only */
    useEffect(() => {
        console.log("***useEffect***:  fetchGames():");
        fetchGames();
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

    return (
    <View id="game-list">
        <View className={"blue-alert"} margin="0 auto 5px auto" textAlign={"center"} fontSize={".8em"}
              padding="5px" lineHeight="1.2em">
            <strong>GAMES ARE IN TESTING MODE</strong>

        </View>
        {/*Selected: {gameLocationCity} -> {gameLocationPlace}*/}
        <Heading level={"6"} className="heading" marginBottom={"10px"}>
            Game List (select city/location):
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
            <Card className={"game-card city"} variation="elevated">
                <Button marginRight="5px" className={"button-small small"}
                        backgroundColor={(localStorage.getItem("gameLocationCity") === "Tybee Island") ? ("#0d5189") : ("transparent")}
                        color="white" onClick={() => setGameLocationCityFunction("Tybee Island")}>Tybee
                    Island, GA
                    {(localStorage.getItem("gameLocationCity") === "Tybee Island") ? (
                        <View>&nbsp;- selected</View>) : null}
                </Button> <Link className="close light small"
                href="https://www.google.com/maps/d/u/0/edit?mid=1UVlpxJl5_xcVIv_7NnRDEX_aa3p_Czc&usp=sharing"
                color="#ffffff"
                isExternal={true}
            >
                Map of Games
            </Link>
                {/*<br />
               <Button className={"place-view"} onClick={()=>setPlaceView("list")}>Location List Below</Button>|
                <Button className={"place-view"} onClick={()=>handleMapPlaceView()}>See Map View </Button><br />*/}
                {gameLocationPlaceArray.map((location) => (
                    <Button key={location} marginRight="5px" className={"button-small small"}
                    backgroundColor={(localStorage.getItem("gameLocation") === location) ? ("#0d5189") : ("transparent")}
                    color="white" onClick={() => setGameLocationPlaceFunction(location)}>{location}
                {(localStorage.getItem("gameLocationPlace") === location ) ? (
                    <View>&nbsp;- selected</View>) : null}
                    </Button>
                    ))}
            {/*
              <Button marginRight="5px" className={"button-small small"} backgroundColor={(localStorage.getItem("gameLocationCity") === "Savannah")? ("#7e0b0b" ): ("transparent")} color="white"  onClick={() => setGameLocationCityFunction("Savannah")}>Savannah, GA
                {(localStorage.getItem("gameLocationCity") === "Savannah")? (<View>&nbsp;- selected</View> ): (null)}
              </Button>*/}
            </Card>
        </Flex>


        <Flex className="flex-games">
            {loading && (<View>loading</View>)}
            {((gameListByCity.length === 0) && !loading) && <View>Choose a City!</View>}
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