---
"@nodaste-lab/weft": minor
---

Order the `aria-describedby` list error-first, in both layers (amendment A5).

`FormControl` emitted `${formDescriptionId} ${formMessageId}` — help text before the error — and the plain-CSS specimen wired the same reverse order. A5 settles the opposite: **one ordered list, error id first**, binding the React composition and the documented plain-CSS recipe alike. A field in error has one urgent thing to say and one background thing, and leading with the format hint buries the reason the value was rejected behind text the user has already read.

**Order is now asserted directly**, which is the part that had been missing. The existing guards checked that both ids were present, resolved, and were named to the convention — every one of which the wrong order satisfies perfectly. `src/ui/__tests__/form-describedby-order.test.tsx` asserts position for React and `S8b` does it page-wide for the plain-CSS recipe; both verified by reintroducing the reverse order.

`Form` goes to 1.1.0: the prop surface is unchanged but the composed `aria-describedby` a consumer renders is not.
