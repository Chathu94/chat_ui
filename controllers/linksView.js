import React from "react"
import { connect } from "react-redux"
import { Model } from "elemental"

import { loadAnswers, addAnswer, initAnswerChanges, readAnswerChange } from "../actions/answerActions"
import { loadKeywords, addKeyword, initKeywordChanges, readKeywordChange } from "../actions/keywordActions"
import { addLink, deleteLink } from "../actions/linkActions"
import { loaderSwitch } from "../actions/globalActions"
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
export default class answerView extends React.Component {

  constructor() {
    super();
    this.state = { search: '', edits: [] }
  }

  checkAll(){
    let answers = this.refs.answers.refs.selector.value;
    this.refs.answers.clearSelector();
    let keywords = this.refs.keywords.refs.selector.value;
    this.refs.keywords.clearSelector();
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

  linkKeyPress( e, event ){
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

  linkBlur( e ){
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

  EditLink( e ){
    if ( this.state.edits[e] == null || this.state.edits[e] == false ){
      this.refs[ "answers_" + e ].enableSelector()
      this.refs[ "keywords_" + e ].enableSelector()
      let edits = this.state.edits
      edits[e] = true
      this.setState( { ...this.state, edits: edits } )
      $( this.refs[ "edit_save_" + e ].children[0] ).removeClass("fa-pencil-square-o").addClass("fa-floppy-o")
    } else {
      this.refs[ "answers_" + e ].disableSelector()
      this.refs[ "keywords_" + e ].disableSelector()
      let edits = this.state.edits
      edits[e] = false
      this.setState( { ...this.state, edits: edits } )
      $( this.refs[ "edit_save_" + e ].children[0] ).removeClass("fa-floppy-o").addClass("fa-pencil-square-o")
    }
  }

  callbackDelete( e ){
    let props = this.props;
    this.props.dispatch( loaderSwitch( true ));
    let loaded = ()=>{ props.dispatch( loaderSwitch( false )) }
    this.props.dispatch( deleteLink( { id: e, ws: this.props.data.ws } ) ).then( loaded, loaded );
  }

  updateLink(e){
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

  DeleteLink( e ){
    let clnk = this.props.data.links[e]
    let self = this;
    bootbox.confirm({
      title: "Delete Link #" + e,
      message: "Do you want to delete link #" + clnk.id + " ? This cannot be undone.",
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
            self.callbackDelete( clnk.id );
          }
      }
    });
  }

  render() {
    let rows = this.props.data.links.map( (link, key) => {
      if ( link != null ){
        let match = false;
        //console.log(link)
        link.answer.split(",").forEach( (aid)=>{
          this.props.data.answers.forEach( (a)=>{
            if ( a.id == aid ){
              if ( a.answer.match( this.state.search.trim()  ) ){
                match = true
              }
            }
          } )
        } )
        link.keyword.split(",").forEach( (kid)=>{
          this.props.data.keywords.forEach( (k)=>{
            if ( k.id == kid ){
              if ( k.keyword.match( this.state.search.trim()  ) ){
                match = true
              }
            }
          } )
        } )
        if ( match ){

          let refa = "answers_" + link.id
          let refk = "keywords_" + link.id
          let refes = "edit_save_" + link.id
          let answer_s = <Selector disabled="true" items={link.answer.split(",")} options={this.props.data.answers} ref={refa} id="id" value="answer" initial_done={this.props.data.initial_done} />
          let keyword_s = <Selector disabled="true" items={link.keyword.split(",")} options={this.props.data.keywords} ref={refk} id="id" value="keyword" initial_done={this.props.data.initial_done} />
          return <tr key={link.id}>
                  <td>{link.id}</td>
                  <td>{answer_s}</td>
                  <td>{keyword_s}</td>
                  <td class="text-right" class="b">
                    <button class="btn btn-primary" ref={refes} onClick={this.EditLink.bind(this, link.id)}>
                      <i class="fa fa-pencil-square-o" />
                    </button>
                    <button class="btn btn-warning" onClick={this.DeleteLink.bind(this, key)}>
                      <i class="fa fa-trash" />
                    </button>
                  </td>
                </tr>
        }
      }
        //console.log();
        // if ( this.state.search.trim() == "" || link.answer.match( this.state.search.trim() ) ){
        //   let answer_s = answer.answer;
        //   if ( this.state.edits[key] != null && this.state.edits[key] == true ){
        //     answer_s = <input class='form-control' type='text' defaultValue={answer_s} onKeyPress={this.answerKeyPress.bind(this, key)} onBlur={this.answerBlur.bind(this, key)} />
        //   }
        //   return <tr key={key}>
        //           <td>{answer.id}</td>
        //           <td>{answer_s}</td>
        //           <td class="text-right" class="b">
        //             <button class="btn btn-primary" onClick={this.EditLink.bind(this, key)}>
        //               <i class="fa fa-pencil-square-o" />
        //             </button>
        //             <button class="btn btn-warning" onClick={this.DeleteLink.bind(this, key)}>
        //               <i class="fa fa-trash" />
        //             </button>
        //           </td>
        //         </tr>
        // }
    } );
    return <div class="row">
      <div class="col-md-12 col-sm-12"><h3>Links</h3></div>
      <div class="col-md-12 col-sm-12"><h4>Add</h4></div>
      <div class="col-md-12 col-sm-12">
        <div class="row form-horizontal">
          <div class="form-group">
            <div class="col-md-6 col-sm-6">
              <Selector options={this.props.data.answers} ref="answers" id="id" value="answer" initial_done={this.props.data.initial_done} />
            </div>
            <div class="col-md-6 col-sm-6">
              <Selector options={this.props.data.keywords} ref="keywords" id="id" value="keyword" initial_done={this.props.data.initial_done} />
            </div>
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
      </div>
      <div class="col-md-12 col-sm-12"><h4>View</h4></div>
      <div class="col-md-12 col-sm-12 form-group">
        <input class="form-control" type="search" placeholder="Search" onChange={this.updateSearch.bind(this)}/>
      </div>
      <div class="col-md-12 col-sm-12 form-group" id="context" data-toggle="context" data-target="#context-menu">
        <table class="table al">
          <thead>
            <tr>
              <th>#</th>
              <th>Answers</th>
              <th>Keywords</th>
            </tr>
          </thead>
          <tbody>
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
