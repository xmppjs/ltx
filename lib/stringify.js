import { escapeXML } from "./escape.js";

export default function stringify(el, indent, level) {
  if (typeof indent === "number") indent = " ".repeat(indent);
  if (!level) level = 1;
  let s = "";
  s += "<" + el.name;

  for (const k of Object.keys(el.attrs)) {
    s += " " + k + "=" + '"' + escapeXML(el.attrs[k]) + '"';
  }

  if (el.children.length > 0) {
    s += ">";
    for (const child of el.children) {
      if (indent) s += "\n" + indent.repeat(level);
      s +=
        typeof child === "string"
          ? escapeXML(child)
          : stringify(child, indent, level + 1);
    }
    if (indent) s += "\n" + indent.repeat(level - 1);
    s += "</" + el.name + ">";
  } else {
    s += "/>";
  }

  return s;
}
