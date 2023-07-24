const fs = require('fs');

const axios = require('axios');

class Busquedas {
    historial = [];
    dbPath = './db/database.json';

    constructor (){

        //TODO: leer db si existe
        this.leerDB();
    }

    get historialCapitalizado(){
        return this.historial.map ( lugar => {

            let palabras = lugar.split( ' ' );
            palabras = palabras.map ( p => p[0].toUpperCase () + p.substring ( 1) );

            return palabras.join( ' ' );
        });
    }

    get paramsMapBox() {

        return {
            'access_token': process.env.MAPBOX_KEY,
            'limit': 5,
            'language':'es'
        }
    }

    get paramsOpenWeather(){
        return {
            appid: process.env.OPENWEATHER_KEY,
            units: 'metric',
            lang: 'es'
        }
    }

    async ciudad ( lugar = '') {

        // Peticion http
        try {

            const instance = axios.create({
                baseURL: `https://api.mapbox.com/geocoding/v5/mapbox.places/${ lugar }.json`,
                params: this.paramsMapBox
            }); 
    
            const resp = await instance.get();
            return resp.data.features.map( lugar => ({
                id: lugar.id,
                nombre: lugar.place_name,
                lng: lugar.center[0],
                lat: lugar.center[1],
            }));
            
        } catch (error) {
            return[];
        }
    }

    async climaLugar(lat, lon){

        try {
            const instance = axios.create({
                baseURL: `https://api.openweathermap.org/data/2.5/weather`,
                params: {...this.paramsOpenWeather, lat, lon}
            });

            const resp = await instance.get();
            const { weather, main } = resp.data;

            return {
                desc: weather[0].description,
                min: main.temp_min,
                max: main.temp_max,
                temp: main.temp
            }
            
            
        } catch (error) {
            
        }

    }

    agregarHistorial( lugar = '') {

        if ( this.historial.includes( lugar.toLocaleLowerCase())){
            return;
        }

        // Prevenir duplicados
        this.historial.unshift ( lugar.toLocaleLowerCase() );

        // Grabar en DB
        this.guardarDB();
    }

    guardarDB () {
        const payload = {
            historial: this.historial
        };

        fs.writeFileSync ( this.dbPath, JSON.stringify( payload ) );
    }

    leerDB() {

        if ( !fs.existsSync ( this.dbPath ) ) return;

        const info = fs.readFileSync ( this.dbPath, { encoding: 'utf8' });
        const data = JSON.parse ( info );

        this.historial = data.historial;

    }

}

module.exports = Busquedas;