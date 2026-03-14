import { Lead } from '../types';

// ============================================================================
// CONFIGURATION
// ============================================================================

// 1. Deploy the Google Apps Script code (found at the bottom of this file)
// 2. Paste the resulting Web App URL inside the quotes below:
const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwAbcTVUr2i9V3Ld5vLE7_d-w9HYoHKqM0H5ik-UkCLrYa8-bl8m8iKTTv7u-ThyfREEw/exec'; 


// ============================================================================
// FRONTEND SERVICE CODE (Do not paste this into Google Apps Script)
// ============================================================================

export const saveLeadToSheet = async (lead: Lead): Promise<boolean> => {
  // If no URL is configured, we can't save to sheet, but we won't block the UI
  if (!SCRIPT_URL) {
    console.warn("Google Sheet Script URL not configured. Lead will only be saved locally in the browser session.");
    return false;
  }

  try {
    const formData = new FormData();
    // Fields must match the parameter names in the Apps Script
    formData.append('id', lead.id);
    formData.append('timestamp', new Date().toISOString());
    formData.append('name', lead.name);
    formData.append('dialingCode', lead.dialingCode || '');
    formData.append('mobile', lead.mobile || '');
    formData.append('email', lead.email);
    formData.append('metalGroup', lead.metalGroup || '');
    formData.append('productCategory', lead.productCategory || '');
    formData.append('budget', lead.budget || '');
    formData.append('weight', lead.weight || '');
    formData.append('description', lead.description || '');
    formData.append('source', lead.source);
    formData.append('leadGeneration', lead.leadGeneration || '');
    formData.append('status', lead.status);

    // mode: 'no-cors' is required when calling Google Apps Script Web App from client-side
    // This means we won't get a readable response, but the request will go through.
    await fetch(SCRIPT_URL, {
      method: 'POST',
      body: formData,
      mode: 'no-cors'
    });

    console.log("Lead sent to Google Sheet");
    return true;
  } catch (error) {
    console.error("Error saving to sheet:", error);
    return false;
  }
};


// ============================================================================
// BACKEND GOOGLE APPS SCRIPT CODE 
// Copy ONLY the code below into your Google Sheet's Script Editor (Extensions > Apps Script)
// ============================================================================

/*
function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.tryLock(10000);

  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Lead DB");
    if (!sheet) {
        // Fallback if sheet doesn't exist
        sheet = SpreadsheetApp.getActiveSpreadsheet().insertSheet("Lead DB");
        // Add headers if new
        sheet.appendRow(["ID", "Timestamp", "Name", "Code", "Mobile", "Email", "Metal Group", "Category", "Budget", "Weight", "Description", "Source", "Lead Gen", "Status"]);
    }

    var p = e.parameter;
    
    // Append row matching the formData order
    sheet.appendRow([
      p.id,
      new Date(),
      p.name,
      p.dialingCode,
      p.mobile,
      p.email,
      p.metalGroup,
      p.productCategory,
      p.budget,
      p.weight,
      p.description,
      p.source,
      p.leadGeneration,
      p.status
    ]);

    return ContentService.createTextOutput("Success").setMimeType(ContentService.MimeType.TEXT);
  } catch (e) {
    return ContentService.createTextOutput("Error").setMimeType(ContentService.MimeType.TEXT);
  } finally {
    lock.releaseLock();
  }
}
*/