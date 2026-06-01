'use client';

import { useState, useEffect } from 'react';
import { ChevronDown, LayoutDashboard, Building2, Key, Save, Bot, ArrowLeft, FileText, CheckCircle2, GitMerge, User, Plus, Activity, AlertTriangle, Coins, Target, Table, MessageSquare, CheckSquare, ListTodo } from 'lucide-react';
import { ReactFlow, Background, Controls, Handle, Position, applyNodeChanges, applyEdgeChanges, type NodeChange, type EdgeChange, type Edge } from '@xyflow/react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer, AreaChart, Area, ComposedChart, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ScatterChart, Scatter, RadialBarChart, RadialBar } from 'recharts';
import '@xyflow/react/dist/style.css';
import { CEOSkill } from '../lib/agents/ceo-skill';
import { EmployeeSkill } from '../lib/agents/employee-skill';

const GEMINI_MODELS = [
  'gemini-3.5-flash',
  'gemini-3.5-pro',
  'gemini-2.5-flash',
  'gemini-2.5-pro',
  'gemini-2.0-flash',
  'gemini-2.0-pro-exp',
  'gemini-1.5-pro',
  'gemini-1.5-flash'
];

function CustomNode({ data }: { data: any }) {
  return (
    <div className="bg-zinc-900 border border-zinc-700 shadow-2xl rounded-xl w-[280px] flex flex-col relative z-10 transition-colors">
      {/* Node Header */}
      <div className="bg-zinc-800/80 px-4 py-3 flex items-center gap-3 border-b border-zinc-700/50 rounded-t-xl">
        <div className="bg-indigo-500/20 p-1.5 rounded-lg border border-indigo-500/30">
          <Bot className="w-5 h-5 text-indigo-400" />
        </div>
        <div>
          <span className="text-zinc-100 font-semibold text-sm block">{data.label || 'CEO'}</span>
          <span className="text-zinc-400 text-[10px] block uppercase tracking-wider">Agent Node</span>
        </div>
      </div>
      {/* Node Body */}
      <div className="p-4 bg-zinc-900/90 rounded-b-xl">
        <p className="text-xs text-zinc-400 line-clamp-2">{data.description || 'Agent Workflow Node'}</p>
        {data.skillName && (
          <div className="mt-4 flex items-center justify-between">
             <span className="text-[10px] text-zinc-500 bg-zinc-800 px-2 py-1 rounded">{data.skillName}</span>
          </div>
        )}
      </div>
      
      <Handle type="target" position={Position.Left} className="w-4 h-4 !bg-zinc-900 !border-2 !border-zinc-500 cursor-crosshair hover:scale-125 transition-all !rounded-full -ml-[8px]" />
      <Handle type="target" position={Position.Top} id="top" className="w-4 h-4 !bg-zinc-900 !border-2 !border-zinc-500 cursor-crosshair hover:scale-125 transition-all !rounded-full -mt-[8px]" />
      <Handle type="source" position={Position.Right} className="w-4 h-4 !bg-zinc-900 !border-2 !border-zinc-500 cursor-crosshair hover:scale-125 transition-all !rounded-full -mr-[8px]" />
      <Handle type="source" position={Position.Bottom} id="bottom" className="w-4 h-4 !bg-zinc-900 !border-2 !border-zinc-500 cursor-crosshair hover:scale-125 transition-all !rounded-full -mb-[8px]" />
    </div>
  );
}

function ContextNode({ data }: { data: any }) {
  const isCompany = data.iconType === 'company';
  return (
    <div className="bg-zinc-900 border border-zinc-700 shadow-2xl rounded-xl w-[280px] flex flex-col relative z-10 transition-colors">
      <div className="bg-zinc-800/80 px-4 py-3 flex items-center gap-3 border-b border-zinc-700/50 rounded-t-xl">
        <div className={`p-1.5 rounded-lg border ${isCompany ? 'bg-orange-500/20 border-orange-500/30 text-orange-400' : 'bg-blue-500/20 border-blue-500/30 text-blue-400'}`}>
          {isCompany ? <Building2 className="w-5 h-5" /> : <User className="w-5 h-5" />}
        </div>
        <div>
          <span className="text-zinc-100 font-semibold text-sm block">{data.title}</span>
          <span className="text-zinc-400 text-[10px] block uppercase tracking-wider">{data.subtitle}</span>
        </div>
      </div>
      <div className="p-4 bg-zinc-900/90 rounded-b-xl max-h-[220px] overflow-y-auto [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-zinc-700 [&::-webkit-scrollbar-thumb]:rounded-full">
        <p className="text-xs text-zinc-400 whitespace-pre-wrap leading-relaxed">{data.content}</p>
      </div>
      <Handle type="source" position={Position.Right} className="w-4 h-4 !bg-zinc-900 !border-2 !border-zinc-500 cursor-crosshair hover:scale-125 transition-all !rounded-full -mr-[8px]" />
    </div>
  );
}

function ExcelNode({ data }: { data: any }) {
  return (
    <div className="bg-[#107c41] border-[3px] border-zinc-800 shadow-2xl rounded-full w-16 h-16 flex flex-col items-center justify-center relative z-10 transition-transform hover:scale-110 shrink-0">
      <Table className="w-5 h-5 text-white mb-0.5" />
      <span className="text-white font-bold text-[8px] leading-tight text-center px-1 w-full truncate">{data.label || 'Excel'}</span>
      <Handle type="source" position={Position.Bottom} id="bottom" className="w-2.5 h-2.5 !bg-white !border-2 !border-[#107c41] cursor-crosshair !rounded-full -mb-[4.5px]" />
    </div>
  );
}

function ChatSheetNode({ data }: { data: any }) {
  return (
    <div className="bg-[#0284c7] border-[3px] border-zinc-800 shadow-2xl rounded-full w-16 h-16 flex flex-col items-center justify-center relative z-10 transition-transform hover:scale-110 shrink-0">
      <MessageSquare className="w-5 h-5 text-white mb-0.5" />
      <span className="text-white font-bold text-[8px] leading-tight text-center px-1 w-full truncate">{data.label || 'Chat Sheet'}</span>
      <Handle type="source" position={Position.Bottom} id="bottom" className="w-2.5 h-2.5 !bg-white !border-2 !border-[#0284c7] cursor-crosshair !rounded-full -mb-[4.5px]" />
    </div>
  );
}

const nodeTypes = { customNode: CustomNode, contextNode: ContextNode, excelNode: ExcelNode, chatsheetNode: ChatSheetNode };

const AVAILABLE_HOD_SKILLS = [
  { id: 'marketing-hod', name: 'shopkiper-hod-marketing', file: 'shopkiper-hod-marketing.md' },
  { id: 'research-hod', name: 'shopkiper-hod-research', file: 'shopkiper-hod-research.md' },
  { id: 'operations-hod', name: 'shopkiper-hod-operations', file: 'shopkiper-hod-operations.md' },
  { id: 'finance-hod', name: 'shopkiper-hod-finance', file: 'shopkiper-hod-finance.md' },
  { id: 'customer-service-hod', name: 'shopkiper-hod-customer-experience', file: 'shopkiper-hod-customer-experience.md' },
  { id: 'social-media-hod', name: 'shopkiper-hod-social-media', file: 'shopkiper-hod-social-media.md' },
  { id: 'budget-distribution-hod', name: 'shopkiper-hod-budget-distribution', file: 'shopkiper-hod-budget-distribution.md' }
];

