/**
 * Created by PanJiaChen on 16/11/18.
 */

import axios from "axios"
/**
 * @param {string} path
 * @returns {Boolean}
 */
export function isExternal(path) {
  return /^(https?:|mailto:|tel:)/.test(path)
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function validUsername(str) {
  //这里用来和数据库对接
  const valid_map = ['admin', 'editor']
  console.log("here",str)
  return valid_map.indexOf(str.trim()) >= 0
  // return true;
}
