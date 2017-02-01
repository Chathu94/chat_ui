
export function readKeywordChange( { msg } ){
  return function( dispatch ) {
    return dispatch( {
      type: "KEYWORD_CHANGE_READ",
      payload: msg
    } )
  }
}

export function initKeywordChanges( { ws } ){
  return function( dispatch ) {
    return dispatch( {
      type: "KEYWORD_CHANGE",
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
            reject( new Error( "initChanges() failed!" ) );
          }
        } catch(e) {
          reject( e.message );
        }
      } )
    });
  }
}

export function loadKeywords( { ws } ){
    return function( dispatch ) {
      return dispatch( {
        type: "KEYWORD_MESSAGE",
        payload: new Promise( (resolove, reject) => {
          let timer = setTimeout( ()=>{ reject( "loadKeywords() Timeout!" ) }, 5000 );
          ws.onmessage = (e) => {
            clearTimeout( timer );
            resolove( e.data );
          }
          if ( ws != null ){
            ws.send( JSON.stringify( { type: "LIST_KEYWORD" } ) );
          } else {
            reject( "loadKeywords() Fail!" );
          }
        } )
      });
    }
}

export function updateKeyword( { id, keyword, ws } ){
  return function( dispatch ) {
    return dispatch( {
      type: "KEYWORD_UPDATE",
      payload: new Promise( (resolove, reject) => {
        let timer = setTimeout( ()=>{ reject( "updateKeyword() Timeout!" ) }, 5000 );
        ws.onmessage = (e) => {
          clearTimeout( timer );
          resolove( e.data );
        }
        if ( ws != null ){
          ws.send( JSON.stringify( { type: "EDIT_KEYWORD", data: { keyword: keyword, id: id } } ) );
        } else {
          reject( "updateKeyword() Fail!" );
        }
      } )
    });
  }
}

export function deleteKeyword( { id, ws } ){
  return function( dispatch ) {
    return dispatch( {
      type: "KEYWORD_DELETE",
      payload: new Promise( (resolove, reject) => {
        let timer = setTimeout( ()=>{ reject( "deleteKeyword() Timeout!" ) }, 5000 );
        ws.onmessage = (e) => {
          clearTimeout( timer );
          resolove( e.data );
        }
        if ( ws != null ){
          ws.send( JSON.stringify( { type: "DELETE_KEYWORD", data: { id: id } } ) );
        } else {
          reject( "deleteKeyword() Fail!" );
        }
      } )
    });
  }
}

export function addKeyword( { keyword, ws } ){
  return function( dispatch ) {
    return dispatch( {
      type: "KEYWORD_ADD",
      payload: new Promise( (resolove, reject) => {
        let timer = setTimeout( ()=>{ reject( "addKeyword() Timeout!" ) }, 5000 );
        ws.onmessage = (e) => {
          clearTimeout( timer );
          resolove( { load: e.data} );
        }
        if ( ws != null ){
          ws.send( JSON.stringify( { type: "ADD_KEYWORD", data: { keyword: keyword } } ) );
        } else {
          reject( "addKeyword() Fail!" );
        }
      } )
    });
  }
}

export function searchKeyword( { keyword } ){
  return function( dispatch ) {
    return dispatch( {
      type: "KEYWORD_SEARCH",
      payload: keyword
    });
  }
}
