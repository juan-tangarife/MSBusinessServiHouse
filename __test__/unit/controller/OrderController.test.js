jest.mock("dotenv", () => ({
    config: jest.fn(),
}));

// Creamos mocks para las funciones de Prisma
const mockOrderCreate = jest.fn();
const mockStockTransactionCreate = jest.fn();
const mockOrderFindFirst = jest.fn();
const mockStockFindFirst = jest.fn();
const mockUpsert = jest.fn();
const mockUpdate = jest.fn();

// Mock de PrismaClient
jest.mock("@prisma/client", () => ({
    PrismaClient: jest.fn().mockImplementation(() => ({
        order: {
            findFirst: mockOrderFindFirst,
            create: mockOrderCreate,
        },
        location: {
            upsert: mockUpsert,
        },
        stock: {
            findFirst: mockStockFindFirst,
            update: mockUpdate,
        },
        stockTransaction: {
            create: mockStockTransactionCreate,
        },
        StockTransaction: {
            create: mockStockTransactionCreate,
        },
    })),
}));

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const { createOrder } = require("../../../src/controller/orderController");
const orderRequest = require("../../../src/models/orderRequest");

describe("Create Order Controller", () => {
    let req, res;

    beforeEach(() => {
        jest.clearAllMocks(); // Limpiar mocks antes de cada prueba
        req = {
            body: {}
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        jest.spyOn(Math, 'random').mockReturnValue(0.123456); // Mock de Math.random para obtener un número predecible
    });

    test("should return 400 if request body is empty", async () => {
        req.body = {};
        await createOrder(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            success: false,
            status: 400,
            message: "Request body is required",
        });
    });

    test("should return 400 if model validation fails", async () => {
        req.body = { address: "123 Main St" }; // Missing required fields
        orderRequest.validate = jest.fn().mockReturnValue("Validation error");

        await createOrder(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            success: false,
            status: 400,
            message: "Validation error",
        });
    });

    test("should return 400 if location not created", async () => {
        req.body = { 
            address: "123 Main St", 
            city: "City", 
            department: "Dept", 
            altitude: 1, 
            latitude: 1,
            products: [],
            restock: false
        };
        orderRequest.validate = jest.fn().mockReturnValue(null) ; //Simulamos que la validación pasa
        mockUpsert.mockResolvedValue(null); //Simulamos que la ubicación no se crea
        await createOrder(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            success: false,
            status: 400,
            message: "Location not created",
        });
    });

    test("should return 400 if order not created", async () => {
        req.body = { 
            address: "123 Main St", 
            city: "City", 
            department: "Dept", 
            altitude: 1, 
            latitude: 1,
            products: [],
            restock: false
        };
        orderRequest.validate = jest.fn().mockReturnValue(null) ; //Simulamos que la validación pasa
        mockUpsert.mockResolvedValue({}); //Simulamos que la ubicación se crea
        mockOrderCreate.mockResolvedValue(null); //Simulamos que la orden no se crea
        await createOrder(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            success: false,
            status: 400,
            message: "Order not created",
        });
    });

    test("should create order and return 201 if order does not exist", async () => {
        req.body = { 
            address: "123 Main St", 
            city: "City", 
            department: "Dept", 
            altitude: 1, 
            latitude: 1,
            products: [
                { product_id: 1, storage_id: 1 },
                { product_id: 2, storage_id: 2 }
            ],
            restock: false
        };
        orderRequest.validate = jest.fn().mockReturnValue(null) ; //Simulamos que la validación pasa
        mockUpsert.mockResolvedValue({}); //Simulamos que la ubicación se crea
        mockStockFindFirst.mockResolvedValue({}); //Simulamos que el stock existe
        mockUpdate.mockResolvedValue({}); //Simulamos que el stock se actualiza
        mockStockTransactionCreate.mockResolvedValue({}); //Simulamos que la transacción de stock se crea
        mockOrderCreate.mockResolvedValue({ id: 1 }); //Simulamos que la orden se crea
        await createOrder(req, res);

        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith({
            success: true,
            status: 201,
            message: "Order created successfully",
            order_number: "123456" // Este es el valor esperado por el mock de Math.random
        });
    });
});
