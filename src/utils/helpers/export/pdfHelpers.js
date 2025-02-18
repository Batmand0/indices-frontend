// import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { getNombreCarrera } from "../carreraHelpers";

export async function generatePDF(titulo, cohorte, numSemestres, heading, content, multiPagina, examenYConv, tasladoYEquiv, carrera="") {
    const tipoAlumnos = (examenYConv && tasladoYEquiv) ? 1 : (examenYConv) ? 2 : 3;
    let filtroAlumnos = "Examen, convalidación, traslado y equivalencia";
    switch (tipoAlumnos){
        case 1:
            filtroAlumnos = "examen, convalidación, traslado y equivalencia";
            break;
        case 2:
            filtroAlumnos = "examen y convalidación";
            break;
        case 3:
            filtroAlumnos = "traslado y equivalencia";
            break;
        default:
            filtroAlumnos = "sin filtro";
    }
    const doc = new jsPDF(titulo === 'Lista de Alumnos' ? 'l' : 'p', 'pt', 'letter');
    doc.setFont('Helvetica', 'Bold');
    const eduLogo = new Image();
    const tecLogo = new Image();
    const itmLogo = new Image();
    doc.setFontSize(12);
    tecLogo.src = "/img/logo/Logo-TecNM.png";
    eduLogo.src = "/img/logo/sep_logo.png";
    itmLogo.src = "/img/logo/itmlogo.png";
    if (multiPagina) {
        doc.addImage(eduLogo, 'PNG', 200, 50, 160, 45);
        doc.setDrawColor(179, 142,93);
        doc.line(370, 60, 370, 90, 'S');
        doc.addImage(tecLogo, 'PNG', 380, 50, 100, 45);
        doc.line(490, 60, 490, 90, 'S');
        doc.addImage(itmLogo, 'PNG', 500, 57, 21.6, 36);
        doc.setDrawColor(0, 0,0);
        doc.text('Instituto Tecnológico de Mexicali', 397.5, 130, null, null, 'center');
        doc.line(160, 140, 650, 140);
        doc.text(`Reporte de ${titulo} a ${numSemestres} semestres`, 397.5, 165, null, null,  'center');
        doc.text(`Alumnos de ingreso por ${filtroAlumnos}`, 397.5, 185, null, null,  'center');
        if(carrera !== ""){
            const nombreC = await getNombreCarrera(carrera);
            doc.text(nombreC, 397.5, 205, null, null,  'center');
            doc.text(`Cohorte generacional ${cohorte}`, 397.5, 225, null, null,  'center');
        } else {
            doc.text(`Cohorte generacional ${cohorte}`, 397.5, 205, null, null,  'center');
        }
    } else {
        doc.addImage(eduLogo, 'PNG', 50, 50, 160, 45);
        doc.setDrawColor(179, 142,93);
        doc.line(220, 60, 220, 90, 'S');
        doc.addImage(tecLogo, 'PNG', 230, 50, 100, 45);
        doc.line(340, 60, 340, 90, 'S');
        doc.addImage(itmLogo, 'PNG', 350, 57, 21.6, 36);
        doc.setDrawColor(0, 0,0);
        doc.text('Instituto Tecnológico de Mexicali', 297.5, 130, null, null, 'center');
        doc.line(60, 140, 550, 140);
        doc.text(`Reporte de ${titulo} a ${numSemestres} semestres`, 297.5, 165, null, null,  'center');
        doc.text(`Alumnos de ingreso por ${filtroAlumnos}`, 297.5, 185, null, null,  'center');
        if(carrera !== ""){
            const nombreC = await getNombreCarrera(carrera);
            doc.text(nombreC, 297.5, 205, null, null,  'center');
            doc.text(`Cohorte generacional ${cohorte}`, 297.5, 225, null, null,  'center');
        } else {
            doc.text(`Cohorte generacional ${cohorte}`, 297.5, 205, null, null,  'center');
        }
    }
    let  header = heading;
    if (!Array.isArray(heading[1])){
        header = [];
        header.push(heading);
    }
    if(multiPagina){
        /*
        Crear tabla de la primera pagina - con los indices o a 19
        agregar otra pagina
        Crear otra tabla con los registros restantes y ponerla desde el inicio de las paginas
        */
        autoTable(doc, {
            headStyles: {
                fillColor: '#1B396A',
                fontSize: numSemestres > 10 ? 5 : 7,
            },
            bodyStyles: {
                fontSize: numSemestres > 10 ? 5 : 7,
            },
            margin: { top: 215 },
            head:  header,
            body: content.filter((row, index) => index < 17),
        });
        if (content.length > 16) {
            doc.addPage();
            autoTable(doc,{
                headStyles: {
                fillColor: '#1B396A',
                fontSize: numSemestres > 10 ? 5 : 7,
                },
                bodyStyles: {
                    fontSize: numSemestres > 10 ? 5 : 7,
                },
                margin: { top: 50 },
                head:  header,
                body: content.filter((row, index) => index >= 17),
            });
        }
    } else {
        autoTable(doc, {
            headStyles: {
                fillColor: '#1B396A',
                fontSize: 8,
            },
            bodyStyles: {
                fontSize: 7,
            },
            margin: { top: 215 },
            html: '#tabla ',
        });
    }
    doc.save('reporte.pdf');
    return "Good";
}

export async function generatePDFReporte(alumno, fechaNac, heading, content) {
    const doc = new jsPDF('p', 'pt', 'letter');
    doc.setFont('Helvetica', 'Bold');
    const eduLogo = new Image();
    const tecLogo = new Image();
    const itmLogo = new Image();
    doc.setFontSize(12);
    tecLogo.src = "/img/logo/Logo-TecNM.png";
    eduLogo.src = "/img/logo/sep_logo.png";
    itmLogo.src = "/img/logo/itmlogo.png";
    doc.addImage(eduLogo, 'PNG', 50, 50, 160, 45);
    doc.setDrawColor(179, 142,93);
    doc.line(220, 60, 220, 90, 'S');
    doc.addImage(tecLogo, 'PNG', 230, 50, 100, 45);
    doc.line(340, 60, 340, 90, 'S');
    doc.addImage(itmLogo, 'PNG', 350, 57, 21.6, 36);
    doc.setDrawColor(0, 0,0);
    doc.text('Instituto Tecnológico de Mexicali', 297.5, 130, null, null, 'center');
    doc.line(60, 140, 550, 140);
    doc.text(`Historial de alumno`, 297.5, 165, null, null,  'center');
    doc.setFontSize(10);
    doc.text(`Nombre: ${alumno.nombre} ${alumno.paterno} ${alumno.materno}`, 60, 185);
    doc.text(`No. de control: ${alumno['no_control']}`, 60, 205);
    const nombreC = await getNombreCarrera(alumno.carrera);
    doc.text(`Carrera: ${nombreC}`, 60, 225);
    doc.text(`Fecha de nacimiento: ${fechaNac}`, 60, 245);
    doc.text(`Sexo: ${alumno.genero}`, 60, 265);
    doc.text(`Estatus: ${alumno.estatus}`, 60, 285);
    let  header = heading;
    if (!Array.isArray(heading[1])){
        header = [];
        header.push(heading);
    }
    autoTable(doc, {
        headStyles: {
            fillColor: '#1B396A',
            fontSize: 9,
        },
        bodyStyles: {
            fontSize: 8,
        },
        margin: { top: 300 },
        html: '#tabla ',
    });
    doc.save(`reporte_${alumno['no_control']}.pdf`);
    return "Good";
}