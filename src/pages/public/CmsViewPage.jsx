// frontend/src/pages/public/CmsViewPage.jsx
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://propertydeal-backend-w3yk.onrender.com/api';

const DEFAULT_PAGES = {
  'about-us': {
    title: 'About Property Adda',
    metaTitle: 'About Property Adda - India\'s Most Trusted Real Estate Platform',
    metaDescription: 'Learn about Property Adda mission, leadership, and our commitment to transparent property deals across India.',
    content: `Property Adda is India's premier real estate discovery marketplace connecting property owners, verified dealers, and reputed builders directly with buyers and tenants.

With 100% verified listings, zero hidden brokerage, and real-time CRM tools, we make property transactions fast, transparent, and seamless.

Our Mission:
To empower every Indian home seeker and investor with verified data, transparent direct contact with sellers, and end-to-end guidance from discovery to deal closure.

Key Highlights:
• Over 71,000+ verified listings across Delhi NCR, Jaipur, Mumbai, Bengaluru and major Indian cities.
• Zero brokerage direct communication between property owners and genuine buyers.
• Verified badge certification conducted by our field inspection and document verification team.
• 24x7 customer support desk and relationship assistance.`,
  },
  'terms-and-conditions': {
    title: 'Terms & Conditions',
    metaTitle: 'Terms & Conditions - Property Adda',
    metaDescription: 'Review terms and user policies for Property Adda listings and client services.',
    content: `Welcome to Property Adda. By accessing or using our website, services, and mobile applications, you agree to be bound by the following terms and conditions.

1. Authenticity of Listings:
All property owners, agents, and builders agree that information, pricing, specifications, and photographs uploaded to Property Adda are accurate, authentic, and not misleading. Duplicate listings or fraudulent postings will be terminated immediately.

2. User Accounts & Verification:
Users must register with verified mobile numbers or Google Authentication. You are responsible for maintaining confidentiality of your account credentials.

3. Listing Quotas & Subscriptions:
Property listings and subscription plans are subject to the specific duration and listing limits chosen during activation. Unused listing quotas do not carry over beyond validity expiry.

4. Limitation of Liability:
Property Adda acts as a discovery and marketplace portal. Buyers and tenants are strongly advised to independently verify municipal approvals, RERA certificates, and title deeds before executing monetary transactions.`,
  },
  'privacy-policy': {
    title: 'Privacy Policy',
    metaTitle: 'Privacy Policy - Property Adda',
    metaDescription: 'How Property Adda safeguards your personal and transactional information.',
    content: `At Property Adda, protecting your personal data and maintaining customer trust is our top priority.

1. Information We Collect:
When you register, post properties, or submit inquiries, we may collect your name, email address, phone number, and location preferences.

2. How We Use Your Data:
• To connect genuine property seekers directly with verified owners and agents.
• To deliver real-time WhatsApp and SMS alerts regarding your property inquiries.
• To authenticate logins securely via OTP or Google Single Sign-On.

3. Data Security & Storage:
All user records and payment logs are encrypted using industry-standard 256-bit SSL protocols. We never sell or rent your personal contact information to third-party marketing companies.

4. Contact Our Privacy Officer:
If you have any questions regarding your data or wish to delete your account, reach out to info@property-adda.com.`,
  },
  'contact-us': {
    title: 'Contact Support & Helpdesk',
    metaTitle: 'Contact Us - Property Adda Help Desk',
    metaDescription: 'Get in touch with Property Adda client support team.',
    content: `Have questions or need assistance with your property listing? Our expert support team is here to assist you 6 days a week.

Customer Care Helpline:
• Phone: +91 9672 056 670
• Alternate: +91 9509 505 892
• WhatsApp Support: +91 9509 505 892

Email Enquiries:
• General: info@property-adda.com
• Listings & Approvals: support@property-adda.com

Support Hours:
Monday – Saturday: 9:00 AM – 7:00 PM IST
Sunday: Closed (WhatsApp inquiries answered next business day)

Head Office:
Property Adda Tower, Plot 14, Commercial Tech Zone, Jaipur & Delhi NCR, India.`,
  },
};

