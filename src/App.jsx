import React, { useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import jsPDF from "jspdf";
import * as XLSX from "xlsx";

export default function SIPCalculator() {
  const [lumpsum, setLumpsum] = React.useState(100000);
  const [sip, setSip] = React.useState(10000);
  const [years, setYears] = React.useState(10);
  const [rate, setRate] = React.useState(12);
  const [stepUpType, setStepUpType] = React.useState("percentage");
  const [stepUpValue, setStepUpValue] = React.useState(10);

  const data = useMemo(() => {
    const monthlyRate = rate / 100 / 12;
    let currentSIP = sip;
    let corpus = lumpsum;
    let invested = lumpsum;
    const rows = [];

    for (let y = 1; y <= years; y++) {
      for (let m = 1; m <= 12; m++) {
        corpus = corpus * (1 + monthlyRate) + currentSIP;
        invested += currentSIP;
      }

      rows.push({
        year: y,
        invested: Math.round(invested),
        value: Math.round(corpus),
      });

      if (stepUpType === "percentage") {
        currentSIP += (currentSIP * stepUpValue) / 100;
      } else {
        currentSIP += stepUpValue;
      }
    }

    return rows;
  }, [lumpsum, sip, years, rate, stepUpType, stepUpValue]);

  const latest = data[data.length - 1] || { invested: 0, value: 0 };

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.text("SIP & Lumpsum Investment Report", 14, 16);

    let y = 30;
    data.forEach((row) => {
      doc.text(
        `Year ${row.year}: Invested ₹${row.invested.toLocaleString()} | Value ₹${row.value.toLocaleString()}`,
        14,
        y
      );
      y += 8;
    });

    doc.save("sip-report.pdf");
  };

  const exportExcel = () => {
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "SIP Growth");
    XLSX.writeFile(wb, "sip-report.xlsx");
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-xl p-8">
        <h1 className="text-3xl font-bold mb-6">SIP & Lumpsum Calculator</h1>

        <div className="grid md:grid-cols-3 gap-4">
          <Input label="Lumpsum (₹)" value={lumpsum} onChange={setLumpsum} />
          <Input label="Monthly SIP (₹)" value={sip} onChange={setSip} />
          <Input label="Years" value={years} onChange={setYears} />
          <Input label="Expected Return (%)" value={rate} onChange={setRate} />

          <div>
            <label className="text-sm">Annual Step-Up Type</label>
            <select
              className="w-full border rounded p-2"
              value={stepUpType}
              onChange={(e) => setStepUpType(e.target.value)}
            >
              <option value="percentage">Percentage</option>
              <option value="fixed">Fixed Amount</option>
            </select>
          </div>

          <Input
            label={stepUpType === "percentage" ? "Step-Up %" : "Step-Up ₹"}
            value={stepUpValue}
            onChange={setStepUpValue}
          />
        </div>

        <div className="grid md:grid-cols-3 gap-4 mt-6">
          <Card title="Total Invested" value={`₹${latest.invested.toLocaleString()}`} />
          <Card title="Returns" value={`₹${(latest.value - latest.invested).toLocaleString()}`} />
          <Card
            title="Future Value"
            value={`₹${latest.value.toLocaleString()}`}
            highlight
          />
        </div>

        <h2 className="text-xl font-semibold mt-10 mb-4">Year-wise Growth</h2>

        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="invested" strokeWidth={2} />
              <Line type="monotone" dataKey="value" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="flex gap-4 mt-6">
          <button
            onClick={exportPDF}
            className="px-4 py-2 rounded bg-gray-800 text-white"
          >
            Export PDF
          </button>
          <button
            onClick={exportExcel}
            className="px-4 py-2 rounded bg-green-600 text-white"
          >
            Export Excel
          </button>
        </div>

        <p className="text-xs text-gray-500 mt-6">
          Disclaimer: Calculations are illustrative only.
        </p>
      </div>
    </div>
  );
}

function Input({ label, value, onChange }) {
  return (
    <div>
      <label className="text-sm">{label}</label>
      <input
        type="number"
        min="0"
        className="w-full border rounded p-2"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
      />
    </div>
  );
}

function Card({ title, value, highlight }) {
  return (
    <div className={`p-4 rounded-xl ${highlight ? "bg-green-50 border border-green-200" : "bg-gray-50"}`}>
      <p className="text-sm text-gray-600">{title}</p>
      <p className="text-xl font-bold">{value}</p>
    </div>
  );
}
