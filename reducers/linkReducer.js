import $ from "jquery"
import notify from "bootstrap-notify"

import { readlinkChange } from "../actions/linkActions"

export default function reducer ( state={
                                          links: [],
                                          busy: false,
                                          ws: null,
                                          changes: null,
                                        }, action ) {
  switch ( action.type ){
    case "LINK_CHANGE_READ": {
      try {
        let obj = JSON.parse( action.payload );
        if ( obj != null && obj.type != null ){
          switch( obj.type ){
            case "update": {
              let lnka = [];
              state.links.forEach( (link)=>{
                if ( link.id == obj.data.id ){
                  lnka.push( { id: obj.data.id, answer: obj.data.answer, keyword: obj.data.keyword } );
                } else {
                  lnka.push( link );
                }
              } );
              return { ...state, links: lnka }
              break;
            }
            case "delete": {
              let lnka = [];
              state.links.forEach( (link)=>{
                if ( link.id != obj.data.id ){
                  lnka.push( link );
                } else {
                  console.log( link )
                }
              } );
              return { ...state, links: lnka }
              break;
            }
            case "insert": {
              let lnka = state.links;
              lnka.push( { id: obj.data.id, answer: obj.data.answer, keyword: obj.data.keyword } );
              return { ...state, links: lnka }
              break;
            }
          }
        }
      } catch(e) {
        $.notify({
          icon: 'glyphicon glyphicon-warning-sign',
          message: e.message
        },{
          type: 'danger'
        });
      }
      break;
    }
    case "LINK_CHANGE_FULFILLED": {
      action.payload.send( JSON.stringify( { type: "LINKS" } ) );
      return { ...state, changes: action.payload }
      break;
    }
    case "LINK_MESSAGE_FULFILLED": {
      let links = [];
      try {
        let obj = JSON.parse( action.payload );
        if ( obj.error != false ){
          $.notify({
          	icon: 'glyphicon glyphicon-warning-sign',
          	message: obj.error
          },{
          	type: 'danger'
          });
          break;
        }
        if ( obj != null && obj.rows != null && typeof( obj.rows ) == "object" ){
          links = obj.rows;
        }
      } catch(e) {
        links = null;
        $.notify({
          icon: 'glyphicon glyphicon-warning-sign',
          message: e.message
        },{
          type: 'danger'
        });
        break;
      }
      return { ...state, busy: false, links: links }
      break;
    }
    case "LINK_UPDATE_FULFILLED": {
      try {
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
            icon: 'glyphicon glyphicon-info-sign',
            message: "Links #" + obj.data.id + " Updated!"
          },{
            type: 'success'
          });
          return { ...state, busy: false }
        }
      } catch(e) {
        $.notify({
          icon: 'glyphicon glyphicon-warning-sign',
          message: e.message
        },{
          type: 'danger'
        });
      }
      break;
    }
    case "DELETE_LINK_FULFILLED": {
      try {
        let obj = JSON.parse( action.payload );
        console.log(obj)
        if ( obj.error != false ){
          $.notify({
            icon: 'glyphicon glyphicon-warning-sign',
            message: obj.error
          },{
            type: 'danger'
          });
          break;
        } else {
          $.notify({
            icon: 'glyphicon glyphicon-info-sign',
            message: "Link #" + obj.data.id + " Deleted!"
          },{
            type: 'success'
          });
          break;
        }
      } catch(e) {
        $.notify({
          icon: 'glyphicon glyphicon-warning-sign',
          message: e.message
        },{
          type: 'danger'
        });
      }
      break;
    }
    case "LINK_ADD_FULFILLED": {
      try {
        let obj = JSON.parse( action.payload.load );
        if ( obj.error != false ){
          $.notify({
            icon: 'glyphicon glyphicon-warning-sign',
            message: obj.error
          },{
            type: 'danger'
          });
          break;
        } else {
          /*$.notify({
            icon: 'glyphicon glyphicon-info-sign',
            message: "Link '" + obj.data + "' Added!"
          },{
            type: 'success'
          });*/
          //console.log( obj.data );
          break;
        }
      } catch(e) {
        $.notify({
          icon: 'glyphicon glyphicon-warning-sign',
          message: e.message
        },{
          type: 'danger'
        });
      }
      break;
    }
    case "LINK_ADD_REJECTED": {
      $.notify({
        icon: 'glyphicon glyphicon-warning-sign',
        message: action.payload
      },{
        type: 'danger'
      });
      break;
    }
    case "LINK_DELETE_REJECTED": {
      $.notify({
        icon: 'glyphicon glyphicon-warning-sign',
        message: action.payload
      },{
        type: 'danger'
      });
      break;
    }
    case "LINK_UPDATE_REJECTED": {
      $.notify({
        icon: 'glyphicon glyphicon-warning-sign',
        message: action.payload
      },{
        type: 'danger'
      });
      break;
    }
    case "LINK_MESSAGE_REJECTED": {
      $.notify({
        icon: 'glyphicon glyphicon-warning-sign',
        message: action.payload
      },{
        type: 'danger'
      });
      break;
    }
  }
  return state;
}
