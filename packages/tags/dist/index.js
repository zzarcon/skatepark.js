(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}],2:[function(require,module,exports){
(function (process,global){
'use strict';

const isFunction = val => typeof val === 'function';
const isObject = val => typeof val === 'object' && val !== null;
const isString = val => typeof val === 'string';
const isSymbol = val => typeof val === 'symbol';
const isUndefined = val => typeof val === 'undefined';

function getPropNamesAndSymbols(obj = {}) {
  const listOfKeys = Object.getOwnPropertyNames(obj);
  return isFunction(Object.getOwnPropertySymbols) ? listOfKeys.concat(Object.getOwnPropertySymbols(obj)) : listOfKeys;
}

var assign = ((obj, ...args) => {
  args.forEach(arg => getPropNamesAndSymbols(arg).forEach(nameOrSymbol => obj[nameOrSymbol] = arg[nameOrSymbol])); // eslint-disable-line no-return-assign
  return obj;
});

var empty = function (val) {
  return typeof val === 'undefined' || val === null;
};

const toNullOrString = val => empty(val) ? null : String(val);

function create(def) {
  return (...args) => {
    args.unshift({}, def);
    return assign(...args);
  };
}

const array = create({
  coerce: val => Array.isArray(val) ? val : empty(val) ? null : [val],
  default: () => [],
  deserialize: val => empty(val) ? null : JSON.parse(val),
  serialize: JSON.stringify
});



// defaults empty to 0 and allows NaN


const string = create({
  default: '',
  coerce: toNullOrString,
  deserialize: toNullOrString,
  serialize: toNullOrString
});

const connected = '____skate_connected';
const created = '____skate_created';

// DEPRECATED
//
// This is the only "symbol" that must stay a string. This is because it is
// relied upon across several versions. We should remove it, but ensure that
// it's considered a breaking change that whatever version removes it cannot
// be passed to vdom functions as tag names.
const name = '____skate_name';

// Used on the Constructor
const ctorCreateInitProps = '____skate_ctor_createInitProps';
const ctorObservedAttributes = '____skate_ctor_observedAttributes';
const ctorProps = '____skate_ctor_props';
const ctorPropsMap = '____skate_ctor_propsMap';

// Used on the Element
const props = '____skate_props';
const ref = '____skate_ref';
const renderer = '____skate_renderer';
const rendering = '____skate_rendering';
const rendererDebounced = '____skate_rendererDebounced';
const updated = '____skate_updated';

// DEPRECTAED
//
// We should not be relying on internals for symbols as this creates version
// coupling. We will move forward with platform agnostic ways of doing this.

/**
 * @license
 * Copyright 2015 The Incremental DOM Authors. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS-IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

var hasOwnProperty = Object.prototype.hasOwnProperty;

/**
 * A cached reference to the create function.
 */
var create$1 = Object.create;

/**
 * Used to prevent property collisions between our "map" and its prototype.
 * @param {!Object<string, *>} map The map to check.
 * @param {string} property The property to check.
 * @return {boolean} Whether map has property.
 */
var has = function (map, property) {
  return hasOwnProperty.call(map, property);
};

/**
 * Creates an map object without a prototype.
 * @return {!Object}
 */
var createMap = function () {
  return create$1(null);
};

/**
 * Keeps track of information needed to perform diffs for a given DOM node.
 * @param {!string} nodeName
 * @param {?string=} key
 * @constructor
 */
function NodeData(nodeName, key) {
  /**
   * The attributes and their values.
   * @const {!Object<string, *>}
   */
  this.attrs = createMap();

  /**
   * An array of attribute name/value pairs, used for quickly diffing the
   * incomming attributes to see if the DOM node's attributes need to be
   * updated.
   * @const {Array<*>}
   */
  this.attrsArr = [];

  /**
   * The incoming attributes for this Node, before they are updated.
   * @const {!Object<string, *>}
   */
  this.newAttrs = createMap();

  /**
   * The key used to identify this node, used to preserve DOM nodes when they
   * move within their parent.
   * @const
   */
  this.key = key;

  /**
   * Keeps track of children within this node by their key.
   * {?Object<string, !Element>}
   */
  this.keyMap = null;

  /**
   * Whether or not the keyMap is currently valid.
   * {boolean}
   */
  this.keyMapValid = true;

  /**
   * The node name for this node.
   * @const {string}
   */
  this.nodeName = nodeName;

  /**
   * @type {?string}
   */
  this.text = null;
}

/**
 * Initializes a NodeData object for a Node.
 *
 * @param {Node} node The node to initialize data for.
 * @param {string} nodeName The node name of node.
 * @param {?string=} key The key that identifies the node.
 * @return {!NodeData} The newly initialized data object
 */
var initData = function (node, nodeName, key) {
  var data = new NodeData(nodeName, key);
  node['__incrementalDOMData'] = data;
  return data;
};

/**
 * Retrieves the NodeData object for a Node, creating it if necessary.
 *
 * @param {Node} node The node to retrieve the data for.
 * @return {!NodeData} The NodeData for this Node.
 */
var getData = function (node) {
  var data = node['__incrementalDOMData'];

  if (!data) {
    var nodeName = node.nodeName.toLowerCase();
    var key = null;

    if (node instanceof Element) {
      key = node.getAttribute('key');
    }

    data = initData(node, nodeName, key);
  }

  return data;
};

/**
 * Copyright 2015 The Incremental DOM Authors. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS-IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/** @const */
var symbols = {
  default: '__default',

  placeholder: '__placeholder'
};

/**
 * @param {string} name
 * @return {string|undefined} The namespace to use for the attribute.
 */
var getNamespace = function (name) {
  if (name.lastIndexOf('xml:', 0) === 0) {
    return 'http://www.w3.org/XML/1998/namespace';
  }

  if (name.lastIndexOf('xlink:', 0) === 0) {
    return 'http://www.w3.org/1999/xlink';
  }
};

/**
 * Applies an attribute or property to a given Element. If the value is null
 * or undefined, it is removed from the Element. Otherwise, the value is set
 * as an attribute.
 * @param {!Element} el
 * @param {string} name The attribute's name.
 * @param {?(boolean|number|string)=} value The attribute's value.
 */
var applyAttr = function (el, name, value) {
  if (value == null) {
    el.removeAttribute(name);
  } else {
    var attrNS = getNamespace(name);
    if (attrNS) {
      el.setAttributeNS(attrNS, name, value);
    } else {
      el.setAttribute(name, value);
    }
  }
};

/**
 * Applies a property to a given Element.
 * @param {!Element} el
 * @param {string} name The property's name.
 * @param {*} value The property's value.
 */
var applyProp = function (el, name, value) {
  el[name] = value;
};

/**
 * Applies a style to an Element. No vendor prefix expansion is done for
 * property names/values.
 * @param {!Element} el
 * @param {string} name The attribute's name.
 * @param {*} style The style to set. Either a string of css or an object
 *     containing property-value pairs.
 */
var applyStyle = function (el, name, style) {
  if (typeof style === 'string') {
    el.style.cssText = style;
  } else {
    el.style.cssText = '';
    var elStyle = el.style;
    var obj = /** @type {!Object<string,string>} */style;

    for (var prop in obj) {
      if (has(obj, prop)) {
        elStyle[prop] = obj[prop];
      }
    }
  }
};

/**
 * Updates a single attribute on an Element.
 * @param {!Element} el
 * @param {string} name The attribute's name.
 * @param {*} value The attribute's value. If the value is an object or
 *     function it is set on the Element, otherwise, it is set as an HTML
 *     attribute.
 */
var applyAttributeTyped = function (el, name, value) {
  var type = typeof value;

  if (type === 'object' || type === 'function') {
    applyProp(el, name, value);
  } else {
    applyAttr(el, name, /** @type {?(boolean|number|string)} */value);
  }
};

/**
 * Calls the appropriate attribute mutator for this attribute.
 * @param {!Element} el
 * @param {string} name The attribute's name.
 * @param {*} value The attribute's value.
 */
var updateAttribute = function (el, name, value) {
  var data = getData(el);
  var attrs = data.attrs;

  if (attrs[name] === value) {
    return;
  }

  var mutator = attributes[name] || attributes[symbols.default];
  mutator(el, name, value);

  attrs[name] = value;
};

/**
 * A publicly mutable object to provide custom mutators for attributes.
 * @const {!Object<string, function(!Element, string, *)>}
 */
var attributes = createMap();

// Special generic mutator that's called for any attribute that does not
// have a specific mutator.
attributes[symbols.default] = applyAttributeTyped;

attributes[symbols.placeholder] = function () {};

attributes['style'] = applyStyle;

/**
 * Gets the namespace to create an element (of a given tag) in.
 * @param {string} tag The tag to get the namespace for.
 * @param {?Node} parent
 * @return {?string} The namespace to create the tag in.
 */
var getNamespaceForTag = function (tag, parent) {
  if (tag === 'svg') {
    return 'http://www.w3.org/2000/svg';
  }

  if (getData(parent).nodeName === 'foreignObject') {
    return null;
  }

  return parent.namespaceURI;
};

/**
 * Creates an Element.
 * @param {Document} doc The document with which to create the Element.
 * @param {?Node} parent
 * @param {string} tag The tag for the Element.
 * @param {?string=} key A key to identify the Element.
 * @param {?Array<*>=} statics An array of attribute name/value pairs of the
 *     static attributes for the Element.
 * @return {!Element}
 */
var createElement = function (doc, parent, tag, key, statics) {
  var namespace = getNamespaceForTag(tag, parent);
  var el = undefined;

  if (namespace) {
    el = doc.createElementNS(namespace, tag);
  } else {
    el = doc.createElement(tag);
  }

  initData(el, tag, key);

  if (statics) {
    for (var i = 0; i < statics.length; i += 2) {
      updateAttribute(el, /** @type {!string}*/statics[i], statics[i + 1]);
    }
  }

  return el;
};

/**
 * Creates a Text Node.
 * @param {Document} doc The document with which to create the Element.
 * @return {!Text}
 */
var createText = function (doc) {
  var node = doc.createTextNode('');
  initData(node, '#text', null);
  return node;
};

/**
 * Creates a mapping that can be used to look up children using a key.
 * @param {?Node} el
 * @return {!Object<string, !Element>} A mapping of keys to the children of the
 *     Element.
 */
var createKeyMap = function (el) {
  var map = createMap();
  var child = el.firstElementChild;

  while (child) {
    var key = getData(child).key;

    if (key) {
      map[key] = child;
    }

    child = child.nextElementSibling;
  }

  return map;
};

/**
 * Retrieves the mapping of key to child node for a given Element, creating it
 * if necessary.
 * @param {?Node} el
 * @return {!Object<string, !Node>} A mapping of keys to child Elements
 */
var getKeyMap = function (el) {
  var data = getData(el);

  if (!data.keyMap) {
    data.keyMap = createKeyMap(el);
  }

  return data.keyMap;
};

/**
 * Retrieves a child from the parent with the given key.
 * @param {?Node} parent
 * @param {?string=} key
 * @return {?Node} The child corresponding to the key.
 */
var getChild = function (parent, key) {
  return key ? getKeyMap(parent)[key] : null;
};

/**
 * Registers an element as being a child. The parent will keep track of the
 * child using the key. The child can be retrieved using the same key using
 * getKeyMap. The provided key should be unique within the parent Element.
 * @param {?Node} parent The parent of child.
 * @param {string} key A key to identify the child with.
 * @param {!Node} child The child to register.
 */
var registerChild = function (parent, key, child) {
  getKeyMap(parent)[key] = child;
};

/**
 * Copyright 2015 The Incremental DOM Authors. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS-IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/** @const */
var notifications = {
  /**
   * Called after patch has compleated with any Nodes that have been created
   * and added to the DOM.
   * @type {?function(Array<!Node>)}
   */
  nodesCreated: null,

  /**
   * Called after patch has compleated with any Nodes that have been removed
   * from the DOM.
   * Note it's an applications responsibility to handle any childNodes.
   * @type {?function(Array<!Node>)}
   */
  nodesDeleted: null
};

/**
 * Keeps track of the state of a patch.
 * @constructor
 */
function Context() {
  /**
   * @type {(Array<!Node>|undefined)}
   */
  this.created = notifications.nodesCreated && [];

  /**
   * @type {(Array<!Node>|undefined)}
   */
  this.deleted = notifications.nodesDeleted && [];
}

/**
 * @param {!Node} node
 */
Context.prototype.markCreated = function (node) {
  if (this.created) {
    this.created.push(node);
  }
};

/**
 * @param {!Node} node
 */
Context.prototype.markDeleted = function (node) {
  if (this.deleted) {
    this.deleted.push(node);
  }
};

/**
 * Notifies about nodes that were created during the patch opearation.
 */
Context.prototype.notifyChanges = function () {
  if (this.created && this.created.length > 0) {
    notifications.nodesCreated(this.created);
  }

  if (this.deleted && this.deleted.length > 0) {
    notifications.nodesDeleted(this.deleted);
  }
};

/**
* Makes sure that keyed Element matches the tag name provided.
* @param {!string} nodeName The nodeName of the node that is being matched.
* @param {string=} tag The tag name of the Element.
* @param {?string=} key The key of the Element.
*/
var assertKeyedTagMatches = function (nodeName, tag, key) {
  if (nodeName !== tag) {
    throw new Error('Was expecting node with key "' + key + '" to be a ' + tag + ', not a ' + nodeName + '.');
  }
};

/** @type {?Context} */
var context = null;

/** @type {?Node} */
var currentNode = null;

/** @type {?Node} */
var currentParent = null;

/** @type {?Element|?DocumentFragment} */
var root = null;

/** @type {?Document} */
var doc = null;

/**
 * Returns a patcher function that sets up and restores a patch context,
 * running the run function with the provided data.
 * @param {function((!Element|!DocumentFragment),!function(T),T=)} run
 * @return {function((!Element|!DocumentFragment),!function(T),T=)}
 * @template T
 */
var patchFactory = function (run) {
  /**
   * TODO(moz): These annotations won't be necessary once we switch to Closure
   * Compiler's new type inference. Remove these once the switch is done.
   *
   * @param {(!Element|!DocumentFragment)} node
   * @param {!function(T)} fn
   * @param {T=} data
   * @template T
   */
  var f = function (node, fn, data) {
    var prevContext = context;
    var prevRoot = root;
    var prevDoc = doc;
    var prevCurrentNode = currentNode;
    var prevCurrentParent = currentParent;
    var previousInAttributes = false;
    var previousInSkip = false;

    context = new Context();
    root = node;
    doc = node.ownerDocument;
    currentParent = node.parentNode;

    run(node, fn, data);

    context.notifyChanges();

    context = prevContext;
    root = prevRoot;
    doc = prevDoc;
    currentNode = prevCurrentNode;
    currentParent = prevCurrentParent;
  };
  return f;
};

/**
 * Patches the document starting at node with the provided function. This
 * function may be called during an existing patch operation.
 * @param {!Element|!DocumentFragment} node The Element or Document
 *     to patch.
 * @param {!function(T)} fn A function containing elementOpen/elementClose/etc.
 *     calls that describe the DOM.
 * @param {T=} data An argument passed to fn to represent DOM state.
 * @template T
 */
var patchInner = patchFactory(function (node, fn, data) {
  currentNode = node;

  enterNode();
  fn(data);
  exitNode();

  
});

/**
 * Patches an Element with the the provided function. Exactly one top level
 * element call should be made corresponding to `node`.
 * @param {!Element} node The Element where the patch should start.
 * @param {!function(T)} fn A function containing elementOpen/elementClose/etc.
 *     calls that describe the DOM. This should have at most one top level
 *     element call.
 * @param {T=} data An argument passed to fn to represent DOM state.
 * @template T
 */
var matches = function (nodeName, key) {
  var data = getData(currentNode);

  // Key check is done using double equals as we want to treat a null key the
  // same as undefined. This should be okay as the only values allowed are
  // strings, null and undefined so the == semantics are not too weird.
  return nodeName === data.nodeName && key == data.key;
};

/**
 * Aligns the virtual Element definition with the actual DOM, moving the
 * corresponding DOM node to the correct location or creating it if necessary.
 * @param {string} nodeName For an Element, this should be a valid tag string.
 *     For a Text, this should be #text.
 * @param {?string=} key The key used to identify this element.
 * @param {?Array<*>=} statics For an Element, this should be an array of
 *     name-value pairs.
 */
var alignWithDOM = function (nodeName, key, statics) {
  if (currentNode && matches(nodeName, key)) {
    return;
  }

  var node = undefined;

  // Check to see if the node has moved within the parent.
  if (key) {
    node = getChild(currentParent, key);
    if (node && 'production' !== 'production') {
      assertKeyedTagMatches(getData(node).nodeName, nodeName, key);
    }
  }

  // Create the node if it doesn't exist.
  if (!node) {
    if (nodeName === '#text') {
      node = createText(doc);
    } else {
      node = createElement(doc, currentParent, nodeName, key, statics);
    }

    if (key) {
      registerChild(currentParent, key, node);
    }

    context.markCreated(node);
  }

  // If the node has a key, remove it from the DOM to prevent a large number
  // of re-orders in the case that it moved far or was completely removed.
  // Since we hold on to a reference through the keyMap, we can always add it
  // back.
  if (currentNode && getData(currentNode).key) {
    currentParent.replaceChild(node, currentNode);
    getData(currentParent).keyMapValid = false;
  } else {
    currentParent.insertBefore(node, currentNode);
  }

  currentNode = node;
};

/**
 * Clears out any unvisited Nodes, as the corresponding virtual element
 * functions were never called for them.
 */
var clearUnvisitedDOM = function () {
  var node = currentParent;
  var data = getData(node);
  var keyMap = data.keyMap;
  var keyMapValid = data.keyMapValid;
  var child = node.lastChild;
  var key = undefined;

  if (child === currentNode && keyMapValid) {
    return;
  }

  if (data.attrs[symbols.placeholder] && node !== root) {
    return;
  }

  while (child !== currentNode) {
    node.removeChild(child);
    context.markDeleted( /** @type {!Node}*/child);

    key = getData(child).key;
    if (key) {
      delete keyMap[key];
    }
    child = node.lastChild;
  }

  // Clean the keyMap, removing any unusued keys.
  if (!keyMapValid) {
    for (key in keyMap) {
      child = keyMap[key];
      if (child.parentNode !== node) {
        context.markDeleted(child);
        delete keyMap[key];
      }
    }

    data.keyMapValid = true;
  }
};

/**
 * Changes to the first child of the current node.
 */
var enterNode = function () {
  currentParent = currentNode;
  currentNode = null;
};

/**
 * Changes to the next sibling of the current node.
 */
var nextNode = function () {
  if (currentNode) {
    currentNode = currentNode.nextSibling;
  } else {
    currentNode = currentParent.firstChild;
  }
};

/**
 * Changes to the parent of the current node, removing any unvisited children.
 */
var exitNode = function () {
  clearUnvisitedDOM();

  currentNode = currentParent;
  currentParent = currentParent.parentNode;
};

/**
 * Makes sure that the current node is an Element with a matching tagName and
 * key.
 *
 * @param {string} tag The element's tag.
 * @param {?string=} key The key used to identify this element. This can be an
 *     empty string, but performance may be better if a unique value is used
 *     when iterating over an array of items.
 * @param {?Array<*>=} statics An array of attribute name/value pairs of the
 *     static attributes for the Element. These will only be set once when the
 *     Element is created.
 * @return {!Element} The corresponding Element.
 */
var coreElementOpen = function (tag, key, statics) {
  nextNode();
  alignWithDOM(tag, key, statics);
  enterNode();
  return (/** @type {!Element} */currentParent
  );
};

/**
 * Closes the currently open Element, removing any unvisited children if
 * necessary.
 *
 * @return {!Element} The corresponding Element.
 */
var coreElementClose = function () {
  exitNode();
  return (/** @type {!Element} */currentNode
  );
};

/**
 * Makes sure the current node is a Text node and creates a Text node if it is
 * not.
 *
 * @return {!Text} The corresponding Text Node.
 */
var coreText = function () {
  nextNode();
  alignWithDOM('#text', null, null);
  return (/** @type {!Text} */currentNode
  );
};

/**
 * Gets the current Element being patched.
 * @return {!Element}
 */
var skip = function () {
  currentNode = currentParent.lastChild;
};

/**
 * The offset in the virtual element declaration where the attributes are
 * specified.
 * @const
 */
var ATTRIBUTES_OFFSET = 3;

/**
 * Builds an array of arguments for use with elementOpenStart, attr and
 * elementOpenEnd.
 * @const {Array<*>}
 */
var elementOpen$1 = function (tag, key, statics, const_args) {
  var node = coreElementOpen(tag, key, statics);
  var data = getData(node);

  /*
   * Checks to see if one or more attributes have changed for a given Element.
   * When no attributes have changed, this is much faster than checking each
   * individual argument. When attributes have changed, the overhead of this is
   * minimal.
   */
  var attrsArr = data.attrsArr;
  var newAttrs = data.newAttrs;
  var attrsChanged = false;
  var i = ATTRIBUTES_OFFSET;
  var j = 0;

  for (; i < arguments.length; i += 1, j += 1) {
    if (attrsArr[j] !== arguments[i]) {
      attrsChanged = true;
      break;
    }
  }

  for (; i < arguments.length; i += 1, j += 1) {
    attrsArr[j] = arguments[i];
  }

  if (j < attrsArr.length) {
    attrsChanged = true;
    attrsArr.length = j;
  }

  /*
   * Actually perform the attribute update.
   */
  if (attrsChanged) {
    for (i = ATTRIBUTES_OFFSET; i < arguments.length; i += 2) {
      newAttrs[arguments[i]] = arguments[i + 1];
    }

    for (var _attr in newAttrs) {
      updateAttribute(node, _attr, newAttrs[_attr]);
      newAttrs[_attr] = undefined;
    }
  }

  return node;
};

/**
 * Declares a virtual Element at the current location in the document. This
 * corresponds to an opening tag and a elementClose tag is required. This is
 * like elementOpen, but the attributes are defined using the attr function
 * rather than being passed as arguments. Must be folllowed by 0 or more calls
 * to attr, then a call to elementOpenEnd.
 * @param {string} tag The element's tag.
 * @param {?string=} key The key used to identify this element. This can be an
 *     empty string, but performance may be better if a unique value is used
 *     when iterating over an array of items.
 * @param {?Array<*>=} statics An array of attribute name/value pairs of the
 *     static attributes for the Element. These will only be set once when the
 *     Element is created.
 */
var elementClose = function (tag) {
  var node = coreElementClose();

  return node;
};

/**
 * Declares a virtual Element at the current location in the document that has
 * no children.
 * @param {string} tag The element's tag.
 * @param {?string=} key The key used to identify this element. This can be an
 *     empty string, but performance may be better if a unique value is used
 *     when iterating over an array of items.
 * @param {?Array<*>=} statics An array of attribute name/value pairs of the
 *     static attributes for the Element. These will only be set once when the
 *     Element is created.
 * @param {...*} const_args Attribute name/value pairs of the dynamic attributes
 *     for the Element.
 * @return {!Element} The corresponding Element.
 */
var text = function (value, const_args) {
  var node = coreText();
  var data = getData(node);

  if (data.text !== value) {
    data.text = /** @type {string} */value;

    var formatted = value;
    for (var i = 1; i < arguments.length; i += 1) {
      /*
       * Call the formatter function directly to prevent leaking arguments.
       * https://github.com/google/incremental-dom/pull/204#issuecomment-178223574
       */
      var fn = arguments[i];
      formatted = fn(formatted);
    }

    node.data = formatted;
  }

  return node;
};

var patchInner_1 = patchInner;
var skip_1 = skip;
var elementOpen_1 = elementOpen$1;
var elementClose_1 = elementClose;
var text_1 = text;
var symbols_1 = symbols;
var attributes_1 = attributes;
var applyProp_1 = applyProp;

function enter(object, props) {
  const saved = {};
  Object.keys(props).forEach(key => {
    saved[key] = object[key];
    object[key] = props[key];
  });
  return saved;
}

function exit(object, saved) {
  assign(object, saved);
}

// Decorates a function with a side effect that changes the properties of an
// object during its execution, and restores them after. There is no error
// handling here, if the wrapped function throws an error, properties are not
// restored and all bets are off.
var propContext = function (object, props) {
  return func => (...args) => {
    const saved = enter(object, props);
    const result = func(...args);
    exit(object, saved);
    return result;
  };
};

var commonjsGlobal = typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

var index = typeof self === 'object' && self.self === self && self || typeof commonjsGlobal === 'object' && commonjsGlobal.global === commonjsGlobal && commonjsGlobal || commonjsGlobal;

/* eslint no-plusplus: 0 */

const { customElements: customElements$1, HTMLElement } = index;
const applyDefault = attributes_1[symbols_1.default];

// A stack of children that corresponds to the current function helper being
// executed.
const stackChren = [];

const $skip = '__skip';
const $currentEventHandlers = '__events';
const $stackCurrentHelperProps = '__props';

// The current function helper in the stack.
let stackCurrentHelper;

// This is used for the Incremental DOM overrides to keep track of what args
// to pass the main elementOpen() function.
let overrideArgs;

// The number of levels deep after skipping a tree.
let skips = 0;

const noop = () => {};

// Adds or removes an event listener for an element.
function applyEvent(elem, ename, newFunc) {
  let events = elem[$currentEventHandlers];

  if (!events) {
    events = elem[$currentEventHandlers] = {};
  }

  // Undefined indicates that there is no listener yet.
  if (typeof events[ename] === 'undefined') {
    // We only add a single listener once. Originally this was a workaround for
    // the Webcomponents ShadyDOM polyfill not removing listeners, but it's
    // also a simpler model for binding / unbinding events because you only
    // have a single handler you need to worry about and a single place where
    // you only store one event handler
    elem.addEventListener(ename, function (e) {
      if (events[ename]) {
        events[ename].call(this, e);
      }
    });
  }

  // Not undefined indicates that we have set a listener, so default to null.
  events[ename] = typeof newFunc === 'function' ? newFunc : null;
}

const attributesContext = propContext(attributes_1, {
  // Attributes that shouldn't be applied to the DOM.
  key: noop,
  statics: noop,

  // Attributes that *must* be set via a property on all elements.
  checked: applyProp_1,
  className: applyProp_1,
  disabled: applyProp_1,
  value: applyProp_1,

  // Ref handler.
  ref(elem, name$$1, value) {
    elem[ref] = value;
  },

  // Skip handler.
  skip(elem, name$$1, value) {
    if (value) {
      elem[$skip] = true;
    } else {
      delete elem[$skip];
    }
  },

  // Default attribute applicator.
  [symbols_1.default](elem, name$$1, value) {
    const { props: props$$1, prototype } = customElements$1.get(elem.localName) || {
      props: {},
      prototype: {}
    };

    // TODO when refactoring properties to not have to workaround the old
    // WebKit bug we can remove the "name in props" check below.
    //
    // NOTE: That the "name in elem" check won't work for polyfilled custom
    // elements that set a property that isn't explicitly specified in "props"
    // or "prototype" unless it is added to the element explicitly as a
    // property prior to passing the prop to the vdom function. For example, if
    // it were added in a lifecycle callback because it wouldn't have been
    // upgraded yet.
    //
    // We prefer setting props, so we do this if there's a property matching
    // name that was passed. However, certain props on SVG elements are
    // readonly and error when you try to set them.
    if ((name$$1 in props$$1 || name$$1 in elem || name$$1 in prototype) && !('ownerSVGElement' in elem)) {
      applyProp_1(elem, name$$1, value);
      return;
    }

    // Explicit false removes the attribute.
    if (value === false) {
      applyDefault(elem, name$$1);
      return;
    }

    // Handle built-in and custom events.
    if (name$$1.indexOf('on') === 0) {
      const firstChar = name$$1[2];
      let eventName;

      if (firstChar === '-') {
        eventName = name$$1.substring(3);
      } else if (firstChar === firstChar.toUpperCase()) {
        eventName = firstChar.toLowerCase() + name$$1.substring(3);
      }

      if (eventName) {
        applyEvent(elem, eventName, value);
        return;
      }
    }

    applyDefault(elem, name$$1, value);
  }
});

function resolveTagName(name$$1) {
  // We return falsy values as some wrapped IDOM functions allow empty values.
  if (!name$$1) {
    return name$$1;
  }

  // We try and return the cached tag name, if one exists.
  if (name$$1[name]) {
    return name$$1[name];
  }

  // If it's a custom element, we get the tag name by constructing it and
  // caching it.
  if (name$$1.prototype instanceof HTMLElement) {
    // eslint-disable-next-line
    const elem = new name$$1();
    return name$$1[name] = elem.localName;
  }

  // Pass all other values through so IDOM gets what it's expecting.
  return name$$1;
}

// Incremental DOM's elementOpen is where the hooks in `attributes` are applied,
// so it's the only function we need to execute in the context of our attributes.
const elementOpen$$1 = attributesContext(elementOpen_1);

function elementOpenStart$$1(tag, key = null, statics = null) {
  overrideArgs = [tag, key, statics];
}

function elementOpenEnd$$1() {
  const node = newElementOpen(...overrideArgs); // eslint-disable-line no-use-before-define
  overrideArgs = null;
  return node;
}

function wrapIdomFunc(func, tnameFuncHandler = noop) {
  return function wrap(...args) {
    args[0] = resolveTagName(args[0]);
    stackCurrentHelper = null;
    if (typeof args[0] === 'function') {
      // If we've encountered a function, handle it according to the type of
      // function that is being wrapped.
      stackCurrentHelper = args[0];
      return tnameFuncHandler(...args);
    } else if (stackChren.length) {
      // We pass the wrap() function in here so that when it's called as
      // children, it will queue up for the next stack, if there is one.
      stackChren[stackChren.length - 1].push([wrap, args]);
    } else {
      if (func === elementOpen$$1) {
        if (skips) {
          return ++skips;
        }

        const elem = func(...args);

        if (elem[$skip]) {
          ++skips;
        }

        return elem;
      }

      if (func === elementClose_1) {
        if (skips === 1) {
          skip_1();
        }

        // We only want to skip closing if it's not the last closing tag in the
        // skipped tree because we keep the element that initiated the skpping.
        if (skips && --skips) {
          return;
        }

        const elem = func(...args);
        const ref$$1 = elem[ref];

        // We delete so that it isn't called again for the same element. If the
        // ref changes, or the element changes, this will be defined again.
        delete elem[ref];

        // Execute the saved ref after esuring we've cleand up after it.
        if (typeof ref$$1 === 'function') {
          ref$$1(elem);
        }

        return elem;
      }

      // We must call elementOpenStart and elementOpenEnd even if we are
      // skipping because they queue up attributes and then call elementClose.
      if (!skips || func === elementOpenStart$$1 || func === elementOpenEnd$$1) {
        return func(...args);
      }
    }
  };
}

function newAttr(...args) {
  if (stackCurrentHelper) {
    stackCurrentHelper[$stackCurrentHelperProps][args[0]] = args[1];
  } else if (stackChren.length) {
    stackChren[stackChren.length - 1].push([newAttr, args]);
  } else {
    overrideArgs.push(args[0]);
    overrideArgs.push(args[1]);
  }
}

function stackOpen(tname, key, statics, ...attrs) {
  const props$$1 = { key, statics };
  for (let a = 0; a < attrs.length; a += 2) {
    props$$1[attrs[a]] = attrs[a + 1];
  }
  tname[$stackCurrentHelperProps] = props$$1;
  stackChren.push([]);
}

function stackClose(tname) {
  const chren = stackChren.pop();
  const props$$1 = tname[$stackCurrentHelperProps];
  delete tname[$stackCurrentHelperProps];
  const elemOrFn = tname(props$$1, () => chren.forEach(args => args[0](...args[1])));
  return typeof elemOrFn === 'function' ? elemOrFn() : elemOrFn;
}

// Incremental DOM overrides
// -------------------------

// We must override internal functions that call internal Incremental DOM
// functions because we can't override the internal references. This means
// we must roughly re-implement their behaviour. Luckily, they're fairly
// simple.
const newElementOpenStart = wrapIdomFunc(elementOpenStart$$1, stackOpen);
const newElementOpenEnd = wrapIdomFunc(elementOpenEnd$$1);

// Standard open / closed overrides don't need to reproduce internal behaviour
// because they are the ones referenced from *End and *Start.
const newElementOpen = wrapIdomFunc(elementOpen$$1, stackOpen);
const newElementClose = wrapIdomFunc(elementClose_1, stackClose);

// Ensure we call our overridden functions instead of the internal ones.
const newText = wrapIdomFunc(text_1);

// Convenience function for declaring an Incremental DOM element using
// hyperscript-style syntax.
function element(tname, attrs, ...chren) {
  const atype = typeof attrs;

  // If attributes are a function, then they should be treated as children.
  if (atype === 'function' || atype === 'string' || atype === 'number') {
    chren.unshift(attrs);
  }

  // Ensure the attributes are an object. Null is considered an object so we
  // have to test for this explicitly.
  if (attrs === null || atype !== 'object') {
    attrs = {};
  }

  // We open the element so we can set attrs after.
  newElementOpenStart(tname, attrs.key, attrs.statics);

  // Delete so special attrs don't actually get set.
  delete attrs.key;
  delete attrs.statics;

  // Set attributes.
  Object.keys(attrs).forEach(name$$1 => newAttr(name$$1, attrs[name$$1]));

  // Close before we render the descendant tree.
  newElementOpenEnd(tname);

  chren.forEach(ch => {
    const ctype = typeof ch;
    if (ctype === 'function') {
      ch();
    } else if (ctype === 'string' || ctype === 'number') {
      newText(ch);
    } else if (Array.isArray(ch)) {
      ch.forEach(sch => sch());
    }
  });

  return newElementClose(tname);
}

// Even further convenience for building a DSL out of JavaScript functions or hooking into standard
// transpiles for JSX (React.createElement() / h).
function builder(...tags) {
  if (tags.length === 0) {
    return (...args) => element.bind(null, ...args);
  }
  return tags.map(tag => (...args) => element.bind(null, tag, ...args));
}

// We don't have to do anything special for the text function; it's just a
// straight export from Incremental DOM.

function createSymbol(description) {
  return typeof Symbol === 'function' ? Symbol(description) : description;
}

var data = function (element, namespace = '') {
  const data = element.__SKATE_DATA || (element.__SKATE_DATA = {});
  return namespace && (data[namespace] || (data[namespace] = {})) || data; // eslint-disable-line no-mixed-operators
};

const nativeHints = ['native code', '[object MutationObserverConstructor]' // for mobile safari iOS 9.0
];
var native = (fn => nativeHints.map(hint => (fn || '').toString().indexOf([hint]) > -1).reduce((a, b) => a || b));

const { MutationObserver } = index;

function microtaskDebounce(cbFunc) {
  let scheduled = false;
  let i = 0;
  let cbArgs = [];
  const elem = document.createElement('span');
  const observer = new MutationObserver(() => {
    cbFunc(...cbArgs);
    scheduled = false;
    cbArgs = null;
  });

  observer.observe(elem, { childList: true });

  return (...args) => {
    cbArgs = args;
    if (!scheduled) {
      scheduled = true;
      elem.textContent = `${ i }`;
      i += 1;
    }
  };
}

// We have to use setTimeout() for IE9 and 10 because the Mutation Observer
// polyfill requires that the element be in the document to trigger Mutation
// Events. Mutation Events are also synchronous and thus wouldn't debounce.
//
// The soonest we can set the timeout for in IE is 1 as they have issues when
// setting to 0.
function taskDebounce(cbFunc) {
  let scheduled = false;
  let cbArgs = [];
  return (...args) => {
    cbArgs = args;
    if (!scheduled) {
      scheduled = true;
      setTimeout(() => {
        scheduled = false;
        cbFunc(...cbArgs);
      }, 1);
    }
  };
}
var debounce = native(MutationObserver) ? microtaskDebounce : taskDebounce;

let environment = process && process.env ? process.env.NODE_ENV : null;
if (!environment) {
  environment = 'production';
}
// IE doesn't support 'startsWith'
const isProduction = environment.toLowerCase().indexOf('prod') === 0;

function deprecated(elem, oldUsage, newUsage) {
  if (!isProduction) {
    const ownerName = elem.localName ? elem.localName : String(elem);
    console.warn(`${ ownerName } ${ oldUsage } is deprecated. Use ${ newUsage }.`);
  }
}

class AttributesManager {
  constructor(elem) {
    this.elem = elem;
    this.connected = false;
    this.pendingValues = {};
    this.lastSetValues = {};
  }

  /**
   * Called from disconnectedCallback
   */
  suspendAttributesUpdates() {
    this.connected = false;
  }

  /**
   * Called from connectedCallback
   */
  resumeAttributesUpdates() {
    this.connected = true;
    const names = Object.keys(this.pendingValues);
    names.forEach(name => {
      const value = this.pendingValues[name];
      // Skip if already cleared
      if (!isUndefined(value)) {
        delete this.pendingValues[name];
        this._syncAttrValue(name, value);
      }
    });
  }

  /**
   * Returns true if the value is different from the one set internally
   * using setAttrValue()
   */
  onAttributeChanged(name, value) {
    value = toNullOrString(value);

    // A new attribute value voids the pending one
    this._clearPendingValue(name);

    const changed = this.lastSetValues[name] !== value;
    this.lastSetValues[name] = value;
    return changed;
  }

  /**
   * Updates or removes the attribute if value === null.
   *
   * When the component is not connected the value is saved and
   * the attribute is only updated when the component is re-connected.
   */
  setAttrValue(name, value) {
    value = toNullOrString(value);

    this.lastSetValues[name] = value;

    if (this.connected) {
      this._clearPendingValue(name);
      this._syncAttrValue(name, value);
    } else {
      this.pendingValues[name] = value;
    }
  }

  _syncAttrValue(name, value) {
    const currAttrValue = toNullOrString(this.elem.getAttribute(name));
    if (value !== currAttrValue) {
      if (value === null) {
        this.elem.removeAttribute(name);
      } else {
        this.elem.setAttribute(name, value);
      }
    }
  }

  _clearPendingValue(name) {
    if (name in this.pendingValues) {
      delete this.pendingValues[name];
    }
  }
}

// Only used by getAttrMgr
const $attributesMgr = '____skate_attributesMgr';

/**
 * @internal
 * Returns attribute manager instance for the given Component
 */
function getAttrMgr(elem) {
  let mgr = elem[$attributesMgr];
  if (!mgr) {
    mgr = new AttributesManager(elem);
    elem[$attributesMgr] = mgr;
  }
  return mgr;
}

var getOwnPropertyDescriptors = function (obj = {}) {
  return getPropNamesAndSymbols(obj).reduce((prev, nameOrSymbol) => {
    prev[nameOrSymbol] = Object.getOwnPropertyDescriptor(obj, nameOrSymbol);
    return prev;
  }, {});
};

var dashCase = function (str) {
  return str.split(/([A-Z])/).reduce((one, two, idx) => {
    const dash = !one || idx % 2 === 0 ? '' : '-';
    return `${ one }${ dash }${ two.toLowerCase() }`;
  });
};

function error(message) {
  throw new Error(message);
}

class PropDefinition {

  constructor(nameOrSymbol, propOptions) {
    this._nameOrSymbol = nameOrSymbol;

    propOptions = propOptions || {};

    // default 'attrSource': no observed source attribute (name)
    this.attrSource = null;

    // default 'attrTarget': no reflected target attribute (name)
    this.attrTarget = null;

    // default 'attrTargetIsNotSource'
    this.attrTargetIsNotSource = false;

    // default 'coerce': identity function
    this.coerce = value => value;

    // default 'default': set prop to 'null'
    this.default = null;

    // default 'deserialize': return attribute's value (string or null)
    this.deserialize = value => value;

    // default 'get': no function
    this.get = null;

    // 'initial' default: unspecified
    // 'initial' option is truly optional and it cannot be initialized.
    // Its presence is tested using: ('initial' in propDef)

    // 'serialize' default: return string value or null
    this.serialize = value => empty(value) ? null : String(value);

    // default 'set': no function
    this.set = null;

    // Note: option key is always a string (no symbols here)
    Object.keys(propOptions).forEach(option => {
      const optVal = propOptions[option];

      // Only accept documented options and perform minimal input validation.
      switch (option) {
        case 'attribute':
          if (!isObject(optVal)) {
            this.attrSource = this.attrTarget = resolveAttrName(optVal, nameOrSymbol);
          } else {
            const { source, target } = optVal;
            if (!source && !target) {
              error(`${ option } 'source' or 'target' is missing.`);
            }
            this.attrSource = resolveAttrName(source, nameOrSymbol);
            this.attrTarget = resolveAttrName(target, nameOrSymbol);
            this.attrTargetIsNotSource = this.attrTarget !== this.attrSource;
          }
          break;
        case 'coerce':
        case 'deserialize':
        case 'get':
        case 'serialize':
        case 'set':
          if (isFunction(optVal)) {
            this[option] = optVal;
          } else {
            error(`${ option } must be a function.`);
          }
          break;
        case 'default':
        case 'initial':
          this[option] = optVal;
          break;
        default:
          // TODO: undocumented options?
          this[option] = optVal;
          break;
      }
    });
  }

  get nameOrSymbol() {
    return this._nameOrSymbol;
  }

}

function resolveAttrName(attrOption, nameOrSymbol) {
  if (isSymbol(nameOrSymbol)) {
    error(`${ nameOrSymbol.toString() } symbol property cannot have an attribute.`);
  } else {
    if (attrOption === true) {
      return dashCase(String(nameOrSymbol));
    }
    if (isString(attrOption)) {
      return attrOption;
    }
  }
  return null;
}

/**
 * This is needed to avoid IE11 "stack size errors" when creating
 * a new property on the constructor of an HTMLElement
 */
function setCtorNativeProperty(Ctor, propName, value) {
  Object.defineProperty(Ctor, propName, { configurable: true, value });
}

function getPropsMap(Ctor) {
  // Must be defined on constructor and not from a superclass
  if (!Ctor.hasOwnProperty(ctorPropsMap)) {
    const props$$1 = Ctor.props || {};

    const propsMap = getPropNamesAndSymbols(props$$1).reduce((result, nameOrSymbol) => {
      result[nameOrSymbol] = new PropDefinition(nameOrSymbol, props$$1[nameOrSymbol]);
      return result;
    }, {});
    setCtorNativeProperty(Ctor, ctorPropsMap, propsMap);
  }

  return Ctor[ctorPropsMap];
}

function get(elem) {
  const props$$1 = {};

  getPropNamesAndSymbols(getPropsMap(elem.constructor)).forEach(nameOrSymbol => {
    props$$1[nameOrSymbol] = elem[nameOrSymbol];
  });

  return props$$1;
}

function set(elem, newProps) {
  assign(elem, newProps);
  if (elem[renderer]) {
    elem[renderer]();
  }
}

var props$1 = function (elem, newProps) {
  return isUndefined(newProps) ? get(elem) : set(elem, newProps);
};

function getDefaultValue(elem, propDef) {
  return typeof propDef.default === 'function' ? propDef.default(elem, { name: propDef.nameOrSymbol }) : propDef.default;
}

function getInitialValue(elem, propDef) {
  return typeof propDef.initial === 'function' ? propDef.initial(elem, { name: propDef.nameOrSymbol }) : propDef.initial;
}

function getPropData(elem, name) {
  const elemData = data(elem, 'props');
  return elemData[name] || (elemData[name] = {});
}

function createNativePropertyDescriptor(propDef) {
  const { nameOrSymbol } = propDef;

  const prop = {
    configurable: true,
    enumerable: true
  };

  prop.beforeDefineProperty = elem => {
    const propData = getPropData(elem, nameOrSymbol);
    const attrSource = propDef.attrSource;

    // Store attrSource name to property link.
    if (attrSource) {
      data(elem, 'attrSourceLinks')[attrSource] = nameOrSymbol;
    }

    // prop value before upgrading
    let initialValue = elem[nameOrSymbol];

    // Set up initial value if it wasn't specified.
    let valueFromAttrSource = false;
    if (empty(initialValue)) {
      if (attrSource && elem.hasAttribute(attrSource)) {
        valueFromAttrSource = true;
        initialValue = propDef.deserialize(elem.getAttribute(attrSource));
      } else if ('initial' in propDef) {
        initialValue = getInitialValue(elem, propDef);
      } else {
        initialValue = getDefaultValue(elem, propDef);
      }
    }

    initialValue = propDef.coerce(initialValue);

    propData.internalValue = initialValue;

    // Reflect to Target Attribute
    const mustReflect = propDef.attrTarget && !empty(initialValue) && (!valueFromAttrSource || propDef.attrTargetIsNotSource);

    if (mustReflect) {
      let serializedValue = propDef.serialize(initialValue);
      getAttrMgr(elem).setAttrValue(propDef.attrTarget, serializedValue);
    }
  };

  prop.get = function get() {
    const propData = getPropData(this, nameOrSymbol);
    const { internalValue } = propData;
    return propDef.get ? propDef.get(this, { name: nameOrSymbol, internalValue }) : internalValue;
  };

  prop.set = function set(newValue) {
    const propData = getPropData(this, nameOrSymbol);

    const useDefaultValue = empty(newValue);
    if (useDefaultValue) {
      newValue = getDefaultValue(this, propDef);
    }

    newValue = propDef.coerce(newValue);

    if (propDef.set) {
      let { oldValue } = propData;

      if (empty(oldValue)) {
        oldValue = null;
      }
      const changeData = { name: nameOrSymbol, newValue, oldValue };
      propDef.set(this, changeData);
    }

    // Queue a re-render.
    this[rendererDebounced](this);

    // Update prop data so we can use it next time.
    propData.internalValue = propData.oldValue = newValue;

    // Reflect to Target attribute.
    const mustReflect = propDef.attrTarget && (propDef.attrTargetIsNotSource || !propData.settingPropFromAttrSource);
    if (mustReflect) {
      // Note: setting the prop to empty implies the default value
      // and therefore no attribute should be present!
      let serializedValue = useDefaultValue ? null : propDef.serialize(newValue);
      getAttrMgr(this).setAttrValue(propDef.attrTarget, serializedValue);
    }
  };

  return prop;
}

/**
 * Polyfill Object.is for IE
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is
 */
if (!Object.is) {
  Object.is = function (x, y) {
    // SameValue algorithm
    if (x === y) {
      // Steps 1-5, 7-10
      // Steps 6.b-6.e: +0 != -0
      return x !== 0 || 1 / x === 1 / y;
    } else {
      // Step 6.a: NaN == NaN
      return x !== x && y !== y;
    }
  };
}
var objectIs = Object.is;

const HTMLElement$1 = index.HTMLElement || class {};
const _prevName = createSymbol('prevName');
const _prevOldValue = createSymbol('prevOldValue');
const _prevNewValue = createSymbol('prevNewValue');

function preventDoubleCalling(elem, name$$1, oldValue, newValue) {
  return name$$1 === elem[_prevName] && oldValue === elem[_prevOldValue] && newValue === elem[_prevNewValue];
}

// TODO remove when not catering to Safari < 10.
function createNativePropertyDescriptors(Ctor) {
  const propDefs = getPropsMap(Ctor);
  return getPropNamesAndSymbols(propDefs).reduce((propDescriptors, nameOrSymbol) => {
    propDescriptors[nameOrSymbol] = createNativePropertyDescriptor(propDefs[nameOrSymbol]);
    return propDescriptors;
  }, {});
}

// TODO refactor when not catering to Safari < 10.
//
// We should be able to simplify this where all we do is Object.defineProperty().
function createInitProps(Ctor) {
  const propDescriptors = createNativePropertyDescriptors(Ctor);

  return elem => {
    getPropNamesAndSymbols(propDescriptors).forEach(nameOrSymbol => {
      const propDescriptor = propDescriptors[nameOrSymbol];
      propDescriptor.beforeDefineProperty(elem);

      // We check here before defining to see if the prop was specified prior
      // to upgrading.
      const hasPropBeforeUpgrading = nameOrSymbol in elem;

      // This is saved prior to defining so that we can set it after it it was
      // defined prior to upgrading. We don't want to invoke the getter if we
      // don't need to, so we only get the value if we need to re-sync.
      const valueBeforeUpgrading = hasPropBeforeUpgrading && elem[nameOrSymbol];

      // https://bugs.webkit.org/show_bug.cgi?id=49739
      //
      // When Webkit fixes that bug so that native property accessors can be
      // retrieved, we can move defining the property to the prototype and away
      // from having to do if for every instance as all other browsers support
      // this.
      Object.defineProperty(elem, nameOrSymbol, propDescriptor);

      // DEPRECATED
      //
      // We'll be removing get / set callbacks on properties. Use the
      // updatedCallback() instead.
      //
      // We re-set the prop if it was specified prior to upgrading because we
      // need to ensure set() is triggered both in polyfilled environments and
      // in native where the definition may be registerd after elements it
      // represents have already been created.
      if (hasPropBeforeUpgrading) {
        elem[nameOrSymbol] = valueBeforeUpgrading;
      }
    });
  };
}

var Component = class extends HTMLElement$1 {
  /**
   * Returns unique attribute names configured with props and
   * those set on the Component constructor if any
   */
  static get observedAttributes() {
    const attrsOnCtor = this.hasOwnProperty(ctorObservedAttributes) ? this[ctorObservedAttributes] : [];
    const propDefs = getPropsMap(this);

    // Use Object.keys to skips symbol props since they have no linked attributes
    const attrsFromLinkedProps = Object.keys(propDefs).map(propName => propDefs[propName].attrSource).filter(Boolean);

    const all = attrsFromLinkedProps.concat(attrsOnCtor).concat(super.observedAttributes);
    return all.filter((item, index$$1) => all.indexOf(item) === index$$1);
  }

  static set observedAttributes(value) {
    value = Array.isArray(value) ? value : [];
    setCtorNativeProperty(this, 'observedAttributes', value);
  }

  // Returns superclass props overwritten with this Component props
  static get props() {
    return assign({}, super.props, this[ctorProps]);
  }

  static set props(value) {
    setCtorNativeProperty(this, ctorProps, value);
  }

  // Passing args is designed to work with document-register-element. It's not
  // necessary for the webcomponents/custom-element polyfill.
  constructor(...args) {
    super(...args);

    const { constructor } = this;

    // Used for the ready() function so it knows when it can call its callback.
    this[created] = true;

    // TODO refactor to not cater to Safari < 10. This means we can depend on
    // built-in property descriptors.
    // Must be defined on constructor and not from a superclass
    if (!constructor.hasOwnProperty(ctorCreateInitProps)) {
      setCtorNativeProperty(constructor, ctorCreateInitProps, createInitProps(constructor));
    }

    // Set up a renderer that is debounced for property sets to call directly.
    this[rendererDebounced] = debounce(this[renderer].bind(this));

    // Set up property lifecycle.
    const propDefsCount = getPropNamesAndSymbols(getPropsMap(constructor)).length;
    if (propDefsCount && constructor[ctorCreateInitProps]) {
      constructor[ctorCreateInitProps](this);
    }

    // DEPRECATED
    //
    // static render()
    // Note that renderCallback is an optional method!
    if (!this.renderCallback && constructor.render) {
      deprecated(this, 'static render', 'renderCallback');
      this.renderCallback = constructor.render.bind(constructor, this);
    }

    // DEPRECATED
    //
    // static created()
    //
    // Props should be set up before calling this.
    const { created: created$$1 } = constructor;
    if (isFunction(created$$1)) {
      deprecated(this, 'static created', 'constructor');
      created$$1(this);
    }

    // DEPRECATED
    //
    // Feature has rarely been used.
    //
    // Created should be set before invoking the ready listeners.
    const elemData = data(this);
    const readyCallbacks = elemData.readyCallbacks;
    if (readyCallbacks) {
      readyCallbacks.forEach(cb => cb(this));
      delete elemData.readyCallbacks;
    }
  }

  // Custom Elements v1
  connectedCallback() {
    // Reflect attributes pending values
    getAttrMgr(this).resumeAttributesUpdates();

    // Used to check whether or not the component can render.
    this[connected] = true;

    // Render!
    this[rendererDebounced]();

    // DEPRECATED
    //
    // static attached()
    const { attached } = this.constructor;
    if (isFunction(attached)) {
      deprecated(this, 'static attached', 'connectedCallback');
      attached(this);
    }

    // DEPRECATED
    //
    // We can remove this once all browsers support :defined.
    this.setAttribute('defined', '');
  }

  // Custom Elements v1
  disconnectedCallback() {
    // Suspend updating attributes until re-connected
    getAttrMgr(this).suspendAttributesUpdates();

    // Ensures the component can't be rendered while disconnected.
    this[connected] = false;

    // DEPRECATED
    //
    // static detached()
    const { detached } = this.constructor;
    if (isFunction(detached)) {
      deprecated(this, 'static detached', 'disconnectedCallback');
      detached(this);
    }
  }

  // Custom Elements v1
  attributeChangedCallback(name$$1, oldValue, newValue) {
    // Polyfill calls this twice.
    if (preventDoubleCalling(this, name$$1, oldValue, newValue)) {
      return;
    }

    // Set data so we can prevent double calling if the polyfill.
    this[_prevName] = name$$1;
    this[_prevOldValue] = oldValue;
    this[_prevNewValue] = newValue;

    const propNameOrSymbol = data(this, 'attrSourceLinks')[name$$1];
    if (propNameOrSymbol) {
      const changedExternally = getAttrMgr(this).onAttributeChanged(name$$1, newValue);
      if (changedExternally) {
        // Sync up the property.
        const propDef = getPropsMap(this.constructor)[propNameOrSymbol];
        const newPropVal = newValue !== null && propDef.deserialize ? propDef.deserialize(newValue) : newValue;

        const propData = data(this, 'props')[propNameOrSymbol];
        propData.settingPropFromAttrSource = true;
        this[propNameOrSymbol] = newPropVal;
        propData.settingPropFromAttrSource = false;
      }
    }

    // DEPRECATED
    //
    // static attributeChanged()
    const { attributeChanged } = this.constructor;
    if (isFunction(attributeChanged)) {
      deprecated(this, 'static attributeChanged', 'attributeChangedCallback');
      attributeChanged(this, { name: name$$1, newValue, oldValue });
    }
  }

  // Skate
  updatedCallback(prevProps) {
    if (this.constructor.hasOwnProperty('updated')) {
      deprecated(this, 'static updated', 'updatedCallback');
    }
    return this.constructor.updated(this, prevProps);
  }

  // Skate
  renderedCallback() {
    if (this.constructor.hasOwnProperty('rendered')) {
      deprecated(this, 'static rendered', 'renderedCallback');
    }
    return this.constructor.rendered(this);
  }

  // Skate
  //
  // Maps to the static renderer() callback. That logic should be moved here
  // when that is finally removed.
  // TODO: finalize how to support different rendering strategies.
  rendererCallback() {
    // TODO: cannot move code here because tests expects renderer function to still exist on constructor!
    return this.constructor.renderer(this);
  }

  // Skate
  // @internal
  // Invokes the complete render lifecycle.
  [renderer]() {
    if (this[rendering] || !this[connected]) {
      return;
    }

    // Flag as rendering. This prevents anything from trying to render - or
    // queueing a render - while there is a pending render.
    this[rendering] = true;
    if (this[updated]() && isFunction(this.renderCallback)) {
      this.rendererCallback();
      this.renderedCallback();
    }

    this[rendering] = false;
  }

  // Skate
  // @internal
  // Calls the updatedCallback() with previous props.
  [updated]() {
    const prevProps = this[props];
    this[props] = props$1(this);
    return this.updatedCallback(prevProps);
  }

  // Skate
  static extend(definition = {}, Base = this) {
    // Create class for the user.
    class Ctor extends Base {}

    // For inheriting from the object literal.
    const opts = getOwnPropertyDescriptors(definition);
    const prot = getOwnPropertyDescriptors(definition.prototype);

    // Prototype is non configurable (but is writable).
    delete opts.prototype;

    // Pass on static and instance members from the definition.
    Object.defineProperties(Ctor, opts);
    Object.defineProperties(Ctor.prototype, prot);

    return Ctor;
  }

  // Skate
  //
  // DEPRECATED
  //
  // Stubbed in case any subclasses are calling it.
  static rendered() {}

  // Skate
  //
  // DEPRECATED
  //
  // Move this to rendererCallback() before removing.
  static renderer(elem) {
    if (!elem.shadowRoot) {
      elem.attachShadow({ mode: 'open' });
    }
    patchInner_1(elem.shadowRoot, () => {
      const possibleFn = elem.renderCallback(elem);
      if (isFunction(possibleFn)) {
        possibleFn();
      } else if (Array.isArray(possibleFn)) {
        possibleFn.forEach(fn => {
          if (isFunction(fn)) {
            fn();
          }
        });
      }
    });
  }

  // Skate
  //
  // DEPRECATED
  //
  // Move this to updatedCallback() before removing.
  static updated(elem, previousProps) {
    // The 'previousProps' will be undefined if it is the initial render.
    if (!previousProps) {
      return true;
    }

    // The 'previousProps' will always contain all of the keys.
    //
    // Use classic loop because:
    // 'for ... in' skips symbols and 'for ... of' is not working yet with IE!?
    // for (let nameOrSymbol of getPropNamesAndSymbols(previousProps)) {
    const namesAndSymbols = getPropNamesAndSymbols(previousProps);
    for (let i = 0; i < namesAndSymbols.length; i++) {
      const nameOrSymbol = namesAndSymbols[i];

      // With Object.is NaN is equal to NaN
      if (!objectIs(previousProps[nameOrSymbol], elem[nameOrSymbol])) {
        return true;
      }
    }

    return false;
  }
};

const Event = (TheEvent => {
  if (TheEvent) {
    try {
      new TheEvent('emit-init'); // eslint-disable-line no-new
    } catch (e) {
      return undefined;
    }
  }
  return TheEvent;
})(index.Event);

const h = builder();

var styles = `
  *{
    box-sizing: border-box;
    font-family: Georgia;
  }
  .wrapper{
    border: 1px solid #ccc;
    width: 600px;
    padding: 5px;
    cursor: text;
  }
  .tags{
    cursor: default;
  }
  .tags .deletion::after{
    margin-left: 4px;
    padding: 0 4px;
    content: 'x';
    background-color: #ccc;
    cursor: pointer;
  }
  .tag{
    border: 1px solid #45B39E;
    padding: 3px;
    margin: 3px 7px 3px 2px;
    display: inline-block;
  }
  .input{
    width: 31px;
    height: 36px;
    outline: none;
    border-color: transparent;
    font-size: 16px;
  }
`;

var define$1 = ((componentName, classDefinition) => {
  if (customElements.get(componentName)) {
    console.warn(`${ componentName } it's already defined, skiping redefinition`);
    return;
  }

  customElements.define(componentName, classDefinition);
});

const deleteCode = 8;

class SKTags extends Component {
  constructor(...args) {
    var _temp;

    return _temp = super(...args), this.onTagClick = e => {
      if (e.target.classList.contains('deletion')) {
        const childs = Array.from(e.currentTarget.parentElement.children);
        const index = childs.indexOf(e.currentTarget);

        this.removeTag(index);
        this.focusInput();
      }
    }, this.onWrapperClick = e => {
      this.focusInput();
    }, this.onKeydown = e => {
      const value = e.target.value;
      const isDel = e.keyCode === deleteCode;

      if (isDel && value.length <= 0) {
        this.removeTag();
      }
    }, this.onInput = e => {
      const lastChar = e.target.value.substr(-1);
      const value = e.target.value.slice(0, -1).trim();
      const isDelimiter = lastChar === this.delimiter;

      if (value && isDelimiter) {
        this.addTag(value);
        e.target.value = '';
      }

      this.adjustInputSize(e.target.value.length);
    }, _temp;
  }

  renderCallback() {
    const tags = this.tags;
    const allowDeletion = this.deletion ? 'deletion' : '';
    const tagElements = tags.map(t => {
      const tagContent = allowDeletion ? h(
        'span',
        { 'class': 'deletion' },
        t
      ) : t;

      return h(
        'span',
        { 'class': 'tag', onclick: this.onTagClick },
        tagContent
      );
    });

    return h(
      'div',
      null,
      h(
        'style',
        null,
        styles
      ),
      h(
        'div',
        { 'class': 'wrapper', onclick: this.onWrapperClick },
        h(
          'span',
          { 'class': 'tags' },
          tagElements
        ),
        h('input', { type: 'text', oninput: this.onInput, onkeydown: this.onKeydown, autofocus: 'true', 'class': 'input' })
      )
    );
  }

  focusInput() {
    this.shadowRoot.querySelector('.input').focus();
  }

  adjustInputSize(textLength) {
    const input = this.shadowRoot.querySelector('.input');
    const width = textLength * 10 + 6;

    input.style.width = `${ width }px`;
  }

  addTag(value) {
    this.tags = this.tags.concat(value);
  }

  removeTag(index = -1) {
    const tags = this.tags.slice();

    tags.splice(index, 1);
    this.tags = tags;
  }
}

SKTags.props = {
  delimiter: string({ attribute: true, default: ' ' }),
  tags: array({ attribute: true }),
  deletion: {
    attribute: true,
    default: false
  },
  //TODO: Implement editable tags
  editable: {
    attribute: true,
    default: true
  }
};
define$1('sk-tags', SKTags);

module.exports = SKTags;

}).call(this,require('_process'),typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"_process":1}]},{},[2]);
