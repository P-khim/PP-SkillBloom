import React, { useState, useEffect } from 'react';

const PaymentModal = ({ isOpen, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [paymentData, setPaymentData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      setPaymentData(null);
      setError(null);

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
          console.error('Payment error:', err);
          setError('❌ Payment failed, please try again.');
          setLoading(false);
        });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div style={styles.modalOverlay} onClick={onClose}>
      <div style={styles.modalContent} onClick={e => e.stopPropagation()}>
        <button style={styles.closeButton} onClick={onClose}>&times;</button>

        {loading && (
          <div style={{ marginTop: '30px' }}>
            <p>Loading Bakong QR Payment...</p>
          </div>
        )}

        {error && (
          <div style={{ color: 'red', marginTop: '20px' }}>
            <p>{error}</p>
          </div>
        )}

        {paymentData && (
          <div>
            <h3 style={{ marginBottom: '10px' }}>Scan to Pay with Bakong</h3>
            <p><strong>Amount:</strong> ${paymentData.amount}</p>
            <p><strong>MD5 Hash:</strong> {paymentData.md5}</p>

            <div style={styles.qrContainer}>
              <img
                src={paymentData.qr}
                alt="Bakong QR Code"
                style={styles.qrImage}
              />
            </div>

            <p style={{ marginTop: '10px', fontSize: '14px', color: '#555' }}>
              Open your Bakong-supported app and scan the QR to pay.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

// CSS-in-JS styles
const styles = {
  modalOverlay: {
    position: 'fixed',
    top: 0, left: 0,
    width: '100%', height: '100%',
    backgroundColor: 'rgba(0,0,0,0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
  modalContent: {
    backgroundColor: '#fff',
    width: '90%',
    maxWidth: '500px',
    padding: '20px',
    borderRadius: '10px',
    position: 'relative',
    textAlign: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: '10px',
    right: '15px',
    fontSize: '24px',
    cursor: 'pointer',
    border: 'none',
    background: 'none',
  },
  qrContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: '10px',
  },
  qrImage: {
    width: '250px',
    height: '250px',
  },
};

export default PaymentModal;
