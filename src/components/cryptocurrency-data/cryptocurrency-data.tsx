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
    // No data yet?
    if (this.coinData === undefined || this.coin === undefined) {
      return( <span>(no data)</span> );
    }

    // Get coin data of type 'this.coin' from the associative array
    let _data = this.coinData.find(dat => dat.symbol === this.coin.toUpperCase());

    if (this.show === undefined || this.show.toUpperCase() === 'USD') {
      // Show type == USD
      let _price:number = Math.round(parseFloat(_data.price_usd) * 100) / 100;
      return ( <span>{_price}&nbsp;USD</span> );
    } else if (this.show.toUpperCase() === 'EUR') {
      // Show type == EUR
      let _price:number = Math.round(parseFloat(_data.price_eur) * 100) / 100;
      return ( <span>{_price}&nbsp;EUR</span> );
    } else if (this.show.toLowerCase() === '1h') {
      // Show type == 1h (change in rate within the last hour)
      let _change:number = Math.round(parseFloat(_data.percent_change_1h) * 10) / 10;
      return ( <span>{_change}%</span> );
    } else if (this.show.toLowerCase() === '24h') {
      // Show type == 24h (change in rate within the 24 hours)
      let _change:number = Math.round(parseFloat(_data.percent_change_24h) * 10) / 10;
      return ( <span>{_change}%</span> );
    } else if (this.show.toLowerCase() === '7d') {
      // Show type == 7d (change in rate within the last 7 days)
      let _change:number = Math.round(parseFloat(_data.percent_change_7d) * 10) / 10;
      return ( <span>{_change}%</span> );
    } else {
      // Show type unknown
      return( <span>(what?)</span> );
    }

  }

}
