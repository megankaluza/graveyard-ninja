
# _Graveyard Ninja: Apocolypse!_

#### _09-1-2016_

#### By _**Caleb Paul, Megan Kaluza, Molly LeCompte, Zachary Matthewstearn**_

## Description

![screenshot](img/screenshot.png)

_Graveyard Ninja: Apocolypse! is a game where the player controls a ninja, and attempts to traverse obstacles in order to reach a goal._

_The game renders on an HTML5 canvas element, and features 3 full sprite sheet animations (idle, run, and jump), thematically appropriate background design, and original music (composed by Caleb Paul)._

## Setup/Installation Requirements

* _Clone this repository (https://github.com/megankaluza/graveyard-ninja.git) to your desktop_
* _Open index.html in the browser of your choosing_

* _Alternatively, navigate to (https://megankaluza.github.io/graveyard-ninja/)_

## Known Bugs

_Game is not scaleable as canvas size is fixed, site is optimized for large desktop screens_
_Collision with certain game objects occasionally triggers a 'double jump'_

## Specifications
* On page load:
    - Site opens to a start screen in a canvas element
    - Music plays on a 90 sec loop
    - Start button loads
    - Instructions for game controls load in a column to the right of canvas element
* On start press:
    - canvas element loads
    - player can move, jump, and interact with game environment
    - contact pits and spikes, trigger player death
    - contact with kunai (goal item), triggers player win
* On player death:
    - Game hides canvas, and shows div with 'lose screen'
    - game plays audio of a scream
* On player win:
  - Game hides canvas, and shows div with 'win screen'
  - Game plays a 'win' sound

## Support and contact details

_Caleb Paul: @calebpaulmusic_

_Megan Kaluza: megan.kaluza@gmail.com_

_Molly LeCompte: mollyklecompte@gmail.com_

_Zachary Matthewstearn: zammo911@gmail.com_



## Technologies Used

_Bootstrap_
_HTML5 Canvas_
_Javascript_
_jQuery_
_Garage Band_

### License
*Art assets sourced from http://www.gameart2d.com/*

*This webpage is licensed under the GPL license.*

Copyright (c) 2016 **_Caleb Paul, Megan Kaluza, Molly LeCompte, Zachary Matthewstearn_**
