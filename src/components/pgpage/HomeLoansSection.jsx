// HomeLoansSection.jsx
import React from "react";
import { Link } from "react-router-dom";

const HomeLoansSection = () => {
  const items = [
    { id: 1, title: "Home Loans", subtitle: null, color: "#6C3EE6", path: "/home-loans" },
    {
      id: 2,
      title: "Home Loans EMI Calculator",
      subtitle: null,
      color: "#e0569a",
      path: "/home-loans/emi-calculator",
    },
    {
      id: 3,
      title: "Home Loans Eligibility Calculator",
      subtitle: null,
      color: "#2fb47c",
      path: "/home-loans/eligibility-calculator",
    },
    { id: 4, title: "HDFC", subtitle: "Home Loans", color: "#4f6bd8", path: "/home-loans/hdfc" },
    { id: 5, title: "SBI", subtitle: "Home Loans", color: "#e0569a", path: "/home-loans/sbi" },
    { id: 6, title: "ICICI", subtitle: "Home Loans", color: "#2fb47c", path: "/home-loans/icici" },
    {
      id: 7,
      title: "Bajaj Finserv",
      subtitle: "Home Loans",
      color: "#d9975a",
      path: "/home-loans/bajaj-finserv",
    },
    {
      id: 8,
      title: "Kotak Mahindra",
      subtitle: "Home Loans",
      color: "#4f6bd8",
      path: "/home-loans/kotak-mahindra",
    },
    {
      id: 9,
      title: "Citibank",
      subtitle: "Home Loans",
      color: "#d9975a",
      path: "/home-loans/citibank",
    },
    {
      id: 10,
      title: "Axis Bank",
      subtitle: "Home Loans",
      color: "#4f6bd8",
      path: "/home-loans/axis-bank",
    },
    {
      id: 11,
      title: "IDBI Bank",
      subtitle: "Home Loans",
      color: "#e0569a",
      path: "/home-loans/idbi-bank",
    },
    { id: 12, title: "DHFL", subtitle: "Home Loans", color: "#2fb47c", path: "/home-loans/dhfl" },
    {
      id: 13,
      title: "Tata Capital",
      subtitle: "Home Loans",
      color: "#d9975a",
      path: "/home-loans/tata-capital",
    },
  ];

  return (
    <section className="max-w-[1300px] mx-auto px-4 py-12">
      {/* Heading */}
      <div className="mb-6">
        <h2 className="text-2xl md:text-3xl text-[#0b1a2e]">
          Home <span className="font-bold">Loans</span>
        </h2>
        <p className="text-gray-500 text-sm mt-1">
          Everything you need to know about home loans
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 max-w-[900px]">
        {items.map((item) => (
          <Link
            key={item.id}
            to={item.path}
            className="bg-[#f3f4f6] hover:bg-gray-200 transition-colors rounded-md px-4 py-3 flex flex-col justify-center min-h-[70px]"
          >
            <span
              className="font-bold text-sm leading-snug"
              style={{ color: item.color }}
            >
              {item.title}
            </span>
            {item.subtitle && (
              <span className="text-gray-600 text-xs mt-0.5">{item.subtitle}</span>
            )}
          </Link>
        ))}
      </div>
    </section>
  );
};

export default HomeLoansSection;