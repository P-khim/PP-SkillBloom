// @ts-nocheck
import React, { useEffect, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import axios from "axios";
import { CREATE_ORDER } from "../utils/constants";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from "../components/CheckoutForm";
import { useRouter } from "next/router";
import PaymentModal from "../components/PaymentModal";

const stripePromise = loadStripe("pk_test_51REiyXCvyJcIgd5qZy4TwbLBtpQZvV5aQVWKgW1Dk3eSeoLlM6m1RorljyJEw1k2DXI1zhsKU4aw1u5S7lBPP99900j68K3dI3");

function Checkout() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [clientSecret, setClientSecret] = useState("");
  const router = useRouter();
  const { gigId } = router.query;
  useEffect(() => {
    const createOrderIntent = async () => {
      const { data } = await axios.post(
        CREATE_ORDER,
        { gigId },
        { withCredentials: true }
      );
      setClientSecret(data.clientSecret);
    };
    if (gigId) createOrderIntent();
  }, [gigId]);

  const appearance = {
    theme: "stripe",
  };
  const options = {
    clientSecret,
    appearance,
  };

  const handleKHQRButton = () => {
    setIsModalOpen(true);
  }

  return (
    <div className="min-h-[80vh] max-w-full mx-20 mt-32 flex flex-col gap-10 items-center">
      <h1 className="text-3xl">
        Please complete the payment to place the order.
      </h1>
      {clientSecret && (
        <Elements options={options} stripe={stripePromise}>
          <CheckoutForm />
        </Elements>
      )}
      <button onClick={handleKHQRButton} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-full">Pay by KHQR</button>
      <PaymentModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
   
  );
}

export default Checkout;
