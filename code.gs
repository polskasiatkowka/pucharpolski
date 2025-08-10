function doGet(e) {
  const action = e.parameter.action;
  if (action === "getData") {
    return getData();
  }
  return ContentService.createTextOutput("Brak akcji");
}

function doPost(e) {
  const action = e.parameter.action;
  if (action === "addMatch") {
    return addMatch(e);
  }
  return ContentService.createTextOutput("Brak akcji");
}

function getData() {
  const SHEET_ID = PropertiesService.getScriptProperties().getProperty('SHEET_ID');
  const ss = SpreadsheetApp.openById(SHEET_ID);

  const tM = ss.getSheetByName("Tabela_Mlodzik").getDataRange().getValues();
  const tK = ss.getSheetByName("Tabela_Mlodziczka").getDataRange().getValues();
  const term = ss.getSheetByName("Terminarz").getDataRange().getValues();

  const out = {
    tabela_mlodzik: tM.slice(1),
    tabela_mlodziczka: tK.slice(1),
    terminarz: term.slice(1)
  };

  return ContentService.createTextOutput(JSON.stringify(out)).setMimeType(ContentService.MimeType.JSON);
}

function addMatch(e) {
  const SHEET_ID = PropertiesService.getScriptProperties().getProperty('SHEET_ID');
  const DRIVE_FOLDER_ID = PropertiesService.getScriptProperties().getProperty('DRIVE_FOLDER_ID');

  const ss = SpreadsheetApp.openById(SHEET_ID);
  const sheet = ss.getSheetByName("Terminarz");

  let data = e.parameter.data;
  let gospodarz = e.parameter.gospodarz;
  let gosc = e.parameter.gosc;
  let wynik = e.parameter.wynik;

  let protokolUrl = "";
  if (e.parameters.plik && e.parameters.plik.length > 0) {
    let blob = Utilities.newBlob(Utilities.base64Decode(e.parameters.plik), "image/jpeg", "protokol.jpg");
    let folder = DriveApp.getFolderById(DRIVE_FOLDER_ID);
    let file = folder.createFile(blob);
    protokolUrl = file.getUrl();
  }

  sheet.appendRow([data, gospodarz, gosc, wynik, protokolUrl]);

  return ContentService.createTextOutput("Mecz zapisany!");
}
