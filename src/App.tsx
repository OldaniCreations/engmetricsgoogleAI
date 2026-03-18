/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { 
  LayoutDashboard, 
  Search, 
  Bell, 
  Settings, 
  HelpCircle, 
  ChevronDown, 
  Plus, 
  Database, 
  FileText, 
  Share2, 
  Star, 
  RefreshCw, 
  Clock, 
  Save, 
  MoreHorizontal, 
  Edit2,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  ChevronRight,
  Filter,
  Columns,
  Github,
  Shield,
  BookOpen,
  Users,
  ArrowUpRight,
  Activity,
  Zap
} from 'lucide-react';
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  AreaChart,
  Area
} from 'recharts';
import { motion, AnimatePresence } from 'motion/react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// --- Mock Data ---

const complianceData = [
  { name: 'Scorecard', value: 45, color: '#6366f1' }, // Indigo
  { name: 'Required Files', value: 30, color: '#10b981' }, // Emerald
  { name: 'Accessible Readme', value: 25, color: '#f59e0b' }, // Amber
];

const scorecardData = [
  { name: 'Dangerous Workflow', value: 360, color: '#6366f1' },
  { name: 'Vulnerabilities', value: 40, color: '#ef4444' },
  { name: 'Code Review', value: 40, color: '#f59e0b' },
];

const tableData = [
  { org: 'intel-innersource', id: '639291587', name: 'applications.validation.test-web-services.core-lib', score: 9.7, readme: true, security: true, contrib: false, support: true, gitignore: true, access1: true, access2: true },
  { org: 'intel-innersource', id: '747359520', name: 'frameworks.edge.one-intel-edge.edge-node.os-provision.art...', score: 8.4, readme: true, security: false, contrib: true, support: false, gitignore: true, access1: true, access2: true },
  { org: 'intel-innersource', id: '566067624', name: 'applications.business.construction.fastr.log-api', score: 5.5, readme: true, security: true, contrib: true, support: true, gitignore: true, access1: true, access2: true },
  { org: 'intel-innersource', id: '532812520', name: 'frameworks.business.ssas.cubes.ucd-billings-accrual-recon...', score: 3.6, readme: true, security: false, contrib: true, support: false, gitignore: false, access1: false, access2: false },
  { org: 'intel-innersource', id: '747257182', name: 'drivers.io.vmware.ai.igaudipt', score: 6.3, readme: false, security: true, contrib: true, support: false, gitignore: true, access1: false, access2: false },
  { org: 'intel-innersource', id: '516517003', name: 'documentation.security.coding.guidelines', score: 5.7, readme: false, security: false, contrib: true, support: true, gitignore: false, access1: false, access2: false },
];

const activityData = [
  { name: 'Mon', value: 400 },
  { name: 'Tue', value: 300 },
  { name: 'Wed', value: 600 },
  { name: 'Thu', value: 800 },
  { name: 'Fri', value: 500 },
  { name: 'Sat', value: 200 },
  { name: 'Sun', value: 300 },
];

// --- Components ---

const NavItem = ({ icon: Icon, label, active = false, onClick }: { icon: any, label: string, active?: boolean, onClick?: () => void }) => (
  <button 
    onClick={onClick}
    className={cn(
      "flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200",
      active 
        ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200" 
        : "text-slate-500 hover:bg-slate-100 hover:text-slate-900"
    )}
  >
    <Icon size={18} />
    <span>{label}</span>
  </button>
);

const StatCard = ({ label, value, icon: Icon, trend, color }: { label: string, value: string | number, icon: any, trend?: string, color: string }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="metric-card glass-card"
  >
    <div className="flex justify-between items-start mb-4">
      <div className={cn("p-3 rounded-2xl", color)}>
        <Icon size={24} className="text-white" />
      </div>
      {trend && (
        <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full flex items-center gap-1">
          {trend} <ArrowUpRight size={12} />
        </span>
      )}
    </div>
    <h3 className="text-slate-500 text-sm font-medium">{label}</h3>
    <p className="text-3xl font-bold text-slate-900 mt-1">{value}</p>
  </motion.div>
);

