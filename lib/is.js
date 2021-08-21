import Element from "./Element.js";

export function isNode(el) {
  return el instanceof Element || typeof el === "string";
}

export function isElement(el) {
  return el instanceof Element;
}

export function isText(el) {
  return typeof el === "string";
}
