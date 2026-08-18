// Footer.jsx
import React, { useState } from "react";

const TABS = ["FOR BUYERS", "FOR TENANTS", "PROJECTS", "POPULAR SEARCHES"];

const LINK_SETS = {
  "FOR BUYERS": {
    heading: "Find flats for sale",
    columns: [
      [
        "Flats for sale in Greater Noida",
        "Flats for sale in Ghaziabad",
        "Flats for sale in Lucknow",
        "Flats for sale in Indore",
        "Flats for sale in Faridabad",
      ],
      [
        "Flats for sale in Mohali",
        "Flats for sale in Coimbatore",
        "Flats for sale in Nagpur",
        "Flats for sale in Surat",
        "Flats for sale in Vadodara",
      ],
      [
        "Flats for sale in Dehradun",
        "Flats for sale in Raipur",
        "Flats for sale in Visakhapatnam",
        "Flats for sale in Secunderabad",
        "Flats for sale in Bhubaneswar",
      ],
      [
        "Flats for sale in Zirakpur",
        "Flats for sale in Bhopal",
        "Flats for sale in Mira Bhayandar",
        "Flats for sale in Patna",
        "Flats for sale in Nashik",
      ],
    ],
  },
  "FOR TENANTS": {
    heading: "Find flats for rent",
    columns: [
      [
        "Flats for rent in Greater Noida",
        "Flats for rent in Ghaziabad",
        "Flats for rent in Lucknow",
        "Flats for rent in Indore",
        "Flats for rent in Faridabad",
      ],
      [
        "Flats for rent in Mohali",
        "Flats for rent in Coimbatore",
        "Flats for rent in Nagpur",
        "Flats for rent in Surat",
        "Flats for rent in Vadodara",
      ],
      [
        "Flats for rent in Dehradun",
        "Flats for rent in Raipur",
        "Flats for rent in Visakhapatnam",
        "Flats for rent in Secunderabad",
        "Flats for rent in Bhubaneswar",
      ],
      [
        "Flats for rent in Zirakpur",
        "Flats for rent in Bhopal",
        "Flats for rent in Mira Bhayandar",
        "Flats for rent in Patna",
        "Flats for rent in Nashik",
      ],
    ],
  },
  PROJECTS: {
    heading: "Find new projects",
    columns: [
      [
        "Projects in Greater Noida",
        "Projects in Ghaziabad",
        "Projects in Lucknow",
        "Projects in Indore",
        "Projects in Faridabad",
      ],
      [
        "Projects in Mohali",
        "Projects in Coimbatore",
        "Projects in Nagpur",
        "Projects in Surat",
        "Projects in Vadodara",
      ],
      [
        "Projects in Dehradun",
        "Projects in Raipur",
        "Projects in Visakhapatnam",
        "Projects in Secunderabad",
        "Projects in Bhubaneswar",
      ],
      [
        "Projects in Zirakpur",
        "Projects in Bhopal",
        "Projects in Mira Bhayandar",
        "Projects in Patna",
        "Projects in Nashik",
      ],
    ],
  },
  "POPULAR SEARCHES": {
    heading: "Popular searches",
    columns: [
      [
        "2 BHK flats in Greater Noida",
        "3 BHK flats in Ghaziabad",
        "Villas in Lucknow",
        "Plots in Indore",
        "Studio apartments in Faridabad",
      ],
      [
        "2 BHK flats in Mohali",
        "3 BHK flats in Coimbatore",
        "Villas in Nagpur",
        "Plots in Surat",
        "Studio apartments in Vadodara",
      ],
      [
        "2 BHK flats in Dehradun",
        "3 BHK flats in Raipur",
        "Villas in Visakhapatnam",
        "Plots in Secunderabad",
        "Studio apartments in Bhubaneswar",
      ],
      [
        "2 BHK flats in Zirakpur",
        "3 BHK flats in Bhopal",
        "Villas in Mira Bhayandar",
        "Plots in Patna",
        "Studio apartments in Nashik",
      ],
    ],
  },
};

