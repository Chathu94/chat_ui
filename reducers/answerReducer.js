import $ from "jquery"
import notify from "bootstrap-notify"

import { readChange } from "../actions/answerActions"

export default function reducer ( state={
                                          answers: [],
                                          busy: false,
                                          ws: null,
                                          changes: null,
                                        }, action ) {
  switch ( action.type ){
    case "ANSWER_CHANGE_READ": {
      try {
        let obj = JSON.parse( action.payload );
        if ( obj != null && obj.type != null ){
          switch( obj.type ){
            case "update": {
              let ansa = [];
              state.answers.forEach( (answer)=>{
                if ( answer.id == obj.data.id ){
                  ansa.push( { id: obj.data.id, answer: obj.data.answer } );
                } else {
                  ansa.push( answer );
                }
              } );
              return { ...state, answers: ansa }
              break;
            }
            case "delete": {
              let ansa = [];
              state.answers.forEach( (answer)=>{
                if ( answer.id != obj.data.id ){
                  ansa.push( answer );
                }
              } );
              return { ...state, answers: ansa }
              break;
            }
            case "insert": {
              let ansa = state.answers;
              ansa.push( { id: obj.data.id, answer: obj.data.answer } );
              return { ...state, answers: ansa }
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
    case "ANSWER_CHANGE_FULFILLED": {
      action.payload.send( JSON.stringify( { type: "ANSWERS" } ) );
      return { ...state, changes: action.payload }
      break;
    }
    case "ANSWER_INIT_FULLFILLED": {
      return { ...state, busy: false, ws: action.payload }
    }
    case "ANSWER_MESSAGE_FULFILLED": {
      let answers = [];
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
          answers = obj.rows;
        }
      } catch(e) {
        answers = null;
        $.notify({
          icon: 'glyphicon glyphicon-warning-sign',
          message: e.message
        },{
          type: 'danger'
        });
        break;
      }
      return { ...state, busy: false, answers: answers }
      break;
    }
    case "ANSWER_UPDATE_FULFILLED": {
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
            message: "Answers #" + obj.data.id + " Updated!"
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
    case "ANSWER_DELETE_FULFILLED": {
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
            message: "Answer #" + obj.data.id + " Deleted!"
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
    case "ANSWER_ADD_FULFILLED": {
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
            message: "Answer '" + obj.data.answer + "' Added!"
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
    case "ANSWER_ADD_REJECTED": {
      $.notify({
        icon: 'glyphicon glyphicon-warning-sign',
        message: action.payload
      },{
        type: 'danger'
      });
      break;
    }
    case "ANSWER_DELETE_REJECTED": {
      $.notify({
        icon: 'glyphicon glyphicon-warning-sign',
        message: action.payload
      },{
        type: 'danger'
      });
      break;
    }
    case "ANSWER_UPDATE_REJECTED": {
      $.notify({
        icon: 'glyphicon glyphicon-warning-sign',
        message: action.payload
      },{
        type: 'danger'
      });
      break;
    }
    case "ANSWER_MESSAGE_REJECTED": {
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
