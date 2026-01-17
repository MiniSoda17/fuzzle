import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import type { User } from '../types';
import L from 'leaflet';

// Fix for default Leaflet icons in Next.js/Webpack
// We can try to rely on CSS custom markers mostly, but good to have fallback
// Note: Next.js handling of leaflet assets might need attention if standard markers were used
// But we use custom photo markers.

interface MapComponentProps {
    users: User[];
    onUserClick: (user: User) => void;
    center?: [number, number];
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

const MapComponent: React.FC<MapComponentProps> = ({ users, onUserClick, center }) => {
    return (
        <MapContainer
            center={[-27.4975, 153.0137]} // Default start (Brisbane)
            zoom={13}
            scrollWheelZoom={true}
            style={{ width: '100%', height: '100%' }}
        >
            <MapController center={center} />

            {/* Light Theme Tiles - CartoDB Positron */}
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
            />

            {users.map((user) => {
                // Create custom icon for each user
                const customIcon = L.divIcon({
                    className: 'custom-marker',
                    html: `<div class="marker-content"><img src="${user.avatarUrl}" alt="${user.name}" /></div>`,
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
        </MapContainer>
    );
};

export default MapComponent;
