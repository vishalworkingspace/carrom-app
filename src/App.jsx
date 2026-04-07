import React, { useState, useEffect, useRef } from "react";
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  deleteDoc,
  collection,
  onSnapshot,
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyC43NkBBH3JP97DRnPR3xHxwrYLNgZ8Dzg",
  authDomain: "carrom-master-33ae8.firebaseapp.com",
  projectId: "carrom-master-33ae8",
  storageBucket: "carrom-master-33ae8.firebasestorage.app",
  messagingSenderId: "285779539325",
  appId: "1:285779539325:web:ab76dc01d7b4d6edba0814"
};

const app = initializeApp(firebaseConfig);
const firestoreDB = getFirestore(app);

const uid = () => Math.random().toString(36).slice(2, 9);

const TEAM_EMOJIS = ["🔵","🔴","🟢","🟡","🟠","🟣"];
const MEDALS = ["🥇","🥈","🥉","4️⃣","5️⃣","6️⃣"];
const TEAM_COLORS = ["#3b82f6","#ef4444","#22c55e","#eab308","#f97316","#a855f7"];
const TEAM_BG = ["#eff6ff","#fff0f0","#f0fdf4","#fefce8","#fff7ed","#fdf4ff"];

// ─── CSS ─────────────────────────────────────────────────────────────────────
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Sans:wght@300;400;500;600&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
html{-webkit-text-size-adjust:100%;scroll-behavior:smooth}
:root{
  --cream:#faf8f3;--warm:#f5f0e8;--gold:#c9973f;--gold-l:#e8c97a;--gold-d:#9a6f2a;
  --brown:#5c3d1e;--green:#2d6a4f;--green-l:#52b788;--red:#c1121f;
  --slate:#4a5568;--slate-l:#718096;--white:#fff;
  --shadow:0 4px 24px rgba(92,61,30,.12);--shadow-lg:0 12px 48px rgba(92,61,30,.2);
  --r:16px;--fd:'Playfair Display',serif;--fb:'DM Sans',sans-serif;
}
body{font-family:var(--fb);background:var(--cream);color:var(--brown);min-height:100vh;overflow-x:hidden}

.nav{background:var(--white);border-bottom:2px solid var(--warm);padding:0 16px;display:flex;align-items:center;justify-content:space-between;height:58px;position:sticky;top:0;z-index:200;box-shadow:0 2px 12px rgba(92,61,30,.08)}
.nav-logo{font-family:var(--fd);font-size:18px;color:var(--brown);font-weight:900;cursor:pointer;display:flex;align-items:center;gap:8px;flex-shrink:0;user-select:none}
.nav-logo .logo-icon{font-size:24px}
.nav-actions{display:flex;gap:6px;flex-wrap:nowrap;align-items:center}

