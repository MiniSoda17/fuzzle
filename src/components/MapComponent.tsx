import React from 'react';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import type { User } from '../types';
import L from 'leaflet';

// Fix for default Leaflet icons in Vite/Webpack
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

interface MapComponentProps {
    users: User[];
    onUserClick: (user: User) => void;
}

const MapComponent: React.FC<MapComponentProps> = ({ users, onUserClick }) => {
    return (
        <MapContainer
            center={[-27.4975, 153.0137]} // Centered on Brisbane (UQ)
            zoom={13}
            scrollWheelZoom={true}
            style={{ width: '100%', height: '100%' }}
        >
            {/* Dark Theme Tiles - CartoDB Dark Matter */}
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
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
