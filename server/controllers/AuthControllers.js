import { Prisma, PrismaClient } from "@prisma/client";
import { genSalt, hash, compare } from "bcrypt";
import jwt from "jsonwebtoken";
import { renameSync, existsSync, mkdirSync } from "fs";
import { create } from "domain";

const generatePassword = async (password) => {
  const salt = await genSalt();
  return await hash(password, salt);
};

const maxAge = 3 * 24 * 60 * 60;
const createToken = (email, userId) => {
  // @ts-ignore
  return jwt.sign({ email, userId }, process.env.JWT_KEY, {
    expiresIn: maxAge,
  });
};

export const signup = async (req, res, next) => {
  try {
    const prisma = new PrismaClient();
    const { email, password } = req.body;
    if (email && password) {
      const user = await prisma.user.create({
        data: {
          email,
          password: await generatePassword(password),
        },
      });
      return res.status(201).json({
        user: { id: user?.id, email: user?.email },
        jwt: createToken(email, user.id),
      });
    } else {
      return res.status(400).send("Email and Password Required");
    }
  } catch (err) {
    console.log(err);
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      if (err.code === "P2002") {
        return res.status(409).send("Email Already Registered");
      }
    } else {
      return res.status(500).send("Internal Server Error");
    }
    throw err;
  }
};

export const login = async (req, res, next) => {
  try {
    const prisma = new PrismaClient();
    const { email, password } = req.body;
    if (email && password) {
      const user = await prisma.user.findUnique({
        where: {
          email,
        },
      });
      if (!user) {
        return res.status(404).send("User not found");
      }

      const auth = await compare(password, user.password);
      if (!auth) {
        return res.status(401).send("Invalid Password");
      }

      return res.status(200).json({
        user: { id: user?.id, email: user?.email },
        jwt: createToken(email, user.id),
      });
    } else {
      return res.status(400).send("Email and Password Required");
    }
  } catch (err) {
    return res.status(500).send("Internal Server Error");
  }
};

export const getUserInfo = async (req, res, next) => {
  try {
    if (req?.userId) {
      const prisma = new PrismaClient();
      const user = await prisma.user.findUnique({
        where: {
          id: req.userId,
        },
      });
      return res.status(200).json({
        user: {
          id: user?.id,
          email: user?.email,
          image: user?.profileImage,
          username: user?.username,
          fullName: user?.fullName,
          description: user?.description,
          isProfileSet: user?.isProfileInfoSet,
          createdAt : user?.createdAt,
          birthday: user?.birthday,
          city: user?.city,
          country: user?.country,
          facebookLink: user?.facebookLink,
          gender: user?.gender,
          languages: user?.languages,
          professions: user?.professions,
          telegramLink: user?.telegramLink,
          role: user?.role,
        },
      });
    }
  } catch (err) {
    res.status(500).send("Internal Server Occured");
  }
};

export const setUserInfo = async (req, res, next) => {
  try {
    if (req?.userId) {
      const {
        userName,
        fullName,
        description,
        birthday,
        city,
        country,
        facebookLink,
        gender,
        languages,
        professions,
        telegramLink,
      } = req.body;

      // Check required fields
      if (!userName || !fullName || !description) {
        return res
          .status(400)
          .send("Username, Full Name and description should be included.");
      }

      const prisma = new PrismaClient();

      // Check if the username exists and belongs to someone else
      const userWithSameUsername = await prisma.user.findFirst({
        where: {
          username: userName,
          NOT: {
            id: req.userId,
          },
        },
      });

      if (userWithSameUsername) {
        return res.status(200).json({ userNameError: true });
      }

      // Safe to update
      await prisma.user.update({
        where: { id: req.userId },
        data: {
          username: userName,
          fullName,
          description,
          birthday: new Date(birthday) || null,
          city: city || null,
          country: country || "Cambodia",
          facebookLink: facebookLink || null,
          gender: gender || null,
          languages: Array.isArray(languages) ? languages : [],
          professions: Array.isArray(professions) ? professions : [],
          telegramLink: telegramLink || null,
          isProfileInfoSet: true,
        },
      });

      return res.status(200).send("Profile data updated successfully.");
    } else {
      return res.status(401).send("Unauthorized.");
    }
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      if (err.code === "P2002") {
        return res.status(400).json({ userNameError: true });
      }
    }

    console.error("Error updating user profile:", err);
    return res.status(500).send("Internal Server Error");
  }
};


