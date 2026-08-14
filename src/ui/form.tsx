"use client";

import * as React from "react";
import * as LabelPrimitive from "@radix-ui/react-label";
import { Slot } from "@radix-ui/react-slot";
import {
  Controller,
  FormProvider,
  useFormContext,
  useFormState,
  type ControllerProps,
  type FieldPath,
  type FieldValues,
} from "react-hook-form";

import { cn } from "./utils";
import { Label } from "./label";

const Form = FormProvider;

type FormFieldContextValue<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = {
  name: TName;
};

const FormFieldContext = React.createContext<FormFieldContextValue>(
  {} as FormFieldContextValue,
);

const FormField = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  ...props
}: ControllerProps<TFieldValues, TName>) => {
  return (
    <FormFieldContext.Provider value={{ name: props.name }}>
      <Controller {...props} />
    </FormFieldContext.Provider>
  );
};

const useFormField = () => {
  const fieldContext = React.useContext(FormFieldContext);
  const itemContext = React.useContext(FormItemContext);
  const { getFieldState } = useFormContext();
  const formState = useFormState({ name: fieldContext.name });
  const fieldState = getFieldState(fieldContext.name, formState);

  if (!fieldContext) {
    throw new Error("useFormField should be used within <FormField>");
  }

  const { id } = itemContext;

  return {
    id,
    name: fieldContext.name,
    formItemId: `${id}-form-item`,
    formDescriptionId: `${id}-form-item-description`,
    formMessageId: `${id}-form-item-message`,
    formStatusId: `${id}-form-item-status`,
    ...fieldState,
  };
};

type FormItemContextValue = {
  id: string;
};

const FormItemContext = React.createContext<FormItemContextValue>(
  {} as FormItemContextValue,
);

/**
 * The exposure registry (weft#16 async follow-up; widened by the board's
 * antagonistic pass). An id appears in FormControl's ONE ordered
 * aria-describedby list ONLY while its element is mounted — status,
 * description, and message alike. The original shape made only the status
 * conditional and left the description id unconditional beside it, so
 * status-without-help shipped a dangling reference the whole fixture matrix
 * happened never to compose; the message id had the same hole from the other
 * side, conditioned on error STATE rather than on a mounted element. The
 * state itself is entirely consumer-supplied — Weft evaluates nothing
 * (decision 7) and this registry carries presentation facts only.
 */
type FormExposureSlots = {
  status: boolean;
  pending: boolean;
  description: boolean;
  message: boolean;
};

type PresenceKind = "description" | "message";

type FormExposureRegistryValue = {
  slots: FormExposureSlots;
  registerStatus: (instance: object, pending: boolean) => void;
  unregisterStatus: (instance: object) => void;
  registerPresence: (kind: PresenceKind, instance: object) => void;
  unregisterPresence: (kind: PresenceKind, instance: object) => void;
};

const NO_SLOTS: FormExposureSlots = {
  status: false,
  pending: false,
  description: false,
  message: false,
};

const FormExposureRegistryContext = React.createContext<FormExposureRegistryValue>({
  slots: NO_SLOTS,
  // Outside a FormItem there is nothing to expose against; the elements still
  // render, matching their standalone behaviour.
  registerStatus: () => {},
  unregisterStatus: () => {},
  registerPresence: () => {},
  unregisterPresence: () => {},
});

// Registration must land in a LAYOUT effect: a passive effect commits the
// DOM a paint early, so a pending field could paint one frame without its
// aria-busy and describedby reference, and a settled field could paint one
// frame still busy — found by review round 1, asserted with flushSync in
// form-status.test.tsx (layout effects flush inside the synchronous commit;
// passive effects do not). On the server there is no paint and no layout
// effect: the status ELEMENT renders in the markup, and the control's
// reference attaches at hydration — a stated boundary, pinned by the SSR
// test, not a discovered one.
const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? React.useLayoutEffect : React.useEffect;

