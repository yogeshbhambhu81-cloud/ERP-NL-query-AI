import React, { memo } from 'react';
import { IoClose } from 'react-icons/io5';
import {
  categories, fabrics, suppliers, buyers, prints, colors, seasons, gsmRanges,
} from '../../constants/filterOptions';

const FilterGroup = ({ label, id, value, onChange, options }) => (
  <div className="filter-group">
    <label htmlFor={id} className="filter-label">{label}</label>
    <select
      id={id}
      className="wfx-select"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    >
      <option value="">All</option>
      {options.map((opt) => (
        <option key={typeof opt === 'string' ? opt : opt.label} value={typeof opt === 'string' ? opt : opt.label}>
          {typeof opt === 'string' ? opt : opt.label}
        </option>
      ))}
    </select>
  </div>
);

const FilterPanel = memo(function FilterPanel({ filters, onChange, onReset }) {
  const hasActiveFilters = Object.values(filters).some(Boolean);

  return (
    <aside className="filter-panel" aria-label="Product filters">
      <div className="filter-panel-header">
        <h2 className="filter-panel-title">Filters</h2>
        {hasActiveFilters && (
          <button
            className="wfx-btn wfx-btn-ghost filter-reset-btn"
            onClick={onReset}
            aria-label="Reset all filters"
          >
            <IoClose size={14} /> Reset
          </button>
        )}
      </div>

      <div className="filter-groups">
        <FilterGroup label="Category"  id="filter-category" value={filters.category  || ''} onChange={(v) => onChange('category', v)}  options={categories} />
        <FilterGroup label="Fabric"    id="filter-fabric"   value={filters.fabric    || ''} onChange={(v) => onChange('fabric', v)}    options={fabrics} />
        <FilterGroup label="GSM Range" id="filter-gsm"      value={filters.gsmRange  || ''} onChange={(v) => onChange('gsmRange', v)}  options={gsmRanges} />
        <FilterGroup label="Supplier"  id="filter-supplier" value={filters.supplier  || ''} onChange={(v) => onChange('supplier', v)}  options={suppliers} />
        <FilterGroup label="Buyer"     id="filter-buyer"    value={filters.buyer     || ''} onChange={(v) => onChange('buyer', v)}     options={buyers} />
        <FilterGroup label="Print"     id="filter-print"    value={filters.print     || ''} onChange={(v) => onChange('print', v)}     options={prints} />
        <FilterGroup label="Color"     id="filter-color"    value={filters.color     || ''} onChange={(v) => onChange('color', v)}     options={colors} />
        <FilterGroup label="Season"    id="filter-season"   value={filters.season    || ''} onChange={(v) => onChange('season', v)}    options={seasons} />
      </div>
    </aside>
  );
});

export default FilterPanel;
