import { User } from '../types';

/**
 * Fetches user credentials from a published Google Sheet CSV.
 * Expected columns in the sheet (order doesn't matter as long as headers exist):
 * email, password, name, role
 */
export const authenticateUser = async (email: string, pass: string, sheetIdOrUrl: string): Promise<User | null> => {
  if (!sheetIdOrUrl) {
    throw new Error("Please provide a Google Sheet ID or URL");
  }

  // Construct the CSV export URL
  let fetchUrl = sheetIdOrUrl;
  
  // If it's just an ID (no http), assume it's the ID
  if (!sheetIdOrUrl.includes('http')) {
      fetchUrl = `https://docs.google.com/spreadsheets/d/${sheetIdOrUrl}/export?format=csv`;
  } 
  // If it's a full edit URL, convert it
  else if (sheetIdOrUrl.includes('/edit')) {
      fetchUrl = sheetIdOrUrl.replace(/\/edit.*$/, '/export?format=csv');
  }
  // If it is a direct link, ensure we are asking for CSV
  else {
      const hasOutputCsv = fetchUrl.includes('output=csv');
      const hasFormatCsv = fetchUrl.includes('format=csv');
      
      if (!hasOutputCsv && !hasFormatCsv) {
          fetchUrl += (fetchUrl.includes('?') ? '&' : '?') + 'format=csv';
      }
  }

  try {
    const response = await fetch(fetchUrl);
    
    if (!response.ok) {
        throw new Error("Failed to fetch Google Sheet. Ensure it is 'Published to the Web'.");
    }
    
    const text = await response.text();
    
    // Parse CSV (Simple parser, assumes no commas inside fields for this demo)
    const rows = text.split('\n').map(row => row.split(',').map(c => c.trim()));
    
    if (rows.length < 2) throw new Error("Sheet is empty or invalid format");

    // Normalize headers to find columns
    const headers = rows[0].map(h => h.toLowerCase());
    const emailIdx = headers.findIndex(h => h.includes('email'));
    const passIdx = headers.findIndex(h => h.includes('password'));
    const nameIdx = headers.findIndex(h => h.includes('name'));
    const roleIdx = headers.findIndex(h => h.includes('role'));

    if (emailIdx === -1 || passIdx === -1) {
        throw new Error("Sheet is missing 'email' or 'password' columns");
    }

    // Find user
    const userRow = rows.slice(1).find(row => {
        // Simple case insensitive email match, exact password match
        return row[emailIdx]?.toLowerCase() === email.toLowerCase() && row[passIdx] === pass;
    });

    if (userRow) {
        return {
            email: userRow[emailIdx],
            name: userRow[nameIdx] || userRow[emailIdx].split('@')[0],
            role: userRow[roleIdx] || 'User',
            avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(userRow[nameIdx] || 'User')}&background=0D8ABC&color=fff`
        };
    }

    return null;
  } catch (error) {
    console.error("Auth Error:", error);
    throw error;
  }
};