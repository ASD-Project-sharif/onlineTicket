const errorHandler = (err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({error: 'server failed. will be up ASAP!!'});
};

module.exports = errorHandler;