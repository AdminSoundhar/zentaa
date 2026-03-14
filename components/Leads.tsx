import React, { useState } from 'react';
import { Search, Filter, Plus, MoreVertical, Mail, Sparkles, X, ExternalLink } from 'lucide-react';
import { Lead, LeadStatus, ViewState } from '../types';
import { generateLeadEmail } from '../services/geminiService';

interface LeadsProps {
    leads: Lead[];
    onNavigate: (view: ViewState) => void;
}

const Leads: React.FC<LeadsProps> = ({ leads, onNavigate }) => {
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  
  // Email Generation State
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [emailContext, setEmailContext] = useState('');
  const [generatedEmail, setGeneratedEmail] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateEmail = async () => {
    if (!selectedLead) return;
    setIsGenerating(true);
    const email = await generateLeadEmail(selectedLead, emailContext || "Introduction and scheduling a demo");
    setGeneratedEmail(email);
    setIsGenerating(false);
  };

  const openEmailModal = (lead: Lead) => {
    setSelectedLead(lead);
    setGeneratedEmail('');
    setEmailContext('');
    setIsEmailModalOpen(true);
  };

  return (
    <div className="space-y-6 animate-fade-in relative">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Sales Leads FY25-26</h2>
          <p className="text-slate-500">Manage customer enquiries and requirements.</p>
        </div>
        <div className="flex gap-3">
            <button 
                onClick={() => onNavigate('public-form')}
                className="bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 px-4 py-2 rounded-lg flex items-center shadow-sm transition-all"
            >
                <ExternalLink className="w-4 h-4 mr-2" />
                Public Form
            </button>
            <button 
                onClick={() => onNavigate('add-lead')}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center shadow-lg shadow-blue-600/20 transition-all"
            >
            <Plus className="w-5 h-5 mr-2" />
            Add New Lead
            </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        {/* Toolbar */}
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-3">
            <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <input 
                    type="text" 
                    placeholder="Search leads..." 
                    className="pl-10 pr-4 py-2 w-full border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
            </div>
            <div className="flex gap-2">
                <button className="flex items-center px-3 py-2 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 text-sm">
                    <Filter className="w-4 h-4 mr-2" />
                    Filter
                </button>
                <button className="flex items-center px-3 py-2 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 text-sm">
                   Sort By
                </button>
            </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-xs uppercase font-semibold text-slate-500">
              <tr>
                <th className="px-6 py-4">Customer Name</th>
                <th className="px-6 py-4">Interest (Metal/Product)</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Source</th>
                <th className="px-6 py-4">Phone</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {leads.length > 0 ? (
                leads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <img src={lead.avatar} alt="" className="w-8 h-8 rounded-full mr-3 object-cover" />
                        <div>
                          <div className="font-medium text-slate-900">{lead.name}</div>
                          <div className="text-slate-400 text-xs">{lead.email || 'No email'}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-medium">{lead.company}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border
                        ${lead.status === LeadStatus.NEW ? 'bg-blue-50 text-blue-700 border-blue-200' : ''}
                        ${lead.status === LeadStatus.CONTACTED ? 'bg-amber-50 text-amber-700 border-amber-200' : ''}
                        ${lead.status === LeadStatus.QUALIFIED ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : ''}
                        ${lead.status === LeadStatus.LOST ? 'bg-slate-50 text-slate-600 border-slate-200' : ''}
                      `}>
                        {lead.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">{lead.source}</td>
                    <td className="px-6 py-4 text-slate-500 font-mono text-xs">{lead.phone}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end space-x-2">
                          <button 
                              onClick={() => openEmailModal(lead)}
                              className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors group"
                              title="Generate AI Email"
                          >
                              <Sparkles className="w-4 h-4" />
                          </button>
                          <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
                              <Mail className="w-4 h-4" />
                          </button>
                          <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
                              <MoreVertical className="w-4 h-4" />
                          </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-slate-400">
                        <div className="flex flex-col items-center">
                            <Search className="w-10 h-10 mb-3 text-slate-300" />
                            <p className="text-base font-medium text-slate-600">No leads found</p>
                            <p className="text-sm mt-1">Get started by adding a new sales lead.</p>
                        </div>
                    </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {leads.length > 0 && (
            <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between text-sm text-slate-500">
                <span>Showing {leads.length} results</span>
                <div className="flex gap-2">
                    <button className="px-3 py-1 border border-slate-200 rounded hover:bg-slate-50">Previous</button>
                    <button className="px-3 py-1 border border-slate-200 rounded hover:bg-slate-50">Next</button>
                </div>
            </div>
        )}
      </div>

      {/* AI Email Modal */}
      {isEmailModalOpen && selectedLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden animate-scale-in">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 flex justify-between items-start">
              <div className="text-white">
                <h3 className="text-xl font-bold flex items-center">
                  <Sparkles className="w-5 h-5 mr-2 text-yellow-300" />
                  AI Email Assistant
                </h3>
                <p className="text-blue-100 text-sm mt-1">Drafting for {selectedLead.name}</p>
              </div>
              <button onClick={() => setIsEmailModalOpen(false)} className="text-white/80 hover:text-white">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Email Goal / Context</label>
                <input
                  type="text"
                  className="w-full border border-slate-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500/50 outline-none"
                  placeholder="e.g. Follow up on last week's meeting..."
                  value={emailContext}
                  onChange={(e) => setEmailContext(e.target.value)}
                />
              </div>

              <div className="flex justify-end">
                <button
                  onClick={handleGenerateEmail}
                  disabled={isGenerating}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center disabled:opacity-50"
                >
                  {isGenerating ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 mr-2" />
                      Generate Draft
                    </>
                  )}
                </button>
              </div>

              {generatedEmail && (
                <div className="mt-4">
                  <label className="block text-sm font-medium text-slate-700 mb-1">Generated Draft</label>
                  <textarea
                    className="w-full h-48 border border-slate-200 rounded-lg p-4 text-slate-700 text-sm focus:ring-2 focus:ring-blue-500/50 outline-none resize-none bg-slate-50"
                    value={generatedEmail}
                    onChange={(e) => setGeneratedEmail(e.target.value)}
                  />
                  <div className="mt-3 flex gap-3">
                     <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-medium text-sm transition-colors">
                        Send Email
                     </button>
                     <button 
                        onClick={() => setGeneratedEmail('')}
                        className="px-4 py-2 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 font-medium text-sm transition-colors"
                     >
                        Discard
                     </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Leads;