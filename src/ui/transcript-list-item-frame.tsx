import * as React from "react";

import { cn } from "./utils";

export type TranscriptListItemFrameProps = React.ComponentPropsWithoutRef<"div"> & {
  /** Top row: speaker dot, names, trailing clock/actions */
  header: React.ReactNode;
  /** Main transcript text */
  body: React.ReactNode;
  /** Tags row, speaker select, etc. */
  footer?: React.ReactNode;
};

/**
 * Layout shell for a single transcript/highlight/pinned line — header meta row,
 * body text, optional footer controls. Keeps list rhythm aligned across tabs.
 */
function TranscriptListItemFrame({
  className,
  header,
  body,
  footer,
  ...props
}: TranscriptListItemFrameProps) {
  return (
    <div
      data-slot="transcript-list-item-frame"
      className={cn(
        "flex flex-col gap-2 border-b border-[var(--hud-border)] px-3 py-2.5",
        className,
      )}
      {...props}
    >
      {header}
      {body}
      {footer ? footer : null}
    </div>
  );
}

export { TranscriptListItemFrame };
