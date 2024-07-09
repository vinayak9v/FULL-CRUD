import jwt from "jsonwebtoken";

function logError(message) {
  console.error(message);
}

export const errorFn = (err, req, res) => {
  logError(err.message || "Unknown error"); // Log the error
  res.status(err.status || 500).json({
    status: false,
    message: err.message || "Something went wrong. Please try again later.",
  });
};

// Middleware to verify JWT token
export const verifyToken = (req, res, next) => {
  try {
    //`console.log(">>>>>>>>>>>>>>>>>>>>>>", req.file);
    const token = req.headers.authorization.split(" ")[1];
    
    if (!token) {
      return res
        .status(403)
        .send({ auth: false, message: "No token provided." });
    }

    // Verify the token
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return res
          .status(500)
          .send({ auth: false, message: "Failed to authenticate token." });
      }

      // If everything is good, save the decoded token to the request for use in other routes
      req.user_id = decoded.user_id;
       //console.log("=================",req.user_id );

      next();
    });
  } catch (error) {
    errorFn(error, req, res);
  }
  // Get the token from the request header
};
