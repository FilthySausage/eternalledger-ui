export const KpiCard = ({ title, value, color }: { title: string; value: number; color: string }) => (
  <div className={`card bg-${color}-50 text-${color}-800 shadow`}>
    <div className="card-body">
      <h3 className="text-lg font-bold">{title}</h3>
      <p className="text-3xl">{value}</p>
    </div>
  </div>
);