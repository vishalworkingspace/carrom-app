import { useState, useEffect } from "react";

const uid = () => Math.random().toString(36).slice(2, 9);
const STORAGE_KEY = "carrom_master_v4";
function load() { try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {}; } catch { return {}; } }
function save(d) { try { localStorage.setItem(STORAGE_KEY, JSON.stringify(d)); } catch {} }

// ─── CSS ─────────────────────────────────────────────────────────────────────
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Sans:wght@300;400;500;600&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
html{-webkit-text-size-adjust:100%}
:root{
  --cream:#faf8f3;--warm:#f5f0e8;--gold:#c9973f;--gold-l:#e8c97a;--gold-d:#9a6f2a;
  --brown:#5c3d1e;--green:#2d6a4f;--green-l:#52b788;--red:#c1121f;
  --slate:#4a5568;--slate-l:#718096;--white:#fff;
  --shadow:0 4px 24px rgba(92,61,30,.12);--shadow-lg:0 12px 48px rgba(92,61,30,.18);
  --r:16px;--fd:'Playfair Display',serif;--fb:'DM Sans',sans-serif;
}
body{font-family:var(--fb);background:var(--cream);color:var(--brown);min-height:100vh;overflow-x:hidden}

/* ── Nav ── */
.nav{background:var(--white);border-bottom:2px solid var(--warm);padding:0 20px;display:flex;align-items:center;justify-content:space-between;height:60px;position:sticky;top:0;z-index:100;box-shadow:0 2px 12px rgba(92,61,30,.08)}
.nav-logo{font-family:var(--fd);font-size:18px;color:var(--brown);font-weight:900;cursor:pointer;display:flex;align-items:center;gap:8px;flex-shrink:0}
.nav-actions{display:flex;gap:8px;flex-wrap:wrap}

