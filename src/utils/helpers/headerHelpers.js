import { getNombreCarrera } from "./carreraHelpers";

export async function getIndicesHeaders(tipo, cohorte, carrera) {
    const tabla = [];
    const nombreCarrera = await getNombreCarrera(carrera);
    tabla.push(["Indices de rendimiento escolar cohorte generacional"+' '+cohorte+' '+nombreCarrera]);
    const row = ['Semestre', 'Periodo', 'Inscritos (H/M)', '', 'Egresados (H/M)', ''];
    switch(tipo) {
        case 1:
            row.push('Desercion (H/M)', '', 'Tasa de retencion');
            tabla.push(row);
            break;
        case 2:
            row.push('Desercion (H/M)', '', 'Tasa de desercion escolar');
            tabla.push(row);
            break;
        case 3:
            row.push('Titulados (H/M)', '', 'Eficiencia de titulacion');
            tabla.push(row);
            break;
        case 4:
            row.push('Eficiencia terminal');
            tabla.push(row);
            break;
        default:
            row.push('Desercion (H/M)', '', 'Matricula final','Tasa de retencion');
            tabla.push(row);
    }
    return tabla;
}

export function getTablasHeaders(cohorte, numSemestres) {
    const tabla = [];
    tabla.push('Carrera', '', cohorte);
    let periodo = cohorte.split("-");
    for (let i = 1; i < numSemestres; i++) {
        periodo = anioPeriodo(periodo);
        tabla.push(periodo[0]+"-"+periodo[1]);
    }
    return tabla;
}

export function getCrecimientoHeaders(cohorte, numSemestres) {
    const tabla =['Periodo', 'Población'];
    return tabla;
}

export function anioPeriodo(periodoAnterior) {
    if (periodoAnterior[1] === '3') {
        periodoAnterior[0] = String(Number(periodoAnterior[0]) + 1);
        periodoAnterior[1] = '1';
    } else if (periodoAnterior[1] === '1') {
        periodoAnterior[1] = String(Number(periodoAnterior[1])+ 2);
    }
    return periodoAnterior;
}

export function getReportesHeaders(tipo, cohorte, numSemestres){
    const tabla = [];
    const firstRow = ['Carrera', 'Nuevo Ingreso', '', `Año de ${tipo === 1 ? 'titulación' : 'egreso'}`, ''];
    const secondRow = [' ', ' ', ' '];
    const thirdRow = [' ', ' ', ' '];
    let periodo = cohorte.split("-");
    for (let i = 0; i < 8; i++){
        periodo = anioPeriodo(periodo);
    }
    for (let i = 9; i <= (numSemestres >= 12 ? 12 : numSemestres); i++) {
        if (i > 9) {
            firstRow.push('', '');
        }
        secondRow.push(periodo[0]+"-"+periodo[1]+" (H/M)");
        secondRow.push('');
        periodo = anioPeriodo(periodo);
        thirdRow.push(i);
        thirdRow.push('');
    }
    firstRow.push('');
    firstRow.push(`Eficiencia de ${tipo === 1 ? 'titulación' : 'egreso'}`);
    secondRow.push("Total",' ');
    thirdRow.push(' ', ' ');
    if (numSemestres > 12) {
        firstRow.push(`Año  de ${tipo === 1 ? 'titulación' : 'egreso'}`, '', `Eficiencia de ${tipo === 1 ? 'titulación' : 'egreso'}`);
        secondRow.push(periodo[0]+"-"+periodo[1]+" (H/M)");
        secondRow.push('');
        thirdRow.push(13);
        thirdRow.push('');
    }
    tabla.push(firstRow);
    tabla.push(secondRow);
    tabla.push(thirdRow);
    return tabla;
}

export function getNuevoIngresoHeaders(cohorte, numSemestres) {
    const tabla = [];
    tabla.push(['Carrera', 'Nuevo Ingreso']);
    tabla.push(['']);
    let periodo = cohorte.split("-");
    for (let i = 0; i < numSemestres; i++) {
        tabla[1].push(periodo[0]+"-"+periodo[1]+" (H/M)");
        tabla[1].push('');
        periodo = anioPeriodo(periodo);
    }
    return tabla;
}

export function getListaAlumnosHeaders(cohorte, numSemestres) {
    const tabla = [];
    tabla.push([' ', '', '', '']);
    tabla.push(['Nombre', 'No. control', 'Carrera', 'Sexo']);
    let periodo = cohorte.split("-");
    for (let i = 1; i <= numSemestres; i++) {
        tabla[0].push(`SEM ${i}`);
        tabla[1].push(periodo[0]+"-"+periodo[1]);
        periodo = anioPeriodo(periodo);
    }
    tabla[0].push('EGRESO');
    tabla[1].push('PERIODO');
    tabla[0].push('TITULACION');
    tabla[1].push('PERIODO');
    tabla[0].push('INGLES');
    tabla[1].push('PERIODO');
    return tabla;
}
