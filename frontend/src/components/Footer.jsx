import React from 'react';
import { Sparkles, Heart } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="border-t border-slate-900 bg-navy-950 py-12 text-slate-400">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Info */}
          <div className="col-span-1 md:col-span-2 space-y-4">
            <div className="flex items-center space-x-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-md bg-gradient-to-tr from-brand-600 to-indigo-500 shadow-md">
                <Sparkles className="h-4 w-4 text-white" />
              </div>
              <span className="text-lg font-bold tracking-tight text-white">PrepAI</span>
            </div>
            <p className="text-sm text-slate-400 max-w-sm">
              An advanced full-stack AI interview coaching platform powered by Google Gemini. Tailor questions to your resume, practice in real-time, and unlock detailed performance analytics.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold tracking-wider text-slate-200 uppercase mb-4">Resources</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-sm font-semibold tracking-wider text-slate-200 uppercase mb-4">Contact</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-white transition-colors">Support Center</a></li>
              <li><a href="mailto:support@prepai.com" className="hover:text-white transition-colors">support@prepai.com</a></li>
              <li className="text-xs text-slate-500">Localhost Server Status: Active</li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-slate-900 pt-6 flex flex-col md:flex-row items-center justify-between text-xs text-slate-500">
          <p>&copy; {new Date().getFullYear()} PrepAI Inc. All rights reserved.</p>
          <p className="flex items-center mt-2 md:mt-0">
            Made with <Heart className="mx-1 h-3 w-3 text-red-500 fill-red-500 animate-pulse" /> for job seekers.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
