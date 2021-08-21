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
  // __self and __source are added by babel in development
  // https://github.com/facebook/react/pull/4596
  // https://babeljs.io/docs/en/babel-preset-react#development
  // https://babeljs.io/docs/en/babel-plugin-transform-react-jsx-source
  if (attrs) {
    delete attrs.__source;
    delete attrs.__self;
  }

  const el = new Element(name, attrs);

  for (const child of children) {
    if (child) el.cnode(child);
  }

  return el;
}
