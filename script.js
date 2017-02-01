import React from "react"
import ReactDOM from "react-dom"
import { Provider } from "react-redux"
import { Router, Route, IndexRoute, hashHistory } from "react-router";

import Layout from "./components/Layout"
import answerView from "./controllers/answerView"
import keywordView from "./controllers/keywordView"
import linksView from "./controllers/linksView"
import answerSetView from "./controllers/answerSetView"
import keywordSetView from "./controllers/keywordSetView"

import store from "./store"

const app = document.getElementById('app')

ReactDOM.render(
  <Provider store={store}>
    <Router history={hashHistory}>
      <Route path="/" component={Layout}>
        <IndexRoute component={linksView}></IndexRoute>
        <Route path="answers" name="Answers" component={answerView}></Route>
        <Route path="keywords" name="Keywords" component={keywordView}></Route>
        <Route path="answer-set" name="Answers Sets" component={answerSetView}></Route>
        <Route path="keyword-set" name="Keyword Sets" component={keywordSetView}></Route>
      </Route>
    </Router>
  </Provider>,
app);
