import { getCarreras } from "./carreraHelpers";

/*
* Regresa una lista de las carreras y sus claves
 */
export const getAllCarreras = async() => {
    const listaCarreras = await getCarreras();
    let listaC = Object.entries(listaCarreras);
    listaC = Object.entries(listaC[3][1]);
    listaC = listaC.map((carrera) => carrera.filter((c, index) => index > 0));
    listaC = listaC.map((carrera) => Object.entries(carrera[0]));
    listaC = listaC.map((carrera) => carrera.map((c)=> c.filter((d, index) => index > 0)));
    listaC.sort();
    return listaC;
};

/*
* Regresa un arreglo de datos con el campo solicitado a partir de un arreglo de objets.
 */
// const getDatoFromObjectArray = (array, dato) => {
//     let datosPoblacionInc = array.map((cohorte) => Object.entries(cohorte));
//     datosPoblacionInc = datosPoblacionInc.map((periodo)=> periodo.map((carrera) => carrera.filter((dato, index)=> index > 0)));
//     datosPoblacionInc = datosPoblacionInc.map((periodo)=> periodo.map((carrera) => carrera.map((campo, index)=> campo[dato])));
//     return datosPoblacionInc;
// };

/*
* Regresa la tabla de poblacion juntando los datos de las carreras y los datos poblacionales.
*/
export const buildTable = async(data) => {
    const datos = Object.values(data);
    const carreras = await getCarreras();
    const table = [];
    carreras.forEach((row, index) => {
        const fila = [row['nombre'],row['clave']];
        datos.forEach((periodo) => {
            let found = false;
            periodo.forEach((carrera) => {
                let poblacion = 0;
                if (carrera['clave'] === row['clave']){
                    poblacion = carrera['poblacion'];
                    fila.push(poblacion);
                    found = true;
                }
            });
            if (!found)
                fila.push('');
        });
        table.push(fila);
    });
    return table;
};

export const buildTablaCrecimiento = (data) => {
    const datos = Object.entries(data);
    const tabla = [];
    datos.forEach((fila) => {
        tabla.push([`${fila[0].slice(0,4)}-${fila[0].slice(4,5)}`, fila[1]['poblacion']]);
    });
    return tabla;
};