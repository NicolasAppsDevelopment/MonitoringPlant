# Monitoring plante


## Intro

Notre projet est divisé en 4 parties :

- L'API NodeRED
- Le daemon driver
- Le site web
- La base de données

Chaque parties se trouvent sur sa branche correspondante.

## L'API NodeRED

Hébergé par Node-RED sur le Raspberry Pi, l'API sert d'interface entre le site web et le daemon driver.
Les fichiers de sauvegarde se trouvent dans la branche [API-NodeRED](https://iutbg-gitlab.iutbourg.univ-lyon1.fr/2023-2024-sae-but2/monitoring-plante/-/tree/API-NodeRED).

## Le daemon driver

Service en C/C++ qui tourne sur le Raspberry Pi, il correspond à l'API de communication bas niveau avec les capteurs.
Les fichiers de code se trouvent dans la branche [Daemon_driver](https://iutbg-gitlab.iutbourg.univ-lyon1.fr/2023-2024-sae-but2/monitoring-plante/-/tree/Daemon_driver).

## Le site web

Hébergé par Apache sur le Raspberry Pi, le site web fait office d'interface (graphique) entre les API et l'utilisateur.
Les fichiers de code se trouvent dans la branche [Website](https://iutbg-gitlab.iutbourg.univ-lyon1.fr/2023-2024-sae-but2/monitoring-plante/-/tree/Website).

## La base de données

Hébergé par MariaDB sur le Raspberry Pi, utilisé dans le projet.
Les fichiers de code SQL et diagramme de classe se trouvent dans la branche [BD](https://iutbg-gitlab.iutbourg.univ-lyon1.fr/2023-2024-sae-but2/monitoring-plante/-/tree/BD).