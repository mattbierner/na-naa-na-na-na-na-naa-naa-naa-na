# About
*Na, Naa Na Na Na, Na Naa Naa Naa Na* is a tool for visulizing controller input while playing *Katamari Damacy*. 

### What the Hell and I Looking At?
The visualization uses controller input to draw a path in 3d, trying to approximate the movement of *Katamari Damacy*. Think etch-a-sketch, but on a sphere instead of a 2d plane. 

Press both joysticks forward, and the drawing cursor moves forward on the sphere. Press both backwards, and the cursor moves backwards.

![](https://raw.githubusercontent.com/mattbierner/na_naa-na-na-na_na-naa-naa-naa-na/gh-pages/documentation/images/forward.gif)

Press a single Joystick forward to rotate the cursor (pressing one joystick forward and one backwards rotates faster.)

![](https://raw.githubusercontent.com/mattbierner/na_naa-na-na-na_na-naa-naa-naa-na/gh-pages/documentation/images/rotate.gif)

Pressing both joysticks in a single direction but unevenly (such as the left joy stick fully forward and the right one only partially pressed forward) steers the cursor as it moves.

![](https://raw.githubusercontent.com/mattbierner/na_naa-na-na-na_na-naa-naa-naa-na/gh-pages/documentation/images/translate.gif)

Besides basic movement, the sphere the cursor is drawing on slows expands outwards over time. At the beginning of a visualization game for example, it may be drawing on a 1m sphere, which expands to a 10m sphere by the end of the game. This expansion can be controlled or even disabled using the options.

That this visualization only considers input, not game context. The Katamaris in game have momentum and are effected by the game world, all of which is ignored here.

