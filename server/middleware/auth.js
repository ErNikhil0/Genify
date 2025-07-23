import jwt from 'jsonwebtoken';

const userAuth = (req, res, next) => {
    const token = req.headers.token;
    console.log("Received token", token);

    if (!token) {
        return res.json({ success: false, message: 'Not Authorized, login again' });
    }

    try {
        const tokenDecode = jwt.verify(token, process.env.JWT_SECRET);
        console.log("Decoded Token:", tokenDecode);

        if (tokenDecode.id) {
            req.userId = tokenDecode.id; // ✅ Attach userId to request object
            next();
        } else {
            return res.json({ success: false, message: 'Not Authorized, login again' });
        }
    } catch (error) {
        console.log("JWT Verification Error:", error.message);
        return res.json({ success: false, message: error.message });
    }
};

export default userAuth;
