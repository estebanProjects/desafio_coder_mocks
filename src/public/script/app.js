

const socket = io()

const table = document.getElementById('table')
const tbody = document.getElementById('tbody')
const btn = document.getElementById('input_button')

console.log(table, tbody, btn)

// Normalize
const authorSchema = new normalizr.schema.Entity('author', {}, {idAttribute: 'id'})

const messageSchema = new normalizr.schema.Entity('text', {author: authorSchema}, {idAttribute: 'id'})

const messagesSchema = new normalizr.schema.Entity('posts', {mensaje: [messageSchema]}, {idAttribute: 'id'})
console.log(authorSchema)


// Dev
const addProduct = () => {
    let dataObj = {
        title: document.querySelector('#title').value,
        price: document.querySelector('#price').value,
        thumbnail: document.querySelector('#thumbnail').value
    }
    console.log(dataObj)
    socket.emit('dataProducto', dataObj)
}

const render = (data) => {
    console.log(data)
    let html = data.map(x => {
        return `
        <tr>
            <td> ${x.title} </td>
            <td> ${x.price} </td>
            <td> <img src="${x.thumbnail}" /> </td>
        </tr>
    `}).join(" ")
    tbody.innerHTML = html
}

btn.addEventListener('click', (e) => {
    e.preventDefault()
    addProduct()
})

// socket.on('message_back', (data) => {
//     const newData = normalizr.denormalize(
//         data.result,
//         messageSchema,
//         data.entities
//       );
// })


// Chat
socket.on('mensaje_enviado_guardado', (data) => {
    renderChat(data)
})

const renderChat = (data) => { 
    console.log(data.entities.posts.message.posts)

    let html = data.entities.posts.message.posts.map(xa => {
        console.log(xa)
        console.log(xa.author)
        return `
        <p> <strong class="correo">${xa.author.name}</strong><b class="hora">[${xa.author.shippingDate}]</b><i class="mensaje">: ${xa.message}</i></p><img src="${xa.author.avatar}" />
        `
    }).join(" ")

    document.querySelector('#box_mensajes').innerHTML = html
}

const addInfoMns = () => {
    if(document.querySelector('#input_correo').value.split(" ").join("") == '') {
        alert("Tienes que poner un correo para poder mandar un mensaje")
        return 
    }
    console.log("Mensaje :D")
    let fechaActual = new Date()
    let fechaDeEnvio = `${fechaActual.toLocaleDateString()} ${fechaActual.getHours()}:${fechaActual.getMinutes()}:${fechaActual.getSeconds()}`
    let dataMensaje = {
        author: {
            id: document.querySelector('#input_correo').value,
            name: document.querySelector('#input_nombre').value,
            apellido: document.querySelector('#input_apellido').value,
            edad: document.querySelector('#input_edad').value,
            alias: document.querySelector('#input_alias').value,
            avatar: document.querySelector('#input_avatar').value,
            shippingDate: fechaDeEnvio,
        },
        message: document.querySelector('#input_mensaje').value,
    }
    let newDataMensaje = { id:"message", posts: dataMensaje}

    console.log(dataMensaje)
    socket.emit('dataMensaje', normalizr.normalize(newDataMensaje, messagesSchema))
    document.querySelector("#input_mensaje").value = ''
}

// const renderConsole = (data) => {
//     const newData = normalizr.denormalize(data, mensajeSchema, data.entities)
    
//     console.log(newData)
// }

const btn_mns = document.getElementById('btn_mensaje')

btn_mns.addEventListener('click', (e) => {
    e.preventDefault()
    addInfoMns()
})