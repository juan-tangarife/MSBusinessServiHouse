const testClients =  (req, res) => {
    try {
        res.status(200).json({
            message: 'Obteniendo Clientes'
        });
    } catch (error) {
        console.log("Error fetching: ", error);
        res.status(500).json({
            message: "Failed to fetch",
            error: error.message
        });
    }
}
module.exports = {
    testClients
};
