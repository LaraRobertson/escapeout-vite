import {Image, View} from "@aws-amplify/ui-react";
import React, {useContext, useState} from "react";
import { MapView } from '@aws-amplify/ui-react-geo';
import { Marker } from 'react-map-gl';
import '@aws-amplify/ui-react-geo/styles.css';
import zoneIcon from "../assets/noun-zone-3097481-FFFFFF.svg";
import {MyAuthContext} from "../MyContext";

export default function MapPlaceView() {
    const { setGameLocationPlace, gameLocationPlace, setModalContent  } = useContext(MyAuthContext);
    function closeModal() {
        setModalContent({open:false,content:""});
    }
    console.log("MapPlaceView");
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

    function handleSetLocation(location) {
        setGameLocationPlace(location);
        localStorage.setItem("gameLocationPlace",location);
        closeModal();
    }
    return (
        <View className={"mapInModal"}>Selected: {gameLocationPlace}
        <MapView  initialViewState={{
            latitude: 32.017789,
            longitude: -80.846131,
            zoom: 16,
        }}>
            <Marker latitude={latitude2} longitude={longitude2}>
                <Image height="40px" width="40px" src={zoneIcon} alt="zone icon" />
                <View className={"zone-text"}  onClick={()=>handleSetLocation("Memorial Park")}>Memorial Park</View>
            </Marker>
            <Marker latitude={latitude} longitude={longitude}>
                <Image height="40px" width="40px" src={zoneIcon} alt="zone icon" />
                <View className={"zone-text"} onClick={()=>handleSetLocation("Jaycee Park")}>Jaycee Park</View>
            </Marker>
        </MapView>
        </View>
    )
}