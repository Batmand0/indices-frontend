export const buildTablaIndices = (tipo, data, numSemestres) => {
    const tabla = [];
    const tablaIndices =Object.entries(data);
    for(let i = 0; i < numSemestres; i++) {
        const row = [`Semestre ${i+1}`, `${tablaIndices[i][0].slice(0,4)}-${tablaIndices[i][0].slice(4,5)}`, tablaIndices[i][1]['hombres'], tablaIndices[i][1]['mujeres'], tablaIndices[i][1]['hombres_egresados'], tablaIndices[i][1]['mujeres_egresadas']];
        switch(tipo){
            case 'permanencia':
                row.push(tablaIndices[i][1]['hombres_desertores'], tablaIndices[i][1]['mujeres_desertoras'], `${tablaIndices[i][1]['tasa_permanencia']}%`);
                tabla.push(row);
                break;
            case 'desercion':
                row.push(tablaIndices[i][1]['hombres_desertores'], tablaIndices[i][1]['mujeres_desertoras'], `${tablaIndices[i][1]['tasa_desercion']}%`);
                tabla.push(row);
                break;
            case 'egreso':
                row.push(`${tablaIndices[i][1]['tasa_egreso']}%`);
                tabla.push(row);
                break;
            case 'titulacion':
                row.push(tablaIndices[i][1]['hombres_titulados'], tablaIndices[i][1]['mujeres_tituladas'],`${tablaIndices[i][1]['tasa_titulacion']}%`);
                tabla.push(row);
                break;
            default:
                row.push(tablaIndices[i][1]['hombres_desertores'], tablaIndices[i][1]['mujeres_desertoras'], `${tablaIndices[i][1]['tasa_permanencia']}%`);
                tabla.push(row);
                break;
        }
    }
    return tabla;
};

/**
 * Construye la tabla de índices para el modo generacional
 * @param {string} tipo - Tipo de índice (desercion, permanencia, etc)
 * @param {Object} data - Datos recibidos del backend
 * @returns {Array} Tabla formateada para el componente
 */
export const buildTablaIndicesGeneracional = (tipo, data) => {
    const tabla = [];
    const generaciones = Object.entries(data);
    
    for(const [generacion, datos] of generaciones) {
        const row = [
            `${generacion.slice(0,4)}-${generacion.slice(4,5)}`,  // Formato YYYY-P
            datos['total_inicial'],
            datos['total_actual']
        ];

        switch(tipo){
            case 'desercion':
                row.push(`${datos['tasa_desercion']}%`);
                break;
            case 'permanencia':
                row.push(`${datos['tasa_permanencia']}%`);
                break;
            case 'egreso':
                row.push(`${datos['tasa_egreso']}%`);
                break;
            case 'titulacion':
                row.push(`${datos['tasa_titulacion']}%`);
                break;
            default:
                row.push(`${datos['tasa_desercion']}%`);
                break;
        }
        tabla.push(row);
    }

    // Ordenar tabla por generación (más reciente primero)
    return tabla.sort((a, b) => b[0].localeCompare(a[0]));
};