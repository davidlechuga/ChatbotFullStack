'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
require ('dotenv').config()

const access_token = process.env.ACCESS_TOKEN

const app = express();

app.set('port', 5000);
app.use(bodyParser.json());

app.get('/', function(req, response){
    response.send('Hola Mundo!');
})

app.get('/webhook', function(req, response){
    if(req.query['hub.verify_token'] === 'full-stack_token'){
        response.send(req.query['hub.challenge']);
    } else {
        response.send('Full-Stack MERN no tienes permisos.');
    }
});

app.post('/webhook/', function(req, res){
    const webhook_event = req.body.entry[0];
    if(webhook_event.messaging) {
        webhook_event.messaging.forEach(event => {
            handleEvent(event.sender.id, event);
        });
    }
    res.sendStatus(200);
});

function handleEvent(senderId, event){
    if(event.message && event.message.quick_reply) {
        // handleMessage(senderId, event.message)
        handlePostback(senderId, event.message.quick_reply.payload)
    } else if (event.message) {
        // estrayendo info. de nuestro postback
        handleMessage(senderId, event.message)
    }
}

// Estamos recibiendo un evento , capturado como handleMessage, si tenemos adjuntos....
function handleMessage(senderId, event){
    if(event.text){
        defaultMessage(senderId);
    } else if (event.attachments) {
        handleAttachments(senderId, event)
    }
}

//SENDER ACTIONS
function senderActions(senderId) {
    const messageData = {
        recipient: {
            id: senderId
        },
        "sender_action": "typing_on"
    }
    callSendApi(messageData)
}


// DEFAULT MESSAGE 
function defaultMessage(senderId) {
    const messageData = {
        recipient: {
            id: senderId
        },
        message: {
            text: "Hola soy un bot de messenger y te invito a utilizar nuestro menu",
            quick_replies: [
                {
                    content_type: "text",
                    title: "¿view Courses?",
                    payload: "DESARROLLO_PAYLOAD"
                },
                {
                    content_type: "text",
                    title: "¿About GDG FES Acatlan?",
                    payload: "ABOUT_PAYLOAD"
                }
            ]
        }
    }

    senderActions(senderId)
    callSendApi(messageData);
}

// MANEJADOR DE POSTBACK CON DIFERENTES CASOS.
function handlePostback(senderId,payload){ 
    console.log(payload);
    switch (payload) {
        case "GET_STARTED_Full-Stack MERN":
            console.log(payload);
        break;
        case "DESARROLLO_PAYLOAD":
            console.log(payload);
            showCourses(senderId);
            break;
        case "HTML_PAYLOAD":
            console.log(payload);
            moreHTML(senderId);
        break;    
    }
}



// funcion para filtrar tipo de adjuntos
function handleAttachments(senderId, event) {
    let attachment_type = event.attachments[0].type;
    switch (attachment_type) {
        case "image":
            console.log(attachment_type);
        break
        case "video":
            console.log(attachment_type);
        break
        case "audio":
            console.log(attachment_type);
        break
        case "file":
            console.log(attachment_type);
        break
    }
}
 
function callSendApi(response) {
    request({
        uri: "https://graph.facebook.com/v2.6/me/messages",
        qs: {
            "access_token": access_token
        },
        method: "POST",
        json: response
    },
        function (err) {
            if (err) {
                console.log('Ha ocurrido un error')
            } else {
                console.log('Mensaje enviado')
            }
        }
    )
}

function showCourses(senderId) {
    const messageData = {
        recipient: {
            id: senderId
        },
        message: {
            attachment: {
                type: "template",
                payload: {
                    template_type: "generic",
                    elements: [
                        {
                            title: "HTML",
                            subtitle: "Conoce la estructura de las páginas web",
                            image_url: "https://bit.ly/2RAOBZB",
                            buttons: [
                                {
                                    type: "postback",
                                    title: "Empezar HTML",
                                    payload: "HTML_PAYLOAD",
                                }
                            ]
                        },
                        {
                            title: "CSS",
                            subtitle: "Aplica estiloas a tu pagina",
                            image_url: "https://bit.ly/2RZvAz5",
                            buttons: [
                                {
                                    type: "postback",
                                    title: "Empezar CSS",
                                    payload: "CSS_PAYLOAD",
                                }
                            ]
                        }
                    ]
                }
            }
        }
    }
    // mandar estos datos a la api de nuevo con nuestra funcion.
    callSendApi(messageData)
}

function moreHTML(senderId) {
    const messageData = {
        recipient: {
            id: senderId
        },
        message: {
            attachment: {
                type: "template",
                payload: {
                    template_type: "generic",
                    elements: [
                        {
                            title: "ReactJs",
                            image_url: "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcQ93xxvZtLYATdNfjkgQlapKb3iSl4S90bTO7ZpG1JfE3Cg5m6l",
                            subtitle: "Manejo de Estado y Props",
                            buttons: [
                                {
                                type: "postback",
                                title: "Elegir Curso",
                                payload: "REACT_PAYLOAD"
                                }
                            ]
                        },
                        {
                            title: "GraphQl",
                            image_url: "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcQ4xwQnsgykapXGof0ylkLgFIREonUePOvT5AsvT7YISnLtlHdm",
                            subtitle: "Queryes & Mutations",
                            buttons: [
                                {
                                type: "postback",
                                title: "Elegir Curso",
                                payload: "GRAPHQL_PAYLOAD"
                                }
                            ]
                        }
                    ]
                }
            }
        }
    }
    callSendApi(messageData);
}


app.listen(app.get('port'), function(){
    console.log('Nuestro servidor esta funcionando en el puerto: ', app.get('port'));
});





