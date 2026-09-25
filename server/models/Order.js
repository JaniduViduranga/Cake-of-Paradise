import { Schema, model } from 'mongoose';

const orderSchema = new Schema(
    {
        orderType: {
            type: String,
            required: true,
            enum: ['Standard Cakes', 'Birthday Cakes', 'Wedding Cakes', 'Cupcakes'],
            default: 'Standard Cakes',
        },
        flavor: {
            type: String,
            required: true,
            trim: true,
        },
        cakeSize: {
            type: String,
            default: '1kg',
        },
        deliveryDate: {
            type: String,
            required: true,
        },
        deliveryTimeSlot: {
            type: String,
            required: true,
        },
        totalPrice: {
            type: Number,
            required: true,
        },
        message: {
            type: String,
            default: '',
        },
        themeNotes: {
            type: String,
            default: '',
        },
        designPreview: {
            type: String,
            default: '',
        },
        weddingConfig: {
            type: Schema.Types.Mixed,
            default: null,
        },
        status: {
            type: String,
            default: 'Pending',
            enum: ['Pending', 'Baking', 'Ready', 'Delivered'],
        },
    },
    { timestamps: true }
);

export default model('Order', orderSchema);