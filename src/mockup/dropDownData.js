import { getCarreras, getCarrerasAll, getCarrerasForUser } from "../utils/helpers/carreraHelpers";
import { anioPeriodo } from "../utils/helpers/headerHelpers";
import { getPlanes } from "../utils/helpers/planesHelper";

const getListaCarreras = async () => {
    const carreras = await getCarreras();
    const lista = [];
    carreras.forEach((c) => {
        lista.push({
            'value': c['clave'],
            'label': c['nombre']
        });
    });
    return lista;
};

const getListaPlanes = async () => {
    const planes = await getPlanes();
    const lista = [];
    planes.forEach((p) => {
        lista.push({
            'value': p['clave'],
            'label': p['clave']
        });
    });
    return lista;
};

const getListaCarrerasAll = async () => {
    const carreras = await getCarrerasAll();
    const lista = [];
    carreras.forEach((c) => {
        lista.push({
            'value': c['clave'],
            'label': c['nombre']
        });
    });
    return lista;
};

const getListaCarrerasForUser = async (id) => {
    const carreras = await getCarrerasForUser(id);
    const lista = [];
    carreras.forEach((c) => {
        lista.push({
            'value': c['clave'],
            'label': c['nombre']
        });
    });
    return lista;
};

const getCohortes = () => {
    const cohorts = [];
    const fecha = new Date();
    const periodoFinal = [];
    let periodo = ['2015', '1'];
    periodoFinal.push(fecha.getFullYear().toString());
    if (fecha.getMonth() > 7)
        periodoFinal.push('3');
    else
        periodoFinal.push('1');
    do {
        cohorts.push({'value':`${periodo[0]}-${periodo[1]}`, 'label':`${periodo[0]}-${periodo[1]}`});
        periodo = anioPeriodo(periodo);
    } while (`${periodoFinal[0]}-${periodoFinal[1]}` !== `${periodo[0]}-${periodo[1]}`);
    cohorts.push({'value':`${periodoFinal[0]}-${periodoFinal[1]}`, 'label':`${periodoFinal[0]}-${periodoFinal[1]}`});
    cohorts.sort((a, b) => a < b ? -1 : 1);
    return cohorts;
};

const numSemestres = [
    {'value':'9', 'label':'9 semestres'},
    {'value':'10','label':'10 semestres'},
    {'value':'11','label':'11 semestres'},
    {'value':'12', 'label':'12 semestres'},
    {'value':'13', 'label':'13 semestres'},
    {'value':'14', 'label':'14 semestres'},
    {'value':'15', 'label':'15 semestres'},
];

const semestres = [
    ['1','1ro'],
    ['2','2do'],
    ['3','3ro'],
    ['4','4to'],
    ['5','5to'],
    ['6','6to'],
    ['7','7mo'],
    ['8','8bo'],
    ['9','9no'],
    ['10','10mo'],
    ['11','11vo'],
    ['12','12vo'],
    ['13','13vo'],
    ['14','14vo'],
    ['15','15vo'],
];
const dropDownData = {
    getCohortes,
    getListaCarreras,
    getListaCarrerasAll,
    getListaCarrerasForUser,
    getListaPlanes,
    numSemestres,
    semestres,
};

export default dropDownData;