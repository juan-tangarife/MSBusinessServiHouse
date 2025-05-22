const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getAllStockTransactions = async (req, res) => {
    try {
        const stockTransactions = await prisma.StockTransaction.findMany({
            include: {
                Order: true,
                Stock: true
            }
        });
        res.status(200).json({
            success: true,
            status: 200,
            message: "Stock transactions retrieved successfully",
            data: stockTransactions
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            status: 500,
            message: "Error retrieving stock transactions",
            error: error.message
        });
    }
};

module.exports = { getAllStockTransactions };