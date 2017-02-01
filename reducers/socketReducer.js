import $ from "jquery"
import notify from "bootstrap-notify"

import { readMessageSocket } from "../actions/socketActions"

export default function reducer ( state={
                                          ws: null,
                                          busy: true,
                                          error: null,
                                          message: "",
                                          waiting: false
                                        }, action ) {
  switch ( action.type ){
    case "SOCKET_INIT_FULFILLED": {
      action.payload.onmessage = readMessageSocket;
      return { ...state, busy: false, ws: action.payload }
      break;
    }
    case "SOCKET_MESSAGE_FULFILLED": {
      try {
        console.log(action.payload);
        let obj = JSON.parse( action.payload );
        if ( obj.error != false ){
          $.notify({
            icon: 'glyphicon glyphicon-warning-sign',
            message: obj.error
          },{
            type: 'danger'
          });
        } else {
          $.notify({
            icon: 'glyphicon glyphicon-tick',
            message: "Add '" + obj.data.answer + "' Success"
          },{
            type: 'success'
          });
        }
      } catch(e) {
        $.notify({
          icon: 'glyphicon glyphicon-warning-sign',
          message: e.message
        },{
          type: 'danger'
        });
      }

      return { ...state, busy: false, waiting: false }
      break;
    }
    case "SOCKET_MESSAGE_REJECTED": {
        $.notify({
          icon: 'glyphicon glyphicon-warning-sign',
          message: action.payload
        },{
          type: 'danger'
        });
    }
    case "SOCKET_INIT_REJECTED": {
        $.notify({
          icon: 'glyphicon glyphicon-warning-sign',
          message: action.payload
        },{
          type: 'danger'
        });
    }
  }
  return state;
}
