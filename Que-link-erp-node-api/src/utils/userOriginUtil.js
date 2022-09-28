const getIP = (req) => {
    let ip = (req.headers['x-forwarded-for'] || '').split(',').pop().trim() ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.connection.socket.remoteAddress;
    return ip;
};

const getAgent = (req) => {
    let agent = req.headers["user-agent"]
    return agent;
};

module.exports = {
    getIP,
    getAgent
};
