"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";

type View = "today" | "calendar" | "goals" | "review" | "settings";
type Task = { id: number; title: string; category: string; minutes: number; importance: number; due: string; firstAction: string; completed: boolean; postponed: number };
type Goal = { id: number; title: string; why: string; target: string };

const initialTasks: Task[] = [
  { id: 1, title: "Finish portfolio case study", category: "Career", minutes: 50, importance: 5, due: "Tomorrow", firstAction: "Open the draft and write the outcome section", completed: false, postponed: 0 },
  { id: 2, title: "Prepare for design review", category: "Work", minutes: 35, importance: 4, due: "Today · 2:00 PM", firstAction: "List the three decisions the team needs to make", completed: false, postponed: 0 },
  { id: 3, title: "Take a restorative walk", category: "Wellbeing", minutes: 20, importance: 3, due: "Today", firstAction: "Put on shoes and step outside", completed: false, postponed: 0 },
  { id: 4, title: "Clear the important email", category: "Admin", minutes: 15, importance: 3, due: "Today", firstAction: "Reply with the next decision", completed: true, postponed: 0 },
];

const icons: Record<string, string> = { today: "✓", calendar: "▦", goals: "◎", review: "☷", settings: "⚙" };

export default function CareerCalendar() {
  const [view, setView] = useState<View>("today");
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [goals, setGoals] = useState<Goal[]>([{ id: 1, title: "Land a fulfilling design role", why: "Do meaningful work with a thoughtful team", target: "September 30" }]);
  const [modal, setModal] = useState<"task" | "goal" | null>(null);
  const [timerTask, setTimerTask] = useState<Task | null>(null);
  const [timerSeconds, setTimerSeconds] = useState(300);
  const [timerRunning, setTimerRunning] = useState(false);
  const [review, setReview] = useState({ wins: "", learned: "", tomorrow: "" });
  const [savedReview, setSavedReview] = useState(false);
  const [capacity, setCapacity] = useState(240);
  const [name, setName] = useState("Alex");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("career-calendar-state");
    if (saved) {
      try {
        const data = JSON.parse(saved);
        if (data.tasks) setTasks(data.tasks);
        if (data.goals) setGoals(data.goals);
        if (data.review) setReview(data.review);
        if (data.capacity) setCapacity(data.capacity);
        if (data.name) setName(data.name);
      } catch { localStorage.removeItem("career-calendar-state"); }
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (ready) localStorage.setItem("career-calendar-state", JSON.stringify({ tasks, goals, review, capacity, name }));
  }, [tasks, goals, review, capacity, name, ready]);

  useEffect(() => {
    if (!timerRunning) return;
    const interval = window.setInterval(() => setTimerSeconds(value => {
      if (value <= 1) { setTimerRunning(false); return 0; }
      return value - 1;
    }), 1000);
    return () => window.clearInterval(interval);
  }, [timerRunning]);

  const active = tasks.filter(task => !task.completed);
  const ranked = useMemo(() => [...active].sort((a, b) => b.importance - a.importance || a.minutes - b.minutes), [active]);
  const topThree = ranked.slice(0, 3);
  const planned = active.reduce((total, task) => total + task.minutes, 0);
  const completed = tasks.filter(task => task.completed).length;

  const toggleTask = (id: number) => setTasks(items => items.map(task => task.id === id ? { ...task, completed: !task.completed } : task));
  const deleteTask = (id: number) => setTasks(items => items.filter(task => task.id !== id));
  const postpone = (id: number) => setTasks(items => items.map(task => task.id === id ? { ...task, due: "Tomorrow", postponed: task.postponed + 1 } : task));
  const beginFocus = (task?: Task) => { setTimerTask(task || topThree[0] || null); setTimerSeconds(300); setTimerRunning(true); };

  return <div className="app-shell">
    <aside className="sidebar">
      <button className="brand" onClick={() => setView("today")}><span className="brand-mark">C</span><span>Career<br/><strong>Calendar</strong></span></button>
      <nav aria-label="Main navigation">{(["today", "calendar", "goals", "review"] as View[]).map(item => <button key={item} className={view === item ? "active" : ""} onClick={() => setView(item)}><span className="nav-icon">{icons[item]}</span><span>{item[0].toUpperCase() + item.slice(1)}</span>{item === "today" && active.length > 0 && <b>{active.length}</b>}</button>)}</nav>
      <div className="sidebar-bottom"><button className={view === "settings" ? "active" : ""} onClick={() => setView("settings")}><span className="nav-icon">⚙</span> Settings</button><div className="profile"><span>{name.slice(0, 2).toUpperCase()}</span><span><strong>{name} Morgan</strong><small>Local workspace</small></span></div></div>
    </aside>

    <main>
      {view === "today" && <>
        <header><div><p className="eyebrow">TODAY · YOUR DAILY PLAN</p><h1>Good morning, {name}.</h1><p>Here&apos;s a realistic plan for a meaningful day.</p></div><button className="add-task" onClick={() => setModal("task")}>＋ Add task</button></header>
        <section className="day-summary" aria-label="Today's progress"><div className="progress-ring" style={{ "--progress": `${tasks.length ? completed / tasks.length * 100 : 0}%` } as React.CSSProperties}><strong>{completed}</strong><span>of {tasks.length}</span></div><div className="progress-copy"><strong>{completed ? "A gentle start" : "A fresh start"}</strong><p>{completed ? "You’re making progress. Keep the next step small." : "Choose one small first action and begin when ready."}</p><div className="bar"><i style={{ width: `${tasks.length ? completed / tasks.length * 100 : 0}%` }}/></div></div><div className="capacity"><span>Today&apos;s capacity</span><strong>{planned}m <small>of {capacity}m</small></strong><em className={planned > capacity ? "over" : ""}>{planned > capacity ? "Too ambitious" : "Comfortable"}</em></div></section>
        {planned > capacity && <div className="capacity-warning" role="status">Your plan is {planned - capacity} minutes over capacity. Moving one task can make today feel more achievable.</div>}
        <section className="content-grid"><div className="primary-column"><div className="section-heading"><div><p className="eyebrow">YOUR FOCUS</p><h2>Three things that matter</h2></div><button onClick={() => setView("calendar")}>View all</button></div><div className="task-list">{topThree.length ? topThree.map(task => <TaskCard key={task.id} task={task} onToggle={toggleTask} onFocus={beginFocus} onPostpone={postpone}/>) : <Empty title="Your plan is clear" message="Add a task when something meaningful comes up." action={() => setModal("task")}/>}</div><button className="later" onClick={() => setModal("task")}><span>＋</span><span><strong>Add something for later</strong><small>Keep today focused. You can always plan ahead.</small></span></button></div>
          <aside className="right-column"><section className="focus-panel"><p className="eyebrow">READY WHEN YOU ARE</p><h2>{timerTask ? timerTask.title : "Start with five minutes."}</h2><p>You don&apos;t need to finish. Just make beginning a little easier.</p><div className="timer">{String(Math.floor(timerSeconds / 60)).padStart(2, "0")}<span>:</span>{String(timerSeconds % 60).padStart(2, "0")}</div><button onClick={() => timerSeconds === 0 ? (setTimerSeconds(300), setTimerRunning(true)) : setTimerRunning(!timerRunning)}>{timerRunning ? "Ⅱ Pause" : timerSeconds < 300 ? "▶ Continue" : "▶ Begin five-minute start"}</button>{timerSeconds < 300 && <button className="timer-reset" onClick={() => { setTimerRunning(false); setTimerSeconds(300); }}>Reset</button>}<small>No pressure. You can stop when the timer ends.</small></section><section className="schedule"><div className="section-heading"><div><p className="eyebrow">UP NEXT</p><h2>Today&apos;s rhythm</h2></div><button onClick={() => setView("calendar")}>View day</button></div><ol>{topThree.map((task, index) => <li key={task.id}><time>{["10:00", "12:30", "14:00"][index]}</time><span className="dot sage-bg"/><div><strong>{task.title}</strong><small>{task.minutes} min focus</small></div></li>)}</ol><p className="space-note">You have <strong>{Math.max(0, capacity - planned)} minutes of open space</strong> today.</p></section></aside></section>
      </>}

      {view === "calendar" && <Page title="Your plan" subtitle="Adjust today without losing sight of what matters." action={<button className="add-task" onClick={() => setModal("task")}>＋ Add task</button>}><div className="filter-row"><span>{active.length} active</span><span>{completed} completed</span><span>{planned} planned minutes</span></div><div className="all-tasks">{tasks.map(task => <div className={`manage-task ${task.completed ? "done" : ""}`} key={task.id}><button className="check" onClick={() => toggleTask(task.id)} aria-label={`Complete ${task.title}`}>{task.completed ? "✓" : ""}</button><div><span className="tag sage">{task.category} · {task.minutes} min</span><h3>{task.title}</h3><p>{task.firstAction}</p><small>{task.due}{task.postponed > 1 ? ` · Postponed ${task.postponed} times—try a smaller step` : ""}</small></div><div className="task-actions"><button onClick={() => beginFocus(task)}>Focus</button><button onClick={() => postpone(task.id)}>Tomorrow</button><button className="danger" onClick={() => deleteTask(task.id)}>Delete</button></div></div>)}</div></Page>}
      {view === "goals" && <Page title="Goals with a reason" subtitle="Keep only the outcomes you genuinely want to move forward." action={<button className="add-task" onClick={() => setModal("goal")}>＋ Add goal</button>}><div className="goal-grid">{goals.map(goal => <article className="goal-card" key={goal.id}><span className="goal-icon">◎</span><p className="eyebrow">ACTIVE GOAL</p><h2>{goal.title}</h2><p>{goal.why}</p><footer><span>Target: {goal.target || "No deadline"}</span><strong>{tasks.filter(t => !t.completed && t.category === "Career").length} next actions</strong></footer><button className="delete-link" onClick={() => setGoals(items => items.filter(g => g.id !== goal.id))}>Remove goal</button></article>)}</div></Page>}
      {view === "review" && <Page title="End the day kindly" subtitle="Notice what worked and make tomorrow a little more realistic."><form className="review-form" onSubmit={event => { event.preventDefault(); setSavedReview(true); window.setTimeout(() => setSavedReview(false), 2500); }}><label>What went well today?<textarea value={review.wins} onChange={e => setReview({ ...review, wins: e.target.value })} placeholder="A small win counts…"/></label><label>What did you learn about your plan?<textarea value={review.learned} onChange={e => setReview({ ...review, learned: e.target.value })} placeholder="My energy was best when…"/></label><label>What matters most tomorrow?<textarea value={review.tomorrow} onChange={e => setReview({ ...review, tomorrow: e.target.value })} placeholder="One meaningful outcome…"/></label><button className="add-task" type="submit">Save review</button>{savedReview && <span className="saved" role="status">✓ Review saved on this device</span>}</form></Page>}
      {view === "settings" && <Page title="Settings" subtitle="Shape Career Calendar around your real energy and time."><form className="settings-form" onSubmit={e => e.preventDefault()}><label>Your first name<input value={name} maxLength={30} onChange={e => setName(e.target.value)}/></label><label>Daily focus capacity <strong>{capacity} minutes</strong><input type="range" min="60" max="480" step="15" value={capacity} onChange={e => setCapacity(Number(e.target.value))}/></label><button className="danger-button" type="button" onClick={() => { if (confirm("Reset tasks, goals, and reviews on this device?")) { localStorage.removeItem("career-calendar-state"); location.reload(); } }}>Reset local data</button></form></Page>}
    </main>

    <nav className="mobile-nav" aria-label="Mobile navigation">{(["today", "calendar", "goals", "review"] as View[]).map(item => <button key={item} className={view === item ? "active" : ""} onClick={() => setView(item)}><span>{icons[item]}</span><small>{item === "calendar" ? "Plan" : item}</small></button>)}</nav>
    {modal === "task" && <TaskModal onClose={() => setModal(null)} onAdd={task => { setTasks(items => [...items, task]); setModal(null); }}/>}
    {modal === "goal" && <GoalModal onClose={() => setModal(null)} onAdd={goal => { setGoals(items => [...items, goal]); setModal(null); }}/>}
  </div>;
}

