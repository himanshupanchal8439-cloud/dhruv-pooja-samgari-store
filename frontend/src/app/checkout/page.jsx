'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/client';
import { loadRazorpayScript } from '../../utils/loadRazorpay';
import { useLanguage } from '../../context/LanguageContext';

const emptyAddress = { line1: '', line2: '', city: '', state: '', pincode: '', phone: '' };

export default function Checkout() {
  const { items, subtotal, clearCart } = useCart();
  const { user, refreshUser } = useAuth();
  const { t } = useLanguage();
  const router = useRouter();
  const [address, setAddress] = useState(emptyAddress);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [saveAddress, setSaveAddress] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState('razorpay');
  const [couponCode, setCouponCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [couponMsg, setCouponMsg] = useState('');
  const [placing, setPlacing] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user?.addresses?.length) return;
    const defaultAddr = user.addresses.find((a) => a.isDefault) || user.addresses[0];
    selectSavedAddress(defaultAddr);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  function selectSavedAddress(a) {
    setSelectedAddressId(a._id);
    setAddress({ line1: a.line1 || '', line2: a.line2 || '', city: a.city || '', state: a.state || '', pincode: a.pincode || '', phone: a.phone || '' });
  }

  function useNewAddress() {
    setSelectedAddressId('new');
    setAddress(emptyAddress);
  }

  const shippingFee = subtotal - discount > 999 ? 0 : 79;
  const total = subtotal - discount + shippingFee;

  async function applyCoupon() {
    setCouponMsg('');
    try {
      const res = await api.post('/coupons/validate', { code: couponCode, subtotal });
      setDiscount(res.data.discount);
      setCouponMsg(`Coupon applied: -₹${res.data.discount.toFixed(0)}`);
    } catch (err) {
      setDiscount(0);
      setCouponMsg(err.response?.data?.message || 'Invalid coupon');
    }
  }

  async function finalizeOrder(paymentFields = {}) {
    const orderItems = items.map((i) => ({ product: i.product, quantity: i.quantity, variant: i.variant }));

    if ((selectedAddressId === 'new' || !selectedAddressId) && saveAddress) {
      try {
        await api.post('/users/me/addresses', { ...address, isDefault: !user.addresses?.length });
        await refreshUser();
      } catch {
        // non-critical: proceed with order even if saving the address fails
      }
    }

    const res = await api.post('/orders', {
      items: orderItems,
      shippingAddress: address,
      paymentMethod,
      couponCode: couponCode || undefined,
      ...paymentFields,
    });
    clearCart();
    router.push(`/account/orders/${res.data._id}`);
  }

  async function handlePlaceOrder(e) {
    e.preventDefault();
    if (!user) return router.push('/login');

    setPlacing(true);
    setError('');
    try {
      if (paymentMethod === 'cod') {
        await finalizeOrder();
        return;
      }

      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        setError('Unable to load payment gateway. Check your connection.');
        return;
      }

      const { data } = await api.post('/payments/create-order', { amount: total });

      const rzp = new window.Razorpay({
        key: data.keyId,
        amount: data.amount,
        currency: data.currency,
        order_id: data.orderId,
        name: 'Vashishtha Spiritual Store',
        description: 'Order Payment',
        prefill: { name: user.name, email: user.email },
        handler: async (response) => {
          try {
            await finalizeOrder({
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
            });
          } catch (err) {
            setError(err.response?.data?.message || 'Order confirmation failed');
          }
        },
        modal: {
          ondismiss: () => setPlacing(false),
        },
        theme: { color: '#ff7a1a' },
      });
      rzp.open();
    } catch (err) {
      setError(err.response?.data?.message || 'Order failed');
    } finally {
      setPlacing(false);
    }
  }

  return (
    <section className="section checkout-page">
      <h2>{t('checkout')}</h2>
      <form onSubmit={handlePlaceOrder} className="checkout-grid">
        <div className="checkout-card">
          <h3 className="checkout-section-title">{t('shippingAddress')}</h3>

          {user?.addresses?.length > 0 && (
            <div className="saved-address-list">
              {user.addresses.map((a) => (
                <label key={a._id} className={`saved-address-option ${selectedAddressId === a._id ? 'active' : ''}`}>
                  <input type="radio" name="savedAddress" checked={selectedAddressId === a._id} onChange={() => selectSavedAddress(a)} />
                  <div>
                    <strong>{a.label || 'Address'}</strong>
                    {a.isDefault && <span className="address-default-tag-inline">Default</span>}
                    <p>
                      {a.line1}
                      {a.line2 ? `, ${a.line2}` : ''}, {a.city}, {a.state} - {a.pincode}
                    </p>
                  </div>
                </label>
              ))}
              <label className={`saved-address-option ${selectedAddressId === 'new' ? 'active' : ''}`}>
                <input type="radio" name="savedAddress" checked={selectedAddressId === 'new'} onChange={useNewAddress} />
                <div>
                  <strong>{t('useNewAddr')}</strong>
                </div>
              </label>
            </div>
          )}

          {(selectedAddressId === 'new' || !user?.addresses?.length) && (
            <div className="checkout-form">
              <input placeholder={t('addr1')} required value={address.line1} onChange={(e) => setAddress({ ...address, line1: e.target.value })} />
              <input placeholder={t('addr2')} value={address.line2} onChange={(e) => setAddress({ ...address, line2: e.target.value })} />
              <div className="checkout-form-row">
                <input placeholder={t('city')} required value={address.city} onChange={(e) => setAddress({ ...address, city: e.target.value })} />
                <input placeholder={t('state')} required value={address.state} onChange={(e) => setAddress({ ...address, state: e.target.value })} />
              </div>
              <div className="checkout-form-row">
                <input placeholder={t('pincode')} required value={address.pincode} onChange={(e) => setAddress({ ...address, pincode: e.target.value })} />
                <input placeholder={t('phone')} required value={address.phone} onChange={(e) => setAddress({ ...address, phone: e.target.value })} />
              </div>
              {user && (
                <label className="address-default-check">
                  <input type="checkbox" checked={saveAddress} onChange={(e) => setSaveAddress(e.target.checked)} />
                  {t('saveAddr')}
                </label>
              )}
            </div>
          )}

          <h3 className="checkout-section-title">{t('paymentMethod')}</h3>
          <div className="payment-method">
            <label className={`payment-option ${paymentMethod === 'razorpay' ? 'active' : ''}`}>
              <input type="radio" name="pm" checked={paymentMethod === 'razorpay'} onChange={() => setPaymentMethod('razorpay')} />
              <i className="fa-solid fa-credit-card" />
              <span>{t('payOnline')}</span>
            </label>
            <label className={`payment-option ${paymentMethod === 'cod' ? 'active' : ''}`}>
              <input type="radio" name="pm" checked={paymentMethod === 'cod'} onChange={() => setPaymentMethod('cod')} />
              <i className="fa-solid fa-hand-holding-dollar" />
              <span>{t('cod')}</span>
            </label>
          </div>
        </div>

        <div className="checkout-card checkout-summary-card">
          <h3 className="checkout-section-title">{t('orderSummary')}</h3>

          <div className="coupon-row">
            <input placeholder={t('couponCode')} value={couponCode} onChange={(e) => setCouponCode(e.target.value)} />
            <button type="button" onClick={applyCoupon}>
              {t('apply')}
            </button>
          </div>
          {couponMsg && <p className="coupon-msg">{couponMsg}</p>}

          <div className="checkout-summary-lines">
            <div className="checkout-summary-line">
              <span>{t('subtotal')}</span>
              <span>₹{subtotal}</span>
            </div>
            {discount > 0 && (
              <div className="checkout-summary-line checkout-summary-discount">
                <span>{t('discount')}</span>
                <span>-₹{discount.toFixed(0)}</span>
              </div>
            )}
            <div className="checkout-summary-line">
              <span>{t('shipping')}</span>
              <span>{shippingFee === 0 ? t('free') : `₹${shippingFee}`}</span>
            </div>
            <div className="checkout-summary-line checkout-summary-total">
              <span>{t('total')}</span>
              <span>₹{total.toFixed(0)}</span>
            </div>
          </div>

          {error && <p className="error">{error}</p>}

          <button className="btn-primary checkout-submit" type="submit" disabled={placing}>
            {placing ? t('processing') : paymentMethod === 'cod' ? t('placeOrderCod') : t('payPlace')}
          </button>
        </div>
      </form>
    </section>
  );
}
