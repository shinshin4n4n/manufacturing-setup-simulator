import React from 'react';

export interface CardProps {
  title?: string;
  description?: string;
  children?: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({
  title,
  description,
  children,
  className = '',
  onClick,
}) => {
  const baseStyles = 'bg-white rounded-lg shadow-md transition-all duration-200';
  const hoverStyles = onClick ? 'hover:shadow-lg hover:scale-[1.02] cursor-pointer' : '';
  const paddingStyles = 'p-6';

  const cardClasses = [baseStyles, hoverStyles, paddingStyles, className]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={cardClasses} onClick={onClick}>
      {title && (
        <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
      )}
      {description && (
        <p className="text-gray-600 text-sm mb-4">{description}</p>
      )}
      {children && <div className="mt-4">{children}</div>}
    </div>
  );
};
