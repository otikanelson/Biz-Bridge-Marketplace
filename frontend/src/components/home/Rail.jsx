import { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import './Rail.css';

/**
 * Horizontal scrolling rail component with arrow navigation
 * @param {Object} props
 * @param {string} props.title - Rail heading
 * @param {React.ReactNode} props.children - Card components to display
 * @param {string} [props.variant='default'] - 'default' | 'compact' for rail height
 */
const Rail = ({ title, children, variant = 'default' }) => {
  const scrollContainerRef = useRef(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);

  // Check scroll position and update arrow visibility
  const updateArrowVisibility = () => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const { scrollLeft, scrollWidth, clientWidth } = container;
    
    setShowLeftArrow(scrollLeft > 0);
    setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 1);
  };

  // Set up observers and event listeners
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    // Initial check
    updateArrowVisibility();

    // Watch for resize and content changes
    const resizeObserver = new ResizeObserver(() => {
      updateArrowVisibility();
    });
    resizeObserver.observe(container);

    // Watch for scroll
    container.addEventListener('scroll', updateArrowVisibility);

    return () => {
      resizeObserver.disconnect();
      container.removeEventListener('scroll', updateArrowVisibility);
    };
  }, [children]); // Re-run when children change

  const scroll = (direction) => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const scrollAmount = container.clientWidth * 0.8; // Scroll 80% of visible width
    const newScrollLeft = direction === 'left' 
      ? container.scrollLeft - scrollAmount
      : container.scrollLeft + scrollAmount;

    container.scrollTo({
      left: newScrollLeft,
      behavior: 'smooth'
    });
  };

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowLeft') {
      scroll('left');
    } else if (e.key === 'ArrowRight') {
      scroll('right');
    }
  };

  return (
    <div className={`rail rail--${variant}`}>
      <div className="rail__header">
        <h2 className="rail__title">{title}</h2>
      </div>

      <div className="rail__wrapper">
        {showLeftArrow && (
          <button
            className="rail__arrow rail__arrow--left"
            onClick={() => scroll('left')}
            onKeyDown={handleKeyDown}
            aria-label="Scroll left"
          >
            <ChevronLeft size={24} />
          </button>
        )}

        <div 
          ref={scrollContainerRef}
          className="rail__scroll-container"
          tabIndex={0}
          onKeyDown={handleKeyDown}
          role="region"
          aria-label={`${title} carousel`}
        >
          <div className="rail__content">
            {children}
          </div>
        </div>

        {showRightArrow && (
          <button
            className="rail__arrow rail__arrow--right"
            onClick={() => scroll('right')}
            onKeyDown={handleKeyDown}
            aria-label="Scroll right"
          >
            <ChevronRight size={24} />
          </button>
        )}
      </div>
    </div>
  );
};

export default Rail;
