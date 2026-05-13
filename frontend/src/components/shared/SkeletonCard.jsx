export default function SkeletonCard({ height = 60 }) {
  return (
    <div className="card card-pad">
      <div className="skeleton" style={{ height: 10, width: '40%', marginBottom: 12 }} />
      <div className="skeleton" style={{ height, width: '65%', marginBottom: 8 }} />
      <div className="skeleton" style={{ height: 10, width: '55%' }} />
    </div>
  );
}
