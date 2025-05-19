const { PrismaClient } = require('@prisma/client'); //Importamos el cliente de prisma
const prisma = new PrismaClient(); //Creamos una instancia del cliente de prisma
require("dotenv").config(); //Nos permite leer las variables de entorno
const e = require('express');

const createProvider = async (req, res) => {
    //const { message, success } = verifyToken(req, 'createOrder'); //Verificamos el token
    if (!req.body || Object.keys(req.body).length === 0) { 
        return res.status(400).json({
            success: false,
            status: 400,
            message: "Request body is required"
        })
    }
    
    let { name, id} = req.body; 
    try {
        const providerExists = await prisma.provider.findUnique({
            where: {
                id
            }
        });
        if (providerExists) {
            return res.status(400).json({
                success: false,
                status: 400,
                message: "Provider already registered"
            })
        }

        const provider = await prisma.provider.create({
            data: {
                id,
                name
            }
        });
        res.status(201).json({
            success: true,
            status: 201,
            message: "Provider created successfully",
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            status: 500,
            message: "Error creating provider",
            error: error.message
        })
    }
}

const getProviders = async (req, res) => {
    //const { message, success } = verifyToken(req, 'getOrders'); //Verificamos el token
    try {
        const providers = await prisma.provider.findMany();
        res.status(200).json({
            success: true,
            status: 200,
            message: "Providers retrieved successfully",
            data: providers
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            status: 500,
            message: "Error retrieving providers",
            error: error.message
        })
    }
}

const getProviderById = async (req, res) => {
    //const { message, success } = verifyToken(req, 'getOrders'); //Verificamos el token
    const { id } = req.params;
    try {
        const provider = await prisma.provider.findUnique({
            where: {
                id: parseInt(id)
            }
        });
        if (!provider) {
            return res.status(404).json({
                success: false,
                status: 404,
                message: "Provider not found"
            })
        }
        res.status(200).json({
            success: true,
            status: 200,
            message: "Provider retrieved successfully",
            data: provider
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            status: 500,
            message: "Error retrieving provider",
            error: error.message
        })
    }
}

const updateProvider = async (req, res) => {
    //const { message, success } = verifyToken(req, 'updateOrder'); //Verificamos el token
    const { id } = req.params;
    if (!req.body || Object.keys(req.body).length === 0) {
        return res.status(400).json({
            success: false,
            status: 400,
            message: "Request body is required"
        })
    }
    let { name } = req.body;
    try {
        const providerExists = await prisma.provider.findUnique({
            where: {
                id: parseInt(id)
            }
        });
        if (!providerExists) {
            return res.status(404).json({
                success: false,
                status: 404,
                message: "Provider not found"
            })
        }

        const provider = await prisma.provider.update({
            where: {
                id: parseInt(id)
            },
            data: {
                name
            }
        });
        res.status(200).json({
            success: true,
            status: 200,
            message: "Provider updated successfully",
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            status: 500,
            message: "Error updating provider",
            error: error.message
        })
    }
}

const deleteProvider = async (req, res) => {
    //const { message, success } = verifyToken(req, 'deleteOrder'); //Verificamos el token
    const { id } = req.params;
    try {
        const providerExists = await prisma.provider.findUnique({
            where: {
                id: parseInt(id)
            }
        });
        if (!providerExists) {
            return res.status(404).json({
                success: false,
                status: 404,
                message: "Provider not found"
            })
        }

        await prisma.provider.delete({
            where: {
                id: parseInt(id)
            }
        });
        res.status(200).json({
            success: true,
            status: 200,
            message: "Provider deleted successfully",
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            status: 500,
            message: "Error deleting provider",
            error: error.message
        })
    }
}


module.exports = {
    createProvider,
    getProviders,
    getProviderById,
    updateProvider,
    deleteProvider
}