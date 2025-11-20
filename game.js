// Game Configuration
const CONFIG = {
    canvas: {
        width: 1200,
        height: 600
    },
    baseHealth: 800,
    startGold: 100,
    goldPerSecond: 4,
    goldPerKill: 20,
    groundLevel: 450,
    baseWidth: 100,
    baseHeight: 150,
    difficulty: 'medium' // Default difficulty
};

// Difficulty Settings
const DIFFICULTY_SETTINGS = {
    beginner: {
        name: 'Beginner',
        playerGoldMultiplier: 1.5,
        enemyGoldMultiplier: 0.7,
        aiSpeed: { min: 2000, max: 4000 },
        aiAggressiveness: 0.3,
        enemyUnitSpawnChance: 0.6,
        enemyEvolutionChance: 0.25,
        enemyTurretChance: 0.2
    },
    medium: {
        name: 'Medium',
        playerGoldMultiplier: 1.0,
        enemyGoldMultiplier: 1.0,
        aiSpeed: { min: 800, max: 2000 },
        aiAggressiveness: 0.5,
        enemyUnitSpawnChance: 0.8,
        enemyEvolutionChance: 0.5,
        enemyTurretChance: 0.35
    },
    hard: {
        name: 'Hard',
        playerGoldMultiplier: 0.75,
        enemyGoldMultiplier: 1.3,
        aiSpeed: { min: 500, max: 1500 },
        aiAggressiveness: 0.7,
        enemyUnitSpawnChance: 1.0,
        enemyEvolutionChance: 0.7,
        enemyTurretChance: 0.5
    },
    impossible: {
        name: 'Impossible',
        playerGoldMultiplier: 0.5,
        enemyGoldMultiplier: 1.8,
        aiSpeed: { min: 300, max: 1000 },
        aiAggressiveness: 0.9,
        enemyUnitSpawnChance: 1.2,
        enemyEvolutionChance: 0.85,
        enemyTurretChance: 0.7
    }
};

// Initialize menu before game
window.addEventListener('load', () => {
    initializeMenu();
});

function initializeMenu() {
    const difficultyButtons = document.querySelectorAll('.difficulty-btn');
    
    difficultyButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const difficulty = btn.dataset.difficulty;
            startGame(difficulty);
        });
    });
}

function startGame(difficulty) {
    CONFIG.difficulty = difficulty;
    
    // Hide menu, show game
    document.getElementById('main-menu').classList.add('hidden');
    document.getElementById('game-container').classList.remove('hidden');
    
    // Update difficulty display
    const difficultyDisplay = document.getElementById('difficulty-display');
    difficultyDisplay.textContent = `Difficulty: ${DIFFICULTY_SETTINGS[difficulty].name}`;
    
    // Start the game
    new Game();
}

// Age Definitions
const AGES = [
    {
        name: "Stone Age",
        color: "#8B7355",
        evolveCost: 600,
        units: [
            { name: "Clubman", cost: 15, health: 50, damage: 8, speed: 1.2, range: 30, attackSpeed: 1000, size: 25, color: "#A0522D", type: "melee" },
            { name: "Slinger", cost: 30, health: 35, damage: 12, speed: 1, range: 150, attackSpeed: 1500, size: 25, color: "#8B4513", type: "ranged" },
            { name: "Dinorider", cost: 60, health: 120, damage: 20, speed: 0.8, range: 30, attackSpeed: 1200, size: 35, color: "#6B8E23", type: "heavy" }
        ],
        turrets: [
            { name: "Rock Thrower", cost: 50, damage: 25, range: 200, attackSpeed: 1800, level: 1, upgradeCost: 100, type: "basic" },
            { name: "Spiked Wall", cost: 70, damage: 18, range: 180, attackSpeed: 1200, level: 1, upgradeCost: 120, type: "rapid" },
            { name: "Fire Pit", cost: 90, damage: 40, range: 220, attackSpeed: 2200, level: 1, upgradeCost: 150, type: "heavy" }
        ],
        special: { name: "Rock Rain", cost: 50, damage: 30, cooldown: 30000 }
    },
    {
        name: "Castle Age",
        color: "#696969",
        evolveCost: 1200,
        units: [
            { name: "Swordsman", cost: 25, health: 90, damage: 18, speed: 1.3, range: 30, attackSpeed: 900, size: 28, color: "#4169E1", type: "melee" },
            { name: "Archer", cost: 40, health: 60, damage: 22, speed: 1.1, range: 180, attackSpeed: 1400, size: 28, color: "#228B22", type: "ranged" },
            { name: "Knight", cost: 80, health: 200, damage: 40, speed: 1.5, range: 30, attackSpeed: 1100, size: 38, color: "#FFD700", type: "heavy" }
        ],
        turrets: [
            { name: "Arrow Tower", cost: 80, damage: 45, range: 250, attackSpeed: 1600, level: 1, upgradeCost: 150, type: "basic" },
            { name: "Ballista", cost: 100, damage: 35, range: 230, attackSpeed: 1200, level: 1, upgradeCost: 170, type: "rapid" },
            { name: "Catapult", cost: 130, damage: 65, range: 280, attackSpeed: 2000, level: 1, upgradeCost: 200, type: "heavy" }
        ],
        special: { name: "Arrow Barrage", cost: 75, damage: 50, cooldown: 28000 }
    },
    {
        name: "Renaissance",
        color: "#8B4513",
        evolveCost: 2500,
        units: [
            { name: "Musketeer", cost: 35, health: 80, damage: 30, speed: 1.2, range: 200, attackSpeed: 1600, size: 30, color: "#DC143C", type: "ranged" },
            { name: "Pikeman", cost: 50, health: 120, damage: 28, speed: 1.1, range: 40, attackSpeed: 1000, size: 30, color: "#4682B4", type: "melee" },
            { name: "Cavalry", cost: 100, health: 250, damage: 55, speed: 1.8, range: 30, attackSpeed: 1000, size: 40, color: "#8B0000", type: "heavy" }
        ],
        turrets: [
            { name: "Cannon", cost: 120, damage: 75, range: 280, attackSpeed: 2200, level: 1, upgradeCost: 200, type: "basic" },
            { name: "Musket Tower", cost: 140, damage: 60, range: 260, attackSpeed: 1400, level: 1, upgradeCost: 220, type: "rapid" },
            { name: "Bombard", cost: 170, damage: 100, range: 300, attackSpeed: 2600, level: 1, upgradeCost: 250, type: "heavy" }
        ],
        special: { name: "Cannon Blast", cost: 100, damage: 80, cooldown: 26000 }
    },
    {
        name: "Modern Age",
        color: "#2F4F4F",
        evolveCost: 5000,
        units: [
            { name: "Rifleman", cost: 45, health: 100, damage: 45, speed: 1.4, range: 220, attackSpeed: 1300, size: 32, color: "#556B2F", type: "ranged" },
            { name: "Grenadier", cost: 70, health: 130, damage: 60, speed: 1.0, range: 160, attackSpeed: 1800, size: 32, color: "#8B4513", type: "melee" },
            { name: "Tank", cost: 150, health: 400, damage: 85, speed: 0.9, range: 180, attackSpeed: 1500, size: 50, color: "#2F4F4F", type: "heavy" }
        ],
        turrets: [
            { name: "Machine Gun", cost: 180, damage: 110, range: 300, attackSpeed: 1200, level: 1, upgradeCost: 300, type: "basic" },
            { name: "AA Gun", cost: 200, damage: 90, range: 320, attackSpeed: 900, level: 1, upgradeCost: 320, type: "rapid" },
            { name: "Artillery", cost: 250, damage: 150, range: 350, attackSpeed: 2400, level: 1, upgradeCost: 400, type: "heavy" }
        ],
        special: { name: "Airstrike", cost: 150, damage: 120, cooldown: 24000 }
    },
    {
        name: "Future",
        color: "#191970",
        evolveCost: 0,
        units: [
            { name: "Laser Trooper", cost: 60, health: 120, damage: 65, speed: 1.5, range: 250, attackSpeed: 1100, size: 35, color: "#00CED1", type: "ranged" },
            { name: "Mech", cost: 100, health: 240, damage: 80, speed: 1.2, range: 200, attackSpeed: 1300, size: 45, color: "#4169E1", type: "melee" },
            { name: "Super Mech", cost: 200, health: 600, damage: 130, speed: 1.0, range: 220, attackSpeed: 1400, size: 60, color: "#8A2BE2", type: "heavy" }
        ],
        turrets: [
            { name: "Laser Cannon", cost: 250, damage: 140, range: 350, attackSpeed: 1000, level: 1, upgradeCost: 400, type: "basic" },
            { name: "Plasma Tower", cost: 280, damage: 120, range: 340, attackSpeed: 800, level: 1, upgradeCost: 420, type: "rapid" },
            { name: "Ion Beam", cost: 330, damage: 200, range: 380, attackSpeed: 2000, level: 1, upgradeCost: 500, type: "heavy" }
        ],
        special: { name: "Ion Cannon", cost: 200, damage: 180, cooldown: 22000 }
    }
];

