export function getETDate() {
    const now = new Date();
    // Create date string in ET timezone
    const etDate = new Intl.DateTimeFormat('en-US', {
        timeZone: 'America/New_York',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    }).format(now);
    
    // Format: MM/DD/YYYY -> YYYY-MM-DD
    const [month, day, year] = etDate.split('/');
    return `${year}-${month}-${day}`;
}

export function getNextETMidnight() {
    const now = new Date();
    // Get next midnight in ET
    const etNow = new Date(now.toLocaleString('en-US', { timeZone: 'America/New_York' }));
    const nextMidnight = new Date(etNow);
    nextMidnight.setHours(24, 0, 0, 0);
    
    // Calculate difference in milliseconds
    const diff = nextMidnight.getTime() - etNow.getTime();
    return diff;
}

export function formatTimeRemaining(ms) {
    const seconds = Math.floor((ms / 1000) % 60);
    const minutes = Math.floor((ms / (1000 * 60)) % 60);
    const hours = Math.floor((ms / (1000 * 60 * 60)) % 24);

    const pad = (num) => num.toString().padStart(2, '0');
    return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
}

// Simple seeded random number generator
// Using a Linear Congruential Generator (LCG)
export function seededRandom(seed) {
    // Simple hash to convert string seed (YYYY-MM-DD) to integer
    let h = 0xdeadbeef;
    for(let i = 0; i < seed.length; i++) {
        h = Math.imul(h ^ seed.charCodeAt(i), 2654435761);
    }
    const val = (h ^ h >>> 16) >>> 0;
    
    // LCG parameters
    const m = 2 ** 31 - 1;
    const a = 1103515245;
    const c = 12345;
    
    const random = (x) => (a * x + c) % m;
    
    return random(val) / m;
}

export function getDailyCityIndex(totalCities, dateString) {
    const randomVal = seededRandom(dateString);
    return Math.floor(randomVal * totalCities);
}
