---
related:
  - text-content
  - table
  - image
  - file-header
---

# Document content

## Purpose

Optional convenience components for authored HTML. Authors may use supported native HTML and custom CSS directly; this family does not define an allowed vocabulary or require a document structure. These exports produce semantic HTML and canonical component classes; React and static HTML share one implementation and stylesheet. The HTML authoring lab provides guidance and self-contained Don’t / Do layout examples.

## When to use

Use for readable audit, proposal, research and review content inside a file renderer. Atoms are DocumentHeading, DocumentText, DocumentLabel, DocumentLink, DocumentReference, DocumentDivider and DocumentCode. Molecules include DocumentCaption, DocumentEvidence, DocumentFact, DocumentPrompt, DocumentHeader, DocumentList, DocumentStatus, DocumentCallout and DocumentCodeBlock. Organisms include DocumentFigure, DocumentFinding, DocumentComparison, DocumentTable, DocumentDisclosure and DocumentSection. DocumentCanvas supplies the scoped content surface.

## When not to use

Do not substitute these for file chrome, an editor, live service notices or application navigation. Existing TextContent, Table and Image serve application UI and interactive media; this family supplies static authored-document semantics without Tailwind or application behavior. Use FileShell around the content renderer. Use existing Weft navigation primitives when illustrating application navigation.

## How to use

```tsx
import { DocumentFinding, DocumentFact, DocumentText, DocumentPrompt } from '@nodaste-lab/weft';
<DocumentFinding headingId="existing-03" reference="Existing 03" heading="Document hierarchy">
  <DocumentFact label="Adoption">Mixed adoption</DocumentFact>
  <DocumentText>Separate disclosure and navigation.</DocumentText>
  <DocumentPrompt label="Feedback"><DocumentText>Which behavior should change?</DocumentText></DocumentPrompt>
</DocumentFinding>
```

Import tokens.css and components.css for product rendering. For authored HTML, use the same markup and embed the scoped component rules; Avalandra removes stylesheet links. The specimen generator maps canonical Weft variables onto Ava viewer variables with system fallbacks at the renderer boundary. html-document-components.json records optional convenience exports and authoring guidance.

DocumentHeading requires level 1–4. DocumentText supports body/lede/caption sizes and default/muted tones. DocumentFact renders unknown children as an em dash. Omit inapplicable facts. DocumentFinding requires heading and headingId; reference is optional and headingLevel defaults to 2. DocumentFigure requires src, alt and caption. DocumentTable requires a region label and caption; supply thead/tbody and scoped header cells. DocumentDisclosure accepts native details props and a summary string. DocumentList uses native ol when ordered, otherwise ul; supply li children. DocumentCodeBlock requires an accessible label and literal text children, preserves whitespace, and supports keyboard scrolling. DocumentStatus requires an authored label and status text; it is not an alert or a live workflow connection. DocumentCallout is a labeled aside. DocumentSection requires heading and headingId. The remaining primitives expose native element props and children. DocumentHeader defaults to h1; set headingLevel for embedded use. No fixture values are built-in defaults.

## Heuristics

Choose the smallest shared building block that serves the content. Combine them with native HTML and custom CSS as useful; content order and vocabulary remain the author’s choice. Use a comparison only when comparison is meaningful. Reference numbers identify findings; only actual sequences use ordered lists. Keep essential decisions and risks visible outside disclosures. Readable document text does not shrink with dense application chrome.

## Content

Authors supply wording, evidence, dates, current-state text, links and media. The components infer no approval, status, test results or presence. Use stable unique IDs across the page and revisions. External image URLs are removed by Ava; use supported Space blob paths or embedded raster data. Components escape text but do not sanitize arbitrary HTML or authorize URLs. The host owns sanitization, permissions, rendering, loading/error/empty states, annotations and persistence.

## Accessibility

Preserve heading order and provide meaningful alternatives and captions for figures. Native anchors and details retain keyboard behavior without custom focus or scroll handling. Tables retain captions and scoped headers inside a named, keyboard-scrollable region. Feedback prompts are blockquotes, not live alerts or forms. Test 320px reflow, zoom, themes, densities, keyboard and touch. Closed disclosures stay closed in print; essential content stays outside. Automated browser and axe checks do not replace manual assistive-technology testing in the consumer.

Use labeled flowcharts, connected cards, ordered steps or other accessible visual representations for processes and relationships. ASCII or text-art diagrams are opt-in: use them only when the user explicitly requests them.
