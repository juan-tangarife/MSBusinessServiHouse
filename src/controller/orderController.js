const { PrismaClient } = require("@prisma/client"); //Importamos el cliente de prisma
const prisma = new PrismaClient(); //Creamos una instancia del cliente de prisma
require("dotenv").config(); //Nos permite leer las variables de entorno
const e = require("express");
const orderRequest = require("../models/orderRequest"); //Importamos el modelo de la peticion
const verifyToken = require("../middlewares/auth.js");
const { OrderService } = require("../services/order.service");

const createOrder = async (req, res) => {
  //const { message,success  } = verifyToken(req, 'createOrder'); //Verificamos el token
  if (!req.body || Object.keys(req.body).length === 0) {
    return res.status(400).json({
      success: false,
      status: 400,
      message: "Request body is required",
    });
  }
  let modelErrors = orderRequest.validate(req.body);
  if (modelErrors) {
    return res.status(400).json({
      success: false,
      status: 400,
      message: modelErrors,
    });
  }

  let { address, city, department, altitude, latitude, products, restock, phone, email } =
    req.body;
  const prefix = "ORD";
  const timestamp = Date.now().toString(36); // base36 del timestamp actual
  const randomPart = Array.from({ length: 18 }, () => Math.floor(Math.random() * 36).toString(36)).join('');  let order_number = `${prefix}-${timestamp}-${randomPart}`;
  let delivery_id = await OrderService.getDeliveryToOrder(order_number, latitude, altitude);
  const location = await prisma.location.upsert({
    where: {
      latitude_altitude: {
        latitude: latitude,
        altitude: altitude,
      },
    },
    update: {
      address: address,
      city: city,
      department: department,
      static: true,
    },
    create: {
      address: address,
      city: city,
      department: department,
      altitude: altitude,
      latitude: latitude,
      static: true,
    },
  });
  if (!location) {
    return res.status(400).json({
      success: false,
      status: 400,
      message: "Location not created",
    });
  }
  const order = await prisma.order.create({
    data: {
      order_number: order_number,
      delivery_id: delivery_id,
      final_address_id: location.id,
      email: email,
      phone: phone,
    },
  });
  products.map(async (product) => {
    const stock = await prisma.stock.findFirst({
      where: {
        product_id: product.product_id,
        storage_id: product.storage_id,
      },
    });
    const stockTransaction = await prisma.StockTransaction.create({
      data: {
        order_id: order.id,
        stock_id: stock.id,
        restock: restock,
        amount: product.amount,
      },
    });
    const stockUpdate = await prisma.stock.update({
      where: {
        id: stock.id,
      },
      data: {
        amount: restock
          ? stock.amount + product.amount
          : stock.amount - product.amount,
        dispatcher_id: 2
      },
      include: {
        Dispatcher: true,
        Storage: true,
        Product: true,
      },
    });

    if (stockUpdate.amount <= stockUpdate.min_amount) {
      OrderService.sendLowStockAlertEMail(
        stockUpdate.Dispatcher?.email,
        stockUpdate.Dispatcher?.full_name,
        stockUpdate.Product.name,
        stockUpdate.Storage.name,
        stockUpdate.amount,
        stockUpdate.min_amount
      );

      OrderService.sendLowStockAlertSMS(
        stockUpdate.Dispatcher?.phone,
        stockUpdate.Dispatcher?.full_name,
        stockUpdate.Product.name,
        stockUpdate.Storage.name,
        stockUpdate.amount,
        stockUpdate.min_amount
      );
    }
  });
  if (!order) {
    return res.status(400).json({
      success: false,
      status: 400,
      message: "Order not created",
    });
  }
  // Enviar correo de confirmación de pedido
  OrderService.sendCreateOrderEmail(
    email,
    order_number,
    'Dear'
  );
  res.status(201).json({
    success: true,
    status: 201,
    message: "Order created successfully",
    order_number: order_number,
  });
};

