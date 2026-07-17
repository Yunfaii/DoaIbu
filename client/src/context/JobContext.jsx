import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const JobContext = createContext();

const API_URL = 'http://localhost:5000/api/jobs';

export const useJobs = () => {
  const context = useContext(JobContext);
  if (!context) {
    throw new Error('useJobs must be used within JobProvider');
  }
  return context;
};

export const JobProvider = ({ children }) => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    search: '',
    location: '',
    type: ''
  });

  // Fetch all jobs
  const fetchJobs = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.get(API_URL);
      setJobs(response.data);
    } catch (err) {
      setError('Failed to fetch jobs');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Search jobs
  const searchJobs = async (query = '') => {
    setLoading(true);
    setError('');
    try {
      const params = new URLSearchParams();
      if (query) params.append('q', query);
      if (filters.location) params.append('location', filters.location);
      if (filters.type) params.append('type', filters.type);
      
      const url = `${API_URL}/search?${params.toString()}`;
      const response = await axios.get(url);
      setJobs(response.data);
    } catch (err) {
      setError('Failed to search jobs');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Get single job
  const getJob = async (id) => {
    try {
      const response = await axios.get(`${API_URL}/${id}`);
      return response.data;
    } catch (err) {
      setError('Failed to fetch job details');
      console.error(err);
      return null;
    }
  };

  // Apply to job
  const applyToJob = async (id) => {
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const payload = { userId: user.id };
      const response = await axios.post(`${API_URL}/apply/${id}`, payload);
      return response.data;
    } catch (err) {
      setError('Failed to apply');
      console.error(err);
      return null;
    }
  };

  // Get match score
  const getMatchScore = async (id) => {
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const userId = user.id;
      
      const url = userId 
        ? `${API_URL}/match/${id}?userId=${userId}` 
        : `${API_URL}/match/${id}`;
      
      const response = await axios.post(url);
      return response.data;
    } catch (err) {
      console.error(err);
      return null;
    }
  };

  // ✅ NEW: Get applied history
  const getAppliedHistory = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const userId = user.id;
      
      const url = userId 
        ? `${API_URL}/history?userId=${userId}` 
        : API_URL + '/history';
      
      const response = await axios.get(url);
      return response.data;
    } catch (err) {
      console.error('Failed to fetch applied history:', err);
      return [];
    }
  };

  // Update filters
  const updateFilters = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  // Clear filters
  const clearFilters = () => {
    setFilters({
      search: '',
      location: '',
      type: ''
    });
  };

  // Initial fetch
  useEffect(() => {
    fetchJobs();
  }, []);

  // Fetch when filters change (except search)
  useEffect(() => {
    if (filters.location || filters.type) {
      searchJobs(filters.search);
    }
  }, [filters.location, filters.type]);

  const value = {
    jobs,
    loading,
    error,
    filters,
    fetchJobs,
    searchJobs,
    getJob,
    applyToJob,
    getMatchScore,
    getAppliedHistory,  // ✅ NEW
    updateFilters,
    clearFilters
  };

  return (
    <JobContext.Provider value={value}>
      {children}
    </JobContext.Provider>
  );
};
