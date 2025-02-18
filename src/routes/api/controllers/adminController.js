import API from "src/utils/api";

export const getListaUsuarios = async() => {
    const listaUsuarios = await API.get('usuario/lista/');
    console.log(listaUsuarios.data['results']);
    return listaUsuarios.data['results'];
};

export const cambiarContrasena = async(password1, password2) => {
    try {
        const res = await API.post('usuario/contrasena/cambiar/', {
                'new_password1': password1,
                'new_password2': password2,
            },);
        return res;
    } catch (err) {
        return {
            data: null,
            status: 400,
        };
    }
};

export const crearUsuario = async(usuario) => {
    try {
        const res = await API.post('/usuario/registrar/', {
            username: usuario.username,
            'first_name': usuario.first_name,
            'paternal_surname': usuario.paternal_surname,
            'maternal_surname': usuario.maternal_surname,
            gender: usuario.gender,
            email: usuario.email,
            password: usuario.password,
            password2: usuario.copyPassword
        });
        return res;
    } catch (err) {
        return {
            data: err.response.data,
            status: 400
        };
    }
};

export const editarUsuario = async(usuario) => {
    try {
        const res = await API.put(`/usuario/${usuario.id}/`, {
            username: usuario.username,
            email: usuario.email,
        });
        return res;
    } catch (err) {
        return {
            data: err.response.data,
            status: 400
        };
    }
};

export const getUsuarioById = async(id) => {
    try {
        const res = await API.get(`/usuario/${id}/`);
        return res;
    } catch (err) {
        return {
            data: err.response.data,
            status: 400
        };
    }
};