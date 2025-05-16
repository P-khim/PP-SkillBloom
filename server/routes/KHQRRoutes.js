// routes/checkout-bakong.js

import express from 'express';
import { BakongKHQR, khqrData, IndividualInfo } from 'bakong-khqr';
import QRCode from 'qrcode';
import axios from 'axios';

const router = express.Router();

// Optional Data
const optionalData = {
  currency: khqrData.currency.usd,
  amount: 0.1,
  mobileNumber: '85586294990',
  storeLabel: 'SkillBloom',
  terminalLabel: 'Cashier_1',
};

// Static token — Replace this with secure handling (env vars, etc.)
const BAKONG_BEARER_TOKEN = 'eyJhbGciOi...your_token_here...'; // shorten here for clarity

// Generate QR Endpoint
router.post('/', async (req, res) => {
  try {
    const individualInfo = new IndividualInfo(
      'peng_lykhim@aclb',
      'Peng Lykhim',
      'PHNOM PENH',
      optionalData
    );

    const KHQR = new BakongKHQR();
    const individual = KHQR.generateIndividual(individualInfo);

    const qr = individual.data.qr;
    const md5 = individual.data.md5;

    const qrImage = await QRCode.toDataURL(qr);

    console.log('KHQR:', qr);
    console.log('MD5:', md5);

    // Optionally check payment right away (disabled by default)
    // const checkResult = await checkTransaction(md5);

    res.json({ qr: qrImage, amount: optionalData.amount, md5 });
  } catch (error) {
    console.error('Error generating KHQR:', error);
    res.status(500).json({ error: 'QR generation failed' });
  }
});

// Optional: Transaction check function
async function checkTransaction(md5) {
  const endpoint = 'https://api-bakong.nbc.gov.kh/v1/check_transaction_by_md5';
  try {
    const response = await axios.post(
      endpoint,
      { md5_check: md5 },
      {
        headers: {
          Authorization: `Bearer ${BAKONG_BEARER_TOKEN}`,
          'Content-Type': 'application/json',
        },
      }
    );

    console.log('Transaction Check Response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error checking transaction:', error.response?.data || error.message);
    return { error: true };
  }
}

export default router;
