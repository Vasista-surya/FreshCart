import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiUser, FiMail, FiPhone, FiMapPin, FiEdit3, FiPlus, FiCheck, FiChevronRight, FiPackage, FiHeart } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import * as api from '../services/api';

const Profile = () => {
  const { user, logout, updateProfile, showToast } = useAuth();
  const navigate = useNavigate();

  // State variables
  const [activeTab, setActiveTab] = useState('details'); // 'details' | 'addresses'
  const [isEditingDetails, setIsEditingDetails] = useState(false);
  const [detailsForm, setDetailsForm] = useState({
    name: '',
    email: '',
    phone: '',
  });
  const [loadingDetails, setLoadingDetails] = useState(false);

  // Address state
  const [addresses, setAddresses] = useState([]);
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState(null);
  const [addressForm, setAddressForm] = useState({
    name: '',
    phone: '',
    street: '',
    city: '',
    state: '',
    pincode: '',
    isDefault: false,
  });
  const [loadingAddress, setLoadingAddress] = useState(false);

  // Populate details on mount or user change
  useEffect(() => {
    if (user) {
      setDetailsForm({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
      });
      setAddresses(user.addresses || []);
    }
  }, [user]);

  // Fetch latest profile to ensure up-to-date addresses
  useEffect(() => {
    const fetchLatestProfile = async () => {
      try {
        const { data } = await api.getProfile();
        if (data.success && data.user) {
          setAddresses(data.user.addresses || []);
        }
      } catch (err) {
        console.error('Error fetching profile addresses:', err);
      }
    };
    fetchLatestProfile();
  }, []);

  const handleDetailsSubmit = async (e) => {
    e.preventDefault();
    setLoadingDetails(true);
    try {
      await updateProfile(detailsForm);
      setIsEditingDetails(false);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingDetails(false);
    }
  };

  const handleAddressSubmit = async (e) => {
    e.preventDefault();
    setLoadingAddress(true);
    try {
      const payload = {
        ...addressForm,
        addressId: editingAddressId,
      };
      const { data } = await api.addAddress(payload);
      if (data.success) {
        setAddresses(data.addresses);
        showToast(
          editingAddressId
            ? 'Address updated successfully!'
            : 'Address added successfully!',
          'success'
        );
        resetAddressForm();
      }
    } catch (err) {
      console.error(err);
      showToast(err.response?.data?.message || 'Failed to save address.', 'error');
    } finally {
      setLoadingAddress(false);
    }
  };

  const resetAddressForm = () => {
    setAddressForm({
      name: '',
      phone: '',
      street: '',
      city: '',
      state: '',
      pincode: '',
      isDefault: false,
    });
    setIsAddingAddress(false);
    setEditingAddressId(null);
  };

  const startEditAddress = (addr) => {
    setAddressForm({
      name: addr.name || '',
      phone: addr.phone || '',
      street: addr.street || '',
      city: addr.city || '',
      state: addr.state || '',
      pincode: addr.pincode || '',
      isDefault: addr.isDefault || false,
    });
    setEditingAddressId(addr._id);
    setIsAddingAddress(true);
  };

  return (
    <div className="min-h-screen bg-gray-50/50 py-12 px-4 sm:px-6 lg:px-8">
      {/* Devotional watermark background decoration */}
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row gap-8 items-start">
          
          {/* Left Column: Avatar Card & Navigation Tabs */}
          <div className="w-full md:w-80 bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex-shrink-0">
            <div className="flex flex-col items-center text-center pb-6 border-b border-gray-100">
              <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-emerald-400 to-emerald-600 flex items-center justify-center text-white text-3xl font-extrabold shadow-md mb-4 relative">
                {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-brand-primary rounded-full border-2 border-white flex items-center justify-center text-[10px]">
                  ॐ
                </div>
              </div>
              <h2 className="text-xl font-bold text-gray-900">{user?.name}</h2>
              <p className="text-xs text-gray-400 mt-1">{user?.email}</p>
              <div className="mt-3 px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-full tracking-wider uppercase">
                Premium Customer
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="mt-6 space-y-1.5">
              <button
                onClick={() => { setActiveTab('details'); resetAddressForm(); }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold transition-all ${
                  activeTab === 'details'
                    ? 'bg-emerald-50 text-emerald-700'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <FiUser size={16} />
                <span>Account Details</span>
                <FiChevronRight size={14} className="ml-auto opacity-60" />
              </button>

              <button
                onClick={() => { setActiveTab('addresses'); resetAddressForm(); }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold transition-all ${
                  activeTab === 'addresses'
                    ? 'bg-emerald-50 text-emerald-700'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <FiMapPin size={16} />
                <span>Manage Addresses</span>
                <FiChevronRight size={14} className="ml-auto opacity-60" />
              </button>

              <button
                onClick={() => navigate('/orders')}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-all"
              >
                <FiPackage size={16} />
                <span>My Orders</span>
                <FiChevronRight size={14} className="ml-auto opacity-60" />
              </button>

              <button
                onClick={() => navigate('/wishlist')}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-all"
              >
                <FiHeart size={16} />
                <span>My Wishlist</span>
                <FiChevronRight size={14} className="ml-auto opacity-60" />
              </button>
            </div>

            <div className="border-t border-gray-100 mt-6 pt-4">
              <button
                onClick={logout}
                className="w-full py-2.5 px-4 rounded-xl border border-red-100 text-red-600 hover:bg-red-50 text-sm font-bold transition-colors"
              >
                Log Out
              </button>
            </div>
          </div>

          {/* Right Column: Tab Content */}
          <div className="flex-1 w-full min-h-[400px]">
            <AnimatePresence mode="wait">
              {activeTab === 'details' && (
                <motion.div
                  key="details"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm"
                >
                  <div className="flex justify-between items-center pb-5 border-b border-gray-100 mb-6">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">Personal Information</h3>
                      <p className="text-xs text-gray-400 mt-1">Manage your basic contact settings</p>
                    </div>
                    {!isEditingDetails && (
                      <button
                        onClick={() => setIsEditingDetails(true)}
                        className="flex items-center gap-1.5 px-4 py-2 border border-gray-200 hover:border-emerald-500 hover:text-emerald-700 rounded-xl text-sm font-bold text-gray-600 transition-colors"
                      >
                        <FiEdit3 size={14} />
                        <span>Edit</span>
                      </button>
                    )}
                  </div>

                  <form onSubmit={handleDetailsSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Name */}
                      <div>
                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Full Name</label>
                        <div className="relative">
                          <FiUser className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                          <input
                            type="text"
                            value={detailsForm.name}
                            onChange={(e) => setDetailsForm({ ...detailsForm, name: e.target.value })}
                            className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl text-gray-800 text-sm font-medium focus:outline-none focus:bg-white focus:border-emerald-500 transition-all disabled:opacity-70"
                            disabled={!isEditingDetails || loadingDetails}
                            required
                          />
                        </div>
                      </div>

                      {/* Email */}
                      <div>
                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Email Address</label>
                        <div className="relative">
                          <FiMail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                          <input
                            type="email"
                            value={detailsForm.email}
                            onChange={(e) => setDetailsForm({ ...detailsForm, email: e.target.value })}
                            className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl text-gray-800 text-sm font-medium focus:outline-none focus:bg-white focus:border-emerald-500 transition-all disabled:opacity-70"
                            disabled={!isEditingDetails || loadingDetails}
                            required
                          />
                        </div>
                      </div>

                      {/* Phone */}
                      <div>
                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Phone Number</label>
                        <div className="relative">
                          <FiPhone className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                          <input
                            type="tel"
                            value={detailsForm.phone}
                            onChange={(e) => setDetailsForm({ ...detailsForm, phone: e.target.value })}
                            className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl text-gray-800 text-sm font-medium focus:outline-none focus:bg-white focus:border-emerald-500 transition-all disabled:opacity-70"
                            disabled={!isEditingDetails || loadingDetails}
                            placeholder="Add phone number"
                          />
                        </div>
                      </div>
                    </div>

                    {isEditingDetails && (
                      <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                        <button
                          type="submit"
                          disabled={loadingDetails}
                          className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-bold transition-all flex items-center gap-2 cursor-pointer shadow-sm shadow-emerald-200"
                        >
                          {loadingDetails ? (
                            <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          ) : <FiCheck size={16} />}
                          <span>Save Changes</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setIsEditingDetails(false);
                            setDetailsForm({
                              name: user?.name || '',
                              email: user?.email || '',
                              phone: user?.phone || '',
                            });
                          }}
                          className="px-6 py-3 border border-gray-200 hover:bg-gray-50 text-gray-600 rounded-xl text-sm font-bold transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    )}
                  </form>
                </motion.div>
              )}

              {activeTab === 'addresses' && (
                <motion.div
                  key="addresses"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  className="space-y-6"
                >
                  {/* Address List View */}
                  {!isAddingAddress ? (
                    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm">
                      <div className="flex justify-between items-center pb-5 border-b border-gray-100 mb-6">
                        <div>
                          <h3 className="text-xl font-bold text-gray-900">Delivery Addresses</h3>
                          <p className="text-xs text-gray-400 mt-1">Manage locations for quick Kirana deliveries</p>
                        </div>
                        <button
                          onClick={() => setIsAddingAddress(true)}
                          className="flex items-center gap-1.5 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-bold transition-colors cursor-pointer shadow-sm shadow-emerald-100"
                        >
                          <FiPlus size={16} />
                          <span>Add New Address</span>
                        </button>
                      </div>

                      {addresses.length === 0 ? (
                        <div className="text-center py-12">
                          <div className="w-16 h-16 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600 mx-auto mb-4">
                            <FiMapPin size={24} />
                          </div>
                          <p className="text-sm font-bold text-gray-700">No saved addresses</p>
                          <p className="text-xs text-gray-400 mt-1 max-w-xs mx-auto">Add a delivery address to get fresh essentials delivered to your doorstep.</p>
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 gap-4">
                          {addresses.map((addr) => (
                            <div
                              key={addr._id}
                              className={`p-5 rounded-2xl border transition-all ${
                                addr.isDefault
                                  ? 'border-emerald-500/30 bg-emerald-50/20'
                                  : 'border-gray-100 hover:border-gray-200 bg-white'
                              }`}
                            >
                              <div className="flex justify-between items-start">
                                <div className="space-y-1">
                                  <div className="flex items-center gap-2">
                                    <span className="font-bold text-gray-800 text-sm">{addr.name}</span>
                                    {addr.isDefault && (
                                      <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-extrabold rounded-full uppercase tracking-wider">
                                        Default
                                      </span>
                                    )}
                                  </div>
                                  <p className="text-xs text-gray-500 font-medium">📞 {addr.phone}</p>
                                  <p className="text-xs text-gray-600 leading-relaxed mt-1">
                                    {addr.street}, {addr.city}, {addr.state} — <span className="font-semibold text-gray-800">{addr.pincode}</span>
                                  </p>
                                </div>
                                <button
                                  onClick={() => startEditAddress(addr)}
                                  className="text-xs font-bold text-emerald-600 hover:text-emerald-700 hover:underline px-2.5 py-1.5 rounded-lg hover:bg-emerald-50 transition-colors"
                                >
                                  Edit Address
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    /* Address Add/Edit Form View */
                    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm">
                      <h3 className="text-xl font-bold text-gray-900 pb-5 border-b border-gray-100 mb-6">
                        {editingAddressId ? 'Edit Address' : 'Add New Address'}
                      </h3>

                      <form onSubmit={handleAddressSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                          {/* Name */}
                          <div>
                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Recipient Name</label>
                            <input
                              type="text"
                              value={addressForm.name}
                              onChange={(e) => setAddressForm({ ...addressForm, name: e.target.value })}
                              placeholder="e.g. Ramesh Kumar"
                              className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl text-gray-800 text-sm font-medium focus:outline-none focus:bg-white focus:border-emerald-500 transition-all"
                              required
                            />
                          </div>

                          {/* Phone */}
                          <div>
                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Recipient Phone</label>
                            <input
                              type="tel"
                              value={addressForm.phone}
                              onChange={(e) => setAddressForm({ ...addressForm, phone: e.target.value })}
                              placeholder="10-digit mobile number"
                              className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl text-gray-800 text-sm font-medium focus:outline-none focus:bg-white focus:border-emerald-500 transition-all"
                              required
                            />
                          </div>

                          {/* Street Address */}
                          <div className="sm:col-span-2">
                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Flat / House No. / Street Address</label>
                            <input
                              type="text"
                              value={addressForm.street}
                              onChange={(e) => setAddressForm({ ...addressForm, street: e.target.value })}
                              placeholder="House No, Apartment, Street details"
                              className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl text-gray-800 text-sm font-medium focus:outline-none focus:bg-white focus:border-emerald-500 transition-all"
                              required
                            />
                          </div>

                          {/* City */}
                          <div>
                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">City</label>
                            <input
                              type="text"
                              value={addressForm.city}
                              onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                              placeholder="City"
                              className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl text-gray-800 text-sm font-medium focus:outline-none focus:bg-white focus:border-emerald-500 transition-all"
                              required
                            />
                          </div>

                          {/* State */}
                          <div>
                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">State</label>
                            <input
                              type="text"
                              value={addressForm.state}
                              onChange={(e) => setAddressForm({ ...addressForm, state: e.target.value })}
                              placeholder="State"
                              className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl text-gray-800 text-sm font-medium focus:outline-none focus:bg-white focus:border-emerald-500 transition-all"
                              required
                            />
                          </div>

                          {/* Pincode */}
                          <div>
                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Pincode</label>
                            <input
                              type="text"
                              value={addressForm.pincode}
                              onChange={(e) => setAddressForm({ ...addressForm, pincode: e.target.value })}
                              placeholder="6-digit PIN code"
                              className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl text-gray-800 text-sm font-medium focus:outline-none focus:bg-white focus:border-emerald-500 transition-all"
                              required
                            />
                          </div>

                          {/* Default Checkbox */}
                          <div className="sm:col-span-2 flex items-center gap-2.5 mt-2">
                            <input
                              type="checkbox"
                              id="isDefault"
                              checked={addressForm.isDefault}
                              onChange={(e) => setAddressForm({ ...addressForm, isDefault: e.target.checked })}
                              className="w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
                            />
                            <label htmlFor="isDefault" className="text-xs font-bold text-gray-500 uppercase tracking-wide cursor-pointer select-none">
                              Set as Default Delivery Address
                            </label>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 pt-5 border-t border-gray-100">
                          <button
                            type="submit"
                            disabled={loadingAddress}
                            className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-bold transition-all flex items-center gap-2 cursor-pointer shadow-sm"
                          >
                            {loadingAddress ? (
                              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            ) : <FiCheck size={16} />}
                            <span>{editingAddressId ? 'Update Address' : 'Save Address'}</span>
                          </button>
                          <button
                            type="button"
                            onClick={resetAddressForm}
                            className="px-6 py-3 border border-gray-200 hover:bg-gray-50 text-gray-600 rounded-xl text-sm font-bold transition-colors"
                          >
                            Cancel
                          </button>
                        </div>
                      </form>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
