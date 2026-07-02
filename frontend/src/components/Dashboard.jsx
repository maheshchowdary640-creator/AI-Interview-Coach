import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
import api from '../utils/api';
import { 
  Plus, Calendar, Award, BookOpen, Compass, ChevronRight, BarChart3, AlertCircle, Loader2
} from 'lucide-react';

const Dashboard = () => {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user) {
      navigate('/');
      return;
    }

    const fetchInterviews = async () => {
      try {
        const response = await api.get(`/interviews?userId=${user._id}`);
        setSessions(response.data);
      } catch (err) {
        console.error('Error fetching interviews:', err);
        setError('Failed to load previous sessions. Please check database connection.');
      } finally {
        setLoading(false);
      }
    };

    fetchInterviews();
  }, [user, navigate]);

  // Statistics calculation
  const completedSessions = sessions.filter(s => s.scores && s.scores.overall > 0);
  const totalInterviews = completedSessions.length;
  const avgScore = totalInterviews > 0 
    ? Math.round(completedSessions.reduce((sum, s) => sum + s.scores.overall, 0) / totalInterviews) 
    : 0;

  const getTypeBadgeStyles = (type) => {
    switch (type) {
      case 'Technical Interview':
        return 'bg-blue-950/40 border-blue-800/40 text-blue-400';
      case 'Project-Based Interview':
        return 'bg-purple-950/40 border-purple-800/40 text-purple-400';
      case 'Internship Interview':
        return 'bg-cyan-950/40 border-cyan-800/40 text-cyan-400';
      default:
        return 'bg-amber-950/40 border-amber-800/40 text-amber-400';
    }
  };

  const getDiffBadgeStyles = (diff) => {
    switch (diff) {
      case 'Hard':
        return 'bg-red-950/30 border-red-900/30 text-red-400';
      case 'Easy':
        return 'bg-emerald-950/30 border-emerald-900/30 text-emerald-400';
      default:
        return 'bg-yellow-950/30 border-yellow-900/30 text-yellow-400';
    }
  };

  return (
    <div className="min-h-screen bg-navy-950 text-white py-10 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Welcome Banner */}
        <div className="glass-card rounded-3xl p-6 sm:p-8 border border-white/5 relative overflow-hidden mb-8">
          <div className="absolute inset-0 glow-spot-1 opacity-20 z-0"></div>
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                Welcome back, <span className="bg-gradient-to-r from-brand-400 to-indigo-400 bg-clip-text text-transparent">{user?.name}</span>!
              </h1>
              <p className="mt-2 text-slate-300 text-sm sm:text-base max-w-xl">
                Ready to level up your confidence today? Complete a customized mock interview and review your performance analytics.
              </p>
            </div>
            <button
              onClick={() => navigate('/setup')}
              className="flex items-center justify-center space-x-2 rounded-xl bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 py-3 px-6 font-bold shadow-md shadow-brand-600/20 transition-all transform hover:-translate-y-0.5 cursor-pointer"
            >
              <Plus className="h-5 w-5" />
              <span>New Mock Interview</span>
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
          {/* Stat 1 */}
          <div className="glass-card rounded-2xl p-6 border border-white/5 flex items-center space-x-4">
            <div className="h-12 w-12 rounded-xl bg-brand-950/50 border border-brand-900/40 flex items-center justify-center text-brand-400">
              <BarChart3 className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Completed Sessions</p>
              <h3 className="text-2xl font-extrabold mt-0.5">{totalInterviews}</h3>
            </div>
          </div>

          {/* Stat 2 */}
          <div className="glass-card rounded-2xl p-6 border border-white/5 flex items-center space-x-4">
            <div className="h-12 w-12 rounded-xl bg-emerald-950/50 border border-emerald-900/40 flex items-center justify-center text-emerald-400">
              <Award className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Average Score</p>
              <h3 className="text-2xl font-extrabold mt-0.5">{avgScore}%</h3>
            </div>
          </div>

          {/* Stat 3 */}
          <div className="glass-card rounded-2xl p-6 border border-white/5 flex items-center space-x-4">
            <div className="h-12 w-12 rounded-xl bg-indigo-950/50 border border-indigo-900/40 flex items-center justify-center text-indigo-400">
              <BookOpen className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Recommended Focus</p>
              <h3 className="text-sm font-extrabold mt-1 text-indigo-300">STAR Format Practice</h3>
            </div>
          </div>
        </div>

        {/* Historic Sessions Section */}
        <div className="glass-card rounded-2xl border border-white/5 p-6">
          <h2 className="text-xl font-extrabold tracking-tight mb-6">Historic Sessions</h2>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 text-slate-400 space-y-3">
              <Loader2 className="h-8 w-8 text-brand-500 animate-spin" />
              <p className="text-sm">Fetching mock interview logs...</p>
            </div>
          ) : error ? (
            <div className="rounded-xl bg-red-950/20 border border-red-900/30 p-6 flex items-center space-x-3 text-red-400 my-6">
              <AlertCircle className="h-6 w-6 flex-shrink-0" />
              <div>
                <h4 className="font-bold">Error loading dashboard data</h4>
                <p className="text-sm text-red-300 mt-1">{error}</p>
              </div>
            </div>
          ) : sessions.length === 0 ? (
            <div className="text-center py-16 border-2 border-dashed border-slate-800 rounded-2xl">
              <Compass className="h-12 w-12 text-slate-600 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-slate-300">No session logs found</h3>
              <p className="text-sm text-slate-500 mt-1 max-w-sm mx-auto">
                You haven't conducted any mock interviews yet. Generate your first set of questions to begin.
              </p>
              <button
                onClick={() => navigate('/setup')}
                className="mt-6 inline-flex items-center space-x-2 rounded-xl bg-brand-600 hover:bg-brand-500 py-2.5 px-6 font-bold text-sm shadow-md transition-all cursor-pointer"
              >
                <Plus className="h-4 w-4" />
                <span>Launch First Session</span>
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 text-xs uppercase font-bold">
                    <th className="py-4 px-4">Session Date</th>
                    <th className="py-4 px-4">Interview Type</th>
                    <th className="py-4 px-4">Difficulty</th>
                    <th className="py-4 px-4 text-center">Scorecard</th>
                    <th className="py-4 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-900 text-sm">
                  {sessions.map((session) => {
                    const hasFinished = session.scores && session.scores.overall > 0;
                    return (
                      <tr key={session._id} className="hover:bg-slate-900/30 transition-colors group">
                        <td className="py-4 px-4 text-slate-300">
                          <div className="flex items-center space-x-2">
                            <Calendar className="h-4 w-4 text-slate-500" />
                            <span>{new Date(session.createdAt).toLocaleDateString()}</span>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <span className={`inline-block border px-2 py-0.5 rounded-full text-xs font-medium ${getTypeBadgeStyles(session.interviewType)}`}>
                            {session.interviewType}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <span className={`inline-block border px-2 py-0.5 rounded-full text-xs font-medium ${getDiffBadgeStyles(session.difficulty)}`}>
                            {session.difficulty}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-center">
                          {hasFinished ? (
                            <span className="inline-flex items-center justify-center h-8 w-12 rounded-lg bg-emerald-950/40 border border-emerald-900/40 text-emerald-400 font-bold text-xs">
                              {session.scores.overall}%
                            </span>
                          ) : (
                            <span className="text-xs text-slate-500 italic">Incomplete</span>
                          )}
                        </td>
                        <td className="py-4 px-4 text-right">
                          <button
                            onClick={() => {
                              if (hasFinished) {
                                navigate(`/results/${session._id}`);
                              } else {
                                navigate(`/interview/${session._id}`);
                              }
                            }}
                            className={`inline-flex items-center space-x-1 font-semibold text-xs transition-colors cursor-pointer ${
                              hasFinished 
                                ? 'text-brand-400 hover:text-brand-300' 
                                : 'text-indigo-400 hover:text-indigo-300'
                            }`}
                          >
                            <span>{hasFinished ? 'Review Report' : 'Resume Session'}</span>
                            <ChevronRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
