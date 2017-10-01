# Cryptocurrency Data

![Built With Stencil](https://img.shields.io/badge/-Built%20With%20Stencil-16161d.svg?logo=data%3Aimage%2Fsvg%2Bxml%3Bbase64%2CPD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4KPCEtLSBHZW5lcmF0b3I6IEFkb2JlIElsbHVzdHJhdG9yIDE5LjIuMSwgU1ZHIEV4cG9ydCBQbHVnLUluIC4gU1ZHIFZlcnNpb246IDYuMDAgQnVpbGQgMCkgIC0tPgo8c3ZnIHZlcnNpb249IjEuMSIgaWQ9IkxheWVyXzEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHg9IjBweCIgeT0iMHB4IgoJIHZpZXdCb3g9IjAgMCA1MTIgNTEyIiBzdHlsZT0iZW5hYmxlLWJhY2tncm91bmQ6bmV3IDAgMCA1MTIgNTEyOyIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI%2BCjxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI%2BCgkuc3Qwe2ZpbGw6I0ZGRkZGRjt9Cjwvc3R5bGU%2BCjxwYXRoIGNsYXNzPSJzdDAiIGQ9Ik00MjQuNywzNzMuOWMwLDM3LjYtNTUuMSw2OC42LTkyLjcsNjguNkgxODAuNGMtMzcuOSwwLTkyLjctMzAuNy05Mi43LTY4LjZ2LTMuNmgzMzYuOVYzNzMuOXoiLz4KPHBhdGggY2xhc3M9InN0MCIgZD0iTTQyNC43LDI5Mi4xSDE4MC40Yy0zNy42LDAtOTIuNy0zMS05Mi43LTY4LjZ2LTMuNkgzMzJjMzcuNiwwLDkyLjcsMzEsOTIuNyw2OC42VjI5Mi4xeiIvPgo8cGF0aCBjbGFzcz0ic3QwIiBkPSJNNDI0LjcsMTQxLjdIODcuN3YtMy42YzAtMzcuNiw1NC44LTY4LjYsOTIuNy02OC42SDMzMmMzNy45LDAsOTIuNywzMC43LDkyLjcsNjguNlYxNDEuN3oiLz4KPC9zdmc%2BCg%3D%3D&colorA=16161d&style=flat-square)

## About

Cryptocurrency Data is a demo web component built with [Stencil](https://stenciljs.com/). It displays the rates and changes in rates for various cryptocoins such as Bitcoin, Ethereum etc.

This web component is a *proof of concept*. It retrieves the data from the [CoinMarketCap](https://coinmarketcap.com) API and has some basic settings, what type of data should be displayed. Moreover, multiple instances of this compoment communicate and transfer data via events to minimize the number API calls: Only one component performens the API call and submits the retrieved data to all other components.

## Installation

1. Clone this repo:

~~~~ {.bash}
git clone https://github.com/OnnoGeorg/cryptocurrency-data.git my-app
cd my-app
git remote rm origin
~~~~

2. Install all dependencies:

~~~~ {.bash}
npm install
~~~~

3. Compile and run the web component with Stencil:

~~~~ {.bash}
npm start
~~~~

This last command also starts a small web server and opens a browser to display a sample webpage containing multiple instances of this web component.


## Usage

Use the web component as folllows:

~~~~ {.html}
<cryptocurrency-data coin="BTC" show="USD"></cryptocurrency-data>
~~~~

This results e.g. in the following output:

~~~~ {.html}
4181.98 USD
~~~~

* `coin (string)` is the kind of cryptocoin. It can be any coin in the Top 10 of [CoinMarketCap](https://coinmarketcap.com) (in terms of market capitalization). Valid values are in the moment: `BTC`, `ETH`, `XRP`, `BCH`, `LTC`, `DASH`, `XEM`, `MIOTA`, `NEO` and `XMR`.

* If `show (string)` equals `USD` or `EUR`, the component shows the rate of the coin in US-Dollar or Euro, respectively.

* If `show` equals to `1h`, `24h` or `7d`, the component shows the change of the rate within the last hour, the last 24 hours or the last seven days, respectively.

You can put as many of this web component in an app or on a web page, e.g. to show different types of coin data. See `index.html`, which displays a good old HTML table containing the rates of five coins in USD and EUR.


## How does it work?

The web component calls the [JSON API of CoinMarketCap](https://coinmarketcap.com/api/) to retrieve data of the 10 coins with the highest market capitalization (= most popular). This data is stored as an associative array in a `@State()` property within the web component.

To avoid unnecessary (multiple) calls to the external API, only one (the first visible) web component performs this call. Just before the API call, this first compoment emits an event to all other web components. This event prevents these other components from performing an API call for their own.

After the data is retrieved from the API, the first component emits a second event containing this data to all other components.
