module.exports = class ContenedorProductos {
    constructor(knex, tableName) {
        this.knex = knex;
        this.tableName = tableName;
    }

    async save(objeto) {
        try {
            await this.knex.schema.hasTable(this.tableName).then(async (exists) => {
                if (!exists) {
                    await this.knex.schema.createTable(this.tableName, (table) => {
                        table.increments("id").unique();
                        table.string("nombre").notNullable();
                        table.integer("precio").notNullable();
                        table.string("link").notNullable();
                    });
                }
                return await this.knex(this.tableName).insert(objeto);
            });

            console.log(`Se agregó el producto: ${objeto.nombre}`);
        } catch (error) {
            return error;
        }
    }
    async getAll() {
        try {
            let allProducts = await this.knex.from(this.tableName).select("*");
            return allProducts;
        } catch (error) {
            return error;
        }
    }
    async getRandom() {
        try {
            await this.getAll().then((contenido) => {
                return contenido[Math.floor(Math.random() * contenido.length)];
            });
        } catch (error) {
            return error;
        }
    }
    async getById(id) {
        try {
            let product = await this.knex.from(this.tableName).select("*").where('id', id)
            return product

        } catch (error) { return error; }
    }

    async deleteById(id) {
        try {
            await this.knex.from(this.tableName).select("*").where('id', id).del()
            return `Se elimino el producto`

        } catch (error) { return error; }
    }

    async deleteAll() {
        try {
            await this.knex.from(this.tableName).del()
            return console.log("Se eliminaron todos los productos");
        } catch (error) { return error; }
    }
};
