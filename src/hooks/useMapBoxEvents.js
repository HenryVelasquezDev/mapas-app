import { useEffect } from "react";


export const useMapBoxEvents = ( socket, agregarMarcador, actualizarPosicion, nuevoMarcador$, movimientoMarcador$ ) => {
    
    //Escuchar los marcadores existentes
    useEffect(() => {
        
        socket.on( 'marcadores-activos', ( marcadores ) => {
            
            for ( const key of Object.keys( marcadores ) ){
                agregarMarcador( marcadores[ key ] , key );
            }

        });

    }, [socket, agregarMarcador]);


    //nuevo marcador
    useEffect(() => {
        
        nuevoMarcador$.subscribe( marcador => {
            socket.emit( 'marcador-nuevo' , marcador );
        })

    }, [nuevoMarcador$,socket]);

    //movimiento marcador
    useEffect(() => {
        
        movimientoMarcador$.subscribe( marcador => {
            socket.emit( 'marcador-actualizado' , marcador );
        })

    }, [socket, movimientoMarcador$]);

    //Escuchar movimiento marcador
    useEffect(() => {
        socket.on(  'marcador-actualizado' , ( marcador ) => {
            actualizarPosicion( marcador );
        })

    }, [socket, actualizarPosicion]);

    //Escuchar nuevos marcados
    useEffect(() => {
        
        socket.on('marcador-nuevo', ( marcador ) =>{
            agregarMarcador( marcador , marcador.id );

        })

    }, [socket, agregarMarcador]);
    
}
