import API from "src/utils/api";

export const realizarCorte = async () => {
    try {
        const res = await API.post('/registros/realizar-corte/', {withCredentials: true});
        return res;
    } catch (error) {
        return {
            data: null,
            status: 400
        };
    }
};