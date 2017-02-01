import React from "react"
import { connect } from "react-redux"
import $ from "jquery"
import selectize from "selectize"
import notify from "bootstrap-notify"

import { loadAnswers, addAnswer, initAnswerChanges, readAnswerChange } from "../actions/answerActions"
import { loadKeywords, addKeyword, initKeywordChanges, readKeywordChange } from "../actions/keywordActions"
import { addLink } from "../actions/linkActions"
import Selector from "../components/Selector"

@connect((store) => {
  return {
    data: {
      answers: store.answer.answers,
      ws: store.socket.ws,
      keywords: store.keyword.keywords,
      links: store.link.links,
      initial_done: store.globals.initialDataLoaded,
    }
  };
})
export default class index extends React.Component {
  constructor() {
    super()
  }

  checkAll(){
    let answers = this.refs.answers.refs.selector.value;
    let keywords = this.refs.keywords.refs.selector.value;
    if ( answers == "" ){
      $.notify({
        icon: 'glyphicon glyphicon-warning-sign',
        message: "Answers cannot be empty!"
      },{
        type: 'danger'
      });
      return;
    }
    if ( keywords == "" ){
      $.notify({
        icon: 'glyphicon glyphicon-warning-sign',
        message: "Keywords cannot be empty!"
      },{
        type: 'danger'
      });
      return;
    }
    this.props.dispatch( addLink( { answers: answers, keywords: keywords, ws: this.props.data.ws } ) )
  }

  render() {
    console.error( this.props.data.links )
    return  <div class="row form-horizontal">
              <div class="form-group">
                <div class="col-md-6 col-sm-6">
                  <Selector options={this.props.data.answers} ref="answers" id="id" value="answer" initial_done={this.props.data.initial_done} />
                </div>
                <div class="col-md-6 col-sm-6">
                  <Selector options={this.props.data.keywords} ref="keywords" id="id" value="keyword" initial_done={this.props.data.initial_done} />
                </div>
              </div>
              <div class="form-group">
                <div class="col-md-12 col-sm-12 text-right">
                  <button class="btn btn-success" onClick={this.checkAll.bind(this)}>
                    <span class="glyphicon glyphicon-check"></span>
                    &nbsp;&nbsp;Link
                  </button>
                </div>
              </div>
            </div>;
  }
}
