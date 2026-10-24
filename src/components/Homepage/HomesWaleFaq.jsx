// frontend/src/components/Homepage/HomesWaleFaq.jsx
import React, { useState } from 'react';

const FAQS = [
  {
    question: 'How do I find flats without brokerage on PropertyDeal?',
    answer:
      'PropertyDeal lists thousands of direct owner properties across top Indian cities. Simply select "Owner Properties" or filter by "Zero Brokerage" to connect directly with property owners via phone or WhatsApp.',
  },
  {
    question: 'Does PropertyDeal charge any fee for buyers or tenants?',
    answer:
      'No! Searching, shortlisting, and connecting with property owners or scheduling site visits is 100% free for all buyers and tenants.',
  },
  {
    question: 'Do you help with home loans and documentation?',
    answer:
      'Yes, PropertyDeal partners with major leading banks (SBI, HDFC, ICICI, Axis, PNB) to offer pre-approved home loans at competitive interest rates, along with legal verification and agreement drafting support.',
  },
  {
    question: 'How can owners post property for free?',
    answer:
      'Property owners can simply click on "Post Property FREE", provide basic property details (type, location, expected price/rent, photos), and publish within minutes. Enquiries are sent directly to your phone and WhatsApp.',
  },
  {
    question: 'Are commercial properties and plots also listed?',
    answer:
      'Yes, you can browse dedicated categories for Commercial Shops, Showrooms, Office Spaces, and Residential & Commercial Plots across Mumbai, Delhi NCR, Noida, Gurgaon, Pune, and Bengaluru.',
  },
];

const TRUST_PILLARS = [
  {
    icon: '🛡️',
    title: '100% Verified Listings',
    desc: 'Listings are screened for price accuracy, authentic photos, and verified owner contacts.',
  },
  {
    icon: '🤝',
    title: 'Zero Brokerage Deals',
    desc: 'Connect directly with genuine property owners with no middleman brokerage or hidden fees.',
  },
  {
    icon: '⚖️',
    title: 'Legal & Documentation',
    desc: 'Guidance for title searches, stamp duty calculations, sale deeds, and rental agreements.',
  },
  {
    icon: '⚡',
    title: 'Instant WhatsApp Connect',
    desc: 'Chat directly with owners and schedule site visits at your convenience with one tap.',
  },
];

const HomesWaleFaq = () => {
  const [openIdx, setOpenIdx] = useState(0);

  return (
    <section className="py-14 bg-[#f8fafc] border-t border-[#e2e8f0]">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
        {/* Trust Pillars */}
        <div className="mb-14">
          <div className="text-center max-w-xl mx-auto mb-10">
            <span className="text-xs font-bold uppercase tracking-wider text-[#2563eb] block mb-1">
              THE PROPERTYDEAL ADVANTAGE
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0f172a]">
              Why Choose PropertyDeal?
            </h2>
            <p className="text-xs sm:text-sm text-[#64748b] mt-1">
              Trusted by thousands of home seekers, tenants, and property owners across India.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {TRUST_PILLARS.map((tp, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl p-6 border border-[#e2e8f0] shadow-xs hover:shadow-md transition-shadow"
              >
                <div className="w-12 h-12 rounded-xl bg-[#eff6ff] flex items-center justify-center text-2xl mb-4">
                  {tp.icon}
                </div>
                <h3 className="text-base font-extrabold text-[#0f172a] mb-2">{tp.title}</h3>
                <p className="text-xs text-[#64748b] leading-relaxed">{tp.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* FAQs */}
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <span className="text-xs font-bold uppercase tracking-wider text-[#2563eb] block mb-1">
              QUESTIONS & ANSWERS
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0f172a]">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-3">
            {FAQS.map((faq, index) => {
              const isOpen = openIdx === index;
              return (
                <div
                  key={index}
                  className="bg-white rounded-2xl border border-[#e2e8f0] overflow-hidden transition-all duration-200"
                >
                  <button
                    type="button"
                    onClick={() => setOpenIdx(isOpen ? -1 : index)}
                    className="w-full text-left p-5 flex items-center justify-between gap-4 font-bold text-sm sm:text-base text-[#0f172a] hover:text-[#2563eb] transition-colors"
                  >
                    <span>{faq.question}</span>
                    <span className="text-xl font-bold text-[#2563eb] flex-shrink-0">
                      {isOpen ? '−' : '+'}
                    </span>
                  </button>

                  {isOpen && (
                    <div className="px-5 pb-5 text-xs sm:text-sm text-[#64748b] leading-relaxed border-t border-[#f1f5f9] pt-3 animate-hw-fade">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HomesWaleFaq;
