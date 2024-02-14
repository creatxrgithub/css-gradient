"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/gradient.ts
var gradient_exports = {};
__export(gradient_exports, {
  RepeatingConicGradientImpl: () => RepeatingConicGradientImpl,
  RepeatingLinearGradientImpl: () => RepeatingLinearGradientImpl,
  RepeatingRadialGradientImpl: () => RepeatingRadialGradientImpl,
  isColor: () => isColor
});
module.exports = __toCommonJS(gradient_exports);
var regLinear = /(?:(?:repeating-)?linear-gradient\(.+?\))/g;
var regConic = /(?:(?:repeating-)?conic-gradient\(.+?\))/g;
var regRadial = /(?:(?:repeating-)?radial-gradient\(.+?\))/g;
var RepeatingLinearGradientImpl = class {
  constructor() {
    this.methodName = "repeating-linear-gradient";
    this.syntax = {
      angle: "0deg",
      //default
      colorStopList: []
    };
    this.parse = (expression) => {
      var _a, _b, _c;
      if (expression.match(regLinear) === null)
        throw new Error("not a repeating-linear-gradient() function");
      let items = (_a = expression.match(new RegExp("(?<=repeating-linear-gradient\\().+(?=\\))"))) == null ? void 0 : _a[0].split(",");
      if (items === void 0)
        return this;
      this.syntax.to = void 0;
      this.syntax.angle = void 0;
      this.syntax.colorStopList = [];
      if (items[0].match(/\d+deg/) !== null) {
        this.syntax.angle = (_b = items[0].match(/\d+deg/)) == null ? void 0 : _b.toString();
      } else if (items[0].match(/to.+/) !== null) {
        this.syntax.to = (_c = items[0].match(/to.+/)) == null ? void 0 : _c.toString();
      } else {
        this.syntax.colorStopList.push(items[0].trim().split(/\s+/));
      }
      for (let i = 1; i < items.length; i++) {
        this.syntax.colorStopList.push(items[i].trim().split(/\s+/));
      }
      return this;
    };
    this.toString = () => {
      const colorStopList = [];
      for (const item of this.syntax.colorStopList) {
        colorStopList.push(item.join(" "));
      }
      const deg = this.syntax.angle !== void 0 ? this.syntax.angle + ", " : this.syntax.to !== void 0 ? this.syntax.to + ", " : "";
      const retStr = `${this.methodName}(${deg}${colorStopList.join(", ")})`;
      return retStr;
    };
  }
};
var RepeatingConicGradientImpl = class {
  constructor() {
    this.methodName = "repeating-conic-gradient";
    this.syntax = {
      colorStopList: []
    };
    this.parse = (expression) => {
      var _a, _b, _c;
      if (expression.match(regConic) === null)
        throw new Error("not a repeating-conic-gradient() function");
      let items = (_a = expression.match(new RegExp("(?<=repeating-conic-gradient\\().+(?=\\))"))) == null ? void 0 : _a[0].split(",");
      if (items === void 0)
        return this;
      this.syntax.from = void 0;
      this.syntax.at = void 0;
      this.syntax.colorStopList = [];
      if (items[0].match(/from\s+\d+deg/) !== null || items[0].match(/at.+/) !== null) {
        if (items[0].match(/from\s+\d+deg/) !== null)
          this.syntax.from = (_b = items[0].match(/from\s+\d+deg/)) == null ? void 0 : _b.toString();
        if (items[0].match(/at.+/) !== null)
          this.syntax.at = (_c = items[0].match(/at.+/)) == null ? void 0 : _c.toString();
      } else {
        this.syntax.colorStopList.push(items[0].trim().split(/\s+/));
      }
      for (let i = 1; i < items.length; i++) {
        this.syntax.colorStopList.push(items[i].trim().split(/\s+/));
      }
      return this;
    };
    this.toString = () => {
      const from = this.syntax.from !== void 0 ? this.syntax.from + " " : "";
      const at = this.syntax.at !== void 0 && this.syntax.at.match(/at.+/) !== null ? this.syntax.at + " " : "";
      const colorStopList = [];
      for (const item of this.syntax.colorStopList) {
        colorStopList.push(item.join(" "));
      }
      const fromAt = from !== "" || at !== "" ? from + at + ", " : from + at;
      const retStr = `${this.methodName}(${fromAt}${colorStopList.join(", ")})`;
      return retStr;
    };
  }
};
var RepeatingRadialGradientImpl = class {
  constructor() {
    this.methodName = "repeating-radial-gradient";
    this.syntax = {
      colorStopList: []
    };
    this.parse = (expression) => {
      var _a, _b, _c, _d, _e;
      if (expression.match(regRadial) === null)
        throw new Error("not a repeating-radial-gradient() function");
      let items = (_a = expression.match(new RegExp("(?<=repeating-radial-gradient\\().+(?=\\))"))) == null ? void 0 : _a[0].split(",");
      if (items === void 0)
        return this;
      this.syntax.shape = void 0;
      this.syntax.size = void 0;
      this.syntax.at = void 0;
      this.syntax.colorStopList = [];
      if (items[0].match(/(circle|ellipse)/i) !== null) {
        this.syntax.shape = (_b = items[0].match(/circle|ellipse/i)) == null ? void 0 : _b.toString().trim();
      }
      if (items[0].match(/at.+/) !== null) {
        this.syntax.at = (_c = items[0].match(/at.+/)) == null ? void 0 : _c.toString().trim();
      }
      const regRadialSize = /\d+(?:px|\%)\s+\d+(?:px|\%)(?=\s*at)?/;
      if (items[0].match(regRadialSize) !== null) {
        if (((_d = items[0].match(regRadialSize)) == null ? void 0 : _d.toString().trim()) !== "") {
          this.syntax.size = (_e = items[0].match(regRadialSize)) == null ? void 0 : _e.toString().trim();
        }
      }
      for (let i = 1; i < items.length; i++) {
        this.syntax.colorStopList.push(items[i].trim().split(/\s+/));
      }
      if ((this.syntax.shape === void 0 || this.syntax.size === void 0) && this.syntax.at === void 0) {
        this.syntax.colorStopList.unshift(items[0].trim().split(/\s+/));
      }
      return this;
    };
    this.toString = () => {
      const shape = this.syntax.shape !== void 0 ? this.syntax.shape + " " : "";
      const size = this.syntax.size !== void 0 && this.syntax.size !== null ? this.syntax.size + " " : "";
      const at = this.syntax.at !== void 0 && this.syntax.at.match(/at.+/) !== null ? this.syntax.at + " " : "";
      const colorStopList = [];
      for (const item of this.syntax.colorStopList) {
        colorStopList.push(item.join(" "));
      }
      const shapeOrSize = size !== "" ? size : shape;
      const shapeSizeAt = (shapeOrSize + at).trim().length > 0 ? shapeOrSize + at + ", " : shapeOrSize + at;
      const retStr = `${this.methodName}(${shapeSizeAt}${colorStopList.join(", ")})`;
      return retStr;
    };
  }
};
var isColor = (x) => x.match(/#.+|transparent/) !== null;
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  RepeatingConicGradientImpl,
  RepeatingLinearGradientImpl,
  RepeatingRadialGradientImpl,
  isColor
});
