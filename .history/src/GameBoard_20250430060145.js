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

const [muted, setMuted] = useState(false);
const audioRef = useRef(null);

useEffect(() => {
  if (audioRef.current) {
    audioRef.current.volume = 0.3;
    audioRef.current.loop = true;
    audioRef.current.play().catch(() => {});
  }
}, []);

useEffect(() => {
  if (audioRef.current) {
    audioRef.current.muted = muted;
  }
}, [muted]);

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
    <div className="container-fluid bg-dark text-light min-vh-100 py-5">
    <audio ref={audioRef} src="/assets/music/background.mp3" />

    <button
      className="btn btn-sm btn-warning position-absolute top-0 end-0 m-3 shadow"
      onClick={() => setMuted(!muted)}
    >
      {muted ? '🔇 Mute' : '🔊 Music'}
    </button>

    <h1 className="text-center mb-5 display-4">Dungeon Mayhem</h1>
  
    <div className="row g-4 justify-content-center">
      {players.map((p, i) => (
        <div className="col-md-5">
          <div className="card bg-secondary text-white shadow">
            <div className="card-body">
              <h5 className="card-title">{p.name}</h5>
              <p className="card-text mb-1">
                <strong>HP:</strong> <span className="text-danger">{p.hp}</span>
              </p>
              <p className="card-text mb-1">
                <strong>Wallet:</strong> <span className="text-success">${p.wallet}</span>
              </p>
              <p className="card-text">
                <strong>Defense:</strong> {p.defenseCards.length}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  
    <div className="mt-5 text-center">
      <h3>{current.name}'s Turn</h3>
      <div className="d-flex flex-wrap justify-content-center gap-3 mt-3">
        {current.hand.map((card, i) => (
          <div
            className="card bg-dark text-light border-light"
            style={{ width: '160px', cursor: 'pointer' }}
            onClick={() => playCard(i)}
          >
            <img
              src={`/assets/cards/${card.characterImage}`}
              className="card-img-top"
              alt={card.name}
            />
            <div className="card-body">
              <h6 className="card-title">{card.name}</h6>
              <p className="card-text text-muted small">{card.type}</p>
              <span className="badge bg-warning text-dark">Effect: {card.effect}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>  
  );
}

export default GameBoard;
