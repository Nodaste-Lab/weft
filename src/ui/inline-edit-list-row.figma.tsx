import { figma } from "@figma/code-connect";
import { InlineEditListRow } from "./inline-edit-list-row";

figma.connect(
  InlineEditListRow,
  "<FIGMA_NODE_URL_FOR_INLINE_EDIT_LIST_ROW>",
  {
    props: {
      text: figma.string("Text"),
      showIndex: figma.boolean("Show index"),
      italic: figma.boolean("Italic"),
    },
    example: ({ text, showIndex, italic }) => (
      <InlineEditListRow
        text={text}
        onUpdate={() => {}}
        onDelete={() => {}}
        showIndex={showIndex as unknown as boolean}
        italic={italic as unknown as boolean}
      />
    ),
  },
);
