import { Request, Response } from "express";
import Coupon  from "../models/Coupon";

const couponController = {
    // Create a new coupon
    create: async (req: Request, res: Response) => {
        try {
            const { code, discount, startDate, endDate, status, minimumPrice, startHour, endHour, usageLimit, usedCount } = req.body;

            // Validate required fields
            const missingFields = [];
            if (!code) missingFields.push("code");
            if (!discount) missingFields.push("discount");
            if (!status) missingFields.push("discount");

            
            if (missingFields.length > 0) {
                return res
                    .status(400)
                    .json({ message: "Missing required coupon data", missingFields });
            }

            // Check for duplicate coupon code
            const existingCoupon = await Coupon.findOne({ code }).exec();
            if (existingCoupon) {
                return res.status(409).json({ message: "Coupon code must be unique" });
            }

            // Create and save the new coupon
            const newCoupon = new Coupon({
                code,
                discount,
                startDate,
                endDate,
                status: status || true,
                minimumPrice,
                startHour,
                endHour,
                usageLimit,
                usedCount
            });

            await newCoupon.save();
            return res.status(201).json(newCoupon);
        } catch (err) {
            console.error(err);
            return res
                .status(500)
                .json({ message: "Internal Server Error", error: err.message });
        }
    },

    // Update an existing coupon
    update: async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const updateData = req.body;

            const coupon = await Coupon.findById(id).exec();
            if (!coupon) {
                return res.status(404).json({ message: "Coupon not found" });
            }

            if (updateData.usageLimit !== undefined && updateData.usageLimit !== null) {
                // Reset usedCount to 0 if usageLimit changes
                updateData.usedCount = 0;
            }

            const updatedCoupon = await Coupon.findByIdAndUpdate(id, updateData, {
                new: true,
            }).exec();
            
            // Check if usageLimit is being updated
          

            return res.status(200).json(updatedCoupon);
        } catch (err) {
            console.error(err);
            return res
                .status(500)
                .json({ message: "Internal Server Error", error: err.message });
        }
    },

    // Delete a coupon
    delete: async (req: Request, res: Response) => {
        try {
            const { id } = req.params;

            const coupon = await Coupon.findById(id).exec();
            if (!coupon) {
                return res.status(404).json({ message: "Coupon not found" });
            }

            await Coupon.findByIdAndDelete(id).exec();
            return res.status(200).json({ message: "Coupon deleted successfully" });
        } catch (err) {
            console.error(err);
            return res
                .status(500)
                .json({ message: "Internal Server Error", error: err.message });
        }
    },

    // Get a single coupon by ID
    getCoupon: async (req: Request, res: Response) => {
        try {
            const { id } = req.params;

            const coupon = await Coupon.findById(id).exec();
            if (!coupon) {
                return res.status(404).json({ message: "Coupon not found" });
            }

            return res.status(200).json(coupon);
        } catch (err) {
            console.error(err);
            return res
                .status(500)
                .json({ message: "Internal Server Error", error: err.message });
        }
    },

    // Get all coupons
    getAllCoupons: async (req: Request, res: Response) => {
        try {
            const coupons = await Coupon.find().exec();
            return res.status(200).json(coupons);
        } catch (err) {
            console.error(err);
            return res
                .status(500)
                .json({ message: "Internal Server Error", error: err.message });
        }
    },
    applyCoupon: async (req: Request, res: Response) => {
        try {
            // The middleware will have already attached discountedPrice to req.body
            const { discountedPrice } = req.body;
            const {discount} = req.body;

            return res.status(200).json({
                message: "Coupon applied successfully",
                discountedPrice,
                discount,  // Send the final discounted price
            });
        } catch (err) {
            console.error(err);
            return res.status(500).json({ message: "Internal Server Error", error: err.message });
        }
    },

};

export default couponController;
