import React from 'react';
import { Marker } from 'react-leaflet';
import L from 'leaflet';
import type { Sesh } from '../types';

interface SeshMarkerProps {
    sesh: Sesh;
    onClick: (sesh: Sesh) => void;
}

const getActivityEmoji = (activity: string) => {
    switch (activity) {
        case 'sports': return '🏀';
        case 'study': return '📚';
        case 'coffee': return '☕';
        case 'food': return '🍕';
        case 'party': return '🎉';
        case 'other': return '✨';
        default: return '📍';
    }
};

const SeshMarker: React.FC<SeshMarkerProps> = ({ sesh, onClick }) => {
    const emoji = getActivityEmoji(sesh.activity_type);

    const customIcon = L.divIcon({
        className: 'sesh-marker-container',
        html: `
            <div class="sesh-marker">
                <div class="sesh-glow"></div>
                <div class="sesh-content">
                    <span class="sesh-emoji">${emoji}</span>
                    <span class="sesh-count">${sesh.current_count}/${sesh.max_participants}</span>
                </div>
            </div>
        `,
        iconSize: [60, 60],
        iconAnchor: [30, 30]
    });

    return (
        <Marker
            position={[sesh.lat, sesh.lng]}
            icon={customIcon}
            eventHandlers={{
                click: () => onClick(sesh)
            }}
        />
    );
};

export default SeshMarker;
