import { useCallback, useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import { v4 } from 'uuid'
import { Subject } from 'rxjs';

// TODO: Cambiar API key
mapboxgl.accessToken = 'pk.eyJ1IjoiaGVucnl2ZWxhc3F1ZXptYXAiLCJhIjoiY2twbXp0emhzMTRzOTJ3bmdvajkzd3E5OSJ9.47LjzZLmI6mW_eq1ro9oEw';

export const useMapbox = (puntoInicial) => {

    //Referencia al DIV del mapa
    const mapaDiv = useRef();
    //useCallback permite definir una funcion que se memoriza y se puede exportar, ademas como esta memorizada no se va a ejecutar
    // por cada actualización del componente a menos que la función tenga alguna modificación respecto a la memorizada
    //me permitira guardar en mi referencia el nodo donde se va a renderizar el mapa, este caso el nodo me lo indicara
    //la pantalla que use el hook para mapas
    const setRef = useCallback((node) => {
        mapaDiv.current = node
    }, [])

    //Referencia a los marcadores
    const marcadores = useRef({});

    //Observables de RXJS
    const movimientoMarcador = useRef(new Subject());
    const nuevoMarcador = useRef(new Subject());


    //mapa y coords
    const mapa = useRef()
    const [coords, setCoords] = useState(puntoInicial);


    //funcion para agregar marcadores
    const agregarMarcador = useCallback((ev, id) => {

        const { lng, lat } = ev.lngLat || ev;

        const marker = new mapboxgl.Marker();
        marker.id = id ?? v4();

        marker
            .setLngLat([lng, lat])
            .addTo(mapa.current)
            .setDraggable(true);

        // Asignamos el objeto de marcadores
        marcadores.current[marker.id] = marker;

        if (!id) {
            nuevoMarcador.current.next({
                id: marker.id,
                lng,
                lat
            })
        }

        //escuchar movimientos del marcador
        marker.on('drag', ({ target }) => {
            const { id } = target;
            const { lng, lat } = target.getLngLat();

            movimientoMarcador.current.next({
                id,
                lng,
                lat
            })

        })

    }, []);


    //funcion para actualizar la ubicacion del marcador
    const actualizarPosicion = useCallback(( marcador ) => {
        const { id, lat, lng } = marcador;
        marcadores.current[ id ].setLngLat( [ lng, lat ] );

    }, []);

    useEffect(() => {

        const map = new mapboxgl.Map({
            container: mapaDiv.current,
            style: 'mapbox://styles/mapbox/streets-v11',
            center: [puntoInicial.lng, puntoInicial.lat],
            zoom: puntoInicial.zoom
        });

        mapa.current = map;

    }, [puntoInicial]);

    //Cuando se mueve el mapa
    useEffect(() => {
        //Se utilizará el signo de interrogación debido a que los useEffect se ejecutan tan rapido que al principio mapa no tiene valor
        //dando error de undefinend pero al actualizarse la referencia de mapa el useEffect se ejecuta de nuevo dando como resultado esta vez
        //la ejecución del callback ya que mapa posee valor en esta ocasión, es un evento que ocurre muy rapido y por eso no se alcanza a notar
        //el cambio

        //mapa?. se utiliza el signo de interrogacion para indicar que si el valor mapa no tiene valor entonces no realice ninguna acción
        //en caso de tener valor se ejecutara la sentencia siguiente al signo de interrogación
        mapa.current?.on('move', () => {

            const { lng, lat } = mapa.current.getCenter();
            setCoords({
                lng: lng.toFixed(4),
                lat: lat.toFixed(4),
                zoom: mapa.current.getZoom().toFixed(2)
            })

        });

    }, []);

    //Agregar marcadores en mapa al hacer click
    useEffect(() => {

        mapa.current?.on('click', agregarMarcador);

    }, [agregarMarcador])

    return {
        agregarMarcador,
        actualizarPosicion,
        coords,
        marcadores,
        nuevoMarcador$: nuevoMarcador.current,
        movimientoMarcador$: movimientoMarcador.current,
        setRef

    }
}
