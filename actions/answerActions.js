
export function readAnswerChange( { msg } ){
  return function( dispatch ) {
    return dispatch( {
      type: "ANSWER_CHANGE_READ",
      payload: msg
    } )
  }
}

export function initAnswerChanges( { ws } ){
  return function( dispatch ) {
    return dispatch( {
      type: "ANSWER_CHANGE",
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

export function loadAnswers( { ws } ){
    return function( dispatch ) {
      return dispatch( {
        type: "ANSWER_MESSAGE",
        payload: new Promise( (resolove, reject) => {
          let timer = setTimeout( ()=>{ reject( "loadAnswers() Timeout!" ) }, 5000 );
          ws.onmessage = (e) => {
            clearTimeout( timer );
            resolove( e.data );
          }
          if ( ws != null ){
            ws.send( JSON.stringify( { type: "LIST_ANSWER" } ) );
          } else {
            reject( "loadAnswers() Fail!" );
          }
        } )
      });
    }
}

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
}

export function deleteAnswer( { id, ws } ){
  return function( dispatch ) {
    return dispatch( {
      type: "ANSWER_DELETE",
      payload: new Promise( (resolove, reject) => {
        let timer = setTimeout( ()=>{ reject( "deleteAnswer() Timeout!" ) }, 5000 );
        ws.onmessage = (e) => {
          clearTimeout( timer );
          resolove( e.data );
        }
        if ( ws != null ){
          ws.send( JSON.stringify( { type: "DELETE_ANSWER", data: { id: id } } ) );
        } else {
          reject( "deleteAnswer() Fail!" );
        }
      } )
    });
  }
}

export function addAnswer( { answer, ws } ){
  return function( dispatch ) {
    return dispatch( {
      type: "ANSWER_ADD",
      payload: new Promise( (resolove, reject) => {
        let timer = setTimeout( ()=>{ reject( "addAnswer() Timeout!" ) }, 5000 );
        ws.onmessage = (e) => {
          clearTimeout( timer );
          resolove( { load: e.data} );
        }
        if ( ws != null ){
          ws.send( JSON.stringify( { type: "ADD_ANSWER", data: { answer: answer } } ) );
        } else {
          reject( "addAnswer() Fail!" );
        }
      } )
    });
  }
}

export function searchAnswer( { keyword } ){
  return function( dispatch ) {
    return dispatch( {
      type: "ANSWER_SEARCH",
      payload: keyword
    });
  }
}
