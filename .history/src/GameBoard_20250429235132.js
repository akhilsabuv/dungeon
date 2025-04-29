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
    <div className="p-4">
      <h1 className="text-2xl font-bold">Dungeon Mayhem</h1>
      <div className="my-4">
        <h2 className="text-xl">{current.name}'s Turn (HP: {current.hp})</h2>
        <div className="flex gap-2 mt-2">
          {current.hand.map((card, i) => (
            <button
              key={i}
              className="p-2 border rounded bg-white shadow"
              onClick={() => playCard(i)}
            >
              {card.name} ({card.type})
            </button>
          ))}
        </div>
      </div>
      <div className="mt-6">
        {players.map((p, i) => (
          <div key={i} className="mt-2">
            <strong>{p.name}</strong>: {p.hp} HP | Defense Cards: {p.defenseCards.length}
          </div>
        ))}
      </div>
    </div>
  );
}

export default GameBoard;
