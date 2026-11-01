import React, { useState, useEffect } from 'react';
import {
  DollarSign,
  Save,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Cake,
  Boxes,
  Sparkles,
  Layers,
  Info,
} from 'lucide-react';
import { getPricing, updatePricing } from '../../../services/api';

const STANDARD_FLAVORS = [
  'Butter',
  'Chocolate',
  'Ribbon',
  'Date',
  'Coffee',
  'Coconut',
];

const CELEBRATION_FLAVORS = [
  'Butter',
  'Chocolate',
  'Ribbon',
  'Fruit',
  'Coffee',
];

const DEFAULT_STATE = {
  standard: {
    basePrice: 45,
    pricePerKg: 35,
    flavors: {
      Butter: 0,
      Chocolate: 5,
      Ribbon: 5,
      Date: 8,
      Coffee: 6,
      Coconut: 4,
    },
  },
  birthday: {
    basePrice: 50,
    pricePerKg: 40,
    flavors: {
      Butter: 0,
      Chocolate: 5,
      Ribbon: 5,
      Fruit: 8,
      Coffee: 6,
    },
  },
  wedding: {
    basePrice: 220,
    pricePerKg: 65,
    tier2: 35,
    tier3: 65,
    tier4: 100,
    freshFlowersRate: 30,
    flavors: {
      Butter: 0,
      Chocolate: 8,
      Ribbon: 8,
      Fruit: 10,
      Coffee: 8,
    },
  },
  cupcakes: {
    pack6: 22,
    pack12: 40,
    pack24: 75,
  },
};

