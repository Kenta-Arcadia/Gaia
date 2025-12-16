// GAIA - Application Biodynamie pour Vignerons
// Intégration avec harmonisation_arcana.py

let currentData = null;

// Démarrer GAIA
function startGaia() {
    document.getElementById('screen-start').style.display = 'none';
    document.getElementById('screen-recommandations').style.display = 'block';
    
    loadRecommandations();
}

// Retour au début
function backToStart() {
    document.getElementById('screen-start').style.display = 'block';
    document.getElementById('screen-recommandations').style.display = 'none';
}

// Charger recommandations
async function loadRecommandations() {
    const content = document.getElementById('recommandations-content');
    content.innerHTML = '<div class="loading">Chargement des recommandations biodynamiques</div>';
    
    try {
        // Détecter URL API selon le port
        let apiUrl;
        if (window.location.port === '5001' || window.location.hostname === 'localhost') {
            // Serveur Flask actif
            apiUrl = '/api/gaia/recommandations';
        } else {
            // Serveur simple, essayer Flask sur port 5001
            apiUrl = 'http://localhost:5001/api/gaia/recommandations';
        }
        
        // Appel API Flask avec timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 3000); // 3 secondes max
        
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                element_dominant: 'terre',
                chakra_dominant: 'racine',
                solide_platon_dominant: 'cube'
            }),
            mode: 'cors',
            signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
        if (!response.ok) {
            throw new Error(`Erreur API: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Vérifier si c'est une erreur
        if (data.error) {
            throw new Error(data.message || data.error);
        }
        
        currentData = data;
        displayRecommandations(data);
        updateMomentActuel(data);
        
    } catch (error) {
        console.log('Mode démo activé - API indisponible:', error.message);
        // Mode démo automatique si API indisponible
        loadDemoData();
    }
}

// Afficher recommandations
function displayRecommandations(data) {
    const content = document.getElementById('recommandations-content');
    let html = '';
    
    // Préparats recommandés
    if (data.preparats_recommandes && data.preparats_recommandes.length > 0) {
        html += '<div class="recommandation-section">';
        html += '<h2>🌱 Préparats Biodynamiques</h2>';
        data.preparats_recommandes.forEach(prep => {
            html += `
                <div class="recommandation-item">
                    <h3>${prep.preparation}</h3>
                    <p>${prep.application || 'Application biodynamique'}</p>
                    <p class="raison">${prep.raison}</p>
                </div>
            `;
        });
        html += '</div>';
    }
    
    // Tisanes recommandées
    if (data.tisanes_recommandees && data.tisanes_recommandees.length > 0) {
        html += '<div class="recommandation-section">';
        html += '<h2>🍵 Tisanes</h2>';
        data.tisanes_recommandees.forEach(tisane => {
            html += `
                <div class="recommandation-item">
                    <h3>${tisane.tisane}</h3>
                    <p>${tisane.preparation ? Object.values(tisane.preparation).join(', ') : 'Infusion recommandée'}</p>
                    <p class="raison">${tisane.raison}</p>
                </div>
            `;
        });
        html += '</div>';
    }
    
    // Huiles essentielles recommandées
    if (data.huiles_essentielles_recommandees && data.huiles_essentielles_recommandees.length > 0) {
        html += '<div class="recommandation-section">';
        html += '<h2>💧 Huiles Essentielles</h2>';
        data.huiles_essentielles_recommandees.forEach(huile => {
            html += `
                <div class="recommandation-item">
                    <h3>${huile.huile}</h3>
                    <p>${huile.dilutions ? Object.entries(huile.dilutions).map(([k, v]) => `${k}: ${v}`).join(', ') : 'Dilution recommandée'}</p>
                    <p class="raison">${huile.raison}</p>
                </div>
            `;
        });
        html += '</div>';
    }
    
    // Interventions favorables
    if (data.interventions_favorables && data.interventions_favorables.length > 0) {
        html += '<div class="recommandation-section">';
        html += '<h2>🔧 Interventions Favorables</h2>';
        data.interventions_favorables.forEach(intervention => {
            html += `
                <div class="recommandation-item">
                    <p>${intervention}</p>
                </div>
            `;
        });
        html += '</div>';
    }
    
    // Dictons du jour
    if (data.dictons_du_jour && data.dictons_du_jour.length > 0) {
        html += '<div class="recommandation-section">';
        html += '<h2>🗣️ Dictons du Jour</h2>';
        data.dictons_du_jour.forEach(dicton => {
            html += `
                <div class="dicton-item">
                    <p>"${dicton}"</p>
                </div>
            `;
        });
        html += '</div>';
    }
    
    if (html === '') {
        html = '<div class="loading">Aucune recommandation disponible pour le moment.</div>';
    }
    
    content.innerHTML = html;
}

// Mettre à jour moment actuel
function updateMomentActuel(data) {
    const momentEl = document.getElementById('moment-actuel');
    if (data.calendrier) {
        const { jour_lunaire, phase_lune } = data.calendrier;
        momentEl.textContent = `${jour_lunaire} - ${phase_lune}`;
    } else {
        momentEl.textContent = 'Calendrier biodynamique';
    }
}

// Actualiser recommandations
function refreshRecommandations() {
    loadRecommandations();
}

// Données démo (si API non disponible)
function loadDemoData() {
    const demoData = {
        profil: "terre / racine",
        calendrier: {
            jour_lunaire: "Racine",
            phase_lune: "Lune_croissante"
        },
        preparats_recommandes: [
            {
                preparation: "Préparation 500 - Bouse de corne",
                element: "terre",
                raison: "Aligné avec élément dominant (terre)",
                application: "dynamisation sol, enracinement"
            }
        ],
        tisanes_recommandees: [
            {
                tisane: "Romarin",
                element: "terre",
                raison: "Aligné avec élément dominant (terre)",
                preparation: {
                    infusion: "1 cuillère à café par tasse, 10 min"
                }
            }
        ],
        huiles_essentielles_recommandees: [
            {
                huile: "Lavande Vraie",
                element: "eau",
                raison: "Harmonisation énergétique",
                dilutions: {
                    diffusion: "5-10 gouttes"
                }
            }
        ],
        interventions_favorables: [
            "Travail du sol",
            "Plantation",
            "Enracinement"
        ],
        dictons_du_jour: [
            "Terre bien travaillée, récolte assurée.",
            "À la Sainte-Luce, les jours croissent du saut d'une puce."
        ]
    };
    
    currentData = demoData;
    displayRecommandations(demoData);
    updateMomentActuel(demoData);
}

