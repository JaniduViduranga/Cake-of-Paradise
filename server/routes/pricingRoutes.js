import { Router } from 'express';
import Pricing from '../models/Pricing.js';

const router = Router();

// Default templates if collection is empty
const DEFAULT_PRICINGS = [
  {
    orderType: 'Standard Cakes',
    basePrice: 45,
    pricePerKg: 35,
    flavorPremiums: {
      Butter: 0,
      Chocolate: 5,
      Ribbon: 5,
      Date: 8,
      Coffee: 6,
      Coconut: 4,
    },
  },
  {
    orderType: 'Birthday Cakes',
    basePrice: 50,
    pricePerKg: 40,
    flavorPremiums: {
      Butter: 0,
      Chocolate: 5,
      Ribbon: 5,
      Fruit: 8,
      Coffee: 6,
    },
  },
  {
    orderType: 'Wedding Cakes',
    basePrice: 220,
    pricePerKg: 65,
    weddingTierRates: {
      tier2: 35,
      tier3: 65,
      tier4: 100,
    },
    freshFlowersRate: 30,
    flavorPremiums: {
      Butter: 0,
      Chocolate: 8,
      Ribbon: 8,
      Fruit: 10,
      Coffee: 8,
    },
  },
  {
    orderType: 'Cupcakes',
    basePrice: 0,
    pricePerKg: 0,
    cupcakePackPrices: {
      pack6: 22,
      pack12: 40,
      pack24: 75,
    },
    flavorPremiums: {
      Butter: 0,
      Chocolate: 3,
      Ribbon: 3,
      Fruit: 4,
      Coffee: 4,
    },
  },
];

// GET /api/pricing
router.get('/', async (req, res) => {
  try {
    let docs = await Pricing.find({});
    // If database is empty, seed defaults
    if (!docs || docs.length === 0) {
      try {
        await Pricing.insertMany(DEFAULT_PRICINGS);
        docs = await Pricing.find({});
      } catch (seedErr) {
        console.warn('Could not auto-seed default pricing:', seedErr.message);
        return res.json({ success: true, data: DEFAULT_PRICINGS });
      }
    }
    res.json({ success: true, data: docs });
  } catch (error) {
    console.error('Error fetching pricing data:', error);
    // Return fallback defaults so frontend can continue functioning
    res.json({ success: true, data: DEFAULT_PRICINGS, warning: 'Loaded default rules' });
  }
});

// PUT /api/pricing or POST /api/pricing - updates MongoDB pricings collection
const updatePricingHandler = async (req, res) => {
  try {
    const payload = req.body.pricings || req.body;
    let list = Array.isArray(payload) ? payload : Object.values(payload);

    if (!Array.isArray(list) || list.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Expected an array of pricing items or a pricings object.',
      });
    }

    const updatedDocs = [];
    for (const item of list) {
      if (!item.orderType) continue;

      // Clean update object
      const updateData = {
        orderType: item.orderType,
        basePrice: Number(item.basePrice) || 0,
        pricePerKg: Number(item.pricePerKg) || 0,
      };

      if (item.flavorPremiums) {
        updateData.flavorPremiums = item.flavorPremiums;
      }
      if (item.cupcakePackPrices) {
        updateData.cupcakePackPrices = {
          pack6: Number(item.cupcakePackPrices.pack6) || 0,
          pack12: Number(item.cupcakePackPrices.pack12) || 0,
          pack24: Number(item.cupcakePackPrices.pack24) || 0,
        };
      }
      if (item.weddingTierRates) {
        updateData.weddingTierRates = {
          tier2: Number(item.weddingTierRates.tier2) || 0,
          tier3: Number(item.weddingTierRates.tier3) || 0,
          tier4: Number(item.weddingTierRates.tier4) || 0,
        };
      }
      if (item.freshFlowersRate !== undefined) {
        updateData.freshFlowersRate = Number(item.freshFlowersRate) || 0;
      }

      const doc = await Pricing.findOneAndUpdate(
        { orderType: item.orderType },
        { $set: updateData },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
      updatedDocs.push(doc);
    }

    res.json({
      success: true,
      message: 'Pricing rules updated successfully in MongoDB Atlas!',
      data: updatedDocs,
    });
  } catch (error) {
    console.error('Error updating pricing data:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error while updating pricing data.',
    });
  }
};

router.put('/', updatePricingHandler);
router.post('/', updatePricingHandler);

export default router;
