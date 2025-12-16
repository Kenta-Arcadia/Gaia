#!/usr/bin/env python3
"""
GAIA - Serveur Flask pour application biodynamique
Intègre harmonisation_arcana.py pour générer recommandations
"""
from flask import Flask, render_template, jsonify, request
import sys
from pathlib import Path

sys.path.insert(0, str(Path.home() / "KENTA"))

from gaia.moteurs.harmonisation_arcana import HarmonisationArcana

app = Flask(__name__, static_folder='.', static_url_path='')
# Pas de CORS nécessaire - 100% local uniquement

# Initialiser moteur GAIA
harmonisation = HarmonisationArcana()

@app.route('/')
def index():
    """Page principale"""
    return app.send_static_file('index.html')

@app.route('/api/gaia/recommandations', methods=['POST'])
def get_recommandations():
    """Générer recommandations biodynamiques"""
    try:
        data = request.json
        
        # Profil vigneron (depuis requête ou par défaut)
        profil_vigneron = {
            "element_dominant": data.get('element_dominant', 'terre'),
            "chakra_dominant": data.get('chakra_dominant', 'racine'),
            "solide_platon_dominant": data.get('solide_platon_dominant', 'cube')
        }
        
        # Générer recommandations
        recommandations = harmonisation.generer_recommandations(profil_vigneron)
        
        return jsonify(recommandations)
        
    except Exception as e:
        return jsonify({
            "error": str(e),
            "message": "Erreur lors de la génération des recommandations"
        }), 500

@app.route('/api/gaia/profil', methods=['POST'])
def get_profil():
    """Récupérer profil Arcana (si intégration future)"""
    try:
        # Pour l'instant, retourner profil par défaut
        # Plus tard, on pourra intégrer avec Arcana pour récupérer le vrai profil
        return jsonify({
            "element_dominant": "terre",
            "chakra_dominant": "racine",
            "solide_platon_dominant": "cube"
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    print("🌱 GAIA - Serveur biodynamique démarré")
    print("📡 Accès LOCAL uniquement: http://localhost:5001")
    print("🔒 100% OFFLINE - Aucune connexion internet")
    print("🚫 Pas d'accès externe possible")
    print("")
    # host='127.0.0.1' = localhost uniquement
    # Pas de connexion externe possible (pas 0.0.0.0)
    # 100% local, 100% souverain, conforme manifeste KENTA
    app.run(host='127.0.0.1', port=5001, debug=False)

