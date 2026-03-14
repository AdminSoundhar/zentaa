import React, { useState } from 'react';
import { MoreHorizontal, Plus, AlertCircle } from 'lucide-react';
import { Deal, DealStage } from '../types';
import { analyzeDealProbability } from '../services/geminiService';

const Deals: React.FC = () => {
  const [deals] = useState<Deal[]>([]); // Initialized with empty array
  const [analysis, setAnalysis] = useState<{ id: string, text: string } | null>(null);
  const [analyzingId, setAnalyzingId] = useState<string | null>(null);

  const stages = [DealStage.PROSPECTING, DealStage.NEGOTIATION, DealStage.CLOSED_WON];

  const handleAnalyze = async (deal: Deal) => {
    if (analysis && analysis.id === deal.id) {
        setAnalysis(null); // Toggle off
        return;
    }
    setAnalyzingId(deal.id);
    const result = await analyzeDealProbability(deal);
    setAnalysis({ id: deal.id, text: result });
    setAnalyzingId(null);
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col animate-fade-in">
       <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Deals Pipeline</h2>
          <p className="text-slate-500">Visualize and manage your sales stages.</p>
        </div>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center shadow-lg shadow-blue-600/20 transition-all">
          <Plus className="w-5 h-5 mr-2" />
          Add Deal
        </button>
      </div>

      <div className="flex-1 overflow-x-auto pb-4">
        <div className="flex gap-6 min-w-[1000px] h-full">
          {stages.map((stage) => {
            const stageDeals = deals.filter(d => d.stage === stage);
            const totalValue = stageDeals.reduce((sum, d) => sum + d.amount, 0);

            return (
              <div key={stage} className="flex-1 flex flex-col bg-slate-100/50 rounded-xl p-4 border border-slate-200 min-w-[320px]">
                <div className="flex justify-between items-center mb-4 px-1">
                  <div>
                    <h3 className="font-bold text-slate-700">{stage}</h3>
                    <p className="text-xs text-slate-500 font-medium mt-1">
                      {stageDeals.length} deals • ${totalValue.toLocaleString()}
                    </p>
                  </div>
                  <button className="text-slate-400 hover:text-slate-600">
                    <MoreHorizontal className="w-5 h-5" />
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto space-y-3 custom-scrollbar pr-1">
                  {stageDeals.length > 0 ? (
                    stageDeals.map(deal => (
                        <div key={deal.id} className="bg-white p-4 rounded-lg shadow-sm border border-slate-200 hover:shadow-md transition-all cursor-pointer group relative">
                        <div className="flex justify-between items-start mb-2">
                            <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                                {deal.probability}% Prob
                            </span>
                            <button className="text-slate-300 hover:text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity">
                                <MoreHorizontal className="w-4 h-4" />
                            </button>
                        </div>
                        <h4 className="font-semibold text-slate-800 mb-1 line-clamp-2">{deal.title}</h4>
                        <p className="text-sm text-slate-500 mb-3">{deal.contactName}</p>
                        <div className="flex justify-between items-center pt-3 border-t border-slate-50">
                            <span className="font-bold text-slate-700">${deal.amount.toLocaleString()}</span>
                            <span className="text-xs text-slate-400">{new Date(deal.closingDate).toLocaleDateString(undefined, {month: 'short', day: 'numeric'})}</span>
                        </div>

                        {/* AI Button */}
                        <button 
                            onClick={(e) => { e.stopPropagation(); handleAnalyze(deal); }}
                            className="absolute -top-2 -right-2 bg-white text-indigo-500 shadow-md p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-all hover:scale-110 border border-slate-100"
                            title="AI Analysis"
                        >
                            {analyzingId === deal.id ? (
                                <div className="w-4 h-4 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                            ) : (
                                <AlertCircle className="w-4 h-4" />
                            )}
                        </button>

                        {/* AI Analysis Tooltip */}
                        {analysis?.id === deal.id && (
                            <div className="mt-3 bg-indigo-50 p-3 rounded-lg text-xs text-indigo-900 border border-indigo-100 animate-fade-in">
                                <div className="flex items-center font-bold mb-1">
                                    <AlertCircle className="w-3 h-3 mr-1" />
                                    AI Insight
                                </div>
                                {analysis.text}
                            </div>
                        )}
                        </div>
                    ))
                  ) : (
                    <div className="text-center py-10 opacity-50 border-2 border-dashed border-slate-200 rounded-lg">
                        <p className="text-sm text-slate-400">No deals in {stage}</p>
                    </div>
                  )}
                  <button className="w-full py-2 border-2 border-dashed border-slate-200 rounded-lg text-slate-400 text-sm font-medium hover:border-blue-300 hover:text-blue-500 transition-colors">
                      + Add New Deal
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Deals;