const readOrder = async (req, res) => {
  //const { message, success } = verifyToken(req, 'createOrder'); //Verificamos el token
  try {
    const order = await prisma.order.findUnique({
      where: {
        order_number: req.params.order_number, 
      },
      include: {
      delivery: {
        include: {
        location: true, 
        },
      },
      final_address: true,
      },
    });
    if (!order) {
      return res.status(400).json({
        success: false,
        status: 400,
        message: "Order not found",
      });
    }
    res.status(200).json({
      success: true,
      status: 201,
      message: "Order found successfully",
      order: order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      status: 500,
      message: "Order finding failed",
      error: error.message,
    });
  }
};
const allOrders = async (req, res) => {
  //const { message, success } = verifyToken(req, 'createOrder'); //Verificamos el token
  try {
    const orders = await prisma.order.findMany({
      include: {
        stockTransactions: {
          include: {
            Stock: {
              include: {
                Storage: {
                  include: {
                    location: true
                  }
                }
              }
            }
          }
        },
        delivery: {
          include: {
            location: true
          }
        },
        final_address: true
      }
    }); //Obtenemos todos los pedidos
    const ordersWithLocation = orders.map(order => {
      let location = null;
      if (order.state === "PENDING") {
        // Tomar la location del primer storage relacionado
        location = order.stockTransactions[0]?.Stock?.Storage?.location || null;
      } else if (order.state === "PICKED UP") {
        location = order.delivery?.location || null;
      } else if (order.state === "DELIVERED") {
        location = order.final_address || null;
      }
      const actualOrder = {
        id: order.id,
        order_number: order.order_number,
        delivery: order.delivery.full_name,
        storage: order.stockTransactions[0]?.Stock?.Storage.name,
        state: order.state,
        createdAt: order.createdAt,
        updatedAt: order.updatedAt,
        email: order.email,
        phone: order.phone,
      }
      return {
        order: actualOrder,
        location
      };
    });

    if (!orders) {
      return res.status(400).json({
        success: false,
        status: 400,
        message: "Orders not found",
      });
    }
    res.status(200).json({
      success: true,
      status: 201,
      message: "Orders found successfully",
      orders: ordersWithLocation,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      status: 500,
      message: "Orders finding failed",
      error: error.message,
    });
  }
};
const updateOrder = async (req, res) => {
  //const { message, success } = verifyToken(req, 'createOrder'); //Verificamos el token
  //Obtenemos el order_number de la url
  if (!req.body || Object.keys(req.body).length === 0) {
    return res.status(400).json({
      success: false,
      status: 400,
      message: "Request body is required",
    });
  }
  let modelErrors = orderRequest.validate(req.body);
  if (modelErrors) {
    return res.status(400).json({
      success: false,
      status: 400,
      message: modelErrors,
    });
  }

  let { delivery_id, final_address_id } = req.body;
  try {
    const delivery = await prisma.delivery.findFirst({
      where: {
        id: delivery_id,
      },
    }); order_number = req.params.order_number;
    if (!delivery) {
      return res.status(400).json({
        success: false,
        status: 400,
        message: "Delivery not found",
      });
    }
    const finalAddress = await prisma.location.findFirst({
      where: {
        id: final_address_id,
      },
    });
    if (!finalAddress) {
      return res.status(400).json({
        success: false,
        status: 400,
        message: "Final address not found",
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
        message: "Order not updated or found",
      });
    }
    res.status(200).json({
      success: true,
      status: 201,
      message: "Order updated successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      status: 500,
      message: "Order update failed",
      error: error.message,
    });
  }
};
const deleteOrder = async (req, res) => {
  //const { message, success } = verifyToken(req, 'createOrder'); //Verificamos el token
  order_number = req.params.order_number; //Obtenemos el order_number de la url
  try {
    const order = await prisma.order.delete({
      where: {
        order_number: order_number,
      },
    });
    if (!order) {
      return res.status(400).json({
        success: false,
        status: 400,
        message: "Order not found",
      });
    }
    res.status(200).json({
      success: true,
      status: 201,
      message: "Order deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      status: 500,
      message: "Order deletion failed",
      error: error.message,
    });
  }
};

