const getCookieValue = (cookieHeader, name) => cookieHeader
    ?.split(";")
    .map((cookie) => cookie.trim().split("="))
    .find(([cookieName]) => cookieName === name)
    ?.slice(1)
    .join("=");

export const createSocketAuthenticator = ({ verifyToken, findUserById }) => async (socket, next) => {
    try {
        const token = getCookieValue(socket.handshake.headers.cookie, "token");
        if (!token) {
            return next(new Error("Unauthorized socket connection"));
        }

        const decoded = verifyToken(token);
        if (!decoded?.userId) {
            return next(new Error("Unauthorized socket connection"));
        }

        const user = await findUserById(decoded.userId);
        if (!user) {
            return next(new Error("Unauthorized socket connection"));
        }

        socket.data.userId = user._id.toString();
        next();
    } catch {
        next(new Error("Unauthorized socket connection"));
    }
};

export const createUserSocketRegistry = () => {
    const userSockets = new Map();

    return {
        add(userId, socketId) {
            const sockets = userSockets.get(userId) || new Set();
            sockets.add(socketId);
            userSockets.set(userId, sockets);
        },
        remove(userId, socketId) {
            const sockets = userSockets.get(userId);
            if (!sockets) return;

            sockets.delete(socketId);
            if (sockets.size === 0) userSockets.delete(userId);
        },
        get(userId) {
            return [...(userSockets.get(userId) || [])];
        },
        users() {
            return [...userSockets.keys()];
        },
    };
};