// Game State
class Game {
    constructor() {
        this.canvas = document.getElementById('game-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.setupCanvas();
        
        // Apply difficulty settings
        this.difficulty = DIFFICULTY_SETTINGS[CONFIG.difficulty];
        
        this.player = new Player(true);
        this.enemy = new Player(false);
        
        // Apply difficulty gold multipliers
        this.player.goldPerSecond = CONFIG.goldPerSecond * this.difficulty.playerGoldMultiplier;
        this.enemy.goldPerSecond = CONFIG.goldPerSecond * this.difficulty.enemyGoldMultiplier;
        
        this.units = [];
        this.projectiles = [];
        this.effects = [];
        this.turrets = [];
        
        this.lastUpdate = Date.now();
        this.lastGoldUpdate = Date.now();
        
        this.gameOver = false;
        this.winner = null;
        
        // Background animations
        this.cloudOffset = 0;
        this.backgroundParticles = [];
        this.initBackgroundParticles();
        
        this.setupUI();
        this.setupEventListeners();
        this.gameLoop();
        
        // AI for enemy - adjusted for difficulty
        this.aiLastAction = Date.now();
        this.aiActionInterval = this.difficulty.aiSpeed.min;
        this.aiMinInterval = this.difficulty.aiSpeed.min;
        this.aiMaxInterval = this.difficulty.aiSpeed.max;
        
        console.log(`[Game] Started with difficulty: ${this.difficulty.name}`);
        console.log(`[Game] Player gold rate: ${this.player.goldPerSecond}/s, Enemy: ${this.enemy.goldPerSecond}/s`);
    }
    
    initBackgroundParticles() {
        // Add floating particles for ambiance
        for (let i = 0; i < 20; i++) {
            this.backgroundParticles.push({
                x: Math.random() * CONFIG.canvas.width,
                y: Math.random() * CONFIG.groundLevel,
                size: Math.random() * 2 + 1,
                speed: Math.random() * 10 + 5,
                alpha: Math.random() * 0.3 + 0.1
            });
        }
    }
    
    setupCanvas() {
        this.canvas.width = CONFIG.canvas.width;
        this.canvas.height = CONFIG.canvas.height;
    }
    
    setupUI() {
        this.updateUI();
        this.updateButtons();
    }
    
    setupEventListeners() {
        // Unit buttons
        const unitContainer = document.getElementById('unit-buttons');
        AGES[this.player.ageIndex].units.forEach((unit, index) => {
            const btn = this.createUnitButton(unit, index);
            unitContainer.appendChild(btn);
        });
        
        // Turret buttons
        const turretContainer = document.getElementById('turret-buttons');
        AGES[this.player.ageIndex].turrets.forEach((turret, index) => {
            const btn = this.createTurretButton(turret, index);
            turretContainer.appendChild(btn);
        });
        
        // Special ability
        document.getElementById('special-ability-btn').addEventListener('click', () => {
            this.useSpecialAbility();
        });
        
        // Evolve button
        document.getElementById('evolve-btn').addEventListener('click', () => {
            this.evolve();
        });
        
        // Restart button
        document.getElementById('restart-btn').addEventListener('click', () => {
            location.reload();
        });
        
        // Main menu button
        document.getElementById('menu-btn').addEventListener('click', () => {
            location.reload();
        });
    }
    
    createUnitButton(unit, index) {
        const btn = document.createElement('button');
        btn.className = 'game-btn';
        btn.innerHTML = `
            <span class="btn-name">${unit.name}</span>
            <span class="btn-cost">Gold: ${unit.cost}</span>
            <span class="btn-stats">HP:${unit.health} DMG:${unit.damage}</span>
        `;
        btn.addEventListener('click', () => this.spawnUnit(index, true));
        btn.dataset.unitIndex = index;
        return btn;
    }
    
    createTurretButton(turret, index) {
        const btn = document.createElement('button');
        btn.className = 'game-btn';
        
        // Check if this turret type already exists
        const existingTurret = this.turrets.find(t => t.isPlayer && t.turretIndex === index);
        const label = existingTurret ? `Upgrade (Lv${existingTurret.level})` : 'Build';
        const cost = existingTurret ? turret.upgradeCost : turret.cost;
        
        btn.innerHTML = `
            <span class="btn-name">${turret.name}</span>
            <span class="btn-cost">${label}: ${cost}</span>
            <span class="btn-stats">DMG:${turret.damage} RNG:${turret.range}</span>
        `;
        btn.addEventListener('click', () => this.buildTurret(index, true));
        btn.dataset.turretIndex = index;
        return btn;
    }
    
    spawnUnit(unitIndex, isPlayer) {
        const player = isPlayer ? this.player : this.enemy;
        const age = AGES[player.ageIndex];
        const unitData = age.units[unitIndex];
        
        if (player.gold >= unitData.cost) {
            player.gold -= unitData.cost;
            
            const x = isPlayer ? 120 : CONFIG.canvas.width - 120;
            const unit = new Unit(x, CONFIG.groundLevel, unitData, isPlayer);
            this.units.push(unit);
            
            if (isPlayer) {
                this.updateUI();
            }
        }
    }
    
    buildTurret(turretIndex, isPlayer) {
        const player = isPlayer ? this.player : this.enemy;
        const age = AGES[player.ageIndex];
        const turretData = age.turrets[turretIndex];
        
        // Get all turrets for this player
        const playerTurrets = this.turrets.filter(t => t.isPlayer === isPlayer);
        
        // Check if trying to upgrade existing turret of same type
        const existingTurret = playerTurrets.find(t => t.turretIndex === turretIndex);
        if (existingTurret) {
            // Upgrade existing turret
            if (player.gold >= turretData.upgradeCost && existingTurret.level < 5) {
                player.gold -= turretData.upgradeCost;
                existingTurret.upgrade();
                if (isPlayer) {
                    this.updateUI();
                    console.log(`Upgraded ${turretData.name} to level ${existingTurret.level}`);
                }
                return true;
            }
            if (isPlayer && existingTurret.level >= 5) {
                console.log("Turret is already at max level!");
            }
            return false;
        }
        
        // Check if max turrets reached
        if (playerTurrets.length >= 3) {
            if (isPlayer) {
                console.log("Maximum 3 turrets reached!");
            }
            return false;
        }
        
        // Build new turret
        if (player.gold >= turretData.cost) {
            player.gold -= turretData.cost;
            
            // Position turrets vertically up the tower
            const baseX = isPlayer ? CONFIG.baseWidth / 2 : CONFIG.canvas.width - CONFIG.baseWidth / 2;
            const xOffset = 40; // Close to the tower
            const x = isPlayer ? baseX + xOffset : baseX - xOffset;
            
            // Vertical positioning - stack turrets up the tower
            const yOffsets = [-140, -100, -60]; // Going up the tower
            const y = CONFIG.groundLevel + yOffsets[playerTurrets.length];
            
            const turret = new Turret(x, y, turretData, isPlayer, turretIndex, player.ageIndex);
            this.turrets.push(turret);
            
            if (isPlayer) {
                this.updateUI();
                console.log(`Built ${turretData.name} at position ${playerTurrets.length + 1}`);
            }
            return true;
        }
        return false;
    }
    
    evolveTurrets(isPlayer) {
        // When evolving, upgrade all turrets' base stats
        const playerTurrets = this.turrets.filter(t => t.isPlayer === isPlayer);
        const player = isPlayer ? this.player : this.enemy;
        const newAge = AGES[player.ageIndex];
        
        playerTurrets.forEach(turret => {
            const newTurretData = newAge.turrets[turret.turretIndex];
            turret.evolve(newTurretData, player.ageIndex);
            console.log(`[Evolution] ${newTurretData.name} upgraded with age evolution!`);
        });
    }
    
    useSpecialAbility() {
        const now = Date.now();
        if (now - this.player.lastSpecial < AGES[this.player.ageIndex].special.cooldown) {
            return;
        }
        
        if (this.player.gold >= AGES[this.player.ageIndex].special.cost) {
            this.player.gold -= AGES[this.player.ageIndex].special.cost;
            this.player.lastSpecial = now;
            
            // Create special effect
            const special = AGES[this.player.ageIndex].special;
            const targetX = CONFIG.canvas.width * 0.75;
            
            this.effects.push(new SpecialEffect(targetX, 100, special.damage, false));
            
            // Damage enemy units in area
            this.units.forEach(unit => {
                if (!unit.isPlayer && Math.abs(unit.x - targetX) < 150) {
                    unit.health -= special.damage;
                }
            });
            
            // Damage enemy base if in range
            if (Math.abs(this.enemy.baseX - targetX) < 150) {
                this.enemy.baseHealth -= special.damage * 0.5;
            }
            
            this.updateUI();
        }
    }
    
    evolve() {
        if (this.player.ageIndex >= AGES.length - 1) return;
        
        const evolveCost = AGES[this.player.ageIndex].evolveCost;
        if (this.player.gold >= evolveCost) {
            this.player.gold -= evolveCost;
            this.player.ageIndex++;
            this.player.baseHealth += 500;
            this.player.baseMaxHealth += 500;
            
            // Evolve all player turrets
            this.evolveTurrets(true);
            
            // Update UI buttons
            const unitContainer = document.getElementById('unit-buttons');
            unitContainer.innerHTML = '';
            AGES[this.player.ageIndex].units.forEach((unit, index) => {
                const btn = this.createUnitButton(unit, index);
                unitContainer.appendChild(btn);
            });
            
            const turretContainer = document.getElementById('turret-buttons');
            turretContainer.innerHTML = '';
            AGES[this.player.ageIndex].turrets.forEach((turret, index) => {
                const btn = this.createTurretButton(turret, index);
                turretContainer.appendChild(btn);
            });
            
            // Update special ability button
            const specialBtn = document.getElementById('special-ability-btn');
            specialBtn.querySelector('.btn-name').textContent = AGES[this.player.ageIndex].special.name;
            specialBtn.querySelector('.btn-cost').textContent = `Cost: ${AGES[this.player.ageIndex].special.cost}`;
            
            console.log(`[Player] Evolved to ${AGES[this.player.ageIndex].name}!`);
            this.updateUI();
        }
    }
    
    evolveEnemy() {
        if (this.enemy.ageIndex >= AGES.length - 1) return false;
        
        const evolveCost = AGES[this.enemy.ageIndex].evolveCost;
        console.log(`[AI] Attempting evolution: Current Age ${this.enemy.ageIndex}, Gold: ${Math.floor(this.enemy.gold)}, Cost: ${evolveCost}`);
        
        if (this.enemy.gold >= evolveCost) {
            this.enemy.gold -= evolveCost;
            this.enemy.ageIndex++;
            this.enemy.baseHealth += 500;
            this.enemy.baseMaxHealth += 500;
            
            // Evolve all enemy turrets
            this.evolveTurrets(false);
            
            console.log(`[AI] ✓ Evolved to Age ${this.enemy.ageIndex} (${AGES[this.enemy.ageIndex].name})! Remaining gold: ${Math.floor(this.enemy.gold)}`);
            this.updateUI();
            return true;
        }
        console.log(`[AI] ✗ Cannot afford evolution`);
        return false;
    }
    
    updateAI() {
        const now = Date.now();
        if (now - this.aiLastAction < this.aiActionInterval) return;
        
        // Randomize next action interval based on difficulty
        this.aiActionInterval = this.aiMinInterval + Math.random() * (this.aiMaxInterval - this.aiMinInterval);
        this.aiLastAction = now;
        
        // Get current state
        const enemyAge = AGES[this.enemy.ageIndex];
        const playerUnitsOnField = this.units.filter(u => u.isPlayer).length;
        const enemyUnitsOnField = this.units.filter(u => !u.isPlayer).length;
        const threatLevel = playerUnitsOnField - enemyUnitsOnField;
        const baseHealthPercent = this.enemy.baseHealth / this.enemy.baseMaxHealth;
        const isBaseUnderThreat = baseHealthPercent < 0.8;
        
        const aggressiveness = this.difficulty.aiAggressiveness;
        
        // PRIORITY 1: Aggressive evolution strategy
        if (this.enemy.ageIndex < AGES.length - 1) {
            const evolveCost = AGES[this.enemy.ageIndex].evolveCost;
            const hasEnoughGold = this.enemy.gold >= evolveCost + 200;
            const playerIsAhead = this.player.ageIndex > this.enemy.ageIndex;
            const playerIsSameAge = this.player.ageIndex === this.enemy.ageIndex;
            const hasGoodEconomy = this.enemy.gold >= evolveCost * 1.3;
            
            if (hasEnoughGold && (playerIsAhead || (playerIsSameAge && hasGoodEconomy))) {
                if (Math.random() < this.difficulty.enemyEvolutionChance) {
                    if (this.evolveEnemy()) {
                        return;
                    }
                }
            }
        }
        
        // PRIORITY 2: Emergency defense
        if (baseHealthPercent < 0.4 && threatLevel > 0) {
            if (this.enemy.gold >= enemyAge.units[0].cost) {
                this.spawnUnit(0, false);
                return;
            }
        }
        
        // PRIORITY 3: Turret management
        const enemyTurrets = this.turrets.filter(t => !t.isPlayer);
        if (enemyTurrets.length < 3) {
            for (let i = 0; i < 3; i++) {
                const hasTurretType = enemyTurrets.find(t => t.turretIndex === i);
                if (!hasTurretType && enemyAge.turrets[i]) {
                    const turretData = enemyAge.turrets[i];
                    if (this.enemy.gold >= turretData.cost + 100 && Math.random() < this.difficulty.enemyTurretChance) {
                        if (this.buildTurret(i, false)) {
                            return;
                        }
                    }
                    break;
                }
            }
        } else {
            const upgradeable = enemyTurrets.filter(t => t.level < 5);
            if (upgradeable.length > 0 && Math.random() < (this.difficulty.enemyTurretChance * 0.8)) {
                const turretToUpgrade = upgradeable[Math.floor(Math.random() * upgradeable.length)];
                const turretData = enemyAge.turrets[turretToUpgrade.turretIndex];
                if (this.enemy.gold >= turretData.upgradeCost + 50) {
                    this.buildTurret(turretToUpgrade.turretIndex, false);
                    return;
                }
            }
        }
        
        // PRIORITY 4: Special ability
        const canUseSpecial = now - this.enemy.lastSpecial >= enemyAge.special.cooldown;
        const specialCost = enemyAge.special.cost;
        if (canUseSpecial && this.enemy.gold >= specialCost + 50) {
            if (playerUnitsOnField >= 2 && Math.random() < (aggressiveness * 0.6)) {
                this.enemy.gold -= specialCost;
                this.enemy.lastSpecial = now;
                
                const targetX = CONFIG.canvas.width * 0.3;
                this.effects.push(new SpecialEffect(targetX, 100, enemyAge.special.damage, true));
                
                this.units.forEach(unit => {
                    if (unit.isPlayer && Math.abs(unit.x - targetX) < 150) {
                        unit.health -= enemyAge.special.damage;
                    }
                });
                
                if (Math.abs(this.player.baseX - targetX) < 150) {
                    this.player.baseHealth -= enemyAge.special.damage * 0.5;
                }
                return;
            }
        }
        
        // PRIORITY 5: Unit spawning based on difficulty
        const maxUnits = Math.floor(10 * this.difficulty.enemyUnitSpawnChance);
        if (enemyUnitsOnField >= maxUnits) {
            return;
        }
        
        let unitIndex = -1;
        
        if (threatLevel > 0) {
            if (this.enemy.gold >= enemyAge.units[2].cost && Math.random() < (0.3 * aggressiveness)) {
                unitIndex = 2;
            } else if (this.enemy.gold >= enemyAge.units[1].cost) {
                unitIndex = 1;
            } else if (this.enemy.gold >= enemyAge.units[0].cost) {
                unitIndex = 0;
            }
        } else if (this.enemy.gold >= enemyAge.units[2].cost + 100 && Math.random() < (0.25 * aggressiveness)) {
            unitIndex = 2;
        } else if (this.enemy.gold >= enemyAge.units[1].cost + 50 && Math.random() < (0.5 * aggressiveness)) {
            unitIndex = 1;
        } else if (this.enemy.gold >= enemyAge.units[0].cost) {
            unitIndex = 0;
        }
        
        if (unitIndex >= 0 && this.enemy.gold >= enemyAge.units[unitIndex].cost) {
            this.spawnUnit(unitIndex, false);
        }
    }
    
    update(deltaTime) {
        if (this.gameOver) return;
        
        const dt = deltaTime / 1000;
        
        // Update gold
        const now = Date.now();
        if (now - this.lastGoldUpdate >= 1000) {
            this.player.gold += this.player.goldPerSecond;
            this.enemy.gold += this.enemy.goldPerSecond;
            this.lastGoldUpdate = now;
            this.updateUI();
        }
        
        // Update AI
        this.updateAI();
        
        // Update units
        for (let i = this.units.length - 1; i >= 0; i--) {
            const unit = this.units[i];
            unit.update(dt, this.units, this);
            
            if (unit.health <= 0) {
                // Create death particles
                for (let p = 0; p < 8; p++) {
                    const angle = (p / 8) * Math.PI * 2;
                    const speed = 50 + Math.random() * 50;
                    this.effects.push(new Particle(
                        unit.x, unit.y,
                        Math.cos(angle) * speed,
                        Math.sin(angle) * speed - 50,
                        unit.color,
                        unit.isPlayer
                    ));
                }
                
                // Give gold to killer
                const killer = unit.isPlayer ? this.enemy : this.player;
                killer.gold += CONFIG.goldPerKill;
                this.units.splice(i, 1);
                if (!unit.isPlayer) this.updateUI();
                continue;
            }
            
            // Check base collision
            const targetBase = unit.isPlayer ? this.enemy : this.player;
            if (Math.abs(unit.x - targetBase.baseX) < CONFIG.baseWidth / 2 + unit.size / 2) {
                targetBase.baseHealth -= unit.damage * dt * 0.5;
                this.updateUI();
            }
        }
        
        // Update projectiles
        for (let i = this.projectiles.length - 1; i >= 0; i--) {
            const proj = this.projectiles[i];
            proj.update(dt);
            
            // Check collision with units
            if (!proj.hasHit) {
                for (const unit of this.units) {
                    if (unit.isPlayer !== proj.isPlayer) {
                        const dist = Math.sqrt(
                            (proj.x - unit.x) ** 2 + 
                            (proj.y - unit.y) ** 2
                        );
                        if (dist < unit.size / 2 + 10) {
                            // Hit the unit!
                            unit.health -= proj.damage;
                            proj.hasHit = true;
                            break;
                        }
                    }
                }
            }
            
            if (proj.hasHit || proj.x < 0 || proj.x > CONFIG.canvas.width) {
                this.projectiles.splice(i, 1);
            }
        }
        
        // Update turrets
        this.turrets.forEach(turret => {
            turret.update(dt, this.units, this);
        });
        
        // Update effects
        for (let i = this.effects.length - 1; i >= 0; i--) {
            this.effects[i].update(dt);
            if (this.effects[i].isDone) {
                this.effects.splice(i, 1);
            }
        }
        
        // Check game over
        if (this.player.baseHealth <= 0) {
            this.endGame(false);
        } else if (this.enemy.baseHealth <= 0) {
            this.endGame(true);
        }
        
        this.updateButtons();
    }
    
    updateButtons() {
        const age = AGES[this.player.ageIndex];
        
        // Update unit buttons
        age.units.forEach((unit, index) => {
            const btn = document.querySelector(`button[data-unit-index="${index}"]`);
            if (btn) {
                btn.disabled = this.player.gold < unit.cost;
            }
        });
        
        // Update turret buttons
        age.turrets.forEach((turret, index) => {
            const btn = document.querySelector(`button[data-turret-index="${index}"]`);
            if (btn) {
                const existingTurret = this.turrets.find(t => t.isPlayer && t.turretIndex === index);
                
                if (existingTurret) {
                    // Update to show upgrade option
                    const cost = turret.upgradeCost;
                    const isMaxLevel = existingTurret.level >= 5;
                    btn.querySelector('.btn-cost').textContent = isMaxLevel ? 'Max Level' : `Upgrade (Lv${existingTurret.level}): ${cost}`;
                    btn.disabled = isMaxLevel || this.player.gold < cost;
                } else {
                    // Show build option
                    const playerTurretCount = this.turrets.filter(t => t.isPlayer).length;
                    const canBuild = playerTurretCount < 3;
                    btn.querySelector('.btn-cost').textContent = `Build: ${turret.cost}`;
                    btn.disabled = !canBuild || this.player.gold < turret.cost;
                }
            }
        });
        
        // Update special button
        const specialBtn = document.getElementById('special-ability-btn');
        const specialCooldown = AGES[this.player.ageIndex].special.cooldown;
        const timeSinceSpecial = Date.now() - this.player.lastSpecial;
        
        if (timeSinceSpecial < specialCooldown) {
            const remaining = Math.ceil((specialCooldown - timeSinceSpecial) / 1000);
            specialBtn.querySelector('.btn-cooldown').textContent = remaining + 's';
            specialBtn.disabled = true;
        } else {
            specialBtn.querySelector('.btn-cooldown').textContent = '';
            specialBtn.disabled = this.player.gold < age.special.cost;
        }
        
        // Update evolve button
        const evolveBtn = document.getElementById('evolve-btn');
        if (this.player.ageIndex >= AGES.length - 1) {
            evolveBtn.disabled = true;
            evolveBtn.querySelector('.btn-name').textContent = 'Max Age';
        } else {
            evolveBtn.disabled = this.player.gold < age.evolveCost;
            evolveBtn.querySelector('.btn-cost').textContent = `Cost: ${age.evolveCost}`;
        }
    }
    
    updateUI() {
        document.getElementById('player-age').textContent = AGES[this.player.ageIndex].name;
        document.getElementById('enemy-age').textContent = AGES[this.enemy.ageIndex].name;
        document.getElementById('player-gold').textContent = Math.floor(this.player.gold);
        
        const playerHealthPercent = Math.max(0, (this.player.baseHealth / this.player.baseMaxHealth) * 100);
        const enemyHealthPercent = Math.max(0, (this.enemy.baseHealth / this.enemy.baseMaxHealth) * 100);
        
        document.getElementById('player-health-fill').style.width = playerHealthPercent + '%';
        document.getElementById('enemy-health-fill').style.width = enemyHealthPercent + '%';
        
        document.getElementById('player-health-text').textContent = 
            `${Math.floor(Math.max(0, this.player.baseHealth))}/${this.player.baseMaxHealth}`;
        document.getElementById('enemy-health-text').textContent = 
            `${Math.floor(Math.max(0, this.enemy.baseHealth))}/${this.enemy.baseMaxHealth}`;
    }
    
    endGame(playerWon) {
        this.gameOver = true;
        this.winner = playerWon;
        
        const gameOverScreen = document.getElementById('game-over-screen');
        const title = document.getElementById('game-over-title');
        const message = document.getElementById('game-over-message');
        
        if (playerWon) {
            title.textContent = 'Victory!';
            message.textContent = 'You have conquered the ages and defeated your enemy!';
            title.style.color = '#FFB800';
        } else {
            title.textContent = 'Defeat!';
            message.textContent = 'Your civilization has fallen. Try again!';
            title.style.color = '#f44336';
        }
        
        gameOverScreen.classList.remove('hidden');
    }
    
    render() {
        // Sky with gradient
        const skyGradient = this.ctx.createLinearGradient(0, 0, 0, CONFIG.groundLevel);
        skyGradient.addColorStop(0, '#87CEEB');
        skyGradient.addColorStop(0.7, '#B0E0E6');
        skyGradient.addColorStop(1, '#DEB887');
        this.ctx.fillStyle = skyGradient;
        this.ctx.fillRect(0, 0, CONFIG.canvas.width, CONFIG.groundLevel);
        
        // Animated clouds
        this.cloudOffset += 0.2;
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
        this.drawCloud(200 + this.cloudOffset % 1400 - 200, 80, 60);
        this.drawCloud(500 + this.cloudOffset % 1400 - 200, 120, 80);
        this.drawCloud(800 + this.cloudOffset % 1400 - 200, 60, 70);
        this.drawCloud(1000 + this.cloudOffset % 1400 - 200, 100, 90);
        
        // Background particles (dust, birds, etc.)
        this.backgroundParticles.forEach(particle => {
            particle.x -= particle.speed * 0.016;
            if (particle.x < -10) particle.x = CONFIG.canvas.width + 10;
            
            this.ctx.globalAlpha = particle.alpha;
            this.ctx.fillStyle = '#FFF';
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            this.ctx.fill();
        });
        this.ctx.globalAlpha = 1;
        
        // Ground layers
        const groundGradient = this.ctx.createLinearGradient(0, CONFIG.groundLevel, 0, CONFIG.canvas.height);
        groundGradient.addColorStop(0, '#8B7355');
        groundGradient.addColorStop(0.3, '#654321');
        groundGradient.addColorStop(1, '#3E2723');
        this.ctx.fillStyle = groundGradient;
        this.ctx.fillRect(0, CONFIG.groundLevel, CONFIG.canvas.width, CONFIG.canvas.height - CONFIG.groundLevel);
        
        // Grass with texture
        this.ctx.fillStyle = '#7CB342';
        this.ctx.fillRect(0, CONFIG.groundLevel, CONFIG.canvas.width, 15);
        this.ctx.fillStyle = 'rgba(76, 175, 80, 0.5)';
        for (let i = 0; i < CONFIG.canvas.width; i += 20) {
            this.ctx.fillRect(i, CONFIG.groundLevel, 2, 10);
            this.ctx.fillRect(i + 10, CONFIG.groundLevel, 2, 8);
        }
        
        // Draw bases with shadows
        this.ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
        this.ctx.shadowBlur = 15;
        this.ctx.shadowOffsetX = 5;
        this.ctx.shadowOffsetY = 5;
        this.player.render(this.ctx);
        this.enemy.render(this.ctx);
        this.ctx.shadowColor = 'transparent';
        this.ctx.shadowBlur = 0;
        this.ctx.shadowOffsetX = 0;
        this.ctx.shadowOffsetY = 0;
        
        // Draw turrets with shadows
        this.ctx.shadowColor = 'rgba(0, 0, 0, 0.4)';
        this.ctx.shadowBlur = 10;
        this.ctx.shadowOffsetX = 3;
        this.ctx.shadowOffsetY = 3;
        this.turrets.forEach(turret => turret.render(this.ctx));
        this.ctx.shadowColor = 'transparent';
        this.ctx.shadowBlur = 0;
        this.ctx.shadowOffsetX = 0;
        this.ctx.shadowOffsetY = 0;
        
        // Draw units with shadows
        this.ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
        this.ctx.shadowBlur = 8;
        this.ctx.shadowOffsetX = 2;
        this.ctx.shadowOffsetY = 2;
        this.units.forEach(unit => unit.render(this.ctx));
        this.ctx.shadowColor = 'transparent';
        this.ctx.shadowBlur = 0;
        this.ctx.shadowOffsetX = 0;
        this.ctx.shadowOffsetY = 0;
        
        // Draw projectiles with glow
        this.projectiles.forEach(proj => proj.render(this.ctx));
        
        // Draw effects
        this.effects.forEach(effect => effect.render(this.ctx));
    }
    
    drawCloud(x, y, size) {
        this.ctx.beginPath();
        this.ctx.arc(x, y, size * 0.5, 0, Math.PI * 2);
        this.ctx.arc(x + size * 0.4, y, size * 0.4, 0, Math.PI * 2);
        this.ctx.arc(x + size * 0.7, y, size * 0.5, 0, Math.PI * 2);
        this.ctx.arc(x + size * 0.35, y - size * 0.3, size * 0.4, 0, Math.PI * 2);
        this.ctx.fill();
    }
    
    gameLoop() {
        const now = Date.now();
        const deltaTime = now - this.lastUpdate;
        this.lastUpdate = now;
        
        this.update(deltaTime);
        this.render();
        
        requestAnimationFrame(() => this.gameLoop());
    }
}

class Player {
    constructor(isPlayer) {
        this.isPlayer = isPlayer;
        this.gold = CONFIG.startGold;
        this.goldPerSecond = CONFIG.goldPerSecond;
        this.baseHealth = CONFIG.baseHealth;
        this.baseMaxHealth = CONFIG.baseHealth;
        this.ageIndex = 0;
        this.lastSpecial = 0;
        
        this.baseX = isPlayer ? CONFIG.baseWidth / 2 : CONFIG.canvas.width - CONFIG.baseWidth / 2;
        this.baseY = CONFIG.groundLevel;
    }
    
