import Papa from 'papaparse';
import { MenuItem } from '../types';
import { MENU_CATEGORIES } from '../data';

export const SHEET_ID = '1jNB1eYPCi7lYC3nhydSV5gzy3fFoWDCCvuc5Oos9WxQ';

const getCategoryLabel = (id: string) => {
  const cat = MENU_CATEGORIES.find(c => c.id === id);
  return cat ? cat.label : id;
};

const getCategoryId = (label: string) => {
  const cleanLabel = label.trim();
  const cat = MENU_CATEGORIES.find(c => c.label === cleanLabel || c.id === cleanLabel);
  return cat ? cat.id : cleanLabel;
};

export const getMenuItems = async (): Promise<MenuItem[]> => {
  const res = await fetch(`https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv`);
  if (!res.ok) throw new Error('Failed to fetch from Google Sheets');
  const csvText = await res.text();
  
  return new Promise((resolve, reject) => {
    Papa.parse(csvText, {
      header: false,
      skipEmptyLines: true,
      complete: (results) => {
        const rows = results.data as string[][];
        // skip row 0 (headers)
        const items = rows.slice(1)
          .map((row, index) => {
            return {
              id: index + 2, // The actual row number in the spreadsheet (1-based, +1 for header)
              categoryId: getCategoryId(row[0] || ''),
              title: row[1] || '',
              description: row[2] || '',
              price: Number(row[3]) || 0,
              image: row[4] || '',
              isHidden: String(row[5] || '').trim().toUpperCase() === 'TRUE'
            };
          })
          .filter(item => item.title && item.categoryId); // Only valid items
        resolve(items);
      },
      error: (error: any) => reject(error)
    });
  });
};

export const getAppsScriptUrl = (): string => {
  return 'https://script.google.com/macros/s/AKfycbwzxUoGnVynxAJgqKIqh1dWzLfQeUapDcJfT_-BdmQT4sHy2H-R8PWHhfzBdV41j2tM/exec';
};

export const createMenuItem = async (accessToken: string | null, item: Omit<MenuItem, 'id'>): Promise<number> => {
  const scriptUrl = getAppsScriptUrl();
  if (!scriptUrl) {
    throw new Error('אנא הגדר תחילה את כתובת ה-Apps Script Web App בהגדרות החיבור');
  }

  const rowObj = [
    getCategoryLabel(item.categoryId),
    item.title,
    item.description,
    item.price.toString(),
    item.image || '',
    item.isHidden ? 'TRUE' : 'FALSE'
  ];
  
  const res = await fetch(scriptUrl, {
    method: 'POST',
    mode: 'cors',
    headers: {
      'Content-Type': 'text/plain;charset=utf-8' // Crucial: prevents CORS preflight OPTIONS request
    },
    body: JSON.stringify({
      action: 'create',
      item: rowObj
    })
  });
  
  if (!res.ok) {
    throw new Error('שגיאה בתקשורת עם Google Apps Script');
  }
  
  const data = await res.json();
  if (data.error) {
    throw new Error(data.error);
  }
  
  return Number(data.id) || Date.now();
};

export const updateMenuItem = async (accessToken: string | null, rowId: number | string, item: Partial<MenuItem>) => {
  const scriptUrl = getAppsScriptUrl();
  if (!scriptUrl) {
    throw new Error('אנא הגדר תחילה את כתובת ה-Apps Script Web App בהגדרות החיבור');
  }

  const rowObj = [
    item.categoryId ? getCategoryLabel(item.categoryId) : '',
    item.title || '',
    item.description || '',
    item.price !== undefined ? item.price.toString() : '',
    item.image || '',
    item.isHidden ? 'TRUE' : 'FALSE'
  ];
  
  const res = await fetch(scriptUrl, {
    method: 'POST',
    mode: 'cors',
    headers: {
      'Content-Type': 'text/plain;charset=utf-8' // Crucial: prevents CORS preflight OPTIONS request
    },
    body: JSON.stringify({
      action: 'update',
      id: rowId,
      item: rowObj
    })
  });
  
  if (!res.ok) {
    throw new Error('שגיאה בתקשורת עם Google Apps Script');
  }
  
  const data = await res.json();
  if (data.error) {
    throw new Error(data.error);
  }
};

export const deleteMenuItem = async (accessToken: string | null, rowId: number | string) => {
  const scriptUrl = getAppsScriptUrl();
  if (!scriptUrl) {
    throw new Error('אנא הגדר תחילה את כתובת ה-Apps Script Web App בהגדרות החיבור');
  }

  const res = await fetch(scriptUrl, {
    method: 'POST',
    mode: 'cors',
    headers: {
      'Content-Type': 'text/plain;charset=utf-8' // Crucial: prevents CORS preflight OPTIONS request
    },
    body: JSON.stringify({
      action: 'delete',
      id: rowId
    })
  });
  
  if (!res.ok) {
    throw new Error('שגיאה בתקשורת עם Google Apps Script');
  }
  
  const data = await res.json();
  if (data.error) {
    throw new Error(data.error);
  }
};
