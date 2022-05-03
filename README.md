# Fish generator

Fish generator est un petit script créé afin de faciliter la création des textures des poissons tropicaux de minecraft.
Il faut juste mettre un ou plusieurs modèles de poissons en gris dans le dossier ``models`` et le script va
automatiquement générer toutes les combinaisons de couleurs possibles

## Etapes

Installez les dépendances avec npm ou yarn

```shell
npm i
```

ou

```shell
yarn
```

Et lancez le script :

Toutes plateformes :

```shell
npm run generate
```

```shell
yarn run generate
```

Linux :

```shell
./generate
```

Windows :

```shell
generate.bat
```

Les poissons générés sont rangés ainsi :
``/dist/<Nom du modèle>/<Couleur Primaire>/<Couleur Secondaire>.png``

_Jugez pas la qualité du code, elle est infame, mais bon ça marche_