import React, { useEffect, useState } from 'react';
import { DatabaseService } from '../services/DatabaseService';
import { useNavigate } from 'react-router-dom';
import { Clock, ThumbsUp, MapPin } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export const Feed = () => {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const data = await DatabaseService.getAllIssues();
      // Sort by priority score DESC
      data.sort((a, b) => b.priorityScore - a.priorityScore);
      setIssues(data);
      setLoading(false);
    };
    fetchData();
  }, []);

  if (loading) return <div className="p-4 flex justify-center mt-10"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div></div>;

  return (
    <div className="p-4 max-w-lg mx-auto pb-6">
      <h1 className="text-2xl font-bold mb-4 text-gray-800">Civic Feed</h1>
      
      {issues.length === 0 ? (
        <div className="bg-white rounded-xl p-8 text-center shadow-sm border border-gray-100">
          <p className="text-gray-500">No issues reported yet in your area.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {issues.map(issue => (
            <div 
              key={issue.id} 
              onClick={() => navigate(`/issue/${issue.id}`)}
              className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden active:scale-[0.98] transition-transform cursor-pointer"
            >
              {issue.imageURL && (
                <div className="h-48 w-full bg-gray-200 overflow-hidden relative">
                  <img src={issue.imageURL} alt={issue.type} className="w-full h-full object-cover" />
                  <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-1 flex items-center gap-1 rounded font-bold text-xs uppercase" style={{
                    color: issue.priorityScore >= 80 ? 'var(--color-urgent)' : issue.priorityScore >= 50 ? 'var(--color-accent)' : 'var(--color-secondary)'
                  }}>
                    {issue.priorityScore >= 80 ? '🔴 High Priority' : issue.priorityScore >= 50 ? '🟡 Medium' : '🟢 Low'}
                  </div>
                </div>
              )}
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-lg text-gray-800 capitalize">{issue.type.replace('_', ' ')}</h3>
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                    issue.status === 'resolved' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                  }`}>
                    {issue.status}
                  </span>
                </div>
                
                <div className="flex items-center text-gray-500 space-x-4 text-sm mt-3">
                  <div className="flex items-center gap-1">
                    <ThumbsUp size={16} />
                    <span>{issue.upvotes}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock size={16} />
                    <span>{issue.createdAt ? formatDistanceToNow(new Date(issue.createdAt), { addSuffix: true }) : 'unknown'}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
