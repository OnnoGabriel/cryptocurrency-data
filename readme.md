# Cryptocurrency Data

**A Demo Web Component built with Stencil**

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

The kind of cryptocoin is set with `coin`. It can be the symbol of any coin in the Top 10 of [CoinMarketCap](https://coinmarketcap.com) (in terms of market capitalization). In the moment, these are: BTC, ETH, XRP, BCH, LTC, DASH, XEM, MIOTA, NEO and XMR.

If `show` equals USD or EUR, the component shows the rate of the coin in US-Dollar or Euro, respectively. If equals 1h, 24h or 7d, the component shows the change of the rate within the last hour, the last 24 hours or the last seven days, respectively.

You can put as many of this web component on a web page, e.g. to show different types of coin data. See `index.html`, which displays a good old HTML table containing the rates of five coins in USD and EUR.

## How does it work?

The web component calls the [JSON API of CoinMarketCap](https://coinmarketcap.com/api/) to retrieve data about 10 coins with the highest market capitalization (= most popular). This data is stored as an associative array in a `@State()` property within the web component.

To avoid unnecessary (multiple) calls to the external API, only one (the first visible) web component performs this call. Prior to this call, it emits an event to all other web components. This event prevents these other components from performing an API call for their own.

After the data is retrieved from the API, the first component emits a second event containing this data to all other components.
