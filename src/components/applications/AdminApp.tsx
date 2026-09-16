import React, { useEffect, useMemo, useState } from 'react';

import { useOS } from '../../context/OSContext';

import { Project, Certification } from '../../types';

import {
  Shield,
  Lock,
  LogOut,
  Plus,
  Trash2,
  Edit2,
  CheckCircle2,
  Save,
  X,
  Mail,
  AlertCircle,
  Eye,
  EyeOff,
  GripVertical,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  RefreshCw,
  ExternalLink,
  Award,
  Inbox,
  FolderKanban,
  MoveVertical,
} from 'lucide-react';

const DEFAULT_THUMBNAIL =
  'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&q=80';

type SortMode = 'manual' | 'asc' | 'desc';

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
  } = useOS();

  // =========================================================
  // LOGIN
  // =========================================================

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // =========================================================
  // TABS
  // =========================================================

  const [activeTab, setActiveTab] = useState<
    'projects' | 'certifications' | 'messages' | 'system'
  >('projects');

  // =========================================================
  // PROJECT EDITOR
  // =========================================================

  const [editingProject, setEditingProject] =
    useState<Partial<Project> | null>(null);

  const [isNewProject, setIsNewProject] = useState(false);

  // =========================================================
  // PROJECT SORT / DRAG
  // =========================================================

  const [sortMode, setSortMode] = useState<SortMode>('manual');

  const [draggedProjectId, setDraggedProjectId] = useState<string | null>(
    null
  );

  const [dragOverProjectId, setDragOverProjectId] = useState<string | null>(
    null
  );

  const [isReordering, setIsReordering] = useState(false);

  // Local manual ordering.
  //
  // This allows the UI to feel instant while the persistent
  // sort_order values are being saved.
  const [manualProjectOrder, setManualProjectOrder] = useState<string[]>([]);

  // =========================================================
  // CERTIFICATION
  // =========================================================

  const [newCert, setNewCert] = useState<Partial<Certification>>({
    name: '',
    issuer: '',
    issue_date: '',
    credential_id: '',
    credential_url: '',
    description: '',
  });

  const [showCertForm, setShowCertForm] = useState(false);

  // =========================================================
  // SYNC PROJECT ORDER FROM OS CONTEXT
  // =========================================================

  useEffect(() => {
    const sorted = [...(projects || [])].sort(
      (a, b) => (a.sort_order ?? 999999) - (b.sort_order ?? 999999)
    );

    setManualProjectOrder(sorted.map((project) => project.id));
  }, [projects]);

  // =========================================================
  // PROJECT DISPLAY ORDER
  // =========================================================

  const orderedProjects = useMemo(() => {
    const projectList = [...(projects || [])];

    if (sortMode === 'asc') {
      return projectList.sort((a, b) => {
        const aTitle = a.title?.toLowerCase() || '';
        const bTitle = b.title?.toLowerCase() || '';

        return aTitle.localeCompare(bTitle);
      });
    }

    if (sortMode === 'desc') {
      return projectList.sort((a, b) => {
        const aTitle = a.title?.toLowerCase() || '';
        const bTitle = b.title?.toLowerCase() || '';

        return bTitle.localeCompare(aTitle);
      });
    }

    // Manual order
    const projectMap = new Map(
      projectList.map((project) => [project.id, project])
    );

    const manuallyOrdered = manualProjectOrder
      .map((id) => projectMap.get(id))
      .filter(Boolean) as Project[];

    // Safety: add any new project which isn't yet in the
    // manual order array.
    const existingIds = new Set(manualProjectOrder);

    const newProjects = projectList.filter(
      (project) => !existingIds.has(project.id)
    );

    return [...manuallyOrdered, ...newProjects];
  }, [projects, manualProjectOrder, sortMode]);

  // =========================================================
  // LOGIN
  // =========================================================

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoginError('');

    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail || !password) {
      setLoginError('Please enter your email and password.');
      return;
    }

    const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
      normalizedEmail
    );

    if (!isEmailValid) {
      setLoginError('Please enter a valid email address.');
      return;
    }

    setIsLoggingIn(true);

    try {
      const success =
        normalizedEmail === 'admin@abhishek.dev' &&
        (await adminLogin(normalizedEmail, password));

      if (!success) {
        setLoginError(
          'Authentication failed. Please check your credentials and try again.'
        );
      }
    } catch {
      setLoginError(
        'Unable to authenticate right now. Please try again.'
      );
    } finally {
      setIsLoggingIn(false);
    }
  };

  // =========================================================
  // EDIT PROJECT
  // =========================================================

  const handleStartEdit = (project: Project) => {
    setEditingProject({
      ...project,
      technologies: [...(project.technologies || [])],
    });

    setIsNewProject(false);
  };

  // =========================================================
  // NEW PROJECT
  // =========================================================

  const handleStartNewProject = () => {
    setEditingProject({
      title: '',
      slug: '',
      short_description: '',
      long_description: '',
      category: 'AI / Full-Stack',
      technologies: ['React.js', 'TypeScript', 'Node.js'],
      thumbnail_url: DEFAULT_THUMBNAIL,
      live_url: '',
      github_url: '',
      year: new Date().getFullYear().toString(),
      featured: false,
      challenges: '',
      solution: '',
      results: '',
      gallery: [DEFAULT_THUMBNAIL],
      status: 'Completed',
      sort_order: (projects?.length || 0) + 1,
    });

    setIsNewProject(true);
  };

  // =========================================================
  // SAVE PROJECT
  // =========================================================

  const handleSaveProject = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !editingProject?.title?.trim() ||
      !editingProject?.short_description?.trim()
    ) {
      return;
    }

    const title = editingProject.title.trim();

    const slug =
      editingProject.slug?.trim() ||
      title.toLowerCase().replace(/[^a-z0-9]+/g, '-');

    let technologies: string[] = [];

    if (Array.isArray(editingProject.technologies)) {
      technologies = editingProject.technologies
        .map((technology) => String(technology).trim())
        .filter(Boolean);
    } else if (typeof editingProject.technologies === 'string') {
      technologies = editingProject.technologies
        .split(',')
        .map((technology) => technology.trim())
        .filter(Boolean);
    }

    if (technologies.length === 0) {
      technologies = ['React.js'];
    }

    const thumbnail =
      editingProject.thumbnail_url?.trim() || DEFAULT_THUMBNAIL;

    const projectToSave: Project = {
      id: editingProject.id || `proj-${Date.now()}`,

      title,

      slug,

      short_description:
        editingProject.short_description.trim(),

      long_description:
        editingProject.long_description?.trim() || '',

      category:
        editingProject.category?.trim() || 'Web Application',

      technologies,

      thumbnail_url: thumbnail,

      live_url:
        editingProject.live_url?.trim() || '',

      github_url:
        editingProject.github_url?.trim() || '',

      year:
        editingProject.year?.trim() ||
        new Date().getFullYear().toString(),

      featured: Boolean(editingProject.featured),

      challenges:
        editingProject.challenges?.trim() || '',

      solution:
        editingProject.solution?.trim() || '',

      results:
        editingProject.results?.trim() || '',

      gallery:
        editingProject.gallery?.length
          ? editingProject.gallery
          : [thumbnail],

      status:
        editingProject.status || 'Completed',

      sort_order:
        editingProject.sort_order ??
        (projects?.length || 0) + 1,

      created_at:
        editingProject.created_at ||
        new Date().toISOString(),
    };

    try {
      if (isNewProject) {
        await addProject(projectToSave);

        setManualProjectOrder((previous) => [
          projectToSave.id,
          ...previous,
        ]);
      } else {
        await updateProject(projectToSave);
      }

      setEditingProject(null);
      setIsNewProject(false);
    } catch (error) {
      console.error('Failed to save project:', error);
    }
  };

  // =========================================================
  // DRAG START
  // =========================================================

  const handleDragStart = (
    event: React.DragEvent<HTMLDivElement>,
    projectId: string
  ) => {
    if (sortMode !== 'manual') {
      event.preventDefault();
      return;
    }

    setDraggedProjectId(projectId);

    event.dataTransfer.effectAllowed = 'move';

    event.dataTransfer.setData(
      'text/plain',
      projectId
    );
  };

  // =========================================================
  // DRAG OVER
  // =========================================================

  const handleDragOver = (
    event: React.DragEvent<HTMLDivElement>,
    projectId: string
  ) => {
    event.preventDefault();

    if (
      !draggedProjectId ||
      draggedProjectId === projectId ||
      sortMode !== 'manual'
    ) {
      return;
    }

    event.dataTransfer.dropEffect = 'move';

    setDragOverProjectId(projectId);
  };

  // =========================================================
  // DROP
  // =========================================================

  const handleDrop = async (
    event: React.DragEvent<HTMLDivElement>,
    targetProjectId: string
  ) => {
    event.preventDefault();

    const sourceProjectId =
      event.dataTransfer.getData('text/plain') ||
      draggedProjectId;

    if (
      !sourceProjectId ||
      sourceProjectId === targetProjectId ||
      sortMode !== 'manual'
    ) {
      handleDragEnd();
      return;
    }

    const currentOrder = [...orderedProjects.map((p) => p.id)];

    const sourceIndex =
      currentOrder.indexOf(sourceProjectId);

    const targetIndex =
      currentOrder.indexOf(targetProjectId);

    if (sourceIndex === -1 || targetIndex === -1) {
      handleDragEnd();
      return;
    }

    // Remove dragged project
    const reordered = [...currentOrder];

    const [movedProject] = reordered.splice(
      sourceIndex,
      1
    );

    // Insert before target
    reordered.splice(
      targetIndex,
      0,
      movedProject
    );

    // Instant UI update
    setManualProjectOrder(reordered);

    handleDragEnd();

    // Persist order
    await persistProjectOrder(reordered);
  };

  // =========================================================
  // DRAG END
  // =========================================================

  const handleDragEnd = () => {
    setDraggedProjectId(null);
    setDragOverProjectId(null);
  };

  // =========================================================
  // PERSIST PROJECT ORDER
  // =========================================================

  const persistProjectOrder = async (
    projectIds: string[]
  ) => {
    if (!projects?.length) return;

    setIsReordering(true);

    try {
      const projectMap = new Map(
        projects.map((project) => [
          project.id,
          project,
        ])
      );

      /*
       * Save sort_order sequentially.
       *
       * Sequential updates avoid firing many writes
       * simultaneously and makes the final order
       * deterministic.
       */
      for (let index = 0; index < projectIds.length; index++) {
        const projectId = projectIds[index];

        const project = projectMap.get(projectId);

        if (!project) continue;

        const newSortOrder = index + 1;

        if (project.sort_order !== newSortOrder) {
          await updateProject({
            ...project,
            sort_order: newSortOrder,
          });
        }
      }
    } catch (error) {
      console.error(
        'Failed to persist project order:',
        error
      );
    } finally {
      setIsReordering(false);
    }
  };

  // =========================================================
  // MOVE PROJECT UP
  // =========================================================

  const moveProjectUp = async (projectId: string) => {
    if (sortMode !== 'manual') return;

    const currentOrder = [
      ...orderedProjects.map((project) => project.id),
    ];

    const index = currentOrder.indexOf(projectId);

    if (index <= 0) return;

    const reordered = [...currentOrder];

    [reordered[index - 1], reordered[index]] = [
      reordered[index],
      reordered[index - 1],
    ];

    setManualProjectOrder(reordered);

    await persistProjectOrder(reordered);
  };

  // =========================================================
  // MOVE PROJECT DOWN
  // =========================================================

  const moveProjectDown = async (projectId: string) => {
    if (sortMode !== 'manual') return;

    const currentOrder = [
      ...orderedProjects.map((project) => project.id),
    ];

    const index = currentOrder.indexOf(projectId);

    if (
      index === -1 ||
      index >= currentOrder.length - 1
    ) {
      return;
    }

    const reordered = [...currentOrder];

    [reordered[index], reordered[index + 1]] = [
      reordered[index + 1],
      reordered[index],
    ];

    setManualProjectOrder(reordered);

    await persistProjectOrder(reordered);
  };

  // =========================================================
  // SORT A-Z
  // =========================================================

  const sortAscending = () => {
    setSortMode('asc');
  };

  // =========================================================
  // SORT Z-A
  // =========================================================

  const sortDescending = () => {
    setSortMode('desc');
  };

  // =========================================================
  // RETURN TO MANUAL ORDER
  // =========================================================

  const enableManualOrder = () => {
    const currentOrder = [
      ...manualProjectOrder,
    ];

    setSortMode('manual');

    if (currentOrder.length === 0) {
      const fallback = [
        ...(projects || []),
      ]
        .sort(
          (a, b) =>
            (a.sort_order ?? 999999) -
            (b.sort_order ?? 999999)
        )
        .map((project) => project.id);

      setManualProjectOrder(fallback);
    }
  };

  // =========================================================
  // SAVE CERTIFICATION
  // =========================================================

  const handleSaveCertification = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    if (
      !newCert.name?.trim() ||
      !newCert.issuer?.trim()
    ) {
      return;
    }

    const certToSave: Certification = {
      id: `cert-${Date.now()}`,

      name: newCert.name.trim(),

      issuer: newCert.issuer.trim(),

      issue_date:
        newCert.issue_date?.trim() ||
        new Date().toISOString().slice(0, 10),

      credential_id:
        newCert.credential_id?.trim() || '',

      credential_url:
        newCert.credential_url?.trim() || '',

      description:
        newCert.description?.trim() || '',
    };

    try {
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
    } catch (error) {
      console.error(
        'Failed to save certification:',
        error
      );
    }
  };

  // =========================================================
  // LOGIN SCREEN
  // =========================================================

  if (!isAdminAuthenticated) {
    const isEmailValid =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        email.trim()
      );

    const canSubmit =
      email.trim().length > 0 &&
      password.length > 0 &&
      isEmailValid;

    return (
      <div className="relative flex h-full min-h-[520px] items-center justify-center overflow-hidden bg-[#05070d] px-4 py-8 text-slate-100 select-none">

        {/* Ambient background */}

        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -left-24 -top-24 h-72 w-72 rounded-full bg-sky-500/10 blur-3xl animate-pulse" />

          <div
            className="absolute -bottom-32 -right-20 h-80 w-80 rounded-full bg-violet-500/10 blur-3xl animate-pulse"
            style={{
              animationDelay: '900ms',
            }}
          />

          <div
            className="absolute left-1/2 top-1/4 h-48 w-48 -translate-x-1/2 rounded-full bg-cyan-400/5 blur-3xl animate-pulse"
            style={{
              animationDelay: '1.6s',
            }}
          />

          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(56,189,248,0.07),transparent_42%)]" />

          <div className="absolute inset-0 opacity-[0.035] [background-image:linear-gradient(rgba(255,255,255,1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,1)_1px,transparent_1px)] [background-size:32px_32px]" />
        </div>

        <div className="relative z-10 w-full max-w-md">

          <div className="mb-5 flex items-center justify-between px-1 text-[10px]">
            <div className="flex items-center gap-2 text-slate-400">
              <span className="flex h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.8)] animate-pulse" />

              <span className="font-semibold uppercase tracking-[0.18em]">
                Secure Workspace
              </span>
            </div>

            <span className="font-mono text-slate-600">
              AES • AUTH
            </span>
          </div>

          <div className="relative overflow-hidden rounded-[28px] border border-white/10 bg-slate-900/75 p-6 shadow-2xl shadow-black/50 backdrop-blur-2xl sm:p-8">

            <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-sky-400/70 to-transparent" />

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
                Sign in to manage projects, certifications,
                and portfolio messages from your private
                admin workspace.
              </p>
            </div>

            {loginError && (
              <div className="mb-4 flex items-start gap-2.5 rounded-2xl border border-red-500/20 bg-red-500/10 px-3.5 py-3 text-xs text-red-300">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />

                <span>{loginError}</span>
              </div>
            )}

            <form
              onSubmit={handleLoginSubmit}
              className="space-y-4"
            >
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

                      if (loginError) {
                        setLoginError('');
                      }
                    }}
                    placeholder="Enter your admin email"
                    className="w-full bg-transparent px-3 py-3.5 text-sm text-slate-100 outline-none placeholder:text-slate-600"
                  />

                  {isEmailValid &&
                    email.trim() && (
                      <CheckCircle2 className="mr-3 h-4 w-4 shrink-0 text-emerald-400" />
                    )}
                </div>

                {email.trim() &&
                  !isEmailValid && (
                    <p className="mt-1.5 px-1 text-[10px] text-red-400">
                      Enter a valid email address.
                    </p>
                  )}
              </div>

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
                    type={
                      showPassword
                        ? 'text'
                        : 'password'
                    }
                    required
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);

                      if (loginError) {
                        setLoginError('');
                      }
                    }}
                    placeholder="Enter your security passkey"
                    className="w-full bg-transparent px-3 py-3.5 text-sm text-slate-100 outline-none placeholder:text-slate-600"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword(
                        (value) => !value
                      )
                    }
                    className="mr-2 rounded-xl p-2 text-slate-500 transition-all hover:bg-white/5 hover:text-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-400/40"
                    aria-label={
                      showPassword
                        ? 'Hide password'
                        : 'Show password'
                    }
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex items-start gap-3 rounded-2xl border border-sky-400/10 bg-sky-400/[0.04] px-3.5 py-3.5">
                <div className="mt-0.5 rounded-lg bg-sky-400/10 p-1.5 text-sky-300">
                  <Lock className="h-3.5 w-3.5" />
                </div>

                <div>
                  <p className="text-[11px] font-semibold text-slate-200">
                    Owner-only workspace
                  </p>

                  <p className="mt-0.5 text-[10px] leading-relaxed text-slate-500">
                    Your credentials are submitted only
                    when you press Authenticate.
                  </p>
                </div>
              </div>

              <button
                type="submit"
                disabled={
                  !canSubmit ||
                  isLoggingIn
                }
                className="group relative mt-2 flex w-full items-center justify-center gap-2 overflow-hidden rounded-2xl bg-sky-400 px-4 py-3.5 text-sm font-bold text-slate-950 shadow-lg shadow-sky-950/30 transition-all duration-300 hover:-translate-y-0.5 hover:bg-sky-300 hover:shadow-sky-500/20 active:translate-y-0 disabled:cursor-not-allowed disabled:translate-y-0 disabled:opacity-40"
              >
                <span className="absolute inset-0 -translate-x-full bg-white/20 transition-transform duration-700 group-hover:translate-x-full" />

                {isLoggingIn ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-950/30 border-t-slate-950" />

                    <span>
                      Authenticating...
                    </span>
                  </>
                ) : (
                  <>
                    <Lock className="h-4 w-4" />

                    <span>
                      Authenticate & Open
                    </span>
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

  // =========================================================
  // ADMIN DASHBOARD
  // =========================================================

  return (
    <div className="flex h-full flex-col overflow-hidden bg-slate-950 text-slate-100 select-none">

      {/* =====================================================
          TOP NAVIGATION
      ====================================================== */}

      <div className="flex h-12 shrink-0 items-center justify-between gap-3 border-b border-white/10 bg-slate-900/90 px-4">

        <div className="flex items-center gap-2">
          <Shield className="h-4 w-4 text-emerald-400" />

          <span className="text-xs font-bold tracking-wide text-white">
            Portfolio Control Center
          </span>

          <span className="hidden rounded-full border border-emerald-400/30 bg-emerald-500/20 px-2 py-0.5 text-[10px] font-semibold text-emerald-300 sm:inline">
            SuperAdmin Active
          </span>
        </div>

        <div className="flex items-center gap-1">

          <button
            type="button"
            onClick={() => {
              setActiveTab('projects');
              setEditingProject(null);
            }}
            className={`rounded-lg px-3 py-1 text-xs font-medium transition-colors ${
              activeTab === 'projects'
                ? 'bg-sky-500 font-semibold text-slate-950'
                : 'text-slate-300 hover:bg-white/10'
            }`}
          >
            Projects ({projects?.length || 0})
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab('certifications');
              setEditingProject(null);
            }}
            className={`rounded-lg px-3 py-1 text-xs font-medium transition-colors ${
              activeTab === 'certifications'
                ? 'bg-sky-500 font-semibold text-slate-950'
                : 'text-slate-300 hover:bg-white/10'
            }`}
          >
            Certifications ({certifications?.length || 0})
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab('messages');
              setEditingProject(null);
            }}
            className={`rounded-lg px-3 py-1 text-xs font-medium transition-colors ${
              activeTab === 'messages'
                ? 'bg-sky-500 font-semibold text-slate-950'
                : 'text-slate-300 hover:bg-white/10'
            }`}
          >
            Messages ({contactSubmissions?.length || 0})
          </button>

          <button
            type="button"
            onClick={() => adminLogout()}
            className="ml-2 flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs text-slate-400 transition-colors hover:bg-red-500/20 hover:text-red-300"
            title="Log Out"
          >
            <LogOut className="h-3.5 w-3.5" />

            <span className="hidden sm:inline">
              Logout
            </span>
          </button>
        </div>
      </div>

      {/* =====================================================
          MAIN CONTENT
      ====================================================== */}

      <div className="flex-1 space-y-6 overflow-y-auto p-4 sm:p-6">

        {/* ===================================================
            PROJECTS
        ==================================================== */}

        {activeTab === 'projects' && (
          <div className="space-y-4">

            {editingProject ? (

              /* PROJECT EDITOR */

              <div className="space-y-4 rounded-2xl border border-white/10 bg-slate-900/80 p-5 sm:p-6">

                <div className="flex items-center justify-between border-b border-white/10 pb-3">

                  <div>
                    <h3 className="text-sm font-bold text-white">
                      {isNewProject
                        ? 'Create New Technical Project'
                        : `Edit: ${editingProject.title}`}
                    </h3>

                    <p className="mt-1 text-[10px] text-slate-500">
                      Manage the project information shown
                      throughout your portfolio.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setEditingProject(null);
                      setIsNewProject(false);
                    }}
                    className="rounded-lg p-1 text-slate-400 hover:bg-white/10 hover:text-white"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                <form
                  onSubmit={handleSaveProject}
                  className="space-y-4 text-xs"
                >

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

                    <div>
                      <label className="mb-1 block font-semibold text-slate-300">
                        Project Title *
                      </label>

                      <input
                        type="text"
                        required
                        value={
                          editingProject.title || ''
                        }
                        onChange={(e) =>
                          setEditingProject({
                            ...editingProject,
                            title: e.target.value,
                          })
                        }
                        className="w-full rounded-xl border border-white/10 bg-slate-800 px-3 py-2 text-slate-100 outline-none focus:ring-1 focus:ring-sky-400"
                      />
                    </div>

                    <div>
                      <label className="mb-1 block font-semibold text-slate-300">
                        Category
                      </label>

                      <input
                        type="text"
                        value={
                          editingProject.category || ''
                        }
                        onChange={(e) =>
                          setEditingProject({
                            ...editingProject,
                            category: e.target.value,
                          })
                        }
                        placeholder="AI / Full-Stack"
                        className="w-full rounded-xl border border-white/10 bg-slate-800 px-3 py-2 text-slate-100 outline-none focus:ring-1 focus:ring-sky-400"
                      />
                    </div>

                    <div>
                      <label className="mb-1 block font-semibold text-slate-300">
                        Year
                      </label>

                      <input
                        type="text"
                        value={
                          editingProject.year || ''
                        }
                        onChange={(e) =>
                          setEditingProject({
                            ...editingProject,
                            year: e.target.value,
                          })
                        }
                        className="w-full rounded-xl border border-white/10 bg-slate-800 px-3 py-2 text-slate-100 outline-none focus:ring-1 focus:ring-sky-400"
                      />
                    </div>

                    <div className="flex items-center pt-5">
                      <label className="flex cursor-pointer items-center gap-2 text-slate-200">
                        <input
                          type="checkbox"
                          checked={Boolean(
                            editingProject.featured
                          )}
                          onChange={(e) =>
                            setEditingProject({
                              ...editingProject,
                              featured:
                                e.target.checked,
                            })
                          }
                          className="rounded border-white/20 bg-slate-800 text-sky-500 focus:ring-sky-400"
                        />

                        <span>
                          Feature this project prominently
                        </span>
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="mb-1 block font-semibold text-slate-300">
                      Short Description *
                    </label>

                    <textarea
                      rows={2}
                      required
                      value={
                        editingProject.short_description ||
                        ''
                      }
                      onChange={(e) =>
                        setEditingProject({
                          ...editingProject,
                          short_description:
                            e.target.value,
                        })
                      }
                      className="w-full rounded-xl border border-white/10 bg-slate-800 px-3 py-2 text-slate-100 outline-none focus:ring-1 focus:ring-sky-400"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block font-semibold text-slate-300">
                      Long Description
                    </label>

                    <textarea
                      rows={4}
                      value={
                        editingProject.long_description ||
                        ''
                      }
                      onChange={(e) =>
                        setEditingProject({
                          ...editingProject,
                          long_description:
                            e.target.value,
                        })
                      }
                      className="w-full rounded-xl border border-white/10 bg-slate-800 px-3 py-2 text-slate-100 outline-none focus:ring-1 focus:ring-sky-400"
                    />
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

                    <div>
                      <label className="mb-1 block font-semibold text-slate-300">
                        Technologies
                      </label>

                      <input
                        type="text"
                        value={
                          Array.isArray(
                            editingProject.technologies
                          )
                            ? editingProject.technologies.join(
                                ', '
                              )
                            : editingProject.technologies ||
                              ''
                        }
                        onChange={(e) =>
                          setEditingProject({
                            ...editingProject,
                            technologies:
                              e.target.value
                                .split(',')
                                .map((value) =>
                                  value.trim()
                                )
                                .filter(Boolean),
                          })
                        }
                        placeholder="React.js, Next.js, Node.js"
                        className="w-full rounded-xl border border-white/10 bg-slate-800 px-3 py-2 text-slate-100 outline-none focus:ring-1 focus:ring-sky-400"
                      />
                    </div>

                    <div>
                      <label className="mb-1 block font-semibold text-slate-300">
                        Thumbnail Image URL
                      </label>

                      <input
                        type="url"
                        value={
                          editingProject.thumbnail_url ||
                          ''
                        }
                        onChange={(e) =>
                          setEditingProject({
                            ...editingProject,
                            thumbnail_url:
                              e.target.value,
                          })
                        }
                        placeholder="https://..."
                        className="w-full rounded-xl border border-white/10 bg-slate-800 px-3 py-2 text-slate-100 outline-none focus:ring-1 focus:ring-sky-400"
                      />
                    </div>

                    <div>
                      <label className="mb-1 block font-semibold text-slate-300">
                        Live Demo URL
                      </label>

                      <input
                        type="url"
                        value={
                          editingProject.live_url || ''
                        }
                        onChange={(e) =>
                          setEditingProject({
                            ...editingProject,
                            live_url: e.target.value,
                          })
                        }
                        placeholder="https://..."
                        className="w-full rounded-xl border border-white/10 bg-slate-800 px-3 py-2 text-slate-100 outline-none focus:ring-1 focus:ring-sky-400"
                      />
                    </div>

                    <div>
                      <label className="mb-1 block font-semibold text-slate-300">
                        GitHub Repository URL
                      </label>

                      <input
                        type="url"
                        value={
                          editingProject.github_url ||
                          ''
                        }
                        onChange={(e) =>
                          setEditingProject({
                            ...editingProject,
                            github_url:
                              e.target.value,
                          })
                        }
                        placeholder="https://github.com/..."
                        className="w-full rounded-xl border border-white/10 bg-slate-800 px-3 py-2 text-slate-100 outline-none focus:ring-1 focus:ring-sky-400"
                      />
                    </div>
                  </div>

                  {/* Thumbnail Preview */}

                  <div className="overflow-hidden rounded-2xl border border-white/10 bg-slate-950/60">

                    <div className="border-b border-white/10 px-4 py-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        Thumbnail Preview
                      </span>
                    </div>

                    <div className="p-4">
                      <img
                        src={
                          editingProject.thumbnail_url ||
                          DEFAULT_THUMBNAIL
                        }
                        alt="Project thumbnail preview"
                        className="h-40 w-full rounded-xl object-cover"
                        onError={(event) => {
                          event.currentTarget.src =
                            DEFAULT_THUMBNAIL;
                        }}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">

                    <div>
                      <label className="mb-1 block font-semibold text-slate-300">
                        Challenges
                      </label>

                      <textarea
                        rows={4}
                        value={
                          editingProject.challenges ||
                          ''
                        }
                        onChange={(e) =>
                          setEditingProject({
                            ...editingProject,
                            challenges:
                              e.target.value,
                          })
                        }
                        className="w-full rounded-xl border border-white/10 bg-slate-800 px-3 py-2 text-slate-100 outline-none focus:ring-1 focus:ring-sky-400"
                      />
                    </div>

                    <div>
                      <label className="mb-1 block font-semibold text-slate-300">
                        Solution
                      </label>

                      <textarea
                        rows={4}
                        value={
                          editingProject.solution ||
                          ''
                        }
                        onChange={(e) =>
                          setEditingProject({
                            ...editingProject,
                            solution:
                              e.target.value,
                          })
                        }
                        className="w-full rounded-xl border border-white/10 bg-slate-800 px-3 py-2 text-slate-100 outline-none focus:ring-1 focus:ring-sky-400"
                      />
                    </div>

                    <div>
                      <label className="mb-1 block font-semibold text-slate-300">
                        Results
                      </label>

                      <textarea
                        rows={4}
                        value={
                          editingProject.results ||
                          ''
                        }
                        onChange={(e) =>
                          setEditingProject({
                            ...editingProject,
                            results:
                              e.target.value,
                          })
                        }
                        className="w-full rounded-xl border border-white/10 bg-slate-800 px-3 py-2 text-slate-100 outline-none focus:ring-1 focus:ring-sky-400"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-3 border-t border-white/10 pt-3">

                    <button
                      type="button"
                      onClick={() => {
                        setEditingProject(null);
                        setIsNewProject(false);
                      }}
                      className="rounded-xl bg-slate-800 px-4 py-2 text-xs font-semibold text-slate-300 hover:bg-slate-700"
                    >
                      Cancel
                    </button>

                    <button
                      type="submit"
                      className="flex items-center gap-2 rounded-xl bg-sky-500 px-5 py-2 text-xs font-bold text-slate-950 shadow hover:bg-sky-400"
                    >
                      <Save className="h-3.5 w-3.5" />

                      <span>
                        {isNewProject
                          ? 'Create Project'
                          : 'Save Project'}
                      </span>
                    </button>
                  </div>
                </form>
              </div>

            ) : (

              /* PROJECT LIST */

              <div className="space-y-4">

                {/* HEADER */}

                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

                  <div>
                    <div className="flex items-center gap-2">
                      <FolderKanban className="h-5 w-5 text-sky-400" />

                      <h3 className="text-base font-bold text-white">
                        Project Showcase Registry
                      </h3>
                    </div>

                    <p className="mt-1 text-xs text-slate-400">
                      Drag projects to freely control the
                      order in which they appear in your
                      portfolio showcase.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={handleStartNewProject}
                    className="flex items-center justify-center gap-1.5 rounded-xl bg-sky-500 px-3 py-2 text-xs font-bold text-slate-950 shadow transition-all hover:bg-sky-400 hover:-translate-y-0.5"
                  >
                    <Plus className="h-3.5 w-3.5" />

                    <span>
                      New Project
                    </span>
                  </button>
                </div>

                {/* ORDER CONTROLS */}

                <div className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-slate-900/60 p-3 sm:flex-row sm:items-center sm:justify-between">

                  <div className="flex items-center gap-2">
                    <ArrowUpDown className="h-4 w-4 text-slate-500" />

                    <span className="text-xs font-semibold text-slate-300">
                      Showcase Order
                    </span>

                    {isReordering && (
                      <span className="flex items-center gap-1.5 text-[10px] text-sky-400">
                        <RefreshCw className="h-3 w-3 animate-spin" />
                        Saving order...
                      </span>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-1.5">

                    <button
                      type="button"
                      onClick={enableManualOrder}
                      className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[10px] font-semibold transition-all ${
                        sortMode === 'manual'
                          ? 'bg-sky-500 text-slate-950'
                          : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                      }`}
                    >
                      <MoveVertical className="h-3 w-3" />
                      Manual Drag
                    </button>

                    <button
                      type="button"
                      onClick={sortAscending}
                      className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[10px] font-semibold transition-all ${
                        sortMode === 'asc'
                          ? 'bg-sky-500 text-slate-950'
                          : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                      }`}
                    >
                      <ArrowUp className="h-3 w-3" />
                      A → Z
                    </button>

                    <button
                      type="button"
                      onClick={sortDescending}
                      className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[10px] font-semibold transition-all ${
                        sortMode === 'desc'
                          ? 'bg-sky-500 text-slate-950'
                          : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                      }`}
                    >
                      <ArrowDown className="h-3 w-3" />
                      Z → A
                    </button>
                  </div>
                </div>

                {/* DRAG HELP */}

                {sortMode === 'manual' &&
                  orderedProjects.length > 0 && (
                    <div className="flex items-center gap-2 rounded-xl border border-sky-400/10 bg-sky-400/[0.04] px-3 py-2.5 text-[10px] text-slate-400">
                      <GripVertical className="h-3.5 w-3.5 text-sky-400" />

                      <span>
                        Drag the grip on any project to
                        change its showcase position.
                      </span>
                    </div>
                  )}

                {/* PROJECT LIST */}

                {orderedProjects.length === 0 ? (

                  <div className="rounded-2xl border border-white/10 bg-slate-900/40 p-10 text-center">

                    <FolderKanban className="mx-auto mb-3 h-8 w-8 text-slate-600" />

                    <h4 className="text-sm font-semibold text-slate-300">
                      No projects yet
                    </h4>

                    <p className="mt-1 text-xs text-slate-500">
                      Create your first project to populate
                      the portfolio showcase.
                    </p>
                  </div>

                ) : (

                  <div className="space-y-2">

                    {orderedProjects.map(
                      (project, index) => {
                        const isDragging =
                          draggedProjectId ===
                          project.id;

                        const isDragTarget =
                          dragOverProjectId ===
                          project.id;

                        return (
                          <div
                            key={project.id}
                            draggable={
                              sortMode ===
                              'manual'
                            }
                            onDragStart={(event) =>
                              handleDragStart(
                                event,
                                project.id
                              )
                            }
                            onDragOver={(event) =>
                              handleDragOver(
                                event,
                                project.id
                              )
                            }
                            onDrop={(event) =>
                              handleDrop(
                                event,
                                project.id
                              )
                            }
                            onDragEnd={
                              handleDragEnd
                            }
                            className={`
                              group relative overflow-hidden rounded-2xl
                              border bg-slate-900/70
                              transition-all duration-200
                              ${
                                isDragging
                                  ? 'scale-[0.985] border-sky-400/50 opacity-40 shadow-2xl'
                                  : 'border-white/10 hover:border-white/20 hover:bg-slate-900'
                              }
                              ${
                                isDragTarget
                                  ? 'border-sky-400 bg-sky-400/[0.05] shadow-[0_0_30px_rgba(56,189,248,0.08)]'
                                  : ''
                              }
                            `}
                          >

                            {/* DROP INDICATOR */}

                            {isDragTarget && (
                              <div className="pointer-events-none absolute inset-x-4 top-0 z-20 h-0.5 bg-sky-400 shadow-[0_0_14px_rgba(56,189,248,0.9)]" />
                            )}

                            <div className="flex items-center gap-3 p-3 sm:p-4">

                              {/* DRAG HANDLE */}

                              <div
                                className={`
                                  flex shrink-0 cursor-grab
                                  items-center justify-center
                                  rounded-xl border
                                  border-white/5 bg-slate-950/60
                                  p-2.5 text-slate-600
                                  transition-all
                                  active:cursor-grabbing
                                  ${
                                    sortMode ===
                                    'manual'
                                      ? 'hover:border-sky-400/20 hover:bg-sky-400/10 hover:text-sky-400'
                                      : 'cursor-not-allowed opacity-40'
                                  }
                                `}
                                title={
                                  sortMode ===
                                  'manual'
                                    ? 'Drag to reorder'
                                    : 'Switch to Manual Drag to reorder'
                                }
                              >
                                <GripVertical className="h-5 w-5" />
                              </div>

                              {/* ORDER NUMBER */}

                              <div className="hidden w-8 shrink-0 text-center sm:block">
                                <span className="font-mono text-[10px] font-bold text-slate-600">
                                  {String(
                                    index + 1
                                  ).padStart(
                                    2,
                                    '0'
                                  )}
                                </span>
                              </div>

                              {/* THUMBNAIL */}

                              <div className="relative h-16 w-24 shrink-0 overflow-hidden rounded-xl border border-white/10 bg-slate-800 sm:h-20 sm:w-32">

                                <img
                                  src={
                                    project.thumbnail_url ||
                                    DEFAULT_THUMBNAIL
                                  }
                                  alt={
                                    project.title
                                  }
                                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                  referrerPolicy="no-referrer"
                                  onError={(
                                    event
                                  ) => {
                                    event.currentTarget.src =
                                      DEFAULT_THUMBNAIL;
                                  }}
                                />

                                {project.featured && (
                                  <div className="absolute left-1.5 top-1.5 rounded-md border border-amber-400/30 bg-amber-500/80 px-1.5 py-0.5 text-[8px] font-bold text-white backdrop-blur">
                                    FEATURED
                                  </div>
                                )}
                              </div>

                              {/* PROJECT INFO */}

                              <div className="min-w-0 flex-1">

                                <div className="flex items-center gap-2">

                                  <h4 className="truncate text-sm font-bold text-white">
                                    {project.title}
                                  </h4>

                                  {project.year && (
                                    <span className="hidden shrink-0 rounded-md bg-white/5 px-1.5 py-0.5 text-[9px] text-slate-500 sm:inline">
                                      {
                                        project.year
                                      }
                                    </span>
                                  )}
                                </div>

                                <p className="mt-1 line-clamp-2 max-w-2xl text-xs leading-relaxed text-slate-400">
                                  {
                                    project.short_description
                                  }
                                </p>

                                <div className="mt-2 flex items-center gap-2">

                                  {project.category && (
                                    <span className="rounded-md border border-sky-400/10 bg-sky-400/5 px-1.5 py-0.5 text-[9px] text-sky-300">
                                      {
                                        project.category
                                      }
                                    </span>
                                  )}

                                  {project.technologies?.length >
                                    0 && (
                                    <span className="hidden text-[9px] text-slate-600 sm:inline">
                                      {
                                        project
                                          .technologies
                                          .slice(
                                            0,
                                            3
                                          )
                                          .join(
                                            ' • '
                                          )
                                      }
                                    </span>
                                  )}
                                </div>
                              </div>

                              {/* POSITION CONTROLS */}

                              <div className="hidden flex-col gap-1 sm:flex">

                                <button
                                  type="button"
                                  disabled={
                                    sortMode !==
                                      'manual' ||
                                    index === 0 ||
                                    isReordering
                                  }
                                  onClick={() =>
                                    moveProjectUp(
                                      project.id
                                    )
                                  }
                                  className="rounded-lg border border-white/5 bg-slate-800 p-1.5 text-slate-500 transition hover:bg-slate-700 hover:text-sky-400 disabled:cursor-not-allowed disabled:opacity-20"
                                  title="Move up"
                                >
                                  <ArrowUp className="h-3 w-3" />
                                </button>

                                <button
                                  type="button"
                                  disabled={
                                    sortMode !==
                                      'manual' ||
                                    index ===
                                      orderedProjects.length -
                                        1 ||
                                    isReordering
                                  }
                                  onClick={() =>
                                    moveProjectDown(
                                      project.id
                                    )
                                  }
                                  className="rounded-lg border border-white/5 bg-slate-800 p-1.5 text-slate-500 transition hover:bg-slate-700 hover:text-sky-400 disabled:cursor-not-allowed disabled:opacity-20"
                                  title="Move down"
                                >
                                  <ArrowDown className="h-3 w-3" />
                                </button>
                              </div>

                              {/* ACTIONS */}

                              <div className="flex shrink-0 items-center gap-1.5">

                                {project.live_url && (
                                  <a
                                    href={
                                      project.live_url
                                    }
                                    target="_blank"
                                    rel="noreferrer"
                                    className="hidden rounded-lg p-2 text-slate-500 transition hover:bg-white/5 hover:text-sky-400 sm:block"
                                    title="Open live project"
                                  >
                                    <ExternalLink className="h-3.5 w-3.5" />
                                  </a>
                                )}

                                <button
                                  type="button"
                                  onClick={() =>
                                    handleStartEdit(
                                      project
                                    )
                                  }
                                  className="flex items-center gap-1 rounded-lg border border-white/10 bg-slate-800 px-2.5 py-2 text-[10px] font-semibold text-slate-200 transition hover:bg-slate-700 hover:text-white"
                                >
                                  <Edit2 className="h-3 w-3" />

                                  <span className="hidden sm:inline">
                                    Edit
                                  </span>
                                </button>

                                <button
                                  type="button"
                                  onClick={() => {
                                    if (
                                      window.confirm(
                                        `Delete "${project.title}"?`
                                      )
                                    ) {
                                      deleteProject(
                                        project.id
                                      );
                                    }
                                  }}
                                  className="flex items-center gap-1 rounded-lg border border-red-500/10 bg-red-600/10 px-2.5 py-2 text-[10px] font-semibold text-red-300 transition hover:bg-red-600/20"
                                >
                                  <Trash2 className="h-3 w-3" />

                                  <span className="hidden sm:inline">
                                    Delete
                                  </span>
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      }
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* ===================================================
            CERTIFICATIONS
        ==================================================== */}

        {activeTab === 'certifications' && (
          <div className="space-y-4">

            <div className="flex items-center justify-between">

              <div>
                <div className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-sky-400" />

                  <h3 className="text-base font-bold text-white">
                    Certification Credentials
                  </h3>
                </div>

                <p className="mt-1 text-xs text-slate-400">
                  Manage certifications displayed in your
                  public portfolio.
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  setShowCertForm(
                    (value) => !value
                  )
                }
                className="flex items-center gap-1.5 rounded-xl bg-sky-500 px-3 py-1.5 text-xs font-bold text-slate-950 shadow hover:bg-sky-400"
              >
                <Plus className="h-3.5 w-3.5" />

                <span>
                  {showCertForm
                    ? 'Hide Form'
                    : 'Add Certification'}
                </span>
              </button>
            </div>

            {showCertForm && (
              <div className="rounded-2xl border border-white/10 bg-slate-900/80 p-5">

                <h4 className="mb-4 text-xs font-bold uppercase tracking-wider text-white">
                  New Certification
                </h4>

                <form
                  onSubmit={
                    handleSaveCertification
                  }
                  className="space-y-3 text-xs"
                >

                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">

                    <input
                      type="text"
                      required
                      placeholder="Certification Name"
                      value={
                        newCert.name || ''
                      }
                      onChange={(e) =>
                        setNewCert({
                          ...newCert,
                          name: e.target.value,
                        })
                      }
                      className="rounded-xl border border-white/10 bg-slate-800 px-3 py-2 text-slate-100 outline-none focus:ring-1 focus:ring-sky-400"
                    />

                    <input
                      type="text"
                      required
                      placeholder="Issuing Organization"
                      value={
                        newCert.issuer || ''
                      }
                      onChange={(e) =>
                        setNewCert({
                          ...newCert,
                          issuer: e.target.value,
                        })
                      }
                      className="rounded-xl border border-white/10 bg-slate-800 px-3 py-2 text-slate-100 outline-none focus:ring-1 focus:ring-sky-400"
                    />

                    <input
                      type="text"
                      placeholder="Issue Date"
                      value={
                        newCert.issue_date || ''
                      }
                      onChange={(e) =>
                        setNewCert({
                          ...newCert,
                          issue_date:
                            e.target.value,
                        })
                      }
                      className="rounded-xl border border-white/10 bg-slate-800 px-3 py-2 text-slate-100 outline-none focus:ring-1 focus:ring-sky-400"
                    />

                    <input
                      type="url"
                      placeholder="Credential URL"
                      value={
                        newCert.credential_url ||
                        ''
                      }
                      onChange={(e) =>
                        setNewCert({
                          ...newCert,
                          credential_url:
                            e.target.value,
                        })
                      }
                      className="rounded-xl border border-white/10 bg-slate-800 px-3 py-2 text-slate-100 outline-none focus:ring-1 focus:ring-sky-400"
                    />
                  </div>

                  <textarea
                    rows={3}
                    placeholder="Description / Key Competencies"
                    value={
                      newCert.description || ''
                    }
                    onChange={(e) =>
                      setNewCert({
                        ...newCert,
                        description:
                          e.target.value,
                      })
                    }
                    className="w-full rounded-xl border border-white/10 bg-slate-800 px-3 py-2 text-slate-100 outline-none focus:ring-1 focus:ring-sky-400"
                  />

                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className="rounded-xl bg-sky-500 px-4 py-2 text-xs font-bold text-slate-950 hover:bg-sky-400"
                    >
                      Save Certification
                    </button>
                  </div>
                </form>
              </div>
            )}

            {certifications?.length === 0 ? (

              <div className="rounded-2xl border border-white/10 bg-slate-900/40 p-8 text-center text-xs text-slate-400">
                No certifications added yet.
              </div>

            ) : (

              <div className="overflow-hidden rounded-2xl border border-white/10 bg-slate-900/60">

                {certifications.map(
                  (certification) => (
                    <div
                      key={certification.id}
                      className="flex items-center justify-between gap-3 border-b border-white/5 p-4 last:border-0 hover:bg-white/5"
                    >
                      <div className="flex items-center gap-3">

                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-400/10 text-sky-400">
                          <Award className="h-4 w-4" />
                        </div>

                        <div>
                          <h4 className="text-sm font-bold text-white">
                            {
                              certification.name
                            }
                          </h4>

                          <p className="mt-0.5 text-xs text-slate-400">
                            {
                              certification.issuer
                            }{' '}
                            •{' '}
                            {
                              certification.issue_date
                            }
                          </p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          if (
                            window.confirm(
                              `Delete "${certification.name}"?`
                            )
                          ) {
                            deleteCertification(
                              certification.id
                            );
                          }
                        }}
                        className="rounded-lg bg-red-600/20 p-2 text-red-300 hover:bg-red-600/40"
                        title="Delete Certification"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  )
                )}
              </div>
            )}
          </div>
        )}

        {/* ===================================================
            MESSAGES
        ==================================================== */}

        {activeTab === 'messages' && (
          <div className="space-y-4">

            <div>
              <div className="flex items-center gap-2">
                <Inbox className="h-5 w-5 text-sky-400" />

                <h3 className="text-base font-bold text-white">
                  Contact Submissions Inbox
                </h3>
              </div>

              <p className="mt-1 text-xs text-slate-400">
                Messages submitted through your portfolio
                contact form.
              </p>
            </div>

            {contactSubmissions?.length === 0 ? (

              <div className="rounded-2xl border border-white/10 bg-slate-900/40 p-8 text-center text-xs text-slate-400">
                No inquiries received yet.
              </div>

            ) : (

              <div className="space-y-3">

                {contactSubmissions.map(
                  (message) => (
                    <div
                      key={message.id}
                      className={`space-y-2 rounded-2xl border p-4 text-xs ${
                        message.read
                          ? 'border-white/5 bg-slate-900/50'
                          : 'border-sky-500/30 bg-slate-900'
                      }`}
                    >

                      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">

                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-white">
                            {message.name}
                          </span>

                          <a
                            href={`mailto:${message.email}`}
                            className="text-xs text-sky-400 hover:underline"
                          >
                            ({message.email})
                          </a>
                        </div>

                        <div className="flex items-center gap-3">

                          <span className="font-mono text-[10px] text-slate-500">
                            {new Date(
                              message.createdAt
                            ).toLocaleString()}
                          </span>

                          {!message.read && (
                            <button
                              type="button"
                              onClick={() =>
                                markMessageRead(
                                  message.id
                                )
                              }
                              className="text-[10px] text-sky-400 hover:underline"
                            >
                              Mark Read
                            </button>
                          )}
                        </div>
                      </div>

                      <p className="rounded-xl border border-white/5 bg-slate-800/40 p-3 leading-relaxed text-slate-300">
                        {message.message}
                      </p>
                    </div>
                  )
                )}
              </div>
            )}
          </div>
        )}

        {/* ===================================================
            SYSTEM
        ==================================================== */}

        {activeTab === 'system' && (
          <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-6">

            <div className="flex items-center gap-3">

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-400/10 text-emerald-400">
                <Shield className="h-5 w-5" />
              </div>

              <div>
                <h3 className="text-sm font-bold text-white">
                  Portfolio System
                </h3>

                <p className="text-xs text-slate-500">
                  Abhishek OS Control Center
                </p>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">

              <div className="rounded-xl border border-white/5 bg-slate-950/50 p-4">
                <p className="text-[10px] uppercase text-slate-500">
                  Projects
                </p>

                <p className="mt-1 text-xl font-bold text-white">
                  {projects?.length || 0}
                </p>
              </div>

              <div className="rounded-xl border border-white/5 bg-slate-950/50 p-4">
                <p className="text-[10px] uppercase text-slate-500">
                  Certifications
                </p>

                <p className="mt-1 text-xl font-bold text-white">
                  {certifications?.length || 0}
                </p>
              </div>

              <div className="rounded-xl border border-white/5 bg-slate-950/50 p-4">
                <p className="text-[10px] uppercase text-slate-500">
                  Messages
                </p>

                <p className="mt-1 text-xl font-bold text-white">
                  {contactSubmissions?.length || 0}
                </p>
              </div>

              <div className="rounded-xl border border-white/5 bg-slate-950/50 p-4">
                <p className="text-[10px] uppercase text-slate-500">
                  Order Mode
                </p>

                <p className="mt-1 text-sm font-bold text-sky-400">
                  {sortMode === 'manual'
                    ? 'Manual'
                    : sortMode === 'asc'
                    ? 'A → Z'
                    : 'Z → A'}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};