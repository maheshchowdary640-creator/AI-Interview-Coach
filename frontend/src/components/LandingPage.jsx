import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
import { 
  Sparkles, FileText, Award, RefreshCw, Compass, ArrowRight, Check, CheckCircle2, Star, Zap 
} from 'lucide-react';

const LandingPage = ({ onOpenAuthModal }) => {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  const handleStartCTA = () => {
    if (user) {
      navigate('/setup');
    } else {
      onOpenAuthModal();
    }
  };

  return (
    <div className="relative isolate overflow-hidden min-h-screen bg-navy-950 text-white">
      {/* Background glow animations */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[10%] left-[10%] w-[400px] h-[400px] rounded-full glow-spot-1 filter blur-3xl opacity-60 animate-pulse-slow"></div>
        <div className="absolute bottom-[20%] right-[10%] w-[500px] h-[500px] rounded-full glow-spot-2 filter blur-3xl opacity-60 animate-pulse-slow"></div>
      </div>

      <div className="relative z-10">
        {/* HERO SECTION */}
        <section className="mx-auto max-w-7xl px-6 pt-16 pb-24 sm:pt-24 sm:pb-32 lg:px-8 text-center">
          <div className="inline-flex items-center space-x-2 rounded-full bg-brand-950/40 border border-brand-800/40 px-3 py-1 text-xs font-semibold tracking-wide text-brand-300 mb-6">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Powered by Google Gemini AI</span>
          </div>
          
          <h1 className="mx-auto max-w-4xl text-4xl font-extrabold tracking-tight sm:text-6xl text-glow leading-none bg-gradient-to-r from-white via-slate-200 to-brand-400 bg-clip-text text-transparent">
            Land Your Dream Job with <br/>
            <span className="bg-gradient-to-r from-brand-400 via-indigo-400 to-cyan-400 bg-clip-text text-transparent">
              AI Interview Coaching
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-300">
            Upload your resume, paste any job description, and practice realistic mock interviews tailored specifically to you. Get instant scores, strengths, critique, and improvement roadmaps.
          </p>

          <div className="mt-10 flex items-center justify-center gap-x-6">
            <button
              onClick={handleStartCTA}
              className="group flex items-center space-x-2 rounded-xl bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 py-3.5 px-8 text-base font-bold shadow-lg shadow-brand-500/20 hover:shadow-brand-500/30 transition-all transform hover:-translate-y-0.5 cursor-pointer"
            >
              <span>Start Mock Interview</span>
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </button>
            <a href="#features" className="text-sm font-semibold leading-6 text-slate-300 hover:text-white transition-all">
              Learn more <span aria-hidden="true">→</span>
            </a>
          </div>
        </section>

        {/* FEATURES SECTION */}
        <section id="features" className="mx-auto max-w-7xl px-6 py-20 border-t border-slate-900 lg:px-8">
          <div className="mx-auto max-w-3xl text-center mb-16">
            <h2 className="text-base font-semibold leading-7 text-brand-400 uppercase tracking-widest">Features</h2>
            <p className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">Everything you need to master the interview</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Feature 1 */}
            <div className="glass-card rounded-2xl p-6 hover:border-brand-500/30 transition-all group">
              <div className="h-12 w-12 rounded-xl bg-brand-950/50 border border-brand-900/60 flex items-center justify-center mb-5 text-brand-400 group-hover:bg-brand-600 group-hover:text-white transition-all">
                <FileText className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold mb-2">Resume parsing</h3>
              <p className="text-sm text-slate-400">
                Upload your PDF resume to extract key experience details and technical skills automatically.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="glass-card rounded-2xl p-6 hover:border-brand-500/30 transition-all group">
              <div className="h-12 w-12 rounded-xl bg-brand-950/50 border border-brand-900/60 flex items-center justify-center mb-5 text-brand-400 group-hover:bg-brand-600 group-hover:text-white transition-all">
                <Sparkles className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold mb-2">Tailored Questions</h3>
              <p className="text-sm text-slate-400">
                Generates 10 questions customized to your resume details matched with the targeted job post.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="glass-card rounded-2xl p-6 hover:border-brand-500/30 transition-all group">
              <div className="h-12 w-12 rounded-xl bg-brand-950/50 border border-brand-900/60 flex items-center justify-center mb-5 text-brand-400 group-hover:bg-brand-600 group-hover:text-white transition-all">
                <Award className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold mb-2">STAR Evaluation</h3>
              <p className="text-sm text-slate-400">
                Get scores out of 10, identified mistakes, highlighting strengths, and perfect answer revisions.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="glass-card rounded-2xl p-6 hover:border-brand-500/30 transition-all group">
              <div className="h-12 w-12 rounded-xl bg-brand-950/50 border border-brand-900/60 flex items-center justify-center mb-5 text-brand-400 group-hover:bg-brand-600 group-hover:text-white transition-all">
                <Compass className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold mb-2">Improvement Roadmap</h3>
              <p className="text-sm text-slate-400">
                Receive an overall scorecard and a step-by-step roadmap to refine your gaps.
              </p>
            </div>
          </div>
        </section>

        {/* HOW IT WORKS SECTION */}
        <section className="mx-auto max-w-7xl px-6 py-20 border-t border-slate-900 lg:px-8 bg-slate-950/30">
          <div className="mx-auto max-w-3xl text-center mb-16">
            <h2 className="text-base font-semibold leading-7 text-brand-400 uppercase tracking-widest">How it Works</h2>
            <p className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">Your 4-step path to confidence</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Step 1 */}
            <div className="relative flex flex-col items-center text-center p-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-600/20 text-brand-300 font-bold border border-brand-500/30 text-lg mb-4">
                1
              </div>
              <h3 className="text-lg font-bold mb-2">Set Context</h3>
              <p className="text-sm text-slate-400">
                Upload your PDF resume and paste the job description you're preparing for.
              </p>
            </div>

            {/* Step 2 */}
            <div className="relative flex flex-col items-center text-center p-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-600/20 text-brand-300 font-bold border border-brand-500/30 text-lg mb-4">
                2
              </div>
              <h3 className="text-lg font-bold mb-2">AI Configures Questions</h3>
              <p className="text-sm text-slate-400">
                Choose the interview type (HR, Technical, Project, or Internship) and difficulty level.
              </p>
            </div>

            {/* Step 3 */}
            <div className="relative flex flex-col items-center text-center p-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-600/20 text-brand-300 font-bold border border-brand-500/30 text-lg mb-4">
                3
              </div>
              <h3 className="text-lg font-bold mb-2">Interactive Mock</h3>
              <p className="text-sm text-slate-400">
                Respond to 10 questions one by one. Your answers are saved securely.
              </p>
            </div>

            {/* Step 4 */}
            <div className="relative flex flex-col items-center text-center p-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-600/20 text-brand-300 font-bold border border-brand-500/30 text-lg mb-4">
                4
              </div>
              <h3 className="text-lg font-bold mb-2">Get Report Card</h3>
              <p className="text-sm text-slate-400">
                Download a PDF report and unlock weak area roadmaps, custom feedback, and scores.
              </p>
            </div>
          </div>
        </section>

        {/* PRICING PREVIEW SECTION */}
        <section className="mx-auto max-w-7xl px-6 py-20 border-t border-slate-900 lg:px-8">
          <div className="mx-auto max-w-3xl text-center mb-16">
            <h2 className="text-base font-semibold leading-7 text-brand-400 uppercase tracking-widest">Pricing Preview</h2>
            <p className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">Affordable preparation for every stage</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Plan 1 */}
            <div className="glass-card rounded-2xl p-8 border border-white/5 flex flex-col justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-300">Hobby Plan</h3>
                <p className="text-sm text-slate-500 mt-1">Perfect for trying it out</p>
                <div className="my-6">
                  <span className="text-4xl font-extrabold">$0</span>
                  <span className="text-slate-500 text-sm"> / free forever</span>
                </div>
                <ul className="space-y-3 text-sm text-slate-400 mb-8">
                  <li className="flex items-center"><Check className="h-4 w-4 text-brand-400 mr-2" /> 2 Resume Uploads</li>
                  <li className="flex items-center"><Check className="h-4 w-4 text-brand-400 mr-2" /> 1 Mock Interview session</li>
                  <li className="flex items-center"><Check className="h-4 w-4 text-brand-400 mr-2" /> Standard Feedback Analysis</li>
                </ul>
              </div>
              <button 
                onClick={handleStartCTA} 
                className="w-full rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 py-2.5 text-sm font-semibold text-slate-300 hover:text-white transition-all cursor-pointer"
              >
                Get Started
              </button>
            </div>

            {/* Plan 2 - Featured */}
            <div className="glass-card rounded-2xl p-8 border-2 border-brand-500/50 flex flex-col justify-between relative transform scale-105 shadow-xl shadow-brand-500/5">
              <div className="absolute top-0 right-1/2 translate-x-1/2 -translate-y-1/2 bg-brand-600 text-white text-xs font-bold py-1 px-3 rounded-full uppercase tracking-wider">
                Most Popular
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-200">Pro Coach</h3>
                <p className="text-sm text-slate-400 mt-1">For active job seekers</p>
                <div className="my-6">
                  <span className="text-4xl font-extrabold">$15</span>
                  <span className="text-slate-400 text-sm"> / month</span>
                </div>
                <ul className="space-y-3 text-sm text-slate-300 mb-8">
                  <li className="flex items-center"><Check className="h-4 w-4 text-brand-400 mr-2" /> Unlimited Resume Uploads</li>
                  <li className="flex items-center"><Check className="h-4 w-4 text-brand-400 mr-2" /> Unlimited AI Mock Interviews</li>
                  <li className="flex items-center"><Check className="h-4 w-4 text-brand-400 mr-2" /> Comprehensive Report PDFs</li>
                  <li className="flex items-center"><Check className="h-4 w-4 text-brand-400 mr-2" /> Detailed Roadmap Timeline</li>
                </ul>
              </div>
              <button 
                onClick={handleStartCTA} 
                className="w-full rounded-xl bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 py-2.5 text-sm font-bold text-white shadow-md shadow-brand-600/20 transition-all cursor-pointer"
              >
                Upgrade to Pro
              </button>
            </div>

            {/* Plan 3 */}
            <div className="glass-card rounded-2xl p-8 border border-white/5 flex flex-col justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-300">Enterprise</h3>
                <p className="text-sm text-slate-500 mt-1">For universities & teams</p>
                <div className="my-6">
                  <span className="text-4xl font-extrabold">$49</span>
                  <span className="text-slate-500 text-sm"> / month</span>
                </div>
                <ul className="space-y-3 text-sm text-slate-400 mb-8">
                  <li className="flex items-center"><Check className="h-4 w-4 text-brand-400 mr-2" /> Everything in Pro</li>
                  <li className="flex items-center"><Check className="h-4 w-4 text-brand-400 mr-2" /> Multi-candidate Dashboards</li>
                  <li className="flex items-center"><Check className="h-4 w-4 text-brand-400 mr-2" /> Custom Interview Scoring Weights</li>
                </ul>
              </div>
              <button 
                onClick={handleStartCTA} 
                className="w-full rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 py-2.5 text-sm font-semibold text-slate-300 hover:text-white transition-all cursor-pointer"
              >
                Contact Sales
              </button>
            </div>
          </div>
        </section>

        {/* FINAL CTA SECTION */}
        <section className="mx-auto max-w-5xl px-6 py-20 sm:py-28 lg:px-8 text-center relative rounded-3xl overflow-hidden glass-card border border-white/10 mb-20">
          <div className="absolute inset-0 z-0 glow-spot-1 opacity-40"></div>
          <div className="relative z-10 max-w-3xl mx-auto">
            <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">Ready to nail your upcoming interview?</h2>
            <p className="mt-4 text-lg text-slate-300">
              Stop guessing. Get practical simulation practice and let AI give you detailed critiques of your strengths and mistakes.
            </p>
            <div className="mt-8 flex justify-center">
              <button
                onClick={handleStartCTA}
                className="flex items-center space-x-2 rounded-xl bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 py-3.5 px-8 text-base font-bold shadow-lg shadow-brand-500/20 transition-all cursor-pointer"
              >
                <span>Start Mock Interview</span>
                <ArrowRight className="h-5 w-5" />
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default LandingPage;
