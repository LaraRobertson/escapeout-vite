import {Image, View} from "@aws-amplify/ui-react";
import React, {useState} from "react";
import { MapView } from '@aws-amplify/ui-react-geo';
import { Marker } from 'react-map-gl';
import '@aws-amplify/ui-react-geo/styles.css';
import zoneIcon from "../../assets/noun-zone-3097481-000.svg";

export function Map(props) {
    console.log("Map");
    console.log("props.gameDetails.latitude1: " + props.gameDetails.latitude1);
    //Jaycee Park Sign: 32.017789, -80.846131
    const [{ latitude, longitude }, setMarkerLocation] = useState({
        latitude: props.gameDetails.latitude1,
        longitude: props.gameDetails.longitude1,
    });
    //Jaycee Park Disc Golf Sign: 32.017384, -80.845396
    const [{ latitude2, longitude2 }, setMarkerLocation2] = useState({
        latitude2: 32.017384,
        longitude2: -80.845396,
    });
    const updateMarker = () =>
        setMarkerLocation({ latitude: latitude + 5, longitude: longitude + 5 });
    return (
        <View className={"mapInModal"}>
        <MapView  initialViewState={{
            latitude: latitude,
            longitude: longitude,
            zoom: 16,
        }}>
            {/*<Marker latitude={latitude2} longitude={longitude2} />*/}
            <Marker latitude={latitude} longitude={longitude}> <Image height="40px" width="40px" src={zoneIcon} alt="zone icon"/>
                <View className={"map-text"}>Zone 1</View></Marker>
        </MapView>
        </View>
    )
}

export function MapGame(props) {
    console.log("Map");
    let playZone=props.playZone;
    console.log("playzone.length: " + playZone.length);
    //Jaycee Park Sign: 32.017789, -80.846131
        return (
            <View className={"mapInModal"}>
                <MapView  initialViewState={{
                    latitude: playZone[0].latitude,
                    longitude: playZone[0].longitude,
                    zoom: 16,
                }}>
                    {playZone.map((zone, index) => (
                        <Marker key={zone.id} latitude={zone.latitude} longitude={zone.longitude}>
                            <Image height="40px" width="40px" src={zoneIcon} alt="zone icon"/>
                        <View className={"map-text"}>zone {index + 1}</View>
                        </Marker>
                    ))}
                </MapView>
            </View>
        )
}