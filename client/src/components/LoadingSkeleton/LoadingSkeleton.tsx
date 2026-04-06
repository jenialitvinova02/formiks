import './LoadingSkeleton.scss';

interface Props {
  rows?: number;
}

export const LoadingSkeleton: React.FC<Props> = ({ rows = 3 }) => (
  <div className="loadingSkeleton" aria-hidden="true">
    {Array.from({ length: rows }).map((_, index) => (
      <div key={index} className="loadingSkeleton__row" />
    ))}
  </div>
);

export default LoadingSkeleton;
