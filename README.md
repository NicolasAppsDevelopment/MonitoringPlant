# Monitoring plante


## Intro

Notre projet est divisé en 4 parties :

- L'API NodeJS
- Le daemon driver (module de mesure)
- Le site web et l'API PHP
- La base de données

Chaque parties se trouvent sur sa branche correspondante.

![Schéma du projet](https://github.com/NicolasAppsDevelopment/MonitoringPlant/blob/2a18ede61d270c920f4e5fcb5a07ccaf3c99eb71/schema.png)

## L'API NodeJS

Hébergé par Node.JS sur le Raspberry Pi, l'API sert d'interface entre le site web et le daemon driver.
Les fichiers de code se trouvent dans la branche API-NodeJS.

## Le daemon driver

Service en C/C++ qui tourne sur le Raspberry Pi, il correspond à l'API de communication bas niveau avec les capteurs.
Les fichiers de code sont sur un dépôt privé car inclu du code obtenu par retro-engineering.

## Le site web et API PHP

Hébergé par Apache sur le Raspberry Pi, le site web fait office d'interface (graphique) entre les API et l'utilisateur.
Les fichiers de code se trouvent dans la branche Website.

## La base de données

Hébergé par MariaDB sur le Raspberry Pi, utilisé dans le projet.
Les fichiers de codes SQL et diagrammes de classe se trouvent dans la branche BD.
