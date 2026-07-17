import { useState } from 'react';
import { Search, X, MapPin, Briefcase } from 'lucide-react';
import { useJobs } from '../../context/JobContext';

function JobFilter() {
  const { filters, updateFilters, searchJobs, clearFilters } = useJobs();
  const [searchInput, setSearchInput] = useState(filters.search || '');

  const handleSearch = (e) => {
    e.preventDefault();
    updateFilters({ search: searchInput });
    searchJobs(searchInput);
  };

  const handleClear = () => {
    setSearchInput('');
    clearFilters();
    searchJobs('');
  };

  const locationOptions = ['All', 'Jakarta', 'Bandung', 'Yogyakarta', 'Surabaya', 'Remote'];
  const typeOptions = ['All', 'Full-time', 'Part-time', 'Internship', 'Freelance'];

  return (
    <div className="job-filter">
      <form onSubmit={handleSearch} className="job-filter-search">
        <div className="search-input-wrapper">
          <Search size={20} className="search-icon" />
          <input
            type="text"
            placeholder="Cari lowongan, perusahaan, atau skill..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="search-input"
          />
          {searchInput && (
            <button type="button" className="search-clear" onClick={handleClear}>
              <X size={18} />
            </button>
          )}
        </div>
        <button type="submit" className="search-btn">Cari</button>
      </form>

      <div className="job-filter-options">
        <div className="filter-group">
          <MapPin size={18} className="filter-icon" />
          <select 
            className="filter-select"
            value={filters.location || ''}
            onChange={(e) => {
              const value = e.target.value;
              updateFilters({ location: value === 'All' ? '' : value });
            }}
          >
            {locationOptions.map(loc => (
              <option key={loc} value={loc}>{loc}</option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <Briefcase size={18} className="filter-icon" />
          <select 
            className="filter-select"
            value={filters.type || ''}
            onChange={(e) => {
              const value = e.target.value;
              updateFilters({ type: value === 'All' ? '' : value });
            }}
          >
            {typeOptions.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>

        {(filters.location || filters.type || filters.search) && (
          <button onClick={handleClear} className="filter-clear-btn">
            <X size={16} />
            Clear filters
          </button>
        )}
      </div>
    </div>
  );
}

export default JobFilter;
