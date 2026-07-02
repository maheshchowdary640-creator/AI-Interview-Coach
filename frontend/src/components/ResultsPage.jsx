import React, { useContext, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
import api from '../utils/api';
import { 
  Award, Calendar, CheckSquare, ChevronDown, ChevronUp, Download, Eye, FileText, 
  Lightbulb, Loader2, Sparkles, TrendingUp, AlertTriangle, AlertCircle 
} from 'lucide-react';

const ResultsPage = () => {
  const { id } = useParams();
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  // Data states
  const [interview, setInterview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [downloadingReport, setDownloadingReport] = useState(false);
  const [error, setError] = useState(null);

  // Accordion active state: { [questionId]: boolean }
  const [expandedQuestions, setExpandedQuestions] = useState({ 1: true });

  useEffect(() => {
    if (!user) {
      navigate('/');
      return;
    }

    const fetchResults = async () => {
      try {
        const response = await api.get(`/interviews/${id}`);
        setInterview(response.data);
      } catch (err) {
        console.error('Error fetching interview results:', err);
        setError('Failed to fetch evaluation results. Please check database connection.');
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [id, user, navigate]);

  const toggleAccordion = (qId) => {
    setExpandedQuestions({
      ...expandedQuestions,
      [qId]: !expandedQuestions[qId]
    });
  };

  const handleDownloadPDF = async () => {
    setDownloadingReport(true);
    try {
      // Fetch PDF report from backend
      const response = await api.post('/generate-report', { interviewId: id }, {
        responseType: 'blob' // Important to handle PDF binary stream
      });

      // Create blob link to download
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Interview_Report_${interview.interviewType.replace(/\s+/g, '_')}.pdf`);
      document.body.appendChild(link);
      link.click();
      
      // Clean up
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Error downloading report:', err);
      alert('Failed to generate PDF report. Please verify connection.');
    } finally {
      setDownloadingReport(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-navy-950 flex flex-col items-center justify-center text-slate-400 space-y-3">
        <Loader2 className="h-8 w-8 text-brand-500 animate-spin" />
        <p className="text-sm">Retrieving AI Coach scorecard...</p>
      </div>
    );
  }

  if (error || !interview) {
    return (
      <div className="min-h-screen bg-navy-950 flex items-center justify-center p-6">
        <div className="glass-card rounded-2xl p-6 max-w-md border border-red-900/30 text-center space-y-4">
          <AlertCircle className="h-10 w-10 text-red-500 mx-auto" />
          <h3 className="text-lg font-bold text-red-400">Error Loading Results</h3>
          <p className="text-sm text-slate-400">{error}</p>
          <button 
            onClick={() => navigate('/dashboard')}
            className="rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 py-2 px-6 text-sm font-semibold text-white cursor-pointer"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  // Circular gauge setup
  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (interview.scores.overall / 100) * circumference;

  return (
    <div className="min-h-screen bg-navy-950 text-white py-12 px-4 sm:px-6 lg:px-8 relative">
      <div className="mx-auto max-w-6xl">
        
        {/* Results Header Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Interview Evaluation</h1>
            <p className="text-slate-400 text-xs sm:text-sm mt-1 flex items-center">
              <Calendar className="h-4 w-4 mr-1 text-slate-500" />
              <span>Session completed on {new Date(interview.createdAt).toLocaleString()}</span>
            </p>
          </div>
          
          <div className="flex items-center space-x-3">
            <button
              onClick={() => navigate('/dashboard')}
              className="rounded-xl border border-slate-800 hover:border-slate-700 py-2.5 px-5 text-sm font-semibold text-slate-400 hover:text-white transition-all cursor-pointer bg-slate-950/30"
            >
              Back to Dashboard
            </button>
            
            <button
              onClick={handleDownloadPDF}
              disabled={downloadingReport}
              className="flex items-center space-x-2 rounded-xl bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 py-2.5 px-5 text-sm font-bold shadow-md shadow-brand-600/20 disabled:opacity-50 transition-all cursor-pointer"
            >
              {downloadingReport ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Compiling PDF...</span>
                </>
              ) : (
                <>
                  <Download className="h-4 w-4" />
                  <span>Download PDF Report</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Scorecard Grid Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          
          {/* Circular Overall Gauge */}
          <div className="glass-card rounded-3xl p-6 border border-white/5 flex flex-col items-center justify-center text-center relative overflow-hidden">
            <div className="absolute inset-0 glow-spot-1 opacity-10 pointer-events-none"></div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">Overall Score</h3>
            
            <div className="relative flex items-center justify-center">
              {/* Circular SVG Gauge */}
              <svg className="w-36 h-36 transform -rotate-90">
                <circle
                  cx="72"
                  cy="72"
                  r={radius}
                  className="stroke-slate-800 fill-none"
                  strokeWidth="10"
                />
                <circle
                  cx="72"
                  cy="72"
                  r={radius}
                  className="stroke-brand-500 fill-none progress-fill"
                  strokeWidth="10"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute flex flex-col items-center">
                <span className="text-3xl font-extrabold">{interview.scores.overall}%</span>
                <span className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold mt-0.5">Rating</span>
              </div>
            </div>
            
            <p className="mt-4 text-xs font-semibold text-slate-400">
              Target Type: <span className="text-slate-200">{interview.interviewType}</span>
            </p>
          </div>

          {/* Detailed Sub-scores Progress Bars */}
          <div className="glass-card rounded-3xl p-6 border border-white/5 md:col-span-2 flex flex-col justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">Granular Core Capabilities</h3>
            
            <div className="space-y-5 py-2">
              {/* Sub-score 1 */}
              <div>
                <div className="flex items-center justify-between text-sm mb-1.5">
                  <span className="font-semibold text-slate-300">Technical Answer Depth</span>
                  <span className="font-bold text-brand-400">{interview.scores.technical}/10</span>
                </div>
                <div className="w-full bg-slate-900 border border-slate-800 rounded-full h-2.5 overflow-hidden">
                  <div 
                    style={{ width: `${interview.scores.technical * 10}%` }} 
                    className="bg-gradient-to-r from-brand-500 to-indigo-500 h-full progress-fill"
                  />
                </div>
              </div>

              {/* Sub-score 2 */}
              <div>
                <div className="flex items-center justify-between text-sm mb-1.5">
                  <span className="font-semibold text-slate-300">Communication & Structure</span>
                  <span className="font-bold text-emerald-400">{interview.scores.communication}/10</span>
                </div>
                <div className="w-full bg-slate-900 border border-slate-800 rounded-full h-2.5 overflow-hidden">
                  <div 
                    style={{ width: `${interview.scores.communication * 10}%` }} 
                    className="bg-gradient-to-r from-emerald-500 to-teal-500 h-full progress-fill"
                  />
                </div>
              </div>

              {/* Sub-score 3 */}
              <div>
                <div className="flex items-center justify-between text-sm mb-1.5">
                  <span className="font-semibold text-slate-300">Assertiveness & Confidence</span>
                  <span className="font-bold text-cyan-400">{interview.scores.confidence}/10</span>
                </div>
                <div className="w-full bg-slate-900 border border-slate-800 rounded-full h-2.5 overflow-hidden">
                  <div 
                    style={{ width: `${interview.scores.confidence * 10}%` }} 
                    className="bg-gradient-to-r from-cyan-500 to-blue-500 h-full progress-fill"
                  />
                </div>
              </div>
            </div>
            
            <p className="text-[11px] text-slate-500 italic mt-2">
              Scores are calculated based on job description alignment and STAR techniques.
            </p>
          </div>
        </div>

        {/* Strengths and Weak Areas Panel */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          
          {/* Key Strengths Card */}
          <div className="glass-card rounded-2xl p-6 border border-white/5 bg-slate-950/20">
            <div className="flex items-center space-x-2 text-emerald-400 font-bold mb-4">
              <Award className="h-5 w-5" />
              <h3 className="text-sm uppercase tracking-wider">Major Strengths</h3>
            </div>
            <ul className="space-y-3.5">
              {interview.strongAreas.map((area, idx) => (
                <li key={idx} className="flex items-start text-sm text-slate-300">
                  <span className="mr-2 text-emerald-500 font-bold">•</span>
                  <span>{area}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Weak Areas Card */}
          <div className="glass-card rounded-2xl p-6 border border-white/5 bg-slate-950/20">
            <div className="flex items-center space-x-2 text-red-400 font-bold mb-4">
              <AlertTriangle className="h-5 w-5" />
              <h3 className="text-sm uppercase tracking-wider">Identified Gaps</h3>
            </div>
            <ul className="space-y-3.5">
              {interview.weakAreas.map((area, idx) => (
                <li key={idx} className="flex items-start text-sm text-slate-300">
                  <span className="mr-2 text-red-500 font-bold">•</span>
                  <span>{area}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Personalized Improvement Roadmap */}
        <div className="glass-card rounded-3xl p-6 sm:p-8 border border-white/5 mb-8 relative overflow-hidden">
          <div className="absolute inset-0 glow-spot-1 opacity-5 pointer-events-none"></div>
          <div className="flex items-center space-x-2 text-brand-400 font-bold mb-6">
            <TrendingUp className="h-5 w-5" />
            <h3 className="text-sm uppercase tracking-wider">Improvement Roadmap</h3>
          </div>
          
          {/* Roadmap Steps */}
          <div className="space-y-6 relative before:absolute before:left-3 sm:before:left-4 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-800">
            {interview.improvementRoadmap.map((step, idx) => (
              <div key={idx} className="relative flex items-start pl-8 sm:pl-10 group">
                {/* Step Circle Indicator */}
                <div className="absolute left-0 sm:left-1 top-0.5 flex h-7 w-7 items-center justify-center rounded-full bg-slate-900 border border-slate-700 font-bold text-xs text-brand-400 group-hover:border-brand-500 transition-colors">
                  {idx + 1}
                </div>
                <div>
                  <h4 className="font-bold text-slate-200 text-sm">Phase {idx + 1}</h4>
                  <p className="text-sm text-slate-400 mt-1 leading-relaxed">
                    {step}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Question & Answer Accordion List */}
        <div className="glass-card rounded-3xl p-6 sm:p-8 border border-white/5">
          <h2 className="text-xl font-extrabold tracking-tight mb-6">Detailed Response Evaluation</h2>
          
          <div className="space-y-4">
            {interview.questions.map((q) => {
              const ansObj = interview.answers.find(a => Number(a.questionId) === Number(q.id));
              const ansText = ansObj?.answer || '[Not Answered]';
              const feedObj = interview.feedback.find(f => Number(f.questionId) === Number(q.id));
              
              const isExpanded = expandedQuestions[q.id] || false;
              
              return (
                <div 
                  key={q.id} 
                  className={`rounded-2xl border transition-colors overflow-hidden ${
                    isExpanded ? 'border-slate-800 bg-slate-950/20' : 'border-slate-900 hover:border-slate-800 bg-slate-950/10'
                  }`}
                >
                  {/* Accordion Header */}
                  <button
                    onClick={() => toggleAccordion(q.id)}
                    className="w-full flex items-center justify-between p-5 text-left transition-all cursor-pointer"
                  >
                    <div className="flex-1 pr-4">
                      <div className="flex items-center space-x-2 text-[10px] uppercase font-bold text-brand-400 mb-1">
                        <span>Question {q.id}</span>
                        <span>•</span>
                        <span>Score: {feedObj?.score || 0}/10</span>
                      </div>
                      <h4 className="font-bold text-sm text-slate-200 leading-snug">
                        {q.question}
                      </h4>
                    </div>
                    <div>
                      {isExpanded ? (
                        <ChevronUp className="h-5 w-5 text-slate-500" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-slate-500" />
                      )}
                    </div>
                  </button>

                  {/* Accordion Content */}
                  {isExpanded && (
                    <div className="px-5 pb-5 pt-1 border-t border-slate-900/60 space-y-4 text-sm animate-fade-in">
                      {/* User's Answer */}
                      <div className="bg-slate-950/80 border border-slate-900 rounded-xl p-4">
                        <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                          Your Recorded Response
                        </span>
                        <p className="text-slate-300 italic leading-relaxed">
                          "{ansText}"
                        </p>
                      </div>

                      {/* Score feedback sections */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        
                        {/* Strengths */}
                        <div className="bg-emerald-950/5 border border-emerald-900/10 rounded-xl p-4">
                          <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider block mb-1">
                            Strengths
                          </span>
                          <p className="text-slate-300 text-xs leading-relaxed">
                            {feedObj?.strengths || 'N/A'}
                          </p>
                        </div>

                        {/* Mistakes */}
                        <div className="bg-red-950/5 border border-red-900/10 rounded-xl p-4">
                          <span className="text-xs font-bold text-red-400 uppercase tracking-wider block mb-1">
                            Gaps & Mistakes
                          </span>
                          <p className="text-slate-300 text-xs leading-relaxed">
                            {feedObj?.mistakes || 'N/A'}
                          </p>
                        </div>
                      </div>

                      {/* Improved Answer */}
                      <div className="bg-brand-950/5 border border-brand-900/15 rounded-xl p-4">
                        <span className="text-xs font-bold text-brand-400 uppercase tracking-wider flex items-center mb-1.5">
                          <Eye className="h-4 w-4 mr-1.5" />
                          <span>AI Coach Model Answer</span>
                        </span>
                        <p className="text-slate-300 text-xs leading-relaxed">
                          {feedObj?.improvedAnswer || 'N/A'}
                        </p>
                      </div>

                      {/* Prep Tip */}
                      <div className="bg-amber-950/5 border border-amber-900/15 rounded-xl p-4 flex items-start space-x-2">
                        <Lightbulb className="h-4 w-4 text-amber-400 flex-shrink-0 mt-0.5" />
                        <div>
                          <span className="text-xs font-bold text-amber-400 uppercase tracking-wider block">
                            Preparation Tip
                          </span>
                          <p className="text-slate-300 text-xs mt-0.5 leading-relaxed">
                            {feedObj?.prepTip || 'N/A'}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
};

export default ResultsPage;
