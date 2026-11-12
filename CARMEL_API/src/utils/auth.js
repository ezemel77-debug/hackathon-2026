import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

async function hashPassword(password) {
  return bcrypt.hash(password, 10);
}

async function comparePassword(password, hash) {
  return bcrypt.compare(password, hash);
}

function signToken(user) {
  return jwt.sign(
    { id: user.id, rol_id: user.rol_id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "8h" },
  );
}

export { hashPassword, comparePassword, signToken };
