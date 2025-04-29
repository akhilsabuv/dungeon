import React, { useState } from 'react';

const initialPlayers = [
  {
    name: 'You',
    character: 'azzanthemystic',
    hp: 10,
    hand: [],
    deck: [],
    discard: [],
    defenseCards: [],
  },
  {
    name: 'AI',
    character: 'suthatheskullcrusher',
    hp: 10,
    hand: [],
    deck: [],
    discard: [],
    defenseCards: [],
  }
];

const sampleDeck = [
  { name: 'Lightning Bolt', type: 'Attack', quantity: 4, effect: 1 },
  { name: 'Shield', type: 'Defense', quantity: 2, effect: 1 },
  { name: 'Speed of Thought', type: 'Play Again', quantity: 2, effect: 1 },
  { name: 'Vampiric Touch', type: 'Attack + Heal', quantity: 2, effect: 1 }
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
    current.discard.push(card);
    drawCard(current);
    setPlayers(p);
    setCurrentPlayerIndex((currentPlayerIndex + 1) % 2);
  }

  const current = players[currentPlayerIndex];

  return (
    <div className="p-4 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-4 text-center">Dungeon Mayhem (React)</h1>

      <div className="grid grid-cols-2 gap-6">
        {players.map((p, i) => (
          <div key={i} className="bg-white rounded-xl p-4 shadow border">
            <h2 className="text-xl font-semibold">{p.name} — HP: {p.hp}</h2>
            <div className="mt-2 text-sm text-gray-600">Defense Cards: {p.defenseCards.length}</div>
          </div>
        ))}
      </div>

      <div className="mt-8">
        <h2 className="text-lg font-bold mb-2">{current.name}'s Turn</h2>
        <div className="flex flex-wrap gap-4">
          {current.hand.map((card, i) => (
            <div
              key={i}
              onClick={() => playCard(i)}
              className="w-[150px] h-[220px] bg-white rounded-xl shadow-md hover:shadow-xl cursor-pointer border flex flex-col items-center p-2"
            >
              <img
                src={`https://via.placeholder.com/120x100?text=${encodeURIComponent(card.name)}`}
                alt={card.name}
                className="w-[120px] h-[100px] object-cover rounded"
              />
              <div className="text-sm font-semibold mt-2">{card.name}</div>
              <div className="text-xs text-gray-500">{card.type}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default GameBoard;