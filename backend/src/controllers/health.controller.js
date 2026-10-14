export const checkHealth = (req, res) => {
    try {
        res.status(200).json({
            status: 'OK',
            message: 'Server is healthy',
            timestamp: new Date().toISOString(),
        });
    } catch (error) {
        res.status(500).json({
            status: 'Error',
            message: error.message,
        });
    }
};
