const mongoose = require("mongoose");

const DonationSchema = new mongoose.Schema({
    name: String,
    email: String,
    amount: Number,
    currency: String,
    paymentId: String,
    orderId: String,
    status: { type: String, default: "PENDING" },
}, { timestamps: true });

module.exports = mongoose.model("Donation", DonationSchema);
