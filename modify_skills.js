const fs = require('fs');
let content = fs.readFileSync('app/page.tsx', 'utf-8');

const constantsInjection = `
const AVAILABLE_HOD_SKILLS = [
  { id: 'skill-1', name: 'Strategic Planning', file: 'strategic_planning.md' },
  { id: 'skill-2', name: 'Financial Analysis', file: 'financial_analysis.py' },
  { id: 'skill-3', name: 'Technical Architecture', file: 'tech_arch.ts' },
  { id: 'skill-4', name: 'Marketing Strategy', file: 'marketing_plan.pdf' },
  { id: 'skill-5', name: 'HR Management', file: 'hr_policies.docx' }
];

export default function App() {
  const [selectedSkillForAgent, setSelectedSkillForAgent] = useState<Record<string, string>>({});
`;

content = content.replace("export default function App() {", constantsInjection);

const oldSkillsSection = `<h3 className="text-xs font-semibold text-zinc-400 mb-4 uppercase tracking-wider">Attached Skills</h3>
                              {agent.skillAttached ? (
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
                              ) : (
                                <div className="text-zinc-500 text-sm italic">No skills attached.</div>
                              )}`;

const newSkillsSection = `<h3 className="text-xs font-semibold text-zinc-400 mb-4 uppercase tracking-wider">Attached Skills</h3>
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
                              )}`;

content = content.replace(oldSkillsSection, newSkillsSection);

fs.writeFileSync('app/page.tsx', content);
console.log('Successfully injected HOD skills');
