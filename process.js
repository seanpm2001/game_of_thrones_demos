const fs = require('fs');

const wordcount = require('./data/wordcount.json');
const characters = require('./data/characters.json');
const characterGenders = require('./data/characters-gender-all.json');

const data = new Map();


// const houseNames = new Set(characters.characters.map((c) => c.houseName).flat().filter(Boolean));
// console.log(houseNames);
// const sets = ['isRoyal', 'parfOfKingsguard', 'wasKilled', 'hasKilled', 'hasSiblings', 'male', 'female', 'isMarriedOrEngaged', ...houseNames];

characters.characters.forEach((c) => {
    data.set(c.characterName, {
        name: c.characterName,
        episodes: 0,
        words: 0,
        sets: [
            c.royal && 'isRoyal',
            c.kingsguard && 'parfOfKingsguard',
            c.killedBy && 'wasKilled',
            c.killed && 'hasKilled',
            (c.sibling || c.siblings) && 'hasSiblings',
            c.marriedEngaged && 'isMarriedOrEngaged',
            c.housename,
        ].flat().filter(Boolean)
    });
});

Object.entries(characterGenders).forEach(([gender, characters]) => {
    characters.forEach((c) => {
        if (data.has(c)) {
            const d = data.get(c);
            d.sets.push(gender);
        }
    });
});

wordcount.count.forEach((episode) => {
    const map = new Map();
    episode.text.forEach((c) => {
        map.set(c.name, c.count + (map.get(c.name) || 0));
    });
    map.forEach((value, key) => {
        const c = data.get(key);
        if (!c) {
            return;
        }
        c.episodes++;
        c.words += value;
    });
});

const values = Array.from(data.values()).sort((a, b) => a.name.localeCompare(b.name));

console.log(values.slice(0, 10));

fs.writeFileSync('./data.json', JSON.stringify(values, null, 2));