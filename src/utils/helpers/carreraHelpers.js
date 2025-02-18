import API from "../api";

export const getCarreras = async() =>{
    const carreras = await API.get('carreras/');
    const sortedCarreras = carreras.data['results'].sort((first, second) => (first['clave']  < second['clave']) ? -1 : (first['clave']  > second['clave']) ? 1 : 0);
    return sortedCarreras;
};

export const getCarrerasAll = async() =>{
    const carreras = await API.get('carreras/todas/');
    const sortedCarreras = carreras.data['results'].sort((first, second) => (first['clave']  < second['clave']) ? -1 : (first['clave']  > second['clave']) ? 1 : 0);
    return sortedCarreras;
};

export const getCarrerasForUser = async(id) =>{
    const carreras = await API.get('carreras/usuario', { params: {
        usuario: id,
    }});
    const sortedCarreras = carreras.data['results'].sort((first, second) => (first['clave']  < second['clave']) ? -1 : (first['clave']  > second['clave']) ? 1 : 0);
    return sortedCarreras;
};

export const createCarrera = async(clave, nombre) =>{
    try {
        const carrera = await API.post('carreras/', {
            nombre:nombre,
            clave:clave
        });
        return carrera;
    } catch (err) {
        return {
            data: null,
            status: 400,
        };
    }
};
export const getNombreCarrera = async(clave) => {
    const carreras = await getCarreras();
    let nombreCarrera = "";
    carreras.forEach((fila) => {
        if(fila['clave'] === clave){
            nombreCarrera = fila['nombre'];
        }
    });
    return nombreCarrera;
};