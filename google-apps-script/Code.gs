/**
 * Google Apps Script for Wedding RSVP Submissions
 * 
 * Instructions:
 * 1. Open your Google Sheet (e.g., named "Wedding RSVP Responses").
 * 2. Click "Extensions" > "Apps Script".
 * 3. Delete any default code in Code.gs and paste this entire file.
 * 4. Click "Deploy" > "New deployment".
 * 5. Select type: "Web app".
 * 6. Set Description: "Wedding RSVP Endpoint".
 * 7. Execute as: "Me" (your Google account).
 * 8. Who has access: "Anyone" (allows guests to submit without Google login).
 * 9. Click "Deploy", authorize permissions when prompted, and copy the Web App URL.
 * 10. Paste the Web App URL into RSVP.jsx (RSVP_ENDPOINT) or .env (VITE_RSVP_ENDPOINT).
 */

const SHEET_NAME = 'Wedding RSVP Responses';

/**
 * Handle GET requests (for testing and health check in browser)
 */
function doGet(e) {
  return ContentService.createTextOutput(
    JSON.stringify({
      status: 'active',
      message: 'Wedding RSVP Web App endpoint is active and ready to receive submissions.',
      timestamp: Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'dd/MM/yyyy HH:mm:ss')
    })
  ).setMimeType(ContentService.MimeType.JSON);
}

/**
 * Handle POST requests from the Wedding RSVP form
 */
function doPost(e) {
  // Use LockService to prevent race conditions during concurrent submissions
  const lock = LockService.getScriptLock();
  const hasLock = lock.tryLock(10000);

  if (!hasLock) {
    return ContentService.createTextOutput(
      JSON.stringify({
        success: false,
        message: 'Server is busy processing another RSVP. Please try again in a few moments.'
      })
    ).setMimeType(ContentService.MimeType.JSON);
  }

  try {
    // 1. Parse incoming data (supports JSON text/plain payload or URL-encoded form data)
    let data = {};
    if (e && e.postData && e.postData.contents) {
      try {
        data = JSON.parse(e.postData.contents);
      } catch (parseError) {
        data = e.parameter || {};
      }
    } else if (e && e.parameter) {
      data = e.parameter;
    }

    // 2. Extract and sanitize fields
    const fullName = String(data.fullName || '').trim();
    const mobileNumber = String(data.mobileNumber || '').trim();
    const attendance = String(data.attendance || 'Joyfully Accept').trim();
    let guestCount = Number(data.guestCount);
    let events = String(data.events || 'All Events').trim();
    const wishes = String(data.wishes || data.wishesMessage || '').trim();
    const source = String(data.source || 'Wedding Website').trim();

    // 3. Validate required fields
    if (!fullName || fullName.length < 2) {
      return ContentService.createTextOutput(
        JSON.stringify({
          success: false,
          message: 'Full Name is required and must be at least 2 characters.'
        })
      ).setMimeType(ContentService.MimeType.JSON);
    }

    if (!mobileNumber || mobileNumber.length < 8) {
      return ContentService.createTextOutput(
        JSON.stringify({
          success: false,
          message: 'A valid Mobile Number is required.'
        })
      ).setMimeType(ContentService.MimeType.JSON);
    }

    // Attendance normalization
    if (attendance === 'Regretfully Decline') {
      guestCount = 0;
      events = 'Not Attending';
    } else {
      if (isNaN(guestCount) || guestCount < 1) {
        guestCount = 1;
      }
    }

    // 4. Open Google Sheet
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = ss.getSheetByName(SHEET_NAME);
    
    // If the named sheet doesn't exist, use the active sheet or create it
    if (!sheet) {
      sheet = ss.getActiveSheet();
      if (sheet.getName() === 'Sheet1') {
        sheet.setName(SHEET_NAME);
      }
    }

    // 5. Ensure headers exist on row 1
    const headers = [
      'Timestamp',
      'Full Name',
      'Mobile Number',
      'Attendance',
      'Number of Guests',
      'Events',
      'Wishes',
      'Source'
    ];

    if (sheet.getLastRow() === 0) {
      sheet.appendRow(headers);
      const headerRange = sheet.getRange(1, 1, 1, headers.length);
      headerRange.setFontWeight('bold');
      headerRange.setBackground('#4d0a16');
      headerRange.setFontColor('#ffffff');
      headerRange.setHorizontalAlignment('center');
      sheet.setFrozenRows(1);
    }

    // 6. Generate server-side formatted timestamp (IST / Script Timezone)
    const timeZone = Session.getScriptTimeZone() || 'Asia/Kolkata';
    const formattedTimestamp = Utilities.formatDate(
      new Date(),
      timeZone,
      'dd/MM/yyyy HH:mm'
    );

    // 7. Append RSVP row to Google Sheet
    // Use apostrophe prefix on mobileNumber to force Google Sheets to treat it as text (preventing leading zero loss)
    const storedMobile = mobileNumber.startsWith('+') ? mobileNumber : `'${mobileNumber}`;

    const newRow = [
      formattedTimestamp,
      fullName,
      storedMobile,
      attendance,
      guestCount,
      events,
      wishes,
      source
    ];

    sheet.appendRow(newRow);

    // Auto-fit column widths for neat luxury spreadsheet presentation
    for (let c = 1; c <= headers.length; c++) {
      sheet.autoResizeColumn(c);
    }

    // 8. Return JSON success response
    return ContentService.createTextOutput(
      JSON.stringify({
        success: true,
        message: 'RSVP submitted successfully',
        timestamp: formattedTimestamp,
        guest: fullName
      })
    ).setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    Logger.log('Error in doPost: ' + error.toString());
    return ContentService.createTextOutput(
      JSON.stringify({
        success: false,
        message: 'Unable to submit RSVP: ' + error.message
      })
    ).setMimeType(ContentService.MimeType.JSON);

  } finally {
    lock.releaseLock();
  }
}
