import { getNombreCarrera } from "./carreraHelpers";

export async function getIndicesHeaders(tipo, cohorte, carrera, verSexo) {
    const tabla = [];
    const nombreCarrera = await getNombreCarrera(carrera);
    tabla.push(["Indices de rendimiento escolar cohorte generacional" +' '+cohorte+' '+nombreCarrera]);
    const row = ['Semestre', 'Periodo', 'Inscritos (H/M)', '', 'Egresados (H/M)', ''];
    if (!verSexo) {
        switch(tipo) {
            case 1:
                row.push('Desercion (H/M)', '', 'Tasa de retencion');
                break;
            case 2:
                row.push('Desercion (H/M)', '', 'Tasa de desercion escolar');
                break;
            case 3:
                row.push('Titulados (H/M)', '', 'Eficiencia de titulacion');
                break;
            case 4:
                row.push('Eficiencia terminal');
                break;
            default:
                row.push('Desercion (H/M)', '', 'Matricula final','Tasa de retencion');
        }
        tabla.push(row);
        return tabla;
    } else {
        switch(tipo) {
            case 1:
                row.push('Desercion (H/M)', '', 'Tasa de retencion (H)', 'Tasa de retencion (M)');
                break;
            case 2:
                row.push('Desercion (H/M)', '', 'Tasa de desercion (H)', 'Tasa de desercion(M)');
                break;
            case 3:
                row.push('Titulados (H/M)', '', 'Eficiencia de titulacion (H)', 'Eficiencia de titulacion (M)');
                break;
            case 4:
                row.push('Eficiencia terminal (H)', 'Eficiencia terminal (M)');
                break;
            default:
                row.push('Desercion (H/M)', '', 'Matricula final','Tasa de retencion');
        }
        tabla.push(row);
        return tabla;
    }
    
}

export function getTablasHeaders(cohorte, numSemestres) {
    const tabla = [];
    tabla.push('Carrera', cohorte);
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
    // Arreglo que contendrá las tres filas del header
    const tabla = [];

    // Primera fila: contiene títulos principales
    // tipo === 1 ? 'titulación' : 'egreso' -> si tipo es 1 muestra 'titulación', si no muestra 'egreso'
    const firstRow = [
        'Carrera',              // Columna para nombre de carrera
        'Nuevo Ingreso (H/M)', '',    // Columnas para nuevo ingreso (H/M)
        `Año de ${tipo === 1 ? 'titulación' : 'egreso'}`, '' // Columnas para año (H/M)
    ];

    // Segunda fila: contendrá los periodos
    // Espacios vacíos que se alinean con las columnas de la primera fila
    const secondRow = [' ', ' '];
    if (tipo === 1) secondRow.push(' ');

    // Tercera fila: contendrá los números de semestre
    // Espacios vacíos que se alinean con las columnas de la primera fila
    const thirdRow = [' ', ' '];
    if (tipo === 1) thirdRow.push(' ');
    
    // Separamos el periodo inicial (ejemplo: "2020-1" -> ["2020", "1"])
    let periodo = cohorte.split("-");

    // Avanzamos 8 periodos desde el inicio (4 años)
    for (let i = 0; i < 8; i++){
        periodo = anioPeriodo(periodo);
    }

    // Agregamos columnas para los semestres del 9 al 12 (o hasta numSemestres si es menor)
    for (let i = 9; i <= (numSemestres >= 12 ? 12 : numSemestres); i++) {
        if (i > 9) {
            // Agregamos espacios vacíos para mantener alineación H/M
            firstRow.push('', '');
        }
        // Agregamos el periodo con formato "YYYY-P (H/M)"
        secondRow.push(periodo[0]+"-"+periodo[1]+" (H/M)");
        secondRow.push(''); // Espacio para M
        periodo = anioPeriodo(periodo);
        // Agregamos el número de semestre
        thirdRow.push(i);
        thirdRow.push(''); // Espacio para mantener alineación
    }

    // Agregamos las columnas finales para eficiencia
    firstRow.push('');
    firstRow.push(`Eficiencia de ${tipo === 1 ? 'titulación' : 'egreso'}`);
    firstRow.push(`Eficiencia de ${tipo === 1 ? 'titulación (H)' : 'egreso (H)'}`);
    firstRow.push(`Eficiencia de ${tipo === 1 ? 'titulación (M)' : 'egreso (M)'}`);
    if(tipo === 1) firstRow.push('Indice de titulación');
    secondRow.push("Total",' ', ' ',' ',' '); 
    thirdRow.push(' ', ' ', ' ',' ',' ');

    // Si son más de 12 semestres, agregamos columnas adicionales
    if (numSemestres > 12) {
        firstRow.push(
            `Año  de ${tipo === 1 ? 'titulación' : 'egreso'}`, '', // Columnas para año adicional
            `Eficiencia de ${tipo === 1 ? 'titulación' : 'egreso'}`,
            `Eficiencia de ${tipo === 1 ? 'titulación (H)' : 'egreso (H)'}`,
            `Eficiencia de ${tipo === 1 ? 'titulación (M)' : 'egreso (M)'}`
        );
        // Agregar espacios para mantener alineación
        secondRow.push(periodo[0]+"-"+periodo[1]+" (H/M)", '');
        thirdRow.push(numSemestres, '');

        if (tipo === 1) {
            // Agregar espacios para mantener alineación
            secondRow.push('.', '');
            thirdRow.push('', '');
            firstRow.push('Indice de Titulación');
        }
    }

    // Agregamos las tres filas a la tabla en orden
    tabla.push(firstRow);  // Primera fila: títulos
    tabla.push(secondRow); // Segunda fila: periodos
    tabla.push(thirdRow);  // Tercera fila: números de semestre

    return tabla;
}

export function getNuevoIngresoHeaders(cohorte, numSemestres) {
    const tabla = [];
    const headerRow = ['Carrera'];
    const periodosRow = [''];
    
    let periodo = cohorte.split("-");
    for (let i = 0; i < numSemestres; i++) {
        headerRow.push(`${periodo[0]}-${periodo[1]} (H)`);
        headerRow.push(`${periodo[0]}-${periodo[1]} (M)`);
        periodo = anioPeriodo(periodo);
    }

    tabla.push(headerRow);
    tabla.push(periodosRow);
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
