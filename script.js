// Tree CO₂ absorption data (kg per year per tree)
const treeData = {
    neem: {
        name: 'Neem',
        emoji: '🌿',
        co2PerYear: 14.5, // kg CO₂ per year
        description: 'Neem trees are excellent for carbon absorption and air purification.'
    },
    mango: {
        name: 'Mango',
        emoji: '🥭',
        co2PerYear: 16.2, // kg CO₂ per year
        description: 'Mango trees provide shade and absorb significant amounts of CO₂.'
    },
    teak: {
        name: 'Teak',
        emoji: '🌲',
        co2PerYear: 22.8, // kg CO₂ per year (highest)
        description: 'Teak trees are among the best for carbon sequestration.'
    },
    banyan: {
        name: 'Banyan',
        emoji: '🌳',
        co2PerYear: 18.5, // kg CO₂ per year
        description: 'Banyan trees have extensive root systems and absorb CO₂ effectively.'
    },
    coconut: {
        name: 'Coconut',
        emoji: '🥥',
        co2PerYear: 15.8, // kg CO₂ per year
        description: 'Coconut palms contribute to carbon reduction while providing fruit.'
    }
};

// Initialize leaf particles
function createLeafParticles() {
    const leafContainer = document.getElementById('leafContainer');
    const leafEmojis = ['🍃', '🌿', '🍀', '🌱'];
    const numLeaves = 15;

    for (let i = 0; i < numLeaves; i++) {
        const leaf = document.createElement('div');
        leaf.className = 'leaf';
        leaf.textContent = leafEmojis[Math.floor(Math.random() * leafEmojis.length)];
        leaf.style.left = Math.random() * 100 + '%';
        leaf.style.animationDelay = Math.random() * 15 + 's';
        leaf.style.animationDuration = (10 + Math.random() * 10) + 's';
        leafContainer.appendChild(leaf);
    }
}

// Find best tree recommendation
function getBestTree() {
    let bestTree = null;
    let highestCO2 = 0;

    for (const [key, data] of Object.entries(treeData)) {
        if (data.co2PerYear > highestCO2) {
            highestCO2 = data.co2PerYear;
            bestTree = { key, ...data };
        }
    }

    return bestTree;
}

// Update recommendation section
function updateRecommendation(selectedTreeKey = null) {
    const bestTree = getBestTree();
    const recommendationCard = document.getElementById('recommendationCard');
    const recommendationEmoji = document.getElementById('recommendationEmoji');
    const recommendationTitle = document.getElementById('recommendationTitle');
    const recommendationText = document.getElementById('recommendationText');
    const recommendationRate = document.getElementById('recommendationRate');

    if (selectedTreeKey && treeData[selectedTreeKey].co2PerYear === bestTree.co2PerYear) {
        // If selected tree is the best one
        recommendationEmoji.textContent = bestTree.emoji;
        recommendationTitle.textContent = `✨ Excellent Choice! ${bestTree.name} is the best option! ✨`;
        recommendationText.textContent = `${bestTree.description} With ${bestTree.co2PerYear} kg CO₂ per year, it's the top performer.`;
        recommendationRate.textContent = `${bestTree.co2PerYear} kg/year`;
        recommendationCard.classList.add('highlight-card');
    } else if (selectedTreeKey) {
        // Show best tree recommendation when a different tree is selected
        const selectedTree = treeData[selectedTreeKey];
        recommendationEmoji.textContent = bestTree.emoji;
        recommendationTitle.textContent = `💡 Best Recommendation: ${bestTree.name}`;
        recommendationText.textContent = `While ${selectedTree.name} is good (${selectedTree.co2PerYear} kg/year), ${bestTree.name} absorbs more CO₂ (${bestTree.co2PerYear} kg/year). ${bestTree.description}`;
        recommendationRate.textContent = `${bestTree.co2PerYear} kg/year`;
        recommendationCard.classList.add('highlight-card');
    } else {
        // Initial state
        recommendationEmoji.textContent = bestTree.emoji;
        recommendationTitle.textContent = `🌿 Best Tree: ${bestTree.name}`;
        recommendationText.textContent = `${bestTree.description} With an absorption rate of ${bestTree.co2PerYear} kg CO₂ per year, it's the top choice for maximum carbon reduction.`;
        recommendationRate.textContent = `${bestTree.co2PerYear} kg/year`;
        recommendationCard.classList.add('highlight-card');
    }

    // Add animation
    recommendationEmoji.style.animation = 'none';
    setTimeout(() => {
        recommendationEmoji.style.animation = 'grow 1s ease-out';
    }, 10);
}

// Calculate CO₂ absorption
function calculateCO2(treeKey, count) {
    const tree = treeData[treeKey];
    if (!tree) return { yearly: 0, tenYear: 0 };

    const yearly = tree.co2PerYear * count;
    const tenYear = yearly * 10;

    return {
        yearly: yearly.toFixed(2),
        tenYear: tenYear.toFixed(2)
    };
}

// Format number with commas
function formatNumber(num) {
    return parseFloat(num).toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
}

// Handle form submission
document.getElementById('calculatorForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const treeType = document.getElementById('treeType').value;
    const treeCount = parseInt(document.getElementById('treeCount').value);

    if (!treeType || !treeCount || treeCount < 1) {
        alert('Please select a tree type and enter a valid number of trees.');
        return;
    }

    // Calculate CO₂
    const co2 = calculateCO2(treeType, treeCount);
    const tree = treeData[treeType];

    // Update results
    document.getElementById('yearlyCO2').textContent = formatNumber(co2.yearly) + ' kg';
    document.getElementById('tenYearCO2').textContent = formatNumber(co2.tenYear) + ' kg';
    document.getElementById('selectedTree').textContent = tree.name + ' ' + tree.emoji;
    document.getElementById('selectedCount').textContent = treeCount;

    // Show results section with animation
    const resultsSection = document.getElementById('resultsSection');
    resultsSection.classList.remove('hidden');
    resultsSection.style.animation = 'slideIn 0.6s ease-out';

    // Scroll to results
    setTimeout(() => {
        resultsSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 300);

    // Update recommendation
    updateRecommendation(treeType);

    // Add visual feedback to form elements
    document.getElementById('treeType').style.borderColor = 'var(--green-medium)';
    document.getElementById('treeCount').style.borderColor = 'var(--green-medium)';
});

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    createLeafParticles();
    updateRecommendation();

    // Add smooth transitions to form inputs
    const formInputs = document.querySelectorAll('.form-select, .form-input');
    formInputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.style.transform = 'translateY(-2px)';
        });
        input.addEventListener('blur', function() {
            this.style.transform = 'translateY(0)';
        });
    });
});

