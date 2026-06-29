import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiCheck, FiStar, FiZap } from 'react-icons/fi';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import toast from 'react-hot-toast';
import api from '../utils/api.js';
import { useAuth } from '../context/AuthContext.jsx';
import { useNavigate } from 'react-router-dom';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const CARD_STYLE = {
  style: {
    base: { fontSize: '16px', color: '#1f2937', '::placeholder': { color: '#9ca3af' }, fontFamily: 'Inter, sans-serif' },
    invalid: { color: '#ef4444' }
  }
};

const perks = [
  'Unlimited recipe uploads',
  'Premium profile badge',
  'Priority support',
  'Featured recipe eligibility',
  'Early access to new features',
  'Ad-free experience',
];

function CheckoutForm() {
  const stripe = useStripe();
  const elements = useElements();
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;
    setLoading(true);

    try {
      // Create payment intent
      const intentRes = await api.post('/payments/create-payment-intent', { amount: 999, type: 'premium' });
      const { clientSecret } = intentRes.data;

      // Confirm payment
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
          billing_details: { name: user?.name, email: user?.email }
        }
      });

      if (result.error) {
        toast.error(result.error.message);
        return;
      }

      // Save to DB
      await api.post('/payments/confirm', {
        transactionId: result.paymentIntent.id,
        amount: result.paymentIntent.amount,
        type: 'premium'
      });

      updateUser({ isPremium: true });
      toast.success('🎉 Welcome to Premium!');
      navigate('/payment/success');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="p-4 border-2 border-gray-200 dark:border-dark-border rounded-xl bg-gray-50 dark:bg-dark-border">
        <CardElement options={CARD_STYLE} />
      </div>
      <p className="text-xs text-gray-400 text-center">
        Test card: <strong>4242 4242 4242 4242</strong> · Any future date · Any CVC
      </p>
      <button type="submit" disabled={!stripe || loading}
        className="btn-primary w-full py-4 text-base flex items-center justify-center gap-2">
        <FiZap />
        {loading ? 'Processing Payment...' : 'Upgrade Now — $9.99'}
      </button>
    </form>
  );
}

export default function PremiumPage() {
  const { user } = useAuth();

  if (user?.isPremium) {
    return (
      <div className="max-w-xl mx-auto text-center py-20">
        <div className="text-6xl mb-4">⭐</div>
        <h1 className="font-display text-3xl font-bold text-gray-900 dark:text-white mb-3">You're Already Premium!</h1>
        <p className="text-gray-500 dark:text-gray-400">Enjoy all your premium benefits and unlimited recipe uploads.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-center">
        <div className="inline-flex items-center gap-2 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 px-4 py-2 rounded-full text-sm font-semibold mb-4">
          <FiStar /> Premium Membership
        </div>
        <h1 className="font-display text-4xl font-bold text-gray-900 dark:text-white mb-3">Unlock the Full Experience</h1>
        <p className="text-gray-500 dark:text-gray-400 max-w-lg mx-auto">One-time payment. Lifetime access. Take your cooking journey to the next level.</p>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Perks */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}
          className="card p-6"
        >
          <h2 className="font-display text-xl font-bold text-gray-900 dark:text-white mb-5">What you get</h2>
          <ul className="space-y-3">
            {perks.map(perk => (
              <li key={perk} className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center shrink-0">
                  <FiCheck className="text-green-600 text-xs" />
                </div>
                <span className="text-gray-700 dark:text-gray-300 text-sm">{perk}</span>
              </li>
            ))}
          </ul>

          <div className="mt-6 pt-5 border-t border-gray-100 dark:border-dark-border">
            <div className="flex items-baseline gap-1">
              <span className="font-display text-4xl font-black text-gray-900 dark:text-white">$9.99</span>
              <span className="text-gray-500 dark:text-gray-400 text-sm">one-time</span>
            </div>
            <p className="text-xs text-gray-400 mt-1">No subscription. No hidden fees.</p>
          </div>
        </motion.div>

        {/* Payment Form */}
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}
          className="card p-6"
        >
          <h2 className="font-display text-xl font-bold text-gray-900 dark:text-white mb-2">Payment Details</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-5">Secured by Stripe · 256-bit SSL</p>

          <Elements stripe={stripePromise}>
            <CheckoutForm />
          </Elements>

          <p className="text-xs text-center text-gray-400 mt-4">
            🔒 Your payment information is encrypted and secure.
          </p>
        </motion.div>
      </div>
    </div>
  );
}