import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function Dashboard() {
  const navigate = useNavigate();
  const didInitFetch = useRef(false);

  const currentMonth = new Date().toISOString().slice(0, 7);

  const [month, setMonth] = useState(currentMonth);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  /* ---------- TABLE STATE ---------- */
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  // Default alphanumeric NGO sort
  const [sortBy, setSortBy] = useState("ngoId");
  const [order, setOrder] = useState("asc");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) navigate("/admin");
  }, [navigate]);

  useEffect(() => {
    if (!didInitFetch.current) {
      fetchDashboard();
      didInitFetch.current = true;
    }
  }, []);

  /* ---------- AUTO FETCH (PAGE / SEARCH / SORT) ---------- */
  useEffect(() => {
    if (!didInitFetch.current) return;
    fetchDashboard();
    // eslint-disable-next-line
  }, [page, search, sortBy, order]);

  const fetchDashboard = async () => {
    if (!month) return;

    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("token");

      const params = new URLSearchParams({
        month,
        page,
        limit: 10,
        search,
        sortBy,
        order
      });

      const res = await fetch(`${API}/dashboard?${params.toString()}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (res.status === 401) {
        localStorage.removeItem("token");
        navigate("/admin");
        return;
      }

      if (!res.ok) throw new Error();

      const json = await res.json();
      setData(json);
    } catch {
      setError("Could not load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const handleSort = (field) => {
    let nextOrder = "asc";

    if (sortBy === field) {
      nextOrder = order === "asc" ? "desc" : "asc";
    }

    setSortBy(field);
    setOrder(nextOrder);
    setPage(1);
  };

  return (
    <div className="max-w-6xl mx-auto mt-10 px-4">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>

      <div className="flex flex-wrap gap-4 mb-6 bg-white p-4 border rounded">
        <input
          type="month"
          value={month}
          onChange={(e) => {
            setMonth(e.target.value);
            setPage(1);
          }}
          className="border px-3 py-2 rounded"
        />

        <input
          placeholder="Search NGO ID"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="border px-3 py-2 rounded"
        />

        <button
          onClick={() => {
            setPage(1);
            fetchDashboard();
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Fetch
        </button>
      </div>

      {error && <p className="text-red-600 mb-4">{error}</p>}

      {data && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <StatCard label="Total NGOs" value={data.totals.totalNGOs} />
          <StatCard label="People Helped" value={data.totals.totalPeopleHelped} />
          <StatCard label="Events Conducted" value={data.totals.totalEvents} />
          <StatCard
            label="Funds Utilized"
            value={`₹ ${formatNumber(data.totals.totalFunds)}`}
          />
        </div>
      )}

      {data?.rows?.length > 0 && (
        <div className="bg-white border rounded overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-100 border-b">
              <tr>
                <SortableTH label="NGO ID" field="ngoId" {...{ sortBy, order, handleSort }} />
                <SortableTH label="People" field="peopleHelped" {...{ sortBy, order, handleSort }} />
                <SortableTH label="Events" field="eventsConducted" {...{ sortBy, order, handleSort }} />
                <SortableTH label="Funds" field="fundsUtilized" {...{ sortBy, order, handleSort }} />
              </tr>
            </thead>

            <tbody>
              {data.rows.map((row) => (
                <tr key={row._id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium">{row.ngoId}</td>
                  <td className="px-4 py-3 text-right">{row.peopleHelped}</td>
                  <td className="px-4 py-3 text-right">{row.eventsConducted}</td>
                  <td className="px-4 py-3 text-right">
                    ₹ {formatNumber(row.fundsUtilized)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {data && data.rows.length === 0 && (
        <div className="bg-yellow-50 text-yellow-700 p-4 rounded mt-6">
          No matching reports found.
        </div>
      )}

      {data && data.rows.length > 0 && (
        <div className="flex justify-between items-center mt-6">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
            className="px-3 py-1 border rounded disabled:opacity-40"
          >
            Prev
          </button>

          <span className="text-sm text-gray-600">
            Page {data.pagination.page} of {data.pagination.totalPages}
          </span>

          <button
            disabled={page === data.pagination.totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="px-3 py-1 border rounded disabled:opacity-40"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}

function StatCard({ label, value }) {
  return (
    <div className="border rounded p-4 bg-white">
      <p className="text-sm text-gray-500">{label}</p>
      <p className="text-xl font-bold mt-1">{value}</p>
    </div>
  );
}

function SortableTH({ label, field, sortBy, order, handleSort }) {
  return (
    <th
      onClick={() => handleSort(field)}
      className="px-4 py-3 cursor-pointer select-none text-right"
    >
      {label}{" "}
      {sortBy === field ? (order === "asc" ? "↑" : "↓") : ""}
    </th>
  );
}

function formatNumber(num) {
  return new Intl.NumberFormat("en-IN").format(num);
}