'use client';

import { useEffect, useRef, useState } from 'react';
import { Check, ChevronDown, Globe } from 'lucide-react';

/**
 * English is pinned first (it is the reset/default).
 * All other languages are sorted alphabetically by their English name.
 * Total: 109 languages (English + 108 others).
 * Google Translate language codes used — note: Hebrew is 'iw' (not 'he'),
 * Javanese is 'jw', Hawaiian is 'haw', Hmong is 'hmn', Cebuano is 'ceb'.
 */
const LANGUAGES = [
  { code: 'en', native: 'English' }, // pinned first — reset language

  { code: 'af', native: 'Afrikaans' },
  { code: 'sq', native: 'Shqip' }, // Albanian
  { code: 'am', native: 'አማርኛ' }, // Amharic
  { code: 'ar', native: 'العربية' }, // Arabic
  { code: 'hy', native: 'Հայերեն' }, // Armenian
  { code: 'az', native: 'Azərbaycan' }, // Azerbaijani
  { code: 'eu', native: 'Euskara' }, // Basque
  { code: 'be', native: 'Беларуская' }, // Belarusian
  { code: 'bn', native: 'বাংলা' }, // Bengali
  { code: 'bs', native: 'Bosanski' }, // Bosnian
  { code: 'bg', native: 'Български' }, // Bulgarian
  { code: 'ca', native: 'Català' }, // Catalan
  { code: 'ceb', native: 'Cebuano' },
  { code: 'ny', native: 'Chichewa' },
  { code: 'zh-CN', native: '中文 (简体)' }, // Chinese Simplified
  { code: 'zh-TW', native: '中文 (繁體)' }, // Chinese Traditional
  { code: 'co', native: 'Corsu' }, // Corsican
  { code: 'hr', native: 'Hrvatski' }, // Croatian
  { code: 'cs', native: 'Čeština' }, // Czech
  { code: 'da', native: 'Dansk' }, // Danish
  { code: 'nl', native: 'Nederlands' }, // Dutch
  { code: 'eo', native: 'Esperanto' },
  { code: 'et', native: 'Eesti' }, // Estonian
  { code: 'tl', native: 'Filipino' },
  { code: 'fi', native: 'Suomi' }, // Finnish
  { code: 'fr', native: 'Français' }, // French
  { code: 'fy', native: 'Frysk' }, // Frisian
  { code: 'gl', native: 'Galego' }, // Galician
  { code: 'ka', native: 'ქართული' }, // Georgian
  { code: 'de', native: 'Deutsch' }, // German
  { code: 'el', native: 'Ελληνικά' }, // Greek
  { code: 'gu', native: 'ગુજરાતી' }, // Gujarati
  { code: 'ht', native: 'Kreyòl ayisyen' }, // Haitian Creole
  { code: 'ha', native: 'Hausa' },
  { code: 'haw', native: 'ʻŌlelo Hawaiʻi' }, // Hawaiian
  { code: 'iw', native: 'עברית' }, // Hebrew (Google uses 'iw')
  { code: 'hi', native: 'हिन्दी' }, // Hindi
  { code: 'hmn', native: 'Hmong' },
  { code: 'hu', native: 'Magyar' }, // Hungarian
  { code: 'is', native: 'Íslenska' }, // Icelandic
  { code: 'ig', native: 'Igbo' },
  { code: 'id', native: 'Bahasa Indonesia' },
  { code: 'ga', native: 'Gaeilge' }, // Irish
  { code: 'it', native: 'Italiano' }, // Italian
  { code: 'ja', native: '日本語' }, // Japanese
  { code: 'jw', native: 'Jawa' }, // Javanese (Google uses 'jw')
  { code: 'kn', native: 'ಕನ್ನಡ' }, // Kannada
  { code: 'kk', native: 'Қазақ' }, // Kazakh
  { code: 'km', native: 'ខ្មែរ' }, // Khmer
  { code: 'rw', native: 'Kinyarwanda' },
  { code: 'ko', native: '한국어' }, // Korean
  { code: 'ku', native: 'Kurdî' }, // Kurdish
  { code: 'ky', native: 'Кыргызча' }, // Kyrgyz
  { code: 'lo', native: 'ລາວ' }, // Lao
  { code: 'la', native: 'Latina' }, // Latin
  { code: 'lv', native: 'Latviešu' }, // Latvian
  { code: 'lt', native: 'Lietuvių' }, // Lithuanian
  { code: 'lb', native: 'Lëtzebuergesch' }, // Luxembourgish
  { code: 'mk', native: 'Македонски' }, // Macedonian
  { code: 'mg', native: 'Malagasy' },
  { code: 'ms', native: 'Melayu' }, // Malay
  { code: 'ml', native: 'മലയാളം' }, // Malayalam
  { code: 'mt', native: 'Malti' }, // Maltese
  { code: 'mi', native: 'Māori' },
  { code: 'mr', native: 'मराठी' }, // Marathi
  { code: 'mn', native: 'Монгол' }, // Mongolian
  { code: 'my', native: 'မြန်မာဘာသာ' }, // Myanmar / Burmese
  { code: 'ne', native: 'नेपाली' }, // Nepali
  { code: 'no', native: 'Norsk' }, // Norwegian
  { code: 'or', native: 'ଓଡ଼ିଆ' }, // Odia / Oriya
  { code: 'ps', native: 'پښتو' }, // Pashto
  { code: 'fa', native: 'فارسی' }, // Persian / Farsi
  { code: 'pl', native: 'Polski' }, // Polish
  { code: 'pt', native: 'Português' }, // Portuguese
  { code: 'pa', native: 'ਪੰਜਾਬੀ' }, // Punjabi
  { code: 'ro', native: 'Română' }, // Romanian
  { code: 'ru', native: 'Русский' }, // Russian
  { code: 'sm', native: 'Samoa' }, // Samoan
  { code: 'gd', native: 'Gàidhlig' }, // Scots Gaelic
  { code: 'sr', native: 'Српски' }, // Serbian
  { code: 'st', native: 'Sesotho' },
  { code: 'sn', native: 'Shona' },
  { code: 'sd', native: 'سنڌي' }, // Sindhi
  { code: 'si', native: 'සිංහල' }, // Sinhala
  { code: 'sk', native: 'Slovenčina' }, // Slovak
  { code: 'sl', native: 'Slovenščina' }, // Slovenian
  { code: 'so', native: 'Soomaali' }, // Somali
  { code: 'es', native: 'Español' }, // Spanish
  { code: 'su', native: 'Basa Sunda' }, // Sundanese
  { code: 'sw', native: 'Kiswahili' }, // Swahili
  { code: 'sv', native: 'Svenska' }, // Swedish
  { code: 'tg', native: 'Тоҷикӣ' }, // Tajik
  { code: 'ta', native: 'தமிழ்' }, // Tamil
  { code: 'tt', native: 'Татарча' }, // Tatar
  { code: 'te', native: 'తెలుగు' }, // Telugu
  { code: 'th', native: 'ภาษาไทย' }, // Thai
  { code: 'tr', native: 'Türkçe' }, // Turkish
  { code: 'tk', native: 'Türkmen' }, // Turkmen
  { code: 'uk', native: 'Українська' }, // Ukrainian
  { code: 'ur', native: 'اردو' }, // Urdu
  { code: 'ug', native: 'ئۇيغۇرچە' }, // Uyghur
  { code: 'uz', native: "O'zbek" }, // Uzbek
  { code: 'vi', native: 'Tiếng Việt' }, // Vietnamese
  { code: 'cy', native: 'Cymraeg' }, // Welsh
  { code: 'xh', native: 'isiXhosa' }, // Xhosa
  { code: 'yi', native: 'יידיש' }, // Yiddish
  { code: 'yo', native: 'Yorùbá' }, // Yoruba
  { code: 'zu', native: 'Zulu' },
];

