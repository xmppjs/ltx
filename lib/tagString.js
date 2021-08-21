import { escapeXML } from "./escape.js";

export default function tagString(literals, ...substitutions) {
  let str = "";

  for (let i = 0; i < substitutions.length; i++) {
    str += literals[i];
    str += escapeXML(substitutions[i]);
  }
  str += literals[literals.length - 1];

  return str;
}
