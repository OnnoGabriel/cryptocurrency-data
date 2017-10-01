import { Component, State, Prop, Event, EventEmitter, Listen } from '@stencil/core';

@Component({
  tag: 'cryptocurrency-data'
})
export class CryptocurrencyData {

  // Type of coin, e.g. BTC, LTC, ETH
  @Prop() coin: string;
  // Type of data to show, valid values: USD, EUR, 1h, 24h, 1d
  @Prop() show: string;

  // Coin data received from CoinMarketCap JSON API
  @State() coinData: any;
  // Timestamp of last update of coin data
  @State() lastUpdateTimestamp:number = 0;
  // API already called by an other web component?
  @State() apiHasCalled:boolean = false;

  // Event that the API has been called
  @Event() ccd_apiCalled: EventEmitter;
  // Event containing coin data
  @Event() ccd_coinData: EventEmitter;

  /**
   * The component will load but has not rendered yet.
   */
  componentWillLoad() {

    if (this.coinData === undefined) {
      this.fetchCoinData();
    }

  }

  /**
   * Listening to body-wide event "ccd_apiCalled"
   * If this event is received, this web component instance will avoid an API call
   * Instead, it will wait for coinData to be submitted by another event (see below)
   */
  @Listen('body:ccd_apiCalled')
  apiCalledHandler() {
    this.apiHasCalled = true;
    // console.log('Received event from ', event.detail);
  }

  /**
   * Listening to body-wide event "ccd_coinData"
   * Receives coinData from another web component instance
   */
  @Listen('body:ccd_coinData')
  coinDataHandler(event: CustomEvent) {
    this.coinData = event.detail;
    // console.log('Received data from ', event.detail);
  }

  /**
   * Triggers the API call, if no other web component already did
   * and if the last API call is older than 300s
   */
  fetchCoinData():void {
    // check, if other web component did already an API call and if last update is older than 300 sec
    if (this.apiHasCalled === false && this.lastUpdateTimestamp <  Date.now() - 1000*300) {
      // get data from API
      this.getDataFromAPI().then(data => {
        // Store reveiced data in @State element coinData
        this.coinData = data;
        // Submit data via body-wide event to other web components
        this.ccd_coinData.emit( data );
      }).catch(err => {
        console.log(err);
      })

      // Get new last update timestamp
      this.lastUpdateTimestamp =  Date.now();
    }
  }


  /**
   * Fetches coin data from CoinMarketCap JSON API
   * See https://coinmarketcap.com/api/ for details on the API
   */
  getDataFromAPI(): Promise<any> {

    // Submit ccd_apiCalled event to let other web components know
    // that the API call is on its way
    this.ccd_apiCalled.emit( this.lastUpdateTimestamp );

    return new Promise(function (resolve, reject) {
        let _url:string = "https://api.coinmarketcap.com/v1/ticker/?convert=EUR&limit=10";
        let _request = new XMLHttpRequest();
        _request.open('GET', _url);

        _request.onload = function () {
            if (_request.status == 200) {
                resolve(JSON.parse(_request.response));
            } else {
                reject(Error(_request.statusText));
            }
        };

        _request.onerror = function () {
            reject(Error('Network Error'));
        };

        _request.send();
    });
  }


  /**
   * Renders the web component
   */
  render() {
    if (this.coinData === undefined || this.coin === undefined) {
      return( <span>(no data)</span> );
    }

    let _data = this.coinData.find(dat => dat.symbol === this.coin.toUpperCase());

    if (this.show === undefined || this.show.toUpperCase() === 'USD') {
      let _price:number = Math.round(parseFloat(_data.price_usd) * 100) / 100;
      return ( <span>{_price}&nbsp;USD</span> );
    } else if (this.show.toUpperCase() === 'EUR') {
      let _price:number = Math.round(parseFloat(_data.price_eur) * 100) / 100;
      return ( <span>{_price}&nbsp;EUR</span> );
    } else if (this.show.toLowerCase() === '1h') {
      let _change:number = Math.round(parseFloat(_data.percent_change_1h) * 10) / 10;
      return ( <span>{_change}%</span> );
    } else if (this.show.toLowerCase() === '24h') {
      let _change:number = Math.round(parseFloat(_data.percent_change_24h) * 10) / 10;
      return ( <span>{_change}%</span> );
    } else if (this.show.toLowerCase() === '7d') {
      let _change:number = Math.round(parseFloat(_data.percent_change_7d) * 10) / 10;
      return ( <span>{_change}%</span> );
    } else {
      return( <span>(what?)</span> );
    }

  }

