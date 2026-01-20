import React, { useState } from "react";

export default function SIPCalculator() {
  const [lumpsum, setLumpsum] = useState(100000);
  const [sip, setSip] = useState(10000);
  const [years, setYears] = useState(10);
  const [rate, setRate] = useState(12);
  const [stepUpType, setStepUpType] = useState("percentage");
  const [stepUpValue, setStepUpValue] = useState(10);

  const calculate = () => {
    const monthlyRate = rate / 100 / 12;
    let totalInvested = lumpsum;
    let futureValue = lumpsum * Math.pow(1 + monthlyRate, years * 12);
    let currentSIP = sip;

    for (let y = 1; y <= years; y++) {
      for (let m = 1; m <= 12; m++) {
        futureValue += currentSIP * Math.pow(1 + monthlyRate, (years - y) * 12 + (12 - m));
        totalInvested += currentSIP;
      }
      if (stepUpType === "percentage") {
        currentSIP += (currentSIP * stepUpValue) / 100;
      } else {
        currentSIP += stepUpValue;
      }
    }

    return {
      totalInvested: Math.round(totalInvested),
      futureValue: Math.round(futureValue),
      returns: Math.round(futureValue - totalInvested),
    };
  };

  const result = calculate();

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="max-w-3xl w-full bg-white rounded-2xl shadow-xl p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">SIP & Lumpsum Calculator</h1>
        <p className="text-gray-600 mb-6">
          Estimate your mutual fund wealth with SIP, lumpsum investment, and annual step-up options.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input label="Lumpsum Amount (₹)" value={lumpsum} onChange={setLumpsum} />
          <Input label="Monthly SIP Amount (₹)" value={sip} onChange={setSip} />
          <Input label="Investment Duration (Years)" value={years} onChange={setYears} />
          <Input label="Expected Annual Return (%)" value={rate} onChange={setRate} />

          <div>
            <label className="text-sm font-medium text-gray-700">Annual Step-Up Type</label>
            <select
              className="mt-1 w-full rounded-lg border p-2"
              value={stepUpType}
              onChange={(e) => setStepUpType(e.target.value)}
            >
              <option value="percentage">Percentage (%)</option>
              <option value="fixed">Fixed Amount (₹)</option>
            </select>
          </div>

          <Input
            label={stepUpType === "percentage" ? "Step-Up Percentage (%)" : "Step-Up Amount (₹)"}
            value={stepUpValue}
            onChange={setStepUpValue}
          />
        </div>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <ResultCard title="Total Invested" value={`₹${result.totalInvested.toLocaleString()}`} />
          <ResultCard title="Estimated Returns" value={`₹${result.returns.toLocaleString()}`} />
          <ResultCard title="Future Value" value={`₹${result.futureValue.toLocaleString()}`} highlight />
        </div>

        <p className="text-xs text-gray-500 mt-6">
          Disclaimer: Calculations are for illustration only and do not guarantee actual returns.
        </p>
      </div>
    </div>
  );
}

function Input({ label, value, onChange }) {
  return (
    <div>
      <label className="text-sm font-medium text-gray-700">{label}</label>
      <input
        type="number"
        className="mt-1 w-full rounded-lg border p-2"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
      />
    </div>
  );
}

function ResultCard({ title, value, highlight }) {
  return (
    <div className={`rounded-xl p-4 ${highlight ? "bg-green-50 border border-green-200" : "bg-gray-50"}`}>
      <p className="text-sm text-gray-600">{title}</p>
      <p className={`text-xl font-bold ${highlight ? "text-green-700" : "text-gray-800"}`}>{value}</p>
    </div>
  );
}
