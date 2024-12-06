import { Request, Response } from "express";
import Item from "../models/Items";
import dotenv from"dotenv";
import cloudinary from "cloudinary";



// Load environment variables
dotenv.config();

// Cloudinary configuration
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
const itemController = {
  create: async (req: Request, res: Response) => {
    try {
      const {
        name,
        price,
        description,
        category,
        stock,
        isActive,
        variants,
        addons,
        image,
      } = req.body;

      if (!name || !price || stock === undefined || !image) {
        return res.status(400).json({ message: "Missing required item data item" });
      }

      // Upload image to Cloudinary
      let uploadedImageUrl = image;

      // Check if image is a base64 string and upload to Cloudinary
      if (image.startsWith("data:image")) {
        const uploadedResponse = await cloudinary.v2.uploader.upload(image, { folder: "menu_items" });
        uploadedImageUrl = uploadedResponse.secure_url;
      }

      const newItem = new Item({
        name,
        price,
        description,
        category,
        stock,
        isActive,
        variants,
        addons,
        image: uploadedImageUrl, // Use Cloudinary URL
      });

      await newItem.save();
      return res.status(201).json(newItem);
    } catch (err) {
      console.error(err);
      return res
        .status(500)
        .json({ message: "Internal Server Error item", error: err.message });
    }
  },

  update: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const updateData = req.body;

      const item = await Item.findById(id).exec();
      if (!item) {
        return res.status(404).json({ message: "Item not found" });
      }

      // If new image is uploaded, handle Cloudinary upload
      if (updateData.image && updateData.image.startsWith("data:image")) {
        const uploadedResponse = await cloudinary.v2.uploader.upload(updateData.image, {
          folder: "menu_items",
        });
        updateData.image = uploadedResponse.secure_url; // Update the image field with Cloudinary URL
      }

      const updatedItem = await Item.findByIdAndUpdate(id, updateData, {
        new: true,
      }).exec();
      return res.status(200).json(updatedItem);
    } catch (err) {
      console.error(err);
      return res
        .status(500)
        .json({ message: "Internal Server Error", error: err.message });
    }
  },

  delete: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;

      const item = await Item.findById(id).exec();
      if (!item) {
        return res.status(404).json({ message: "Item not found" });
      }
      // Delete image from Cloudinary
      if (item.image) {
        const publicId = item.image.split("/").pop()?.split(".")[0]; // Get public_id from Cloudinary URL
        await cloudinary.v2.uploader.destroy(publicId); // Delete image from Cloudinary
      }

      await Item.findByIdAndDelete(id).exec();
      return res.status(200).json({ message: "Item deleted successfully" });
    } catch (err) {
      console.error(err);
      return res
        .status(500)
        .json({ message: "Internal Server Error", error: err.message });
    }
  },

  getItem: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;

      const item = await Item.findById(id).exec();
      if (!item) {
        return res.status(404).json({ message: "Item not found" });
      }

      return res.status(200).json(item);
    } catch (err) {
      console.error(err);
      return res
        .status(500)
        .json({ message: "Internal Server Error", error: err.message });
    }
  },

  getAllItems: async (req: Request, res: Response) => {
    try {
      const items = await Item.find().exec();
      return res.status(200).json(items);
    } catch (err) {
      console.error(err);
      return res
        .status(500)
        .json({ message: "Internal Server Error", error: err.message });
    }
  },

  decreaseStock: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { quantity } = req.body;

      const item = await Item.findById(id).exec();
      if (!item) {
        return res.status(404).json({ message: "Item not found" });
      }

      try {
        await item.decreaseStock(quantity);
        return res
          .status(200)
          .json({ message: "Stock decreased successfully", item });
      } catch (err) {
        return res.status(400).json({ message: err.message });
      }
    } catch (err) {
      console.error(err);
      return res
        .status(500)
        .json({ message: "Internal Server Error", error: err.message });
    }
  },

  findActiveItems: async (req: Request, res: Response) => {
    try {
      const items = await Item.find({ isActive: true }).exec();
      return res.status(200).json(items);
    } catch (err) {
      console.error(err);
      return res
        .status(500)
        .json({ message: "Internal Server Error", error: err.message });
    }
  },
};

export default itemController;
