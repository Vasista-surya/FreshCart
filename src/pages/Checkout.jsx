import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMapPin, FiPhone, FiUser, FiCheck, FiPlus, FiTag, FiX, FiCreditCard, FiArrowRight } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import * as api from '../services/api';

const Checkout = () => {
  const { user, updateProfile } = useAuth();
  const { items, subtotal, tax, deliveryCharge, discount, total, coupon, applyCoupon, removeCoupon, clearCart } = useCart();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [addresses, setAddresses] = useState(user?.addresses || []);
  const [selectedAddressId, setSelectedAddressId] = useState(
    addresses.find((addr) => addr.isDefault)?._id || addresses[0]?._id || ''
  );

  const [showAddressForm, setShowAddressForm] = useState(false);
  const [addressForm, setAddressForm] = useState({
    name: '',
    phone: '',
    street: '',
    city: '',
    state: '',
    pincode: '',
    isDefault: false,
  });

  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [couponCode, setCouponCode] = useState('');
  const [loading, setLoading] = useState(false);

  // Sync addresses on user object change
  useEffect(() => {
    if (user?.addresses) {
      setAddresses(user.addresses);
      if (!selectedAddressId && user.addresses.length > 0) {
        setSelectedAddressId(user.addresses.find((a) => a.isDefault)?._id || user.addresses[0]._id);
      }
    }
  }, [user, selectedAddressId]);

  const handleAddressChange = (e) => {
    setAddressForm({ ...addressForm, [e.target.name]: e.target.value });
  };

  const handleAddAddress = async (e) => {
    e.preventDefault();
    const { name, phone, street, city, state, pincode } = addressForm;
    if (!name || !phone || !street || !city || !state || !pincode) {
      showToast('Please fill in all address fields', 'warning');
      return;
    }

    try {
      setLoading(true);
      const { data } = await api.addAddress(addressForm);
      setAddresses(data.addresses || []);
      // If there's a new address, set it as selected
      const newAddress = data.addresses[data.addresses.length - 1];
      if (newAddress) setSelectedAddressId(newAddress._id);

      // Trigger profile refresh in AuthContext
      const profileRes = await api.getProfile();
      localStorage.setItem('user', JSON.stringify(profileRes.data.user));

      showToast('Address added successfully!', 'success');
      setShowAddressForm(false);
      setAddressForm({ name: '', phone: '', street: '', city: '', state: '', pincode: '', isDefault: false });
    } catch (err) {
      showToast('Failed to add address', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handlePlaceOrder = async () => {
    if (!selectedAddressId) {
      showToast('Please select or add a delivery address', 'warning');
      return;
    }

    const shippingAddress = addresses.find((addr) => addr._id === selectedAddressId);
    if (!shippingAddress) {
      showToast('Selected address is invalid', 'error');
      return;
    }

    try {
      setLoading(true);
      const orderData = {
        shippingAddress: {
          name: shippingAddress.name,
          phone: shippingAddress.phone,
          street: shippingAddress.street,
          city: shippingAddress.city,
          state: shippingAddress.state,
          pincode: shippingAddress.pincode,
        },
        paymentMethod,
        couponCode: coupon?.code || null,
        items: items.map((item) => ({
          product: item.product?._id || item.productId,
          name: item.product?.name,
          image: item.product?.image,
          price: item.product?.price,
          quantity: item.quantity,
          unit: item.product?.unit,
          weight: item.product?.weight,
        })),
      };

      const { data } = await api.createOrder(orderData);
      showToast('Order placed successfully!', 'success');
      await clearCart(); // Empty cart
      navigate(`/order-confirmation/${data.order?._id || data.order?.id}`);
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to place order. Try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-3">Checkout is Empty</h2>
        <Link to="/products" className="text-brand-primary font-semibold hover:underline">
          Go Shop Essentials
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-light py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-8">Secure Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Address & Payment */}
          <div className="lg:col-span-2 space-y-6">
            {/* Delivery Address Box */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <FiMapPin className="text-brand-primary" /> Delivery Address
                </h2>
                {!showAddressForm && (
                  <button
                    onClick={() => setShowAddressForm(true)}
                    className="text-xs sm:text-sm font-semibold text-brand-primary hover:text-brand-accent flex items-center gap-1 bg-brand-primary/5 px-3 py-1.5 rounded-lg transition-colors"
                  >
                    <FiPlus size={14} /> Add Address
                  </button>
                )}
              </div>

              {/* Show Form */}
              <AnimatePresence>
                {showAddressForm && (
                  <motion.form
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    onSubmit={handleAddAddress}
                    className="bg-brand-light p-4 rounded-xl border border-gray-100 mb-6 space-y-4 overflow-hidden"
                  >
                    <h3 className="font-bold text-sm text-gray-700">New Delivery Address</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-gray-500 mb-1">Contact Name *</label>
                        <input
                          type="text"
                          name="name"
                          value={addressForm.name}
                          onChange={handleAddressChange}
                          placeholder="e.g. Rahul Kumar"
                          className="w-full text-sm border border-gray-200 rounded-lg p-2 bg-white"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-500 mb-1">Phone Number *</label>
                        <input
                          type="tel"
                          name="phone"
                          value={addressForm.phone}
                          onChange={handleAddressChange}
                          placeholder="e.g. 9876543210"
                          className="w-full text-sm border border-gray-200 rounded-lg p-2 bg-white"
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 mb-1">Street Address *</label>
                      <input
                        type="text"
                        name="street"
                        value={addressForm.street}
                        onChange={handleAddressChange}
                        placeholder="House No, Road, Locality"
                        className="w-full text-sm border border-gray-200 rounded-lg p-2 bg-white"
                        required
                      />
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-gray-500 mb-1">City *</label>
                        <input
                          type="text"
                          name="city"
                          value={addressForm.city}
                          onChange={handleAddressChange}
                          placeholder="Noida"
                          className="w-full text-sm border border-gray-200 rounded-lg p-2 bg-white"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-500 mb-1">State *</label>
                        <input
                          type="text"
                          name="state"
                          value={addressForm.state}
                          onChange={handleAddressChange}
                          placeholder="Uttar Pradesh"
                          className="w-full text-sm border border-gray-200 rounded-lg p-2 bg-white"
                          required
                        />
                      </div>
                      <div className="col-span-2 sm:col-span-1">
                        <label className="block text-xs font-semibold text-gray-500 mb-1">Pincode *</label>
                        <input
                          type="text"
                          name="pincode"
                          value={addressForm.pincode}
                          onChange={handleAddressChange}
                          placeholder="201301"
                          className="w-full text-sm border border-gray-200 rounded-lg p-2 bg-white"
                          required
                        />
                      </div>
                    </div>
                    <label className="flex items-center gap-2 cursor-pointer pt-1">
                      <input
                        type="checkbox"
                        checked={addressForm.isDefault}
                        onChange={(e) => setAddressForm({ ...addressForm, isDefault: e.target.checked })}
                        className="w-4 h-4 text-brand-primary rounded border-gray-300"
                      />
                      <span className="text-xs font-medium text-gray-600">Set as default address</span>
                    </label>
                    <div className="flex gap-2 justify-end pt-2">
                      <button
                        type="button"
                        onClick={() => setShowAddressForm(false)}
                        className="px-4 py-2 border rounded-lg text-sm font-semibold hover:bg-white text-gray-500"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={loading}
                        className="px-4 py-2 bg-brand-primary text-white rounded-lg text-sm font-semibold hover:bg-brand-accent"
                      >
                        {loading ? 'Adding...' : 'Save Address'}
                      </button>
                    </div>
                  </motion.form>
                )}
              </AnimatePresence>

              {/* Address List */}
              {addresses.length === 0 ? (
                <div className="text-center py-8 border-2 border-dashed border-gray-100 rounded-xl">
                  <p className="text-gray-400 text-sm">No delivery address saved yet. Please add one above.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {addresses.map((addr) => {
                    const isSelected = addr._id === selectedAddressId;
                    return (
                      <div
                        key={addr._id}
                        onClick={() => setSelectedAddressId(addr._id)}
                        className={`border rounded-xl p-4 cursor-pointer flex gap-4 items-start transition-all ${
                          isSelected
                            ? 'border-brand-primary bg-green-50/30 shadow-sm'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div
                          className={`w-5 h-5 rounded-full border flex items-center justify-center mt-0.5 flex-shrink-0 ${
                            isSelected ? 'border-brand-primary bg-brand-primary text-white' : 'border-gray-300 bg-white'
                          }`}
                        >
                          {isSelected && <FiCheck size={12} />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-bold text-gray-800 text-sm">{addr.name}</span>
                            {addr.isDefault && (
                              <span className="text-[10px] bg-brand-primary/10 text-brand-primary font-bold px-2 py-0.5 rounded-full border border-brand-primary/10">
                                Default
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                            <FiPhone size={12} /> {addr.phone}
                          </p>
                          <p className="text-xs text-gray-600 mt-1.5 leading-relaxed">
                            {addr.street}, {addr.city}, {addr.state} - <span className="font-semibold">{addr.pincode}</span>
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Payment Method Selection */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2 mb-6">
                <FiCreditCard className="text-brand-primary" /> Payment Method
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  { id: 'COD', name: 'Cash on Delivery', desc: 'Pay when groceries arrive' },
                  { id: 'Card', name: 'Credit / Debit Card', desc: 'Pay with saved cards' },
                  { id: 'UPI', name: 'UPI / NetBanking', desc: 'Scan and pay instantly' },
                ].map((pay) => {
                  const isSelected = pay.id === paymentMethod;
                  return (
                    <div
                      key={pay.id}
                      onClick={() => setPaymentMethod(pay.id)}
                      className={`border rounded-xl p-4 cursor-pointer flex flex-col justify-between transition-all ${
                        isSelected
                          ? 'border-brand-primary bg-green-50/30 shadow-sm'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-bold text-gray-800 text-sm">{pay.name}</span>
                        <div
                          className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                            isSelected ? 'border-brand-primary bg-brand-primary text-white' : 'border-gray-300 bg-white'
                          }`}
                        >
                          {isSelected && <FiCheck size={10} />}
                        </div>
                      </div>
                      <span className="text-[11px] text-gray-400 leading-normal">{pay.desc}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Column: Order summary & totals */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm sticky top-24">
              <h2 className="text-lg font-bold text-gray-900 mb-4 border-b pb-3">Review Items</h2>

              {/* Mini Item List */}
              <div className="space-y-3 max-h-40 overflow-y-auto pr-1 mb-5">
                {items.map((item, idx) => {
                  const product = item.product || item;
                  return (
                    <div key={product._id || idx} className="flex gap-3 justify-between items-center text-xs">
                      <img
                        src={product.image}
                        alt=""
                        className="w-10 h-10 object-contain rounded bg-gray-50 border p-1"
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/50x50?text=Item';
                        }}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-800 truncate">{product.name}</p>
                        <p className="text-gray-400 mt-0.5">
                          {item.quantity} x ₹{product.price}
                        </p>
                      </div>
                      <span className="font-bold text-gray-700">₹{(product.price * item.quantity).toFixed(2)}</span>
                    </div>
                  );
                })}
              </div>

              {/* Coupon Discount */}
              <div className="mb-6 pt-3 border-t border-gray-50">
                {coupon ? (
                  <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-xl p-3">
                    <div className="flex items-center gap-2">
                      <FiTag className="text-green-600 animate-pulse" />
                      <div>
                        <span className="text-xs font-bold text-green-700">{coupon.code}</span>
                        <p className="text-[10px] text-green-600">Coupon discount applied</p>
                      </div>
                    </div>
                    <button onClick={removeCoupon} className="text-green-600 hover:text-green-800">
                      <FiX size={16} />
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                      placeholder="Enter promo code"
                      className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-brand-primary"
                    />
                    <button
                      onClick={() => applyCoupon(couponCode)}
                      disabled={loading || !couponCode.trim()}
                      className="bg-brand-primary text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-brand-accent transition-colors disabled:opacity-50"
                    >
                      Apply
                    </button>
                  </div>
                )}
              </div>

              {/* Invoice breakdown */}
              <div className="space-y-3 text-sm pt-4 border-t border-gray-100">
                <div className="flex justify-between text-gray-500">
                  <span>Subtotal</span>
                  <span>₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-500">
                  <span>Tax (GST 5%)</span>
                  <span>₹{tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-500">
                  <span>Delivery Charge</span>
                  <span>{deliveryCharge === 0 ? <span className="text-green-600 font-bold">FREE</span> : `₹${deliveryCharge}`}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-green-600 font-bold bg-green-50/50 px-2 py-1 rounded">
                    <span>Discount</span>
                    <span>-₹{discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between font-black text-xl text-gray-900 border-t pt-3 mt-3">
                  <span>Total Amount</span>
                  <span>₹{total.toFixed(2)}</span>
                </div>
              </div>

              {/* Order Button */}
              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={handlePlaceOrder}
                disabled={loading}
                className="w-full mt-6 bg-brand-primary text-white py-4 rounded-xl font-bold hover:bg-brand-accent transition-colors shadow-lg shadow-brand-primary/20 flex items-center justify-center gap-2 text-sm disabled:opacity-50"
              >
                {loading ? 'Processing Order...' : 'Place Order Now'} <FiArrowRight />
              </motion.button>

              <p className="text-[10px] text-gray-400 text-center mt-3 leading-normal">
                Radhakrishna Store secures all transactions. By clicking Place Order, you agree to our delivery schedule.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
