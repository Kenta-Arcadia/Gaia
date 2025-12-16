#!/bin/bash
# Script de démarrage GAIA

echo "🌱 Démarrage GAIA..."
echo ""

# Vérifier Flask
if ! python3 -c "import flask" 2>/dev/null; then
    echo "❌ Flask non installé. Installation..."
    pip install flask flask-cors
fi

# Démarrer serveur
echo "🚀 Démarrage serveur Flask sur http://localhost:5001"
echo "📝 Appuyez sur Ctrl+C pour arrêter"
echo ""

cd "$(dirname "$0")"
python3 gaia_server.py

