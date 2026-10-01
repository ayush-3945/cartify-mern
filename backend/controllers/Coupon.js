const Coupon = require('../models/Coupon');

exports.verifyCoupon = async (req, res) => {
  try {
    const { code } = req.body;
    if (!code) {
      return res.status(400).json({ message: 'Coupon code is required' });
    }

    const coupon = await Coupon.findOne({ code: code.toUpperCase().trim() });
    if (!coupon) {
      return res.status(404).json({ message: 'Invalid coupon code' });
    }

    if (!coupon.isActive) {
      return res.status(400).json({ message: 'This coupon is no longer active' });
    }

    if (coupon.expiresAt < new Date()) {
      return res.status(400).json({ message: 'This coupon has expired' });
    }

    if (coupon.timesUsed >= coupon.usageLimit) {
      return res.status(400).json({ message: 'Coupon usage limit has been reached' });
    }

    res.status(200).json({
      success: true,
      code: coupon.code,
      discountPercentage: coupon.discountPercentage,
      message: `${coupon.discountPercentage}% discount applied successfully!`
    });
  } catch (error) {
    console.error('Error verifying coupon:', error);
    res.status(500).json({ message: 'Error verifying coupon, please try again' });
  }
};

exports.getAvailableCoupons = async (req, res) => {
  try {
    const coupons = await Coupon.find({ isActive: true, expiresAt: { $gt: new Date() } })
      .select('code discountPercentage expiresAt');
    res.status(200).json(coupons);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching coupons' });
  }
};
