import express from 'express';
import { BakongKHQR, khqrData, IndividualInfo } from 'bakong-khqr';
import QRCode from 'qrcode';
import axios from 'axios';
import { PrismaClient } from '@prisma/client';
import { verifyToken } from '../middlewares/AuthMiddleware.js';

const prisma = new PrismaClient();
const router = express.Router();
const BAKONG_BEARER_TOKEN = process.env.BAKONG_BEARER_TOKEN;

// Helper: Check transaction by md5
async function checkTransaction(md5) {
  const endpoint = 'https://api-bakong.nbc.gov.kh/v1/check_transaction_by_md5';
  try {
    const response = await axios.post(
      endpoint,
      { md5 },
      {
        headers: {
          Authorization: `Bearer ${BAKONG_BEARER_TOKEN}`,
          'Content-Type': 'application/json',
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('🔴 Error checking transaction:', error.response?.data || error.message);
    return { error: true };
  }
}

// Poll transaction status until success or timeout
async function pollTransactionUntilSuccess(md5, maxAttempts = 30, interval = 10000) {
  let attempt = 0;

  while (attempt < maxAttempts) {
    const result = await checkTransaction(md5);

    if (result?.responseCode === 0 && result?.data) {
      return { success: true, data: result.data };
    }

    console.log(`⏳ Attempt ${attempt + 1}: Still waiting...`);
    await new Promise(resolve => setTimeout(resolve, interval));
    attempt++;
  }

  return { success: false, message: 'Timeout after 5 minutes.' };
}

// ✅ KHQR Payment Initialization Route
router.post('/', verifyToken, async (req, res) => {
  try {
    const { gigId } = req.body;
    const buyerId = req.userId;

    if (!gigId) return res.status(400).json({ error: 'gigId is required' });

    const gig = await prisma.gigs.findUnique({
      where: { id: Number(gigId) },
      select: { price: true },
    });

    if (!gig) return res.status(404).json({ error: 'Gig not found' });

    const amount = gig.price;

    const optionalData = {
      currency: khqrData.currency.usd,
      amount,
      mobileNumber: '85586294990',
      storeLabel: 'SkillBloom',
      terminalLabel: 'Cashier_1',
    };

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

    // Save pending order
    await prisma.orders.create({
      data: {
        buyerId: Number(buyerId),
        gigId: Number(gigId),
        price: amount,
        paymentIntent: md5,
        isCompleted: false,
        createdAt: new Date(),
      },
    });

    // Send QR & md5 to frontend
    res.status(200).json({ qr: qrImage, amount, md5 });

    // Start background polling to confirm payment
    (async () => {
      const result = await pollTransactionUntilSuccess(md5);

      if (result.success) {
        await prisma.orders.update({
          where: { paymentIntent: md5 },
          data: { isCompleted: true },
        });
        console.log('✅ Payment confirmed & order updated');
      } else {
        console.log('❌ KHQR payment not confirmed in time.');
      }
    })();

  } catch (error) {
    console.error('❌ KHQR Error:', error);
    res.status(500).json({ error: 'QR generation failed' });
  }
});

// ✅ Status Check Route (used by frontend to detect completion)
router.get('/status', verifyToken, async (req, res) => {
  const { md5 } = req.query;
  if (!md5) return res.status(400).json({ success: false });

  try {
    const order = await prisma.orders.findUnique({
      where: { paymentIntent: md5 },
      select: { isCompleted: true },
    });

    if (!order) return res.status(404).json({ success: false });

    res.json({ success: order.isCompleted });
  } catch (err) {
    console.error('Status check error:', err);
    res.status(500).json({ success: false });
  }
});

export default router;
