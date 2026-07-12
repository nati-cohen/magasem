import { Category, MenuItem } from './types';

export const MENU_CATEGORIES: Category[] = [
  { id: 'all', label: 'הכל' },
  { id: 'pastry', label: 'פסטות ומאפים חמים' },
  { id: 'fish', label: 'דגים' },
  { id: 'salads', label: 'סלטים ואנטיפסטי' },
  { id: 'salty', label: 'מלוחים, טורטיות וכריכים' },
  { id: 'soups', label: 'מרקים' },
  { id: 'desserts', label: 'קינוחים ומתוקים' },
];

export const INITIAL_MENU_ITEMS: MenuItem[] = [
  {
    id: 1,
    categoryId: 'pastry',
    title: 'לזניה איטלקית קלאסית',
    description: 'מגש 3 ליטר (כ-12 אנשים)',
    price: 170,
    image: 'https://images.unsplash.com/photo-1574894709920-11b28e7367e3?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 2,
    categoryId: 'pastry',
    title: 'פסטה מוקרמת',
    description: 'ברוטב פטריות עשיר. מגש 5 ליטר (10-12 איש)',
    price: 140,
    image: 'https://images.unsplash.com/photo-1645112411341-6c4fd023714a?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 3,
    categoryId: 'pastry',
    title: 'קנלוני ברוטב עגבניות',
    description: 'מגש 3 ליטר (כ-10 אנשים)',
    price: 180,
    image: 'https://images.unsplash.com/photo-1516100882582-96c3a05fe590?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 4,
    categoryId: 'pastry',
    title: 'רביולי (גבינות/בטטה)',
    description: 'בשמנת או עגבניות. 3 ליטר (10-12 איש)',
    price: 180,
    image: 'https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 5,
    categoryId: 'pastry',
    title: 'פשטידת קישואים',
    description: 'פשטידה עדינה ועשירה (12-15 איש)',
    price: 160,
    image: 'https://images.unsplash.com/photo-1551631557-9d7a2f260388?auto=format&fit=crop&w=800&q=80' 
  },
  {
    id: 6,
    categoryId: 'pastry',
    title: 'תפוח אדמה מוקרם',
    description: 'מוכרם בגבינות עשירות (12-15 איש)',
    price: 170,
    image: 'https://images.unsplash.com/photo-1505253716362-af1932afff70?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 7,
    categoryId: 'salty',
    title: 'קישים במגוון מילויים',
    description: 'בצל / פטריות / בטטה / כרישה וכו׳ (8-10 איש)',
    price: 120,
    image: 'https://images.unsplash.com/photo-1613204909180-8774780536c4?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 81,
    categoryId: 'fish',
    title: 'סלמון חרדל ודבש',
    description: 'פילה שלם (10-12 איש)',
    price: 270,
    image: 'https://images.unsplash.com/photo-1599084929471-65d12f53ceac?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 82,
    categoryId: 'fish',
    title: 'סלמון עשבי תיבול ואגוזים',
    description: 'פילה שלם (10-12 איש)',
    price: 270,
    image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 83,
    categoryId: 'fish',
    title: 'סלמון פלפלים ולימון',
    description: 'פילה שלם (10-12 איש)',
    price: 270,
    image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 9,
    categoryId: 'fish',
    title: 'דג אמנון ברוטב מזרחי',
    description: 'דג ברוטב עשיר וחם (10-15 יחידות)',
    price: 220,
    image: 'https://images.unsplash.com/photo-1580476262798-bddd9f4b7369?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 101,
    categoryId: 'salads',
    title: 'סלט חסה יוני',
    description: 'גודל 4.5 ליטר (10-12 איש) | אפשרות ל-2.5 ליטר ב-95₪',
    price: 150,
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 102,
    categoryId: 'salads',
    title: 'סלט חסה בטטה',
    description: 'גודל 4.5 ליטר (10-12 איש) | אפשרות ל-2.5 ליטר ב-95₪',
    price: 150,
    image: 'https://images.unsplash.com/photo-1505253716362-af1932afff70?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 103,
    categoryId: 'salads',
    title: 'סלט עדשים שחורות ובטטה',
    description: 'גודל 4.5 ליטר (10-12 איש) | אפשרות ל-2.5 ליטר ב-95₪',
    price: 150,
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 104,
    categoryId: 'salads',
    title: 'סלט כרוב אסייתי',
    description: 'גודל 4.5 ליטר (10-12 איש) | אפשרות ל-2.5 ליטר ב-95₪',
    price: 150,
    image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 105,
    categoryId: 'salads',
    title: 'סלט קינואה אנטיפסטי',
    description: 'גודל 4.5 ליטר (10-12 איש) | אפשרות ל-2.5 ליטר ב-95₪',
    price: 150,
    image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 106,
    categoryId: 'salads',
    title: 'סלט פסטה קרה',
    description: 'גודל 4.5 ליטר (10-12 איש) | אפשרות ל-2.5 ליטר ב-95₪',
    price: 150,
    image: 'https://images.unsplash.com/photo-1626844131082-256783844137?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 107,
    categoryId: 'salads',
    title: 'מקלות סלק חי',
    description: 'גודל 4.5 ליטר (10-12 איש) | אפשרות ל-2.5 ליטר ב-95₪',
    price: 150,
    image: 'https://images.unsplash.com/photo-1528825871115-3581a5387919?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 11,
    categoryId: 'salads',
    title: 'מגש אנטיפסטי',
    description: 'מגש ענק עם ירקות קלויים צבעוניים (10-15 איש)',
    price: 170,
    image: 'https://images.unsplash.com/photo-1516684732162-798a0062be99?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 12,
    categoryId: 'salads',
    title: 'קרפצ\'יו סלק',
    description: 'מגש עגול ענק (10-12 איש)',
    price: 110,
    image: 'https://images.unsplash.com/photo-1628190715367-152e0fcd8247?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 13,
    categoryId: 'salty',
    title: 'קובניות לחם שום',
    description: 'מגש ריחני ומפנק (10-12 איש)',
    price: 120,
    image: 'https://images.unsplash.com/photo-1605370258055-66d4090b4d45?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 14,
    categoryId: 'pastry',
    title: 'שקשוקה',
    description: 'שקשוקה ים תיכונית עשירה (כ-12 איש)',
    price: 160,
    image: 'https://images.unsplash.com/photo-1590558406565-d069b763ec85?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 15,
    categoryId: 'pastry',
    title: 'פיצות אישיות',
    description: 'כ-25 יחידות',
    price: 170,
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 16,
    categoryId: 'salty',
    title: 'פוקאצ\'ות שום וירקות',
    description: 'לחם פוקאצ\'ה פריך עם מגוון תוספות מרעננות',
    price: 170,
    image: 'https://images.unsplash.com/photo-1576401037599-2a912bbbcdec?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 17,
    categoryId: 'salty',
    title: 'מיני פריקסה',
    description: 'סנדוויצ\'ים קטנים מפוצצים בטעם (כ-21 יחידות)',
    price: 250,
    image: 'https://images.unsplash.com/photo-1599388339180-60b7ae9e0231?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 18,
    categoryId: 'salty',
    title: 'טורטיות ממולאות',
    description: 'מגוון מילויים מובחרים (כ-20 יחידות)',
    price: 170,
    image: 'https://images.unsplash.com/photo-1626844131082-256783844137?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 19,
    categoryId: 'salty',
    title: 'לחמניות ביס ממולאות',
    description: 'כ-24 יחידות של פינוק',
    price: 250,
    image: 'https://images.unsplash.com/photo-1627308595186-b11a120cb9e2?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 20,
    categoryId: 'desserts',
    title: 'טארטלטים מתוקים',
    description: '24 יחידות במגוון טעמים יוקרתיים',
    price: 170,
    image: 'https://images.unsplash.com/photo-1509460913899-515f1df34fac?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 21,
    categoryId: 'desserts',
    title: 'קינוחי כוסות',
    description: '20 יחידות של קינוחים אישיים',
    price: 200,
    image: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 22,
    categoryId: 'desserts',
    title: 'עוגות שמרים',
    description: 'פס עוגת שמרים ביתית ועשירה, שוקולד או קינמון',
    price: 40,
    image: 'https://images.unsplash.com/photo-1605807646983-377bc5a76493?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 23,
    categoryId: 'desserts',
    title: 'מגש חיתוכיות מפנקות',
    description: 'מגוון רחב וצבעוני (ראו תפריט למגוון)',
    price: 200,
    image: 'https://images.unsplash.com/photo-1528975604071-b4dc52cafdf7?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 24,
    categoryId: 'soups',
    title: 'מרק (בטטה / עדשים ירוקים)',
    description: 'קדרה 10 ליטר (כ-40 איש)',
    price: 300,
    image: 'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 25,
    categoryId: 'soups',
    title: 'מרק בצל',
    description: 'מרק צרפתי קלאסי ועשיר, קדרה 10 ליטר (כ-40 איש)',
    price: 400,
    image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=800&q=80'
  }
];
