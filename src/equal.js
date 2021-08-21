export function nameEqual(a, b) {
  return a.name === b.name;
}

export function attrsEqual(a, b) {
  const { attrs } = a;
  const keys = Object.keys(attrs);
  const { length } = keys;
  if (length !== Object.keys(b.attrs).length) return false;
  for (let i = 0, l = length; i < l; i++) {
    const key = keys[i];
    const value = attrs[key];
    // === null || undefined
    if (value == null || b.attrs[key] == null) {
      if (value !== b.attrs[key]) return false;
    } else if (value.toString() !== b.attrs[key].toString()) {
      return false;
    }
  }
  return true;
}

export function childrenEqual(a, b) {
  const { children } = a;
  const { length } = children;
  if (length !== b.children.length) return false;
  for (let i = 0, l = length; i < l; i++) {
    const child = children[i];
    if (typeof child === "string") {
      if (child !== b.children[i]) return false;
    } else {
      if (!equal(child, b.children[i])) return false;
    }
  }
  return true;
}

export default function equal(a, b) {
  if (!nameEqual(a, b)) return false;
  if (!attrsEqual(a, b)) return false;
  if (!childrenEqual(a, b)) return false;
  return true;
}
