import tagString from "./tagString.js";
import parse from "./parse.js";

export default function tag(...args) {
  return parse(tagString(...args));
}
