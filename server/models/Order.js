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
            enum: ['Butter Cake', 'Chocolate Cake', 'Ribbon Cake', 'Date Cake', 'Coconut Cake'],
        },
        cakeSize: {
            type: String,
            enum: ['500g', '1kg', '2kg', '3kg', null],
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
        status: {
            type: String,
            default: 'Pending',
            enum: ['Pending', 'Baking', 'Ready', 'Delivered'],
        },
    },
    { timestamps: true }
);

export default model('Order', orderSchema);