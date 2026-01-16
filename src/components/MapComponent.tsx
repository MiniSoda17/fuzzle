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
            center={[51.505, -0.09]}
            zoom={13}
            scrollWheelZoom={true}
            style={{ width: '100%', height: '100%' }}
        >
            {/* Dark Theme Tiles - CartoDB Dark Matter */}
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            />

            {users.map((user) => (
                <Marker
                    key={user.id}
                    position={[user.lat, user.lng]}
                    eventHandlers={{
                        click: () => onUserClick(user),
                    }}
                >
                </Marker>
            ))}
        </MapContainer>
    );
};

export default MapComponent;
