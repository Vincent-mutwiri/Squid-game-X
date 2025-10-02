const adjectives = [
  'Swift', 'Clever', 'Mighty', 'Brave', 'Wise', 'Lucky', 'Bold', 'Quick',
  'Fierce', 'Noble', 'Bright', 'Sharp', 'Cosmic', 'Epic', 'Legendary', 'Mystic',
  'Thunder', 'Lightning', 'Blazing', 'Frozen', 'Golden', 'Silver', 'Diamond', 'Turbo',
  'Super', 'Mega', 'Ultra', 'Hyper', 'Ninja', 'Cyber', 'Quantum', 'Stellar',
  'Radiant', 'Phantom', 'Shadow', 'Crimson', 'Azure', 'Emerald', 'Sapphire', 'Ruby'
];

const nouns = [
  'Tiger', 'Dragon', 'Phoenix', 'Eagle', 'Wolf', 'Lion', 'Falcon', 'Hawk',
  'Panther', 'Bear', 'Fox', 'Shark', 'Cobra', 'Viper', 'Raven', 'Owl',
  'Warrior', 'Champion', 'Hero', 'Legend', 'Master', 'Wizard', 'Knight', 'Samurai',
  'Ninja', 'Pirate', 'Viking', 'Gladiator', 'Titan', 'Giant', 'Comet', 'Meteor',
  'Thunder', 'Storm', 'Blaze', 'Frost', 'Spark', 'Flash', 'Rocket', 'Ace'
];

export function generateNickname(): string {
  const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
  const noun = nouns[Math.floor(Math.random() * nouns.length)];
  const number = Math.floor(Math.random() * 100);
  
  return `${adjective}${noun}${number}`;
}
