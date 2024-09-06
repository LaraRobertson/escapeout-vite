import {
    Button,
    Flex,
    Input,
    SwitchField, TableCell,
    TableHead,
    TableRow,
    TextAreaField,
    TextField,
    View,
    Table,
    TableBody
} from "@aws-amplify/ui-react";
import React, {useContext, useEffect, useState} from "react";
import {listCities,getCity} from "../../graphql/queries";
import * as mutations from "../../graphql/mutations";
import {MyAuthContext} from "../../MyContext";
import {generateClient} from "aws-amplify/api";

export default function CityForm() {
    const client = generateClient();
    const { setModalContent, modalContent  } = useContext(MyAuthContext);
    const [cities, setCities] = useState([]);
    const [action, setAction] = useState("add");
    const initialStateCreateCity = {
        cityName: "",
        cityDescription: "",
        cityState: "",
        cityCountry: "",
        cityMap: "",
        order: 1,
        disabled: false
    };
    const [formCreateCityState, setFormCreateCityState] = useState(initialStateCreateCity);
    function setInputCreateCity(key, value) {
        setFormCreateCityState({ ...formCreateCityState, [key]: value });
    }
    const [cityFilter, setCityFilter] = useState({});
    useEffect(() => {
      fetchCities();
    },[]);

    async function fetchCities() {
        try {
            const apiData = await client.graphql({
                query: listCities,
                variables: {filter: cityFilter}
            });
            const citiesFromAPI = apiData.data.listCities.items;
            setCities(citiesFromAPI);
        } catch (err) {
            console.log('error fetching cities', err);
        }
    }
    async function populateCityForm(cityID) {
        try {
            const apiData = await client.graphql({
                query: getCity,
                variables: {id: cityID}
            });
            const cityFromAPI = apiData.data.getCity;
            setFormCreateCityState(cityFromAPI);
            setAction("edit");
        } catch (err) {
            console.log('error fetching getCity', err);
        }
    }

    async function addCity() {
        try {
            if (!formCreateCityState.cityName ) return;
            const gameCity = { ...formCreateCityState };
            console.log("addCity - gameCity: " + gameCity);
            setFormCreateCityState(initialStateCreateCity);
            await client.graphql({
                query: mutations.createCity,
                variables: {
                    input: gameCity
                }
            });
            fetchCities();
        } catch (err) {
            console.log('error creating city:', err);
        }
    }
    async function updateCity() {
        console.log("updateCity: " + JSON.stringify(formCreateCityState));
        try {
            if (!formCreateCityState.cityName) return;
            const gameCity = { ...formCreateCityState };
            setFormCreateCityState(initialStateCreateCity);
            delete gameCity.updatedAt;
            delete gameCity.__typename;
            await client.graphql({
                query: mutations.updateCity,
                variables: {
                    input: gameCity
                }
            });
            fetchCities();
            setAction("add");
        } catch (err) {
            console.log('error updating GameCity:', err);
        }

    }
    async function deleteCity(props) {
        console.log("props.cityID: " + props.cityID);
        try {
            const cityDetails = {
                id: props.cityID
            };
            await client.graphql({
                query: mutations.deleteCity,
                variables: { input: cityDetails }
            });
            fetchCities();
        } catch (err) {
            console.log('error deleting games:', err);
        }

    }

    return (
        <View>
            <Table
                highlightOnHover={true}
                size={"default"}
                variation={"striped"}
            >
               <TableHead>
                    <TableRow>
                        <TableCell as="th">City Name</TableCell>
                        <TableCell as="th">State</TableCell>
                        <TableCell as="th">Description</TableCell>
                        <TableCell as="th">Country</TableCell>
                        <TableCell as="th">Map</TableCell>
                        <TableCell as="th">Order</TableCell>
                        <TableCell as="th">Live</TableCell>
                        <TableCell as="th">Actions</TableCell>

                    </TableRow>
                </TableHead>
                <TableBody>
                    {cities.map((city, index) => (
                        <TableRow key={city.id}>
                                <TableCell>{city.cityName}</TableCell>
                                <TableCell>{city.cityState}</TableCell>
                                <TableCell>{city.cityDescription}</TableCell>
                                <TableCell>{city.cityCountry}</TableCell>
                                <TableCell>{city.cityMap}</TableCell>
                                <TableCell>{city.order}</TableCell>
                                <TableCell>{city.disabled ? "no" : "yes"}</TableCell>
                                <TableCell>
                                    <Button gap="0.1rem" marginRight="10px" size="small"
                                            onClick={() =>populateCityForm(city.id)}>edit</Button>

                                   <Button gap="0.1rem" size="small" color="red" onClick={() => deleteCity({"cityID": city.id})}>x</Button>
                                </TableCell>
                        </TableRow>
                        ))}
                </TableBody>
            </Table>
<hr />
            <View id="gameClueForm" className="show" as="form" margin=".5rem 0">
                <View><strong>Game City Form</strong></View>
                <Flex direction="column" justifyContent="center" gap="1rem" className={"game-form"}>
                    <SwitchField
                        label="disabled (not live)"
                        isChecked={formCreateCityState.disabled}
                        onChange={(e) => {
                            console.log("e.target.checked: " + e.target.checked)
                            setInputCreateCity('disabled', e.target.checked);
                        }}
                    />
                    <Input
                        name="order"
                        type="number"
                        size="small"
                        width="50px"
                        onChange={(event) => setInputCreateCity('order', event.target.value)}
                        value={formCreateCityState.order}
                    />
                    <TextField
                        onChange={(event) => setInputCreateCity('cityName', event.target.value)}
                        name="cityName"
                        placeholder="City Name"
                        label="City Name"
                        variation="quiet"
                        value={formCreateCityState.cityName}
                        required
                    />
                    <TextField
                        onChange={(event) => setInputCreateCity('cityState', event.target.value)}
                        name="cityState"
                        placeholder="State"
                        label="State"
                        variation="quiet"
                        value={formCreateCityState.cityState}
                        required
                    />
                    <TextField
                        onChange={(event) => setInputCreateCity('cityDescription', event.target.value)}
                        name="cityDescription"
                        placeholder="City Description"
                        label="City Description"
                        variation="quiet"
                        value={formCreateCityState.cityDescription}
                        required
                    />
                    <TextField
                        onChange={(event) => setInputCreateCity('cityCountry', event.target.value)}
                        name="cityCountry"
                        placeholder="City Country"
                        label="City Country"
                        variation="quiet"
                        value={formCreateCityState.cityCountry}
                        required
                    />
                    <TextField
                        onChange={(event) => setInputCreateCity('cityMap', event.target.value)}
                        name="cityMap"
                        placeholder="City Map"
                        label="City Map"
                        variation="quiet"
                        value={formCreateCityState.cityMap}
                        required
                    />            </Flex>
                <Flex direction="row" justifyContent="center" marginTop="20px" className={"game-form"}>
                    <Flex direction="row" justifyContent="center" marginTop="20px" className={"game-form"}>
                        {(action == "add") && <Button id="createCity" className="button" onClick={addCity}
                                variation="primary">
                            Create City
                        </Button>}
                        {(action == "edit") && <Button id="updateCity" className="button" onClick={updateCity}
                                variation="primary">
                            Update City
                        </Button>}
                    </Flex>
                </Flex>
            </View>
        </View>
    )
}