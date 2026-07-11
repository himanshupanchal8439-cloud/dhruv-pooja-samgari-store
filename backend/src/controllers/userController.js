const User = require('../models/User');

async function updateProfile(req, res, next) {
  try {
    const { name, phone } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $set: { ...(name && { name }), ...(phone !== undefined && { phone }) } },
      { new: true }
    ).select('-password');
    res.json(user);
  } catch (err) {
    next(err);
  }
}

async function addAddress(req, res, next) {
  try {
    const { label, line1, line2, city, state, pincode, isDefault } = req.body;
    const user = await User.findById(req.user._id);

    if (isDefault) user.addresses.forEach((a) => (a.isDefault = false));
    user.addresses.push({ label, line1, line2, city, state, pincode, isDefault: !!isDefault });
    await user.save();

    res.status(201).json(user.addresses);
  } catch (err) {
    next(err);
  }
}

async function updateAddress(req, res, next) {
  try {
    const user = await User.findById(req.user._id);
    const address = user.addresses.id(req.params.addressId);
    if (!address) return res.status(404).json({ message: 'Address not found' });

    const { label, line1, line2, city, state, pincode, isDefault } = req.body;
    if (isDefault) user.addresses.forEach((a) => (a.isDefault = false));

    Object.assign(address, { label, line1, line2, city, state, pincode, isDefault: !!isDefault });
    await user.save();

    res.json(user.addresses);
  } catch (err) {
    next(err);
  }
}

async function deleteAddress(req, res, next) {
  try {
    const user = await User.findById(req.user._id);
    user.addresses.pull(req.params.addressId);
    await user.save();
    res.json(user.addresses);
  } catch (err) {
    next(err);
  }
}

module.exports = { updateProfile, addAddress, updateAddress, deleteAddress };
