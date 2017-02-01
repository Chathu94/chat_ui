import React from "react"
import { connect } from "react-redux"
import { Model } from "elemental"

import { loadKeywords, updateKeyword, deleteKeyword, addKeyword, searchKeyword, initKeywordChanges, readKeywordChange } from "../actions/keywordActions"
import { loaderSwitch } from "../actions/globalActions"

@connect((store) => {
  return {
    data: {
      keywords: store.keyword.keywords,
      ws: store.socket.ws,
      changes: store.keyword.changes,
    }
  };
})
export default class Addkeyword extends React.Component {

  constructor() {
    super();
    this.state = { keyword: '', search: '', edits: [] }
  }

  keywordKeyPress( e, event ){
    if(event.key == 'Enter'){
      if ( event.target.value.trim() == "" ){
        $.notify({
          icon: 'glyphicon glyphicon-warning-sign',
          message: "Cannot save empty keyword"
        },{
          type: 'warning'
        });
      } else {
        let props = this.props;
        this.props.dispatch( loaderSwitch( true ));
        let loaded = ()=>{ props.dispatch( loaderSwitch( false )) }
        this.props.dispatch( updateKeyword( { id: this.props.data.keywords[e].id, keyword: event.target.value, ws: this.props.data.ws } ) ).then( loaded, loaded );
        let edits = this.state.edits
        edits[e] = false
        this.setState( { ...this.state, edits: edits } )
      }
    }
  }

  addKeyPress( event ){
    if(event.key == 'Enter'){
      if ( this.state.keyword.trim() == "" ){
        $.notify({
          icon: 'glyphicon glyphicon-warning-sign',
          message: "Cannot add empty keyword"
        },{
          type: 'warning'
        });
      } else {
        this.setState({
          ... this.state,
          keyword: ""
        });
        let props = this.props;
        this.props.dispatch( loaderSwitch( true ));
        let loaded = ()=>{ props.dispatch( loaderSwitch( false )) }
        this.props.dispatch( addKeyword( { keyword: this.state.keyword, ws: this.props.data.ws } ) ).then( loaded, loaded );
      }
    }
  }

  keywordBlur( e ){
    let cans = this.props.data.keywords[e].keyword;
    let uans = this.refs.keywords.children[e].children[1].children[0].value;
    if ( ( uans != "" ) && ( uans != cans ) ){
      let props = this.props;
      bootbox.confirm({
        title: "Discard/Save changes #" + e,
        message: "Do you want to ignore changes or save changes keyword #" + e + "?",
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
              props.dispatch( updateKeyword( { id: props.data.keywords[e].id, keyword: uans, ws: props.data.ws } ) ).then( loaded, loaded );
            }
        }
      });
    }
    let edits = this.state.edits
    edits[e] = false
    this.setState( { ...this.state, edits: edits } )
  }

  EditKeyword( e ){
    let edits = this.state.edits
    edits[e] = true
    this.setState( { ...this.state, edits: edits } )
  }

  callbackDelete( e ){
    let props = this.props;
    this.props.dispatch( loaderSwitch( true ));
    let loaded = ()=>{ props.dispatch( loaderSwitch( false )) }
    this.props.dispatch( deleteKeyword( { id: this.props.data.keywords[e].id, ws: this.props.data.ws } ) ).then( loaded, loaded );
  }

  updateKeyword(e){
    this.setState({
      ... this.state,
      keyword: e.target.value
    });
  }

  updateSearch(e){
    this.setState({
      ... this.state,
      search: e.target.value
    });
  }

  DeleteKeyword( e ){
    let cans = this.props.data.keywords[e].keyword;
    let self = this;
    bootbox.confirm({
      title: "Delete Keyword #" + e,
      message: "Do you want to delete keyword '" + cans + "' ? This cannot be undone.",
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
    let rows = this.props.data.keywords.map( (keyword, key) => {
      if ( keyword != null ){
        if ( this.state.search.trim() == "" || keyword.keyword.match( this.state.search.trim() ) ){
          let keyword_s = keyword.keyword;
          if ( this.state.edits[key] != null && this.state.edits[key] == true ){
            keyword_s = <input class='form-control' type='text' defaultValue={keyword_s} onKeyPress={this.keywordKeyPress.bind(this, key)} onBlur={this.keywordBlur.bind(this, key)} />
          }
          return <tr key={keyword.id}>
                  <td>{keyword.id}</td>
                  <td>{keyword_s}</td>
                  <td class="text-right" class="b">
                    <button class="btn btn-primary" onClick={this.EditKeyword.bind(this, key)}>
                      <i class="fa fa-pencil-square-o" />
                    </button>
                    <button class="btn btn-warning" onClick={this.DeleteKeyword.bind(this, key)}>
                      <i class="fa fa-trash" />
                    </button>
                  </td>
                </tr>
        }
    } } );
    return <div class="row">
      <div class="col-md-12 col-sm-12"><h3>Keywords</h3></div>
      <div class="col-md-12 col-sm-12 form-group">
        <input placeholder="Add Keyword" class="form-control" type="text" value={this.state.keyword} onChange={this.updateKeyword.bind(this)} onKeyPress={this.addKeyPress.bind(this)} />
      </div>
      <div class="col-md-12 col-sm-12 form-group">
        <input class="form-control" type="search" placeholder="Search" onChange={this.updateSearch.bind(this)}/>
      </div>
      <div class="col-md-12 col-sm-12 form-group" id="context" data-toggle="context" data-target="#context-menu">
        <table class="table al">
          <thead>
            <tr>
              <th>#</th>
              <th>Keyword</th>
            </tr>
          </thead>
          <tbody ref="keywords">
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
