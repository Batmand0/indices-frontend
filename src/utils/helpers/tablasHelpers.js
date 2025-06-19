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
export const buildTable = (data) => {
    // Normalizar las claves del objeto data
    const normalizedData = {};
    Object.keys(data).forEach((periodo) => {
        const normalizedPeriod = periodo.replace('-', '');
        normalizedData[normalizedPeriod] = data[periodo];
    });

    // Obtener y ordenar periodos
    const periodos = Object.keys(normalizedData).sort((a, b) => a.localeCompare(b));
    
    const carrerasMap = new Map();
    
    // Inicializar el mapa con todas las carreras
    periodos.forEach((periodo) => {
        normalizedData[periodo].carreras.forEach((carrera) => {
            if (!carrerasMap.has(carrera.nombre)) {
                carrerasMap.set(carrera.nombre, new Array(periodos.length).fill(0));
            }
        });
    });
    
    // También crear entrada para el total
    carrerasMap.set('Total', new Array(periodos.length).fill(0));
    
    // Llenar los datos
    periodos.forEach((periodo, index) => {
        // Llenar datos de carreras
        normalizedData[periodo].carreras.forEach((carrera) => {
            carrerasMap.get(carrera.nombre)[index] = carrera.poblacion;
        });
        
        // Llenar datos del total
        carrerasMap.get('Total')[index] = normalizedData[periodo].total.poblacion;
    });

    // Convertir el mapa a array para la tabla
    const tableData = Array.from(carrerasMap.entries()).map(([nombre, poblaciones]) => {
        return [nombre, '', ...poblaciones];
    });
    
    return tableData;
};

export const buildTablaCrecimiento = (data) => {
    const datos = Object.entries(data);
    const tabla = [];
    datos.forEach((fila) => {
        tabla.push([`${fila[0].slice(0,4)}-${fila[0].slice(4,5)}`, fila[1]['poblacion']]);
    });
    return tabla;
};