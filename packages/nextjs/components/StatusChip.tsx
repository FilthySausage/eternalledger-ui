export const StatusChip = ({ status }: { status: "alive" | "deceased" | "pending" }) => {
  const colors = { alive: "green", deceased: "red", pending: "amber" };
  return <span className={`badge badge-${colors[status]}`}>{status}</span>;
};