import React from "react"
import { connect } from "react-redux"
import { Model } from "elemental"
import $ from "jquery"

import { addAnswer } from "../actions/answerActions"
import { updateKeywordSet, deleteKeywordSet, addKeywordSet } from "../actions/keywordSetActions"
import { loaderSwitch } from "../actions/globalActions"
import Selector from "../components/Selector"

@connect((store) => {
  return {
    data: {
      keywords: store.keyword.keywords,
      keyword_set: store.keyword_set.keyword_set,
      ws: store.socket.ws,
      initial_done: store.globals.initialDataLoaded,
    }
  };
})
export default class answerView extends React.Component {

  constructor() {
    super();
    this.state = { search: '', edits: [], setClass: "form-group" }
  }

  componentsDidMount(){
    $('[data-toggle="tooltip"]').tooltip();
  }

  checkAll(){
    let keywords = this.refs.keywords.refs.selector.value;
    let val = this.refs.keywords_set_key.value;
    if ( keywords == "" ){
      $.notify({
        icon: 'glyphicon glyphicon-warning-sign',
        message: "Keywords cannot be empty!"
      },{
        type: 'danger'
      });
      return;
    }
    if ( val == "" ){
      $.notify({
        icon: 'glyphicon glyphicon-warning-sign',
        message: "Set Key cannot be empty!"
      },{
        type: 'danger'
      });
    }
    console.log(keywords)
    let props = this.props;
    this.props.dispatch( loaderSwitch( true ));
    let loaded = ()=>{ props.dispatch( loaderSwitch( false )) }
    this.props.dispatch( addKeywordSet( { iden: val, keywords: keywords, ws: this.props.data.ws } ) ).then( loaded, loaded );
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

  checkKeyName( event ){
    let val = this.refs.keywords_set_key.value;
    if ( val == "" ){
      this.setState( { ...this.state, setClass: "form-group has-error" } )
    } else {
      if ( !/^[a-zA-Z0-9-_]+$/.test( val ) ){
        this.setState( { ...this.state, setClass: "form-group has-error" } )
      } else {
        this.setState( { ...this.state, setClass: "form-group" } )
      }
    }
  }

  render() {
    let rows = this.props.data.keyword_set.map( (link, key) => {
      // if ( link != null ){
      //   let match = false;
      //   link.answer.split(",").forEach( (aid)=>{
      //     this.props.data.answers.forEach( (a)=>{
      //       if ( a.id == aid ){
      //         if ( a.answer.match( this.state.search.trim()  ) ){
      //           match = true
      //         }
      //       }
      //     } )
      //   } )
      //   if ( match ){
      //
      //     let refa = "answers_" + link.id
      //     let refk = "keywords_" + link.id
      //     let refes = "edit_save_" + link.id
      //     let answer_s = <Selector disabled="true" items={link.answer.split(",")} options={this.props.data.answers} ref={refa} id="id" value="answer" initial_done={this.props.data.initial_done} />
      //     let keyword_s = <Selector disabled="true" items={link.keyword.split(",")} options={this.props.data.keywords} ref={refk} id="id" value="keyword" initial_done={this.props.data.initial_done} />
      //     return <tr key={link.id}>
      //             <td>{link.id}</td>
      //             <td>{answer_s}</td>
      //             <td>{keyword_s}</td>
      //             <td class="text-right" class="b">
      //               <button class="btn btn-primary" ref={refes} onClick={this.EditLink.bind(this, link.id)}>
      //                 <i class="fa fa-pencil-square-o" />
      //               </button>
      //               <button class="btn btn-warning" onClick={this.DeleteLink.bind(this, key)}>
      //                 <i class="fa fa-trash" />
      //               </button>
      //             </td>
      //           </tr>
      //   }
      // }
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
      <div class="col-md-12 col-sm-12"><h3>Keyword Sets</h3></div>
      <div class="col-md-12 col-sm-12"><h4>Add</h4></div>
      <div class="col-md-12 col-sm-12">
        <div class="row form-horizontal">
          <div class={this.state.setClass}>
            <div class="col-md-6 col-sm-6">
              <input ref="keywords_set_key" placeholder="Key Name" class="form-control" type="text" onKeyUp={this.checkKeyName.bind(this)}/>
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
              &nbsp;&nbsp;Add New Set
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
              <th>Set Key</th>
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
