const fs = require('fs');

module.exports = class Contenedor {
    constructor(nombreArchivo) {
        this.nombreArchivo = nombreArchivo;
    }

    async save(objeto) {
        try {
            const archivo = await fs.promises.readFile(this.nombreArchivo, 'utf-8');
            let contenido = JSON.parse(archivo)
            contenido.length ?
                objeto["id"] = contenido[contenido.length - 1].id + 1
                : objeto["id"] = 1;

            contenido.push(objeto);
            await fs.promises.writeFile(this.nombreArchivo, JSON.stringify(contenido, null, 2), "utf-8");
            console.log(`Se agregó el mensaje: ${objeto.id}`);
            return objeto.id;
        } catch (error) {
            if (error.code === "ENOENT") {
                objeto["id"] = 1;

                fs.promises.writeFile(this.nombreArchivo, JSON.stringify([objeto], null, 2), "utf-8");
                console.log(`Se agregó el mensaje: ${objeto.id}`);
                return objeto.id;

            } else {
                console.log(error);
            }
        }
    }
    

}