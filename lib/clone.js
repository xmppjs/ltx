"use strict";

module.exports = function clone(el) {
  const clone = new el.constructor(el.name, el.attrs);
  for (let i = 0; i < el.children.length; i++) {
    const child = el.children[i];
    clone.cnode(child.clone ? child.clone() : child);
  }
  return clone;
};
