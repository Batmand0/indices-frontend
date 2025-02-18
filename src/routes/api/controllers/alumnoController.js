import API from 'src/utils/api';
import { buildListaAlumnos } from 'src/utils/helpers/alumnoHelpers';

export const getAlumnoInfo = async(numControl) => {
    try {
        const res = await API.get('/alumnos/historial/'+numControl);
        return res;
    } catch (err) {
        return {
            data: null,
            status: 400,
        };
    }
};

export const updateAlumnoInfo = async(alumno, curp) => {
    let success = true;
    let res = await API.put(`/personal/${curp}/`,alumno)
    .catch((error) => {
        success = false;
    });
    if(success){
        // eslint-disable-next-line no-unused-vars
        res = await API.put(`/alumnos/${alumno.get('no_control')}/`, alumno)
        .catch((error) => {
            success = false;
        });
    }
    return success;
};

export const getAllAlumnosHistorial = async(nuevoIngreso, trasladoEquiv, cohorte, semestres, carrera, pagina, link='/alumnos/historial') => {
    try {
        const res = await API.get(link, {
            params: {'nuevo-ingreso':nuevoIngreso, 'traslado-equivalencia':trasladoEquiv, 'cohorte': cohorte.replace('-',''), 'semestres': semestres.toString(), 'carrera': carrera}
        });
        return res;
    } catch (err) {
        return {
            data: null,
            status: 400,
        };
    }
};

export const getFullHistorial = async(nuevoIngreso, trasladoEquiv, cohorte, semestres, carrera) => {
    let res = await API.get('/alumnos/historial', {
        params: {'nuevo-ingreso': nuevoIngreso, 'traslado-equivalencia':trasladoEquiv, 'cohorte': cohorte.replace('-',''), 'semestres': semestres.toString(), 'carrera': carrera}
    });
    let data = res.data;
    console.log(data);
    const historial = [buildListaAlumnos(data['results'], semestres, cohorte)];
    while(data['next'] !== null){
        res = await API.get(data['next']);
        data = res.data;
        const pagina = buildListaAlumnos(data['results'], semestres, cohorte);
        historial.push(pagina);
    }
    return historial;
};

