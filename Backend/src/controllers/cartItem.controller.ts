import { Request, Response } from "express";
import CItem from "../models/itemCart";

const cartItemController = {
    create: async (req: Request, res: Response) => {
        try {
            const {
                title,
                productId,
                price,
                variants,
                addons,
                image,
                total,
                quantity,
            } = req.body;
           
            

            if (!title || !price || !image || !total) {
                return res.status(400).json({ message: "Missing required item data cartItem" });
            }

            const newCItem = new CItem({
                title,
                productId,
                price,
                variants,
                addons,
                image,
                total,
                quantity,
            });

            await newCItem.save();
            return res.status(201).json(newCItem);
        } catch (err) {
            console.error(err);
            return res
                .status(500)
                .json({ message: "Internal Server Error cart Item", error: err.message });
        }
    },

    update: async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const updateData = req.body;
            console.log("update",updateData);
            

            const item = await CItem.findById(id).exec();
            if (!item) {
                return res.status(404).json({ message: "Item not found" });
            }

            const updatedItem = await CItem.findByIdAndUpdate(id, updateData, {
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

            const item = await CItem.findById(id).exec();
            if (!item) {
                return res.status(404).json({ message: "Item not found" });
            }

            await CItem.findByIdAndDelete(id).exec();
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

            const Citem = await CItem.findById(id).exec();
            if (!Citem) {
                return res.status(404).json({ message: "Item not found" });
            }

            return res.status(200).json(Citem);
        } catch (err) {
            console.error(err);
            return res
                .status(500)
                .json({ message: "Internal Server Error", error: err.message });
        }
    },
    getAllItems: async (req: Request, res: Response) => {
        try {
            const Citems = await CItem.find().exec();
            return res.status(200).json(Citems);
        } catch (err) {
            console.error(err);
            return res
                .status(500)
                .json({ message: "Internal Server Error", error: err.message });
        }
    },
    // New Method: Delete All Cart Items
    deleteAllItems: async (_req: Request, res: Response) => {
        try {
            await CItem.deleteMany({}).exec();
            return res.status(200).json({ message: "All cart items deleted successfully" });
        } catch (err) {
            console.error(err);
            return res
                .status(500)
                .json({ message: "Internal Server Error", error: err.message });
        }
    },



}
   
export default cartItemController;
