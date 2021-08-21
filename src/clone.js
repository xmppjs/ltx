export default function clone(el) {
  if (typeof el !== "object") return el;
  const copy = new el.constructor(el.name, el.attrs);
  for (let i = 0; i < el.children.length; i++) {
    const child = el.children[i];
    copy.cnode(clone(child));
  }
  return copy;
}