function TaskCard({ task, onToggle, onFocus, onPostpone }: { task: Task; onToggle: (id: number) => void; onFocus: (task: Task) => void; onPostpone: (id: number) => void }) {
  return <article className="task-card"><button className="check" onClick={() => onToggle(task.id)} aria-label={`Complete ${task.title}`}/><div className="task-main"><div className="tag sage">{task.category} · {task.minutes} min</div><h3>{task.title}</h3><p className="first-action"><span>First step</span> {task.firstAction}</p><p className="reason">✦ Importance {task.importance}/5 · {task.due}</p></div><div className="card-buttons"><button className="focus-button" onClick={() => onFocus(task)}>▶ <span>Start focus</span></button><button className="more-button" title="Move to tomorrow" onClick={() => onPostpone(task.id)}>↷</button></div></article>;
}

function Page({ title, subtitle, action, children }: { title: string; subtitle: string; action?: React.ReactNode; children: React.ReactNode }) { return <><header><div><p className="eyebrow">CAREER CALENDAR</p><h1>{title}</h1><p>{subtitle}</p></div>{action}</header>{children}</>; }
function Empty({ title, message, action }: { title: string; message: string; action: () => void }) { return <div className="empty"><span>✓</span><h3>{title}</h3><p>{message}</p><button onClick={action}>Add a task</button></div>; }

