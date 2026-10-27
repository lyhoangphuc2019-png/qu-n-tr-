import React from 'react';

interface BrandLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  whiteText?: boolean;
  hideText?: boolean;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  className = '',
  size = 'md',
  whiteText = false,
  hideText = false,
}) => {
  // Dimensions for the logo graphic
  const imgBoxSize =
    size === 'sm'
      ? 'w-10 h-10'
      : size === 'lg'
      ? 'w-14 h-14 sm:w-16 sm:h-16'
      : size === 'xl'
      ? 'w-20 h-20 sm:w-24 sm:h-24'
      : 'w-11 h-11 sm:w-12 sm:h-12';

  const titleSize =
    size === 'sm'
      ? 'text-base sm:text-lg'
      : size === 'lg'
      ? 'text-2xl sm:text-3xl'
      : size === 'xl'
      ? 'text-3xl sm:text-4xl'
      : 'text-xl sm:text-[22px]';

  const sloganSize =
    size === 'sm'
      ? 'text-[9px] sm:text-[10px]'
      : size === 'lg'
      ? 'text-xs sm:text-[13px]'
      : size === 'xl'
      ? 'text-sm sm:text-base'
      : 'text-[10.5px] sm:text-[11.5px]';

  return (
    <div className={`inline-flex items-center gap-3 select-none group ${className}`}>
      {/* Authentic Logo Graphic Badge */}
      <div
        className={`${imgBoxSize} rounded-2xl bg-[#fffef9] p-1 border border-[#ebe2d1] shadow-[0_2px_10px_rgba(14,86,63,0.06)] flex-shrink-0 flex items-center justify-center transition-all duration-300 group-hover:scale-105 group-hover:shadow-[0_4px_16px_rgba(245,158,11,0.2)] overflow-hidden`}
      >
        <img
          src="/assets/images/logo_toi_trua.png"
          alt="Logo Tới Trưa - Trưa tới, ăn chưa?"
          className="w-full h-full object-contain"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src = '/logo.png';
          }}
        />
      </div>

      {/* Brand Name & Slogan beside the image */}
      {!hideText && (
        <div className="flex flex-col justify-center">
          <div className="flex items-center gap-1.5">
            <span
              className={`font-black tracking-tight leading-none ${titleSize} ${
                whiteText ? 'text-white' : 'text-[#0e563f]'
              }`}
            >
              TỚI TRƯA
            </span>
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#f59e0b] -mt-1" />
          </div>
          <span
            className={`font-semibold italic tracking-normal mt-1 leading-tight ${sloganSize} ${
              whiteText ? 'text-[#c6e3d3]' : 'text-[#365f4e]'
            }`}
          >
            Trưa tới, ăn chưa?
          </span>
        </div>
      )}
    </div>
  );
};

