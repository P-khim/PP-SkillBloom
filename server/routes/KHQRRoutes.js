import express from "express";
import crypto from "crypto";
import axios from "axios";

const router = express.Router();

// ABA Payway Config
const ABA_PAYWAY_API_URL = 'https://checkout-sandbox.payway.com.kh/api/payment-gateway/v1/payments/purchase';
const ABA_PAYWAY_API_KEY = 'b3740416177e83207d3bcf7ad4683b9869ced5f3';
const ABA_PAYWAY_MERCHANT_ID = 'ec450075';

// Hash function
function getHash(str) {
  const hmac = crypto.createHmac('sha512', ABA_PAYWAY_API_KEY);
  hmac.update(str);
  return hmac.digest('base64');
}

// /checkout POST endpoint
router.post('/', async (req, res) => {
  const items = Buffer.from(JSON.stringify([
    { name: 'test1', quantity: '1', price: '10' },
    { name: 'test2', quantity: '1', price: '10' },
  ])).toString('base64');

  const req_time = Math.floor(Date.now() / 1000);
  const transactionId = req_time;
  const amount = '25';
  const firstName = 'Makara';
  const lastName = 'Prom';
  const phone = '093630466';
  const email = 'prom.makara@ababank.com';
  const return_params = 'Hello World!';
  const type = 'purchase';
  const currency = 'USD';
  const payment_option = 'bakong';
  const shipping = '0.60';

  const hash = getHash(req_time + ABA_PAYWAY_MERCHANT_ID + transactionId + amount + items + shipping + firstName + lastName + email + phone + type + payment_option + currency + return_params);

  const payload = {
    hash: hash,
    tran_id: transactionId,
    amount: amount,
    firstname: firstName,
    lastname: lastName,
    phone: phone,
    email: email,
    items: items,
    return_params: return_params,
    shipping: shipping,
    currency: currency,
    type: type,
    merchant_id: ABA_PAYWAY_MERCHANT_ID,
    req_time: req_time,
    payment_option: payment_option
  };

  try {
    const response = await axios.post(ABA_PAYWAY_API_URL, payload, {
      headers: { 'Content-Type': 'application/json' }
    });

    res.json(response.data); // Send response back to frontend
  } catch (error) {
    console.error('Error calling ABA API:', error.response ? error.response.data : error.message);
    res.status(500).json({ error: 'Payment failed' });
  }
});

export default router;
