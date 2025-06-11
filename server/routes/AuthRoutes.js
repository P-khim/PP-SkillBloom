import { Router } from "express";
import {
  getAllUsers,
  getUserInfo,
  getUserInfoByUserName,
  login,
  qrUpload,
  setUserImage,
  setUserInfo,
  signup,
  signupAdmin,
} from "../controllers/AuthControllers.js";
import { verifyToken } from "../middlewares/AuthMiddleware.js";
import multer from "multer";

const authRoutes = Router();
const upload = multer({ dest: "uploads/profiles/" });

authRoutes.post("/signup", signup);
authRoutes.post("/login", login);
authRoutes.post("/get-user-info", verifyToken, getUserInfo);
authRoutes.post("/set-user-info", verifyToken, setUserInfo);
authRoutes.get("/get-user-info/:username",getUserInfoByUserName);
authRoutes.get("/get-all-users",getAllUsers);

authRoutes.post(
  "/set-user-image",
  verifyToken,
  upload.single("images"),
  setUserImage
);

authRoutes.post(
  "/qr-upload",
  verifyToken,
  upload.single("qrImage"),
  qrUpload
);

authRoutes.post("/signup-admin", signupAdmin);

export default authRoutes;
