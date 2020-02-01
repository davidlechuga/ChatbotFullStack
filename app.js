'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
require ('dotenv').config()
const access_token = process.env.ACCESS_TOKEN

const app = express();

app.set('port', (process.env.PORT || 5000));
app.use(bodyParser.json());

app.get('/', function(req, response){
    response.send('Hola Mundo!');
})

app.get('/webhook', function(req, response){
    if(req.query['hub.verify_token'] === 'full-stack_token'){
        response.send(req.query['hub.challenge']);
    } else {
        response.send('Pug Pizza no tienes permisos.');
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
    if(event.message){
        handleMessage(senderId, event.message)
    } else if(event.postback) {
        handlePostback(senderId, event.postback.payload)
    }
}

function handleMessage(senderId, event){
    if (event.text) {
        // messageImage(senderId);
        // showLocations(senderId);
        // contactSuppport(senderId)
        receipt(senderId)
    } else if (event.attachments) {
        handleAttachments(senderId, event)
    }
}

function defaultMessage(senderId) {
    const messageData = {
        "recipient": {
            "id": senderId
        },
        "message": {
            "text": "Hola soy un bot de messenger y te invito a utilizar nuestro menu",
            "quick_replies": [
                {
                    "content_type": "text",
                    "title": "¿Quieres una Pizza?",
                    "payload": "PIZZAS_PAYLOAD"
                },
                {
                    "content_type": "text",
                    "title": "Acerca de",
                    "payload": "ABOUT_PAYLOAD"
                }
            ]
        }
    }
    senderActions(senderId)
    callSendApi(messageData);
}

function handlePostback(senderId, payload){
    console.log(payload)
    switch (payload) {
        case "GET_STARTED_PUGPIZZA":
            console.log(payload)
        break;
        case "DESARROLLO_PAYLOAD":
            showPizzas(senderId);
        break;
        case "HTML_PAYLOAD":
            sizePizza(senderId);
            break;
        case "NODE_PAYLOAD":
            sizePizza(senderId);
        break;
    }
}

function senderActions(senderId) {
    const messageData = {
        "recipient": {
            "id": senderId
        },
        "sender_action": "typing_on"
    }
    callSendApi(messageData);
}

function handleAttachments(senderId, event){
    let attachment_type = event.attachments[0].type;
    switch (attachment_type) {
        case "image":
            console.log(attachment_type);
        break;
        case "video": 
            console.log(attachment_type);
        break;
        case "audio":
            console.log(attachment_type);
        break;
      case "file":
            console.log(attachment_type);
        break;
      default:
            console.log(attachment_type);
        break;
    }
}

function callSendApi(response) {
    request({
        "uri": "https://graph.facebook.com/me/messages",
        "qs": {
            "access_token": access_token
        },
        "method": "POST",
        "json": response
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


function showPizzas(senderId) {
    const messageData = {
        "recipient": {
            "id": senderId
        },
        "message": {
            "attachment": {
                "type": "template",
                "payload": {
                    "template_type": "generic",
                    "elements": [
                        {
                            "title": "HTML y CSS",
                            "subtitle": "Estructuras y Estilos",
                            "image_url": "https://bit.ly/2RAOBZB",
                            "buttons": [
                                {
                                    "type": "postback",
                                    "title": "Elegir curso",
                                    "payload": "HTML_PAYLOAD",
                                }
                            ]
                        },
                        {
                            "title": "NodeJs",
                            "subtitle": "Express",
                            "image_url": "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcSPGI97iHJC9Gcej-u8jFIfV18woG9oQyj-yRj0Z6XVKZvyZ48d",
                            "buttons": [
                                {
                                    "type": "postback",
                                    "title": "Elegir curso",
                                    "payload": "NODE_PAYLOAD",
                                }
                            ]
                        }
                    ]
                }
            }
        }
    }
    callSendApi(messageData)
}

function messageImage(senderId) {
    const messageData = {
        "recipient": {
            "id": senderId
        },
        "message": {
            "attachment": {
                "type": "image",
                "payload": {
                    "url": "https://media.giphy.com/media/1dOIvm5ynwYolB2Xlh/giphy.gif"
                }
            }
        }
    }
    callSendApi(messageData);
}

function contactSuppport(senderId) {
    const messageData = {
        "recipient": {
            "id": senderId
        },
        "message": {
            "attachment": {
                "type": "template",
                "payload": {
                    "template_type": "button",
                    "text": "Hola este es el canal de soporte, ¿quieres llamarnos?",
                    "buttons": [
                        {
                            "type": "phone_number",
                            "title": "Llamar a un asesor",
                            "payload": "+5580039815"
                        }
                    ]
                }
            }
        }
    }
    callSendApi(messageData);
}

function showLocations(senderId) {
    const messageData = {
        "recipient": {
            "id": senderId
        },
        "message": {
            "attachment": {
                "type": "template",
                "payload": {
                    "template_type": "generic",
                    "elements": [
                        {
                            "title": "Sucursal Edo.Mexico",
                            "image_url": "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcSczBnisJdkPmIfdzLXhhbpUCFisUlHxrG5saYOu1Y8yLAVXCLb",
                            "subtitle": "Direccion bonita #555",
                            "buttons": [
                                {
                                    "title": "Ver en el mapa",
                                    "type": "web_url",
                                    "url": "https://www.google.com.mx/maps/place/Facultad+de+Estudios+Superiores+Acatl%C3%A1n+UNAM/@19.4839603,-99.2486638,17z/data=!3m1!4b1!4m5!3m4!1s0x85d2030f995d7901:0xc8546d108471abcd!8m2!3d19.4839603!4d-99.2464751",
                                    "webview_height_ratio": "full"
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


function sizePizza(senderId) {
    const messageData = {
        "recipient": {
            "id": senderId
        },
        "message": {
            attachment: {
                "type": "template",
                "payload": {
                    "template_type": "generic",
                    "elements": [
                        {
                            "title": "ReactJs",
                            "image_url": "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcQ93xxvZtLYATdNfjkgQlapKb3iSl4S90bTO7ZpG1JfE3Cg5m6l",
                            "subtitle": "Manejo de Estado y Props",
                            "buttons": [
                                {
                                    "type": "postback",
                                    "title": "Elegir Individual",
                                    "payload": "PERSONAL_SIZE_PAYLOAD",
                                }
                            ]
                        },
                        {
                            "title": "GraphQl",
                            "image_url": "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcQ4xwQnsgykapXGof0ylkLgFIREonUePOvT5AsvT7YISnLtlHdm",
                            "subtitle": "Queryes & Mutations",
                            "buttons": [
                                {
                                    "type": "postback",
                                    "title": "Elegir Curso",
                                    "payload": "GRAPHQL_PAYLOAD",
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

function receipt(senderId) {
    const messageData = {
        "recipient": {
            "id": senderId
        },
        "message": {
            "attachment": {
                "type": "template",
                "payload": {
                    "template_type": "receipt",
                    "recipient_name": "Lechuga Huerta David",
                    "order_number": "123123",
                    "currency": "USD",
                    "payment_method": "Visa 2345",
                    "order_url": "http://petersapparel.parseapp.com/order?order_id=123456",
                    "timestamp": "1428444852",
                    "address": {
                        "street_1": "Avenida Alcanfores y San Juan, Totoltepec s/n, Sta Cruz Acatlan, 53150 Naucalpan de Juárez, Méx.",
                        "street_2": "",
                        "city": "Mexico",
                        "postal_code": "94025",
                        "state": "Edo.Mex",
                        "country": "Mexico"
                    },
                    "summary": {
                        "subtotal": 0.00,
                        "shipping_cost": 0.00,
                        "total_tax": 0.0,
                        "total_cost": 0.00
                    },
                    "adjustments": [
                        {
                            "name": "New Customer Discount",
                            "amount": 20
                        },
                        {
                            "name": "$100 Off Coupon",
                            "amount": 100
                        }
                    ],
                    "elements": [
                        {
                            "title": "Hml,Css + React",
                            "subtitle": "Create Your new App",
                            "quantity": 1,
                            "price": 0,
                            "currency": "USD",
                            "image_url": "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcQ93xxvZtLYATdNfjkgQlapKb3iSl4S90bTO7ZpG1JfE3Cg5m6l"
                        },
                        {
                            "title": "NODEJs",
                            "subtitle": "Apollo + GraphQl",
                            "quantity": 1,
                            "price": 0,
                            "currency": "USD",
                            "image_url": "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcQ4xwQnsgykapXGof0ylkLgFIREonUePOvT5AsvT7YISnLtlHdm"
                        }
                    ]
                }
            }
        }
    }
    callSendApi(messageData);
}


function receipt(senderId) {
    const messageData = {
        "recipient": {
            "id": senderId
        },
        "message": {
            "attachment": {
                "type": "template",
                "payload": {
                    "template_type": "receipt",
                    "recipient_name": "Lechuga Huerta David",
                    "order_number": "123123",
                    "currency": "MXN",
                    "payment_method": "Efectivo",
                    "order_url": "http://petersapparel.parseapp.com/order?order_id=123456",
                    "timestamp": "123123123",
                    "address": {
                        "street_1": "Avenida Alcanfores y San Juan, Totoltepec s/n, Sta Cruz Acatlan, 53150 Naucalpan de Juárez, Méx.",
                        "street_2": "",
                        "city": "Mexico",
                        "postal_code": "94025",
                        "state": "Edo.Mex",
                        "country": "Mexico"
                    },
                    "summary": {
                        "subtotal": 0.00,
                        "shipping_cost": 0.00,
                        "total_tax": 0.00,
                        "total_cost": 0.00
                    },
                    "adjustments": [
                        {
                            "name": "Descuentos Frecuentes",
                            "amount": 0
                        },
                        {
                            "name": "Coupon",
                            "amount": 0.00
                        }
                    ],
                    "elements": [
                        {
                            "title": "Hml,Css + React",
                            "subtitle": " Create Your new App",
                            "quantity": 0,
                            "price": 0.00,
                            "currency": "MXN",
                            "image_url": "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcQ93xxvZtLYATdNfjkgQlapKb3iSl4S90bTO7ZpG1JfE3Cg5m6l"
                        },
                        {
                            "title": "NODEJs",
                            "subtitle": "Apollo + GraphQl",
                            "quantity": 0.00,
                            "price": 0.00,
                            "currency": "MXN",
                            "image_url": "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcQ4xwQnsgykapXGof0ylkLgFIREonUePOvT5AsvT7YISnLtlHdm"
                        }
                    ]
                }
            }
        }
    }
    callSendApi(messageData);
}


app.listen(app.get('port'), function () {
    console.log('Nuestro servidor esta funcionando con el barto en el puerto: ', app.get('port'))
});