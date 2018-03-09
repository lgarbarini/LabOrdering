function onOpen() {
  var ui = SpreadsheetApp.getUi();
  ui.createMenu("Make an Order Form")
      .addItem('Generate All Order Forms', 'orderAll')
      .addSeparator()
      .addSubMenu(ui.createMenu('Single Order')
          .addItem('McMaster', 'mcmasterOrder')
          .addItem('Sigma', 'sigmaOrder')
          .addItem('Amazon', 'amazonOrder')
          .addItem('Fisher', 'fisherOrder')
          .addItem('DigiKey', 'digikeyOrder')
          .addItem('Grainger', 'graingerOrder')
          .addItem('WB Mason', 'wbmasonOrder'))
      .addToUi();
}


function orderAll() {
  var timestamp = new Date();
  var folder = DriveApp.getFolderById('DUMMY_ID');
  subFolder = folder.createFolder("Orders: " + timestamp);
  mcmasterOrder(subFolder);
  sigmaOrder(subFolder);
  fisherOrder(subFolder);
  digikeyOrder(subFolder);
  amazonOrder(subFolder);
  graingerOrder(subFolder);
  wbmasonOrder(subFolder);
}

function mcmasterOrder(sF) {
  MakeOrder("DUMMY_ID", "McMaster", sF);
}

function sigmaOrder(sF) {
  MakeOrder("DUMMY_ID", "Sigma", sF);
}

function fisherOrder(sF) {
  MakeOrder("DUMMY_ID", "Fisher", sF);
}

function digikeyOrder(sF) {
  MakeOrder("DUMMY_ID", "DigiKey", sF);
}

function amazonOrder(sF) {
  MakeOrder("DUMMY_ID", "Amazon", sF);
}

function graingerOrder(sF) {
  MakeOrder("DUMMY_ID", "Grainger", sF);
}
function wbmasonOrder(sF) {
  MakeOrder("DUMMY_ID", "WB Mason", sF);
}

function MakeOrder(fileId, vendorName, subFolder) {
  var timestamp = new Date();
  var inputSpread = SpreadsheetApp.getActive();
  var inputSheet = inputSpread.getSheetByName(vendorName);
  var folder = DriveApp.getFolderById('DUMMY_ID');
  if (subFolder == undefined) {
    subFolder = folder.createFolder("Orders: " + timestamp);
  }
  var newDoc = DriveApp.getFileById(fileId).makeCopy(vendorName + ": " + timestamp + "_order", subFolder).getId();
  var tables = DocumentApp.openById(newDoc).getBody().getTables();
  tables[0].getCell(0, 0).setText(timestamp);
  var temp_t = tables[1];
    
  var height = inputSheet.getLastRow();
  var range = inputSheet.getRange(2,2, height - 1, 9);
  range.sort([{column: 8, ascending: true}, {column: 6, ascending: true}]);
  var values = range.getValues();
  var i = 0;
  var j = 0;
  for (i = 0; i < height-1; i++) {
    if (values[i][6] == "N") {
      t_row = temp_t.appendTableRow();
      for (j = 0; j < 5; j++) {
        Logger.log(values[i][j]);
        t_row.appendTableCell().setText(values[i][j]);
      }
      values[i][6] = "Y";
      values[i][8] = timestamp;
    }
      
  }
  range.setValues(values);
  range.sort([{column: 8, ascending: false}, {column: 7, ascending: false}]);
  SpreadsheetApp.getUi() // Or DocumentApp or FormApp.
  .alert('Orders are now in: \n DUMMY_URL');
  return "Success";
}