const fs = require('fs')

class Contenedor {
    constructor(file) {
        //console.log('contenedor ok!')
        this.file = file
        this.data = []
        try {
            this.read()
        } catch (error) {
            this.write()
        }
    }
    
    write() {
        fs.promises.writeFile(this.file, JSON.stringify(this.data))
        .then(() => {
            console.log('Data saved!')
        })
        .catch(error => console.log(error))
    }
    read() {
        fs.promises.readFile(this.file)
        .then(data => {
            this.data = JSON.parse(data)
            //console.log('Data loaded!')
        })
        .catch(error => console.log(error))
    }
    getLastId() {
        const l = this.data.length
        if (l < 1) return 0
        return this.data[this.data.length - 1].id
    }
    save(obj) {
        const id = this.getLastId()
        this.data.push({
            ...obj, ...{id: id + 1}
        })
        this.write()
    }
    getById(id) {
        return this.data.find(p => p.id == id)
    }
    getAll() {
        return this.data
    }
    deleteById(id) {
        const idx = this.data.findIndex(p => p.id == id)
        this.data.splice(idx, 1)
        this.write()
    }
    deleteAll() {
        this.data = []
        this.write()
    }

    editById(id, campo, valor) {
        const productos = this.getAll
        //console.log(productos)
        const prodEdit = productos.find(p => p.id == id)
        //console.log(idx)
        prodEdit[campo] = valor
        //console.log(prodEdit)

    }
}

module.exports = Contenedor