function FormItem({ className, ...props }: React.ComponentProps<"div">) {
  const id = React.useId();
  const [slots, setSlots] = React.useState<FormExposureSlots>(NO_SLOTS);
  // The status registry is keyed by instance so the singleton contract is
  // ENFORCED rather than described (review round 4): two simultaneous
  // FormStatus children would render duplicate ids and leave aria-busy to
  // layout-effect order, so a second live registration throws. A
  // re-registration of the SAME instance (a pending flip, a StrictMode
  // remount) is the ordinary update path. Description and message track
  // PRESENCE only, deliberately without the throw: retrofitting singleton
  // enforcement onto components that shipped in 1.x is a behaviour change
  // that is the owner's to take, and their doubled forms were already broken
  // markup (duplicate ids) rather than broken exposure. Everything derives
  // from the registered entries, never from whichever effect ran last.
  const statusInstancesRef = React.useRef(new Map<object, boolean>());
  const presenceRef = React.useRef<Record<PresenceKind, Set<object>>>({
    description: new Set(),
    message: new Set(),
  });
  const sync = React.useCallback(() => {
    const statuses = statusInstancesRef.current;
    const presence = presenceRef.current;
    setSlots({
      status: statuses.size > 0,
      pending: [...statuses.values()].some(Boolean),
      description: presence.description.size > 0,
      message: presence.message.size > 0,
    });
  }, []);
  const registerStatus = React.useCallback(
    (instance: object, pending: boolean) => {
      const instances = statusInstancesRef.current;
      if (!instances.has(instance) && instances.size > 0) {
        throw new Error(
          "FormStatus: one status per FormItem — the contract is replacement, not stacking. " +
            "Render a single FormStatus and change its props when the supplied state changes.",
        );
      }
      instances.set(instance, pending);
      sync();
    },
    [sync],
  );
  const unregisterStatus = React.useCallback(
    (instance: object) => {
      statusInstancesRef.current.delete(instance);
      sync();
    },
    [sync],
  );
  const registerPresence = React.useCallback(
    (kind: PresenceKind, instance: object) => {
      presenceRef.current[kind].add(instance);
      sync();
    },
    [sync],
  );
  const unregisterPresence = React.useCallback(
    (kind: PresenceKind, instance: object) => {
      presenceRef.current[kind].delete(instance);
      sync();
    },
    [sync],
  );
  const registry = React.useMemo(
    () => ({ slots, registerStatus, unregisterStatus, registerPresence, unregisterPresence }),
    [slots, registerStatus, unregisterStatus, registerPresence, unregisterPresence],
  );

  return (
    <FormItemContext.Provider value={{ id }}>
      <FormExposureRegistryContext.Provider value={registry}>
        <div
          data-slot="form-item"
          className={cn("grid gap-2", className)}
          {...props}
        />
      </FormExposureRegistryContext.Provider>
    </FormItemContext.Provider>
  );
}

/** A stable per-mount identity for registry keys. */
function useInstanceKey(): object {
  const ref = React.useRef<{ key: object } | null>(null);
  if (ref.current === null) ref.current = { key: {} };
  return ref.current.key;
}

function FormLabel({
  className,
  ...props
}: React.ComponentProps<typeof LabelPrimitive.Root>) {
  const { error, formItemId } = useFormField();

  return (
    <Label
      data-slot="form-label"
      data-error={!!error}
      className={cn("data-[error=true]:text-destructive", className)}
      htmlFor={formItemId}
      {...props}
    />
  );
}

function FormControl({ ...props }: React.ComponentProps<typeof Slot>) {
  const { error, formItemId, formDescriptionId, formMessageId, formStatusId } =
    useFormField();
  const { slots } = React.useContext(FormExposureRegistryContext);

  // A5: ONE ordered list, ERROR FIRST. A field in error has one urgent
  // thing to say and one background thing; leading with the format hint
  // buries the reason the value was rejected behind text the user has
  // already read. Order is the whole rule, which is why
  // __tests__/form-describedby-order.test.tsx asserts position rather than
  // presence — both ids in the wrong order satisfy every existence and
  // resolution check ever written against this, and did.
  //
  // Every id is included only while its ELEMENT is mounted (the board's
  // antagonistic probe: status-without-help dangled the description id when
  // only the status arm was conditional). The message additionally requires
  // the error, because a FormMessage carrying static children is help-shaped
  // content, not an error exposure. Order: error, then status (the newest
  // fact), then durable help. No shipped pair changes relative order.
  const describedby = [
    error && slots.message ? formMessageId : null,
    slots.status ? formStatusId : null,
    slots.description ? formDescriptionId : null,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <Slot
      data-slot="form-control"
      id={formItemId}
      aria-describedby={describedby || undefined}
      aria-invalid={!!error}
      // Pending exposure only: the control is marked busy while the consumer
      // says its check is in flight. Exposure, never announcement — and never
      // a claim about validity, which stays the consumer's (decision 7).
      aria-busy={slots.pending || undefined}
      // Consumer props win by Slot convention — a consumer's own
      // aria-describedby or aria-busy REPLACES the wired exposure, and with
      // it owns the whole contract for that control. A stated escape hatch,
      // pinned in form-status.test.tsx.
      {...props}
    />
  );
}

