import { Request, Response, NextFunction } from "express";
import Coupon from "../models/Coupon";

const couponMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { couponCode, price } = req.body;

        // Validate request parameters
        if (!couponCode) {
            return res.status(400).json({ message: "Coupon code is required" });
        }
        if (!price) {
            return res.status(400).json({ message: "Price is required" });
        }

        // Find the coupon in the database
        const coupon = await Coupon.findOne({ code: couponCode }).exec();

        if (!coupon) {
            return res.status(404).json({ message: "Coupon not found" });
        }

        // Check if coupon is active
        if (!coupon.status) {
            return res.status(400).json({ message: "Coupon is inactive" });
        }

        const currentDate = new Date();

        // Check if coupon is valid by date
        if (coupon.startDate && new Date(coupon.startDate) > currentDate) {
            return res.status(400).json({ message: "Coupon is not active yet" });
        }
        if (coupon.endDate && new Date(coupon.endDate) < currentDate) {
            return res.status(400).json({ message: "Coupon has expired" });
        }

        // Check if coupon is valid by hour
        const currentHour = currentDate.getHours();
        
        if (
            coupon.startHour !== undefined &&
            coupon.endHour !== undefined &&
            (currentHour > coupon.startHour && currentHour < coupon.endHour)
        ) {
            return res
                .status(400)
                .json({ message: `Coupon can only be used between ${coupon.startHour}:00 and ${coupon.endHour}:00` });
        }

        // Check if coupon usage limit is exceeded
        if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
            return res
                .status(400)
                .json({ message: "Coupon usage limit has been reached" });
        }

        // Check if minimum price requirement is met
        if (coupon.minimumPrice && price < coupon.minimumPrice) {
            return res.status(400).json({
                message: `Minimum price for applying the coupon is ${coupon.minimumPrice}`,
            });
        }
        const discount = (price * coupon.discount) / 100
     
        // Apply coupon discount
        const discountedPrice = price - discount;

        // Update the used count
        coupon.usedCount = (coupon.usedCount || 0) + 1;
        await coupon.save();
        // Update the used count
        // if()
        coupon.usageLimit = (coupon.usageLimit || 0) - 1 ;
        await coupon.save();


        // Attach the discounted price to the request
        req.body.discountedPrice = discountedPrice;
        req.body.discount=discount;

        // Proceed to the next middleware or route
        next();
    } catch (err) {
        console.error(err);
        return res
            .status(500)
            .json({ message: "Internal Server Error", error: err.message });
    }
};

export default couponMiddleware;
