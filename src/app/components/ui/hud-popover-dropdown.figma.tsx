import { figma } from "@figma/code-connect";
import { HudPopoverDropdown } from "./hud-popover-dropdown";

figma.connect(
  HudPopoverDropdown,
  "<FIGMA_NODE_URL_FOR_HUD_POPOVER_DROPDOWN>",
  {
    props: {
      open: figma.boolean("Open"),
      align: figma.enum("Align", {
        Start: "start",
        End: "end",
      }),
      width: figma.enum("Width", {
        Trigger: "trigger",
        Auto: "auto",
      }),
    },
    example: ({ open, align, width }) => (
      <HudPopoverDropdown
        open={open as unknown as boolean}
        onOpenChange={() => {}}
        align={align as "start" | "end"}
        width={width as "trigger" | "auto"}
        trigger={<button>Trigger</button>}
      >
        Dropdown body
      </HudPopoverDropdown>
    ),
  },
);