const ModernCard = ({ title, subtitle, children, className, actions }: { title: string, subtitle?: string, children: React.ReactNode, className?: string, actions?: React.ReactNode }) => (
  <motion.div 
    initial={{ opacity: 0, scale: 0.98 }}
    animate={{ opacity: 1, scale: 1 }}
    className={cn("glass-card rounded-3xl p-6 flex flex-col", className)}
  >
    <div className="flex justify-between items-start mb-6">
      <div>
        <h3 className="text-lg font-bold text-slate-900">{title}</h3>
        {subtitle && <p className="text-sm text-slate-500 mt-1">{subtitle}</p>}
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
    <div className="flex-1">
      {children}
    </div>
  </motion.div>
);

const StatusBadge = ({ label, value, total, icon: Icon, color }: { label: string, value: number, total: number, icon: any, color: 'indigo' | 'emerald' | 'amber' | 'rose' }) => {
  const percentage = (value / total) * 100;
  const colors = {
    indigo: 'bg-indigo-50 text-indigo-700 border-indigo-100',
    emerald: 'bg-emerald-50 text-emerald-700 border-emerald-100',
    amber: 'bg-amber-50 text-amber-700 border-amber-100',
    rose: 'bg-rose-50 text-rose-700 border-rose-100',
  };

  return (
    <div className={cn("p-4 rounded-2xl border flex flex-col gap-3", colors[color])}>
      <div className="flex justify-between items-center">
        <div className="p-2 rounded-lg bg-white/50">
          <Icon size={18} />
        </div>
        <span className="text-xs font-bold">{value}/{total}</span>
      </div>
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider opacity-70">{label}</p>
        <div className="h-1.5 w-full bg-white/30 rounded-full mt-2 overflow-hidden">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            className={cn("h-full rounded-full", color === 'indigo' ? 'bg-indigo-600' : color === 'emerald' ? 'bg-emerald-600' : color === 'amber' ? 'bg-amber-600' : 'bg-rose-600')}
          />
        </div>
      </div>
    </div>
  );
};

