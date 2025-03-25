const asyncHandler = require('express-async-handler');
const Order = require('../model/order');
const UserProfile = require('../../users/model/userProfile');
const Vehicle = require('../../vehicles/models/vehicle');
const ServicePricing = require('../../service-prices/model/pricing');

// Get all orders
const getOrders = asyncHandler(async (req, res) => {
    const orders = await Order.find()
        .populate('user_id', 'name email phone') // Fetch user details
        .populate('vehicle_id') // Fetch vehicle details
        .populate('services.service_id') // Fetch service details
        .populate('services.service_price_id'); // Fetch service pricing details

    res.status(200).json(orders);
});

// Get order by ID
const getOrderById = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id)
        .populate('user_id', 'name email phone')
        .populate('vehicle_id')
        .populate('services.service_id')
        .populate('services.service_price_id');

    if (!order) {
        return res.status(404).json({ message: 'Order not found' });
    }

    res.status(200).json(order);
});

// Create new order
const createOrder = asyncHandler(async (req, res) => {
    try {
        const { user_id, vehicle_id, services, appointment_date, appointment_time, pickup_required, pickup_address, drop_address, payment_method, payment_option } = req.body;

        // Validate user and vehicle
        const user = await UserProfile.findById(user_id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        const vehicle = await Vehicle.findById(vehicle_id);
        if (!vehicle) return res.status(404).json({ message: 'Vehicle not found' });

        // Fetch and validate service prices
        let total_price = 0;
        const updatedServices = await Promise.all(services.map(async (service) => {
            const servicePrice = await ServicePricing.findById(service.service_price_id);
            if (!servicePrice) throw new Error(`Invalid service price ID: ${service.service_price_id}`);

            if (!servicePrice.service_price) {
                throw new Error(`Invalid price for service price ID: ${service.service_price_id}`);
            }
            total_price += servicePrice.service_price;

            return {
                service_id: service.service_id,
                service_price_id: service.service_price_id,
                price: servicePrice.service_price // Corrected key
            };

        }));

        // Create the order
        const order = new Order({
            user_id,
            vehicle_id,
            services: updatedServices,
            order_status: "Placed",
            total_price,
            appointment_date,
            appointment_time,
            pickup_required,
            pickup_address,
            drop_address,
            payment_status: "Pending",
            payment_method,
            payment_option
        });

        await order.save();
        res.status(201).json(order);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// // Update an Order
// const updateOrder = asyncHandler(async (req, res) => {
//     const order = await Order.findById(req.params.id);
//     if (!order) {
//         return res.status(404).json({ message: 'Order not found' });
//     }

//     // Update order details
//     const updatedOrder = await Order.findByIdAndUpdate(req.params.id, req.body, { new: true });

//     res.status(200).json(updatedOrder);
// });
const updateOrder = asyncHandler(async (req, res) => {
    try {
        const { services, ...otherUpdates } = req.body; // Extract services separately

        let order = await Order.findById(req.params.id);
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        let total_price = order.total_price; // Start with existing total price

        if (services) {
            // Recalculate total_price based on updated services
            total_price = 0;
            const updatedServices = await Promise.all(services.map(async (service) => {
                const servicePrice = await ServicePricing.findById(service.service_price_id);
                if (!servicePrice) throw new Error(`Invalid service price ID: ${service.service_price_id}`);

                total_price += servicePrice.service_price;

                return {
                    service_id: service.service_id,
                    service_price_id: service.service_price_id,
                    price: servicePrice.service_price
                };
            }));

            otherUpdates.services = updatedServices; // Set updated services
        }

        otherUpdates.total_price = total_price; // Update total price

        // Update order details
        const updatedOrder = await Order.findByIdAndUpdate(req.params.id, otherUpdates, { new: true });

        res.status(200).json(updatedOrder);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});


// Delete an Order
const deleteOrder = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);
    if (!order) {
        return res.status(404).json({ message: 'Order not found' });
    }

    await Order.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Order deleted successfully' });
});

module.exports = {
    getOrders,
    getOrderById,
    createOrder,
    updateOrder,
    deleteOrder
};