export const setUserImage = async (req, res, next) => {
  try {
    if (req.file) {
      if (req?.userId) {
        const date = Date.now();
        let fileName = "uploads/profiles/" + date + req.file.originalname;
        renameSync(req.file.path, fileName);
        const prisma = new PrismaClient();

        await prisma.user.update({
          where: { id: req.userId },
          data: { profileImage: fileName },
        });
        return res.status(200).json({ img: fileName });
      }
      return res.status(400).send("Cookie Error.");
    }
    return res.status(400).send("Image not inclued.");
  } catch (err) {
    console.log(err);
    res.status(500).send("Internal Server Occured");
  }
};


export const getUserInfoByUserName = async (req, res) => {
  try {
    // const userId = parseInt(req.params.id, 10);
    const username = req.params.username;
    // if (!userId) return res.status(400).send("Invalid user ID");
    if (!username) return res.status(400).send("Invalid username");

    const prisma = new PrismaClient();

    const user = await prisma.user.findUnique({
      // where: { id: userId },
      where: {username: username},
      select: {
        id: true,
        email: true,
        // profileImage: true,
        username: true,
        fullName: true,
        description: true,
        // isProfileInfoSet: true,
        createdAt: true,
        // gender: true,
        // birthday: true,
        // city: true,
        // country: true,
        // languages: true,
        // professions: true,
        // facebookLink: true,
        // telegramLink: true,
      },
    });

    if (!user) return res.status(404).send("User not found");

    return res.status(200).json({
      id: user.id,
      email: user.email,
      imageName: user.profileImage,
      username: user.username,
      fullName: user.fullName,
      description: user.description,
      isProfileSet: user.isProfileInfoSet,
      createdAt: user.createdAt,
      gender: user.gender,
      birthday: user.birthday,
      city: user.city,
      country: user.country,
      languages: user.languages || [],
      professions: user.professions || [],
      facebookLink: user.facebookLink,
      telegramLink: user.telegramLink,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
};

export const getAllUsers = async (req,res) => {
  const prisma = new PrismaClient();
  try{
    // if(req.role != "admin") {
    //   return res.status(403).json({message : "Forbidden"});
    // }
    const users = await prisma.user.findMany({
      select:{
        id: true,
        email: true,
        username: true,
        fullName: true,
        profileImage: true,
        isProfileInfoSet: true,
        createdAt: true,
        city: true,
        role: true,
        country: true,
        gender: true,
        professions: true,
      }, orderBy: {
        createdAt: "desc",
      },
    });
    return res.status(200).json({users});
  } catch (err){
    console.error("Error fetching all users:", err);
    return res.status(500).json({message: "Internal Server Error"});
  }
};

export const qrUpload = async (req, res) => {
  try {
    if (!req.file) return res.status(400).send("QR image not provided.");
    const { orderId } = req.body;
    if (!orderId) return res.status(400).send("Order ID is required.");

    const prisma = new PrismaClient();
    const order = await prisma.orders.findUnique({ where: { id: parseInt(orderId) } });

    if (!order) return res.status(404).send("Order not found.");
    if (order.status !== "COMPLETED")
      return res.status(403).send("QR upload allowed only for completed orders.");

    const destDir = "uploads/qr";
    if (!existsSync(destDir)) {
      mkdirSync(destDir, { recursive: true });
    }

    const filePath = `${destDir}/${Date.now()}_${req.file.originalname}`;
    renameSync(req.file.path, filePath);

    await prisma.orders.update({
      where: { id: parseInt(orderId) },
      data: { qrImage: filePath },
    });

    return res.status(200).json({ message: "QR uploaded", qrImage: filePath });
  } catch (err) {
    console.error("Error uploading QR image:", err);
    return res.status(500).send("Internal Server Error");
  }
};

export const signupAdmin = async (req, res, next) => {
  try {
    const prisma = new PrismaClient();
    const { fullName, email, password, role } = req.body;

    if (email && password && fullName && role) {
      const user = await prisma.user.create({
        data: {
          fullName,
          email,
          password: await generatePassword(password),
          role, // this is the fix
        },
      });

      return res.status(201).json({
        user: { id: user?.id, email: user?.email, role: user?.role, fullName: user?.fullName },
        jwt: createToken(email, user.id),
      });
    } else {
      return res.status(400).send("Full Name, Email, Password and Role are required");
    }
  } catch (err) {
    console.log(err);
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      if (err.code === "P2002") {
        return res.status(409).send("Email Already Registered");
      }
    } else {
      return res.status(500).send("Internal Server Error");
    }
    throw err;
  }
};
