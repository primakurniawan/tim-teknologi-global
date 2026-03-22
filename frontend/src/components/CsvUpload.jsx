import { useRef, useState } from "react";
import { uploadInventoryCsv } from "../api";
import { T } from "../theme";

export default function CsvUpload({ onUploadSuccess }) {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef(null);

  const handleFile = f => {
    if (f && f.name.endsWith(".csv")) { setFile(f); setResult(null); }
  };

  const handleUpload = async () => {
    if (!file) return;
    try {
      setLoading(true);
      const fd = new FormData();
      fd.append("file", file);
      const r = await uploadInventoryCsv(fd);
      setResult(r.data);
      onUploadSuccess();
    } catch {
      alert("Upload failed. Please check the file and try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDrop = e => {
    e.preventDefault();
    setDragOver(false);
    handleFile(e.dataTransfer.files[0]);
  };

  return (
    <div style={s.card}>
      <h2 style={s.title}>Bulk CSV Import</h2>
      <p style={s.sub}>Upload a transaction file to update inventory</p>

      {/* Drop zone */}
      <div
        style={{ ...s.dropZone, ...(dragOver ? s.dropZoneActive : file ? s.dropZoneHasFile : {}) }}
        onClick={() => inputRef.current?.click()}
        onDragOver={e => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".csv"
          style={{ display: "none" }}
          onChange={e => handleFile(e.target.files[0])}
        />
        <div style={s.dropIcon}>
          {file ? (
            <svg width="22" height="22" fill="none" viewBox="0 0 24 24">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6Z" stroke={T.accent} strokeWidth="1.5"/>
              <path d="M14 2v6h6M9 13l2 2 4-4" stroke={T.accent} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          ) : (
            <svg width="22" height="22" fill="none" viewBox="0 0 24 24">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" stroke={T.textTertiary} strokeWidth="1.5" strokeLinecap="round"/>
              <path d="m17 8-5-5-5 5M12 3v12" stroke={T.textTertiary} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          )}
        </div>
        <div style={s.dropText}>
          {file ? (
            <><span style={{ fontWeight: 500, color: T.textPrimary }}>{file.name}</span><br/>
            <span style={{ fontSize: 11 }}>{(file.size / 1024).toFixed(1)} KB · click to change</span></>
          ) : (
            <><span style={{ fontWeight: 500, color: T.textPrimary }}>Click or drag CSV here</span><br/>
            <span style={{ fontSize: 11 }}>sku, warehouse, transaction_type, quantity, timestamp</span></>
          )}
        </div>
      </div>

      {/* Actions */}
      <div style={s.actions}>
        <button
          style={{ ...s.uploadBtn, ...((!file || loading) ? s.uploadBtnDisabled : {}) }}
          onClick={handleUpload}
          disabled={!file || loading}
        >
          {loading ? (
            <><span style={s.spinner} />Uploading…</>
          ) : (
            <>
              <svg width="14" height="14" fill="none" viewBox="0 0 24 24">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                <path d="m17 8-5-5-5 5M12 3v12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Upload
            </>
          )}
        </button>
        {file && !loading && (
          <button style={s.clearBtn} onClick={() => { setFile(null); setResult(null); }}>
            Clear
          </button>
        )}
      </div>

      {/* Result */}
      {result && (
        <div style={s.result}>
          <div style={s.resultRow}>
            <Stat label="Total" value={result.total_rows} />
            <Stat label="Accepted" value={result.accepted_rows} color={T.inStockText} />
            <Stat label="Rejected" value={result.rejected_rows} color={result.rejected_rows > 0 ? T.outStockText : T.inStockText} />
          </div>
          {result.validation_errors.length > 0 && (
            <div style={s.errors}>
              <div style={s.errorsTitle}>Validation errors</div>
              {result.validation_errors.slice(0, 5).map((e, i) => (
                <div key={i} style={s.errLine}>
                  <span style={s.errRow}>Row {e.row_number}</span>
                  <span style={s.errMsg}>{e.message}</span>
                </div>
              ))}
              {result.validation_errors.length > 5 && (
                <div style={{ fontSize: 11, color: T.textTertiary, marginTop: 4 }}>
                  …and {result.validation_errors.length - 5} more
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function Stat({ label, value, color }) {
  return (
    <div style={{ textAlign: "center" }}>
      <div style={{ fontSize: 20, fontWeight: 600, fontFamily: T.fontMono, color: color || T.textPrimary }}>
        {value}
      </div>
      <div style={{ fontSize: 11, color: T.textTertiary, marginTop: 1 }}>{label}</div>
    </div>
  );
}

const s = {
  card: {
    background: T.bgCard,
    borderRadius: T.radiusLg,
    boxShadow: T.shadow,
    padding: "20px",
    height: "100%",
  },
  title: {
    fontSize: 15,
    fontWeight: 600,
    color: T.textPrimary,
    marginBottom: 2,
  },
  sub: {
    fontSize: 12,
    color: T.textTertiary,
    marginBottom: 14,
  },
  dropZone: {
    border: `1.5px dashed ${T.border}`,
    borderRadius: T.radius,
    padding: "18px 16px",
    cursor: "pointer",
    display: "flex",
    gap: 12,
    alignItems: "center",
    transition: "all 0.15s",
    background: T.bgMuted,
    marginBottom: 12,
  },
  dropZoneActive: {
    borderColor: T.accent,
    background: T.bgAccentLight,
  },
  dropZoneHasFile: {
    borderColor: "#86EFAC",
    background: "#F0FDF4",
  },
  dropIcon: { flexShrink: 0 },
  dropText: {
    fontSize: 12,
    color: T.textSecondary,
    lineHeight: 1.5,
  },
  actions: {
    display: "flex",
    gap: 8,
    marginBottom: 12,
  },
  uploadBtn: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    padding: "8px 16px",
    borderRadius: T.radius,
    border: "none",
    background: T.accent,
    color: "white",
    fontSize: 13,
    fontFamily: T.fontBody,
    fontWeight: 500,
    cursor: "pointer",
  },
  uploadBtnDisabled: {
    opacity: 0.45,
    cursor: "not-allowed",
  },
  clearBtn: {
    padding: "8px 12px",
    borderRadius: T.radius,
    border: `1px solid ${T.border}`,
    background: T.bgCard,
    fontSize: 13,
    fontFamily: T.fontBody,
    color: T.textSecondary,
    cursor: "pointer",
  },
  spinner: {
    display: "inline-block",
    width: 12,
    height: 12,
    border: `2px solid rgba(255,255,255,0.3)`,
    borderTopColor: "white",
    borderRadius: "50%",
    animation: "spin 0.7s linear infinite",
  },
  result: {
    marginTop: 4,
    padding: 14,
    background: T.bgMuted,
    borderRadius: T.radius,
    border: `1px solid ${T.border}`,
  },
  resultRow: {
    display: "flex",
    gap: 24,
    justifyContent: "center",
    marginBottom: 12,
  },
  errors: {
    borderTop: `1px solid ${T.border}`,
    paddingTop: 10,
  },
  errorsTitle: {
    fontSize: 11,
    fontWeight: 600,
    color: T.outStockText,
    textTransform: "uppercase",
    letterSpacing: "0.06em",
    marginBottom: 6,
  },
  errLine: {
    display: "flex",
    gap: 8,
    marginBottom: 3,
    alignItems: "baseline",
  },
  errRow: {
    fontSize: 11,
    fontWeight: 600,
    fontFamily: T.fontMono,
    color: T.outStockText,
    flexShrink: 0,
  },
  errMsg: {
    fontSize: 12,
    color: T.textSecondary,
  },
};
