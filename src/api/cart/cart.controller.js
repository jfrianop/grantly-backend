const User = require('../user/user.model');

const {
  createCart,
  getCart,
  getCartById,
  updateCart,
  deleteCart,
} = require('./cart.service');
const { transporter, checkout } = require('../../utils/mailer');

const create = async (req, res) => {
  try {
    const cartData = req.body;
    const id = req.user;
    const user = await User.findById(id);
    if (!user) {
      throw new Error('The user does not exist');
    }
    const cart = await createCart({ ...cartData, user: id });
    user.shppingHistory.push(cart);
    await user.save({ validateBeforeSave: false });
    return res.status(201).json({ message: 'cart created', data: cart });
  } catch (err) {
    return res
      .status(400)
      .json({ message: 'Cart can not be created', data: err.message });
  }
};

const list = async (req, res) => {
  try {
    const carts = await getCart();
    return res.status(200).json({ message: 'carts found', data: carts });
  } catch (err) {
    return res
      .status(400)
      .json({ message: 'carts not found', data: err.message });
  }
};

const destroy = async (req, res) => {
  try {
    const { cartId } = req.params;
    const cart = await deleteCart(cartId);
    return res.status(200).json({ message: 'cart deleted', data: cart });
  } catch (err) {
    return res
      .status(400)
      .json({ message: 'cart can not be created', data: err.message });
  }
};

const show = async (req, res) => {
  const { cartId } = req.body;
  try {
    const cart = await getCartById(cartId);
    return res.status(200).json({ message: 'cart found', data: cart });
  } catch (err) {
    return res
      .status(400)
      .json({ message: 'cart not found', data: err.message });
  }
};

const update = async (req, res) => {
  try {
    const cartData = req.body;
    const id = req.user;
    const user = await User.findById(id);
    const { cartId } = req.params;
    const cart = await updateCart(cartId, cartData);
    await transporter.sendMail(checkout(user, cart));
    return res.status(200).json({ message: 'cart updated', data: cart });
  } catch (err) {
    return res.status(400).json({ message: 'cart not update', data: err });
  }
};

module.exports = { create, list, show, update, destroy };
