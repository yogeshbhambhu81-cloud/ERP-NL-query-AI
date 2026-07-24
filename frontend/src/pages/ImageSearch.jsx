import React, { useState, useRef, useCallback } from 'react';
import { IoImageOutline, IoCloudUploadOutline, IoSearchOutline, IoClose } from 'react-icons/io5';
import ImageCard from '../components/features/ImageCard';
import Spinner from '../components/ui/Spinner';
import EmptyState from '../components/ui/EmptyState';
import { erpService } from '../services/apiClient';

function ImageSearch() {
  const [textQuery, setTextQuery] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [threshold, setThreshold] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);
  const abortRef = useRef(null);

  const handleFile = useCallback((file) => {
    if (!file || !file.type.startsWith('image/')) return;
    setSelectedFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result);
    reader.readAsDataURL(file);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    handleFile(file);
  }, [handleFile]);

  const handleSearch = useCallback(async () => {
    if (!selectedFile && !textQuery.trim()) return;

    if (abortRef.current) abortRef.current.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setLoading(true);
    setHasSearched(true);
    setError(null);

    try {
      const data = await erpService.searchByImage(selectedFile, textQuery.trim(), threshold, controller.signal);
      setResults(data);
    } catch (err) {
      if (err.name !== 'AbortError') {
        setError(err.customMessage || err.message || 'Image similarity search failed.');
        setResults([]);
      }
    } finally {
      setLoading(false);
    }
  }, [selectedFile, textQuery, threshold]);

  const clearImage = () => {
    setSelectedFile(null);
    setPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="image-search-page">
      {/* Search Controls */}
      <div className="wfx-card image-search-controls">
        {/* Dropzone */}
        <div
          className={`dropzone ${isDragging ? 'dragging' : ''} ${preview ? 'has-preview' : ''}`}
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={() => !preview && fileInputRef.current?.click()}
          role="button"
          tabIndex={0}
          aria-label="Upload garment image"
          onKeyDown={(e) => e.key === 'Enter' && !preview && fileInputRef.current?.click()}
        >
          {preview ? (
            <div className="dropzone-preview">
              <img src={preview} alt="Selected garment" className="dropzone-img" />
              <button className="dropzone-clear-btn" onClick={(e) => { e.stopPropagation(); clearImage(); }} aria-label="Remove image">
                <IoClose />
              </button>
            </div>
          ) : (
            <div className="dropzone-placeholder">
              <IoCloudUploadOutline size={36} />
              <p className="dropzone-title">Drop a garment image here</p>
              <p className="dropzone-hint">or click to browse · PNG, JPG, WEBP</p>
            </div>
          )}
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          style={{ display: 'none' }}
          onChange={(e) => handleFile(e.target.files[0])}
          aria-hidden="true"
        />

        <div className="image-search-divider"><span>or</span></div>

        {/* Text search */}
        <div className="wfx-input-field-container">
          <span className="wfx-input-icon"><IoSearchOutline size={18} /></span>
          <input
            id="image-text-search"
            type="search"
            className="wfx-input"
            placeholder="Describe the garment… e.g. navy blue cotton hoodie"
            value={textQuery}
            onChange={(e) => setTextQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            aria-label="Text-based image search"
          />
        </div>

        {/* Threshold slider */}
        <div className="threshold-control">
          <label htmlFor="similarity-threshold" className="filter-label">
            Minimum Similarity: <strong style={{ color: 'var(--primary)' }}>{threshold}%</strong>
          </label>
          <input
            id="similarity-threshold"
            type="range"
            min={0}
            max={100}
            step={5}
            value={threshold}
            onChange={(e) => setThreshold(Number(e.target.value))}
            className="wfx-range"
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            <span>0% (All)</span><span>100% (Exact)</span>
          </div>
        </div>

        <button
          id="image-search-submit"
          className="wfx-btn wfx-btn-primary"
          onClick={handleSearch}
          disabled={(!selectedFile && !textQuery.trim()) || loading}
          style={{ width: '100%' }}
        >
          {loading ? <><Spinner size="sm" /> Searching…</> : <><IoImageOutline /> Find Similar Garments</>}
        </button>
      </div>

      {/* Results */}
      <div className="image-search-results">
        {error && (
          <div className="wfx-card" style={{ borderLeft: '4px solid var(--danger)', padding: '1rem', marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h4 style={{ color: 'var(--danger)', margin: 0 }}>Visual Search failed</h4>
              <p style={{ color: 'var(--text-secondary)', margin: '0.25rem 0 0 0', fontSize: '0.875rem' }}>{error}</p>
            </div>
            <button className="wfx-btn wfx-btn-secondary" onClick={handleSearch}>Retry</button>
          </div>
        )}

        {loading ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '3rem', justifyContent: 'center' }}>
            <Spinner size="lg" />
            <p style={{ color: 'var(--text-secondary)' }}>Analyzing visual similarity…</p>
          </div>
        ) : hasSearched && results.length === 0 ? (
          <EmptyState
            icon={<IoImageOutline />}
            title="No similar garments found"
            description="Try lowering the similarity threshold or using a different search term."
          />
        ) : hasSearched ? (
          <>
            <p className="search-results-count" style={{ marginBottom: '1.25rem' }}>
              Found <strong>{results.length}</strong> similar garments
            </p>
            <div className="image-results-grid">
              {results.map((p) => <ImageCard key={p.id} product={p} />)}
            </div>
          </>
        ) : (
          <EmptyState
            icon={<IoImageOutline />}
            title="Start your visual search"
            description="Upload a garment image or describe it in text to find visually similar products."
          />
        )}
      </div>
    </div>
  );
}

export default ImageSearch;
