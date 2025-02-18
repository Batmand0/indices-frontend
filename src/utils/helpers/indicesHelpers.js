
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