//not found

const notFound = (req, res, next) => {
    const error = new Error(`Not found: ${req.originalUrl}`);
    res.status(404);
    next(error)
};

//Error handler

const errorHandler = (err, req, res, next) => {
    res.status(401);
    res.json({
        message: err?.message,
        stack: err.stack,
    })
}

module.exports = {errorHandler, notFound}