import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { MapContainer, TileLayer } from 'react-leaflet';
import L from "leaflet";
import MarkerClusterGroup from "react-leaflet-markercluster";
import "leaflet/dist/leaflet.css";
import 'react-leaflet-markercluster/styles';
import './styles/wikipage-frame.css';
import './styles/search-button.css';

// Import the shared type and all your new components
import type { WikiPage } from "./components/types";
import CircleMarkerComponent from "./components/marker";
import IframePopup from "./components/iframe";
import FindNearbyPages from "./components/search";

const defaultZoom = 3;

const Main: React.FC = () => {
    return (
        <div style={{ height: "100%", width: "100%" }}>
            <MapComponent />
        </div>
    );
};

const MapComponent: React.FC = () => {
    const [wikiMarkers, setWikiMarkers] = useState<WikiPage[]>([]);
    const [userLocation, setUserLocation] = useState<[number, number]>([0, 0]);
    const [selectedPageId, setSelectedPageId] = useState<string | null>(null);
    const mapRef = useRef<L.Map | null>(null);

    useEffect(() => {
        navigator.geolocation.getCurrentPosition(
            (position) => setUserLocation([position.coords.latitude, position.coords.longitude]),
            (err) => console.log("Error acquiring geolocation.", err)
        );
    }, []);

    const selectedPage = useMemo(() =>
            wikiMarkers.find(p => p.pageid === selectedPageId),
        [selectedPageId, wikiMarkers]
    );

    const handleMarkerSelect = useCallback((pageId: string | null) => {
        setSelectedPageId(pageId);
    }, []);

    return (
        <>
            <MapContainer ref={mapRef} key={userLocation.toString()} center={userLocation} zoom={defaultZoom} style={{ height: "100%", width: "100%" }}>
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                <MarkerClusterGroup>
                    {wikiMarkers.map((page) => (
                        <CircleMarkerComponent
                            key={page.pageid}
                            page={page}
                            isSelected={page.pageid === selectedPageId}
                            onSelect={handleMarkerSelect}
                        />
                    ))}
                </MarkerClusterGroup>

                <FindNearbyPages setMarkers={setWikiMarkers} zoomBegin={15} />

                <IframePopup selectedPage={selectedPage} onClose={() => handleMarkerSelect(null)} />
            </MapContainer>
        </>
    );
};

export default Main;