import { combineReducers } from "redux";

import socket from "./socketReducer"
import answer from "./answerReducer"
import keyword from "./keywordReducer"
import link from "./linkReducer"
import globals from "./globalReducer"
import keyword_set from "./keywordSetReducer"

export default combineReducers({
  socket,
  answer,
  keyword,
  keyword_set,
  link,
  globals,
})
