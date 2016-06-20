/* The script is deployed as a web app and renders the form */
function doGet(e) {
  if (e.queryString != null) {
    Logger.log(e.queryString);
    var result = FillSheet(e.parameter);
    return ContentService.createTextOutput(result).setMimeType(ContentService.MimeType.JSON);
  } else {
    return ContentService.createTextOutput("ERROR: No parameters given").setMimeType(ContentService.MimeType.JSON);
  }
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
    }

    var row = [form.vend, form.quant, form.sku, form.desc, form.price, form.user, timestamp, "N", Session.getActiveUser().getEmail()];
    outputSheet.appendRow(row);

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
