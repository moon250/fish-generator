# Fish generator

Fish generator est un petit script créé afin de faciliter la création des textures des poissons tropicaux de minecraft.
Il faut juste mettre un ou plusieurs modèles de poissons en gris dans le dossier ``models`` et le script va
automatiquement générer toutes les combinaisons de couleurs possibles

## Etapes

Installez les dépendances avec npm ou yarn

```bash
$ npm i
```

ou

```bash
$ yarn
```

Et lancez le script :

Toutes plateformes :

```bash
$ npm run generate
```

```bash
$ yarn run generate
```

Linux :

```bash
$ ./generate
```

Windows :

```bash
generate.bat
```

Les poissons générés sont rangés ainsi :
``/dist/<Nom du modèle>/<Couleur Primaire>/<Couleur Secondaire>.png``

_Jugez pas la qualité du code, elle est infame, mais bon ça marche_