import React from 'react';
import Image from 'next/image';

// const Map = dynamic(() => import('react-leaflet').then(mod => mod.MapContainer), { ssr: false });
// const TileLayer = dynamic(() => import('react-leaflet').then(mod => mod.TileLayer), { ssr: false });

const MapPage = () => {
    return (
        <div className="h-screen w-screen flex flex-col items-center justify-center bg-background p-6">
            <h1 className="text-3xl font-bold text-foreground mb-4">3rd Floor Map</h1>
            <div className="w-full h-[calc(100%-5rem)] max-w-7xl rounded-2xl shadow-lg bg-card overflow-hidden">
                <Image
                    src="/map.svg"
                    alt="Map"
                    width={1200}
                    height={800}
                    className="w-full h-full object-contain"
                    priority
                />
            </div>
        </div>
    );
};

export default MapPage; 