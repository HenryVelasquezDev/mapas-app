import React, { useEffect } from 'react';
import { useMapbox } from '../hooks/useMapbox';

const puntoInicial = {
    lng: -122.4649,
    lat: 37.7979,
    zoom: 13.51 

}

export const MapaPage = () => {

    const { coords, setRef, nuevoMarcador$, movimientoMarcador$ } = useMapbox( puntoInicial );

    //nuevo marcador
    useEffect(() => {
        
        nuevoMarcador$.subscribe( marcador => {
            console.log('mapa page nuevo');
            console.log(marcador);
        })

    }, [nuevoMarcador$])

    //movimiento marcador
    useEffect(() => {
        
        movimientoMarcador$.subscribe( marcador => {
            console.log('mapa page movimiento');
            console.log(marcador);
        })

    }, [movimientoMarcador$])

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
