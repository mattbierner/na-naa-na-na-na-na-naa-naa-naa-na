# About
*Na, Naa Na Na Na, Na Naa Naa Naa Na* is a tool for visualizing controller input while playing *Katamari Damacy*. 

### What the Hell and I Looking At?
The visualization uses controller input to draw a path in 3d, trying to approximate the movement of *Katamari Damacy*. Think etch-a-sketch, but on a sphere instead of a 2d plane. 

Press both joysticks forward, and the drawing cursor moves forward on the sphere. Press both backwards, and the cursor moves backwards.

![](https://raw.githubusercontent.com/mattbierner/na_naa-na-na-na_na-naa-naa-naa-na/gh-pages/documentation/images/forward.gif)

Press a single Joystick forward to rotate the cursor (pressing one joystick forward and one backwards rotates faster.)

![](https://raw.githubusercontent.com/mattbierner/na_naa-na-na-na_na-naa-naa-naa-na/gh-pages/documentation/images/rotate.gif)

Pressing both joysticks in a single direction but unevenly (such as the left joy stick fully forward and the right one only partially pressed forward) steers the cursor as it moves.

![](https://raw.githubusercontent.com/mattbierner/na_naa-na-na-na_na-naa-naa-naa-na/gh-pages/documentation/images/translate.gif)

Besides basic movement, the sphere the cursor is drawing on slows expands outwards over time. For example, at the beginning of a visualized game, the cursor may be drawing on a 1m sphere, which expands to a 10m sphere by the end of the game. This expansion can be controlled or even disabled using the options.

That this visualization only considers input, not game context. The Katamaris in game have momentum and are effected by the game world, which is ignored here.


### Playback
![](https://raw.githubusercontent.com/mattbierner/na_naa-na-na-na_na-naa-naa-naa-na/gh-pages/documentation/images/playback.gif)

Use the controls at the bottom of the screen to control the drawing of the visualization. The timeline shows where in the current game the cursor currently is. Skip to the end to view the complete path.

The playback speed control lets you speed up or slow down the visualization drawing speed. 1x is realtime, while 8x is 8 times faster than realtime.


### Options
Click the settings button in the top right corner to configure the the appearance visualization.

**Movement Damping**
Scale translation movements. Less damning means the cursor moves further with each step of drawing, while more damping makes the cursor move less at each step.

![](https://raw.githubusercontent.com/mattbierner/na_naa-na-na-na_na-naa-naa-naa-na/gh-pages/documentation/images/damping.gif)

**Edge Thickness**
How thick (as a percentage of the sphere radius) are the lines of the path?

![](https://raw.githubusercontent.com/mattbierner/na_naa-na-na-na_na-naa-naa-naa-na/gh-pages/documentation/images/thickness.gif)

**Opacity**
Total opacity of the paths. Useful for complex spheres with lots of overlap or internal detail. Try playing around with *opacity*, *edge thickness*, and *inner radius* to get some interesting results

![](https://raw.githubusercontent.com/mattbierner/na_naa-na-na-na_na-naa-naa-naa-na/gh-pages/documentation/images/opacity.gif)

**Inner Radius**
Controls the starting size of the sphere for drawing relative to the end size. Set to 100% to draw all paths on the same sphere.

![](https://raw.githubusercontent.com/mattbierner/na_naa-na-na-na_na-naa-naa-naa-na/gh-pages/documentation/images/inner-radius.gif)