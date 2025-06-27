export const buildTablaIndices = (tipo, data, numSemestres, verSexo) => {
    const tabla = [];
    const tablaIndices = Object.entries(data);
    console.log('Tabla de índices:', tablaIndices);
    
    for(let i = 0; i < numSemestres; i++) {
            const row = [
                `Semestre ${i+1}`, 
                `${tablaIndices[i][0].slice(0,4)}-${tablaIndices[i][0].slice(4,5)}`, 
                tablaIndices[i][1]['hombres'], 
                tablaIndices[i][1]['mujeres'], 
                tablaIndices[i][1]['hombres_egresados'], 
                tablaIndices[i][1]['mujeres_egresadas']
            ];

            if (!verSexo) {
                switch(tipo) {
                    case 'permanencia':
                        row.push(
                            tablaIndices[i][1]['hombres_desertores'], 
                            tablaIndices[i][1]['mujeres_desertoras'], 
                            `${tablaIndices[i][1]['tasa_permanencia']}%`
                        );
                        break;
                    case 'desercion':
                        row.push(
                            tablaIndices[i][1]['hombres_desertores'], 
                            tablaIndices[i][1]['mujeres_desertoras'], 
                            `${tablaIndices[i][1]['tasa_desercion']}%`
                        );
                        break;
                    case 'egreso':
                        row.push(`${tablaIndices[i][1]['tasa_egreso']}%`);
                        break;
                    case 'titulacion':
                        row.push(
                            tablaIndices[i][1]['hombres_titulados'], 
                            tablaIndices[i][1]['mujeres_tituladas'],
                            `${tablaIndices[i][1]['tasa_titulacion']}%`
                        );
                        break;
                    default:
                        row.push(
                            tablaIndices[i][1]['hombres_desertores'], 
                            tablaIndices[i][1]['mujeres_desertoras'], 
                            `${tablaIndices[i][1]['tasa_permanencia']}%`
                        );
                        break;
                }
                tabla.push(row);
            } else {
                switch(tipo) {
                    case 'permanencia':
                        row.push(
                            tablaIndices[i][1]['hombres_desertores'], 
                            tablaIndices[i][1]['mujeres_desertoras'], 
                            `${tablaIndices[i][1]['tasa_permanencia_Hombres']}%`,
                             `${tablaIndices[i][1]['tasa_permanencia_Mujeres']}%`
                        );
                        break;
                    case 'desercion':
                        row.push(
                            tablaIndices[i][1]['hombres_desertores'], 
                            tablaIndices[i][1]['mujeres_desertoras'], 
                            `${tablaIndices[i][1]['tasa_desercion_Hombres']}%`,
                            `${tablaIndices[i][1]['tasa_desercion_Mujeres']}%`
                        );
                        break;
                    case 'egreso':
                        row.push(
                            `${tablaIndices[i][1]['tasa_egreso_hombres']}%`,
                            `${tablaIndices[i][1]['tasa_egreso_mujeres']}%`
                        );
                        break;
                    case 'titulacion':
                        row.push(
                            tablaIndices[i][1]['hombres_titulados'], 
                            tablaIndices[i][1]['mujeres_tituladas'],
                            `${tablaIndices[i][1]['tasa_titulacion_hombres']}%`,
                            `${tablaIndices[i][1]['tasa_titulacion_mujeres']}%`
                        );
                        break;
                    default:
                        row.push(
                            tablaIndices[i][1]['hombres_desertores'], 
                            tablaIndices[i][1]['mujeres_desertoras'], 
                            `${tablaIndices[i][1]['tasa_permanencia']}%`
                        );
                        break;
                }
                tabla.push(row);
            }
        }
    return tabla;
};

/**
 * Construye la tabla de índices para el modo generacional
 * @param {string} tipo - Tipo de índice (desercion, permanencia, etc)
 * @param {Object} data - Datos recibidos del backend
 * @param {number} numSemestres - Número de semestres seleccionado
 * @returns {Array} Tabla formateada para el componente
 */
export const buildTablaIndicesGeneracional = (tipo, data, numSemestres) => {
    const tabla = [];
    const generaciones = Object.entries(data);
    
    for(const [generacion, datos] of generaciones) {
        // Calcular el periodo final
        const periodoInicial = `${generacion.slice(0,4)}-${generacion.slice(4,5)}`;
        const [año, semestre] = periodoInicial.split('-');
        const semestresFuturos = parseInt(numSemestres) - 1; // Restamos 1 porque empezamos desde el semestre inicial
        
        let añosAdicionales, semestreFinal;
        
        if (parseInt(semestre) === 1) {
            // Si empieza en semestre 1
            añosAdicionales = Math.floor(semestresFuturos / 2);
            // Si el número de semestres es impar, termina en 3, si es par, en 1
            semestreFinal = semestresFuturos % 2 === 0 ? '1' : '3';
        } else {
            // Si empieza en semestre 3
            añosAdicionales = Math.ceil(semestresFuturos / 2);
            // Si el número de semestres es impar, termina en 1, si es par, en 3
            semestreFinal = semestresFuturos % 2 === 0 ? '3' : '1';
        }
        
        const añoFinal = parseInt(año) + añosAdicionales;
        const periodoCompleto = `${periodoInicial} a ${añoFinal}-${semestreFinal}`;

        const row = [
            periodoCompleto,  // Ahora usamos el periodo completo
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

    return tabla.sort((a, b) => b[0].localeCompare(a[0]));
};