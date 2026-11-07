import { useNavigate } from 'react-router-dom';
import { Star } from 'lucide-react';
import { getServiceImageUrl } from '../../utils/imageUrl';
import './HeroCard.css';

/**
 * Large hero card for featured services
 * @param {Object} props
 * @param {Object} props.service - Service object with title, category, pricing, rating, images, provider
 * @param {string} [props.badge] - Optional badge text (e.g., "FEATURED", "TOP RATED")
 */
const HeroCard = ({ service, badge }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/services/${service._id}`);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick();
    }
  };

  const imageUrl = getServiceImageUrl(service);

  return (
    <div
      className="hero-card"
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="button"
      aria-label={`View ${service.title}`}
    >
      <img
        src={imageUrl}
        alt={service.title}
        className="hero-card__image"
      />
      
      {badge && (
        <div className="hero-card__badge">{badge}</div>
      )}

      <div className="hero-card__overlay">
        <p className="hero-card__category">{service.category}</p>
        <h3 className="hero-card__title">{service.title}</h3>
        
        {service.provider && (
          <p className="hero-card__provider">
            by {service.provider.businessName || service.provider.name}
          </p>
        )}

        <div className="hero-card__footer">
          <div className="hero-card__price">
            ₦{service.pricing?.basePrice?.toLocaleString() || 'N/A'}
          </div>
          
          {service.rating?.average > 0 && (
            <div className="hero-card__rating">
              <Star size={16} fill="currentColor" />
              {service.rating.average.toFixed(1)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HeroCard;
