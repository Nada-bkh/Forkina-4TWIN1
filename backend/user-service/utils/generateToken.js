import jwt from "jsonwebtoken";
import {jwtConfig} from "../config/authConfig.js";

export const generateToken = (user) => {
    return jwt.sign(
        { id: user.idUser, role: user.role },
        jwtConfig.jwtSecret,
        { expiresIn: jwtConfig.jwtExpiration }
    );
};
