import React from 'react';

export function ScoreBoard({ streak, history }) {
    return (
        <div className="scoreboard">
            <div className="stat">
                <span className="label">Streak</span>
                <span className="value">{streak}</span>
            </div>
            {/* Could add total wins/games played here */}
        </div>
    );
}
