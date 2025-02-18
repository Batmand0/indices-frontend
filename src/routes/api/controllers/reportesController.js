import API from "src/utils/api";

export const getReportesNuevoIngreso = async(nuevoIngreso, trasladoEquiv, cohorte, numSemestres) => {
    try {
        const res =  await API.get('/reportes/nuevo-ingreso',  {
            params: {'nuevo-ingreso':nuevoIngreso, 'traslado-equivalencia':trasladoEquiv, 'cohorte': cohorte.replace('-',''), 'semestres': numSemestres.toString()}
        });
        return res;
    } catch (err) {
        return {
            data: null,
            status: 400,
        };
    }
};

export const getReportesEgresoTitulacion = async(tipo, nuevoIngreso, trasladoEquiv,cohorte,numSemestres) => {
    try {
        const res =  await API.get(`/reportes/${tipo}`,  {
            params: {'nuevo-ingreso':nuevoIngreso, 'traslado-equivalencia':trasladoEquiv, 'cohorte': cohorte.replace('-',''), 'semestres': numSemestres.toString()}
        });
        return res;
    } catch (err) {
        return {
            data: null,
            status: 400,
        };
    }
};