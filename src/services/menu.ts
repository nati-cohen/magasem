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

let firstSheetNameCache: string | null = null;

const getSheetName = async (accessToken: string): Promise<string> => {
  if (firstSheetNameCache) return firstSheetNameCache;
  const res = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}`, {
    headers: { Authorization: `Bearer ${accessToken}` }
  });
  if (!res.ok) return 'גיליון1'; // fallback
  const data = await res.json();
  if (data.sheets && data.sheets.length > 0) {
    firstSheetNameCache = data.sheets[0].properties.title;
    return firstSheetNameCache!;
  }
  return 'גיליון1';
};

export const createMenuItem = async (accessToken: string, item: Omit<MenuItem, 'id'>): Promise<number> => {
  const rowObj = [
    getCategoryLabel(item.categoryId),
    item.title,
    item.description,
    item.price.toString(),
    item.image || '',
    item.isHidden ? 'TRUE' : 'FALSE'
  ];
  
  const sheetName = await getSheetName(accessToken);
  const encodedSheetName = encodeURIComponent(sheetName);
  
  const res = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${encodedSheetName}!A:F:append?valueInputOption=USER_ENTERED`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ values: [rowObj] })
  });
  
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error?.message || 'Failed to create menu item');
  }
  
  const data = await res.json();
  const range = data.updates?.updatedRange; // e.g. "Sheet1!A7:E7"
  const match = range?.match(/[A-Z]+(\d+)/);
  if (match) return parseInt(match[1], 10);
  
  return Date.now(); // Fallback ID
};

export const updateMenuItem = async (accessToken: string, rowId: number | string, item: Partial<MenuItem>) => {
  // item should have all fields from the edit form
  const rowObj = [
    item.categoryId ? getCategoryLabel(item.categoryId) : '',
    item.title,
    item.description,
    item.price !== undefined ? item.price.toString() : '',
    item.image || '',
    item.isHidden ? 'TRUE' : 'FALSE'
  ];
  
  const sheetName = await getSheetName(accessToken);
  const encodedSheetName = encodeURIComponent(sheetName);
  
  const res = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${encodedSheetName}!A${rowId}:F${rowId}?valueInputOption=USER_ENTERED`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ values: [rowObj] })
  });
  
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error?.message || 'Failed to update menu item');
  }
};

export const deleteMenuItem = async (accessToken: string, rowId: number | string) => {
  const sheetName = await getSheetName(accessToken);
  const encodedSheetName = encodeURIComponent(sheetName);

  const res = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${encodedSheetName}!A${rowId}:F${rowId}:clear`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${accessToken}` }
  });
  
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error?.message || 'Failed to delete menu item');
  }
};
