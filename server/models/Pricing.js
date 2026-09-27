import { Schema, model } from 'mongoose';

const pricingSchema = new Schema(
  {
    orderType: {
      type: String,
      required: true,
      unique: true,
    },
    basePrice: {
      type: Number,
      required: true,
      default: 0,
    },
    pricePerKg: {
      type: Number,
      default: 0,
    },
    flavorPremiums: {
      type: Map,
      of: Number,
      default: {},
    },
    cupcakePackPrices: {
      pack6: { type: Number, default: 0 },
      pack12: { type: Number, default: 0 },
      pack24: { type: Number, default: 0 },
    },
    weddingTierRates: {
      tier2: { type: Number, default: 0 },
      tier3: { type: Number, default: 0 },
      tier4: { type: Number, default: 0 },
    },
    freshFlowersRate: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const Pricing = model('Pricing', pricingSchema, 'pricings');

export default Pricing;
