const { leerInput, inquirerMenu, pausa } = require ('./helpers/inquirer.js');
const Busquedas = require('./models/busquedas');

const main = async() => {
    
    const busquedas = new Busquedas();
    let opt;

    do {

        opt = await inquirerMenu();
        switch(opt){

            case 1: 
                // Mostrar mensaje
                const lugar = await leerInput('Ciudad: ');
                console.log(lugar);

                // Buscar los Lugares

                // Clima

                // Mostrar resultados

                console.log('\nIndormacion de la ciudad\n'.green);
                console.log('Ciudad', );
                console.log('Lat', );
                console.log('Lgn', );
                console.log('Temperatura', );
                console.log('Minima', );
                console.log('Maxima', );

            break;

        }

        if ( opt!== 0) await pausa();

    } while (opt !== 0);



}

main();