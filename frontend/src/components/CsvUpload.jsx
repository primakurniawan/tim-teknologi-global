import { useState } from "react";
import { uploadInventoryCsv } from "../api";

export default function CsvUpload({ onUploadSuccess }) {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleUpload = async () => {
    if (!file) return;

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("file", file);

      const response = await uploadInventoryCsv(formData);
      setResult(response.data);
      onUploadSuccess();
    } catch (error) {
      console.error(error);
      alert("Upload failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.card}>
      <h2 style={styles.title}>Bulk Import CSV</h2>

      <div style={styles.row}>
        <input
          type="file"
          accept=".csv"
          onChange={(e) => setFile(e.target.files[0])}
        />
        <button style={styles.button} onClick={handleUpload} disabled={!file || loading}>
          {loading ? "Uploading..." : "Upload"}
        </button>
      </div>

      {result && (
        <div style={styles.resultBox}>
          <p><strong>Total Rows:</strong> {result.total_rows}</p>
          <p><strong>Accepted Rows:</strong> {result.accepted_rows}</p>
          <p><strong>Rejected Rows:</strong> {result.rejected_rows}</p>

          {result.validation_errors.length > 0 && (
            <div>
              <strong>Validation Errors:</strong>
              <ul>
                {result.validation_errors.map((error, index) => (
                  <li key={index}>
                    Row {error.row_number}: {error.message}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

const styles = {
  card: {
    border: "1px solid #ddd",
    borderRadius: "12px",
    padding: "16px",
    background: "white",
    marginBottom: "20px",
  },
  title: {
    marginTop: 0,
  },
  row: {
    display: "flex",
    gap: "12px",
    alignItems: "center",
    flexWrap: "wrap",
  },
  button: {
    padding: "10px 14px",
    borderRadius: "8px",
    border: "none",
    cursor: "pointer",
  },
  resultBox: {
    marginTop: "16px",
    padding: "12px",
    background: "#fafafa",
    borderRadius: "8px",
  },
};