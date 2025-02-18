import { anioPeriodo } from './headerHelpers';

export const buildListaAlumnos = (lista, semestres, cohorte) => {
    const tabla = [];

    lista.forEach((fila) => {
        const row = [];
        const fecha = new Date();
        const periodoFinal = [];
        periodoFinal.push(fecha.getFullYear().toString());
        if (fecha.getMonth() > 7)
            periodoFinal.push('3');
        else
            periodoFinal.push('1');

        const nombre = `${fila['curp']['paterno']} ${fila['curp']['materno']} ${fila['curp']['nombre']}`;
        row.push(nombre, fila['no_control'], fila['plan']['carrera'], fila['curp']['genero']);
        let periodo = cohorte.split("-");

        for(let num = 0; num < semestres; num++) {
            const dato = fila['registros']['ingresos'][num];
            if(dato !== undefined){
                if (dato['periodo'] === `${periodo[0]}${periodo[1]}`) {
                    row.push(fila['plan']['carrera']);
                } else {
                    let found = false;
                    fila['registros']['ingresos'].forEach((ing) => {
                        if (ing['periodo'] === `${periodo[0]}${periodo[1]}`){
                            found = true;
                            row.push(fila['plan']['carrera']);
                        }
                    });
                    if (!found) {
                        if (`${periodo[0]}${periodo[1]}` >= `${periodoFinal[0]}${periodoFinal[1]}`)
                            row.push('-');
                        else
                            row.push('BAJA');
                    }
                }
            } else {
                let found = false;
                fila['registros']['ingresos'].forEach((ing) => {
                    if (ing['periodo'] === `${periodo[0]}${periodo[1]}`){
                        found = true;
                        row.push(fila['plan']['carrera']);
                    }
                });
                if (!found) {
                    if (fila['registros']['egreso'][0] !== undefined) {
                        if (Number(fila['registros']['egreso'][0]['periodo']) <= Number(`${periodo[0]}${periodo[1]}`)) {
                            row.push('EGR');
                        } else {
                            if (`${periodo[0]}${periodo[1]}` >= `${periodoFinal[0]}${periodoFinal[1]}`)
                                row.push('-');
                            else
                                row.push('BAJA');
                        }
                    } else {
                        if (`${periodo[0]}${periodo[1]}` >= `${periodoFinal[0]}${periodoFinal[1]}`)
                            row.push('-');
                        else
                            row.push('BAJA');
                    }
                }
            }
            periodo = anioPeriodo(periodo);
        }
        if (fila['registros']['egreso'][0] !== undefined) {
            row.push(`${fila['registros']['egreso'][0]['periodo'].slice(0,4)}-${fila['registros']['egreso'][0]['periodo'].slice(4,5)}`);
        } else {
            row.push('-');
        }
        if (fila['registros']['titulacion'][0] !== undefined) {
            row.push(`${fila['registros']['titulacion'][0]['periodo'].slice(0,4)}-${fila['registros']['titulacion'][0]['periodo'].slice(4,5)}`);
        } else {
            row.push('-');
        }
        if (fila['registros']['liberacion_ingles'][0] !== undefined) {
            row.push(`${fila['registros']['liberacion_ingles'][0]['periodo'].slice(0,4)}-${fila['registros']['liberacion_ingles'][0]['periodo'].slice(4,5)}`);
        } else {
            row.push('-');
        }
        tabla.push(row);
        periodo = cohorte.split("-");
    });
    return tabla;
};