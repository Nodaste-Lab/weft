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
 * The async-pending registry (weft#16 follow-up, amendment A4 in force). A
 * mounted FormStatus registers itself so FormControl can include the status id
 * in the ONE ordered describedby list only while a status actually renders,
 * and carry aria-busy on the control only while the supplied state is
 * pending. The state itself is entirely consumer-supplied — Weft evaluates
 * nothing (decision 7) and this registry carries presentation facts only.
 */
type FormStatusRegistryValue = {
  status: { present: boolean; pending: boolean };
  register: (instance: object, pending: boolean) => void;
  unregister: (instance: object) => void;
};

const FormStatusRegistryContext = React.createContext<FormStatusRegistryValue>({
  status: { present: false, pending: false },
  // Outside a FormItem there is nothing to expose against; the element still
  // renders, matching FormDescription's behaviour.
  register: () => {},
  unregister: () => {},
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
  const [status, setStatus] = React.useState({ present: false, pending: false });
  // The registry is keyed by instance so the singleton contract is ENFORCED
  // rather than described (review round 4): two simultaneous FormStatus
  // children would render duplicate ids and leave aria-busy to layout-effect
  // order, so a second live registration throws. A re-registration of the
  // SAME instance (a pending flip, a StrictMode remount) is the ordinary
  // update path. present/pending derive from the registered entry, never
  // from whichever effect happened to run last.
  const instancesRef = React.useRef(new Map<object, boolean>());
  const register = React.useCallback((instance: object, pending: boolean) => {
    const instances = instancesRef.current;
    if (!instances.has(instance) && instances.size > 0) {
      throw new Error(
        "FormStatus: one status per FormItem — the contract is replacement, not stacking. " +
          "Render a single FormStatus and change its props when the supplied state changes.",
      );
    }
    instances.set(instance, pending);
    setStatus({ present: true, pending: [...instances.values()].some(Boolean) });
  }, []);
  const unregister = React.useCallback((instance: object) => {
    const instances = instancesRef.current;
    instances.delete(instance);
    setStatus({
      present: instances.size > 0,
      pending: [...instances.values()].some(Boolean),
    });
  }, []);
  const registry = React.useMemo(() => ({ status, register, unregister }), [status, register, unregister]);

  return (
    <FormItemContext.Provider value={{ id }}>
      <FormStatusRegistryContext.Provider value={registry}>
        <div
          data-slot="form-item"
          className={cn("grid gap-2", className)}
          {...props}
        />
      </FormStatusRegistryContext.Provider>
    </FormItemContext.Provider>
  );
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
  const { status } = React.useContext(FormStatusRegistryContext);

  // A5: ONE ordered list, ERROR FIRST. A field in error has one urgent
  // thing to say and one background thing; leading with the format hint
  // buries the reason the value was rejected behind text the user has
  // already read. Order is the whole rule, which is why
  // __tests__/form-describedby-order.test.tsx asserts position rather than
  // presence — both ids in the wrong order satisfy every existence and
  // resolution check ever written against this, and did.
  //
  // The status id joins the list only while a FormStatus renders, BETWEEN
  // error and help: the error keeps first position (A5's rationale — urgent
  // first), and the status precedes durable help because it is the newest
  // fact about the field. No shipped pair changes relative order.
  const describedby = [
    error ? formMessageId : null,
    status.present ? formStatusId : null,
    formDescriptionId,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <Slot
      data-slot="form-control"
      id={formItemId}
      aria-describedby={describedby}
      aria-invalid={!!error}
      // Pending exposure only: the control is marked busy while the consumer
      // says its check is in flight. Exposure, never announcement — and never
      // a claim about validity, which stays the consumer's (decision 7).
      aria-busy={status.pending || undefined}
      {...props}
    />
  );
}

function FormDescription({ className, ...props }: React.ComponentProps<"p">) {
  const { formDescriptionId } = useFormField();

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
  const { register, unregister } = React.useContext(FormStatusRegistryContext);
  // A stable identity per mounted instance: the registry keys on it, which is
  // what lets a pending flip re-register while a genuine SECOND instance is
  // refused (one status per item — replacement, not stacking).
  const instanceRef = React.useRef<{ key: object } | null>(null);
  if (instanceRef.current === null) instanceRef.current = { key: {} };
  const instance = instanceRef.current.key;

  useIsomorphicLayoutEffect(() => {
    register(instance, !!pending);
    return () => unregister(instance);
  }, [register, unregister, instance, pending]);

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
  const body = error ? String(error?.message ?? "") : props.children;

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
