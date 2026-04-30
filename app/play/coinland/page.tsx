"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  AgeBand,
  Chore,
  defaultLessons,
  GameState,
  Lesson,
  levelFromXp,
  petStageFromXp,
  totalCoins,
  xpToNextLevel,
} from "@/lib/game";
import { clearState, loadState, newGame, saveState } from "@/lib/storage";
import { Bunny, CoinwoodScene, Egg, Mochi } from "@/components/characters";

type JarKey = "save" | "spend" | "give";
type Modal = null | "chooseJar" | "lessons" | "goal" | "levelUp" | "petUp" | "lesson";

const JAR: Record<
  JarKey,
  { label: string; emoji: string; bg: string; ring: string; text: string; bgSoft: string; goal: string }
> = {
  save: { label: "SAVE", emoji: "🐷", bg: "bg-[#6ad48b]", ring: "ring-[#4fa86c]", text: "text-[#2b2640]", bgSoft: "bg-[#d4f4dd]", goal: "for goals" },
  spend: { label: "SPEND", emoji: "🍭", bg: "bg-[#ff7eb5]", ring: "ring-[#cc5e8e]", text: "text-white", bgSoft: "bg-[#ffd6e7]", goal: "right now" },
  give: { label: "GIVE", emoji: "❤️", bg: "bg-[#ffd84d]", ring: "ring-[#ccaa3d]", text: "text-[#2b2640]", bgSoft: "bg-[#fff3b0]", goal: "to help others" },
};

const MOCHI_LINES_BY_STATE = {
  start: ["Tap a chore to earn coins! 👇", "Pick a job and let's get started! ✨"],
  hasCoins: ["Where should these coins go? Tap a jar! 🪙", "Save, Spend, or Give? You choose! 💛"],
  done: ["Great work! Try a lesson next 📘", "You're amazing! Keep going! 🌟", "Coinwood is proud of you! 🏆"],
  goalProgress: ["Look at your goal grow! 🎯", "Keep saving — you're getting closer! 💪"],
};

