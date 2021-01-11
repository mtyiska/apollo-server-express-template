import { SECRET } from "../config";
import { verify } from "jsonwebtoken";
import { User } from "../models";

export const AuthMiddleware = async (req, res, next) => {
  const authHeaders = req.get("Authorization");
  // Check if Header is available
  // If available extract and check
  if (!authHeaders) {
    req.isAuth = false;
    return next();
  }

  const token = authHeaders.split(" ")[1];
  if (!token || token === "") {
    req.isAuth = false;
    return next();
  }

  // // Decode token using verify
  let decodedToken;
  try {
    decodedToken = verify(token, SECRET);
  } catch (err) {
    req.isAuth = false;
    return next();
  }

  // // If not decoded set isAuth to false
  if (!decodedToken) {
    req.isAuth = false;
    return next();
  }

  // // Find user from Db
  let authUser;
  try {
    authUser = await User.findById(decodedToken.id);
  } catch (error) {
    req.isAuth = false;
    return next();
  }
  if (!authUser) {
    req.isAuth = false;
    return next();
  }

  // If above success set authUser
  req.userContext = authUser;
  req.isAuth = true;
  return next();
};
