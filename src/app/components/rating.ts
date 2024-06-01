interface RatingProps {
  value: number;
  text?: string;
}

const Rating = {
  render: (props: RatingProps): string => {
    if (!props.value) {
      return '<div></div>';
    }

    const getStarIconClass = (value: number) => {
      if (value >= 1) {
        return 'bi bi-star-fill';
      }
      if (value >= 0.5) {
        return 'bi bi-star-half';
      }
      return 'bi bi-star';
    };

    const stars = [];
    for (let i = 1; i <= 5; i += 1) {
      stars.push(`<i class="${getStarIconClass(props.value - i + 1)}"></i>`);
    }

    return `
        <div class="rating">
          <div>
            ${stars.join('')}
          </div>
          <span class="review">
            ${props.text || ''}
          </span>
        </div>
      `;
  },
};

export default Rating;
