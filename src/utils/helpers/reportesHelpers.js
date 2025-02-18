
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

export const buildTablaReportes = (data) => {
    const datos= Object.entries(data);
    // console.log(datos);
    const tabla = [];
    datos.forEach((registros) => {
        // Se agrega el nombre de la carrera
        const row = [registros[0], registros[1]['poblacion_nuevo_ingreso']['hombres'], registros[1]['poblacion_nuevo_ingreso']['mujeres']];
        const regs = Object.entries(registros[1]['registros']);
        regs.forEach((reg) => {
            if (reg[0].startsWith('total') || reg[0].startsWith('tasa'))
                row.push(reg[1]['valor']);
            else
                row.push(reg[1]['hombres'], reg[1]['mujeres']);
        });
        if (row.length > 13) {
            const inicioRegs = row.slice(0, 12);
            inicioRegs.push(row[14], row[12], row[13], row[15]);
            tabla.push(inicioRegs);
        } else {
            tabla.push(row);
        }
    });
    console.log(tabla);
    return tabla;
};
