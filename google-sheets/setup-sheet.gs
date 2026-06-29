/**
 * One-click builder for the "IG Discovery Dashboard" Google Sheet.
 *
 * HOW TO USE
 * 1. Open https://sheets.google.com and create a blank spreadsheet.
 * 2. Extensions -> Apps Script.
 * 3. Delete whatever is there, paste this whole file, Save.
 * 4. Select the function `setupIgDiscoveryDashboard` in the toolbar and click Run.
 *    (Authorize it the first time.)
 * 5. Come back to the sheet: it is renamed and has the 4 tabs with headers.
 *
 * After running, copy the spreadsheet ID from the URL
 * (the long string between /d/ and /edit) - you'll paste it into the
 * two Google Sheets nodes in n8n.
 */
function setupIgDiscoveryDashboard() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  ss.rename('IG Discovery Dashboard');

  var tabs = {
    'References': ['Handle', 'Region', 'Niche Tag', 'Notes'],
    'Daily Pulls': ['Date', 'SourceHandle', 'VideoURL', 'Likes', 'Comments', 'PostedAt', 'EngagementScore'],
    'Trend Signals': ['Date', 'Trend/Sound/Hashtag', 'Region', 'Source', 'Notes'],
    'Posted Log': ['DatePosted', 'VideoSource', 'CaptionUsed', 'HashtagsUsed', 'Views24h', 'Views7d']
  };

  Object.keys(tabs).forEach(function (name) {
    var sheet = ss.getSheetByName(name) || ss.insertSheet(name);
    var headers = tabs[name];
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]).setFontWeight('bold');
    sheet.setFrozenRows(1);
  });

  // Seed a couple of example reference rows so a first test run has input.
  var ref = ss.getSheetByName('References');
  if (ref.getLastRow() < 2) {
    ref.getRange(2, 1, 2, 4).setValues([
      ['gamersites', 'US', 'gaming', 'example - replace with your reference account'],
      ['ukgaming', 'UK', 'gaming', 'example - replace with your reference account']
    ]);
  }

  // Remove the default empty "Sheet1" if it is still around and untouched.
  var def = ss.getSheetByName('Sheet1');
  if (def && tabs[def.getName()] === undefined) {
    ss.deleteSheet(def);
  }

  SpreadsheetApp.getUi().alert('IG Discovery Dashboard is ready. Copy the spreadsheet ID from the URL for n8n.');
}
