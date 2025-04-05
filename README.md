# Monitoring plante

![Poster du projet](https://github.com/NicolasAppsDevelopment/MonitoringPlant/blob/0657e8024d43964476f697719ba68346789d8b66/poster.png)

## Structure du dépôt de code

Notre projet est donc divisé en 4 parties :

- L'API NodeJS
- Le daemon driver (module de mesure)
- Le site web et l'API PHP
- La base de données

Chaque parties se trouvent sur sa branche correspondante.

## L'API NodeJS

Hébergé par Node.JS sur le Raspberry Pi, l'API sert d'interface entre le site web et le daemon driver.
Les fichiers de code se trouvent dans la branche API-NodeJS.

## Le daemon driver

Service en C/C++ qui tourne sur le Raspberry Pi, il correspond à l'API de communication bas niveau avec les capteurs.
Les fichiers de code sont sur un dépôt privé car inclu du code obtenu par reverse engineering.

## Le site web et API PHP

Hébergé par Apache sur le Raspberry Pi, le site web fait office d'interface (graphique) entre les API et l'utilisateur.
Les fichiers de code se trouvent dans la branche Website.

## La base de données

Hébergé par MariaDB sur le Raspberry Pi, utilisé dans le projet.
Les fichiers de codes SQL et diagrammes de classe se trouvent dans la branche BD.
