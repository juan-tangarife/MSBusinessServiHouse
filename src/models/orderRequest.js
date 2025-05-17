class orderRequest {
    constructor(address, city, department, altitude, latitude, products, restock) {
        this.address = address;
        this.city = city;
        this.department = department;
        this.altitude = altitude;
        this.latitude = latitude;
        this.products = products;
        this.restock = restock;
    }
  
    static validate(data) {
        const {address, city, department, altitude, latitude, products, restock} = data;
        const errors = [];
  
        if (!address) {
            errors.push("Address is required");
        }
        if (!city) {
            errors.push("City is required");
        }
        if (!department) {
            errors.push("Department is required");
        }
        if (!altitude) {
            errors.push("Altitude is required");
        }
        if (!latitude) {
            errors.push("Latitude is required");
        }
        if (!products || products.length === 0) {
            errors.push("Products are required");
        } else {
            products.forEach((product, index) => {
                if (!product.product_id) {
                    errors.push(`Product ID is required for product ${index + 1}`);
                }
                if (!product.amount) {
                    errors.push(`Amount is required for product ${index + 1}`);
                }
                if (!product.storage_id) {
                    errors.push(`Storage ID is required for product ${index + 1}`);
                }   
            });
        }
        if (restock === undefined) {
            errors.push("Restock is required");
        } else if (typeof restock !== "boolean") {
            errors.push("Restock must be a boolean");
        }
        if (errors.length > 0) {
            return errors;
        }
    }
  }
  
  module.exports = orderRequest;