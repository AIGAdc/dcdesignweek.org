/*!
 * Flickity hash v1.0.3
 * Enable hash navigation for Flickity
 */

/*jshint browser: true, undef: true, unused: true, strict: true*/

( function( window, factory ) {
  // universal module definition
  /*jshint strict: false */ /*globals define, module, require */
  if ( typeof define == 'function' && define.amd ) {
    // AMD
    define( [
      'flickity/js/index',
    ], factory );
  } else if ( typeof module == 'object' && module.exports ) {
    // CommonJS
    module.exports = factory(
      require('flickity')
    );
  } else {
    // browser global
    factory(
      window.Flickity
    );
  }

}( window, function factory( Flickity ) {

'use strict';

Flickity.createMethods.push('_createHash');

var proto = Flickity.prototype;

proto._createHash = function() {
  if ( !this.options.hash ) {
    return;
  }
  this.connectedHashLinks = [];
  // hash link listener
  // use HTML5 history pushState to prevent page scroll jump
  this.onHashLinkClick = function( event ) {
    event.preventDefault();
    this.selectCell( event.currentTarget.hash );
    history.replaceState( null, '', event.currentTarget.hash );
  }.bind( this );

  // events
  this.on( 'activate', this.activateHash );
  this.on( 'deactivate', this.deactivateHash );
};

proto.activateHash = function() {
  this.on( 'change', this.onChangeHash );

  // overwrite initialIndex
  if ( this.options.initialIndex === undefined && location.hash ) {
    var cell = this.queryCell( location.hash );
    if ( cell ) {
      this.options.initialIndex = this.getCellSlideIndex( cell );
    }
  }

  this.connectHashLinks();
};


proto.deactivateHash = function() {
  this.off( 'change', this.onChangeHash );
  this.disconnectHashLinks();
};

proto.onChangeHash = function() {
  var id = this.selectedElement.id;
  if ( id ) {
    var url = '#' + id;
    history.replaceState( null, '', url );
  }
};


proto.connectHashLinks = function() {
  var links = document.querySelectorAll('a');
  for ( var i=0; i < links.length; i++ ) {
    this.connectHashLink( links[i] );
  }
};

// used to test if link is on same page
var proxyLink = document.createElement('a');

proto.connectHashLink = function( link ) {
  if ( !link.hash ) {
    return;
  }
  // check that link is for the same page
  proxyLink.href = link.href;
  if ( proxyLink.pathname != location.pathname ) {
    return;
  }
  var cell = this.queryCell( link.hash );
  if ( !cell ) {
    return;
  }
  link.addEventListener( 'click', this.onHashLinkClick );
  this.connectedHashLinks.push( link );
};

proto.disconnectHashLinks = function() {
  this.connectedHashLinks.forEach( function( link ) {
    link.removeEventListener( 'click', this.onHashLinkClick );
  }, this );
  this.connectedHashLinks = [];
};

// -----  ----- //

return Flickity;

}));
