import $ from "jquery"

export default function reducer ( state={
                                          loader: true,
                                          initialDataLoaded: false
                                        }, action ) {
  switch ( action.type ){
    case "LOADER_SWITCH": {
      if( action.payload ){
        $(".loader").css('display', 'block')
      } else {
        setTimeout(function() {
            $(".loader").css('display', 'none');
        }, 1000);
      }
      return { ...state, loader: action.payload }
      break;
    }
    case "INIT_DATA_LOADED": {
      return { ...state, initialDataLoaded: true }
      break;
    }
  }
  return state;
}
