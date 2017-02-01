
export function loaderSwitch( enable ){
  return function( dispatch ) {
    return dispatch( {
      type: "LOADER_SWITCH",
      payload: enable
    });
  }
}

export function initDataLoaded(){
  return function( dispatch ) {
    return dispatch( {
      type: "INIT_DATA_LOADED",
      payload: null
    });
  }
}
