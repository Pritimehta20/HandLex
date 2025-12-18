// src/components/AlphabetPosters.jsx
import React from 'react';

const emojiMap = {
  ant: '🐜',
  aeroplane: '✈️',
  apple: '🍎',
  bee: '🐝',
  bear: '🐻',
  boat: '⛵',
  cat: '🐱',
  cow: '🐮',
  corn: '🌽',
  dog: '🐶',
  door: '🚪',
  duck: '🦆',
  egg: '🥚',
  ear: '👂',
  elephant: '🐘',
  fish: '🐟',
  fox: '🦊',
  frog: '🐸',
  goat: '🐐',
  gift: '🎁',
  guitar: '🎸',
  hat: '🎩',
  hand: '✋',
  house: '🏠',
  ice: '🧊',
  igloo: '🏠',
  ink: '🖋️',
  jam: '🍓',
  jelly: '🍮',
  jeep: '🚙',
  kite: '🪁',
  king: '🤴',
  key: '🔑',
  lion: '🦁',
  leaf: '🍃',
  lamp: '💡',
  moon: '🌙',
  milk: '🥛',
  monkey: '🐵',
  nest: '🐣',
  nurse: '🧑‍⚕️',
  nose: '👃',
  owl: '🦉',
  orange: '🍊',
  octopus: '🐙',
  pen: '🖊️',
  pig: '🐷',
  pizza: '🍕',
  queen: '👑',
  quilt: '🛏️',
  quiz: '❓',
  rain: '🌧️',
  ring: '💍',
  rocket: '🚀',
  sun: '☀️',
  sock: '🧦',
  snake: '🐍',
  tree: '🌳',
  train: '🚂',
  turtle: '🐢',
  umbrella: '☂️',
  unicorn: '🦄',
  up: '⬆️',
  van: '🚐',
  vest: '🦺',
  violin: '🎻',
  water: '💧',
  watch: '⌚',
  whale: '🐋',
  yarn: '🧶',
  yak: '🐂',
  yoyo: '🪀',
  zebra: '🦓',
  zip: '🧷',
  zoo: '🏞️',
  'x-ray': '🩻',
  xylophone: '🎼',
};

const alphabetExamples = {
  A: ['ant', 'aeroplane', 'apple'],
  B: ['bee', 'bear', 'boat'],
  C: ['cat', 'cow', 'corn'],
  D: ['dog', 'door', 'duck'],
  E: ['egg', 'ear', 'elephant'],
  F: ['fish', 'fox', 'frog'],
  G: ['goat', 'gift', 'guitar'],
  H: ['hat', 'hand', 'house'],
  I: ['ice', 'igloo', 'ink'],
  J: ['jam', 'jelly', 'jeep'],
  K: ['kite', 'king', 'key'],
  L: ['lion', 'leaf', 'lamp'],
  M: ['moon', 'milk', 'monkey'],
  N: ['nest', 'nurse', 'nose'],
  O: ['owl', 'orange', 'octopus'],
  P: ['pen', 'pig', 'pizza'],
  Q: ['queen', 'quilt', 'quiz'],
  R: ['rain', 'ring', 'rocket'],
  S: ['sun', 'sock', 'snake'],
  T: ['tree', 'train', 'turtle'],
  U: ['umbrella', 'unicorn', 'up'],
  V: ['van', 'vest', 'violin'],
  W: ['water', 'watch', 'whale'],
  X: ['x-ray', 'xylophone'],
  Y: ['yarn', 'yak', 'yoyo'],
  Z: ['zebra', 'zip', 'zoo'],
};

const buildAlphabetItems = () =>
  'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').map((ch, i) => ({
    id: ch,
    letter: ch,
    src: `/lessons/alphabets/${ch}.png`,
    words: alphabetExamples[ch] || [],
    gradientIndex: i % 4,
  }));

const gradients = [
  'linear-gradient(135deg, #f97373, #fde68a)',
  'linear-gradient(135deg, #38bdf8, #a5b4fc)',
  'linear-gradient(135deg, #4ade80, #facc15)',
  'linear-gradient(135deg, #f9a8d4, #bfdbfe)',
];

const AlphabetPosters = ({ onZoom }) => {
  const items = buildAlphabetItems();

  return (
    <>
      <style>{`
        /* Tablet and small laptops */
        @media (max-width: 768px) {
          .lp-poster-top {
            padding: 10px 12px 6px;
            gap: 8px;
          }
          .lp-poster-letter-block {
            width: 80px;
            height: 100px;
            border-radius: 16px;
          }
          .lp-poster-letter-big {
            font-size: 2.2rem;
          }
          .lp-poster-letter-small {
            font-size: 1rem;
          }
          .lp-poster-sign {
            padding: 4px;
          }
          .lp-poster-sign img {
            max-height: 110px;
          }
          .lp-poster-bottom {
            padding: 6px 12px 8px;
          }
          .lp-word-row {
            padding: 4px 8px;
          }
          .lp-word-emoji {
            font-size: 1.9rem;
            width: 36px;
          }
          .lp-word-text {
            font-size: 0.84rem;
          }
          .lp-word-tagline {
            font-size: 0.68rem;
          }
        }

        /* Small phones */
        @media (max-width: 480px) {
          .lp-poster-top {
            padding: 8px 8px 4px;
            gap: 6px;
          }
          .lp-poster-letter-block {
            width: 70px;
            height: 90px;
            border-radius: 14px;
          }
          .lp-poster-letter-big {
            font-size: 2rem;
          }
          .lp-poster-letter-small {
            font-size: 0.9rem;
          }
          .lp-poster-sign img {
            max-height: 90px;
          }
          .lp-poster-bottom {
            padding: 6px 8px 8px;
          }
          .lp-word-row {
            padding: 3px 6px;
            margin-top: 4px;
          }
          .lp-word-emoji {
            font-size: 1.6rem;
            width: 32px;
          }
          .lp-word-text {
            font-size: 0.78rem;
          }
          .lp-word-tagline {
            font-size: 0.64rem;
          }
        }
      `}</style>

      <div className="lp-grid-poster">
        {items.map((item) => (
          <article key={item.id} className="lp-poster">
            <div className="lp-poster-top">
              <div
                className="lp-poster-top-bg"
                style={{ background: gradients[item.gradientIndex] }}
              />
              <div className="lp-poster-letter-block">
                <div className="lp-poster-letter-big">{item.letter}</div>
                <div className="lp-poster-letter-small">
                  {item.letter.toLowerCase()}
                </div>
              </div>
              <div
                className="lp-poster-sign"
                onClick={() => onZoom(item.src, `${item.letter} sign`)}
              >
                <img src={item.src} alt={`${item.letter} sign`} />
              </div>
            </div>
            <div className="lp-poster-bottom">
              {item.words.map((w) => {
                const key = w.toLowerCase();
                const emoji = emojiMap[key];
                return (
                  <div className="lp-word-row" key={w}>
                    {emoji && (
                      <span className="lp-word-emoji">{emoji}</span>
                    )}
                    <div className="lp-word-text">
                      {item.letter.toUpperCase()}
                      {w.slice(1)}
                    </div>
                    <div className="lp-word-tagline">
                      starts with {item.letter}
                    </div>
                  </div>
                );
              })}
            </div>
          </article>
        ))}
      </div>
    </>
  );
};

export default AlphabetPosters;
