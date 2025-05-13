import expressAsyncHandler from 'express-async-handler';
import Customer from '../models/customerModel.js';

// @desc    Get all customers
// @route   GET /api/customers
// @access  Private
const getCustomers = expressAsyncHandler(async (req, res) => {
  const customers = await Customer.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json(customers);
});

// @desc    Get customer by ID
// @route   GET /api/customers/:id
// @access  Private
const getCustomerById = expressAsyncHandler(async (req, res) => {
  if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
    res.status(400);
    throw new Error('Invalid customer ID');
  }

  const customer = await Customer.findOne({ 
    _id: req.params.id,
    user: req.user._id 
  });

  if (customer) {
    res.json(customer);
  } else {
    res.status(404);
    throw new Error('Customer not found');
  }
});

// @desc    Create new customer
// @route   POST /api/customers
// @access  Private
const createCustomer = expressAsyncHandler(async (req, res) => {
  const { name, email, phone, total_spend, visits, last_active_date } = req.body;

  const customerExists = await Customer.findOne({ email, user: req.user._id });

  if (customerExists) {
    res.status(400);
    throw new Error('Customer with this email already exists');
  }

  const customer = await Customer.create({
    user: req.user._id,
    name,
    email,
    phone,
    total_spend,
    visits,
    last_active_date,
  });

  if (customer) {
    res.status(201).json(customer);
  } else {
    res.status(400);
    throw new Error('Invalid customer data');
  }
});

// @desc    Update customer
// @route   PUT /api/customers/:id
// @access  Private
const updateCustomer = expressAsyncHandler(async (req, res) => {
  if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
    res.status(400);
    throw new Error('Invalid customer ID');
  }

  const customer = await Customer.findOne({
    _id: req.params.id,
    user: req.user._id
  });

  if (customer) {
    customer.name = req.body.name || customer.name;
    customer.email = req.body.email || customer.email;
    customer.phone = req.body.phone || customer.phone;
    customer.total_spend = req.body.total_spend || customer.total_spend;
    customer.visits = req.body.visits || customer.visits;
    customer.last_active_date = req.body.last_active_date || customer.last_active_date;

    const updatedCustomer = await customer.save();
    res.json(updatedCustomer);
  } else {
    res.status(404);
    throw new Error('Customer not found');
  }
});

// @desc    Delete customer
// @route   DELETE /api/customers/:id
// @access  Private
const deleteCustomer = expressAsyncHandler(async (req, res) => {
  if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
    res.status(400);
    throw new Error('Invalid customer ID');
  }

  const customer = await Customer.findOne({
    _id: req.params.id,
    user: req.user._id
  });

  if (customer) {
    await Customer.deleteOne({ _id: customer._id });
    res.json({ message: 'Customer removed' });
  } else {
    res.status(404);
    throw new Error('Customer not found');
  }
});

export { 
  getCustomers, 
  getCustomerById, 
  createCustomer, 
  updateCustomer, 
  deleteCustomer 
};