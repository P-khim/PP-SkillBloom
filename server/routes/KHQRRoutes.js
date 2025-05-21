import express from 'express';
import { BakongKHQR, khqrData, IndividualInfo } from 'bakong-khqr';
import QRCode from 'qrcode';
import axios from 'axios';
import { PrismaClient } from '@prisma/client';
import { verifyToken } from '../middlewares/AuthMiddleware.js';

const prisma = new PrismaClient();
const router = express.Router();
const BAKONG_BEARER_TOKEN = process.env.BAKONG_BEARER_TOKEN;

// --- Check Transaction Status ---
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

// --- Polling Function ---
async function pollTransactionUntilSuccess(md5, maxAttempts = 30, interval = 10000) {
  let attempt = 0;

  while (attempt < maxAttempts) {
    const result = await checkTransaction(md5);

    if (result?.responseCode === 0 && result?.data) {
      return { success: true, data: result.data };
    }

    console.log(`⏳ Attempt ${attempt + 1}: Not successful yet.`);
    await new Promise(resolve => setTimeout(resolve, interval));
    attempt++;
  }

  return { success: false, message: 'Timeout: No success status within 5 minutes.' };
}

// --- KHQR Payment Route ---
router.post('/', verifyToken, async (req, res) => {
  try {
    const { gigId } = req.body;
    const buyerId = req.userId;

    if (!gigId) {
      return res.status(400).json({ error: 'gigId is required' });
    }

    // Fetch gig price
    const gig = await prisma.gigs.findUnique({
      where: { id: Number(gigId) },
      select: { price: true },
    });

    if (!gig) {
      return res.status(404).json({ error: 'Gig not found' });
    }

    const amountFromDB = gig.price;

    // Prepare QR Code Data
    const optionalData = {
      currency: khqrData.currency.usd,
      amount: amountFromDB,
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

    // Send QR code to client
    res.status(200).json({ qr: qrImage, amount: amountFromDB, md5 });

    // Start polling in background
    const result = await pollTransactionUntilSuccess(md5);

    if (result.success) {
      console.log('🎉 Payment Success!', result.data);

      await prisma.orders.create({
        data: {
          buyerId: Number(buyerId),
          gigId: Number(gigId),
          price: amountFromDB,
          paymentIntent: md5,
          isCompleted: true,
          createdAt: new Date(),
        },
      });

      console.log('✅ Payment saved to DB');
    } else {
      console.log('❌ Payment not completed within time window.');
    }

  } catch (error) {
    console.error('❌ Error generating KHQR:', error);
    res.status(500).json({ error: 'QR generation failed' });
  }
});

export default router;
