const mongoose = require('mongoose');

const DonationOptionSchema = new mongoose.Schema({
  amount: Number,
  impact: String,
  icon: String,
  enabled: Boolean
});

const PaymentMethodSchema = new mongoose.Schema({
  enabled: Boolean,
  name: String,
  description: String
});

const DonationConfigSchema = new mongoose.Schema({
  donationOptions: [DonationOptionSchema],
  customAmountEnabled: Boolean,
  monthlyDonationEnabled: Boolean,
  anonymousDonationEnabled: Boolean,
  messageFieldEnabled: Boolean,
  requiredFields: {
    name: Boolean,
    email: Boolean,
    phone: Boolean
  },
  paymentMethods: {
    card: PaymentMethodSchema,
    upi: PaymentMethodSchema,
    netbanking: PaymentMethodSchema,
    wallet: PaymentMethodSchema
  },
  formSettings: {
    minAmount: Number,
    maxAmount: Number,
    defaultAmount: Number,
    currency: String,
    currencySymbol: String
  }
}, { timestamps: true });

module.exports = mongoose.model('DonationConfig', DonationConfigSchema);
