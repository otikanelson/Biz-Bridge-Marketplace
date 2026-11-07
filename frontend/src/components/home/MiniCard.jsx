import { useNavigate } from 'react-router-dom';
import { Star } from 'lucide-react';
import { getServiceImageUrl } from '../../utils/imageUrl';
import './MiniCard.css';

/**
 * Compact card for secondary rails
 * @param {Object} props
 * @param {Object} props.service - Service object
 */
const MiniCard = ({ service }) => {
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
      className="mini-card"
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="button"
      aria-label={`View ${service.title}`}
    >
      <img
        src={imageUrl}
        alt={service.title}
        className="mini-card__image"
      />
      
      <div className="mini-card__content">
        <p className="mini-card__category">{service.category}</p>
        <h3 className="mini-card__title">{service.title}</h3>
        
        <div className="mini-card__footer">
          <div className="mini-card__price">
            ₦{service.pricing?.basePrice?.toLocaleString() || 'N/A'}
          </div>
          
          {service.rating?.average > 0 && (
            <div className="mini-card__rating">
              <Star size={12} fill="currentColor" />
              {service.rating.average.toFixed(1)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MiniCard;
