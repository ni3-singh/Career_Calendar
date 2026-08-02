const Icon = ({ name }: { name: string }) => {
  const paths: Record<string, React.ReactNode> = {
    today: <><path d="M3 9h18M8 3v3m8-3v3M5 5h14a2 2 0 0 1 2 2v13H3V7a2 2 0 0 1 2-2Z"/><path d="m8 14 2 2 5-5"/></>,
    calendar: <><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 10h18"/></>,
    goals: <><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/></>,
    review: <><path d="M4 4h16v16H4zM8 9h8M8 13h5"/><path d="m8 17 1 1 2-2"/></>,
    settings: <><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1-2.8 2.8-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.6v.2h-4V21a1.7 1.7 0 0 0-1-1.6 1.7 1.7 0 0 0-1.9.3l-.1.1L4.2 17l.1-.1a1.7 1.7 0 0 0 .3-1.9A1.7 1.7 0 0 0 3 14H3v-4h.1a1.7 1.7 0 0 0 1.6-1 1.7 1.7 0 0 0-.3-1.9L4.2 7 7 4.2l.1.1A1.7 1.7 0 0 0 9 4.6a1.7 1.7 0 0 0 1-1.6v-.2h4V3a1.7 1.7 0 0 0 1 1.6 1.7 1.7 0 0 0 1.9-.3l.1-.1L19.8 7l-.1.1a1.7 1.7 0 0 0-.3 1.9 1.7 1.7 0 0 0 1.6 1h.2v4H21a1.7 1.7 0 0 0-1.6 1Z"/></>,
    play: <path d="m9 7 8 5-8 5Z" fill="currentColor"/>,
  };
  return <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">{paths[name]}</svg>;
};

const tasks = [
  { title: "Finish portfolio case study", meta: "Career · 50 min", action: "Open the draft and write the outcome section", tone: "sage", reason: "Due tomorrow · Moves your career goal forward" },
  { title: "Prepare for design review", meta: "Work · 35 min", action: "List the three decisions the team needs to make", tone: "blue", reason: "High importance · Scheduled for 2:00 PM" },
  { title: "Take a restorative walk", meta: "Wellbeing · 20 min", action: "Put on shoes and step outside", tone: "peach", reason: "Supports your energy · Fits your capacity" },
];

export default function TodayPage() {
  return <div className="app-shell">
    <aside className="sidebar">
      <a className="brand" href="#"><span className="brand-mark">C</span><span>Career<br/><strong>Calendar</strong></span></a>
      <nav aria-label="Main navigation">
        {[["today","Today"],["calendar","Calendar"],["goals","Goals"],["review","Review"]].map(([icon,label]) => <a className={label === "Today" ? "active" : ""} href="#" key={label}><Icon name={icon}/><span>{label}</span></a>)}
      </nav>
      <div className="sidebar-bottom"><a href="#"><Icon name="settings"/><span>Settings</span></a><button className="profile"><span>AM</span><span><strong>Alex Morgan</strong><small>alex@example.com</small></span><b>···</b></button></div>
    </aside>

    <main>
      <header><div><p className="eyebrow">SUNDAY · AUGUST 2</p><h1>Good morning, Alex.</h1><p>Here&apos;s a realistic plan for a meaningful day.</p></div><button className="add-task"><span>＋</span> Add task</button></header>

      <section className="day-summary" aria-label="Today's progress">
        <div className="progress-ring"><strong>1</strong><span>of 4</span></div>
        <div className="progress-copy"><strong>A gentle start</strong><p>You&apos;ve completed one task. Your plan has room to breathe.</p><div className="bar"><i/></div></div>
        <div className="capacity"><span>Today&apos;s capacity</span><strong>2h 25m <small>of 4h</small></strong><em>Comfortable</em></div>
      </section>

      <section className="content-grid">
        <div className="primary-column">
          <div className="section-heading"><div><p className="eyebrow">YOUR FOCUS</p><h2>Three things that matter</h2></div><button aria-label="More focus options">•••</button></div>
          <div className="task-list">
            {tasks.map((task,index) => <article className="task-card" key={task.title}>
              <button className="check" aria-label={`Complete ${task.title}`}/><div className="task-main"><div className={`tag ${task.tone}`}>{task.meta}</div><h3>{task.title}</h3><p className="first-action"><span>First step</span> {task.action}</p><p className="reason">✦ {task.reason}</p></div>{index === 0 && <button className="focus-button"><Icon name="play"/><span>Start focus</span></button>}
            </article>)}
          </div>
          <button className="later"><span>＋</span><span><strong>Add something for later</strong><small>Keep today focused. You can always plan ahead.</small></span></button>
        </div>

        <aside className="right-column">
          <section className="focus-panel"><p className="eyebrow">READY WHEN YOU ARE</p><h2>Start with five minutes.</h2><p>You don&apos;t need to finish. Just make beginning a little easier.</p><div className="timer">05<span>:</span>00</div><button><Icon name="play"/> Begin five-minute start</button><small>No pressure. You can stop when the timer ends.</small></section>
          <section className="schedule"><div className="section-heading"><div><p className="eyebrow">UP NEXT</p><h2>Today&apos;s rhythm</h2></div><a href="#">View day</a></div><ol><li><time>10:00</time><span className="dot sage-bg"/><div><strong>Portfolio case study</strong><small>50 min focus</small></div></li><li><time>12:30</time><span className="dot peach-bg"/><div><strong>Lunch &amp; walk</strong><small>45 min break</small></div></li><li><time>14:00</time><span className="dot blue-bg"/><div><strong>Design review</strong><small>Team meeting</small></div></li></ol><p className="space-note">You have <strong>1h 35m of open space</strong> today.</p></section>
          <blockquote>“Small steps count. Starting is progress.”</blockquote>
        </aside>
      </section>
    </main>
    <nav className="mobile-nav" aria-label="Mobile navigation">{[["today","Today"],["calendar","Plan"],["goals","Goals"],["review","Review"]].map(([icon,label])=><a className={label === "Today" ? "active" : ""} href="#" key={label}><Icon name={icon}/><span>{label}</span></a>)}</nav>
  </div>;
}
