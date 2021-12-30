const funcasync = require('./index')
const faker = require('faker')
const { v4: uuidv4 } = require('uuid')

let arrayFakerProductos = []

class Contenedor {
    constructor(nameFile) {
      this.nameFile = nameFile
    }
  
    async save(product) {
      let fileExits = await funcasync.readFileAsync(this.nameFile); 
      if (fileExits && fileExits.length >= 0) {
        let dataFile = JSON.parse(fileExits);
        product.id = dataFile[dataFile.length - 1].id + 1;
        dataFile.push(product);
        // this.productos = dataFile;
        funcasync.writeFileAsync(dataFile, this.nameFile);
        return product.id
      } else {
        let dataFile = []
        product.id = 1;
        dataFile.push(product);
        console.log(dataFile)
  
        funcasync.writeFileAsync(dataFile, this.nameFile);
        return product.id
      }
    }
  
    async getById(id) {
      let fileExits = await funcasync.readFileAsync(this.nameFile)
  
      if(fileExits) {
        let dataFile = JSON.parse(fileExits)
  
        for(let i=0; i<dataFile.length; i++) {
          if(dataFile[i].id == id) {
            return dataFile[i]
          }
        }
        return {error: "Producto no encontrado"}
      }
    }
  
    async getAll() {
      let datos = await funcasync.readFileAsync(this.nameFile)
  
      if(datos) {
        let dataFile = JSON.parse(datos)
        return dataFile
      } else {
        console.log('as')
        let vacio = []
        return vacio
      }
    }
  
    async deleteById(id) {
      let datos = await funcasync.readFileAsync(this.nameFile)
      
      if(datos) {
        let dataFile = JSON.parse(datos)
        for(let i=0; i<dataFile.length; i++) {
          if(dataFile[i].id == id) {
            dataFile.splice(i, 1)
            funcasync.truncateAsync(this.nameFile)
            funcasync.writeFileAsync(dataFile, this.nameFile)
          }
        }
      }
    }
  
    async deleteAll() {
        funcasync.truncateAsync(this.nameFile)
    }

    getProductsFakeados(num) {
      for(let i=0; i < num; i++) {
        arrayFakerProductos.push({
          id: uuidv4(),
          title: faker.commerce.productName(),
          price: faker.commerce.price(),
          thumbnail: faker.image.business()
        })
      }

      return arrayFakerProductos
    }
  
  }

module.exports.Contenedor = Contenedor