import Element from "./Element.js";

/**
 * JSX compatible API, use this function as pragma
 * https://facebook.github.io/jsx/
 *
 * @param  {string} name  name of the element
 * @param  {object} attrs object of attribute key/value pairs
 * @return {Element}      Element
 */
export default function createElement(name, attrs, ...children) {
  const el = new Element(name, attrs);

  for (const child of children) {
    if (child) el.cnode(child);
  }

  return el;
}
