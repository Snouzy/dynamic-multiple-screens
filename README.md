## Welcome to dynamic-multiple-screens ! 👋
Snouz'dynamic est une application réalisé dans le cadre d'aider la douane française  *(et plus particulièrement une brigade du Grand Est)* pour afficher dynamiquement des affiches sur *(au maximum)* 3 écrans.

## Pourquoi ?
Dans l'optique de **digitaliser la douane** et d'éviter que des affiches vieillissantes et jaunâtres soient affichées à la vue du public, mais aussi d'offrir un affichage éclairé, car l’œil est directement attiré par l'écran et, de nuit, certaines personnes ne voyaient même pas les affiches.
Enfin, cette application permet aux douaniers de ne pas "oublier" de changer une affiche physiquement sur une porte car tout est centralisé sur un écran *(un tableau de bord)* qui évite les vas et vient des agents entre les différentes portes.

## Comment l'installer ?
Réalisée avec ElectronJS, et grâce à [electron-packager](https://www.npmjs.com/package/electron-packager), vous pouvez simplement faire un 
`git clone` puis `
electron-packager <sourcedir> <appname> --platform=<platform> --arch=<arch> [optional flags...]` via le terminal.  
Documentation d'electron-packager : [ici](https://www.npmjs.com/package/electron-packager).

Si l'application est déjà installée sur votre machine, vous pouvez simplement double cliquer sur l'icône

## Démo
 **Au `démarrage` de l'application :**
 
Vous avez accès au tableau de bord, qui sera affiché sur l'écran principal, celui qui gérera les autres écrans.

![démarrage de l'app](https://user-images.githubusercontent.com/32961176/75327633-09652000-587d-11ea-928f-876ba759ceeb.JPG)
* `Total d'affichage(s) ACTIF(S)`: affiche le nombre d'affichage en cours de diffusion
* `Emplacement` : Chaque ligne représente **un** emplacement (Hall d'entrée ou borne Pablo)
* `Changer l'affichage` : Permet de changer l'affichage en cours (voir section plus bas)
* `Supprimer l'affichage` : Permet de supprimer l'affichage en cours (voir section plus bas)
* `Éteindre tous les affichages` : Permet de stopper toutes les diffusions, **de tous les écrans**.
* `Fermer l'application` : Permet d'éteindre le totalement le processus de l'application (similaire à un clique sur la croix rouge en haut à droite)
<p>&nbsp</p>

**Au clic sur `CHANGER L'AFFICHAGE` :** 
Une popup apparaît où sont référencées toutes les images disponibles. Il est possible d'ajouter des images ou bien d'en supprimer.

![select_img_snouzdynamic](https://user-images.githubusercontent.com/32961176/75328233-fb63cf00-587d-11ea-9d2a-25c17738bdc1.JPG)

<p>&nbsp</p>

**Au clic sur l'une des images :** 
La popup de changement d'affiche se ferme automatiquement et votre tableau de bord affiche maintenant un aperçu de l'affichage **en cours sur l'emplacement préalablement sélectionné**.

![dashboard_snouzdynamic2](https://user-images.githubusercontent.com/32961176/75327285-66140b00-587c-11ea-959c-8491d9ae862e.JPG)

L'écran 1, ici, le hall d'entrée, dispose maintenant de l'affichage `affiche_pablo` qui se traduira comme ceci à l'écran :  

![affiche_pablo-1920x1080](https://user-images.githubusercontent.com/32961176/75328586-880e8d00-587e-11ea-830b-63302734734a.png)
L'image prend 100% de la taille de l'écran et n'a aucune bordure, ni barre. Le seul moyen de fermé cet affichage est de cliquer sur `CHANGER L'AFFICHAGE` ou de cliquer, depuis le tableau de bord sur :
<p>&nbsp</p>

**`SUPPRIMER L'AFFICHAGE` :**   

Lors du clic sur ce bouton, le programme prendra en compte la ligne cliquée et supprimera l'affichage de cette lignée donnée. L'aperçu de la ligne reviendra à "Aucun" :

![démarrage de l'app](https://user-images.githubusercontent.com/32961176/75327633-09652000-587d-11ea-928f-876ba759ceeb.JPG)
