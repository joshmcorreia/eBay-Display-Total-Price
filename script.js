// ==UserScript==
// @name         eBay Display Total Price
// @description  Easily see the total price of your order including shipping.
// @author       joshmcorreia
// @match        https://www.ebay.com/itm/*
// @run-at       document-end
// @grant        none
// @license      MIT
// @version      0.0.1
// @namespace    https://greasyfork.org/users/1220845
// @noframes
// ==/UserScript==

// NOTE: Does not support "Local pickup only" by design. If you want to pick items up locally you probably shouldn't be using eBay.

/**
 * @param {String} input_string
 * @returns {*}
 */
function get_dollar_amount_from_string(input_string) {
  if (input_string == "Free") {
    return 0;
  }
  // console.log(`before comma removed: ${input_string}`);
  input_string = input_string.replace(/,/g, ''); // remove the commas from large numbers
  // console.log(`after comma removed: ${input_string}`);
  const number_regex = /[+-]?\d+(\.\d+)?/;
  try {
    let regex_match = input_string.match(number_regex).map(function(v) { return parseFloat(v); });
    if (regex_match != null) {
      return regex_match[0];
    }
    return null;
  } catch (err) {
    return null;
  }
}

/**
 * @param {String} input_string
 * @returns {String}
 */
function add_comma_to_dollar_amount(input_string) {
  if (input_string === undefined) {
    return undefined;
  }
  // Taken from https://stackoverflow.com/a/2901298
  return input_string.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

/**
 * @returns {Number}
 */
function get_primary_BIN_price() {
  let primary_BIN_price = document.querySelector(".x-bin-price .x-price-primary")?.textContent;
  console.log(`ebay - primary_BIN_price: ${primary_BIN_price}`);
  let approximate_primary_BIN_price = document.querySelector(".x-price-approx__price")?.textContent;
  console.log(`ebay - approximate_primary_BIN_price: ${approximate_primary_BIN_price}`);
  let BIN_price = approximate_primary_BIN_price || primary_BIN_price;
  console.log(`ebay - BIN_price: ${BIN_price}`);
  if (BIN_price) {
    BIN_price = get_dollar_amount_from_string(BIN_price);
    console.log(`ebay - BIN_price: ${BIN_price}`);
  }
  return BIN_price;
}

/**
 * @returns {Number}
 */
function get_primary_bid_price() {
  let primary_bid_price = document.querySelector(".x-bid-price .x-price-primary")?.textContent;
  if (primary_bid_price) {
    primary_bid_price = get_dollar_amount_from_string(primary_bid_price);
  }
  console.log(`ebay - primary_bid_price: ${primary_bid_price}`);
  return primary_bid_price;
}

/**
 * @returns {Number}
 */
function get_shipping_price() {
  let primary_shipping_price = document.querySelector(".d-shipping-minview .ux-labels-values--shipping .ux-labels-values__values .ux-textspans")?.textContent;
  console.log(`ebay - get_shipping_price() - primary_shipping_price: ${primary_shipping_price}`);
  let primary_shipping_price_approximate = document.querySelector(".d-shipping-minview .ux-labels-values--shipping .ux-labels-values__values .ux-textspans--SECONDARY.ux-textspans--BOLD")?.textContent;
  console.log(`ebay - get_shipping_price() - primary_shipping_price_approximate: ${primary_shipping_price_approximate}`);
  let shipping_price = primary_shipping_price_approximate || primary_shipping_price;
  console.log(`ebay - get_shipping_price() - shipping_price: ${shipping_price}`);
  shipping_price = get_dollar_amount_from_string(shipping_price);
  console.log(`ebay - get_shipping_price() - shipping_price: ${shipping_price}`);
  return shipping_price;
}

/**
 * @param {Number} item_price
 * @param {Number} shipping_price
 * @returns {String}
 */
function get_total_price(item_price, shipping_price) {
  if (item_price === undefined) {
    return undefined;
  }
  console.log(`ebay - get_total_price() - item_price: ${item_price}`);
  console.log(`ebay - get_total_price() - shipping_price: ${shipping_price}`);
  let total_price = item_price + shipping_price;
  total_price = (Math.round(total_price * 100) / 100).toFixed(2); // always show 2 decimals
  console.log(`ebay - get_total_price() - total_price: ${total_price}`);
  total_price = add_comma_to_dollar_amount(total_price);
  console.log(`ebay - get_total_price() - total_price: ${total_price}`);
  return total_price;
}

/**
 * @param {String} total_bid_price
 * @return {}
 */
function add_total_bid_price_to_page(total_bid_price) {
  console.log("ebay - Adding bid price");
  let total_bid_price_div = document.createElement('div');
  total_bid_price_div.style = "color:green";
  total_bid_price_div.className = "x-price-primary";
  total_bid_price_div.textContent = `US $${total_bid_price}`;
  document.querySelector(".x-price-section").prepend(total_bid_price_div);
  return;
}

/**
 * @param {String} total_BIN_price
 * @return {}
 */
function add_total_BIN_price_to_page(total_BIN_price) {
  console.log("ebay - Adding BIN price");
  let total_BIN_price_div = document.createElement('div');
  total_BIN_price_div.style = "color:green";
  total_BIN_price_div.className = "x-price-primary";
  total_BIN_price_div.textContent = `US $${total_BIN_price}`;
  document.querySelector(".x-bin-price__content").prepend(total_BIN_price_div);
  return;
}

/**
 * @returns {}
 */
function add_total_price_to_page() {
  let primary_BIN_price = get_primary_BIN_price()
  let primary_bid_price = get_primary_bid_price()
  let shipping_price = get_shipping_price()

  let total_BIN_price = get_total_price(primary_BIN_price, shipping_price);
  console.log(`ebay - total_BIN_price: ${total_BIN_price}`);
  let total_bid_price = get_total_price(primary_bid_price, shipping_price);
  console.log(`ebay - total_bid_price: ${total_bid_price}`);

  if (total_BIN_price !== undefined) {
    add_total_BIN_price_to_page(total_BIN_price)
  }
  if (total_bid_price !== undefined) {
    add_total_bid_price_to_page(total_bid_price)
  }
}

add_total_price_to_page();
