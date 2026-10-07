import React from "react";

export function NavigationRailAccessibility() {
  return (
    <details className="rail-lab-accessibility">
      <summary>Accessibility requirements and verification</summary>
      <h2>Navigation accessibility</h2>
      <p>
        Target: WCAG 2.2 AA. This lab has automated checks and keyboard
        interaction tests. A passing scan does not establish full conformance.
        VoiceOver, NVDA, physical touch devices and production integration still
        need acceptance testing.
      </p>
      <h3>Use it with a keyboard</h3>
      <dl>
        <dt>Move between controls</dt>
        <dd>
          Tab and Shift+Tab. Enter or Space activates a button. File names and
          expansion arrows are separate controls.
        </dd>
        <dt>Expand files and folders</dt>
        <dd>
          Activate the arrow. Its name and expanded state update. The hierarchy
          uses nested lists, not an ARIA tree, so arrow keys do not navigate
          between files.
        </dd>
        <dt>Open menus</dt>
        <dd>
          Tab to the actions button; it appears on focus. Enter opens it. Arrow
          keys move through items; Right opens a submenu, Left returns, and
          Escape dismisses it.
        </dd>
        <dt>Rename or create a file</dt>
        <dd>
          The naming field receives focus. Enter saves a nonblank name; Escape
          cancels. Focus returns to the originating control.
        </dd>
        <dt>Resize the desktop rail</dt>
        <dd>
          Focus the resize edge. Left and Right change width by 16px, or 64px with Shift; Home
          chooses the minimum and End the available maximum. The Rail width
          slider is a pointer and keyboard alternative to dragging.
        </dd>
        <dt>Phone and tablet drawer</dt>
        <dd>
          Open navigation moves focus into the drawer. Tab stays inside. Escape
          or Close dismisses it and returns focus to Open navigation. Activating
          a destination also dismisses it.
        </dd>
      </dl>
      <h3>What every composition must preserve</h3>
      <ul>
        <li>
          Every control has an accessible name and a visible keyboard focus
          indicator. Current location uses a marker, stronger text and
          aria-current, not color alone.
        </li>
        <li>
          File types, listening and locked states have text descriptions. Status
          sub-icons are previews; actual permissions come from Avalandra.
        </li>
        <li>
          Positive counts are labeled as signals or notifications. Files show
          only their own signals awaiting action; Signals alone shows both Space totals. Each
          zero count is omitted.
        </li>
        <li>
          Default, compact and dense layouts keep at least 24px targets. Drawer
          and touch controls use 44px targets. Density must never remove
          keyboard access.
        </li>
        <li>
          The file list scrolls separately. At narrow widths, navigation becomes
          a drawer. Long labels retain their full accessible name.
        </li>
        <li>
          Light and dark text must reach 4.5:1 contrast; focus and meaningful
          graphics must reach 3:1. Reduced motion and forced-color modes must
          retain usable focus and selection.
        </li>
        <li>
          Creation, rename, retry and feedback updates use status announcements.
          Errors must explain how to recover.
        </li>
      </ul>
      <h3>Reordering files</h3>
      <p>
        Retain drag-and-drop and provide keyboard-accessible move-up/down
        reordering outside the actions menu. Move up/down are intentionally
        omitted from that menu. Keyboard instructions must be discoverable;
        retain focus on the moved file and announce its new position and parent.
        Respect permissions and boundaries and explain invalid destinations.
        Also provide a non-drag pointer alternative for users unable to drag.
        The local test tree supports drag/drop, Alt+Up/Down sibling reordering,
        and Alt+M or Move… for a destination picker without dragging. Live-data
        integration and human assistive-technology acceptance remain pending.
      </p>
      <h3>Mobile menus and nested files</h3>
      <p>
        On narrow screens, file action groups use one panel at a time with a
        labeled Back control, the owning file’s name and type, and deliberate
        focus placement when entering or leaving a group. Keep targets at least
        44px. Verify no group runs offscreen and Escape dismisses predictably.
        This mobile action-menu flow works with local fixtures; human device
        acceptance remains pending.
      </p>
      <p>
        File selection is separate: preserve nested hierarchy and parent context,
        keep expansion distinct from opening a file, and expose full accessible
        names even when labels truncate. Verify deep nesting with touch, keyboard
        and screen readers before acceptance.
      </p>
      <h3>Required alternative menu entry points</h3>
      <p>
        Retain row right-click, touch long-press, Shift+F10 and the Context Menu
        key as ways to open the same permission-appropriate actions menu. Retain
        F2 to rename when allowed, with the ellipsis and Rename menu item as
        alternatives. Verify focus enters the menu or naming field, Escape
        cancels, and focus returns to the originating row control. These entry
        points are implemented locally; verify them with physical keyboards,
        touch devices and screen readers before migration.
      </p>
      <h3>Remember the desktop width</h3>
      <p>
        Restore the user’s chosen desktop rail width after refresh. Small-screen
        drawer sizing must not overwrite that preference. Returning to desktop
        restores it, subject to available space. Verify persistence with pointer
        and keyboard resizing and across desktop/drawer transitions. Desktop width restoration is stored in this browser; production preference
        integration remains separate.
      </p>
      <h3>Top-level panel behavior</h3>
      <p>
        Signals and Kanban mark the selected area while keeping Files visible
        and expanded, because they have no sidebar subsections. If a future
        top-level item has its own expandable panel, opening that panel collapses
        Files. Keep the Files heading available so users can reopen it. Panel
        controls must expose their expanded state and controlled region; never
        leave keyboard focus inside content that becomes hidden.
      </p>
      <h3>Migration requirement: destination links and remembered navigation</h3>
      <p>
        Preserve Avalandra’s existing navigation. Destinations must use native
        links with real URLs; expansion and other actions remain buttons. Enter
        activates a link; Enter or Space activates a button. Keep full accessible
        names, visible focus and aria-current for the current page.
      </p>
      <p>
        Preserve new tabs, copied links, direct URLs, Back and Forward. Space
        switching retains the tool when supported, the last opened file and
        saved Signals lens, with the existing fallback for unavailable Kanban.
        No intentional accessibility change is proposed. The lab’s preview
        buttons do not verify production routing.
      </p>
      <p>
        Before migration, verify these behaviors with a keyboard and confirm
        useful focus after navigation, history traversal and drawer dismissal.
        With VoiceOver/Safari and NVDA/Firefox or Chrome, confirm that links,
        buttons, current page and expansion states are announced correctly.
        Repeat across densities and desktop/drawer layouts.
      </p>
      <p>
        <a href="https://nodaste.hub.avalandra.com/d/1be01717-77e5-4a94-b0cc-6471a0dce868">
          Accessible destination and restoration requirements in Avalandra
        </a>
      </p>
      <h3>Verification and remaining acceptance</h3>
      <p>
        Run <code>npm run test:rail-a11y</code> while this Weft site is running
        on port 5180. The suite checks all atoms, row interaction states,
        densities, both themes, menu permission scenarios, loading/error/empty
        states, keyboard workflows, resize controls, drawer focus, responsive
        geometry, forced colors and runtime errors. Its JSON report includes
        scanner findings that still require interpretation.
      </p>
      <p>
        Before migration sign-off: test VoiceOver with Safari and NVDA with
        Firefox or Chrome; check announcements and reading order, all submenu
        paths, 200% text resize, 400% browser zoom, physical touch and switch
        input, and real loading, permission and error responses. Preview service
        actions cannot verify production behavior.
      </p>
    </details>
  );
}
