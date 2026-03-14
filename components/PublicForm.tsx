import React from 'react';
import LeadForm from './LeadForm';
import { Lead } from '../types';
import { ArrowLeft } from 'lucide-react';

interface PublicFormProps {
  onBack: () => void;
}

const PublicForm: React.FC<PublicFormProps> = ({ onBack }) => {
  const handleSubmit = (lead: Lead) => {
    // In a real app, you would send this to an API
    console.log("Public submission:", lead);
    // The LeadForm component handles the alert/reset for public view
  };

  return (
    <div className="min-h-screen bg-blue-50/50 py-8 px-4 sm:px-6 lg:px-8 animate-fade-in overflow-y-auto">
      <div className="max-w-2xl mx-auto space-y-4 pb-12">
        <button 
            onClick={onBack} 
            className="flex items-center text-slate-500 hover:text-blue-600 transition-colors mb-4"
        >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to Dashboard
        </button>

        <div className="bg-white rounded-xl shadow-xl overflow-hidden border border-slate-200">
            {/* Blue Top Bar */}
            <div className="h-3 bg-blue-600 w-full"></div>
            
            {/* Header */}
            <div className="px-6 py-8 border-b border-slate-100">
                <h1 className="text-3xl font-normal text-slate-900">Sales Lead form FY25-26</h1>
                <p className="mt-2 text-sm text-slate-500">Please fill out the enquiry details below.</p>
                <div className="mt-4 flex items-center justify-between text-xs text-slate-400">
                    <span className="flex items-center gap-2">
                        <span className="w-4 h-4 border rounded-full flex items-center justify-center">
                            <span className="w-2.5 h-0.5 bg-slate-300"></span>
                        </span>
                        Saving disabled
                    </span>
                    <span className="text-red-600">* Indicates required question</span>
                </div>
            </div>

            {/* Form Body */}
            <div className="p-6 sm:p-8 bg-slate-50/30">
                <LeadForm onSubmit={handleSubmit} isPublic={true} />
            </div>
        </div>

        <div className="text-center text-xs text-slate-400 mt-8">
            This form was created inside Zenta CRM. 
            <a href="#" className="underline ml-1 hover:text-slate-600">Report Abuse</a>
        </div>
        <div className="text-center mt-2">
             <span className="text-slate-400 font-semibold text-lg">Zenta Forms</span>
        </div>
      </div>
    </div>
  );
};

export default PublicForm;
