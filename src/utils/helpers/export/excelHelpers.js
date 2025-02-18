import ExcelJS from 'exceljs';
import FileSaver from 'file-saver';

export async function generateExcel(header, data, titulo, cohorte, numSemestres, tipoAlumnos, carrera="") {
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Reporte");
    sheet.addRow([`Reporte de ${titulo} ${carrera} - Cohorte generacional ${cohorte} a ${numSemestres} semestres`]);
    let filtroAlumnos = "Examen, convalidación, traslado y equivalencia";
    switch (tipoAlumnos){
        case 1:
            filtroAlumnos = "Examen, convalidación, traslado y equivalencia";
            break;
        case 2:
            filtroAlumnos = "Examen y convalidación";
            break;
        case 3:
            filtroAlumnos = "Traslado y equivalencia";
            break;
        default:
            filtroAlumnos = "Sin filtro";
    }
    if (filtroAlumnos !== "Sin filtro")
        sheet.addRow([`Se incluyen alumnos de ${filtroAlumnos}`]);

    if (header.length <= 3){
        const rows = sheet.addRows(header);
        rows.forEach((row) => {
            row.eachCell((cell) => {
                cell.fill = {
                    type: 'pattern',
                    pattern: 'solid',
                    fgColor: {
                        argb: 'ffff785a'
                    }
                };
                cell.font = {
                    name: 'Arial',
                    bold: true,
                    color: {
                        argb: 'ffffffff'
                    }
                };
            });
        });

    } else {
        const row = sheet.addRow(header);
        row.eachCell((cell) => {
            cell.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: {
                    argb: 'ffff785a'
                }
            };
            cell.font = {
                name: 'Arial',
                bold: true,
                color: {
                    argb: 'ffffffff'
                }
            };
        });
    }
    sheet.addRows(data);
    const column = sheet.getColumn('A');
    column.eachCell((cell) => {
        if(cell.value === "Carrera" || cell.value === "Nombre"){
            column.width = 38;
        }
    });
    const buffer = await workbook.xlsx.writeBuffer();
    FileSaver.saveAs(new Blob([buffer]), `Reporte_${titulo}-Cohorte_${cohorte}.xlsx`);
}