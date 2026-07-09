import { figma } from "@figma/code-connect";
import { RecapSectionShell } from "./recap-section-shell";

figma.connect(
  RecapSectionShell,
  "<FIGMA_NODE_URL_FOR_RECAP_SECTION_SHELL>",
  {
    props: {
      title: figma.string("Title"),
      count: figma.string("Count"),
      open: figma.boolean("Open"),
      density: figma.enum("Density", {
        Compact: "compact",
        Default: "default",
      }),
    },
    example: ({ title, count, open, density }) => (
      <RecapSectionShell
        title={title}
        count={count}
        open={open as unknown as boolean}
        onToggle={() => {}}
        density={density as "compact" | "default"}
      >
        Section body
      </RecapSectionShell>
    ),
  },
);
