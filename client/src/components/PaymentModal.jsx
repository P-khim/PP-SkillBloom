import React, { useState, useEffect } from 'react';

const PaymentModal = ({ isOpen, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [paymentData, setPaymentData] = useState(null);
  const [error, setError] = useState(null);
  const [paymentStatus, setPaymentStatus] = useState('pending');

  // Fetch QR on open
  useEffect(() => {
    if (!isOpen) return;

    setLoading(true);
    setPaymentData(null);
    setError(null);
    setPaymentStatus('pending');

    fetch('http://localhost:8747/api/checkout', {
      method: 'POST',
      credentials: 'include',
    })
      .then(res => res.json())
      .then(data => {
        setPaymentData(data);
        setLoading(false);
      })
      .catch(err => {
        setError('❌ Failed to generate QR.');
        setLoading(false);
      });
  }, [isOpen]);

  // Poll for payment status every 3 seconds
  useEffect(() => {
    if (!paymentData?.md5 || paymentStatus === 'completed') return;

    const interval = setInterval(() => {
      fetch(`http://localhost:8747/api/check-payment-status?md5=${paymentData.md5}`)
        .then(res => res.json())
        .then(data => {
          if (data.status === 'completed') {
            setPaymentStatus('completed');
            clearInterval(interval);
            setTimeout(() => onClose(), 2000); // Close modal after 2 seconds
          }
        })
        .catch(err => console.error("Polling error:", err));
    }, 3000);

    return () => clearInterval(interval);
  }, [paymentData, paymentStatus]);

  if (!isOpen) return null;

  return (
    <div style={styles.modalOverlay} onClick={onClose}>
      <div style={styles.modalContent} onClick={e => e.stopPropagation()}>
        <button style={styles.closeButton} onClick={onClose}>&times;</button>

        {loading && <p>Generating Bakong QR...</p>}
        {error && <p style={{ color: 'red' }}>{error}</p>}

        {paymentData && (
          <>
            <img
              src={paymentData.qr} // Full QR with branding baked into backend
              alt="Bakong QR"
              style={styles.qrImage}
            />
            <p><strong>Amount:</strong> ${paymentData.amount}</p>
            <p><strong>MD5:</strong> {paymentData.md5}</p>
            <p style={{ color: paymentStatus === 'completed' ? 'green' : '#555' }}>
              {paymentStatus === 'completed' ? '✅ Payment Successful' : 'Waiting for payment...'}
            </p>
          </>
        )}
      </div>
    </div>
  );
};

const styles = {
  modalOverlay: {
    position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
    backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex',
    justifyContent: 'center', alignItems: 'center', zIndex: 1000,
  },
  modalContent: {
    backgroundColor: '#fff', padding: 20, borderRadius: 12,
    maxWidth: 360, textAlign: 'center', position: 'relative',
  },
  closeButton: {
    position: 'absolute', top: 10, right: 15, fontSize: 24,
    border: 'none', background: 'transparent', cursor: 'pointer',
  },
  qrImage: {
    width: 280, height: 'auto', marginBottom: 10,
    borderRadius: 8, border: '1px solid #ccc',
  },
};

export default PaymentModal;
