import React from "react"
import $ from "jquery"
import selectize from "selectize"

export default class Selector extends React.Component {
  constructor() {
    super()
    this.state = {
      selector: null,
    }
  }

  enableSelector(){
    let selector = this.state.selector
    selector.enable()
    this.setState( { ...this.state, selector: selector } )
  }

  disableSelector(){
    let selector = this.state.selector
    selector.disable()
    this.setState( { ...this.state, selector: selector } )
  }

  clearSelector(){
    let selector = this.state.selector
    selector.clear();
    this.setState( { ...this.state, selector: selector } )
  }

  generateSelector(){
    let value = this.props.value;
    let id = this.props.id;
    if ( this.props.initial_done == true ){
      if( this.state.selector == null ){
    		let selector = $(this.refs.selector).selectize({
    			persist: false,
    			maxItems: null,
    			valueField: id,
          items: this.props.items,
    			labelField: value,
    			searchField: [value],
    			options: this.props.options,
    			render: {
    				item: function(item, escape) {
    					return '<div>' +
    						(item[value] ? '<span class="value">' + escape(item[value]) + '</span>' : '') +
    					'</div>';
    				},
    				option: function(item, escape) {
    					var label = item[value];
    					return '<div>' +
    						'<span class="caption">' + escape(label) + '</span>' +
    					'</div>';
    				}
    			},
          createFilter: function(input) {
            let options = this.options;
            let eq = false;
            Object.keys(options).map(function(k, i) {
              var v = options[k][value];
              if ( v == input ){
                eq = true;
              }
            });
            if ( /^\+?(0|[1-9]\d*)$/.test(input) ){
              return false;
            }
            return !eq
					},
          create: function(input) {
            let o = {}
            o[value] = input
            o[id] = input
            return o;
          }
    		})
        this.setState( { ...this.state, selector: selector[0].selectize } )
      } else {
        let selector = this.state.selector;
        this.props.options.forEach( (o)=>{
          if ( selector.options[o[id]] != null ){
            if ( selector.options[o[id]][value] != o[value] ){
              //console.log( 'Update ', o[id] )
              selector.updateOption( o[id], o )
            }
          } else {
            //console.log( 'Insert ', o[id] )
            selector.addOption( o )
          }
        });
        let options = this.props.options;
        Object.keys(selector.options).map(function(k, i) {
            var v = selector.options[k];
            let has = false;
            options.forEach( (o)=>{
              if ( o[id] == k ){
                has = true;
              }
            })
            if ( !has ){
              //console.log( 'Delete ', k )
              selector.removeOption( k )
            }
        });
      }
    }
  }

  componentDidUpdate(){
    this.generateSelector();
  }

  componentDidMount(){
    this.generateSelector();
  }

  render() {
    if ( this.props.disabled == "true" ){
      return <input ref="selector" disabled="disabled" />
    } else {
      return <input ref="selector" />
    }

  }
}
