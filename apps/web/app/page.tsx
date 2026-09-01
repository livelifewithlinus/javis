"use client";

import { useState } from "react";
import {
  Activity, Bell, CalendarDays, CheckCircle2, ChevronDown, FileText,
  FolderKanban, Home, Menu, MessageSquare, Plus, Search, Settings,
  Sparkles, Users, X, Upload, BarChart3, SlidersHorizontal
} from "lucide-react";

const stats = [
  ["Total Conversations", "1,248", "12.5%", MessageSquare],
  ["Tasks Completed", "42", "16.3%", CheckCircle2],
  ["Upcoming Tasks", "8", "View schedule", CalendarDays],
  ["Files Processed", "256", "8.1%", FileText],
] as const;

const tasks = ["Review project documentation", "Analyze market trends", "Team standup meeting", "Generate monthly report"];
const taskTimes = ["Today, 6:00 PM", "Tomorrow, 10:00 AM", "May 2, 2:00 PM", "May 3, 9:00 AM"];
const conversations = ["AI Implementation Strategy", "Code Review Assistant", "Data Analysis Report", "Project Planning Discussion"];
const activity = ["Document processed", "New task created", "Conversation updated", "Report generated"];

function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`min-w-0 overflow-hidden rounded-2xl border border-white/10 bg-white/[.035] shadow-xl backdrop-blur ${className}`}>
      {children}
    </div>
  );
}

