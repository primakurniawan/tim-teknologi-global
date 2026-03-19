export default function Pagination({ page, totalPages, onPageChange }) {
  return (
    <div style={styles.wrapper}>
      <button
        style={styles.button}
        onClick={() => onPageChange(page - 1)}
        disabled={page <= 1}
      >
        Previous
      </button>

      <span>
        Page {page} of {totalPages}
      </span>

      <button
        style={styles.button}
        onClick={() => onPageChange(page + 1)}
        disabled={page >= totalPages}
      >
        Next
      </button>
    </div>
  );
}

const styles = {
  wrapper: {
    marginTop: "16px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  button: {
    padding: "8px 12px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    cursor: "pointer",
    background: "white",
  },
};