"use client";

import Link from "next/link";
import { useState } from "react";

/* "Find your stage" - six questions that recommend a starting level.

   Questions, options, scoring bands and stage copy are carried over verbatim
   from the original build's component class; only the plumbing changed. Each
   option's index is its score (0-3), the six scores are summed, and the bands
   below map the total onto a stage. */

const QUESTIONS = [
  {
    t: "Can you read hiragana and katakana?",
    ja: "ひらがな・カタカナは読めますか？",
    o: [
      "Not yet — I read Japanese in Romaji",
      "Hiragana only, slowly",
      "Both, with some effort",
      "Both fluently, no Romaji needed",
    ],
  },
  {
    t: "Roughly how many kanji can you read?",
    ja: "漢字はどれくらい読めますか？",
    o: ["Almost none", "Around 100 basic kanji", "Around 300 kanji", "600 or more kanji"],
  },
  {
    t: "Could you introduce yourself and ask a stranger for directions?",
    ja: "自己紹介や道を聞くことができますか？",
    o: [
      "No, not yet",
      "With effort and pauses",
      "Comfortably",
      "Yes, and I could keep the conversation going",
    ],
  },
  {
    t: "How do you feel about て-form, plain form and conditionals?",
    ja: "文法はどこまで進んでいますか？",
    o: [
      "I haven't learned them yet",
      "I know です／ます basics",
      "Comfortable with て-form and plain form",
      "Comfortable with keigo, causative and passive",
    ],
  },
  {
    t: "When you watch Japanese drama or anime without subtitles, what happens?",
    ja: "字幕なしでどれくらい分かりますか？",
    o: [
      "I catch a word here and there",
      "I follow simple, slow speech",
      "I follow most everyday conversation",
      "I follow news and interviews too",
    ],
  },
  {
    t: "Have you taken the JLPT before?",
    ja: "JLPTを受けたことがありますか？",
    o: ["Never", "I have cleared N5", "I have cleared N4", "I have cleared N3 or higher"],
  },
];

const STAGES = [
  {
    kanji: "一",
    level: "STAGE 1 · JLPT N5",
    title: "Kana to your first conversations",
    blurb:
      "You are at the very start — the best possible place to build habits correctly. We begin with reading, so hiragana and katakana stop being obstacles within the first weeks, then attach grammar to what you can already read instead of asking you to memorise lists.",
    focus: [
      "Hiragana and katakana, fully readable without Romaji",
      "Your first ~150 words plus です／ます sentence patterns",
      "A self-introduction you can say out loud with confidence",
    ],
  },
  {
    kanji: "二",
    level: "STAGE 2 · JLPT N4",
    title: "Grammar that connects",
    blurb:
      "Your foundation exists but sentences still arrive one at a time. Stage 2 is about joining them: plain form, て-form and conditionals turn isolated phrases into conversation, and reading grows from single labels to short passages.",
    focus: [
      "て-form, plain form and past tense until they feel automatic",
      "Kanji to around 300 with reading practice built in",
      "Everyday conversation drills and slow-speed listening",
    ],
  },
  {
    kanji: "三",
    level: "STAGE 3 · JLPT N3",
    title: "Real-world Japanese",
    blurb:
      "This is the bridge level where most self-learners stall, so we change the diet: more volume, longer texts and natural-speed listening. You will move from answering questions to expressing opinions with reasons.",
    focus: [
      "Kanji to around 650 and vocabulary in context, not in lists",
      "Transitivity, causative and passive plus keigo foundations",
      "Drama, podcast and news listening with structured note-taking",
    ],
  },
  {
    kanji: "四",
    level: "STAGE 4 · JLPT N2",
    title: "Fluency and nuance",
    blurb:
      "You already function in Japanese. Stage 4 sharpens register and precision — the advanced grammar, business language and reading speed that N2 and Japanese workplaces actually demand.",
    focus: [
      "1,000+ kanji and abstract, editorial-level vocabulary",
      "Formal keigo and business register for real settings",
      "Full JLPT strategy: timing, elimination, structural reading",
    ],
  },
];

const LETTERS = ["A", "B", "C", "D"];

function stageIndex(answers: number[]) {
  const total = answers.reduce((a, b) => a + (b || 0), 0);
  if (total <= 3) return 0;
  if (total <= 8) return 1;
  if (total <= 13) return 2;
  return 3;
}

export default function StageQuiz() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);

  const done = step >= QUESTIONS.length;

  if (!done) {
    const q = QUESTIONS[step];
    const pick = (score: number) => {
      const next = answers.slice();
      next[step] = score;
      setAnswers(next);
      setStep(Math.min(step + 1, QUESTIONS.length));
    };

    return (
      <div className="fy-card">
        <div className="fy-qtop">
          <div className="fy-qn">Question {step + 1} of {QUESTIONS.length}</div>
          <div className="fy-qja">質問 {step + 1}</div>
        </div>
        <div className="fy-track">
          <div
            className="fy-fill"
            style={{ width: `${Math.round((step / QUESTIONS.length) * 100)}%` }}
          ></div>
        </div>
        <h3 className="fy-q">{q.t}</h3>
        <div className="fy-qja2">{q.ja}</div>
        <div className="fy-opts">
          {q.o.map((label, i) => (
            <button type="button" className="fy-opt" key={label} onClick={() => pick(i)}>
              <span className="fy-let">{LETTERS[i]}</span>
              <span className="fy-lab">{label}</span>
            </button>
          ))}
        </div>
        <div className="fy-foot">
          <button
            type="button"
            className="fy-link"
            onClick={() => setStep(Math.max(0, step - 1))}
            disabled={step === 0}
          >
            ← Back
          </button>
          <button
            type="button"
            className="fy-link"
            onClick={() => {
              setStep(0);
              setAnswers([]);
            }}
          >
            Start over
          </button>
        </div>
      </div>
    );
  }

  const stage = STAGES[stageIndex(answers)];

  return (
    <div className="fy-res">
      <div className="fy-res-head">
        <div className="fy-res-kanji">{stage.kanji}</div>
        <div>
          <div className="fy-res-lvl">Your recommended start · {stage.level}</div>
          <div className="fy-res-title">{stage.title}</div>
        </div>
      </div>
      <div className="fy-res-body">
        <p>{stage.blurb}</p>
        <div className="fy-res-lab">Your first month</div>
        <div className="fy-focus">
          {stage.focus.map((text) => (
            <div className="fy-f" key={text}>
              {text}
            </div>
          ))}
        </div>
        <div className="fy-cta">
          <Link href="/contact#form" className="fy-book">
            Book a trial class <span>&rarr;</span>
          </Link>
          <button
            type="button"
            className="fy-link"
            onClick={() => {
              setStep(0);
              setAnswers([]);
            }}
          >
            Retake the test
          </button>
        </div>
        <p className="fy-note">
          This is a guide, not a verdict. Sensei confirms your level in a short trial session
          before your plan is finalised.
        </p>
      </div>
    </div>
  );
}
