import * as React from 'react';
import { Input } from './input';
import { Textarea } from './textarea';
import { cn } from './utils';

/** A labelled form field. Validation and submission remain consumer-owned. */
export type TextFieldProps = {
  label: string;
  treatment?: 'cutout' | 'underline';
  multiline?: true | false;
  rows?: number;
  id?: string;
  name?: string;
  value?: string;
  defaultValue?: string;
  onChange?: React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>;
  onBlur?: React.FocusEventHandler<HTMLInputElement | HTMLTextAreaElement>;
  onKeyDown?: React.KeyboardEventHandler<HTMLInputElement | HTMLTextAreaElement>;
  type?: 'text' | 'email' | 'password' | 'url' | 'tel' | 'date';
  required?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  autoComplete?: string;
  inputMode?: React.HTMLAttributes<HTMLInputElement>['inputMode'];
  min?: string;
  max?: string;
  maxLength?: number;
  description?: React.ReactNode;
  error?: React.ReactNode;
  status?: React.ReactNode;
  pending?: boolean;
  action?: React.ReactNode;
  className?: string;
};

export const TextField = React.forwardRef<HTMLInputElement | HTMLTextAreaElement, TextFieldProps>(
  ({label,treatment='cutout',multiline=false,rows=3,id:suppliedId,description,error,status,pending=false,action,className,type='text',min,max,...props}, ref) => {
    const autoId=React.useId();
    const id=suppliedId??autoId;
    const invalid=!!error;
    const readOnly=!!props.readOnly && !props.disabled;
    const described=[invalid?`${id}-error`:null,status?`${id}-status`:null,description?`${id}-help`:null].filter(Boolean).join(' ')||undefined;
    const control={...props,id,'aria-invalid':invalid||undefined,'aria-busy':pending||undefined,'aria-describedby':described,placeholder:' '};
    return <div className={cn('weft-text-field',className)} data-readonly={readOnly||undefined} data-treatment={treatment} data-multiline={multiline||undefined} data-date={!multiline&&type==='date'||undefined} data-invalid={invalid||undefined}>
      <div className="weft-text-field-group">
        <div className="weft-text-field-control">
          {multiline?<Textarea state={props.disabled ? 'disabled' : readOnly ? 'readonly' : undefined} {...control} rows={rows} ref={ref as React.Ref<HTMLTextAreaElement>}/>:<Input state={props.disabled ? 'disabled' : readOnly ? 'readonly' : undefined} {...control} type={type} min={min} max={max} ref={ref as React.Ref<HTMLInputElement>}/>}
          <label htmlFor={id} title={label}>{label}</label>
        </div>
        {!multiline&&action&&<div className="weft-text-field-action">{action}</div>}
      </div>
      {invalid&&<div id={`${id}-error`} className="weft-text-field-error">{error}</div>}
      {status&&<div id={`${id}-status`} className="weft-text-field-help">{status}</div>}
      {readOnly&&<span className="weft-text-field-readonly-note" aria-hidden="true">Read only</span>}
      {description&&<div id={`${id}-help`} className="weft-text-field-help">{description}</div>}
    </div>;
  },
);
TextField.displayName='TextField';
