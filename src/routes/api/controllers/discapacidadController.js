import API from "src/utils/api";

export const getDiscapacidades = async() => {
    const discapacidades = await API.get('discapacidades/');
    return discapacidades.data['results'];
};

export const createDiscapacidad = async(nombre, desc) =>{
    try {
        const disc = await API.post('discapacidades/', {
            nombre:nombre,
            descripcion:desc
        });
        return disc;
    } catch (err) {
        return {
            data: null,
            status: 400,
        };
    }
};