.btn{font-family:var(--fb);font-weight:600;font-size:14px;border:none;border-radius:10px;padding:9px 16px;cursor:pointer;transition:all .2s;display:inline-flex;align-items:center;justify-content:center;gap:5px;line-height:1;text-align:center;white-space:nowrap;-webkit-tap-highlight-color:transparent}
.btn-primary{background:var(--gold);color:var(--white)}
.btn-primary:hover,.btn-primary:active{background:var(--gold-d);transform:translateY(-1px);box-shadow:0 4px 16px rgba(201,151,63,.4)}
.btn-secondary{background:var(--warm);color:var(--brown);border:1.5px solid #e0d5c5}
.btn-secondary:hover,.btn-secondary:active{background:#ede5d5}
.btn-danger{background:#fff0f0;color:var(--red);border:1.5px solid #ffd6d6}
.btn-danger:hover{background:#ffe0e0}
.btn-success{background:#f0faf5;color:var(--green);border:1.5px solid #b7e4c7}
.btn-success:hover{background:#d8f3e3}
.btn-ghost{background:transparent;color:var(--slate);border:1.5px solid #e0d5c5}
.btn-ghost:hover{background:var(--warm)}
.btn-clone{background:#f0f4ff;color:#3b5bdb;border:1.5px solid #c5d0f5}
.btn-clone:hover{background:#e0e8ff}
.btn-sm{padding:6px 12px;font-size:12px;border-radius:8px}
.btn-xs{padding:4px 8px;font-size:11px;border-radius:6px}
.btn-lg{padding:13px 28px;font-size:15px;border-radius:14px}
.btn:disabled{opacity:.4;cursor:not-allowed;transform:none!important;box-shadow:none!important}
.btn-full{width:100%}
.btn-icon{padding:8px;border-radius:8px;width:34px;height:34px}

.hero{background:linear-gradient(150deg,#2a1005 0%,#5c2d0e 45%,#8a5a1e 80%,#c9973f 100%);min-height:calc(100svh - 58px);display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:40px 20px;position:relative;overflow:hidden}
.hero::before{content:'';position:absolute;inset:0;background:radial-gradient(ellipse 80% 60% at 50% 40%,rgba(201,151,63,.2),transparent 65%);pointer-events:none}
.hero-disc{font-size:68px;margin-bottom:16px;animation:float 3s ease-in-out infinite;position:relative;filter:drop-shadow(0 8px 24px rgba(0,0,0,.4))}
@keyframes float{0%,100%{transform:translateY(0) rotate(-2deg)}50%{transform:translateY(-12px) rotate(2deg)}}
.hero h1{font-family:var(--fd);font-size:clamp(36px,9vw,76px);color:var(--white);font-weight:900;line-height:1;margin-bottom:12px;position:relative;text-shadow:0 4px 24px rgba(0,0,0,.3)}
.hero h1 span{color:var(--gold-l)}
.hero-sub{font-size:15px;color:rgba(255,255,255,.68);margin-bottom:32px;position:relative;max-width:320px}
.hero-cta{background:linear-gradient(135deg,var(--gold),#d4a84b);color:var(--white);font-size:16px;font-weight:700;padding:15px 40px;border-radius:14px;border:none;cursor:pointer;font-family:var(--fb);transition:all .3s;box-shadow:0 8px 32px rgba(201,151,63,.5);position:relative}
.hero-cta:hover{transform:translateY(-3px);box-shadow:0 14px 40px rgba(201,151,63,.65)}
.hero-stats{display:flex;gap:24px;margin-top:40px;position:relative;flex-wrap:wrap;justify-content:center}
.hero-stat{text-align:center}
.hero-stat strong{display:block;font-size:26px;font-weight:700;color:var(--gold-l);font-family:var(--fd)}
.hero-stat span{font-size:12px;color:rgba(255,255,255,.6);font-weight:500}

.page{padding:24px 16px;max-width:880px;margin:0 auto;width:100%}
.section-title{font-family:var(--fd);font-size:22px;font-weight:900;color:var(--brown);margin-bottom:18px}

.card{background:var(--white);border-radius:var(--r);padding:20px;box-shadow:var(--shadow);border:1.5px solid rgba(201,151,63,.1);transition:box-shadow .2s,transform .2s}
.card-sm{padding:14px 16px}
.card-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(250px,1fr));gap:14px}
.t-card{cursor:pointer;border-left:4px solid var(--gold)}
.t-card:hover{transform:translateY(-2px);box-shadow:var(--shadow-lg)}
.t-card-name{font-family:var(--fd);font-size:17px;font-weight:700;color:var(--brown);margin-bottom:3px}

.badge{display:inline-flex;align-items:center;padding:3px 10px;border-radius:20px;font-size:11px;font-weight:700;letter-spacing:.3px}
.badge-live{background:#dcfce7;color:#166534}
.badge-done{background:#fef9c3;color:#854d0e}
.chip{display:inline-flex;align-items:center;padding:3px 9px;border-radius:20px;font-size:12px;font-weight:600;background:var(--warm);color:var(--brown)}
.chip-green{background:#dcfce7;color:#166534}
.chip-red{background:#fee2e2;color:#991b1b}
.chip-gold{background:#fef9c3;color:#854d0e}
.chip-blue{background:#dbeafe;color:#1e40af}

.form-group{margin-bottom:14px}
.form-label{display:block;font-weight:600;font-size:13px;color:var(--brown);margin-bottom:5px}
.form-input,.form-select{width:100%;font-family:var(--fb);font-size:15px;border:1.5px solid #ddd5c4;border-radius:10px;padding:10px 13px;color:var(--brown);background:var(--white);outline:none;transition:border-color .2s,box-shadow .2s;-webkit-appearance:none}
.form-input:focus,.form-select:focus{border-color:var(--gold);box-shadow:0 0 0 3px rgba(201,151,63,.15)}
.form-input[type=number]::-webkit-inner-spin-button{opacity:1}
.form-row{display:grid;grid-template-columns:1fr 1fr;gap:12px}
.form-hint{font-size:11px;color:var(--slate-l);margin-top:4px}
.input-row{display:flex;gap:8px;align-items:stretch}
.input-row .form-input{flex:1}

.steps{display:flex;margin-bottom:24px;gap:0}
.step-item{flex:1;min-width:60px;display:flex;flex-direction:column;align-items:center;position:relative}
.step-item:not(:last-child)::after{content:'';position:absolute;top:15px;left:55%;width:90%;height:2px;background:#e0d5c5;z-index:0}
.step-item.done:not(:last-child)::after{background:var(--gold)}
.step-circle{width:30px;height:30px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:12px;border:2px solid #e0d5c5;background:var(--white);color:var(--slate-l);margin-bottom:5px;position:relative;z-index:1;transition:all .3s}
.step-item.active .step-circle,.step-item.done .step-circle{border-color:var(--gold);background:var(--gold);color:var(--white)}
.step-label{font-size:10px;color:var(--slate-l);font-weight:500;text-align:center;line-height:1.2}
.step-item.active .step-label{color:var(--gold-d);font-weight:700}

.tabs{display:flex;gap:3px;background:var(--warm);padding:3px;border-radius:12px;margin-bottom:20px;overflow-x:auto;-webkit-overflow-scrolling:touch;scrollbar-width:none}
.tabs::-webkit-scrollbar{display:none}
.tab{padding:8px 14px;border-radius:9px;font-weight:600;font-size:13px;cursor:pointer;border:none;background:transparent;color:var(--slate);transition:all .2s;white-space:nowrap;font-family:var(--fb);-webkit-tap-highlight-color:transparent}
.tab.active{background:var(--white);color:var(--brown);box-shadow:0 2px 8px rgba(92,61,30,.1)}

.progress-bar{height:10px;background:var(--warm);border-radius:5px;overflow:hidden}
.progress-bar-sm{height:6px}
.pf{height:100%;border-radius:5px;transition:width .7s cubic-bezier(.4,0,.2,1)}
.pf-gold{background:linear-gradient(90deg,var(--gold),var(--gold-l))}
.pf-green{background:linear-gradient(90deg,#16a34a,#4ade80)}
.pf-red{background:linear-gradient(90deg,#dc2626,#f87171)}
.pf-blue{background:linear-gradient(90deg,#2563eb,#60a5fa)}

.race-track{background:var(--white);border-radius:var(--r);padding:18px;box-shadow:var(--shadow);border:1.5px solid rgba(201,151,63,.12);margin-bottom:18px}
.race-team{margin-bottom:14px;padding:12px 14px;border-radius:12px;border:1.5px solid #f0ebe0;transition:border-color .2s,background .2s;cursor:pointer}
.race-team:last-child{margin-bottom:0}
.race-team:hover{border-color:var(--gold-l);background:#fffdf8}
.race-team.is-leader{border-color:var(--gold-l);background:linear-gradient(135deg,#fffdf8,#fffbf0)}
.race-team.is-winner{border-color:#4ade80;background:linear-gradient(135deg,#f0fdf4,#dcfce7)}
.race-header{display:flex;align-items:center;justify-content:space-between;margin-bottom:8px;flex-wrap:wrap;gap:6px}
.race-name{font-weight:700;font-size:15px;display:flex;align-items:center;gap:6px}
.race-right{display:flex;align-items:center;gap:8px;flex-wrap:wrap}
.race-score{font-family:var(--fb);font-size:22px;font-weight:800;letter-spacing:-0.5px}
.wins-pill{font-size:12px;font-weight:700;padding:3px 10px;border-radius:20px;background:#fef9c3;color:#854d0e}
.wins-pill.close{background:#dcfce7;color:#166534;animation:pulse 1.5s ease-in-out infinite}
.wins-pill.critical{background:#fee2e2;color:#991b1b;animation:pulse .8s ease-in-out infinite}
@keyframes pulse{0%,100%{opacity:1}50%{opacity:.55}}

.match-record-box{background:linear-gradient(135deg,var(--white),#fffdf8);border-radius:20px;padding:20px;box-shadow:var(--shadow-lg);border:2px solid rgba(201,151,63,.2);margin-bottom:18px}
.match-title{font-size:13px;font-weight:700;letter-spacing:.8px;text-transform:uppercase;color:var(--slate-l);margin-bottom:16px;display:flex;align-items:center;gap:8px}
.match-teams-grid{display:grid;grid-template-columns:1fr auto 1fr;gap:10px;align-items:center;margin-bottom:14px}
.match-team-btn{padding:16px 10px;border-radius:14px;border:2px solid #e5e7eb;background:var(--white);cursor:pointer;text-align:center;transition:all .25s;font-family:var(--fb);-webkit-tap-highlight-color:transparent;width:100%}
.match-team-btn:hover,.match-team-btn:active{transform:translateY(-3px);box-shadow:0 8px 24px rgba(0,0,0,.12)}
.match-team-emoji{font-size:32px;display:block;margin-bottom:6px}
.match-team-name{font-weight:700;font-size:14px;display:block;margin-bottom:3px;color:var(--brown)}
.match-team-wins{font-size:11px;color:var(--slate-l);display:block}
.match-vs{display:flex;align-items:center;justify-content:center;width:32px;height:32px;background:var(--warm);border-radius:50%;font-weight:900;font-size:12px;color:var(--slate);margin:auto}

/* ── 3D SPHERE BALL ── */
.sphere-ball{border-radius:50%;position:relative;flex-shrink:0}
.sphere-ball::after{content:'';position:absolute;top:14%;left:22%;width:30%;height:20%;border-radius:50%;background:rgba(255,255,255,.55);filter:blur(3px);transform:rotate(-30deg)}
.sphere-red{background:radial-gradient(circle at 35% 30%,#ff8fa3 0%,#ef4444 40%,#991b1b 80%,#450a0a 100%);box-shadow:inset -6px -6px 16px rgba(0,0,0,.45),inset 3px 3px 10px rgba(255,255,255,.35),0 8px 24px rgba(239,68,68,.45),0 2px 6px rgba(0,0,0,.3)}
.sphere-blue{background:radial-gradient(circle at 35% 30%,#93c5fd 0%,#3b82f6 40%,#1e3a8a 80%,#0a0f2e 100%);box-shadow:inset -6px -6px 16px rgba(0,0,0,.45),inset 3px 3px 10px rgba(255,255,255,.35),0 8px 24px rgba(59,130,246,.45),0 2px 6px rgba(0,0,0,.3)}
.sphere-green{background:radial-gradient(circle at 35% 30%,#86efac 0%,#22c55e 40%,#14532d 80%,#052e16 100%);box-shadow:inset -6px -6px 16px rgba(0,0,0,.45),inset 3px 3px 10px rgba(255,255,255,.35),0 8px 24px rgba(34,197,94,.45),0 2px 6px rgba(0,0,0,.3)}
.sphere-yellow{background:radial-gradient(circle at 35% 30%,#fef08a 0%,#eab308 40%,#713f12 80%,#2a1600 100%);box-shadow:inset -6px -6px 16px rgba(0,0,0,.45),inset 3px 3px 10px rgba(255,255,255,.35),0 8px 24px rgba(234,179,8,.45),0 2px 6px rgba(0,0,0,.3)}
.sphere-orange{background:radial-gradient(circle at 35% 30%,#fed7aa 0%,#f97316 40%,#7c2d12 80%,#1c0700 100%);box-shadow:inset -6px -6px 16px rgba(0,0,0,.45),inset 3px 3px 10px rgba(255,255,255,.35),0 8px 24px rgba(249,115,22,.45),0 2px 6px rgba(0,0,0,.3)}
.sphere-purple{background:radial-gradient(circle at 35% 30%,#e9d5ff 0%,#a855f7 40%,#4a044e 80%,#12001a 100%);box-shadow:inset -6px -6px 16px rgba(0,0,0,.45),inset 3px 3px 10px rgba(255,255,255,.35),0 8px 24px rgba(168,85,247,.45),0 2px 6px rgba(0,0,0,.3)}

/* ── HEADER STYLING ── */
.t-header-name{font-family:var(--fd);font-size:26px;font-weight:900;color:var(--brown);line-height:1.1}
.badge-live-pulse{background:#dcfce7;color:#166534;display:inline-flex;align-items:center;gap:5px;padding:5px 12px;border-radius:20px;font-size:12px;font-weight:700;animation:badgePulse 2s ease-in-out infinite}
.badge-live-dot{width:7px;height:7px;background:#16a34a;border-radius:50%;animation:dotBlink 1.2s ease-in-out infinite}
@keyframes badgePulse{0%,100%{box-shadow:0 0 0 0 rgba(22,101,52,.3)}50%{box-shadow:0 0 0 4px rgba(22,101,52,.0)}}
@keyframes dotBlink{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.4;transform:scale(.7)}}

/* ── TEAM POPUP HEADER ── */
.team-popup-header{background:linear-gradient(135deg,var(--warm),#ede5d5);border-radius:16px;padding:20px;margin-bottom:16px;display:flex;flex-direction:column;align-items:center;text-align:center}
.team-popup-top{display:flex;align-items:center;gap:16px;width:100%;justify-content:center;margin-bottom:10px}
.team-popup-name{font-family:var(--fd);font-size:24px;font-weight:900;line-height:1.1}
.team-popup-sub{font-size:13px;color:var(--slate-l);font-weight:600;margin-top:4px}

.modal-overlay{position:fixed;inset:0;background:rgba(30,20,10,.75);z-index:500;display:flex;align-items:flex-end;justify-content:center;padding:0;backdrop-filter:blur(4px);overflow:hidden}
.modal-overlay.center{align-items:center;padding:16px}
.modal-box{background:var(--white);border-radius:24px 24px 0 0;padding:20px 16px 32px;width:100%;max-width:480px;max-height:90svh;overflow-y:auto;overflow-x:hidden;animation:slideUp .3s cubic-bezier(.34,1.56,.64,1);box-sizing:border-box}
.modal-box.center-box{border-radius:20px;animation:popIn .35s cubic-bezier(.34,1.56,.64,1);max-height:88svh;padding:20px 16px}
@keyframes slideUp{from{transform:translateY(100%);opacity:0}to{transform:translateY(0);opacity:1}}
@keyframes popIn{from{transform:scale(.7);opacity:0}to{transform:scale(1);opacity:1}}
.modal-handle{width:36px;height:4px;background:#e0d5c5;border-radius:2px;margin:0 auto 16px}
.modal-title{font-family:var(--fd);font-size:18px;font-weight:900;color:var(--brown);margin-bottom:14px;display:flex;align-items:center;gap:8px}
.modal-close{position:absolute;top:14px;right:14px;width:32px;height:32px;border-radius:50%;border:none;background:var(--warm);cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:16px;color:var(--brown)}

.stat-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:10px;margin-bottom:18px}
.stat-card{background:var(--white);border-radius:12px;padding:14px;box-shadow:var(--shadow);border:1.5px solid rgba(201,151,63,.1);text-align:center}
.stat-num{font-family:var(--fb);font-size:30px;font-weight:800;letter-spacing:-1px;line-height:1}
.stat-label{font-size:10px;color:var(--slate-l);font-weight:700;margin-top:4px;text-transform:uppercase;letter-spacing:.6px}

.hist-item{display:flex;align-items:flex-start;gap:10px;padding:10px 0;border-bottom:1px solid #f5f0e8}
.hist-item:last-child{border-bottom:none}
.hist-num{font-size:11px;font-weight:700;color:var(--slate-l);min-width:26px;padding-top:2px}
.hist-info{flex:1}
.hist-players{font-size:13px;font-weight:600;color:var(--brown);margin-bottom:3px}
.hist-result{display:flex;gap:6px;flex-wrap:wrap}

.player-stat-row{display:flex;align-items:center;justify-content:space-between;padding:10px 0;border-bottom:1px solid var(--warm)}
.player-stat-row:last-child{border-bottom:none}
.player-stat-name{font-weight:600;font-size:14px;color:var(--brown);display:flex;align-items:center;gap:6px}
.player-stat-nums{display:flex;gap:8px;align-items:center}

.note-item{display:flex;align-items:flex-start;gap:8px;padding:8px 0;border-bottom:1px solid var(--warm)}
.note-item:last-child{border-bottom:none}
.note-num{font-family:var(--fd);font-size:15px;font-weight:700;color:var(--gold-d);min-width:22px;line-height:1.5}
.note-text{flex:1;font-size:14px;color:var(--brown);line-height:1.5;word-break:break-word}

.player-chip{display:inline-flex;align-items:center;gap:4px;border-radius:8px;padding:3px 9px;font-size:12px;font-weight:600;margin:2px}

.winner-overlay{position:fixed;inset:0;background:rgba(20,10,0,.88);z-index:1000;display:flex;align-items:center;justify-content:center;padding:20px;backdrop-filter:blur(6px)}
.winner-box{background:var(--white);border-radius:24px;padding:36px 24px;text-align:center;max-width:380px;width:100%;box-shadow:0 24px 80px rgba(92,61,30,.5);animation:popIn .4s cubic-bezier(.34,1.56,.64,1)}
.winner-trophy{font-size:72px;display:block;margin-bottom:10px;animation:bounce 1s ease-in-out infinite}
@keyframes bounce{0%,100%{transform:translateY(0) rotate(-5deg)}50%{transform:translateY(-12px) rotate(5deg)}}
.winner-title{font-family:var(--fd);font-size:32px;font-weight:900;color:var(--gold-d);margin-bottom:4px}
.winner-team-name{font-size:22px;font-weight:700;margin-bottom:16px}

.confetti-canvas{position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:999}
@keyframes wrongShake{0%,100%{transform:translateX(0)}15%{transform:translateX(-8px)}30%{transform:translateX(8px)}45%{transform:translateX(-6px)}60%{transform:translateX(6px)}75%{transform:translateX(-3px)}90%{transform:translateX(3px)}}

.divider{height:1px;background:var(--warm);margin:16px 0}
.flex-between{display:flex;align-items:center;justify-content:space-between}
.flex-center{display:flex;align-items:center;justify-content:center}
.gap-2{gap:8px}
.mb-1{margin-bottom:4px}.mb-2{margin-bottom:8px}.mb-3{margin-bottom:12px}.mb-4{margin-bottom:16px}.mb-5{margin-bottom:20px}
.mt-2{margin-top:8px}.mt-3{margin-top:12px}
.text-sm{font-size:13px}.text-xs{font-size:11px}.text-muted{color:var(--slate-l)}
.fw-7{font-weight:700}.fd{font-family:var(--fd)}
.empty-state{text-align:center;padding:40px 20px;color:var(--slate-l)}
.empty-icon{font-size:40px;margin-bottom:10px}
.info-box{background:#fffbf0;border:1.5px solid var(--gold-l);border-radius:12px;padding:14px 16px}
.section-head{display:flex;align-items:center;justify-content:space-between;margin-bottom:14px}

@media(max-width:500px){
  .form-row{grid-template-columns:1fr}
  .stat-grid{grid-template-columns:repeat(2,1fr)}
  .hero-stats{gap:14px}
  .nav{padding:0 12px;height:54px}
  .page{padding:16px 12px}
  .card{padding:16px}
  .match-teams-grid{gap:8px}
  .match-team-emoji{font-size:26px}
  .match-team-name{font-size:13px}
  .tabs{border-radius:10px}
  .tab{padding:7px 10px;font-size:12px}
  .modal-box{padding:20px 16px}
  .hero-cta{padding:13px 28px;font-size:15px}
  .race-score{font-size:18px}
}
@media(max-width:360px){
  .nav-logo span.logo-text{display:none}
  .match-teams-grid{grid-template-columns:1fr auto 1fr}
  .stat-grid{grid-template-columns:1fr 1fr}
  .hero h1{font-size:30px}
}
@media(min-width:640px){
  .stat-grid{grid-template-columns:repeat(4,1fr)}
  .page{padding:28px 24px}
  .modal-overlay{align-items:center;padding:20px}
  .modal-box{border-radius:24px;animation:popIn .3s cubic-bezier(.34,1.56,.64,1)}
  .modal-handle{display:none}
  .match-team-emoji{font-size:36px}
}
`;

// ─── 3D Sphere Ball ───────────────────────────────────────────────────────────
const SPHERE_CLASSES = ["sphere-blue","sphere-red","sphere-green","sphere-yellow","sphere-orange","sphere-purple"];
function SphereBall({ index = 0, size = 56 }) {
  return (
    <div className={`sphere-ball ${SPHERE_CLASSES[index % SPHERE_CLASSES.length]}`}
      style={{ width: size, height: size }} />
  );
}

// ─── Confetti ─────────────────────────────────────────────────────────────────
function Confetti() {
  useEffect(() => {
    const canvas = document.getElementById("confetti-cv");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    resize();
    window.addEventListener("resize", resize);
    const colors = ["#c9973f","#e8c97a","#2d6a4f","#52b788","#c1121f","#f97316","#a855f7"];
    const pieces = Array.from({length:110},()=>({
      x:Math.random()*window.innerWidth, y:Math.random()*-window.innerHeight,
      r:Math.random()*10+4, c:colors[Math.floor(Math.random()*colors.length)],
      s:Math.random()*4+2, a:Math.random()*360, sp:Math.random()*6-3,
    }));
    let raf;
    const draw = () => {
      ctx.clearRect(0,0,canvas.width,canvas.height);
      pieces.forEach(p=>{
        ctx.save(); ctx.translate(p.x,p.y); ctx.rotate(p.a*Math.PI/180);
        ctx.fillStyle=p.c; ctx.fillRect(-p.r/2,-p.r/2,p.r,p.r*0.6); ctx.restore();
        p.y+=p.s; p.a+=p.sp; if(p.y>canvas.height) p.y=-12;
      });
      raf=requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize",resize); };
  }, []);
  return <canvas id="confetti-cv" className="confetti-canvas"/>;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function getPlayerStats(t) {
  const stats = {};
  if (!t || !t.teams) return stats;
  t.teams.forEach(tm => tm.players?.forEach(p => {
    stats[p.id] = { matchesPlayed:0, wins:0, losses:0, teamId:tm.id, name:p.name, matches:[] };
  }));
  (t.history||[]).forEach(h => {
    const allP = [...(h.t0Players||[]), ...(h.t1Players||[])];
    allP.forEach(pid => {
      if(!stats[pid]) return;
      stats[pid].matchesPlayed++;
      const won = (h.t0Players||[]).includes(pid) ? h.winnerId===h.t0Id : h.winnerId===h.t1Id;
      if(won) stats[pid].wins++; else stats[pid].losses++;
      stats[pid].matches.push({matchNum:h.matchNum, won});
    });
  });
  return stats;
}

// ─── Main App ─────────────────────────────────────────────────────────────────
export default function App() {
  const [db, setDb] = useState({});
  const [view, setView] = useState("home");
  const [activeTid, setActiveTid] = useState(null);
  const [winner, setWinner] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const [step, setStep] = useState(0);
  const [tName, setTName] = useState("");
  const [numTeams, setNumTeams] = useState(2);
  const [winsRequired, setWinsRequired] = useState(10);
  const [totalPoints, setTotalPoints] = useState(500);
  const [cTeams, setCTeams] = useState([{id:uid(),name:"Team 1",players:[]},{id:uid(),name:"Team 2",players:[]}]);
  const [notes, setNotes] = useState([]);
  const [noteInput, setNoteInput] = useState("");

  // Global Session Based Admin Lock
  const [isAdmin, setIsAdmin] = useState(() => sessionStorage.getItem("carrom_admin") === "true");

  const unlockAdmin = () => {
    setIsAdmin(true);
    sessionStorage.setItem("carrom_admin", "true");
  };

  const lockAdmin = () => {
    setIsAdmin(false);
    sessionStorage.removeItem("carrom_admin");
  };

  // ── Firebase Real-time Sync ──────────────────────────────────────────────
  useEffect(() => {
    let unsubscribe = () => {};

    const setupFirebaseData = async () => {
      try {
        const oldRef = doc(firestoreDB, "tournaments", "global_data");
        const oldSnap = await getDoc(oldRef);
        if (oldSnap.exists()) {
          const oldData = oldSnap.data();
          const migrationPromises = Object.values(oldData).map(t => {
            if (!t || !t.id) return null;
            const newRef = doc(firestoreDB, "tournaments", t.id);
            return setDoc(newRef, { ...t, updatedAt: Date.now() }, { merge: true });
          }).filter(Boolean);
          await Promise.all(migrationPromises);
          await deleteDoc(oldRef);
          console.log("Old data successfully migrated!");
        }
      } catch (e) {
        console.log("Migration skipped or already done:", e.message);
      }

      const colRef = collection(firestoreDB, "tournaments");
      unsubscribe = onSnapshot(colRef, (snapshot) => {
        const data = {};
        snapshot.forEach(docSnap => {
          if (docSnap.id === "global_data") return;
          const d = docSnap.data();
          
          if (!d || typeof d !== 'object' || !Array.isArray(d.teams)) {
            return;
          }
          
          data[docSnap.id] = { 
            ...d, 
            id: docSnap.id,
            name: typeof d.name === 'string' ? d.name : "Tournament",
            teams: d.teams,
            history: Array.isArray(d.history) ? d.history : [],
            status: d.status || "active",
            matchCount: d.matchCount || 0
          };
        });
        setDb(data);
        setIsLoading(false);
      }, (error) => {
        console.error("Firebase Sync Error:", error);
        setIsLoading(false);
      });
    };

    setupFirebaseData();

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  const persistOne = async (tournament) => {
    try {
      const docRef = doc(firestoreDB, "tournaments", tournament.id);
      await setDoc(docRef, { ...tournament, updatedAt: Date.now() });
    } catch (error) {
      console.error("Firebase save failed:", error);
      alert("Data save nahi hua. Internet check karo.");
    }
  };

  const persistSingle = async (t) => {
    setDb(prev => ({ ...prev, [t.id]: t }));
    await persistOne(t);
  };

  const tournaments = Object.values(db);
  const at = db[activeTid];
  const ppw = winsRequired > 0 ? Math.round(totalPoints / winsRequired) : 0;

  function goHome() { setView("home"); setActiveTid(null); setWinner(null); }
  function openT(id) { setActiveTid(id); setView("tournament"); setWinner(null); }

  function startCreate() {
    setStep(0); setTName(""); setNumTeams(2); setWinsRequired(10); setTotalPoints(500);
    setCTeams([{id:uid(),name:"Team 1",players:[]},{id:uid(),name:"Team 2",players:[]}]);
    setNotes([]); setNoteInput("");
    setView("create");
  }

  function syncTeamCount(n) {
    const num = Math.max(2,Math.min(6,parseInt(n)||2));
    setNumTeams(num);
    setCTeams(prev => {
      const arr=[];
      for(let i=0;i<num;i++) arr.push(prev[i]||{id:uid(),name:`Team ${i+1}`,players:[]});
      return arr;
    });
  }

  function updateCTeamName(i,v) { setCTeams(p=>p.map((t,j)=>j===i?{...t,name:v}:t)); }
  function addCPlayer(ti,name) {
    if(!name.trim()) return;
    setCTeams(p=>p.map((t,j)=>j===ti?{...t,players:[...t.players,{id:uid(),name:name.trim()}]}:t));
  }
  function removeCPlayer(ti,pi) { setCTeams(p=>p.map((t,j)=>j===ti?{...t,players:t.players.filter((_,k)=>k!==pi)}:t)); }

  const canNext = () => {
    if(step===0) return tName.trim() && cTeams.every(t=>t.name.trim());
    if(step===1) return winsRequired>=1 && totalPoints>=1;
    return true;
  };

  function createTournament() {
    const t = {
      id:uid(), name:tName.trim(), winsRequired, totalPoints, pointsPerWin:ppw,
      teams:cTeams.map((t,i)=>({...t,wins:0,losses:0,points:0,emoji:TEAM_EMOJIS[i],color:TEAM_COLORS[i],bg:TEAM_BG[i]})),
      history:[], notes, status:"active", createdAt:Date.now(), winnerId:null, matchCount:0,
    };
    persistSingle(t);
    openT(t.id);
  }

  function cloneT(original) {
    const cloned = {
      ...original,
      id: uid(),
      name: original.name + " (Copy)",
      status: "active",
      winnerId: null,
      matchCount: 0,
      history: [],
      createdAt: Date.now(),
      teams: original.teams?.map(tm => ({
        ...tm,
        id: uid(),
        wins: 0,
        losses: 0,
        points: 0,
        players: (tm.players || []).map(p => ({ ...p, id: uid() })),
      })) || [],
    };
    persistSingle(cloned);
    openT(cloned.id);
  }

  function recordMatch(t, winnerTeamId, loserTeamId, t0Players, t1Players) {
    const nt = {...t};
    nt.matchCount=(nt.matchCount||0)+1;
    nt.history=[...(nt.history||[]),{
      matchNum:nt.matchCount, winnerId:winnerTeamId, loserId:loserTeamId,
      t0Id:nt.teams[0]?.id, t1Id:nt.teams[1]?.id,
      t0Players:t0Players||[], t1Players:t1Players||[],
    }];
    nt.teams=nt.teams.map(tm=>{
      if(tm.id===winnerTeamId) return {...tm,wins:tm.wins+1,points:tm.points+(nt.pointsPerWin||0)};
      if(tm.id===loserTeamId) return {...tm,losses:tm.losses+1};
      return tm;
    });
    const winTeam=nt.teams.find(tm=>tm.id===winnerTeamId);
    if(winTeam&&winTeam.wins>=nt.winsRequired){nt.status="completed";nt.winnerId=winnerTeamId;setWinner(winTeam);}
    persistSingle(nt);
  }

  function undoMatch() {
    const t={...at};
    if(!t.history||!t.history.length) return;
    const last=t.history[t.history.length-1];
    t.history=t.history.slice(0,-1);
    t.matchCount=Math.max(0,(t.matchCount||1)-1);
    t.status="active"; t.winnerId=null;
    t.teams=t.teams.map(tm=>{
      if(tm.id===last.winnerId) return {...tm,wins:Math.max(0,tm.wins-1),points:Math.max(0,tm.points-(t.pointsPerWin||0))};
      if(tm.id===last.loserId) return {...tm,losses:Math.max(0,tm.losses-1)};
      return tm;
    });
    persistSingle(t);
    setWinner(null);
  }

  function updateNotes(tid, newNotes) {
    persistSingle({...db[tid], notes:newNotes});
  }

  function updateTeamPlayers(tid, teamId, newPlayers) {
    const t={...db[tid]};
    t.teams=t.teams.map(tm=>tm.id===teamId?{...tm,players:newPlayers}:tm);
    persistSingle(t);
  }

  // ── UPDATE SETTINGS (Name & Team Names ONLY) ────────────────────────────────
  function updateSettings(tid, newName, newWins, newPoints, teamData) {
    const t = { ...db[tid] };
    t.name = newName.trim() || t.name;
    t.winsRequired = Math.max(1, parseInt(newWins) || t.winsRequired);
    t.totalPoints = Math.max(1, parseInt(newPoints) || t.totalPoints);
    t.pointsPerWin = t.winsRequired > 0 ? Math.round(t.totalPoints / t.winsRequired) : t.pointsPerWin;
    
    // Update ONLY names. Keep original wins and losses intact!
    t.teams = t.teams.map(tm => {
      const td = teamData && teamData[tm.id];
      const name = (td && td.name !== undefined) ? (td.name.trim() || tm.name) : tm.name;
      return { ...tm, name, points: tm.wins * t.pointsPerWin };
    });
    
    // Check winner logic in case win requirements changed
    const winner = t.teams.find(tm => tm.wins >= t.winsRequired);
    if (winner) { t.status = "completed"; t.winnerId = winner.id; }
    else { t.status = "active"; t.winnerId = null; }
    
    persistSingle(t);
  }

  function deleteT(id) {
    setDb(prev => { const nd={...prev}; delete nd[id]; return nd; });
    try { deleteDoc(doc(firestoreDB, "tournaments", id)); } catch(e) { console.error("Delete failed:", e); }
    if(activeTid===id) goHome();
  }

  if (isLoading) {
    return (
      <div style={{display:"flex",height:"100vh",alignItems:"center",justifyContent:"center",
        fontFamily:"sans-serif",flexDirection:"column",gap:12,color:"#5c3d1e"}}>
        <div style={{fontSize:48,animation:"float 2s ease-in-out infinite"}}>🎯</div>
        <div style={{fontWeight:700,fontSize:18}}>Loading Tournament Data…</div>
      </div>
    );
  }

  return (
    <>
      <style>{CSS}</style>
      <nav className="nav">
        <div className="nav-logo" onClick={goHome}>
          <span className="logo-icon">🎯</span>
          <span className="logo-text">Carrom Master</span>
        </div>
        <div className="nav-actions">
          <button className="btn btn-secondary btn-sm" onClick={()=>setView("list")}>📋 All</button>
          <button className="btn btn-primary btn-sm" onClick={startCreate}>+ New</button>
        </div>
      </nav>

      {view==="home"&&<HeroPage onStart={startCreate} tournaments={tournaments} onOpen={openT} onClone={cloneT}/>}
      {view==="list"&&<TournamentList tournaments={tournaments} onOpen={openT} onCreate={startCreate} onDelete={deleteT} onClone={cloneT}/>}
      {view==="create"&&(
        <CreateWizard step={step} setStep={setStep} canNext={canNext}
          tName={tName} setTName={setTName}
          numTeams={numTeams} syncTeamCount={syncTeamCount}
          cTeams={cTeams} updateCTeamName={updateCTeamName}
          addCPlayer={addCPlayer} removeCPlayer={removeCPlayer}
          winsRequired={winsRequired} setWinsRequired={setWinsRequired}
          totalPoints={totalPoints} setTotalPoints={setTotalPoints}
          ppw={ppw} notes={notes} setNotes={setNotes}
          noteInput={noteInput} setNoteInput={setNoteInput}
          onCreate={createTournament}
        />
      )}
      {view==="tournament"&&at&&(
        <TournamentView t={at} onMatch={recordMatch} onUndo={undoMatch}
          onDelete={()=>deleteT(activeTid)} onBack={goHome}
          onUpdateNotes={(n)=>updateNotes(activeTid,n)}
          onUpdatePlayers={(teamId,players)=>updateTeamPlayers(activeTid,teamId,players)}
          onUpdateSettings={(name,wins,pts,td)=>updateSettings(activeTid,name,wins,pts,td)}
          onClone={()=>cloneT(at)}
          isAdmin={isAdmin} unlockAdmin={unlockAdmin} lockAdmin={lockAdmin}
        />
      )}
      {winner&&(<><Confetti/><WinnerBanner team={winner} onClose={()=>setWinner(null)}/></>)}
    </>
  );
}

// ─── Hero Page ────────────────────────────────────────────────────────────────
function HeroPage({onStart,tournaments,onOpen,onClone}) {
  const active=tournaments.filter(t=>t.status==="active");
  const done=tournaments.filter(t=>t.status==="completed");
  return (
    <>
      <div className="hero">
        <div className="hero-disc">🎯</div>
        <h1>Carrom <span>Master</span></h1>
        <p className="hero-sub">Track tournaments · Manage teams · Crown champions</p>
        <button className="hero-cta" onClick={onStart}>🏆 Create Tournament</button>
        <div className="hero-stats">
          {[
            ["Total", tournaments.length],
            ["Active", active.length],
            ["Done", done.length],
            ["Teams", tournaments.reduce((s,t) => s + (t.teams ? t.teams.length : 0), 0)]
          ].map(([l,v])=>(
            <div key={l} className="hero-stat"><strong>{Number(v) || 0}</strong><span>{l}</span></div>
          ))}
        </div>
      </div>
      {active.length>0&&<div className="page"><h2 className="section-title">🟢 Active</h2><div className="card-grid">{active.map(t=><TCard key={t.id} t={t} onOpen={onOpen} onClone={onClone}/>)}</div></div>}
      {done.length>0&&<div className="page" style={{paddingTop:0}}><h2 className="section-title">🏆 Completed</h2><div className="card-grid">{done.map(t=><TCard key={t.id} t={t} onOpen={onOpen} onClone={onClone}/>)}</div></div>}
      {tournaments.length===0&&<div className="page"><div className="empty-state"><div className="empty-icon">🏟️</div><p style={{marginBottom:16}}>No tournaments yet.</p><button className="btn btn-primary btn-lg" onClick={onStart}>🚀 Get Started</button></div></div>}
    </>
  );
}

function TCard({t,onOpen,onClone}) {
  const leader = t.teams && t.teams.length > 0 ? [...t.teams].sort((a,b)=>(b.wins||0)-(a.wins||0))[0] : null;
  return (
    <div>
      <div className="card t-card" onClick={()=>onOpen(t.id)}>
        <div className="flex-between mb-2">
          <div className="t-card-name">{typeof t.name === 'string' ? t.name : "Tournament"}</div>
          <span className={`badge ${t.status==="active"?"badge-live":"badge-done"}`}>{t.status==="active"?"🟢 Live":"🏆 Done"}</span>
        </div>
        <div className="text-xs text-muted mb-3">{t.teams?.length || 0} teams · {t.winsRequired || 0} wins needed · Match #{t.matchCount||0}</div>
        {t.winnerId&&<div className="chip chip-gold mb-2">🏆 {t.teams?.find(x=>x.id===t.winnerId)?.name || 'Winner'} wins!</div>}
        {leader&&!t.winnerId&&(
          <>
            <div className="flex-between mb-2">
              <span className="text-sm fw-7">{leader.emoji} {leader.name}</span>
              <span className="chip chip-gold">{leader.wins}/{t.winsRequired} W</span>
            </div>
            <div className="progress-bar"><div className="pf pf-gold" style={{width:`${Math.min(100,((leader.wins||0)/(t.winsRequired||1))*100)}%`}}/></div>
          </>
        )}
      </div>
      <button className="btn btn-clone btn-sm btn-full mt-2" onClick={e=>{e.stopPropagation();onClone(t);}}>
        📋 Clone Tournament
      </button>
    </div>
  );
}

function ConfirmModal({message, onYes, onNo}) {
  return (
    <div className="modal-overlay center" style={{zIndex:9999}} onClick={onNo}>
      <div className="modal-box center-box" style={{maxWidth:320,padding:"28px 24px",textAlign:"center"}} onClick={e=>e.stopPropagation()}>
        <div style={{fontSize:40,marginBottom:12}}>🗑️</div>
        <div className="fw-7" style={{fontSize:16,marginBottom:8}}>{message}</div>
        <div className="text-sm text-muted" style={{marginBottom:20}}>This action cannot be undone.</div>
        <div style={{display:"flex",gap:10}}>
          <button className="btn btn-secondary btn-full" onClick={onNo}>Cancel</button>
          <button className="btn btn-danger btn-full" onClick={onYes}>Delete</button>
        </div>
      </div>
    </div>
  );
}

function TournamentList({tournaments,onOpen,onCreate,onDelete,onClone}) {
  const [confirmId, setConfirmId] = useState(null);
  const confirmT = tournaments.find(t=>t.id===confirmId);
  return (
    <div className="page">
      <div className="flex-between mb-5">
        <h2 className="section-title" style={{margin:0}}>All Tournaments</h2>
        <button className="btn btn-primary btn-sm" onClick={onCreate}>+ New</button>
      </div>
      {tournaments.length===0
        ?<div className="empty-state"><div className="empty-icon">🏟️</div><p>No tournaments yet.</p></div>
        :<div className="card-grid">
          {[...tournaments].sort((a,b)=>b.createdAt-a.createdAt).map(t=>(
            <div key={t.id}>
              <TCard t={t} onOpen={onOpen} onClone={onClone}/>
              <button className="btn btn-danger btn-sm btn-full mt-2" onClick={()=>setConfirmId(t.id)}>🗑 Delete</button>
            </div>
          ))}
        </div>
      }
      {confirmId&&confirmT&&(
        <ConfirmModal message={`Delete "${confirmT.name}"?`}
          onYes={()=>{onDelete(confirmId);setConfirmId(null);}}
          onNo={()=>setConfirmId(null)}/>
      )}
    </div>
  );
}

const STEP_LABELS = ["Teams","Scoring","Notes"];

function CreateWizard({step,setStep,canNext,tName,setTName,numTeams,syncTeamCount,cTeams,updateCTeamName,addCPlayer,removeCPlayer,winsRequired,setWinsRequired,totalPoints,setTotalPoints,ppw,notes,setNotes,noteInput,setNoteInput,onCreate}) {
  const [activeTeamTab,setActiveTeamTab]=useState(0);
  const [playerInputs,setPlayerInputs]=useState({});

  function addNote() { if(!noteInput.trim()) return; setNotes(n=>[...n,noteInput.trim()]); setNoteInput(""); }
  function deleteNote(i) { setNotes(n=>n.filter((_,j)=>j!==i)); }

  return (
    <div className="page" style={{maxWidth:580}}>
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
        {step===0&&(
          <>
            <div className="fw-7 fd mb-4" style={{fontSize:18}}>🏆 Tournament & Teams</div>
            <div className="form-group">
              <label className="form-label">Tournament Name *</label>
              <input className="form-input" placeholder="e.g. Office Carrom Championship" value={tName} onChange={e=>setTName(e.target.value)}/>
            </div>
            <div className="form-group">
              <label className="form-label">Number of Teams</label>
              <select className="form-select" value={numTeams} onChange={e=>syncTeamCount(e.target.value)}>
                {[2,3,4,5,6].map(n=><option key={n} value={n}>{n} Teams</option>)}
              </select>
            </div>
            <div className="form-label mb-2">Team Names & Players</div>
            <div className="tabs mb-3">
              {cTeams.map((t,i)=>(
                <button key={t.id} className={`tab ${activeTeamTab===i?"active":""}`} onClick={()=>setActiveTeamTab(i)}>
                  {TEAM_EMOJIS[i]} {t.name||`T${i+1}`} {t.players.length>0?`(${t.players.length})`:""}
                </button>
              ))}
            </div>
            {cTeams[activeTeamTab]&&(()=>{
              const ti=activeTeamTab, team=cTeams[ti];
              const pInput=playerInputs[ti]||"";
              const setPInput=v=>setPlayerInputs(p=>({...p,[ti]:v}));
              return (
                <div>
                  <div className="form-group">
                    <label className="form-label">Team Name</label>
                    <input className="form-input" placeholder={`Team ${ti+1} name`} value={team.name} onChange={e=>updateCTeamName(ti,e.target.value)}/>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Players ({team.players.length})</label>
                    {team.players.map((p,pi)=>(
                      <div key={p.id} className="flex-between mb-2">
                        <span className="text-sm" style={{padding:"8px 10px",background:TEAM_BG[ti],borderRadius:8,flex:1}}>👤 {p.name}</span>
                        <button className="btn btn-danger btn-xs" style={{marginLeft:6}} onClick={()=>removeCPlayer(ti,pi)}>✕</button>
                      </div>
                    ))}
                    <div className="input-row">
                      <input className="form-input" placeholder="Player name, press Add" value={pInput}
                        onChange={e=>setPInput(e.target.value)}
                        onKeyDown={e=>{if(e.key==="Enter"){addCPlayer(ti,pInput);setPInput("");}}}/>
                      <button className="btn btn-primary" style={{flexShrink:0}} onClick={()=>{addCPlayer(ti,pInput);setPInput("");}}>Add</button>
                    </div>
                  </div>
                </div>
              );
            })()}
          </>
        )}
        {step===1&&(
          <>
            <div className="fw-7 fd mb-4" style={{fontSize:18}}>⚙️ Scoring Settings</div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Wins Required</label>
                <input className="form-input" type="number" min="1" max="99" value={winsRequired||""}
                  onChange={e=>setWinsRequired(e.target.value===""?"":Math.max(1,parseInt(e.target.value)||1))}/>
                <div className="form-hint">Matches to win tournament</div>
              </div>
              <div className="form-group">
                <label className="form-label">Total Points Pool</label>
                <input className="form-input" type="number" min="1" value={totalPoints||""}
                  onChange={e=>setTotalPoints(e.target.value===""?"":Math.max(1,parseInt(e.target.value)||1))}/>
                <div className="form-hint">Total points available</div>
              </div>
            </div>
            <div className="info-box">
              <div className="text-sm fw-7 mb-2">🧮 Auto Calculated:</div>
              <div className="text-sm mb-1">Points per match win = <strong>{totalPoints||0} ÷ {winsRequired||0} = {ppw} pts</strong></div>
              <div className="text-sm text-muted">First team to reach <strong>{winsRequired}</strong> wins takes the trophy 🏆</div>
            </div>
          </>
        )}
        {step===2&&(
          <>
            <div className="fw-7 fd mb-1" style={{fontSize:18}}>📋 Tournament Notes</div>
            <p className="text-sm text-muted mb-4">Add rules, info, or reminders for players.</p>
            {notes.length>0&&(
              <div className="card card-sm mb-3" style={{background:"var(--cream)"}}>
                {notes.map((n,i)=>(
                  <div key={i} className="note-item">
                    <span className="note-num">{i+1}.</span>
                    <span className="note-text">{n}</span>
                    <button className="btn btn-danger btn-xs" style={{flexShrink:0}} onClick={()=>deleteNote(i)}>✕</button>
                  </div>
                ))}
              </div>
            )}
            {notes.length===0&&<div className="text-sm text-muted mb-3">No notes yet.</div>}
            <div className="input-row">
              <input className="form-input" placeholder="Type a rule and press Add…" value={noteInput}
                onChange={e=>setNoteInput(e.target.value)} onKeyDown={e=>{if(e.key==="Enter")addNote();}}/>
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

function TournamentView({t,onMatch,onUndo,onDelete,onBack,onUpdateNotes,onUpdatePlayers,onUpdateSettings,onClone,isAdmin,unlockAdmin,lockAdmin}) {
  const [tab,setTab]=useState("play");
  const [teamPopup,setTeamPopup]=useState(null);
  const [showDeleteConfirm,setShowDeleteConfirm]=useState(false);
  const teamIndex = t.teams?.findIndex(tm => tm.id === teamPopup?.id) ?? -1;

  return (
    <div className="page">
      <div className="flex-between mb-4">
        <div>
          <button className="btn btn-ghost btn-sm mb-2" onClick={onBack}>← Back</button>
          <h2 className="t-header-name">{t.name}</h2>
          <div className="text-xs text-muted" style={{marginTop:4,marginBottom:6}}>
            {t.teams?.length || 0} teams · {t.matchCount||0} matches played
          </div>
          {t.status==="active"
            ? <span className="badge-live-pulse"><span className="badge-live-dot"/>Active</span>
            : <span className="badge badge-done">🏆 Completed</span>
          }
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:6,alignItems:"flex-end"}}>
          <button className="btn btn-danger btn-sm btn-icon" title="Delete" onClick={()=>setShowDeleteConfirm(true)}>🗑</button>
          <button className="btn btn-clone btn-sm" onClick={onClone}>📋 Clone</button>
        </div>
      </div>

      <div className="tabs">
        {[["play","🎮 Play"],["teams","👥 Teams"],["history","📜 History"],["notes","📋 Rules"],["settings","⚙️ Settings"]].map(([k,l])=>(
          <button key={k} className={`tab ${tab===k?"active":""}`} onClick={()=>setTab(k)}>{l}</button>
        ))}
      </div>

      {tab==="play"&&<PlayTab t={t} onMatch={onMatch} onUndo={onUndo} onTeamClick={setTeamPopup} isAdmin={isAdmin} unlockAdmin={unlockAdmin} lockAdmin={lockAdmin}/>}
      {tab==="teams"&&<TeamsTab t={t} onTeamClick={setTeamPopup} onUpdatePlayers={onUpdatePlayers}/>}
      {tab==="history"&&<HistoryTab t={t}/>}
      {tab==="notes"&&<NotesTab t={t} onUpdateNotes={onUpdateNotes}/>}
      {tab==="settings"&&<SettingsTab t={t} onUpdateSettings={onUpdateSettings} isAdmin={isAdmin} unlockAdmin={unlockAdmin} lockAdmin={lockAdmin}/>}

      {teamPopup&&<TeamPopup team={teamPopup} t={t} teamIndex={teamIndex>=0?teamIndex:0} onClose={()=>setTeamPopup(null)}/>}
      {showDeleteConfirm&&(
        <ConfirmModal message={`Delete "${t.name}"?`}
          onYes={()=>{setShowDeleteConfirm(false);onDelete();}}
          onNo={()=>setShowDeleteConfirm(false)}/>
      )}
    </div>
  );
}

function PlayTab({t,onMatch,onUndo,onTeamClick,isAdmin,unlockAdmin,lockAdmin}) {
  const [showPlayerSelect,setShowPlayerSelect]=useState(false);
  const [showGate, setShowGate] = useState(false);
  const [pendingAction, setPendingAction] = useState(null);

  const sorted = [...(t.teams || [])].sort((a,b)=>b.wins-a.wins);
  const isCompleted=t.status==="completed";
  const totalMatches=t.matchCount||0;

  function handleProtectedAction(action) {
    if (isAdmin) {
      action();
    } else {
      setPendingAction(() => action);
      setShowGate(true);
    }
  }

  return (
    <>
      <div className="flex-between mb-2">
        <div className="fw-7" style={{fontSize:14}}>📊 Stats</div>
        {isAdmin && !isCompleted && (
          <button className="btn btn-ghost btn-xs" onClick={lockAdmin}>🔒 Lock Scoring</button>
        )}
      </div>

      <div className="stat-grid mb-4">
        {[
          {label:"Matches",val:totalMatches,style:{}},
          {label:"Pts/Win",val:t.pointsPerWin,style:{color:"var(--gold-d)"}},
          {label:"Target",val:t.winsRequired+"W",style:{color:"var(--green)"}},
          {label:"Points Pool",val:t.totalPoints,style:{}},
        ].map(s=>(
          <div key={s.label} className="stat-card">
            <div className="stat-num" style={s.style}>{s.val}</div>
            <div className="stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="race-track">
        <div className="fw-7 mb-3" style={{fontSize:14}}>🏁 Race to {t.winsRequired} Wins</div>
        {sorted.map((team,i)=>{
          const toGo=Math.max(0,t.winsRequired-team.wins);
          const isWinner=t.winnerId===team.id;
          const isLeader=i===0&&!isCompleted;
          const pct=Math.min(100,(team.wins/t.winsRequired)*100);
          return (
            <div key={team.id} className={`race-team ${isWinner?"is-winner":isLeader?"is-leader":""}`} onClick={()=>onTeamClick(team)}>
              <div className="race-header">
                <div className="race-name">
                  <span style={{fontSize:20}}>{team.emoji}</span>
                  <span>{team.name}</span>
                  {isWinner&&<span className="chip chip-green">🏆 Winner!</span>}
                  {isLeader&&!isWinner&&<span className="chip chip-gold" style={{fontSize:10}}>👑 Leading</span>}
                </div>
                <div className="race-right">
                  <span className="race-score" style={{color:team.color}}>{team.wins}<span style={{fontSize:14,color:"var(--slate-l)"}}>/{t.winsRequired}</span></span>
                  {!isCompleted&&(
                    <span className={`wins-pill ${toGo<=1?"critical":toGo<=3?"close":""}`}>
                      {toGo===0?"Done 🎉":toGo===1?"1 to go!":toGo+" to go"}
                    </span>
                  )}
                </div>
              </div>
              <div className="progress-bar mb-1">
                <div className={`pf ${isWinner?"pf-green":i===0?"pf-gold":i===1?"pf-red":"pf-blue"}`} style={{width:`${pct}%`}}/>
              </div>
              <div className="text-xs text-muted">{team.wins}W · {team.losses}L · {team.points} pts</div>
            </div>
          );
        })}
      </div>

      {!isCompleted&&(
        <div className="match-record-box">
          <div className="match-title">
            🎯 Match #{totalMatches+1} — Who Won?
            {!isAdmin && <span style={{marginLeft:"auto", fontSize:16}} title="Locked">🔒</span>}
          </div>
          <div className="match-teams-grid">
            {t.teams && t.teams[0]&&(
              <button className="match-team-btn" style={{borderColor:t.teams[0].color+"44",background:t.teams[0].bg}} onClick={()=>handleProtectedAction(()=>setShowPlayerSelect(true))}>
                <span className="match-team-emoji">{t.teams[0].emoji}</span>
                <span className="match-team-name">{t.teams[0].name}</span>
                <span className="match-team-wins">{t.teams[0].wins} wins</span>
              </button>
            )}
            <div className="match-vs">VS</div>
            {t.teams && t.teams[1]&&(
              <button className="match-team-btn" style={{borderColor:t.teams[1].color+"44",background:t.teams[1].bg}} onClick={()=>handleProtectedAction(()=>setShowPlayerSelect(true))}>
                <span className="match-team-emoji">{t.teams[1].emoji}</span>
                <span className="match-team-name">{t.teams[1].name}</span>
                <span className="match-team-wins">{t.teams[1].wins} wins</span>
              </button>
            )}
          </div>
          <p className="text-xs text-muted" style={{textAlign:"center",marginBottom:10}}>Tap either team to record the winner</p>
          {totalMatches>0&&<button className="btn btn-ghost btn-sm btn-full" onClick={()=>handleProtectedAction(onUndo)}>↩ Undo Last Match</button>}
        </div>
      )}

      {isCompleted&&(
        <div className="card" style={{background:"linear-gradient(135deg,#fffbf0,#fff8e6)",border:"2px solid var(--gold-l)",textAlign:"center",padding:"28px 20px"}}>
          <div style={{fontSize:52,marginBottom:8}}>🏆</div>
          <div className="fd" style={{fontSize:20,fontWeight:900,color:"var(--gold-d)"}}>Tournament Complete!</div>
          <div style={{fontSize:16,fontWeight:700,marginTop:6}}>{t.teams?.find(x=>x.id===t.winnerId)?.emoji} {t.teams?.find(x=>x.id===t.winnerId)?.name} Wins!</div>
          <div className="text-sm text-muted mt-2">{totalMatches} matches played</div>
          {(t.history||[]).length>0&&<button className="btn btn-secondary btn-sm mt-3" onClick={()=>handleProtectedAction(onUndo)}>↩ Undo Last</button>}
        </div>
      )}

      {showPlayerSelect&&(
        <PlayerSelectModal t={t} onConfirm={(wId,lId,t0p,t1p)=>{onMatch(t,wId,lId,t0p,t1p);setShowPlayerSelect(false);}} onClose={()=>setShowPlayerSelect(false)}/>
      )}

      {showGate && (
        <PasswordGate
          onSuccess={() => {
            unlockAdmin();
            setShowGate(false);
            if (pendingAction) {
              pendingAction();
              setPendingAction(null);
            }
          }}
          onClose={() => {
            setShowGate(false);
            setPendingAction(null);
          }}
        />
      )}
    </>
  );
}

function PlayerSelectModal({t,onConfirm,onClose}) {
  const [t0Players,setT0Players]=useState([]);
  const [t1Players,setT1Players]=useState([]);
  const [winner,setWinner]=useState(null);
  const team0=t.teams && t.teams[0], team1=t.teams && t.teams[1];
  const hasAnyPlayers=(team0?.players?.length>0)||(team1?.players?.length>0);

  function toggleP(teamIdx,pid) {
    if(teamIdx===0) setT0Players(p=>p.includes(pid)?p.filter(x=>x!==pid):[...p,pid]);
    else setT1Players(p=>p.includes(pid)?p.filter(x=>x!==pid):[...p,pid]);
  }

  function doConfirm() {
    const loserId=winner===team0.id?team1.id:team0.id;
    onConfirm(winner,loserId,t0Players,t1Players);
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={e=>e.stopPropagation()} style={{width:"100%",boxSizing:"border-box"}}>
        <div className="modal-handle"/>
        <div style={{textAlign:"center",marginBottom:20}}>
          <div style={{fontSize:28,marginBottom:4}}>🎯</div>
          <div className="fd fw-7" style={{fontSize:18,color:"var(--brown)"}}>Match #{(t.matchCount||0)+1}</div>
          <div className="text-xs text-muted" style={{marginTop:2}}>Select players &amp; pick the winner</div>
        </div>

        {hasAnyPlayers&&(
          <div style={{marginBottom:16}}>
            <div style={{fontSize:11,fontWeight:700,color:"var(--slate-l)",letterSpacing:".6px",textTransform:"uppercase",marginBottom:10}}>
              Who Played? (Optional)
            </div>
            {[team0,team1].map((team,ti)=>{
              if(!team||!team.players || team.players.length===0) return null;
              const sel = ti===0?t0Players:t1Players;
              return (
                <div key={team.id} style={{marginBottom:12}}>
                  <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:6}}>
                    <span style={{fontSize:16}}>{team.emoji}</span>
                    <span style={{fontSize:13,fontWeight:700,color:team.color}}>{team.name}</span>
                  </div>
                  <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
                    {team.players.map(p=>{
                      const isSelected=sel.includes(p.id);
                      return (
                        <button key={p.id} onClick={()=>toggleP(ti,p.id)}
                          style={{padding:"6px 14px",borderRadius:20,border:`2px solid ${isSelected?team.color:"#e5e7eb"}`,
                            background:isSelected?team.bg:"var(--white)",color:isSelected?team.color:"var(--brown)",
                            fontSize:13,fontWeight:600,fontFamily:"var(--fb)",cursor:"pointer",
                            transition:"all .15s",WebkitTapHighlightColor:"transparent"}}>
                          {isSelected?"✓ ":""}{p.name}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
            <div className="divider"/>
          </div>
        )}

        <div style={{fontSize:11,fontWeight:700,color:"var(--slate-l)",letterSpacing:".6px",textTransform:"uppercase",marginBottom:12}}>
          Who Won This Match? *
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:10,marginBottom:20}}>
          {[team0,team1].filter(Boolean).map(team=>{
            const isWinner=winner===team.id;
            return (
              <button key={team.id} onClick={()=>setWinner(team.id)}
                style={{display:"flex",alignItems:"center",gap:14,padding:"14px 16px",
                  borderRadius:14,border:`2px solid ${isWinner?team.color:"#e5e7eb"}`,
                  background:isWinner?team.bg:"var(--white)",cursor:"pointer",
                  textAlign:"left",width:"100%",fontFamily:"var(--fb)",
                  transition:"all .2s",WebkitTapHighlightColor:"transparent",
                  boxShadow:isWinner?`0 4px 16px ${team.color}33`:"none"}}>
                <span style={{fontSize:30,flexShrink:0}}>{team.emoji}</span>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{fontWeight:700,fontSize:15,color:isWinner?team.color:"var(--brown)",marginBottom:2}}>{team.name}</div>
                  <div style={{fontSize:12,color:"var(--slate-l)"}}>{team.wins} wins so far</div>
                </div>
                <div style={{width:28,height:28,borderRadius:"50%",flexShrink:0,
                  background:isWinner?team.color:"#f0ebe0",display:"flex",alignItems:"center",
                  justifyContent:"center",fontSize:14,color:"white",transition:"all .2s"}}>
                  {isWinner?"✓":""}
                </div>
              </button>
            );
          })}
        </div>

        <div style={{display:"flex",gap:10}}>
          <button className="btn btn-secondary" style={{flex:1}} onClick={onClose}>Cancel</button>
          <button className="btn btn-primary btn-lg" style={{flex:2}} disabled={!winner} onClick={doConfirm}>
            ✅ Confirm Win
          </button>
        </div>
      </div>
    </div>
  );
}

const ADMIN_PASSWORD = "daddyshome";

function PasswordGate({ onSuccess, onClose }) {
  const [pass, setPass] = useState("");
  const [shake, setShake] = useState(false);
  const [wrong, setWrong] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => { setTimeout(() => inputRef.current?.focus(), 100); }, []);

  function check() {
    if (pass === ADMIN_PASSWORD) {
      onSuccess();
    } else {
      setShake(true);
      setWrong(true);
      setPass("");
      setTimeout(() => setShake(false), 600);
    }
  }

  return (
    <div className="modal-overlay center" onClick={onClose}>
      <div className="modal-box center-box" style={{maxWidth:340,padding:"32px 24px",textAlign:"center",position:"relative"}} onClick={e=>e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>✕</button>

        <div style={{
          width:64,height:64,borderRadius:"50%",
          background:"linear-gradient(135deg,#5c3d1e,#9a6f2a)",
          display:"flex",alignItems:"center",justifyContent:"center",
          fontSize:28,margin:"0 auto 16px",
          boxShadow:"0 8px 24px rgba(92,61,30,.3)"
        }}>🔐</div>

        <div className="fd fw-7" style={{fontSize:20,color:"var(--brown)",marginBottom:6}}>Beta Ji, Pehle Code To</div>
        <div className="text-sm text-muted" style={{marginBottom:24}}>Settings edit karne ke liye password daalo</div>

        <div style={{
          animation: shake ? "wrongShake 0.5s ease" : "none",
        }}>
          <input
            ref={inputRef}
            type="password"
            className="form-input"
            placeholder="Password daalo..."
            value={pass}
            onChange={e => { setPass(e.target.value); setWrong(false); }}
            onKeyDown={e => { if(e.key==="Enter") check(); }}
            style={{
              textAlign:"center",fontSize:18,letterSpacing:4,
              borderColor: wrong ? "var(--red)" : undefined,
              marginBottom: 8,
            }}
          />
          {wrong && (
            <div style={{
              color:"var(--red)",fontSize:14,fontWeight:700,
              marginBottom:12,
              padding:"10px 16px",
              background:"#fff0f0",
              borderRadius:10,
              border:"1.5px solid #ffd6d6",
            }}>
              🚫 Naa Munna Naa — Entry pass ke bina koi Edit Nahi!
            </div>
          )}
        </div>

        <button className="btn btn-primary btn-full btn-lg" style={{marginTop:8}} onClick={check}>
          🔓 Enter Karo
        </button>
      </div>
    </div>
  );
}

// ─── Settings Tab ────────────────────────────────────────────────────────────
function SettingsTab({t, onUpdateSettings, isAdmin, unlockAdmin, lockAdmin}) {
  const [showGate, setShowGate] = useState(false);

  if (!isAdmin) {
    return (
      <div>
        <div className="card" style={{textAlign:"center",padding:"48px 24px"}}>
          <div style={{
            width:80,height:80,borderRadius:"50%",
            background:"linear-gradient(135deg,#5c3d1e,#9a6f2a)",
            display:"flex",alignItems:"center",justifyContent:"center",
            fontSize:36,margin:"0 auto 20px",
            boxShadow:"0 8px 32px rgba(92,61,30,.25)"
          }}>🔐</div>
          <div className="fd fw-7" style={{fontSize:22,color:"var(--brown)",marginBottom:8}}>Beta Ji, Pehle Code To</div>
          <div className="text-sm text-muted" style={{marginBottom:8}}>Phir Access Milega</div>
          <div style={{
            display:"inline-block",
            background:"#fef9c3",color:"#854d0e",
            borderRadius:20,padding:"4px 14px",
            fontSize:12,fontWeight:700,marginBottom:28,
          }}>
            🔒 Admin Only Zone
          </div>
          <br/>
          <button className="btn btn-primary btn-lg" style={{minWidth:200}} onClick={()=>setShowGate(true)}>
            🔑 Password Daalo
          </button>
        </div>
        {showGate && (
          <PasswordGate
            onSuccess={() => { unlockAdmin(); setShowGate(false); }}
            onClose={() => setShowGate(false)}
          />
        )}
      </div>
    );
  }

  return <SettingsForm t={t} onUpdateSettings={onUpdateSettings} onLock={lockAdmin} />;
}

function SettingsForm({t, onUpdateSettings, onLock}) {
  const [name, setName] = useState(t.name);
  const [winsReq, setWinsReq] = useState(t.winsRequired);
  const [points, setPoints] = useState(t.totalPoints);
  
  const [teamNames, setTeamNames] = useState({});
  const [saved, setSaved] = useState(false);

  const previewPPW = winsReq > 0 ? Math.round(points / winsReq) : 0;

  function save() {
    const finalTeamData = {};
    (t.teams || []).forEach(tm => {
      finalTeamData[tm.id] = { name: teamNames[tm.id] ?? tm.name };
    });

    onUpdateSettings(name, winsReq, points, finalTeamData);
    setSaved(true);
    setTeamNames({}); // Clear overrides so it mirrors the new database state
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div>
      <div style={{
        background:"linear-gradient(135deg,#f0fdf4,#dcfce7)",
        border:"1.5px solid #4ade80",
        borderRadius:14,padding:"12px 16px",
        display:"flex",alignItems:"center",justifyContent:"space-between",
        marginBottom:16,
      }}>
        <div style={{display:"flex",alignItems:"center",gap:8}}>
          <span style={{fontSize:18}}>✅</span>
          <span style={{fontWeight:700,fontSize:14,color:"#166534"}}>Admin Access — Aap hi hain Boss!</span>
        </div>
        <button className="btn btn-ghost btn-xs" onClick={onLock} style={{color:"var(--slate-l)"}}>🔒 Lock</button>
      </div>

      <div className="card mb-3">
        <div className="fd fw-7 mb-4" style={{fontSize:18}}>⚙️ Tournament Settings</div>
        <div className="form-group">
          <label className="form-label">Tournament Name</label>
          <input className="form-input" value={name} onChange={e=>setName(e.target.value)} placeholder="Tournament name"/>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Wins Required</label>
            <input className="form-input" type="number" min="1" max="999" value={winsReq}
              onChange={e=>setWinsReq(Math.max(1,parseInt(e.target.value)||1))}/>
          </div>
          <div className="form-group">
            <label className="form-label">Total Points Pool</label>
            <input className="form-input" type="number" min="1" value={points}
              onChange={e=>setPoints(Math.max(1,parseInt(e.target.value)||1))}/>
          </div>
        </div>
        <div className="info-box">
          <div className="text-sm mb-1">Points per win = <strong>{points} / {winsReq} = {previewPPW} pts</strong></div>
        </div>
      </div>

      {/* ── ONLY Edit Names Allowed Now ── */}
      <div className="card mb-3">
        <div className="fd fw-7 mb-1" style={{fontSize:18}}>🏷️ Teams — Edit Names</div>
        <p className="text-sm text-muted mb-4">Sirf team ka naam yahan se change kar sakte hain.</p>
        {(t.teams || []).map((team) => (
          <div key={team.id} style={{
            padding:"14px",borderRadius:12,marginBottom:12,
            border:`1.5px solid ${team.color}44`,background:team.bg
          }}>
            <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:10}}>
              <span style={{fontSize:20}}>{team.emoji}</span>
              <span style={{fontWeight:700,fontSize:13,color:team.color,opacity:.8}}>{team.name}</span>
            </div>
            <div className="form-group" style={{marginBottom:0}}>
              <label className="form-label">Team Name</label>
              <input className="form-input" value={teamNames[team.id] ?? team.name}
                onChange={e=>setTeamNames(p=>({...p, [team.id]: e.target.value}))}
                style={{borderColor:team.color+"66"}}/>
            </div>
          </div>
        ))}
      </div>

      <button className={`btn ${saved?"btn-success":"btn-primary"} btn-full btn-lg`} onClick={save}>
        {saved ? "✅ Saved!" : "💾 Save All Changes"}
      </button>
    </div>
  );
}

// ─── Teams Tab ────────────────────────────────────────────────────────────────
function TeamsTab({t,onTeamClick,onUpdatePlayers}) {
  const [editingTeam,setEditingTeam]=useState(null);
  const pStats=getPlayerStats(t);

  return (
    <>
      <div className="section-head">
        <div className="fw-7" style={{fontSize:15}}>👥 All Teams & Players</div>
      </div>
      {[...(t.teams || [])].sort((a,b)=>b.wins-a.wins).map((team,i)=>{
        const toGo=Math.max(0,t.winsRequired-team.wins);
        return (
          <div key={team.id} className="card mb-3" style={{borderLeft:`4px solid ${team.color}`}}>
            <div className="flex-between mb-3">
              <div style={{display:"flex",alignItems:"center",gap:10}}>
                <SphereBall index={i} size={40}/>
                <div>
                  <div className="fw-7 fd" style={{fontSize:16}}>{MEDALS[i]||"🏅"} {team.name} {t.winnerId===team.id&&"🏆"}</div>
                  <div className="text-xs text-muted">{team.players?.length || 0} players · {team.wins}W · {team.losses}L</div>
                </div>
              </div>
              <div style={{textAlign:"right"}}>
                <div style={{fontSize:22,fontWeight:800,color:team.color,letterSpacing:"-0.5px",fontFamily:"var(--fb)"}}>{team.wins}<span style={{fontSize:13,color:"var(--slate-l)"}}>/{t.winsRequired}</span></div>
                <div style={{fontSize:11,color:toGo<=2?"var(--green)":"var(--slate-l)",fontWeight:600}}>{toGo===0?"Done!":toGo+" to go"}</div>
              </div>
            </div>
            <div className="progress-bar mb-3 progress-bar-sm">
              <div className="pf pf-gold" style={{width:`${Math.min(100,(team.wins/t.winsRequired)*100)}%`}}/>
            </div>
            <div className="flex-between mb-2">
              <div className="text-sm fw-7">Players</div>
              <button className="btn btn-secondary btn-xs" onClick={()=>setEditingTeam(editingTeam===team.id?null:team.id)}>
                {editingTeam===team.id?"Done ✓":"✏️ Edit"}
              </button>
            </div>
            {(!team.players || team.players.length===0)&&<div className="text-sm text-muted mb-2">No players added yet.</div>}
            <div style={{display:"flex",flexWrap:"wrap",gap:4,marginBottom:8}}>
              {(team.players || []).map(p=>{
                const ps=pStats[p.id]||{matchesPlayed:0,wins:0};
                return (
                  <span key={p.id} className="player-chip" style={{background:team.bg,color:team.color,border:`1px solid ${team.color}33`}}>
                    👤 {p.name}
                    {ps.matchesPlayed>0&&<span style={{opacity:.7,fontSize:10}}>({ps.matchesPlayed}M/{ps.wins}W)</span>}
                  </span>
                );
              })}
            </div>
            {editingTeam===team.id&&<EditPlayerSection team={team} onUpdate={(players)=>onUpdatePlayers(team.id,players)}/>}
            <div className="flex-between mt-2">
              <button className="btn btn-secondary btn-sm" onClick={()=>onTeamClick(team)}>📊 Player Stats →</button>
            </div>
          </div>
        );
      })}
    </>
  );
}

function EditPlayerSection({team,onUpdate}) {
  const [input,setInput]=useState("");
  const players = team.players || [];
  function add() { if(!input.trim()) return; onUpdate([...players,{id:uid(),name:input.trim()}]); setInput(""); }
  function remove(id) { onUpdate(players.filter(p=>p.id!==id)); }
  return (
    <div className="card card-sm mt-2 mb-2" style={{background:"var(--cream)"}}>
      <div className="text-xs fw-7 text-muted mb-2">EDIT PLAYERS</div>
      {players.map(p=>(
        <div key={p.id} className="flex-between mb-2">
          <span className="text-sm">{p.name}</span>
          <button className="btn btn-danger btn-xs" onClick={()=>remove(p.id)}>✕</button>
        </div>
      ))}
      <div className="input-row">
        <input className="form-input" placeholder="Add player…" value={input} onChange={e=>setInput(e.target.value)}
          onKeyDown={e=>{if(e.key==="Enter")add();}} style={{fontSize:13,padding:"8px 10px"}}/>
        <button className="btn btn-primary btn-sm" onClick={add}>Add</button>
      </div>
    </div>
  );
}

function TeamPopup({team,t,teamIndex,onClose}) {
  const pStats=getPlayerStats(t);
  const history=t.history||[];
  const teamMatches=history.filter(h=>h.winnerId===team.id||h.loserId===team.id);

  function pName(pid) {
    if (!t.teams) return "?";
    for(const tm of t.teams){ 
      if (!tm.players) continue;
      const p=tm.players.find(x=>x.id===pid); 
      if(p) return p.name; 
    }
    return "?";
  }

  return (
    <div className="modal-overlay center" onClick={onClose}>
      <div className="modal-box center-box" style={{position:"relative"}} onClick={e=>e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>✕</button>

        <div className="team-popup-header" style={{background:`linear-gradient(135deg,${team.bg},${team.color}22)`}}>
          <div className="team-popup-top">
            <SphereBall index={teamIndex} size={56}/>
            <div style={{textAlign:"left"}}>
              <div className="team-popup-name" style={{color:team.color}}>{team.name}</div>
              <div className="team-popup-sub">{team.wins}W · {team.losses}L · {team.points} pts</div>
            </div>
          </div>
          <div className="progress-bar mt-2" style={{height:8,borderRadius:4,width:"100%"}}>
            <div className="pf pf-gold" style={{width:`${Math.min(100,(team.wins/t.winsRequired)*100)}%`}}/>
          </div>
          <div className="text-xs text-muted mt-1">{team.wins}/{t.winsRequired} wins to championship</div>
        </div>

        <div className="fw-7 mb-3" style={{fontSize:14}}>👤 Player Statistics</div>
        {(!team.players || team.players.length===0)&&<div className="text-sm text-muted mb-4">No players added to this team.</div>}
        {(team.players || []).map(p=>{
          const ps=pStats[p.id]||{matchesPlayed:0,wins:0,losses:0};
          const winPct=ps.matchesPlayed>0?Math.round((ps.wins/ps.matchesPlayed)*100):0;
          return (
            <div key={p.id} className="player-stat-row">
              <div className="player-stat-name"><span>👤</span>{p.name}</div>
              <div className="player-stat-nums">
                <span className="chip chip-green">{ps.wins}W</span>
                <span className="chip chip-red">{ps.losses}L</span>
                <span className="chip">{ps.matchesPlayed}M</span>
                {ps.matchesPlayed>0&&<span className="chip chip-gold">{winPct}%</span>}
              </div>
            </div>
          );
        })}

        {teamMatches.length>0&&(
          <>
            <div className="divider"/>
            <div className="fw-7 mb-3" style={{fontSize:14}}>🎮 Match History</div>
            {teamMatches.map(h=>{
              const isWinner=h.winnerId===team.id;
              const myPlayers=team.id===h.t0Id?h.t0Players:h.t1Players;
              const oppTeamId=team.id===h.t0Id?h.t1Id:h.t0Id;
              const oppTeam=t.teams?.find(x=>x.id===oppTeamId);
              const oppPlayers=team.id===h.t0Id?h.t1Players:h.t0Players;
              return (
                <div key={h.matchNum} className="hist-item">
                  <span className="hist-num">#{h.matchNum}</span>
                  <div className="hist-info">
                    <div className="hist-players text-sm">
                      <span style={{color:team.color,fontWeight:700}}>{team.emoji} {team.name}</span>
                      {myPlayers&&myPlayers.length>0&&<span className="text-xs text-muted"> ({myPlayers.map(pName).join(", ")})</span>}
                      <span className="text-muted"> vs </span>
                      <span style={{color:oppTeam?.color,fontWeight:700}}>{oppTeam?.emoji} {oppTeam?.name}</span>
                      {oppPlayers&&oppPlayers.length>0&&<span className="text-xs text-muted"> ({oppPlayers.map(pName).join(", ")})</span>}
                    </div>
                    <div style={{marginTop:4}}>
                      {isWinner?<span className="chip chip-green">✅ Won</span>:<span className="chip chip-red">❌ Lost</span>}
                    </div>
                  </div>
                </div>
              );
            })}
          </>
        )}
      </div>
    </div>
  );
}

function HistoryTab({t}) {
  const history=t.history||[];
  function pName(pid) { 
    if (!t.teams) return null;
    for(const tm of t.teams){ 
      const p = (tm.players || []).find(x=>x.id===pid); 
      if(p) return p.name; 
    } 
    return null; 
  }
  function getTeam(id){ return (t.teams || []).find(x=>x.id===id); }

  if(!history.length) return <div className="empty-state"><div className="empty-icon">📜</div><p>No matches recorded yet.</p></div>;

  return (
    <div className="card">
      <div className="fw-7 mb-3" style={{fontSize:15}}>📜 Match History — {history.length} matches</div>
      {[...history].reverse().map(h=>{
        const winner=getTeam(h.winnerId), loser=getTeam(h.loserId);
        const t0p=(h.t0Players||[]).map(pName).filter(Boolean);
        const t1p=(h.t1Players||[]).map(pName).filter(Boolean);
        const myT0=getTeam(h.t0Id), myT1=getTeam(h.t1Id);
        return (
          <div key={h.matchNum} className="hist-item">
            <span className="hist-num">#{h.matchNum}</span>
            <div className="hist-info">
              <div className="hist-players">
                <span style={{color:myT0?.color,fontWeight:700}}>{myT0?.emoji} {myT0?.name}</span>
                {t0p.length>0&&<span className="text-xs text-muted"> ({t0p.join(", ")})</span>}
                <span className="text-muted"> vs </span>
                <span style={{color:myT1?.color,fontWeight:700}}>{myT1?.emoji} {myT1?.name}</span>
                {t1p.length>0&&<span className="text-xs text-muted"> ({t1p.join(", ")})</span>}
              </div>
              <div className="hist-result mt-1">
                <span className="chip chip-green">✅ {winner?.emoji} {winner?.name}</span>
                <span className="chip chip-red">❌ {loser?.emoji} {loser?.name}</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function NotesTab({t,onUpdateNotes}) {
  const [notes,setNotes]=useState(t.notes||[]);
  const [input,setInput]=useState("");

  function add() { if(!input.trim()) return; const n=[...notes,input.trim()]; setNotes(n); onUpdateNotes(n); setInput(""); }
  function del(i) { const n=notes.filter((_,j)=>j!==i); setNotes(n); onUpdateNotes(n); }
  function edit(i,v) { const n=notes.map((x,j)=>j===i?v:x); setNotes(n); onUpdateNotes(n); }

  return (
    <>
      <div className="card mb-3">
        <div className="fw-7 mb-3" style={{fontSize:15}}>📋 Tournament Rules & Notes</div>
        {notes.length===0&&<div className="text-sm text-muted mb-3">No rules added yet.</div>}
        {notes.map((n,i)=>(
          <div key={i} className="note-item">
            <span className="note-num">{i+1}.</span>
            <input className="note-text form-input" style={{border:"none",background:"transparent",padding:"2px 4px",fontSize:14,flex:1}}
              value={n} onChange={e=>edit(i,e.target.value)}/>
            <button className="btn btn-danger btn-xs" style={{flexShrink:0}} onClick={()=>del(i)}>✕</button>
          </div>
        ))}
        <div className="divider"/>
        <div className="input-row">
          <input className="form-input" placeholder="Add a new rule or note…" value={input}
            onChange={e=>setInput(e.target.value)} onKeyDown={e=>{if(e.key==="Enter")add();}}/>
          <button className="btn btn-primary" style={{flexShrink:0}} onClick={add}>Add</button>
        </div>
      </div>
      <div className="card">
        <div className="fw-7 mb-3" style={{fontSize:14}}>⚙️ Tournament Settings</div>
        {[["Points per Win",t.pointsPerWin+" pts","chip-gold"],["Wins Required",t.winsRequired+" wins","chip-green"],["Total Points Pool",t.totalPoints+" pts",""]].map(([l,v,c])=>(
          <div key={l} className="flex-between" style={{padding:"8px 0",borderBottom:"1px solid var(--warm)"}}>
            <span className="text-sm fw-7">{l}</span><span className={`chip ${c}`}>{v}</span>
          </div>
        ))}
      </div>
    </>
  );
}

function WinnerBanner({team,onClose}) {
  return (
    <div className="winner-overlay" onClick={onClose}>
      <div className="winner-box" onClick={e=>e.stopPropagation()}>
        <span className="winner-trophy">🏆</span>
        <div className="winner-title">CHAMPION!</div>
        <div className="winner-team-name">{team.emoji} {team.name}</div>
        <div className="text-sm text-muted" style={{marginBottom:20}}>{team.wins} wins · {team.points} pts scored</div>
        <button className="btn btn-primary btn-lg btn-full" onClick={onClose}>🎉 Celebrate!</button>
      </div>
    </div>
  );
}