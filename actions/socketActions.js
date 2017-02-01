const WebSocket = require('reconnecting-websocket');

export function readMessageSocket( msg ){
  return function( dispatch ) {
    return dispatch( {
      type: "SOCKET_MESSAGE_READ",
      payload: msg.data
    } )
  }
}

export function initSocket(){
  return function( dispatch ) {
    return dispatch( {
      type: "SOCKET_INIT",
      payload: new Promise( (resolove, reject) => {
        try {
          let ws = new WebSocket("ws://localhost:3000");
          ws.binaryType = "arrayBuffer";
          ws.onopen = () => {
            resolove( ws );
          };
          ws.onclose = (event)=>{
            reject( new Error( event.code ) );
          }
          ws.onerror = () => {
            reject( new Error( "initSocket() failed!" ) );
          }
        } catch(e) {
          reject( new Error( "initSocket() failed!" ) );
        }
      } )
    });
  }
}

export function sendMessageSocket( { type, data, ws } ){
    return function( dispatch ) {
      return dispatch( {
        type: "SOCKET_MESSAGE",
        payload: new Promise( (resolove, reject) => {
          let timer = setTimeout( ()=>{ reject( "sendMessageSocket() Timeout!" ) }, 5000 );
          ws.onmessage = (e) => {
            clearTimeout( timer );
            resolove( e.data );
          }
          if ( ws != null && type != null && data != null ){
            ws.send( JSON.stringify( { type: type, data: data } ) );
          } else {
            reject( "sendMessageSocket() Fail!" );
          }
        } )
      });
    }
}
