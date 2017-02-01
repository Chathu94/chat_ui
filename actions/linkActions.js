
export function readLinkChange( { msg } ){
  return function( dispatch ) {
    return dispatch( {
      type: "LINK_CHANGE_READ",
      payload: msg
    } )
  }
}

export function initLinkChanges( { ws } ){
  return function( dispatch ) {
    return dispatch( {
      type: "LINK_CHANGE",
      payload: new Promise( (resolove, reject) => {
        try {
          ws.binaryType = "arrayBuffer";
          ws.onopen = () => {
            resolove( ws );
          };
          ws.onclose = (event)=>{
            reject( new Error( event.code ) );
          }
          ws.onerror = () => {
            reject( new Error( "initLinkChanges() failed!" ) );
          }
        } catch(e) {
          reject( e.message );
        }
      } )
    });
  }
}

export function loadLinks( { ws } ){
    return function( dispatch ) {
      return dispatch( {
        type: "LINK_MESSAGE",
        payload: new Promise( (resolove, reject) => {
          let timer = setTimeout( ()=>{ reject( "loadLinks() Timeout!" ) }, 5000 );
          ws.onmessage = (e) => {
            clearTimeout( timer );
            resolove( e.data );
          }
          if ( ws != null ){
            ws.send( JSON.stringify( { type: "LIST_LINK" } ) );
          } else {
            reject( "loadLinks() Fail!" );
          }
        } )
      });
    }
}
/*
export function updateAnswer( { id, answer, ws } ){
  return function( dispatch ) {
    return dispatch( {
      type: "ANSWER_UPDATE",
      payload: new Promise( (resolove, reject) => {
        let timer = setTimeout( ()=>{ reject( "updateAnswer() Timeout!" ) }, 5000 );
        ws.onmessage = (e) => {
          clearTimeout( timer );
          resolove( e.data );
        }
        if ( ws != null ){
          ws.send( JSON.stringify( { type: "EDIT_ANSWER", data: { answer: answer, id: id } } ) );
        } else {
          reject( "updateAnswer() Fail!" );
        }
      } )
    });
  }
}*/

export function deleteLink( { id, ws } ){
  return function( dispatch ) {
    return dispatch( {
      type: "DELETE_LINK",
      payload: new Promise( (resolove, reject) => {
        let timer = setTimeout( ()=>{ reject( "deleteLink() Timeout!" ) }, 5000 );
        ws.onmessage = (e) => {
          clearTimeout( timer );
          resolove( e.data );
        }
        if ( ws != null ){
          ws.send( JSON.stringify( { type: "DELETE_LINK", data: { id: id } } ) );
        } else {
          reject( "deleteLink() Fail!" );
        }
      } )
    });
  }
}

export function addLink( { answers, keywords, ws } ){
  return function( dispatch ) {
    return dispatch( {
      type: "LINK_ADD",
      payload: new Promise( (resolove, reject) => {
        let timer = setTimeout( ()=>{ reject( "addLink() Timeout!" ) }, 5000 );
        ws.onmessage = (e) => {
          clearTimeout( timer );
          resolove( { load: e.data} );
        }
        if ( ws != null ){
          ws.send( JSON.stringify( { type: "ADD_LINK", data: { answers: answers, keywords: keywords } } ) );
        } else {
          reject( "addLink() Fail!" );
        }
      } )
    });
  }
}
