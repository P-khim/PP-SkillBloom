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
          setError('Payment failed, please try again.');
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
            <p>Loading payment information...</p>
          </div>
        )}

        {error && (
          <div style={{ color: 'red', marginTop: '20px' }}>
            <p>❌ {error}</p>
          </div>
        )}

        {paymentData && (
          <div>
            <h3>✅ Payment Created Successfully!</h3>
            <p><strong>Status:</strong> {paymentData.status.message}</p>
            <p><strong>Transaction ID:</strong> {paymentData.status.tran_id}</p>
            <p><strong>Description:</strong> {paymentData.description}</p>

            <h4>Scan this QR Code:</h4>
            <img
              src={paymentData.qrImage}
              alt="QR Code"
              style={{ width: '250px', height: '250px', marginTop: '10px' }}
            />

            <div style={{ marginTop: '20px' }}>
              <a
                href={paymentData.abapay_deeplink}
                style={{
                  backgroundColor: '#28a745',
                  color: 'white',
                  padding: '10px 20px',
                  textDecoration: 'none',
                  borderRadius: '5px'
                }}
              >
                Open in ABA App
              </a>
            </div>

            <div style={{ marginTop: '15px' }}>
              <a href={paymentData.app_store} target="_blank" rel="noopener noreferrer">App Store</a> |{' '}
              <a href={paymentData.play_store} target="_blank" rel="noopener noreferrer">Play Store</a>
            </div>
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
};

export default PaymentModal;
