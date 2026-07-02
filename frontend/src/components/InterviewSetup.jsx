import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
import api from '../utils/api';
import { 
  FileText, Briefcase, Settings, ArrowRight, UploadCloud, CheckCircle2, AlertCircle, Loader2 
} from 'lucide-react';

const InterviewSetup = () => {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  // Wizard Steps: 1 = Resume, 2 = JD, 3 = Config
  const [step, setStep] = useState(1);
  const [file, setFile] = useState(null);
  
  // Form State
  const [resumeText, setResumeText] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [interviewType, setInterviewType] = useState('HR Interview');
  const [difficulty, setDifficulty] = useState('Medium');

  // Loading & Error States
  const [uploadingResume, setUploadingResume] = useState(false);
  const [generatingQuestions, setGeneratingQuestions] = useState(false);
  const [error, setError] = useState(null);

  const handleFileChange = async (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    if (selectedFile.type !== 'application/pdf') {
      setError('Only PDF files are supported for resume uploading.');
      return;
    }

    setFile(selectedFile);
    setError(null);
    setUploadingResume(true);

    const formData = new FormData();
    formData.append('resume', selectedFile);

    try {
      const response = await api.post('/upload-resume', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setResumeText(response.data.text);
      setStep(2); // Auto advance to job description step
    } catch (err) {
      console.error('Error uploading resume:', err);
      setError(err.response?.data?.error || 'Failed to extract text from resume. Ensure the PDF has copyable text.');
      setFile(null);
    } finally {
      setUploadingResume(false);
    }
  };

  const handleGenerateQuestions = async () => {
    if (!resumeText || !jobDescription || !user) {
      setError('Missing resume text or job description.');
      return;
    }

    setGeneratingQuestions(true);
    setError(null);

    try {
      const response = await api.post('/generate-questions', {
        userId: user._id,
        resumeText,
        jobDescription,
        interviewType,
        difficulty
      });
      // Redirect to the mock interview session
      navigate(`/interview/${response.data._id}`);
    } catch (err) {
      console.error('Error generating questions:', err);
      setError(err.response?.data?.error || 'Failed to generate interview questions. Please try again.');
    } finally {
      setGeneratingQuestions(false);
    }
  };

  return (
    <div className="min-h-screen bg-navy-950 text-white py-12 px-4 sm:px-6 lg:px-8 relative">
      {/* Full-screen Loading Overlay for Question Gen */}
      {generatingQuestions && (
        <div className="fixed inset-0 bg-navy-950/80 backdrop-blur-md z-50 flex flex-col items-center justify-center text-center px-4">
          <div className="glass-card rounded-3xl p-8 max-w-md border border-white/10 flex flex-col items-center">
            <Loader2 className="h-12 w-12 text-brand-500 animate-spin mb-4" />
            <h3 className="text-xl font-extrabold tracking-tight">Crafting Your Interview</h3>
            <p className="text-sm text-slate-400 mt-2">
              Gemini is analyzing your resume skills and the job requirements to generate 10 customized, relevant questions. Please wait...
            </p>
          </div>
        </div>
      )}

      <div className="mx-auto max-w-3xl">
        {/* Progress Tracker Header */}
        <div className="flex items-center justify-between mb-8 max-w-md mx-auto relative">
          <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-slate-800 -translate-y-1/2 z-0"></div>
          
          <button 
            onClick={() => resumeText && setStep(1)} 
            disabled={uploadingResume}
            className={`relative z-10 flex h-10 w-10 items-center justify-center rounded-full border font-bold text-sm transition-all cursor-pointer ${
              step >= 1 ? 'bg-brand-600 border-brand-500 text-white' : 'bg-slate-900 border-slate-800 text-slate-400'
            }`}
          >
            1
          </button>
          
          <button 
            onClick={() => resumeText && setStep(2)} 
            disabled={!resumeText || uploadingResume}
            className={`relative z-10 flex h-10 w-10 items-center justify-center rounded-full border font-bold text-sm transition-all cursor-pointer ${
              step >= 2 ? 'bg-brand-600 border-brand-500 text-white' : 'bg-slate-900 border-slate-800 text-slate-400'
            }`}
          >
            2
          </button>
          
          <button 
            onClick={() => resumeText && jobDescription && setStep(3)} 
            disabled={!resumeText || !jobDescription || uploadingResume}
            className={`relative z-10 flex h-10 w-10 items-center justify-center rounded-full border font-bold text-sm transition-all cursor-pointer ${
              step >= 3 ? 'bg-brand-600 border-brand-500 text-white' : 'bg-slate-900 border-slate-800 text-slate-400'
            }`}
          >
            3
          </button>
        </div>

        {/* Wizard Form Cards */}
        <div className="glass-card rounded-3xl p-6 sm:p-8 border border-white/5 shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 glow-spot-1 opacity-10 pointer-events-none"></div>

          {error && (
            <div className="rounded-xl bg-red-950/20 border border-red-900/30 p-4 flex items-center space-x-3 text-red-400 mb-6">
              <AlertCircle className="h-5 w-5 flex-shrink-0" />
              <span className="text-sm">{error}</span>
            </div>
          )}

          {/* STEP 1: RESUME UPLOAD */}
          {step === 1 && (
            <div className="space-y-6">
              <div className="flex items-center space-x-3 mb-2">
                <div className="p-2 rounded-lg bg-brand-950 border border-brand-900 text-brand-400">
                  <FileText className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold">Upload Your Resume</h2>
                  <p className="text-xs text-slate-400">PDF documents only. Clean searchable text format.</p>
                </div>
              </div>

              {!resumeText ? (
                <div className="border-2 border-dashed border-slate-800 hover:border-brand-500/50 rounded-2xl p-12 text-center transition-colors relative cursor-pointer group bg-slate-950/30">
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={handleFileChange}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    disabled={uploadingResume}
                  />
                  {uploadingResume ? (
                    <div className="flex flex-col items-center space-y-3">
                      <Loader2 className="h-10 w-10 text-brand-500 animate-spin" />
                      <p className="text-sm font-semibold">Extracting resume skills & experience...</p>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center space-y-3">
                      <UploadCloud className="h-12 w-12 text-slate-500 group-hover:text-brand-400 transition-colors" />
                      <p className="text-sm font-semibold text-slate-300">Drag & drop your PDF or click to browse</p>
                      <p className="text-xs text-slate-500">Maximum file size: 5MB</p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="rounded-xl border border-emerald-900/30 bg-emerald-950/20 p-4 flex items-start space-x-3">
                    <CheckCircle2 className="h-5 w-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-bold text-emerald-400 text-sm">Resume Loaded Successfully</h4>
                      <p className="text-xs text-emerald-300 mt-0.5 truncate max-w-[280px] sm:max-w-md">
                        File: {file?.name}
                      </p>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                      Extracted Preview
                    </label>
                    <div className="bg-slate-950 border border-slate-900 rounded-xl p-4 text-xs font-mono text-slate-400 h-32 overflow-y-auto">
                      {resumeText.substring(0, 800)}...
                    </div>
                  </div>

                  <div className="flex justify-end pt-4">
                    <button
                      onClick={() => setStep(2)}
                      className="flex items-center space-x-2 rounded-xl bg-brand-600 hover:bg-brand-500 py-2.5 px-6 font-bold text-sm transition-all cursor-pointer"
                    >
                      <span>Continue</span>
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* STEP 2: JOB DESCRIPTION */}
          {step === 2 && (
            <div className="space-y-6">
              <div className="flex items-center space-x-3 mb-2">
                <div className="p-2 rounded-lg bg-brand-950 border border-brand-900 text-brand-400">
                  <Briefcase className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold">Paste Target Job details</h2>
                  <p className="text-xs text-slate-400">Paste the job description or role requirements.</p>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Job Description Text
                </label>
                <textarea
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  placeholder="Paste the job listing responsibilities, qualifications, and stack here..."
                  className="w-full h-64 bg-slate-950 border border-slate-900 rounded-2xl p-4 text-sm text-slate-300 focus:outline-none focus:border-brand-500 transition-colors resize-none"
                />
              </div>

              <div className="flex justify-between pt-4">
                <button
                  onClick={() => setStep(1)}
                  className="rounded-xl border border-slate-800 hover:border-slate-700 py-2.5 px-6 text-sm font-semibold text-slate-400 hover:text-white transition-all cursor-pointer"
                >
                  Back
                </button>
                <button
                  onClick={() => setStep(3)}
                  disabled={!jobDescription.trim()}
                  className="flex items-center space-x-2 rounded-xl bg-brand-600 hover:bg-brand-500 disabled:opacity-50 disabled:cursor-not-allowed py-2.5 px-6 font-bold text-sm transition-all cursor-pointer"
                >
                  <span>Continue</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: COACH SETTINGS */}
          {step === 3 && (
            <div className="space-y-6">
              <div className="flex items-center space-x-3 mb-2">
                <div className="p-2 rounded-lg bg-brand-950 border border-brand-900 text-brand-400">
                  <Settings className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold">Coach Preferences</h2>
                  <p className="text-xs text-slate-400">Configure interview type and difficulty depth.</p>
                </div>
              </div>

              {/* Interview Type Selector */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                  Interview Type
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { id: 'HR Interview', desc: 'Behavioral, situational, culture fit.' },
                    { id: 'Technical Interview', desc: 'System design, coding concepts, frameworks.' },
                    { id: 'Project-Based Interview', desc: 'Deep-dive into resume projects.' },
                    { id: 'Internship Interview', desc: 'Core fundamentals, academics, learning potential.' }
                  ].map((t) => (
                    <button
                      key={t.id}
                      onClick={() => setInterviewType(t.id)}
                      className={`text-left p-4 rounded-xl border transition-all flex flex-col justify-between cursor-pointer ${
                        interviewType === t.id
                          ? 'border-brand-500 bg-brand-950/20 text-white shadow-lg'
                          : 'border-slate-800 bg-slate-950/30 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <span className="font-bold text-sm">{t.id}</span>
                      <span className="text-xs mt-1 text-slate-500">{t.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Difficulty Selector */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                  Difficulty Level
                </label>
                <div className="grid grid-cols-3 gap-4">
                  {['Easy', 'Medium', 'Hard'].map((d) => (
                    <button
                      key={d}
                      onClick={() => setDifficulty(d)}
                      className={`py-3 px-4 rounded-xl border text-center font-bold text-sm transition-all cursor-pointer ${
                        difficulty === d
                          ? 'border-brand-500 bg-brand-950/20 text-white'
                          : 'border-slate-800 bg-slate-950/30 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex justify-between pt-4">
                <button
                  onClick={() => setStep(2)}
                  className="rounded-xl border border-slate-800 hover:border-slate-700 py-2.5 px-6 text-sm font-semibold text-slate-400 hover:text-white transition-all cursor-pointer"
                >
                  Back
                </button>
                <button
                  onClick={handleGenerateQuestions}
                  className="flex items-center space-x-2 rounded-xl bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 py-2.5 px-8 font-bold text-sm shadow-md transition-all cursor-pointer"
                >
                  <span>Generate Questions</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InterviewSetup;
