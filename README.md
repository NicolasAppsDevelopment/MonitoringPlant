# Contexte
Ce programme est utilisé en tant qu'API REST pour faire fonctionner notre projet. Il doit être installé et executé sur le Raspberry Pi.

# Installer
- Commencez par installer NPM et NODE.JS sur le Raspberry Pi.
- Avant de lancer le programme, installer les librairies Node.JS avec `npm install` (à faire dans le répertoire du projet).
- Vous devez executer le programme au démarrage du Raspberry Pi, vous pouvez faire cela en créant un nouveau service sur Linux.

# Lancement/débuggage
- `npm run dev` to compile and run the script
- `npm run start` to start the script
- `npm run build` to compile

# Documentation
Pour retrouver la documentation générée dans des pages HTML, rendez-vous dans le dossier `docs`.
Pour la documentation des routes API mise à disposition par le serveur Node.JS (fichiers se trouvant dans le dossier `src/WEB_API/Routes`), regardez directement les commentaires dans les fichiers de code car ces derniers n'ont pas pu être exportés dans la documentation HTML ([mention du problème sur Git](https://github.com/TypeStrong/typedoc/issues/1871#issuecomment-1047324708)).