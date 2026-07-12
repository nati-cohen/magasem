import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Phone, 
  MapPin, 
  Menu as MenuIcon, 
  X, 
  CheckCircle2, 
  Instagram, 
  MessageCircle,
  ChefHat,
  Leaf,
  Mail,
  Volume2,
  VolumeX,
  Settings
} from 'lucide-react';
import { MENU_CATEGORIES, INITIAL_MENU_ITEMS } from './data';
import { MenuItem } from './types';
import { AdminPanel } from './components/AdminPanel';
import { LoginPanel } from './components/LoginPanel';
import { useAuth } from './contexts/AuthContext';

const WHATSAPP_NUMBER = "972525666182";
const EMAIL = "yaara82@gmail.com";
const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("היי יערה! אשמח לפרטים לגבי אירוח ממגשים.")}`;

export default function App() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [isPlayingMusic, setIsPlayingMusic] = useState(false);
  const [isAdminView, setIsAdminView] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loadingMenu, setLoadingMenu] = useState(true);

  useEffect(() => {
    import('./services/menu').then(({ getMenuItems }) => {
      getMenuItems().then(items => {
        if (items.length === 0) {
          setMenuItems(INITIAL_MENU_ITEMS);
        } else {
          setMenuItems(items);
        }
        setLoadingMenu(false);
      }).catch(err => {
        console.error("Failed fetching menu:", err);
        setMenuItems(INITIAL_MENU_ITEMS);
        setLoadingMenu(false);
      });
    });
  }, []);

  const handleMenuUpdateLocally = (items: MenuItem[]) => {
    setMenuItems(items);
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const filteredMenu = menuItems.filter(item => {
    if (item.isHidden) return false;
    if (activeCategory === 'all') return true;
    return item.categoryId === activeCategory;
  });

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsMobileMenuOpen(false);
    }
  };

  const toggleMusic = async () => {
    if (audioRef.current) {
      if (isPlayingMusic) {
        audioRef.current.pause();
        setIsPlayingMusic(false);
      } else {
        try {
          await audioRef.current.play();
          setIsPlayingMusic(true);
        } catch (error) {
          console.error("Audio playback failed. Please ensure music.mp3 is uploaded to the public directory.", error);
          setIsPlayingMusic(false);
        }
      }
    }
  };

  const { user, isAdmin, loading } = useAuth();

  if (isAdminView) {
    if (loading) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-brand-cream text-brand-charcoal">
          <p>טוען...</p>
        </div>
      );
    }
    
    if (!user || !isAdmin) {
      return <LoginPanel onClose={() => setIsAdminView(false)} />;
    }

    return (
      <AdminPanel 
        menuItems={menuItems} 
        onItemsChange={handleMenuUpdateLocally} 
        onClose={() => setIsAdminView(false)} 
      />
    );
  }

  return (
    <div className="min-h-screen bg-brand-cream text-brand-charcoal overflow-x-hidden">
      {/* Navbar */}
      <nav 
        className={`fixed w-full z-50 transition-all duration-300 ${
          isScrolled 
            ? 'bg-brand-cream/95 backdrop-blur-md shadow-sm py-4' 
            : 'bg-transparent py-6'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-12 flex items-center justify-between">
          <div className="flex-1 flex justify-start">
            <button 
              className="lg:hidden text-brand-charcoal"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <MenuIcon size={28} />
            </button>
            <div className="hidden lg:flex items-center gap-8 text-[15px] font-medium tracking-wide">
              <button onClick={() => scrollToSection('home')} className="hover:text-brand-olive transition-colors">בית</button>
              <button onClick={() => scrollToSection('about')} className="hover:text-brand-olive transition-colors">הסיפור שלנו</button>
              <button onClick={() => scrollToSection('menu')} className="hover:text-brand-olive transition-colors">תפריט מגשים</button>
              <button onClick={() => scrollToSection('contact')} className="hover:text-brand-olive transition-colors">יצירת קשר</button>
            </div>
          </div>
          
          <div className="flex-1 flex justify-center">
            <img 
              src="/logo.jpg" 
              alt="מגשים לוגו" 
              className={`transition-all duration-300 rounded-full shadow-md object-contain ${
                isScrolled ? 'h-14 w-14' : 'h-20 w-20'
              }`} 
            />
          </div>
          
          <div className="flex-1 flex justify-end gap-4">
             <a 
                href={WHATSAPP_URL}
                target="_blank"
                rel="noreferrer"
                className="hidden lg:flex items-center gap-2 bg-brand-olive hover:bg-brand-olive-light text-brand-cream px-6 py-2.5 rounded-full font-medium transition-colors"
              >
                להזמנה <MessageCircle size={18} />
              </a>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-[60] bg-brand-cream flex flex-col"
          >
            <div className="p-6 flex justify-between items-center">
              <img 
                src="/logo.jpg" 
                alt="מגשים לוגו" 
                className="h-16 w-16 rounded-full shadow-sm object-contain" 
              />
              <button onClick={() => setIsMobileMenuOpen(false)}>
                <X size={32} className="text-brand-charcoal" />
              </button>
            </div>
            <div className="flex flex-col gap-8 p-12 text-2xl font-medium items-start">
              <button onClick={() => scrollToSection('home')}>בית</button>
              <button onClick={() => scrollToSection('about')}>הסיפור שלנו</button>
              <button onClick={() => scrollToSection('menu')}>תפריט מגשים</button>
              <button onClick={() => scrollToSection('contact')}>יצירת קשר</button>
            </div>
            <div className="mt-auto p-12 pb-24">
               <a 
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="flex justify-center items-center gap-2 w-full bg-brand-olive text-brand-cream py-4 rounded-full font-medium text-lg"
                >
                  הזמנה מהירה בוואטסאפ <MessageCircle size={20} />
                </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Section */}
      <section id="home" className="relative h-[90vh] min-h-[600px] flex items-center justify-center pt-20">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1555507036-ab1d4075c6f1?auto=format&fit=crop&w=2000&q=80" 
            alt="Table full of beautiful food" 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-brand-charcoal/40" />
          <div className="absolute inset-0 bg-gradient-to-b from-brand-charcoal/60 via-transparent to-brand-cream" />
        </div>
        
        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto flex flex-col items-center">
          <motion.span 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-brand-gold-light font-medium tracking-widest uppercase mb-4 block"
          >
            אירוח מושלם, באפס מאמץ
          </motion.span>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-5xl md:text-7xl font-bold text-brand-cream mb-6 leading-tight"
          >
            קייטרינג בוטיק חלבי לחוויה בלתי נשכחת
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-lg md:text-xl text-brand-cream-dark mb-10 max-w-2xl mx-auto"
          >
            מגשי אירוח טריים, מוקפדים ומעוצבים לאירועים פרטיים ועסקיים. עם חומרי הגלם הטובים ביותר ותשומת לב לכל פרט.
          </motion.p>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <button 
              onClick={() => scrollToSection('menu')}
              className="bg-brand-cream text-brand-charcoal px-8 py-4 rounded-full font-bold hover:bg-white transition-colors"
            >
              לצפייה בתפריט
            </button>
            <a 
              href={WHATSAPP_URL}
              target="_blank"
              rel="noreferrer"
              className="bg-brand-olive text-brand-cream px-8 py-4 rounded-full font-bold hover:bg-brand-olive-light transition-colors flex items-center justify-center gap-2"
            >
              להזמנה מהירה <MessageCircle size={20} />
            </a>
          </motion.div>
        </div>
      </section>

      {/* About & Kosher Section */}
      <section id="about" className="py-24 px-6 bg-brand-cream relative">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            className="space-y-8"
          >
            <div className="space-y-2">
              <h2 className="text-3xl md:text-4xl font-bold text-brand-olive">יערה שרעבי - מגשים</h2>
              <div className="w-20 h-1 bg-brand-gold rounded-full" />
            </div>
            
            <p className="text-lg leading-relaxed text-brand-charcoal/80">
              האירוח בשבילכם הוא השליחות שלי. "מגשים" נולד מתוך אהבה עמוקה לאסתטיקה, אירוח, ושילוב טעמים מדויק. 
              אנו מתמחים בהרכבת מגשי אירוח חלביים ופרווה, המציעים חוויה קולינרית עשירה, טרייה ומרשימה.
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-brand-cream-dark rounded-full flex justify-center items-center shrink-0">
                  <ChefHat className="text-brand-olive" size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-lg">טריות ללא פשרות</h4>
                  <p className="text-sm text-brand-charcoal/70">חומרי גלם טריים ואיכותיים שנבחרים בקפידה מדי יום.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-brand-cream-dark rounded-full flex justify-center items-center shrink-0">
                  <CheckCircle2 className="text-brand-olive" size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-lg">כשרות מהדרין</h4>
                  <p className="text-sm text-brand-charcoal/70">כשרות מהדרין, ללא פוקחות, רבנות מטה בנימין.</p>
                </div>
              </div>
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            className="relative"
          >
            <div className="aspect-[4/5] rounded-t-full overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=800&q=80" 
                alt="Elegant food preparation" 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="absolute -bottom-8 -right-8 bg-brand-gold text-brand-cream p-8 rounded-full w-40 h-40 hidden md:flex flex-col items-center justify-center text-center shadow-xl">
              <Leaf size={32} className="mb-2" />
              <span className="font-bold leading-tight">100%<br/>טבעי וטרי</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Menu Section */}
      <section id="menu" className="py-24 bg-white relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center space-y-4 mb-16">
            <span className="text-brand-gold font-medium tracking-widest uppercase">התפריט שלנו</span>
            <h2 className="text-4xl md:text-5xl font-bold text-brand-olive">מגשי אירוח מוקפדים</h2>
            <p className="text-lg text-brand-charcoal/60 max-w-2xl mx-auto">
              בחרו ממגוון המנות העשיר שלנו, המותאמות במיוחד כדי להפוך כל אירוע לחוויה בלתי נשכחת
            </p>
          </div>

          {/* Category Tabs */}
          <div className="flex overflow-x-auto pb-4 mb-12 gap-2 snap-x hide-scrollbar justify-start md:justify-center">
            {MENU_CATEGORIES.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`snap-center shrink-0 px-6 py-3 rounded-full text-sm sm:text-base font-medium transition-all duration-300 ${
                  activeCategory === category.id 
                    ? 'bg-brand-olive text-brand-cream shadow-md' 
                    : 'bg-brand-cream text-brand-charcoal/70 hover:bg-brand-cream-dark'
                }`}
              >
                {category.label}
              </button>
            ))}
          </div>

          {/* Menu Grid */}
          <motion.div layout className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            <AnimatePresence>
              {filteredMenu.map((item) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                  className="bg-brand-cream rounded-3xl overflow-hidden group hover:shadow-xl transition-shadow flex flex-col"
                >
                  <div className="relative h-56 overflow-hidden">
                    <img 
                      src={item.image} 
                      alt={item.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-4 py-1.5 rounded-full font-bold text-brand-olive shadow-sm">
                      ₪{item.price}
                    </div>
                  </div>
                  <div className="p-6 flex flex-col flex-1">
                    <h3 className="text-xl font-bold mb-2 text-brand-charcoal">{item.title}</h3>
                    <p className="text-brand-charcoal/70 mb-6 flex-1 text-sm leading-relaxed">{item.description}</p>
                    <a 
                      href={WHATSAPP_URL}
                      target="_blank"
                      rel="noreferrer"
                      className="w-full block text-center border-2 border-brand-olive text-brand-olive hover:bg-brand-olive hover:text-brand-cream py-3 rounded-full font-semibold transition-colors mt-auto"
                    >
                      הוסף להזמנה
                    </a>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="bg-brand-olive text-brand-cream py-20 px-6">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h2 className="text-3xl md:text-5xl font-bold">מוכנים לאירוע הבא שלכם?</h2>
          <p className="text-lg text-brand-cream-dark opacity-90 max-w-2xl mx-auto leading-relaxed">
            אנחנו כאן כדי לדאוג לכל הפרטים. שלחו לנו הודעה ונבנה יחד תפריט מותאם אישית שיתאים בול עבורכם ועבור האורחים שלכם.
          </p>
          <a 
              href={WHATSAPP_URL}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-3 bg-brand-gold hover:bg-brand-gold-light text-brand-charcoal px-10 py-5 rounded-full font-bold text-lg transition-colors shadow-lg hover:shadow-xl"
            >
              לשיחת ייעוץ והזמנה <MessageCircle size={24} />
          </a>
        </div>
      </section>

      {/* Footer & Contact */}
      <footer id="contact" className="bg-brand-charcoal text-brand-cream pt-24 pb-12 px-6">
        <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-16 mb-16">
          <div className="space-y-6">
            <img 
              src="/logo.jpg" 
              alt="מגשים לוגו" 
              className="h-24 w-24 rounded-full shadow-lg object-contain bg-white" 
            />
            <p className="text-brand-cream/60 max-w-sm">
              אירוח בוטיק חלבי-פרווה בהשגחת בד"צ ורבנות מהדרין מטה בנימין. טריות, אסתטיקה וטעם בכל ביס.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-brand-cream/10 flex items-center justify-center hover:bg-brand-gold hover:text-brand-charcoal transition-colors">
                <Instagram size={20} />
              </a>
              <a href={WHATSAPP_URL} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-brand-cream/10 flex items-center justify-center hover:bg-brand-gold hover:text-brand-charcoal transition-colors">
                <MessageCircle size={20} />
              </a>
            </div>
          </div>
          
          <div className="space-y-6">
            <h3 className="text-xl font-bold border-b border-brand-cream/20 pb-4 inline-block">יצירת קשר</h3>
            <ul className="space-y-4">
              <li>
                <a href="tel:0525666182" className="flex items-center gap-3 text-brand-cream/80 hover:text-brand-gold transition-colors">
                  <Phone size={18} />
                  <span dir="ltr">052-5666182</span>
                </a>
              </li>
              <li>
                <a href="mailto:yaara82@gmail.com" className="flex items-center gap-3 text-brand-cream/80 hover:text-brand-gold transition-colors">
                  <Mail size={18} />
                  <span>yaara82@gmail.com</span>
                </a>
              </li>
              <li className="flex items-center gap-3 text-brand-cream/80">
                <MapPin size={18} />
                <span>בית אל (איסוף עצמי בתיאום מראש)</span>
              </li>
              <li className="flex items-center gap-3 text-brand-cream/80 pt-2">
                <CheckCircle2 size={18} className="text-brand-gold" />
                <span>כשרות מהדרין רבנות מטה בנימין</span>
              </li>
            </ul>
          </div>
          
          <div className="space-y-6">
            <h3 className="text-xl font-bold border-b border-brand-cream/20 pb-4 inline-block">צור קשר כאן</h3>
            <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
              <input 
                type="text" 
                placeholder="שם מלא" 
                className="w-full bg-brand-cream/10 border border-brand-cream/20 rounded-lg px-4 py-3 outline-none focus:border-brand-gold transition-colors placeholder:text-brand-cream/40 text-brand-cream"
              />
              <input 
                type="tel" 
                placeholder="מספר טלפון" 
                className="w-full bg-brand-cream/10 border border-brand-cream/20 rounded-lg px-4 py-3 outline-none focus:border-brand-gold transition-colors placeholder:text-brand-cream/40 text-brand-cream"
              />
              <button className="w-full bg-brand-gold text-brand-charcoal font-bold py-3 rounded-lg hover:bg-brand-gold-light transition-colors">
                שלחו פנייה
              </button>
            </form>
          </div>
        </div>
        
        <div className="border-t border-brand-cream/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-brand-cream/40 text-sm">
          <div>
            &copy; {new Date().getFullYear()} יערה שרעבי - מגשים. כל הזכויות שמורות.
          </div>
          <button 
            onClick={() => setIsAdminView(true)}
            className="flex items-center gap-2 hover:text-brand-cream transition-colors"
          >
            <Settings size={14} />
            כניסת הנהלה
          </button>
        </div>
      </footer>

      {/* Floating WhatsApp Button */}
      <a 
        href={WHATSAPP_URL}
        target="_blank"
        rel="noreferrer"
        className="fixed bottom-6 right-6 z-[100] w-14 h-14 bg-[#25D366] text-white rounded-full flex justify-center items-center shadow-2xl hover:scale-110 transition-transform hover:bg-[#1ebd5a]"
        aria-label="Order on WhatsApp"
      >
        <MessageCircle size={28} />
      </a>

      {/* Floating Music Toggle */}
      <button 
        onClick={toggleMusic}
        className="fixed bottom-6 left-6 z-[100] w-14 h-14 bg-brand-cream-dark text-brand-olive rounded-full flex justify-center items-center shadow-xl hover:scale-110 transition-transform hover:bg-brand-gold hover:text-brand-charcoal"
        aria-label="Toggle Background Music"
        title="מוזיקת רקע"
      >
        {isPlayingMusic ? <Volume2 size={24} /> : <VolumeX size={24} />}
      </button>

      {/* Audio Element */}
      <audio 
        ref={audioRef} 
        src="/music.mp3" 
        loop
      />
    </div>
  );
}
