import API from "src/utils/api";

export const getCedulasTabla = async(tipo, nuevoIngreso, trasladoEquiv, cohorte, carrera, numSemestres) => {
    try {
        const res = await API.get(`cedulas/${tipo}`, {
            params: {
                'nuevo-ingreso':nuevoIngreso,
                'traslado-equivalencia':trasladoEquiv,
                'cohorte': cohorte.replace('-',''),
                'carrera': carrera,
            }
        });
        return res;
    } catch (err) {
        return {
            data: null,
            status: 400,
        };
    }
};