import { useNavigate } from 'react-router-dom';
import { User, Truck, Clock, LogOut, Edit3, Plus, Check, ChevronRight } from 'lucide-react';
import { useProfileController } from '../../controllers/useProfileController';

const NAV_ITEMS = [
  { id: 'info', label: 'User Info', Icon: User },
  { id: 'active', label: 'Active Order', Icon: Truck },
  { id: 'past', label: 'Past Orders', Icon: Clock },
];

export default function Profile() {
  const {
    user,
    isLoggedIn,
    logout,
    setIsLoginOpen,
    activeTab,
    setActiveTab,
    editing,
    editForm,
    setEditForm,
    startEditing,
    cancelEditing,
    saveProfile,
    statusColors,
  } = useProfileController();

  const navigate = useNavigate();

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-cream-50 pt-16 flex items-center justify-center px-6">
        <div className="text-center py-16">
          <div className="w-20 h-20 rounded-full bg-cream-100 flex items-center justify-center mx-auto mb-5">
            <User size={36} className="text-cream-200" strokeWidth={1.2} />
          </div>
          <h2 className="font-playfair font-bold text-3xl text-chocolate-900 mb-2">Sign In Required</h2>
          <p className="font-montserrat text-sm text-chocolate-800/50 mb-6">
            Please sign in to view your profile and order history.
          </p>
          <button onClick={() => setIsLoginOpen(true)} className="btn-primary">
            Sign In
          </button>
        </div>
      </div>
    );
  }

  const activeOrder = user.activeOrder;

  return (
    <div className="min-h-screen bg-cream-50 pt-16">
      <div className="max-w-6xl mx-auto px-6 lg:px-16 py-12">
        {/* Welcome Header */}
        <div className="mb-10">
          <h1 className="font-playfair font-bold text-4xl text-chocolate-900">
            Welcome Back, {user.name.split(' ')[0]}
          </h1>
          <p className="font-montserrat text-sm text-chocolate-800/50 mt-2">
            Manage your artisanal indulgences and track your upcoming orders.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* ── Sidebar ── */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              {NAV_ITEMS.map(({ id, label, Icon }) => (
                <button
                  key={id}
                  id={`profile-tab-${id}`}
                  onClick={() => setActiveTab(id)}
                  className={`w-full flex items-center gap-3 px-5 py-4 font-montserrat font-semibold text-sm transition-colors border-b border-gray-50 last:border-0 ${
                    activeTab === id
                      ? 'bg-cream-100 text-chocolate-900'
                      : 'text-chocolate-800/60 hover:bg-cream-50 hover:text-chocolate-900'
                  }`}
                >
                  <Icon size={16} strokeWidth={1.8} />
                  {label}
                  {id === 'active' && activeOrder && (
                    <span className="ml-auto w-2 h-2 rounded-full bg-amber-400" />
                  )}
                </button>
              ))}
              <div className="border-t border-gray-100">
                <button
                  id="profile-signout-btn"
                  onClick={() => { logout(); navigate('/'); }}
                  className="w-full flex items-center gap-3 px-5 py-4 font-montserrat font-semibold text-sm text-red-500 hover:bg-red-50 transition-colors"
                >
                  <LogOut size={16} strokeWidth={1.8} />
                  Sign Out
                </button>
              </div>
            </div>
          </div>

          {/* ── Main Panel ── */}
          <div className="lg:col-span-3">
            {/* ── User Info Tab ── */}
            {activeTab === 'info' && (
              <div className="space-y-6">
                {/* Personal Details */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-7">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="font-playfair font-bold text-2xl text-caramel-600">Personal Details</h2>
                    {!editing ? (
                      <button
                        id="edit-profile-btn"
                        onClick={startEditing}
                        className="flex items-center gap-1.5 font-montserrat text-xs font-semibold text-caramel-600 hover:text-caramel-700 transition-colors"
                      >
                        <Edit3 size={14} />
                        Edit
                      </button>
                    ) : (
                      <div className="flex gap-3">
                        <button onClick={cancelEditing} className="font-montserrat text-xs font-semibold text-chocolate-800/50 hover:text-chocolate-800 transition-colors">Cancel</button>
                        <button onClick={saveProfile} className="flex items-center gap-1 font-montserrat text-xs font-semibold text-caramel-600 hover:text-caramel-700">
                          <Check size={13} />Save
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="flex items-start gap-6">
                    <div className="flex-1 space-y-5">
                      {[
                        { label: 'Full Name', field: 'name', value: user.name, type: 'text' },
                        { label: 'Email Address', field: 'email', value: user.email, type: 'email' },
                        { label: 'Phone Number', field: 'phone', value: user.phone, type: 'tel' },
                      ].map(({ label, field, value, type }) => (
                        <div key={field} className="border-b border-gray-100 pb-4 last:border-0">
                          <p className="font-montserrat text-xs text-chocolate-800/40 uppercase tracking-wide mb-1.5">{label}</p>
                          {editing ? (
                            <input
                              type={type}
                              value={editForm[field]}
                              onChange={(e) => setEditForm((prev) => ({ ...prev, [field]: e.target.value }))}
                              className="input-field"
                            />
                          ) : (
                            <p className="font-montserrat text-sm text-chocolate-900 font-medium">{value}</p>
                          )}
                        </div>
                      ))}
                    </div>

                    {/* Avatar */}
                    <div className="shrink-0">
                      <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-cream-200 shadow">
                        <img
                          src="https://images.unsplash.com/photo-1494790108755-2616b612b11c?w=200&auto=format&fit=crop"
                          alt={user.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Saved Addresses */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-7">
                  <div className="flex items-center justify-between mb-5">
                    <h2 className="font-playfair font-bold text-2xl text-caramel-600">Saved Addresses</h2>
                    <button className="flex items-center gap-1.5 font-montserrat text-xs font-semibold text-caramel-600 hover:text-caramel-700 transition-colors">
                      <Plus size={14} />
                      Add New
                    </button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {user.addresses.map((addr) => (
                      <div key={addr.id} className={`border rounded-xl p-4 ${addr.isDefault ? 'border-caramel-600/30 bg-cream-50' : 'border-gray-200 bg-white'}`}>
                        <div className="flex items-center justify-between mb-2">
                          <p className="font-montserrat font-bold text-sm text-chocolate-900">{addr.label}</p>
                          {addr.isDefault && (
                            <span className="text-[10px] font-montserrat font-bold text-green-700 bg-green-50 border border-green-200 px-2 py-0.5 rounded-full">Default</span>
                          )}
                        </div>
                        <p className="font-montserrat text-xs text-chocolate-800/60 leading-relaxed">
                          {addr.street}<br />{addr.city}, {addr.state} {addr.zip}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ── Active Order Tab ── */}
            {activeTab === 'active' && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-7">
                <h2 className="font-playfair font-bold text-2xl text-caramel-600 mb-6">Active Order</h2>
                {activeOrder ? (
                  <div>
                    <div className="flex items-center justify-between mb-5">
                      <div>
                        <p className="font-montserrat font-bold text-sm text-chocolate-900">{activeOrder.id}</p>
                        <p className="font-montserrat text-xs text-chocolate-800/50 mt-0.5">Placed on {activeOrder.date}</p>
                      </div>
                      <span className={`text-xs font-montserrat font-semibold px-3 py-1.5 rounded-full ${statusColors[activeOrder.status] || 'bg-gray-100 text-gray-600'}`}>
                        {activeOrder.status}
                      </span>
                    </div>

                    {/* Progress Tracker */}
                    <div className="relative mb-8">
                      <div className="flex items-center justify-between">
                        {activeOrder.steps.map((step, i) => {
                          const isCompleted = i < activeOrder.currentStep;
                          const isCurrent = i === activeOrder.currentStep;
                          return (
                            <div key={step} className="flex flex-col items-center flex-1">
                              <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center z-10 ${
                                isCompleted ? 'bg-caramel-600 border-caramel-600' : isCurrent ? 'bg-white border-caramel-600' : 'bg-white border-gray-200'
                              }`}>
                                {isCompleted ? <Check size={14} className="text-white" /> : <div className={`w-2 h-2 rounded-full ${isCurrent ? 'bg-caramel-600' : 'bg-gray-200'}`} />}
                              </div>
                              <p className={`font-montserrat text-[10px] text-center mt-2 leading-tight max-w-[70px] ${isCurrent || isCompleted ? 'font-semibold text-chocolate-900' : 'text-chocolate-800/40'}`}>
                                {step}
                              </p>
                              {i < activeOrder.steps.length - 1 && (
                                <div className={`absolute top-4 h-0.5 transition-all duration-500 ${
                                  isCompleted ? 'bg-caramel-600' : 'bg-gray-100'
                                }`}
                                style={{
                                  left: `calc(${(i / (activeOrder.steps.length - 1)) * 100}% + 16px)`,
                                  width: `calc(${(1 / (activeOrder.steps.length - 1)) * 100}% - 32px)`,
                                }}
                                />
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    <div className="bg-cream-50 rounded-xl p-4 mb-4">
                      <p className="font-montserrat text-xs text-chocolate-800/50">Estimated Arrival</p>
                      <p className="font-montserrat font-bold text-sm text-chocolate-900 mt-1">{activeOrder.eta}</p>
                    </div>

                    {/* Order Items */}
                    <div className="border-t border-gray-100 pt-4 space-y-3">
                      {activeOrder.items.map((item, i) => (
                        <div key={i} className="flex justify-between font-montserrat text-sm">
                          <div>
                            <p className="font-semibold text-chocolate-900">{item.name}</p>
                            <p className="text-xs text-chocolate-800/40">{item.size} · Qty: {item.qty}</p>
                          </div>
                          <p className="font-bold text-caramel-600">${item.price}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="py-12 text-center">
                    <Truck size={36} className="text-gray-200 mx-auto mb-3" strokeWidth={1.2} />
                    <p className="font-playfair text-lg font-semibold text-chocolate-900">No active orders</p>
                    <p className="font-montserrat text-sm text-chocolate-800/40 mt-1">Your current orders will appear here</p>
                    <button onClick={() => navigate('/menu')} className="btn-primary mt-5">Order Now</button>
                  </div>
                )}
              </div>
            )}

            {/* ── Past Orders Tab ── */}
            {activeTab === 'past' && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-7">
                <h2 className="font-playfair font-bold text-2xl text-caramel-600 mb-6">Order History</h2>
                {user.orders.length > 0 ? (
                  <div className="space-y-4">
                    {user.orders.map((order) => (
                      <div key={order.id} className="border border-gray-100 rounded-xl p-5 hover:shadow-sm transition-all duration-200">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <p className="font-montserrat font-bold text-sm text-chocolate-900">{order.id}</p>
                            <p className="font-montserrat text-xs text-chocolate-800/40 mt-0.5">{order.date}</p>
                          </div>
                          <span className={`text-xs font-montserrat font-semibold px-3 py-1 rounded-full ${statusColors[order.status] || 'bg-gray-100 text-gray-600'}`}>
                            {order.status}
                          </span>
                        </div>
                        <div className="space-y-1.5 mb-3">
                          {order.items.map((item, i) => (
                            <p key={i} className="font-montserrat text-xs text-chocolate-800/60">
                              {item.name} — {item.size} × {item.qty}
                            </p>
                          ))}
                        </div>
                        <div className="flex items-center justify-between border-t border-gray-100 pt-3">
                          <p className="font-montserrat font-bold text-sm text-chocolate-900">
                            Total: <span className="text-caramel-600">${order.total.toFixed(2)}</span>
                          </p>
                          <button
                            className="font-montserrat text-xs font-semibold text-caramel-600 hover:text-caramel-700 flex items-center gap-1 transition-colors"
                            onClick={() => navigate('/custom-order')}
                          >
                            Reorder <ChevronRight size={13} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-12 text-center">
                    <Clock size={36} className="text-gray-200 mx-auto mb-3" strokeWidth={1.2} />
                    <p className="font-playfair text-lg font-semibold text-chocolate-900">No past orders</p>
                    <p className="font-montserrat text-sm text-chocolate-800/40 mt-1">Your completed orders will appear here</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
