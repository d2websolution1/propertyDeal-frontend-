// frontend/src/components/Homepage/HomeLoanEmiCalculator.jsx
import React, { useState } from 'react';

const HomeLoanEmiCalculator = () => {
  const [loanAmount, setLoanAmount] = useState(5000000); // 50 Lakhs
  const [interestRate, setInterestRate] = useState(8.5); // 8.5%
  const [tenureYears, setTenureYears] = useState(20); // 20 years

  // Calculate Monthly EMI: P * r * (1 + r)^n / ((1 + r)^n - 1)
  const monthlyRate = interestRate / 12 / 100;
  const totalMonths = tenureYears * 12;

  const emi =
    monthlyRate === 0
      ? loanAmount / totalMonths
      : (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) /
        (Math.pow(1 + monthlyRate, totalMonths) - 1);

  const totalPayment = emi * totalMonths;
  const totalInterest = totalPayment - loanAmount;

  const principalPercent = Math.round((loanAmount / totalPayment) * 100);
  const interestPercent = 100 - principalPercent;

  return (
    <section className="py-14 bg-white border-t border-[#e6e2d9]" id="emi-calculator">
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#8a5a00] mb-2">
            <span>FINANCIAL TOOL</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1c2321] tracking-tight">
            Home Loan EMI Calculator
          </h2>
          <p className="text-xs sm:text-sm text-[#5b6662] mt-1">
            Calculate your estimated monthly installment and interest payout before booking your dream home.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-[#fbfaf7] rounded-3xl p-6 sm:p-10 border border-[#e6e2d9] shadow-sm">
          {/* Left Controls: Sliders */}
          <div className="lg:col-span-7 space-y-6">
            {/* 1. Loan Amount */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs sm:text-sm font-bold text-[#1c2321]">
                  Loan Amount
                </label>
                <span className="text-sm sm:text-base font-extrabold text-[#1f5b47] bg-white px-3 py-1 rounded-lg border border-[#e6e2d9]">
                  ₹{(loanAmount / 100000).toFixed(1)} Lakhs
                </span>
              </div>
              <input
                type="range"
                min="500000"
                max="50000000"
                step="100000"
                value={loanAmount}
                onChange={(e) => setLoanAmount(Number(e.target.value))}
                className="w-full h-2 bg-[#e6e2d9] rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-[#5b6662] mt-1">
                <span>₹5 Lakh</span>
                <span>₹5 Crore</span>
              </div>
            </div>

            {/* 2. Interest Rate */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs sm:text-sm font-bold text-[#1c2321]">
                  Interest Rate (% P.A.)
                </label>
                <span className="text-sm sm:text-base font-extrabold text-[#1f5b47] bg-white px-3 py-1 rounded-lg border border-[#e6e2d9]">
                  {interestRate}%
                </span>
              </div>
              <input
                type="range"
                min="6.5"
                max="14.0"
                step="0.1"
                value={interestRate}
                onChange={(e) => setInterestRate(Number(e.target.value))}
                className="w-full h-2 bg-[#e6e2d9] rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-[#5b6662] mt-1">
                <span>6.5%</span>
                <span>14%</span>
              </div>
            </div>

            {/* 3. Tenure Years */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs sm:text-sm font-bold text-[#1c2321]">
                  Loan Tenure
                </label>
                <span className="text-sm sm:text-base font-extrabold text-[#1f5b47] bg-white px-3 py-1 rounded-lg border border-[#e6e2d9]">
                  {tenureYears} Years ({tenureYears * 12} Months)
                </span>
              </div>
              <input
                type="range"
                min="1"
                max="30"
                step="1"
                value={tenureYears}
                onChange={(e) => setTenureYears(Number(e.target.value))}
                className="w-full h-2 bg-[#e6e2d9] rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-[#5b6662] mt-1">
                <span>1 Year</span>
                <span>30 Years</span>
              </div>
            </div>
          </div>

          {/* Right Summary Card */}
          <div className="lg:col-span-5 bg-white rounded-2xl p-6 sm:p-8 border border-[#e6e2d9] shadow-md flex flex-col justify-between">
            <div>
              <span className="text-[11px] uppercase tracking-wider font-bold text-[#5b6662] block mb-1">
                MONTHLY PAYOUT
              </span>
              <div className="text-3xl sm:text-4xl font-black text-[#2563eb] mb-6">
                ₹{Math.round(emi).toLocaleString('en-IN')}
                <span className="text-xs text-[#64748b] font-normal ml-1">/month</span>
              </div>

              {/* Progress bar visual */}
              <div className="w-full h-3 rounded-full overflow-hidden flex bg-gray-200 mb-4">
                <div
                  style={{ width: `${principalPercent}%` }}
                  className="bg-[#2563eb] transition-all duration-300"
                  title={`Principal: ${principalPercent}%`}
                ></div>
                <div
                  style={{ width: `${interestPercent}%` }}
                  className="bg-[#f59e0b] transition-all duration-300"
                  title={`Interest: ${interestPercent}%`}
                ></div>
              </div>

              {/* Details table */}
              <div className="space-y-3 text-xs sm:text-sm pt-2">
                <div className="flex justify-between items-center text-[#64748b]">
                  <span className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-[#2563eb]"></span>
                    Principal Amount:
                  </span>
                  <strong className="text-[#0f172a]">
                    ₹{loanAmount.toLocaleString('en-IN')}
                  </strong>
                </div>

                <div className="flex justify-between items-center text-[#64748b]">
                  <span className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-[#f59e0b]"></span>
                    Total Interest Payable:
                  </span>
                  <strong className="text-[#0f172a]">
                    ₹{Math.round(totalInterest).toLocaleString('en-IN')}
                  </strong>
                </div>

                <div className="flex justify-between items-center pt-2 border-t border-[#f1f5f9] font-bold text-sm sm:text-base text-[#0f172a]">
                  <span>Total Payment:</span>
                  <span className="text-[#2563eb]">
                    ₹{Math.round(totalPayment).toLocaleString('en-IN')}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-[#f1f5f9]">
              <a
                href="https://wa.me/919876543210?text=Hi%20PropertyDeal,%20I%20want%20to%20apply%20for%20a%20home%20loan%20at%20lowest%20interest%20rates"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 rounded-xl bg-[#2563eb] hover:bg-[#1d4ed8] text-white text-xs font-bold flex items-center justify-center gap-2 shadow-xs transition-colors"
              >
                <span>Get Bank Loan Assistance (SBI, HDFC, ICICI)</span>
                <span>→</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HomeLoanEmiCalculator;
