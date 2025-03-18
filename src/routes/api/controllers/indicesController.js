import API from "src/utils/api";

export const getIndicesData = async(tipo, nuevoIngreso, trasladoEquiv, cohorte, carrera, numSemestres) => {
    try {
        const response =  await API.get(`indices/${tipo}`, {
            params: {
                'nuevo-ingreso':nuevoIngreso,
                'traslado-equivalencia':trasladoEquiv,
                'cohorte': cohorte.replace('-',''),
                'carrera': carrera,
                'semestres': numSemestres.toString()
            }
        });
        return response;
    } catch (err) {
        return {
            data: null,
            status: 400,
        };
    }
};

/**
 * Obtiene los datos de índices en modo generacional
 * @param {string} tipo - Tipo de índice (desercion, permanencia, etc)
 * @param {Object} params - Parámetros para la consulta
 * @returns {Promise<Object>} Respuesta con status y data
 */
export const getIndicesDataGeneracional = async(tipo, params) => {
    const { examenYConv, trasladoYEquiv, cohorteInicial, carrera, numSemestres } = params;

    try {
        const response = await API.get(`indices/${tipo}/generacional`, {
            params: {
                'nuevo-ingreso': examenYConv,
                'traslado-equivalencia': trasladoYEquiv,
                'cohorte': cohorteInicial.replace('-',''),
                'carrera': carrera,
                'semestres': numSemestres.toString()
            }
        });
        return response;
    } catch (err) {
        console.error('Error en API:', err);  // Log de error
        return {
            data: null,
            status: 400,
        };
    }
};