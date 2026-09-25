import Order from '../models/Order.js';

// Create new order from submitted form
export async function createOrder(req, res) {
    try {
        const { orderType, flavor, cakeSize, deliveryDate, deliveryTimeSlot, totalPrice } = req.body;

        if (!orderType || !flavor || !deliveryDate || !deliveryTimeSlot) {
            return res.status(400).json({ success: false, message: 'Please complete all required fields.' });
        }

        const order = await Order.create({
            orderType,
            flavor,
            cakeSize,
            deliveryDate,
            deliveryTimeSlot,
            totalPrice: Number(totalPrice),
        });

        res.status(201).json({
            success: true,
            message: 'Order created successfully!',
            data: order,
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
}

// Fetch all orders for management
export async function getAllOrders(req, res) {
    try {
        const orders = await Order.find().sort({ createdAt: -1 });
        res.status(200).json({ success: true, count: orders.length, data: orders });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
}