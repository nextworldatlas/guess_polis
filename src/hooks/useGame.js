import { useState, useEffect, useCallback } from 'react';
import { cities } from '../data/cities';
import { getETDate, getDailyCityIndex } from '../utils';

export function useGame() {
    const [currentCity, setCurrentCity] = useState(null);
    const [guesses, setGuesses] = useState([]);
    const [isCorrect, setIsCorrect] = useState(false);
    const [streak, setStreak] = useState(0);
    const [history, setHistory] = useState([]);
    const [gameStatus, setGameStatus] = useState('playing'); // 'playing', 'won'

    const startNewGame = useCallback(() => {
        const dateStr = getETDate();
        const storedDate = localStorage.getItem('guess_polis_date');
        const storedGuesses = JSON.parse(localStorage.getItem('guess_polis_guesses') || '[]');
        const storedStatus = localStorage.getItem('guess_polis_status');
        const storedStreak = parseInt(localStorage.getItem('guess_polis_streak') || '0', 10);
        const storedHistory = JSON.parse(localStorage.getItem('guess_polis_history') || '[]');

        const dailyIndex = getDailyCityIndex(cities.length, dateStr);
        const dailyCity = cities[dailyIndex];

        setCurrentCity(dailyCity);

        // Restore state if it's the same day
        if (storedDate === dateStr) {
            setGuesses(storedGuesses);
            setGameStatus(storedStatus || 'playing');
            setStreak(storedStreak);
            setHistory(storedHistory);

            // Check if already correct based on stored guesses
            const anyCorrect = storedGuesses.some(g => g.isCorrect);
            setIsCorrect(anyCorrect);
        } else {
            // New day, reset daily state but keep history/streak if you want? 
            // Usually streak implies consecutive days, which is complex logic. 
            // For now, let's just reset daily guesses and keep history/streak from storage if valid.
            // *Wait*, simple streak logic implementation:
            // If the last game in history was "yesterday", keep streak? 
            // For this iteration, let's simple reset guesses for new day.

            localStorage.setItem('guess_polis_date', dateStr);
            localStorage.setItem('guess_polis_guesses', '[]');
            localStorage.setItem('guess_polis_status', 'playing');

            setGuesses([]);
            setGameStatus('playing');
            setIsCorrect(false);
            // Streak/History persisting across days would be improved later, 
            // currently we just load what's there.
            setStreak(storedStreak);
            setHistory(storedHistory);
        }
    }, []);

    // Initialize game on first load
    useEffect(() => {
        startNewGame();
    }, [startNewGame]);

    useEffect(() => {
        // Persist state whenever it changes
        if (currentCity) { // Only save if game started
            const dateStr = getETDate();
            localStorage.setItem('guess_polis_date', dateStr);
            localStorage.setItem('guess_polis_guesses', JSON.stringify(guesses));
            localStorage.setItem('guess_polis_status', gameStatus);
            localStorage.setItem('guess_polis_streak', streak.toString());
            localStorage.setItem('guess_polis_history', JSON.stringify(history));
        }
    }, [guesses, gameStatus, streak, history, currentCity]);

    const makeGuess = (guess) => {
        if (gameStatus !== 'playing') return;

        const normalizedGuess = guess.trim().toLowerCase();
        const normalizedCityName = currentCity.name.toLowerCase();
        const alternateNames = (currentCity.alternateNames || []).map(n => n.toLowerCase());

        const isGuessCorrect = normalizedGuess === normalizedCityName || alternateNames.includes(normalizedGuess);

        // Check if continent is correct (for feedback)
        // We can just store the guess object with additional info
        // For now, simplistically:
        const newGuess = {
            text: guess,
            isCorrect: isGuessCorrect,
            timestamp: Date.now()
        };

        setGuesses([...guesses, newGuess]);

        if (isGuessCorrect) {
            setIsCorrect(true);
            setStreak(s => s + 1);
            setGameStatus('won');
            setHistory(prev => [...prev, { city: currentCity.name, guesses: guesses.length + 1, won: true }]);
        }
    };

    return {
        currentCity,
        guesses,
        isCorrect,
        streak,
        gameStatus,
        makeGuess,
        startNewGame,
    };
}
