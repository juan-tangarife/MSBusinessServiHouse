const { PrismaClient } = require('@prisma/client'); //Importamos el cliente de prisma
const prisma = new PrismaClient(); //Creamos una instancia del cliente de prisma
require("dotenv").config(); //Nos permite leer las variables de entorno
const e = require('express');
const orderRequest = require('../models/orderRequest'); //Importamos el modelo de la peticion
const verifyToken = require('../middlewares/auth.js');

const createOrder = async (req, res) => {
    //const { message, success } = verifyToken(req, 'createOrder'); //Verificamos el token
    if (!req.body || Object.keys(req.body).length === 0) { 
        return res.status(400).json({
            success: false,
            status: 400,
            message: "Request body is required"
        })
    }
    let modelErrors = orderRequest.validate(req.body); 
    if (modelErrors) {
        return res.status(400).json({
            success: false,
            status: 400,
            message: modelErrors
        })
    }
    
    let { order_number, delivery_id, final_address_id } = req.body; 
    try {
        const delivery = await prisma.delivery.findFirst({
            where: {
                id: delivery_id
            }
        });
        if (!delivery) {
            return res.status(400).json({
                success: false,
                status: 400,
                message: "Delivery not found"
            });
        }
        const finalAddress = await prisma.location.findFirst({
            where: {
                id: final_address_id
            }
        });
        if (!finalAddress) {
            return res.status(400).json({
                success: false,
                status: 400,
                message: "Final address not found"
            });
        }
        const order = await prisma.order.create({
            data: {
                order_number, 
                delivery_id, 
                final_address_id,
                status: "PENDING",
            },
        });
        res.status(201).json({
            success: true,
            status: 201,
            message: "Order created successfully",
        })

    } catch (error) {
        console.log(error);
        
        res.status(500).json({
            success: false,
            status: 500,
            message: "Order creation failed",
            error: error.message
        })
    }
}

const readOrder = async (req, res) => {
    //const { message, success } = verifyToken(req, 'createOrder'); //Verificamos el token
    order_number= req.params.order_number; //Obtenemos el order_number de la url
    try {
        const order = await prisma.order.findFirst({
            where: {
                order_number: order_number
            }
        });
        if (!order) {
            return res.status(400).json({
                success: false,
                status: 400,
                message: "Order not found"
            });
        }
        res.status(200).json({
            success: true,
            status: 201,
            message: "Order found successfully",
            order: order
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            status: 500,
            message: "Order finding failed",
            error: error.message
        })
    }
};
const allOrders = async (req, res) => {
    //const { message, success } = verifyToken(req, 'createOrder'); //Verificamos el token
    try {
        const orders = await prisma.order.find(); //Obtenemos todos los pedidos
        if (!orders) {
            return res.status(400).json({
                success: false,
                status: 400,
                message: "Orders not found"
            });
        }
        res.status(200).json({
            success: true,
            status: 201,
            message: "Orders found successfully",
            orders: orders
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            status: 500,
            message: "Orders finding failed",
            error: error.message
        })
    }
}
const updateOrder = async (req, res) => {
    //const { message, success } = verifyToken(req, 'createOrder'); //Verificamos el token
    order_number= req.params.order_number; //Obtenemos el order_number de la url
    if (!req.body || Object.keys(req.body).length === 0) { 
        return res.status(400).json({
            success: false,
            status: 400,
            message: "Request body is required"
        })
    }
    let modelErrors = orderRequest.validate(req.body); 
    if (modelErrors) {
        return res.status(400).json({
            success: false,
            status: 400,
            message: modelErrors
        })
    }
    
    let { delivery_id, final_address_id } = req.body;
    try {
        const delivery = await prisma.delivery.findFirst({
            where: {
                id: delivery_id
            }
        });
        if (!delivery) {
            return res.status(400).json({
                success: false,
                status: 400,
                message: "Delivery not found"
            });
        }
        const finalAddress = await prisma.location.findFirst({
            where: {
                id: final_address_id
            }
        });
        if (!finalAddress) {
            return res.status(400).json({
                success: false,
                status: 400,
                message: "Final address not found"
            });
        }
        const order = await prisma.order.update({ 
            where: {
                order_number: order_number, 
            },
            data: {
                order_number: order_number, 
                delivery_id: delivery_id, 
                final_address_id: final_address_id, 
            },
        });
        if (!order) {
            return res.status(400).json({
                success: false,
                status: 400,
                message: "Order not updated or found"
            });
        }
        res.status(200).json({
            success: true,
            status: 201,
            message: "Order updated successfully",
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            status: 500,
            message: "Order update failed",
            error: error.message
        })
    }
}
const deleteOrder = async (req, res) => {
    //const { message, success } = verifyToken(req, 'createOrder'); //Verificamos el token
    order_number= req.params.order_number; //Obtenemos el order_number de la url
    try {
        const order = await prisma.order.delete({
            where: {
                order_number: order_number
            }
        });
        if (!order) {
            return res.status(400).json({
                success: false,
                status: 400,
                message: "Order not found"
            });
        }
        res.status(200).json({
            success: true,
            status: 201,
            message: "Order deleted successfully",
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            status: 500,
            message: "Order deletion failed",
            error: error.message
        })
    }
}


module.exports = {
    createOrder,
    readOrder,
    allOrders,
    updateOrder,
    deleteOrder,
};
