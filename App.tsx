import React, { useState } from 'react';
import { Bell, Search, MessageSquare, ArrowLeft } from 'lucide-react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import Leads from './components/Leads';
import Deals from './components/Deals';
import Login from './components/Login';
import PublicForm from './components/PublicForm';
import LeadForm from './components/LeadForm';
import { ViewState, User, Lead } from './types';
import { chatWithCRM } from './services/geminiService';
import { saveLeadToSheet } from './services/leadService';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [currentView, setCurrentView] = useState<ViewState>('dashboard');
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessage, setChatMessage] = useState('');
  const [chatHistory, setChatHistory] = useState<{role: 'user' | 'ai', text: string}[]>([]);
  const [isChatLoading, setIsChatLoading] = useState(false);

  // Lifted Leads State
  const [leads, setLeads] = useState<Lead[]>([]);

  const handleAddLead = async (lead: Lead) => {
    // 1. Update local state immediately for UI responsiveness
    setLeads(prev => [lead, ...prev]);
    setCurrentView('leads');

    // 2. Save to Google Sheet in background
    await saveLeadToSheet(lead);
  };

  // Handle Login
  if (!user) {
      return <Login onLogin={setUser} />;
  }

  const handleChatSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatMessage.trim()) return;

    const userMsg = chatMessage;
    setChatHistory(prev => [...prev, { role: 'user', text: userMsg }]);
    setChatMessage('');
    setIsChatLoading(true);

    // Context aware chat: pass current view name
    const response = await chatWithCRM(userMsg, { currentView, userRole: user.role });
    
    setChatHistory(prev => [...prev, { role: 'ai', text: response }]);
    setIsChatLoading(false);
  };

  // Standalone view for public form (renders without layout)
  if (currentView === 'public-form') {
      return <PublicForm onBack={() => setCurrentView('leads')} />;
  }

  const renderContent = () => {
    switch (currentView) {
      case 'dashboard': return <Dashboard />;
      case 'leads': return <Leads leads={leads} onNavigate={setCurrentView} />;
      case 'add-lead': return (
        <div className="animate-fade-in max-w-3xl mx-auto">
            <div className="flex items-center mb-6">
                <button 
                    onClick={() => setCurrentView('leads')} 
                    className="mr-4 text-slate-400 hover:text-blue-600 transition-colors p-1 rounded-full hover:bg-slate-100"
                >
                    <ArrowLeft className="w-6 h-6" />
                </button>
                <h2 className="text-2xl font-bold text-slate-800">New Sales Lead</h2>
            </div>
            <div className="bg-white rounded-xl shadow-lg shadow-slate-200/50 border border-slate-200 overflow-hidden">
                <div className="h-2 bg-blue-600 w-full"></div>
                <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center">
                    <div>
                        <h3 className="text-xl font-medium text-slate-900">Lead Information</h3>
                        <p className="text-sm text-slate-500 mt-1">Fill in the details below to create a new lead.</p>
                    </div>
                </div>
                <div className="p-8 bg-slate-50/30">
                    <LeadForm onSubmit={handleAddLead} onCancel={() => setCurrentView('leads')} />
                </div>
            </div>
        </div>
      );
      case 'deals': return <Deals />;
      default: return (
        <div className="flex flex-col items-center justify-center h-96 text-slate-400">
            <h3 className="text-xl font-medium mb-2">Work in Progress</h3>
            <p>The {currentView} module is coming soon.</p>
        </div>
      );
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 font-sans text-slate-900">
      <Sidebar 
        currentView={currentView} 
        setCurrentView={setCurrentView} 
        onLogout={() => setUser(null)}
      />

      <main className="flex-1 ml-64 flex flex-col h-screen overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 z-10 shadow-sm">
          <div className="flex items-center w-96">
            <div className="relative w-full">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search deals, people, or companies..."
                className="w-full pl-10 pr-4 py-2 text-sm text-slate-700 bg-slate-50 border-0 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:bg-white transition-all outline-none"
              />
            </div>
          </div>

          <div className="flex items-center space-x-6">
            <button className="relative p-2 text-slate-400 hover:text-slate-600 transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="flex items-center pl-6 border-l border-slate-100">
              <div className="text-right mr-3 hidden md:block">
                <div className="text-sm font-semibold text-slate-800">{user.name}</div>
                <div className="text-xs text-slate-500">{user.role}</div>
              </div>
              <img
                src={user.avatar || "https://picsum.photos/40/40"}
                alt="Profile"
                className="w-9 h-9 rounded-full object-cover border-2 border-white shadow-sm cursor-pointer hover:border-blue-100 transition-colors"
              />
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-auto p-8 relative">
           {renderContent()}
        </div>
      </main>

      {/* Global AI Chat Widget */}
      <div className={`fixed bottom-6 right-6 flex flex-col items-end z-50 transition-all ${isChatOpen ? 'w-96' : 'w-auto'}`}>
         {isChatOpen && (
             <div className="mb-4 w-96 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-slide-up origin-bottom-right">
                 <div className="bg-indigo-600 p-4 text-white flex justify-between items-center">
                     <h3 className="font-semibold flex items-center">
                         <MessageSquare className="w-4 h-4 mr-2" />
                         CRM Assistant
                     </h3>
                     <button onClick={() => setIsChatOpen(false)} className="hover:text-indigo-200">×</button>
                 </div>
                 <div className="h-80 overflow-y-auto p-4 space-y-3 bg-slate-50">
                    {chatHistory.length === 0 && (
                        <div className="text-center text-slate-400 text-sm mt-10">
                            <p>Hi {user.name.split(' ')[0]}! I can help you summarize deals, draft emails, or find leads.</p>
                        </div>
                    )}
                    {chatHistory.map((msg, idx) => (
                        <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[85%] p-3 rounded-xl text-sm ${msg.role === 'user' ? 'bg-indigo-600 text-white rounded-br-none' : 'bg-white text-slate-700 shadow-sm border border-slate-100 rounded-bl-none'}`}>
                                {msg.text}
                            </div>
                        </div>
                    ))}
                    {isChatLoading && (
                        <div className="flex justify-start">
                            <div className="bg-white p-3 rounded-xl rounded-bl-none shadow-sm border border-slate-100">
                                <div className="flex space-x-1">
                                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-100"></div>
                                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-200"></div>
                                </div>
                            </div>
                        </div>
                    )}
                 </div>
                 <form onSubmit={handleChatSubmit} className="p-3 bg-white border-t border-slate-100">
                     <div className="flex gap-2">
                         <input 
                            value={chatMessage}
                            onChange={(e) => setChatMessage(e.target.value)}
                            placeholder="Ask Zenta AI..." 
                            className="flex-1 text-sm border border-slate-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500/20 outline-none"
                         />
                         <button type="submit" disabled={isChatLoading} className="bg-indigo-600 hover:bg-indigo-700 text-white p-2 rounded-lg transition-colors">
                             <MessageSquare className="w-4 h-4" />
                         </button>
                     </div>
                 </form>
             </div>
         )}
         <button 
            onClick={() => setIsChatOpen(!isChatOpen)}
            className="h-14 w-14 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full shadow-lg shadow-indigo-600/30 flex items-center justify-center transition-transform hover:scale-105"
         >
            {isChatOpen ? <span className="text-2xl">×</span> : <MessageSquare className="w-6 h-6" />}
         </button>
      </div>
      
      <style>{`
        @keyframes fade-in {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }
        @keyframes scale-in {
            from { opacity: 0; transform: scale(0.95); }
            to { opacity: 1; transform: scale(1); }
        }
        @keyframes slide-up {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in { animation: fade-in 0.4s ease-out forwards; }
        .animate-scale-in { animation: scale-in 0.2s ease-out forwards; }
        .animate-slide-up { animation: slide-up 0.3s ease-out forwards; }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 2px; }
      `}</style>
    </div>
  );
};

export default App;