import API from "src/utils/api";

export const sendPasswordResetEmail = async (email) => {
    try {
        const res = await API.post('/password-reset/', {
            email: email
        });
        return res;
    } catch (err) {
        return {
            data: null,
            status: 400,
        };
    }
};


export const sendNewPassword = async (token, password) => {
    try {
        const res = await API.post(`/password-reset/confirm/`, {
            token: token,
            password: password
        });
        return res;
    } catch (err) {
        return {
            data: null,
            status: 400,
        };
    }
};
