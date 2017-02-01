import $ from "jquery"
import notify from "bootstrap-notify"

import { readChange } from "../actions/keywordSetActions"

export default function reducer ( state={
                                          keyword_set: [],
                                          busy: false,
                                          changes: null,
                                        }, action ) {
  switch ( action.type ){
    case "KEYWORD_SET_CHANGE_READ": {
      try {
        let obj = JSON.parse( action.payload );
        if ( obj != null && obj.type != null ){
          switch( obj.type ){
            case "update": {
              let kwsa = [];
              state.keyword_set.forEach( (keyword_set)=>{
                if ( keyword_set.id == obj.data.id ){
                  kwsa.push( { id: obj.data.id, iden: obj.data.iden, keywords: obj.data.keywords } );
                } else {
                  kwsa.push( keyword_set );
                }
              } );
              return { ...state, keyword_set: kwsa }
              break;
            }
            case "delete": {
              let kwsa = [];
              state.keyword_set.forEach( (keyword)=>{
                if ( keyword_set.id != obj.data.id ){
                  kwsa.push( keyword_set );
                }
              } );
              return { ...state, keyword_set: kwsa }
              break;
            }
            case "insert": {
              let kwsa = state.keyword_set;
              kwsa.push( { id: obj.data.id, iden: obj.data.iden, keywords: obj.data.keywords } );
              return { ...state, keyword_set: kwsa }
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
    case "KEYWORD_SET_CHANGE_FULFILLED": {
      action.payload.send( JSON.stringify( { type: "KEYWORDS" } ) );
      return { ...state, changes: action.payload }
      break;
    }
    case "KEYWORD_SET_MESSAGE_FULFILLED": {
      let keyword_set = [];
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
          keyword_set = obj.rows;
        }
      } catch(e) {
        keyword_set = null;
        $.notify({
          icon: 'glyphicon glyphicon-warning-sign',
          message: e.message
        },{
          type: 'danger'
        });
        break;
      }
      return { ...state, keyword_set: keyword_set }
      break;
    }
    case "KEYWORD_SET_UPDATE_FULFILLED": {
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
            message: "Keywords #" + obj.data.id + " Updated!"
          },{
            type: 'success'
          });
          return { ...state }
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
    case "KEYWORD_SET_DELETE_FULFILLED": {
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
        } else {
          $.notify({
            icon: 'glyphicon glyphicon-info-sign',
            message: "Keyword #" + obj.data.id + " Deleted!"
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
    case "KEYWORD_SET_ADD_FULFILLED": {
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
          $.notify({
            icon: 'glyphicon glyphicon-info-sign',
            message: "Keyword #" + obj.data.id + " Added!"
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
    case "KEYWORD_SET_ADD_REJECTED": {
      $.notify({
        icon: 'glyphicon glyphicon-warning-sign',
        message: action.payload
      },{
        type: 'danger'
      });
      break;
    }
    case "KEYWORD_SET_DELETE_REJECTED": {
      $.notify({
        icon: 'glyphicon glyphicon-warning-sign',
        message: action.payload
      },{
        type: 'danger'
      });
      break;
    }
    case "KEYWORD_SET_UPDATE_REJECTED": {
      $.notify({
        icon: 'glyphicon glyphicon-warning-sign',
        message: action.payload
      },{
        type: 'danger'
      });
      break;
    }
    case "KEYWORD_SET_MESSAGE_REJECTED": {
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
