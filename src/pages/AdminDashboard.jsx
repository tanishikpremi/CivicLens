import React, { useEffect, useState } from 'react';
import { DatabaseService } from '../services/DatabaseService';
import { ShieldCheck, Clock, CheckCircle, ArrowRight } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export const AdminDashboard = () => {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchIssues = async () => {
    setLoading(true);
    const data = await DatabaseService.getAllIssues();
    // Sort by SLA Urgency / Priority Score
    data.sort((a, b) => b.priorityScore - a.priorityScore);
    setIssues(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchIssues();
  }, []);

  const handleResolve = async (id) => {
    await DatabaseService.updateIssue(id, { status: 'resolved' });
    fetchIssues();
  };

  if (loading) return <div className="p-4 pt-10 flex justify-center"><div className="animate-spin h-8 w-8 border-b-2 border-red-600 rounded-full"></div></div>;

  return (
    <div className="p-4 max-w-4xl mx-auto h-full overflow-y-auto pb-10">
      <div className="flex items-center gap-3 mb-6 bg-red-50 p-4 rounded-xl border border-red-100">
        <ShieldCheck size={32} className="text-red-600" />
        <div>
          <h1 className="text-2xl font-bold text-red-900">Admin Control Panel</h1>
          <p className="text-sm text-red-700">Simulated Authority Dashboard</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-500">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3">Issue</th>
                <th scope="col" className="px-6 py-3">Priority</th>
                <th scope="col" className="px-6 py-3">SLA Status</th>
                <th scope="col" className="px-6 py-3">Status</th>
                <th scope="col" className="px-6 py-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {issues.map((issue) => {
                const isOverdue = new Date() > new Date(issue.slaDeadline);
                return (
                  <tr key={issue.id} className="bg-white border-b hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium text-gray-900 capitalize flex items-center gap-3">
                      {issue.imageURL ? (
                        <img src={issue.imageURL} className="w-10 h-10 rounded object-cover" alt="thumb"/>
                      ) : (
                        <div className="w-10 h-10 bg-gray-200 rounded"></div>
                      )}
                      {issue.type.replace('_', ' ')}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded font-bold text-xs ${
                        issue.priorityScore >= 80 ? 'bg-red-100 text-red-700' :
                        issue.priorityScore >= 50 ? 'bg-orange-100 text-orange-700' : 'bg-green-100 text-green-700'
                      }`}>
                        Score: {issue.priorityScore}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1">
                        <Clock size={14} className={isOverdue ? "text-red-500" : "text-gray-400"} />
                        <span className={isOverdue ? "text-red-600 font-bold" : ""}>
                          {isOverdue ? "Overdue" : "In Time"}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                       <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        issue.status === 'resolved' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                      }`}>
                        {issue.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {issue.status !== 'resolved' ? (
                        <button 
                          onClick={() => handleResolve(issue.id)}
                          className="font-medium text-blue-600 hover:text-blue-800 flex items-center gap-1 bg-blue-50 px-3 py-1.5 rounded-lg active:scale-95 transition"
                        >
                          Resolve <CheckCircle size={16} />
                        </button>
                      ) : (
                        <span className="text-gray-400 font-medium">Resolved</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {issues.length === 0 && (
            <div className="p-8 text-center text-gray-500">
              No issues require attention.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
