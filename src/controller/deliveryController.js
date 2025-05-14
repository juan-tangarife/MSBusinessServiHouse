const { PrismaClient } = require('@prisma/client'); //Importamos el cliente de prisma
const prisma = new PrismaClient(); //Creamos una instancia del cliente de prisma
require("dotenv").config(); //Nos permite leer las variables de entorno
const express = require('express');

const createDelivery = async (req, res) => {
    console.log(req.body);
    //const { message, success } = verifyToken(req, 'createOrder'); //Verificamos el token
    if (!req.body || Object.keys(req.body).length === 0) { 
        return res.status(400).json({
            success: false,
            status: 400,
            message: "Request body is required"
        })
    }
    
    let { full_name, location_id } = req.body; 
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
                full_name, 
                location_id
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

module.exports = {
    createDelivery
};