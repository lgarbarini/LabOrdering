/* The script is deployed as a web app and renders the form */
function doGet(e) {
  if (e.queryString != null) {
    Logger.log(e.queryString);
    if (e.parameter.query != undefined) var result = SearchSheet(e.parameter);
    else if (e.parameter.sku != undefined) var result = FillSheet(e.parameter);
    return ContentService.createTextOutput(result).setMimeType(ContentService.MimeType.JSON);
  } else {
    return ContentService.createTextOutput("ERROR: Input search string").setMimeType(ContentService.MimeType.JSON);
  }
}

function test() {
  var a = { };
  a.query = "acetone";
  Logger.log(SearchSheet(a));
}

sheets = ['Fisher', 'Grainger','McMaster','Amazon','DigiKey','Sigma'];

//returns json object of first 15 items matching the search keywords
function SearchSheet(searchString) {
  var i, j, k;
  var inputSpread = SpreadsheetApp.openByUrl('DUMMY_URL');
  search = searchString.query.split(",");
  var results = [];
  var sheet_name_i;
  //loop over the different product sheets
  for (sheet_name_i = 0; sheet_name_i < sheets.length; sheet_name_i++) {
    var inputSheet = inputSpread.getSheetByName(sheets[sheet_name_i]);
    
    var height = inputSheet.getLastRow();
    //get all rows except the header row
    var range = inputSheet.getRange(2,1, height - 1, 8);
    var values = range.getValues();
    
    for (i = 0; i < height - 1; i++) {
      for (j = 2; j < 4; j++) {
        var res = 1;
        //make sure all search keywords are present
        for (k = 0; k < search.length; k++) {
          //Logger.log(values[i][j]);
          if ((values[i][j].toString()).match(search[k],"i") && res == 1) res = 1;
          else res = 0;
        }
        if (res == 1 && results.length < 15) {
          var dup = 0;
          var r = {
            vend: values[i][0],
            quant: values[i][1],
            sku: values[i][2],
            desc: values[i][3],
            price: values[i][4],
            user: values[i][5],
            timestamp: values[i][6],
            ordered: values[i][7],
          };
          //check for duplicate entry and replace with more recent
          for (k = 0; k < results.length; k++) {
            if (r.sku == results[k].sku) {
              results[k] = r;
              dup = 1;
            }
          }
          //only add if not a duplicate
          if (dup == 0){
            results.push(r);
          }
        }
      }
    }
  }
  //make the json a little more extensible
  var json_o = {results: results};
  return JSON.stringify(json_o);
}


function FillSheet(form) {
  
  try {
    var timestamp = new Date();
    var outputSpread = SpreadsheetApp.openByUrl('DUMMY_URL');
    if (form.vend == "amazon") {
      var outputSheet = outputSpread.getSheetByName("Amazon");
    } else if (form.vend == "mcmaster") {
      var outputSheet = outputSpread.getSheetByName("McMaster");
    } else if (form.vend == "sigma") {
      var outputSheet = outputSpread.getSheetByName("Sigma");
    } else if (form.vend == "fisher") {
      var outputSheet = outputSpread.getSheetByName("Fisher");
    } else if (form.vend == "digikey") {
      var outputSheet = outputSpread.getSheetByName("Digikey");
    } else if (form.vend == "grainger") {
      var outputSheet = outputSpread.getSheetByName("Grainger");
    } else if (form.vend == "wbmason") {
      var outputSheet = outputSpread.getSheetByName("WB Mason");
    } else {
      var outputSheet = outputSpread.getSheetByName("other");
    }
    
    var row = [form.vend, form.quant, form.sku, form.desc, form.price, form.user, timestamp, "N", "Slack: "+form.hcname];
    /*prepend instead of append*/
    outputSheet.insertRowAfter(1);
    var range = outputSheet.getRange("A2:I2");
    range.setValues([row]);
    //range.copyFormatToRange(outputSheet,1,9,2,2);
    range.setFontWeight("normal");
   
    var r = { 
      result: "Added " + form.quant + " of:\n" + form.desc + 
      "\"\n to the Lab Order Site for: " + form.user + 
      "\n at: " + timestamp
    };
      
    return JSON.stringify(r);
     
  } catch (error) {
    
    /* If there's an error, show the error message */
    return error.toString();
  }
  
}