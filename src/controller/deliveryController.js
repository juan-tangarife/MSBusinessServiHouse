const { PrismaClient } = require('@prisma/client'); //Importamos el cliente de prisma
const prisma = new PrismaClient(); //Creamos una instancia del cliente de prisma
require("dotenv").config(); //Nos permite leer las variables de entorno
const express = require('express');

const createDelivery = async (req, res) => {
    //const { message, success } = verifyToken(req, 'createOrder'); //Verificamos el token
    if (!req.body || Object.keys(req.body).length === 0) { 
        return res.status(400).json({
            success: false,
            status: 400,
            message: "Request body is required"
        })
    }
    
    let { user_id, full_name, location_id, email} = req.body; 
    try {
        const location = await prisma.location.findFirst({
            where: {
                id: location_id
            }
        });
        if (!location) {
            return res.status(400).json({
                success: false,
                status: 400,
                message: "Location not found"
            });
        }
        const delivery = await prisma.delivery.create({
            data: {
                user_id,
                full_name, 
                location_id,
                email
            },
        });
        res.status(201).json({
            success: true,
            status: 201,
            message: "Delivery created successfully",
        })

    } catch (error) {
        console.log(error);
        
        res.status(500).json({
            success: false,
            status: 500,
            message: "Delivery creation failed",
            error: error.message
        })
    }
}

const getDeliveries = async (req, res) => {
    //const { message, success } = verifyToken(req, 'getOrders'); //Verificamos el token
    try {
        const deliveries = await prisma.delivery.findMany();
        res.status(200).json({
            success: true,
            status: 200,
            message: "Deliveries retrieved successfully",
            data: deliveries
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            status: 500,
            message: "Error retrieving deliveries",
            error: error.message
        })
    }
}

const getDeliveryById = async (req, res) => {
    //const { message, success } = verifyToken(req, 'getOrders'); //Verificamos el token
    const { id } = req.params;
    try {
        const delivery = await prisma.delivery.findUnique({
            where: {
                id: parseInt(id)
            }
        });
        if (!delivery) {
            return res.status(400).json({
                success: false,
                status: 400,
                message: "Delivery not found"
            });
        }
        res.status(200).json({
            success: true,
            status: 200,
            message: "Delivery retrieved successfully",
            data: delivery
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            status: 500,
            message: "Error retrieving delivery",
            error: error.message
        })
    }
}

const updateDelivery = async (req, res) => {
    //const { message, success } = verifyToken(req, 'getOrders'); //Verificamos el token
    const { id } = req.params;
    const { full_name, location_id } = req.body;
    try {
        const delivery = await prisma.delivery.findUnique({
            where: {
                id: parseInt(id)
            }
        });
        if (!delivery) {
            return res.status(400).json({
                success: false,
                status: 400,
                message: "Delivery not found"
            });
        }
        const updatedDelivery = await prisma.delivery.update({
            where: {
                id: parseInt(id)
            },
            data: {
                full_name,
                location_id
            }
        });
        res.status(200).json({
            success: true,
            status: 200,
            message: "Delivery updated successfully",
            data: updatedDelivery
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            status: 500,
            message: "Error updating delivery",
            error: error.message
        })
    }
}

const deleteDelivery = async (req, res) => {
    //const { message, success } = verifyToken(req, 'getOrders'); //Verificamos el token
    const { id } = req.params;
    try {
        const deliveryExists = await prisma.delivery.findUnique({
            where: {
                id: parseInt(id)
            }
        });
        if (!deliveryExists) {
            return res.status(404).json({
                success: false,
                status: 404,
                message: "Delivery not found"
            })
        }
        await prisma.delivery.delete({
            where: {
                id: parseInt(id)
            }
        });
        res.status(200).json({
            success: true,
            status: 200,
            message: "Delivery deleted successfully",
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            status: 500,
            message: "Error deleting delivery",
            error: error.message
        })
    }
}


module.exports = {
    createDelivery,
    getDeliveries,
    getDeliveryById,
    updateDelivery,
    deleteDelivery
    
};