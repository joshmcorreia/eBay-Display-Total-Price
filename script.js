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

/**
 * @param {String} input_string
 * @returns {*}
 */
function get_dollar_amount_from_string(input_string) {
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
  // Taken from https://stackoverflow.com/a/2901298
  return input_string.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

/**
 * @returns {Number}
 */
function get_primary_price() {
  let primary_price = document.querySelector(".x-bin-price .x-price-primary")?.textContent;
  if (primary_price) {
    primary_price = get_dollar_amount_from_string(primary_price);
  }
  console.log(`ebay - primary_price: ${primary_price}`);
  return primary_price;
}

/**
 * @returns {Number}
 */
function get_approximate_primary_price() {
  let approximate_primary_price = document.querySelector(".x-price-approx__price")?.textContent;
  if (approximate_primary_price) {
    approximate_primary_price = get_dollar_amount_from_string(approximate_primary_price);
  }
  console.log(`ebay - approximate_primary_price: ${approximate_primary_price}`);
  return approximate_primary_price;
}

/**
 * @returns {Number}
 */
function get_shipping_price() {
  let shipping_price = document.querySelector(".d-shipping-minview .ux-labels-values__values .ux-textspans")?.textContent;
  if (shipping_price) {
    shipping_price = get_dollar_amount_from_string(shipping_price);
  }
  console.log(`ebay - shipping_price: ${shipping_price}`);
  return shipping_price
}

/**
 * @returns {Number}
 */
function get_shipping_price_approximate() {
  let shipping_price_approximate = document.querySelector(".d-shipping-minview .ux-labels-values__values .ux-textspans--SECONDARY")?.textContent;
  if (shipping_price_approximate) {
    shipping_price_approximate = get_dollar_amount_from_string(shipping_price_approximate);
  }
  console.log(`ebay - shipping_price_approximate: ${shipping_price_approximate}`);
  return shipping_price_approximate
}

/**
 * @returns {}
 */
function add_total_price_to_page() {
  var primary_price = get_primary_price()
  var approximate_primary_price = get_approximate_primary_price()
  var shipping_price = get_shipping_price()
  var shipping_price_approximate = get_shipping_price_approximate()


  if ((approximate_primary_price != null) && (shipping_price_approximate != null)) {
    var total_cost = approximate_primary_price + shipping_price_approximate;
    console.log(`ebay - Total cost: ${total_cost}`);
  }
  else {
    var total_cost = primary_price + shipping_price;
    console.log(`ebay - Total cost: ${total_cost}`);
  }

  total_cost = (Math.round(total_cost * 100) / 100).toFixed(2); // always show 2 decimals
  total_cost = add_comma_to_dollar_amount(total_cost);

  var total_price_div = document.createElement('div');
  total_price_div.style = "color:green";
  total_price_div.className = "x-price-primary";
  total_price_div.textContent = `US $${total_cost}`;
  try {
    document.querySelector(".x-bin-price__content").prepend(total_price_div);
  } catch(err) {
    document.querySelector(".x-price-section").prepend(total_price_div);
  }
}

add_total_price_to_page();

// TODO: Does not work with bids
// TODO: Also need to check with bids + buy it now on same listing
// TODO: Breaks on local pickup
