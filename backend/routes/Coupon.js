const express = require('express');
const router = express.Router();
const { verifyCoupon, getAvailableCoupons } = require('../controllers/Coupon');

router.post('/verify', verifyCoupon);
router.get('/', getAvailableCoupons);

module.exports = router;