    render(ctx) {
        const x = this.baseX - CONFIG.baseWidth / 2;
        const y = this.baseY - CONFIG.baseHeight;
        
        const age = AGES[this.ageIndex];
        
        // Base shadow
        ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
        ctx.fillRect(x - 5, this.baseY, CONFIG.baseWidth + 10, 10);
        
        // Main structure with gradient
        const baseGradient = ctx.createLinearGradient(x, y, x + CONFIG.baseWidth, y);
        if (this.isPlayer) {
            baseGradient.addColorStop(0, '#2E5090');
            baseGradient.addColorStop(0.5, '#4169E1');
            baseGradient.addColorStop(1, '#2E5090');
        } else {
            baseGradient.addColorStop(0, '#8B0000');
            baseGradient.addColorStop(0.5, '#DC143C');
            baseGradient.addColorStop(1, '#8B0000');
        }
        ctx.fillStyle = baseGradient;
        ctx.fillRect(x, y, CONFIG.baseWidth, CONFIG.baseHeight);
        
        // Stone texture
        ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
        for (let i = 0; i < 5; i++) {
            ctx.fillRect(x, y + i * 30, CONFIG.baseWidth, 2);
        }
        for (let i = 0; i < 3; i++) {
            ctx.fillRect(x + i * 33, y, 2, CONFIG.baseHeight);
        }
        
        // Windows
        ctx.fillStyle = this.isPlayer ? '#FFD700' : '#FF6347';
        const windowSize = 15;
        ctx.fillRect(x + 15, y + 20, windowSize, windowSize);
        ctx.fillRect(x + 70, y + 20, windowSize, windowSize);
        ctx.fillRect(x + 15, y + 60, windowSize, windowSize);
        ctx.fillRect(x + 70, y + 60, windowSize, windowSize);
        ctx.fillRect(x + 15, y + 100, windowSize, windowSize);
        ctx.fillRect(x + 70, y + 100, windowSize, windowSize);
        
        // Door
        ctx.fillStyle = '#654321';
        ctx.fillRect(x + 35, y + 120, 30, 30);
        ctx.strokeStyle = '#3E2723';
        ctx.lineWidth = 2;
        ctx.strokeRect(x + 35, y + 120, 30, 30);
        
        // Battlements
        ctx.fillStyle = this.isPlayer ? '#1E4080' : '#660000';
        for (let i = 0; i < 6; i++) {
            ctx.fillRect(x + i * 20, y - 10, 15, 10);
        }
        
        // Tower on top
        ctx.fillStyle = this.isPlayer ? '#1E4080' : '#660000';
        ctx.fillRect(x + CONFIG.baseWidth / 2 - 15, y - 50, 30, 40);
        
        // Tower roof
        ctx.beginPath();
        ctx.moveTo(x + CONFIG.baseWidth / 2 - 20, y - 50);
        ctx.lineTo(x + CONFIG.baseWidth / 2, y - 70);
        ctx.lineTo(x + CONFIG.baseWidth / 2 + 20, y - 50);
        ctx.closePath();
        ctx.fillStyle = this.isPlayer ? '#FFB800' : '#FF4500';
        ctx.fill();
        
        // Flag
        ctx.strokeStyle = '#8B7355';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(x + CONFIG.baseWidth / 2, y - 70);
        ctx.lineTo(x + CONFIG.baseWidth / 2, y - 110);
        ctx.stroke();
        
        // Flag cloth
        ctx.fillStyle = this.isPlayer ? '#FFB800' : '#FF4500';
        ctx.beginPath();
        ctx.moveTo(x + CONFIG.baseWidth / 2, y - 110);
        ctx.lineTo(x + CONFIG.baseWidth / 2 + 35, y - 100);
        ctx.quadraticCurveTo(x + CONFIG.baseWidth / 2 + 30, y - 95, x + CONFIG.baseWidth / 2 + 35, y - 90);
        ctx.lineTo(x + CONFIG.baseWidth / 2, y - 80);
        ctx.closePath();
        ctx.fill();
        
        // Age emblem on flag
        ctx.fillStyle = '#000';
        ctx.font = 'bold 12px Arial';
        ctx.fillText(this.ageIndex + 1, x + CONFIG.baseWidth / 2 + 15, y - 92);
        
        // Health bar background
        const healthBarWidth = CONFIG.baseWidth + 20;
        const healthBarHeight = 12;
        const healthPercent = this.baseHealth / this.baseMaxHealth;
        
        ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
        ctx.fillRect(x - 10, y - 25, healthBarWidth, healthBarHeight);
        
        // Health gradient
        const healthGradient = ctx.createLinearGradient(x - 10, y - 25, x - 10 + healthBarWidth * healthPercent, y - 25);
        if (this.isPlayer) {
            healthGradient.addColorStop(0, '#4CAF50');
            healthGradient.addColorStop(1, '#8BC34A');
        } else {
            healthGradient.addColorStop(0, '#f44336');
            healthGradient.addColorStop(1, '#FF6B6B');
        }
        ctx.fillStyle = healthGradient;
        ctx.fillRect(x - 10, y - 25, healthBarWidth * healthPercent, healthBarHeight);
        
        // Health bar border
        ctx.strokeStyle = '#FFB800';
        ctx.lineWidth = 2;
        ctx.strokeRect(x - 10, y - 25, healthBarWidth, healthBarHeight);
        
        // Health text
        ctx.fillStyle = '#FFF';
        ctx.font = 'bold 10px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(`${Math.floor(this.baseHealth)}`, x + CONFIG.baseWidth / 2, y - 16);
        ctx.textAlign = 'left';
    }
}

class Unit {
    constructor(x, y, data, isPlayer) {
        this.x = x;
        this.y = y - data.size / 2;
        this.health = data.health;
        this.maxHealth = data.health;
        this.damage = data.damage;
        this.speed = data.speed;
        this.range = data.range;
        this.attackSpeed = data.attackSpeed;
        this.size = data.size;
        this.color = data.color;
        this.isPlayer = isPlayer;
        this.isRanged = data.range > 50;
        this.unitType = data.type; // melee, ranged, heavy
        
        this.target = null;
        this.lastAttack = 0;
        this.direction = isPlayer ? 1 : -1;
        
        // Animation properties
        this.animationFrame = 0;
        this.animationSpeed = 0.15;
        this.walkCycle = 0;
        this.attackFrame = 0;
        this.isAttacking = false;
    }
    
