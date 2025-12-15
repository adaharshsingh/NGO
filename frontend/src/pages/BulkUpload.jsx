import { useEffect, useState } from "react";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function BulkUpload() {
  const [file, setFile] = useState(null);
  const [jobId, setJobId] = useState(null);
  const [jobStatus, setJobStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [showErrors, setShowErrors] = useState(false);

  const upload = async () => {
    if (!file) return;

    setLoading(true);
    setMessage("");
    setJobStatus(null);
    setShowErrors(false);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch(`${API}/reports/upload`, {
        method: "POST",
        body: formData
      });

      const data = await res.json();
      setJobId(data.jobId);
      setMessage("Upload successful. Processing started.");
    } catch {
      setMessage("Upload failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Poll job status
  useEffect(() => {
    if (!jobId) return;

    const interval = setInterval(async () => {
      const res = await fetch(`${API}/job-status/${jobId}`);
      const data = await res.json();
      setJobStatus(data);

      if (data.status === "completed" || data.status === "failed") {
        clearInterval(interval);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [jobId]);

  const processed = jobStatus?.processedRows ?? 0;
  const failed = jobStatus?.failedRows ?? 0;
  const totalDone = processed + failed;

  const progressPercent =
    totalDone > 0 ? Math.min((processed / totalDone) * 100, 100) : 0;

  return (
    <div className="max-w-lg mx-auto mt-12 p-6 border rounded-lg shadow-sm">
      <h1 className="text-2xl font-bold mb-2">Bulk CSV Upload</h1>
      <p className="text-sm text-gray-600 mb-6">
        Upload a CSV file containing monthly NGO reports.
      </p>

      {message && (
        <div className="mb-4 p-3 rounded bg-blue-50 text-blue-700 text-sm">
          {message}
        </div>
      )}

      <label className="flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-6 cursor-pointer hover:border-blue-500 transition">
        <input
          type="file"
          accept=".csv"
          className="hidden"
          onChange={(e) => setFile(e.target.files[0])}
        />
        <p className="font-medium">
          {file ? file.name : "Click to select CSV file"}
        </p>
        <p className="text-sm text-gray-500">Only .csv supported</p>
      </label>

      <button
        onClick={upload}
        disabled={!file || loading}
        className={`w-full mt-6 py-2 rounded text-white ${
          loading || !file
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-blue-600 hover:bg-blue-700"
        }`}
      >
        {loading ? "Uploading..." : "Upload CSV"}
      </button>

      {/* Job status */}
      {jobId && (
        <div className="mt-6 p-4 border rounded bg-gray-50 text-sm">
          <p>
            <span className="font-medium">Job ID:</span> {jobId}
          </p>

          <p className="mt-1">
            <span className="font-medium">Status:</span>{" "}
            <span className="capitalize">
              {jobStatus?.status || "pending"}
            </span>
          </p>

          {totalDone > 0 && (
            <div className="mt-3">
              <p className="mb-1">
                {processed} / {totalDone} rows completed
              </p>
              <div className="w-full bg-gray-200 rounded h-2">
                <div
                  className="bg-blue-600 h-2 rounded transition-all"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          )}

          {jobStatus?.status === "completed" &&
            jobStatus?.errors?.length > 0 && (
              <div className="mt-4">
                <button
                  onClick={() => setShowErrors(!showErrors)}
                  className="text-blue-600 text-sm underline"
                >
                  {showErrors
                    ? "Hide failed rows"
                    : `Show failed rows (${jobStatus.errors.length})`}
                </button>

                {showErrors && (
                  <div className="mt-2 border rounded p-2 bg-white max-h-40 overflow-auto">
                    {jobStatus.errors.map((err, idx) => (
                      <div
                        key={idx}
                        className="text-sm border-b last:border-b-0 py-1"
                      >
                        <span className="font-medium">
                          Row {err.rowNumber}:
                        </span>{" "}
                        {err.reason}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
        </div>
      )}
    </div>
  );
}