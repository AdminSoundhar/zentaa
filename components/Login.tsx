import React, { useState } from 'react';
import { Hexagon, AlertCircle, ArrowRight, Loader2 } from 'lucide-react';
import { authenticateUser } from '../services/authService';
import { User } from '../types';

interface LoginProps {
  onLogin: (user: User) => void;
}

const DEMO_SHEET_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQAVnBplRDIA6F9f5y0fJz9vqRzKRjIsoPp1sPMmO9X-C7JYRqQN4ID1GV1qZ2dv7UdlKWi5kWeS9Xt/pub?gid=0&single=true&output=csv";

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const targetSheet = DEMO_SHEET_URL;
      
      if (!targetSheet) {
          throw new Error("System Configuration Error: Database URL missing.");
      }

      const user = await authenticateUser(email, password, targetSheet);
      
      if (user) {
        onLogin(user);
      } else {
        setError('Invalid email or password.');
      }
    } catch (err: any) {
      setError(err.message || 'Login failed. Please check your connection.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans">
      <div className="sm:mx-auto sm:w-full sm:max-w-md animate-fade-in">
        <div className="flex justify-center items-center mb-6">
          <Hexagon className="w-10 h-10 text-blue-600 fill-blue-100 mr-2" />
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Zenta CRM</h2>
        </div>
        <h2 className="mt-2 text-center text-sm text-slate-600">
          Sign in to your account
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md animate-slide-up">
        <div className="bg-white py-8 px-4 shadow-xl shadow-slate-200 rounded-2xl sm:px-10 border border-slate-100">
          <form className="space-y-6" onSubmit={handleLogin}>
            
            {error && (
              <div className={`border px-4 py-3 rounded-lg text-sm flex items-start ${error.includes('Note:') ? 'bg-blue-50 border-blue-200 text-blue-700' : 'bg-red-50 border-red-200 text-red-600'}`}>
                <AlertCircle className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-700">
                Email address
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-slate-300 rounded-lg shadow-sm placeholder-slate-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-colors"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-700">
                Password
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-slate-300 rounded-lg shadow-sm placeholder-slate-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-colors"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center items-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-70 disabled:cursor-not-allowed transition-all"
              >
                {isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                ) : (
                    <span className="flex items-center">Sign in <ArrowRight className="ml-2 w-4 h-4"/></span>
                )}
              </button>
            </div>
          </form>
        </div>
        
        <div className="mt-6 text-center">
             <p className="text-xs text-slate-500">
                 &copy; 2024 Zenta CRM. All rights reserved.
             </p>
        </div>
      </div>
      
      <style>{`
        @keyframes slide-up {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }
        .animate-slide-up { animation: slide-up 0.5s ease-out forwards; }
      `}</style>
    </div>
  );
};

export default Login;