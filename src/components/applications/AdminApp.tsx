import React, { useState } from 'react';
import { useOS } from '../../context/OSContext';
import { Project, Certification } from '../../types';
import {
  Shield,
  Lock,
  LogOut,
  FolderKanban,
  Award,
  Inbox,
  Plus,
  Trash2,
  Edit2,
  CheckCircle2,
  ExternalLink,
  Save,
  X,
  Mail,
  Calendar,
  AlertCircle,
  Database,
  Eye,
  EyeOff,
} from 'lucide-react';

export const AdminApp: React.FC = () => {
  const {
    isAdminAuthenticated,
    adminLogin,
    adminLogout,
    projects,
    addProject,
    updateProject,
    deleteProject,
    certifications,
    addCertification,
    deleteCertification,
    contactSubmissions,
    markMessageRead,
    openApp,
  } = useOS();

  // Login form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Active Tab
  const [activeTab, setActiveTab] = useState<'projects' | 'certifications' | 'messages' | 'system'>('projects');

  // Project Editor State
  const [editingProject, setEditingProject] = useState<Partial<Project> | null>(null);
  const [isNewProject, setIsNewProject] = useState(false);

  // Certification Editor State
  const [newCert, setNewCert] = useState<Partial<Certification>>({
    name: '',
    issuer: '',
    issue_date: '',
    credential_id: '',
    credential_url: '',
    description: '',
  });
  const [showCertForm, setShowCertForm] = useState(false);

  // Handling Login
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail || !password) {
      setLoginError('Please enter your email and password.');
      return;
    }

    setIsLoggingIn(true);

    try {
      const success =
        normalizedEmail === 'admin@abhishek.dev' &&
        await adminLogin(normalizedEmail, password);

      if (!success) {
        setLoginError('Authentication failed. Please check your credentials and try again.');
      }
    } catch {
      setLoginError('Unable to authenticate right now. Please try again.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  // Open Project for editing
  const handleStartEdit = (proj: Project) => {
    setEditingProject({ ...proj });
    setIsNewProject(false);
  };

  // Start new project
  const handleStartNewProject = () => {
    setEditingProject({
      title: '',
      slug: '',
      short_description: '',
      long_description: '',
      category: 'AI / Full-Stack',
      technologies: ['React.js', 'TypeScript', 'Node.js'],
      thumbnail_url: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&q=80',
      live_url: '',
      github_url: '',
      year: new Date().getFullYear().toString(),
      featured: false,
      challenges: '',
      solution: '',
      results: '',
    });
    setIsNewProject(true);
  };

  // Save Project
  const handleSaveProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProject?.title || !editingProject?.short_description) return;

    const slug =
      editingProject.slug ||
      editingProject.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');

    const projectToSave: Project = {
      id: editingProject.id || `proj-${Date.now()}`,
      title: editingProject.title,
      slug,
      short_description: editingProject.short_description,
      long_description: editingProject.long_description || '',
      category: editingProject.category || 'Web Application',
      technologies: Array.isArray(editingProject.technologies)
        ? editingProject.technologies
        : typeof editingProject.technologies === 'string'
        ? (editingProject.technologies as string).split(',').map(s => s.trim()).filter(Boolean)
        : ['React.js'],
      thumbnail_url:
        editingProject.thumbnail_url ||
        'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&q=80',
      live_url: editingProject.live_url || '',
      github_url: editingProject.github_url || '',
      year: editingProject.year || '2026',
      featured: Boolean(editingProject.featured),
      challenges: editingProject.challenges || '',
      solution: editingProject.solution || '',
      results: editingProject.results || '',
      gallery: editingProject.gallery || [
        editingProject.thumbnail_url || 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&q=80',
      ],
      status: editingProject.status || 'Completed',
      sort_order: editingProject.sort_order ?? 99,
      created_at: editingProject.created_at || new Date().toISOString(),
    };

    if (isNewProject) {
      await addProject(projectToSave);
    } else {
      await updateProject(projectToSave);
    }

    setEditingProject(null);
  };

  // Save Certification
  const handleSaveCertification = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCert.name || !newCert.issuer) return;

    const certToSave: Certification = {
      id: `cert-${Date.now()}`,
      name: newCert.name,
      issuer: newCert.issuer,
      issue_date: newCert.issue_date || new Date().toISOString().slice(0, 10),
      credential_id: newCert.credential_id || '',
      credential_url: newCert.credential_url || '',
      description: newCert.description || '',
    };

    await addCertification(certToSave);
    setNewCert({
      name: '',
      issuer: '',
      issue_date: '',
      credential_id: '',
      credential_url: '',
      description: '',
    });
    setShowCertForm(false);
  };

  // LOGIN SCREEN
  if (!isAdminAuthenticated) {
    const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
    const canSubmit = email.trim().length > 0 && password.length > 0 && isEmailValid;

    return (
      <div className="relative flex h-full min-h-[520px] items-center justify-center overflow-hidden bg-[#05070d] px-4 py-8 text-slate-100 select-none">
        {/* Ambient animated background */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -left-24 -top-24 h-72 w-72 rounded-full bg-sky-500/10 blur-3xl animate-pulse" />
          <div
            className="absolute -bottom-32 -right-20 h-80 w-80 rounded-full bg-violet-500/10 blur-3xl animate-pulse"
            style={{ animationDelay: '900ms' }}
          />
          <div
            className="absolute left-1/2 top-1/4 h-48 w-48 -translate-x-1/2 rounded-full bg-cyan-400/5 blur-3xl animate-pulse"
            style={{ animationDelay: '1.6s' }}
          />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(56,189,248,0.07),transparent_42%)]" />
          <div className="absolute inset-0 opacity-[0.035] [background-image:linear-gradient(rgba(255,255,255,1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,1)_1px,transparent_1px)] [background-size:32px_32px]" />
        </div>

        <div className="relative z-10 w-full max-w-md">
          {/* Brand / security status */}
          <div className="mb-5 flex items-center justify-between px-1 text-[10px]">
            <div className="flex items-center gap-2 text-slate-400">
              <span className="flex h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.8)] animate-pulse" />
              <span className="font-semibold uppercase tracking-[0.18em]">
                Secure Workspace
              </span>
            </div>
            <span className="font-mono text-slate-600">AES • AUTH</span>
          </div>

          {/* Login card */}
          <div className="relative overflow-hidden rounded-[28px] border border-white/10 bg-slate-900/75 p-6 shadow-2xl shadow-black/50 backdrop-blur-2xl sm:p-8">
            <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-sky-400/70 to-transparent" />

            {/* Animated security icon */}
            <div className="mb-6 flex justify-center">
              <div className="relative">
                <div className="absolute inset-0 rounded-2xl bg-sky-400/20 blur-xl animate-pulse" />
                <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl border border-sky-400/25 bg-sky-400/10 text-sky-300 shadow-lg shadow-sky-950/40">
                  <Shield className="h-8 w-8" />
                  <span className="absolute -right-1 -top-1 h-3 w-3 rounded-full border-2 border-slate-900 bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.8)]" />
                </div>
              </div>
            </div>

            <div className="mb-7 text-center">
              <h2 className="text-xl font-bold tracking-tight text-white sm:text-2xl">
                Workstation Control Center
              </h2>
              <p className="mx-auto mt-2 max-w-sm text-xs leading-relaxed text-slate-400">
                Sign in to manage projects, certifications, and portfolio
                messages from your private admin workspace.
              </p>
            </div>

            {loginError && (
              <div className="mb-4 flex items-start gap-2.5 rounded-2xl border border-red-500/20 bg-red-500/10 px-3.5 py-3 text-xs text-red-300 animate-pulse">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                <span>{loginError}</span>
              </div>
            )}

            <form onSubmit={handleLoginSubmit} className="space-y-4">
              {/* Email */}
              <div>
                <label
                  htmlFor="admin-email"
                  className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-slate-300"
                >
                  Admin Email
                </label>
                <div
                  className={`group flex items-center rounded-2xl border bg-slate-950/60 transition-all duration-300 ${
                    email && !isEmailValid
                      ? 'border-red-500/40 focus-within:border-red-400/70'
                      : 'border-white/10 focus-within:border-sky-400/60 focus-within:bg-slate-950'
                  }`}
                >
                  <Mail className="ml-3.5 h-4 w-4 shrink-0 text-slate-500 transition-colors group-focus-within:text-sky-400" />
                  <input
                    id="admin-email"
                    type="email"
                    required
                    autoComplete="username"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (loginError) setLoginError('');
                    }}
                    placeholder="Enter your admin email"
                    className="w-full bg-transparent px-3 py-3.5 text-sm text-slate-100 outline-none placeholder:text-slate-600"
                  />
                  {isEmailValid && email.trim() && (
                    <CheckCircle2 className="mr-3 h-4 w-4 shrink-0 text-emerald-400" />
                  )}
                </div>
                {email.trim() && !isEmailValid && (
                  <p className="mt-1.5 px-1 text-[10px] text-red-400">
                    Enter a valid email address.
                  </p>
                )}
              </div>

              {/* Password */}
              <div>
                <label
                  htmlFor="admin-password"
                  className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-slate-300"
                >
                  Security Passkey
                </label>
                <div className="group flex items-center rounded-2xl border border-white/10 bg-slate-950/60 transition-all duration-300 focus-within:border-sky-400/60 focus-within:bg-slate-950">
                  <Lock className="ml-3.5 h-4 w-4 shrink-0 text-slate-500 transition-colors group-focus-within:text-sky-400" />
                  <input
                    id="admin-password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (loginError) setLoginError('');
                    }}
                    placeholder="Enter your security passkey"
                    className="w-full bg-transparent px-3 py-3.5 text-sm text-slate-100 outline-none placeholder:text-slate-600"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((value) => !value)}
                    className="mr-2 rounded-xl p-2 text-slate-500 transition-all hover:bg-white/5 hover:text-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-400/40"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Security note */}
              <div className="flex items-start gap-3 rounded-2xl border border-sky-400/10 bg-sky-400/[0.04] px-3.5 py-3.5">
                <div className="mt-0.5 rounded-lg bg-sky-400/10 p-1.5 text-sky-300">
                  <Lock className="h-3.5 w-3.5" />
                </div>
                <div>
                  <p className="text-[11px] font-semibold text-slate-200">
                    Owner-only workspace
                  </p>
                  <p className="mt-0.5 text-[10px] leading-relaxed text-slate-500">
                    Your credentials are submitted only when you press
                    Authenticate.
                  </p>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={!canSubmit || isLoggingIn}
                className="group relative mt-2 flex w-full items-center justify-center gap-2 overflow-hidden rounded-2xl bg-sky-400 px-4 py-3.5 text-sm font-bold text-slate-950 shadow-lg shadow-sky-950/30 transition-all duration-300 hover:-translate-y-0.5 hover:bg-sky-300 hover:shadow-sky-500/20 active:translate-y-0 disabled:cursor-not-allowed disabled:translate-y-0 disabled:opacity-40"
              >
                <span className="absolute inset-0 -translate-x-full bg-white/20 transition-transform duration-700 group-hover:translate-x-full" />
                {isLoggingIn ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-950/30 border-t-slate-950" />
                    <span>Authenticating...</span>
                  </>
                ) : (
                  <>
                    <Lock className="h-4 w-4" />
                    <span>Authenticate & Open</span>
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 flex items-center justify-center gap-2 text-[9px] uppercase tracking-[0.16em] text-slate-600">
              <span>Private Admin Area</span>
              <span>•</span>
              <span>Portfolio CMS</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // AUTHENTICATED ADMIN DASHBOARD
  return (
    <div className="flex flex-col h-full bg-slate-950 text-slate-100 select-none overflow-hidden">
      {/* Admin Top Navigation */}
      <div className="h-12 px-4 border-b border-white/10 bg-slate-900/90 flex items-center justify-between gap-3 shrink-0">
        <div className="flex items-center gap-2">
          <Shield className="w-4 h-4 text-emerald-400" />
          <span className="text-xs font-bold text-white tracking-wide">
            Portfolio Control Center
          </span>
          <span className="hidden sm:inline px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
            SuperAdmin Active
          </span>
        </div>

        {/* Tabs switcher */}
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => {
              setActiveTab('projects');
              setEditingProject(null);
            }}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
              activeTab === 'projects'
                ? 'bg-sky-500 text-slate-950 font-semibold'
                : 'text-slate-300 hover:bg-white/10'
            }`}
          >
            Projects ({projects.length})
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('certifications')}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
              activeTab === 'certifications'
                ? 'bg-sky-500 text-slate-950 font-semibold'
                : 'text-slate-300 hover:bg-white/10'
            }`}
          >
            Certifications ({certifications.length})
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('messages')}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
              activeTab === 'messages'
                ? 'bg-sky-500 text-slate-950 font-semibold'
                : 'text-slate-300 hover:bg-white/10'
            }`}
          >
            Messages ({contactSubmissions.length})
          </button>

          <button
            type="button"
            onClick={() => adminLogout()}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg hover:bg-red-500/20 text-slate-400 hover:text-red-300 text-xs transition-colors ml-2"
            title="Log Out"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>

      {/* Main Tab Views */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
        {/* PROJECTS TAB */}
        {activeTab === 'projects' && (
          <div className="space-y-4">
            {editingProject ? (
              // EDIT / ADD PROJECT FORM
              <div className="p-5 sm:p-6 rounded-2xl bg-slate-900/80 border border-white/10 space-y-4">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <h3 className="text-sm font-bold text-white">
                    {isNewProject ? 'Create New Technical Project' : `Edit: ${editingProject.title}`}
                  </h3>
                  <button
                    type="button"
                    onClick={() => setEditingProject(null)}
                    className="p-1 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <form onSubmit={handleSaveProject} className="space-y-4 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">
                        Project Title *
                      </label>
                      <input
                        type="text"
                        required
                        value={editingProject.title || ''}
                        onChange={e => setEditingProject({ ...editingProject, title: e.target.value })}
                        className="w-full bg-slate-800 border border-white/10 rounded-xl px-3 py-2 text-slate-100 focus:ring-1 focus:ring-sky-400"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">
                        Category
                      </label>
                      <input
                        type="text"
                        value={editingProject.category || ''}
                        onChange={e => setEditingProject({ ...editingProject, category: e.target.value })}
                        placeholder="e.g. AI / Full-Stack, Web App"
                        className="w-full bg-slate-800 border border-white/10 rounded-xl px-3 py-2 text-slate-100 focus:ring-1 focus:ring-sky-400"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">
                        Year
                      </label>
                      <input
                        type="text"
                        value={editingProject.year || ''}
                        onChange={e => setEditingProject({ ...editingProject, year: e.target.value })}
                        className="w-full bg-slate-800 border border-white/10 rounded-xl px-3 py-2 text-slate-100 focus:ring-1 focus:ring-sky-400"
                      />
                    </div>

                    <div className="flex items-center pt-5">
                      <label className="flex items-center gap-2 cursor-pointer text-slate-200">
                        <input
                          type="checkbox"
                          checked={Boolean(editingProject.featured)}
                          onChange={e => setEditingProject({ ...editingProject, featured: e.target.checked })}
                          className="rounded border-white/20 bg-slate-800 text-sky-500 focus:ring-sky-400"
                        />
                        <span>Feature this project prominently</span>
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">
                      Short Description *
                    </label>
                    <textarea
                      rows={2}
                      required
                      value={editingProject.short_description || ''}
                      onChange={e => setEditingProject({ ...editingProject, short_description: e.target.value })}
                      className="w-full bg-slate-800 border border-white/10 rounded-xl px-3 py-2 text-slate-100 focus:ring-1 focus:ring-sky-400"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">
                      Long Architectural Description
                    </label>
                    <textarea
                      rows={3}
                      value={editingProject.long_description || ''}
                      onChange={e => setEditingProject({ ...editingProject, long_description: e.target.value })}
                      className="w-full bg-slate-800 border border-white/10 rounded-xl px-3 py-2 text-slate-100 focus:ring-1 focus:ring-sky-400"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">
                        Technologies (comma-separated)
                      </label>
                      <input
                        type="text"
                        value={
                          Array.isArray(editingProject.technologies)
                            ? editingProject.technologies.join(', ')
                            : editingProject.technologies || ''
                        }
                        onChange={e =>
                          setEditingProject({
                            ...editingProject,
                            technologies: e.target.value.split(',').map(s => s.trim()),
                          })
                        }
                        placeholder="React.js, Next.js, OpenAI APIs"
                        className="w-full bg-slate-800 border border-white/10 rounded-xl px-3 py-2 text-slate-100 focus:ring-1 focus:ring-sky-400"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">
                        Thumbnail Image URL
                      </label>
                      <input
                        type="url"
                        value={editingProject.thumbnail_url || ''}
                        onChange={e => setEditingProject({ ...editingProject, thumbnail_url: e.target.value })}
                        className="w-full bg-slate-800 border border-white/10 rounded-xl px-3 py-2 text-slate-100 focus:ring-1 focus:ring-sky-400"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">
                        Live Demo URL
                      </label>
                      <input
                        type="url"
                        value={editingProject.live_url || ''}
                        onChange={e => setEditingProject({ ...editingProject, live_url: e.target.value })}
                        placeholder="https://..."
                        className="w-full bg-slate-800 border border-white/10 rounded-xl px-3 py-2 text-slate-100 focus:ring-1 focus:ring-sky-400"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">
                        GitHub Repository URL
                      </label>
                      <input
                        type="url"
                        value={editingProject.github_url || ''}
                        onChange={e => setEditingProject({ ...editingProject, github_url: e.target.value })}
                        placeholder="https://github.com/..."
                        className="w-full bg-slate-800 border border-white/10 rounded-xl px-3 py-2 text-slate-100 focus:ring-1 focus:ring-sky-400"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
                    <button
                      type="button"
                      onClick={() => setEditingProject(null)}
                      className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex items-center gap-2 px-5 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs shadow"
                    >
                      <Save className="w-3.5 h-3.5" />
                      <span>Save Project</span>
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              // PROJECTS LIST TABLE
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-bold text-white">Project Registry</h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Add, update, or archive projects. Changes reflect instantly across the OS.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={handleStartNewProject}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs shadow"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>New Project</span>
                  </button>
                </div>

                <div className="rounded-2xl border border-white/10 bg-slate-900/60 overflow-hidden divide-y divide-white/5 text-xs">
                  {(projects || []).map(proj => (
                    <div
                      key={proj.id}
                      className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-white/5 transition-colors"
                    >
                      <div className="flex items-center gap-3.5 min-w-0">
                        <img
                          src={proj.thumbnail_url}
                          alt={proj.title}
                          className="w-12 h-12 rounded-xl object-cover bg-slate-800 shrink-0"
                          referrerPolicy="no-referrer"
                        />
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-white text-sm truncate">
                              {proj.title}
                            </span>
                            {proj.featured && (
                              <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-amber-500/20 text-amber-300 border border-amber-400/30">
                                Featured
                              </span>
                            )}
                          </div>
                          <p className="text-slate-400 text-xs truncate max-w-md">
                            {proj.short_description}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                        <button
                          type="button"
                          onClick={() => handleStartEdit(proj)}
                          className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-white/10 transition-colors"
                        >
                          <Edit2 className="w-3 h-3" />
                          <span>Edit</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => deleteProject(proj.id)}
                          className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-red-600/20 hover:bg-red-600/40 text-red-300 border border-red-500/20 transition-colors"
                        >
                          <Trash2 className="w-3 h-3" />
                          <span>Delete</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* CERTIFICATIONS TAB */}
        {activeTab === 'certifications' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white">Certification Credentials</h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Add verified licenses or certifications. Will appear immediately in the Certifications App.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowCertForm(!showCertForm)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs shadow"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{showCertForm ? 'Hide Form' : 'Add Certification'}</span>
              </button>
            </div>

            {showCertForm && (
              <div className="p-5 rounded-2xl bg-slate-900/80 border border-white/10 space-y-3">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                  New Certification Details
                </h4>

                <form onSubmit={handleSaveCertification} className="space-y-3 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-300 mb-1">Certification Name *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. AWS Certified Developer"
                        value={newCert.name}
                        onChange={e => setNewCert({ ...newCert, name: e.target.value })}
                        className="w-full bg-slate-800 border border-white/10 rounded-xl px-3 py-2 text-slate-100"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-300 mb-1">Issuing Organization *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Amazon Web Services, Meta"
                        value={newCert.issuer}
                        onChange={e => setNewCert({ ...newCert, issuer: e.target.value })}
                        className="w-full bg-slate-800 border border-white/10 rounded-xl px-3 py-2 text-slate-100"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-300 mb-1">Issue Date</label>
                      <input
                        type="text"
                        placeholder="e.g. Nov 2025"
                        value={newCert.issue_date}
                        onChange={e => setNewCert({ ...newCert, issue_date: e.target.value })}
                        className="w-full bg-slate-800 border border-white/10 rounded-xl px-3 py-2 text-slate-100"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-300 mb-1">Credential URL</label>
                      <input
                        type="url"
                        placeholder="https://..."
                        value={newCert.credential_url}
                        onChange={e => setNewCert({ ...newCert, credential_url: e.target.value })}
                        className="w-full bg-slate-800 border border-white/10 rounded-xl px-3 py-2 text-slate-100"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-300 mb-1">Description / Key Competencies</label>
                    <textarea
                      rows={2}
                      value={newCert.description}
                      onChange={e => setNewCert({ ...newCert, description: e.target.value })}
                      className="w-full bg-slate-800 border border-white/10 rounded-xl px-3 py-2 text-slate-100"
                    />
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="submit"
                      className="px-4 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs shadow"
                    >
                      Save Certification
                    </button>
                  </div>
                </form>
              </div>
            )}

            {certifications.length === 0 ? (
              <div className="p-8 rounded-2xl bg-slate-900/40 border border-white/8 text-center text-xs text-slate-400">
                No certifications in database yet. Add one above to populate the public portfolio app!
              </div>
            ) : (
              <div className="rounded-2xl border border-white/10 bg-slate-900/60 overflow-hidden divide-y divide-white/5 text-xs">
                {(certifications || []).map(c => (
                  <div
                    key={c.id}
                    className="p-4 flex items-center justify-between gap-3 hover:bg-white/5 transition-colors"
                  >
                    <div>
                      <h4 className="font-bold text-white text-sm">{c.name}</h4>
                      <p className="text-slate-400 text-xs mt-0.5">
                        {c.issuer} • {c.issue_date}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => deleteCertification(c.id)}
                      className="p-2 rounded-lg bg-red-600/20 hover:bg-red-600/40 text-red-300 transition-colors"
                      title="Delete Certification"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* MESSAGES TAB */}
        {activeTab === 'messages' && (
          <div className="space-y-4">
            <div>
              <h3 className="text-base font-bold text-white">Contact Submissions Inbox</h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Real inquiries dispatched through the portfolio contact form.
              </p>
            </div>

            {contactSubmissions.length === 0 ? (
              <div className="p-8 rounded-2xl bg-slate-900/40 border border-white/8 text-center text-xs text-slate-400">
                No inquiries received yet. Submit a message from the Contact App to test!
              </div>
            ) : (
              <div className="space-y-3">
                {(contactSubmissions || []).map(msg => (
                  <div
                    key={msg.id}
                    className={`p-4 rounded-2xl border transition-colors space-y-2 text-xs ${
                      msg.read
                        ? 'bg-slate-900/50 border-white/5'
                        : 'bg-slate-900 border-sky-500/30'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white text-sm">{msg.name}</span>
                        <a
                          href={`mailto:${msg.email}`}
                          className="text-sky-400 hover:underline text-xs"
                        >
                          ({msg.email})
                        </a>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="text-[11px] font-mono text-slate-500">
                          {new Date(msg.createdAt).toLocaleString()}
                        </span>
                        {!msg.read && (
                          <button
                            type="button"
                            onClick={() => markMessageRead(msg.id)}
                            className="text-[10px] text-sky-400 hover:underline"
                          >
                            Mark Read
                          </button>
                        )}
                      </div>
                    </div>

                    <p className="text-slate-300 leading-relaxed bg-slate-800/40 p-3 rounded-xl border border-white/5">
                      {msg.message}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
