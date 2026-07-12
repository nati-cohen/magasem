import { useState } from 'react';
import { MenuItem } from '../types';
import { MENU_CATEGORIES } from '../data';
import { Plus, Edit2, Trash2, X, Check, ArrowRight, Loader, LogOut, EyeOff } from 'lucide-react';
import { createMenuItem, updateMenuItem, deleteMenuItem } from '../services/menu';
import { useAuth } from '../contexts/AuthContext';

interface AdminPanelProps {
  menuItems: MenuItem[];
  onItemsChange: (items: MenuItem[]) => void;
  onClose: () => void;
}

export function AdminPanel({ menuItems, onItemsChange, onClose }: AdminPanelProps) {
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState<Partial<MenuItem>>({});
  const [loadingAction, setLoadingAction] = useState(false);
  const { logout } = useAuth();

  const handleDelete = async (id: number | string) => {
    if (confirm('האם אתה בטוח שברצונך למחוק מנה זו?')) {
      try {
        setLoadingAction(true);
        await deleteMenuItem(null, id);
        onItemsChange(menuItems.filter(item => item.id !== id));
      } catch (e) {
        alert("אירעה שגיאה במחיקת המנה: " + (e instanceof Error ? e.message : String(e)));
        console.error(e);
      } finally {
        setLoadingAction(false);
      }
    }
  };

  const handleEdit = (item: MenuItem) => {
    setEditingItem(item);
    setIsAdding(false);
    setFormData(item);
  };

  const handleAdd = () => {
    setIsAdding(true);
    setEditingItem(null);
    setFormData({
      categoryId: MENU_CATEGORIES[1].id,
      title: '',
      description: '',
      price: 0,
      image: ''
    });
  };

  const handleSave = async () => {
    if (!formData.title || !formData.categoryId || formData.price === undefined) {
      alert('נא למלא את כל שדות החובה');
      return;
    }

    setLoadingAction(true);
    try {
      if (isAdding) {
        const newItemData = {
          categoryId: formData.categoryId!,
          title: formData.title!,
          description: formData.description || '',
          price: Number(formData.price),
          image: formData.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80',
          isHidden: formData.isHidden || false,
        };
        const newId = await createMenuItem(null, newItemData);
        onItemsChange([...menuItems, { id: newId, ...newItemData }]);
      } else if (editingItem) {
        const updatedData = {
          categoryId: formData.categoryId!,
          title: formData.title!,
          description: formData.description || '',
          price: Number(formData.price),
          image: formData.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80',
          isHidden: formData.isHidden || false,
        };
        await updateMenuItem(null, editingItem.id, updatedData);
        const updatedItems = menuItems.map(item => 
          item.id === editingItem.id ? { ...item, ...updatedData } as MenuItem : item
        );
        onItemsChange(updatedItems);
      }
      
      setIsAdding(false);
      setEditingItem(null);
    } catch (e) {
      alert("אירעה שגיאה בשמירת המנה");
      console.error(e);
    } finally {
      setLoadingAction(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-cream text-brand-charcoal py-12 px-6" dir="rtl">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">ניהול תפריט</h1>
            <p className="text-brand-charcoal/60">הוספה, עריכה ומחיקה של מנות (מסונכרן עם גוגל שיטס)</p>
          </div>
          <div className="flex gap-4 items-center">
            <button 
              onClick={() => {
                logout();
                onClose();
              }}
              className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-full shadow-sm hover:shadow transition"
            >
              <LogOut size={20} />
              התנתק
            </button>
            <button 
              onClick={onClose}
              className="flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm hover:shadow text-brand-charcoal transition"
            >
              <ArrowRight size={20} />
              חזרה לאתר
            </button>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Form Area */}
          <div className="md:col-span-1">
            <div className="bg-white p-6 rounded-2xl shadow-sm sticky top-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">
                  {isAdding ? 'הוספת מנה חדשה' : editingItem ? 'עריכת מנה' : 'בחר מנה לעריכה'}
                </h2>
                {(isAdding || editingItem) && (
                  <button onClick={() => { setIsAdding(false); setEditingItem(null); }} className="text-brand-charcoal/50 hover:text-brand-charcoal">
                    <X size={20} />
                  </button>
                )}
              </div>

              {(isAdding || editingItem) ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">שם המנה*</label>
                    <input 
                      type="text" 
                      value={formData.title || ''}
                      onChange={e => setFormData({...formData, title: e.target.value})}
                      className="w-full bg-brand-cream/50 border border-brand-cream-dark rounded-lg px-4 py-2 outline-none focus:border-brand-olive transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">קטגוריה*</label>
                    <select 
                      value={formData.categoryId || ''}
                      onChange={e => setFormData({...formData, categoryId: e.target.value})}
                      className="w-full bg-brand-cream/50 border border-brand-cream-dark rounded-lg px-4 py-2 outline-none focus:border-brand-olive transition-colors"
                    >
                      {MENU_CATEGORIES.filter(c => c.id !== 'all').map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">תיאור</label>
                    <textarea 
                      value={formData.description || ''}
                      onChange={e => setFormData({...formData, description: e.target.value})}
                      className="w-full bg-brand-cream/50 border border-brand-cream-dark rounded-lg px-4 py-2 outline-none focus:border-brand-olive transition-colors"
                      rows={3}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">מחיר (₪)*</label>
                    <input 
                      type="number" 
                      value={formData.price || ''}
                      onChange={e => setFormData({...formData, price: Number(e.target.value)})}
                      className="w-full bg-brand-cream/50 border border-brand-cream-dark rounded-lg px-4 py-2 outline-none focus:border-brand-olive transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">קישור לתמונה URL</label>
                    <div className="flex gap-2">
                       <input 
                        type="text" 
                        value={formData.image || ''}
                        onChange={e => setFormData({...formData, image: e.target.value})}
                        placeholder="https://..."
                        className="w-full bg-brand-cream/50 border border-brand-cream-dark rounded-lg px-4 py-2 outline-none focus:border-brand-olive transition-colors text-left"
                        dir="ltr"
                      />
                    </div>
                  </div>
                  
                  {formData.image && (
                    <div className="mt-2 h-32 rounded-lg overflow-hidden border border-brand-cream-dark relative">
                      <img src={formData.image} alt="תצוגה מקדימה" className="w-full h-full object-cover" onError={(e) => (e.currentTarget.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80')} />
                    </div>
                  )}

                  <div className="flex items-center gap-2 mt-4 p-4 bg-brand-cream-dark/20 rounded-lg">
                    <input
                      type="checkbox"
                      id="isHidden"
                      checked={formData.isHidden || false}
                      onChange={e => setFormData({...formData, isHidden: e.target.checked})}
                      className="w-5 h-5 text-brand-olive rounded focus:ring-brand-olive"
                    />
                    <label htmlFor="isHidden" className="text-sm font-bold text-gray-700 cursor-pointer select-none">
                      הסתר מנה מהתפריט הציבורי
                    </label>
                  </div>

                  <button 
                    onClick={handleSave}
                    disabled={loadingAction}
                    className="w-full bg-brand-olive text-brand-cream font-bold py-3 rounded-lg hover:bg-brand-olive-light transition-colors mt-4 disabled:opacity-50 flex justify-center items-center gap-2"
                  >
                    {loadingAction && <Loader className="animate-spin" size={18} />}
                    שמור מנה
                  </button>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center p-8 text-center text-brand-charcoal/50 min-h-[300px]">
                  <Check size={48} className="mb-4 opacity-50" />
                  <p>בחר מנה מהרשימה כדי לערוך,<br/>או לחץ על הכפתור להוספת מנה חדשה.</p>
                  <button 
                    onClick={handleAdd}
                    className="mt-6 flex items-center gap-2 bg-brand-gold text-brand-charcoal font-bold px-6 py-3 rounded-full hover:bg-brand-gold-light transition-colors shadow-sm"
                  >
                    <Plus size={20} />
                    הוספת מנה חדשה
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* List Area */}
          <div className="md:col-span-2">
            <div className="grid sm:grid-cols-2 gap-4">
              {menuItems.map(item => (
                <div key={item.id} className="bg-white rounded-xl overflow-hidden shadow-sm flex flex-col sm:flex-row group border border-transparent hover:border-brand-cream-dark transition-colors">
                  <div className="w-full sm:w-1/3 h-32 sm:h-auto shrink-0 relative">
                    <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                  </div>
                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start mb-1">
                        <h3 className="font-bold text-lg leading-tight">{item.title}</h3>
                        <span className="font-bold text-brand-olive shrink-0 mr-2">₪{item.price}</span>
                      </div>
                      <div className="flex gap-2 items-center mb-2">
                        <span className="text-xs font-medium text-brand-gold bg-brand-cream py-1 px-2 rounded-md inline-block">
                          {MENU_CATEGORIES.find(c => c.id === item.categoryId)?.label}
                        </span>
                        {item.isHidden && (
                          <span className="flex items-center gap-1 text-xs bg-gray-100 text-gray-500 px-2 py-1 rounded-md whitespace-nowrap">
                            <EyeOff size={12} /> מוסתר
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-brand-charcoal/60 line-clamp-2">{item.description}</p>
                    </div>
                    <div className="flex justify-end gap-2 mt-4 pt-4 border-t border-brand-cream-dark/50">
                      <button 
                        onClick={() => handleEdit(item)}
                        className="p-2 text-brand-charcoal/60 hover:text-brand-olive hover:bg-brand-cream rounded-lg transition-colors"
                        title="ערוך"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button 
                        onClick={() => handleDelete(item.id)}
                        className="p-2 text-brand-charcoal/60 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        title="מחק"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
