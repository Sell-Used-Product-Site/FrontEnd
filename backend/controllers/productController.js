const Product = require('../models/productModel')
const mongoose = require('mongoose')

// get all products
const getProducts = async (req, res) => {
  const user_id = req.user._id

  const products = await Product.find({user_id}).sort({createdAt: -1})

  res.status(200).json(products)
}

// get a single product
const getProduct = async (req, res) => {
  const { id } = req.params

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({error: 'No such product'})
  }

  const product = await Product.findById(id)

  if (!product) {
    return res.status(404).json({error: 'No such product'})
  }
  
  res.status(200).json(product)
}


// create new product
const createProduct = async (req, res) => {
  const {title, description, price} = req.body

  let emptyFields = []

  if(!title) {
    emptyFields.push('title')
  }
  if(!description) {
    emptyFields.push('description')
  }
  if(!price) {
    emptyFields.push('price')
  }
  if(emptyFields.length > 0) {
    return res.status(400).json({ error: 'Please fill in all the fields', emptyFields })
  }

  // add doc to db
  try {
    const user_id = req.user._id
    const product = await Product.create({title, description, price, user_id})
    res.status(200).json(product)
  } catch (error) {
    res.status(400).json({error: error.message})
  }
}

// delete a product
const deleteProduct = async (req, res) => {
  const { id } = req.params

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({error: 'No such product'})
  }

  const product = await Product.findOneAndDelete({_id: id})

  if (!product) {
    return res.status(400).json({error: 'No such product'})
  }

  res.status(200).json(product)
}

// update a product
const updateProduct = async (req, res) => {
  const { id } = req.params

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({error: 'No such product'})
  }

  const product = await Product.findOneAndUpdate({_id: id}, {
    ...req.body
  })

  if (!product) {
    return res.status(400).json({error: 'No such product'})
  }

  res.status(200).json(product)
}


module.exports = {
  getProducts,
  getProduct,
  createProduct,
  deleteProduct,
  updateProduct
}