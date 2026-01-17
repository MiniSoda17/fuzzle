'use client';

import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import type { User, Sesh } from '../types';
import L from 'leaflet';
import SeshMarker from './SeshMarker';
import MarkerClusterGroup from 'react-leaflet-cluster';

import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';

// Fix for default Leaflet icons in Next.js/Webpack
// We can try to rely on CSS custom markers mostly, but good to have fallback
// Note: Next.js handling of leaflet assets might need attention if standard markers were used
// But we use custom photo markers.

interface MapComponentProps {
    users: User[];
    seshes?: Sesh[];
    onUserClick: (user: User) => void;
    onSeshClick?: (sesh: Sesh) => void;
    center?: [number, number];
    currentUser?: User | null;
}

const MapController = ({ center }: { center?: [number, number] }) => {
    const map = useMap();
    useEffect(() => {
        if (center) {
            map.flyTo(center, 15);
        }
    }, [center, map]);
    return null;
};

const MapComponent: React.FC<MapComponentProps> = ({ users, seshes = [], onUserClick, onSeshClick, center, currentUser }) => {
    return (
        <MapContainer
            center={[-27.4975, 153.0137]} // Default start (Brisbane)
            zoom={13}
            maxZoom={19}
            scrollWheelZoom={true}
            style={{ width: '100%', height: '100%' }}
        >
            <MapController center={center} />

            {/* Dark Theme Tiles - CartoDB Dark Matter */}
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            />

            {/* Sesh Markers - Keep them outside cluster or inside? Usually outside to stand out */}
            {seshes.map((sesh) => (
                <SeshMarker
                    key={sesh.id}
                    sesh={sesh}
                    onClick={onSeshClick || (() => { })}
                />
            ))}

            <MarkerClusterGroup
                chunkedLoading
                spiderfyOnMaxZoom={true}
                showCoverageOnHover={false}
                zoomToBoundsOnClick={true}
                maxClusterRadius={40} // Smaller radius handles overlaps better when close
            >
                {users.map((user) => {
                    const isCurrentUser = currentUser?.id === user.id;
                    // Create custom icon for each user
                    const customIcon = L.divIcon({
                        className: `custom-marker ${isCurrentUser ? 'gold-marker' : ''}`,
                        html: `<div class="marker-content"><img src="${user.avatar_url}" alt="${user.name}" /></div>`,
                        iconSize: [48, 48],
                        iconAnchor: [24, 24]
                    });

                    return (
                        <Marker
                            key={user.id}
                            position={[user.lat, user.lng]}
                            icon={customIcon}
                            eventHandlers={{
                                click: () => onUserClick(user),
                            }}
                        />
                    );
                })}
            </MarkerClusterGroup>
        </MapContainer>
    );
};

export default MapComponent;
