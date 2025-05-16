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
    isOpen && (
      <div style={styles.modalOverlay} onClick={onClose}>
        <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
          <button style={styles.closeButton} onClick={onClose}>&times;</button>

          {loading && <p style={styles.message}>Loading Bakong QR Payment...</p>}
          {error && <p style={{ ...styles.message, color: 'red' }}>{error}</p>}

          {paymentData && (
            <div style={styles.khqrCard}>
              <div style={styles.khqrHeader}>
                <span style={styles.khqrHeaderText}>KHQR</span>
              </div>

              <div style={styles.khqrBody}>
                <p style={styles.label}>PENG LYKHIM</p>
                <p style={styles.amount}>{Number(paymentData.amount).toFixed(2)} <span style={styles.currency}>USD</span></p>

                <div style={styles.qrContainer}>
                  <img
                    src={paymentData.qr}
                    alt="Bakong QR Code"
                    style={styles.qrImage}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    )
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
  khqrCard: {
  backgroundColor: '#fff',
  borderRadius: '12px',
  boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
  overflow: 'hidden',
  textAlign: 'center',
  maxWidth: '300px',
  margin: 'auto',
  fontFamily: 'sans-serif',
},

khqrHeader: {
  backgroundColor: '#d52828',
  padding: '10px 0',
},

khqrHeaderText: {
  color: '#fff',
  fontWeight: 'bold',
  fontSize: '18px',
},

khqrBody: {
  padding: '20px',
},

label: {
  fontSize: '16px',
  marginBottom: '5px',
  color: '#555',
},

amount: {
  fontSize: '24px',
  fontWeight: 'bold',
  marginBottom: '10px',
},

currency: {
  fontSize: '14px',
  fontWeight: 'normal',
  color: '#777',
},

qrContainer: {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  marginTop: '10px',
},

qrImage: {
  width: '200px',
  height: '200px',
},

message: {
  marginTop: '30px',
  fontSize: '16px',
  color: '#333',
},

  
};

export default PaymentModal;
