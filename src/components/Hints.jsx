import React from 'react';

export function Hints({ guessCount, currentCity }) {
    if (!currentCity) return null;

    const showCountry = guessCount >= 5;
    const showFirstLetter = guessCount >= 8;

    if (!showCountry && !showFirstLetter) return null;

    return (
        <div className="hints-container">
            {showCountry && (
                <div className="hint-item">
                    🌍 Hint: Country is <strong>{currentCity.country}</strong>
                </div>
            )}
            {showFirstLetter && (
                <div className="hint-item">
                    🔤 Hint: Starts with <strong>{currentCity.name[0]}</strong>
                </div>
            )}
        </div>
    );
}
