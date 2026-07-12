# 🍽️ מגשים - מערכת ניהול תפריט חכמה ומאובטחת

מערכת מודרנית ומהירה לניהול והצגת תפריט דינמי, המבוססת על **React + Vite** ומשתמשת ב-**Google Sheets** כבסיס נתונים ללא עלויות תחזוקה, בשילוב מערכת אימות מאובטחת באמצעות קוד חד-פעמי (OTP) הנשלח ישירות למייל.

---

## ✨ תכונות עיקריות

*   **🗄️ בסיס נתונים חינמי ב-Google Sheets**: כל המנות, הקטגוריות והנתונים נשמרים ישירות בגיליון הנתונים שלכם ללא צורך בשרתים מורכבים או בסיסי נתונים בתשלום (כמו Firebase).
*   **🔌 חיבור ישיר דרך Google Apps Script**: תקשורת מאובטחת, מהירה וחסכונית לניהול מנות (הוספה, עריכה ומחיקה).
*   **🔑 כניסת הנהלה מאובטחת (Passwordless OTP)**: אימות כניסה לניהול באמצעות קוד חד-פעמי הנשלח ישירות למייל המורשה בלבד, ללא צורך בסיסמאות או רישום מורכב.
*   **🎨 ממשק משתמש מרהיב ורספונסיבי**: מעוצב בקפידה עם Tailwind CSS, מותאם לחלוטין לכל סוגי המסכים ומכשירי המובייל.
*   **⚡ ביצועים מהירים במיוחד**: נבנה באמצעות Vite ו-React 18 לטעינה מיידית וחווית משתמש חלקה.

---

## 🛠️ ארכיטקטורה וטכנולוגיות

*   **Frontend**: React, TypeScript, Tailwind CSS, Lucide Icons.
*   **Backend / DB**: Google Sheets, Google Apps Script Web App (API).
*   **Build Tool**: Vite.

---

## 🚀 הוראות התקנה והרצה מקומית

### 1. דרישות קדם
*   התקנת [Node.js](https://nodejs.org/) (גרסה 18 ומעלה).

### 2. התקנת תלויות והרצה
1. הורידו את קובץ הפרויקט ופתחו אותו בתיקייה מקומית.
2. פתחו את הטרמינל בתיקיית הפרויקט והריצו:
   ```bash
   npm install
   ```
3. להרצת שרת הפיתוח המקומי:
   ```bash
   npm run dev
   ```
4. פתחו את הדפדפן בכתובת: `http://localhost:3000` (או הכתובת המוצגת בטרמינל).

---

## 📝 הגדרת Google Apps Script בגיליון שלכם

כדי שהאתר יוכל לעבוד עם הגיליון שלכם, יש להטמיע את הקוד הבא ב-Apps Script של הגיליון:

1. בגיליון הגוגל שיטס שלכם, לחצו בתפריט העליון על **הרחבות (Extensions)** > **Apps Script**.
2. מחקו את כל הקוד הקיים והדביקו את הקוד הבא:

```javascript
function doPost(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
  var payload = JSON.parse(e.postData.contents);
  var action = payload.action;
  
  if (action === 'sendOtp') {
    var email = payload.email.trim().toLowerCase();
    var code = Math.floor(100000 + Math.random() * 900000).toString();
    var cache = CacheService.getScriptCache();
    cache.put(email, code, 600); // שמירה ל-10 דקות
    
    try {
      MailApp.sendEmail({
        to: email,
        subject: "קוד אימות חד-פעמי למערכת הניהול - מגשים",
        htmlBody: "<h3>שלום,</h3><p>קוד האימות החד-פעמי שלך לכניסה למערכת הניהול של <strong>מגשים</strong> הוא:</p><h1 style='font-size: 32px; color: #4F6F52; font-family: monospace; letter-spacing: 4px;'>" + code + "</h1><p>הקוד בתוקף ל-10 דקות הקרובות.</p>"
      });
      return ContentService.createTextOutput(JSON.stringify({ success: true }))
                           .setMimeType(ContentService.MimeType.JSON);
    } catch(err) {
      return ContentService.createTextOutput(JSON.stringify({ error: 'שגיאה בשליחת המייל: ' + err.toString() }))
                           .setMimeType(ContentService.MimeType.JSON);
    }
  }
  
  if (action === 'verifyOtp') {
    var email = payload.email.trim().toLowerCase();
    var code = payload.code.trim();
    var cache = CacheService.getScriptCache();
    var cachedCode = cache.get(email);
    
    if (cachedCode && cachedCode === code) {
      return ContentService.createTextOutput(JSON.stringify({ success: true }))
                           .setMimeType(ContentService.MimeType.JSON);
    } else {
      return ContentService.createTextOutput(JSON.stringify({ error: 'קוד אימות שגוי או פג תוקף' }))
                           .setMimeType(ContentService.MimeType.JSON);
    }
  }
  
  if (action === 'create') {
    var rowObj = payload.item;
    sheet.appendRow(rowObj);
    var lastRow = sheet.getLastRow();
    return ContentService.createTextOutput(JSON.stringify({ success: true, id: lastRow }))
                         .setMimeType(ContentService.MimeType.JSON);
  }
  
  if (action === 'update') {
    var rowId = parseInt(payload.id);
    var rowObj = payload.item;
    var range = sheet.getRange(rowId, 1, 1, rowObj.length);
    range.setValues([rowObj]);
    return ContentService.createTextOutput(JSON.stringify({ success: true }))
                         .setMimeType(ContentService.MimeType.JSON);
  }
  
  if (action === 'delete') {
    var rowId = parseInt(payload.id);
    sheet.getRange(rowId, 1, 1, 6).clearContent();
    return ContentService.createTextOutput(JSON.stringify({ success: true }))
                         .setMimeType(ContentService.MimeType.JSON);
  }
  
  return ContentService.createTextOutput(JSON.stringify({ error: 'פעולה לא תקינה' }))
                       .setMimeType(ContentService.MimeType.JSON);
}
```

3. לחצו על **פריסה (Deploy)** > **פריסה חדשה (New deployment)**.
4. בחרו סוג פריסה: **אפליקציית אינטרנט (Web app)** (סמל גלגל שיניים).
5. הגדירו:
   * **בצע כאל (Execute as)**: אני (האימייל שלכם).
   * **למי יש גישה (Who has access)**: כולם (Anyone).
6. לחצו **פרוס (Deploy)**, אשרו את הרשאות הגישה של גוגל, והעתיקו את הכתובת (URL) שקיבלתם.
7. כתובת זו כבר מוטמעת בצורה קבועה ומאובטחת בקוד האפליקציה בנתיב `src/services/menu.ts`.

---

## 🔒 ניהול הרשאות מנהלים

רשימת המיילים המורשים להיכנס למערכת הניהול מוגדרת בקובץ:
`src/contexts/AuthContext.tsx` תחת המשתנה `ADMIN_EMAILS`:

```typescript
const ADMIN_EMAILS = ['netanel095@gmail.com', 'yaara82@gmail.com'];
```
כדי להוסיף או להסיר מנהלים, פשוט עדכנו רשימה זו בקוד והעלו מחדש.
