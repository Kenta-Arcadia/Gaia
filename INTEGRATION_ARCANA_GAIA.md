# 🔗 Intégration Arcana → GAIA

## 🎯 Flux utilisateur

1. **Utilisateur arrive sur GAIA**
   - GAIA vérifie si un profil Arcana existe
   - Si pas de profil → Redirection vers Arcana

2. **Utilisateur fait le parcours Arcana**
   - Découvre son profil (élément, chakra, solide Platon)
   - Arcana sauvegarde le profil

3. **Retour sur GAIA**
   - GAIA récupère le profil Arcana
   - Génère recommandations biodynamiques personnalisées

---

## 🔧 Mécanisme de partage

### Option 1 : Paramètres URL (recommandé)
- Arcana redirige vers GAIA avec profil en paramètre URL
- GAIA récupère le profil depuis l'URL
- Sauvegarde dans localStorage pour sessions suivantes

### Option 2 : localStorage (même domaine)
- Si Arcana et GAIA sur même domaine
- Partage localStorage directement

---

## 📋 À faire dans Arcana

Modifier `arcana.js` pour qu'après le parcours, il :
1. Extrait les dominantes (élément, chakra, solide Platon)
2. Redirige vers GAIA avec profil en paramètre URL :
   ```javascript
   const profil = {
       element_dominant: 'terre',
       chakra_dominant: 'racine',
       solide_platon_dominant: 'cube'
   };
   window.location.href = 'https://kenta-arcadia.github.io/Gaia/?profil=' + encodeURIComponent(JSON.stringify(profil));
   ```

---

## ✅ Résultat

**Flux complet** :
Arcana (découverte) → GAIA (recommandations biodynamiques personnalisées)

**"Découvrez votre profil, puis recevez vos recommandations biodynamiques."**