export default function Page() {
  const [selectedSkillForAgent, setSelectedSkillForAgent] = useState<Record<string, string>>({});
  const [showForm, setShowForm] = useState(false);
  const [step, setStep] = useState(1);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [chatsheetCategory, setChatsheetCategory] = useState<'all' | 'marketing' | 'operations' | 'finance' | 'research' | 'social'>('all');
  const [companyName, setCompanyName] = useState('');
  const [companyDetails, setCompanyDetails] = useState('');
  const [apiConfig, setApiConfig] = useState([
    { id: 1, key: '', model: 'gemini-3.5-flash' },
    { id: 2, key: '', model: 'gemini-3.5-flash' },
    { id: 3, key: '', model: 'gemini-3.5-flash' },
    { id: 4, key: '', model: 'gemini-3.5-flash' }
  ]);
  const [agents, setAgents] = useState<any[]>([
    { 
      id: 'ceo', 
      name: 'CEO', 
      description: 'Strategic decision maker responsible for company vision, overall management, and high-level execution planning.', 
      maxTokens: 4096, 
      skillAttached: true, 
      skillName: 'shopkiper-ceo-task-delegator', 
      skillFile: 'lib/agents/ceo-skill.ts',
      metrics: { completed: 0, pending: 0, failed: 0, tokensUsed: 0, status: 'Idle' }
    }
  ]);
  const [tasks, setTasks] = useState<{id: string, title: string, description: string, status: string, assignedTo: string, createdAt: Date}[]>([]);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [showTelegramSetup, setShowTelegramSetup] = useState(false);
  const [newTask, setNewTask] = useState({ title: '', description: '' });
  const [editingAgentId, setEditingAgentId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [initialData, setInitialData] = useState<any>(null);
  const [isSystemRunning, setIsSystemRunning] = useState(false);
  const [timeSeriesData, setTimeSeriesData] = useState<any[]>(() => {
    const data = [];
    for(let i=10; i>0; i--) {
      data.push({
        time: new Date(Date.now() - 2000 * i).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        ceo: 0, hod: 0, emp: 0
      });
    }
    return data;
  });
  
  const [nodes, setNodes] = useState<any[]>([]);
  const [edges, setEdges] = useState<any[]>([]);


  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await fetch('/api/tasks');
        if (res.ok) {
          const data = await res.json();
          setTasks(data.map((t: any) => ({ ...t, createdAt: new Date(t.createdAt) })));
        }
      } catch (err) {
        console.error('Failed to load tasks', err);
      }
    };
    
    fetchTasks();
    const interval = setInterval(fetchTasks, 3000);
    return () => clearInterval(interval);
  }, []);

  const [excelData, setExcelData] = useState<Record<string, string>>({});

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('xenon_excel_data');
      if (stored) {
        try {
          setExcelData(JSON.parse(stored));
        } catch(e) {}
      } else {
         // Default sample data
         const initialData = {
           '0,0': 'Region', '0,1': 'Target Q1', '0,2': 'Actual Q1', '0,3': 'Variance',
           '1,0': 'North', '1,1': '50000', '1,2': '48000', '1,3': '-2000',
           '2,0': 'South', '2,1': '45000', '2,2': '46500', '2,3': '1500',
           '3,0': 'East', '3,1': '60000', '3,2': '58000', '3,3': '-2000',
           '4,0': 'West', '4,1': '55000', '4,2': '55000', '4,3': '0',
         };
         setExcelData(initialData);
         localStorage.setItem('xenon_excel_data', JSON.stringify(initialData));
      }
    }
  }, []);

  const handleExcelCellChange = (rIndex: number, cIndex: number, value: string) => {
    setExcelData(prev => {
      const newData = { ...prev, [`${rIndex},${cIndex}`]: value };
      localStorage.setItem('xenon_excel_data', JSON.stringify(newData));
      return newData;
    });
  };

  const [chatSheetStats, setChatSheetStats] = useState({
    chart1: [
      { name: 'WhatsApp', value: 45, color: '#10b981' },
      { name: 'Viber', value: 15, color: '#8b5cf6' },
      { name: 'Direct Link', value: 25, color: '#3b82f6' },
      { name: 'Social Post', value: 15, color: '#f59e0b' },
    ],
    chart2: [
      { name: 'Jan', active: 4000, conversion: 2400 },
      { name: 'Feb', active: 3000, conversion: 1398 },
      { name: 'Mar', active: 2000, conversion: 5800 },
      { name: 'Apr', active: 2780, conversion: 3908 },
      { name: 'May', active: 1890, conversion: 4800 },
    ],
    chart3: [      
      { platform: 'Referrals', cost: 120 },
      { platform: 'Geo Ads', cost: 450 },
      { platform: 'Local Events', cost: 680 },
      { platform: 'Collabs', cost: 350 },
    ],
    chart4: [
      { name: 'Unreachable Address', value: 40, color: '#3b82f6' },
      { name: 'Customer Out', value: 30, color: '#ef4444' },
      { name: 'Traffic Delay', value: 20, color: '#f59e0b' },
      { name: 'Item Damaged', value: 10, color: '#10b981' },
    ],
    chart5: [
      { product: 'Basmati Rice', shortage: 120 },
      { product: 'Mustard Oil', shortage: 80 },
      { product: 'Red Lentils', shortage: 95 },
      { product: 'Spices Mix', shortage: 45 },
      { product: 'Specialty Tea', shortage: 60 },
    ],
    chart6: [
      { day: 'Mon', active: 12, capacity: 15 },
      { day: 'Tue', active: 14, capacity: 15 },
      { day: 'Wed', active: 11, capacity: 15 },
      { day: 'Thu', active: 15, capacity: 15 },
      { day: 'Fri', active: 13, capacity: 15 },
      { day: 'Sat', active: 15, capacity: 20 },
      { day: 'Sun', active: 12, capacity: 20 },
    ],
    chart7: [
      { week: 'W1', rate: 78, target: 85 },
      { week: 'W2', rate: 82, target: 85 },
      { week: 'W3', rate: 86, target: 85 },
      { week: 'W4', rate: 89, target: 85 },
      { week: 'W5', rate: 85, target: 85 },
    ],
    chart8: [
      { vendor: 'Vendor A', hours: 14 },
      { vendor: 'Vendor B', hours: 26 },
      { vendor: 'Vendor C', hours: 8 },
      { vendor: 'Vendor D', hours: 19 },
      { vendor: 'Vendor E', hours: 32 },
    ],
    chart9: [
      { id: 1, age: 3, resolved: 2 },
      { id: 2, age: 5, resolved: 4 },
      { id: 3, age: 10, resolved: 9 },
      { id: 4, age: 2, resolved: 2.5 },
      { id: 5, age: 8, resolved: 6 },
    ],
    chart10: [
      { name: 'Local Store A', score: 85, impact: 70 },
      { name: 'Supermarket B', score: 65, impact: 80 },
      { name: 'Online Delivery C', score: 90, impact: 95 },
      { name: 'Street Market D', score: 40, impact: 30 },
    ],
    chart11: [
      { month: 'Ramadan', score: 95 },
      { month: 'Durga Puja', score: 90 },
      { month: 'Eid', score: 98 },
      { month: 'Diwali', score: 85 },
      { month: 'New Year', score: 75 },
    ],
    chart12: [
      { name: 'Missed Payment', value: 35, fill: '#ef4444' },
      { name: 'No Order 30 Days', value: 50, fill: '#f97316' },
      { name: 'Bad Review', value: 15, fill: '#eab308' },
    ],
    chart13: [
      { rating: '5 Stars ⭐⭐⭐⭐⭐', count: 420 },
      { rating: '4 Stars ⭐⭐⭐⭐', count: 180 },
      { rating: '3 Stars ⭐⭐⭐', count: 60 },
      { rating: '1-2 Stars ⭐', count: 25 },
    ],
    chart14: [
      { platform: 'Insta Reels', ctr: 4.8 },
      { platform: 'FB Posts', ctr: 2.4 },
      { platform: 'WhatsApp BC', ctr: 8.5 },
      { platform: 'GMB Search', ctr: 3.9 },
    ],
    chart15: [
      { name: 'Operations', allocated: 50000, actual: 48000 },
      { name: 'Customer Exp', allocated: 25000, actual: 23500 },
      { name: 'Marketing', allocated: 15000, actual: 16200 },
      { name: 'Social Media', allocated: 8000, actual: 7500 },
      { name: 'Research', allocated: 5000, actual: 4800 },
    ]
  });

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isSystemRunning) {
      interval = setInterval(() => {
        setAgents(prevAgents => {
          let currentCeoTokens = 0;
          let currentHodTokens = 0;
          let currentEmpTokens = 0;

          const updatedAgents = prevAgents.map(agent => {
            let { completed = 0, pending = 0, failed = 0, tokensUsed = 0, status = 'Idle' } = agent.metrics || {};
            
            if (status === 'Idle' && Math.random() > 0.7) {
              status = 'Processing';
              pending += Math.floor(Math.random() * 5) + 1;
            } else if (status === 'Processing') {
              if (pending > 0) {
                const processed = Math.min(pending, Math.floor(Math.random() * 3) + 1);
                pending -= processed;
                
                if (Math.random() > 0.95) {
                  failed += 1;
                } else {
                  completed += processed;
                }
                
                const baseTokens = agent.id === 'ceo' ? 150 : (agent.id.startsWith('hod-') ? 80 : 40);
                tokensUsed += (processed * baseTokens * (Math.random() * 0.5 + 0.8)) / 1000;

                // Simulate incoming real data from chatsheet agent connector
                
                if (agent.id.startsWith('excel-')) {
                  setExcelData(prev => {
                    const row = Math.floor(Math.random() * 4) + 1;
                    const col = 2; // update 'Actual Q1'
                    const currentVal = parseInt(prev[`${row},${col}`] || '0');
                    const newVal = currentVal + Math.floor(Math.random() * 500) - 200; // random change
                    
                    const target = parseInt(prev[`${row},1`] || '0');
                    const variance = newVal - target;
                    
                    const newData = { 
                      ...prev, 
                      [`${row},${col}`]: newVal.toString(),
                      [`${row},3`]: variance.toString() 
                    };
                    
                    if (typeof window !== 'undefined') {
                      localStorage.setItem('xenon_excel_data', JSON.stringify(newData));
                    }
                    return newData;
                  });
                }

                if (agent.id.startsWith('chatsheet-')) {
                  setChatSheetStats(prev => {
                    const modifyArray = (arr: any[], numFields: string[]) => {
                       return arr.map((item: any) => {
                         const copy = { ...item };
                         numFields.forEach((f: string) => {
                           if(copy[f] != null && typeof copy[f] === 'number') {
                             const change = copy[f] * (Math.random() * 0.1 - 0.05); // +/- 5%
                             copy[f] = Math.max(0, Math.floor(copy[f] + change));
                           }
                         });
                         return copy;
                       });
                    };
                    return {
                      ...prev,
                      chart2: modifyArray(prev.chart2, ['active', 'conversion']),
                      chart3: modifyArray(prev.chart3, ['cost']),
                      chart5: modifyArray(prev.chart5, ['shortage']),
                      chart6: modifyArray(prev.chart6, ['active']),
                      chart7: modifyArray(prev.chart7, ['rate']),
                      chart8: modifyArray(prev.chart8, ['hours']),
                      chart9: modifyArray(prev.chart9, ['resolved']),
                      chart10: modifyArray(prev.chart10, ['score', 'impact']),
                      chart11: modifyArray(prev.chart11, ['score']),
                      chart13: modifyArray(prev.chart13, ['count']),
                      chart14: modifyArray(prev.chart14, ['ctr']),
                      chart15: modifyArray(prev.chart15, ['actual']),
                    };
                  });
                }
              }
              if (pending === 0 && Math.random() > 0.5) {
                status = 'Idle';
              }
            }
            
            tokensUsed = parseFloat(tokensUsed.toFixed(1));
            
            if (agent.id === 'ceo') currentCeoTokens += tokensUsed;
            else if (agent.id.startsWith('hod-')) currentHodTokens += tokensUsed;
            else currentEmpTokens += tokensUsed;
            
            return { ...agent, metrics: { completed, pending, failed, tokensUsed, status } };
          });

          setTimeSeriesData(prev => {
            const now = new Date();
            const newData = [...prev];
            if (newData.length > 10) newData.shift();
            newData.push({
               time: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
               ceo: parseFloat(currentCeoTokens.toFixed(1)),
               hod: parseFloat(currentHodTokens.toFixed(1)),
               emp: parseFloat(currentEmpTokens.toFixed(1))
            });
            return newData;
          });

          return updatedAgents;
        });
      }, 2000);
    }
    return () => clearInterval(interval);
  }, [isSystemRunning]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setNodes((currentNodes) => {
      const ceo = agents.find(a => a.id === 'ceo');
      const hods = agents.filter(a => a.id.startsWith('hod-'));
      const companyContent = companyDetails || 'No company details set.';
      const personaContent = ceo?.description || 'No description set.';

      const newNodes = [...currentNodes];
      
      const updateOrPush = (id: string, position: {x: number, y: number}, type: string, data: any) => {
        const index = newNodes.findIndex(n => n.id === id);
        if (index >= 0) {
          newNodes[index] = { ...newNodes[index], data: { ...newNodes[index].data, ...data } };
        } else {
          newNodes.push({ id, position, type, data });
        }
      };

      updateOrPush('ceo-node', { x: 500, y: 180 }, 'customNode', { 
        label: ceo?.name || 'CEO', 
        description: 'Strategic decision maker', 
        skillName: ceo?.skillName || '' 
      });
      updateOrPush('company-context', { x: 50, y: 80 }, 'contextNode', { title: 'Company Context', subtitle: 'Global Environment', content: companyContent, iconType: 'company' });
      updateOrPush('agent-description', { x: 50, y: 350 }, 'contextNode', { title: 'Agent Persona', subtitle: 'System Prompt', content: personaContent, iconType: 'persona' });

      hods.forEach((hod, index) => {
        updateOrPush(hod.id, { x: 900, y: 80 + (index * 200) }, 'customNode', { 
          label: hod.name,
          description: hod.description,
          skillName: hod.skillName
        });
      });

      const employees = agents.filter(a => a.id.startsWith('emp-'));
      employees.forEach((emp, index) => {
        updateOrPush(emp.id, { x: 1300, y: 80 + (index * 200) }, 'customNode', { 
          label: emp.name,
          description: emp.description,
          skillName: emp.skillName
        });
      });

      const excelAgents = agents.filter(a => a.id.startsWith('excel-'));
      excelAgents.forEach((excel, index) => {
        const parentId = excel.connectedParentId || 'ceo-node';
        const parentNode = newNodes.find(n => n.id === parentId);
        
        let parentX = 1700;
        let parentY = 80 + (index * 150);
        if (parentNode) {
          // Position Excel slightly above its connected node
          // Assuming CustomNode width is 280, ExcelNode width is 80 (w-20). Center it horizontally.
          parentX = parentNode.position.x + (280/2) - 80;
          parentY = parentNode.position.y - 120;
        }

        updateOrPush(excel.id, { x: parentX, y: parentY }, 'excelNode', { 
          label: excel.name,
          description: excel.description,
          skillName: excel.skillName
        });
      });

      const chatsheetAgents = agents.filter(a => a.id.startsWith('chatsheet-'));
      chatsheetAgents.forEach((sheet, index) => {
        const parentId = sheet.connectedParentId || 'ceo-node';
        const parentNode = newNodes.find(n => n.id === parentId);
        
        let parentX = 1700;
        let parentY = 80 + (index * 150) + 75;
        if (parentNode) {
          parentX = parentNode.position.x + (280/2) + 20;
          parentY = parentNode.position.y - 120;
        }

        updateOrPush(sheet.id, { x: parentX, y: parentY }, 'chatsheetNode', { 
          label: sheet.name,
          description: sheet.description,
          skillName: sheet.skillName
        });
      });

      return newNodes.filter(n => 
        ['ceo-node', 'company-context', 'agent-description'].includes(n.id) || 
        agents.some(a => a.id === n.id)
      );
    });

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setEdges((currentEdges) => {
      const newEdges: Edge[] = [
        { id: 'e-company-ceo', source: 'company-context', target: 'ceo-node', animated: true, type: 'smoothstep', style: { stroke: '#f97316', strokeWidth: 2 } },
        { id: 'e-persona-ceo', source: 'agent-description', target: 'ceo-node', animated: true, type: 'smoothstep', style: { stroke: '#3b82f6', strokeWidth: 2 } }
      ];

      agents.filter(a => a.id.startsWith('hod-')).forEach((hod) => {
         const sourceId = hod.connectedParentId === 'ceo-node' || !hod.connectedParentId ? 'ceo-node' : hod.connectedParentId;
         newEdges.push({
           id: `e-${sourceId}-${hod.id}`,
           source: sourceId,
           target: hod.id,
           animated: true,
           type: 'smoothstep',
           style: { stroke: '#8b5cf6', strokeWidth: 2 }
         });
      });

      const hods = agents.filter(a => a.id.startsWith('hod-'));
      agents.filter(a => a.id.startsWith('emp-')).forEach((emp, index) => {
         // Connect to an HOD if available (using connectedHodId or distribute them)
         if (hods.length > 0) {
           let targetHod = hods.find(h => h.id === emp.connectedHodId);
           if (!targetHod) {
             targetHod = hods[index % hods.length];
           }
           newEdges.push({
             id: `e-${targetHod.id}-${emp.id}`,
             source: targetHod.id,
             target: emp.id,
             animated: true,
             type: 'smoothstep',
             style: { stroke: '#10b981', strokeWidth: 2 }
           });
         }
      });

      agents.filter(a => a.id.startsWith('excel-')).forEach((excel) => {
         const targetId = excel.connectedParentId || 'ceo-node';
         newEdges.push({
           id: `e-${excel.id}-${targetId}`,
           source: excel.id,
           sourceHandle: 'bottom',
           target: targetId,
           targetHandle: 'top',
           animated: true,
           type: 'smoothstep',
           style: { stroke: '#107c41', strokeWidth: 2 }
         });
      });

      agents.filter(a => a.id.startsWith('chatsheet-')).forEach((sheet) => {
         const targetId = sheet.connectedParentId || 'ceo-node';
         newEdges.push({
           id: `e-${sheet.id}-${targetId}`,
           source: sheet.id,
           sourceHandle: 'bottom',
           target: targetId,
           targetHandle: 'top',
           animated: true,
           type: 'smoothstep',
           style: { stroke: '#0284c7', strokeWidth: 2 }
         });
      });

      return newEdges;
    });
  }, [companyDetails, agents]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setIsMounted(true);
      const storedData = localStorage.getItem('companyData');
      if (!storedData) {
        setShowForm(true);
      } else {
        try {
          const parsed = JSON.parse(storedData);
          if (parsed.name) setCompanyName(parsed.name);
          if (parsed.details) setCompanyDetails(parsed.details);
          if (parsed.apiConfig) setApiConfig(parsed.apiConfig);
          if (parsed.agents) {
             setAgents(prevAgents => {
                 const defaultCeo = prevAgents.find(a => a.id === 'ceo');
                 const storedCeo = parsed.agents.find((a: any) => a.id === 'ceo');
                 const mergedCeo = storedCeo ? { ...defaultCeo, ...storedCeo, skillAttached: defaultCeo?.skillAttached, skillName: defaultCeo?.skillName, skillFile: defaultCeo?.skillFile } : defaultCeo;
                 
                 const otherAgents = parsed.agents.filter((a: any) => a.id !== 'ceo').map((agent: any) => {
                   if (agent.id.startsWith('emp-')) {
                     return {
                       ...agent,
                       skillAttached: true,
                       skillName: 'shopkiper-employee-common-skill',
                       skillFile: 'lib/agents/employee-skill.ts'
                     };
                   }
                   return agent;
                 });
                 return mergedCeo ? [mergedCeo, ...otherAgents] : [...otherAgents];
             });
          }
          setInitialData(parsed);
        } catch(e) {}
      }
    }, 0);
    return () => clearTimeout(timeoutId);
  }, []);

  const handleCompanySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyName.trim() || !companyDetails.trim()) return;
    setStep(2);
  };

  const handleApiSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const isValid = apiConfig.every(config => config.key.trim() !== '');
    if (!isValid) return;

    const data = {
      name: companyName,
      details: companyDetails,
      apiConfig,
      agents
    };
    
    localStorage.setItem('companyData', JSON.stringify(data));
    setInitialData(data);
    setShowForm(false);
  };

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    const data = {
      name: companyName,
      details: companyDetails,
      apiConfig,
      agents
    };
    localStorage.setItem('companyData', JSON.stringify(data));
    setInitialData(data);
  };

  const updateApiConfig = (index: number, field: 'key' | 'model', value: string) => {
    const newConfig = [...apiConfig];
    newConfig[index][field] = value;
    setApiConfig(newConfig);
  };

  const handleCreateTask = async () => {
    if (!newTask.title.trim()) return;
    
    const task = {
      id: `task-${Date.now()}`,
      title: newTask.title,
      description: newTask.description,
      status: 'Pending',
      assignedTo: 'ceo', // Sent to CEO
      createdAt: new Date().toISOString()
    };
    
    try {
      await fetch('/api/tasks', { 
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(task) 
      });
      // Update locally optimistically
      setTasks([...tasks, { ...task, createdAt: new Date(task.createdAt) }]);
    } catch (error) {
      console.error(error);
    }
    
    setNewTask({ title: '', description: '' });
    setShowTaskForm(false);
  };

  const handleAddAgent = (type: string) => {
    let newAgent;
    if (type === 'hod') {
      newAgent = {
        id: `hod-${Date.now()}`,
        name: 'Head of Department',
        description: 'Manages specific departmental operations and reports to the CEO.',
        maxTokens: 4096,
        skillAttached: false,
        skillName: '',
        skillFile: '',
        metrics: { completed: 0, pending: 0, failed: 0, tokensUsed: 0, status: 'Idle' }
      };
    } else if (type === 'employee') {
      newAgent = {
        id: `emp-${Date.now()}`,
        name: 'Employee',
        description: 'Executes specific tasks within a department.',
        maxTokens: 2048,
        skillAttached: true,
        skillName: 'shopkiper-employee-common-skill',
        skillFile: 'lib/agents/employee-skill.ts',
        metrics: { completed: 0, pending: 0, failed: 0, tokensUsed: 0, status: 'Idle' }
      };
    } else if (type === 'excel') {
      newAgent = {
        id: `excel-${Date.now()}`,
        name: 'Excel Connector',
        description: 'Connects to a spreadsheet data source.',
        maxTokens: 1024,
        skillAttached: false,
        skillName: '',
        skillFile: '',
        metrics: { completed: 0, pending: 0, failed: 0, tokensUsed: 0, status: 'Idle' }
      };
    } else if (type === 'chatsheet') {
      newAgent = {
        id: `chatsheet-${Date.now()}`,
        name: 'Xenon Chat Sheet',
        description: 'Represents dynamic sheets with custom visualizations and real-time data.',
        maxTokens: 1024,
        skillAttached: false,
        skillName: '',
        skillFile: '',
        metrics: { completed: 0, pending: 0, failed: 0, tokensUsed: 0, status: 'Idle' }
      };
    }
    
    if (newAgent) {
      const newAgents = [...agents, newAgent];
      setAgents(newAgents);
      const data = { name: companyName, details: companyDetails, apiConfig, agents: newAgents };
      localStorage.setItem('companyData', JSON.stringify(data));
      setInitialData(data);
    }
  };

  const isCompanyChanged = !initialData || companyName !== initialData.name || companyDetails !== initialData.details;
  const isApiChanged = !initialData || JSON.stringify(apiConfig) !== JSON.stringify(initialData.apiConfig);
  const isAgentChanged = !initialData || JSON.stringify(agents) !== JSON.stringify(initialData.agents);

  const onNodesChange = (changes: NodeChange[]) => setNodes((nds) => applyNodeChanges(changes, nds));
  const onEdgesChange = (changes: EdgeChange[]) => setEdges((eds) => applyEdgeChanges(changes, eds));

  if (!isMounted) return <main className="min-h-screen bg-black overflow-hidden hidden md:block"></main>;

  return (
    <main className="min-h-screen bg-black overflow-hidden hidden md:block relative text-zinc-300">
      {showForm ? (
        <div className="absolute inset-0 flex items-center justify-center z-50 p-4">
          <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-xl w-full max-w-2xl shadow-2xl">
            {step === 1 ? (
              <>
                <h1 className="text-2xl font-medium text-white mb-6 tracking-tight">Company Profile</h1>
                <form onSubmit={handleCompanySubmit} className="space-y-4">
                  <div>
                    <label htmlFor="companyName" className="block text-sm font-medium text-zinc-400 mb-1">Company Name</label>
                    <input
                      id="companyName"
                      type="text"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-zinc-700 transition-all font-sans"
                      placeholder="Enter company name"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="companyDetails" className="block text-sm font-medium text-zinc-400 mb-1">Details & Goals</label>
                    <textarea
                      id="companyDetails"
                      value={companyDetails}
                      onChange={(e) => setCompanyDetails(e.target.value)}
                      rows={4}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-zinc-700 transition-all resize-none font-sans"
                      placeholder="What is the company working on? Targets, goals, etc."
                      required
                    />
                  </div>
                  <div className="pt-2">
                    <button
                      type="submit"
                      className="w-full bg-white text-black font-medium py-2.5 rounded-lg hover:bg-zinc-200 transition-colors"
                    >
                      Continue
                    </button>
                  </div>
                </form>
              </>
            ) : (
              <>
                <div className="flex items-center justify-between mb-6">
                  <h1 className="text-2xl font-medium text-white tracking-tight">API Configuration</h1>
                  <button 
                    onClick={() => setStep(1)}
                    className="text-sm text-zinc-400 hover:text-white transition-colors"
                  >
                    Back to Company Profile
                  </button>
                </div>
                <form onSubmit={handleApiSubmit} className="space-y-6">
                  <div className="space-y-4">
                    {apiConfig.map((config, index) => (
                      <div key={config.id} className="flex gap-4">
                        <div className="flex-1">
                          <label htmlFor={`apiKey-${index}`} className="block text-xs font-medium text-zinc-500 mb-1 uppercase tracking-wider">
                            API Key {index + 1}
                          </label>
                          <input
                            id={`apiKey-${index}`}
                            type="password"
                            value={config.key}
                            onChange={(e) => updateApiConfig(index, 'key', e.target.value)}
                            className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-zinc-700 transition-all font-mono text-sm"
                            placeholder="Enter Gemini API key"
                            required
                          />
                        </div>
                        <div className="w-1/3 min-w-[200px]">
                          <label htmlFor={`apiModel-${index}`} className="block text-xs font-medium text-zinc-500 mb-1 uppercase tracking-wider">
                            Model Selection
                          </label>
                          <div className="relative">
                            <select
                              id={`apiModel-${index}`}
                              value={config.model}
                              onChange={(e) => updateApiConfig(index, 'model', e.target.value)}
                              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-zinc-700 transition-all font-sans appearance-none pr-10 cursor-pointer"
                            >
                              {GEMINI_MODELS.map((model) => (
                                <option key={model} value={model}>{model}</option>
                              ))}
                            </select>
                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 pointer-events-none" />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="pt-4 border-t border-zinc-800">
                    <button
                      type="submit"
                      className="w-full bg-white text-black font-medium py-2.5 rounded-lg hover:bg-zinc-200 transition-colors"
                    >
                      Save Configuration
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      ) : (
        <div className="flex h-screen w-full bg-black">
          {/* Sidebar */}
          <aside className="w-64 border-r border-zinc-900 bg-zinc-950 flex flex-col">
            <div className="p-6">
              <h2 className="text-xl font-bold text-white tracking-wider uppercase">Xenon Engine</h2>
            </div>
            <nav className="flex-1 px-4 space-y-2 mt-4">
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === 'dashboard' ? 'bg-zinc-800 text-white' : 'text-zinc-500 hover:text-white hover:bg-zinc-900'
                }`}
              >
                <LayoutDashboard className="w-5 h-5" />
                Dashboard
              </button>
              <button
                onClick={() => setActiveTab('company')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === 'company' ? 'bg-zinc-800 text-white' : 'text-zinc-500 hover:text-white hover:bg-zinc-900'
                }`}
              >
                <Building2 className="w-5 h-5" />
                About Company
              </button>
              <button
                onClick={() => setActiveTab('tasks')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === 'tasks' ? 'bg-zinc-800 text-white' : 'text-zinc-500 hover:text-white hover:bg-zinc-900'
                }`}
              >
                <CheckSquare className="w-5 h-5" />
                Tasks
              </button>
              <button
                onClick={() => setActiveTab('api')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === 'api' ? 'bg-zinc-800 text-white' : 'text-zinc-500 hover:text-white hover:bg-zinc-900'
                }`}
              >
                <Key className="w-5 h-5" />
                API Keys
              </button>
              <button
                onClick={() => setActiveTab('agents')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === 'agents' ? 'bg-zinc-800 text-white' : 'text-zinc-500 hover:text-white hover:bg-zinc-900'
                }`}
              >
                <Bot className="w-5 h-5" />
                Agents
              </button>
              <button
                onClick={() => setActiveTab('workflows')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === 'workflows' ? 'bg-zinc-800 text-white' : 'text-zinc-500 hover:text-white hover:bg-zinc-900'
                }`}
              >
                <GitMerge className="w-5 h-5" />
                Workflows
              </button>
              <button
                onClick={() => setActiveTab('excel')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === 'excel' ? 'bg-zinc-800 text-white' : 'text-zinc-500 hover:text-white hover:bg-zinc-900'
                }`}
              >
                <Table className="w-5 h-5" />
                Xenon Excel
              </button>
              <button
                onClick={() => setActiveTab('chatsheet')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === 'chatsheet' ? 'bg-zinc-800 text-white' : 'text-zinc-500 hover:text-white hover:bg-zinc-900'
                }`}
              >
                <MessageSquare className="w-5 h-5" />
                Xenon Chat Sheet
              </button>
            </nav>
          </aside>

          {/* Main Content */}
          <section className="flex-1 p-10 overflow-y-auto">
            {activeTab === 'dashboard' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
                    <p className="text-zinc-400">System analytics and agent performance metrics.</p>
                  </div>
                  <button 
                    onClick={() => setIsSystemRunning(!isSystemRunning)}
                    className={`px-6 py-2.5 rounded-lg font-medium flex items-center gap-2 transition-colors ${isSystemRunning ? 'bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20' : 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/20'}`}
                  >
                    <Activity className={`w-4 h-4 ${isSystemRunning ? 'animate-pulse' : ''}`} />
                    {isSystemRunning ? 'Stop Simulation' : 'Start Simulation'}
                  </button>
                </div>
                
                {/* Key Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  {/* Active Agents */}
                  <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 flex flex-col justify-between">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-zinc-400 font-medium">Active Agents</span>
                      <Activity className="w-5 h-5 text-blue-400" />
                    </div>
                    <div>
                      <h3 className="text-3xl font-bold text-white">{agents.length}</h3>
                      <p className="text-xs text-zinc-500 mt-2">Currently configured in cluster</p>
                    </div>
                  </div>

                  {/* Tasks Processing */}
                  <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 flex flex-col justify-between">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-zinc-400 font-medium">Tasks Completed</span>
                      <Target className="w-5 h-5 text-emerald-400" />
                    </div>
                    <div>
                      <h3 className="text-3xl font-bold text-white">{agents.reduce((acc, agent) => acc + (agent.metrics?.completed || 0), 0)}</h3>
                      <p className="text-xs text-zinc-500 mt-2">Across all running agents</p>
                    </div>
                  </div>

                  {/* Error Rate */}
                  <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 flex flex-col justify-between">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-zinc-400 font-medium">System Errors</span>
                      <AlertTriangle className="w-5 h-5 text-red-400" />
                    </div>
                    <div>
                      <h3 className="text-3xl font-bold text-white">{agents.reduce((acc, agent) => acc + (agent.metrics?.failed || 0), 0)}</h3>
                      <p className="text-xs text-zinc-500 mt-2">Requires immediate attention</p>
                    </div>
                  </div>

                  {/* Tokens Used */}
                  <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 flex flex-col justify-between">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-zinc-400 font-medium">Tokens Used</span>
                      <Coins className="w-5 h-5 text-amber-400" />
                    </div>
                    <div>
                      <h3 className="text-3xl font-bold text-white">{agents.reduce((acc, agent) => acc + (agent.metrics?.tokensUsed || 0), 0).toFixed(1)}k</h3>
                      <p className="text-xs text-zinc-500 mt-2">Across all models</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
                  {/* Token Usage Chart */}
                  <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
                    <h2 className="text-lg font-semibold text-white mb-6">Token Usage (Real-time)</h2>
                    <div className="h-72">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={timeSeriesData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                          <XAxis dataKey="time" stroke="#a1a1aa" fontSize={12} tickLine={false} axisLine={false} />
                          <YAxis stroke="#a1a1aa" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}k`} />
                          <RechartsTooltip 
                            contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', color: '#e4e4e7', borderRadius: '8px' }}
                            itemStyle={{ color: '#e4e4e7' }}
                          />
                          <Legend />
                          <Line type="monotone" dataKey="ceo" name="CEO" stroke="#f97316" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                          <Line type="monotone" dataKey="hod" name="HODs" stroke="#3b82f6" strokeWidth={2} dot={{ r: 4 }} />
                          <Line type="monotone" dataKey="emp" name="Employees" stroke="#10b981" strokeWidth={2} dot={{ r: 4 }} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Task Distribution Bar Chart */}
                  <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
                    <h2 className="text-lg font-semibold text-white mb-6">Task Load by Agent</h2>
                    <div className="h-72">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={agents.map(a => ({
                          name: a.name.substring(0, 10) + (a.name.length > 10 ? '...' : ''),
                          completed: a.metrics?.completed || 0,
                          failed: a.metrics?.failed || 0,
                          pending: a.metrics?.pending || 0,
                        }))}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                          <XAxis dataKey="name" stroke="#a1a1aa" fontSize={12} tickLine={false} axisLine={false} />
                          <YAxis stroke="#a1a1aa" fontSize={12} tickLine={false} axisLine={false} />
                          <RechartsTooltip 
                            contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', color: '#e4e4e7', borderRadius: '8px' }}
                            cursor={{ fill: '#27272a' }}
                          />
                          <Legend />
                          <Bar dataKey="completed" name="Completed" stackId="a" fill="#10b981" radius={[0, 0, 4, 4]} />
                          <Bar dataKey="pending" name="In Progress" stackId="a" fill="#3b82f6" />
                          <Bar dataKey="failed" name="Failed" stackId="a" fill="#ef4444" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>

                <div className="mt-6 bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
                  <div className="px-6 py-5 border-b border-zinc-800 flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-white">Agent Real-time Status</h2>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-zinc-950/50">
                          <th className="px-6 py-3 text-xs font-semibold text-zinc-400 uppercase tracking-wider">Agent</th>
                          <th className="px-6 py-3 text-xs font-semibold text-zinc-400 uppercase tracking-wider">Role</th>
                          <th className="px-6 py-3 text-xs font-semibold text-zinc-400 uppercase tracking-wider">Current Status</th>
                          <th className="px-6 py-3 text-xs font-semibold text-zinc-400 uppercase tracking-wider">Tasks</th>
                          <th className="px-6 py-3 text-xs font-semibold text-zinc-400 uppercase tracking-wider">Tokens Used</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-zinc-800">
                        {agents.map((agent, i) => (
                          <tr key={agent.id} className="hover:bg-zinc-800/20 transition-colors">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center gap-3">
                                <div className={`w-2 h-2 rounded-full ${agent.metrics?.status === 'Processing' ? 'bg-emerald-400 animate-pulse' : agent.metrics?.status === 'Error' ? 'bg-red-400' : 'bg-amber-400'}`} />
                                <span className="font-medium text-zinc-200">{agent.name}</span>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-zinc-400">
                              {agent.id === 'ceo' ? 'CEO' : agent.id.startsWith('hod-') ? 'Department Head' : 'Employee Task Agent'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {agent.metrics?.status === 'Idle' ? (
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-400/10 text-amber-400 border border-amber-400/20">
                                  Idle
                                </span>
                              ) : agent.metrics?.status === 'Error' ? (
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-400/10 text-red-400 border border-red-400/20">
                                  <AlertTriangle className="w-3 h-3" /> Error
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-400/10 text-emerald-400 border border-emerald-400/20">
                                  <Activity className="w-3 h-3" /> Processing...
                                </span>
                              )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-zinc-300 font-mono">
                              {agent.metrics?.completed || 0} / {(agent.metrics?.completed || 0) + (agent.metrics?.pending || 0)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-zinc-300 font-mono text-sm">
                              {agent.metrics?.tokensUsed || 0}k
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
            {activeTab === 'agents' && (
              <div className="h-full flex flex-col">
                {!editingAgentId ? (
                  <div>
                    <div className="flex items-center justify-between mb-8">
                      <h1 className="text-3xl font-bold text-white">Agents</h1>
                      <div className="relative group">
                         <button className="flex items-center gap-2 bg-zinc-800 hover:bg-zinc-700 text-white px-4 py-2 rounded-lg font-medium transition-colors border border-zinc-700">
                           <Plus className="w-4 h-4" />
                           Add
                         </button>
                         <div className="absolute right-0 mt-2 w-48 bg-zinc-900 border border-zinc-800 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-20 overflow-hidden">
                           <button 
                             onClick={() => handleAddAgent('hod')} 
                             className="w-full text-left px-4 py-3 text-sm text-zinc-300 hover:text-white hover:bg-zinc-800 transition-colors flex items-center gap-2 border-b border-zinc-800/50"
                           >
                             <Bot className="w-4 h-4 text-emerald-400" />
                             HOD Agent
                           </button>
                           <button 
                             onClick={() => handleAddAgent('employee')} 
                             className="w-full text-left px-4 py-3 text-sm text-zinc-300 hover:text-white hover:bg-zinc-800 transition-colors flex items-center gap-2 border-b border-zinc-800/50"
                           >
                             <Bot className="w-4 h-4 text-indigo-400" />
                             Employee Agent
                           </button>
                           <button 
                             onClick={() => handleAddAgent('excel')} 
                             className="w-full text-left px-4 py-3 text-sm text-zinc-300 hover:text-white hover:bg-zinc-800 transition-colors flex items-center gap-2 border-b border-zinc-800/50"
                           >
                             <Table className="w-4 h-4 text-amber-400" />
                             Excel Connector
                           </button>
                           <button 
                             onClick={() => handleAddAgent('chatsheet')} 
                             className="w-full text-left px-4 py-3 text-sm text-zinc-300 hover:text-white hover:bg-zinc-800 transition-colors flex items-center gap-2"
                           >
                             <MessageSquare className="w-4 h-4 text-sky-400" />
                             Xenon Chat Sheet
                           </button>
                         </div>
                      </div>
                    </div>
                    <div className="space-y-6">
                      {agents.some(a => a.id === 'ceo') && (
                        <div>
                          <h3 className="text-sm font-semibold text-zinc-400 mb-3 uppercase tracking-wider">CEO</h3>
                          <div className="flex flex-wrap gap-4">
                            {agents.filter(agent => agent.id === 'ceo').map(agent => (
                              <div 
                                key={agent.id}
                                onClick={() => setEditingAgentId(agent.id)}
                                className="w-48 bg-zinc-900 border border-zinc-700/50 rounded-xl p-3 flex items-center gap-3 hover:bg-zinc-800 hover:border-zinc-500 transition-all cursor-pointer group shadow-sm ring-1 ring-amber-500/20"
                              >
                                <div className="bg-amber-500/10 p-2 rounded-lg group-hover:bg-amber-500/20 transition-colors">
                                  <Bot className="w-5 h-5 text-amber-500" />
                                </div>
                                <div>
                                  <span className="text-zinc-200 font-medium text-sm block">{agent.name}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {agents.some(a => a.id.startsWith('hod-')) && (
                        <div>
                          <h3 className="text-sm font-semibold text-zinc-400 mb-3 uppercase tracking-wider">HOD Agents</h3>
                          <div className="flex flex-wrap gap-4">
                            {agents.filter(agent => agent.id.startsWith('hod-')).map(agent => (
                              <div 
                                key={agent.id}
                                onClick={() => setEditingAgentId(agent.id)}
                                className="w-48 bg-zinc-900 border border-zinc-700/50 rounded-xl p-3 flex items-center gap-3 hover:bg-zinc-800 hover:border-zinc-500 transition-all cursor-pointer group shadow-sm"
                              >
                                <div className="bg-zinc-800 p-2 rounded-lg group-hover:bg-zinc-700 transition-colors">
                                  <Bot className="w-5 h-5 text-zinc-400 group-hover:text-white" />
                                </div>
                                <div>
                                  <span className="text-zinc-200 font-medium text-sm block">{agent.name}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {agents.some(a => a.id.startsWith('emp-')) && (
                        <div>
                          <h3 className="text-sm font-semibold text-zinc-400 mb-3 uppercase tracking-wider">Employee Task Agents</h3>
                          <div className="flex flex-wrap gap-4">
                            {agents.filter(agent => agent.id.startsWith('emp-')).map(agent => (
                              <div 
                                key={agent.id}
                                onClick={() => setEditingAgentId(agent.id)}
                                className="w-48 bg-zinc-900 border border-zinc-700/50 rounded-xl p-3 flex items-center gap-3 hover:bg-zinc-800 hover:border-zinc-500 transition-all cursor-pointer group shadow-sm"
                              >
                                <div className="bg-zinc-800 p-2 rounded-lg group-hover:bg-zinc-700 transition-colors">
                                  <Bot className="w-5 h-5 text-zinc-400 group-hover:text-white" />
                                </div>
                                <div>
                                  <span className="text-zinc-200 font-medium text-sm block">{agent.name}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {agents.some(a => a.id.startsWith('excel-') || a.id.startsWith('chatsheet-')) && (
                        <div>
                          <h3 className="text-sm font-semibold text-zinc-400 mb-3 uppercase tracking-wider">Connecters</h3>
                          <div className="flex flex-wrap gap-4">
                            {agents.filter(agent => agent.id.startsWith('excel-') || agent.id.startsWith('chatsheet-')).map(agent => (
                              <div 
                                key={agent.id}
                                onClick={() => setEditingAgentId(agent.id)}
                                className={
                                  agent.id.startsWith('chatsheet-')
                                  ? "w-24 h-24 bg-sky-500/10 border-2 border-sky-500/50 rounded-full flex flex-col items-center justify-center gap-2 hover:bg-sky-500/20 hover:border-sky-500 transition-all cursor-pointer group shadow-sm animate-fade-in"
                                  : "w-24 h-24 bg-[#107c41]/10 border-2 border-[#107c41]/50 rounded-full flex flex-col items-center justify-center gap-2 hover:bg-[#107c41]/20 hover:border-[#107c41] transition-all cursor-pointer group shadow-sm"
                                }
                              >
                                {agent.id.startsWith('chatsheet-') ? (
                                  <>
                                    <MessageSquare className="w-6 h-6 text-sky-400" />
                                    <span className="text-sky-400 font-medium text-[10px] text-center px-1 block leading-tight truncate max-w-[80px]">{agent.name}</span>
                                  </>
                                ) : (
                                  <>
                                    <Table className="w-6 h-6 text-[#107c41]" />
                                    <span className="text-[#107c41] font-medium text-[10px] text-center px-2 block leading-tight">{agent.name}</span>
                                  </>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div>
                    {(() => {
                      const agent = agents.find(a => a.id === editingAgentId);
                      if (!agent) return null;
                      return (
                        <div className="max-w-2xl">
                          <div className="flex items-center gap-4 mb-8">
                            <button 
                              onClick={() => setEditingAgentId(null)}
                              className="w-10 h-10 bg-zinc-900 border border-zinc-800 rounded-lg flex items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
                            >
                              <ArrowLeft className="w-5 h-5" />
                            </button>
                            <h1 className="text-3xl font-bold text-white">
                              {(agent.id.startsWith('excel-') || agent.id.startsWith('chatsheet-')) ? 'Configure Connector' : 'Configure Agent'}
                            </h1>
                          </div>
                          <form 
                            onSubmit={(e) => {
                              e.preventDefault();
                              const data = { name: companyName, details: companyDetails, apiConfig, agents };
                              localStorage.setItem('companyData', JSON.stringify(data));
                              setInitialData(data);
                              setEditingAgentId(null);
                            }} 
                            className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-8 space-y-6"
                          >
                            <div>
                              <label className="block text-sm font-medium text-zinc-400 mb-2 uppercase tracking-wider">Agent Name</label>
                              <input 
                                type="text" 
                                value={agent.name}
                                onChange={(e) => {
                                  setAgents(agents.map(a => a.id === agent.id ? { ...a, name: e.target.value } : a));
                                }}
                                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-zinc-700 transition-all font-sans"
                                required 
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-zinc-400 mb-2 uppercase tracking-wider">Agent Description</label>
                              <textarea 
                                value={agent.description || ''}
                                onChange={(e) => {
                                  setAgents(agents.map(a => a.id === agent.id ? { ...a, description: e.target.value } : a));
                                }}
                                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-zinc-700 transition-all font-sans resize-none"
                                rows={4}
                                required 
                              />
                            </div>
                            {agent.id.startsWith('hod-') && (
                              <div>
                                <label className="block text-sm font-medium text-zinc-400 mb-2 uppercase tracking-wider">Connect to</label>
                                <div className="relative">
                                  <select 
                                    value={agent.connectedParentId || 'ceo-node'}
                                    onChange={(e) => {
                                      setAgents(agents.map(a => a.id === agent.id ? { ...a, connectedParentId: e.target.value } : a));
                                    }}
                                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-zinc-700 transition-all font-sans appearance-none cursor-pointer"
                                  >
                                    <option value="ceo-node">CEO</option>
                                    {agents.filter(a => a.id.startsWith('hod-') && a.id !== agent.id).map(hod => (
                                      <option key={hod.id} value={hod.id}>{hod.name}</option>
                                    ))}
                                  </select>
                                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 pointer-events-none" />
                                </div>
                              </div>
                            )}
                            {agent.id.startsWith('emp-') && (
                              <div>
                                <label className="block text-sm font-medium text-zinc-400 mb-2 uppercase tracking-wider">Connect to HOD</label>
                                <div className="relative">
                                  <select 
                                    value={agent.connectedHodId || ''}
                                    onChange={(e) => {
                                      setAgents(agents.map(a => a.id === agent.id ? { ...a, connectedHodId: e.target.value } : a));
                                    }}
                                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-zinc-700 transition-all font-sans appearance-none cursor-pointer"
                                  >
                                    <option value="" disabled hidden>Select an HOD</option>
                                    {agents.filter(a => a.id.startsWith('hod-')).map(hod => (
                                      <option key={hod.id} value={hod.id}>{hod.name}</option>
                                    ))}
                                  </select>
                                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 pointer-events-none" />
                                </div>
                              </div>
                            )}
                            {(agent.id.startsWith('excel-') || agent.id.startsWith('chatsheet-')) && (
                              <div>
                                <label className="block text-sm font-medium text-zinc-400 mb-2 uppercase tracking-wider">Connect to Agent</label>
                                <div className="relative">
                                  <select 
                                    value={agent.connectedParentId || 'ceo-node'}
                                    onChange={(e) => {
                                      setAgents(agents.map(a => a.id === agent.id ? { ...a, connectedParentId: e.target.value } : a));
                                    }}
                                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-zinc-700 transition-all font-sans appearance-none cursor-pointer"
                                  >
                                    <option value="ceo-node">CEO</option>
                                    {agents.filter(a => a.id !== agent.id && !a.id.startsWith('excel-') && !a.id.startsWith('chatsheet-')).map(acc => (
                                      <option key={acc.id} value={acc.id}>{acc.name}</option>
                                    ))}
                                  </select>
                                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 pointer-events-none" />
                                </div>
                              </div>
                            )}
                            <div>
                              <div className="flex items-center justify-between mb-2">
                                <label className="block text-sm font-medium text-zinc-400 uppercase tracking-wider">Max Tokens</label>
                                <span className="text-sm font-mono text-zinc-300 bg-zinc-900 border border-zinc-700 px-3 py-1 rounded-md">{agent.maxTokens || 0}</span>
                              </div>
                              <input 
                                type="range" 
                                min="1"
                                max="8192"
                                step="1"
                                value={agent.maxTokens || 0}
                                onChange={(e) => {
                                  setAgents(agents.map(a => a.id === agent.id ? { ...a, maxTokens: parseInt(e.target.value) || 0 } : a));
                                }}
                                className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
                              />
                            </div>
                            <div className="bg-zinc-950 border border-zinc-800/80 rounded-lg p-5">
                              <h3 className="text-xs font-semibold text-zinc-400 mb-4 uppercase tracking-wider">Attached Skills</h3>
                              {agent.skillAttached ? (
                                <div className="flex flex-col gap-3">
                                  <div className="flex items-center justify-between bg-zinc-900 border border-zinc-700/50 rounded-lg p-3">
                                    <div className="flex items-center gap-3">
                                      <div className="bg-zinc-800 p-2 rounded-md">
                                        <FileText className="w-4 h-4 text-emerald-400" />
                                      </div>
                                      <div>
                                        <span className="text-zinc-200 text-sm font-medium block">{agent.skillName}</span>
                                        <span className="text-zinc-500 text-xs font-mono">{agent.skillFile}</span>
                                      </div>
                                    </div>
                                    <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                                  </div>
                                  <button
                                     onClick={() => setAgents(agents.map(a => a.id === agent.id ? { ...a, skillAttached: false, skillName: '', skillFile: '' } : a))}
                                     className="text-xs text-red-500 hover:text-red-400 self-end transition-colors"
                                  >
                                    Disconnect Skill
                                  </button>
                                </div>
                              ) : (
                                agent.id.startsWith('hod-') ? (
                                   <div className="flex flex-col gap-3">
                                      <select 
                                         className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-300 focus:outline-none focus:border-zinc-700"
                                         value={selectedSkillForAgent[agent.id] || ''}
                                         onChange={(e) => setSelectedSkillForAgent({ ...selectedSkillForAgent, [agent.id]: e.target.value })}
                                      >
                                        <option value="">Select a skill to attach...</option>
                                        {AVAILABLE_HOD_SKILLS.map(skill => (
                                           <option key={skill.id} value={skill.id}>{skill.name}</option>
                                        ))}
                                      </select>
                                      <button 
                                         disabled={!selectedSkillForAgent[agent.id]}
                                         onClick={() => {
                                            const selectedSkill = AVAILABLE_HOD_SKILLS.find(s => s.id === selectedSkillForAgent[agent.id]);
                                            if (selectedSkill) {
                                               setAgents(agents.map(a => a.id === agent.id ? { ...a, skillAttached: true, skillName: selectedSkill.name, skillFile: selectedSkill.file } : a));
                                            }
                                         }}
                                         className="w-full py-2 bg-zinc-800 hover:bg-zinc-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-medium rounded-lg transition-colors border border-zinc-700">
                                         Connect Skill
                                      </button>
                                   </div>
                                ) : (
                                  <div className="text-zinc-500 text-sm italic">No skills attached.</div>
                                )
                              )}
                            </div>
                            
                            {(() => {
                               if (agent.id.startsWith('excel-') || agent.id.startsWith('chatsheet-')) return null;
                               let apiLabel = 'API Key 1';
                               let modelVal = apiConfig[0]?.model;
                               if (agent.id.startsWith('hod-')) {
                                   apiLabel = 'API Key 2';
                                   modelVal = apiConfig[1]?.model;
                               } else if (agent.id.startsWith('emp-')) {
                                   const emps = agents.filter(a => a.id.startsWith('emp-'));
                                   const idx = emps.findIndex(a => a.id === agent.id);
                                   const half = Math.ceil(emps.length / 2);
                                   if (idx < half) {
                                       apiLabel = 'API Key 3';
                                       modelVal = apiConfig[2]?.model;
                                   } else {
                                       apiLabel = 'API Key 4';
                                       modelVal = apiConfig[3]?.model;
                                   }
                               }
                               return (
                                 <div className="bg-zinc-950 border border-zinc-800/80 rounded-lg p-5">
                                   <h3 className="text-xs font-semibold text-zinc-400 mb-4 uppercase tracking-wider">Connection Details</h3>
                                   <div className="flex gap-4 items-center">
                                     <div className="flex-1">
                                       <span className="text-[10px] text-zinc-500 uppercase tracking-widest block mb-1">Assigned API</span>
                                       <span className="text-zinc-300 text-sm font-medium">{apiLabel}</span>
                                     </div>
                                     <div className="w-1/3">
                                       <span className="text-[10px] text-zinc-500 uppercase tracking-widest block mb-1">Model</span>
                                       <span className="text-zinc-300 text-sm font-mono">{modelVal || 'N/A'}</span>
                                     </div>
                                   </div>
                                 </div>
                               );
                            })()}
                            <div className="pt-4 mt-6 border-t border-zinc-800/50 flex justify-between items-center">
                              {agent.id !== 'ceo' ? (
                                confirmDeleteId === agent.id ? (
                                  <div className="flex items-center gap-2">
                                    <span className="text-sm text-zinc-400">Are you sure?</span>
                                    <button 
                                      type="button" 
                                      onClick={() => {
                                        const newAgents = agents.filter(a => a.id !== agent.id);
                                        setAgents(newAgents);
                                        const data = { name: companyName, details: companyDetails, apiConfig, agents: newAgents };
                                        localStorage.setItem('companyData', JSON.stringify(data));
                                        setInitialData(data);
                                        setEditingAgentId(null);
                                        setConfirmDeleteId(null);
                                      }}
                                      className="text-white bg-red-600 hover:bg-red-700 text-sm font-medium px-3 py-1.5 rounded-lg transition-colors"
                                    >
                                      Yes, Delete
                                    </button>
                                    <button 
                                      type="button" 
                                      onClick={() => setConfirmDeleteId(null)}
                                      className="text-zinc-300 hover:text-white text-sm font-medium px-3 py-1.5 hover:bg-zinc-800 rounded-lg transition-colors"
                                    >
                                      Cancel
                                    </button>
                                  </div>
                                ) : (
                                  <button 
                                    type="button" 
                                    onClick={() => setConfirmDeleteId(agent.id)}
                                    className="text-red-400 hover:text-red-300 text-sm font-medium px-4 py-2 hover:bg-red-950/30 rounded-lg transition-colors flex items-center gap-2"
                                  >
                                    Delete Agent
                                  </button>
                                )
                              ) : <div></div>}
                              {isAgentChanged && (
                                <button type="submit" className="flex items-center gap-2 bg-white text-black font-medium px-6 py-2.5 rounded-lg hover:bg-zinc-200 transition-colors">
                                  <Save className="w-4 h-4" />
                                  Save Agent
                                </button>
                              )}
                            </div>
                          </form>
                        </div>
                      );
                    })()}
                  </div>
                )}
              </div>
            )}
            {activeTab === 'workflows' && (
              <div className="h-full flex flex-col">
                <h1 className="text-3xl font-bold text-white mb-8">Workflows</h1>
                <div className="flex-1 bg-[#121212] border border-zinc-800 rounded-xl relative overflow-hidden flex items-center justify-center">
                  <ReactFlow
                    nodes={nodes}
                    edges={edges}
                    onNodesChange={onNodesChange}
                    onEdgesChange={onEdgesChange}
                    nodeTypes={nodeTypes}
                    fitView
                    colorMode="dark"
                    proOptions={{ hideAttribution: true }}
                    minZoom={0.2}
                    maxZoom={4}
                  >
                    <Background color="#333" gap={20} size={1} />
                    <Controls className="!bg-zinc-900 !border-zinc-800 !fill-zinc-400" />
                  </ReactFlow>
                </div>
              </div>
            )}
            {activeTab === 'excel' && (
              <div className="h-full flex flex-col">
                <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
                  <Table className="w-8 h-8 text-amber-500" /> Xenon Excel
                </h1>
                <p className="text-zinc-400 mb-8">Connect external spreadsheet data to your agent network.</p>
                
                <div className="flex-1 bg-white border border-zinc-800 rounded-t-sm rounded-b-xl overflow-hidden flex flex-col font-sans">
                  {/* Excel Toolbar */}
                  <div className="bg-[#107c41] px-4 py-2 flex items-center gap-4 border-b border-[#0b5c30]">
                    <div className="flex items-center gap-4 text-white">
                      <span className="font-semibold text-sm">Book1 - Excel</span>
                    </div>
                  </div>
                  <div className="bg-zinc-100 px-2 py-1 flex items-center gap-1 border-b border-zinc-300 text-xs text-zinc-700">
                    <button className="px-3 py-1 hover:bg-zinc-200 rounded">File</button>
                    <button className="px-3 py-1 bg-white shadow-sm rounded font-medium text-[#107c41]">Home</button>
                    <button className="px-3 py-1 hover:bg-zinc-200 rounded">Insert</button>
                    <button className="px-3 py-1 hover:bg-zinc-200 rounded">Data</button>
                    <button className="px-3 py-1 hover:bg-zinc-200 rounded">Review</button>
                  </div>
                  <div className="bg-zinc-100 flex items-center gap-2 border-b border-zinc-300 px-3 py-1 shadow-sm">
                    <div className="w-16 h-6 bg-white border border-zinc-300 flex items-center justify-center text-xs text-zinc-600 font-mono shadow-inner">
                      B2
                    </div>
                    <div className="flex-1 h-6 bg-white border border-zinc-300 flex items-center px-2 text-xs text-zinc-800 font-mono shadow-inner">
                      <div className="w-4 h-full flex items-center justify-center text-[#107c41] font-bold border-r border-zinc-200 mr-2 italic">fx</div>
                    </div>
                  </div>

                  {/* Excel Grid */}
                  <div className="flex-1 overflow-auto bg-white flex">
                    <table className="w-full text-left border-collapse whitespace-nowrap min-w-max select-none">
                      <thead>
                        <tr>
                          <th className="sticky top-0 left-0 z-20 w-10 bg-zinc-100 border border-zinc-300"></th>
                          {['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'].map((col) => (
                            <th key={col} className="sticky top-0 z-10 min-w-[100px] w-[100px] bg-zinc-100 border border-zinc-300 text-center text-xs font-normal text-zinc-600 cursor-col-resize hover:bg-zinc-200 py-1">
                              {col}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {Array.from({ length: 30 }).map((_, rowIndex) => (
                          <tr key={rowIndex}>
                            <td className="sticky left-0 z-10 w-10 bg-zinc-100 border border-zinc-300 text-center text-xs font-normal text-zinc-600 cursor-row-resize hover:bg-zinc-200">
                              {rowIndex + 1}
                            </td>
                            {Array.from({ length: 10 }).map((_, colIndex) => (
                              <td 
                                key={colIndex} 
                                className={`border border-zinc-200 text-sm text-zinc-800 p-0 m-0 w-[100px] min-w-[100px] relative overflow-hidden ${rowIndex === 1 && colIndex === 1 ? 'border-2 border-[#107c41] z-0' : ''}`}
                              >
                                <input 
                                  type="text" 
                                  className="w-full h-full border-none outline-none px-1 py-1 bg-transparent hover:cursor-cell focus:bg-white"
                                  value={excelData[`${rowIndex},${colIndex}`] || ''}
                                  onChange={(e) => handleExcelCellChange(rowIndex, colIndex, e.target.value)}
                                />
                                {rowIndex === 1 && colIndex === 1 && (
                                  <div className="absolute right-[-3px] bottom-[-3px] w-2 h-2 bg-[#107c41] cursor-crosshair border border-white"></div>
                                )}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  
                  {/* Excel Footer */}
                  <div className="bg-zinc-100 px-4 py-1 flex items-center justify-between border-t border-zinc-300 text-xs text-zinc-600">
                    <div className="flex gap-4">
                      <span className="font-medium text-[#107c41] bg-white px-3 py-1 shadow-sm border border-zinc-200 rounded-sm inline-block">Sheet1</span>
                      <span className="hover:bg-zinc-200 px-3 py-1 cursor-pointer rounded-sm inline-block">+</span>
                    </div>
                    <div>
                      Ready
                    </div>
                  </div>
                </div>
              </div>
            )}
            {activeTab === 'chatsheet' && (
              <div className="space-y-6">
                <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 mb-4">
                  <div>
                    <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
                      <MessageSquare className="w-8 h-8 text-sky-500" /> Xenon Chat Sheet
                    </h1>
                    <p className="text-zinc-400">Interact with real-time multi-departmental business datasets across 15 interactive charts.</p>
                  </div>
                  {/* Category filter pills */}
                  <div className="flex flex-wrap gap-2 bg-zinc-950 border border-zinc-800 p-1.5 rounded-xl shrink-0">
                    {(['all', 'marketing', 'operations', 'finance', 'research', 'social'] as const).map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setChatsheetCategory(cat)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${
                          chatsheetCategory === cat
                            ? 'bg-sky-500 text-white shadow-md shadow-sky-500/10'
                            : 'text-zinc-400 hover:text-white hover:bg-zinc-950'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Grid container */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {/* CHART 1: WhatsApp Broadcast Conversion */}
                  {(chatsheetCategory === 'all' || chatsheetCategory === 'marketing') && (
                    <div id="chart-card-1" className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-5 hover:border-zinc-700/80 transition-all flex flex-col h-[380px] shadow-sm animate-fade-in animate-duration-300">
                      <div className="mb-4">
                        <span className="text-[10px] text-sky-400 uppercase tracking-widest font-mono font-bold">Marketing — Chart 1/15</span>
                        <h3 className="font-semibold text-white text-base mt-0.5">WhatsApp Broadcast Conversion</h3>
                        <p className="text-xs text-zinc-400">Total conversion rate based on different messaging funnels in Park Circus.</p>
                      </div>
                      <div className="flex-1 min-h-0 w-full flex items-center justify-center">
                        <ResponsiveContainer width="100%" height={240}>
                          <PieChart>
                            <Pie
                              data={chatSheetStats.chart1}
                              cx="50%"
                              cy="50%"
                              innerRadius={55}
                              outerRadius={75}
                              paddingAngle={4}
                              dataKey="value"
                            >
                              {[
                                { name: 'WhatsApp', value: 45, color: '#10b981' },
                                { name: 'Viber', value: 15, color: '#8b5cf6' },
                                { name: 'Direct Link', value: 25, color: '#3b82f6' },
                                { name: 'Social Post', value: 15, color: '#f59e0b' },
                              ].map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                              ))}
                            </Pie>
                            <RechartsTooltip contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', borderRadius: '8px' }} />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                      <div className="flex justify-center gap-4 text-[10px] text-zinc-400 mt-2 flex-wrap">
                        {[
                          { name: 'WhatsApp', value: 45, color: '#10b981' },
                          { name: 'Viber', value: 15, color: '#8b5cf6' },
                          { name: 'Direct Link', value: 25, color: '#3b82f6' },
                          { name: 'Social Post', value: 15, color: '#f59e0b' },
                        ].map((d, i) => (
                          <div key={i} className="flex items-center gap-1.5">
                            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: d.color }} />
                            <span>{d.name} ({d.value}%)</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* CHART 2: SMS Campaign Outreach & Conversion */}
                  {(chatsheetCategory === 'all' || chatsheetCategory === 'marketing') && (
                    <div id="chart-card-2" className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-5 hover:border-zinc-700/80 transition-all flex flex-col h-[380px] shadow-sm animate-fade-in animate-duration-300">
                      <div className="mb-4">
                        <span className="text-[10px] text-sky-400 uppercase tracking-widest font-mono font-bold">Marketing — Chart 2/15</span>
                        <h3 className="font-semibold text-white text-base mt-0.5">Outreach SMS Conversions</h3>
                        <p className="text-xs text-zinc-400">Outreach volume vs conversions generated by campaign blasts.</p>
                      </div>
                      <div className="flex-1 min-h-0 w-full">
                        <ResponsiveContainer width="100%" height={240}>
                          <AreaChart data={chatSheetStats.chart2}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                            <XAxis dataKey="name" stroke="#71717a" fontSize={11} />
                            <YAxis stroke="#71717a" fontSize={11} />
                            <RechartsTooltip contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', borderRadius: '8px' }} />
                            <Area type="monotone" dataKey="conversion" stroke="#10b981" fill="#10b981" fillOpacity={0.15} name="Conversions" />
                            <Area type="monotone" dataKey="active" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.05} name="Total Shipped" />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  )}

                  {/* CHART 3: Acquisition Cost per channel */}
                  {(chatsheetCategory === 'all' || chatsheetCategory === 'marketing') && (
                    <div id="chart-card-3" className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-5 hover:border-zinc-700/80 transition-all flex flex-col h-[380px] shadow-sm animate-fade-in animate-duration-300">
                      <div className="mb-4">
                        <span className="text-[10px] text-sky-400 uppercase tracking-widest font-mono font-bold">Marketing — Chart 3/15</span>
                        <h3 className="font-semibold text-white text-base mt-0.5">Customer Acquisition Costs (CAC)</h3>
                        <p className="text-xs text-zinc-400">Total expenditure per newly onboarded customer in INR.</p>
                      </div>
                      <div className="flex-1 min-h-0 w-full">
                        <ResponsiveContainer width="100%" height={240}>
                          <BarChart data={chatSheetStats.chart3}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                            <XAxis dataKey="platform" stroke="#71717a" fontSize={10} />
                            <YAxis stroke="#71717a" fontSize={11} />
                            <RechartsTooltip contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', borderRadius: '8px' }} />
                            <Bar dataKey="cost" fill="#8b5cf6" radius={[4, 4, 0, 0]} name="CAC (INR)" />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  )}

                  {/* CHART 4: Delivery Failures Root Causes */}
                  {(chatsheetCategory === 'all' || chatsheetCategory === 'operations') && (
                    <div id="chart-card-4" className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-5 hover:border-zinc-700/80 transition-all flex flex-col h-[380px] shadow-sm animate-fade-in animate-duration-300">
                      <div className="mb-4">
                        <span className="text-[10px] text-sky-400 uppercase tracking-widest font-mono font-bold">Operations — Chart 4/15</span>
                        <h3 className="font-semibold text-white text-base mt-0.5">Delivery Failure Attribution</h3>
                        <p className="text-xs text-zinc-400">Breakdown of order non-fulfillments and delays.</p>
                      </div>
                      <div className="flex-1 min-h-0 w-full flex items-center justify-center">
                        <ResponsiveContainer width="100%" height={240}>
                          <PieChart>
                            <Pie
                              data={chatSheetStats.chart4}
                              cx="50%"
                              cy="50%"
                              innerRadius={0}
                              outerRadius={75}
                              dataKey="value"
                              label={({ name, percent }) => `${name} (${((percent || 0) * 100).toFixed(0)}%)`}
                              labelLine={false}
                            >
                              {[
                                { name: 'Unreachable Address', value: 40, color: '#3b82f6' },
                                { name: 'Customer Out', value: 30, color: '#ef4444' },
                                { name: 'Traffic Delay', value: 20, color: '#f59e0b' },
                                { name: 'Item Damaged', value: 10, color: '#10b981' },
                              ].map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                              ))}
                            </Pie>
                            <RechartsTooltip contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', borderRadius: '8px' }} />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  )}

                  {/* CHART 5: Current Stock Shortage */}
                  {(chatsheetCategory === 'all' || chatsheetCategory === 'operations') && (
                    <div id="chart-card-5" className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-5 hover:border-zinc-700/80 transition-all flex flex-col h-[380px] shadow-sm animate-fade-in animate-duration-300">
                      <div className="mb-4">
                        <span className="text-[10px] text-sky-400 uppercase tracking-widest font-mono font-bold">Operations — Chart 5/15</span>
                        <h3 className="font-semibold text-white text-base mt-0.5">Product Inventory Shortages</h3>
                        <p className="text-xs text-zinc-400">Total units deficient in local warehouse compared to baseline.</p>
                      </div>
                      <div className="flex-1 min-h-0 w-full">
                        <ResponsiveContainer width="100%" height={240}>
                          <BarChart data={chatSheetStats.chart5} layout="vertical">
                            <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                            <XAxis type="number" stroke="#71717a" fontSize={11} />
                            <YAxis dataKey="product" type="category" stroke="#71717a" fontSize={10} width={80} />
                            <RechartsTooltip contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', borderRadius: '8px' }} />
                            <Bar dataKey="shortage" fill="#f43f5e" radius={[0, 4, 4, 0]} name="Units Deficient" />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  )}

                  {/* CHART 6: Delivery Fleet Utilization */}
                  {(chatsheetCategory === 'all' || chatsheetCategory === 'operations') && (
                    <div id="chart-card-6" className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-5 hover:border-zinc-700/80 transition-all flex flex-col h-[380px] shadow-sm animate-fade-in animate-duration-300">
                      <div className="mb-4">
                        <span className="text-[10px] text-sky-400 uppercase tracking-widest font-mono font-bold">Operations — Chart 6/15</span>
                        <h3 className="font-semibold text-white text-base mt-0.5">Fleet Operational Utilization</h3>
                        <p className="text-xs text-zinc-400">Daily number of active runners vs total theoretical fleet strength.</p>
                      </div>
                      <div className="flex-1 min-h-0 w-full">
                        <ResponsiveContainer width="100%" height={240}>
                          <AreaChart data={chatSheetStats.chart6}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                            <XAxis dataKey="day" stroke="#71717a" fontSize={11} />
                            <YAxis stroke="#71717a" fontSize={11} />
                            <RechartsTooltip contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', borderRadius: '8px' }} />
                            <Area type="monotone" dataKey="active" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.1} name="Active Partners" />
                            <Area type="monotone" dataKey="capacity" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.03} name="Total Capacity" />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  )}

                  {/* CHART 7: Weekly gross payment volume vs target */}
                  {(chatsheetCategory === 'all' || chatsheetCategory === 'finance') && (
                    <div id="chart-card-7" className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-5 hover:border-zinc-700/80 transition-all flex flex-col h-[380px] shadow-sm animate-fade-in animate-duration-300">
                      <div className="mb-4">
                        <span className="text-[10px] text-sky-400 uppercase tracking-widest font-mono font-bold">Finance — Chart 7/15</span>
                        <h3 className="font-semibold text-white text-base mt-0.5">Gross Payment Fulfillment Rate</h3>
                        <p className="text-xs text-zinc-400">Collected gross payment percentage vs monthly target.</p>
                      </div>
                      <div className="flex-1 min-h-0 w-full">
                        <ResponsiveContainer width="100%" height={240}>
                          <ComposedChart data={chatSheetStats.chart7}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                            <XAxis dataKey="week" stroke="#71717a" fontSize={11} />
                            <YAxis stroke="#71717a" fontSize={11} />
                            <RechartsTooltip contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', borderRadius: '8px' }} />
                            <Bar dataKey="rate" fill="#10b981" radius={[4, 4, 0, 0]} name="Actual Rate %" />
                            <Line type="monotone" dataKey="target" stroke="#ec4899" strokeWidth={2.5} name="Target Line" />
                          </ComposedChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  )}

                  {/* CHART 8: Vendor Invoice processing SLA */}
                  {(chatsheetCategory === 'all' || chatsheetCategory === 'finance') && (
                    <div id="chart-card-8" className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-5 hover:border-zinc-700/80 transition-all flex flex-col h-[380px] shadow-sm animate-fade-in animate-duration-300">
                      <div className="mb-4">
                        <span className="text-[10px] text-sky-400 uppercase tracking-widest font-mono font-bold">Finance — Chart 8/15</span>
                        <h3 className="font-semibold text-white text-base mt-0.5">Vendor Invoice Turnaround</h3>
                        <p className="text-xs text-zinc-400">Average duration in hours taken to process and settle partner invoices.</p>
                      </div>
                      <div className="flex-1 min-h-0 w-full">
                        <ResponsiveContainer width="100%" height={240}>
                          <BarChart data={chatSheetStats.chart8}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                            <XAxis dataKey="vendor" stroke="#71717a" fontSize={10} />
                            <YAxis stroke="#71717a" fontSize={11} />
                            <RechartsTooltip contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', borderRadius: '8px' }} />
                            <Bar dataKey="hours" fill="#06b6d4" name="Settle Hours" />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  )}

                  {/* CHART 9: Average complaint lead resolution SLA */}
                  {(chatsheetCategory === 'all' || chatsheetCategory === 'finance') && (
                    <div id="chart-card-9" className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-5 hover:border-zinc-700/80 transition-all flex flex-col h-[380px] shadow-sm animate-fade-in animate-duration-300">
                      <div className="mb-4">
                        <span className="text-[10px] text-sky-400 uppercase tracking-widest font-mono font-bold">Finance — Chart 9/15</span>
                        <h3 className="font-semibold text-white text-base mt-0.5">Billing Discrepancy SLA</h3>
                        <p className="text-xs text-zinc-400">Audit hours required per resolution based on query complexity levels.</p>
                      </div>
                      <div className="flex-1 min-h-0 w-full">
                        <ResponsiveContainer width="100%" height={240}>
                          <ScatterChart>
                            <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                            <XAxis type="number" dataKey="age" name="Open Days" stroke="#71717a" fontSize={11} unit="d" />
                            <YAxis type="number" dataKey="resolved" name="Hours Taken" stroke="#71717a" fontSize={11} unit="h" />
                            <RechartsTooltip cursor={{ strokeDasharray: '3 3' }} contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', borderRadius: '8px' }} />
                            <Scatter name="Tickets" data={chatSheetStats.chart9} fill="#f59e0b" />
                          </ScatterChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  )}

                  {/* CHART 10: Competitor threat index */}
                  {(chatsheetCategory === 'all' || chatsheetCategory === 'research') && (
                    <div id="chart-card-10" className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-5 hover:border-zinc-700/80 transition-all flex flex-col h-[380px] shadow-sm animate-fade-in animate-duration-300">
                      <div className="mb-4">
                        <span className="text-[10px] text-sky-400 uppercase tracking-widest font-mono font-bold">Research — Chart 10/15</span>
                        <h3 className="font-semibold text-white text-base mt-0.5">Competitor Threat Indices</h3>
                        <p className="text-xs text-zinc-400">Evaluated score of competitive impact vs market threat level %.</p>
                      </div>
                      <div className="flex-1 min-h-0 w-full">
                        <ResponsiveContainer width="100%" height={240}>
                          <BarChart data={chatSheetStats.chart10}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                            <XAxis dataKey="name" stroke="#71717a" fontSize={10} />
                            <YAxis stroke="#71717a" fontSize={11} />
                            <RechartsTooltip contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', borderRadius: '8px' }} />
                            <Bar dataKey="score" fill="#ef4444" radius={[4, 4, 0, 0]} name="Market Dominance" />
                            <Bar dataKey="impact" fill="#eab308" radius={[4, 4, 0, 0]} name="Threat Quotient" />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  )}

                  {/* CHART 11: Seasonal demand peaks per category */}
                  {(chatsheetCategory === 'all' || chatsheetCategory === 'research') && (
                    <div id="chart-card-11" className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-5 hover:border-zinc-700/80 transition-all flex flex-col h-[380px] shadow-sm animate-fade-in animate-duration-300">
                      <div className="mb-4">
                        <span className="text-[10px] text-sky-400 uppercase tracking-widest font-mono font-bold">Research — Chart 11/15</span>
                        <h3 className="font-semibold text-white text-base mt-0.5">Seasonal Festival Volatilities</h3>
                        <p className="text-xs text-zinc-400">Order traffic multi-peak index representation during local festivals.</p>
                      </div>
                      <div className="flex-1 min-h-0 w-full">
                        <ResponsiveContainer width="100%" height={240}>
                          <LineChart data={chatSheetStats.chart11}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                            <XAxis dataKey="month" stroke="#71717a" fontSize={11} />
                            <YAxis stroke="#71717a" fontSize={11} />
                            <RechartsTooltip contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', borderRadius: '8px' }} />
                            <Line type="monotone" dataKey="score" stroke="#8b5cf6" strokeWidth={3} dot={{ r: 6 }} activeDot={{ r: 8 }} name="Fulfillment Index" />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  )}

                  {/* CHART 12: Customer loyalty ratings indicators */}
                  {(chatsheetCategory === 'all' || chatsheetCategory === 'research') && (
                    <div id="chart-card-12" className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-5 hover:border-zinc-700/80 transition-all flex flex-col h-[380px] shadow-sm animate-fade-in animate-duration-300">
                      <div className="mb-4">
                        <span className="text-[10px] text-sky-400 uppercase tracking-widest font-mono font-bold">Research — Chart 12/15</span>
                        <h3 className="font-semibold text-white text-base mt-0.5">Churn Susceptibility Indicators</h3>
                        <p className="text-xs text-zinc-400">Friction factors causing potential retention drops.</p>
                      </div>
                      <div className="flex-1 min-h-0 w-full flex items-center justify-center">
                        <ResponsiveContainer width="100%" height={220}>
                          <RadialBarChart innerRadius="25%" outerRadius="90%" barSize={15} data={[
                            { name: 'Missed Payment', value: 35, fill: '#ef4444' },
                            { name: 'No Order 30 Days', value: 50, fill: '#f97316' },
                            { name: 'Bad Review', value: 15, fill: '#eab308' },
                          ]}>
                            <RadialBar label={{ position: 'insideStart', fill: '#fff' }} background dataKey="value" />
                            <Legend iconSize={10} layout="vertical" formatter={(value) => <span className="text-xs text-zinc-300 capitalize">{value}</span>} />
                            <RechartsTooltip contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', borderRadius: '8px' }} />
                          </RadialBarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  )}

                  {/* CHART 13: Local Store GMB rating breakdown */}
                  {(chatsheetCategory === 'all' || chatsheetCategory === 'social') && (
                    <div id="chart-card-13" className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-5 hover:border-zinc-700/80 transition-all flex flex-col h-[380px] shadow-sm animate-fade-in animate-duration-300">
                      <div className="mb-4">
                        <span className="text-[10px] text-sky-400 uppercase tracking-widest font-mono font-bold">Social Media — Chart 13/15</span>
                        <h3 className="font-semibold text-white text-base mt-0.5">Google My Business Reviews</h3>
                        <p className="text-xs text-zinc-400">User reviews allocation by rating standard in local map directory.</p>
                      </div>
                      <div className="flex-1 min-h-0 w-full">
                        <ResponsiveContainer width="100%" height={240}>
                          <BarChart data={chatSheetStats.chart13} layout="vertical">
                            <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                            <XAxis type="number" stroke="#71717a" fontSize={11} />
                            <YAxis dataKey="rating" type="category" stroke="#71717a" fontSize={10} width={90} />
                            <RechartsTooltip contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', borderRadius: '8px' }} />
                            <Bar dataKey="count" fill="#ecebeb" radius={[0, 4, 4, 0]} name="Mentions count" />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  )}

                  {/* CHART 14: Social campaign click through rates */}
                  {(chatsheetCategory === 'all' || chatsheetCategory === 'social') && (
                    <div id="chart-card-14" className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-5 hover:border-zinc-700/80 transition-all flex flex-col h-[380px] shadow-sm animate-fade-in animate-duration-300">
                      <div className="mb-4">
                        <span className="text-[10px] text-sky-400 uppercase tracking-widest font-mono font-bold">Social Media — Chart 14/15</span>
                        <h3 className="font-semibold text-white text-base mt-0.5">Outreach Platform Clickthrough</h3>
                        <p className="text-xs text-zinc-400">Total verified CTR percentage per channel for campaign posts.</p>
                      </div>
                      <div className="flex-1 min-h-0 w-full">
                        <ResponsiveContainer width="100%" height={240}>
                          <BarChart data={chatSheetStats.chart14}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                            <XAxis dataKey="platform" stroke="#71717a" fontSize={10} />
                            <YAxis stroke="#71717a" fontSize={11} />
                            <RechartsTooltip contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', borderRadius: '8px' }} />
                            <Bar dataKey="ctr" fill="#ec4899" radius={[4, 4, 0, 0]} name="CTR %" />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  )}

                  {/* CHART 15: Budget allocating vs actual expenditures */}
                  {(chatsheetCategory === 'all' || chatsheetCategory === 'social') && (
                    <div id="chart-card-15" className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-5 hover:border-zinc-700/80 transition-all flex flex-col h-[380px] shadow-sm animate-fade-in animate-duration-300">
                      <div className="mb-4">
                        <span className="text-[10px] text-sky-400 uppercase tracking-widest font-mono font-bold">Budget & System — Chart 15/15</span>
                        <h3 className="font-semibold text-white text-base mt-0.5">Inter-departmental Allocation</h3>
                        <p className="text-xs text-zinc-400">Assigned monetary budget compared directly with real quarterly outflows.</p>
                      </div>
                      <div className="flex-1 min-h-0 w-full">
                        <ResponsiveContainer width="100%" height={240}>
                          <BarChart data={chatSheetStats.chart15}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                            <XAxis dataKey="name" stroke="#71717a" fontSize={10} />
                            <YAxis stroke="#71717a" fontSize={11} />
                            <RechartsTooltip contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', borderRadius: '8px' }} />
                            <Bar dataKey="allocated" fill="#eab308" radius={[4, 4, 0, 0]} name="Budget" />
                            <Bar dataKey="actual" fill="#ef4444" radius={[4, 4, 0, 0]} name="Spent" />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
            {activeTab === 'company' && (
              <div>
                <h1 className="text-3xl font-bold text-white mb-8">About Company</h1>
                <form onSubmit={handleUpdate} className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-8 space-y-6">
                  <div>
                    <label htmlFor="editCompanyName" className="block text-sm font-medium text-zinc-400 mb-2 uppercase tracking-wider">Company Name</label>
                    <input
                      id="editCompanyName"
                      type="text"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-zinc-700 transition-all font-sans"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="editCompanyDetails" className="block text-sm font-medium text-zinc-400 mb-2 uppercase tracking-wider">Details & Goals</label>
                    <textarea
                      id="editCompanyDetails"
                      value={companyDetails}
                      onChange={(e) => setCompanyDetails(e.target.value)}
                      rows={6}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-zinc-700 transition-all resize-none font-sans"
                      required
                    />
                  </div>
                  {isCompanyChanged && (
                    <div className="pt-4 flex justify-end">
                      <button type="submit" className="flex items-center gap-2 bg-white text-black font-medium px-6 py-2.5 rounded-lg hover:bg-zinc-200 transition-colors">
                        <Save className="w-4 h-4" />
                        Save Changes
                      </button>
                    </div>
                  )}
                </form>
              </div>
            )}
            {activeTab === 'tasks' && (
              <div>
                <div className="flex items-center justify-between mb-8">
                  <h1 className="text-3xl font-bold text-white">Tasks</h1>
                  <div className="flex items-center gap-3">
                    <button 
                      onClick={() => setShowTelegramSetup(true)}
                      className="flex items-center gap-2 bg-[#0088cc]/10 text-[#0088cc] border border-[#0088cc]/20 font-medium px-4 py-2 rounded-lg hover:bg-[#0088cc]/20 transition-colors text-sm"
                    >
                      <MessageSquare className="w-4 h-4" />
                      Telegram Bot
                    </button>
                    <button 
                      onClick={() => setShowTaskForm(true)}
                      className="flex items-center gap-2 bg-white text-black font-medium px-4 py-2 rounded-lg hover:bg-zinc-200 transition-colors text-sm"
                    >
                      <Plus className="w-4 h-4" />
                      New Task
                    </button>
                  </div>
                </div>
                <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-8 space-y-6">
                  {tasks.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                      <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-full mb-4">
                        <ListTodo className="w-8 h-8 text-zinc-500" />
                      </div>
                      <h3 className="text-lg font-medium text-white mb-2">No tasks available</h3>
                      <p className="text-sm text-zinc-500 max-w-sm">
                        There are currently no active tasks. Create a new task to get started.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {tasks.map(task => {
                        const agentAssigned = agents.find(a => a.id === task.assignedTo);
                        return (
                          <div key={task.id} className="flex items-start gap-4 p-5 bg-zinc-950 border border-zinc-800 rounded-lg hover:border-zinc-700 transition-colors">
                            <input type="checkbox" className="mt-1.5 flex-shrink-0 w-4 h-4 rounded border-zinc-700 bg-zinc-900 text-blue-500 focus:ring-blue-500 focus:ring-offset-zinc-950" />
                            <div className="flex-1">
                              <h3 className="text-base font-medium text-white mb-1.5">{task.title}</h3>
                              {task.description && (
                                <p className="text-sm text-zinc-400 mb-3">{task.description}</p>
                              )}
                              <div className="flex items-center gap-4">
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                  task.status === 'Completed' ? 'bg-emerald-400/10 text-emerald-400 border border-emerald-400/20' :
                                  task.status === 'In Progress' ? 'bg-blue-400/10 text-blue-400 border border-blue-400/20' :
                                  'bg-amber-400/10 text-amber-400 border border-amber-400/20'
                                }`}>
                                  {task.status}
                                </span>
                                <div className="flex items-center gap-1.5 text-xs text-zinc-500">
                                  <Bot className="w-3.5 h-3.5" />
                                  Assigned to: <span className="font-medium text-zinc-300">{agentAssigned ? agentAssigned.name : 'Unknown Agent'}</span>
                                </div>
                                <div className="text-xs text-zinc-600">
                                  {task.createdAt.toLocaleDateString()} {task.createdAt.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            )}
            {activeTab === 'api' && (
              <div>
                <h1 className="text-3xl font-bold text-white mb-8">API Configuration</h1>
                <form onSubmit={handleUpdate} className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-8 space-y-6">
                  {apiConfig.map((config, index) => (
                    <div key={config.id} className="flex gap-6 items-end bg-zinc-900/40 p-6 rounded-lg border border-zinc-800/50">
                      <div className="flex-1">
                        <label htmlFor={`editApiKey-${index}`} className="block text-xs font-medium text-zinc-500 mb-2 uppercase tracking-wider">
                          API Key {index + 1}
                        </label>
                        <input
                          id={`editApiKey-${index}`}
                          type="password"
                          value={config.key}
                          onChange={(e) => updateApiConfig(index, 'key', e.target.value)}
                          className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-zinc-700 transition-all font-mono text-sm"
                          placeholder="Enter Gemini API key"
                          required
                        />
                      </div>
                      <div className="w-1/3 min-w-[200px]">
                        <label htmlFor={`editApiModel-${index}`} className="block text-xs font-medium text-zinc-500 mb-2 uppercase tracking-wider">
                          Model Selection
                        </label>
                        <div className="relative">
                          <select
                            id={`editApiModel-${index}`}
                            value={config.model}
                            onChange={(e) => updateApiConfig(index, 'model', e.target.value)}
                            className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-zinc-700 transition-all font-sans appearance-none pr-10 cursor-pointer"
                          >
                            {GEMINI_MODELS.map((model) => (
                              <option key={model} value={model}>{model}</option>
                            ))}
                          </select>
                          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 pointer-events-none" />
                        </div>
                      </div>
                    </div>
                  ))}
                  {isApiChanged && (
                    <div className="pt-4 flex justify-end">
                      <button type="submit" className="flex items-center gap-2 bg-white text-black font-medium px-6 py-2.5 rounded-lg hover:bg-zinc-200 transition-colors">
                        <Save className="w-4 h-4" />
                        Save Configuration
                      </button>
                    </div>
                  )}
                </form>
              </div>
            )}
          </section>
        </div>
      )}

      {showTaskForm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 md:p-8 w-full max-w-lg shadow-2xl relative">
            <h2 className="text-2xl font-bold text-white mb-6">Create New Task</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-1.5 uppercase tracking-wider">Task Title</label>
                <input 
                  type="text" 
                  value={newTask.title}
                  onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-zinc-700 transition-all font-sans"
                  placeholder="E.g., Review Q3 Marketing Campaign"
                  autoFocus
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-1.5 uppercase tracking-wider">Description (Optional)</label>
                <textarea 
                  value={newTask.description}
                  onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-zinc-700 transition-all font-sans min-h-[100px] resize-y"
                  placeholder="Task details..."
                />
              </div>
              
              <div className="pt-4 flex gap-3">
                <button 
                  onClick={() => setShowTaskForm(false)}
                  className="flex-1 py-3 bg-zinc-800 hover:bg-zinc-700 text-white font-medium rounded-xl transition-colors border border-zinc-700"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleCreateTask}
                  disabled={!newTask.title.trim()}
                  className="flex-1 py-3 bg-white text-black hover:bg-zinc-200 disabled:opacity-50 disabled:cursor-not-allowed font-medium rounded-xl transition-colors"
                >
                  Create Task
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showTelegramSetup && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-2xl shadow-2xl relative flex flex-col max-h-[85vh]">
            <div className="p-6 border-b border-zinc-800">
              <h2 className="text-xl font-bold text-white flex items-center gap-3">
                <MessageSquare className="w-6 h-6 text-[#0088cc]" />
                Connect Telegram Bot
              </h2>
            </div>
            
            <div className="p-6 overflow-y-auto">
              <ol className="space-y-6 text-zinc-300 text-sm">
                <li className="flex gap-4">
                  <span className="flex-shrink-0 w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center font-bold text-white">1</span>
                  <div>
                    <h3 className="font-semibold text-white mb-2 text-base">Create a Bot on Telegram</h3>
                    <p className="mb-2">Open Telegram and search for <strong>@BotFather</strong> (the official Telegram bot for creating bots).</p>
                    <p>Send the command <code className="bg-zinc-800 px-1.5 py-0.5 rounded text-emerald-400">/newbot</code> and follow the instructions to choose a name and username.</p>
                  </div>
                </li>
                
                <li className="flex gap-4">
                  <span className="flex-shrink-0 w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center font-bold text-white">2</span>
                  <div>
                    <h3 className="font-semibold text-white mb-2 text-base">Get Your Bot Token</h3>
                    <p>BotFather will give you a token that looks like: <br/><code className="bg-zinc-800 px-1.5 py-0.5 rounded text-sky-400 block mt-2 p-2">123456789:ABCdefGHIjklMNOpqrSTUvwxYZ</code></p>
                    <p className="mt-2 text-amber-400 text-xs">Keep this token secret. Do not share it.</p>
                  </div>
                </li>

                <li className="flex gap-4">
                  <span className="flex-shrink-0 w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center font-bold text-white">3</span>
                  <div>
                    <h3 className="font-semibold text-white mb-2 text-base">Update Environment Variables</h3>
                    <p>Go to your <code className="bg-zinc-800 px-1.5 py-0.5 rounded">.env</code> file (or create one in the root of the project) and add your token:</p>
                    <pre className="bg-zinc-950 p-3 rounded-lg border border-zinc-800 mt-2 text-zinc-400 overflow-x-auto text-xs">
