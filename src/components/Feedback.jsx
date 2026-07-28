import React from 'react';
import { cities } from '../data/cities';

export function Feedback({ guesses, currentCity }) {
    // Enhanced feedback logic
    // We need to check if the guessed city shares the same continent as the target city
    const getFeedback = (guessText) => {
        const normalizedGuess = guessText.trim().toLowerCase();
        // Check both city name and alternate names
        const guessedCity = cities.find(c =>
            c.name.toLowerCase() === normalizedGuess ||
            (c.alternateNames || []).some(alt => alt.toLowerCase() === normalizedGuess)
        );
        const targetAlternates = (currentCity.alternateNames || []).map(n => n.toLowerCase());
        const isCorrect = normalizedGuess === currentCity.name.toLowerCase() || targetAlternates.includes(normalizedGuess);

        let status = 'wrong'; // red
        let message = 'Wrong continent';

        if (isCorrect) {
            status = 'correct'; // green
            message = 'Correct!';
        } else if (guessedCity && guessedCity.continent === currentCity.continent) {
            status = 'close'; // yellow? or just warm.
            message = 'Correct Continent!';
        } else if (!guessedCity) {
            // Guess might not be in our limited list, so we can't be sure about continent.
            // For this limited version, we might just say "Unknown City" or default to wrong.
            message = 'City not in database';
        }

        return { status, message, isCorrect };
    };

    return (
        <div className="feedback-container">
            {guesses.map((guess, index) => {
                const { status, message } = getFeedback(guess.text);
                return (
                    <div key={index} className={`feedback-item ${status}`}>
                        <span className="guess-text">{guess.text}</span>
                        <span className="feedback-message">{message}</span>
                        {status === 'correct' && <span className="indicator">🟢</span>}
                        {status === 'close' && <span className="indicator">🟡</span>}
                        {status === 'wrong' && <span className="indicator">🔴</span>}
                    </div>
                );
            })}
        </div>
    );
}
