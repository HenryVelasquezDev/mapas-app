import React, { useContext, useEffect } from 'react';
import { SocketContext } from '../context/SocketContext';
import { useMapbox } from '../hooks/useMapbox';
import { useMapBoxEvents } from '../hooks/useMapBoxEvents';

const puntoInicial = {
    lng: -122.4649,
    lat: 37.7979,
    zoom: 13.51 

}

export const MapaPage = () => {

    const { coords, setRef, nuevoMarcador$, movimientoMarcador$, agregarMarcador, actualizarPosicion } = useMapbox( puntoInicial );
    const { socket } = useContext( SocketContext );
    useMapBoxEvents( socket, agregarMarcador, actualizarPosicion, nuevoMarcador$ , movimientoMarcador$ );

    return (
        <>

            <div className="info">
                Lng: {coords.lng} | lat: {coords.lat} | zoom: {coords.zoom}
            </div>
            <div
                ref={ setRef }
                className="mapContainer"
            />
        </>
    )
}
