const { PrismaClient } = require('@prisma/client'); //Importamos el cliente de prisma
const prisma = new PrismaClient(); //Creamos una instancia del cliente de prisma
require("dotenv").config(); //Nos permite leer las variables de entorno
const e = require('express');

const createManager = async (req, res) => {
    //const { message, success } = verifyToken(req, 'createOrder'); //Verificamos el token
    if (!req.body || Object.keys(req.body).length === 0) {
        return res.status(400).json({
            success: false,
            status: 400,
            message: "Request body is required"
        })
    }

    let { full_name, email, phone } = req.body;
    try {
        const emailExists = await prisma.manager.findUnique({
            where: {
                email
            }
        });
        if (emailExists) {
            return res.status(400).json({
                success: false,
                status: 400,
                message: "Email already registered in manager"
            })
        }

        const manager = await prisma.manager.create({
            data: {
                full_name,
                email,
                phone,
                user_id,
                state: "active"
            }
        });
        res.status(201).json({
            success: true,
            status: 201,
            message: "Manager created successfully",
        })
    } catch (error) {
        console.log(error);

        res.status(500).json({
            success: false,
            status: 500,
            message: "Error creating manager",
            error: error.message
        })
    }
}

const getManagers = async (req, res) => {
    //const { message, success } = verifyToken(req, 'getOrders'); //Verificamos el token
    try {
        const managers = await prisma.manager.findMany();
        res.status(200).json({
            success: true,
            status: 200,
            message: "Managers retrieved successfully",
            data: managers
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            status: 500,
            message: "Error retrieving managers",
            error: error.message
        })
    }
}


const getManagerById = async (req, res) => {
    //const { message, success } = verifyToken(req, 'getOrders'); //Verificamos el token
    const { id } = req.params;
    try {
        const manager = await prisma.manager.findUnique({
            where: {
                id: parseInt(id)
            }
        });
        if (!manager) {
            return res.status(404).json({
                success: false,
                status: 404,
                message: "Manager not found"
            })
        }
        res.status(200).json({
            success: true,
            status: 200,
            message: "Manager retrieved successfully",
            data: manager
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            status: 500,
            message: "Error retrieving manager",
            error: error.message
        })
    }
}

const updateManager = async (req, res) => {
    //const { message, success } = verifyToken(req, 'updateOrder'); //Verificamos el token
    const { id } = req.params;
    if (!req.body || Object.keys(req.body).length === 0) {
        return res.status(400).json({
            success: false,
            status: 400,
            message: "Request body is required"
        })
    }
    let { full_name, email, phone } = req.body;
    try {
        const manager = await prisma.manager.update({
            where: {
                id: parseInt(id)
            },
            data: {
                full_name,
                email,
                phone
            }
        });
        res.status(200).json({
            success: true,
            status: 200,
            message: "Manager updated successfully",
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            status: 500,
            message: "Error updating manager",
            error: error.message
        })
    }
}

const deleteManager = async (req, res) => {
    //const { message, success } = verifyToken(req, 'deleteOrder'); //Verificamos el token
    const { id } = req.params;
    try {
        const manager = await prisma.manager.delete({
            where: {
                id: parseInt(id)
            }
        });
        res.status(200).json({
            success: true,
            status: 200,
            message: "Manager deleted successfully",
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            status: 500,
            message: "Error deleting manager",
            error: error.message
        })
    }
}

const getStorageByManagerId = async (req, res) => {
    const { id } = req.params;
    try {
        const manager = await prisma.manager.findUnique({
            where: { id: parseInt(id) },
            include: { Storage: true }
        });
        if (!manager) {
            return res.status(404).json({
                success: false,
                status: 404,
                message: "Manager not found"
            });
        }
        res.status(200).json({
            success: true,
            status: 200,
            message: "Storages retrieved successfully",
            data: manager.Storage
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            status: 500,
            message: "Error retrieving storages",
            error: error.message
        });
    }
}
const getManagerByUserId = async (req, res) => {
    const { user_id } = req.params;
    try {
        const manager = await prisma.manager.findFirst({
            where: { user_id: user_id }
        });
        if (!manager) {
            return res.status(404).json({
                success: false,
                status: 404,
                message: "Manager not found"
            });
        }
        res.status(200).json({
            success: true,
            status: 200,
            message: "Manager retrieved successfully",
            data: manager
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            status: 500,
            message: "Error retrieving manager",
            error: error.message
        });
    }
}
const updateManagerUserId = async (req, res) => {
    const { id } = req.params;
    const { user_id } = req.body;

    if (!user_id) {
        return res.status(400).json({
            success: false,
            status: 400,
            message: "user_id is required"
        });
    }

    try {
        const manager = await prisma.manager.update({
            where: { id: parseInt(id) },
            data: { user_id }
        });
        res.status(200).json({
            success: true,
            status: 200,
            message: "Manager user_id updated successfully",
            data: manager
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            status: 500,
            message: "Error updating manager user_id",
            error: error.message
        });
    }
}

module.exports = {
    createManager,
    getManagers,
    getManagerById,
    updateManager,
    deleteManager,
    getStorageByManagerId,
    getManagerByUserId,
    updateManagerUserId
}