    update(dt, units, game) {
        // Update animation
        this.walkCycle += dt * this.speed * 3;
        
        // Find target
        this.target = null;
        let minDist = this.range;
        
        for (const unit of units) {
            if (unit.isPlayer !== this.isPlayer) {
                const dist = Math.abs(this.x - unit.x);
                if (dist < minDist) {
                    minDist = dist;
                    this.target = unit;
                }
            }
        }
        
        // Move or attack
        if (this.target && minDist < this.range) {
            // Attack
            this.isAttacking = true;
            const now = Date.now();
            if (now - this.lastAttack >= this.attackSpeed) {
                this.lastAttack = now;
                this.attackFrame = 0;
                
                if (this.isRanged) {
                    // Create projectile
                    game.projectiles.push(new Projectile(
                        this.x, this.y, this.target.x, this.target.y,
                        this.damage, this.isPlayer
                    ));
                } else {
                    // Melee attack
                    this.target.health -= this.damage;
                }
            }
            this.attackFrame += dt * 10;
        } else {
            // Move
            this.isAttacking = false;
            this.x += this.speed * this.direction * dt * 60;
        }
    }
    
    render(ctx) {
        ctx.save();
        
        // Shadow
        ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
        ctx.beginPath();
        ctx.ellipse(this.x, CONFIG.groundLevel, this.size / 2, this.size / 4, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // Walking animation bobbing
        const bobOffset = this.isAttacking ? 0 : Math.sin(this.walkCycle) * 3;
        const renderY = this.y + bobOffset;
        
        // Render based on unit type
        if (this.unitType === 'heavy') {
            this.renderHeavyUnit(ctx, renderY);
        } else if (this.unitType === 'ranged') {
            this.renderRangedUnit(ctx, renderY);
        } else {
            this.renderMeleeUnit(ctx, renderY);
        }
        
        ctx.restore();
        
        // Health bar with border
        const healthBarWidth = this.size;
        const healthBarHeight = 5;
        const healthPercent = this.health / this.maxHealth;
        const barY = renderY - this.size / 2 - 10;
        
        ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
        ctx.fillRect(this.x - healthBarWidth / 2, barY, healthBarWidth, healthBarHeight);
        
        const healthGradient = ctx.createLinearGradient(
            this.x - healthBarWidth / 2, barY,
            this.x - healthBarWidth / 2 + healthBarWidth * healthPercent, barY
        );
        if (this.isPlayer) {
            healthGradient.addColorStop(0, '#4CAF50');
            healthGradient.addColorStop(1, '#8BC34A');
        } else {
            healthGradient.addColorStop(0, '#f44336');
            healthGradient.addColorStop(1, '#FF6B6B');
        }
        ctx.fillStyle = healthGradient;
        ctx.fillRect(this.x - healthBarWidth / 2, barY, healthBarWidth * healthPercent, healthBarHeight);
        
        ctx.strokeStyle = 'rgba(255, 184, 0, 0.8)';
        ctx.lineWidth = 1;
        ctx.strokeRect(this.x - healthBarWidth / 2, barY, healthBarWidth, healthBarHeight);
    }
    
    renderMeleeUnit(ctx, y) {
        // Legs (animated)
        const legOffset = Math.sin(this.walkCycle) * 5;
        ctx.strokeStyle = this.darkenColor(this.color, 20);
        ctx.lineWidth = 4;
        ctx.lineCap = 'round';
        
        // Left leg
        ctx.beginPath();
        ctx.moveTo(this.x - 3, y + this.size / 4);
        ctx.lineTo(this.x - 3 + legOffset, y + this.size / 2 + 5);
        ctx.stroke();
        
        // Right leg
        ctx.beginPath();
        ctx.moveTo(this.x + 3, y + this.size / 4);
        ctx.lineTo(this.x + 3 - legOffset, y + this.size / 2 + 5);
        ctx.stroke();
        
        // Body with gradient
        const bodyGradient = ctx.createRadialGradient(
            this.x - this.size / 6, y - this.size / 6,
            0,
            this.x, y,
            this.size / 2
        );
        bodyGradient.addColorStop(0, this.lightenColor(this.color, 40));
        bodyGradient.addColorStop(1, this.color);
        ctx.fillStyle = bodyGradient;
        ctx.beginPath();
        ctx.arc(this.x, y, this.size / 2.5, 0, Math.PI * 2);
        ctx.fill();
        
        // Border
        ctx.strokeStyle = this.darkenColor(this.color, 30);
        ctx.lineWidth = 2;
        ctx.stroke();
        
        // Arms (animated during attack)
        const armAngle = this.isAttacking ? Math.sin(this.attackFrame) * 0.5 : 0;
        ctx.strokeStyle = this.color;
        ctx.lineWidth = 3;
        
        // Sword arm
        ctx.save();
        ctx.translate(this.x, y);
        ctx.rotate(armAngle);
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(this.size / 2 * this.direction, -this.size / 4);
        ctx.stroke();
        
        // Sword
        ctx.strokeStyle = '#C0C0C0';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(this.size / 2 * this.direction, -this.size / 4);
        ctx.lineTo((this.size / 2 + 15) * this.direction, -this.size / 4 - 10);
        ctx.stroke();
        
        // Sword handle
        ctx.strokeStyle = '#654321';
        ctx.lineWidth = 5;
        ctx.beginPath();
        ctx.moveTo(this.size / 2 * this.direction, -this.size / 4);
        ctx.lineTo((this.size / 2 + 5) * this.direction, -this.size / 4);
        ctx.stroke();
        ctx.restore();
        
        // Shield arm
        ctx.beginPath();
        ctx.moveTo(this.x, y);
        ctx.lineTo(this.x - this.size / 3 * this.direction, y - this.size / 5);
        ctx.stroke();
        
        // Shield
        ctx.fillStyle = this.isPlayer ? '#4169E1' : '#DC143C';
        ctx.beginPath();
        ctx.arc(this.x - this.size / 3 * this.direction, y - this.size / 5, 8, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#FFB800';
        ctx.lineWidth = 2;
        ctx.stroke();
        
        // Helmet/Head
        ctx.fillStyle = this.isPlayer ? '#4169E1' : '#DC143C';
        ctx.beginPath();
        ctx.arc(this.x, y - this.size / 3, this.size / 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = this.darkenColor(ctx.fillStyle, 20);
        ctx.lineWidth = 1;
        ctx.stroke();
        
        // Helmet decoration
        ctx.fillStyle = '#FFB800';
        ctx.fillRect(this.x - this.size / 6, y - this.size / 3 - 5, this.size / 3, 3);
        
        // Eyes
        ctx.fillStyle = '#FFF';
        ctx.beginPath();
        ctx.arc(this.x + 3 * this.direction, y - this.size / 3, 2, 0, Math.PI * 2);
        ctx.fill();
        
        // Team indicator glow
        ctx.shadowColor = this.isPlayer ? '#FFB800' : '#FF4500';
        ctx.shadowBlur = 10;
        ctx.fillStyle = this.isPlayer ? '#FFB800' : '#FF4500';
        ctx.beginPath();
        ctx.arc(this.x, y - this.size / 2 - 5, 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
    }
    
    renderRangedUnit(ctx, y) {
        // Legs (animated)
        const legOffset = Math.sin(this.walkCycle) * 4;
        ctx.strokeStyle = this.darkenColor(this.color, 20);
        ctx.lineWidth = 3;
        ctx.lineCap = 'round';
        
        ctx.beginPath();
        ctx.moveTo(this.x - 2, y + this.size / 4);
        ctx.lineTo(this.x - 2 + legOffset, y + this.size / 2 + 5);
        ctx.stroke();
        
        ctx.beginPath();
        ctx.moveTo(this.x + 2, y + this.size / 4);
        ctx.lineTo(this.x + 2 - legOffset, y + this.size / 2 + 5);
        ctx.stroke();
        
        // Body
        const bodyGradient = ctx.createRadialGradient(
            this.x - this.size / 6, y - this.size / 6,
            0,
            this.x, y,
            this.size / 2.5
        );
        bodyGradient.addColorStop(0, this.lightenColor(this.color, 40));
        bodyGradient.addColorStop(1, this.color);
        ctx.fillStyle = bodyGradient;
        ctx.beginPath();
        ctx.arc(this.x, y, this.size / 2.8, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.strokeStyle = this.darkenColor(this.color, 30);
        ctx.lineWidth = 2;
        ctx.stroke();
        
        // Bow/Gun arm
        const aimAngle = this.isAttacking ? -0.3 : 0;
        ctx.save();
        ctx.translate(this.x, y);
        ctx.rotate(aimAngle);
        
        // Arm
        ctx.strokeStyle = this.color;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(this.size / 2 * this.direction, 0);
        ctx.stroke();
        
        // Weapon
        ctx.strokeStyle = '#654321';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(this.size / 2 * this.direction, -5);
        ctx.lineTo((this.size / 2 + 12) * this.direction, 0);
        ctx.lineTo(this.size / 2 * this.direction, 5);
        ctx.stroke();
        
        ctx.restore();
        
        // Quiver/Ammo pack
        ctx.fillStyle = '#8B4513';
        ctx.fillRect(this.x - 4, y + this.size / 5, 8, 10);
        ctx.strokeStyle = '#654321';
        ctx.lineWidth = 1;
        ctx.strokeRect(this.x - 4, y + this.size / 5, 8, 10);
        
        // Head
        ctx.fillStyle = this.isPlayer ? '#228B22' : '#8B0000';
        ctx.beginPath();
        ctx.arc(this.x, y - this.size / 3.5, this.size / 5, 0, Math.PI * 2);
        ctx.fill();
        
        // Hood/Hat
        ctx.beginPath();
        ctx.moveTo(this.x - this.size / 4, y - this.size / 3.5);
        ctx.lineTo(this.x, y - this.size / 2.5);
        ctx.lineTo(this.x + this.size / 4, y - this.size / 3.5);
        ctx.closePath();
        ctx.fill();
        
        // Eyes
        ctx.fillStyle = '#FFF';
        ctx.beginPath();
        ctx.arc(this.x + 2 * this.direction, y - this.size / 3.5, 2, 0, Math.PI * 2);
        ctx.fill();
        
        // Team indicator
        ctx.shadowColor = this.isPlayer ? '#FFB800' : '#FF4500';
        ctx.shadowBlur = 8;
        ctx.fillStyle = this.isPlayer ? '#FFB800' : '#FF4500';
        ctx.beginPath();
        ctx.arc(this.x, y - this.size / 2 - 3, 2.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
    }
    
    renderHeavyUnit(ctx, y) {
        // Tracks/Feet (for tanks/mechs)
        ctx.fillStyle = '#333';
        ctx.fillRect(this.x - this.size / 2.5, y + this.size / 3, this.size / 1.3, 8);
        ctx.strokeStyle = '#555';
        ctx.lineWidth = 2;
        ctx.strokeRect(this.x - this.size / 2.5, y + this.size / 3, this.size / 1.3, 8);
        
        // Track wheels
        for (let i = 0; i < 3; i++) {
            const wheelX = this.x - this.size / 3 + i * this.size / 4;
            ctx.fillStyle = '#222';
            ctx.beginPath();
            ctx.arc(wheelX, y + this.size / 3 + 4, 4, 0, Math.PI * 2);
            ctx.fill();
        }
        
        // Main body
        const bodyGradient = ctx.createLinearGradient(
            this.x - this.size / 2, y,
            this.x + this.size / 2, y
        );
        bodyGradient.addColorStop(0, this.darkenColor(this.color, 20));
        bodyGradient.addColorStop(0.5, this.color);
        bodyGradient.addColorStop(1, this.darkenColor(this.color, 20));
        ctx.fillStyle = bodyGradient;
        
        // Body shape
        ctx.beginPath();
        ctx.roundRect(this.x - this.size / 2.2, y - this.size / 6, this.size / 1.1, this.size / 2.5, 5);
        ctx.fill();
        
        ctx.strokeStyle = this.darkenColor(this.color, 40);
        ctx.lineWidth = 2;
        ctx.stroke();
        
        // Armor plating
        ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
        ctx.fillRect(this.x - this.size / 2.5, y - this.size / 8, this.size / 1.2, 2);
        ctx.fillRect(this.x - this.size / 2.5, y, this.size / 1.2, 2);
        
        // Turret/Head
        ctx.fillStyle = this.lightenColor(this.color, 20);
        ctx.beginPath();
        ctx.arc(this.x, y - this.size / 4, this.size / 3.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = this.darkenColor(this.color, 30);
        ctx.lineWidth = 2;
        ctx.stroke();
        
        // Cannon/Weapon
        const weaponAngle = this.isAttacking ? Math.sin(this.attackFrame * 2) * 0.1 : 0;
        ctx.save();
        ctx.translate(this.x, y - this.size / 4);
        ctx.rotate(weaponAngle);
        
        ctx.fillStyle = this.darkenColor(this.color, 40);
        ctx.fillRect(0, -4, this.size / 2 * this.direction, 8);
        
        // Barrel tip
        ctx.fillStyle = '#222';
        ctx.fillRect(this.size / 2 * this.direction - 3, -3, 5, 6);
        
        ctx.restore();
        
        // Details/Lights
        ctx.fillStyle = this.isPlayer ? '#4CAF50' : '#f44336';
        ctx.beginPath();
        ctx.arc(this.x - this.size / 3, y - this.size / 5, 3, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.beginPath();
        ctx.arc(this.x + this.size / 3, y - this.size / 5, 3, 0, Math.PI * 2);
        ctx.fill();
        
        // Team indicator
        ctx.shadowColor = this.isPlayer ? '#FFB800' : '#FF4500';
        ctx.shadowBlur = 12;
        ctx.fillStyle = this.isPlayer ? '#FFB800' : '#FF4500';
        ctx.beginPath();
        ctx.arc(this.x, y - this.size / 1.8, 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
    }
    
    lightenColor(color, percent) {
        const num = parseInt(color.replace("#",""), 16);
        const amt = Math.round(2.55 * percent);
        const R = (num >> 16) + amt;
        const G = (num >> 8 & 0x00FF) + amt;
        const B = (num & 0x0000FF) + amt;
        return "#" + (0x1000000 + (R<255?R<1?0:R:255)*0x10000 +
            (G<255?G<1?0:G:255)*0x100 +
            (B<255?B<1?0:B:255)).toString(16).slice(1);
    }
    
    darkenColor(color, percent) {
        const num = parseInt(color.replace("#",""), 16);
        const amt = Math.round(2.55 * percent);
        const R = (num >> 16) - amt;
        const G = (num >> 8 & 0x00FF) - amt;
        const B = (num & 0x0000FF) - amt;
        return "#" + (0x1000000 + (R>0?R:0)*0x10000 +
            (G>0?G:0)*0x100 +
            (B>0?B:0)).toString(16).slice(1);
    }
}

class Projectile {
    constructor(x, y, targetX, targetY, damage, isPlayer) {
        this.x = x;
        this.y = y;
        this.targetX = targetX;
        this.targetY = targetY;
        this.damage = damage;
        this.isPlayer = isPlayer;
        this.speed = 400;
        this.hasHit = false;
        this.isTurretShot = false;
        
        const dx = targetX - x;
        const dy = targetY - y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        this.vx = (dx / dist) * this.speed;
        this.vy = (dy / dist) * this.speed;
        
        this.lifeTime = 0;
        this.maxLifeTime = 5; // Max 5 seconds
    }
    
    update(dt) {
        if (this.hasHit) return;
        
        this.lifeTime += dt;
        if (this.lifeTime > this.maxLifeTime) {
            this.hasHit = true;
            return;
        }
        
        this.x += this.vx * dt;
        this.y += this.vy * dt;
        
        // Check if reached target area
        const dist = Math.sqrt(
            (this.x - this.targetX) ** 2 + 
            (this.y - this.targetY) ** 2
        );
        
        if (dist < 15) {
            this.hasHit = true;
        }
    }
    
    render(ctx) {
        ctx.save();
        
        // Larger glow for turret shots
        const glowSize = this.isTurretShot ? 20 : 15;
        ctx.shadowColor = this.isPlayer ? '#FFB800' : '#FF4500';
        ctx.shadowBlur = glowSize;
        
        // Trail effect
        const trailLength = this.isTurretShot ? 7 : 5;
        for (let i = 0; i < trailLength; i++) {
            const alpha = (trailLength - i) / trailLength * 0.5;
            const size = (this.isTurretShot ? 8 : 6) - i;
            const offsetX = -this.vx * 0.01 * i;
            const offsetY = -this.vy * 0.01 * i;
            
            ctx.globalAlpha = alpha;
            ctx.fillStyle = this.isPlayer ? '#FFD700' : '#FF6347';
            ctx.beginPath();
            ctx.arc(this.x + offsetX, this.y + offsetY, size, 0, Math.PI * 2);
            ctx.fill();
        }
        
        // Main projectile (larger for turrets)
        ctx.globalAlpha = 1;
        const projectileSize = this.isTurretShot ? 8 : 6;
        const projectileGradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, projectileSize);
        if (this.isPlayer) {
            projectileGradient.addColorStop(0, '#FFF');
            projectileGradient.addColorStop(0.5, '#FFD700');
            projectileGradient.addColorStop(1, '#FFB800');
        } else {
            projectileGradient.addColorStop(0, '#FFF');
            projectileGradient.addColorStop(0.5, '#FF6347');
            projectileGradient.addColorStop(1, '#FF4500');
        }
        ctx.fillStyle = projectileGradient;
        ctx.beginPath();
        ctx.arc(this.x, this.y, projectileSize, 0, Math.PI * 2);
        ctx.fill();
        
        // Outer glow ring
        ctx.strokeStyle = this.isPlayer ? 'rgba(255, 215, 0, 0.3)' : 'rgba(255, 69, 0, 0.3)';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(this.x, this.y, projectileSize + 4, 0, Math.PI * 2);
        ctx.stroke();
        
        ctx.restore();
    }
}

class Turret {
    constructor(x, y, data, isPlayer, turretIndex, ageIndex) {
        this.x = x;
        this.y = y;
        this.baseDamage = data.damage;
        this.damage = data.damage;
        this.baseRange = data.range;
        this.range = data.range;
        this.baseAttackSpeed = data.attackSpeed;
        this.attackSpeed = data.attackSpeed;
        this.isPlayer = isPlayer;
        this.level = 1;
        this.lastAttack = 0;
        this.targetAngle = isPlayer ? 0 : Math.PI;
        this.turretIndex = turretIndex;
        this.turretType = data.type; // basic, rapid, heavy
        this.ageIndex = ageIndex;
    }
    
    upgrade() {
        this.level++;
        // Each level provides significant boost
        this.damage = this.baseDamage * (1 + (this.level - 1) * 0.5); // +50% per level
        this.range = this.baseRange * (1 + (this.level - 1) * 0.15); // +15% range per level
        this.attackSpeed = this.baseAttackSpeed * (1 - (this.level - 1) * 0.1); // 10% faster per level
        console.log(`Turret upgraded to Lv${this.level}: DMG=${Math.floor(this.damage)}, RNG=${Math.floor(this.range)}`);
    }
    
    evolve(newData, newAgeIndex) {
        // When age evolves, update base stats and recalculate with current level
        this.ageIndex = newAgeIndex;
        this.baseDamage = newData.damage;
        this.baseRange = newData.range;
        this.baseAttackSpeed = newData.attackSpeed;
        
        // Recalculate stats with current level
        this.damage = this.baseDamage * (1 + (this.level - 1) * 0.5);
        this.range = this.baseRange * (1 + (this.level - 1) * 0.15);
        this.attackSpeed = this.baseAttackSpeed * (1 - (this.level - 1) * 0.1);
        
        console.log(`Turret evolved: Base DMG=${this.baseDamage}, Current DMG=${Math.floor(this.damage)} at Lv${this.level}`);
    }
    
    update(dt, units, game) {
        const now = Date.now();
        if (now - this.lastAttack < this.attackSpeed) return;
        
        // Find target
        let target = null;
        let minDist = this.range;
        
        for (const unit of units) {
            if (unit.isPlayer !== this.isPlayer) {
                const dist = Math.sqrt(
                    (this.x - unit.x) ** 2 + 
                    (this.y - unit.y) ** 2
                );
                if (dist < minDist) {
                    minDist = dist;
                    target = unit;
                }
            }
        }
        
        if (target) {
            this.lastAttack = now;
            this.targetAngle = Math.atan2(target.y - this.y, target.x - this.x);
            
            // Create projectile with turret's current damage
            const proj = new Projectile(
                this.x + Math.cos(this.targetAngle) * 20,
                this.y + Math.sin(this.targetAngle) * 20,
                target.x, target.y,
                this.damage,
                this.isPlayer
            );
            proj.isTurretShot = true; // Mark as turret projectile
            game.projectiles.push(proj);
        }
    }
    
    render(ctx) {
        ctx.save();
        
        // Platform shadow
        ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
        ctx.beginPath();
        ctx.ellipse(this.x, this.y + 45, 30, 10, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // Platform/Base
        const platformGradient = ctx.createLinearGradient(this.x - 25, this.y + 30, this.x + 25, this.y + 30);
        platformGradient.addColorStop(0, '#555');
        platformGradient.addColorStop(0.5, '#777');
        platformGradient.addColorStop(1, '#555');
        ctx.fillStyle = platformGradient;
        ctx.fillRect(this.x - 25, this.y + 30, 50, 15);
        
        // Platform top
        ctx.fillStyle = '#666';
        ctx.fillRect(this.x - 28, this.y + 28, 56, 4);
        
        // Turret base structure with 3D effect
        const baseGradient = ctx.createLinearGradient(this.x - 20, this.y, this.x + 20, this.y);
        if (this.isPlayer) {
            baseGradient.addColorStop(0, '#1E3A5F');
            baseGradient.addColorStop(0.5, '#2F4F4F');
            baseGradient.addColorStop(1, '#1E3A5F');
        } else {
            baseGradient.addColorStop(0, '#660000');
            baseGradient.addColorStop(0.5, '#8B0000');
            baseGradient.addColorStop(1, '#660000');
        }
        ctx.fillStyle = baseGradient;
        ctx.fillRect(this.x - 20, this.y, 40, 30);
        
        // Turret base details
        ctx.strokeStyle = 'rgba(0, 0, 0, 0.3)';
        ctx.lineWidth = 2;
        ctx.strokeRect(this.x - 20, this.y, 40, 30);
        
        // Armor plating
        ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
        ctx.fillRect(this.x - 18, this.y + 2, 36, 8);
        ctx.fillRect(this.x - 18, this.y + 12, 36, 8);
        ctx.fillRect(this.x - 18, this.y + 22, 36, 6);
        
        // Rotating turret head
        ctx.translate(this.x, this.y + 15);
        if (this.targetAngle !== undefined) {
            ctx.rotate(this.targetAngle);
        } else {
            ctx.rotate(this.isPlayer ? 0 : Math.PI);
        }
        
        // Render based on turret type
        if (this.turretType === 'rapid') {
            this.renderRapidTurret(ctx);
        } else if (this.turretType === 'heavy') {
            this.renderHeavyTurret(ctx);
        } else {
            this.renderBasicTurret(ctx);
        }
        
        ctx.rotate(0);
        ctx.translate(-this.x, -(this.y + 15));
        
        // Level indicators with glow
        ctx.shadowColor = '#FFB800';
        ctx.shadowBlur = 5;
        ctx.fillStyle = '#FFB800';
        for (let i = 0; i < this.level; i++) {
            ctx.beginPath();
            ctx.arc(this.x - 15 + i * 15, this.y - 8, 4, 0, Math.PI * 2);
            ctx.fill();
        }
        ctx.shadowBlur = 0;
        
        // Level number
        ctx.fillStyle = '#FFF';
        ctx.font = 'bold 10px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Lv' + this.level, this.x, this.y + 48);
        
        // Turret type indicator
        const typeColors = { basic: '#4682B4', rapid: '#FF8C00', heavy: '#8B0000' };
        ctx.fillStyle = typeColors[this.turretType] || '#4682B4';
        ctx.fillRect(this.x - 10, this.y + 50, 20, 3);
        
        ctx.textAlign = 'left';
        ctx.restore();
    }
    
    renderBasicTurret(ctx) {
        // Turret gun with 3D effect
        const gunGradient = ctx.createLinearGradient(0, -8, 0, 8);
        if (this.isPlayer) {
            gunGradient.addColorStop(0, '#2E5090');
            gunGradient.addColorStop(0.5, '#4682B4');
            gunGradient.addColorStop(1, '#2E5090');
        } else {
            gunGradient.addColorStop(0, '#8B0000');
            gunGradient.addColorStop(0.5, '#DC143C');
            gunGradient.addColorStop(1, '#8B0000');
        }
        ctx.fillStyle = gunGradient;
        
        // Main barrel
        ctx.fillRect(0, -8, 35, 16);
        
        // Barrel tip
        ctx.fillStyle = this.isPlayer ? '#1E4080' : '#660000';
        ctx.fillRect(30, -6, 8, 12);
        
        // Barrel highlights
        ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.fillRect(0, -7, 35, 3);
        
        // Muzzle
        ctx.fillStyle = '#222';
        ctx.beginPath();
        ctx.arc(38, 0, 4, 0, Math.PI * 2);
        ctx.fill();
    }
    
    renderRapidTurret(ctx) {
        // Dual barrels for rapid fire
        const gunGradient = ctx.createLinearGradient(0, -10, 0, 10);
        if (this.isPlayer) {
            gunGradient.addColorStop(0, '#FF6B35');
            gunGradient.addColorStop(0.5, '#FF8C00');
            gunGradient.addColorStop(1, '#FF6B35');
        } else {
            gunGradient.addColorStop(0, '#8B0000');
            gunGradient.addColorStop(0.5, '#DC143C');
            gunGradient.addColorStop(1, '#8B0000');
        }
        ctx.fillStyle = gunGradient;
        
        // Top barrel
        ctx.fillRect(0, -10, 30, 7);
        ctx.fillRect(25, -9, 6, 5);
        
        // Bottom barrel
        ctx.fillRect(0, 3, 30, 7);
        ctx.fillRect(25, 4, 6, 5);
        
        // Barrel highlights
        ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.fillRect(0, -10, 30, 2);
        ctx.fillRect(0, 3, 30, 2);
        
        // Muzzles
        ctx.fillStyle = '#222';
        ctx.beginPath();
        ctx.arc(31, -6, 3, 0, Math.PI * 2);
        ctx.arc(31, 6, 3, 0, Math.PI * 2);
        ctx.fill();
    }
    
    renderHeavyTurret(ctx) {
        // Large single barrel
        const gunGradient = ctx.createLinearGradient(0, -12, 0, 12);
        if (this.isPlayer) {
            gunGradient.addColorStop(0, '#2E2E2E');
            gunGradient.addColorStop(0.5, '#4A4A4A');
            gunGradient.addColorStop(1, '#2E2E2E');
        } else {
            gunGradient.addColorStop(0, '#660000');
            gunGradient.addColorStop(0.5, '#8B0000');
            gunGradient.addColorStop(1, '#660000');
        }
        ctx.fillStyle = gunGradient;
        
        // Thick barrel
        ctx.fillRect(0, -12, 40, 24);
        
        // Barrel reinforcement
        ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
        ctx.fillRect(10, -12, 3, 24);
        ctx.fillRect(20, -12, 3, 24);
        ctx.fillRect(30, -12, 3, 24);
        
        // Barrel tip
        ctx.fillStyle = this.isPlayer ? '#1E4080' : '#440000';
        ctx.fillRect(35, -10, 10, 20);
        
        // Large muzzle
        ctx.fillStyle = '#000';
        ctx.beginPath();
        ctx.arc(45, 0, 7, 0, Math.PI * 2);
        ctx.fill();
        
        // Muzzle brake
        ctx.strokeStyle = '#333';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(45, 0, 9, 0, Math.PI * 2);
        ctx.stroke();
    }
}

class Particle {
    constructor(x, y, vx, vy, color, isPlayer) {
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.color = color;
        this.isPlayer = isPlayer;
        this.life = 1.0;
        this.gravity = 200;
        this.size = 3 + Math.random() * 3;
    }
    
    update(dt) {
        this.x += this.vx * dt;
        this.y += this.vy * dt;
        this.vy += this.gravity * dt;
        this.life -= dt * 2;
        this.isDone = this.life <= 0 || this.y > CONFIG.groundLevel + 20;
    }
    
    render(ctx) {
        ctx.save();
        ctx.globalAlpha = this.life;
        ctx.fillStyle = this.color;
        ctx.shadowColor = this.isPlayer ? '#FFB800' : '#FF4500';
        ctx.shadowBlur = 5;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }
}

class SpecialEffect {
    constructor(x, y, damage, isEnemy) {
        this.x = x;
        this.y = y;
        this.damage = damage;
        this.isEnemy = isEnemy;
        this.radius = 0;
        this.maxRadius = 150;
        this.duration = 1000;
        this.startTime = Date.now();
        this.isDone = false;
    }
    
    update(dt) {
        const elapsed = Date.now() - this.startTime;
        const progress = elapsed / this.duration;
        
        if (progress >= 1) {
            this.isDone = true;
            return;
        }
        
        this.radius = this.maxRadius * Math.sin(progress * Math.PI);
    }
    
    render(ctx) {
        ctx.save();
        const progress = (Date.now() - this.startTime) / this.duration;
        ctx.globalAlpha = 1 - progress;
        
        // Multiple explosion rings
        for (let i = 0; i < 4; i++) {
            const ringRadius = this.radius * (1 - i * 0.2);
            const ringAlpha = (1 - progress) * (1 - i * 0.25);
            
            ctx.globalAlpha = ringAlpha;
            
            // Outer glow
            const glowGradient = ctx.createRadialGradient(this.x, this.y, ringRadius * 0.5, this.x, this.y, ringRadius);
            if (this.isEnemy) {
                glowGradient.addColorStop(0, 'rgba(255, 255, 100, 0.8)');
                glowGradient.addColorStop(0.4, 'rgba(255, 100, 0, 0.6)');
                glowGradient.addColorStop(1, 'rgba(255, 0, 0, 0)');
            } else {
                glowGradient.addColorStop(0, 'rgba(255, 255, 255, 0.8)');
                glowGradient.addColorStop(0.4, 'rgba(255, 200, 0, 0.6)');
                glowGradient.addColorStop(1, 'rgba(255, 150, 0, 0)');
            }
            ctx.fillStyle = glowGradient;
            ctx.beginPath();
            ctx.arc(this.x, this.y, ringRadius, 0, Math.PI * 2);
            ctx.fill();
        }
        
        // Impact core with flashing effect
        const flashIntensity = Math.sin(progress * Math.PI * 10) * 0.3 + 0.7;
        ctx.globalAlpha = (1 - progress) * flashIntensity;
        ctx.shadowColor = this.isEnemy ? '#FF0000' : '#FFB800';
        ctx.shadowBlur = 30;
        
        const coreGradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.radius * 0.3);
        coreGradient.addColorStop(0, '#FFFFFF');
        coreGradient.addColorStop(0.5, this.isEnemy ? '#FF6347' : '#FFD700');
        coreGradient.addColorStop(1, this.isEnemy ? '#FF0000' : '#FF8C00');
        ctx.fillStyle = coreGradient;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius * 0.3, 0, Math.PI * 2);
        ctx.fill();
        
        // Shockwave ring
        ctx.globalAlpha = (1 - progress) * 0.8;
        ctx.strokeStyle = this.isEnemy ? '#FF4500' : '#FFB800';
        ctx.lineWidth = 5;
        ctx.shadowBlur = 20;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.stroke();
        
        // Outer shockwave
        ctx.globalAlpha = (1 - progress) * 0.4;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius * 1.2, 0, Math.PI * 2);
        ctx.stroke();
        
        // Particle effects around explosion
        const particleCount = 12;
        for (let i = 0; i < particleCount; i++) {
            const angle = (i / particleCount) * Math.PI * 2;
            const distance = this.radius * 0.8;
            const px = this.x + Math.cos(angle) * distance;
            const py = this.y + Math.sin(angle) * distance;
            
            ctx.globalAlpha = (1 - progress) * 0.7;
            ctx.fillStyle = this.isEnemy ? '#FF6347' : '#FFD700';
            ctx.beginPath();
            ctx.arc(px, py, 5, 0, Math.PI * 2);
            ctx.fill();
        }
        
        ctx.restore();
    }
}