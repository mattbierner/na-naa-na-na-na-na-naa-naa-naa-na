<div align="center">
    <img src="https://raw.githubusercontent.com/mattbierner/na-naa-na-na-na-na-naa-naa-naa-na/gh-pages/documentation/images/main2.png" />
    <p>Visualizing Katamari Damacy gameplay input.</p>
</div>

* [Site][site]
* [Documentation][documentation]
* [Playstation 2 Input collector][collector]


## Building and Running
The website uses [Jekyll](http://jekyllrb.com/) and [Webpack](http://webpack.github.io/) for building:

```bash
$ git checkout gh-pages
$ npm install
```

Start Jekyll with:

```bash
$ jekyll serve -w
```

Start webpack with:

```bash
$ webpack --watch
```

Main Javascript is stored in `src` and output to `js`.


# Using Your Own Data
The main page render sample game runs from *We Love Katamari*. These input data for these runs was sampled from an actual console using [Playstation 2 Input collector][collector].

To collect your own sample run, setup the Playstation 2 Input collector and run:

```bash
cd ps2_controller_collector
python collector.py my_game.data  --log
```

This will dump controller data to `my_game.data`. Next, process the input into Json using the scripts in this repo:

```bash
cd na_naa-na-na-na_na-naa-naa-naa-na
node process_data/main.js my_game.data my_game.json
```

The set of sample games is stored in `src/options` 

### Streaming
You can also stream game input data to the webpage using a websocket.

Instead of writing to a file, start a websocket server using the [Playstation 2 Input collector][collector]:

```bash
cd ps2_controller_collector
python websocket_collector.py  --log
```

Then navigate to http://mattbierner.github.io/na-naa-na-na-na-na-naa-naa-naa-na/stream

Controller input should be picked up from the websocket and displayed in real time in the browser.


[site]: http://mattbierner.github.io/na-naa-na-na-na-na-naa-naa-naa-na/
[documentation]: https://github.com/mattbierner/na-naa-na-na-na-na-naa-naa-naa-na/blob/gh-pages/documentation/about.md
[collector]: https://github.com/mattbierner/ps2_controller_collector