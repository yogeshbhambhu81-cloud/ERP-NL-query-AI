import React, { useState, useCallback } from 'react';
import { IoDownloadOutline, IoCheckmarkCircle, IoAlertCircle } from 'react-icons/io5';

/**
 * Reusable Export CSV button with loading state and toast notifications.
 *
 * @param {Function} onExport   - Callback that performs the export (should throw on failure)
 * @param {boolean}  disabled   - Whether the button should be disabled
 * @param {string}   [label]    - Button label text (default: "Export CSV")
 * @param {string}   [tooltip]  - Tooltip text when disabled (default: "No data available to export")
 */
function ExportButton({ onExport, disabled = false, label = 'Export CSV', tooltip = 'No data available to export' }) {
  const [exporting, setExporting] = useState(false);
  const [toast, setToast] = useState(null); // { type: 'success' | 'error', message: string }

  const showToast = useCallback((type, message) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3000);
  }, []);

  const handleClick = useCallback(async () => {
    if (exporting || disabled) return;

    setExporting(true);
    try {
      await onExport();
      showToast('success', 'CSV exported successfully.');
    } catch (err) {
      showToast('error', err.message || 'Export failed.');
    } finally {
      setExporting(false);
    }
  }, [onExport, exporting, disabled, showToast]);

  return (
    <>
      <button
        className={`wfx-btn wfx-btn-secondary export-csv-btn ${exporting ? 'exporting' : ''}`}
        onClick={handleClick}
        disabled={disabled || exporting}
        title={disabled ? tooltip : `Download as CSV`}
        aria-label={label}
      >
        <IoDownloadOutline className={exporting ? 'export-icon-spin' : ''} />
        <span>{exporting ? 'Exporting…' : label}</span>
      </button>

      {/* Toast Notification */}
      {toast && (
        <div className={`export-toast export-toast-${toast.type}`} role="alert" aria-live="polite">
          {toast.type === 'success' ? <IoCheckmarkCircle size={18} /> : <IoAlertCircle size={18} />}
          <span>{toast.message}</span>
        </div>
      )}
    </>
  );
}

export default ExportButton;
