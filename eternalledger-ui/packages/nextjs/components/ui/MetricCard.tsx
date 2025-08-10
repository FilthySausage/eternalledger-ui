import React from "react";

export const MetricCard = ({ label, value, hint }: { label: string; value?: React.ReactNode; hint?: string }) => {
  return (
    <div className="stats shadow bg-base-100 w-full">
      <div className="stat">
        <div className="stat-title flex items-center gap-2">
          {label}
          {hint && (
            <span className="tooltip" data-tip={hint}>
              <span className="text-xs opacity-60">ⓘ</span>
            </span>
          )}
        </div>
        <div className="stat-value text-primary text-2xl md:text-3xl">{value ?? "-"}</div>
      </div>
    </div>
  );
};

export default MetricCard;
