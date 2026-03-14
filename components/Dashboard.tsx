import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';
import { DollarSign, Users, Briefcase, TrendingUp, MoreHorizontal } from 'lucide-react';

const data = [
  { name: 'Jan', sales: 4000, leads: 2400 },
  { name: 'Feb', sales: 3000, leads: 1398 },
  { name: 'Mar', sales: 2000, leads: 9800 },
  { name: 'Apr', sales: 2780, leads: 3908 },
  { name: 'May', sales: 1890, leads: 4800 },
  { name: 'Jun', sales: 2390, leads: 3800 },
  { name: 'Jul', sales: 3490, leads: 4300 },
];

const pipelineData = [
  { name: 'Prospecting', value: 12 },
  { name: 'Qualified', value: 8 },
  { name: 'Proposal', value: 5 },
  { name: 'Negotiation', value: 3 },
];

const COLORS = ['#94a3b8', '#60a5fa', '#3b82f6', '#1d4ed8'];

const Dashboard: React.FC = () => {
  return (
    <div className="space-y-6 animate-fade-in pb-10">
      <div className="flex justify-between items-center mb-2">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Dashboard Overview</h2>
          <p className="text-slate-500">Welcome back, here's what's happening today.</p>
        </div>
        <div className="flex space-x-3">
            <select className="bg-white border border-slate-200 text-slate-700 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 outline-none">
                <option>Last 7 Days</option>
                <option>Last 30 Days</option>
                <option>This Year</option>
            </select>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Revenue', value: '$24,500', change: '+12%', icon: DollarSign, color: 'text-emerald-600', bg: 'bg-emerald-100' },
          { label: 'New Leads', value: '42', change: '+5%', icon: Users, color: 'text-blue-600', bg: 'bg-blue-100' },
          { label: 'Deals Pipeline', value: '28', change: '-2%', icon: Briefcase, color: 'text-purple-600', bg: 'bg-purple-100' },
          { label: 'Win Rate', value: '34%', change: '+4%', icon: TrendingUp, color: 'text-amber-600', bg: 'bg-amber-100' },
        ].map((stat, idx) => (
          <div key={idx} className="bg-white rounded-xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-slate-500">{stat.label}</p>
                <h3 className="text-2xl font-bold text-slate-800 mt-1">{stat.value}</h3>
              </div>
              <div className={`p-3 rounded-lg ${stat.bg}`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <span className={stat.change.startsWith('+') ? 'text-emerald-600 font-medium' : 'text-rose-600 font-medium'}>
                {stat.change}
              </span>
              <span className="text-slate-400 ml-1">vs last month</span>
            </div>
          </div>
        ))}
      </div>

      {/* Main Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Trend */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-slate-100 min-w-0">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-slate-800">Revenue & Leads Trend</h3>
            <button className="text-slate-400 hover:text-slate-600">
              <MoreHorizontal className="w-5 h-5" />
            </button>
          </div>
          <div className="h-80 w-full flex items-center justify-center rounded-lg relative" style={{ minHeight: '320px' }}>
            {data.length > 0 ? (
                <div style={{ width: '100%', height: '100%' }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                            <defs>
                            <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                            </linearGradient>
                            <linearGradient id="colorLeads" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#10b981" stopOpacity={0.1}/>
                                <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                            </linearGradient>
                            </defs>
                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
                            <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                            <CartesianGrid vertical={false} stroke="#f1f5f9" />
                            <Tooltip 
                                contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                itemStyle={{ fontSize: '12px' }}
                            />
                            <Area type="monotone" dataKey="sales" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorSales)" />
                            <Area type="monotone" dataKey="leads" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorLeads)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            ) : (
                <div className="text-slate-400 text-sm">No analytics data available</div>
            )}
          </div>
        </div>

        {/* Pipeline Distribution */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 min-w-0">
          <h3 className="text-lg font-bold text-slate-800 mb-6">Deal Pipeline</h3>
          <div className="h-64 w-full" style={{ minHeight: '256px' }}>
             <div style={{ width: '100%', height: '100%' }}>
                 <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={pipelineData} layout="vertical" barSize={24}>
                        <XAxis type="number" hide />
                        <YAxis dataKey="name" type="category" width={90} tick={{fontSize: 11, fill: '#64748b'}} interval={0} />
                        <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                        <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                            {pipelineData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Bar>
                    </BarChart>
                 </ResponsiveContainer>
             </div>
          </div>
          <div className="mt-6 space-y-4">
             {pipelineData.map((d, i) => (
                 <div key={i} className="flex justify-between items-center text-sm">
                     <div className="flex items-center">
                         <div className="w-2.5 h-2.5 rounded-full mr-2.5" style={{backgroundColor: COLORS[i]}}></div>
                         <span className="text-slate-600 font-medium">{d.name}</span>
                     </div>
                     <span className="font-bold text-slate-800">{d.value}</span>
                 </div>
             ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;