TELEGRAM_BOT_TOKEN=your_token_here
                    </pre>
                  </div>
                </li>

                <li className="flex gap-4">
                  <span className="flex-shrink-0 w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center font-bold text-white">4</span>
                  <div>
                    <h3 className="font-semibold text-white mb-2 text-base">Set the Webhook Callback</h3>
                    <p className="mb-2">Tell Telegram to send messages to your app. Replace the token and your public domain in the URL below and visit it in your browser:</p>
                    <pre className="bg-zinc-950 p-3 rounded-lg border border-zinc-800 mt-2 text-zinc-400 overflow-x-auto text-xs whitespace-pre-wrap break-all">
https://api.telegram.org/botYOUR_BOT_TOKEN/setWebhook?url=YOUR_PUBLIC_APP_URL/api/telegram
                    </pre>
                    <p className="mt-2 text-xs text-zinc-500">Note: The URL must be HTTPS (e.g., using ngrok on localhost, or your deployed Vercel domain).</p>
                  </div>
                </li>
              </ol>
            </div>

            <div className="p-6 border-t border-zinc-800 bg-zinc-900/50 flex justify-end">
              <button 
                onClick={() => setShowTelegramSetup(false)}
                className="px-6 py-2 bg-white hover:bg-zinc-200 text-black font-medium rounded-xl transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
