# Guide de Test Manuel - System Prompt

## 🎯 Objectif
Vérifier que la fonctionnalité de System Prompt personnalisable fonctionne correctement.

## 📋 Étapes de Test

### 1. Préparation
- [ ] L'application fonctionne sur http://localhost:5173/
- [ ] Vous avez une clé API OpenRouter configurée

### 2. Test de l'Interface
- [ ] Ouvrir les paramètres (icône d'engrenage)
- [ ] Vérifier la présence de la section "Instruction Système"
- [ ] Vérifier que le textarea est présent et fonctionnel
- [ ] Vérifier le placeholder : "Ex: Tu es un assistant spécialisé en programmation Python..."

### 3. Test de Configuration
- [ ] Saisir un system prompt de test :
  ```
  Tu es un assistant qui répond TOUJOURS en français et commence chaque réponse par "🤖 Assistant :"
  ```
- [ ] Sauvegarder les paramètres
- [ ] Vérifier que le prompt est bien sauvegardé (rafraîchir la page et rouvrir les paramètres)

### 4. Test de Fonctionnement
- [ ] Sélectionner un modèle (ex: GPT-3.5)
- [ ] Démarrer une nouvelle conversation
- [ ] Envoyer un message simple : "Hello, how are you?"
- [ ] **Vérifier que la réponse :**
  - [ ] Est en français
  - [ ] Commence par "🤖 Assistant :"

### 5. Test Multi-Modèles (optionnel)
- [ ] Ajouter un second modèle
- [ ] Envoyer le même message
- [ ] Vérifier que les deux modèles respectent le system prompt

### 6. Test de Persistance
- [ ] Rafraîchir la page
- [ ] Vérifier que le system prompt est toujours configuré
- [ ] Tester une nouvelle conversation

### 7. Test de Régénération
- [ ] Dans une conversation existante, régénérer une réponse
- [ ] Vérifier que la nouvelle réponse respecte toujours le system prompt

## 🧪 Exemples de System Prompts à Tester

### Prompt de Spécialisation
```
Tu es un expert en développement web. Réponds uniquement aux questions sur HTML, CSS, JavaScript, et frameworks web. Pour toute autre question, dis "Je ne peux répondre qu'aux questions sur le développement web."
```

### Prompt de Format
```
Réponds toujours sous forme de liste numérotée et termine chaque réponse par "Bonne journée !"
```

### Prompt de Personnalité
```
Tu es un pirate sympathique. Utilise un langage de pirate (ex: "Ahoy!", "moussaillon") mais reste professionnel dans tes réponses techniques.
```

## ✅ Critères de Réussite

- [ ] L'interface du system prompt est fonctionnelle
- [ ] Le prompt est sauvegardé et persistant
- [ ] Les réponses de l'IA respectent les instructions
- [ ] Fonctionne avec tous les modèles
- [ ] Fonctionne avec la régénération
- [ ] Aucune erreur dans la console

## 🚨 Problèmes Potentiels

Si quelque chose ne fonctionne pas :

1. **Vérifier la console** : F12 → Console pour voir les erreurs
2. **Vérifier le network** : F12 → Network pour voir les requêtes API
3. **Vérifier le localStorage** : F12 → Application → Local Storage
4. **Tester sans system prompt** : Vider le champ et tester

## 📊 Résultats Attendus

Dans l'onglet Network (F12), lors d'un envoi de message, vous devriez voir :

```json
{
  "model": "gpt-3.5-turbo",
  "messages": [
    {
      "role": "system",
      "content": "Votre system prompt ici"
    },
    {
      "role": "user", 
      "content": "Message de l'utilisateur"
    }
  ]
}
```
