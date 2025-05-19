const { PrismaClient } = require('@prisma/client'); //Importamos el cliente de prisma
const prisma = new PrismaClient(); //Creamos una instancia del cliente de prisma
require("dotenv").config(); //Nos permite leer las variables de entorno
const e = require('express');

const createLocation = async (req, res) => {
    //const { message, success } = verifyToken(req, 'createOrder'); //Verificamos el token
    if (!req.body || Object.keys(req.body).length === 0) { 
        return res.status(400).json({
            success: false,
            status: 400,
            message: "Request body is required"
        })
    }
    
    let { altitude, latitude, static, address, city, department } = req.body; 
    try {
        const location = await prisma.location.create({
            data: {
                altitude, 
                latitude, 
                static,
                address,
                city,
                department
            },
        });
        res.status(201).json({
            success: true,
            status: 201,
            message: "Location created successfully",
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

const getLocations = async (req, res) => {
    //const { message, success } = verifyToken(req, 'getOrders'); //Verificamos el token
    try {
        const locations = await prisma.location.findMany();
        res.status(200).json({
            success: true,
            status: 200,
            message: "Locations retrieved successfully",
            data: locations
        })
    } catch (error) {
        console.log(error);
        
        res.status(500).json({
            success: false,
            status: 500,
            message: "Error retrieving locations",
            error: error.message
        })
    }
}

const getLocationById = async (req, res) => {
    //const { message, success } = verifyToken(req, 'getOrders'); //Verificamos el token
    const { id } = req.params;
    try {
        const location = await prisma.location.findUnique({
            where: {
                id: parseInt(id)
            }
        });
        if (!location) {
            return res.status(404).json({
                success: false,
                status: 404,
                message: "Location not found"
            })
        }
        res.status(200).json({
            success: true,
            status: 200,
            message: "Location retrieved successfully",
            data: location
        })
    } catch (error) {
        console.log(error);
        
        res.status(500).json({
            success: false,
            status: 500,
            message: "Error retrieving location",
            error: error.message
        })
    }
}

const updateLocation = async (req, res) => {
    //const { message, success } = verifyToken(req, 'getOrders'); //Verificamos el token
    const { id } = req.params;
    if (!req.body || Object.keys(req.body).length === 0) {
        return res.status(400).json({
            success: false,
            status: 400,
            message: "Request body is required"
        })
    }
    let { altitude, latitude, static, address, city, department } = req.body;
    try {
        const location = await prisma.location.update({
            where: {
                id: parseInt(id)
            },
            data: {
                altitude,
                latitude,
                static,
                address,
                city,
                department
            }
        });
        res.status(200).json({
            success: true,
            status: 200,
            message: "Location updated successfully",
            data: location
        })
    } catch (error) {
        console.log(error);
        
        res.status(500).json({
            success: false,
            status: 500,
            message: "Error updating location",
            error: error.message
        })
    }
}

const deleteLocation = async (req, res) => {
    //const { message, success } = verifyToken(req, 'getOrders'); //Verificamos el token
    const { id } = req.params;
    try {
        const location = await prisma.location.delete({
            where: {
                id: parseInt(id)
            }
        });
        res.status(200).json({
            success: true,
            status: 200,
            message: "Location deleted successfully",
            data: location
        })
    } catch (error) {
        console.log(error);
        
        res.status(500).json({
            success: false,
            status: 500,
            message: "Error deleting location",
            error: error.message
        })
    }
}

module.exports = {
    createLocation,
    getLocations,
    getLocationById,
    updateLocation,
    deleteLocation
};