export default function AdminPricing() {
  const [pricingState, setPricingState] = useState(DEFAULT_STATE);
  const [initialState, setInitialState] = useState(DEFAULT_STATE);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [error, setError] = useState('');

  // Fetch current pricing from server
  const loadPricingData = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await getPricing();
      const docs = res.data?.data || [];

      if (docs.length > 0) {
        const nextState = JSON.parse(JSON.stringify(DEFAULT_STATE));

        docs.forEach((doc) => {
          const type = doc.orderType;

          if (type === 'Standard Cakes' || type === 'Standard') {
            nextState.standard.basePrice = doc.basePrice ?? nextState.standard.basePrice;
            nextState.standard.pricePerKg = doc.pricePerKg ?? nextState.standard.pricePerKg;
            if (doc.flavorPremiums) {
              const obj = doc.flavorPremiums instanceof Map
                ? Object.fromEntries(doc.flavorPremiums)
                : doc.flavorPremiums;
              nextState.standard.flavors = { ...nextState.standard.flavors, ...obj };
            }
          }

          if (type === 'Birthday Cakes') {
            nextState.birthday.basePrice = doc.basePrice ?? nextState.birthday.basePrice;
            nextState.birthday.pricePerKg = doc.pricePerKg ?? nextState.birthday.pricePerKg;
            if (doc.flavorPremiums) {
              const obj = doc.flavorPremiums instanceof Map
                ? Object.fromEntries(doc.flavorPremiums)
                : doc.flavorPremiums;
              nextState.birthday.flavors = { ...nextState.birthday.flavors, ...obj };
            }
          }

          if (type === 'Wedding Cakes') {
            nextState.wedding.basePrice = doc.basePrice ?? nextState.wedding.basePrice;
            nextState.wedding.pricePerKg = doc.pricePerKg ?? nextState.wedding.pricePerKg;
            if (doc.weddingTierRates) {
              nextState.wedding.tier2 = doc.weddingTierRates.tier2 ?? nextState.wedding.tier2;
              nextState.wedding.tier3 = doc.weddingTierRates.tier3 ?? nextState.wedding.tier3;
              nextState.wedding.tier4 = doc.weddingTierRates.tier4 ?? nextState.wedding.tier4;
            }
            if (doc.freshFlowersRate !== undefined) {
              nextState.wedding.freshFlowersRate = doc.freshFlowersRate;
            }
            if (doc.flavorPremiums) {
              const obj = doc.flavorPremiums instanceof Map
                ? Object.fromEntries(doc.flavorPremiums)
                : doc.flavorPremiums;
              nextState.wedding.flavors = { ...nextState.wedding.flavors, ...obj };
            }
          }

          if (type === 'Cupcakes') {
            if (doc.cupcakePackPrices) {
              nextState.cupcakes.pack6 = doc.cupcakePackPrices.pack6 ?? nextState.cupcakes.pack6;
              nextState.cupcakes.pack12 = doc.cupcakePackPrices.pack12 ?? nextState.cupcakes.pack12;
              nextState.cupcakes.pack24 = doc.cupcakePackPrices.pack24 ?? nextState.cupcakes.pack24;
            }
          }
        });

        setPricingState(nextState);
        setInitialState(nextState);
      }
    } catch (err) {
      console.warn('Could not fetch pricing from backend, using defaults:', err);
    } finally {
      setLoading(false);
      setIsDirty(false);
    }
  };

  useEffect(() => {
    loadPricingData();
  }, []);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 4000);
  };

  // Generic updater
  const updateField = (category, field, value) => {
    setPricingState((prev) => {
      const updated = {
        ...prev,
        [category]: {
          ...prev[category],
          [field]: Number(value) || 0,
        },
      };
      setIsDirty(true);
      return updated;
    });
  };

  // Flavor updater
  const updateFlavorFee = (category, flavor, value) => {
    setPricingState((prev) => {
      const updated = {
        ...prev,
        [category]: {
          ...prev[category],
          flavors: {
            ...prev[category].flavors,
            [flavor]: Number(value) || 0,
          },
        },
      };
      setIsDirty(true);
      return updated;
    });
  };

  // Cupcake pack updater
  const updateCupcakePack = (packKey, value) => {
    setPricingState((prev) => {
      const updated = {
        ...prev,
        cupcakes: {
          ...prev.cupcakes,
          [packKey]: Number(value) || 0,
        },
      };
      setIsDirty(true);
      return updated;
    });
  };

  // Reset to saved
  const handleReset = () => {
    setPricingState(JSON.parse(JSON.stringify(initialState)));
    setIsDirty(false);
    showToast('Reverted all unsaved price adjustments.');
  };

  // Save changes button -> updates MongoDB pricings collection
  const handleSaveChanges = async (e) => {
    if (e) e.preventDefault();
    setSaving(true);
    setError('');

    try {
      // Structure payload for backend update
      const pricingsPayload = [
        {
          orderType: 'Standard Cakes',
          basePrice: pricingState.standard.basePrice,
          pricePerKg: pricingState.standard.pricePerKg,
          flavorPremiums: pricingState.standard.flavors,
        },
        {
          orderType: 'Birthday Cakes',
          basePrice: pricingState.birthday.basePrice,
          pricePerKg: pricingState.birthday.pricePerKg,
          flavorPremiums: pricingState.birthday.flavors,
        },
        {
          orderType: 'Wedding Cakes',
          basePrice: pricingState.wedding.basePrice,
          pricePerKg: pricingState.wedding.pricePerKg,
          weddingTierRates: {
            tier2: pricingState.wedding.tier2,
            tier3: pricingState.wedding.tier3,
            tier4: pricingState.wedding.tier4,
          },
          freshFlowersRate: pricingState.wedding.freshFlowersRate,
          flavorPremiums: pricingState.wedding.flavors,
        },
        {
          orderType: 'Cupcakes',
          basePrice: 0,
          cupcakePackPrices: {
            pack6: pricingState.cupcakes.pack6,
            pack12: pricingState.cupcakes.pack12,
            pack24: pricingState.cupcakes.pack24,
          },
        },
      ];

      await updatePricing(pricingsPayload);
      setInitialState(JSON.parse(JSON.stringify(pricingState)));
      setIsDirty(false);
      showToast('🎉 Pricing rules updated successfully in MongoDB Atlas collection!');
    } catch (err) {
      console.error('Failed to update pricing rules:', err);
      // If server unreachable, notify gracefully
      setError(
        err.response?.data?.message ||
          'Failed to update MongoDB Atlas. Please ensure backend server is running.'
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in font-montserrat pb-20">
      {/* Toast Feedback */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-chocolate-900 text-white px-4 py-3 rounded-xl shadow-xl flex items-center gap-2 border border-caramel-600/40 animate-slide-up text-xs font-semibold">
          <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header and Floating Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-playfair font-bold text-2xl sm:text-3xl text-chocolate-900">
              Pricing Manager
            </h1>
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-caramel-600 text-white uppercase tracking-wider">
              Tab 4
            </span>
          </div>
          <p className="text-xs sm:text-sm text-chocolate-800/60 mt-1">
            Update category base rates, cupcake pack prices, and flavor premiums directly from this UI without editing MongoDB Atlas.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 self-start sm:self-auto">
          {isDirty && (
            <button
              type="button"
              onClick={handleReset}
              disabled={saving}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-gray-200 text-xs font-semibold text-chocolate-800 hover:text-chocolate-900 hover:bg-gray-100 transition-colors shadow-2xs"
            >
              <RotateCcw size={14} />
              <span>Discard Changes</span>
            </button>
          )}

          <button
            type="button"
            onClick={handleSaveChanges}
            disabled={saving}
            className="btn-primary text-xs py-2.5 px-5 flex items-center gap-2 shadow-md"
          >
            {saving ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Saving to MongoDB...</span>
              </>
            ) : (
              <>
                <Save size={15} />
                <span>Save Changes</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Dirty indicator warning */}
      {isDirty && (
        <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-center justify-between shadow-2xs">
          <div className="flex items-center gap-2 font-medium">
            <AlertTriangle size={15} className="text-amber-600 shrink-0" />
            <span>You have unsaved pricing modifications. Click <strong>"Save Changes"</strong> to persist them to MongoDB Atlas.</span>
          </div>
          <button
            onClick={handleSaveChanges}
            className="underline font-bold text-amber-950 ml-2"
          >
            Save Now
          </button>
        </div>
      )}

      {/* Error Banner */}
      {error && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle size={16} className="text-rose-500 shrink-0" />
            <span>{error}</span>
          </div>
          <button
            onClick={handleSaveChanges}
            className="underline font-semibold hover:text-rose-950"
          >
            Retry
          </button>
        </div>
      )}

      {/* Form sections */}
      <form onSubmit={handleSaveChanges} className="space-y-8">
        
        {/* SECTION 1: Category Base Rates */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-xs overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 bg-cream-50/70 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-caramel-600/10 text-caramel-600 flex items-center justify-center">
                <Cake size={18} />
              </div>
              <div>
                <h2 className="font-playfair font-bold text-base sm:text-lg text-chocolate-900">
                  Category Base Rates
                </h2>
                <p className="text-[11px] text-chocolate-800/60">
                  Edit basePrice and pricePerKg for Standard, Birthday Cakes, and Wedding Cakes.
                </p>
              </div>
            </div>
            <span className="text-[11px] font-semibold text-caramel-600 bg-caramel-600/10 px-2.5 py-0.5 rounded-full">
              Currency: Rs.
            </span>
          </div>

          <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Standard Cakes */}
            <div className="p-4 rounded-xl border border-gray-200/80 bg-cream-50/30 space-y-4">
              <div className="border-b border-gray-200/60 pb-2">
                <h3 className="font-playfair font-bold text-base text-chocolate-900">
                  Standard Cakes
                </h3>
                <p className="text-[11px] text-chocolate-800/60">Daily artisan bakes</p>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-chocolate-800 mb-1">
                    Base Price (Rs.)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400">Rs.</span>
                    <input
                      type="number"
                      min="0"
                      step="1"
                      value={pricingState.standard.basePrice}
                      onChange={(e) => updateField('standard', 'basePrice', e.target.value)}
                      className="input-field pl-9 text-xs font-semibold"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-chocolate-800 mb-1">
                    Price per Kg (Rs.)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400">Rs.</span>
                    <input
                      type="number"
                      min="0"
                      step="1"
                      value={pricingState.standard.pricePerKg}
                      onChange={(e) => updateField('standard', 'pricePerKg', e.target.value)}
                      className="input-field pl-9 text-xs font-semibold"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Birthday Cakes */}
            <div className="p-4 rounded-xl border border-gray-200/80 bg-cream-50/30 space-y-4">
              <div className="border-b border-gray-200/60 pb-2">
                <h3 className="font-playfair font-bold text-base text-chocolate-900">
                  Birthday Cakes
                </h3>
                <p className="text-[11px] text-chocolate-800/60">Celebration tiered and single layers</p>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-chocolate-800 mb-1">
                    Base Price (Rs.)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400">Rs.</span>
                    <input
                      type="number"
                      min="0"
                      step="1"
                      value={pricingState.birthday.basePrice}
                      onChange={(e) => updateField('birthday', 'basePrice', e.target.value)}
                      className="input-field pl-9 text-xs font-semibold"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-chocolate-800 mb-1">
                    Price per Kg (Rs.)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400">Rs.</span>
                    <input
                      type="number"
                      min="0"
                      step="1"
                      value={pricingState.birthday.pricePerKg}
                      onChange={(e) => updateField('birthday', 'pricePerKg', e.target.value)}
                      className="input-field pl-9 text-xs font-semibold"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Wedding Cakes */}
            <div className="p-4 rounded-xl border border-gray-200/80 bg-cream-50/30 space-y-4">
              <div className="border-b border-gray-200/60 pb-2">
                <h3 className="font-playfair font-bold text-base text-chocolate-900">
                  Wedding Cakes
                </h3>
                <p className="text-[11px] text-chocolate-800/60">Multi-tier bespoke structures</p>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-chocolate-800 mb-1">
                    Base Price (Rs.)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400">Rs.</span>
                    <input
                      type="number"
                      min="0"
                      step="1"
                      value={pricingState.wedding.basePrice}
                      onChange={(e) => updateField('wedding', 'basePrice', e.target.value)}
                      className="input-field pl-9 text-xs font-semibold"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-chocolate-800 mb-1">
                    Price per Kg (Rs.)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400">Rs.</span>
                    <input
                      type="number"
                      min="0"
                      step="1"
                      value={pricingState.wedding.pricePerKg}
                      onChange={(e) => updateField('wedding', 'pricePerKg', e.target.value)}
                      className="input-field pl-9 text-xs font-semibold"
                    />
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* SECTION 2: Cupcake Pack Pricing */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-xs overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 bg-cream-50/70 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-caramel-600/10 text-caramel-600 flex items-center justify-center">
                <Boxes size={18} />
              </div>
              <div>
                <h2 className="font-playfair font-bold text-base sm:text-lg text-chocolate-900">
                  Cupcake Pack Pricing
                </h2>
                <p className="text-[11px] text-chocolate-800/60">
                  Adjust prices for 6-pack, 12-pack, and 24-pack options.
                </p>
              </div>
            </div>
          </div>

          <div className="p-6 grid grid-cols-1 sm:grid-cols-3 gap-6">
            
            {/* 6-Pack */}
            <div className="p-4 rounded-xl border border-gray-200/80 bg-cream-50/20 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-chocolate-900 uppercase">6-Pack Cupcakes</span>
                <span className="text-[10px] font-semibold text-caramel-600 bg-cream-100 px-2 py-0.5 rounded">Small Box</span>
              </div>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400">Rs.</span>
                <input
                  type="number"
                  min="0"
                  step="1"
                  value={pricingState.cupcakes.pack6}
                  onChange={(e) => updateCupcakePack('pack6', e.target.value)}
                  className="input-field pl-9 text-sm font-semibold"
                />
              </div>
              <p className="text-[11px] text-chocolate-800/50">Base price for a box of 6 cupcakes.</p>
            </div>

            {/* 12-Pack */}
            <div className="p-4 rounded-xl border border-gray-200/80 bg-cream-50/20 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-chocolate-900 uppercase">12-Pack Cupcakes</span>
                <span className="text-[10px] font-semibold text-caramel-600 bg-cream-100 px-2 py-0.5 rounded">Dozen</span>
              </div>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400">Rs.</span>
                <input
                  type="number"
                  min="0"
                  step="1"
                  value={pricingState.cupcakes.pack12}
                  onChange={(e) => updateCupcakePack('pack12', e.target.value)}
                  className="input-field pl-9 text-sm font-semibold"
                />
              </div>
              <p className="text-[11px] text-chocolate-800/50">Base price for 1 dozen cupcakes.</p>
            </div>

            {/* 24-Pack */}
            <div className="p-4 rounded-xl border border-gray-200/80 bg-cream-50/20 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-chocolate-900 uppercase">24-Pack Cupcakes</span>
                <span className="text-[10px] font-semibold text-caramel-600 bg-cream-100 px-2 py-0.5 rounded">Party Crate</span>
              </div>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400">Rs.</span>
                <input
                  type="number"
                  min="0"
                  step="1"
                  value={pricingState.cupcakes.pack24}
                  onChange={(e) => updateCupcakePack('pack24', e.target.value)}
                  className="input-field pl-9 text-sm font-semibold"
                />
              </div>
              <p className="text-[11px] text-chocolate-800/50">Party platter of 24 cupcakes.</p>
            </div>

          </div>
        </div>

        {/* SECTION 3: Flavor Upcharges */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-xs overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 bg-cream-50/70 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-caramel-600/10 text-caramel-600 flex items-center justify-center">
                <Sparkles size={18} />
              </div>
              <div>
                <h2 className="font-playfair font-bold text-base sm:text-lg text-chocolate-900">
                  Flavor Upcharges
                </h2>
                <p className="text-[11px] text-chocolate-800/60">
                  Set the surcharge for each flavor across standard and celebration options.
                </p>
              </div>
            </div>
          </div>

          <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Standard Flavors */}
            <div className="space-y-4">
              <div className="border-b border-gray-100 pb-2 flex items-center justify-between">
                <div>
                  <h3 className="font-playfair font-bold text-base text-chocolate-900">
                    Standard Flavors Surcharges
                  </h3>
                  <p className="text-[11px] text-chocolate-800/60">
                    Applied to Standard Cakes (Butter, Chocolate, Ribbon, Date, Coffee, Coconut).
                  </p>
                </div>
                <span className="text-[10px] font-bold bg-blue-50 text-blue-800 px-2 py-0.5 rounded">
                  Standard Category
                </span>
              </div>

              <div className="space-y-2.5">
                {STANDARD_FLAVORS.map((flavor) => {
                  const currentValue = pricingState.standard.flavors?.[flavor] ?? 0;
                  return (
                    <div
                      key={flavor}
                      className="flex items-center justify-between p-3 rounded-xl border border-gray-100 bg-cream-50/20 hover:bg-cream-50/50 transition-colors"
                    >
                      <span className="text-xs font-bold text-chocolate-900">
                        {flavor}
                      </span>
                      <div className="relative w-32">
                        <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400">Rs.</span>
                        <input
                          type="number"
                          min="0"
                          step="1"
                          value={currentValue}
                          onChange={(e) => updateFlavorFee('standard', flavor, e.target.value)}
                          className="input-field pl-8 py-1.5 text-xs text-right font-semibold"
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Celebration Flavors */}
            <div className="space-y-4">
              <div className="border-b border-gray-100 pb-2 flex items-center justify-between">
                <div>
                  <h3 className="font-playfair font-bold text-base text-chocolate-900">
                    Celebration Flavors Surcharges
                  </h3>
                  <p className="text-[11px] text-chocolate-800/60">
                    Applied to Birthday & Wedding Cakes (Butter, Chocolate, Ribbon, Fruit, Coffee).
                  </p>
                </div>
                <span className="text-[10px] font-bold bg-amber-50 text-amber-800 px-2 py-0.5 rounded">
                  Celebration Categories
                </span>
              </div>

              <div className="space-y-2.5">
                {CELEBRATION_FLAVORS.map((flavor) => {
                  const currentValue = pricingState.birthday.flavors?.[flavor] ?? 0;
                  return (
                    <div
                      key={flavor}
                      className="flex items-center justify-between p-3 rounded-xl border border-gray-100 bg-cream-50/20 hover:bg-cream-50/50 transition-colors"
                    >
                      <span className="text-xs font-bold text-chocolate-900">
                        {flavor}
                      </span>
                      <div className="relative w-32">
                        <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400">Rs.</span>
                        <input
                          type="number"
                          min="0"
                          step="1"
                          value={currentValue}
                          onChange={(e) => {
                            // Update both birthday and wedding celebration flavors for consistency
                            updateFlavorFee('birthday', flavor, e.target.value);
                            updateFlavorFee('wedding', flavor, e.target.value);
                          }}
                          className="input-field pl-8 py-1.5 text-xs text-right font-semibold"
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        </div>

        {/* Bottom Save Bar */}
        <div className="sticky bottom-4 z-20 bg-white/95 backdrop-blur-md rounded-2xl border border-gray-200/90 p-4 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs text-chocolate-800/70">
            <Info size={16} className="text-caramel-600 shrink-0" />
            <span>
              All adjustments update the live MongoDB <strong>pricings</strong> collection used during customer checkout calculations.
            </span>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            {isDirty && (
              <button
                type="button"
                onClick={handleReset}
                disabled={saving}
                className="btn-secondary text-xs py-2.5 px-4 flex-1 sm:flex-initial"
              >
                Discard
              </button>
            )}

            <button
              type="submit"
              disabled={saving}
              className="btn-primary text-xs py-2.5 px-6 flex-1 sm:flex-initial flex items-center justify-center gap-2"
            >
              {saving ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save size={15} />
                  <span>Save Changes</span>
                </>
              )}
            </button>
          </div>
        </div>

      </form>
    </div>
  );
}

