import { Request, Response } from "express";
import Adon from "../models/adon";

const adonController = {
  // Create a new addon
  createAdon: async (req: Request, res: Response) => {
    try {
      const { name, price, categories } = req.body;
      const newAdon = new Adon({ name, price, categories });
      await newAdon.save();
      return res.status(201).json(newAdon);
    } catch (error) {
      console.error("Error creating addon:", error);
      return res
        .status(500)
        .json({ message: "Error creating addon", error: error.message });
    }
  },

  // Get all addons
  getAllAdons: async (req: Request, res: Response) => {
    try {
      const adons = await Adon.find();
      return res.status(200).json(adons);
    } catch (error) {
      console.error("Error fetching addons:", error);
      return res
        .status(500)
        .json({ message: "Error fetching addons", error: error.message });
    }
  },

  // Get a single addon by ID
  getAdonById: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const adon = await Adon.findById(id);
      if (!adon) {
        return res.status(404).json({ message: "Addon not found" });
      }
      return res.status(200).json(adon);
    } catch (error) {
      console.error("Error fetching addon:", error);
      return res
        .status(500)
        .json({ message: "Error fetching addon", error: error.message });
    }
  },

  // Update an addon by ID
  updateAdon: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { name, price, categories } = req.body;
      const updatedAdon = await Adon.findByIdAndUpdate(
        id,
        { name, price, categories },
        { new: true }
      );
      if (!updatedAdon) {
        return res.status(404).json({ message: "Addon not found" });
      }
      return res.status(200).json(updatedAdon);
    } catch (error) {
      console.error("Error updating addon:", error);
      return res
        .status(500)
        .json({ message: "Error updating addon", error: error.message });
    }
  },

  // Delete an addon by ID
  deleteAdon: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const deletedAdon = await Adon.findByIdAndDelete(id);
      if (!deletedAdon) {
        return res.status(404).json({ message: "Addon not found" });
      }
      return res.status(200).json({ message: "Addon deleted successfully" });
    } catch (error) {
      console.error("Error deleting addon:", error);
      return res
        .status(500)
        .json({ message: "Error deleting addon", error: error.message });
    }
  },
};

export default adonController;
