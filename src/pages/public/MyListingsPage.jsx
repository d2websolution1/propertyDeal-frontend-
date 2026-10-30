// frontend/src/pages/public/MyListingsPage.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

export default function MyListingsPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('active'); // 'active' | 'pending' | 'draft'

  return (
    <div className="min-h-screen bg-[#f8fafc] py-8 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* User Profile Bar */}
        <div className="bg-white rounded-2xl border border-[#e2e8f0] p-6 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4 text-center sm:text-left">
            <div className="w-16 h-16 rounded-full overflow-hidden bg-[#e2e8f0] border-2 border-[#005744]/20 flex items-center justify-center flex-shrink-0">
              {user?.avatar ? (
                <img src={user.avatar} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <span className="text-xl font-black text-[#005744]">
                  {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                </span>
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-[#0f172a]">
                  {user?.name || 'Valued User'}
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-[#ecfdf5] text-[#005744] border border-[#a7f3d0]">
                  {user?.userType || 'Owner'}
                </span>
              </div>
              <p className="text-xs text-[#64748b] mt-0.5">
                {user?.email} {user?.phone ? `• +91 ${user.phone}` : ''}
              </p>
              {user?.companyName && (
                <p className="text-xs font-semibold text-[#005744] mt-0.5">
                  🏢 {user.companyName} {user.city ? `(${user.city})` : ''}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/profile"
              className="px-4 py-2 rounded-xl border border-[#cbd5e1] text-xs font-bold text-[#334155] hover:bg-[#f8fafc] transition-colors"
            >
              ✏️ Edit Profile
            </Link>
            <Link
              to="/post-property"
              className="px-4 py-2 rounded-xl bg-[#005744] hover:bg-[#004737] text-white text-xs font-bold shadow-xs transition-colors"
            >
              + Post Property FREE
            </Link>
          </div>
        </div>

        {/* Listings Header & Filter Tabs */}
        <div className="bg-white rounded-2xl border border-[#e2e8f0] p-6 shadow-xs">
          <div className="flex flex-col sm:flex-row items-center justify-between pb-5 border-b border-[#f1f5f9] gap-4">
            <div>
              <h3 className="text-lg font-bold text-[#0f172a]">My Property Listings</h3>
              <p className="text-xs text-[#64748b] mt-0.5">
                Manage, edit and view inquiries for all properties listed under your account.
              </p>
            </div>

            <div className="flex items-center bg-[#f1f5f9] p-1 rounded-xl text-xs font-semibold">
              <button
                onClick={() => setActiveTab('active')}
                className={`px-3.5 py-1.5 rounded-lg transition-all cursor-pointer ${
                  activeTab === 'active' ? 'bg-white text-[#005744] shadow-xs' : 'text-[#64748b]'
                }`}
              >
                Active (0)
              </button>
              <button
                onClick={() => setActiveTab('pending')}
                className={`px-3.5 py-1.5 rounded-lg transition-all cursor-pointer ${
                  activeTab === 'pending' ? 'bg-white text-[#005744] shadow-xs' : 'text-[#64748b]'
                }`}
              >
                Under Review (0)
              </button>
              <button
                onClick={() => setActiveTab('draft')}
                className={`px-3.5 py-1.5 rounded-lg transition-all cursor-pointer ${
                  activeTab === 'draft' ? 'bg-white text-[#005744] shadow-xs' : 'text-[#64748b]'
                }`}
              >
                Drafts (0)
              </button>
            </div>
          </div>

          {/* Empty State */}
          <div className="py-14 text-center">
            <div className="w-20 h-20 mx-auto rounded-3xl bg-[#ecfdf5] text-[#005744] flex items-center justify-center text-3xl mb-4 shadow-xs">
              🏡
            </div>
            <h4 className="text-base font-bold text-[#0f172a]">
              No {activeTab} property listings yet
            </h4>
            <p className="text-xs text-[#64748b] max-w-sm mx-auto mt-1 mb-6">
              Reach thousands of prospective buyers & tenants across India. Post your first property in under 2 minutes for FREE!
            </p>
            <Link
              to="/post-property"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#005744] hover:bg-[#004737] text-white text-xs sm:text-sm font-bold shadow-md transition-all"
            >
              <span>+ Post Your Property Now</span>
              <span className="bg-[#ef4444] text-white text-[10px] font-black px-1.5 py-0.5 rounded">
                FREE
              </span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
