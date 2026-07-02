import React, { useContext, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
import api from '../utils/api';
import { 
  ArrowLeft, ArrowRight, Save, HelpCircle, Loader2, AlertCircle, Sparkles, CheckSquare 
} from 'lucide-react';

const MockInterview = () => {
  const { id } = useParams();
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  // Session Data
  const [interview, setInterview] = useState(null);
  const [currentIdx, setCurrentIdx] = useState(0);
  
  // State storing user responses: { [questionId]: answer }
  const [answers, setAnswers] = useState({});

  // Loading & Action states
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  
  // Warning modal for empty answers
  const [showSkipWarning, setShowSkipWarning] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/');
      return;
    }

    const fetchSession = async () => {
      try {
        const response = await api.get(`/interviews/${id}`);
        setInterview(response.data);
        
        // If they already answered some questions, pre-populate state
        if (response.data.answers && response.data.answers.length > 0) {
          const loadedAns = {};
          response.data.answers.forEach(a => {
            loadedAns[a.questionId] = a.answer;
          });
          setAnswers(loadedAns);
        }
      } catch (err) {
        console.error('Error fetching session:', err);
        setError('Failed to load interview session details.');
      } finally {
        setLoading(false);
      }
    };

    fetchSession();
  }, [id, user, navigate]);

  const currentQuestion = interview?.questions?.[currentIdx];
  const currentAnswer = answers[currentQuestion?.id] || '';

  const handleTextChange = (e) => {
    setAnswers({
      ...answers,
      [currentQuestion.id]: e.target.value
    });
  };

  const handlePrev = () => {
    if (currentIdx > 0) {
      setCurrentIdx(currentIdx - 1);
    }
  };

  const handleNext = () => {
    if (!currentAnswer.trim()) {
      setShowSkipWarning(true);
    } else {
      advanceStep();
    }
  };

  const advanceStep = () => {
    setShowSkipWarning(false);
    if (currentIdx < 9) {
      setCurrentIdx(currentIdx + 1);
    }
  };

  const handleSubmitInterview = async () => {
    // If the final answer is empty, show warning before final submission
    if (!currentAnswer.trim() && !answers[currentQuestion?.id]) {
      setShowSkipWarning(true);
      return;
    }

    setSubmitting(true);
    setError(null);

    // Format answers array for backend Schema
    const formattedAnswers = interview.questions.map(q => ({
      questionId: q.id,
      answer: answers[q.id] || ''
    }));

    try {
      await api.post('/evaluate-answers', {
        interviewId: id,
        answers: formattedAnswers
      });
      // Navigate to results
      navigate(`/results/${id}`);
    } catch (err) {
      console.error('Error submitting interview:', err);
      setError(err.response?.data?.error || 'Failed to submit responses. Please check connection and try again.');
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-navy-950 flex flex-col items-center justify-center text-slate-400 space-y-3">
        <Loader2 className="h-8 w-8 text-brand-500 animate-spin" />
        <p className="text-sm">Loading questions...</p>
      </div>
    );
  }

  if (error && !interview) {
    return (
      <div className="min-h-screen bg-navy-950 flex items-center justify-center p-6">
        <div className="glass-card rounded-2xl p-6 max-w-md border border-red-900/30 text-center space-y-4">
          <AlertCircle className="h-10 w-10 text-red-500 mx-auto" />
          <h3 className="text-lg font-bold text-red-400">Error Loading Interview</h3>
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

  const progressPercent = Math.round(((currentIdx + 1) / 10) * 100);

  return (
    <div className="min-h-screen bg-navy-950 text-white py-12 px-4 sm:px-6 lg:px-8 relative">
      {/* Submitting Loading Overlay */}
      {submitting && (
        <div className="fixed inset-0 bg-navy-950/85 backdrop-blur-md z-50 flex flex-col items-center justify-center text-center px-4">
          <div className="glass-card rounded-3xl p-8 max-w-md border border-white/10 flex flex-col items-center">
            <Loader2 className="h-12 w-12 text-brand-500 animate-spin mb-4" />
            <h3 className="text-xl font-extrabold tracking-tight">Evaluating Your Answers</h3>
            <p className="text-sm text-slate-400 mt-2">
              Gemini is assessing your communication skills, technical depth, and comparing your answers against industry standards. This may take up to a minute...
            </p>
          </div>
        </div>
      )}

      {/* Skip/Empty Answer Warning Dialog */}
      {showSkipWarning && (
        <div className="fixed inset-0 bg-navy-950/70 backdrop-blur-sm z-40 flex items-center justify-center p-4">
          <div className="glass-card rounded-2xl border border-yellow-900/30 p-6 max-w-sm text-center space-y-4 shadow-xl">
            <HelpCircle className="h-10 w-10 text-yellow-500 mx-auto" />
            <h4 className="text-lg font-bold text-yellow-400">Skip Question?</h4>
            <p className="text-xs text-slate-400">
              Your current answer is empty. Submitting a blank response will receive a score of 1. Are you sure you want to proceed?
            </p>
            <div className="flex items-center justify-center space-x-3 pt-2">
              <button
                onClick={() => setShowSkipWarning(false)}
                className="rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 py-1.5 px-4 text-xs font-bold cursor-pointer"
              >
                No, Write Answer
              </button>
              <button
                onClick={() => {
                  if (currentIdx === 9) {
                    handleSubmitInterview();
                  } else {
                    advanceStep();
                  }
                }}
                className="rounded-lg bg-yellow-600 hover:bg-yellow-500 text-slate-950 py-1.5 px-4 text-xs font-bold cursor-pointer"
              >
                Yes, Skip/Proceed
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="mx-auto max-w-3xl">
        {/* Progress Stepper & Type Headers */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h2 className="text-xs font-bold uppercase tracking-widest text-brand-400">
              {interview?.interviewType} ({interview?.difficulty})
            </h2>
            <p className="text-lg font-extrabold mt-0.5">Question {currentIdx + 1} of 10</p>
          </div>
          
          {/* Progress Bar Container */}
          <div className="w-full sm:w-48 bg-slate-900 rounded-full h-2.5 overflow-hidden border border-slate-800">
            <div 
              style={{ width: `${progressPercent}%` }} 
              className="bg-gradient-to-r from-brand-500 to-indigo-500 h-full progress-fill"
            />
          </div>
        </div>

        {/* Live Question Card */}
        <div className="glass-card rounded-3xl p-6 sm:p-8 border border-white/5 shadow-2xl relative overflow-hidden mb-6 min-h-[380px] flex flex-col justify-between">
          <div className="absolute inset-0 glow-spot-2 opacity-5 pointer-events-none"></div>

          <div>
            {/* Coach Prompt badge */}
            <div className="inline-flex items-center space-x-1.5 rounded-full bg-brand-950/40 border border-brand-900/30 px-3 py-1 text-xs font-semibold text-brand-400 mb-6">
              <Sparkles className="h-3.5 w-3.5" />
              <span>AI Coach Question</span>
            </div>

            {/* Question Text */}
            <h3 className="text-lg sm:text-xl font-bold leading-relaxed text-slate-200">
              {currentQuestion?.question}
            </h3>
          </div>

          {/* Answer Input */}
          <div className="mt-8 space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">
              Your Response
            </label>
            <textarea
              value={currentAnswer}
              onChange={handleTextChange}
              placeholder="Structure your answer clearly. Mention projects, technologies, and STAR method points (Situation, Task, Action, Result) if applicable..."
              className="w-full h-40 bg-slate-950 border border-slate-900 rounded-2xl p-4 text-sm text-slate-300 focus:outline-none focus:border-brand-500 transition-colors resize-none font-sans leading-relaxed"
            />
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span>STAR method formatting recommended</span>
              <span>{currentAnswer.length} characters</span>
            </div>
          </div>
        </div>

        {/* Controls Navigation Panel */}
        <div className="flex items-center justify-between">
          <button
            onClick={handlePrev}
            disabled={currentIdx === 0}
            className="flex items-center space-x-2 rounded-xl border border-slate-800 hover:border-slate-700 bg-slate-950/30 disabled:opacity-30 disabled:cursor-not-allowed py-2.5 px-6 font-semibold text-slate-300 hover:text-white transition-all cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Previous</span>
          </button>

          {currentIdx < 9 ? (
            <button
              onClick={handleNext}
              className="flex items-center space-x-2 rounded-xl bg-brand-600 hover:bg-brand-500 py-2.5 px-8 font-bold text-sm shadow-md transition-all cursor-pointer"
            >
              <span>Next Question</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          ) : (
            <button
              onClick={handleSubmitInterview}
              className="flex items-center space-x-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 py-2.5 px-8 font-bold text-sm shadow-md shadow-emerald-600/10 transition-all cursor-pointer"
            >
              <CheckSquare className="h-4 w-4" />
              <span>Submit Interview</span>
            </button>
          )}
        </div>

        {/* Save details help */}
        <p className="text-center text-xs text-slate-500 mt-6 flex items-center justify-center">
          <Save className="h-3 w-3 mr-1" /> Answers are autosaved locally and synced on submission.
        </p>
      </div>
    </div>
  );
};

export default MockInterview;
