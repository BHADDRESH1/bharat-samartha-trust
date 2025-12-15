const crypto = require("crypto");
const razorpay = require("../config/razorpay");
const Donation = require("../models/Donation");

exports.createOrder = async (req, res) => {
    try {
        const { amount } = req.body;

        const options = {
            amount: amount * 100, // convert to paise
            currency: "INR",
            receipt: "donate_rcpt_" + Date.now(),
        };

        const order = await razorpay.orders.create(options);
        res.json(order);

    } catch (error) {
        console.error(error);
        res.status(500).send("Error creating Razorpay order");
    }
};


exports.verifyPayment = async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

        const sign = razorpay_order_id + "|" + razorpay_payment_id;
        const expectedSign = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
                                   .update(sign)
                                   .digest("hex");

        if (expectedSign !== razorpay_signature) {
            return res.status(400).json({ message: "Invalid signature" });
        }

        // Save donation to DB
        const donation = await Donation.create({
            amount: req.body.amount,
            currency: "INR",
            paymentId: razorpay_payment_id,
            orderId: razorpay_order_id,
            status: "SUCCESS",
        });

        res.json({ message: "Payment Verified", donation });

    } catch (error) {
        console.error(error);
        res.status(500).send("Error verifying payment");
    }
};
