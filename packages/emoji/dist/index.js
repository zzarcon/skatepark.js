(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function (global){
'use strict';

const isFunction = val => typeof val === 'function';
const isObject = val => (typeof val === 'object' && val !== null);
const isString = val => typeof val === 'string';
const isSymbol = val => typeof val === 'symbol';
const isUndefined = val => typeof val === 'undefined';

function getPropNamesAndSymbols (obj = {}) {
  const listOfKeys = Object.getOwnPropertyNames(obj);
  return isFunction(Object.getOwnPropertySymbols)
    ? listOfKeys.concat(Object.getOwnPropertySymbols(obj))
    : listOfKeys;
}

var assign = (obj, ...args) => {
  args.forEach(arg => getPropNamesAndSymbols(arg).forEach(nameOrSymbol => obj[nameOrSymbol] = arg[nameOrSymbol])); // eslint-disable-line no-return-assign
  return obj;
};

var empty = function (val) {
  return typeof val === 'undefined' || val === null;
};

const toNullOrString = val => (empty(val) ? null : String(val));

// defaults empty to 0 and allows NaN

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

function enter (object, props) {
  const saved = {};
  Object.keys(props).forEach((key) => {
    saved[key] = object[key];
    object[key] = props[key];
  });
  return saved;
}

function exit (object, saved) {
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

var index = (typeof self === 'object' && self.self === self && self) ||
  (typeof commonjsGlobal === 'object' && commonjsGlobal.global === commonjsGlobal && commonjsGlobal) ||
  commonjsGlobal;

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
function applyEvent (elem, ename, newFunc) {
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
  ref (elem, name$$1, value) {
    elem[ref] = value;
  },

  // Skip handler.
  skip (elem, name$$1, value) {
    if (value) {
      elem[$skip] = true;
    } else {
      delete elem[$skip];
    }
  },

  // Default attribute applicator.
  [symbols_1.default] (elem, name$$1, value) {
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

function resolveTagName (name$$1) {
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
    return (name$$1[name] = elem.localName);
  }

  // Pass all other values through so IDOM gets what it's expecting.
  return name$$1;
}

// Incremental DOM's elementOpen is where the hooks in `attributes` are applied,
// so it's the only function we need to execute in the context of our attributes.
const elementOpen$$1 = attributesContext(elementOpen_1);

function elementOpenStart$$1 (tag, key = null, statics = null) {
  overrideArgs = [tag, key, statics];
}

function elementOpenEnd$$1 () {
  const node = newElementOpen(...overrideArgs); // eslint-disable-line no-use-before-define
  overrideArgs = null;
  return node;
}

function wrapIdomFunc (func, tnameFuncHandler = noop) {
  return function wrap (...args) {
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
      if (!skips || (func === elementOpenStart$$1 || func === elementOpenEnd$$1)) {
        return func(...args);
      }
    }
  };
}

function newAttr (...args) {
  if (stackCurrentHelper) {
    stackCurrentHelper[$stackCurrentHelperProps][args[0]] = args[1];
  } else if (stackChren.length) {
    stackChren[stackChren.length - 1].push([newAttr, args]);
  } else {
    overrideArgs.push(args[0]);
    overrideArgs.push(args[1]);
  }
}

function stackOpen (tname, key, statics, ...attrs) {
  const props$$1 = { key, statics };
  for (let a = 0; a < attrs.length; a += 2) {
    props$$1[attrs[a]] = attrs[a + 1];
  }
  tname[$stackCurrentHelperProps] = props$$1;
  stackChren.push([]);
}

function stackClose (tname) {
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
function element (tname, attrs, ...chren) {
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

  chren.forEach((ch) => {
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
function builder (...tags) {
  if (tags.length === 0) {
    return (...args) => element.bind(null, ...args);
  }
  return tags.map(tag =>
    (...args) =>
      element.bind(null, tag, ...args)
  );
}

// We don't have to do anything special for the text function; it's just a
// straight export from Incremental DOM.

function createSymbol (description) {
  return typeof Symbol === 'function' ? Symbol(description) : description;
}

var data = function (element, namespace = '') {
  const data = element.__SKATE_DATA || (element.__SKATE_DATA = {});
  return namespace && (data[namespace] || (data[namespace] = {})) || data; // eslint-disable-line no-mixed-operators
};

const nativeHints = [
  'native code',
  '[object MutationObserverConstructor]' // for mobile safari iOS 9.0
];
var native = fn => nativeHints.map(
  (hint) => (fn || '').toString().indexOf([hint]) > -1
).reduce((a, b) => a || b);

const { MutationObserver } = index;

function microtaskDebounce (cbFunc) {
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
      elem.textContent = `${i}`;
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
function taskDebounce (cbFunc) {
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

function deprecated (elem, oldUsage, newUsage) {
  if (DEBUG) {
    const ownerName = elem.localName ? elem.localName : String(elem);
    console.warn(`${ownerName} ${oldUsage} is deprecated. Use ${newUsage}.`);
  }
}

class AttributesManager {
  constructor (elem) {
    this.elem = elem;
    this.connected = false;
    this.pendingValues = {};
    this.lastSetValues = {};
  }

  /**
   * Called from disconnectedCallback
   */
  suspendAttributesUpdates () {
    this.connected = false;
  }

  /**
   * Called from connectedCallback
   */
  resumeAttributesUpdates () {
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
  onAttributeChanged (name, value) {
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
  setAttrValue (name, value) {
    value = toNullOrString(value);

    this.lastSetValues[name] = value;

    if (this.connected) {
      this._clearPendingValue(name);
      this._syncAttrValue(name, value);
    } else {
      this.pendingValues[name] = value;
    }
  }

  _syncAttrValue (name, value) {
    const currAttrValue = toNullOrString(this.elem.getAttribute(name));
    if (value !== currAttrValue) {
      if (value === null) {
        this.elem.removeAttribute(name);
      } else {
        this.elem.setAttribute(name, value);
      }
    }
  }

  _clearPendingValue (name) {
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
function getAttrMgr (elem) {
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
    return `${one}${dash}${two.toLowerCase()}`;
  });
};

function error (message) {
  throw new Error(message);
}

class PropDefinition {

  constructor (nameOrSymbol, propOptions) {
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
    this.serialize = value => (empty(value) ? null : String(value));

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
              error(`${option} 'source' or 'target' is missing.`);
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
            error(`${option} must be a function.`);
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

  get nameOrSymbol () {
    return this._nameOrSymbol;
  }

}

function resolveAttrName (attrOption, nameOrSymbol) {
  if (isSymbol(nameOrSymbol)) {
    error(`${nameOrSymbol.toString()} symbol property cannot have an attribute.`);
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
function setCtorNativeProperty (Ctor, propName, value) {
  Object.defineProperty(Ctor, propName, { configurable: true, value });
}

function getPropsMap (Ctor) {
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

function get$1 (elem) {
  const props$$1 = {};

  getPropNamesAndSymbols(getPropsMap(elem.constructor)).forEach((nameOrSymbol) => {
    props$$1[nameOrSymbol] = elem[nameOrSymbol];
  });

  return props$$1;
}

function set$1 (elem, newProps) {
  assign(elem, newProps);
  if (elem[renderer]) {
    elem[renderer]();
  }
}

var props$1 = function (elem, newProps) {
  return isUndefined(newProps) ? get$1(elem) : set$1(elem, newProps);
};

function getDefaultValue (elem, propDef) {
  return typeof propDef.default === 'function'
    ? propDef.default(elem, { name: propDef.nameOrSymbol })
    : propDef.default;
}

function getInitialValue (elem, propDef) {
  return typeof propDef.initial === 'function'
    ? propDef.initial(elem, { name: propDef.nameOrSymbol })
    : propDef.initial;
}

function getPropData (elem, name) {
  const elemData = data(elem, 'props');
  return elemData[name] || (elemData[name] = {});
}

function createNativePropertyDescriptor (propDef) {
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
    const mustReflect = propDef.attrTarget && !empty(initialValue) &&
      (!valueFromAttrSource || propDef.attrTargetIsNotSource);

    if (mustReflect) {
      let serializedValue = propDef.serialize(initialValue);
      getAttrMgr(elem).setAttrValue(propDef.attrTarget, serializedValue);
    }
  };

  prop.get = function get () {
    const propData = getPropData(this, nameOrSymbol);
    const { internalValue } = propData;
    return propDef.get ? propDef.get(this, { name: nameOrSymbol, internalValue }) : internalValue;
  };

  prop.set = function set (newValue) {
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
    const mustReflect = propDef.attrTarget &&
      (propDef.attrTargetIsNotSource || !propData.settingPropFromAttrSource);
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
    if (x === y) { // Steps 1-5, 7-10
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

function preventDoubleCalling (elem, name$$1, oldValue, newValue) {
  return name$$1 === elem[_prevName] &&
    oldValue === elem[_prevOldValue] &&
    newValue === elem[_prevNewValue];
}

// TODO remove when not catering to Safari < 10.
function createNativePropertyDescriptors (Ctor) {
  const propDefs = getPropsMap(Ctor);
  return getPropNamesAndSymbols(propDefs).reduce((propDescriptors, nameOrSymbol) => {
    propDescriptors[nameOrSymbol] = createNativePropertyDescriptor(propDefs[nameOrSymbol]);
    return propDescriptors;
  }, {});
}

// TODO refactor when not catering to Safari < 10.
//
// We should be able to simplify this where all we do is Object.defineProperty().
function createInitProps (Ctor) {
  const propDescriptors = createNativePropertyDescriptors(Ctor);

  return (elem) => {
    getPropNamesAndSymbols(propDescriptors).forEach((nameOrSymbol) => {
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
  static get observedAttributes () {
    const attrsOnCtor = this.hasOwnProperty(ctorObservedAttributes) ? this[ctorObservedAttributes] : [];
    const propDefs = getPropsMap(this);

    // Use Object.keys to skips symbol props since they have no linked attributes
    const attrsFromLinkedProps = Object.keys(propDefs).map(propName =>
      propDefs[propName].attrSource).filter(Boolean);

    const all = attrsFromLinkedProps.concat(attrsOnCtor).concat(super.observedAttributes);
    return all.filter((item, index$$1) =>
      all.indexOf(item) === index$$1);
  }

  static set observedAttributes (value) {
    value = Array.isArray(value) ? value : [];
    setCtorNativeProperty(this, 'observedAttributes', value);
  }

  // Returns superclass props overwritten with this Component props
  static get props () {
    return assign({}, super.props, this[ctorProps]);
  }

  static set props (value) {
    setCtorNativeProperty(this, ctorProps, value);
  }

  // Passing args is designed to work with document-register-element. It's not
  // necessary for the webcomponents/custom-element polyfill.
  constructor (...args) {
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
      DEBUG && deprecated(this, 'static render', 'renderCallback');
      this.renderCallback = constructor.render.bind(constructor, this);
    }

    // DEPRECATED
    //
    // static created()
    //
    // Props should be set up before calling this.
    const { created: created$$1 } = constructor;
    if (isFunction(created$$1)) {
      DEBUG && deprecated(this, 'static created', 'constructor');
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
  connectedCallback () {
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
      DEBUG && deprecated(this, 'static attached', 'connectedCallback');
      attached(this);
    }

    // DEPRECATED
    //
    // We can remove this once all browsers support :defined.
    this.setAttribute('defined', '');
  }

  // Custom Elements v1
  disconnectedCallback () {
    // Suspend updating attributes until re-connected
    getAttrMgr(this).suspendAttributesUpdates();

    // Ensures the component can't be rendered while disconnected.
    this[connected] = false;

    // DEPRECATED
    //
    // static detached()
    const { detached } = this.constructor;
    if (isFunction(detached)) {
      DEBUG && deprecated(this, 'static detached', 'disconnectedCallback');
      detached(this);
    }
  }

  // Custom Elements v1
  attributeChangedCallback (name$$1, oldValue, newValue) {
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
        const newPropVal = newValue !== null && propDef.deserialize
          ? propDef.deserialize(newValue)
          : newValue;

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
      DEBUG && deprecated(this, 'static attributeChanged', 'attributeChangedCallback');
      attributeChanged(this, { name: name$$1, newValue, oldValue });
    }
  }

  // Skate
  updatedCallback (prevProps) {
    if (this.constructor.hasOwnProperty('updated')) {
      DEBUG && deprecated(this, 'static updated', 'updatedCallback');
    }
    return this.constructor.updated(this, prevProps);
  }

  // Skate
  renderedCallback () {
    if (this.constructor.hasOwnProperty('rendered')) {
      DEBUG && deprecated(this, 'static rendered', 'renderedCallback');
    }
    return this.constructor.rendered(this);
  }

  // Skate
  //
  // Maps to the static renderer() callback. That logic should be moved here
  // when that is finally removed.
  // TODO: finalize how to support different rendering strategies.
  rendererCallback () {
    // TODO: cannot move code here because tests expects renderer function to still exist on constructor!
    return this.constructor.renderer(this);
  }

  // Skate
  // @internal
  // Invokes the complete render lifecycle.
  [renderer] () {
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
  [updated] () {
    const prevProps = this[props];
    this[props] = props$1(this);
    return this.updatedCallback(prevProps);
  }

  // Skate
  static extend (definition = {}, Base = this) {
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
  static rendered () {}

  // Skate
  //
  // DEPRECATED
  //
  // Move this to rendererCallback() before removing.
  static renderer (elem) {
    if (!elem.shadowRoot) {
      elem.attachShadow({ mode: 'open' });
    }
    patchInner_1(elem.shadowRoot, () => {
      const possibleFn = elem.renderCallback(elem);
      if (isFunction(possibleFn)) {
        possibleFn();
      } else if (Array.isArray(possibleFn)) {
        possibleFn.forEach((fn) => {
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
  static updated (elem, previousProps) {
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

const Event = ((TheEvent) => {
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

var stylesDefinition = `
:host {
  width: inherit;
  position: relative;
  display: flex;
  font-family: Verdana;
  align-items: center;
}
*{
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-style: normal;
}
input{
  outline: none;
}
.text{
  margin-right: 3px;
}
.toggle{
  padding: 5px;
  cursor: pointer;
  transition: transform .3s;
  transform: scale(0.9);
}
.toggle:hover{
  transform: scale(1.1);
}
li{
  list-style: none;
}
.emojis-wrapper{
  top: 0;
  left: 245px;
  border-radius: 3px;
  border: 2px solid #aaa;
  position: absolute;
  width: 305px;
  height: 350px;
  display: none;
  background-color: white;
  user-select: none;
}
.emojis-wrapper::before{
  content: '';
  width: 0;
  height: 0;
  border-style: solid;
  border-width: 7px 8px 7px 0;
  border-color: transparent #aaa transparent transparent;
  position: absolute;
  top: 23px;
  left: -10px;
}
.emojis-wrapper.visible{
  display: block;
}
.emoji-search{
  margin: 10px 5px 10px 10px;
  flex: 1;
}
.emojis-content{
  margin: 10px 10px 0 10px;
  overflow: auto;
  height: calc(100% - 90px);
}
.emoji-data{
  display: none;
}
.emoji-data.visible{
  display: block;
}
.emoji-search-results{
  display: none;
}
.emoji-search-results.visible{
  display: block;
}
.emoji-category-header{
  text-transform: capitalize;
  margin: 5px 0;
  border-bottom: 1px solid #eee;
  padding-bottom: 2px;
}
.emoji-category-content{

}
.emojis-content i{
  border: 1px solid transparent;
  padding: 3px 8px 3px 5px;
  border-radius: 5px;
  display: inline-block;
  cursor: pointer;
  transition: all .3s;
}
.emoji-category-content i:hover{
  border-color: #ddd;
  background-color: #eee;
}
.emojis{
  text-align: center;
}
.categories{
  border-top: 1px solid #aaa;
  justify-content: center;
  align-items: center;
  height: 41px;
  display: none;
}
.categories.visible{
  display: flex;
}
.categories .cat{
  cursor: pointer;
  background-repeat: no-repeat;
  background-position: center;
  height: 100%;
  width: 25px;
  flex: 1;
  transition: background-color .2s;
  opacity: .8;
}
.categories .cat.active, .categories .cat:hover{
  background-color: #afd4f3;
}
sk-spinner{
  margin-right: 5px;
  display: none;
  width: 30px;
  height: 30px;  
}
sk-spinner.visible{
  display: block;
}
.header{
  display: flex;
  align-items: center;
}
`;

var icons = {
  people: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAAZCAYAAADE6YVjAAACMElEQVRIS52WjTFDURCFTyqgA0kFqAAVkApQAR2gAlSAClABqQAVoAJJBcyX2fNm38378bIzmST3Z8+e3bP33pH67UjSoaSxpB1Jm5Lmkt4lfUl6kvTc5WbUMXki6Tqc9oUC6Lmkh6aFTSBE/BhRs+c7oiVi7FXSfvyGJZ+t+A+7aTCs8EoQ0vES0eP8UtJ9Hw1JsL6RtBGpPIh0LrdmEBi8BcBHREsa/mvUCpbbAbRrRhkEqiwAAEbrmv3wDVDFBLp3kX8AhjAog4ERqiN1p6TbTHBaDa5LIe1z0IBNAEEdqIlCU5dsyJIUIk3yXRoqO44i3xaTAKC6KSCoh4UswqkNZV2k/5NCmgT0meavQo0eQm1nBAgIEe5JQnY5Wo97E/p3rzDmlHh+lvqHMWdoBojrUYJkJ4tQHCmwwQQFUUtsWeQ0TyrpuTkgvzHR1P0s5MPmDJCBCAbWZc1Q2Q8Lu5g01HnQkJksumoyyGPD4lpN2tTFPvIObXLfZm7eMp01dRlx2ThF4egfDGW19Unbmlqf4KSp4/OBxxrkCxCsiJ6cEyBWnnf5mBpbUR4EDDY+uwCiKWmqNqOJWZP30KTsrZ1dOFg5PZNXakPURO/rF1awK2uxcpqX94mbi2+ac8hpDDjNRyprzdt0MxKhb7jWe7vIXX4PAADjSpFtdzxp4PTF/CIBHGY+owjExffpjQBIay2Ffa8V39t9jdn5HugCsWO/SPzuggEpye+ufDqvBPQH5aSYWPTMirYAAAAASUVORK5CYII=',
  animals: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAAZCAYAAADE6YVjAAABTklEQVRIS82VjS0FQRRGz6uADugAFaACdEAHStEBHaACVIAO6IAKyEnmysvuzswdkRc32ezLy+w99+f7dldsIFYbYPAvIfvALXAGvGSnMNKJgAdgG/gAjrOgLCQAnr8EroCvLCgDWQccler97zEL6kGWALGKNKgF2QWeyw7egLuyCzuwI3dzCnjOHR0AnptFppNzwGsLeC2JBe4Bn8BNuapq60GsSsB1AdiBVduFHQm6KJCqonuQJUAkS4NakBZgCFSDBMBk+uKpYjwVdlh849nF0dUgKsbkqmenLDg8MpWwgngv6tOkM4W1xtXyyJBXapAMIA1agowAUqAliEY7KU9rMP2gN7xPI5zv3eKM+7LLn7Otcbl0H1Y9vVB9FmGBM+f3zDj1Q0haFRnxBmgWkYWYJMZl4vXfvS6HvvFRfXy0oqs/hXST1Q6MjOvXkG/6Q1saddbFwAAAAABJRU5ErkJggg==',
  food: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAAZCAYAAADE6YVjAAACGklEQVRIS73W7VEUQRAG4JcINAPMQIxAjACMQIxAiQCIAMlAIlAiUCNQM5AMMAKsh5q+mpvbvT3/3FRt7d4w3f1+dO9ykD2sgz3UyFKRoySvkxwned4ue7+SPLTre5IfbW8S81QRyd4l+ZjkxX8w/ZPkU5KbMWYsAuWXITmUUJ8kuUoCeS0Mxbg/a5uKve2Z9UUc/tkO3idxmFSvWgBW9ubWWZLLJIftQMWteQKhpLdNKugVJt+HJOcLReR2lmTkvktyarNnAiUUqH7t4H5uQe+TeF5aEpP8dwO5VgQCiC20MVIYOox6L6YKOSOebBb/5FkrAj1z+6VVXYrVVX8vKd1dYyeumPdyPbZoxeyPBZdk+tvY8pInulLXTRpvH+o3DZ158RvacRVLdwk1TjFc5e+Z8MRinAYQSAKe8ENDQEnni/Zcw1cdNYJ4yj/KRUeov21B/dSWM0ubA+eMJpgsIpYnehwLDKB3r4mmfXUQKUlkr2TFknT2qLDBpAcosYKQ6XmJBZmVmny/X7ak0I++zTJZ6iJFp5qg4jAo1rNFGAwh+lDuukiMee/pRpF6dzGvOo0v/bD1A1fDKa6+LwABdz03J/XOcZDuXgvb3rojQ2CYXt23egeO35NCUQkghFQxz1OJsZO4Z9mrMfn5ddjACSwDd/GF4TwRu6bAtm888/svn0LVslra/FjlSc3UBqClfyR2YbB4Zi9F/gHVjIUafkR2fgAAAABJRU5ErkJggg==',
  sports: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAAZCAYAAADE6YVjAAACOklEQVRIS5WW4TUEUQyF71ZAB3YrWCpABWwFqAAVoAJUwFaACtgKUAE6WBVwvneSOdl488bmHD/sZHKTm5tkRhq2Q0kHksaStiVtSlpKepP0KelR0lMrzKjx8FjShQUfSgWwS0nzmmMNhEyfLetvy5QqdisBFlYN1W5YdftWaeeeQaADAICggGqghky3KiBfVin+90Yr/gBBZ7EIguOHAZzYSzHunqQzC0QCN5JeEjBJ3VliE68ogoA8lVQDGOpJfE4i11bJTqwkZoBaroyidYLjC92nkugRzJSEvZLMOZxmKv4DCKX01I24E0BAfUgRZqaqHJjsyPQ2K8gcq7EAQRVHKRp0oftoUEEyyJkMSaRTkDnyDrMVbQ4ItOQZyJV4M3Nl/E5VbrVKFoCgawbJLasLqUJRnwECmJuLyP9fAvIj6d1+ISD0RVsXhHcBcuCpVwK3lEpV2ejFa6MSZiH3BndEQivGsSetZTm0VvpygKXSE1dXX0YEqCmQ33M/IpjPTFGXK4I1DZc144UsafzgvUZVTGwWJx6FsdSYA9+8jVZUH/EuvYBeli2novTE1cD2ZG9BG2vdr995I1veRRgsRL+aAKBWrunK7sLZt3BOEYWwy/qsNsz4AgTwn3tCFnEwPXDf+s+D5/6Fpto98dLJLANBXXeELFI8crFKABBK9TK6ow8RB8wNZbE0s+WFCEUArAz10NcKQeJtJzsCkEjh24xbj29eSeVxC8QDMEf8+XcXVEJJ/O5Clb32C1gFjVj7jb3VAAAAAElFTkSuQmCC',
  travel: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAAZCAYAAADE6YVjAAABU0lEQVRIS+WVzTUEURCFv4mADBABIkAGRGBEgAjIABEgAjJABEMEyIAION85r0ZP6/fTm9lMbboXVXWr7q2qN2EJNlkCBqsFsgOsFWj9Bl5LtJfoMvkDsNmg2wdwAPj9ZyWQZ2APeAO+CkDrwDagv0DNIFb/DnyO6GQD2BrqJtfJNXAK3ABnDXSF/zng/4LlQBRSCnZroqZs6jdLvsZUQcZSFQkVfZCyoU6k52oEVQGSpawPMgUukth3uZHMaCQDxtvRJXAffn2QnwaRW13muXMgJ52K3JWavaTq7eY2ORdBbNO2tRiCGkh3P6T5GP6O71An3c3dB55qCGnTjdPiUlTpCtHtqPV2GRPiC1YFaSi+6pIFOUyXNzJ4HFvPihci7Ah4zI2wF9U5j/ejOwSl0kNsfXxfpG1+uYc2XiBvkU7Fx6iHaoyxxiw8Dav1xlfHqObwC/L2RRr+zfcgAAAAAElFTkSuQmCC',
  objects: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAAZCAYAAADE6YVjAAABh0lEQVRIS72WgTEEQRBF32UgA0SACBABIkAEiAARIAJEgAjIgAzIABFQT01XTc3N2Nlbpauubmtrp1/3795/N+MfYvYPDFqQdeAIeAGuphZSgwh4BJZS8hvgcAqohATA+1vAMbAPTALlECt/hR8JBSiVIWASKIdcpjlsZIBQKUDK5vWoyCGRqDYnu3wHboGDUYQkTZzx8HUacl6tABdhtZCxm1VW/QE8A9spwwpwNwVgnhLiNl0U3Qh2IZzVQlHT/w34SkkFnAGnwAngcoyOGmQ3SeSbbmeG67ycZIzV7oa1bOUe2ElJnwBfUr/t0HnlIOfme6QCbt9ctCBulEnz6nOQEtpplwX95sJ5UtfX+Vi1672ZivCZQQsasvqWTM7KboxBCxqCmCQH7aUOvK+kfpxFHnMW1AMJkIfX0hqfJ/lqcw6jfQgL6oVE5Urkj5nVe11uU9WCxkCiamdgV25eDmta0CKQgGmodiMs4rNmolMgOczuXHFtp1yE5h+JbsvoefAvOhnkfAMY8l4arWtzPwAAAABJRU5ErkJggg==',
  symbols: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAAZCAYAAADE6YVjAAABmklEQVRIS72VizFFMRCGv1sBHdABtwJuBagAHegAFdABKkAFqAAd0AEVMJ/J3oncE8nx2pnM5Jxk999/X5nwDzIZibEJHALHwG2v7lgQDW8kgNlfgMjiJjMsSBebMUyCxd1YNr0gweIZWAWegBWgi00vSLDYB86BPeCsNzc9ICWLSEs3mxJEg4bBkKwDy4D/lGARIMHGb5m+AA9puTd3HyKIBu+TwVpVqhBg+Z0IY01PsKkgeiyI8ppi7mHuXaslctayl+VSUppFuHLqZVhaAOX5gq08J78BNGijTPxPgKq6QyX8HaAD4CTl1L29NJdan+RzqqeX3pLFaSrhT3mqGYiKe0zV10q+/bFmuY4B2QYugWvAfUuugC1gB3DfxeQoe5zchxhG3xObMx/ztfvzjh/yMjyLKetU8EW0KEJMri+kM+xL5rWcRIwF2c2MOxF0QKPR0YJdpAdNPfPSFa6olris8dO0HDmODkvVFWBxd8HxISblLMuNl04GmKEMWaiwIRAVDYEem1Bj3hJz5l0LQyfVnUtPo7UAmufvdIxoeqHss+kAAAAASUVORK5CYII=',
  flags: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAAZCAYAAADE6YVjAAAAdElEQVRIS+2VywpAIQhEpy+v++WFi+5CMlJoFpJLGTiNrwoIUQgM0CANQL/pSJwI4DMgVeUt3e6NdUKssmmHkfL2B/HMCbdcMsar0HlLt3PWZuM99t3afJC38SdDwN2TPAfy+sZHTsVJw39N5BNyAUScBzIA5/YvCA9acGcAAAAASUVORK5CYII='
};

var emojiData = {
  people: ['😀', '😃', '😄', '😁', '😆', '😅', '😂', '😊', '😇', '😉', '😌', '😍', '😘', '😗', '😙', '😚', '😋', '😜', '😝', '😛', '😎', '😏', '😒', '😞', '😔', '😟', '😕', '😣', '😖', '😫', '😩', '😤', '😠', '😡', '😶', '😐', '😑', '😯', '😦', '😧', '😮', '😲', '😵', '😳', '😱', '😨', '😰', '😢', '😥', '😭', '😓', '😪', '😴', '😬', '😷', '😈', '👿', '👹', '👺', '💩', '👻', '💀', '👽', '👾', '🎃', '😺', '😸', '😹', '😻', '😼', '😽', '🙀', '😿', '😾', '👐', '🙌', '👏', '🙏', '👍', '👎', '👊', '✊', '👌', '👈', '👉', '👆', '👇', '✋', '🖖', '👋', '💪', '💅', '🖖', '💄', '💋', '👄', '👅', '👂', '👃', '👣', '👀', '👤', '👥', '👶', '👦', '👧', '👨', '👩', '👱‍', '👱', '👴', '👵', '👲', '👳‍', '👳', '👮‍', '👮', '👷‍', '👷', '💂‍', '💂', '👩️', '👨️', '👩‍', '👨‍', '👩‍', '👨‍', '👩‍', '👨‍', '👩‍', '👨‍', '👩‍', '👨‍', '👩‍', '👨‍', '👩‍', '👨‍', '👩‍', '👨‍', '👩‍', '👨‍', '👩‍', '👨‍', '👩‍', '👨‍', '👩‍', '👨‍', '👩‍', '👨‍', '👩‍', '👨‍', '👩‍', '👨‍', '🎅', '👸', '👰', '👼', '🙇‍', '🙇', '💁', '💁‍', '🙅', '🙅‍', '🙆', '🙆‍', '🙋', '🙋‍', '🙎', '🙎‍', '🙍', '🙍‍', '💇', '💇‍', '💆', '💆‍', '💃', '👯', '👯‍', '🚶‍', '🚶', '🏃‍', '🏃', '👫', '👭', '👬', '💑', '👩‍', '👨‍', '💏', '👩‍', '👨‍', '👪', '👚', '👕', '👖', '👔', '👗', '👙', '👘', '👠', '👡', '👢', '👞', '👟', '👒', '🎩', '🎓', '👑', '⛑', '🎒', '👝', '👛', '👜', '💼', '👓', '🕶', '🌂'],
  animals: ['🐶', '🐱', '🐭', '🐹', '🐰', '🐻', '🐼', '🐨', '🐯', '🐮', '🐷', '🐽', '🐸', '🐵', '🙊', '🙉', '🙊', '🐒', '🐔', '🐧', '🐦', '🐤', '🐣', '🐥', '🐺', '🐗', '🐴', '🐝', '🐛', '🐌', '🐚', '🐞', '🐜', '🐢', '🐍', '🐙', '🐠', '🐟', '🐡', '🐬', '🐳', '🐋', '🐊', '🐆', '🐅', '🐃', '🐂', '🐄', '🐪', '🐫', '🐘', '🐎', '🐖', '🐐', '🐏', '🐑', '🐕', '🐩', '🐈', '🐓', '🐇', '🐁', '🐀', '🐾', '🐉', '🐲', '🌵', '🎄', '🌲', '🌳', '🌴', '🌱', '🌿', '🍀', '🎍', '🎋', '🍃', '🍂', '🍁', '🍄', '🌾', '💐', '🌷', '🌹', '🌻', '🌼', '🌸', '🌺', '🌎', '🌍', '🌏', '🌕', '🌖', '🌗', '🌘', '🌑', '🌒', '🌓', '🌔', '🌚', '🌝', '🌞', '🌛', '🌜', '🌙', '💫', '⭐️', '🌟', '✨', '🔥', '💥', '⛅️', '🌈', '⛄️', '💨', '🌊', '💧', '💦'],
  food: ['🍏', '🍎', '🍐', '🍊', '🍋', '🍌', '🍉', '🍇', '🍓', '🍈', '🍒', '🍑', '🍍', '🍅', '🍆', '🌽', '🍠', '🌰', '🍯', '🍞', '🍳', '🍤', '🍗', '🍖', '🍕', '🍔', '🍟', '🍝', '🍜', '🍲', '🍥', '🍣', '🍱', '🍛', '🍚', '🍙', '🍘', '🍢', '🍡', '🍧', '🍨', '🍦', '🍰', '🎂', '🍮', '🍭', '🍬', '🍫', '🍩', '🍪', '🍼', '☕️', '🍵', '🍶', '🍺', '🍻', '🍷', '🍸', '🍹', '🍴'],
  sports: ['⚽️', '🏀', '🏈', '⚾️', '🎾', '🏉', '🎱', '⛳️', '🎣', '🎿', '🏂', '🏄‍', '🏊', '🚣', '🏇', '🚴', '🚵', '🎽', '🏆', '🎫', '🎪', '🎭', '🎨', '🎬', '🎤', '🎧', '🎼', '🎹', '🥁', '🎷', '🎺', '🎸', '🎻', '🎲', '🎯', '🎳', '🎮', '🎰'],
  travel: ['🚗', '🚕', '🚙', '🚌', '🚎', '🚓', '🚑', '🚒', '🚐', '🚚', '🚛', '🚜', '🚲', '🚨', '🚔', '🚍', '🚘', '🚖', '🚡', '🚠', '🚟', '🚃', '🚋', '🚞', '🚝', '🚄', '🚅', '🚈', '🚂', '🚆', '🚇', '🚊', '🚉', '🚁', '🚀', '💺', '⛵️', '🚤', '🚢', '🚧', '⛽️', '🚏', '🚦', '🚥', '🗿', '🗽', '⛲️', '🗼', '🏰', '🏯', '🎡', '🎢', '🎠', '🗻', '🌋', '⛺️', '🏭', '🏠', '🏡', '🏢', '🏬', '🏣', '🏤', '🏥', '🏦', '🏨', '🏪', '🏫', '🏩', '💒', '⛪️', '🗾', '🎑', '🌅', '🌄', '🌠', '🎇', '🎆', '🌇', '🌆', '🌃', '🌌', '🌉', '🌁'],
  objects: ['⌚', '📱', '📲', '💻', '💽', '💾', '💿', '📀', '📼', '📷', '📹', '🎥', '📞', '📟', '📠', '📺', '📻', '⏰', '⌛️', '⏳', '📡', '🔋', '🔌', '💡', '🔦', '💸', '💵', '💴', '💶', '💷', '💰', '💳', '💎', '🔧', '🔨', '🔩', '🔫', '💣', '🔪', '🚬', '🔮', '💈', '🔭', '🔬', '💊', '💉', '🚽', '🚰', '🚿', '🛁', '🛀', '🔑', '🚪', '🎁', '🎈', '🎏', '🎀', '🎊', '🎉', '🎎', '🏮', '🎐', '📩', '📨', '📧', '💌', '📥', '📤', '📦', '📪', '📫', '📬', '📭', '📮', '📯', '📜', '📃', '📄', '📑', '📊', '📈', '📉', '📆', '📅', '📇', '📋', '📁', '📂', '📰', '📓', '📔', '📒', '📕', '📗', '📘', '📙', '📚', '📖', '🔖', '🔗', '📎', '📐', '📏', '📌', '📍', '📌', '🎌', '🏁', '️‍🌈', '📝', '🔍', '🔎', '🔏', '🔐', '🔒', '🔓'],
  symbols: ['💛', '💚', '💙', '💜', '💔', '💕', '💞', '💓', '💗', '💖', '💘', '💝', '💟', '🔯', '⛎', '🆔', '🉑', '📴', '📳', '🈶', '🈚️', '🈸', '🈺', '🈷️', '🆚', '💮', '🉐', '㊙️', '㊗️', '🈴', '🈵', '🈹', '🈲', '🅰️', '🅱️', '🆎', '🆑', '🅾️', '🆘', '❌', '⭕️', '⛔️', '📛', '🚫', '💯', '💢', '♨️', '🚷', '🚯', '🚳', '🚱', '🔞', '📵', '🚭', '❗️', '❕', '❓', '❔', '‼️', '⁉️', '🔅', '🔆', '🚸', '🔱', '🔰', '✅', '🈯️', '💹', '❎', '🌐', '💠', 'Ⓜ️', '🌀', '💤', '🏧', '🚾', '♿️', '🅿️', '🈳', '🈂️', '🛂', '🛃', '🛄', '🛅', '🚹', '🚺', '🚼', '🚻', '🚮', '🎦', '📶', '🈁', '🔣', '🔤', '🔡', '🔠', '🆖', '🆗', '🆙', '🆒', '🆕', '🆓', '🔟', '🔢', '⏩', '⏪', '⏫', '⏬', '🔼', '🔽', '🔀', '🔁', '🔂', '🔄', '🔃', '🎵', '🎶', '➕', '➖', '➗', '💲', '💱', '〰️', '➰', '➿', '🔚', '🔙', '🔛', '🔝', '🔘', '⚪️', '⚫️', '🔴', '🔵', '🔺', '🔻', '🔸', '🔹', '🔶', '🔷', '🔳', '🔲', '⬛️', '⬜️', '🔈', '🔇', '🔉', '🔊', '🔔', '🔕', '📣', '📢', '💬', '💭', '🃏', '🎴', '🀄️', '🕐', '🕑', '🕒', '🕓', '🕔', '🕕', '🕖', '🕗', '🕘', '🕙', '🕚', '🕛', '🕜', '🕝', '🕞', '🕟', '🕠', '🕡', '🕢', '🕣', '🕤', '🕥', '🕦', '🕧'],
  flags: ['🏁', '🚩', '‍🌈', '🇦🇫', '🇦🇱', '🇩🇿', '🇦🇸', '🇦🇩', '🇦🇴', '🇦🇮', '🇦🇬', '🇦🇷', '🇦🇲', '🇦🇼', '🇦🇺', '🇦🇹', '🇦🇿', '🇧🇸', '🇧🇭', '🇧🇩', '🇧🇧', '🇧🇾', '🇧🇪', '🇧🇿', '🇧🇯', '🇧🇲', '🇧🇹', '🇧🇴', '🇧🇦', '🇧🇼', '🇧🇷', '🇻🇬', '🇧🇳', '🇧🇬', '🇧🇫', '🇧🇮', '🇰🇭', '🇨🇲', '🇨🇦', '🇨🇻', '🇰🇾', '🇨🇫', '🇹🇩', '🇨🇱', '🇨🇳', '🇨🇴', '🇰🇲', '🇨🇬', '🇨🇩', '🇨🇰', '🇨🇷', '🇨🇮', '🇭🇷', '🇨🇺', '🇨🇼', '🇨🇾', '🇨🇿', '🇩🇰', '🇩🇯', '🇩🇲', '🇩🇴', '🇪🇨', '🇪🇬', '🇸🇻', '🇬🇶', '🇪🇷', '🇪🇪', '🇪🇹', '🇫🇰', '🇫🇴', '🇫🇯', '🇫🇮', '🇫🇷', '🇬🇫', '🇵🇫', '🇹🇫', '🇬🇦', '🇬🇲', '🇬🇪', '🇩🇪', '🇬🇭', '🇬🇮', '🇬🇷', '🇬🇱', '🇬🇩', '🇬🇵', '🇬🇺', '🇬🇹', '🇬🇬', '🇬🇳', '🇬🇼', '🇬🇾', '🇭🇹', '🇭🇳', '🇭🇰', '🇭🇺', '🇮🇸', '🇮🇳', '🇮🇩', '🇮🇷', '🇮🇶', '🇮🇪', '🇮🇲', '🇮🇱', '🇮🇹', '🇯🇲', '🇯🇵', '🎌', '🇯🇪', '🇯🇴', '🇰🇿', '🇰🇪', '🇰🇮', '🇽🇰', '🇰🇼', '🇰🇬', '🇱🇦', '🇱🇻', '🇱🇧', '🇱🇸', '🇱🇷', '🇱🇾', '🇱🇮', '🇱🇹', '🇱🇺', '🇲🇴', '🇲🇰', '🇲🇬', '🇲🇼', '🇲🇾', '🇲🇻', '🇲🇱', '🇲🇹', '🇲🇭', '🇲🇶', '🇲🇷', '🇲🇺', '🇾🇹', '🇲🇽', '🇫🇲', '🇲🇩', '🇲🇨', '🇲🇳', '🇲🇪', '🇲🇸', '🇲🇦', '🇲🇿', '🇲🇲', '🇳🇦', '🇳🇷', '🇳🇵', '🇳🇱', '🇳🇨', '🇳🇿', '🇳🇮', '🇳🇪', '🇳🇬', '🇳🇺', '🇳🇫', '🇰🇵', '🇲🇵', '🇳🇴', '🇴🇲', '🇵🇰', '🇵🇼', '🇵🇸', '🇵🇦', '🇵🇬', '🇵🇾', '🇵🇪', '🇵🇭', '🇵🇳', '🇵🇱', '🇵🇹', '🇵🇷', '🇶🇦', '🇷🇪', '🇷🇴', '🇷🇺', '🇷🇼', '🇼🇸', '🇸🇲', '🇸🇦', '🇸🇳', '🇷🇸', '🇸🇨', '🇸🇱', '🇸🇬', '🇸🇽', '🇸🇰', '🇸🇮', '🇸🇧', '🇸🇴', '🇿🇦', '🇰🇷', '🇸🇸', '🇪🇸', '🇱🇰', '🇸🇭', '🇰🇳', '🇱🇨', '🇻🇨', '🇸🇩', '🇸🇷', '🇸🇿', '🇸🇪', '🇨🇭', '🇸🇾', '🇹🇼', '🇹🇯', '🇹🇿', '🇹🇭', '🇹🇱', '🇹🇬', '🇹🇰', '🇹🇴', '🇹🇹', '🇹🇳', '🇹🇷', '🇹🇲', '🇹🇨', '🇹🇻', '🇻🇮', '🇺🇬', '🇺🇦', '🇦🇪', '🇬🇧', '🇺🇸', '🇺🇾', '🇺🇿', '🇻🇺', '🇻🇦', '🇻🇪', '🇻🇳', '🇾🇪', '🇿🇲', '🇿🇼']
};

var define$1 = (componentName, classDefinition) => {
  if (customElements.get(componentName)) {
    console.warn(`${componentName} it's already defined, skiping redefinition`);
    return;
  }

  customElements.define(componentName, classDefinition);
};

var index$2 = function (x) {
	var type = typeof x;
	return x !== null && (type === 'object' || type === 'function');
};

var isObj = index$2;
var hasOwnProperty$1 = Object.prototype.hasOwnProperty;
var propIsEnumerable = Object.prototype.propertyIsEnumerable;

function toObject(val) {
	if (val === null || val === undefined) {
		throw new TypeError('Sources cannot be null or undefined');
	}

	return Object(val);
}

function assignKey(to, from, key) {
	var val = from[key];

	if (val === undefined || val === null) {
		return;
	}

	if (hasOwnProperty$1.call(to, key)) {
		if (to[key] === undefined || to[key] === null) {
			throw new TypeError('Cannot convert undefined or null to object (' + key + ')');
		}
	}

	if (!hasOwnProperty$1.call(to, key) || !isObj(val)) {
		to[key] = val;
	} else {
		to[key] = assign$1(Object(to[key]), from[key]);
	}
}

function assign$1(to, from) {
	if (to === from) {
		return to;
	}

	from = Object(from);

	for (var key in from) {
		if (hasOwnProperty$1.call(from, key)) {
			assignKey(to, from, key);
		}
	}

	if (Object.getOwnPropertySymbols) {
		var symbols = Object.getOwnPropertySymbols(from);

		for (var i = 0; i < symbols.length; i++) {
			if (propIsEnumerable.call(from, symbols[i])) {
				assignKey(to, from, symbols[i]);
			}
		}
	}

	return to;
}

var index$1 = function deepAssign(target) {
	target = toObject(target);

	for (var s = 1; s < arguments.length; s++) {
		assign$1(target, arguments[s]);
	}

	return target;
};

var styles = (...rules) => {
  const styles = index$1(...rules);
  
  return Object.keys(styles).map(selector => {
    const properties = Object.keys(styles[selector]).map(prop => {
      return `${prop}: ${styles[selector][prop]};`;
    }).join('');

    return `${selector}{${properties}}`;
  }).join('');
};

const isFunction$1 = val => typeof val === 'function';
const isObject$1 = val => (typeof val === 'object' && val !== null);
const isString$1 = val => typeof val === 'string';
const isSymbol$1 = val => typeof val === 'symbol';
const isUndefined$1 = val => typeof val === 'undefined';

function getPropNamesAndSymbols$1 (obj = {}) {
  const listOfKeys = Object.getOwnPropertyNames(obj);
  return isFunction$1(Object.getOwnPropertySymbols)
    ? listOfKeys.concat(Object.getOwnPropertySymbols(obj))
    : listOfKeys;
}

var assign$3 = (obj, ...args) => {
  args.forEach(arg => getPropNamesAndSymbols$1(arg).forEach(nameOrSymbol => obj[nameOrSymbol] = arg[nameOrSymbol])); // eslint-disable-line no-return-assign
  return obj;
};

var empty$1 = function (val) {
  return typeof val === 'undefined' || val === null;
};

const toNullOrString$2 = val => (empty$1(val) ? null : String(val));

// defaults empty to 0 and allows NaN

const connected$1 = '____skate_connected';
const created$1 = '____skate_created';

// DEPRECATED
//
// This is the only "symbol" that must stay a string. This is because it is
// relied upon across several versions. We should remove it, but ensure that
// it's considered a breaking change that whatever version removes it cannot
// be passed to vdom functions as tag names.
const name$1 = '____skate_name';

// Used on the Constructor
const ctorCreateInitProps$1 = '____skate_ctor_createInitProps';
const ctorObservedAttributes$1 = '____skate_ctor_observedAttributes';
const ctorProps$1 = '____skate_ctor_props';
const ctorPropsMap$1 = '____skate_ctor_propsMap';

// Used on the Element
const props$2 = '____skate_props';
const ref$1 = '____skate_ref';
const renderer$1 = '____skate_renderer';
const rendering$1 = '____skate_rendering';
const rendererDebounced$1 = '____skate_rendererDebounced';
const updated$1 = '____skate_updated';

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

var hasOwnProperty$2 = Object.prototype.hasOwnProperty;

/**
 * A cached reference to the create function.
 */
var create$3 = Object.create;

/**
 * Used to prevent property collisions between our "map" and its prototype.
 * @param {!Object<string, *>} map The map to check.
 * @param {string} property The property to check.
 * @return {boolean} Whether map has property.
 */
var has$1 = function (map, property) {
  return hasOwnProperty$2.call(map, property);
};

/**
 * Creates an map object without a prototype.
 * @return {!Object}
 */
var createMap$1 = function () {
  return create$3(null);
};

/**
 * Keeps track of information needed to perform diffs for a given DOM node.
 * @param {!string} nodeName
 * @param {?string=} key
 * @constructor
 */
function NodeData$1(nodeName, key) {
  /**
   * The attributes and their values.
   * @const {!Object<string, *>}
   */
  this.attrs = createMap$1();

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
  this.newAttrs = createMap$1();

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
var initData$1 = function (node, nodeName, key) {
  var data = new NodeData$1(nodeName, key);
  node['__incrementalDOMData'] = data;
  return data;
};

/**
 * Retrieves the NodeData object for a Node, creating it if necessary.
 *
 * @param {Node} node The node to retrieve the data for.
 * @return {!NodeData} The NodeData for this Node.
 */
var getData$1 = function (node) {
  var data = node['__incrementalDOMData'];

  if (!data) {
    var nodeName = node.nodeName.toLowerCase();
    var key = null;

    if (node instanceof Element) {
      key = node.getAttribute('key');
    }

    data = initData$1(node, nodeName, key);
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
var symbols$1 = {
  default: '__default',

  placeholder: '__placeholder'
};

/**
 * @param {string} name
 * @return {string|undefined} The namespace to use for the attribute.
 */
var getNamespace$1 = function (name) {
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
var applyAttr$1 = function (el, name, value) {
  if (value == null) {
    el.removeAttribute(name);
  } else {
    var attrNS = getNamespace$1(name);
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
var applyProp$1 = function (el, name, value) {
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
var applyStyle$1 = function (el, name, style) {
  if (typeof style === 'string') {
    el.style.cssText = style;
  } else {
    el.style.cssText = '';
    var elStyle = el.style;
    var obj = /** @type {!Object<string,string>} */style;

    for (var prop in obj) {
      if (has$1(obj, prop)) {
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
var applyAttributeTyped$1 = function (el, name, value) {
  var type = typeof value;

  if (type === 'object' || type === 'function') {
    applyProp$1(el, name, value);
  } else {
    applyAttr$1(el, name, /** @type {?(boolean|number|string)} */value);
  }
};

/**
 * Calls the appropriate attribute mutator for this attribute.
 * @param {!Element} el
 * @param {string} name The attribute's name.
 * @param {*} value The attribute's value.
 */
var updateAttribute$1 = function (el, name, value) {
  var data = getData$1(el);
  var attrs = data.attrs;

  if (attrs[name] === value) {
    return;
  }

  var mutator = attributes$1[name] || attributes$1[symbols$1.default];
  mutator(el, name, value);

  attrs[name] = value;
};

/**
 * A publicly mutable object to provide custom mutators for attributes.
 * @const {!Object<string, function(!Element, string, *)>}
 */
var attributes$1 = createMap$1();

// Special generic mutator that's called for any attribute that does not
// have a specific mutator.
attributes$1[symbols$1.default] = applyAttributeTyped$1;

attributes$1[symbols$1.placeholder] = function () {};

attributes$1['style'] = applyStyle$1;

/**
 * Gets the namespace to create an element (of a given tag) in.
 * @param {string} tag The tag to get the namespace for.
 * @param {?Node} parent
 * @return {?string} The namespace to create the tag in.
 */
var getNamespaceForTag$1 = function (tag, parent) {
  if (tag === 'svg') {
    return 'http://www.w3.org/2000/svg';
  }

  if (getData$1(parent).nodeName === 'foreignObject') {
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
var createElement$1 = function (doc, parent, tag, key, statics) {
  var namespace = getNamespaceForTag$1(tag, parent);
  var el = undefined;

  if (namespace) {
    el = doc.createElementNS(namespace, tag);
  } else {
    el = doc.createElement(tag);
  }

  initData$1(el, tag, key);

  if (statics) {
    for (var i = 0; i < statics.length; i += 2) {
      updateAttribute$1(el, /** @type {!string}*/statics[i], statics[i + 1]);
    }
  }

  return el;
};

/**
 * Creates a Text Node.
 * @param {Document} doc The document with which to create the Element.
 * @return {!Text}
 */
var createText$1 = function (doc) {
  var node = doc.createTextNode('');
  initData$1(node, '#text', null);
  return node;
};

/**
 * Creates a mapping that can be used to look up children using a key.
 * @param {?Node} el
 * @return {!Object<string, !Element>} A mapping of keys to the children of the
 *     Element.
 */
var createKeyMap$1 = function (el) {
  var map = createMap$1();
  var child = el.firstElementChild;

  while (child) {
    var key = getData$1(child).key;

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
var getKeyMap$1 = function (el) {
  var data = getData$1(el);

  if (!data.keyMap) {
    data.keyMap = createKeyMap$1(el);
  }

  return data.keyMap;
};

/**
 * Retrieves a child from the parent with the given key.
 * @param {?Node} parent
 * @param {?string=} key
 * @return {?Node} The child corresponding to the key.
 */
var getChild$1 = function (parent, key) {
  return key ? getKeyMap$1(parent)[key] : null;
};

/**
 * Registers an element as being a child. The parent will keep track of the
 * child using the key. The child can be retrieved using the same key using
 * getKeyMap. The provided key should be unique within the parent Element.
 * @param {?Node} parent The parent of child.
 * @param {string} key A key to identify the child with.
 * @param {!Node} child The child to register.
 */
var registerChild$1 = function (parent, key, child) {
  getKeyMap$1(parent)[key] = child;
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
var notifications$1 = {
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
function Context$1() {
  /**
   * @type {(Array<!Node>|undefined)}
   */
  this.created = notifications$1.nodesCreated && [];

  /**
   * @type {(Array<!Node>|undefined)}
   */
  this.deleted = notifications$1.nodesDeleted && [];
}

/**
 * @param {!Node} node
 */
Context$1.prototype.markCreated = function (node) {
  if (this.created) {
    this.created.push(node);
  }
};

/**
 * @param {!Node} node
 */
Context$1.prototype.markDeleted = function (node) {
  if (this.deleted) {
    this.deleted.push(node);
  }
};

/**
 * Notifies about nodes that were created during the patch opearation.
 */
Context$1.prototype.notifyChanges = function () {
  if (this.created && this.created.length > 0) {
    notifications$1.nodesCreated(this.created);
  }

  if (this.deleted && this.deleted.length > 0) {
    notifications$1.nodesDeleted(this.deleted);
  }
};

/**
* Makes sure that keyed Element matches the tag name provided.
* @param {!string} nodeName The nodeName of the node that is being matched.
* @param {string=} tag The tag name of the Element.
* @param {?string=} key The key of the Element.
*/
var assertKeyedTagMatches$1 = function (nodeName, tag, key) {
  if (nodeName !== tag) {
    throw new Error('Was expecting node with key "' + key + '" to be a ' + tag + ', not a ' + nodeName + '.');
  }
};

/** @type {?Context} */
var context$1 = null;

/** @type {?Node} */
var currentNode$1 = null;

/** @type {?Node} */
var currentParent$1 = null;

/** @type {?Element|?DocumentFragment} */
var root$2 = null;

/** @type {?Document} */
var doc$1 = null;

/**
 * Returns a patcher function that sets up and restores a patch context,
 * running the run function with the provided data.
 * @param {function((!Element|!DocumentFragment),!function(T),T=)} run
 * @return {function((!Element|!DocumentFragment),!function(T),T=)}
 * @template T
 */
var patchFactory$1 = function (run) {
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
    var prevContext = context$1;
    var prevRoot = root$2;
    var prevDoc = doc$1;
    var prevCurrentNode = currentNode$1;
    var prevCurrentParent = currentParent$1;
    var previousInAttributes = false;
    var previousInSkip = false;

    context$1 = new Context$1();
    root$2 = node;
    doc$1 = node.ownerDocument;
    currentParent$1 = node.parentNode;

    run(node, fn, data);

    context$1.notifyChanges();

    context$1 = prevContext;
    root$2 = prevRoot;
    doc$1 = prevDoc;
    currentNode$1 = prevCurrentNode;
    currentParent$1 = prevCurrentParent;
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
var patchInner$1 = patchFactory$1(function (node, fn, data) {
  currentNode$1 = node;

  enterNode$1();
  fn(data);
  exitNode$1();

  
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
var matches$1 = function (nodeName, key) {
  var data = getData$1(currentNode$1);

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
var alignWithDOM$1 = function (nodeName, key, statics) {
  if (currentNode$1 && matches$1(nodeName, key)) {
    return;
  }

  var node = undefined;

  // Check to see if the node has moved within the parent.
  if (key) {
    node = getChild$1(currentParent$1, key);
    if (node && 'production' !== 'production') {
      assertKeyedTagMatches$1(getData$1(node).nodeName, nodeName, key);
    }
  }

  // Create the node if it doesn't exist.
  if (!node) {
    if (nodeName === '#text') {
      node = createText$1(doc$1);
    } else {
      node = createElement$1(doc$1, currentParent$1, nodeName, key, statics);
    }

    if (key) {
      registerChild$1(currentParent$1, key, node);
    }

    context$1.markCreated(node);
  }

  // If the node has a key, remove it from the DOM to prevent a large number
  // of re-orders in the case that it moved far or was completely removed.
  // Since we hold on to a reference through the keyMap, we can always add it
  // back.
  if (currentNode$1 && getData$1(currentNode$1).key) {
    currentParent$1.replaceChild(node, currentNode$1);
    getData$1(currentParent$1).keyMapValid = false;
  } else {
    currentParent$1.insertBefore(node, currentNode$1);
  }

  currentNode$1 = node;
};

/**
 * Clears out any unvisited Nodes, as the corresponding virtual element
 * functions were never called for them.
 */
var clearUnvisitedDOM$1 = function () {
  var node = currentParent$1;
  var data = getData$1(node);
  var keyMap = data.keyMap;
  var keyMapValid = data.keyMapValid;
  var child = node.lastChild;
  var key = undefined;

  if (child === currentNode$1 && keyMapValid) {
    return;
  }

  if (data.attrs[symbols$1.placeholder] && node !== root$2) {
    return;
  }

  while (child !== currentNode$1) {
    node.removeChild(child);
    context$1.markDeleted( /** @type {!Node}*/child);

    key = getData$1(child).key;
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
        context$1.markDeleted(child);
        delete keyMap[key];
      }
    }

    data.keyMapValid = true;
  }
};

/**
 * Changes to the first child of the current node.
 */
var enterNode$1 = function () {
  currentParent$1 = currentNode$1;
  currentNode$1 = null;
};

/**
 * Changes to the next sibling of the current node.
 */
var nextNode$1 = function () {
  if (currentNode$1) {
    currentNode$1 = currentNode$1.nextSibling;
  } else {
    currentNode$1 = currentParent$1.firstChild;
  }
};

/**
 * Changes to the parent of the current node, removing any unvisited children.
 */
var exitNode$1 = function () {
  clearUnvisitedDOM$1();

  currentNode$1 = currentParent$1;
  currentParent$1 = currentParent$1.parentNode;
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
var coreElementOpen$1 = function (tag, key, statics) {
  nextNode$1();
  alignWithDOM$1(tag, key, statics);
  enterNode$1();
  return (/** @type {!Element} */currentParent$1
  );
};

/**
 * Closes the currently open Element, removing any unvisited children if
 * necessary.
 *
 * @return {!Element} The corresponding Element.
 */
var coreElementClose$1 = function () {
  exitNode$1();
  return (/** @type {!Element} */currentNode$1
  );
};

/**
 * Makes sure the current node is a Text node and creates a Text node if it is
 * not.
 *
 * @return {!Text} The corresponding Text Node.
 */
var coreText$1 = function () {
  nextNode$1();
  alignWithDOM$1('#text', null, null);
  return (/** @type {!Text} */currentNode$1
  );
};

/**
 * Gets the current Element being patched.
 * @return {!Element}
 */
var skip$1 = function () {
  currentNode$1 = currentParent$1.lastChild;
};

/**
 * The offset in the virtual element declaration where the attributes are
 * specified.
 * @const
 */
var ATTRIBUTES_OFFSET$1 = 3;

/**
 * Builds an array of arguments for use with elementOpenStart, attr and
 * elementOpenEnd.
 * @const {Array<*>}
 */
var elementOpen$3 = function (tag, key, statics, const_args) {
  var node = coreElementOpen$1(tag, key, statics);
  var data = getData$1(node);

  /*
   * Checks to see if one or more attributes have changed for a given Element.
   * When no attributes have changed, this is much faster than checking each
   * individual argument. When attributes have changed, the overhead of this is
   * minimal.
   */
  var attrsArr = data.attrsArr;
  var newAttrs = data.newAttrs;
  var attrsChanged = false;
  var i = ATTRIBUTES_OFFSET$1;
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
    for (i = ATTRIBUTES_OFFSET$1; i < arguments.length; i += 2) {
      newAttrs[arguments[i]] = arguments[i + 1];
    }

    for (var _attr in newAttrs) {
      updateAttribute$1(node, _attr, newAttrs[_attr]);
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
var elementClose$1 = function (tag) {
  var node = coreElementClose$1();

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
var text$1 = function (value, const_args) {
  var node = coreText$1();
  var data = getData$1(node);

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

var patchInner_1$1 = patchInner$1;
var skip_1$1 = skip$1;
var elementOpen_1$1 = elementOpen$3;
var elementClose_1$1 = elementClose$1;
var text_1$1 = text$1;
var symbols_1$1 = symbols$1;
var attributes_1$1 = attributes$1;
var applyProp_1$1 = applyProp$1;

function enter$1 (object, props) {
  const saved = {};
  Object.keys(props).forEach((key) => {
    saved[key] = object[key];
    object[key] = props[key];
  });
  return saved;
}

function exit$1 (object, saved) {
  assign$3(object, saved);
}

// Decorates a function with a side effect that changes the properties of an
// object during its execution, and restores them after. There is no error
// handling here, if the wrapped function throws an error, properties are not
// restored and all bets are off.
var propContext$1 = function (object, props) {
  return func => (...args) => {
    const saved = enter$1(object, props);
    const result = func(...args);
    exit$1(object, saved);
    return result;
  };
};

var index$4 = (typeof self === 'object' && self.self === self && self) ||
  (typeof commonjsGlobal === 'object' && commonjsGlobal.global === commonjsGlobal && commonjsGlobal) ||
  commonjsGlobal;

/* eslint no-plusplus: 0 */

const { customElements: customElements$2, HTMLElement: HTMLElement$2 } = index$4;
const applyDefault$1 = attributes_1$1[symbols_1$1.default];

// A stack of children that corresponds to the current function helper being
// executed.
const stackChren$1 = [];

const $skip$1 = '__skip';
const $currentEventHandlers$1 = '__events';
const $stackCurrentHelperProps$1 = '__props';

// The current function helper in the stack.
let stackCurrentHelper$1;

// This is used for the Incremental DOM overrides to keep track of what args
// to pass the main elementOpen() function.
let overrideArgs$1;

// The number of levels deep after skipping a tree.
let skips$1 = 0;

const noop$1 = () => {};

// Adds or removes an event listener for an element.
function applyEvent$1 (elem, ename, newFunc) {
  let events = elem[$currentEventHandlers$1];

  if (!events) {
    events = elem[$currentEventHandlers$1] = {};
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

const attributesContext$1 = propContext$1(attributes_1$1, {
  // Attributes that shouldn't be applied to the DOM.
  key: noop$1,
  statics: noop$1,

  // Attributes that *must* be set via a property on all elements.
  checked: applyProp_1$1,
  className: applyProp_1$1,
  disabled: applyProp_1$1,
  value: applyProp_1$1,

  // Ref handler.
  ref (elem, name$$1, value) {
    elem[ref$1] = value;
  },

  // Skip handler.
  skip (elem, name$$1, value) {
    if (value) {
      elem[$skip$1] = true;
    } else {
      delete elem[$skip$1];
    }
  },

  // Default attribute applicator.
  [symbols_1$1.default] (elem, name$$1, value) {
    const { props: props$$1, prototype } = customElements$2.get(elem.localName) || {
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
      applyProp_1$1(elem, name$$1, value);
      return;
    }

    // Explicit false removes the attribute.
    if (value === false) {
      applyDefault$1(elem, name$$1);
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
        applyEvent$1(elem, eventName, value);
        return;
      }
    }

    applyDefault$1(elem, name$$1, value);
  }
});

function resolveTagName$1 (name$$1) {
  // We return falsy values as some wrapped IDOM functions allow empty values.
  if (!name$$1) {
    return name$$1;
  }

  // We try and return the cached tag name, if one exists.
  if (name$$1[name$1]) {
    return name$$1[name$1];
  }

  // If it's a custom element, we get the tag name by constructing it and
  // caching it.
  if (name$$1.prototype instanceof HTMLElement$2) {
    // eslint-disable-next-line
    const elem = new name$$1();
    return (name$$1[name$1] = elem.localName);
  }

  // Pass all other values through so IDOM gets what it's expecting.
  return name$$1;
}

// Incremental DOM's elementOpen is where the hooks in `attributes` are applied,
// so it's the only function we need to execute in the context of our attributes.
const elementOpen$2 = attributesContext$1(elementOpen_1$1);

function elementOpenStart$2 (tag, key = null, statics = null) {
  overrideArgs$1 = [tag, key, statics];
}

function elementOpenEnd$2 () {
  const node = newElementOpen$1(...overrideArgs$1); // eslint-disable-line no-use-before-define
  overrideArgs$1 = null;
  return node;
}

function wrapIdomFunc$1 (func, tnameFuncHandler = noop$1) {
  return function wrap (...args) {
    args[0] = resolveTagName$1(args[0]);
    stackCurrentHelper$1 = null;
    if (typeof args[0] === 'function') {
      // If we've encountered a function, handle it according to the type of
      // function that is being wrapped.
      stackCurrentHelper$1 = args[0];
      return tnameFuncHandler(...args);
    } else if (stackChren$1.length) {
      // We pass the wrap() function in here so that when it's called as
      // children, it will queue up for the next stack, if there is one.
      stackChren$1[stackChren$1.length - 1].push([wrap, args]);
    } else {
      if (func === elementOpen$2) {
        if (skips$1) {
          return ++skips$1;
        }

        const elem = func(...args);

        if (elem[$skip$1]) {
          ++skips$1;
        }

        return elem;
      }

      if (func === elementClose_1$1) {
        if (skips$1 === 1) {
          skip_1$1();
        }

        // We only want to skip closing if it's not the last closing tag in the
        // skipped tree because we keep the element that initiated the skpping.
        if (skips$1 && --skips$1) {
          return;
        }

        const elem = func(...args);
        const ref$$1 = elem[ref$1];

        // We delete so that it isn't called again for the same element. If the
        // ref changes, or the element changes, this will be defined again.
        delete elem[ref$1];

        // Execute the saved ref after esuring we've cleand up after it.
        if (typeof ref$$1 === 'function') {
          ref$$1(elem);
        }

        return elem;
      }

      // We must call elementOpenStart and elementOpenEnd even if we are
      // skipping because they queue up attributes and then call elementClose.
      if (!skips$1 || (func === elementOpenStart$2 || func === elementOpenEnd$2)) {
        return func(...args);
      }
    }
  };
}

function newAttr$1 (...args) {
  if (stackCurrentHelper$1) {
    stackCurrentHelper$1[$stackCurrentHelperProps$1][args[0]] = args[1];
  } else if (stackChren$1.length) {
    stackChren$1[stackChren$1.length - 1].push([newAttr$1, args]);
  } else {
    overrideArgs$1.push(args[0]);
    overrideArgs$1.push(args[1]);
  }
}

function stackOpen$1 (tname, key, statics, ...attrs) {
  const props$$1 = { key, statics };
  for (let a = 0; a < attrs.length; a += 2) {
    props$$1[attrs[a]] = attrs[a + 1];
  }
  tname[$stackCurrentHelperProps$1] = props$$1;
  stackChren$1.push([]);
}

function stackClose$1 (tname) {
  const chren = stackChren$1.pop();
  const props$$1 = tname[$stackCurrentHelperProps$1];
  delete tname[$stackCurrentHelperProps$1];
  const elemOrFn = tname(props$$1, () => chren.forEach(args => args[0](...args[1])));
  return typeof elemOrFn === 'function' ? elemOrFn() : elemOrFn;
}

// Incremental DOM overrides
// -------------------------

// We must override internal functions that call internal Incremental DOM
// functions because we can't override the internal references. This means
// we must roughly re-implement their behaviour. Luckily, they're fairly
// simple.
const newElementOpenStart$1 = wrapIdomFunc$1(elementOpenStart$2, stackOpen$1);
const newElementOpenEnd$1 = wrapIdomFunc$1(elementOpenEnd$2);

// Standard open / closed overrides don't need to reproduce internal behaviour
// because they are the ones referenced from *End and *Start.
const newElementOpen$1 = wrapIdomFunc$1(elementOpen$2, stackOpen$1);
const newElementClose$1 = wrapIdomFunc$1(elementClose_1$1, stackClose$1);

// Ensure we call our overridden functions instead of the internal ones.
const newText$1 = wrapIdomFunc$1(text_1$1);

// Convenience function for declaring an Incremental DOM element using
// hyperscript-style syntax.
function element$1 (tname, attrs, ...chren) {
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
  newElementOpenStart$1(tname, attrs.key, attrs.statics);

  // Delete so special attrs don't actually get set.
  delete attrs.key;
  delete attrs.statics;

  // Set attributes.
  Object.keys(attrs).forEach(name$$1 => newAttr$1(name$$1, attrs[name$$1]));

  // Close before we render the descendant tree.
  newElementOpenEnd$1(tname);

  chren.forEach((ch) => {
    const ctype = typeof ch;
    if (ctype === 'function') {
      ch();
    } else if (ctype === 'string' || ctype === 'number') {
      newText$1(ch);
    } else if (Array.isArray(ch)) {
      ch.forEach(sch => sch());
    }
  });

  return newElementClose$1(tname);
}

// Even further convenience for building a DSL out of JavaScript functions or hooking into standard
// transpiles for JSX (React.createElement() / h).
function builder$1 (...tags) {
  if (tags.length === 0) {
    return (...args) => element$1.bind(null, ...args);
  }
  return tags.map(tag =>
    (...args) =>
      element$1.bind(null, tag, ...args)
  );
}

// We don't have to do anything special for the text function; it's just a
// straight export from Incremental DOM.

function createSymbol$1 (description) {
  return typeof Symbol === 'function' ? Symbol(description) : description;
}

var data$1 = function (element, namespace = '') {
  const data = element.__SKATE_DATA || (element.__SKATE_DATA = {});
  return namespace && (data[namespace] || (data[namespace] = {})) || data; // eslint-disable-line no-mixed-operators
};

const nativeHints$1 = [
  'native code',
  '[object MutationObserverConstructor]' // for mobile safari iOS 9.0
];
var native$1 = fn => nativeHints$1.map(
  (hint) => (fn || '').toString().indexOf([hint]) > -1
).reduce((a, b) => a || b);

const { MutationObserver: MutationObserver$1 } = index$4;

function microtaskDebounce$1 (cbFunc) {
  let scheduled = false;
  let i = 0;
  let cbArgs = [];
  const elem = document.createElement('span');
  const observer = new MutationObserver$1(() => {
    cbFunc(...cbArgs);
    scheduled = false;
    cbArgs = null;
  });

  observer.observe(elem, { childList: true });

  return (...args) => {
    cbArgs = args;
    if (!scheduled) {
      scheduled = true;
      elem.textContent = `${i}`;
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
function taskDebounce$1 (cbFunc) {
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
var debounce$1 = native$1(MutationObserver$1) ? microtaskDebounce$1 : taskDebounce$1;

function deprecated$1 (elem, oldUsage, newUsage) {
  if (DEBUG) {
    const ownerName = elem.localName ? elem.localName : String(elem);
    console.warn(`${ownerName} ${oldUsage} is deprecated. Use ${newUsage}.`);
  }
}

class AttributesManager$1 {
  constructor (elem) {
    this.elem = elem;
    this.connected = false;
    this.pendingValues = {};
    this.lastSetValues = {};
  }

  /**
   * Called from disconnectedCallback
   */
  suspendAttributesUpdates () {
    this.connected = false;
  }

  /**
   * Called from connectedCallback
   */
  resumeAttributesUpdates () {
    this.connected = true;
    const names = Object.keys(this.pendingValues);
    names.forEach(name => {
      const value = this.pendingValues[name];
      // Skip if already cleared
      if (!isUndefined$1(value)) {
        delete this.pendingValues[name];
        this._syncAttrValue(name, value);
      }
    });
  }

  /**
   * Returns true if the value is different from the one set internally
   * using setAttrValue()
   */
  onAttributeChanged (name, value) {
    value = toNullOrString$2(value);

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
  setAttrValue (name, value) {
    value = toNullOrString$2(value);

    this.lastSetValues[name] = value;

    if (this.connected) {
      this._clearPendingValue(name);
      this._syncAttrValue(name, value);
    } else {
      this.pendingValues[name] = value;
    }
  }

  _syncAttrValue (name, value) {
    const currAttrValue = toNullOrString$2(this.elem.getAttribute(name));
    if (value !== currAttrValue) {
      if (value === null) {
        this.elem.removeAttribute(name);
      } else {
        this.elem.setAttribute(name, value);
      }
    }
  }

  _clearPendingValue (name) {
    if (name in this.pendingValues) {
      delete this.pendingValues[name];
    }
  }
}

// Only used by getAttrMgr
const $attributesMgr$1 = '____skate_attributesMgr';

/**
 * @internal
 * Returns attribute manager instance for the given Component
 */
function getAttrMgr$1 (elem) {
  let mgr = elem[$attributesMgr$1];
  if (!mgr) {
    mgr = new AttributesManager$1(elem);
    elem[$attributesMgr$1] = mgr;
  }
  return mgr;
}

var getOwnPropertyDescriptors$1 = function (obj = {}) {
  return getPropNamesAndSymbols$1(obj).reduce((prev, nameOrSymbol) => {
    prev[nameOrSymbol] = Object.getOwnPropertyDescriptor(obj, nameOrSymbol);
    return prev;
  }, {});
};

var dashCase$1 = function (str) {
  return str.split(/([A-Z])/).reduce((one, two, idx) => {
    const dash = !one || idx % 2 === 0 ? '' : '-';
    return `${one}${dash}${two.toLowerCase()}`;
  });
};

function error$1 (message) {
  throw new Error(message);
}

class PropDefinition$1 {

  constructor (nameOrSymbol, propOptions) {
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
    this.serialize = value => (empty$1(value) ? null : String(value));

    // default 'set': no function
    this.set = null;

    // Note: option key is always a string (no symbols here)
    Object.keys(propOptions).forEach(option => {
      const optVal = propOptions[option];

      // Only accept documented options and perform minimal input validation.
      switch (option) {
        case 'attribute':
          if (!isObject$1(optVal)) {
            this.attrSource = this.attrTarget = resolveAttrName$1(optVal, nameOrSymbol);
          } else {
            const { source, target } = optVal;
            if (!source && !target) {
              error$1(`${option} 'source' or 'target' is missing.`);
            }
            this.attrSource = resolveAttrName$1(source, nameOrSymbol);
            this.attrTarget = resolveAttrName$1(target, nameOrSymbol);
            this.attrTargetIsNotSource = this.attrTarget !== this.attrSource;
          }
          break;
        case 'coerce':
        case 'deserialize':
        case 'get':
        case 'serialize':
        case 'set':
          if (isFunction$1(optVal)) {
            this[option] = optVal;
          } else {
            error$1(`${option} must be a function.`);
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

  get nameOrSymbol () {
    return this._nameOrSymbol;
  }

}

function resolveAttrName$1 (attrOption, nameOrSymbol) {
  if (isSymbol$1(nameOrSymbol)) {
    error$1(`${nameOrSymbol.toString()} symbol property cannot have an attribute.`);
  } else {
    if (attrOption === true) {
      return dashCase$1(String(nameOrSymbol));
    }
    if (isString$1(attrOption)) {
      return attrOption;
    }
  }
  return null;
}

/**
 * This is needed to avoid IE11 "stack size errors" when creating
 * a new property on the constructor of an HTMLElement
 */
function setCtorNativeProperty$1 (Ctor, propName, value) {
  Object.defineProperty(Ctor, propName, { configurable: true, value });
}

function getPropsMap$1 (Ctor) {
  // Must be defined on constructor and not from a superclass
  if (!Ctor.hasOwnProperty(ctorPropsMap$1)) {
    const props$$1 = Ctor.props || {};

    const propsMap = getPropNamesAndSymbols$1(props$$1).reduce((result, nameOrSymbol) => {
      result[nameOrSymbol] = new PropDefinition$1(nameOrSymbol, props$$1[nameOrSymbol]);
      return result;
    }, {});
    setCtorNativeProperty$1(Ctor, ctorPropsMap$1, propsMap);
  }

  return Ctor[ctorPropsMap$1];
}

function get$2 (elem) {
  const props$$1 = {};

  getPropNamesAndSymbols$1(getPropsMap$1(elem.constructor)).forEach((nameOrSymbol) => {
    props$$1[nameOrSymbol] = elem[nameOrSymbol];
  });

  return props$$1;
}

function set$2 (elem, newProps) {
  assign$3(elem, newProps);
  if (elem[renderer$1]) {
    elem[renderer$1]();
  }
}

var props$3 = function (elem, newProps) {
  return isUndefined$1(newProps) ? get$2(elem) : set$2(elem, newProps);
};

function getDefaultValue$1 (elem, propDef) {
  return typeof propDef.default === 'function'
    ? propDef.default(elem, { name: propDef.nameOrSymbol })
    : propDef.default;
}

function getInitialValue$1 (elem, propDef) {
  return typeof propDef.initial === 'function'
    ? propDef.initial(elem, { name: propDef.nameOrSymbol })
    : propDef.initial;
}

function getPropData$1 (elem, name) {
  const elemData = data$1(elem, 'props');
  return elemData[name] || (elemData[name] = {});
}

function createNativePropertyDescriptor$1 (propDef) {
  const { nameOrSymbol } = propDef;

  const prop = {
    configurable: true,
    enumerable: true
  };

  prop.beforeDefineProperty = elem => {
    const propData = getPropData$1(elem, nameOrSymbol);
    const attrSource = propDef.attrSource;

    // Store attrSource name to property link.
    if (attrSource) {
      data$1(elem, 'attrSourceLinks')[attrSource] = nameOrSymbol;
    }

    // prop value before upgrading
    let initialValue = elem[nameOrSymbol];

    // Set up initial value if it wasn't specified.
    let valueFromAttrSource = false;
    if (empty$1(initialValue)) {
      if (attrSource && elem.hasAttribute(attrSource)) {
        valueFromAttrSource = true;
        initialValue = propDef.deserialize(elem.getAttribute(attrSource));
      } else if ('initial' in propDef) {
        initialValue = getInitialValue$1(elem, propDef);
      } else {
        initialValue = getDefaultValue$1(elem, propDef);
      }
    }

    initialValue = propDef.coerce(initialValue);

    propData.internalValue = initialValue;

    // Reflect to Target Attribute
    const mustReflect = propDef.attrTarget && !empty$1(initialValue) &&
      (!valueFromAttrSource || propDef.attrTargetIsNotSource);

    if (mustReflect) {
      let serializedValue = propDef.serialize(initialValue);
      getAttrMgr$1(elem).setAttrValue(propDef.attrTarget, serializedValue);
    }
  };

  prop.get = function get () {
    const propData = getPropData$1(this, nameOrSymbol);
    const { internalValue } = propData;
    return propDef.get ? propDef.get(this, { name: nameOrSymbol, internalValue }) : internalValue;
  };

  prop.set = function set (newValue) {
    const propData = getPropData$1(this, nameOrSymbol);

    const useDefaultValue = empty$1(newValue);
    if (useDefaultValue) {
      newValue = getDefaultValue$1(this, propDef);
    }

    newValue = propDef.coerce(newValue);

    if (propDef.set) {
      let { oldValue } = propData;

      if (empty$1(oldValue)) {
        oldValue = null;
      }
      const changeData = { name: nameOrSymbol, newValue, oldValue };
      propDef.set(this, changeData);
    }

    // Queue a re-render.
    this[rendererDebounced$1](this);

    // Update prop data so we can use it next time.
    propData.internalValue = propData.oldValue = newValue;

    // Reflect to Target attribute.
    const mustReflect = propDef.attrTarget &&
      (propDef.attrTargetIsNotSource || !propData.settingPropFromAttrSource);
    if (mustReflect) {
      // Note: setting the prop to empty implies the default value
      // and therefore no attribute should be present!
      let serializedValue = useDefaultValue ? null : propDef.serialize(newValue);
      getAttrMgr$1(this).setAttrValue(propDef.attrTarget, serializedValue);
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
    if (x === y) { // Steps 1-5, 7-10
      // Steps 6.b-6.e: +0 != -0
      return x !== 0 || 1 / x === 1 / y;
    } else {
      // Step 6.a: NaN == NaN
      return x !== x && y !== y;
    }
  };
}
var objectIs$1 = Object.is;

const HTMLElement$3 = index$4.HTMLElement || class {};
const _prevName$1 = createSymbol$1('prevName');
const _prevOldValue$1 = createSymbol$1('prevOldValue');
const _prevNewValue$1 = createSymbol$1('prevNewValue');

function preventDoubleCalling$1 (elem, name$$1, oldValue, newValue) {
  return name$$1 === elem[_prevName$1] &&
    oldValue === elem[_prevOldValue$1] &&
    newValue === elem[_prevNewValue$1];
}

// TODO remove when not catering to Safari < 10.
function createNativePropertyDescriptors$1 (Ctor) {
  const propDefs = getPropsMap$1(Ctor);
  return getPropNamesAndSymbols$1(propDefs).reduce((propDescriptors, nameOrSymbol) => {
    propDescriptors[nameOrSymbol] = createNativePropertyDescriptor$1(propDefs[nameOrSymbol]);
    return propDescriptors;
  }, {});
}

// TODO refactor when not catering to Safari < 10.
//
// We should be able to simplify this where all we do is Object.defineProperty().
function createInitProps$1 (Ctor) {
  const propDescriptors = createNativePropertyDescriptors$1(Ctor);

  return (elem) => {
    getPropNamesAndSymbols$1(propDescriptors).forEach((nameOrSymbol) => {
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

var Component$1 = class extends HTMLElement$3 {
  /**
   * Returns unique attribute names configured with props and
   * those set on the Component constructor if any
   */
  static get observedAttributes () {
    const attrsOnCtor = this.hasOwnProperty(ctorObservedAttributes$1) ? this[ctorObservedAttributes$1] : [];
    const propDefs = getPropsMap$1(this);

    // Use Object.keys to skips symbol props since they have no linked attributes
    const attrsFromLinkedProps = Object.keys(propDefs).map(propName =>
      propDefs[propName].attrSource).filter(Boolean);

    const all = attrsFromLinkedProps.concat(attrsOnCtor).concat(super.observedAttributes);
    return all.filter((item, index) =>
      all.indexOf(item) === index);
  }

  static set observedAttributes (value) {
    value = Array.isArray(value) ? value : [];
    setCtorNativeProperty$1(this, 'observedAttributes', value);
  }

  // Returns superclass props overwritten with this Component props
  static get props () {
    return assign$3({}, super.props, this[ctorProps$1]);
  }

  static set props (value) {
    setCtorNativeProperty$1(this, ctorProps$1, value);
  }

  // Passing args is designed to work with document-register-element. It's not
  // necessary for the webcomponents/custom-element polyfill.
  constructor (...args) {
    super(...args);

    const { constructor } = this;

    // Used for the ready() function so it knows when it can call its callback.
    this[created$1] = true;

    // TODO refactor to not cater to Safari < 10. This means we can depend on
    // built-in property descriptors.
    // Must be defined on constructor and not from a superclass
    if (!constructor.hasOwnProperty(ctorCreateInitProps$1)) {
      setCtorNativeProperty$1(constructor, ctorCreateInitProps$1, createInitProps$1(constructor));
    }

    // Set up a renderer that is debounced for property sets to call directly.
    this[rendererDebounced$1] = debounce$1(this[renderer$1].bind(this));

    // Set up property lifecycle.
    const propDefsCount = getPropNamesAndSymbols$1(getPropsMap$1(constructor)).length;
    if (propDefsCount && constructor[ctorCreateInitProps$1]) {
      constructor[ctorCreateInitProps$1](this);
    }

    // DEPRECATED
    //
    // static render()
    // Note that renderCallback is an optional method!
    if (!this.renderCallback && constructor.render) {
      DEBUG && deprecated$1(this, 'static render', 'renderCallback');
      this.renderCallback = constructor.render.bind(constructor, this);
    }

    // DEPRECATED
    //
    // static created()
    //
    // Props should be set up before calling this.
    const { created: created$$1 } = constructor;
    if (isFunction$1(created$$1)) {
      DEBUG && deprecated$1(this, 'static created', 'constructor');
      created$$1(this);
    }

    // DEPRECATED
    //
    // Feature has rarely been used.
    //
    // Created should be set before invoking the ready listeners.
    const elemData = data$1(this);
    const readyCallbacks = elemData.readyCallbacks;
    if (readyCallbacks) {
      readyCallbacks.forEach(cb => cb(this));
      delete elemData.readyCallbacks;
    }
  }

  // Custom Elements v1
  connectedCallback () {
    // Reflect attributes pending values
    getAttrMgr$1(this).resumeAttributesUpdates();

    // Used to check whether or not the component can render.
    this[connected$1] = true;

    // Render!
    this[rendererDebounced$1]();

    // DEPRECATED
    //
    // static attached()
    const { attached } = this.constructor;
    if (isFunction$1(attached)) {
      DEBUG && deprecated$1(this, 'static attached', 'connectedCallback');
      attached(this);
    }

    // DEPRECATED
    //
    // We can remove this once all browsers support :defined.
    this.setAttribute('defined', '');
  }

  // Custom Elements v1
  disconnectedCallback () {
    // Suspend updating attributes until re-connected
    getAttrMgr$1(this).suspendAttributesUpdates();

    // Ensures the component can't be rendered while disconnected.
    this[connected$1] = false;

    // DEPRECATED
    //
    // static detached()
    const { detached } = this.constructor;
    if (isFunction$1(detached)) {
      DEBUG && deprecated$1(this, 'static detached', 'disconnectedCallback');
      detached(this);
    }
  }

  // Custom Elements v1
  attributeChangedCallback (name$$1, oldValue, newValue) {
    // Polyfill calls this twice.
    if (preventDoubleCalling$1(this, name$$1, oldValue, newValue)) {
      return;
    }

    // Set data so we can prevent double calling if the polyfill.
    this[_prevName$1] = name$$1;
    this[_prevOldValue$1] = oldValue;
    this[_prevNewValue$1] = newValue;

    const propNameOrSymbol = data$1(this, 'attrSourceLinks')[name$$1];
    if (propNameOrSymbol) {
      const changedExternally = getAttrMgr$1(this).onAttributeChanged(name$$1, newValue);
      if (changedExternally) {
        // Sync up the property.
        const propDef = getPropsMap$1(this.constructor)[propNameOrSymbol];
        const newPropVal = newValue !== null && propDef.deserialize
          ? propDef.deserialize(newValue)
          : newValue;

        const propData = data$1(this, 'props')[propNameOrSymbol];
        propData.settingPropFromAttrSource = true;
        this[propNameOrSymbol] = newPropVal;
        propData.settingPropFromAttrSource = false;
      }
    }

    // DEPRECATED
    //
    // static attributeChanged()
    const { attributeChanged } = this.constructor;
    if (isFunction$1(attributeChanged)) {
      DEBUG && deprecated$1(this, 'static attributeChanged', 'attributeChangedCallback');
      attributeChanged(this, { name: name$$1, newValue, oldValue });
    }
  }

  // Skate
  updatedCallback (prevProps) {
    if (this.constructor.hasOwnProperty('updated')) {
      DEBUG && deprecated$1(this, 'static updated', 'updatedCallback');
    }
    return this.constructor.updated(this, prevProps);
  }

  // Skate
  renderedCallback () {
    if (this.constructor.hasOwnProperty('rendered')) {
      DEBUG && deprecated$1(this, 'static rendered', 'renderedCallback');
    }
    return this.constructor.rendered(this);
  }

  // Skate
  //
  // Maps to the static renderer() callback. That logic should be moved here
  // when that is finally removed.
  // TODO: finalize how to support different rendering strategies.
  rendererCallback () {
    // TODO: cannot move code here because tests expects renderer function to still exist on constructor!
    return this.constructor.renderer(this);
  }

  // Skate
  // @internal
  // Invokes the complete render lifecycle.
  [renderer$1] () {
    if (this[rendering$1] || !this[connected$1]) {
      return;
    }

    // Flag as rendering. This prevents anything from trying to render - or
    // queueing a render - while there is a pending render.
    this[rendering$1] = true;
    if (this[updated$1]() && isFunction$1(this.renderCallback)) {
      this.rendererCallback();
      this.renderedCallback();
    }

    this[rendering$1] = false;
  }

  // Skate
  // @internal
  // Calls the updatedCallback() with previous props.
  [updated$1] () {
    const prevProps = this[props$2];
    this[props$2] = props$3(this);
    return this.updatedCallback(prevProps);
  }

  // Skate
  static extend (definition = {}, Base = this) {
    // Create class for the user.
    class Ctor extends Base {}

    // For inheriting from the object literal.
    const opts = getOwnPropertyDescriptors$1(definition);
    const prot = getOwnPropertyDescriptors$1(definition.prototype);

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
  static rendered () {}

  // Skate
  //
  // DEPRECATED
  //
  // Move this to rendererCallback() before removing.
  static renderer (elem) {
    if (!elem.shadowRoot) {
      elem.attachShadow({ mode: 'open' });
    }
    patchInner_1$1(elem.shadowRoot, () => {
      const possibleFn = elem.renderCallback(elem);
      if (isFunction$1(possibleFn)) {
        possibleFn();
      } else if (Array.isArray(possibleFn)) {
        possibleFn.forEach((fn) => {
          if (isFunction$1(fn)) {
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
  static updated (elem, previousProps) {
    // The 'previousProps' will be undefined if it is the initial render.
    if (!previousProps) {
      return true;
    }

    // The 'previousProps' will always contain all of the keys.
    //
    // Use classic loop because:
    // 'for ... in' skips symbols and 'for ... of' is not working yet with IE!?
    // for (let nameOrSymbol of getPropNamesAndSymbols(previousProps)) {
    const namesAndSymbols = getPropNamesAndSymbols$1(previousProps);
    for (let i = 0; i < namesAndSymbols.length; i++) {
      const nameOrSymbol = namesAndSymbols[i];

      // With Object.is NaN is equal to NaN
      if (!objectIs$1(previousProps[nameOrSymbol], elem[nameOrSymbol])) {
        return true;
      }
    }

    return false;
  }
};

const Event$1 = ((TheEvent) => {
  if (TheEvent) {
    try {
      new TheEvent('emit-init'); // eslint-disable-line no-new
    } catch (e) {
      return undefined;
    }
  }
  return TheEvent;
})(index$4.Event);

const h$1 = builder$1();

var stylesContent = `
textarea{
  resize: none;
  outline: none;
  padding: 0;
  overflow: hidden;
  box-sizing: border-box;
}
`;

var define$3 = (componentName, classDefinition) => {
  if (customElements.get(componentName)) {
    console.warn(`${componentName} it's already defined, skiping redefinition`);
    return;
  }

  customElements.define(componentName, classDefinition);
};

const keyCodes = {
  del: 8,
  enter: 13,
  shift: 16
};
const px = (value) => `${value}px`;

class SKGrowy extends Component$1 {
  constructor() {
    super();
    this.shiftPressed = false;
  }

  static get props() {
    return {
      styles: {
        attribute: true,
      },
      minHeight: {
        attribute: true,
        default: 50
      },
      resetOnEnter: {
        attribute: true,
        default: true,
        coerce(val) {
          return typeof val === 'boolean' ? val : (val === 'false' ? false : true);
        }
      }
    };
  }

  renderCallback() {
    const mergedStyles = stylesContent + this.styles;
   
    return [
      h$1('style', mergedStyles),
      h$1('textarea', {
        oninput: this.oninput(this.minHeight),
        onkeyup: this.onkeyup(this),
        onkeydown: this.onkeydown(this),
        style: {minHeight: px(this.minHeight)}
      })
    ];
  }

  oninput(minHeight) {
    return function() {
      //We need first to reset the height and later read the 'scrollHeight' 
      this.style.height = "";
      const height = Math.max(this.scrollHeight, minHeight);
      this.style.height = px(height);
    };
  }

  onkeyup(component) {
    return function(e) {
      const code = e.keyCode;
      const hasLength = !!this.value.trim().length;

      if (code === keyCodes.shift) {
        component.shiftPressed = false;
        return;
      }

      if (code !== keyCodes.enter || !hasLength || component.shiftPressed) return;

      component.triggerEvent('onenter');
      component.resetOnEnter && component.clear();
    }
  }

  clear() {
    const textarea = this.shadowRoot.querySelector('textarea');

    textarea.style.height = px(this.minHeight);
    textarea.value = '';
  }

  triggerEvent(eventName, options) {
    const event = new CustomEvent(eventName, {
      detail: options
    });

    this.dispatchEvent(event);
  }

  onkeydown(component) {
    return function(e) {
      const code = e.keyCode;

      if (code !== keyCodes.shift) return;

      component.shiftPressed = true;
    }
  }

  addText(text) {
    const textarea = this.shadowRoot.querySelector('textarea');

    textarea.value += text;
    //TODO: Improve 'oninput' method making it easy to use
    this.oninput(this.minHeight).call(textarea);
  }
}

define$3('sk-growy', SKGrowy);

const isFunction$2 = val => typeof val === 'function';
const isObject$2 = val => (typeof val === 'object' && val !== null);
const isString$2 = val => typeof val === 'string';
const isSymbol$2 = val => typeof val === 'symbol';
const isUndefined$2 = val => typeof val === 'undefined';

function getPropNamesAndSymbols$2 (obj = {}) {
  const listOfKeys = Object.getOwnPropertyNames(obj);
  return isFunction$2(Object.getOwnPropertySymbols)
    ? listOfKeys.concat(Object.getOwnPropertySymbols(obj))
    : listOfKeys;
}

var assign$6 = (obj, ...args) => {
  args.forEach(arg => getPropNamesAndSymbols$2(arg).forEach(nameOrSymbol => obj[nameOrSymbol] = arg[nameOrSymbol])); // eslint-disable-line no-return-assign
  return obj;
};

var empty$2 = function (val) {
  return typeof val === 'undefined' || val === null;
};

const toNullOrString$4 = val => (empty$2(val) ? null : String(val));

// defaults empty to 0 and allows NaN

const connected$2 = '____skate_connected';
const created$2 = '____skate_created';

// DEPRECATED
//
// This is the only "symbol" that must stay a string. This is because it is
// relied upon across several versions. We should remove it, but ensure that
// it's considered a breaking change that whatever version removes it cannot
// be passed to vdom functions as tag names.
const name$2 = '____skate_name';

// Used on the Constructor
const ctorCreateInitProps$2 = '____skate_ctor_createInitProps';
const ctorObservedAttributes$2 = '____skate_ctor_observedAttributes';
const ctorProps$2 = '____skate_ctor_props';
const ctorPropsMap$2 = '____skate_ctor_propsMap';

// Used on the Element
const props$4 = '____skate_props';
const ref$2 = '____skate_ref';
const renderer$2 = '____skate_renderer';
const rendering$2 = '____skate_rendering';
const rendererDebounced$2 = '____skate_rendererDebounced';
const updated$2 = '____skate_updated';

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

var hasOwnProperty$4 = Object.prototype.hasOwnProperty;

/**
 * A cached reference to the create function.
 */
var create$5 = Object.create;

/**
 * Used to prevent property collisions between our "map" and its prototype.
 * @param {!Object<string, *>} map The map to check.
 * @param {string} property The property to check.
 * @return {boolean} Whether map has property.
 */
var has$2 = function (map, property) {
  return hasOwnProperty$4.call(map, property);
};

/**
 * Creates an map object without a prototype.
 * @return {!Object}
 */
var createMap$2 = function () {
  return create$5(null);
};

/**
 * Keeps track of information needed to perform diffs for a given DOM node.
 * @param {!string} nodeName
 * @param {?string=} key
 * @constructor
 */
function NodeData$2(nodeName, key) {
  /**
   * The attributes and their values.
   * @const {!Object<string, *>}
   */
  this.attrs = createMap$2();

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
  this.newAttrs = createMap$2();

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
var initData$2 = function (node, nodeName, key) {
  var data = new NodeData$2(nodeName, key);
  node['__incrementalDOMData'] = data;
  return data;
};

/**
 * Retrieves the NodeData object for a Node, creating it if necessary.
 *
 * @param {Node} node The node to retrieve the data for.
 * @return {!NodeData} The NodeData for this Node.
 */
var getData$2 = function (node) {
  var data = node['__incrementalDOMData'];

  if (!data) {
    var nodeName = node.nodeName.toLowerCase();
    var key = null;

    if (node instanceof Element) {
      key = node.getAttribute('key');
    }

    data = initData$2(node, nodeName, key);
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
var symbols$2 = {
  default: '__default',

  placeholder: '__placeholder'
};

/**
 * @param {string} name
 * @return {string|undefined} The namespace to use for the attribute.
 */
var getNamespace$2 = function (name) {
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
var applyAttr$2 = function (el, name, value) {
  if (value == null) {
    el.removeAttribute(name);
  } else {
    var attrNS = getNamespace$2(name);
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
var applyProp$2 = function (el, name, value) {
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
var applyStyle$2 = function (el, name, style) {
  if (typeof style === 'string') {
    el.style.cssText = style;
  } else {
    el.style.cssText = '';
    var elStyle = el.style;
    var obj = /** @type {!Object<string,string>} */style;

    for (var prop in obj) {
      if (has$2(obj, prop)) {
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
var applyAttributeTyped$2 = function (el, name, value) {
  var type = typeof value;

  if (type === 'object' || type === 'function') {
    applyProp$2(el, name, value);
  } else {
    applyAttr$2(el, name, /** @type {?(boolean|number|string)} */value);
  }
};

/**
 * Calls the appropriate attribute mutator for this attribute.
 * @param {!Element} el
 * @param {string} name The attribute's name.
 * @param {*} value The attribute's value.
 */
var updateAttribute$2 = function (el, name, value) {
  var data = getData$2(el);
  var attrs = data.attrs;

  if (attrs[name] === value) {
    return;
  }

  var mutator = attributes$2[name] || attributes$2[symbols$2.default];
  mutator(el, name, value);

  attrs[name] = value;
};

/**
 * A publicly mutable object to provide custom mutators for attributes.
 * @const {!Object<string, function(!Element, string, *)>}
 */
var attributes$2 = createMap$2();

// Special generic mutator that's called for any attribute that does not
// have a specific mutator.
attributes$2[symbols$2.default] = applyAttributeTyped$2;

attributes$2[symbols$2.placeholder] = function () {};

attributes$2['style'] = applyStyle$2;

/**
 * Gets the namespace to create an element (of a given tag) in.
 * @param {string} tag The tag to get the namespace for.
 * @param {?Node} parent
 * @return {?string} The namespace to create the tag in.
 */
var getNamespaceForTag$2 = function (tag, parent) {
  if (tag === 'svg') {
    return 'http://www.w3.org/2000/svg';
  }

  if (getData$2(parent).nodeName === 'foreignObject') {
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
var createElement$2 = function (doc, parent, tag, key, statics) {
  var namespace = getNamespaceForTag$2(tag, parent);
  var el = undefined;

  if (namespace) {
    el = doc.createElementNS(namespace, tag);
  } else {
    el = doc.createElement(tag);
  }

  initData$2(el, tag, key);

  if (statics) {
    for (var i = 0; i < statics.length; i += 2) {
      updateAttribute$2(el, /** @type {!string}*/statics[i], statics[i + 1]);
    }
  }

  return el;
};

/**
 * Creates a Text Node.
 * @param {Document} doc The document with which to create the Element.
 * @return {!Text}
 */
var createText$2 = function (doc) {
  var node = doc.createTextNode('');
  initData$2(node, '#text', null);
  return node;
};

/**
 * Creates a mapping that can be used to look up children using a key.
 * @param {?Node} el
 * @return {!Object<string, !Element>} A mapping of keys to the children of the
 *     Element.
 */
var createKeyMap$2 = function (el) {
  var map = createMap$2();
  var child = el.firstElementChild;

  while (child) {
    var key = getData$2(child).key;

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
var getKeyMap$2 = function (el) {
  var data = getData$2(el);

  if (!data.keyMap) {
    data.keyMap = createKeyMap$2(el);
  }

  return data.keyMap;
};

/**
 * Retrieves a child from the parent with the given key.
 * @param {?Node} parent
 * @param {?string=} key
 * @return {?Node} The child corresponding to the key.
 */
var getChild$2 = function (parent, key) {
  return key ? getKeyMap$2(parent)[key] : null;
};

/**
 * Registers an element as being a child. The parent will keep track of the
 * child using the key. The child can be retrieved using the same key using
 * getKeyMap. The provided key should be unique within the parent Element.
 * @param {?Node} parent The parent of child.
 * @param {string} key A key to identify the child with.
 * @param {!Node} child The child to register.
 */
var registerChild$2 = function (parent, key, child) {
  getKeyMap$2(parent)[key] = child;
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
var notifications$2 = {
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
function Context$2() {
  /**
   * @type {(Array<!Node>|undefined)}
   */
  this.created = notifications$2.nodesCreated && [];

  /**
   * @type {(Array<!Node>|undefined)}
   */
  this.deleted = notifications$2.nodesDeleted && [];
}

/**
 * @param {!Node} node
 */
Context$2.prototype.markCreated = function (node) {
  if (this.created) {
    this.created.push(node);
  }
};

/**
 * @param {!Node} node
 */
Context$2.prototype.markDeleted = function (node) {
  if (this.deleted) {
    this.deleted.push(node);
  }
};

/**
 * Notifies about nodes that were created during the patch opearation.
 */
Context$2.prototype.notifyChanges = function () {
  if (this.created && this.created.length > 0) {
    notifications$2.nodesCreated(this.created);
  }

  if (this.deleted && this.deleted.length > 0) {
    notifications$2.nodesDeleted(this.deleted);
  }
};

/**
* Makes sure that keyed Element matches the tag name provided.
* @param {!string} nodeName The nodeName of the node that is being matched.
* @param {string=} tag The tag name of the Element.
* @param {?string=} key The key of the Element.
*/
var assertKeyedTagMatches$2 = function (nodeName, tag, key) {
  if (nodeName !== tag) {
    throw new Error('Was expecting node with key "' + key + '" to be a ' + tag + ', not a ' + nodeName + '.');
  }
};

/** @type {?Context} */
var context$2 = null;

/** @type {?Node} */
var currentNode$2 = null;

/** @type {?Node} */
var currentParent$2 = null;

/** @type {?Element|?DocumentFragment} */
var root$4 = null;

/** @type {?Document} */
var doc$2 = null;

/**
 * Returns a patcher function that sets up and restores a patch context,
 * running the run function with the provided data.
 * @param {function((!Element|!DocumentFragment),!function(T),T=)} run
 * @return {function((!Element|!DocumentFragment),!function(T),T=)}
 * @template T
 */
var patchFactory$2 = function (run) {
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
    var prevContext = context$2;
    var prevRoot = root$4;
    var prevDoc = doc$2;
    var prevCurrentNode = currentNode$2;
    var prevCurrentParent = currentParent$2;
    var previousInAttributes = false;
    var previousInSkip = false;

    context$2 = new Context$2();
    root$4 = node;
    doc$2 = node.ownerDocument;
    currentParent$2 = node.parentNode;

    run(node, fn, data);

    context$2.notifyChanges();

    context$2 = prevContext;
    root$4 = prevRoot;
    doc$2 = prevDoc;
    currentNode$2 = prevCurrentNode;
    currentParent$2 = prevCurrentParent;
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
var patchInner$2 = patchFactory$2(function (node, fn, data) {
  currentNode$2 = node;

  enterNode$2();
  fn(data);
  exitNode$2();

  
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
var matches$2 = function (nodeName, key) {
  var data = getData$2(currentNode$2);

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
var alignWithDOM$2 = function (nodeName, key, statics) {
  if (currentNode$2 && matches$2(nodeName, key)) {
    return;
  }

  var node = undefined;

  // Check to see if the node has moved within the parent.
  if (key) {
    node = getChild$2(currentParent$2, key);
    if (node && 'production' !== 'production') {
      assertKeyedTagMatches$2(getData$2(node).nodeName, nodeName, key);
    }
  }

  // Create the node if it doesn't exist.
  if (!node) {
    if (nodeName === '#text') {
      node = createText$2(doc$2);
    } else {
      node = createElement$2(doc$2, currentParent$2, nodeName, key, statics);
    }

    if (key) {
      registerChild$2(currentParent$2, key, node);
    }

    context$2.markCreated(node);
  }

  // If the node has a key, remove it from the DOM to prevent a large number
  // of re-orders in the case that it moved far or was completely removed.
  // Since we hold on to a reference through the keyMap, we can always add it
  // back.
  if (currentNode$2 && getData$2(currentNode$2).key) {
    currentParent$2.replaceChild(node, currentNode$2);
    getData$2(currentParent$2).keyMapValid = false;
  } else {
    currentParent$2.insertBefore(node, currentNode$2);
  }

  currentNode$2 = node;
};

/**
 * Clears out any unvisited Nodes, as the corresponding virtual element
 * functions were never called for them.
 */
var clearUnvisitedDOM$2 = function () {
  var node = currentParent$2;
  var data = getData$2(node);
  var keyMap = data.keyMap;
  var keyMapValid = data.keyMapValid;
  var child = node.lastChild;
  var key = undefined;

  if (child === currentNode$2 && keyMapValid) {
    return;
  }

  if (data.attrs[symbols$2.placeholder] && node !== root$4) {
    return;
  }

  while (child !== currentNode$2) {
    node.removeChild(child);
    context$2.markDeleted( /** @type {!Node}*/child);

    key = getData$2(child).key;
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
        context$2.markDeleted(child);
        delete keyMap[key];
      }
    }

    data.keyMapValid = true;
  }
};

/**
 * Changes to the first child of the current node.
 */
var enterNode$2 = function () {
  currentParent$2 = currentNode$2;
  currentNode$2 = null;
};

/**
 * Changes to the next sibling of the current node.
 */
var nextNode$2 = function () {
  if (currentNode$2) {
    currentNode$2 = currentNode$2.nextSibling;
  } else {
    currentNode$2 = currentParent$2.firstChild;
  }
};

/**
 * Changes to the parent of the current node, removing any unvisited children.
 */
var exitNode$2 = function () {
  clearUnvisitedDOM$2();

  currentNode$2 = currentParent$2;
  currentParent$2 = currentParent$2.parentNode;
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
var coreElementOpen$2 = function (tag, key, statics) {
  nextNode$2();
  alignWithDOM$2(tag, key, statics);
  enterNode$2();
  return (/** @type {!Element} */currentParent$2
  );
};

/**
 * Closes the currently open Element, removing any unvisited children if
 * necessary.
 *
 * @return {!Element} The corresponding Element.
 */
var coreElementClose$2 = function () {
  exitNode$2();
  return (/** @type {!Element} */currentNode$2
  );
};

/**
 * Makes sure the current node is a Text node and creates a Text node if it is
 * not.
 *
 * @return {!Text} The corresponding Text Node.
 */
var coreText$2 = function () {
  nextNode$2();
  alignWithDOM$2('#text', null, null);
  return (/** @type {!Text} */currentNode$2
  );
};

/**
 * Gets the current Element being patched.
 * @return {!Element}
 */
var skip$2 = function () {
  currentNode$2 = currentParent$2.lastChild;
};

/**
 * The offset in the virtual element declaration where the attributes are
 * specified.
 * @const
 */
var ATTRIBUTES_OFFSET$2 = 3;

/**
 * Builds an array of arguments for use with elementOpenStart, attr and
 * elementOpenEnd.
 * @const {Array<*>}
 */
var elementOpen$5 = function (tag, key, statics, const_args) {
  var node = coreElementOpen$2(tag, key, statics);
  var data = getData$2(node);

  /*
   * Checks to see if one or more attributes have changed for a given Element.
   * When no attributes have changed, this is much faster than checking each
   * individual argument. When attributes have changed, the overhead of this is
   * minimal.
   */
  var attrsArr = data.attrsArr;
  var newAttrs = data.newAttrs;
  var attrsChanged = false;
  var i = ATTRIBUTES_OFFSET$2;
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
    for (i = ATTRIBUTES_OFFSET$2; i < arguments.length; i += 2) {
      newAttrs[arguments[i]] = arguments[i + 1];
    }

    for (var _attr in newAttrs) {
      updateAttribute$2(node, _attr, newAttrs[_attr]);
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
var elementClose$2 = function (tag) {
  var node = coreElementClose$2();

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
var text$2 = function (value, const_args) {
  var node = coreText$2();
  var data = getData$2(node);

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

var patchInner_1$2 = patchInner$2;
var skip_1$2 = skip$2;
var elementOpen_1$2 = elementOpen$5;
var elementClose_1$2 = elementClose$2;
var text_1$2 = text$2;
var symbols_1$2 = symbols$2;
var attributes_1$2 = attributes$2;
var applyProp_1$2 = applyProp$2;

function enter$2 (object, props) {
  const saved = {};
  Object.keys(props).forEach((key) => {
    saved[key] = object[key];
    object[key] = props[key];
  });
  return saved;
}

function exit$2 (object, saved) {
  assign$6(object, saved);
}

// Decorates a function with a side effect that changes the properties of an
// object during its execution, and restores them after. There is no error
// handling here, if the wrapped function throws an error, properties are not
// restored and all bets are off.
var propContext$2 = function (object, props) {
  return func => (...args) => {
    const saved = enter$2(object, props);
    const result = func(...args);
    exit$2(object, saved);
    return result;
  };
};

var index$8 = (typeof self === 'object' && self.self === self && self) ||
  (typeof commonjsGlobal === 'object' && commonjsGlobal.global === commonjsGlobal && commonjsGlobal) ||
  commonjsGlobal;

/* eslint no-plusplus: 0 */

const { customElements: customElements$3, HTMLElement: HTMLElement$4 } = index$8;
const applyDefault$2 = attributes_1$2[symbols_1$2.default];

// A stack of children that corresponds to the current function helper being
// executed.
const stackChren$2 = [];

const $skip$2 = '__skip';
const $currentEventHandlers$2 = '__events';
const $stackCurrentHelperProps$2 = '__props';

// The current function helper in the stack.
let stackCurrentHelper$2;

// This is used for the Incremental DOM overrides to keep track of what args
// to pass the main elementOpen() function.
let overrideArgs$2;

// The number of levels deep after skipping a tree.
let skips$2 = 0;

const noop$2 = () => {};

// Adds or removes an event listener for an element.
function applyEvent$2 (elem, ename, newFunc) {
  let events = elem[$currentEventHandlers$2];

  if (!events) {
    events = elem[$currentEventHandlers$2] = {};
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

const attributesContext$2 = propContext$2(attributes_1$2, {
  // Attributes that shouldn't be applied to the DOM.
  key: noop$2,
  statics: noop$2,

  // Attributes that *must* be set via a property on all elements.
  checked: applyProp_1$2,
  className: applyProp_1$2,
  disabled: applyProp_1$2,
  value: applyProp_1$2,

  // Ref handler.
  ref (elem, name$$1, value) {
    elem[ref$2] = value;
  },

  // Skip handler.
  skip (elem, name$$1, value) {
    if (value) {
      elem[$skip$2] = true;
    } else {
      delete elem[$skip$2];
    }
  },

  // Default attribute applicator.
  [symbols_1$2.default] (elem, name$$1, value) {
    const { props: props$$1, prototype } = customElements$3.get(elem.localName) || {
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
      applyProp_1$2(elem, name$$1, value);
      return;
    }

    // Explicit false removes the attribute.
    if (value === false) {
      applyDefault$2(elem, name$$1);
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
        applyEvent$2(elem, eventName, value);
        return;
      }
    }

    applyDefault$2(elem, name$$1, value);
  }
});

function resolveTagName$2 (name$$1) {
  // We return falsy values as some wrapped IDOM functions allow empty values.
  if (!name$$1) {
    return name$$1;
  }

  // We try and return the cached tag name, if one exists.
  if (name$$1[name$2]) {
    return name$$1[name$2];
  }

  // If it's a custom element, we get the tag name by constructing it and
  // caching it.
  if (name$$1.prototype instanceof HTMLElement$4) {
    // eslint-disable-next-line
    const elem = new name$$1();
    return (name$$1[name$2] = elem.localName);
  }

  // Pass all other values through so IDOM gets what it's expecting.
  return name$$1;
}

// Incremental DOM's elementOpen is where the hooks in `attributes` are applied,
// so it's the only function we need to execute in the context of our attributes.
const elementOpen$4 = attributesContext$2(elementOpen_1$2);

function elementOpenStart$4 (tag, key = null, statics = null) {
  overrideArgs$2 = [tag, key, statics];
}

function elementOpenEnd$4 () {
  const node = newElementOpen$2(...overrideArgs$2); // eslint-disable-line no-use-before-define
  overrideArgs$2 = null;
  return node;
}

function wrapIdomFunc$2 (func, tnameFuncHandler = noop$2) {
  return function wrap (...args) {
    args[0] = resolveTagName$2(args[0]);
    stackCurrentHelper$2 = null;
    if (typeof args[0] === 'function') {
      // If we've encountered a function, handle it according to the type of
      // function that is being wrapped.
      stackCurrentHelper$2 = args[0];
      return tnameFuncHandler(...args);
    } else if (stackChren$2.length) {
      // We pass the wrap() function in here so that when it's called as
      // children, it will queue up for the next stack, if there is one.
      stackChren$2[stackChren$2.length - 1].push([wrap, args]);
    } else {
      if (func === elementOpen$4) {
        if (skips$2) {
          return ++skips$2;
        }

        const elem = func(...args);

        if (elem[$skip$2]) {
          ++skips$2;
        }

        return elem;
      }

      if (func === elementClose_1$2) {
        if (skips$2 === 1) {
          skip_1$2();
        }

        // We only want to skip closing if it's not the last closing tag in the
        // skipped tree because we keep the element that initiated the skpping.
        if (skips$2 && --skips$2) {
          return;
        }

        const elem = func(...args);
        const ref$$1 = elem[ref$2];

        // We delete so that it isn't called again for the same element. If the
        // ref changes, or the element changes, this will be defined again.
        delete elem[ref$2];

        // Execute the saved ref after esuring we've cleand up after it.
        if (typeof ref$$1 === 'function') {
          ref$$1(elem);
        }

        return elem;
      }

      // We must call elementOpenStart and elementOpenEnd even if we are
      // skipping because they queue up attributes and then call elementClose.
      if (!skips$2 || (func === elementOpenStart$4 || func === elementOpenEnd$4)) {
        return func(...args);
      }
    }
  };
}

function newAttr$2 (...args) {
  if (stackCurrentHelper$2) {
    stackCurrentHelper$2[$stackCurrentHelperProps$2][args[0]] = args[1];
  } else if (stackChren$2.length) {
    stackChren$2[stackChren$2.length - 1].push([newAttr$2, args]);
  } else {
    overrideArgs$2.push(args[0]);
    overrideArgs$2.push(args[1]);
  }
}

function stackOpen$2 (tname, key, statics, ...attrs) {
  const props$$1 = { key, statics };
  for (let a = 0; a < attrs.length; a += 2) {
    props$$1[attrs[a]] = attrs[a + 1];
  }
  tname[$stackCurrentHelperProps$2] = props$$1;
  stackChren$2.push([]);
}

function stackClose$2 (tname) {
  const chren = stackChren$2.pop();
  const props$$1 = tname[$stackCurrentHelperProps$2];
  delete tname[$stackCurrentHelperProps$2];
  const elemOrFn = tname(props$$1, () => chren.forEach(args => args[0](...args[1])));
  return typeof elemOrFn === 'function' ? elemOrFn() : elemOrFn;
}

// Incremental DOM overrides
// -------------------------

// We must override internal functions that call internal Incremental DOM
// functions because we can't override the internal references. This means
// we must roughly re-implement their behaviour. Luckily, they're fairly
// simple.
const newElementOpenStart$2 = wrapIdomFunc$2(elementOpenStart$4, stackOpen$2);
const newElementOpenEnd$2 = wrapIdomFunc$2(elementOpenEnd$4);

// Standard open / closed overrides don't need to reproduce internal behaviour
// because they are the ones referenced from *End and *Start.
const newElementOpen$2 = wrapIdomFunc$2(elementOpen$4, stackOpen$2);
const newElementClose$2 = wrapIdomFunc$2(elementClose_1$2, stackClose$2);

// Ensure we call our overridden functions instead of the internal ones.
const newText$2 = wrapIdomFunc$2(text_1$2);

// Convenience function for declaring an Incremental DOM element using
// hyperscript-style syntax.
function element$2 (tname, attrs, ...chren) {
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
  newElementOpenStart$2(tname, attrs.key, attrs.statics);

  // Delete so special attrs don't actually get set.
  delete attrs.key;
  delete attrs.statics;

  // Set attributes.
  Object.keys(attrs).forEach(name$$1 => newAttr$2(name$$1, attrs[name$$1]));

  // Close before we render the descendant tree.
  newElementOpenEnd$2(tname);

  chren.forEach((ch) => {
    const ctype = typeof ch;
    if (ctype === 'function') {
      ch();
    } else if (ctype === 'string' || ctype === 'number') {
      newText$2(ch);
    } else if (Array.isArray(ch)) {
      ch.forEach(sch => sch());
    }
  });

  return newElementClose$2(tname);
}

// Even further convenience for building a DSL out of JavaScript functions or hooking into standard
// transpiles for JSX (React.createElement() / h).
function builder$2 (...tags) {
  if (tags.length === 0) {
    return (...args) => element$2.bind(null, ...args);
  }
  return tags.map(tag =>
    (...args) =>
      element$2.bind(null, tag, ...args)
  );
}

// We don't have to do anything special for the text function; it's just a
// straight export from Incremental DOM.

function createSymbol$2 (description) {
  return typeof Symbol === 'function' ? Symbol(description) : description;
}

var data$2 = function (element, namespace = '') {
  const data = element.__SKATE_DATA || (element.__SKATE_DATA = {});
  return namespace && (data[namespace] || (data[namespace] = {})) || data; // eslint-disable-line no-mixed-operators
};

const nativeHints$2 = [
  'native code',
  '[object MutationObserverConstructor]' // for mobile safari iOS 9.0
];
var native$2 = fn => nativeHints$2.map(
  (hint) => (fn || '').toString().indexOf([hint]) > -1
).reduce((a, b) => a || b);

const { MutationObserver: MutationObserver$2 } = index$8;

function microtaskDebounce$2 (cbFunc) {
  let scheduled = false;
  let i = 0;
  let cbArgs = [];
  const elem = document.createElement('span');
  const observer = new MutationObserver$2(() => {
    cbFunc(...cbArgs);
    scheduled = false;
    cbArgs = null;
  });

  observer.observe(elem, { childList: true });

  return (...args) => {
    cbArgs = args;
    if (!scheduled) {
      scheduled = true;
      elem.textContent = `${i}`;
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
function taskDebounce$2 (cbFunc) {
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
var debounce$2 = native$2(MutationObserver$2) ? microtaskDebounce$2 : taskDebounce$2;

function deprecated$2 (elem, oldUsage, newUsage) {
  if (DEBUG) {
    const ownerName = elem.localName ? elem.localName : String(elem);
    console.warn(`${ownerName} ${oldUsage} is deprecated. Use ${newUsage}.`);
  }
}

class AttributesManager$2 {
  constructor (elem) {
    this.elem = elem;
    this.connected = false;
    this.pendingValues = {};
    this.lastSetValues = {};
  }

  /**
   * Called from disconnectedCallback
   */
  suspendAttributesUpdates () {
    this.connected = false;
  }

  /**
   * Called from connectedCallback
   */
  resumeAttributesUpdates () {
    this.connected = true;
    const names = Object.keys(this.pendingValues);
    names.forEach(name => {
      const value = this.pendingValues[name];
      // Skip if already cleared
      if (!isUndefined$2(value)) {
        delete this.pendingValues[name];
        this._syncAttrValue(name, value);
      }
    });
  }

  /**
   * Returns true if the value is different from the one set internally
   * using setAttrValue()
   */
  onAttributeChanged (name, value) {
    value = toNullOrString$4(value);

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
  setAttrValue (name, value) {
    value = toNullOrString$4(value);

    this.lastSetValues[name] = value;

    if (this.connected) {
      this._clearPendingValue(name);
      this._syncAttrValue(name, value);
    } else {
      this.pendingValues[name] = value;
    }
  }

  _syncAttrValue (name, value) {
    const currAttrValue = toNullOrString$4(this.elem.getAttribute(name));
    if (value !== currAttrValue) {
      if (value === null) {
        this.elem.removeAttribute(name);
      } else {
        this.elem.setAttribute(name, value);
      }
    }
  }

  _clearPendingValue (name) {
    if (name in this.pendingValues) {
      delete this.pendingValues[name];
    }
  }
}

// Only used by getAttrMgr
const $attributesMgr$2 = '____skate_attributesMgr';

/**
 * @internal
 * Returns attribute manager instance for the given Component
 */
function getAttrMgr$2 (elem) {
  let mgr = elem[$attributesMgr$2];
  if (!mgr) {
    mgr = new AttributesManager$2(elem);
    elem[$attributesMgr$2] = mgr;
  }
  return mgr;
}

var getOwnPropertyDescriptors$2 = function (obj = {}) {
  return getPropNamesAndSymbols$2(obj).reduce((prev, nameOrSymbol) => {
    prev[nameOrSymbol] = Object.getOwnPropertyDescriptor(obj, nameOrSymbol);
    return prev;
  }, {});
};

var dashCase$2 = function (str) {
  return str.split(/([A-Z])/).reduce((one, two, idx) => {
    const dash = !one || idx % 2 === 0 ? '' : '-';
    return `${one}${dash}${two.toLowerCase()}`;
  });
};

function error$2 (message) {
  throw new Error(message);
}

class PropDefinition$2 {

  constructor (nameOrSymbol, propOptions) {
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
    this.serialize = value => (empty$2(value) ? null : String(value));

    // default 'set': no function
    this.set = null;

    // Note: option key is always a string (no symbols here)
    Object.keys(propOptions).forEach(option => {
      const optVal = propOptions[option];

      // Only accept documented options and perform minimal input validation.
      switch (option) {
        case 'attribute':
          if (!isObject$2(optVal)) {
            this.attrSource = this.attrTarget = resolveAttrName$2(optVal, nameOrSymbol);
          } else {
            const { source, target } = optVal;
            if (!source && !target) {
              error$2(`${option} 'source' or 'target' is missing.`);
            }
            this.attrSource = resolveAttrName$2(source, nameOrSymbol);
            this.attrTarget = resolveAttrName$2(target, nameOrSymbol);
            this.attrTargetIsNotSource = this.attrTarget !== this.attrSource;
          }
          break;
        case 'coerce':
        case 'deserialize':
        case 'get':
        case 'serialize':
        case 'set':
          if (isFunction$2(optVal)) {
            this[option] = optVal;
          } else {
            error$2(`${option} must be a function.`);
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

  get nameOrSymbol () {
    return this._nameOrSymbol;
  }

}

function resolveAttrName$2 (attrOption, nameOrSymbol) {
  if (isSymbol$2(nameOrSymbol)) {
    error$2(`${nameOrSymbol.toString()} symbol property cannot have an attribute.`);
  } else {
    if (attrOption === true) {
      return dashCase$2(String(nameOrSymbol));
    }
    if (isString$2(attrOption)) {
      return attrOption;
    }
  }
  return null;
}

/**
 * This is needed to avoid IE11 "stack size errors" when creating
 * a new property on the constructor of an HTMLElement
 */
function setCtorNativeProperty$2 (Ctor, propName, value) {
  Object.defineProperty(Ctor, propName, { configurable: true, value });
}

function getPropsMap$2 (Ctor) {
  // Must be defined on constructor and not from a superclass
  if (!Ctor.hasOwnProperty(ctorPropsMap$2)) {
    const props$$1 = Ctor.props || {};

    const propsMap = getPropNamesAndSymbols$2(props$$1).reduce((result, nameOrSymbol) => {
      result[nameOrSymbol] = new PropDefinition$2(nameOrSymbol, props$$1[nameOrSymbol]);
      return result;
    }, {});
    setCtorNativeProperty$2(Ctor, ctorPropsMap$2, propsMap);
  }

  return Ctor[ctorPropsMap$2];
}

function get$3 (elem) {
  const props$$1 = {};

  getPropNamesAndSymbols$2(getPropsMap$2(elem.constructor)).forEach((nameOrSymbol) => {
    props$$1[nameOrSymbol] = elem[nameOrSymbol];
  });

  return props$$1;
}

function set$3 (elem, newProps) {
  assign$6(elem, newProps);
  if (elem[renderer$2]) {
    elem[renderer$2]();
  }
}

var props$5 = function (elem, newProps) {
  return isUndefined$2(newProps) ? get$3(elem) : set$3(elem, newProps);
};

function getDefaultValue$2 (elem, propDef) {
  return typeof propDef.default === 'function'
    ? propDef.default(elem, { name: propDef.nameOrSymbol })
    : propDef.default;
}

function getInitialValue$2 (elem, propDef) {
  return typeof propDef.initial === 'function'
    ? propDef.initial(elem, { name: propDef.nameOrSymbol })
    : propDef.initial;
}

function getPropData$2 (elem, name) {
  const elemData = data$2(elem, 'props');
  return elemData[name] || (elemData[name] = {});
}

function createNativePropertyDescriptor$2 (propDef) {
  const { nameOrSymbol } = propDef;

  const prop = {
    configurable: true,
    enumerable: true
  };

  prop.beforeDefineProperty = elem => {
    const propData = getPropData$2(elem, nameOrSymbol);
    const attrSource = propDef.attrSource;

    // Store attrSource name to property link.
    if (attrSource) {
      data$2(elem, 'attrSourceLinks')[attrSource] = nameOrSymbol;
    }

    // prop value before upgrading
    let initialValue = elem[nameOrSymbol];

    // Set up initial value if it wasn't specified.
    let valueFromAttrSource = false;
    if (empty$2(initialValue)) {
      if (attrSource && elem.hasAttribute(attrSource)) {
        valueFromAttrSource = true;
        initialValue = propDef.deserialize(elem.getAttribute(attrSource));
      } else if ('initial' in propDef) {
        initialValue = getInitialValue$2(elem, propDef);
      } else {
        initialValue = getDefaultValue$2(elem, propDef);
      }
    }

    initialValue = propDef.coerce(initialValue);

    propData.internalValue = initialValue;

    // Reflect to Target Attribute
    const mustReflect = propDef.attrTarget && !empty$2(initialValue) &&
      (!valueFromAttrSource || propDef.attrTargetIsNotSource);

    if (mustReflect) {
      let serializedValue = propDef.serialize(initialValue);
      getAttrMgr$2(elem).setAttrValue(propDef.attrTarget, serializedValue);
    }
  };

  prop.get = function get () {
    const propData = getPropData$2(this, nameOrSymbol);
    const { internalValue } = propData;
    return propDef.get ? propDef.get(this, { name: nameOrSymbol, internalValue }) : internalValue;
  };

  prop.set = function set (newValue) {
    const propData = getPropData$2(this, nameOrSymbol);

    const useDefaultValue = empty$2(newValue);
    if (useDefaultValue) {
      newValue = getDefaultValue$2(this, propDef);
    }

    newValue = propDef.coerce(newValue);

    if (propDef.set) {
      let { oldValue } = propData;

      if (empty$2(oldValue)) {
        oldValue = null;
      }
      const changeData = { name: nameOrSymbol, newValue, oldValue };
      propDef.set(this, changeData);
    }

    // Queue a re-render.
    this[rendererDebounced$2](this);

    // Update prop data so we can use it next time.
    propData.internalValue = propData.oldValue = newValue;

    // Reflect to Target attribute.
    const mustReflect = propDef.attrTarget &&
      (propDef.attrTargetIsNotSource || !propData.settingPropFromAttrSource);
    if (mustReflect) {
      // Note: setting the prop to empty implies the default value
      // and therefore no attribute should be present!
      let serializedValue = useDefaultValue ? null : propDef.serialize(newValue);
      getAttrMgr$2(this).setAttrValue(propDef.attrTarget, serializedValue);
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
    if (x === y) { // Steps 1-5, 7-10
      // Steps 6.b-6.e: +0 != -0
      return x !== 0 || 1 / x === 1 / y;
    } else {
      // Step 6.a: NaN == NaN
      return x !== x && y !== y;
    }
  };
}
var objectIs$2 = Object.is;

const HTMLElement$5 = index$8.HTMLElement || class {};
const _prevName$2 = createSymbol$2('prevName');
const _prevOldValue$2 = createSymbol$2('prevOldValue');
const _prevNewValue$2 = createSymbol$2('prevNewValue');

function preventDoubleCalling$2 (elem, name$$1, oldValue, newValue) {
  return name$$1 === elem[_prevName$2] &&
    oldValue === elem[_prevOldValue$2] &&
    newValue === elem[_prevNewValue$2];
}

// TODO remove when not catering to Safari < 10.
function createNativePropertyDescriptors$2 (Ctor) {
  const propDefs = getPropsMap$2(Ctor);
  return getPropNamesAndSymbols$2(propDefs).reduce((propDescriptors, nameOrSymbol) => {
    propDescriptors[nameOrSymbol] = createNativePropertyDescriptor$2(propDefs[nameOrSymbol]);
    return propDescriptors;
  }, {});
}

// TODO refactor when not catering to Safari < 10.
//
// We should be able to simplify this where all we do is Object.defineProperty().
function createInitProps$2 (Ctor) {
  const propDescriptors = createNativePropertyDescriptors$2(Ctor);

  return (elem) => {
    getPropNamesAndSymbols$2(propDescriptors).forEach((nameOrSymbol) => {
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

var Component$2 = class extends HTMLElement$5 {
  /**
   * Returns unique attribute names configured with props and
   * those set on the Component constructor if any
   */
  static get observedAttributes () {
    const attrsOnCtor = this.hasOwnProperty(ctorObservedAttributes$2) ? this[ctorObservedAttributes$2] : [];
    const propDefs = getPropsMap$2(this);

    // Use Object.keys to skips symbol props since they have no linked attributes
    const attrsFromLinkedProps = Object.keys(propDefs).map(propName =>
      propDefs[propName].attrSource).filter(Boolean);

    const all = attrsFromLinkedProps.concat(attrsOnCtor).concat(super.observedAttributes);
    return all.filter((item, index) =>
      all.indexOf(item) === index);
  }

  static set observedAttributes (value) {
    value = Array.isArray(value) ? value : [];
    setCtorNativeProperty$2(this, 'observedAttributes', value);
  }

  // Returns superclass props overwritten with this Component props
  static get props () {
    return assign$6({}, super.props, this[ctorProps$2]);
  }

  static set props (value) {
    setCtorNativeProperty$2(this, ctorProps$2, value);
  }

  // Passing args is designed to work with document-register-element. It's not
  // necessary for the webcomponents/custom-element polyfill.
  constructor (...args) {
    super(...args);

    const { constructor } = this;

    // Used for the ready() function so it knows when it can call its callback.
    this[created$2] = true;

    // TODO refactor to not cater to Safari < 10. This means we can depend on
    // built-in property descriptors.
    // Must be defined on constructor and not from a superclass
    if (!constructor.hasOwnProperty(ctorCreateInitProps$2)) {
      setCtorNativeProperty$2(constructor, ctorCreateInitProps$2, createInitProps$2(constructor));
    }

    // Set up a renderer that is debounced for property sets to call directly.
    this[rendererDebounced$2] = debounce$2(this[renderer$2].bind(this));

    // Set up property lifecycle.
    const propDefsCount = getPropNamesAndSymbols$2(getPropsMap$2(constructor)).length;
    if (propDefsCount && constructor[ctorCreateInitProps$2]) {
      constructor[ctorCreateInitProps$2](this);
    }

    // DEPRECATED
    //
    // static render()
    // Note that renderCallback is an optional method!
    if (!this.renderCallback && constructor.render) {
      DEBUG && deprecated$2(this, 'static render', 'renderCallback');
      this.renderCallback = constructor.render.bind(constructor, this);
    }

    // DEPRECATED
    //
    // static created()
    //
    // Props should be set up before calling this.
    const { created: created$$1 } = constructor;
    if (isFunction$2(created$$1)) {
      DEBUG && deprecated$2(this, 'static created', 'constructor');
      created$$1(this);
    }

    // DEPRECATED
    //
    // Feature has rarely been used.
    //
    // Created should be set before invoking the ready listeners.
    const elemData = data$2(this);
    const readyCallbacks = elemData.readyCallbacks;
    if (readyCallbacks) {
      readyCallbacks.forEach(cb => cb(this));
      delete elemData.readyCallbacks;
    }
  }

  // Custom Elements v1
  connectedCallback () {
    // Reflect attributes pending values
    getAttrMgr$2(this).resumeAttributesUpdates();

    // Used to check whether or not the component can render.
    this[connected$2] = true;

    // Render!
    this[rendererDebounced$2]();

    // DEPRECATED
    //
    // static attached()
    const { attached } = this.constructor;
    if (isFunction$2(attached)) {
      DEBUG && deprecated$2(this, 'static attached', 'connectedCallback');
      attached(this);
    }

    // DEPRECATED
    //
    // We can remove this once all browsers support :defined.
    this.setAttribute('defined', '');
  }

  // Custom Elements v1
  disconnectedCallback () {
    // Suspend updating attributes until re-connected
    getAttrMgr$2(this).suspendAttributesUpdates();

    // Ensures the component can't be rendered while disconnected.
    this[connected$2] = false;

    // DEPRECATED
    //
    // static detached()
    const { detached } = this.constructor;
    if (isFunction$2(detached)) {
      DEBUG && deprecated$2(this, 'static detached', 'disconnectedCallback');
      detached(this);
    }
  }

  // Custom Elements v1
  attributeChangedCallback (name$$1, oldValue, newValue) {
    // Polyfill calls this twice.
    if (preventDoubleCalling$2(this, name$$1, oldValue, newValue)) {
      return;
    }

    // Set data so we can prevent double calling if the polyfill.
    this[_prevName$2] = name$$1;
    this[_prevOldValue$2] = oldValue;
    this[_prevNewValue$2] = newValue;

    const propNameOrSymbol = data$2(this, 'attrSourceLinks')[name$$1];
    if (propNameOrSymbol) {
      const changedExternally = getAttrMgr$2(this).onAttributeChanged(name$$1, newValue);
      if (changedExternally) {
        // Sync up the property.
        const propDef = getPropsMap$2(this.constructor)[propNameOrSymbol];
        const newPropVal = newValue !== null && propDef.deserialize
          ? propDef.deserialize(newValue)
          : newValue;

        const propData = data$2(this, 'props')[propNameOrSymbol];
        propData.settingPropFromAttrSource = true;
        this[propNameOrSymbol] = newPropVal;
        propData.settingPropFromAttrSource = false;
      }
    }

    // DEPRECATED
    //
    // static attributeChanged()
    const { attributeChanged } = this.constructor;
    if (isFunction$2(attributeChanged)) {
      DEBUG && deprecated$2(this, 'static attributeChanged', 'attributeChangedCallback');
      attributeChanged(this, { name: name$$1, newValue, oldValue });
    }
  }

  // Skate
  updatedCallback (prevProps) {
    if (this.constructor.hasOwnProperty('updated')) {
      DEBUG && deprecated$2(this, 'static updated', 'updatedCallback');
    }
    return this.constructor.updated(this, prevProps);
  }

  // Skate
  renderedCallback () {
    if (this.constructor.hasOwnProperty('rendered')) {
      DEBUG && deprecated$2(this, 'static rendered', 'renderedCallback');
    }
    return this.constructor.rendered(this);
  }

  // Skate
  //
  // Maps to the static renderer() callback. That logic should be moved here
  // when that is finally removed.
  // TODO: finalize how to support different rendering strategies.
  rendererCallback () {
    // TODO: cannot move code here because tests expects renderer function to still exist on constructor!
    return this.constructor.renderer(this);
  }

  // Skate
  // @internal
  // Invokes the complete render lifecycle.
  [renderer$2] () {
    if (this[rendering$2] || !this[connected$2]) {
      return;
    }

    // Flag as rendering. This prevents anything from trying to render - or
    // queueing a render - while there is a pending render.
    this[rendering$2] = true;
    if (this[updated$2]() && isFunction$2(this.renderCallback)) {
      this.rendererCallback();
      this.renderedCallback();
    }

    this[rendering$2] = false;
  }

  // Skate
  // @internal
  // Calls the updatedCallback() with previous props.
  [updated$2] () {
    const prevProps = this[props$4];
    this[props$4] = props$5(this);
    return this.updatedCallback(prevProps);
  }

  // Skate
  static extend (definition = {}, Base = this) {
    // Create class for the user.
    class Ctor extends Base {}

    // For inheriting from the object literal.
    const opts = getOwnPropertyDescriptors$2(definition);
    const prot = getOwnPropertyDescriptors$2(definition.prototype);

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
  static rendered () {}

  // Skate
  //
  // DEPRECATED
  //
  // Move this to rendererCallback() before removing.
  static renderer (elem) {
    if (!elem.shadowRoot) {
      elem.attachShadow({ mode: 'open' });
    }
    patchInner_1$2(elem.shadowRoot, () => {
      const possibleFn = elem.renderCallback(elem);
      if (isFunction$2(possibleFn)) {
        possibleFn();
      } else if (Array.isArray(possibleFn)) {
        possibleFn.forEach((fn) => {
          if (isFunction$2(fn)) {
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
  static updated (elem, previousProps) {
    // The 'previousProps' will be undefined if it is the initial render.
    if (!previousProps) {
      return true;
    }

    // The 'previousProps' will always contain all of the keys.
    //
    // Use classic loop because:
    // 'for ... in' skips symbols and 'for ... of' is not working yet with IE!?
    // for (let nameOrSymbol of getPropNamesAndSymbols(previousProps)) {
    const namesAndSymbols = getPropNamesAndSymbols$2(previousProps);
    for (let i = 0; i < namesAndSymbols.length; i++) {
      const nameOrSymbol = namesAndSymbols[i];

      // With Object.is NaN is equal to NaN
      if (!objectIs$2(previousProps[nameOrSymbol], elem[nameOrSymbol])) {
        return true;
      }
    }

    return false;
  }
};

const Event$2 = ((TheEvent) => {
  if (TheEvent) {
    try {
      new TheEvent('emit-init'); // eslint-disable-line no-new
    } catch (e) {
      return undefined;
    }
  }
  return TheEvent;
})(index$8.Event);

const h$2 = builder$2();

var define$5 = (componentName, classDefinition) => {
  if (customElements.get(componentName)) {
    console.warn(`${componentName} it's already defined, skiping redefinition`);
    return;
  }

  customElements.define(componentName, classDefinition);
};

var styles$3 = `
/*
Common
 */
:host {
  height: 100%;
  width: 100%;
  position: relative;
  display: block;
  contain: content;
}
.spinner{
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  position: absolute;
}
.spinner.overlay{
  background-color: rgba(0,0,0,0.5);
}
/*
  Circle
 */
.spinner.circle {
  width: 40px;
  height: 40px;  
}

.spinner.circle .bounce1, .spinner.circle .bounce2 {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background-color: var(--color);
  opacity: .6;
  position: absolute;
  top: 0;
  left: 0;  
  animation: sk-bounce 2.0s infinite ease-in-out;
}

.spinner.circle .bounce2 {
  animation-delay: -1.0s;
}

@keyframes sk-bounce {
  0%, 100% { 
    transform: scale(0.0);
  } 50% { 
    transform: scale(1.0);
  }
}

/*
  Rect
 */

.spinner.rect {
  width: 100%;
  height: 100%;
  text-align: center;
  font-size: 10px;
}

.spinner.rect > div {
  background-color: var(--color);
  height: 100%;
  width: 6px;
  display: inline-block;
  margin: 0 3px 0 0;
  animation: sk-stretchdelay 1.2s infinite ease-in-out;
}

.spinner.rect .rect2 {
  animation-delay: -1.1s;
}

.spinner.rect .rect3 {
  animation-delay: -1.0s;
}

.spinner.rect .rect4 {
  animation-delay: -0.9s;
}

.spinner.rect .rect5 {
  animation-delay: -0.8s;
}

@keyframes sk-stretchdelay {
  0%, 40%, 100% { 
    transform: scaleY(0.4);
  }  20% { 
    transform: scaleY(1.0);
  }
}

/*
Bounce
 */

.spinner.bounce {
  width: 70px;
  text-align: center;
}

.spinner.bounce > div {
  width: 18px;
  height: 18px;
  background-color: var(--color);
  border-radius: 100%;
  display: inline-block;
  animation: sk-bouncedelay 1.4s infinite ease-in-out both;
}

.spinner.bounce .bounce1 {
  animation-delay: -0.32s;
}

.spinner.bounce .bounce2 {
  animation-delay: -0.16s;
}

@keyframes sk-bouncedelay {
  0%, 80%, 100% { 
    transform: scale(0);
  } 40% { 
    transform: scale(1.0);
  }
}
`;

var layout = (type, extraClass = '') => {
  const layouts = {
    circle: [
      h$2('div', {
          class: `spinner circle ${extraClass}`
        },
        h$2('div', {
          class: `bounce1`
        }),
        h$2('div', {
          class: 'bounce2'
        })
      )
    ],
    rect: [
      h$2('div', {
        class: `spinner rect ${extraClass}`
      }, h$2('div', {
        class: 'rect1'
      }), h$2('div', {
        class: 'rect2'
      }), h$2('div', {
        class: 'rect3'
      }), h$2('div', {
        class: 'rect4'
      }), h$2('div', {
        class: 'rect5'
      }))
    ],
    bounce: [
      h$2('div', {
          class: `spinner bounce ${extraClass}`
        },
        h$2('div', {
          class: `bounce1`
        }),
        h$2('div', {
          class: 'bounce2'
        }),
        h$2('div', {
          class: 'bounce3'
        })
      )
    ]
  };

  return layouts[type];
};

class SKSpinner extends Component$2 {
  static get props() {
    return {
      overlay: {
        attribute: true,
        default: false
      },
      type: {
        attribute: true,
        default: 'circle' //rect, bounce
      },
      //TODO: Implement
      size: {
        attribute: true,
        default: '30px'
      },
      color: {
        attribute: true,
        default: '#333'
      }
    };
  }

  renderCallback() {
    const mergedStyles = styles$3 + `:host {--color: ${this.color};}`;
    const overlay = this.overlay ? 'overlay' : '';

    return [
      //TODO: pass proper .spinner width and height based on 'size' attribute
      h$2('style', mergedStyles),
      ...layout(this.type, overlay)
    ];
  }
}

define$5('sk-spinner', SKSpinner);

class SKEmoji extends Component {
  static get props() {
    return {
      visible: {
        attribute: true,
        default: false
      },
      emojis: {
        default: emojiData
      },
      activeCategory: {
        default: 'people'
      },
      isSearching: {
        default: false
      },
      searchResults: {
        default: []
      },
      showSpinner: {
        default: false
      }
    };
  }

  createCategory(emojis, categoryName) {
    const content = emojis.map(e => {
      return h('i', e);
    });

    return h('li', {
      class: 'emoji-category-content',
      'data-category': categoryName
    }, h('div', {
      class: 'emoji-category-header'
    }, categoryName), h('div', {
      class: 'emojis'
    }, ...content));
  }

  renderCallback() {
    const visible = this.visible ? 'visible' : '';
    const contentVisible = this.isSearching ? '' : 'visible';
    const isSearching = this.isSearching ? 'visible' : '';
    const categories = Object.keys(this.emojis);
    const emojiContent = categories.map(category => {
      return this.createCategory(this.emojis[category], category);
    });
    const categoriesContent = categories.map(c => {
      const active = this.activeCategory === c ? 'active' : '';

      return h('div', {
        style: `background-image: url(${icons[c]})`,
        class: `cat ${active}`,
        onclick: this.goToCategory(c)
      });
    });
    const searchResults = this.createCategory(this.searchResults, 'Search results');
    const spinnerClass = this.showSpinner ? 'visible' : '';

    return [
      h('style', stylesDefinition),
      h('sk-growy', {
        class: 'text',
        'reset-on-enter': 'false',
        'min-height': 60,
        styles: styles({
          textarea: {
            height: '30px',
            'font-size': '16px',
            'padding': '10px'  
          }
        })
      }),
      h('img', {
        class: 'toggle',
        src: icons.people,
        onclick: this.toggle.bind(this)
      }),
      h('div', {
          class: `emojis-wrapper ${visible}`
        }, h('div', {
          class: 'header'
        }, h('input', {
          type: 'search',
          oninput: this.onSearch(this),
          class: 'emoji-search'
        }), h('sk-spinner', {
          class: spinnerClass,
          type: 'rect',
          color: '#aaa',
          style: 'width: 30px; height: 30px;'
        })),
        h('div', {
          class: `emojis-content`,
          onclick: this.onEmojiClick(this)
        }, h('ul', {
          class: `emoji-data ${contentVisible}`
        }, ...emojiContent), h('div', {
          class: `emoji-search-results ${isSearching}`
        }, searchResults)), h('div', {
          class: `categories ${contentVisible}`
        }, categoriesContent))
    ];
  }

  renderedCallback() {
    if (this.intersectionObserver) return;

    this.intersectionObserver = new IntersectionObserver((entries, observer) => {
      const intersection = entries[0];
      const target = intersection.target;
      const category = target.getAttribute('data-category');
      const categories = Object.keys(this.emojis);
      const activeIndex = categories.indexOf(this.activeCategory);
      const currentIndex = categories.indexOf(category);

      if (this.activeCategory === category) {
        if (intersection.intersectionRatio === 0) {          
          this.activeCategory = categories[currentIndex + 1];
        }
      } else if (activeIndex - currentIndex === 1) {
        this.activeCategory = categories[activeIndex - 1];
      }
    }, {
      threshold: [0, 0.1]
    });

    Object.keys(this.emojis).forEach((category) => {
      this.intersectionObserver.observe(
        this.shadowRoot.querySelector(`[data-category="${category}"]`)
      );
    });
  }

  goToCategory(category) {
    return function() {
      const categoryContent = this.shadowRoot.querySelector(`.emoji-category-content[data-category="${category}"]`);

      categoryContent.scrollIntoView();

      setTimeout(() => this.activeCategory = category, 10);
    }.bind(this)
  }

  onEmojiClick(component) {
    return function(e) {
      const target = e.target;
      const isIcon = target.tagName === 'I';

      if (!isIcon) return;

      const emoji = target.textContent;
      const growy = component.shadowRoot.querySelector('.text');

      growy.addText(emoji);
    }
  }
  onSearch(component) {
    return function() {
      const value = this.value.trim();
      clearTimeout(component.searchingDelay);

      if (!value) {
        component.isSearching = false;
        component.showSpinner = false;
        return;
      }

      component.isSearching = true;
      component.showSpinner = true;
      component.searchResults = [];

      component.searchingDelay = setTimeout(() => {
        fetch(`https://emoji.getdango.com/api/emoji?q=${value}`).then(r => r.json()).then(response => {
          component.showSpinner = false;
          component.searchResults = response.results.map(e => e.text);
        });
      }, 300);
    }
  }

  toggle() {
    this.visible = !this.visible;
    setTimeout(() => this.shadowRoot.querySelector('.emoji-search').focus(), 10);
  }
}

define$1('sk-emoji', SKEmoji);

module.exports = SKEmoji;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}]},{},[1]);
