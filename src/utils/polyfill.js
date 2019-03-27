window.SPALite = {};

// Error catcher
window.onerror = function (message, source, lineno, colno, err) {
  try {
    if (window.ga) {
      window.ga('send', 'exception', {
        exDescription: message,
        exFatal: true
      });
    }
    if (!window.Raven && window.RavenErrorList) {
      window.RavenErrorList.push(err || new Error(message, source, lineno));
    }
  } catch (e) {
    console.error(err);
    console.error(e);
  }
};

// polyfill detector
/*! modernizr 3.6.0 (Custom Build) | MIT *
* https://modernizr.com/download/?-es5array-es5date-es5function-es5object-es5string-es6array-es6collections-es6math-es6number-es6object-es6string-objectfit-promises-setclasses !*/
!function(e,t,r){function n(e,t){return typeof e===t}function o(){var e,t,r,o,i,s,a;for(var p in v)if(v.hasOwnProperty(p)){if(e=[],t=v[p],t.name&&(e.push(t.name.toLowerCase()),t.options&&t.options.aliases&&t.options.aliases.length))for(r=0;r<t.options.aliases.length;r++)e.push(t.options.aliases[r].toLowerCase());for(o=n(t.fn,"function")?t.fn():t.fn,i=0;i<e.length;i++)s=e[i],a=s.split("."),1===a.length?Modernizr[a[0]]=o:(!Modernizr[a[0]]||Modernizr[a[0]]instanceof Boolean||(Modernizr[a[0]]=new Boolean(Modernizr[a[0]])),Modernizr[a[0]][a[1]]=o),b.push((o?"":"no-")+a.join("-"))}}function i(e){var t=A.className,r=Modernizr._config.classPrefix||"";if(O&&(t=t.baseVal),Modernizr._config.enableJSClass){var n=new RegExp("(^|\\s)"+r+"no-js(\\s|$)");t=t.replace(n,"$1"+r+"js$2")}Modernizr._config.enableClasses&&(t+=" "+r+e.join(" "+r),O?A.className.baseVal=t:A.className=t)}function s(e){return e.replace(/([a-z])-([a-z])/g,function(e,t,r){return t+r.toUpperCase()}).replace(/^-/,"")}function a(e,t){return!!~(""+e).indexOf(t)}function p(){return"function"!=typeof t.createElement?t.createElement(arguments[0]):O?t.createElementNS.call(t,"http://www.w3.org/2000/svg",arguments[0]):t.createElement.apply(t,arguments)}function u(e,t){return function(){return e.apply(t,arguments)}}function l(e,t,r){var o;for(var i in e)if(e[i]in t)return r===!1?e[i]:(o=t[e[i]],n(o,"function")?u(o,r||t):o);return!1}function f(e){return e.replace(/([A-Z])/g,function(e,t){return"-"+t.toLowerCase()}).replace(/^ms-/,"-ms-")}function c(t,r,n){var o;if("getComputedStyle"in e){o=getComputedStyle.call(e,t,r);var i=e.console;if(null!==o)n&&(o=o.getPropertyValue(n));else if(i){var s=i.error?"error":"log";i[s].call(i,"getComputedStyle returning null, its possible modernizr test results are inaccurate")}}else o=!r&&t.currentStyle&&t.currentStyle[n];return o}function d(){var e=t.body;return e||(e=p(O?"svg":"body"),e.fake=!0),e}function y(e,r,n,o){var i,s,a,u,l="modernizr",f=p("div"),c=d();if(parseInt(n,10))for(;n--;)a=p("div"),a.id=o?o[n]:l+(n+1),f.appendChild(a);return i=p("style"),i.type="text/css",i.id="s"+l,(c.fake?c:f).appendChild(i),c.appendChild(f),i.styleSheet?i.styleSheet.cssText=e:i.appendChild(t.createTextNode(e)),f.id=l,c.fake&&(c.style.background="",c.style.overflow="hidden",u=A.style.overflow,A.style.overflow="hidden",A.appendChild(c)),s=r(f,e),c.fake?(c.parentNode.removeChild(c),A.style.overflow=u,A.offsetHeight):f.parentNode.removeChild(f),!!s}function m(t,n){var o=t.length;if("CSS"in e&&"supports"in e.CSS){for(;o--;)if(e.CSS.supports(f(t[o]),n))return!0;return!1}if("CSSSupportsRule"in e){for(var i=[];o--;)i.push("("+f(t[o])+":"+n+")");return i=i.join(" or "),y("@supports ("+i+") { #modernizr { position: absolute; } }",function(e){return"absolute"==c(e,null,"position")})}return r}function h(e,t,o,i){function u(){f&&(delete P.style,delete P.modElem)}if(i=n(i,"undefined")?!1:i,!n(o,"undefined")){var l=m(e,o);if(!n(l,"undefined"))return l}for(var f,c,d,y,h,g=["modernizr","tspan","samp"];!P.style&&g.length;)f=!0,P.modElem=p(g.shift()),P.style=P.modElem.style;for(d=e.length,c=0;d>c;c++)if(y=e[c],h=P.style[y],a(y,"-")&&(y=s(y)),P.style[y]!==r){if(i||n(o,"undefined"))return u(),"pfx"==t?y:!0;try{P.style[y]=o}catch(b){}if(P.style[y]!=h)return u(),"pfx"==t?y:!0}return u(),!1}function g(e,t,r,o,i){var s=e.charAt(0).toUpperCase()+e.slice(1),a=(e+" "+j.join(s+" ")+s).split(" ");return n(t,"string")||n(t,"undefined")?h(a,t,o,i):(a=(e+" "+x.join(s+" ")+s).split(" "),l(a,t,r))}var b=[],v=[],S={_version:"3.6.0",_config:{classPrefix:"",enableClasses:!0,enableJSClass:!0,usePrefixes:!0},_q:[],on:function(e,t){var r=this;setTimeout(function(){t(r[e])},0)},addTest:function(e,t,r){v.push({name:e,fn:t,options:r})},addAsyncTest:function(e){v.push({name:null,fn:e})}},Modernizr=function(){};Modernizr.prototype=S,Modernizr=new Modernizr,Modernizr.addTest("es5array",function(){return!!(Array.prototype&&Array.prototype.every&&Array.prototype.filter&&Array.prototype.forEach&&Array.prototype.indexOf&&Array.prototype.lastIndexOf&&Array.prototype.map&&Array.prototype.some&&Array.prototype.reduce&&Array.prototype.reduceRight&&Array.isArray)}),Modernizr.addTest("es5date",function(){var e="2013-04-12T06:06:37.307Z",t=!1;try{t=!!Date.parse(e)}catch(r){}return!!(Date.now&&Date.prototype&&Date.prototype.toISOString&&Date.prototype.toJSON&&t)}),Modernizr.addTest("es5function",function(){return!(!Function.prototype||!Function.prototype.bind)}),Modernizr.addTest("es5object",function(){return!!(Object.keys&&Object.create&&Object.getPrototypeOf&&Object.getOwnPropertyNames&&Object.isSealed&&Object.isFrozen&&Object.isExtensible&&Object.getOwnPropertyDescriptor&&Object.defineProperty&&Object.defineProperties&&Object.seal&&Object.freeze&&Object.preventExtensions)}),Modernizr.addTest("es5string",function(){return!(!String.prototype||!String.prototype.trim)}),Modernizr.addTest("es6array",!!(Array.prototype&&Array.prototype.copyWithin&&Array.prototype.fill&&Array.prototype.find&&Array.prototype.findIndex&&Array.prototype.keys&&Array.prototype.entries&&Array.prototype.values&&Array.from&&Array.of)),Modernizr.addTest("es6collections",!!(e.Map&&e.Set&&e.WeakMap&&e.WeakSet)),Modernizr.addTest("es6math",!!(Math&&Math.clz32&&Math.cbrt&&Math.imul&&Math.sign&&Math.log10&&Math.log2&&Math.log1p&&Math.expm1&&Math.cosh&&Math.sinh&&Math.tanh&&Math.acosh&&Math.asinh&&Math.atanh&&Math.hypot&&Math.trunc&&Math.fround)),Modernizr.addTest("es6number",!!(Number.isFinite&&Number.isInteger&&Number.isSafeInteger&&Number.isNaN&&Number.parseInt&&Number.parseFloat&&Number.isInteger(Number.MAX_SAFE_INTEGER)&&Number.isInteger(Number.MIN_SAFE_INTEGER)&&Number.isFinite(Number.EPSILON))),Modernizr.addTest("es6object",!!(Object.assign&&Object.is&&Object.setPrototypeOf)),Modernizr.addTest("promises",function(){return"Promise"in e&&"resolve"in e.Promise&&"reject"in e.Promise&&"all"in e.Promise&&"race"in e.Promise&&function(){var t;return new e.Promise(function(e){t=e}),"function"==typeof t}()}),Modernizr.addTest("es6string",!!(String.fromCodePoint&&String.raw&&String.prototype.codePointAt&&String.prototype.repeat&&String.prototype.startsWith&&String.prototype.endsWith&&String.prototype.includes));var A=t.documentElement,O="svg"===A.nodeName.toLowerCase(),C="Moz O ms Webkit",j=S._config.usePrefixes?C.split(" "):[];S._cssomPrefixes=j;var N=function(t){var n,o=prefixes.length,i=e.CSSRule;if("undefined"==typeof i)return r;if(!t)return!1;if(t=t.replace(/^@/,""),n=t.replace(/-/g,"_").toUpperCase()+"_RULE",n in i)return"@"+t;for(var s=0;o>s;s++){var a=prefixes[s],p=a.toUpperCase()+"_"+n;if(p in i)return"@-"+a.toLowerCase()+"-"+t}return!1};S.atRule=N;var x=S._config.usePrefixes?C.toLowerCase().split(" "):[];S._domPrefixes=x;var w={elem:p("modernizr")};Modernizr._q.push(function(){delete w.elem});var P={style:w.elem.style};Modernizr._q.unshift(function(){delete P.style}),S.testAllProps=g;var _=S.prefixed=function(e,t,r){return 0===e.indexOf("@")?N(e):(-1!=e.indexOf("-")&&(e=s(e)),t?g(e,t,r):g(e,"pfx"))};Modernizr.addTest("objectfit",!!_("objectFit"),{aliases:["object-fit"]}),o(),i(b),delete S.addTest,delete S.addAsyncTest;for(var M=0;M<Modernizr._q.length;M++)Modernizr._q[M]();e.Modernizr=Modernizr}(window,document);
(function() {
  var elLocation = document.getElementById('conference-component-script');
  var src = elLocation ? elLocation.src : 'http://localhost:8080';
  var a = document.createElement('a');
  a.href = src;
  window.systemLocation = a.protocol + '//' + a.host + '/';
  window.packageVersion = elLocation.getAttribute('version') || '0.0.0';
  var refScript = document.body.getElementsByTagName('script')[0] || document.body.getElementsByTagName('style')[0];
  var WebComponentsFlag = false;

  function es5Loaded () {
    window.SPALite.Es5Loaded = true;
    window.dispatchEvent(new window.CustomEvent('spa-lite-es5-loaded'));
    // load es6
    checkEs6Polyfills();
  }

  function es6Loaded () {
    window.SPALite.Es6Loaded = true;
    window.dispatchEvent(new window.CustomEvent('spa-lite-es6-loaded'));
    checkCustomElementsEs5Adapter();
  }

  // es5 polyfill loaders
  function loadEs5shim (callback) {
    var es5shim = document.createElement('script');
    es5shim.src = systemLocation + '/vendor/es5-shim.' + packageVersion + '.js';
    es5shim.addEventListener('load', function() { callback() });
    es5shim.addEventListener('error', function (error) {
      callback(error.error || error);
    });
    refScript.parentNode.insertBefore(es5shim, refScript);
  }

  function loadEs5Sham (callback) {
    var es5sham = document.createElement('script');
    es5sham.src = systemLocation + '/vendor/es5-sham.' + packageVersion + '.js';
    es5sham.addEventListener('load', function() { callback() });
    es5sham.addEventListener('error', function (error) {
      callback(error.error || error);
    });
    refScript.parentNode.insertBefore(es5sham, refScript);
  }

  // es6 polyfill loaders
  function loadEs6Shim (callback) {
    var es6shim = document.createElement('script');
    es6shim.src = systemLocation + '/vendor/es6-shim.' + packageVersion + '.js';
    es6shim.addEventListener('load', function() { callback() });
    es6shim.addEventListener('error', function (error) {
      callback(error.error || error);
    });
    refScript.parentNode.insertBefore(es6shim, refScript);
  }

  function loadEs6Sham (callback) {
    var es6sham = document.createElement('script');
    es6sham.src = systemLocation + '/vendor/es6-sham.' + packageVersion + '.js';
    es6sham.addEventListener('load', function() { callback() });
    es6sham.addEventListener('error', function (error) {
      callback(error.error || error);
    });
    refScript.parentNode.insertBefore(es6sham, refScript);
  }

  function loadWeakMap (callback) {
    var weakMap = document.createElement('script');
    weakMap.src = systemLocation + '/vendor/weakmap-polyfill.' + packageVersion + '.js';
    weakMap.addEventListener('load', function() { callback() });
    weakMap.addEventListener('error', function (error) {
      callback(error.error || error);
    });
    refScript.parentNode.insertBefore(weakMap, refScript);
  }

  // Feature detect Custom Elements support. If the browser DOES support Custom
  // Elements then we need to load the custom-elements-es5-adapter because
  // our project code has been transpiled from ES2015 to ES5 and native Custom
  // Elements expect elements will be registered as classes.
  function loadCustomElementsEs5Adapter (callback) {
    var customElementsEs5Adapter = document.createElement('script');
    customElementsEs5Adapter.src = systemLocation + '/vendor/custom-elements-es5-adapter.' + packageVersion + '.js';
    customElementsEs5Adapter.setAttribute('nomodule', '');
    customElementsEs5Adapter.setAttribute('async', '');
    customElementsEs5Adapter.addEventListener('load', function() {
      callback();
    });
    customElementsEs5Adapter.addEventListener('error', function (error) {
      callback(error.error || error);
    });
    refScript.parentNode.insertBefore(customElementsEs5Adapter, refScript);
  }

  // load es5 polyfills
  function checkEs5Polyfills () {

    // loads es5 polyfills if it doesn't have the following
    // es5 array, date, functions, object, and string methods
    if (!Modernizr.es5array ||
        !Modernizr.es5date ||
        !Modernizr.es5function ||
        !Modernizr.es5object ||
        !Modernizr.es5string) {

        // Aaahh!! Callback horror!!
        loadEs5Shim(function (error) {
          if (error) throw error;
          loadEs5Sham(function (error) {
            if (error) throw error;
            es5Loaded();
          });
        });
    } else {
      es5Loaded();
    }
  }

  // load es6 polyfills
  function checkEs6Polyfills () {
    var es6Promises = [];

    // loads es6 polyfils if it doesn't have the following
    // es6 set and collections, math, number, object, and string methods
    if (!Modernizr.es6collections ||
        !Modernizr.es6math ||
        !Modernizr.es6number ||
        !Modernizr.es6object ||
        !Modernizr.es6string) {

      // Aaahh!! Callback horror!!
      loadEs6Shim(function (error) {
        if (error) throw error;
        loadEs6Sham(function (error) {
          if (error) throw error;
          loadWeakMap(function (error) {
            if (error) throw error;
            es6Loaded();
          });
        });
      });
    } else {
      es6Loaded();
    }
  }

  function checkCustomElementsEs5Adapter () {
    var evalString = '(function(){ class x extends window.HTMLElement {}';
    evalString += (window.customElements ?  'window.customElements.define("spa-lite-es5-test-component", x);' : '');
    evalString += '})();';
    try {
      // danger
      eval(evalString);
      var testScript = document.createElement('script');
      testScript.setAttribute('nomodule', '');
      if (!testScript.noModule) {
        loadCustomElementsEs5Adapter(function (error) {
          if (error) throw error;
          loadWebComponentsPolyfills();
        });
      } else {
        loadWebComponentsPolyfills();
      }
    } catch (error) {
      console.log(error);
      loadCustomElementsEs5Adapter(function (error) {
        if (error) throw error;
        loadWebComponentsPolyfills();
      });
    }
  }

  // copied from webcomponents-loader.js
  function loadWebComponentsPolyfills () {
    if (WebComponentsFlag) return;

    WebComponentsFlag = true;

    console.log('Loading web components');
    var polyfillsLoaded = false;
    var whenLoadedFns = [];
    var allowUpgrades = false;
    var flushFn;
    var timeout = null;

    function fireEvent() {
      window.WebComponents.ready = true;
      document.dispatchEvent(new CustomEvent('WebComponentsReady', { bubbles: true }));
    }

    function batchCustomElements() {
      if (window.customElements && customElements.polyfillWrapFlushCallback) {
        customElements.polyfillWrapFlushCallback(function (flushCallback) {
          flushFn = flushCallback;
          if (allowUpgrades) {
            flushFn();
          }
        });
      }
    }

    function asyncReady() {
      batchCustomElements();
      ready();
    }

    function ready() {
      // bootstrap <template> elements before custom elements
      if (window.HTMLTemplateElement && HTMLTemplateElement.bootstrap) {
        HTMLTemplateElement.bootstrap(window.document);
      }
      polyfillsLoaded = true;
      runWhenLoadedFns().then(fireEvent);
    }

    function runWhenLoadedFns() {
      allowUpgrades = false;
      var done = function() {
        allowUpgrades = true;
        whenLoadedFns.length = 0;
        flushFn && flushFn();
      };
      return Promise.all(whenLoadedFns.map(function(fn) {
        return fn instanceof Function ? fn() : fn;
      })).then(function() {
        done();
      }).catch(function(err) {
        console.error(err);
      });
    }

    window.WebComponents = window.WebComponents || {
      ready: false,
      _batchCustomElements: batchCustomElements,
      waitFor: function(waitFn) {
        if (!waitFn) {
          return;
        }
        whenLoadedFns.push(waitFn);
        if (polyfillsLoaded) {
          runWhenLoadedFns();
        }
      }
    };

    // Feature detect which polyfill needs to be imported.
    var polyfills = [];
    if (!('attachShadow' in Element.prototype && 'getRootNode' in Element.prototype) ||
      (window.ShadyDOM && window.ShadyDOM.force)) {
      polyfills.push('sd');
    }
    if (!window.customElements || window.customElements.forcePolyfill) {
      polyfills.push('ce');
    }

    var needsTemplate = (function() {
      // no real <template> because no `content` property (IE and older browsers)
      var t = document.createElement('template');
      if (!('content' in t)) {
        return true;
      }
      // broken doc fragment (older Edge)
      if (!(t.content.cloneNode() instanceof DocumentFragment)) {
        return true;
      }
      // broken <template> cloning (Edge up to at least version 17)
      var t2 = document.createElement('template');
      t2.content.appendChild(document.createElement('div'));
      t.content.appendChild(t2);
      var clone = t.cloneNode(true);
      return (clone.content.childNodes.length === 0 ||
          clone.content.firstChild.content.childNodes.length === 0);
    })();

    // NOTE: any browser that does not have template or ES6 features
    // must load the full suite of polyfills.
    if (!window.Promise || !Array.from || !window.URL || !window.Symbol || needsTemplate) {
      polyfills = ['sd-ce-pf'];
    }

    if (polyfills.length) {
      var newScript = document.createElement('script');
      // Load it from the right place.
      newScript.src = systemLocation + '/vendor/bundles/webcomponents-' + polyfills.join('-') + '.' + packageVersion + '.js';
      // if readyState is 'loading', this script is synchronous
      if (document.readyState === 'loading') {
        // make sure custom elements are batched whenever parser gets to the injected script
        newScript.setAttribute('onload', 'window.WebComponents._batchCustomElements()');
        document.write(newScript.outerHTML);
        document.addEventListener('DOMContentLoaded', ready);
      } else {
        newScript.addEventListener('load', function () {
          asyncReady();
        });
        newScript.addEventListener('error', function () {
          throw new Error('Could not load polyfill bundle' + url);
        });
        document.head.appendChild(newScript);
      }
    } else {
      polyfillsLoaded = true;
      if (document.readyState === 'complete') {
        fireEvent()
      } else {
        // this script may come between DCL and load, so listen for both, and cancel load listener if DCL fires
        window.addEventListener('load', ready);
        window.addEventListener('DOMContentLoaded', function() {
          window.removeEventListener('load', ready);
          ready();
        });
      }
    }
  }

  checkEs5Polyfills();

  // loads optional dependencies
  // loads intersection observer polyfil if it doesn't have the native intersection observer
  if (!window.IntersectionObserver) {
    var io = document.createElement('script');
    io.src = systemLocation + '/vendor/intersection-observer.' + packageVersion + '.js';
    refScript.parentNode.insertBefore(io, refScript);
  }

  if (!window.fetch || !window.Headers) {
    var fetchPoly = document.createElement('script')
    fetchPoly.src = systemLocation + '/vendor/fetch.' + packageVersion + '.js'
    refScript.parentNode.insertBefore(fetchPoly, refScript)
  }

  if (!Modernizr.objectfit || 'objectFit' in document.documentElement.style === false) {
    var ofi = document.createElement('script')
    ofi.src = systemLocation + '/vendor/ofi.' + packageVersion + '.js'
    refScript.parentNode.insertBefore(ofi, refScript)
  }
})();

