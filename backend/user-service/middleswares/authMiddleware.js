import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ message: 'Authorization header is missing' });
    }

    if (!authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Invalid token format. Must be Bearer token' });
    }

    const token = authHeader.split(' ')[1];
    console.log(token);
    if (!token) {
      return res.status(401).json({ message: 'Token is missing' });
    }
    
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    if (!decoded.id) {
      return res.status(401).json({ message: 'Invalid token structure - missing user ID' });
    }

    // Add user info to request
    req.user = {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role
    };

    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token has expired' });
    }
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Invalid token' });
    }
    return res.status(401).json({ message: 'Authentication failed' });
  }
};

export default authMiddleware;
