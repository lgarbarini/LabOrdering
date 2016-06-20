// Listen for messages
chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
    // If the received message has the expected format...
    if (msg.text === 'sigma_sku') {
        // Call the specified callback, passing
        // the web-page's DOM content as argument
      sendResponse(sigmaSku());
    } else if (msg.text === 'mcmaster_sku') {
      sendResponse(mcmasterSku());
    } else if (msg.text === 'amazon_sku') {
      sendResponse(amazonSku());
    } else if (msg.text === 'fisher_sku') {
      sendResponse(fisherSku());
    } else if (msg.text === 'digikey_sku') {
      sendResponse(digikeySku());
    }
});


function sigmaSku()
{
  var rows = {};
  rows.skus = document.querySelectorAll('input.sku');
  rows.prices = document.querySelectorAll('td.price');
  rows.desc = document.querySelectorAll('h1[itemprop="name"]')[0].innerText;
  var products = [];
  for (var i = 0; i < rows.skus.length; i++) {
        var p = {sku: rows.skus[i].value,
          price: rows.prices[i].getElementsByTagName('p')[0].innerHTML,
          desc: rows.desc,
          vendor: "sigma"}
        products.push(p);
  }
  console.log(products);
  return products;
}

function mcmasterSku()
{
  var rows = {};
  rows.skus = document.querySelectorAll('div.PartNbr');
  rows.prices = document.querySelectorAll('div.PrceTxt');
  rows.desc = document.querySelectorAll('h3.PrsnttnNm')[0].innerText + "<br>";
  try {
    rows.desc += document.querySelectorAll('h3.PrsnttnSecondaryNm')[0].innerText;
  } catch(err) {
    console.log("No Secondary Desc")
  }
  var products = [];
  var p = {sku: rows.skus[0].innerHTML,
  price: rows.prices[0].innerHTML.replace(/(\$| Each)/gm,""),
  desc: rows.desc,
  vendor: "mcmaster"}
  products.push(p);
  console.log(products);
  return products;
}

function amazonSku()
{
  var rows = {}
  rows.skus = $('th.prodDetSectionEntry:contains("ASIN")').next().text().replace(/(\r\n|\n|\r)/gm,"").replace(/ +(?= )/g,'');
  if (rows.skus == '') {
    rows.skus = window.location.href.match("/([A-Z0-9]{10})")[0].replace(/\//,"");
  }
  rows.prices = $('span#priceblock_ourprice').text().replace(/(\r\n|\n|\r|\$)/gm,"");
  if (rows.prices == '') {
    rows.prices = $('span#priceblock_saleprice').text().replace(/(\r\n|\n|\r|\$)/gm,"");
  }
  rows.desc = $('span#productTitle').text().replace(/(\r\n|\n|\r)/gm,"").replace(/ +(?= )/g,'');
  var products = [];
  var p = { sku: rows.skus,
  price: rows.prices,
  desc: rows.desc,
  vendor: "amazon"}
  products.push(p);
  console.log(products);
  return products;
}

function fisherSku()
{
  var rows = {};
  var prodStr = document.getElementById('gsProductId').value;
  rows.sku = prodStr.substr(prodStr.indexOf(":") + 1);
  rows.prices = document.querySelectorAll('label.price');
  rows.desc = document.getElementById('item_header_text').innerText.replace(/[^\x00-\x7F]/g, " ");
  var products = [];
  for (var i = 0; i < rows.prices.length; i++) {
        var p = {sku: rows.sku,
          price: rows.prices[i].innerText,
          desc: rows.desc,
          vendor: "fisher"}
        products.push(p);
  }
  console.log(products);
  return products;
}

function digikeySku()
{
  var rows = {};
  rows.sku = document.getElementById('reportPartNumber').innerText;
  rows.prices = document.getElementById('schema-offer').innerText;
  rows.desc = document.querySelectorAll('td[itemprop="description"]')[0].innerText;
  var products = [];

  var p = {sku: rows.sku,
    price: rows.prices,
    desc: rows.desc,
    vendor: "digikey"}
  products.push(p);
  console.log(products);
  return products;
}
