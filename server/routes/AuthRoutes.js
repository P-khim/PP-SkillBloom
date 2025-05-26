import { Router } from "express";
import {
  getUserInfo,
  getUserInfoById,
  login,
  setUserImage,
  setUserInfo,
  signup,
} from "../controllers/AuthControllers.js";
import { verifyToken } from "../middlewares/AuthMiddleware.js";
import multer from "multer";

const authRoutes = Router();
const upload = multer({ dest: "uploads/profiles/" });

authRoutes.post("/signup", signup);
authRoutes.post("/login", login);
authRoutes.post("/get-user-info", verifyToken, getUserInfo);
authRoutes.post("/set-user-info", verifyToken, setUserInfo);
authRoutes.get("/get-user-info/:id",getUserInfoById);

authRoutes.post(
  "/set-user-image",
  verifyToken,
  upload.single("images"),
  setUserImage
);

export default authRoutes;
