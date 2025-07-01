
export const buildTablaReportesNuevoIngreso = (data) => {
    const datos= Object.entries(data);
    const tabla = [];
    datos.forEach((registros) => {
        const row = [registros[0]];
        const regs = Object.entries(registros[1]);
        regs.forEach((reg) => {
            row.push(reg[1]['hombres'], reg[1]['mujeres']);
        });
        tabla.push(row);
    });
    return tabla;
};

export const buildTablaReportesEgreso = (data) => {
    const datos= Object.entries(data);
    const tabla = [];
    datos.forEach((registros) => {
        console.log(registros);
        // Se agrega el nombre de la carrera
        const row = [registros[0], registros[1]['poblacion_nuevo_ingreso']['hombres'], registros[1]['poblacion_nuevo_ingreso']['mujeres']];
        const regs = Object.entries(registros[1]['registros']);
        regs.forEach((reg) => {
            if (reg[0].startsWith('total') || reg[0].startsWith('tasa'))
                row.push(reg[1]['valor']);
            else
                row.push(reg[1]['hombres'], reg[1]['mujeres']);
        });
        if (row.length > 15) {
            const inicioRegs = row.slice(0, 11);
            inicioRegs.push(row[13], row[14], row[15], row[16], row[11], row[12],row[17], row[18], row[19]);
            tabla.push(inicioRegs);
        } else {
            tabla.push(row);
        }
    });
    return tabla;
};

export const buildTablaReportesTitulacion = (data) => {
    const datos= Object.entries(data);
    const tabla = [];
    datos.forEach((registros) => {
        console.log(registros);
        // Se agrega el nombre de la carrera
        const row = [registros[0], registros[1]['poblacion_nuevo_ingreso']['hombres'], registros[1]['poblacion_nuevo_ingreso']['mujeres']];
        const regs = Object.entries(registros[1]['registros']);
        regs.forEach((reg) => {
            if (reg[0].startsWith('total') || reg[0].startsWith('tasa') || reg[0].startsWith('indice'))
                row.push(reg[1]['valor']);
            else
                row.push(reg[1]['hombres'], reg[1]['mujeres']);
        });
        if (row.length > 14) {
            const inicioRegs = row.slice(0, 11);
            inicioRegs.push(row[13], row[14], row[15], row[11], row[12], row[16], row[17]);
            tabla.push(inicioRegs);
        } else {
            tabla.push(row);
        }
    });
    return tabla;
};