export default function App() {
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="flex h-screen bg-[#F8FAFC] font-sans text-slate-900 overflow-hidden">
      {/* Modern Sidebar */}
      <aside className="w-72 bg-white border-r border-slate-200 flex flex-col p-6 z-20">
        <div className="flex items-center gap-3 mb-10 px-2">
          <div className="w-10 h-10 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-indigo-200">
            <Zap size={24} fill="currentColor" />
          </div>
          <div>
            <h1 className="font-bold text-lg leading-none">RepoHealth</h1>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Enterprise v2.0</span>
          </div>
        </div>

        <nav className="flex-1 space-y-2">
          <NavItem icon={LayoutDashboard} label="Dashboard" active={activeTab === 'Dashboard'} onClick={() => setActiveTab('Dashboard')} />
          <NavItem icon={Activity} label="Repo Activity" active={activeTab === 'Activity'} onClick={() => setActiveTab('Activity')} />
          <NavItem icon={Shield} label="Security & Compliance" active={activeTab === 'Compliance'} onClick={() => setActiveTab('Compliance')} />
          <NavItem icon={Database} label="Data Explorer" active={activeTab === 'Explorer'} onClick={() => setActiveTab('Explorer')} />
          <NavItem icon={Users} label="Team Access" active={activeTab === 'Team'} onClick={() => setActiveTab('Team')} />
        </nav>

        <div className="mt-auto pt-6 border-t border-slate-100">
          <div className="bg-slate-50 rounded-2xl p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold">
              TO
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold truncate">Tristin Oldani</p>
              <p className="text-xs text-slate-500 truncate">Admin Access</p>
            </div>
            <Settings size={18} className="text-slate-400 cursor-pointer hover:text-indigo-600 transition-colors" />
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Modern Header */}
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-200 flex items-center justify-between px-8 shrink-0 z-10">
          <div className="flex items-center gap-4">
            <div className="relative group">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
              <input 
                type="text" 
                placeholder="Search repositories, metrics, or teams..." 
                className="bg-slate-100 border-none rounded-2xl pl-12 pr-6 py-2.5 text-sm w-96 focus:bg-white focus:ring-2 focus:ring-indigo-100 transition-all outline-none"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="p-2.5 rounded-xl text-slate-500 hover:bg-slate-100 transition-colors relative">
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></span>
            </button>
            <button className="p-2.5 rounded-xl text-slate-500 hover:bg-slate-100 transition-colors">
              <HelpCircle size={20} />
            </button>
            <div className="h-8 w-[1px] bg-slate-200 mx-2" />
            <button className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all flex items-center gap-2">
              <Plus size={18} />
              New Report
            </button>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="flex-1 overflow-y-auto p-8 space-y-8">
          {/* Welcome & Global Metrics */}
          <div className="flex justify-between items-end">
            <div>
              <h2 className="text-3xl font-bold text-slate-900">Repo Health Overview</h2>
              <p className="text-slate-500 mt-1">Real-time monitoring and compliance tracking for your organization.</p>
            </div>
            <div className="flex items-center gap-2 bg-white p-1 rounded-xl border border-slate-200 shadow-sm">
              {['24h', '7d', '30d', '90d'].map((range) => (
                <button 
                  key={range}
                  className={cn(
                    "px-4 py-1.5 rounded-lg text-xs font-bold transition-all",
                    range === '30d' ? "bg-slate-900 text-white" : "text-slate-500 hover:bg-slate-50"
                  )}
                >
                  {range}
                </button>
              ))}
            </div>
          </div>

          {/* Top Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard label="Overall Health" value="94.2%" icon={Zap} trend="+2.4%" color="bg-indigo-600" />
            <StatCard label="Active Repos" value="1,284" icon={Github} color="bg-slate-900" />
            <StatCard label="Security Score" value="8.9" icon={Shield} trend="+0.5" color="bg-emerald-600" />
            <StatCard label="Documentation" value="76%" icon={BookOpen} trend="-1.2%" color="bg-amber-500" />
          </div>

          {/* Main Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <ModernCard 
              title="Compliance Distribution" 
              subtitle="Breakdown of repository compliance status"
              className="lg:col-span-1"
              actions={<MoreHorizontal size={18} className="text-slate-400 cursor-pointer" />}
            >
              <div className="h-[300px] w-full flex flex-col items-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={complianceData}
                      cx="50%"
                      cy="50%"
                      innerRadius={80}
                      outerRadius={105}
                      paddingAngle={8}
                      dataKey="value"
                      stroke="none"
                    >
                      {complianceData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="grid grid-cols-2 gap-4 mt-4 w-full">
                  {complianceData.map((item) => (
                    <div key={item.name} className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                      <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">{item.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </ModernCard>

            <ModernCard 
              title="OpenSSF Scorecard Analysis" 
              subtitle="Critical vulnerabilities and workflow risks"
              className="lg:col-span-2"
              actions={<button className="text-indigo-600 text-xs font-bold hover:underline">View Full Report</button>}
            >
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    layout="vertical"
                    data={scorecardData}
                    margin={{ top: 5, right: 30, left: 120, bottom: 5 }}
                  >
                    <XAxis type="number" hide />
                    <YAxis 
                      dataKey="name" 
                      type="category" 
                      width={120} 
                      fontSize={11} 
                      fontWeight={600}
                      axisLine={false}
                      tickLine={false}
                    />
                    <Tooltip 
                      cursor={{ fill: 'transparent' }}
                      contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                    />
                    <Bar dataKey="value" radius={[0, 10, 10, 0]} barSize={32}>
                      {scorecardData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </ModernCard>
          </div>

          {/* Requirements & Status */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <ModernCard title="Required Documentation" subtitle="Standard repository metadata compliance">
              <div className="grid grid-cols-2 gap-4">
                <StatusBadge label="Readme" value={15} total={15} icon={BookOpen} color="emerald" />
                <StatusBadge label="Contributing" value={5} total={15} icon={Users} color="rose" />
                <StatusBadge label="Security" value={3} total={15} icon={Shield} color="rose" />
                <StatusBadge label="Support" value={6} total={15} icon={HelpCircle} color="amber" />
              </div>
            </ModernCard>

            <ModernCard title="Accessibility Audit" subtitle="README quality and accessibility standards">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-emerald-100 text-emerald-600">
                      <CheckCircle2 size={20} />
                    </div>
                    <div>
                      <p className="text-sm font-bold">Single H1 Heading</p>
                      <p className="text-xs text-slate-500">Ensures proper document structure</p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-emerald-600 uppercase">Passed</span>
                </div>
                <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-emerald-100 text-emerald-600">
                      <CheckCircle2 size={20} />
                    </div>
                    <div>
                      <p className="text-sm font-bold">Descriptive Alt Text</p>
                      <p className="text-xs text-slate-500">Images have accessible descriptions</p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-emerald-600 uppercase">Passed</span>
                </div>
                <div className="flex items-center justify-between p-4 rounded-2xl bg-rose-50 border border-rose-100">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-rose-100 text-rose-600">
                      <AlertCircle size={20} />
                    </div>
                    <div>
                      <p className="text-sm font-bold">Broken Links</p>
                      <p className="text-xs text-slate-500">3 external links are unreachable</p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-rose-600 uppercase">Failed</span>
                </div>
              </div>
            </ModernCard>
          </div>

          {/* Modern Table Section */}
          <ModernCard 
            title="Repository Health Explorer" 
            subtitle="Detailed breakdown of individual repository metrics"
            actions={
              <div className="flex items-center gap-2">
                <button className="p-2 rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-50">
                  <Filter size={16} />
                </button>
                <button className="p-2 rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-50">
                  <Columns size={16} />
                </button>
              </div>
            }
          >
            <div className="overflow-x-auto -mx-6">
              <table className="w-full text-left text-sm border-collapse">
                <thead>
                  <tr className="border-b border-slate-100">
                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Repository</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Health Score</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Readme</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Security</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Contrib</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Support</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {tableData.map((row, i) => (
                    <tr key={i} className="group hover:bg-slate-50/80 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{row.name}</span>
                          <span className="text-xs text-slate-400">{row.org}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className={cn(
                            "w-2 h-2 rounded-full",
                            row.score > 8 ? "bg-emerald-500" : row.score > 5 ? "bg-amber-500" : "bg-rose-500"
                          )} />
                          <span className="font-bold">{row.score}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {row.readme ? <CheckCircle2 size={16} className="text-emerald-500" /> : <AlertCircle size={16} className="text-rose-500" />}
                      </td>
                      <td className="px-6 py-4">
                        {row.security ? <CheckCircle2 size={16} className="text-emerald-500" /> : <AlertCircle size={16} className="text-rose-500" />}
                      </td>
                      <td className="px-6 py-4">
                        {row.contrib ? <CheckCircle2 size={16} className="text-emerald-500" /> : <AlertCircle size={16} className="text-rose-500" />}
                      </td>
                      <td className="px-6 py-4">
                        {row.support ? <CheckCircle2 size={16} className="text-emerald-500" /> : <AlertCircle size={16} className="text-rose-500" />}
                      </td>
                      <td className="px-6 py-4">
                        <span className={cn(
                          "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
                          row.score > 8 ? "bg-emerald-50 text-emerald-600" : row.score > 5 ? "bg-amber-50 text-amber-600" : "bg-rose-50 text-rose-600"
                        )}>
                          {row.score > 8 ? 'Healthy' : row.score > 5 ? 'Warning' : 'Critical'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </ModernCard>
        </div>
      </main>
    </div>
  );
}
