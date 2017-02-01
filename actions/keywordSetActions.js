
export function readKeywordSetChange( { msg } ){
  return function( dispatch ) {
    return dispatch( {
      type: "KEYWORD_SET_CHANGE_READ",
      payload: msg
    } )
  }
}

export function initKeywordSetChanges( { ws } ){
  return function( dispatch ) {
    return dispatch( {
      type: "KEYWORD_SET_CHANGE",
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
            reject( new Error( "initKeywordSetChanges() failed!" ) );
          }
        } catch(e) {
          reject( e.message );
        }
      } )
    });
  }
}

export function loadKeywordSets( { ws } ){
    return function( dispatch ) {
      return dispatch( {
        type: "KEYWORD_SET_MESSAGE",
        payload: new Promise( (resolove, reject) => {
          let timer = setTimeout( ()=>{ reject( "loadKeywordSets() Timeout!" ) }, 5000 );
          ws.onmessage = (e) => {
            clearTimeout( timer );
            resolove( e.data );
          }
          if ( ws != null ){
            ws.send( JSON.stringify( { type: "LIST_KEYWORD_SET" } ) );
          } else {
            reject( "loadKeywordSets() Fail!" );
          }
        } )
      });
    }
}

export function updateKeywordSet( { id, iden, keyword_set, ws } ){
  return function( dispatch ) {
    return dispatch( {
      type: "KEYWORD_SET_UPDATE",
      payload: new Promise( (resolove, reject) => {
        let timer = setTimeout( ()=>{ reject( "updateKeywordSet() Timeout!" ) }, 5000 );
        ws.onmessage = (e) => {
          clearTimeout( timer );
          resolove( e.data );
        }
        if ( ws != null ){
          ws.send( JSON.stringify( { type: "EDIT_KEYWORD_SET", data: { keyword_set: keyword_set, id: id, iden: iden } } ) );
        } else {
          reject( "updateKeywordSet() Fail!" );
        }
      } )
    });
  }
}

export function deleteKeywordSet( { id, ws } ){
  return function( dispatch ) {
    return dispatch( {
      type: "KEYWORD_SET_DELETE",
      payload: new Promise( (resolove, reject) => {
        let timer = setTimeout( ()=>{ reject( "deleteKeywordSet() Timeout!" ) }, 5000 );
        ws.onmessage = (e) => {
          clearTimeout( timer );
          resolove( e.data );
        }
        if ( ws != null ){
          ws.send( JSON.stringify( { type: "DELETE_KEYWORD_SET", data: { id: id } } ) );
        } else {
          reject( "deleteKeywordSet() Fail!" );
        }
      } )
    });
  }
}

export function addKeywordSet( { iden, keywords, ws } ){
  return function( dispatch ) {
    return dispatch( {
      type: "KEYWORD_SET_ADD",
      payload: new Promise( (resolove, reject) => {
        let timer = setTimeout( ()=>{ reject( "addKeywordSet() Timeout!" ) }, 5000 );
        ws.onmessage = (e) => {
          clearTimeout( timer );
          resolove( { load: e.data} );
        }
        if ( ws != null ){
          ws.send( JSON.stringify( { type: "ADD_KEYWORD_SET", data: { keywords: keywords, iden: iden } } ) );
        } else {
          reject( "addKeywordSet() Fail!" );
        }
      } )
    });
  }
}