function TaskModal({ onClose, onAdd }: { onClose: () => void; onAdd: (task: Task) => void }) {
  const submit = (event: FormEvent<HTMLFormElement>) => { event.preventDefault(); const data = new FormData(event.currentTarget); onAdd({ id: Date.now(), title: String(data.get("title")), category: String(data.get("category")), minutes: Number(data.get("minutes")), importance: Number(data.get("importance")), due: String(data.get("due")), firstAction: String(data.get("firstAction")), completed: false, postponed: 0 }); };
  return <div className="modal-backdrop" onMouseDown={e => e.target === e.currentTarget && onClose()}><div className="modal" role="dialog" aria-modal="true" aria-labelledby="task-title"><button className="modal-close" onClick={onClose}>×</button><p className="eyebrow">A REALISTIC NEXT STEP</p><h2 id="task-title">Add a task</h2><form onSubmit={submit}><label>What needs doing?<input name="title" required autoFocus maxLength={200} placeholder="Prepare the presentation"/></label><label>What is the very first action?<input name="firstAction" required maxLength={240} placeholder="Open the slides and write the title"/></label><div className="form-row"><label>Category<select name="category"><option>Career</option><option>Work</option><option>Wellbeing</option><option>Home</option><option>Learning</option><option>Admin</option></select></label><label>Estimate<input name="minutes" type="number" min="5" max="720" step="5" defaultValue="30"/></label></div><div className="form-row"><label>Importance<select name="importance" defaultValue="3"><option value="1">1 — Low</option><option value="2">2</option><option value="3">3 — Medium</option><option value="4">4</option><option value="5">5 — Essential</option></select></label><label>When?<select name="due"><option>Today</option><option>Tomorrow</option><option>This week</option><option>No deadline</option></select></label></div><div className="modal-actions"><button type="button" onClick={onClose}>Cancel</button><button className="add-task" type="submit">Add to plan</button></div></form></div></div>;
}

function GoalModal({ onClose, onAdd }: { onClose: () => void; onAdd: (goal: Goal) => void }) {
  const submit = (event: FormEvent<HTMLFormElement>) => { event.preventDefault(); const data = new FormData(event.currentTarget); onAdd({ id: Date.now(), title: String(data.get("title")), why: String(data.get("why")), target: String(data.get("target")) }); };
  return <div className="modal-backdrop"><div className="modal" role="dialog" aria-modal="true"><button className="modal-close" onClick={onClose}>×</button><p className="eyebrow">MEANINGFUL DIRECTION</p><h2>Add a goal</h2><form onSubmit={submit}><label>What outcome matters?<input name="title" required autoFocus placeholder="Complete my certification"/></label><label>Why does this matter to you?<textarea name="why" required placeholder="This will help me…"/></label><label>Target date or season<input name="target" placeholder="October 15"/></label><div className="modal-actions"><button type="button" onClick={onClose}>Cancel</button><button className="add-task" type="submit">Add goal</button></div></form></div></div>;
}