function FormDescription({ className, ...props }: React.ComponentProps<"p">) {
  const { formDescriptionId } = useFormField();
  const { registerPresence, unregisterPresence } = React.useContext(FormExposureRegistryContext);
  const instance = useInstanceKey();

  useIsomorphicLayoutEffect(() => {
    registerPresence("description", instance);
    return () => unregisterPresence("description", instance);
  }, [registerPresence, unregisterPresence, instance]);

  return (
    <p
      data-slot="form-description"
      id={formDescriptionId}
      className={cn("text-muted-foreground text-sm", className)}
      {...props}
    />
  );
}

type FormStatusTone = "ok" | "info" | "warn" | "stop";

const STATUS_TONE_CLASS: Record<FormStatusTone, string> = {
  // The same four axes as the tone tokens; the consumer's TEXT carries the
  // meaning and the colour reinforces it — never the only signal. A stop
  // tone is presentation only: whether the field is invalid stays the
  // consumer's call, through its own error machinery.
  ok: "text-[var(--weft-ok)]",
  info: "text-[var(--weft-info-text)]",
  warn: "text-[var(--weft-warn)]",
  stop: "text-[var(--weft-stop)]",
};

/**
 * Asynchronous pending/result presentation (amendment A4, in force): the
 * consumer supplies `pending` or a settled `tone` plus its own words; Weft
 * renders them in the hint slot and nothing more. Pending is text with a
 * pulsing dot — `weft-pulse`'s final keyframe is opacity 1, so under the
 * reduced-motion freeze the dot measures static-visible instead of reading
 * as a hung field. The dot is also the non-colour shape signal for pending.
 * Replacement, not stacking: one element, one stable id; staleness and
 * cancellation belong to the consumer, who decides what state to supply.
 */
function FormStatus({
  className,
  pending,
  tone,
  children,
  ...props
}: React.ComponentProps<"p"> & { pending?: boolean; tone?: FormStatusTone }) {
  const { formStatusId } = useFormField();
  const { registerStatus, unregisterStatus } = React.useContext(FormExposureRegistryContext);
  // A stable identity per mounted instance: the registry keys on it, which is
  // what lets a pending flip re-register while a genuine SECOND instance is
  // refused (one status per item — replacement, not stacking).
  const instance = useInstanceKey();

  useIsomorphicLayoutEffect(() => {
    registerStatus(instance, !!pending);
    return () => unregisterStatus(instance);
  }, [registerStatus, unregisterStatus, instance, pending]);

  return (
    <p
      data-slot="form-status"
      id={formStatusId}
      data-pending={pending ? "true" : undefined}
      data-tone={pending ? undefined : tone}
      className={cn(
        "text-sm",
        pending || !tone ? "text-muted-foreground" : STATUS_TONE_CLASS[tone],
        className,
      )}
      {...props}
    >
      {pending ? (
        <span
          data-status-dot
          aria-hidden="true"
          className="mr-1.5 inline-block size-1.5 rounded-[var(--weft-radius-dot)] bg-[var(--weft-blue)] align-[1px]"
          style={{
            animation:
              "weft-pulse var(--weft-dur-pulse, 2s) var(--weft-ease-in-out, ease-in-out) infinite",
          }}
        />
      ) : null}
      {children}
    </p>
  );
}

function FormMessage({ className, ...props }: React.ComponentProps<"p">) {
  const { error, formMessageId } = useFormField();
  const { registerPresence, unregisterPresence } = React.useContext(FormExposureRegistryContext);
  const instance = useInstanceKey();
  const body = error ? String(error?.message ?? "") : props.children;

  // Present only while actually rendering content: a bodyless FormMessage
  // returns null, and a null element referenced from aria-describedby is the
  // dangling-id class the board's probe caught on the description arm.
  const hasBody = !!body;
  useIsomorphicLayoutEffect(() => {
    if (!hasBody) return undefined;
    registerPresence("message", instance);
    return () => unregisterPresence("message", instance);
  }, [registerPresence, unregisterPresence, instance, hasBody]);

  if (!body) {
    return null;
  }

  return (
    <p
      data-slot="form-message"
      id={formMessageId}
      className={cn("text-destructive text-sm", className)}
      {...props}
    >
      {/* Error is never colour alone (WCAG 1.4.1): the message leads with an
          alert glyph. aria-hidden, so the accessible description stays the
          copy itself — the glyph is for eyes the red doesn't reach. */}
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        className="mr-1 inline-block size-3 align-[-1px]"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
      >
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="12" />
        <line x1="12" y1="16" x2="12.01" y2="16" />
      </svg>
      {body}
    </p>
  );
}

export {
  useFormField,
  Form,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
  FormStatus,
  FormField,
};
export type { FormStatusTone };
