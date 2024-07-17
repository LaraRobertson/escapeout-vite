import {View} from "@aws-amplify/ui-react";
import React, {useState} from "react";
import { MapView } from '@aws-amplify/ui-react-geo';
import { Marker } from 'react-map-gl';
import '@aws-amplify/ui-react-geo/styles.css';

export default function Map() {
    console.log("Map");
    //Jaycee Park Sign: 32.017789, -80.846131
    const [{ latitude, longitude }, setMarkerLocation] = useState({
        latitude: 32.017789,
        longitude: -80.846131,
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
            latitude: 32.017789,
            longitude: -80.846131,
            zoom: 16,
        }}>
            <Marker latitude={latitude2} longitude={longitude2} />
            <Marker latitude={latitude} longitude={longitude} />
        </MapView>
        </View>
    )
}