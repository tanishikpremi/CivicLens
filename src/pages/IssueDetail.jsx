import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { DatabaseService } from '../services/DatabaseService';
import { ArrowLeft, MapPin, Clock, AlertTriangle, UserCheck, ThumbsUp } from 'lucide-react';
import { formatDistanceToNow, format } from 'date-fns';

export const IssueDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [issue, setIssue] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchIssue = async () => {
    const data = await DatabaseService.getIssueById(id);
    setIssue(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchIssue();
  }, [id]);

  const handleUpvote = async () => {
    if(!issue) return;
    setIssue({...issue, upvotes: issue.upvotes + 1}); // Optimistic update
    await DatabaseService.upvoteIssue(id);
    // Silent re-fetch
    fetchIssue();
  };

  if (loading) return <div className="flex justify-center mt-10"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div></div>;
  if (!issue) return <div className="text-center mt-10 text-gray-500">Issue not found.</div>;

  const isOverdue = new Date() > new Date(issue.slaDeadline);

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header Bar */}
      <div className="fixed top-0 w-full h-14 bg-white/90 backdrop-blur-md shadow-sm z-20 flex items-center px-4">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 hover:bg-gray-100 rounded-full text-gray-600 transition">
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-lg font-bold ml-2 truncate capitalize">{issue.type.replace('_', ' ')}</h1>
      </div>

      {issue.imageURL && (
         <div className="w-full h-64 sm:h-80 bg-gray-200 mt-14 relative">
            <img src={issue.imageURL} alt={issue.type} className="w-full h-full object-cover" />
            <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1.5 flex items-center gap-2 rounded-lg font-bold shadow-lg">
                <AlertTriangle size={16} style={{ color: issue.priorityScore >= 80 ? 'var(--color-urgent)' : 'var(--color-accent)' }} />
                Score: {issue.priorityScore}
            </div>
         </div>
      )}

      <div className="p-4 max-w-lg mx-auto space-y-6 pb-20 mt-14">
        {/* Core Info */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 capitalize">{issue.type.replace('_', ' ')}</h2>
              <div className="flex gap-2 items-center text-sm text-gray-500 mt-1">
                <MapPin size={14} />
                <span>GPS: {issue.latitude?.toFixed(4) || 'N/A'}, {issue.longitude?.toFixed(4) || 'N/A'}</span>
              </div>
            </div>
            <span className={`px-3 py-1 font-bold rounded-full ${
              issue.status === 'resolved' ? 'bg-green-100 text-green-700 border-green-200 border' : 'bg-blue-100 text-blue-700 border-blue-200 border'
            }`}>
              {issue.status.toUpperCase()}
            </span>
          </div>

          <div className="h-px bg-gray-100 my-4"></div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-1">Reported</p>
              <div className="flex items-center gap-1.5 text-sm font-medium text-gray-700">
                <Clock size={16} className="text-gray-400" />
                {issue.createdAt ? formatDistanceToNow(new Date(issue.createdAt), { addSuffix: true }) : 'unknown'}
              </div>
            </div>
            <div>
              <p className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-1">Target Fix By</p>
              <div className="flex items-center gap-1.5 text-sm font-medium text-gray-700">
                <Clock size={16} className={isOverdue ? 'text-red-500' : 'text-gray-400'} />
                <span className={isOverdue ? 'text-red-600' : ''}>
                  {issue.slaDeadline ? format(new Date(issue.slaDeadline), 'MMM d, h:mm a') : 'unknown'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Community Action */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <h3 className="font-bold tracking-tight text-gray-800 mb-4 flex items-center gap-2">
            <UserCheck size={20} className="text-blue-500"/>
            Community Validation
          </h3>
          <div className="flex items-center justify-between bg-gray-50 p-4 rounded-xl border border-gray-100">
            <div>
              <p className="font-bold text-2xl text-gray-800">{issue.upvotes}</p>
              <p className="text-xs text-gray-500 font-medium uppercase tracking-wider mt-0.5">Citizens confirm this</p>
            </div>
            <button 
              onClick={handleUpvote}
              disabled={issue.status === 'resolved'}
              className="flex items-center gap-2 bg-blue-600 text-white font-bold py-3 px-6 rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:bg-gray-400 transition active:scale-95 shadow-md"
            >
              <ThumbsUp size={18} />
              Upvote
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
