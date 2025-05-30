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
    let { user_id, full_name, email, phone } = req.body;

    try {

        const emailExists = await prisma.dispatcher.findUnique({
            where: {
                email
            }
        });
        if (emailExists) {
            return res.status(400).json({
                success: false,
                status: 400,
                message: "Email already registered in dispatcher"
            })
        }
        const dispatcher = await prisma.dispatcher.create({
            data: {
                user_id,
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

const getDispatchers = async (req, res) => {
    //const { message, success } = verifyToken(req, 'getOrders'); //Verificamos el token
    try {
        const dispatchers = await prisma.dispatcher.findMany();
        res.status(200).json({
            success: true,
            status: 200,
            message: "Dispatchers retrieved successfully",
            data: dispatchers
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            status: 500,
            message: "Error retrieving dispatchers",
            error: error.message
        })
    }
}

const getDispatcherById = async (req, res) => {
    //const { message, success } = verifyToken(req, 'getOrders'); //Verificamos el token
    const { id } = req.params;
    try {
        const dispatcher = await prisma.dispatcher.findUnique({
            where: {
                id: parseInt(id)
            }
        });
        if (!dispatcher) {
            return res.status(404).json({
                success: false,
                status: 404,
                message: "Dispatcher not found"
            })
        }
        res.status(200).json({
            success: true,
            status: 200,
            message: "Dispatcher retrieved successfully",
            data: dispatcher
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            status: 500,
            message: "Error retrieving dispatcher",
            error: error.message
        })
    }
}

const updateDispatcher = async (req, res) => {
    //const { message, success } = verifyToken(req, 'getOrders'); //Verificamos el token
    const { id } = req.params;
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
    let { user_id, full_name, email, phone } = req.body;

    try {
        const dispatcher = await prisma.dispatcher.update({
            where: {
                id: parseInt(id)
            },
            data: {
                user_id,
                full_name,
                email,
                phone
            }
        });
        if (!dispatcher) {
            return res.status(400).json({
                success: false,
                status: 400,
                message: "Dispatcher not updated"
            });
        }
        res.status(200).json({
            success: true,
            status: 200,
            message: "Dispatcher updated successfully",
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            status: 500,
            message: "Dispatcher update failed",
            error: error.message
        })
    }
}

const deleteDispatcher = async (req, res) => {
    //const { message, success } = verifyToken(req, 'getOrders'); //Verificamos el token
    const { id } = req.params;
    const { email } = req.body;

    try {
        let dispatcherId = id;
        if(!dispatcherId && email){
            const dispatcher = await prisma.dispatcher.findFirst({
                where:{
                    email: email
                }
            })
            if(!dispatcher){
                 return res.status(404).json({
                    success: false,
                    status: 404,
                    message: "Dispatcher with that email not found",
                });
            }
            dispatcherId = dispatcher.id;
        }
        if(!dispatcherId){
            return res.status(400).json({
                success: false,
                status: 400,
                message: "Dispatcher ID or email is required",
            });
        }
        await prisma.dispatcher.delete({
            where: {
                id: parseInt(dispatcherId)
            }
        });
        res.status(200).json({
            success: true,
            status: 200,
            message: "Dispatcher deleted successfully",
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            status: 500,
            message: "Error deleting dispatcher",
            error: error.message
        })
    }
}

const getStockByDispatcher = async (req, res) => {
    //const { message, success } = verifyToken(req, 'getOrders'); //Verificamos el token
    const { id } = req.params;
    try {
        const stock = await prisma.stock.findMany({
            where: {
                dispatcher_id: parseInt(id)
            }, 
            include:{
                Product: true
            }
        });
        if (!stock) {
            return res.status(404).json({
                success: false,
                status: 404,
                message: "Stock not found"
            })
        }
        res.status(200).json({
            success: true,
            status: 200,
            message: "Stock retrieved successfully",
            data: stock
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            status: 500,
            message: "Error retrieving stock",
            error: error.message
        })
    }
}

const getDispatcherByUserId = async (req, res) => {
    const { user_id } = req.params;
    try {
        const dispatcher = await prisma.dispatcher.findFirst({
            where: { user_id: user_id }
        });
        if (!dispatcher) {
            return res.status(404).json({
                success: false,
                status: 404,
                message: "Dispatcher not found"
            });
        }
        res.status(200).json({
            success: true,
            status: 200,
            message: "Dispatcher retrieved successfully",
            data: dispatcher
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            status: 500,
            message: "Error retrieving dispatcher",
            error: error.message
        });
    }
}

module.exports = {
    createDispatcher,
    getDispatchers,
    getDispatcherById,
    updateDispatcher,
    deleteDispatcher,
    getStockByDispatcher,
    getDispatcherByUserId
};