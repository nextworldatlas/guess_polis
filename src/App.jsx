import { cities } from './data/cities';
import React from 'react';
import { useGame } from './hooks/useGame';
import { CityImage } from './components/CityImage';
import { GuessInput } from './components/GuessInput';
import { Feedback } from './components/Feedback';
import { Hints } from './components/Hints';
import { ScoreBoard } from './components/ScoreBoard';
import { getNextETMidnight, formatTimeRemaining } from './utils';
import { useState, useEffect } from 'react';

function App() {
  const { currentCity, guesses, isCorrect, streak, history, gameStatus, makeGuess, startNewGame } = useGame();

  const shareToClipboard = () => {
    const emojiMap = {
      correct: '🟢',
      close: '🟡',
      wrong: '🔴',
    };

    // Re-create logic to determine status for sharing - ideally this should be shared logic
    const grid = guesses.map(g => {
      const guessedCity = cities.find(c => c.name.toLowerCase() === g.text.toLowerCase());
      let status = 'wrong';
      if (g.isCorrect) status = 'correct';
      else if (guessedCity && guessedCity.continent === currentCity.continent) status = 'close';
      return emojiMap[status];
    }).join(' ');

    const text = `Guess Polis 🌍\nI got it in ${guesses.length} ${guesses.length === 1 ? 'try' : 'tries'}!\n\n${grid}\n\nguesspolis.com`;

    navigator.clipboard.writeText(text).then(() => {
      alert('Result copied to clipboard!');
    });
  };

  return (
    <div className="app-container">
      <header className="header">
        <img src={`${import.meta.env.BASE_URL}logo_full.png`} alt="Guess Polis" className="logo" />
        <ScoreBoard streak={streak} history={history} />
      </header>

      <main className="game-area">
        <CityImage city={currentCity} />

        <div className="controls">
          <Hints guessCount={guesses.length} currentCity={currentCity} />
          <GuessInput onGuess={makeGuess} disabled={gameStatus !== 'playing'} cities={cities} />

          <Feedback guesses={guesses} currentCity={currentCity} />

          {gameStatus === 'won' && (
            <div className="success-message">
              <h2>🎉 Correct! It was {currentCity.name}.</h2>
              <div className="action-buttons">
                <button onClick={shareToClipboard} className="share-button">
                  Share Result 📤
                </button>
                <div className="next-city-timer">
                  <p>Next city in:</p>
                  <CountdownTimer />
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <footer className="footer">
        <p>Guess the city from the satellite view.</p>
      </footer>
    </div>
  );
}
function CountdownTimer() {
  const [timeLeft, setTimeLeft] = useState(getNextETMidnight());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(getNextETMidnight());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return <span className="timer">{formatTimeRemaining(timeLeft)}</span>;
}

export default App;