  makeFakeData() {
    this.coinData = [
      {
        "id": "bitcoin",
        "name": "Bitcoin",
        "symbol": "BTC",
        "rank": "1",
        "price_usd": "4181.98",
        "price_btc": "1.0",
        "24h_volume_usd": "2133970000.0",
        "market_cap_usd": "69230638094.0",
        "available_supply": "16554512.0",
        "total_supply": "16554512.0",
        "percent_change_1h": "-0.19",
        "percent_change_24h": "-3.09",
        "percent_change_7d": "-8.97",
        "last_updated": "1504970083",
        "price_eur": "3474.27188856",
        "24h_volume_eur": "1772842524.84",
        "market_cap_eur": "57514875670.0"
      },
      {
        "id": "ethereum",
        "name": "Ethereum",
        "symbol": "ETH",
        "rank": "2",
        "price_usd": "292.045",
        "price_btc": "0.0679337",
        "24h_volume_usd": "828205000.0",
        "market_cap_usd": "27604242580.0",
        "available_supply": "94520511.0",
        "total_supply": "94520511.0",
        "percent_change_1h": "-0.03",
        "percent_change_24h": "-1.97",
        "percent_change_7d": "-15.96",
        "last_updated": "1504970073",
        "price_eur": "242.62280874",
        "24h_volume_eur": "688049524.26",
        "market_cap_eur": "22932831817.0"
      },
      {
        "id": "bitcoin-cash",
        "name": "Bitcoin Cash",
        "symbol": "BCH",
        "rank": "3",
        "price_usd": "549.375",
        "price_btc": "0.127792",
        "24h_volume_usd": "410192000.0",
        "market_cap_usd": "9103102547.0",
        "available_supply": "16569925.0",
        "total_supply": "16569925.0",
        "percent_change_1h": "-0.32",
        "percent_change_24h": "-7.82",
        "percent_change_7d": "-5.45",
        "last_updated": "1504970124",
        "price_eur": "456.4053675",
        "24h_volume_eur": "340776028.224",
        "market_cap_eur": "7562602709.0"
      },
      {
        "id": "ripple",
        "name": "Ripple",
        "symbol": "XRP",
        "rank": "4",
        "price_usd": "0.20821",
        "price_btc": "0.00004843",
        "24h_volume_usd": "88870200.0",
        "market_cap_usd": "7983571318.0",
        "available_supply": "38343841883.0",
        "total_supply": "99994523265.0",
        "percent_change_1h": "-0.06",
        "percent_change_24h": "-1.84",
        "percent_change_7d": "-8.29",
        "last_updated": "1504970043",
        "price_eur": "0.1729750381",
        "24h_volume_eur": "73830873.7944",
        "market_cap_eur": "6632527511.0"
      },
      {
        "id": "litecoin",
        "name": "Litecoin",
        "symbol": "LTC",
        "rank": "5",
        "price_usd": "65.3684",
        "price_btc": "0.0152056",
        "24h_volume_usd": "751571000.0",
        "market_cap_usd": "3455102827.0",
        "available_supply": "52855857.0",
        "total_supply": "52855857.0",
        "percent_change_1h": "0.32",
        "percent_change_24h": "-5.21",
        "percent_change_7d": "-15.62",
        "last_updated": "1504970044",
        "price_eur": "54.3062364048",
        "24h_volume_eur": "624384142.812",
        "market_cap_eur": "2870402686.0"
      }
    ];
  }

}
