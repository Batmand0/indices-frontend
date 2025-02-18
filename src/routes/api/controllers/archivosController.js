import API from "src/utils/api";

export const subirArchivosExcel = async (archivo, tipo) => {
    const f = archivo.get('file');
    try {
      const res = await API.post(`registros/${tipo}/subir/${f.name}`, archivo, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          timeout: 0,
        });
      return res;
      } catch (err) {
        return {
          data: null,
          status: 400
        };
      }
};