type Language = { code: string; native: string };

type Variant =
  | 'nav' // dark background (public navbar) — white text
  | 'drawer' // light background (mobile drawer) — dark text
  | 'dashboard'; // light background (dashboard topbar) — dark text

function triggerTranslate(code: string) {
  if (code === 'en') {
    const host = window.location.hostname;
    document.cookie = `googtrans=/en/en; path=/; domain=${host}`;
    document.cookie = `googtrans=/en/en; path=/`;
    window.location.reload();
    return;
  }
  const select = document.querySelector(
    '.goog-te-combo',
  ) as HTMLSelectElement | null;
  if (select) {
    select.value = code;
    select.dispatchEvent(new Event('change'));
  } else {
    const host = window.location.hostname;
    document.cookie = `googtrans=/en/${code}; path=/; domain=${host}`;
    document.cookie = `googtrans=/en/${code}; path=/`;
    window.location.reload();
  }
}

type Props = { variant?: Variant };

export default function LanguageSwitcher({ variant = 'nav' }: Props) {
  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState<Language>(LANGUAGES[0]);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onPointer = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onPointer);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onPointer);
      document.removeEventListener('keydown', onKey);
    };
  }, []);

  function pick(lang: Language) {
    setCurrent(lang);
    setOpen(false);
    triggerTranslate(lang.code);
  }

  const btnClass =
    variant === 'nav'
      ? 'text-on-navy/70 hover:text-on-navy'
      : 'text-muted hover:text-text';

  return (
    <div ref={ref} className='relative'>
      <button
        type='button'
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-haspopup='listbox'
        className={`flex items-center gap-1.5 text-xs font-medium px-2.5 py-1.5 rounded-lg transition-colors duration-150 ${btnClass}`}
      >
        <Globe size={14} className='flex-shrink-0' />
        <span className='hidden sm:block max-w-[80px] truncate'>
          {current.native}
        </span>
        <ChevronDown
          size={12}
          className={`transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {open && (
        <div
          role='listbox'
          aria-label='Select language'
          className='absolute right-0 top-full mt-2 bg-surface rounded-xl shadow-[0_12px_34px_-10px_rgba(0,0,0,0.25)] py-2 min-w-[180px] max-h-[320px] overflow-y-auto z-50'
        >
          {LANGUAGES.map((lang) => (
            <button
              key={lang.code}
              role='option'
              type='button'
              aria-selected={current.code === lang.code}
              onClick={() => pick(lang)}
              className='flex items-center justify-between gap-3 w-full px-4 py-2.5 text-sm text-text hover:bg-bg transition-colors duration-150 text-left'
            >
              <span>{lang.native}</span>
              {current.code === lang.code && (
                <Check size={14} className='text-primary flex-shrink-0' />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
