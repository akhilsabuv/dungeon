import React, { useState } from 'react';

const initialPlayers = [
  {
    name: 'You',
    character: 'azzanthemystic',
    hp: 10,
    wallet: 10,
    hand: [],
    deck: [],
    discard: [],
    defenseCards: [],
  },
  {
    name: 'AI',
    character: 'suthatheskullcrusher',
    hp: 10,
    wallet: 10,
    hand: [],
    deck: [],
    discard: [],
    defenseCards: [],
  }
];

const sampleDeck = [
  { name: 'Lightning Bolt', type: 'Attack', quantity: 4, effect: 1, characterImage: 'azzan/12.png' },
  { name: 'Shield', type: 'Defense', quantity: 2, effect: 1, characterImage: 'azzan/1.png' },
  { name: 'Speed of Thought', type: 'Play Again', quantity: 2, effect: 1, characterImage: 'azzan/5.png' },
  { name: 'Vampiric Touch', type: 'Attack + Heal', quantity: 2, effect: 1, characterImage: 'azzan/6.png' }
];

function drawCard(player) {
  if (player.deck.length === 0) {
    player.deck = [...player.discard];
    player.discard = [];
  }
  const card = player.deck.pop();
  player.hand.push(card);
}

function GameBoard() {
  const [players, setPlayers] = useState(() => {
    const clonedPlayers = JSON.parse(JSON.stringify(initialPlayers));
    clonedPlayers.forEach(p => {
      p.deck = [...sampleDeck.flatMap(card => Array(card.quantity).fill(card))];
      p.deck = p.deck.sort(() => Math.random() - 0.5);
      for (let i = 0; i < 3; i++) drawCard(p);
    });
    return clonedPlayers;
  });

  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);

  function playCard(cardIndex) {
    const p = [...players];
    const current = p[currentPlayerIndex];
    const opponent = p[(currentPlayerIndex + 1) % 2];
    const card = current.hand.splice(cardIndex, 1)[0];

    switch (card.type) {
      case 'Attack':
        if (opponent.defenseCards.length > 0) {
          opponent.defenseCards.pop();
        } else {
          opponent.hp = Math.max(0, opponent.hp - card.effect);
        }
        break;
      case 'Defense':
        current.defenseCards.push(card);
        break;
      case 'Play Again':
        drawCard(current);
        break;
      case 'Attack + Heal':
        if (opponent.defenseCards.length > 0) {
          opponent.defenseCards.pop();
        } else {
          opponent.hp = Math.max(0, opponent.hp - card.effect);
        }
        current.hp = Math.min(10, current.hp + card.effect);
        break;
    }
    current.wallet += 1; // reward for playing a card
    current.discard.push(card);
    drawCard(current);
    setPlayers(p);
    setCurrentPlayerIndex((currentPlayerIndex + 1) % 2);
  }

  const current = players[currentPlayerIndex];

  return (
    <div className="p-6 bg-gradient-to-b from-purple-900 via-indigo-900 to-black min-h-screen text-white font-sans">
      <h1 className="text-4xl font-bold mb-8 text-center">Dungeon Mayhem</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {players.map((p, i) => (
          <div key={i} className="bg-indigo-800 rounded-xl p-4 shadow-lg border border-indigo-400">
            <h2 className="text-2xl font-semibold">{p.name}</h2>
            <div className="mt-1 text-sm">HP: <span className="font-bold text-red-400">{p.hp}</span></div>
            <div className="text-sm">Wallet: <span className="font-bold text-green-400">${p.wallet}</span></div>
            <div className="text-sm">Defense Cards: {p.defenseCards.length}</div>
          </div>
        ))}
      </div>

      <div className="mt-10">
        <h2 className="text-xl font-bold mb-4">{current.name}'s Turn</h2>
        <div className="flex flex-wrap gap-4 justify-center">
          {current.hand.map((card, i) => (
            <div
              key={i}
              onClick={() => playCard(i)}
              className="w-[150px] h-[240px] bg-indigo-700 hover:bg-indigo-600 transition rounded-xl shadow-md cursor-pointer border border-white flex flex-col items-center p-2"
            >
              <img
                src={`/assets/cards/${card.characterImage}`}
                alt={card.name}
                className="w-[120px] h-[120px] object-cover rounded"
              />
              <div className="text-md font-semibold mt-2 text-center">{card.name}</div>
              <div className="text-sm text-gray-300">{card.type}</div>
              <div className="text-xs mt-auto text-yellow-400">Effect: {card.effect}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default GameBoard;
