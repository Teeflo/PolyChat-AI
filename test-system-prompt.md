# Test du System Prompt

## Objectif
Tester la fonctionnalité de System Prompt personnalisable qui a été implémentée.

## Fonctionnalités implémentées

### 1. ✅ Mise à jour de l'état des paramètres
- [x] Ajout de `systemPrompt: string` dans `useSettings.ts`
- [x] Fonction `setSystemPrompt` pour la mise à jour
- [x] Sauvegarde et chargement depuis localStorage avec les autres paramètres

### 2. ✅ Ajout du champ dans l'interface
- [x] Champ `<textarea>` dans `SettingsModalModern.tsx`
- [x] Intitulé "Instruction Système"
- [x] Liaison avec l'état `systemPrompt` du hook `useSettings`
- [x] Style CSS approprié pour le `textarea`

### 3. ✅ Intégration dans l'appel API
- [x] Modification de `fetchAIResponse` dans `openRouter.ts` pour accepter le `systemPrompt`
- [x] Ajout automatique du message système au début si `systemPrompt` n'est pas vide
- [x] Intégration dans `sendMessageToAll` et `regenerateMessage` dans `useChat.ts`
- [x] Récupération du `systemPrompt` depuis `useSettings`

## Comment tester

1. **Ouvrir l'application** : L'application est accessible à http://localhost:5173/
2. **Accéder aux paramètres** : Cliquer sur l'icône des paramètres
3. **Configurer le System Prompt** : 
   - Ajouter une instruction dans le champ "Instruction Système"
   - Exemple : "Tu es un assistant spécialisé en programmation Python. Réponds de manière concise et technique."
4. **Sauvegarder** : Cliquer sur "Sauvegarder"
5. **Tester une conversation** : Démarrer une nouvelle conversation et vérifier que l'IA suit les instructions du system prompt

## Structure du message envoyé à l'API

Quand un `systemPrompt` est configuré, les messages envoyés à l'API ont cette structure :

```json
{
  "model": "nom-du-modele",
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

## Avantages de cette implémentation

1. **Persistance** : Le system prompt est sauvegardé automatiquement
2. **Flexibilité** : Peut être modifié à tout moment dans les paramètres
3. **Universel** : S'applique à tous les modèles et conversations
4. **Optionnel** : Si vide, aucun message système n'est envoyé
5. **Interface claire** : Section dédiée dans les paramètres avec description

## Notes techniques

- Le type `Message` a été étendu pour supporter `role: 'system'`
- Le system prompt est automatiquement ajouté en première position
- La fonctionnalité fonctionne avec le multi-chat et la régénération de messages
- Le prompt est nettoyé (trim) avant envoi pour éviter les espaces inutiles
