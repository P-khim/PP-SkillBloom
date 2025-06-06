import { PrismaClient } from "@prisma/client";

import { existsSync, renameSync, unlinkSync } from "fs";

export const addGig = async (req, res, next) => {
  try {
    if (req.files) {
      const fileKeys = Object.keys(req.files);
      const fileNames = [];
      fileKeys.forEach((file) => {
        const date = Date.now();
        renameSync(
          req.files[file].path,
          "uploads/" + date + req.files[file].originalname
        );
        fileNames.push(date + req.files[file].originalname);
      });
      if (req.query) {
        const {
          title,
          description,
          category,
          features,
          price,
          revisions,
          time,
          shortDesc,
        } = req.query;
        const prisma = new PrismaClient();

        await prisma.gigs.create({
          data: {
            title,
            description,
            deliveryTime: parseInt(time),
            category,
            features,
            price: parseInt(price),
            shortDesc,
            revisions: parseInt(revisions),
            createdBy: { connect: { id: req.userId } },
            images: fileNames,
          },
        });

        return res.status(201).send("Successfully created the gig.");
      }
    }
    return res.status(400).send("All properties should be required.");
  } catch (err) {
    console.log(err);
    return res.status(500).send("Internal Server Error");
  }
};

export const getUserAuthGigs = async (req, res, next) => {
  try {
    if (req.userId) {
      const prisma = new PrismaClient();
      const user = await prisma.user.findUnique({
        where: { id: req.userId },
        include: { gigs: true },
      });
      return res.status(200).json({ gigs: user?.gigs ?? [] });
    }
    return res.status(400).send("UserId should be required.");
  } catch (err) {
    console.log(err);
    return res.status(500).send("Internal Server Error");
  }
};

export const getGigData = async (req, res, next) => {
  try {
    if (req.params.gigId) {
      const prisma = new PrismaClient();
      const gig = await prisma.gigs.findFirst({
        where: { 
          id: parseInt(req.params.gigId),
          isApproved: true,
        },
        include: {
          reviews: {
            include: {
              reviewer: true,
            },
          },
          createdBy: true,
        },
      });

      const userWithGigs = await prisma.user.findUnique({
        where: { id: gig?.createdBy.id },
        include: {
          gigs: {
            include: { reviews: true },
          },
        },
      });

      const totalReviews = userWithGigs.gigs.reduce(
        (acc, gig) => acc + gig.reviews.length,
        0
      );

      const averageRating = (
        userWithGigs.gigs.reduce(
          (acc, gig) =>
            acc + gig.reviews.reduce((sum, review) => sum + review.rating, 0),
          0
        ) / totalReviews
      ).toFixed(1);

      return res
        .status(200)
        .json({ gig: { ...gig, totalReviews, averageRating } });
    }
    return res.status(400).send("GigId should be required.");
  } catch (err) {
    console.log(err);
    return res.status(500).send("Internal Server Error");
  }
};

export const editGig = async (req, res, next) => {
  try {
    if (req.files) {
      const fileKeys = Object.keys(req.files);
      const fileNames = [];
      fileKeys.forEach((file) => {
        const date = Date.now();
        renameSync(
          req.files[file].path,
          "uploads/" + date + req.files[file].originalname
        );
        fileNames.push(date + req.files[file].originalname);
      });
      if (req.query) {
        const {
          title,
          description,
          category,
          features,
          price,
          revisions,
          time,
          shortDesc,
        } = req.query;
        const prisma = new PrismaClient();
        const oldData = await prisma.gigs.findUnique({
          where: { id: parseInt(req.params.gigId) },
        });
        await prisma.gigs.update({
          where: { id: parseInt(req.params.gigId) },
          data: {
            title,
            description,
            deliveryTime: parseInt(time),
            category,
            features,
            price: parseInt(price),
            shortDesc,
            revisions: parseInt(revisions),
            createdBy: { connect: { id: parseInt(req.userId) } },
            images: fileNames,
          },
        });
        oldData?.images.forEach((image) => {
          if (existsSync(`uploads/${image}`)) unlinkSync(`uploads/${image}`);
        });

        return res.status(201).send("Successfully Eited the gig.");
      }
    }
    return res.status(400).send("All properties should be required.");
  } catch (err) {
    console.log(err);
    return res.status(500).send("Internal Server Error");
  }
};

