"use client";
import * as React from "react";
import { LoaderCircle } from "lucide-react";

/** Delay the indicator, never the results. Compact status is used while the picker is closed. */
export function SelectionLoading({ active, compact = false }: { active: boolean; compact?: boolean }) {
  const [visible, setVisible] = React.useState(false);
  const [extended, setExtended] = React.useState(false);
  React.useEffect(() => {
    setVisible(false);
    setExtended(false);
    if (!active) return;
    const reveal = setTimeout(() => setVisible(true), 200);
    const explain = setTimeout(() => setExtended(true), 10000);
    return () => { clearTimeout(reveal); clearTimeout(explain); };
  }, [active]);
  if (!active || (compact && !visible)) return null;
  return <div className={`weft-selection-loading${compact ? " weft-selection-loading-compact" : ""}`} data-visible={visible || undefined}>
    <div role="status" aria-atomic="true">
      {visible && <>{!compact && <LoaderCircle className="weft-selection-loading-spinner" size={20} aria-hidden="true" />}
        <div><p className="weft-selection-loading-title">Loading options…</p>
          {(!compact || extended) && <p className="weft-selection-help">{extended ? (compact ? "This is taking longer than usual. Try again if options do not appear." : "This is taking longer than usual. You can close this picker and try again.") : "Preparing choices for you."}</p>}
        </div></>}
    </div>
    {visible && !compact && <div className="weft-selection-loading-lines" aria-hidden="true"><span /><span /><span /></div>}
  </div>;
}