/* ── Buttons ── */
.btn{font-family:var(--fb);font-weight:600;font-size:14px;border:none;border-radius:10px;padding:10px 18px;cursor:pointer;transition:all .2s;display:inline-flex;align-items:center;justify-content:center;gap:6px;line-height:1;text-align:center}
.btn-primary{background:var(--gold);color:var(--white)}
.btn-primary:hover{background:var(--gold-d);transform:translateY(-1px);box-shadow:0 4px 16px rgba(201,151,63,.4)}
.btn-secondary{background:var(--warm);color:var(--brown);border:1.5px solid #e0d5c5}
.btn-secondary:hover{background:#ede5d5}
.btn-danger{background:#fff0f0;color:var(--red);border:1.5px solid #ffd6d6}
.btn-danger:hover{background:#ffe0e0}
.btn-success{background:#f0faf5;color:var(--green);border:1.5px solid #b7e4c7}
.btn-success:hover{background:#d8f3e3}
.btn-sm{padding:7px 12px;font-size:13px}
.btn-lg{padding:14px 28px;font-size:16px;border-radius:14px}
.btn:disabled{opacity:.45;cursor:not-allowed;transform:none!important;box-shadow:none!important}
.btn-full{width:100%}

/* ── Hero ── */
.hero{background:linear-gradient(135deg,#3d2008,#6b3a1e 50%,#9a6f2a);min-height:calc(100vh - 60px);display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:40px 20px;position:relative;overflow:hidden}
.hero::before{content:'';position:absolute;inset:0;background:radial-gradient(ellipse 70% 50% at 50% 40%,rgba(201,151,63,.18),transparent 70%)}
.hero-disc{font-size:64px;margin-bottom:18px;animation:float 3s ease-in-out infinite;position:relative}
@keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}}
.hero h1{font-family:var(--fd);font-size:clamp(34px,9vw,72px);color:var(--white);font-weight:900;line-height:1.05;margin-bottom:12px;position:relative}
.hero h1 span{color:var(--gold-l)}
.hero p{font-size:16px;color:rgba(255,255,255,.72);margin-bottom:32px;position:relative}
.hero-cta{background:var(--gold);color:var(--white);font-size:16px;font-weight:700;padding:15px 40px;border-radius:14px;border:none;cursor:pointer;font-family:var(--fb);transition:all .3s;box-shadow:0 8px 32px rgba(201,151,63,.5);position:relative}
.hero-cta:hover{transform:translateY(-3px);box-shadow:0 12px 40px rgba(201,151,63,.6);background:#d4a84b}
.hero-stats{display:flex;gap:28px;margin-top:44px;position:relative;flex-wrap:wrap;justify-content:center}
.hero-stat{color:rgba(255,255,255,.78);text-align:center}
.hero-stat strong{display:block;font-size:28px;font-weight:700;color:var(--gold-l);font-family:var(--fd)}

/* ── Layout ── */
.page{padding:28px 20px;max-width:900px;margin:0 auto;width:100%}
.section-title{font-family:var(--fd);font-size:24px;font-weight:900;color:var(--brown);margin-bottom:20px}

/* ── Card ── */
.card{background:var(--white);border-radius:var(--r);padding:20px;box-shadow:var(--shadow);border:1.5px solid rgba(201,151,63,.12);transition:box-shadow .2s,transform .2s}
.card-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:16px}
.t-card{cursor:pointer}
.t-card:hover{transform:translateY(-2px);box-shadow:var(--shadow-lg)}
.t-card-name{font-family:var(--fd);font-size:18px;font-weight:700;color:var(--brown);margin-bottom:4px}

/* ── Badge / Chip ── */
.badge{display:inline-flex;align-items:center;padding:3px 10px;border-radius:20px;font-size:12px;font-weight:600}
.badge-active{background:#e8f5ee;color:var(--green)}
.badge-done{background:#fff8e6;color:var(--gold-d)}
.chip{display:inline-flex;align-items:center;padding:4px 10px;border-radius:20px;font-size:12px;font-weight:600;background:var(--warm);color:var(--brown)}
.chip-green{background:#e8f5ee;color:var(--green)}
.chip-red{background:#fff0f0;color:var(--red)}
.chip-gold{background:#fff8e6;color:var(--gold-d)}

/* ── Form ── */
.form-group{margin-bottom:16px}
.form-label{display:block;font-weight:600;font-size:13px;color:var(--brown);margin-bottom:5px}
.form-input,.form-select,.form-textarea{width:100%;font-family:var(--fb);font-size:15px;border:1.5px solid #ddd5c4;border-radius:10px;padding:10px 13px;color:var(--brown);background:var(--white);outline:none;transition:border-color .2s,box-shadow .2s}
.form-input:focus,.form-select:focus,.form-textarea:focus{border-color:var(--gold);box-shadow:0 0 0 3px rgba(201,151,63,.15)}
.form-textarea{resize:vertical;min-height:80px}
.form-row{display:grid;grid-template-columns:1fr 1fr;gap:12px}
.form-hint{font-size:12px;color:var(--slate-l);margin-top:5px}

/* ── Steps ── */
.steps{display:flex;margin-bottom:28px;overflow-x:auto;padding-bottom:4px;gap:0}
.step-item{flex:1;min-width:70px;display:flex;flex-direction:column;align-items:center;position:relative}
.step-item:not(:last-child)::after{content:'';position:absolute;top:16px;left:60%;width:80%;height:2px;background:#e0d5c5}
.step-item.done:not(:last-child)::after{background:var(--gold)}
.step-circle{width:32px;height:32px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:13px;border:2px solid #e0d5c5;background:var(--white);color:var(--slate-l);margin-bottom:5px;position:relative;z-index:1;transition:all .3s}
.step-item.active .step-circle,.step-item.done .step-circle{border-color:var(--gold);background:var(--gold);color:var(--white)}
.step-label{font-size:10px;color:var(--slate-l);font-weight:500;text-align:center;line-height:1.2}
.step-item.active .step-label{color:var(--gold-d);font-weight:600}

/* ── Tabs ── */
.tabs{display:flex;gap:4px;background:var(--warm);padding:4px;border-radius:12px;margin-bottom:22px;overflow-x:auto}
.tab{padding:8px 16px;border-radius:9px;font-weight:600;font-size:13px;cursor:pointer;border:none;background:transparent;color:var(--slate);transition:all .2s;white-space:nowrap;font-family:var(--fb)}
.tab.active{background:var(--white);color:var(--brown);box-shadow:0 2px 8px rgba(92,61,30,.1)}

/* ── Progress ── */
.progress-bar{height:10px;background:var(--warm);border-radius:5px;overflow:hidden}
.progress-fill{height:100%;border-radius:5px;transition:width .6s ease}
.progress-fill-gold{background:linear-gradient(90deg,var(--gold),var(--gold-l))}
.progress-fill-green{background:linear-gradient(90deg,var(--green),var(--green-l))}
.progress-fill-red{background:linear-gradient(90deg,#e63946,#ff758f)}

/* ── Match Record Card (big center piece) ── */
.match-record-box{background:var(--white);border-radius:20px;padding:24px;box-shadow:var(--shadow-lg);border:2px solid rgba(201,151,63,.2);margin-bottom:24px}
.match-num-badge{font-size:12px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:var(--slate-l);margin-bottom:16px}
.match-vs-row{display:flex;align-items:stretch;gap:12px;margin-bottom:16px}
.match-team-btn{flex:1;padding:16px 12px;border-radius:14px;border:2px solid #e0d5c5;background:var(--white);cursor:pointer;text-align:center;transition:all .25s;font-family:var(--fb)}
.match-team-btn:hover{border-color:var(--green-l);background:#f0faf5;transform:translateY(-2px);box-shadow:0 6px 20px rgba(45,106,79,.15)}
.match-team-btn .team-emoji{font-size:28px;display:block;margin-bottom:6px}
.match-team-btn .team-btn-name{font-weight:700;font-size:15px;color:var(--brown);display:block;margin-bottom:3px}
.match-team-btn .team-btn-wins{font-size:12px;color:var(--slate-l)}
.match-team-btn.winner-btn{border-color:var(--green);background:linear-gradient(135deg,#f0faf5,#e8f5ee)}
.match-team-btn.loser-btn{border-color:#ffd6d6;background:#fff8f8;opacity:.7}
.match-vs-divider{display:flex;align-items:center;justify-content:center;font-weight:900;font-size:14px;color:var(--slate-l);min-width:32px}

/* ── Race Track (wins progress) ── */
.race-track{background:var(--white);border-radius:var(--r);padding:20px;box-shadow:var(--shadow);border:1.5px solid rgba(201,151,63,.12);margin-bottom:20px}
.race-team{margin-bottom:16px}
.race-team:last-child{margin-bottom:0}
.race-header{display:flex;align-items:center;justify-content:space-between;margin-bottom:8px}
.race-name{font-weight:700;font-size:15px;color:var(--brown);display:flex;align-items:center;gap:8px}
.race-score{font-family:var(--fd);font-size:20px;font-weight:900;color:var(--brown)}
.race-sub{font-size:12px;color:var(--slate-l)}
.wins-to-go{font-size:13px;font-weight:700;padding:4px 12px;border-radius:20px;background:#fff8e6;color:var(--gold-d)}
.wins-to-go.close{background:#e8f5ee;color:var(--green);animation:pulse 1.5s ease-in-out infinite}
@keyframes pulse{0%,100%{opacity:1}50%{opacity:.65}}

/* ── History List ── */
.history-item{display:flex;align-items:center;gap:10px;padding:10px 0;border-bottom:1px solid var(--warm)}
.history-item:last-child{border-bottom:none}
.history-num{font-size:11px;font-weight:700;color:var(--slate-l);min-width:28px}
.history-teams{flex:1;font-size:14px;font-weight:600;color:var(--brown)}
.history-winner{font-size:13px;font-weight:600}

/* ── Team Row ── */
.team-row{display:flex;align-items:center;justify-content:space-between;padding:14px 0;border-bottom:1px solid var(--warm)}
.team-row:last-child{border-bottom:none}
.team-avatar{width:40px;height:40px;border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:20px;flex-shrink:0}

/* ── Winner ── */
.winner-overlay{position:fixed;inset:0;background:rgba(92,61,30,.88);z-index:1000;display:flex;align-items:center;justify-content:center;padding:20px}
.winner-box{background:var(--white);border-radius:24px;padding:40px 28px;text-align:center;max-width:420px;width:100%;box-shadow:0 24px 80px rgba(92,61,30,.5);animation:popIn .4s cubic-bezier(.34,1.56,.64,1)}
@keyframes popIn{from{transform:scale(.6);opacity:0}to{transform:scale(1);opacity:1}}
.winner-trophy{font-size:70px;margin-bottom:12px;display:block;animation:bounce 1s ease-in-out infinite}
@keyframes bounce{0%,100%{transform:translateY(0) rotate(-5deg)}50%{transform:translateY(-10px) rotate(5deg)}}
.winner-title{font-family:var(--fd);font-size:32px;font-weight:900;color:var(--gold-d);margin-bottom:6px}
.winner-team{font-size:22px;font-weight:700;color:var(--brown);margin-bottom:18px}

/* ── Info Box ── */
.info-box{background:#fffbf0;border:1.5px solid var(--gold-l);border-radius:12px;padding:14px 16px;margin-top:8px}

/* ── Misc ── */
.divider{height:1px;background:var(--warm);margin:18px 0}
.flex-between{display:flex;align-items:center;justify-content:space-between}
.flex-center{display:flex;align-items:center;justify-content:center}
.gap-2{gap:8px}
.mb-2{margin-bottom:8px}
.mb-3{margin-bottom:12px}
.mb-4{margin-bottom:16px}
.mb-6{margin-bottom:24px}
.text-sm{font-size:13px}
.text-xs{font-size:11px}
.text-muted{color:var(--slate-l)}
.fw-7{font-weight:700}
.fd{font-family:var(--fd)}
.player-chip{display:inline-flex;align-items:center;gap:4px;background:var(--warm);border-radius:8px;padding:4px 10px;font-size:12px;font-weight:500;margin:2px}
.confetti-canvas{position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:999}
.empty-state{text-align:center;padding:48px 20px;color:var(--slate-l)}
.empty-icon{font-size:40px;margin-bottom:12px}
.stat-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(140px,1fr));gap:12px;margin-bottom:24px}
.stat-card{background:var(--white);border-radius:14px;padding:16px;box-shadow:var(--shadow);border:1.5px solid rgba(201,151,63,.12);text-align:center}
.stat-num{font-family:var(--fd);font-size:30px;font-weight:900}
.stat-label{font-size:11px;color:var(--slate-l);font-weight:500;margin-top:2px}
.rule-add-row{display:flex;gap:8px;margin-bottom:10px}

/* ── Notes/Rules simple list ── */
.note-item{display:flex;align-items:flex-start;gap:8px;padding:10px 0;border-bottom:1px solid var(--warm)}
.note-item:last-child{border-bottom:none}
.note-num{font-family:var(--fd);font-size:16px;font-weight:700;color:var(--gold-d);min-width:24px;line-height:1.4}
.note-text{flex:1;font-size:14px;color:var(--brown);line-height:1.5}

/* ── Responsive ── */
@media(max-width:480px){
  .form-row{grid-template-columns:1fr}
  .hero-stats{gap:16px}
  .nav{padding:0 14px;height:56px}
  .nav-logo{font-size:16px}
  .page{padding:18px 14px}
  .card{padding:16px}
  .match-vs-row{gap:8px}
  .match-team-btn{padding:12px 8px}
  .match-team-btn .team-emoji{font-size:22px}
  .match-team-btn .team-btn-name{font-size:13px}
  .btn-lg{padding:12px 22px;font-size:15px}
  .winner-box{padding:28px 20px}
  .stat-grid{grid-template-columns:1fr 1fr}
}
@media(max-width:360px){
  .hero h1{font-size:30px}
  .match-vs-row{flex-direction:column}
}
`;

// ─── Confetti ─────────────────────────────────────────────────────────────────
function Confetti() {
  useEffect(() => {
    const canvas = document.getElementById("cc2");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    resize();
    window.addEventListener("resize", resize);
    const colors = ["#c9973f","#e8c97a","#2d6a4f","#52b788","#c1121f","#ff9f1c"];
    const pieces = Array.from({length:100},()=>({
      x:Math.random()*canvas.width, y:Math.random()*-canvas.height,
      r:Math.random()*9+4, color:colors[Math.floor(Math.random()*colors.length)],
      speed:Math.random()*4+2, angle:Math.random()*360, spin:Math.random()*5-2.5,
    }));
    let raf;
    const draw = () => {
      ctx.clearRect(0,0,canvas.width,canvas.height);
      pieces.forEach(p=>{
        ctx.save(); ctx.translate(p.x,p.y); ctx.rotate(p.angle*Math.PI/180);
        ctx.fillStyle=p.color; ctx.fillRect(-p.r/2,-p.r/2,p.r,p.r); ctx.restore();
        p.y+=p.speed; p.angle+=p.spin; if(p.y>canvas.height) p.y=-10;
      });
      raf=requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize",resize); };
  }, []);
  return <canvas id="cc2" className="confetti-canvas"/>;
}

// ─── Team emojis ─────────────────────────────────────────────────────────────
const TEAM_EMOJIS = ["🔵","🔴","🟢","🟡","🟠","🟣","⚫","🟤"];
const MEDALS = ["🥇","🥈","🥉","4️⃣","5️⃣","6️⃣"];

// ─── Main App ─────────────────────────────────────────────────────────────────
export default function App() {
  const [db, setDb] = useState(()=>load());
  const [view, setView] = useState("home");
  const [activeTid, setActiveTid] = useState(null);
  const [winner, setWinner] = useState(null);

  // Create wizard state
  const [step, setStep] = useState(0);
  const [tName, setTName] = useState("");
  const [numTeams, setNumTeams] = useState(2);
  const [winsRequired, setWinsRequired] = useState(10);
  const [totalPoints, setTotalPoints] = useState(500);
  const [teams, setTeams] = useState([{id:uid(),name:"Team 1"},{id:uid(),name:"Team 2"}]);
  const [notes, setNotes] = useState(["No player should play more than 6 consecutive matches."]);
  const [noteInput, setNoteInput] = useState("");

  const persist = (nd) => { setDb(nd); save(nd); };
  const tournaments = Object.values(db);
  const activeTournament = db[activeTid];

  // Auto calc points per win
  const pointsPerWin = winsRequired > 0 ? Math.round(totalPoints / winsRequired) : 0;

  function goHome() { setView("home"); setActiveTid(null); setWinner(null); }
  function openT(id) { setActiveTid(id); setView("tournament"); setWinner(null); }

  function startCreate() {
    setStep(0); setTName(""); setNumTeams(2); setWinsRequired(10); setTotalPoints(500);
    setTeams([{id:uid(),name:"Team 1"},{id:uid(),name:"Team 2"}]);
    setNotes(["No player should play more than 6 consecutive matches."]);
    setNoteInput("");
    setView("create");
  }

  function syncTeams(n) {
    const num = parseInt(n)||2;
    setNumTeams(num);
    setTeams(prev => {
      const arr=[];
      for(let i=0;i<num;i++) arr.push(prev[i]||{id:uid(),name:`Team ${i+1}`});
      return arr;
    });
  }

  function canNext() {
    if(step===0) return tName.trim().length>0 && teams.every(t=>t.name.trim());
    if(step===1) return winsRequired>=1;
    return true;
  }

  function createTournament() {
    const ppw = Math.round(totalPoints / winsRequired);
    const t = {
      id:uid(), name:tName.trim()||"Tournament",
      winsRequired, totalPoints, pointsPerWin:ppw,
      teams: teams.map((t,i)=>({...t, wins:0, losses:0, points:0, emoji:TEAM_EMOJIS[i]})),
      history: [],   // [{matchNum, winnerId, loserId}]
      notes, status:"active", createdAt:Date.now(), winnerId:null,
      matchCount:0,
    };
    const nd={...db,[t.id]:t};
    persist(nd);
    openT(t.id);
  }

  function recordWin(winnerTeamId) {
    const t={...activeTournament};
    const loserTeamId = t.teams.find(x=>x.id!==winnerTeamId)?.id;
    t.matchCount = (t.matchCount||0)+1;
    t.history = [...(t.history||[]), {matchNum:t.matchCount, winnerId:winnerTeamId, loserId:loserTeamId}];
    t.teams = t.teams.map(tm=>{
      if(tm.id===winnerTeamId) return {...tm, wins:tm.wins+1, points:tm.points+(t.pointsPerWin||0)};
      if(tm.id===loserTeamId) return {...tm, losses:tm.losses+1};
      return tm;
    });
    const winTeam = t.teams.find(tm=>tm.id===winnerTeamId);
    if(winTeam && winTeam.wins>=t.winsRequired) {
      t.status="completed"; t.winnerId=winnerTeamId; setWinner(winTeam);
    }
    persist({...db,[t.id]:t});
  }

  function undoLastMatch() {
    const t={...activeTournament};
    if(!t.history||t.history.length===0) return;
    const last=t.history[t.history.length-1];
    t.history=t.history.slice(0,-1);
    t.matchCount=(t.matchCount||1)-1;
    t.status="active"; t.winnerId=null;
    t.teams=t.teams.map(tm=>{
      if(tm.id===last.winnerId) return {...tm,wins:Math.max(0,tm.wins-1),points:Math.max(0,tm.points-(t.pointsPerWin||0))};
      if(tm.id===last.loserId) return {...tm,losses:Math.max(0,tm.losses-1)};
      return tm;
    });
    persist({...db,[t.id]:t});
    setWinner(null);
  }

  function deleteT(id) {
    const nd={...db}; delete nd[id]; persist(nd);
    if(activeTid===id) goHome();
  }

  return (
    <>
      <style>{CSS}</style>
      <nav className="nav">
        <div className="nav-logo" onClick={goHome}><span>🎯</span>Carrom Master</div>
        <div className="nav-actions">
          <button className="btn btn-secondary btn-sm" onClick={()=>setView("list")}>All</button>
          <button className="btn btn-primary btn-sm" onClick={startCreate}>+ New</button>
        </div>
      </nav>

      {view==="home" && <HeroPage onStart={startCreate} tournaments={tournaments} onOpen={openT}/>}
      {view==="list" && <TournamentList tournaments={tournaments} onOpen={openT} onCreate={startCreate} onDelete={deleteT}/>}
      {view==="create" && (
        <CreateWizard
          step={step} setStep={setStep} canNext={canNext}
          tName={tName} setTName={setTName}
          numTeams={numTeams} syncTeams={syncTeams}
          teams={teams} setTeams={setTeams}
          winsRequired={winsRequired} setWinsRequired={setWinsRequired}
          totalPoints={totalPoints} setTotalPoints={setTotalPoints}
          pointsPerWin={pointsPerWin}
          notes={notes} setNotes={setNotes}
          noteInput={noteInput} setNoteInput={setNoteInput}
          onCreate={createTournament}
        />
      )}
      {view==="tournament" && activeTournament && (
        <TournamentView t={activeTournament} onWin={recordWin} onUndo={undoLastMatch} onDelete={()=>deleteT(activeTid)} onBack={goHome}/>
      )}
      {winner && (<><Confetti/><WinnerBanner team={winner} onClose={()=>setWinner(null)}/></>)}
    </>
  );
}

// ─── Hero ─────────────────────────────────────────────────────────────────────
function HeroPage({onStart,tournaments,onOpen}) {
  const active=tournaments.filter(t=>t.status==="active");
  const done=tournaments.filter(t=>t.status==="completed");
  return (
    <>
      <div className="hero">
        <div className="hero-disc">🎯</div>
        <h1>Carrom <span>Master</span></h1>
        <p>Track tournaments · Manage teams · Crown champions</p>
        <button className="hero-cta" onClick={onStart}>🏆 Create New Tournament</button>
        <div className="hero-stats">
          <div className="hero-stat"><strong>{tournaments.length}</strong>Total</div>
          <div className="hero-stat"><strong>{active.length}</strong>Active</div>
          <div className="hero-stat"><strong>{done.length}</strong>Completed</div>
          <div className="hero-stat"><strong>{tournaments.reduce((s,t)=>s+t.teams.length,0)}</strong>Teams</div>
        </div>
      </div>
      {active.length>0&&(
        <div className="page">
          <h2 className="section-title">🟢 Active Tournaments</h2>
          <div className="card-grid">{active.map(t=><TCard key={t.id} t={t} onOpen={onOpen}/>)}</div>
        </div>
      )}
      {done.length>0&&(
        <div className="page" style={{paddingTop:0}}>
          <h2 className="section-title">🏆 Completed</h2>
          <div className="card-grid">{done.map(t=><TCard key={t.id} t={t} onOpen={onOpen}/>)}</div>
        </div>
      )}
      {tournaments.length===0&&(
        <div className="page">
          <div className="empty-state">
            <div className="empty-icon">🏟️</div>
            <p style={{fontSize:15,marginBottom:20}}>No tournaments yet. Create your first one!</p>
            <button className="btn btn-primary btn-lg" onClick={onStart}>🚀 Get Started</button>
          </div>
        </div>
      )}
    </>
  );
}

function TCard({t,onOpen}) {
  const leader=[...t.teams].sort((a,b)=>b.wins-a.wins)[0];
  return (
    <div className="card t-card" onClick={()=>onOpen(t.id)}>
      <div className="flex-between mb-3">
        <div>
          <div className="t-card-name">{t.name}</div>
          <div className="text-sm text-muted">{t.teams.length} teams · {t.winsRequired} wins to win</div>
        </div>
        <span className={`badge ${t.status==="active"?"badge-active":"badge-done"}`}>{t.status==="active"?"🟢 Live":"🏆 Done"}</span>
      </div>
      {t.winnerId&&<div className="text-sm fw-7" style={{color:"var(--gold-d)",marginBottom:8}}>🏆 Winner: {t.teams.find(x=>x.id===t.winnerId)?.name}</div>}
      {leader&&(
        <>
          <div className="flex-between mb-2">
            <span className="text-sm fw-7">👑 {leader.emoji} {leader.name}</span>
            <span className="chip chip-gold">{leader.wins}/{t.winsRequired} wins</span>
          </div>
          <div className="progress-bar">
            <div className="progress-fill progress-fill-gold" style={{width:`${Math.min(100,(leader.wins/t.winsRequired)*100)}%`}}/>
          </div>
        </>
      )}
      <div className="text-xs text-muted" style={{marginTop:8}}>Match #{t.matchCount||0} played</div>
    </div>
  );
}

// ─── Tournament List ──────────────────────────────────────────────────────────
function TournamentList({tournaments,onOpen,onCreate,onDelete}) {
  return (
    <div className="page">
      <div className="flex-between mb-6">
        <h2 className="section-title" style={{margin:0}}>All Tournaments</h2>
        <button className="btn btn-primary" onClick={onCreate}>+ New</button>
      </div>
      {tournaments.length===0
        ?<div className="empty-state"><div className="empty-icon">🏟️</div><p>No tournaments yet.</p></div>
        :<div className="card-grid">
          {[...tournaments].sort((a,b)=>b.createdAt-a.createdAt).map(t=>(
            <div key={t.id}>
              <TCard t={t} onOpen={onOpen}/>
              <button className="btn btn-danger btn-sm btn-full" style={{marginTop:8}} onClick={e=>{e.stopPropagation();if(confirm(`Delete "${t.name}"?`))onDelete(t.id);}}>🗑 Delete</button>
            </div>
          ))}
        </div>
      }
    </div>
  );
}

// ─── Create Wizard ────────────────────────────────────────────────────────────
const STEP_LABELS = ["Teams","Settings","Rules"];

function CreateWizard({step,setStep,canNext,tName,setTName,numTeams,syncTeams,teams,setTeams,winsRequired,setWinsRequired,totalPoints,setTotalPoints,pointsPerWin,notes,setNotes,noteInput,setNoteInput,onCreate}) {
  function addNote() {
    if(!noteInput.trim()) return;
    setNotes(n=>[...n,noteInput.trim()]);
    setNoteInput("");
  }
  function deleteNote(i) { setNotes(n=>n.filter((_,j)=>j!==i)); }
  function updateNote(i,val) { setNotes(n=>n.map((x,j)=>j===i?val:x)); }

  return (
    <div className="page" style={{maxWidth:620}}>
      <h2 className="section-title">Create Tournament</h2>
      <div className="steps">
        {STEP_LABELS.map((s,i)=>(
          <div key={s} className={`step-item ${i===step?"active":i<step?"done":""}`}>
            <div className="step-circle">{i<step?"✓":i+1}</div>
            <div className="step-label">{s}</div>
          </div>
        ))}
      </div>

      <div className="card">
        {/* ── Step 0: Teams ── */}
        {step===0&&(
          <>
            <h3 className="fd mb-4" style={{fontSize:18}}>🏆 Tournament & Teams</h3>
            <div className="form-group">
              <label className="form-label">Tournament Name *</label>
              <input className="form-input" placeholder="e.g. Office Carrom Championship" value={tName} onChange={e=>setTName(e.target.value)}/>
            </div>
            <div className="form-group">
              <label className="form-label">Number of Teams</label>
              <select className="form-select" value={numTeams} onChange={e=>syncTeams(e.target.value)}>
                {[2,3,4,5,6].map(n=><option key={n} value={n}>{n} Teams</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Team Names</label>
              {teams.map((t,i)=>(
                <div key={t.id} style={{display:"flex",gap:8,marginBottom:8,alignItems:"center"}}>
                  <span style={{fontSize:20}}>{TEAM_EMOJIS[i]}</span>
                  <input className="form-input" placeholder={`Team ${i+1} name`} value={t.name}
                    onChange={e=>setTeams(prev=>prev.map((x,j)=>j===i?{...x,name:e.target.value}:x))}/>
                </div>
              ))}
            </div>
          </>
        )}

        {/* ── Step 1: Settings ── */}
        {step===1&&(
          <>
            <h3 className="fd mb-4" style={{fontSize:18}}>⚙️ Scoring Settings</h3>
            <div className="form-group">
              <label className="form-label">Wins Required to Win Tournament</label>
              <input className="form-input" type="number" min="1" value={winsRequired}
                onChange={e=>setWinsRequired(parseInt(e.target.value)||1)}/>
              <div className="form-hint">First team to reach this many wins = Tournament Winner</div>
            </div>
            <div className="form-group">
              <label className="form-label">Total Points Pool</label>
              <input className="form-input" type="number" min="1" value={totalPoints}
                onChange={e=>setTotalPoints(parseInt(e.target.value)||1)}/>
              <div className="form-hint">Total points available across all wins</div>
            </div>
            <div className="info-box">
              <div className="text-sm fw-7 mb-2">🧮 Auto Calculated:</div>
              <div className="text-sm">Points per match win = <strong>{totalPoints} ÷ {winsRequired} = {pointsPerWin} pts</strong></div>
              <div className="text-sm" style={{marginTop:6}}>🏆 Win condition: First to <strong>{winsRequired} wins</strong> (earning <strong>{winsRequired * pointsPerWin} total pts</strong>)</div>
            </div>
          </>
        )}

        {/* ── Step 2: Rules / Notes ── */}
        {step===2&&(
          <>
            <h3 className="fd mb-2" style={{fontSize:18}}>📋 Tournament Notes</h3>
            <p className="text-sm text-muted mb-4">Add rules or info for players. Just write each point — keep it simple!</p>
            {notes.length>0&&(
              <div className="card" style={{background:"var(--cream)",marginBottom:16,padding:"8px 16px"}}>
                {notes.map((n,i)=>(
                  <div key={i} className="note-item">
                    <span className="note-num">{i+1}.</span>
                    <input className="form-input" style={{flex:1,border:"none",background:"transparent",padding:"2px 0",fontSize:14}}
                      value={n} onChange={e=>updateNote(i,e.target.value)}/>
                    <button className="btn btn-danger btn-sm" style={{padding:"4px 8px"}} onClick={()=>deleteNote(i)}>✕</button>
                  </div>
                ))}
              </div>
            )}
            <div className="rule-add-row">
              <input className="form-input" placeholder="Type a rule or note and press Add…" value={noteInput}
                onChange={e=>setNoteInput(e.target.value)}
                onKeyDown={e=>{if(e.key==="Enter")addNote()}}/>
              <button className="btn btn-primary" style={{flexShrink:0}} onClick={addNote}>Add</button>
            </div>
          </>
        )}

        <div className="divider"/>
        <div className="flex-between">
          <button className="btn btn-secondary" onClick={()=>setStep(s=>Math.max(0,s-1))} disabled={step===0}>← Back</button>
          {step<2
            ?<button className="btn btn-primary" onClick={()=>setStep(s=>s+1)} disabled={!canNext()}>Next →</button>
            :<button className="btn btn-primary btn-lg" onClick={onCreate}>🚀 Launch!</button>
          }
        </div>
      </div>
    </div>
  );
}

// ─── Tournament View ──────────────────────────────────────────────────────────
function TournamentView({t,onWin,onUndo,onDelete,onBack}) {
  const [tab,setTab]=useState("play");
  return (
    <div className="page">
      <div className="flex-between mb-4">
        <div>
          <button className="btn btn-secondary btn-sm" onClick={onBack} style={{marginBottom:8}}>← Back</button>
          <h2 className="section-title" style={{margin:0}}>{t.name}</h2>
          <span className={`badge ${t.status==="active"?"badge-active":"badge-done"}`} style={{marginTop:6,display:"inline-flex"}}>
            {t.status==="active"?"🟢 Active":"🏆 Completed"}
          </span>
        </div>
        <button className="btn btn-danger btn-sm" onClick={()=>{if(confirm("Delete?"))onDelete();}}>🗑</button>
      </div>

      <div className="tabs">
        {[["play","🎮 Play"],["history","📜 History"],["notes","📋 Rules"]].map(([k,l])=>(
          <button key={k} className={`tab ${tab===k?"active":""}`} onClick={()=>setTab(k)}>{l}</button>
        ))}
      </div>

      {tab==="play"&&<PlayTab t={t} onWin={onWin} onUndo={onUndo}/>}
      {tab==="history"&&<HistoryTab t={t}/>}
      {tab==="notes"&&<NotesTab t={t}/>}
    </div>
  );
}

// ─── Play Tab ─────────────────────────────────────────────────────────────────
function PlayTab({t,onWin,onUndo}) {
  const sorted=[...t.teams].sort((a,b)=>b.wins-a.wins);
  const leader=sorted[0];
  const isCompleted=t.status==="completed";
  const totalMatches=t.matchCount||0;

  return (
    <>
      {/* ── Stats Row ── */}
      <div className="stat-grid">
        <div className="stat-card">
          <div className="stat-num">{totalMatches}</div>
          <div className="stat-label">Matches Played</div>
        </div>
        <div className="stat-card">
          <div className="stat-num" style={{color:"var(--gold-d)"}}>{t.pointsPerWin}</div>
          <div className="stat-label">Points / Win</div>
        </div>
        <div className="stat-card">
          <div className="stat-num" style={{color:"var(--green)"}}>{t.winsRequired}</div>
          <div className="stat-label">Wins to Win</div>
        </div>
        <div className="stat-card">
          <div className="stat-num">{t.totalPoints}</div>
          <div className="stat-label">Total Points</div>
        </div>
      </div>

      {/* ── Race Track ── */}
      <div className="race-track mb-4">
        <div className="fw-7 mb-3" style={{fontSize:15}}>🏁 Race to {t.winsRequired} Wins</div>
        {sorted.map((team,i)=>{
          const pct=Math.min(100,(team.wins/t.winsRequired)*100);
          const toGo=Math.max(0,t.winsRequired-team.wins);
          const isWinner=t.winnerId===team.id;
          return (
            <div key={team.id} className="race-team">
              <div className="race-header">
                <div className="race-name">
                  <span>{team.emoji}</span>
                  <span>{team.name}</span>
                  {isWinner&&<span>🏆</span>}
                  {!isWinner&&i===0&&!isCompleted&&<span style={{fontSize:11,color:"var(--gold-d)"}}>👑 Leading</span>}
                </div>
                <div style={{display:"flex",alignItems:"center",gap:8}}>
                  <span className="race-score">{team.wins}<span style={{fontSize:13,fontWeight:500,color:"var(--slate-l)"}}>/{t.winsRequired}</span></span>
                  {!isCompleted&&(
                    <span className={`wins-to-go ${toGo<=2?"close":""}`}>
                      {toGo===0?"🎉 Done!":toGo===1?"1 win to go!":`${toGo} wins to go`}
                    </span>
                  )}
                </div>
              </div>
              <div className="progress-bar">
                <div
                  className={`progress-fill ${isWinner?"progress-fill-green":i===0?"progress-fill-gold":"progress-fill-red"}`}
                  style={{width:`${pct}%`}}
                />
              </div>
              <div className="text-xs text-muted" style={{marginTop:4}}>{team.wins}W · {team.losses}L · {team.points} pts</div>
            </div>
          );
        })}
      </div>

      {/* ── Record Match ── */}
      {!isCompleted&&(
        <div className="match-record-box">
          <div className="match-num-badge">Match #{totalMatches+1} — Who Won?</div>
          <div className="match-vs-row">
            {t.teams.map(team=>(
              <button key={team.id} className="match-team-btn" onClick={()=>onWin(team.id)}>
                <span className="team-emoji">{team.emoji}</span>
                <span className="team-btn-name">{team.name}</span>
                <span className="team-btn-wins">{team.wins} wins so far</span>
              </button>
            ))}
          </div>
          {totalMatches>0&&(
            <button className="btn btn-secondary btn-sm btn-full" onClick={onUndo}>↩ Undo Last Match</button>
          )}
        </div>
      )}

      {isCompleted&&(
        <div className="card" style={{background:"linear-gradient(135deg,#fffbf0,#fff8e6)",border:"2px solid var(--gold-l)",textAlign:"center",padding:"28px 20px"}}>
          <div style={{fontSize:48,marginBottom:8}}>🏆</div>
          <div className="fd" style={{fontSize:22,fontWeight:900,color:"var(--gold-d)"}}>Tournament Complete!</div>
          <div style={{fontSize:16,fontWeight:700,marginTop:6}}>{t.teams.find(x=>x.id===t.winnerId)?.emoji} {t.teams.find(x=>x.id===t.winnerId)?.name} Wins!</div>
          <div className="text-sm text-muted" style={{marginTop:8}}>{totalMatches} total matches played</div>
          {(t.history||[]).length>0&&(
            <button className="btn btn-secondary btn-sm" style={{marginTop:12}} onClick={onUndo}>↩ Undo Last Match</button>
          )}
        </div>
      )}
    </>
  );
}

// ─── History Tab ──────────────────────────────────────────────────────────────
function HistoryTab({t}) {
  const history=t.history||[];
  if(history.length===0) return <div className="empty-state"><div className="empty-icon">📜</div><p>No matches played yet.</p></div>;
  const getTeam=(id)=>t.teams.find(x=>x.id===id);
  return (
    <div className="card">
      <div className="fw-7 mb-3" style={{fontSize:15}}>Match History ({history.length} matches)</div>
      {[...history].reverse().map(h=>{
        const winner=getTeam(h.winnerId);
        const loser=getTeam(h.loserId);
        return (
          <div key={h.matchNum} className="history-item">
            <span className="history-num">#{h.matchNum}</span>
            <div className="history-teams">
              <span className="chip chip-green" style={{marginRight:6}}>{winner?.emoji} {winner?.name} won</span>
              <span className="chip chip-red">{loser?.emoji} {loser?.name} lost</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─── Notes Tab ────────────────────────────────────────────────────────────────
function NotesTab({t}) {
  const notes=t.notes||[];
  return (
    <div className="card">
      <div className="fw-7 mb-3" style={{fontSize:15}}>📋 Tournament Rules & Notes</div>
      {notes.length===0&&<div className="text-sm text-muted">No rules added.</div>}
      {notes.map((n,i)=>(
        <div key={i} className="note-item">
          <span className="note-num">{i+1}.</span>
          <span className="note-text">{n}</span>
        </div>
      ))}
      <div className="divider"/>
      <div className="fw-7 mb-3" style={{fontSize:14}}>⚙️ Settings</div>
      {[
        ["Points per Win",t.pointsPerWin+" pts","chip-gold"],
        ["Wins Required",t.winsRequired+" wins","chip-green"],
        ["Total Points Pool",t.totalPoints+" pts",""],
      ].map(([l,v,c])=>(
        <div key={l} className="flex-between" style={{padding:"8px 0",borderBottom:"1px solid var(--warm)"}}>
          <span className="text-sm fw-7">{l}</span>
          <span className={`chip ${c}`}>{v}</span>
        </div>
      ))}
    </div>
  );
}

// ─── Winner Banner ────────────────────────────────────────────────────────────
function WinnerBanner({team,onClose}) {
  return (
    <div className="winner-overlay" onClick={onClose}>
      <div className="winner-box" onClick={e=>e.stopPropagation()}>
        <span className="winner-trophy">🏆</span>
        <div className="winner-title">CHAMPION!</div>
        <div className="winner-team">{team.emoji} {team.name}</div>
        <div className="text-sm text-muted" style={{marginBottom:20}}>{team.wins} wins · {team.points} points scored</div>
        <button className="btn btn-primary btn-lg" onClick={onClose}>🎉 Celebrate!</button>
      </div>
    </div>
  );
}