export const deleteGig = async (req, res, next) => {
  try {
    const { gigId } = req.params;
    if (!gigId) return res.status(400).send("Gig ID is required");

    const prisma = new PrismaClient();

    const gig = await prisma.gigs.findUnique({
      where: { id: parseInt(gigId) },
    });

    if (!gig) return res.status(404).send("Gig not found");

    // Only mark for deletion (soft delete request)
    const updatedGig = await prisma.gigs.update({
      where: { id: parseInt(gigId) },
      data: {
        isDeletePending: true,
        deleteStatus: "requested", // enum: none, requested, deleted
      },
    });

    return res.status(200).json({
      message: "Gig deletion request submitted",
      gig: updatedGig,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).send("Internal Server Error");
  }
};



export const searchGigs = async (req, res, next) => {
  try {
    if (req.query.searchTerm || req.query.category) {
      const prisma = new PrismaClient();
      const gigs = await prisma.gigs.findMany(
        createSearchQuery(req.query.searchTerm, req.query.category)
      );
      return res.status(200).json({ gigs });
    }
    return res.status(400).send("Search Term or Category is required.");
  } catch (err) {
    console.log(err);
    return res.status(500).send("Internal Server Error");
  }
};

const createSearchQuery = (searchTerm, category) => {
  const query = {
    where: {
      AND: [
        { isApproved: true},
        { approvalStatus: "approved"},
      ],
      OR: [],
    },
    include: {
      reviews: {
        include: {
          reviewer: true,
        },
      },
      createdBy: true,
    },
  };
  if (searchTerm) {
    query.where.OR.push({
      title: { contains: searchTerm, mode: "insensitive" },
    });
  }
  if (category) {
    query.where.OR.push({
      category: { contains: category, mode: "insensitive" },
    });
  }
  return query;
};

const checkOrder = async (userId, gigId) => {
  try {
    const prisma = new PrismaClient();
    const hasUserOrderedGig = await prisma.orders.findFirst({
      where: {
        buyerId: parseInt(userId),
        gigId: parseInt(gigId),
        isCompleted: true,
      },
    });
    return hasUserOrderedGig;
  } catch (err) {
    console.log(err);
  }
};

export const checkGigOrder = async (req, res, next) => {
  try {
    if (req.userId && req.params.gigId) {
      const hasUserOrderedGig = await checkOrder(req.userId, req.params.gigId);
      return res
        .status(200)
        .json({ hasUserOrderedGig: hasUserOrderedGig ? true : false });
    }
    return res.status(400).send("userId and gigId is required.");
  } catch (err) {
    console.log(err);
    return res.status(500).send("Internal Server Error");
  }
};

export const addReview = async (req, res, next) => {
  try {
    if (req.userId && req.params.gigId) {
      if (await checkOrder(req.userId, req.params.gigId)) {
        if (req.body.reviewText && req.body.rating) {
          const prisma = new PrismaClient();
          const newReview = await prisma.reviews.create({
            data: {
              rating: req.body.rating,
              reviewText: req.body.reviewText,
              reviewer: { connect: { id: parseInt(req?.userId) } },
              gig: { connect: { id: parseInt(req.params.gigId) } },
            },
            include: {
              reviewer: true,
            },
          });
          return res.status(201).json({ newReview });
        }
        return res.status(400).send("ReviewText and Rating are required.");
      }
      return res
        .status(400)
        .send("You need to purchase the gig in order to add review.");
    }
    return res.status(400).send("userId and gigId is required.");
  } catch (err) {
    console.log(err);
    return res.status(500).send("Internal Server Error");
  }
};

export const getUnapprovedGigs = async (req, res) => {
  try {
    const prisma = new PrismaClient();
    const unapprovedGigs = await prisma.gigs.findMany({
      where: {
        isApproved: false, 
        NOT: {
          approvalStatus: "rejected",
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        title: true,
        createdAt: true,
        approvalStatus: true,
      },
    });
    return res.status(200).json({ gigs: unapprovedGigs });
  } catch (err) {
    console.error("Error fetching unapproved gigs:", err);
    return res.status(500).send("Internal server Error");
  }
};

export const approveGig = async (req, res) => {
  const prisma = new PrismaClient();
  const { gigId } = req.params;

  try {
    const id = Number(gigId);

    const gig = await prisma.gigs.findUnique({ where: { id } });

    if (!gig) {
      return res.status(404).json({ message: "Gig not found" });
    }

    const updated = await prisma.gigs.update({
      where: { id },
      data: {
        isApproved: true,
        approvalStatus: "approved",
      },
    });

    return res.status(200).json({ message: "Gig approved", gig: updated });
  } catch (error) {
    console.error("Error approving gig:", error);
    return res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};


export const rejectGig = async (req, res) => {
  const prisma = new PrismaClient();
  const { gigId } = req.params;

  try {
    const id = Number(gigId);

    const gig = await prisma.gigs.findUnique({ where: { id } });
    if (!gig) {
      return res.status(404).json({ message: "Gig not found" });
    }

    const updated = await prisma.gigs.update({
      where: { id },
      data: {
        isApproved: false,
        approvalStatus: "rejected",
      },
    });

    return res.status(200).json({ message: "Gig rejected", gig: updated });
  } catch (error) {
    console.error("Error rejecting gig:", error);
    return res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};

export const getUnapprovedGigsDelete = async (req, res) => {
  try {
    const prisma = new PrismaClient();
    const unapprovedGigsDelete = await prisma.gigs.findMany({
      where: {
        isDeletePending: true, 
      },
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        title: true,
        createdAt: true,
        deleteStatus: true,
      },
    });
    return res.status(200).json({ gigs: unapprovedGigsDelete });
  } catch (err) {
    console.error("Error fetching unapproved gigs:", err);
    return res.status(500).send("Internal server Error");
  }
};

export const approveGigDelete = async (req, res) => {
  const prisma = new PrismaClient();
  const { gigId } = req.params;

  try {
    const id = Number(gigId);
    const gig = await prisma.gigs.findUnique({ where: { id } });

    if (!gig) {
      return res.status(404).json({ message: "Gig not found" });
    }

    if (gig.isDeletePending) {
      // Delete images
      gig.images?.forEach((image) => {
        const path = `uploads/${image}`;
        if (existsSync(path)) unlinkSync(path);
      });

      // Delete gig
      await prisma.gigs.delete({ where: { id } });

      return res.status(200).json({ message: "Gig deleted (delete approved)" });
    }

    // Approve gig normally
    const updated = await prisma.gigs.update({
      where: { id },
      data: {
        isApproved: true,
        approvalStatus: "approved",
      },
    });

    return res.status(200).json({ message: "Gig approved", gig: updated });
  } catch (error) {
    console.error("Error approving gig:", error);
    return res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};

export const rejectGigDelete = async (req, res) => {
  const prisma = new PrismaClient();
  const { gigId } = req.params;

  try {
    const id = Number(gigId);
    const gig = await prisma.gigs.findUnique({ where: { id } });

    if (!gig) {
      return res.status(404).json({ message: "Gig not found" });
    }

    if (gig.isDeletePending) {
      const updated = await prisma.gigs.update({
        where: { id },
        data: {
          isDeletePending: false,
          deleteStatus: "none", // reset status
        },
      });

      return res.status(200).json({ message: "Gig deletion rejected", gig: updated });
    }

    // Normal rejection
    const updated = await prisma.gigs.update({
      where: { id },
      data: {
        isApproved: false,
        approvalStatus: "rejected",
      },
    });

    return res.status(200).json({ message: "Gig rejected", gig: updated });
  } catch (error) {
    console.error("Error rejecting gig:", error);
    return res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};
