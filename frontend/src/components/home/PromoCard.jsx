import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import './PromoCard.css';

/**
 * Promotional card with gradient background
 * @param {Object} props
 * @param {string} props.title - Promo heading
 * @param {string} props.description - Promo description
 * @param {string} props.ctaText - Call-to-action button text
 * @param {string} props.ctaLink - Navigation path
 * @param {string} [props.icon] - Icon/emoji
 * @param {string} [props.variant='blue'] - 'blue' | 'orange' | 'green' | 'purple'
 */
const PromoCard = ({ 
  title, 
  description, 
  ctaText, 
  ctaLink, 
  icon, 
  variant = 'blue' 
}) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(ctaLink);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick();
    }
  };

  return (
    <div
      className={`promo-card promo-card--${variant}`}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="button"
      aria-label={title}
    >
      {icon && <div className="promo-card__icon">{icon}</div>}
      <h3 className="promo-card__title">{title}</h3>
      <p className="promo-card__description">{description}</p>
      <span className="promo-card__cta">
        {ctaText} <ArrowRight size={16} />
      </span>
    </div>
  );
};

export default PromoCard;
