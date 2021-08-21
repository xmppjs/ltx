import Element from "./Element.js";

function append(el, child) {
  if (Array.isArray(child)) {
    for (const c of child) append(el, c);
    return;
  }

  if (child === "" || child == null || child === true || child === false) {
    return;
  }

  el.cnode(child);
}

/**
 * JSX compatible API, use this function as pragma
 * https://facebook.github.io/jsx/
 *
 * @param  {string} name  name of the element
 * @param  {object} attrs object of attribute key/value pairs
 * @return {Element}      Element
 */
export default function createElement(name, attrs, ...children) {
  if (typeof attrs === "object" && attrs !== null) {
    // __self and __source are added by babel in development
    // https://github.com/facebook/react/pull/4596
    // https://babeljs.io/docs/en/babel-preset-react#development
    // https://babeljs.io/docs/en/babel-plugin-transform-react-jsx-source
    delete attrs.__source;
    delete attrs.__self;

    for (const [key, value] of Object.entries(attrs)) {
      if (value == null) delete attrs[key];
      else attrs[key] = value.toString(10);
    }
  }

  const el = new Element(name, attrs);

  for (const child of children) {
    append(el, child);
  }

  return el;
}
