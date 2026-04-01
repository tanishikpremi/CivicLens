import React, { useEffect, useState } from 'react';
import { mcpClient } from '../lib/mcpClient';
import { Link } from 'react-router-dom';

export const AdminDashboard = () => {
  const [issues, setIssues] = useState([]);

  useEffect(() => {
    fetchIssues();
  }, []);

  const fetchIssues = async () => {
    try {
      const data = await mcpClient.getPosts({});
      setIssues(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateStatus = async (id, status) => {
    await mcpClient.updateStatus({ id, status });
    fetchIssues();
  };

  const formatSeverityBtn = (severity) => {
    if (severity === 'High') return 'bg-red-100 text-red-700';
    if (severity === 'Medium') return 'bg-amber-100 text-amber-700';
    return 'bg-emerald-100 text-emerald-700';
  };

  const formatStatusBtn = (status) => {
    if (status === 'Resolved') return 'bg-emerald-50 text-emerald-600';
    if (status === 'Pending') return 'bg-amber-50 text-amber-700';
    return 'bg-slate-50 text-slate-600';
  };

  const stats = {
    total: issues.length,
    pending: issues.filter(i => i.status === 'Pending').length,
    resolved: issues.filter(i => i.status === 'Resolved').length,
    highPriority: issues.filter(i => i.severity === 'High' && i.status !== 'Resolved').length,
  };

  return (
    <div className="bg-[#f0fdf4] text-[#131e19] min-h-screen pb-32 font-[Manrope]">
      {/* TopAppBar */}
      <header className="sticky top-0 z-50 flex items-center justify-between px-6 h-16 w-full bg-white/70 backdrop-blur-xl shadow-emerald-500/5">
        <div className="flex items-center gap-4">
          <Link to="/" className="p-2 rounded-full hover:bg-emerald-50/50 transition-colors active:scale-95 duration-200">
            <span className="material-symbols-outlined text-[#006e2f]">arrow_back</span>
          </Link>
          <h1 className="font-bold text-[#004b1e] text-lg tracking-tight">The Digital Ledger</h1>
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden md:flex flex-col items-end">
            <span className="font-[Inter] text-[10px] uppercase tracking-wider font-medium text-emerald-800/60">Administrator</span>
            <span className="text-sm font-semibold text-emerald-900">Admin User Profile</span>
          </div>
          <img alt="Admin" className="w-10 h-10 rounded-full border-2 border-white shadow-sm" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAVgphSZc4InVCIQujayKqtHm9bpWLaE_jHqmRwuzIShaGv2kW0H4xLvvrZsjNw36u3sY9IjysEFlZsD5_sOunvq0MlE4qXGbvxe1u-MM2RlZgqjO0EGPO_CPVF6DviJzV2O__2wziTpFLO0g8BqgHMaqxrLxoB3C9Hrc2kASS17Kr4UDG8uFled66UnCfrnXPWso_7zCg-rh6uGMjvEdLIO_MtpJT8EOMxpkwKPzz4N5_StdSH-nPsWyCdkfe2SvfawlZy0AoOXRBp"/>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 pt-12">
        {/* Dashboard Overview Header */}
        <section className="mb-12">
          <h2 className="text-4xl sm:text-[3.5rem] font-bold leading-tight tracking-tight text-emerald-900 mb-2">
            Welcome, Admin One
          </h2>
          <p className="text-emerald-800/60 font-medium">System overview for CivicLens operational oversight.</p>
        </section>

        {/* Stat Cards */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {/* Total Issues */}
          <div className="bg-white rounded-[28px] p-8 shadow-xl shadow-emerald-500/5 flex flex-col gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center">
              <span className="material-symbols-outlined text-emerald-600">dashboard</span>
            </div>
            <div>
              <span className="font-[Inter] text-[10px] uppercase tracking-widest font-semibold text-emerald-800/40">Total Issues</span>
              <div className="text-4xl font-bold text-emerald-950">{stats.total}</div>
            </div>
          </div>
          {/* Pending */}
          <div className="bg-white rounded-[28px] p-8 shadow-xl shadow-emerald-500/5 flex flex-col gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 flex items-center justify-center">
              <span className="material-symbols-outlined text-amber-600">work_outline</span>
            </div>
            <div>
              <span className="font-[Inter] text-[10px] uppercase tracking-widest font-semibold text-emerald-800/40">Pending</span>
              <div className="text-4xl font-bold text-emerald-950">{stats.pending}</div>
            </div>
          </div>
          {/* Resolved */}
          <div className="bg-white rounded-[28px] p-8 shadow-xl shadow-emerald-500/5 flex flex-col gap-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center">
              <span className="material-symbols-outlined text-blue-600">check_circle</span>
            </div>
            <div>
              <span className="font-[Inter] text-[10px] uppercase tracking-widest font-semibold text-emerald-800/40">Resolved</span>
              <div className="text-4xl font-bold text-emerald-950">{stats.resolved}</div>
            </div>
          </div>
          {/* High Priority */}
          <div className="bg-gradient-to-br from-[#4ADE80] to-[#22C55E] rounded-[28px] p-8 shadow-xl shadow-emerald-500/20 flex flex-col gap-4 text-white hover:scale-[1.02] transition-transform">
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center">
              <span className="material-symbols-outlined text-white" style={{fontVariationSettings: "'FILL' 1"}}>priority_high</span>
            </div>
            <div>
              <span className="font-[Inter] text-[10px] uppercase tracking-widest font-semibold text-white/70">High Priority</span>
              <div className="text-4xl font-bold text-white">{stats.highPriority}</div>
            </div>
          </div>
        </section>

        {/* Data Grid */}
        <section className="bg-white rounded-[28px] p-4 sm:p-8 shadow-xl shadow-emerald-500/5">
          <div className="flex items-center justify-between mb-8 px-2">
            <h3 className="text-xl font-bold text-emerald-950">Active Civic Reports</h3>
            <div className="flex gap-2">
              <button className="hidden sm:block bg-emerald-50 text-emerald-700 font-semibold px-4 py-2 rounded-2xl text-sm transition-all hover:bg-emerald-100">Filter</button>
              <button className="bg-emerald-900 text-white font-semibold px-4 py-2 rounded-2xl text-sm transition-all hover:bg-emerald-800">Export Ledger</button>
            </div>
          </div>

          <div className="space-y-6">
            {issues.length === 0 ? (
              <div className="text-center py-10 text-emerald-800/40 font-medium">No active reports found.</div>
            ) : (
              issues.map(issue => (
                <div key={issue.id} className="group flex flex-wrap lg:flex-nowrap items-center justify-between gap-6 p-4 rounded-[24px] transition-all duration-300 hover:bg-[#f0fdf4] hover:scale-[1.005]">
                  <div className="flex items-center gap-4 flex-1">
                    <img alt="Issue Thumbnail" className="w-16 h-16 rounded-2xl object-cover shadow-sm bg-surface-variant" src={issue.image_url || "https://images.unsplash.com/photo-1541888086036-749e7939103e?auto=format&fit=crop&q=80&w=200"} />
                    <div>
                      <h4 className="font-bold text-emerald-950 leading-tight">{issue.title}</h4>
                      <div className="flex gap-3 items-center mt-1">
                        <span className="font-[Inter] text-[10px] tracking-wider text-emerald-800/40">ID: {issue.id}</span>
                        <span className="font-[Inter] text-[10px] tracking-wider text-emerald-800/40">{issue.lat.toFixed(4)}° N, {issue.lng.toFixed(4)}° W</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 hidden md:flex">
                    <span className={`px-4 py-1.5 rounded-full text-xs font-bold tracking-tight ${formatSeverityBtn(issue.severity)}`}>{issue.severity}</span>
                    <span className={`px-4 py-1.5 rounded-full text-xs font-bold tracking-tight uppercase ${formatStatusBtn(issue.status)}`}>{issue.status}</span>
                  </div>

                  <div className="flex items-center gap-3 w-full lg:w-auto">
                    {issue.status === 'Pending' ? (
                      <button onClick={() => handleUpdateStatus(issue.id, 'Resolved')} className="flex-1 lg:flex-none bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-5 py-2.5 rounded-full text-sm font-bold shadow-lg shadow-emerald-500/20 active:scale-95 transition-all">Resolve</button>
                    ) : (
                      <button onClick={() => handleUpdateStatus(issue.id, 'Pending')} className="flex-1 lg:flex-none bg-emerald-50 text-emerald-400 cursor-pointer px-5 py-2.5 rounded-full text-sm font-bold active:scale-95 transition-all">Reopen</button>
                    )}
                    <button className="flex-1 lg:flex-none bg-red-50 text-red-600 px-5 py-2.5 rounded-full text-sm font-bold active:scale-95 transition-all">Escalate</button>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </main>

      {/* BottomNavBar */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 flex justify-around items-center px-4 py-3 bg-white/70 backdrop-blur-xl rounded-[32px] max-w-sm mx-auto mb-6 shadow-xl shadow-emerald-900/10 border-none">
        <Link to="/" className="text-emerald-800/50 p-3 hover:text-emerald-600 transition-all active:scale-90 duration-300 ease-out">
          <span className="material-symbols-outlined">map</span>
        </Link>
        <Link to="/admin" className="bg-gradient-to-br from-[#4ADE80] to-emerald-600 text-white rounded-full p-3 shadow-lg shadow-emerald-500/30 active:scale-90 duration-300 ease-out flex items-center justify-center">
          <span className="material-symbols-outlined" style={{fontVariationSettings: "'FILL' 1"}}>shield_person</span>
        </Link>
      </nav>
    </div>
  );
};
