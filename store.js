import { applyMiddleware, createStore } from "redux"
import logger from "redux-logger"
import thunk from "redux-thunk"
import promise from "redux-promise-middleware"

import reducer from "./reducers"

import { initSocket } from "./actions/socketActions"

const middleware = applyMiddleware( promise(), thunk, logger() );
const store = createStore( reducer, middleware );

export default createStore(reducer, middleware)

//store.dispatch( { type: "SEARCH", payload: "Has" } );
/*
const initialState = {
  ws: null,
  busy: true,
  loaded: false,
  cards: [],
  error: null
};

const reducer = (state=initialState, action)=>{
  switch ( action.type ){

    case "SEARCH": {
      if ( ! state.busy ){
        console.log( "Not Busy" );
        setTimeout( ()=>{ store.dispatch( {
          type: "SEARCH",
          payload: new Promise( (resolove, reject) => {
            try {
              state.ws.send(JSON.stringify( {
                cmd: "SEARCH",
                data: {
                  term: action.payload
                }
              }));
              state.ws.onmessage = (event)=>{
                console.log(event.data);
                if (typeof (event.data) === "string" ){
                  //let test = JSON.stringify( { test: "test string" } );
                  //console.log( JSON.parse( event.data ) );
                } else {
                  console.log ( typeof (event.data) );
                }
              };
            } catch(e) {
              reject( e );
            }
          } )
        }) }, 0 );
      } else {
        console.log( "WS Busy. Retrying in 2 secs." )
        setTimeout( ()=>{ store.dispatch( {
          type: "SEARCH",
          payload: action.payload
        } ); }, 1000 );
      }
      return { ...state };
    }
    case "SEARCH_PENDING": {

      return { ...state, busy: true };
    }
    case "SEARCH_FULFILLED": {
      console.log( "acp" );
      console.log( action.payload );
      return { ...state, busy: false };
    }
    case "SOCKET_MESSAGE": {
      console.log( action.payload );
      return { ...state, busy: false };
    }
    case "SOCKET_INIT_PENDING": {
      console.log( action.payload );
      return { ...state, busy: true, ws: null };
    }
    case "SOCKET_INIT_FULFILLED": {
      console.log( action.payload );
      return { ...state, busy: false, ws: action.payload };
    }
    case "SOCKET_INIT_REJECTED": {
      console.log( action.payload );
      return { ...state, busy: true, error: action.payload };
    }
  }
  return state;
}
*/
