import figma from "@figma/code-connect";

import { SignalFilterChipGroup } from "./signal-filter-chip-group";

figma.connect(SignalFilterChipGroup, "WEFT_SIGNAL_FILTER_CHIP_GROUP_NODE_ID", {
  props: {
    label: figma.string("Label"),
  },
  example: ({ label }) => (
    <SignalFilterChipGroup
      label={label}
      options={[
        { value: "all", label: "All" },
        { value: "today", label: "Today" },
        { value: "week", label: "This week" },
      ]}
      isActive={(value) => value === "today"}
      onToggle={() => undefined}
    />
  ),
});
