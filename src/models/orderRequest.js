class orderRequest {
    constructor(order_number, delivery_id, final_address_id) {
        this.order_number = order_number;
        this.delivery_id = delivery_id;
        this.final_address_id = final_address_id;
    }
  
    static validate(data) {
        const { order_number, delivery_id, final_address_id } = data;
        const errors = [];
  
        if (!order_number || order_number.length < 10) {
            errors.push("Order number must be at least 10 characters long.");
        }
  
        if (!delivery_id) {
            errors.push("Delivery ID is required.");
        }
  
        if (!final_address_id) {
            errors.push("Final address ID is required.");
        }
        return errors.length > 0 ? errors : null;
    }
  }
  
  module.exports = orderRequest;