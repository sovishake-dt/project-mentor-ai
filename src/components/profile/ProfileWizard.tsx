import React, { useState } from 'react';
import { useProject } from '../../context/ProjectContext';
import { StudentProfile } from '../../types/project';
import { Check, ArrowRight, Save, RotateCcw } from 'lucide-react';

export const ProfileWizard: React.FC = () => {
  const { profile, setProfile, setActiveStage } = useProject();
  const [formData, setFormData] = useState<StudentProfile>(profile);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState<'academic' | 'skills' | 'interests' | 'experience' | 'constraints' | 'goals'>('academic');

  // Tag helper state
  const [tempTag, setTempTag] = useState('');

  const handleSave = () => {
    setProfile(formData);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const addTag = (category: 'languages' | 'frameworks' | 'aiMl' | 'databases' | 'cloudDeployment' | 'other' | 'domains' | 'problemAreas' | 'technologiesToLearn' | 'skillsToImprove') => {
    if (!tempTag.trim()) return;
    const tag = tempTag.trim();

    if (['languages', 'frameworks', 'aiMl', 'databases', 'cloudDeployment', 'other'].includes(category)) {
      const catKey = category as keyof typeof formData.skills;
      if (!formData.skills[catKey].includes(tag)) {
        setFormData({
          ...formData,
          skills: { ...formData.skills, [catKey]: [...formData.skills[catKey], tag] },
        });
      }
    } else if (['domains', 'problemAreas'].includes(category)) {
      const catKey = category as keyof typeof formData.interests;
      if (!formData.interests[catKey].includes(tag)) {
        setFormData({
          ...formData,
          interests: { ...formData.interests, [catKey]: [...formData.interests[catKey], tag] },
        });
      }
    } else if (['technologiesToLearn', 'skillsToImprove'].includes(category)) {
      const catKey = category as keyof typeof formData.learningGoals;
      if (!formData.learningGoals[catKey].includes(tag)) {
        setFormData({
          ...formData,
          learningGoals: { ...formData.learningGoals, [catKey]: [...formData.learningGoals[catKey], tag] },
        });
      }
    }

    setTempTag('');
  };

  const removeTag = (category: string, tagToRemove: string) => {
    if (['languages', 'frameworks', 'aiMl', 'databases', 'cloudDeployment', 'other'].includes(category)) {
      const catKey = category as keyof typeof formData.skills;
      setFormData({
        ...formData,
        skills: {
          ...formData.skills,
          [catKey]: formData.skills[catKey].filter((t) => t !== tagToRemove),
        },
      });
    } else if (['domains', 'problemAreas'].includes(category)) {
      const catKey = category as keyof typeof formData.interests;
      setFormData({
        ...formData,
        interests: {
          ...formData.interests,
          [catKey]: formData.interests[catKey].filter((t) => t !== tagToRemove),
        },
      });
    } else if (['technologiesToLearn', 'skillsToImprove'].includes(category)) {
      const catKey = category as keyof typeof formData.learningGoals;
      setFormData({
        ...formData,
        learningGoals: {
          ...formData.learningGoals,
          [catKey]: formData.learningGoals[catKey].filter((t) => t !== tagToRemove),
        },
      });
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto py-2">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Student Profile & Constraints</h2>
          <p className="text-xs text-slate-500 mt-1">
            Personalize your skills, hardware specs, time limits, and goals so Gemini can generate tailored ideas.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleSave}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 text-white rounded-lg text-xs font-semibold hover:bg-indigo-700 transition-colors shadow-xs"
          >
            {savedSuccess ? <Check className="w-4 h-4 text-emerald-300" /> : <Save className="w-4 h-4" />}
            <span>{savedSuccess ? 'Saved to Profile!' : 'Save Profile'}</span>
          </button>

          <button
            onClick={() => {
              handleSave();
              setActiveStage('ideas');
            }}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-900 text-white rounded-lg text-xs font-semibold hover:bg-slate-800 transition-colors shadow-xs"
          >
            <span>Proceed to Generator</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex overflow-x-auto gap-1 border-b border-slate-200 pb-2">
        {[
          { id: 'academic', label: '1. Academic' },
          { id: 'skills', label: '2. Technical Skills' },
          { id: 'interests', label: '3. Interests & Goals' },
          { id: 'experience', label: '4. Experience' },
          { id: 'constraints', label: '5. Constraints' },
          { id: 'goals', label: '6. Learning Goals' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
              activeTab === tab.id
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Contents */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-6">
        {/* Academic */}
        {activeTab === 'academic' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Branch / Major</label>
              <input
                type="text"
                value={formData.academic.branch}
                onChange={(e) => setFormData({ ...formData, academic: { ...formData.academic, branch: e.target.value } })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                placeholder="Computer Science & Engineering"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Current Year</label>
              <input
                type="text"
                value={formData.academic.year}
                onChange={(e) => setFormData({ ...formData, academic: { ...formData.academic, year: e.target.value } })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                placeholder="Final Year (4th Year)"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">Specialization / Track</label>
              <input
                type="text"
                value={formData.academic.specialization}
                onChange={(e) => setFormData({ ...formData, academic: { ...formData.academic, specialization: e.target.value } })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                placeholder="Artificial Intelligence & Software Engineering"
              />
            </div>
          </div>
        )}

        {/* Technical Skills */}
        {activeTab === 'skills' && (
          <div className="space-y-4">
            {[
              { key: 'languages', label: 'Programming Languages' },
              { key: 'frameworks', label: 'Frameworks & Libraries' },
              { key: 'aiMl', label: 'AI/ML Technologies' },
              { key: 'databases', label: 'Databases & Storage' },
              { key: 'cloudDeployment', label: 'Cloud & DevOps Tools' },
            ].map(({ key, label }) => {
              const items = formData.skills[key as keyof typeof formData.skills];
              return (
                <div key={key} className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                  <label className="block text-xs font-bold text-slate-800 mb-2">{label}</label>
                  <div className="flex flex-wrap gap-1.5 mb-2">
                    {items.map((item) => (
                      <span
                        key={item}
                        className="inline-flex items-center gap-1 px-2.5 py-1 bg-white border border-slate-300 rounded-md text-xs font-medium text-slate-700"
                      >
                        {item}
                        <button
                          onClick={() => removeTag(key, item)}
                          className="text-slate-400 hover:text-rose-500 ml-1"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder={`Add ${label.toLowerCase()}...`}
                      className="px-2.5 py-1.5 border border-slate-300 rounded-lg text-xs flex-1 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          setTempTag(e.currentTarget.value);
                          addTag(key as any);
                          e.currentTarget.value = '';
                        }
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Interests */}
        {activeTab === 'interests' && (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Preferred Domains</label>
              <div className="flex flex-wrap gap-1.5 mb-2">
                {formData.interests.domains.map((d) => (
                  <span key={d} className="inline-flex items-center gap-1 px-2.5 py-1 bg-indigo-50 text-indigo-700 border border-indigo-200 rounded-md text-xs font-medium">
                    {d}
                    <button onClick={() => removeTag('domains', d)} className="hover:text-rose-600">×</button>
                  </span>
                ))}
              </div>
              <input
                type="text"
                placeholder="Add preferred domain (e.g., EdTech, Fintech, Healthcare)... Press Enter"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    setTempTag(e.currentTarget.value);
                    addTag('domains');
                    e.currentTarget.value = '';
                  }
                }}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Problem Areas</label>
              <div className="flex flex-wrap gap-1.5 mb-2">
                {formData.interests.problemAreas.map((p) => (
                  <span key={p} className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-50 text-amber-700 border border-amber-200 rounded-md text-xs font-medium">
                    {p}
                    <button onClick={() => removeTag('problemAreas', p)} className="hover:text-rose-600">×</button>
                  </span>
                ))}
              </div>
              <input
                type="text"
                placeholder="Add problem area (e.g., Code Review, Accessibility)... Press Enter"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    setTempTag(e.currentTarget.value);
                    addTag('problemAreas');
                    e.currentTarget.value = '';
                  }
                }}
              />
            </div>
          </div>
        )}

        {/* Experience */}
        {activeTab === 'experience' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Experience Level</label>
              <select
                value={formData.experience.level}
                onChange={(e) => setFormData({ ...formData, experience: { ...formData.experience, level: e.target.value as any } })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-white"
              >
                <option value="Beginner">Beginner (1st/2nd year knowledge)</option>
                <option value="Intermediate">Intermediate (Built a few projects)</option>
                <option value="Advanced">Advanced (Hackathon winner / Industry intern)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Preferred Project Type</label>
              <input
                type="text"
                value={formData.experience.preferredProjectType}
                onChange={(e) => setFormData({ ...formData, experience: { ...formData.experience, preferredProjectType: e.target.value } })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                placeholder="Fullstack Web App / AI Decision Engine"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">Previous Projects Built</label>
              <textarea
                value={formData.experience.previousProjects}
                onChange={(e) => setFormData({ ...formData, experience: { ...formData.experience, previousProjects: e.target.value } })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                rows={3}
                placeholder="Briefly describe what you built before..."
              />
            </div>
          </div>
        )}

        {/* Constraints */}
        {activeTab === 'constraints' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Team Size</label>
              <input
                type="number"
                min={1}
                max={5}
                value={formData.constraints.teamSize}
                onChange={(e) => setFormData({ ...formData, constraints: { ...formData.constraints, teamSize: parseInt(e.target.value) || 1 } })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Available Development Weeks</label>
              <input
                type="number"
                min={2}
                max={52}
                value={formData.constraints.availableWeeks}
                onChange={(e) => setFormData({ ...formData, constraints: { ...formData.constraints, availableWeeks: parseInt(e.target.value) || 12 } })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Hours Per Week</label>
              <input
                type="number"
                value={formData.constraints.hoursPerWeek}
                onChange={(e) => setFormData({ ...formData, constraints: { ...formData.constraints, hoursPerWeek: parseInt(e.target.value) || 15 } })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Budget ($ USD)</label>
              <input
                type="number"
                value={formData.constraints.budgetUsd}
                onChange={(e) => setFormData({ ...formData, constraints: { ...formData.constraints, budgetUsd: parseInt(e.target.value) || 0 } })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Preferred Difficulty</label>
              <select
                value={formData.constraints.preferredDifficulty}
                onChange={(e) => setFormData({ ...formData, constraints: { ...formData.constraints, preferredDifficulty: e.target.value as any } })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-white"
              >
                <option value="Easy">Easy (Guaranteed completion)</option>
                <option value="Moderate">Moderate (Standard final-year project)</option>
                <option value="Challenging">Challenging (High technical depth)</option>
                <option value="Competition-Level">Competition-Level (Award winning potential)</option>
              </select>
            </div>

            <div className="flex items-center gap-6 pt-2 sm:col-span-2">
              <label className="inline-flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.constraints.hasGPU}
                  onChange={(e) => setFormData({ ...formData, constraints: { ...formData.constraints, hasGPU: e.target.checked } })}
                  className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                />
                <span>Dedicated GPU Available (e.g. RTX 3060+)</span>
              </label>

              <label className="inline-flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.constraints.hasGoodInternet}
                  onChange={(e) => setFormData({ ...formData, constraints: { ...formData.constraints, hasGoodInternet: e.target.checked } })}
                  className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                />
                <span>High-Speed Internet / API access</span>
              </label>
            </div>
          </div>
        )}

        {/* Goals */}
        {activeTab === 'goals' && (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Technologies You Want To Learn</label>
              <div className="flex flex-wrap gap-1.5 mb-2">
                {formData.learningGoals.technologiesToLearn.map((t) => (
                  <span key={t} className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-md text-xs font-medium">
                    {t}
                    <button onClick={() => removeTag('technologiesToLearn', t)} className="hover:text-rose-600">×</button>
                  </span>
                ))}
              </div>
              <input
                type="text"
                placeholder="Add technology goal (e.g. Vector DB, Docker)... Press Enter"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    setTempTag(e.currentTarget.value);
                    addTag('technologiesToLearn');
                    e.currentTarget.value = '';
                  }
                }}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Skills You Want To Improve</label>
              <div className="flex flex-wrap gap-1.5 mb-2">
                {formData.learningGoals.skillsToImprove.map((s) => (
                  <span key={s} className="inline-flex items-center gap-1 px-2.5 py-1 bg-purple-50 text-purple-700 border border-purple-200 rounded-md text-xs font-medium">
                    {s}
                    <button onClick={() => removeTag('skillsToImprove', s)} className="hover:text-rose-600">×</button>
                  </span>
                ))}
              </div>
              <input
                type="text"
                placeholder="Add skill goal (e.g. System Design, Database Indexing)... Press Enter"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    setTempTag(e.currentTarget.value);
                    addTag('skillsToImprove');
                    e.currentTarget.value = '';
                  }
                }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Action Footer */}
      <div className="flex items-center justify-between bg-slate-900 text-white p-4 rounded-xl">
        <button
          onClick={() => setFormData(profile)}
          className="inline-flex items-center gap-1.5 text-xs text-slate-300 hover:text-white"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Changes</span>
        </button>

        <button
          onClick={() => {
            handleSave();
            setActiveStage('ideas');
          }}
          className="inline-flex items-center gap-2 px-6 py-2 bg-indigo-600 text-white rounded-lg text-xs font-bold hover:bg-indigo-500 transition-colors shadow-sm"
        >
          <span>Save & Generate Project Ideas</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
