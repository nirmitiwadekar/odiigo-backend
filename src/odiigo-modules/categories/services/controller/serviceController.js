const asyncHandler = require('express-async-handler');
const Service = require('../models/services');
const Category = require('../../models/category');

// Get all services
// @route GET /api/services
const getServices = asyncHandler(async (req, res) => {
    const services = await Service.find();
    res.status(200).json(services);
});

// Get service by ID
// @route GET /api/services/:id
const getServiceById = asyncHandler(async (req, res) => {
    const service = await Service.findById(req.params.id);

    if (!service) {
        return res.status(404).json({ message: 'Service not found' });
    }

    res.status(200).json(service);
});

// Create new service
// @route POST /api/services
const createService = asyncHandler(async (req, res) => {
    const { service_name, service_details, included_services, category_id } = req.body;

    // Check if the category exists
    const category = await Category.findById(category_id);
    if (!category) {
        return res.status(404).json({ message: 'Category not found' });
    }

    // Create and save the new service
    const service = new Service({ service_name, service_details, included_services, category_id });
    await service.save();

    // Update the category's services array with the new service ID
    category.services.push(service._id);
    await category.save();

    res.status(201).json(service);
});

// Update service by ID
// @route PUT /api/services/:id
const updateService = asyncHandler(async (req, res) => {
    const service = await Service.findById(req.params.id);
    if (!service) {
        return res.status(404).json({ message: 'Service not found' });
    }

    // Check if category_id is being updated
    if (req.body.category_id && service.category_id.toString() !== req.body.category_id) {
        // Remove service from old category
        await Category.findByIdAndUpdate(
            service.category_id,
            { $pull: { services: service._id } }
        );

        // Add service to new category
        await Category.findByIdAndUpdate(
            req.body.category_id,
            { $push: { services: service._id } }
        );
    }

    const updatedService = await Service.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
    );

    res.status(200).json(updatedService);
});

// Delete service by ID
// @route DELETE /api/services/:id
const deleteService = asyncHandler(async (req, res) => {
    const service = await Service.findById(req.params.id);
    if (!service) {
        return res.status(404).json({ message: 'Service not found' });
    }

    // Remove service ID from the category's services array
    await Category.findByIdAndUpdate(
        service.category_id,
        { $pull: { services: service._id } }
    );

    await Service.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Service deleted successfully' });
});

module.exports = {
    getServices,
    getServiceById,
    createService,
    updateService,
    deleteService
};

// // Get all services
// // @route GET /api/services
// const getServices = asyncHandler(async (req, res) => {
//     const services = await Service.find();
//     res.status(200).json(services);
// });

// // Get service by ID
// // @route GET /api/services/:id
// const getServiceById = asyncHandler(async (req, res) => {
//     const service = await Service.findById(req.params.id);

//     if (!service) {
//         return res.status(404).json({ message: 'Service not found' });
//     }

//     res.status(200).json(service);
// });

// // Create new service
// // @route POST /api/services
// const createService = asyncHandler(async (req, res) => {
//     // First, check if the category exists
//     const category = await Category.findById(req.body.category_id);
//     if (!category) {
//         return res.status(404).json({ message: 'Category not found' });
//     }

//     // Create and save the new service
//     const service = new Service(req.body);
//     await service.save();

//     // Update the category's services array with the new service ID
//     category.services.push(service._id);
//     await category.save();

//     res.status(201).json(service);
// });

// // Update service by ID
// // @route PUT /api/services/:id
// const updateService = asyncHandler(async (req, res) => {
//     const service = await Service.findById(req.params.id);
//     if (!service) {
//         return res.status(404).json({ message: 'Service not found' });
//     }

//     // Check if category_id is being updated
//     if (req.body.category_id && service.category_id.toString() !== req.body.category_id) {
//         // Remove service from old category
//         await Category.findByIdAndUpdate(
//             service.category_id,
//             { $pull: { services: service._id } }
//         );

//         // Add service to new category
//         await Category.findByIdAndUpdate(
//             req.body.category_id,
//             { $push: { services: service._id } }
//         );
//     }

//     const updatedService = await Service.findByIdAndUpdate(
//         req.params.id,
//         req.body,
//         { new: true }
//     );

//     res.status(200).json(updatedService);
// });

// // Delete service by ID
// // @route DELETE /api/services/:id
// const deleteService = asyncHandler(async (req, res) => {
//     const service = await Service.findById(req.params.id);
//     if (!service) {
//         return res.status(404).json({ message: 'Service not found' });
//     }

//     // Remove service ID from the category's services array
//     await Category.findByIdAndUpdate(
//         service.category_id,
//         { $pull: { services: service._id } }
//     );

//     await Service.findByIdAndDelete(req.params.id);
//     res.status(200).json(service);
// });

// module.exports = {
//     getServices,
//     getServiceById,
//     createService,
//     updateService,
//     deleteService
// };



// const asyncHandler = require('express-async-handler');
// const Service = require('../models/services');

// // Get all services
// // @route GET /api/services
// const getServices = asyncHandler(async (req, res) => {
//     const services = await Service.find();
//     res.status(200).json(services);
// });

// // Get service by ID
// // @route GET /api/services/:id
// const getServiceById = asyncHandler(async (req, res) => {
//     const service = await Service.findById(req.params.id);

//     if (!service) {
//         return res.status(404).json({ message: 'Service not found' });
//     }

//     res.status(200).json(service);
// });

// // Create new service
// // @route POST /api/services
// const createService = asyncHandler(async (req, res) => {
//     const service = new Service(req.body);
//     await service.save();

//     res.status(201).json(service);
// });

// // Update service by ID
// // @route PUT /api/services/:id
// const updateService = asyncHandler(async (req, res) => {
//     const service = await Service.findById(req.params.id);
//     if (!service) {
//         return res.status(404).json({ message: 'Service not found' });
//     }

//     const updatedService = await Service.findByIdAndUpdate(
//         req.params.id,
//         req.body,
//         { new: true }
//     );

//     res.status(200).json(updatedService);
// });

// // Delete service by ID
// // @route DELETE /api/services/:id

// const deleteService = asyncHandler(async (req, res) => {
//     const service = await Service.findById(req.params.id);
//     if (!service) {
//         return res.status(404).json({ message: 'Service not found' });
//     }

//     await Service.findByIdAndDelete(req.params.id);
//     res.status(200).json(service);
// });

// module.exports = {
//     getServices,
//     getServiceById,
//     createService,
//     updateService,
//     deleteService
// };