const COMPANY_LINKS = [
  "Careers",
  "About Us",
  "For Partners",
  "Terms",
  "Annual Return",
  "Privacy Policy",
  "Contact Us",
  "Unsubscribe",
  "Merger Hearing Advertisement",
];

const PARTNER_LINKS = [
  "realestate.com.au",
  "realtor.com",
  "99.co",
  "collinsdictionary.com",
];

const EXPLORE_LINKS = ["News", "Home Loans", "Sitemap", "International"];

const SOCIAL_ICONS = [
  { icon: "fa-facebook-f", label: "Facebook" },
  { icon: "fa-instagram", label: "Instagram" },
  { icon: "fa-twitter", label: "Twitter" },
  { icon: "fa-linkedin-in", label: "LinkedIn" },
  { icon: "fa-youtube", label: "YouTube" },
];

const Footer = () => {
  const [activeTab, setActiveTab] = useState("FOR BUYERS");
  const activeContent = LINK_SETS[activeTab];

  return (
    <footer className="bg-[#0d0d0d] text-white">
      {/* Tabs */}
      <div className="border-b border-white/10">
        <div className="max-w-[1300px] mx-auto px-6 flex items-center gap-10 overflow-x-auto">
          {TABS.map((t) => {
            const active = t === activeTab;
            return (
              <button
                key={t}
                onClick={() => setActiveTab(t)}
                className={`relative py-5 text-sm font-semibold tracking-wide whitespace-nowrap transition-colors ${
                  active ? "text-white" : "text-white/50 hover:text-white/80"
                }`}
              >
                {t}
                {active && (
                  <span className="absolute left-0 right-0 -bottom-[1px] h-[2px] bg-white" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Link grid */}
      <div className="max-w-[1300px] mx-auto px-6 py-8">
        <h3 className="text-white font-bold text-lg mb-5">
          {activeContent.heading}
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-10 gap-y-3">
          {activeContent.columns.map((col, i) => (
            <div key={i} className="flex flex-col gap-3">
              {col.map((link, j) => (
                <a
                  key={j}
                  href="#"
                  className="text-white/60 text-sm hover:text-white transition-colors"
                >
                  {link}
                </a>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Bottom section */}
      <div className="border-t border-white/10">
        <div className="max-w-[1300px] mx-auto px-6 py-10 grid grid-cols-1 lg:grid-cols-[310px_1fr_1fr_1fr_260px] gap-8">
          {/* Come home to Greatness banner */}
          <div className="relative rounded-lg overflow-hidden bg-gradient-to-br from-[#7c3aed] to-[#a855f7] p-5 flex items-center min-h-[190px]">
            <div
              className="absolute inset-0 opacity-20"
              style={{
                backgroundImage:
                  "repeating-linear-gradient(135deg, rgba(255,255,255,0.4) 0px, rgba(255,255,255,0.4) 1px, transparent 1px, transparent 10px)",
              }}
            />
            <div className="relative flex items-center gap-3 w-full">
              <p className="text-white font-extrabold text-xl leading-tight flex-1">
                Come home
                <br />
                to G<span className="text-[#ffd966]">r</span>eatness
              </p>
              <div className="w-px h-16 bg-white/30 flex-shrink-0"></div>
              <div className="flex-shrink-0 text-center">
                <p className="text-white font-extrabold text-2xl leading-none">
                  RANKED
                  <br />
                  <span className="text-3xl">5</span>
                  <sup className="text-xs">th</sup>
                </p>
                <p className="text-white/90 text-[9px] mt-1 leading-tight w-[90px]">
                  Best Companies to Work For 2024 by Great Place to Work®
                </p>
              </div>
              <div className="flex flex-col gap-1.5 flex-shrink-0">
                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-center">
                  <span className="text-[6px] font-bold text-[#e11d48] leading-tight">
                    Great
                    <br />
                    Place
                    <br />
                    To Work
                  </span>
                </div>
                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-center">
                  <span className="text-[5px] font-bold text-[#1d4ed8] leading-tight">
                    Best
                    <br />
                    Workplaces
                    <br />
                    Asia
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-white/50 text-xs font-bold tracking-wider mb-4">
              COMPANY
            </h4>
            <div className="flex flex-col gap-3">
              {COMPANY_LINKS.map((link, i) => (
                <a
                  key={i}
                  href="#"
                  className="text-white/70 text-sm hover:text-white transition-colors"
                >
                  {link}
                </a>
              ))}
            </div>
          </div>

          {/* Partner sites */}
          <div>
            <h4 className="text-white/50 text-xs font-bold tracking-wider mb-4">
              PARTNER SITES
            </h4>
            <div className="flex flex-col gap-3">
              {PARTNER_LINKS.map((link, i) => (
                <a
                  key={i}
                  href="#"
                  className="text-white/70 text-sm hover:text-white transition-colors"
                >
                  {link}
                </a>
              ))}
            </div>
          </div>

          {/* Explore */}
          <div>
            <h4 className="text-white/50 text-xs font-bold tracking-wider mb-4">
              EXPLORE
            </h4>
            <div className="flex flex-col gap-3">
              {EXPLORE_LINKS.map((link, i) => (
                <a
                  key={i}
                  href="#"
                  className="text-white/70 text-sm hover:text-white transition-colors"
                >
                  {link}
                </a>
              ))}
            </div>
          </div>

          {/* Mobile app */}
          <div>
            <h4 className="text-white/50 text-xs font-bold tracking-wider mb-4">
              EXPERIENCE HOUSING APP ON MOBILE
            </h4>
            <div className="flex items-center gap-2 mb-4">
              <a
                href="#"
                className="flex items-center gap-1.5 bg-black border border-white/30 rounded-md px-2.5 py-1.5"
              >
                <i className="fab fa-apple text-lg"></i>
                <span className="text-[9px] leading-tight text-left">
                  Download on the
                  <br />
                  <span className="text-xs font-semibold">App Store</span>
                </span>
              </a>
              <a
                href="#"
                className="flex items-center gap-1.5 bg-black border border-white/30 rounded-md px-2.5 py-1.5"
              >
                <i className="fab fa-google-play text-lg"></i>
                <span className="text-[9px] leading-tight text-left">
                  GET IT ON
                  <br />
                  <span className="text-xs font-semibold">Google Play</span>
                </span>
              </a>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-16 h-16 bg-white p-1 rounded flex-shrink-0">
                <svg viewBox="0 0 100 100" className="w-full h-full">
                  <rect width="100" height="100" fill="#fff" />
                  {[...Array(10)].map((_, r) =>
                    [...Array(10)].map((_, c) =>
                      (r + c) % 3 === 0 || (r * c) % 7 === 0 ? (
                        <rect
                          key={`${r}-${c}`}
                          x={c * 10}
                          y={r * 10}
                          width="10"
                          height="10"
                          fill="#000"
                        />
                      ) : null
                    )
                  )}
                </svg>
              </div>
              <p className="text-white/60 text-[11px] leading-snug">
                Open camera &amp; scan the QR code to Download the App
              </p>
            </div>
          </div>
        </div>

        {/* Follow + copyright */}
        <div className="max-w-[1300px] mx-auto px-6 pb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h4 className="text-white/50 text-xs font-bold tracking-wider mb-3">
                FOLLOW
              </h4>
              <div className="flex items-center gap-3">
                {SOCIAL_ICONS.map((s, i) => (
                  <a
                    key={i}
                    href="#"
                    aria-label={s.label}
                    className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center text-white/60 hover:text-white hover:border-white/50 transition-colors"
                  >
                    <i className={`fab ${s.icon} text-xs`}></i>
                  </a>
                ))}
              </div>
            </div>
          </div>
          <p className="text-white/40 text-xs mt-6">
            ©2012-26 Locon Solutions Pvt. Ltd.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;