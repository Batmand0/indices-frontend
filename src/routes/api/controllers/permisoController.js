import API from "src/utils/api";

export const asignarPermiso = async(clave, usuarioId) => {
    try {
        console.log(usuarioId);
        const res = await API.get('carreras/permisos', { params: {
            'usuario': usuarioId,
            'clave': clave,
        }});
        return res;
    } catch (err) {
        return {
            data: null,
            status: 400,
        };
    }
};

export const removerTodosPermisos = async(usuarioId) => {
    try {
        console.log(usuarioId);
        const res = await API.get('carreras/remover-permisos/todos', { params: {
            'usuario': usuarioId,
        }});
        return res;
    } catch (err) {
        return {
            data: null,
            status: 400,
        };
    }
};