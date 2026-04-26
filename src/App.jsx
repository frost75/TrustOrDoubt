import React from "react";
import { useMemo, useState } from "react";

const rounds = [
  {
    id: 1,
    context: "你和一位同事被分配到同一个项目，需要互相配合。",
    choiceA: "主动多做一点",
    choiceB: "只做自己部分",
    opponentActual: "合作",
    shownToPlayer: "对方也在积极配合",
    feedbackA: "项目进展顺利，你们配合不错。",
    feedbackB: "你完成了自己的部分，对方似乎做了更多。",
  },
  {
    id: 2,
    context: "第二次合作，你们已经有了一点默契。",
    choiceA: "继续信任对方",
    choiceB: "开始保留一点",
    opponentActual: "合作",
    shownToPlayer: "对方正常配合",
    feedbackA: "合作依然顺利。",
    feedbackB: "你略微收缩，对方仍然投入。",
  },
  {
    id: 3,
    context: "第三次合作，你发现对方回复变慢了。",
    choiceA: "理解对方，继续配合",
    choiceB: "减少投入，避免吃亏",
    opponentActual: "合作",
    shownToPlayer: "对方响应很慢，似乎不太上心",
    feedbackA: "你继续投入，但感觉对方不太积极。",
    feedbackB: "你开始收缩，对方也没有明显变化。",
  },
  {
    id: 4,
    context: "你听说对方在参与其他项目。",
    choiceA: "继续信任",
    choiceB: "进一步减少投入",
    opponentActual: "合作",
    shownToPlayer: "对方可能把精力放在别处",
    feedbackA: "你有点犹豫，但还是选择相信。",
    feedbackB: "你明显减少投入，合作开始变得松散。",
  },
  {
    id: 5,
    context: "项目接近截止，但你感觉对方没有尽力。",
    choiceA: "最后再信一次",
    choiceB: "彻底只顾自己",
    opponentActual: "合作",
    shownToPlayer: "对方关键部分没有完成",
    feedbackA: "你承担了更多压力。",
    feedbackB: "你选择自保，项目变得紧张。",
  },
];

const STAGES = {
  START: "start",
  PLAY: "play",
  TRUTH: "truth",
  REVIEW: "review",
  END: "end",
};

