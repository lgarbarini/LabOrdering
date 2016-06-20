// Regex-pattern to check URLs against.
// It matches URLs like: http[s]://[...]stackoverflow.com[...]
var sigmaURLs = /^http?:\/\/(?:[^./?#]+\.)?sigmaaldrich\.com/;
var amazonURLs = /^https?:\/\/(?:[^./?#]+\.)?amazon\.com/;
var mcmasterURLs = /^http?:\/\/(?:[^./?#]+\.)?mcmaster\.com/;
var fisherURLs = /^https?:\/\/(?:[^./?#]+\.)?fishersci\.com/;
var digikeyURLs = /^http?:\/\/(?:[^./?#]+\.)?digikey\.com/;

// A function to use as callback
function doStuffWithDom(response) {
  console.log(response);
  var form = document.getElementById('form');
  $("#title")
    .replaceWith('<h2 id="title">'+ response[0].desc);
  var s = $('#skus');
  var p = $('#prices');
  for (var i = 0; i < response.length; i++) {
    var sku_i = document.createElement("option");
    var price_i = document.createElement("option");
    sku_i.innerHTML = response[i].sku;
    sku_i.value = response[i].sku;
    s.append(sku_i);

    price_i.innerHTML = response[i].price;
    price_i.value = response[i].price;
    p.append(price_i);

    $('#vendor').val(response[0].vendor);
  }
  $("#skus").change(function() {
    var current = $("#skus").val();
    for (var i = 0; i < response.length; i++) {
      if (response[i].sku == current) {
        $('#prices').val(response[i].price);
      }
    }
  });
}

function sendForm() {
  var url = "DUMMY_URL?";
  var parameters = []
  parameters.push("sku=" + encodeURIComponent(document.getElementById("skus").value));
  parameters.push("quant=" + encodeURIComponent(document.getElementById("qty").value));
  parameters.push("price=" + encodeURIComponent(document.getElementById("prices").value));
  parameters.push("vend=" + encodeURIComponent(document.getElementById("vendor").value));
  parameters.push("user=" + encodeURIComponent(document.getElementById("user").value));
  try {
    parameters.push("desc=" + encodeURIComponent(document.getElementById("title").innerHTML
    .replace(/<br\s*[\/]?>/gi, '\n')));
  } catch(err) {
    parameters.push("desc=" + encodeURIComponent(document.getElementById("title").value
    .replace(/<br\s*[\/]?>/gi, '\n')));
  }
  parameters.sort();
  var paramString = parameters.join('&');

  httpGetAsync(url+paramString, success);

}

function httpGetAsync(theUrl, callback) {
  var xmlHttp = new XMLHttpRequest();
  xmlHttp.onreadystatechange = function() {

  if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
      callback(xmlHttp.responseText, theUrl);
  }
  xmlHttp.open("GET", theUrl, true); // true for asynchronous
  xmlHttp.send(null);
}

function success(response, url){
  document.getElementById('form').style.display = 'none';
  document.getElementById('output').style.display = 'block';
  try
  {
    document.getElementById('output').innerHTML = $.parseJSON(response).result;
  }
  catch(err)
  {
    chrome.windows.create({'url': url, 'type': 'popup'}, function(window) {});
  }
}

// When the browser-action button is clicked...
chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
  // ...check the URL of the active tab against our pattern and...
  if (sigmaURLs.test(tabs[0].url)) {
    // ...if it matches, send a message specifying a callback too
    chrome.tabs.sendMessage(tabs[0].id, {text: 'sigma_sku'}, doStuffWithDom);
  }
  else if (amazonURLs.test(tabs[0].url)) {
    chrome.tabs.sendMessage(tabs[0].id, {text: 'amazon_sku'}, doStuffWithDom);
  }
  else if (mcmasterURLs.test(tabs[0].url)) {
    chrome.tabs.sendMessage(tabs[0].id, {text: 'mcmaster_sku'}, doStuffWithDom);
  }
  else if (fisherURLs.test(tabs[0].url)) {
    chrome.tabs.sendMessage(tabs[0].id, {text: 'fisher_sku'}, doStuffWithDom);
  }
  else if (digikeyURLs.test(tabs[0].url)) {
    chrome.tabs.sendMessage(tabs[0].id, {text: 'digikey_sku'}, doStuffWithDom);
  }
});
