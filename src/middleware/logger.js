const logger = (req, res, next) => {
    const currentTime = new Date().toISOString();
    const method = req.method;
    const url = req.originalUrl;
    const ip = req.ip.replace("::ffff:", "");

    console.log(`[DEBUG] [${currentTime}] [${method}] [${url}] from [${ip}]`);
    next();
};

module.exports = logger;
