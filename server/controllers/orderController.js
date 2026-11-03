import Order from '../models/Order.js';

// Create new order with payment confirmation and customer details
export async function createOrder(req, res) {
  try {
    const {
      customerDetails,
      deliveryMethod,
      items,
      financials,
      paymentInfo,
      paymentIntentId,
      paymentStatus,
      paymentMethod,
      subtotal,
      shipping,
      tax,
      finalTotal,
      totalPrice,
      email,
      firstName,
      lastName,
      phone,
      address,
      city,
      state,
      zip,
    } = req.body;

    // Resolve customer details
    const resolvedCustomer = customerDetails || {
      email,
      firstName,
      lastName,
      phone: phone || '',
      address: address || '',
      city: city || '',
      state: state || '',
      zip: zip || '',
    };

    if (customerDetails && phone && !customerDetails.phone) {
      resolvedCustomer.phone = phone;
    }

    if (!resolvedCustomer.email || !resolvedCustomer.firstName || !resolvedCustomer.lastName) {
      return res.status(400).json({
        success: false,
        message: 'Customer email, first name, and last name are required.',
      });
    }

    // Resolve delivery method
    const resolvedDeliveryMethod = deliveryMethod || (resolvedCustomer.address ? 'delivery' : 'pickup');
    if (resolvedDeliveryMethod === 'delivery' && !resolvedCustomer.address) {
      return res.status(400).json({
        success: false,
        message: 'Delivery address is required for local delivery.',
      });
    }

    // Validate items
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'At least one item is required to place an order.',
      });
    }

    // Resolve financials
    const resolvedFinancials = financials || {
      subtotal: Number(subtotal) || 0,
      shipping: Number(shipping) || 0,
      tax: Number(tax) || 0,
      finalTotal: Number(finalTotal || totalPrice || 0),
    };

    // Resolve payment info
    const resolvedPaymentInfo = paymentInfo || {
      paymentMethod: paymentMethod || 'credit',
      paymentStatus: paymentStatus || 'Paid',
      paymentIntentId: paymentIntentId || req.body.paymentIntent?.id,
    };

    if (!resolvedPaymentInfo.paymentIntentId) {
      return res.status(400).json({
        success: false,
        message: 'A verified Stripe paymentIntentId is required.',
      });
    }

    // Generate unique order number: ORD-<timestamp-slice>-<random>
    let orderNumber = req.body.orderNumber;
    if (!orderNumber) {
      const timeSlice = Date.now().toString().slice(-6);
      const randomSuffix = Math.floor(100 + Math.random() * 900);
      orderNumber = `ORD-${timeSlice}-${randomSuffix}`;
    }

    // Clean and structure order items
    const structuredItems = items.map((item) => ({
      cartItemId: item.cartItemId || item.id || `${Date.now()}`,
      name: item.name,
      orderType: item.orderType || 'Standard Cakes',
      flavor: item.flavor || '',
      weight: item.weight || item.size || '',
      cupcakeQuantity: item.cupcakeQuantity || null,
      customMessage: item.customMessage || item.message || '',
      referenceImage: item.referenceImage || item.image || item.designPreview || '',
      deliveryDate: item.deliveryDate || '',
      timeSlot: item.timeSlot || '',
      weddingConfig: item.weddingConfig || null,
      price: Number(item.price || item.totalPrice || 0),
      quantity: Number(item.quantity) || 1,
    }));

    const newOrder = await Order.create({
      orderNumber,
      customerDetails: resolvedCustomer,
      deliveryMethod: resolvedDeliveryMethod,
      items: structuredItems,
      financials: resolvedFinancials,
      paymentInfo: resolvedPaymentInfo,
      orderStatus: 'Received',
    });

    res.status(201).json({
      success: true,
      message: 'Order created and persisted successfully!',
      order: newOrder,
    });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error while saving order.',
      error: error.message,
    });
  }
}

// Fetch all orders sorted by newest first for Admin Dashboard
export async function getAllOrders(req, res) {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders,
      orders,
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error while fetching orders.',
      error: error.message,
    });
  }
}

// Update order status in real time
export async function updateOrderStatus(req, res) {
  try {
    const { id } = req.params;
    const { orderStatus } = req.body;

    const validStatuses = [
      'Received',
      'Baking',
      'Decorating',
      'Ready for Delivery/Pickup',
      'Completed',
      'Cancelled',
    ];

    if (!validStatuses.includes(orderStatus)) {
      return res.status(400).json({
        success: false,
        message: `Invalid order status. Allowed statuses: ${validStatuses.join(', ')}`,
      });
    }

    // Try finding by _id or by orderNumber
    let updatedOrder = null;
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      updatedOrder = await Order.findByIdAndUpdate(
        id,
        { orderStatus },
        { new: true }
      );
    } else {
      updatedOrder = await Order.findOneAndUpdate(
        { orderNumber: id },
        { orderStatus },
        { new: true }
      );
    }

    if (!updatedOrder) {
      return res.status(404).json({
        success: false,
        message: 'Order not found.',
      });
    }

    res.status(200).json({
      success: true,
      message: `Order status updated to "${orderStatus}" successfully.`,
      order: updatedOrder,
      data: updatedOrder,
    });
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error while updating order status.',
      error: error.message,
    });
  }
}

// Delete an order (Admin management)
export async function deleteOrder(req, res) {
  try {
    const { id } = req.params;
    let deleted = null;
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      deleted = await Order.findByIdAndDelete(id);
    } else {
      deleted = await Order.findOneAndDelete({ orderNumber: id });
    }

    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Order not found.' });
    }

    res.status(200).json({ success: true, message: 'Order deleted successfully.' });
  } catch (error) {
    console.error('Error deleting order:', error);
    res.status(500).json({ success: false, message: 'Server error while deleting order.' });
  }
}
