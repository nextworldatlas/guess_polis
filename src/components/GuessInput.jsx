import React, { useState } from 'react';

export function GuessInput({ onGuess, disabled, cities }) {
    const [guess, setGuess] = useState('');
    const [suggestions, setSuggestions] = useState([]);

    const handleInputChange = (e) => {
        const value = e.target.value;
        setGuess(value);

        if (value.trim().length > 0 && cities) {
            const filtered = cities.filter(city =>
                city.name.toLowerCase().startsWith(value.toLowerCase())
            );
            setSuggestions(filtered.slice(0, 5));
        } else {
            setSuggestions([]);
        }
    };

    const handleSuggestionClick = (cityName) => {
        setGuess(cityName);
        setSuggestions([]);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (guess.trim()) {
            onGuess(guess);
            setGuess('');
            setSuggestions([]);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="guess-input-form">
            <div className="guess-input-wrapper">
                <input
                    type="text"
                    value={guess}
                    onChange={handleInputChange}
                    placeholder="Enter city name..."
                    disabled={disabled}
                    className="guess-input"
                    autoFocus
                    style={{ width: '100%', boxSizing: 'border-box' }}
                />
                {suggestions.length > 0 && (
                    <ul className="suggestions-list">
                        {suggestions.map((city) => (
                            <li
                                key={city.id}
                                className="suggestion-item"
                                onClick={() => handleSuggestionClick(city.name)}
                            >
                                {city.name}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
            <button type="submit" disabled={disabled || !guess.trim()} className="guess-button">
                Guess
            </button>
        </form>
    );
}
