import API from "../api";

export const getPlanes = async() => {
    const planes = await API.get('planes/');
    console.log(planes.data['results']);
    return planes.data['results'];
};

export const createPlan = async(nombre, fechaInicio, fechaFin, carrera) =>{
    try {
        const plan = await API.post('planes/', {
            clave:nombre,
            fecha_inicio:fechaInicio,
            fecha_final:fechaFin,
            carrera:carrera
        });
        return plan;
    } catch (err) {
        return {
            data: null,
            status: 400,
        };
    }
};