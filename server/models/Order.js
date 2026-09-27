import { Schema, model } from 'mongoose';

const orderItemSchema = new Schema(
  {
    cartItemId: { type: String },
    name: { type: String, required: true },
    orderType: { type: String },
    flavor: { type: String },
    weight: { type: String },
    cupcakeQuantity: { type: Number },
    customMessage: { type: String, default: '' },
    referenceImage: { type: String, default: '' },
    deliveryDate: { type: String, default: '' },
    timeSlot: { type: String, default: '' },
    weddingConfig: { type: Schema.Types.Mixed, default: null },
    price: { type: Number, required: true },
    quantity: { type: Number, default: 1 },
  },
  { _id: false }
);

const customerDetailsSchema = new Schema(
  {
    email: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    address: { type: String, default: '' },
    city: { type: String, default: '' },
    state: { type: String, default: '' },
    zip: { type: String, default: '' },
  },
  { _id: false }
);

const financialsSchema = new Schema(
  {
    subtotal: { type: Number, default: 0 },
    shipping: { type: Number, default: 0 },
    tax: { type: Number, default: 0 },
    finalTotal: { type: Number, required: true },
  },
  { _id: false }
);

const paymentInfoSchema = new Schema(
  {
    paymentMethod: { type: String, default: 'credit' },
    paymentStatus: {
      type: String,
      enum: ['Paid', 'Pending', 'Failed'],
      default: 'Paid',
    },
    paymentIntentId: { type: String, required: true },
  },
  { _id: false }
);

const orderSchema = new Schema(
  {
    orderNumber: {
      type: String,
      unique: true,
      required: true,
    },
    customerDetails: {
      type: customerDetailsSchema,
      required: true,
    },
    deliveryMethod: {
      type: String,
      enum: ['delivery', 'pickup'],
      required: true,
    },
    items: [orderItemSchema],
    financials: {
      type: financialsSchema,
      required: true,
    },
    paymentInfo: {
      type: paymentInfoSchema,
      required: true,
    },
    orderStatus: {
      type: String,
      enum: ['Received', 'Baking', 'Decorating', 'Ready for Delivery/Pickup', 'Completed', 'Cancelled'],
      default: 'Received',
    },
  },
  {
    timestamps: true,
  }
);

export default model('Order', orderSchema, 'orders');