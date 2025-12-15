import { useState } from "react";
import { Link } from "react-router-dom";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function Home() {
  const [form, setForm] = useState({
    ngoId: "",
    month: "",
    peopleHelped: "",
    eventsConducted: "",
    fundsUtilized: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const submit = async () => {
    await fetch(`${API}/report`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    });

    alert("Report submitted");

    // optional reset
    setForm({
      ngoId: "",
      month: "",
      peopleHelped: "",
      eventsConducted: "",
      fundsUtilized: ""
    });
  };

  return (
    <div className="max-w-md mx-auto mt-10 space-y-8">
      <div className="border rounded-lg p-6 shadow-sm">
        <h1 className="text-xl font-bold mb-6">
          Submit Monthly Report
        </h1>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">
            NGO ID
          </label>
          <input
            name="ngoId"
            value={form.ngoId}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">
            Month
          </label>
          <input
            type="month"
            name="month"
            value={form.month}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">
            People Helped
          </label>
          <input
            type="number"
            name="peopleHelped"
            value={form.peopleHelped}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">
            Events Conducted
          </label>
          <input
            type="number"
            name="eventsConducted"
            value={form.eventsConducted}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium mb-1">
            Funds Utilized (₹)
          </label>
          <input
            type="number"
            name="fundsUtilized"
            value={form.fundsUtilized}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        </div>

        <button
          onClick={submit}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Submit Report
        </button>
      </div>

      <div className="border rounded-lg p-5 bg-gray-50 text-center">
        <p className="text-sm text-gray-700 mb-2">
          Want to upload multiple reports at once?
        </p>

        <Link
          to="/bulk"
          className="inline-block bg-white border px-4 py-2 rounded shadow-sm hover:bg-gray-100"
        >
          Go to Bulk CSV Upload →
        </Link>
      </div>
    </div>
  );
}