import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/client';

const emptyAddress = { label: '', line1: '', line2: '', city: '', state: '', pincode: '', isDefault: false };

export default function Profile() {
  const { user, refreshUser } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileMsg, setProfileMsg] = useState('');

  const [showAddressForm, setShowAddressForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [addressForm, setAddressForm] = useState(emptyAddress);
  const [addressError, setAddressError] = useState('');

  if (!user) return <p className="section">Loading...</p>;

  async function handleProfileSave(e) {
    e.preventDefault();
    setSavingProfile(true);
    setProfileMsg('');
    try {
      await api.put('/users/me', { name, phone });
      await refreshUser();
      setProfileMsg('Profile updated.');
    } catch (err) {
      setProfileMsg(err.response?.data?.message || 'Update failed');
    } finally {
      setSavingProfile(false);
    }
  }

  function startAddAddress() {
    setEditingId(null);
    setAddressForm(emptyAddress);
    setAddressError('');
    setShowAddressForm(true);
  }

  function startEditAddress(a) {
    setEditingId(a._id);
    setAddressForm({
      label: a.label || '',
      line1: a.line1 || '',
      line2: a.line2 || '',
      city: a.city || '',
      state: a.state || '',
      pincode: a.pincode || '',
      isDefault: !!a.isDefault,
    });
    setAddressError('');
    setShowAddressForm(true);
  }

  async function handleAddressSubmit(e) {
    e.preventDefault();
    setAddressError('');
    try {
      if (editingId) {
        await api.put(`/users/me/addresses/${editingId}`, addressForm);
      } else {
        await api.post('/users/me/addresses', addressForm);
      }
      await refreshUser();
      setShowAddressForm(false);
    } catch (err) {
      setAddressError(err.response?.data?.message || 'Could not save address');
    }
  }

  async function handleDeleteAddress(id) {
    await api.delete(`/users/me/addresses/${id}`);
    await refreshUser();
  }

  return (
    <section className="section profile-page">
      <h2>My Account</h2>

      <div className="profile-nav">
        <span className="profile-nav-item active">Profile</span>
        <Link to="/account/orders" className="profile-nav-item">
          My Orders
        </Link>
      </div>

      <div className="profile-grid">
        <div className="checkout-card">
          <h3 className="checkout-section-title">Personal Information</h3>
          <form className="checkout-form" onSubmit={handleProfileSave}>
            <input placeholder="Full Name" required value={name} onChange={(e) => setName(e.target.value)} />
            <input value={user.email} disabled className="profile-disabled-input" />
            <input placeholder="Phone Number" value={phone} onChange={(e) => setPhone(e.target.value)} />
            {profileMsg && <p className="coupon-msg">{profileMsg}</p>}
            <button className="btn-primary" type="submit" disabled={savingProfile}>
              {savingProfile ? 'Saving...' : 'Save Changes'}
            </button>
          </form>
        </div>

        <div className="checkout-card">
          <div className="profile-address-header">
            <h3 className="checkout-section-title">Saved Addresses</h3>
            <button type="button" className="btn-buy-now profile-add-address-btn" onClick={startAddAddress}>
              + Add New Address
            </button>
          </div>

          {user.addresses?.length ? (
            <div className="address-list">
              {user.addresses.map((a) => (
                <div key={a._id} className="address-card">
                  {a.isDefault && <span className="address-default-tag">Default</span>}
                  <h4>{a.label || 'Address'}</h4>
                  <p>
                    {a.line1}
                    {a.line2 ? `, ${a.line2}` : ''}
                  </p>
                  <p>
                    {a.city}, {a.state} - {a.pincode}
                  </p>
                  <div className="address-card-actions">
                    <button type="button" onClick={() => startEditAddress(a)}>
                      Edit
                    </button>
                    <button type="button" onClick={() => handleDeleteAddress(a._id)}>
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p>No saved addresses yet.</p>
          )}

          {showAddressForm && (
            <form className="checkout-form address-form" onSubmit={handleAddressSubmit}>
              <h4 className="checkout-section-title">{editingId ? 'Edit Address' : 'New Address'}</h4>
              <input
                placeholder="Label (Home, Office...)"
                value={addressForm.label}
                onChange={(e) => setAddressForm({ ...addressForm, label: e.target.value })}
              />
              <input
                placeholder="Address Line 1"
                required
                value={addressForm.line1}
                onChange={(e) => setAddressForm({ ...addressForm, line1: e.target.value })}
              />
              <input
                placeholder="Address Line 2"
                value={addressForm.line2}
                onChange={(e) => setAddressForm({ ...addressForm, line2: e.target.value })}
              />
              <div className="checkout-form-row">
                <input
                  placeholder="City"
                  required
                  value={addressForm.city}
                  onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                />
                <input
                  placeholder="State"
                  required
                  value={addressForm.state}
                  onChange={(e) => setAddressForm({ ...addressForm, state: e.target.value })}
                />
              </div>
              <input
                placeholder="Pincode"
                required
                value={addressForm.pincode}
                onChange={(e) => setAddressForm({ ...addressForm, pincode: e.target.value })}
              />
              <label className="address-default-check">
                <input
                  type="checkbox"
                  checked={addressForm.isDefault}
                  onChange={(e) => setAddressForm({ ...addressForm, isDefault: e.target.checked })}
                />
                Set as default address
              </label>
              {addressError && <p className="error">{addressError}</p>}
              <div className="product-detail-actions">
                <button className="btn-primary" type="submit">
                  {editingId ? 'Update Address' : 'Save Address'}
                </button>
                <button type="button" className="btn-buy-now" onClick={() => setShowAddressForm(false)}>
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
