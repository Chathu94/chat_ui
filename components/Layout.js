import React from "react"
import { connect } from "react-redux"
const WebSocket = require('reconnecting-websocket');

import loader from 'file!../resources/loader.svg'
import { Config } from '../config.js'

import { initSocket, sendMessageSocket } from "../actions/socketActions"
import { loadAnswers, initAnswerChanges, readAnswerChange } from "../actions/answerActions"
import { loadKeywords, initKeywordChanges, readKeywordChange } from "../actions/keywordActions"
import { loadLinks, initLinkChanges, readLinkChange } from "../actions/linkActions"
import { loaderSwitch, initDataLoaded } from "../actions/globalActions"
import { loadKeywordSets, initKeywordSetChanges, readKeywordSetChange } from "../actions/keywordSetActions"
import Nav from "../components/Nav";

@connect((store) => {
  return {
    ws: store.socket.ws,
    message: store.socket.message,
    loader: store.globals.loader
  };
})
class Layout extends React.Component {

  componentWillMount() {
    this.doConnect();
    console.log( "Configs ", Config )
  }

  doConnect() {
    let dispatch = this.props.dispatch;
    this.props.dispatch(initSocket()).then( ()=>{
      this.props.dispatch( loadAnswers( { ws: this.props.ws } ) ).then( ()=>{
        this.props.dispatch( loadKeywords( { ws: this.props.ws } ) ).then( ()=>{
          this.props.dispatch( loadLinks( { ws: this.props.ws } ) ).then( ()=>{
              this.props.dispatch( loadKeywordSets( { ws: this.props.ws } ) ).then( ()=>{
                let aws = new WebSocket("ws://localhost:3001");
                this.props.dispatch( initAnswerChanges( { ws: aws } ) )
                aws.onmessage = (e) => {
                  this.props.dispatch( readAnswerChange( { msg: e.data } ) );
                }
                let kws = new WebSocket("ws://localhost:3001");
                this.props.dispatch( initKeywordChanges( { ws: kws } ) )
                kws.onmessage = (e) => {
                  this.props.dispatch( readKeywordChange( { msg: e.data } ) );
                }
                let lws = new WebSocket("ws://localhost:3001");
                this.props.dispatch( initLinkChanges( { ws: lws } ) )
                lws.onmessage = (e) => {
                  this.props.dispatch( readLinkChange( { msg: e.data } ) );
                }
                let ksws = new WebSocket("ws://localhost:3001");
                this.props.dispatch( initKeywordSetChanges( { ws: ksws } ) )
                ksws.onmessage = (e) => {
                  this.props.dispatch( readKeywordSetChange( { msg: e.data } ) );
                }
                this.props.dispatch( loaderSwitch( false ));
                this.props.dispatch( initDataLoaded( false ));
            } )
          } )
        } )
      } )
    } )
  }

  render() {
    if ( this.props.ws == null ) {
      return <button onClick={this.doConnect.bind(this)}>Connect</button>
    }
    let loaderClass= "loader animated"
    if ( this.props.loader ){
      loaderClass += " fadeIn"
    } else {
      loaderClass += " fadeOut"
    }
    const { location } = this.props;
    const containerStyle = { marginTop: "60px" };
    return  <div>
              <Nav location={location} />
              <div class="container" style={containerStyle}>
                <div class="row">
                  <div class="col-lg-12">
                    <h1>ChatBot AdminCP</h1>
                    {this.props.children}
                  </div>
                </div>
              </div>
              <div class={loaderClass}>
                <div>
                  <img src={loader} />
                  <h1>Loading.</h1>
                </div>
              </div>
            </div>
  }
}

export default Layout
