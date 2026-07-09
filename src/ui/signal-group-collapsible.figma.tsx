import figma from "@figma/code-connect";

import { SignalGroupCollapsible } from "./signal-group-collapsible";

figma.connect(SignalGroupCollapsible, "WEFT_SIGNAL_GROUP_COLLAPSIBLE_NODE_ID", {
  props: {
    label: figma.string("Label"),
    count: figma.boolean("Has Count", {
      true: 5,
      false: undefined,
    }),
    collapsed: figma.boolean("Collapsed"),
  },
  example: ({ label, count, collapsed }) => (
    <SignalGroupCollapsible
      groupKey="example"
      label={label}
      count={count}
      collapsed={collapsed}
      onToggle={() => undefined}
    >
      <div>group body</div>
    </SignalGroupCollapsible>
  ),
});
