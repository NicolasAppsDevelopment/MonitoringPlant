# Monitoring plante


## Intro

Notre projet est divisé en 4 parties :

- L'API NodeJS
- Le daemon driver (module de mesure)
- Le site web et l'API PHP
- La base de données

Chaque parties se trouvent sur sa branche correspondante.

![Schéma du projet](https://iutbg-gitlab.iutbourg.univ-lyon1.fr/2023-2024-sae-but2/monitoring-plante/-/raw/9202aca6f620f5be9e91dde6cf449de781c9efcf/schema.png)

## L'API NodeJS

Hébergé par Node.JS sur le Raspberry Pi, l'API sert d'interface entre le site web et le daemon driver.
Les fichiers de sauvegarde se trouvent dans la branche [API-NodeJS](https://iutbg-gitlab.iutbourg.univ-lyon1.fr/2023-2024-sae-but2/monitoring-plante/-/tree/API-NodeJS).

## Le daemon driver

Service en C/C++ qui tourne sur le Raspberry Pi, il correspond à l'API de communication bas niveau avec les capteurs.
Les fichiers de code se trouvent dans la branche [Daemon_driver](https://iutbg-gitlab.iutbourg.univ-lyon1.fr/2023-2024-sae-but2/monitoring-plante/-/tree/Daemon_driver).

## Le site web et API PHP

Hébergé par Apache sur le Raspberry Pi, le site web fait office d'interface (graphique) entre les API et l'utilisateur.
Les fichiers de code se trouvent dans la branche [Website](https://iutbg-gitlab.iutbourg.univ-lyon1.fr/2023-2024-sae-but2/monitoring-plante/-/tree/Website).

## La base de données

Hébergé par MariaDB sur le Raspberry Pi, utilisé dans le projet.
Les fichiers de code SQL et diagramme de classe se trouvent dans la branche [BD](https://iutbg-gitlab.iutbourg.univ-lyon1.fr/2023-2024-sae-but2/monitoring-plante/-/tree/BD).