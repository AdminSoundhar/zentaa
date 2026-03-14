import React, { useState } from 'react';
import { Lead, LeadStatus } from '../types';
import { ChevronDown, User, Phone, Mail, Box, DollarSign, Scale, Share2, Target, FileText } from 'lucide-react';

interface LeadFormProps {
  onSubmit: (lead: Lead) => void;
  onCancel?: () => void;
  isPublic?: boolean;
}

const LeadForm: React.FC<LeadFormProps> = ({ onSubmit, onCancel, isPublic = false }) => {
  const [formData, setFormData] = useState({
    customerName: '',
    dialingCode: '91',
    dialingCodeOther: '',
    customerMobile: '',
    customerEmail: '',
    metalGroup: '',
    productCategory: '',
    description: '',
    budget: '',
    weight: '',
    source: '',
    leadGeneration: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.customerName || !formData.customerMobile) return;

    const finalDialingCode = formData.dialingCode === 'Other' ? formData.dialingCodeOther : formData.dialingCode;

    const lead: Lead = {
      id: Date.now().toString(),
      name: formData.customerName,
      company: `${formData.metalGroup || 'N/A'} - ${formData.productCategory || 'N/A'}`, 
      email: formData.customerEmail || '',
      phone: `+${finalDialingCode} ${formData.customerMobile}`,
      status: LeadStatus.NEW,
      source: formData.source || 'Direct',
      lastContact: new Date().toLocaleDateString(),
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.customerName)}&background=random`,
      
      dialingCode: finalDialingCode,
      mobile: formData.customerMobile,
      metalGroup: formData.metalGroup,
      productCategory: formData.productCategory,
      description: formData.description,
      budget: formData.budget,
      weight: formData.weight,
      leadGeneration: formData.leadGeneration
    };

    onSubmit(lead);

    if (isPublic) {
        clearForm();
        alert("Lead submitted successfully!");
    }
  };

  const clearForm = () => {
      setFormData({
        customerName: '',
        dialingCode: '91',
        dialingCodeOther: '',
        customerMobile: '',
        customerEmail: '',
        metalGroup: '',
        productCategory: '',
        description: '',
        budget: '',
        weight: '',
        source: '',
        leadGeneration: ''
    });
  };

  const inputClasses = "w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all hover:border-slate-300 placeholder-slate-400 bg-white";
  const labelClasses = "block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5";
  const sectionClasses = "grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4";

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
        {/* Section: Contact Information */}
        <div>
            <div className="flex items-center gap-2 mb-4 pb-2 border-b border-slate-100">
                <User className="w-4 h-4 text-blue-600" />
                <h4 className="text-sm font-bold text-slate-800 uppercase tracking-tight">Contact Information</h4>
            </div>
            <div className={sectionClasses}>
                <div className="md:col-span-2">
                    <label className={labelClasses}>Customer name <span className="text-red-500">*</span></label>
                    <input 
                        required
                        name="customerName"
                        value={formData.customerName}
                        onChange={handleInputChange}
                        className={inputClasses}
                        placeholder="Full name"
                    />
                </div>

                <div className="space-y-4">
                    <label className={labelClasses}>Dialing code <span className="text-red-500">*</span></label>
                    <div className="flex gap-4 p-2 bg-slate-50 rounded-lg border border-slate-100">
                        <label className="flex items-center cursor-pointer group">
                            <input type="radio" name="dialingCode" value="91" checked={formData.dialingCode === '91'} onChange={handleInputChange} className="w-4 h-4 text-blue-600 border-slate-300 focus:ring-blue-500" />
                            <span className="ml-2 text-sm text-slate-700">91</span>
                        </label>
                        <label className="flex items-center cursor-pointer group">
                            <input type="radio" name="dialingCode" value="1" checked={formData.dialingCode === '1'} onChange={handleInputChange} className="w-4 h-4 text-blue-600 border-slate-300 focus:ring-blue-500" />
                            <span className="ml-2 text-sm text-slate-700">1</span>
                        </label>
                        <div className="flex items-center group">
                            <input type="radio" name="dialingCode" value="Other" checked={formData.dialingCode === 'Other'} onChange={handleInputChange} className="w-4 h-4 text-blue-600 border-slate-300 focus:ring-blue-500" />
                            <span className="ml-2 text-sm text-slate-700 mr-2">Other:</span>
                            {formData.dialingCode === 'Other' && (
                                <input 
                                    type="text"
                                    name="dialingCodeOther"
                                    value={formData.dialingCodeOther}
                                    onChange={handleInputChange}
                                    className="border-b border-slate-300 bg-transparent py-0 px-1 text-sm focus:border-blue-500 outline-none w-16"
                                />
                            )}
                        </div>
                    </div>
                </div>

                <div>
                    <label className={labelClasses}>Customer mobile <span className="text-red-500">*</span></label>
                    <div className="relative">
                        <Phone className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                        <input 
                            required
                            type="tel"
                            name="customerMobile"
                            value={formData.customerMobile}
                            onChange={handleInputChange}
                            className={`${inputClasses} pl-10`}
                            placeholder="Mobile number"
                        />
                    </div>
                </div>

                <div className="md:col-span-2">
                    <label className={labelClasses}>Customer email</label>
                    <div className="relative">
                        <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                        <input 
                            type="email"
                            name="customerEmail"
                            value={formData.customerEmail}
                            onChange={handleInputChange}
                            className={`${inputClasses} pl-10`}
                            placeholder="email@example.com"
                        />
                    </div>
                </div>
            </div>
        </div>

        {/* Section: Requirement Details */}
        <div>
            <div className="flex items-center gap-2 mb-4 pb-2 border-b border-slate-100">
                <Box className="w-4 h-4 text-blue-600" />
                <h4 className="text-sm font-bold text-slate-800 uppercase tracking-tight">Requirement Details</h4>
            </div>
            <div className={sectionClasses}>
                <div>
                    <label className={labelClasses}>Metal group <span className="text-red-500">*</span></label>
                    <div className="relative group">
                        <select 
                            required
                            name="metalGroup"
                            value={formData.metalGroup}
                            onChange={handleInputChange}
                            className={`${inputClasses} appearance-none pr-10`}
                        >
                            <option value="" disabled>Choose</option>
                            <option value="Gold">Gold</option>
                            <option value="Diamond">Diamond</option>
                            <option value="Platinum">Platinum</option>
                            <option value="Silver">Silver</option>
                            <option value="Gemstone">Gemstone</option>
                        </select>
                        <ChevronDown className="absolute right-3 top-2.5 h-4 w-4 text-slate-400 pointer-events-none group-hover:text-slate-600" />
                    </div>
                </div>

                <div>
                    <label className={labelClasses}>Product Category <span className="text-red-500">*</span></label>
                    <div className="relative group">
                        <select 
                            required
                            name="productCategory"
                            value={formData.productCategory}
                            onChange={handleInputChange}
                            className={`${inputClasses} appearance-none pr-10`}
                        >
                            <option value="" disabled>Choose</option>
                            <option value="Ring">Ring</option>
                            <option value="Bangle">Bangle</option>
                            <option value="Chain">Chain</option>
                            <option value="Necklace">Necklace</option>
                            <option value="Earring">Earring</option>
                            <option value="Bracelet">Bracelet</option>
                            <option value="Coin">Coin</option>
                            <option value="Other">Other</option>
                        </select>
                        <ChevronDown className="absolute right-3 top-2.5 h-4 w-4 text-slate-400 pointer-events-none group-hover:text-slate-600" />
                    </div>
                </div>

                <div>
                    <label className={labelClasses}>Budget <span className="text-red-500">*</span></label>
                    <div className="relative">
                        <DollarSign className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                        <input 
                            required
                            name="budget"
                            value={formData.budget}
                            onChange={handleInputChange}
                            className={`${inputClasses} pl-10`}
                            placeholder="Estimated budget"
                        />
                    </div>
                </div>

                <div>
                    <label className={labelClasses}>Weight <span className="text-red-500">*</span></label>
                    <div className="relative">
                        <Scale className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                        <input 
                            required
                            name="weight"
                            value={formData.weight}
                            onChange={handleInputChange}
                            className={`${inputClasses} pl-10`}
                            placeholder="e.g. 10g"
                        />
                    </div>
                </div>

                <div className="md:col-span-2">
                    <label className={labelClasses}>Description</label>
                    <div className="relative">
                        <FileText className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                        <input 
                            name="description"
                            value={formData.description}
                            onChange={handleInputChange}
                            className={`${inputClasses} pl-10`}
                            placeholder="Specific requirements or remarks"
                        />
                    </div>
                </div>

                <div>
                    <label className={labelClasses}>Source <span className="text-red-500">*</span></label>
                    <div className="relative group">
                        <Share2 className="absolute left-3 top-2.5 h-4 w-4 text-slate-400 pointer-events-none" />
                        <select 
                            required
                            name="source"
                            value={formData.source}
                            onChange={handleInputChange}
                            className={`${inputClasses} pl-10 appearance-none pr-10`}
                        >
                            <option value="" disabled>Choose</option>
                            <option value="Walk-in">Walk-in</option>
                            <option value="Facebook">Facebook</option>
                            <option value="Instagram">Instagram</option>
                            <option value="Website">Website</option>
                            <option value="Referral">Referral</option>
                            <option value="Call">Call</option>
                        </select>
                        <ChevronDown className="absolute right-3 top-2.5 h-4 w-4 text-slate-400 pointer-events-none group-hover:text-slate-600" />
                    </div>
                </div>

                <div>
                    <label className={labelClasses}>Lead generation <span className="text-red-500">*</span></label>
                    <div className="relative group">
                        <Target className="absolute left-3 top-2.5 h-4 w-4 text-slate-400 pointer-events-none" />
                        <select 
                            required
                            name="leadGeneration"
                            value={formData.leadGeneration}
                            onChange={handleInputChange}
                            className={`${inputClasses} pl-10 appearance-none pr-10`}
                        >
                            <option value="" disabled>Choose</option>
                            <option value="Inbound">Inbound</option>
                            <option value="Outbound">Outbound</option>
                            <option value="Campaign">Campaign</option>
                            <option value="Event">Event</option>
                        </select>
                        <ChevronDown className="absolute right-3 top-2.5 h-4 w-4 text-slate-400 pointer-events-none group-hover:text-slate-600" />
                    </div>
                </div>
            </div>
        </div>
        
        <div className="flex justify-between items-center pt-6 border-t border-slate-100">
            <button 
                type="button"
                onClick={clearForm}
                className="text-slate-400 font-medium text-sm hover:text-slate-600 transition-colors"
            >
                Clear all fields
            </button>

            <div className="flex gap-3">
                {onCancel && (
                    <button 
                        type="button"
                        onClick={onCancel}
                        className="text-slate-500 font-medium text-sm hover:text-slate-700 px-4 py-2"
                    >
                        Cancel
                    </button>
                )}
                <button 
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-2.5 rounded-lg shadow-lg shadow-blue-500/20 transition-all active:scale-95"
                >
                    Create Lead
                </button>
            </div>
        </div>
    </form>
  );
};

export default LeadForm;