export default function App() {
  const [stage, setStage] = useState(STAGES.START);
  const [roundIndex, setRoundIndex] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [history, setHistory] = useState([]);

  const currentRound = rounds[roundIndex];

  const hasStrategyShift = useMemo(() => {
    if (history.length < 2) return false;
    const firstPick = history[0]?.choice;
    return history.some((item) => item.choice !== firstPick);
  }, [history]);

  const handleStart = () => {
    setStage(STAGES.PLAY);
    setRoundIndex(0);
    setSelectedChoice(null);
    setShowFeedback(false);
    setHistory([]);
  };

  const handleChoose = (choice) => {
    if (showFeedback) return;

    setSelectedChoice(choice);
    setShowFeedback(true);
    setHistory((prev) => [
      ...prev,
      {
        roundId: currentRound.id,
        choice,
        label: choice === "A" ? currentRound.choiceA : currentRound.choiceB,
      },
    ]);
  };

  const handleNext = () => {
    if (roundIndex < rounds.length - 1) {
      setRoundIndex((prev) => prev + 1);
      setSelectedChoice(null);
      setShowFeedback(false);
      return;
    }
    setStage(STAGES.TRUTH);
  };

  const resetGame = () => {
    setStage(STAGES.START);
    setRoundIndex(0);
    setSelectedChoice(null);
    setShowFeedback(false);
    setHistory([]);
  };

  return (
    <>
      <style>{`
        * { box-sizing: border-box; }
        body {
          margin: 0;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
          background: #f4f4f4;
          color: #111;
        }
        #root {
          min-height: 100vh;
        }
        .app {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 16px;
        }
        .card {
          width: 100%;
          max-width: 480px;
          background: #fff;
          border: 1px solid #ddd;
          border-radius: 12px;
          padding: 24px 20px;
          text-align: center;
          animation: fadeIn 0.35s ease;
          box-shadow: 0 8px 24px rgba(0,0,0,0.06);
        }
        h1, h2, h3, p { margin: 0; }
        h1 { font-size: 28px; margin-bottom: 12px; }
        h2 { font-size: 22px; margin-bottom: 12px; }
        .sub { color: #555; margin-bottom: 20px; line-height: 1.65; }
        .round-tag { font-size: 14px; color: #666; margin-bottom: 10px; }
        .context {
          font-size: 18px;
          line-height: 1.7;
          margin-bottom: 20px;
        }
        .btn-group {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        button {
          width: 100%;
          border: 1px solid #111;
          background: #fff;
          color: #111;
          font-size: 16px;
          line-height: 1.3;
          border-radius: 10px;
          padding: 12px;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        button:hover { background: #111; color: #fff; }
        button:disabled { cursor: not-allowed; opacity: 0.6; }
        .feedback {
          margin-top: 14px;
          padding: 12px;
          border: 1px solid #ccc;
          border-radius: 10px;
          color: #222;
          background: #fafafa;
          line-height: 1.6;
        }
        .list {
          text-align: left;
          margin-top: 14px;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .list-item {
          border: 1px solid #d8d8d8;
          border-radius: 10px;
          padding: 12px;
          background: #fbfbfb;
          line-height: 1.6;
        }
        .highlight {
          margin-top: 16px;
          font-weight: 700;
        }
        .actions { margin-top: 16px; }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <main className="app">
        {stage === STAGES.START && (
          <section className="card">
            <h1>《你误会了》</h1>
            <p className="sub">一个关于信任、误读与选择的互动故事。</p>
            <button onClick={handleStart}>开始游戏</button>
          </section>
        )}

        {stage === STAGES.PLAY && currentRound && (
          <section className="card" key={`round-${currentRound.id}`}>
            <p className="round-tag">第 {currentRound.id} / {rounds.length} 轮</p>
            <p className="context">{currentRound.context}</p>

            <div className="btn-group">
              <button onClick={() => handleChoose("A")} disabled={showFeedback}>
                A. {currentRound.choiceA}
              </button>
              <button onClick={() => handleChoose("B")} disabled={showFeedback}>
                B. {currentRound.choiceB}
              </button>
            </div>

            {showFeedback && (
              <>
                <p className="feedback">
                  {selectedChoice === "A" ? currentRound.feedbackA : currentRound.feedbackB}
                </p>
                <div className="actions">
                  <button onClick={handleNext}>下一步</button>
                </div>
              </>
            )}
          </section>
        )}

        {stage === STAGES.TRUTH && (
          <section className="card">
            <h2>你看到的，不一定是真的。</h2>
            <div className="list">
              {rounds.map((round) => (
                <article className="list-item" key={`truth-${round.id}`}>
                  <strong>第 {round.id} 轮</strong>
                  <div>你看到：{round.shownToPlayer}</div>
                  <div>实际情况：{round.opponentActual}</div>
                </article>
              ))}
            </div>
            <p className="highlight">对方从未背叛你。</p>
            <div className="actions">
              <button onClick={() => setStage(STAGES.REVIEW)}>进入复盘</button>
            </div>
          </section>
        )}

        {stage === STAGES.REVIEW && (
          <section className="card">
            <h2>复盘</h2>
            <div className="list">
              {history.map((item) => (
                <article className="list-item" key={`history-${item.roundId}`}>
                  <strong>第 {item.roundId} 轮</strong>
                  <div>你的选择：{item.choice} - {item.label}</div>
                </article>
              ))}
            </div>
            <p className="highlight">
              {hasStrategyShift
                ? "你在中途开始改变策略"
                : "你在整个过程保持了同一种策略"}
            </p>
            <div className="actions">
              <button onClick={() => setStage(STAGES.END)}>继续</button>
            </div>
          </section>
        )}

        {stage === STAGES.END && (
          <section className="card">
            <h2>很多时候，不是别人变了，而是你看到的信息变了。</h2>
            <div className="actions">
              <button onClick={resetGame}>再来一次</button>
            </div>
          </section>
        )}
      </main>
    </>
  );
}
