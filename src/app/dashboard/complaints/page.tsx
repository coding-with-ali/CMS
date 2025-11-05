'use client';

import { useEffect, useState } from 'react';
import ComplaintCard from '@/components/ComplaintCard';
import { client } from '@/sanity/lib/client';
import { Search, Calendar, RefreshCcw } from 'lucide-react';

export default function ComplaintsPage() {
  const [complaints, setComplaints] = useState<any[]>([]);
  const [filtered, setFiltered] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [loading, setLoading] = useState(true);

  // ✅ Fetch all complaints
  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const data = await client.fetch(`
          *[_type=="complaint"] | order(dateTime desc)[0..500]{
            _id,
            complaintNo,
            title,
            reporterName,
            authorizedName,
            department->{name},
            field,
            priority,
            status,
            dateTime
          }
        `);
        setComplaints(data);
        setFiltered(data);
      } catch (error) {
        console.error('Error fetching complaints:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  // ✅ Helper to normalize status
  const normalizeStatus = (status: string) => {
    if (!status) return '';
    const s = status.toLowerCase();
    if (s.includes('progress')) return 'in progress';
    if (s.includes('complete') || s.includes('resolved')) return 'completed';
    if (s.includes('new') || s.includes('open') || s.includes('pending')) return 'new';
    return s;
  };

  // 🔍 Filtering logic
  useEffect(() => {
    let temp = complaints;

    // Filter by date
    if (selectedDate) {
      const dateOnly = selectedDate;
      temp = temp.filter((c) => {
        const cDate = new Date(c.dateTime).toISOString().split('T')[0];
        return cDate === dateOnly;
      });
    }

    // Filter by search
    if (search) {
      const s = search.toLowerCase();
      temp = temp.filter((c) =>
        c.complaintNo?.toString().toLowerCase().includes(s)
      );
    }

    // ✅ Filter by normalized status
    if (selectedStatus) {
      temp = temp.filter(
        (c) => normalizeStatus(c.status) === selectedStatus
      );
    }

    setFiltered(temp);
  }, [search, selectedDate, complaints, selectedStatus]);

  // 🧹 Reset Filters
  const resetFilters = () => {
    setSearch('');
    setSelectedDate('');
    setSelectedStatus('');
    setFiltered(complaints);
  };

  // ✅ Status box click handler
  const handleStatusClick = (status: string) => {
    if (selectedStatus === status) {
      setSelectedStatus(''); // toggle off
    } else {
      setSelectedStatus(status);
    }
  };

  // ✅ Count each status dynamically
  const totalNew = complaints.filter((c) => normalizeStatus(c.status) === 'new').length;
  const totalProgress = complaints.filter((c) => normalizeStatus(c.status) === 'in progress').length;
  const totalComplete = complaints.filter((c) => normalizeStatus(c.status) === 'completed').length;

  return (
    <div className="p-4 sm:p-6 bg-gray-50 min-h-screen">
      {/* === Header === */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-3">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
          Complaints Dashboard
        </h1>
        <p className="text-sm text-gray-600">
          Showing {selectedDate ? `complaints on ${selectedDate}` : 'all complaints'}.
        </p>
      </div>

      {/* === Status Boxes === */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        {/* 🟥 New Complaints */}
        <div
          onClick={() => handleStatusClick('new')}
          className={`cursor-pointer rounded-xl shadow-md p-4 text-center font-semibold transition transform hover:scale-[1.02] ${
            selectedStatus === 'new'
              ? 'bg-red-600 text-white ring-2 ring-red-400'
              : 'bg-white text-red-600 hover:bg-red-100'
          }`}
        >
          <h2 className="text-lg">New Complaints</h2>
          <p className="text-2xl mt-2">{totalNew}</p>
        </div>

        {/* 🟨 In Progress */}
        <div
          onClick={() => handleStatusClick('in progress')}
          className={`cursor-pointer rounded-xl shadow-md p-4 text-center font-semibold transition transform hover:scale-[1.02] ${
            selectedStatus === 'in progress'
              ? 'bg-yellow-500 text-white ring-2 ring-yellow-300'
              : 'bg-white text-yellow-600 hover:bg-yellow-100'
          }`}
        >
          <h2 className="text-lg">In Progress</h2>
          <p className="text-2xl mt-2">{totalProgress}</p>
        </div>

        {/* 🟩 Completed */}
        <div
          onClick={() => handleStatusClick('completed')}
          className={`cursor-pointer rounded-xl shadow-md p-4 text-center font-semibold transition transform hover:scale-[1.02] ${
            selectedStatus === 'completed'
              ? 'bg-green-600 text-white ring-2 ring-green-400'
              : 'bg-white text-green-600 hover:bg-green-100'
          }`}
        >
          <h2 className="text-lg">Completed</h2>
          <p className="text-2xl mt-2">{totalComplete}</p>
        </div>
      </div>

      {/* === Filter Bar === */}
      <div className="bg-white rounded-xl shadow-md p-4 mb-6 flex flex-col sm:flex-row sm:items-center gap-3">
        {/* Search Field */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search by Complaint No (e.g. 1023)"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
          />
        </div>

        {/* Date Picker */}
        <div className="relative">
          <Calendar className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
          />
        </div>

        {/* Reset Button */}
        <button
          onClick={resetFilters}
          className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg transition font-medium"
        >
          <RefreshCcw className="w-4 h-4" /> Reset
        </button>
      </div>

      {/* === Complaints List === */}
      {loading ? (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-gray-500 text-center py-10">
          No complaints found.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((c) => (
            <ComplaintCard key={c._id} complaint={c} />
          ))}
        </div>
      )}
    </div>
  );
}
