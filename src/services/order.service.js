const generateApiToken = require("../middlewares/tokenGenerate.js");
class OrderService{
    sendLowStockAlertEMail = async (email, name, product, storage, amount, min_amount) => {
        console.log(`Parameters: ${email}, ${name}, ${product}, ${storage}, ${amount}, ${min_amount}`);
        const msNotificationURL = process.env.GATEWAY_URL + "/api/notification/email/LowStockAlert";
        const token = generateApiToken();
        const data = {
            email: email,
            name: name,
            product: product,
            storage: storage,
            amount: amount,
            min_amount: min_amount
        };
        const headers = {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        };
        const response = await fetch(msNotificationURL, {
            method: "POST",
            headers: headers,
            body: JSON.stringify(data)
        });
        if (!response.ok) {
            console.error("Error sending email:", response.statusText);
        } else {
            console.log("Email sent successfully");
        }
    }

    sendLowStockAlertSMS = async (phone, name, product, storage, amount, min_amount) => {
        console.log(`Parameters: ${phone}, ${name}, ${product}, ${storage}, ${amount}, ${min_amount}`);
        const msNotificationURL = process.env.GATEWAY_URL + "/api/notification/message/LowStockAlert";
        const token = generateApiToken();
        const data = {
            phone: phone,
            name: name,
            product: product,
            storage: storage,
            amount: amount,
            min_amount: min_amount
        };
        const headers = {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        };
        const response = await fetch(msNotificationURL, {
            method: "POST",
            headers: headers,
            body: JSON.stringify(data)
        });
        if (!response.ok) {
            console.error("Error sending SMS:", response.statusText);
        } else {
            console.log("SMS sent successfully");
        }
    }

}


module.exports = {
    OrderService: new OrderService()
};