(function () {
  document.addEventListener('WebComponentsReady', function componentsReady() {
    document.removeEventListener('WebComponentsReady', componentsReady, false);
    var text = "There's seems to be an error in loading the core script. " +
      "Please try again later.";
    var refScript = document.body.getElementsByTagName('script')[0];
    var script = document.createElement('script');
    script.async = true
    script.src = systemLocation + '/core.' + packageVersion + '.js';
    script.crossOrigin = 'anonymous';
    script.setAttribute('nomodule', true);
    script.addEventListener('error', function(error) {
      // if (document.querySelector('.core-lite-loader').style.opacity !== 0) {
      //   document.querySelector('.loader-text').innerHTML = text
      // }
    });
    refScript.parentNode.insertBefore(script, refScript);

    var scriptModule = document.createElement('script');
    scriptModule.async = true
    scriptModule.src = systemLocation + '/module.core.' + packageVersion + '.js';
    scriptModule.crossOrigin = 'anonymous';
    scriptModule.type = 'module';
    scriptModule.addEventListener('error', function(error) {
      // if (document.querySelector('.core-lite-loader').style.opacity !== 0) {
      //   document.querySelector('.loader-text').innerHTML = text
      // }
    });
    refScript.parentNode.insertBefore(scriptModule, refScript);

    window.dispatchEvent(new window.CustomEvent('window-core-start'));

  }, false)
})()
