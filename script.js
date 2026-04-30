let currentRegion = "";
let natureScores = { Hardy: 0, Docile: 0, Brave: 0, Jolly: 0, /* ...all 25 */ };
let masterData = {};

// Load your masterlist.json
fetch('masterlist.json')
    .then(response => response.json())
    .then(data => {
        masterData = data;
        startQuiz();
    });

function rollAnomaly() {
    // 1/500 chance for an Anomaly
    if (Math.random() < (1/500)) {
        const pool = masterData.settings.anomalies.filter(a => a.pools.includes(currentRegion));
        return pool[Math.floor(Math.random() * pool.length)];
    }
    return null;
}

function handleSpaceTimeDistortion(pokemon) {
    // 1/50 for Regional, 1/250 for Paradox
    let roll = Math.random();
    if (pokemon.variant_data.regional && roll < (1/50)) {
        return pokemon.variant_data.regional[Math.floor(Math.random() * pokemon.variant_data.regional.length)];
    }
    if (pokemon.variant_data.paradox && roll < (1/250)) {
        return pokemon.variant_data.paradox[Math.floor(Math.random() * pokemon.variant_data.paradox.length)];
    }
    return pokemon.name;
}

function getFinalResult(finalNature) {
    // Filter by Region and Nature[cite: 1]
    const possible = masterData.pokemon_entries.filter(p => 
        p.region === currentRegion && p.nature === finalNature
    );
    
    let selection = possible[Math.floor(Math.random() * possible.length)];
    let finalForm = handleSpaceTimeDistortion(selection);
    
    // Final check for Shiny (1/500)[cite: 1]
    let isShiny = Math.random() < (1/500);
    
    displayResults(finalForm, isShiny);
}