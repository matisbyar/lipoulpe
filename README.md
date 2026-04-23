<h1 align="center">
    <br>
        🐙
    <br>
    GFX - Lipoulpe (Three.js)
</h1>

<h4 align="center">Projet étudiant GFX : scene sous-marine avec modèle 3D, lumière, particules.</h4>

<p align="center">
  <a href="#✨-roadmap">Roadmap</a> •
  <a href="#🛠️-utilisation--développement">Utilisation</a> •
  <a href="#🕹️-technologies">Technologies</a>
</p>

![Screenshot](/public/preview.png)

## ✨ Roadmap

- [x] Scène Three.js avec ambiance océan
- [x] Chargement GLB + animation boomerang/ease
- [ ] Ajouter une UI de réglages (lumière, particules, vitesse)

## 🛠️ Utilisation & développement

Pour lancer le projet en local, installe [Node.js](https://nodejs.org/en/download/) (inclut npm), puis dans un terminal :

```bash
# Installer les dépendances
$ npm install

# Lancer en développement
$ npm run dev
```

Build production :

```bash
$ npm run build
```

Le projet charge au démarrage :
1. `public/models/model.glb` via `GLTFLoader`
2. fallback cube si rien n'est disponible

## 🕹️ Technologies

<img src="https://skillicons.dev/icons?i=threejs,vite,js" alt="Les technologies utilisées" />