export default function Page() {
  const [state, setState] = useState<GameState | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [modal, setModal] = useState<Modal>(null);
  const [pendingCoins, setPendingCoins] = useState<number>(0);
  const [confetti, setConfetti] = useState(false);
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);
  const [flyingCoins, setFlyingCoins] = useState<{ id: string; jar: JarKey }[]>([]);
  const [levelUpTo, setLevelUpTo] = useState<number | null>(null);
  const prevLevel = useRef(1);

  useEffect(() => {
    const s = loadState();
    setState(s);
    setLoaded(true);
    if (s) prevLevel.current = levelFromXp(s.xp);
  }, []);

  useEffect(() => {
    if (!state) return;
    saveState(state);
    const lvl = levelFromXp(state.xp);
    if (lvl > prevLevel.current) {
      setLevelUpTo(lvl);
      setModal("levelUp");
      playSound("levelup");
      setTimeout(() => setModal(null), 2500);
    }
    prevLevel.current = lvl;
  }, [state]);

  if (!loaded) return null;
  if (!state) return <Onboarding onStart={(s) => setState(s)} />;

  const lvl = levelFromXp(state.xp);
  const xpInfo = xpToNextLevel(state.xp);
  const stage = petStageFromXp(state.xp);
  const total = totalCoins(state);
  const lessons = defaultLessons().filter((l) => ageBandRank(l.ageBand) <= ageBandRank(state.ageBand));
  const undoneChores = state.chores
    .filter((c) => !c.done && ageBandRank(c.ageBand) <= ageBandRank(state.ageBand))
    .slice(0, 3);
  const promptKey: keyof typeof MOCHI_LINES_BY_STATE =
    pendingCoins > 0 ? "hasCoins" : undoneChores.length === 0 ? "done" : "start";
  const greeting = MOCHI_LINES_BY_STATE[promptKey][(state.xp + state.streakDays) % 2];

  function fireConfetti() {
    setConfetti(true);
    setTimeout(() => setConfetti(false), 1300);
  }

  function completeChore(c: Chore) {
    if (!state) return;
    setState({
      ...state,
      chores: state.chores.map((x) => (x.id === c.id ? { ...x, done: true } : x)),
      xp: state.xp + c.coins,
    });
    setPendingCoins((p) => p + c.coins);
    fireConfetti();
    playSound("coin");
    setModal("chooseJar");
  }

  function depositToJar(jar: JarKey) {
    if (!state || pendingCoins === 0) return;
    const amount = pendingCoins;
    // visual: spawn flying coin animations
    const flyers = Array.from({ length: Math.min(amount, 8) }).map((_, i) => ({
      id: `${Date.now()}-${i}`,
      jar,
    }));
    setFlyingCoins((f) => [...f, ...flyers]);
    setTimeout(() => setFlyingCoins((f) => f.slice(flyers.length)), 900);

    setState({ ...state, jars: { ...state.jars, [jar]: state.jars[jar] + amount } });
    setPendingCoins(0);
    setModal(null);
    playSound("plink");
  }

  function depositSplit(saveN: number, spendN: number, giveN: number) {
    if (!state) return;
    setState({
      ...state,
      jars: {
        save: state.jars.save + saveN,
        spend: state.jars.spend + spendN,
        give: state.jars.give + giveN,
      },
    });
    setPendingCoins(0);
    setModal(null);
    fireConfetti();
    playSound("levelup");
  }

  function setGoal(name: string, emoji: string, target: number) {
    if (!state) return;
    setState({ ...state, goal: { name, target, emoji } });
    setModal(null);
  }

  function completeLesson(lesson: Lesson, allCorrect: boolean) {
    if (!state || state.lessonsCompleted.includes(lesson.id)) return;
    if (allCorrect) {
      setState({
        ...state,
        xp: state.xp + 30,
        jars: { ...state.jars, spend: state.jars.spend + 10 },
        lessonsCompleted: [...state.lessonsCompleted, lesson.id],
        badges: [...state.badges, lesson.badge],
      });
      fireConfetti();
      playSound("levelup");
    }
    setActiveLesson(null);
  }

  function resetDay() {
    if (!state) return;
    setState({ ...state, chores: state.chores.map((c) => ({ ...c, done: false })) });
  }

  return (
    <div className="relative min-h-screen pb-8">
      <CoinwoodScene />

      <div className="max-w-md mx-auto px-3 pt-3 relative z-10">
        {/* HERO: Mochi + speech bubble */}
        <header className="flex items-end gap-2 mb-3">
          <div className="w-28 h-32 relative anim-float shrink-0">
            <Mochi className="w-full h-full" mood={pendingCoins > 0 ? "celebrate" : "wave"} />
          </div>
          <div className="relative bg-white rounded-2xl px-3 py-2 self-center mt-2 shadow-[0_4px_0_0_#2b2640] border-[3px] border-[#2b2640] flex-1">
            <div className="absolute -left-3 top-4 w-0 h-0 border-y-[10px] border-y-transparent border-r-[12px] border-r-white" />
            <div className="absolute -left-[16px] top-[13px] w-0 h-0 border-y-[12px] border-y-transparent border-r-[14px] border-r-[#2b2640]" />
            <div className="display text-[10px] uppercase tracking-wider text-[#2b2640]/60 font-bold">Mayor Mochi</div>
            <div className="text-sm font-bold leading-tight">{greeting}</div>
          </div>
        </header>

        {/* HUD */}
        <div className="bg-white/85 backdrop-blur rounded-2xl p-3 mb-3 flex items-center gap-3 border-[3px] border-white shadow-lg">
          <div className="w-12 h-14 shrink-0">
            {stage === 0 ? <Egg className="w-full h-full" /> : <Bunny className="w-full h-full" />}
          </div>
          <div className="flex-1 min-w-0">
            <div className="display text-base leading-none">{state.kidName}</div>
            <div className="text-[10px] text-[#2b2640]/60 font-bold uppercase tracking-wider">
              {state.petName} • Lvl {lvl}
            </div>
            <div className="mt-1 h-2 bg-[#2b2640]/10 rounded-full overflow-hidden">
              <div className="h-full bg-[#5aa9e6] transition-all duration-500" style={{ width: `${xpInfo.pct}%` }} />
            </div>
          </div>
          <div className="text-center shrink-0">
            <div className="text-2xl anim-wiggle">🔥</div>
            <div className="display text-xs font-bold">{state.streakDays}d</div>
          </div>
          <div className="text-center shrink-0 px-2 py-1 bg-[#fff3b0] rounded-xl border-2 border-white">
            <div className="text-xs">🪙</div>
            <div className="display text-base font-bold leading-none">{total}</div>
          </div>
        </div>

        {/* SECTION: chores */}
        {pendingCoins === 0 && undoneChores.length > 0 && (
          <section className="mb-3">
            <div className="display text-base mb-2 px-1 flex items-center gap-2">
              <span className="text-xl">🌟</span> Today&apos;s jobs
            </div>
            <div className="space-y-2">
              {undoneChores.map((c, i) => (
                <ChoreButton key={c.id} chore={c} onTap={completeChore} highlight={i === 0} />
              ))}
            </div>
          </section>
        )}

        {pendingCoins === 0 && undoneChores.length === 0 && (
          <section className="mb-3">
            <div className="bg-white/85 backdrop-blur rounded-2xl p-4 text-center border-[3px] border-white shadow-lg">
              <div className="text-5xl mb-2">🎊</div>
              <div className="display text-lg">All chores done today!</div>
              <div className="text-xs text-[#2b2640]/60 mt-1 mb-3">Try a lesson, set a goal, or reset for tomorrow.</div>
              <button
                onClick={resetDay}
                className="inline-flex items-center justify-center gap-2 px-5 py-2 rounded-full font-bold text-white bg-[#5aa9e6] border-[3px] border-white shadow-[0_4px_0_0_#3b80b0] active:translate-y-1 active:shadow-[0_1px_0_0_#3b80b0] text-sm display"
              >
                Reset for tomorrow ↻
              </button>
            </div>
          </section>
        )}

        {/* SECTION: jars (always visible) */}
        <section className="mb-3">
          <div className="display text-base mb-2 px-1 flex items-center gap-2">
            <span className="text-xl">🫙</span> Your jars
          </div>
          <div className="grid grid-cols-3 gap-2">
            {(["save", "spend", "give"] as JarKey[]).map((j) => (
              <JarTile key={j} jar={j} amount={state.jars[j]} />
            ))}
          </div>
        </section>

        {/* SECTION: goal + lessons (compact, side-by-side) */}
        <section className="grid grid-cols-2 gap-2 mb-3">
          {state.goal ? (
            <button
              onClick={() => setModal("goal")}
              className="bg-white/85 backdrop-blur rounded-2xl p-3 border-[3px] border-white shadow-lg text-left active:scale-95 transition-transform"
            >
              <div className="display text-xs uppercase tracking-wider text-[#2b2640]/60 font-bold mb-0.5">🎯 Goal</div>
              <div className="text-3xl mb-1">{state.goal.emoji}</div>
              <div className="text-xs font-bold leading-tight truncate">{state.goal.name}</div>
              <div className="text-[10px] text-[#2b2640]/60">
                🪙 {state.jars.save}/{state.goal.target}
              </div>
              <div className="mt-1 h-1.5 bg-[#2b2640]/10 rounded-full overflow-hidden">
                <div className="h-full bg-[#6ad48b]" style={{ width: `${Math.min(100, (state.jars.save / state.goal.target) * 100)}%` }} />
              </div>
            </button>
          ) : (
            <button
              onClick={() => setModal("goal")}
              className="bg-[#fff3b0]/85 backdrop-blur rounded-2xl p-3 border-[3px] border-white shadow-lg text-left active:scale-95 transition-transform"
            >
              <div className="display text-xs uppercase tracking-wider text-[#2b2640]/60 font-bold mb-0.5">🎯 Goal</div>
              <div className="text-3xl mb-1">✨</div>
              <div className="text-xs font-bold">Pick something to save for!</div>
            </button>
          )}

          <button
            onClick={() => setModal("lessons")}
            className="bg-white/85 backdrop-blur rounded-2xl p-3 border-[3px] border-white shadow-lg text-left active:scale-95 transition-transform"
          >
            <div className="display text-xs uppercase tracking-wider text-[#2b2640]/60 font-bold mb-0.5">📘 Lessons</div>
            <div className="text-3xl mb-1">{lessons[state.lessonsCompleted.length]?.emoji ?? "🏆"}</div>
            <div className="text-xs font-bold leading-tight truncate">
              {lessons[state.lessonsCompleted.length]?.title ?? "All done!"}
            </div>
            <div className="text-[10px] text-[#2b2640]/60">
              {state.lessonsCompleted.length} / {lessons.length} done
            </div>
          </button>
        </section>

        {/* badges row */}
        {state.badges.length > 0 && (
          <section className="mb-4">
            <div className="display text-xs uppercase tracking-wider text-[#2b2640]/60 font-bold mb-1 px-1">🏅 Your badges</div>
            <div className="flex gap-2 flex-wrap">
              {state.badges.map((b, i) => (
                <div key={i} className="bg-white/85 px-2 py-1 rounded-full text-xs font-bold border-2 border-white shadow">
                  {b}
                </div>
              ))}
            </div>
          </section>
        )}
      </div>

      {/* FLYING COINS overlay */}
      {flyingCoins.map((f) => (
        <FlyingCoin key={f.id} jar={f.jar} />
      ))}

      {/* CONFETTI */}
      <Confetti show={confetti} />

      {/* CHOOSE JAR MODAL */}
      {modal === "chooseJar" && pendingCoins > 0 && (
        <ModalShell onClose={() => {}}>
          <div className="text-center mb-3">
            <div className="text-6xl anim-pop-in">🪙</div>
            <div className="display text-2xl mt-1">You earned {pendingCoins} coins!</div>
            <div className="text-sm text-[#2b2640]/70 mt-1">Where should they go?</div>
          </div>
          <div className="space-y-2 mb-3">
            {(["save", "spend", "give"] as JarKey[]).map((j) => (
              <button
                key={j}
                onClick={() => depositToJar(j)}
                className={`w-full flex items-center gap-3 p-3 rounded-2xl ${JAR[j].bg} ${JAR[j].text} border-[3px] border-white shadow-[0_4px_0_0_rgba(0,0,0,0.2)] active:translate-y-0.5 active:shadow-[0_1px_0_0_rgba(0,0,0,0.2)]`}
              >
                <div className="text-3xl">{JAR[j].emoji}</div>
                <div className="text-left">
                  <div className="display text-base font-bold leading-tight">All in {JAR[j].label}</div>
                  <div className="text-xs opacity-80">{JAR[j].goal}</div>
                </div>
                <div className="display text-2xl font-bold ml-auto">→ 🪙{pendingCoins}</div>
              </button>
            ))}
          </div>
          <button
            onClick={() => {
              const s = Math.round(pendingCoins * 0.5);
              const g = Math.round(pendingCoins * 0.2);
              const sp = pendingCoins - s - g;
              depositSplit(s, sp, g);
            }}
            className="w-full bg-[#5aa9e6] text-white px-4 py-2 rounded-full font-bold border-[3px] border-white shadow-[0_4px_0_0_#3b80b0] active:translate-y-0.5 active:shadow-[0_1px_0_0_#3b80b0] display"
          >
            Smart split: 50% Save · 30% Spend · 20% Give ✨
          </button>
        </ModalShell>
      )}

      {/* LESSONS LIST MODAL */}
      {modal === "lessons" && (
        <ModalShell onClose={() => setModal(null)}>
          <div className="display text-xl mb-3 flex items-center gap-2">📘 Lessons</div>
          <div className="space-y-2">
            {lessons.map((l) => {
              const done = state.lessonsCompleted.includes(l.id);
              return (
                <button
                  key={l.id}
                  onClick={() => {
                    setModal(null);
                    setActiveLesson(l);
                  }}
                  className="w-full flex items-center gap-3 p-3 bg-white rounded-2xl border-2 border-[#2b2640]/10 active:scale-98 text-left hover:border-[#5aa9e6] transition-all"
                >
                  <div className="text-3xl">{l.emoji}</div>
                  <div className="flex-1">
                    <div className={`font-bold text-sm ${done ? "text-[#2b2640]/40 line-through" : ""}`}>{l.title}</div>
                    <div className="text-xs text-[#2b2640]/60 font-bold">{l.mentor}</div>
                  </div>
                  {done ? <span className="text-2xl">✅</span> : <span className="text-[#5aa9e6] text-xl">▶</span>}
                </button>
              );
            })}
          </div>
        </ModalShell>
      )}

      {/* GOAL MODAL */}
      {modal === "goal" && <GoalModal state={state} onSet={setGoal} onClose={() => setModal(null)} />}

      {/* LEVEL UP */}
      {modal === "levelUp" && levelUpTo && (
        <ModalShell onClose={() => setModal(null)}>
          <div className="text-center py-4">
            <div className="text-7xl anim-pop-in">⭐</div>
            <div className="display text-3xl mt-2">Level {levelUpTo}!</div>
            <div className="text-sm text-[#2b2640]/70 mt-1">You&apos;re getting smart with money 🎉</div>
          </div>
        </ModalShell>
      )}

      {/* LESSON MODAL */}
      {activeLesson && (
        <LessonModal
          lesson={activeLesson}
          done={state.lessonsCompleted.includes(activeLesson.id)}
          onClose={() => setActiveLesson(null)}
          onComplete={(ok) => completeLesson(activeLesson, ok)}
        />
      )}

      <button
        className="fixed top-2 right-2 text-[10px] text-[#2b2640]/40 underline z-20"
        onClick={() => {
          if (confirm("Reset everything?")) {
            clearState();
            setState(null);
            setPendingCoins(0);
          }
        }}
      >
        reset
      </button>
    </div>
  );
}

