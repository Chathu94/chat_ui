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
      kchanges: store.keyword.changes,
    }
  };
})
export default class index extends React.Component {
  constructor() {
    super()
  }

  render() {
    return  <h1>This is not really here.</h1>;
  }
}
