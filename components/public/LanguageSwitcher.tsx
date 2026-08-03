'use client';

import { useEffect, useRef, useState } from 'react';
import { Check, ChevronDown, Globe } from 'lucide-react';

const LANGUAGES = [
  { code: 'en', native: 'English' }, // Global default
  { code: 'fr', native: 'Français' }, // French
  { code: 'es', native: 'Español' }, // Spanish
  { code: 'de', native: 'Deutsch' }, // German
  { code: 'pt', native: 'Português' }, // Portuguese
  { code: 'ar', native: 'العربية' }, // Arabic
  { code: 'zh-CN', native: '中文' }, // Simplified Chinese
  { code: 'ru', native: 'Русский' }, // Russian
  { code: 'ja', native: '日本語' }, // Japanese
  { code: 'ko', native: '한국어' }, // Korean
  { code: 'it', native: 'Italiano' }, // Italian
  { code: 'tr', native: 'Türkçe' }, // Turkish
  { code: 'hi', native: 'हिन्दी' }, // Hindi
  { code: 'id', native: 'Bahasa' }, // Indonesian
  { code: 'nl', native: 'Nederlands' }, // Dutch
  { code: 'pl', native: 'Polski' }, // Polish
  { code: 'vi', native: 'Tiếng Việt' }, // Vietnamese
  { code: 'th', native: 'ภาษาไทย' }, // Thai
  { code: 'sw', native: 'Kiswahili' }, // Swahili
  { code: 'yo', native: 'Yorùbá' }, // Yoruba
  { code: 'ig', native: 'Igbo' }, // Igbo
  { code: 'ha', native: 'Hausa' }, // Hausa
  { code: 'bn', native: 'বাংলা' }, // Bengali
  { code: 'uk', native: 'Українська' }, // Ukrainian
  { code: 'fa', native: 'فارسی' }, // Persian/Farsi
  { code: 'ta', native: 'தமிழ்' }, // Tamil
  { code: 'ro', native: 'Română' }, // Romanian
  { code: 'el', native: 'Ελληνικά' }, // Greek
  { code: 'cs', native: 'Čeština' }, // Czech
  { code: 'hu', native: 'Magyar' }, // Hungarian
  { code: 'am', native: 'አማርኛ' }, // Amharic
  { code: 'ms', native: 'Melayu' }, // Malay
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

  // Button text colour changes based on background context.
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