const getOrdersByDispatcherId = async (req, res) => {
  dispatcher_id = req.params.dispatcher_id;
  try {
    const orders = await prisma.order.findMany({
      where: {
        stockTransactions: {
          some: {
            restock: true,
            Stock: {
              dispatcher_id: parseInt(dispatcher_id),
            },
          },
        },
      },
      include: {
        stockTransactions: {
          include: {
            Stock: {
              include: {
                Storage: {
                  include: {
                    location: true
                  }
                }
              }
            }
          }
        },
        delivery: {
          include: {
            location: true
          }
        },
        final_address: true
      },
    });
    const ordersWithLocation = orders.map(order => {
      let location = null;
      if (order.state === "PENDING") {
        // Tomar la location del primer storage relacionado
        location = order.stockTransactions[0]?.Stock?.Storage?.location || null;
      } else if (order.state === "PICKED UP") {
        location = order.delivery?.location || null;
      } else if (order.state === "DELIVERED") {
        location = order.final_address || null;
      }
      const actualOrder = {
        id: order.id,
        order_number: order.order_number,
        delivery: order.delivery.full_name,
        storage: order.stockTransactions[0]?.Stock?.Storage.name,
        state: order.state,
        createdAt: order.createdAt,
        updatedAt: order.updatedAt,
        email: order.email,
        phone: order.phone,
      }
      return {
        order: actualOrder,
        location
      };
    });


    if (!orders) {
      return res.status(400).json({
        success: false,
        status: 400,
        message: "Orders not found",
      });
    }
    res.status(200).json({
      success: true,
      status: 201,
      message: "Orders found successfully",
      orders: ordersWithLocation,
    });
  }
  catch (error) {
    res.status(500).json({
      success: false,
      status: 500,
      message: "Error",
      error: error.message,
    });
  }
}

const getOrdersByStorageId = async (req, res) => {
  storage_id = req.params.storage_id;
  try {
    const orders = await prisma.order.findMany({
      where: {
        stockTransactions: {
          some: {
            Stock: {
              storage_id: storage_id,
            },
          },
        },
      },
      include: {
        stockTransactions: {
          include: {
            Stock: {
              include: {
                Storage: {
                  include: {
                    location: true
                  }
                }
              }
            }
          }
        },
        delivery: {
          include: {
            location: true
          }
        },
        final_address: true
      },
    });

    const ordersWithLocation = orders.map(order => {
      let location = null;
      if (order.state === "PENDING") {
        // Tomar la location del primer storage relacionado
        location = order.stockTransactions[0]?.Stock?.Storage?.location || null;
      } else if (order.state === "PICKED UP") {
        location = order.delivery?.location || null;
      } else if (order.state === "DELIVERED") {
        location = order.final_address || null;
      }
      const actualOrder = {
        id: order.id,
        order_number: order.order_number,
        delivery: order.delivery.full_name,
        storage: order.stockTransactions[0]?.Stock?.Storage.name,
        state: order.state,
        createdAt: order.createdAt,
        updatedAt: order.updatedAt,
        email: order.email,
        phone: order.phone,
      }
      return {
        order: actualOrder,
        location
      };
    });

    if (!orders) {
      return res.status(400).json({
        success: false,
        status: 400,
        message: "Orders not found",
      });
    }
    res.status(200).json({
      success: true,
      status: 201,
      message: "Orders found successfully",
      orders: ordersWithLocation,
    });
  }
  catch (error) {
    res.status(500).json({
      success: false,
      status: 500,
      message: "Error",
      error: error.message,
    });
  }
}
const getOrderWithDelivery = async (req, res) => {
  const { id } = req.params;
  try {
    const order = await prisma.order.findUnique({
      where: { id: parseInt(id) },
      include: { delivery: true }
    });
    if (!order) {
      return res.status(404).json({
        success: false,
        status: 404,
        message: "Order not found",
      });
    }
    res.status(200).json({
      success: true,
      status: 200,
      message: "Order with delivery retrieved successfully",
      order: order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      status: 500,
      message: "Error retrieving order with delivery",
      error: error.message,
    });
  }
};

