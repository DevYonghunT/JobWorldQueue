import { useEffect, useRef } from 'react';

interface AdBannerProps {
  slot?: string;
  format?: 'auto' | 'horizontal' | 'vertical' | 'rectangle';
  className?: string;
}

export function AdBanner({ slot = '1234567890', format = 'auto', className = '' }: AdBannerProps) {
  const isLoaded = useRef(false);

  useEffect(() => {
    if (isLoaded.current) return;
    try {
      const adsbygoogle = (window as any).adsbygoogle || [];
      adsbygoogle.push({});
      isLoaded.current = true;
    } catch {
      // AdSense not loaded - show placeholder in dev
    }
  }, []);

  return (
    <div className={`w-full flex items-center justify-center ${className}`}>
      <div className="w-full">
        <ins
          className="adsbygoogle"
          style={{ display: 'block' }}
          data-ad-client="ca-pub-XXXXXXXXXX"
          data-ad-slot={slot}
          data-ad-format={format}
          data-full-width-responsive="true"
        />
        {/* Dev placeholder */}
        {import.meta.env.DEV && (
          <div className="w-full h-[60px] bg-[var(--color-surface)] rounded-[16px] flex items-center justify-center">
            <span className="text-[12px] font-body text-[var(--color-text-tertiary)]">
              AD BANNER
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
