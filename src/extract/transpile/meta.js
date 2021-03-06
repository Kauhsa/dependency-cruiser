const _get = require("lodash/get");
const { supportedTranspilers } = require("../../../package.json");
const javaScriptWrap = require("./javascript-wrap");
const typeScriptWrap = require("./typescript-wrap")();
const tsxWrap = require("./typescript-wrap")(true);
const liveScriptWrap = require("./livescript-wrap");
const coffeeWrap = require("./coffeescript-wrap")();
const litCoffeeWrap = require("./coffeescript-wrap")(true);
const vueWrap = require("./vue-template-wrap");
const babelWrap = require("./babel-wrap");
const svelteWrap = require("./svelte-wrap")(typeScriptWrap);

const EXTENSION2WRAPPER = {
  ".js": javaScriptWrap,
  ".cjs": javaScriptWrap,
  ".mjs": javaScriptWrap,
  ".jsx": javaScriptWrap,
  ".ts": typeScriptWrap,
  ".tsx": tsxWrap,
  ".d.ts": typeScriptWrap,
  ".ls": liveScriptWrap,
  ".coffee": coffeeWrap,
  ".litcoffee": litCoffeeWrap,
  ".coffee.md": litCoffeeWrap,
  ".csx": coffeeWrap,
  ".cjsx": coffeeWrap,
  ".vue": vueWrap,
  ".svelte": svelteWrap,
};

const TRANSPILER2WRAPPER = {
  babel: babelWrap,
  javascript: javaScriptWrap,
  "coffee-script": coffeeWrap,
  coffeescript: coffeeWrap,
  livescript: liveScriptWrap,
  typescript: typeScriptWrap,
  "vue-template-compiler": vueWrap,
  svelte: svelteWrap,
};

const BABELEABLE_EXTENSIONS = [
  ".js",
  ".cjs",
  ".mjs",
  ".jsx",
  ".ts",
  ".tsx",
  ".d.ts",
];

/**
 * returns the babel wrapper if there's a babelConfig in the transpiler
 * options for babeleable extensions (javascript and typescript - currently
 * not configurable)
 *
 * returns the wrapper module configured for the extension pExtension if
 * not.
 *
 * returns the javascript wrapper if there's no wrapper module configured
 * for the extension.
 *
 * @param {string}  pExtension the extension (e.g. ".ts", ".js", ".litcoffee")
 * @returns {module} the module
 */
module.exports.getWrapper = (pExtension, pTranspilerOptions) => {
  if (
    Object.keys(_get(pTranspilerOptions, "babelConfig", {})).length > 0 &&
    BABELEABLE_EXTENSIONS.includes(pExtension)
  ) {
    return babelWrap;
  }
  return EXTENSION2WRAPPER[pExtension] || javaScriptWrap;
};

/**
 * all supported extensions and whether or not it is supported
 * in the current environment
 *
 * @type {string[]}
 */
module.exports.allExtensions = Object.keys(EXTENSION2WRAPPER).map((pKey) => ({
  extension: pKey,
  available: EXTENSION2WRAPPER[pKey].isAvailable(),
}));

/**
 * an array of extensions that are 'scannable' (have a valid transpiler
 * available for) in the current environemnt.
 *
 * @type {string[]}
 */
module.exports.scannableExtensions = Object.keys(
  EXTENSION2WRAPPER
).filter((pKey) => EXTENSION2WRAPPER[pKey].isAvailable());

/**
 * returns an array of supported transpilers, whith for each transpiler:
 * - the version (range) supported
 * - whether or not it is available in the current environment
 *
 * @return {IAvailableTranspiler[]} an array of supported transpilers
 */
module.exports.getAvailableTranspilers = () =>
  Object.keys(supportedTranspilers).map((pTranspiler) => ({
    name: pTranspiler,
    version: supportedTranspilers[pTranspiler],
    available: TRANSPILER2WRAPPER[pTranspiler].isAvailable(),
  }));

/* eslint security/detect-object-injection : 0*/