export default function Home() {
  const [mobileNav, setMobileNav] = useState(false);
  const [query, setQuery] = useState("");
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  const nav = [
    ["Dashboard", Home], ["Chat", MessageSquare], ["Tasks", CheckCircle2],
    ["Projects", FolderKanban], ["Calendar", CalendarDays], ["Knowledge Base", FileText], ["Files", FileText],
  ] as const;

  const secondary = [["Analytics", Activity], ["Reports", FileText], ["Logs", Activity]] as const;
  const system = [["Integrations", Sparkles], ["Settings", Settings], ["Users", Users]] as const;

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#050811] text-slate-100">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_50%_-10%,rgba(116,72,255,.18),transparent_35%)]" />
      <div className="relative flex min-h-screen">
        {mobileNav && <button aria-label="Close navigation" className="fixed inset-0 z-30 bg-black/70 backdrop-blur-sm lg:hidden" onClick={() => setMobileNav(false)} />}

        <aside className={`fixed inset-y-0 left-0 z-40 flex w-[min(82vw,280px)] flex-col border-r border-white/10 bg-[#070b15]/98 p-4 backdrop-blur-xl transition-transform duration-300 lg:static lg:w-64 lg:translate-x-0 ${mobileNav ? "translate-x-0" : "-translate-x-full"}`}>
          <div className="mb-6 flex items-center justify-between px-2">
            <div className="flex items-center gap-3">
              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full border-2 border-violet-400 shadow-[0_0_25px_rgba(139,92,246,.45)]"><Sparkles size={21} className="text-violet-300" /></div>
              <span className="text-2xl font-bold tracking-wide">JARVIS</span>
            </div>
            <button aria-label="Close menu" className="rounded-lg p-2 text-slate-400 hover:bg-white/5 lg:hidden" onClick={() => setMobileNav(false)}><X size={20} /></button>
          </div>

          <nav className="min-h-0 flex-1 space-y-1 overflow-y-auto pr-1">
            {nav.map(([label, Icon], i) => (
              <button key={label} onClick={() => setMobileNav(false)} className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm transition ${i === 0 ? "bg-violet-600/25 text-white shadow-inner" : "text-slate-400 hover:bg-white/5 hover:text-white"}`}><Icon size={18} />{label}</button>
            ))}
            <p className="mb-2 mt-7 px-4 text-[10px] font-semibold uppercase tracking-widest text-slate-600">Data & Analytics</p>
            {secondary.map(([label, Icon]) => <button key={label} onClick={() => setMobileNav(false)} className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm text-slate-400 hover:bg-white/5 hover:text-white"><Icon size={18} />{label}</button>)}
            <p className="mb-2 mt-7 px-4 text-[10px] font-semibold uppercase tracking-widest text-slate-600">System</p>
            {system.map(([label, Icon]) => <button key={label} onClick={() => setMobileNav(false)} className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm text-slate-400 hover:bg-white/5 hover:text-white"><Icon size={18} />{label}</button>)}
          </nav>

          <div className="mt-4 flex shrink-0 items-center gap-3 rounded-2xl border border-white/10 bg-white/[.03] p-3">
            <div className="relative grid h-9 w-9 shrink-0 place-items-center rounded-full bg-blue-500/15"><Sparkles size={16} className="text-blue-300" /><span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-[#070b15] bg-emerald-400" /></div>
            <div className="min-w-0"><p className="truncate text-sm font-medium">JARVIS AI</p><p className="text-xs text-slate-500">Online</p></div>
          </div>
        </aside>

        <section className="min-w-0 flex-1">
          <header className="sticky top-0 z-20 flex min-h-16 items-center gap-2 border-b border-white/10 bg-[#050811]/90 px-3 py-3 backdrop-blur-xl sm:gap-4 sm:px-5 lg:px-7">
            <button aria-label="Open navigation" className="shrink-0 rounded-xl border border-white/10 p-2 text-slate-300 hover:bg-white/5 lg:hidden" onClick={() => setMobileNav(true)}><Menu size={20} /></button>
            <div className="relative min-w-0 flex-1 sm:max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={17} />
              <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search anything..." className="w-full rounded-xl border border-white/10 bg-white/[.04] py-2.5 pl-9 pr-3 text-sm outline-none transition focus:border-violet-400/50 focus:bg-white/[.06] sm:pl-10 sm:pr-4" />
            </div>
            <div className="ml-auto flex shrink-0 items-center gap-1 text-slate-400 sm:gap-3">
              <button aria-label="Toggle appearance" className="hidden rounded-lg p-2 hover:bg-white/5 sm:block">☼</button>
              <div className="relative">
                <button aria-label="Notifications" onClick={() => { setShowNotifications(!showNotifications); setShowProfile(false); }} className="rounded-lg p-2 hover:bg-white/5"><Bell size={19} /><span className="absolute right-0 top-0 grid h-4 w-4 place-items-center rounded-full bg-violet-500 text-[9px] text-white">3</span></button>
                {showNotifications && <div className="absolute right-0 top-12 w-72 max-w-[calc(100vw-1.5rem)] rounded-2xl border border-white/10 bg-[#0a0f1c] p-4 shadow-2xl"><p className="font-semibold">Notifications</p><p className="mt-3 text-xs text-slate-400">3 new JARVIS events need your attention.</p></div>}
              </div>
              <div className="relative">
                <button aria-label="Open profile" onClick={() => { setShowProfile(!showProfile); setShowNotifications(false); }} className="flex items-center gap-2 rounded-xl p-1.5 hover:bg-white/5">
                  <div className="h-9 w-9 shrink-0 rounded-full bg-gradient-to-br from-orange-300 to-slate-700" />
                  <div className="hidden text-left text-xs md:block"><p className="text-white">Linus</p><p className="text-slate-500">Admin</p></div>
                  <ChevronDown size={14} className="hidden md:block" />
                </button>
                {showProfile && <div className="absolute right-0 top-12 w-48 rounded-2xl border border-white/10 bg-[#0a0f1c] p-2 shadow-2xl"><button className="w-full rounded-lg px-3 py-2 text-left text-sm hover:bg-white/5">Profile</button><button className="w-full rounded-lg px-3 py-2 text-left text-sm hover:bg-white/5">Settings</button></div>}
              </div>
            </div>
          </header>

          <div className="mx-auto max-w-[1500px] space-y-5 p-3 sm:p-5 lg:p-7">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0"><h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">Good evening, Linus 👋</h1><p className="mt-1 text-sm text-slate-400">Here’s what’s happening with JARVIS today.</p></div>
              <button className="flex w-full items-center justify-center gap-2 rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-medium shadow-lg shadow-violet-900/30 transition hover:bg-violet-500 sm:w-auto"><Plus size={17} /> New Task</button>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4 sm:gap-4">
              {stats.map(([title, value, delta, Icon]) => <Card key={title} className="p-4 sm:p-5"><div className="flex items-start justify-between gap-3"><div className="min-w-0"><p className="truncate text-xs text-slate-400">{title}</p><p className="mt-2 text-2xl font-semibold">{value}</p></div><div className="shrink-0 rounded-xl bg-violet-500/15 p-2.5 text-violet-300"><Icon size={20} /></div></div><p className="mt-4 text-xs text-emerald-400">{delta.includes("%") ? `↑ ${delta} from yesterday` : delta}</p></Card>)}
            </div>

            <div className="grid gap-4 xl:grid-cols-[minmax(0,1.6fr)_minmax(280px,1fr)_300px]">
              <Card className="p-4 sm:p-5">
                <div className="mb-5 flex items-center justify-between gap-3"><h2 className="font-semibold">Activity Overview</h2><button className="shrink-0 rounded-lg border border-white/10 px-2.5 py-1.5 text-xs text-slate-300 sm:px-3">This Week <ChevronDown className="ml-1 inline" size={13} /></button></div>
                <div className="h-48 w-full sm:h-56"><svg viewBox="0 0 700 220" preserveAspectRatio="none" className="h-full w-full"><defs><linearGradient id="fill" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor="#8b5cf6" stopOpacity=".3" /><stop offset="1" stopColor="#8b5cf6" stopOpacity="0" /></linearGradient></defs>{[30,70,110,150,190].map(y => <line key={y} x1="30" x2="680" y1={y} y2={y} stroke="rgba(255,255,255,.06)" />)}<path d="M30 165 L135 120 L240 75 L345 115 L450 55 L565 125 L680 160 L680 190 L30 190 Z" fill="url(#fill)" /><polyline points="30,165 135,120 240,75 345,115 450,55 565,125 680,160" fill="none" stroke="#8b5cf6" strokeWidth="3" />{[[30,165],[135,120],[240,75],[345,115],[450,55],[565,125],[680,160]].map(([x,y]) => <circle key={x} cx={x} cy={y} r="4" fill="#a78bfa" />)}<g fill="#64748b" fontSize="12" textAnchor="middle"><text x="30" y="210">Mon</text><text x="135" y="210">Tue</text><text x="240" y="210">Wed</text><text x="345" y="210">Thu</text><text x="450" y="210">Fri</text><text x="565" y="210">Sat</text><text x="680" y="210">Sun</text></g></svg></div>
              </Card>

              <Card className="p-4 sm:p-5"><h2 className="font-semibold">JARVIS AI Status</h2><div className="grid place-items-center py-6 sm:py-7"><div className="grid h-32 w-32 place-items-center rounded-full border-2 border-violet-500 shadow-[0_0_55px_rgba(139,92,246,.22)] sm:h-36 sm:w-36"><div className="grid h-20 w-20 place-items-center rounded-full border border-blue-400/50 bg-blue-500/10 shadow-[0_0_30px_rgba(59,130,246,.4)]"><Sparkles className="text-blue-300" /></div></div><p className="mt-5 text-sm text-emerald-400">✓ All systems operational</p></div><div className="grid grid-cols-3 gap-1 text-center text-[10px] text-slate-500 sm:text-xs"><span>Response Time<strong className="mt-1 block text-base text-white sm:text-lg">1.24s</strong></span><span>Accuracy<strong className="mt-1 block text-base text-white sm:text-lg">98.7%</strong></span><span>Uptime<strong className="mt-1 block text-base text-white sm:text-lg">99.9%</strong></span></div></Card>

              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-1"><Card className="p-4 sm:p-5"><h2 className="mb-4 font-semibold">System Status</h2>{["AI Service","Database","Vector Store","File Storage","Integrations"].map(x => <div key={x} className="flex items-center justify-between gap-2 py-1.5 text-xs"><span className="min-w-0 truncate text-slate-300"><i className="mr-2 inline-block h-2 w-2 rounded-full bg-emerald-400" />{x}</span><span className="shrink-0 text-emerald-400">Operational</span></div>)}</Card><Card className="p-4 sm:p-5"><h2 className="mb-4 font-semibold">Quick Actions</h2>{[["Start New Conversation", MessageSquare],["Create New Task", CheckCircle2],["Upload Documents", Upload],["Generate Report", BarChart3],["Add to Knowledge Base", FileText]].map(([x, Icon]) => <button key={String(x)} className="mb-2 flex w-full items-center gap-3 rounded-lg border border-white/5 bg-white/[.03] px-3 py-2 text-left text-xs text-slate-300 transition hover:bg-white/[.07]"><Icon size={14} className="shrink-0 text-violet-300" />{String(x)}</button>)}</Card></div>
            </div>

            <div className="grid gap-4 xl:grid-cols-2">
              <Card className="p-4 sm:p-5"><div className="mb-4 flex items-center justify-between gap-3"><h2 className="font-semibold">Upcoming Tasks</h2><button className="shrink-0 text-xs text-blue-400">View All →</button></div>{tasks.map((x,i) => <div key={x} className="flex items-start gap-3 border-t border-white/5 py-3"><span className="mt-0.5 shrink-0"><CheckCircle2 size={17} className="text-violet-400" /></span><span className="min-w-0 flex-1 text-sm text-slate-200">{x}</span><span className="shrink-0 text-right text-[10px] text-slate-500 sm:text-xs">{taskTimes[i]}</span></div>)}</Card>
              <Card className="p-4 sm:p-5"><div className="mb-4 flex items-center justify-between gap-3"><h2 className="font-semibold">Recent Conversations</h2><button className="shrink-0 text-xs text-blue-400">View All →</button></div>{conversations.map((x,i) => <div key={x} className="flex items-center gap-3 border-t border-white/5 py-3"><MessageSquare size={16} className="shrink-0 text-violet-400" /><span className="min-w-0 flex-1 truncate text-sm">{x}</span><span className="shrink-0 text-[10px] text-slate-500 sm:text-xs">{["10:30 AM","Yesterday","Yesterday","Apr 28"][i]}</span></div>)}</Card>
            </div>

            <Card className="p-4 sm:p-5"><div className="mb-4 flex items-center justify-between"><h2 className="font-semibold">Recent Activity</h2><SlidersHorizontal size={16} className="text-slate-500" /></div><div className="grid gap-0 sm:grid-cols-2 lg:grid-cols-4">{activity.map((x,i) => <div key={x} className="flex items-center justify-between gap-3 border-t border-white/5 py-3 text-xs sm:border-r sm:px-4 sm:first:border-l lg:border-t-0 lg:border-l lg:first:border-t-0"><span className="truncate text-slate-300">{x}</span><span className="shrink-0 text-slate-500">{["2m ago","15m ago","32m ago","1h ago"][i]}</span></div>)}</div></Card>
          </div>
        </section>
      </div>
    </main>
  );
}