function ageBandRank(a: AgeBand): number {
  return a === "4-7" ? 1 : a === "8-12" ? 2 : 3;
}

/* ============== ONBOARDING ============== */
function Onboarding({ onStart }: { onStart: (s: GameState) => void }) {
  const [name, setName] = useState("");
  const [pet, setPet] = useState("Bo");
  const [age, setAge] = useState<AgeBand>("8-12");

  return (
    <div className="relative min-h-screen">
      <CoinwoodScene />
      <div className="max-w-md mx-auto px-6 pt-8 pb-12 relative z-10">
        <div className="text-center mb-4">
          <div className="w-44 h-48 mx-auto anim-float">
            <Mochi className="w-full h-full" mood="wave" />
          </div>
          <h1 className="display text-4xl mt-2 mb-1">Welcome to Coinwood!</h1>
          <p className="text-sm text-[#2b2640]/70 px-4">
            I&apos;m Mayor Mochi 🐶 — let&apos;s build your first coins!
          </p>
        </div>
        <div className="bg-white rounded-3xl p-5 border-[4px] border-white shadow-2xl space-y-4">
          <label className="block">
            <div className="display text-xs uppercase tracking-wider mb-1 font-bold">Your name</div>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Type your name"
              className="w-full px-4 py-3 rounded-2xl border-[3px] border-[#2b2640]/20 bg-white focus:outline-none focus:border-[#5aa9e6] text-lg"
            />
          </label>
          <label className="block">
            <div className="display text-xs uppercase tracking-wider mb-1 font-bold">Your age</div>
            <div className="grid grid-cols-3 gap-2">
              {(["4-7", "8-12", "13-18"] as AgeBand[]).map((a) => (
                <button
                  key={a}
                  onClick={() => setAge(a)}
                  className={`py-3 rounded-2xl display font-bold text-base transition-all ${
                    age === a
                      ? "bg-[#5aa9e6] text-white border-[3px] border-white shadow-lg scale-105"
                      : "bg-white border-[3px] border-[#2b2640]/10 text-[#2b2640]/70"
                  }`}
                >
                  {a}
                </button>
              ))}
            </div>
          </label>
          <label className="block">
            <div className="display text-xs uppercase tracking-wider mb-1 font-bold">Pet name</div>
            <input
              value={pet}
              onChange={(e) => setPet(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl border-[3px] border-[#2b2640]/20 bg-white focus:outline-none focus:border-[#5aa9e6] text-lg"
            />
          </label>
          <button
            disabled={!name.trim()}
            onClick={() => onStart(newGame(name.trim(), age, pet.trim() || "Bo"))}
            className="w-full inline-flex items-center justify-center gap-2 px-6 py-4 rounded-full text-lg font-bold text-white bg-[#5aa9e6] border-[4px] border-white shadow-[0_6px_0_0_#3b80b0,0_10px_20px_rgba(0,0,0,0.15)] active:translate-y-1 active:shadow-[0_2px_0_0_#3b80b0] disabled:opacity-50 disabled:cursor-not-allowed display"
          >
            Start adventure 🚀
          </button>
        </div>
      </div>
    </div>
  );
}

/* ============== CHORE BUTTON ============== */
function ChoreButton({ chore, onTap, highlight }: { chore: Chore; onTap: (c: Chore) => void; highlight: boolean }) {
  return (
    <button
      onClick={() => onTap(chore)}
      className={`w-full flex items-center gap-3 p-3 bg-white rounded-2xl border-[3px] border-white shadow-[0_5px_0_0_rgba(43,38,64,0.2)] active:translate-y-1 active:shadow-[0_1px_0_0_rgba(43,38,64,0.2)] text-left ${
        highlight ? "anim-pulse-glow" : ""
      }`}
    >
      <div className="text-4xl shrink-0">{chore.emoji}</div>
      <div className="flex-1 min-w-0">
        <div className="display font-bold text-base leading-tight">{chore.title}</div>
        <div className="text-xs text-[#2b2640]/60 font-bold">🪙 +{chore.coins}</div>
      </div>
      <div className="bg-[#6ad48b] text-white px-4 py-2 rounded-full display font-bold text-sm shrink-0 border-[3px] border-white shadow">
        Done!
      </div>
    </button>
  );
}

/* ============== JAR TILE ============== */
function JarTile({ jar, amount }: { jar: JarKey; amount: number }) {
  const j = JAR[jar];
  return (
    <div className={`relative ${j.bgSoft} rounded-2xl p-3 border-[3px] border-white shadow-lg overflow-hidden`}>
      <div className="text-center">
        <div className="text-4xl anim-float">{j.emoji}</div>
        <div className="display text-[10px] uppercase tracking-wider font-bold text-[#2b2640]/70 mt-1">
          {j.label}
        </div>
        <div className="display text-2xl font-bold text-[#2b2640] leading-none mt-0.5">
          🪙{amount}
        </div>
      </div>
      {/* drop indicator */}
      <div className={`absolute inset-0 ${j.bg} opacity-0 transition-opacity rounded-2xl pointer-events-none`} />
    </div>
  );
}

/* ============== MODAL SHELL ============== */
function ModalShell({ children, onClose }: { children: React.ReactNode; onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 bg-[#2b2640]/40 flex items-center justify-center z-50 p-4 anim-bounce-in"
      onClick={onClose}
    >
      <div
        className="bg-[#fff9f0] rounded-3xl p-5 max-w-md w-full max-h-[85vh] overflow-y-auto border-[4px] border-white shadow-2xl relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-2 right-3 text-[#2b2640]/40 text-3xl leading-none w-10 h-10 hover:text-[#2b2640]"
          aria-label="Close"
        >
          ×
        </button>
        {children}
      </div>
    </div>
  );
}

/* ============== GOAL MODAL ============== */
const GOAL_PRESETS = [
  { name: "Lego set", emoji: "🧱", target: 50 },
  { name: "New book", emoji: "📚", target: 20 },
  { name: "Video game", emoji: "🎮", target: 80 },
  { name: "Skateboard", emoji: "🛹", target: 100 },
  { name: "Stuffed animal", emoji: "🧸", target: 30 },
  { name: "Bike", emoji: "🚲", target: 200 },
];

function GoalModal({
  state,
  onSet,
  onClose,
}: {
  state: GameState;
  onSet: (n: string, e: string, t: number) => void;
  onClose: () => void;
}) {
  return (
    <ModalShell onClose={onClose}>
      <div className="display text-xl mb-2 flex items-center gap-2">🎯 Pick a goal</div>
      {state.goal && (
        <div className="bg-[#d4f4dd] rounded-2xl p-3 mb-3 border-[2px] border-white">
          <div className="text-xs font-bold text-[#2b2640]/70">CURRENT</div>
          <div className="flex items-center gap-2">
            <div className="text-3xl">{state.goal.emoji}</div>
            <div className="flex-1">
              <div className="display font-bold text-base">{state.goal.name}</div>
              <div className="text-xs">
                🪙 {state.jars.save} / {state.goal.target}
              </div>
            </div>
          </div>
        </div>
      )}
      <div className="grid grid-cols-2 gap-2">
        {GOAL_PRESETS.map((g) => (
          <button
            key={g.name}
            onClick={() => onSet(g.name, g.emoji, g.target)}
            className="bg-white rounded-2xl p-3 border-[3px] border-[#2b2640]/10 hover:border-[#5aa9e6] active:scale-95 transition-all text-left"
          >
            <div className="text-4xl mb-1">{g.emoji}</div>
            <div className="display font-bold text-sm">{g.name}</div>
            <div className="text-xs text-[#2b2640]/60 font-bold">🪙 {g.target}</div>
          </button>
        ))}
      </div>
    </ModalShell>
  );
}

/* ============== LESSON MODAL ============== */
function LessonModal({
  lesson,
  done,
  onClose,
  onComplete,
}: {
  lesson: Lesson;
  done: boolean;
  onClose: () => void;
  onComplete: (allCorrect: boolean) => void;
}) {
  const [step, setStep] = useState<"intro" | "quiz" | "result">("intro");
  const [picks, setPicks] = useState<number[]>([]);
  const [showWhy, setShowWhy] = useState<number | null>(null);

  const score = useMemo(
    () => picks.reduce((acc, p, i) => acc + (p === lesson.quiz[i]?.correct ? 1 : 0), 0),
    [picks, lesson]
  );
  const allCorrect = score === lesson.quiz.length;

  return (
    <ModalShell onClose={onClose}>
      <div className="text-5xl mb-2">{lesson.emoji}</div>
      <div className="display text-2xl mb-1">{lesson.title}</div>
      <div className="text-xs text-[#2b2640]/60 mb-3 font-bold">{lesson.mentor}</div>

      {step === "intro" && (
        <>
          <div className="bg-white p-3 rounded-2xl mb-4 text-sm leading-relaxed border-2 border-[#2b2640]/10">
            {lesson.blurb}
          </div>
          {done ? (
            <div className="text-center text-sm text-[#2b2640]/60">You already earned this badge! 🎉</div>
          ) : (
            <button
              onClick={() => setStep("quiz")}
              className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full font-bold text-white bg-[#5aa9e6] border-[3px] border-white shadow-[0_5px_0_0_#3b80b0] active:translate-y-1 active:shadow-[0_1px_0_0_#3b80b0] display"
            >
              Take the quiz →
            </button>
          )}
        </>
      )}

      {step === "quiz" && (
        <>
          {lesson.quiz.map((q, i) => (
            <div key={i} className="bg-white p-3 rounded-2xl mb-3 border-2 border-[#2b2640]/10">
              <div className="font-bold text-sm mb-2">
                {i + 1}. {q.q}
              </div>
              <div className="space-y-2">
                {q.options.map((opt, oi) => {
                  const picked = picks[i] === oi;
                  const correct = oi === q.correct;
                  const showResult = picks[i] !== undefined;
                  return (
                    <button
                      key={oi}
                      disabled={showResult}
                      onClick={() => {
                        const next = [...picks];
                        next[i] = oi;
                        setPicks(next);
                        setShowWhy(i);
                      }}
                      className={`w-full text-left text-sm py-2 px-3 rounded-2xl border-2 font-bold transition-colors ${
                        showResult
                          ? correct
                            ? "bg-[#d4f4dd] border-[#6ad48b]"
                            : picked
                            ? "bg-[#ffd6e7] border-[#ff7eb5]"
                            : "border-[#2b2640]/10 opacity-60"
                          : "border-[#2b2640]/10 hover:border-[#5aa9e6] bg-white"
                      }`}
                    >
                      {opt} {showResult && correct && "✅"} {showResult && picked && !correct && "❌"}
                    </button>
                  );
                })}
              </div>
              {showWhy === i && picks[i] !== undefined && (
                <div className="mt-2 text-xs italic text-[#2b2640]/70">💡 {q.why}</div>
              )}
            </div>
          ))}
          {picks.length === lesson.quiz.length && picks.every((p) => p !== undefined) && (
            <button
              onClick={() => {
                setStep("result");
                if (!done) onComplete(allCorrect);
              }}
              className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full font-bold text-white bg-[#5aa9e6] border-[3px] border-white shadow-[0_5px_0_0_#3b80b0] active:translate-y-1 active:shadow-[0_1px_0_0_#3b80b0] display"
            >
              Finish lesson →
            </button>
          )}
        </>
      )}

      {step === "result" && (
        <div className="text-center py-4">
          <div className="text-7xl mb-3 anim-pop-in">{allCorrect ? "🎉" : "💪"}</div>
          <div className="display text-3xl mb-2">
            {allCorrect ? "You aced it!" : `${score} / ${lesson.quiz.length}`}
          </div>
          {allCorrect && (
            <div className="text-sm text-[#2b2640]/70 mb-4">
              You earned <strong>{lesson.badge}</strong> + 30 XP + 🪙10 coins!
            </div>
          )}
          <button
            onClick={onClose}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full font-bold text-white bg-[#5aa9e6] border-[3px] border-white shadow-[0_5px_0_0_#3b80b0] active:translate-y-1 active:shadow-[0_1px_0_0_#3b80b0] display"
          >
            Back to Coinwood
          </button>
        </div>
      )}
    </ModalShell>
  );
}

/* ============== FLYING COIN ============== */
function FlyingCoin({ jar }: { jar: JarKey }) {
  // Random target offset toward jar position (jars are bottom-left/center/right)
  const left = jar === "save" ? "20%" : jar === "spend" ? "50%" : "80%";
  const dy = "120px";
  return (
    <span
      className="fixed top-1/3 text-3xl anim-coin-fly z-40 pointer-events-none"
      style={
        {
          left,
          "--dx": "0px",
          "--dy": dy,
        } as React.CSSProperties
      }
    >
      🪙
    </span>
  );
}

/* ============== CONFETTI ============== */
function Confetti({ show }: { show: boolean }) {
  if (!show) return null;
  const pieces = Array.from({ length: 28 });
  return (
    <div className="fixed inset-0 pointer-events-none z-40 flex items-center justify-center">
      {pieces.map((_, i) => {
        const angle = (i / pieces.length) * Math.PI * 2;
        const dist = 100 + Math.random() * 140;
        const dx = Math.cos(angle) * dist;
        const dy = Math.sin(angle) * dist;
        const emoji = ["🪙", "✨", "🎉", "⭐", "💫", "🌟"][i % 6];
        return (
          <span
            key={i}
            className="confetti"
            style={
              {
                "--dx": `${dx}px`,
                "--dy": `${dy}px`,
                animationDelay: `${i * 8}ms`,
              } as React.CSSProperties
            }
          >
            {emoji}
          </span>
        );
      })}
    </div>
  );
}

/* ============== SOUND (Web Audio API) ============== */
let _audioCtx: AudioContext | null = null;
function getCtx(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!_audioCtx) {
    try {
      _audioCtx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    } catch {
      return null;
    }
  }
  return _audioCtx;
}

function playTone(freq: number, dur: number, type: OscillatorType = "sine", vol = 0.15) {
  const ctx = getCtx();
  if (!ctx) return;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  gain.gain.setValueAtTime(vol, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + dur);
  osc.connect(gain).connect(ctx.destination);
  osc.start();
  osc.stop(ctx.currentTime + dur);
}

function playSound(kind: "coin" | "plink" | "levelup") {
  if (kind === "coin") {
    playTone(800, 0.08, "sine", 0.15);
    setTimeout(() => playTone(1200, 0.1, "sine", 0.12), 60);
  } else if (kind === "plink") {
    playTone(1000, 0.06, "triangle", 0.12);
  } else if (kind === "levelup") {
    [523, 659, 784, 1047].forEach((f, i) => setTimeout(() => playTone(f, 0.18, "triangle", 0.18), i * 90));
  }
}
