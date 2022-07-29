"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isBetween = void 0;
function isBetween(number_, minimum, maximum, inclusive = "both") {
    let criteria = [];
    if (["minimum", "both"].includes(inclusive))
        criteria.push(number_ >= minimum);
    else
        criteria.push(number_ > minimum);
    if (["maximum", "both"].includes(inclusive))
        criteria.push(number_ <= maximum);
    else
        criteria.push(number_ < maximum);
    return criteria.every(value => value);
}
exports.isBetween = isBetween;
