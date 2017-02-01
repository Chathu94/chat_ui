import $ from "jquery"
import notify from "bootstrap-notify"

import { readChange } from "../actions/keywordActions"

export default function reducer ( state={
                                          keywords: [],
                                          busy: false,
                                          changes: null,
                                        }, action ) {
  switch ( action.type ){
    case "KEYWORD_CHANGE_READ": {
      try {
        let obj = JSON.parse( action.payload );
        if ( obj != null && obj.type != null ){
          switch( obj.type ){
            case "update": {
              let ansa = [];
              state.keywords.forEach( (keyword)=>{
                if ( keyword.id == obj.data.id ){
                  ansa.push( { id: obj.data.id, keyword: obj.data.keyword } );
                } else {
                  ansa.push( keyword );
                }
              } );
              return { ...state, keywords: ansa }
              break;
            }
            case "delete": {
              let ansa = [];
              state.keywords.forEach( (keyword)=>{
                if ( keyword.id != obj.data.id ){
                  ansa.push( keyword );
                }
              } );
              return { ...state, keywords: ansa }
              break;
            }
            case "insert": {
              let ansa = state.keywords;
              ansa.push( { id: obj.data.id, keyword: obj.data.keyword } );
              return { ...state, keywords: ansa }
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
    case "KEYWORD_CHANGE_FULFILLED": {
      action.payload.send( JSON.stringify( { type: "KEYWORDS" } ) );
      return { ...state, changes: action.payload }
      break;
    }
    case "KEYWORD_MESSAGE_FULFILLED": {
      let keywords = [];
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
          keywords = obj.rows;
        }
      } catch(e) {
        keywords = null;
        $.notify({
          icon: 'glyphicon glyphicon-warning-sign',
          message: e.message
        },{
          type: 'danger'
        });
        break;
      }
      return { ...state, busy: false, keywords: keywords }
      break;
    }
    case "KEYWORD_UPDATE_FULFILLED": {
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
    case "KEYWORD_DELETE_FULFILLED": {
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
    case "KEYWORD_ADD_FULFILLED": {
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
            message: "Keyword '" + obj.data.keyword + "' Added!"
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
    case "KEYWORD_ADD_REJECTED": {
      $.notify({
        icon: 'glyphicon glyphicon-warning-sign',
        message: action.payload
      },{
        type: 'danger'
      });
      break;
    }
    case "KEYWORD_DELETE_REJECTED": {
      $.notify({
        icon: 'glyphicon glyphicon-warning-sign',
        message: action.payload
      },{
        type: 'danger'
      });
      break;
    }
    case "KEYWORD_UPDATE_REJECTED": {
      $.notify({
        icon: 'glyphicon glyphicon-warning-sign',
        message: action.payload
      },{
        type: 'danger'
      });
      break;
    }
    case "KEYWORD_MESSAGE_REJECTED": {
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
