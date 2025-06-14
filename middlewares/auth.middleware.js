import jwt from "jsonwebtoken";
import User from "../models/User.model.js";

export const protect = async (req, res, next) => {
  try {
    // 1. Get token from cookies
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({
        status: "fail",
        message: "You are not logged in! Please log in to get access.",
      });
    }

    // 2. Verify token
    const decoded = jwt.verify(token, process.env.AUTH_SECRET);

    console.log("Decoded token:", decoded);

    // 3. Check if user still exists ( optional but recommended ) please remove if you feel it is not needed
    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
      return res.status(401).json({
        status: "fail",
        message: "The user belonging to this token no longer exists.",
      });
    }

    // 4. Grant access to protected route
    req.user = currentUser;
    next();
  } catch (err) {
    return res.status(401).json({
      status: "fail",
      message: "Invalid token or session expired. Please log in again.",
    });
  }
};

// advance use case for restricting access to certain roles
// needed for managers and contractors

// export const restrictTo = (...roles) => {
//   return (req, res, next) => {
//     if (!roles.includes(req.user.role)) {
//       return res.status(403).json({
//         status: "fail",
//         message: "You do not have permission to perform this action",
//       });
//     }
//     next();
//   };
// };