const getOrderStorage = async (req, res) => {
  const { id } = req.params; // id de la orden
  try {
    const order = await prisma.order.findUnique({
      where: { id: parseInt(id) },
      include: {
        stockTransactions: {
          include: {
            Stock: {
              include: {
                Storage: true
              }
            }
          }
        }
      }
    });
    if (!order) {
      return res.status(404).json({
        success: false,
        status: 404,
        message: "Order not found"
      });
    }
    // Extraer los storages únicos de los stockTransactions
    const storages = order.stockTransactions
      .map(st => st.Stock?.Storage)
      .filter(storage => storage); // Elimina posibles undefined

    res.status(200).json({
      success: true,
      status: 200,
      message: "Order storages retrieved successfully",
      storages: storages
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      status: 500,
      message: "Error retrieving order storages",
      error: error.message
    });
  }
};

const getOrdersByDeliveryId = async (req, res) => {
  const { delivery_id } = req.params;
  try {
    const orders = await prisma.order.findMany({
      where: {
        delivery_id: parseInt(delivery_id)
      },
      include: {
        stockTransactions: {
          include: {
            Stock: {
              include: {
                Storage: {
                  include: {
                    location: true
                  }
                }
              }
            }
          }
        },
        delivery: {
          include: {
            location: true
          }
        },
        final_address: true
      },
    });
    const ordersWithLocation = orders.map(order => {
      let location = null;
      if (order.state === "PENDING") {
        // Tomar la location del primer storage relacionado
        location = order.stockTransactions[0]?.Stock?.Storage?.location || null;
      } else if (order.state === "PICKED UP") {
        location = order.delivery?.location || null;
      } else if (order.state === "DELIVERED") {
        location = order.final_address || null;
      }
      const actualOrder = {
        id: order.id,
        order_number: order.order_number,
        delivery: order.delivery.full_name,
        storage: order.stockTransactions[0]?.Stock?.Storage.name,
        state: order.state,
        createdAt: order.createdAt,
        updatedAt: order.updatedAt,
        email: order.email,
        phone: order.phone,
      }
      return {
        order: actualOrder,
        location
      };
    });

    if (!orders || orders.length === 0) {
      return res.status(404).json({
        success: false,
        status: 404,
        message: "No orders found for this delivery id"
      });
    }
    res.status(200).json({
      success: true,
      status: 200,
      message: "Orders found successfully",
      orders: ordersWithLocation
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      status: 500,
      message: "Error retrieving orders by delivery id",
      error: error.message
    });
  }
};

const changeOrderState = async (req, res) => {
  const { id } = req.params; 
  const { state } = req.body; 
  try {
    if (!state || !["PENDING", "PICKED UP", "DELIVERED"].includes(state)) {
      return res.status(400).json({
        success: false,
        status: 400,
        message: "Invalid state provided"
      });
    }
    const order = await prisma.order.update({
      where: { id: parseInt(id) },
      data: { state: state }
    });
    if (!order) {
      return res.status(404).json({
        success: false,
        status: 404,
        message: "Order not found"
      });
    }
    if (state === "DELIVERED")
    {
      const delivery = await prisma.delivery.update({
        where: { id: order.delivery_id },
        data: { pending_orders: { decrement: 1 } }
      });
    }
    res.status(200).json({
      success: true,
      status: 200,
      message: "Order state updated successfully",
      order: order
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      status: 500,
      message: "Error updating order state",
      error: error.message
    });
  }
};

module.exports = {
  createOrder,
  readOrder,
  allOrders,
  updateOrder,
  deleteOrder,
  getOrdersByDispatcherId,
  getOrdersByStorageId,
  getOrderWithDelivery,
  getOrderStorage,
  getOrdersByDeliveryId,
  changeOrderState
};
