import React from "react"
import { connect } from "react-redux"
import { Model } from "elemental"

import { loadAnswers, updateAnswer, deleteAnswer, addAnswer, searchAnswer, initAnswerChanges, readAnswerChange } from "../actions/answerActions"
import { loaderSwitch } from "../actions/globalActions"

@connect((store) => {
  return {
    data: {
      answers: store.answer.answers,
      ws: store.socket.ws,
      changes: store.answer.changes,
    }
  };
})
export default class answerView extends React.Component {

  constructor() {
    super();
    this.state = { answer: '', search: '', edits: [] }
  }

  answerKeyPress( e, event ){
    if(event.key == 'Enter'){
      if ( event.target.value.trim() == "" ){
        $.notify({
          icon: 'glyphicon glyphicon-warning-sign',
          message: "Cannot save empty answer"
        },{
          type: 'warning'
        });
      } else {
        let props = this.props;
        this.props.dispatch( loaderSwitch( true ));
        let loaded = ()=>{ props.dispatch( loaderSwitch( false )) }
        this.props.dispatch( updateAnswer( { id: this.props.data.answers[e].id, answer: event.target.value, ws: this.props.data.ws } ) ).then( loaded, loaded );
        let edits = this.state.edits
        edits[e] = false
        this.setState( { ...this.state, edits: edits } )
      }
    }
  }

  addKeyPress( event ){
    if(event.key == 'Enter'){
      if ( this.state.answer.trim() == "" ){
        $.notify({
          icon: 'glyphicon glyphicon-warning-sign',
          message: "Cannot add empty answer"
        },{
          type: 'warning'
        });
      } else {
        this.setState({
          ... this.state,
          answer: ""
        });
        let props = this.props;
        this.props.dispatch( loaderSwitch( true ));
        let loaded = ()=>{ props.dispatch( loaderSwitch( false )) }
        this.props.dispatch( addAnswer( { answer: this.state.answer, ws: this.props.data.ws } ) ).then( loaded, loaded );
      }
    }
  }

  answerBlur( e ){
    let cans = this.props.data.answers[e].answer;
    let uans = this.refs.answers.children[e].children[1].children[0].value;
    if ( ( uans != "" ) && ( uans != cans ) ){
      let props = this.props;
      bootbox.confirm({
        title: "Discard/Save changes #" + e,
        message: "Do you want to ignore changes or save changes answer #" + e + "?",
        buttons: {
            cancel: {
                label: '<i class="fa fa-ban"></i> Ignore',
                className: 'btn-danger'
            },
            confirm: {
                label: '<i class="fa fa-floppy-o"></i> Save',
                className: 'btn-success'
            }
        },
        callback: function (result) {
            if (result){
              let props = this.props;
              this.props.dispatch( loaderSwitch( true ));
              let loaded = ()=>{ props.dispatch( loaderSwitch( false )) }
              props.dispatch( updateAnswer( { id: props.data.answers[e].id, answer: uans, ws: props.data.ws } ) ).then( loaded, loaded );
            }
        }
      });
    }
    let edits = this.state.edits
    edits[e] = false
    this.setState( { ...this.state, edits: edits } )
  }

  EditAnswer( e ){
    let edits = this.state.edits
    edits[e] = true
    this.setState( { ...this.state, edits: edits } )
  }

  callbackDelete( e ){
    let props = this.props;
    this.props.dispatch( loaderSwitch( true ));
    let loaded = ()=>{ props.dispatch( loaderSwitch( false )) }
    this.props.dispatch( deleteAnswer( { id: this.props.data.answers[e].id, ws: this.props.data.ws } ) ).then( loaded, loaded );
  }

  updateAnswer(e){
    this.setState({
      ... this.state,
      answer: e.target.value
    });
  }

  updateSearch(e){
    this.setState({
      ... this.state,
      search: e.target.value
    });
  }

  DeleteAnswer( e ){
    let cans = this.props.data.answers[e].answer;
    let self = this;
    bootbox.confirm({
      title: "Delete Answer #" + e,
      message: "Do you want to delete answer '" + cans + "' ? This cannot be undone.",
      buttons: {
          confirm: {
              label: '<i class="fa fa-trash"></i> Delete',
              className: 'btn-danger'
          },
          cancel: {
              label: '<i class="fa fa-times"></i> Cancel',
              className: 'btn-success'
          }
      },
      callback: function (result) {
          if (result){
            self.callbackDelete( e );
          }
      }
    });
  }

  render() {
    let rows = this.props.data.answers.map( (answer, key) => {
      if ( answer != null ){
        if ( this.state.search.trim() == "" || answer.answer.match( this.state.search.trim() ) ){
          let answer_s = answer.answer;
          if ( this.state.edits[key] != null && this.state.edits[key] == true ){
            answer_s = <input class='form-control' type='text' defaultValue={answer_s} onKeyPress={this.answerKeyPress.bind(this, key)} onBlur={this.answerBlur.bind(this, key)} />
          }
          return <tr key={answer.id}>
                  <td>{answer.id}</td>
                  <td>{answer_s}</td>
                  <td class="text-right" class="b">
                    <button class="btn btn-primary" onClick={this.EditAnswer.bind(this, key)}>
                      <i class="fa fa-pencil-square-o" />
                    </button>
                    <button class="btn btn-warning" onClick={this.DeleteAnswer.bind(this, key)}>
                      <i class="fa fa-trash" />
                    </button>
                  </td>
                </tr>
        }
    } } );
    return <div class="row">
      <div class="col-md-12 col-sm-12"><h3>Answers</h3></div>
      <div class="col-md-12 col-sm-12 form-group">
        <input placeholder="Add Answer" class="form-control" type="text" value={this.state.answer} onChange={this.updateAnswer.bind(this)} onKeyPress={this.addKeyPress.bind(this)} />
      </div>
      <div class="col-md-12 col-sm-12 form-group">
        <input class="form-control" type="search" placeholder="Search" onChange={this.updateSearch.bind(this)}/>
      </div>
      <div class="col-md-12 col-sm-12 form-group" id="context" data-toggle="context" data-target="#context-menu">
        <table class="table al">
          <thead>
            <tr>
              <th>#</th>
              <th>Answer</th>
            </tr>
          </thead>
          <tbody ref="answers">
            {rows}
          </tbody>
        </table>
        <div id="context-menu">
          <ul class="dropdown-menu" role="menu">
            <li><a tabIndex="-1"><i class="fa fa-refresh"></i>&nbsp;&nbsp;Refresh</a></li>
          </ul>
        </div>
      </div>
    </div>
  }
}
