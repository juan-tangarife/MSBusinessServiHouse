const { PrismaClient } = require('@prisma/client'); //Importamos el cliente de prisma
const prisma = new PrismaClient(); //Creamos una instancia del cliente de prisma
require("dotenv").config(); //Nos permite leer las variables de entorno
const express = require('express');

const createDispatcher = async (req, res) => {
    //const { message, success } = verifyToken(req, 'createOrder'); //Verificamos el token
    if (!req.body || Object.keys(req.body).length === 0) { 
        return res.status(400).json({
            success: false,
            status: 400,
            message: "Request body is required"
        })
    }
    if (!req.body.full_name || !req.body.email || !req.body.phone) {
        return res.status(400).json({
            success: false,
            status: 400,
            message: "Full name, email and phone are required"
        })
    }
    let { full_name, email, phone } = req.body;

    try {
        const dispatcher = await prisma.dispatcher.create({
            data: {
                full_name, 
                email,
                phone
            },
        });
        if (!dispatcher) {
            return res.status(400).json({
                success: false,
                status: 400,
                message: "Dispatcher not created"
            });
        }
        res.status(201).json({
            success: true,
            status: 201,
            message: "Dispatcher created successfully",
        })

    } catch (error) {        
        res.status(500).json({
            success: false,
            status: 500,
            message: "Dispatcher creation failed",
            error: error.message
        })
    }
}

module.exports = {
    createDispatcher
};