const CmsViewPage = ({ defaultSlug }) => {
  const { slug: paramSlug } = useParams();
  const slug = defaultSlug || paramSlug || 'about-us';

  const [page, setPage] = useState(DEFAULT_PAGES[slug] || null);
  const [loading, setLoading] = useState(true);
  const [contactSubmitted, setContactSubmitted] = useState(false);
  const [contactForm, setContactForm] = useState({ name: '', phone: '', email: '', message: '' });

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    // Initial fallback
    if (DEFAULT_PAGES[slug]) {
      setPage(DEFAULT_PAGES[slug]);
    }

    axios
      .get(`${API_BASE_URL}/cms/${slug}`)
      .then((res) => {
        if (isMounted && res.data) {
          setPage(res.data);
          if (res.data.metaTitle) {
            document.title = `${res.data.metaTitle} | Property Adda`;
          } else if (res.data.title) {
            document.title = `${res.data.title} | Property Adda`;
          }
        }
      })
      .catch((err) => {
        console.warn(`CMS page "${slug}" load info:`, err.message);
        // keep fallback
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [slug]);

  const handleContactSubmit = (e) => {
    e.preventDefault();
    setContactSubmitted(true);
  };

  const isContactPage = slug === 'contact-us' || slug === 'contact';
  const isAboutPage = slug === 'about-us' || slug === 'about';

  return (
    <div className="min-h-screen bg-[#f8fafc] text-gray-800 font-sans pb-16">
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-[#0f172a] via-[#1e293b] to-[#0f172a] text-white py-12 md:py-16 border-b border-gray-800">
        <div className="max-w-[1100px] mx-auto px-4 sm:px-6">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs text-gray-400 mb-3">
            <Link to="/" className="hover:text-white transition-colors">
              Home
            </Link>
            <span>/</span>
            <span className="text-blue-400 font-medium capitalize">{page?.title || slug.replace(/-/g, ' ')}</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white mb-2">
            {page?.title || 'Property Adda'}
          </h1>
          <p className="text-gray-300 text-xs sm:text-sm max-w-2xl leading-relaxed">
            {page?.metaDescription || 'Trusted real estate information, terms, and customer assistance across India.'}
          </p>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-[1100px] mx-auto px-4 sm:px-6 -mt-6">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200/80 p-6 sm:p-10">
          {/* If About Page: Show Stat Badges */}
          {isAboutPage && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 pb-8 border-b border-gray-100">
              <div className="bg-blue-50/60 p-4 rounded-xl text-center border border-blue-100">
                <p className="text-2xl sm:text-3xl font-black text-[#2563eb]">71,000+</p>
                <p className="text-xs text-gray-600 font-bold uppercase mt-1">Verified Listings</p>
              </div>
              <div className="bg-emerald-50/60 p-4 rounded-xl text-center border border-emerald-100">
                <p className="text-2xl sm:text-3xl font-black text-emerald-600">0%</p>
                <p className="text-xs text-gray-600 font-bold uppercase mt-1">Direct Brokerage</p>
              </div>
              <div className="bg-purple-50/60 p-4 rounded-xl text-center border border-purple-100">
                <p className="text-2xl sm:text-3xl font-black text-purple-600">15+</p>
                <p className="text-xs text-gray-600 font-bold uppercase mt-1">Major Indian Cities</p>
              </div>
              <div className="bg-amber-50/60 p-4 rounded-xl text-center border border-amber-100">
                <p className="text-2xl sm:text-3xl font-black text-amber-600">100%</p>
                <p className="text-xs text-gray-600 font-bold uppercase mt-1">Verified Sellers</p>
              </div>
            </div>
          )}

          {/* Formatted Content */}
          <div className="prose prose-slate max-w-none text-sm sm:text-base leading-relaxed text-gray-700 whitespace-pre-line space-y-4">
            {page?.content ? (
              page.content
            ) : (
              <p className="text-gray-400">Loading page content...</p>
            )}
          </div>

          {/* If Contact Page: Interactive Contact Form & Help Desk Cards */}
          {isContactPage && (
            <div className="mt-10 pt-10 border-t border-gray-100">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Contact Cards */}
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                    <span className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center text-sm">
                      <i className="fas fa-headset"></i>
                    </span>
                    Customer Desk & Direct Connect
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="p-4 rounded-xl border border-gray-200 bg-gray-50/50">
                      <p className="font-bold text-gray-800 text-sm mb-1">Call Helpline</p>
                      <a href="tel:+919672056670" className="text-blue-600 font-bold hover:underline block">
                        +91 9672 056 670
                      </a>
                      <a href="tel:+919509505892" className="text-blue-600 font-bold hover:underline block mt-0.5">
                        +91 9509 505 892
                      </a>
                    </div>

                    <div className="p-4 rounded-xl border border-gray-200 bg-gray-50/50">
                      <p className="font-bold text-gray-800 text-sm mb-1">WhatsApp Chat</p>
                      <a
                        href="https://wa.me/919509505892?text=Hello%20Property%20Adda,%20I%20need%20assistance"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-emerald-600 font-bold hover:underline inline-flex items-center gap-1.5"
                      >
                        <i className="fab fa-whatsapp text-sm"></i>
                        <span>Start Chat (Instant)</span>
                      </a>
                    </div>

                    <div className="p-4 rounded-xl border border-gray-200 bg-gray-50/50 sm:col-span-2">
                      <p className="font-bold text-gray-800 text-sm mb-1">Email Support</p>
                      <a href="mailto:info@property-adda.com" className="text-blue-600 font-bold hover:underline">
                        info@property-adda.com
                      </a>
                      <p className="text-gray-400 text-[11px] mt-1">Average response time: within 2 hours</p>
                    </div>
                  </div>
                </div>

                {/* Send a Message Form */}
                <div className="bg-slate-50 p-6 rounded-2xl border border-gray-200">
                  <h3 className="text-base font-bold text-gray-900 mb-1">Send us an Instant Message</h3>
                  <p className="text-xs text-gray-500 mb-4">Leave your inquiry and our team will call you back.</p>

                  {contactSubmitted ? (
                    <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-xl text-center space-y-2">
                      <i className="fas fa-check-circle text-3xl text-emerald-600"></i>
                      <p className="font-bold text-emerald-900 text-sm">Thank You! Your message is sent.</p>
                      <p className="text-xs text-emerald-700">Our customer representative will get in touch shortly.</p>
                    </div>
                  ) : (
                    <form onSubmit={handleContactSubmit} className="space-y-3">
                      <div>
                        <input
                          type="text"
                          required
                          placeholder="Your Full Name *"
                          value={contactForm.name}
                          onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                          className="w-full px-3.5 py-2 rounded-xl border border-gray-200 text-xs bg-white outline-none focus:border-blue-600"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="tel"
                          required
                          placeholder="Phone Number *"
                          value={contactForm.phone}
                          onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
                          className="w-full px-3.5 py-2 rounded-xl border border-gray-200 text-xs bg-white outline-none focus:border-blue-600"
                        />
                        <input
                          type="email"
                          placeholder="Email Address"
                          value={contactForm.email}
                          onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                          className="w-full px-3.5 py-2 rounded-xl border border-gray-200 text-xs bg-white outline-none focus:border-blue-600"
                        />
                      </div>
                      <div>
                        <textarea
                          rows={3}
                          required
                          placeholder="How can we assist you with your property or account?"
                          value={contactForm.message}
                          onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                          className="w-full px-3.5 py-2 rounded-xl border border-gray-200 text-xs bg-white outline-none focus:border-blue-600"
                        ></textarea>
                      </div>
                      <button
                        type="submit"
                        className="w-full py-2.5 rounded-xl bg-[#2563eb] hover:bg-[#1d4ed8] text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
                      >
                        Submit Inquiry
                      </button>
                    </form>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Bottom Links */}
          <div className="mt-8 pt-6 border-t border-gray-100 flex flex-wrap items-center justify-between gap-4 text-xs text-gray-500">
            <div className="flex items-center gap-4">
              <Link to="/about-us" className="hover:text-blue-600 font-semibold">About Us</Link>
              <span>•</span>
              <Link to="/contact-us" className="hover:text-blue-600 font-semibold">Contact Helpdesk</Link>
              <span>•</span>
              <Link to="/privacy-policy" className="hover:text-blue-600 font-semibold">Privacy Policy</Link>
              <span>•</span>
              <Link to="/terms-and-conditions" className="hover:text-blue-600 font-semibold">Terms & Conditions</Link>
            </div>
            <Link to="/" className="text-blue-600 font-bold hover:underline">
              ← Back to Homepage
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CmsViewPage;
