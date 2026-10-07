import * as React from 'react';
import { PageTitle } from './shared';
import systemSource from './InputSystemExamples.tsx?raw';
import { FieldExamples, FieldCode } from './FieldExamples';
import { FieldFamilyGuide, ControlUsageGuide } from './FieldFamilyGuide';
import { FieldActionExamples } from './FieldActionExamples';
import { FormExamples } from './FormExamples';
import { InputSystemExamples } from './InputSystemExamples';
import './input-lab.css';

export function InputLab() {
  return <div className="input-lab">
    <PageTitle eyebrow="Input lab" title="Make each field clear" summary="Use the shared TextField composition for forms, then choose the related control or interaction for the task."/>
    <p><a href="#/components/text-field">TextField</a> · <a href="#/components/input">Input controls</a> · <a href="#/components/form">Form guidance</a></p>
    <FieldFamilyGuide kind="input"/>
    <FieldExamples kind="input"/>
    <ControlUsageGuide/>
    <FieldActionExamples/>
    <FormExamples/>
    <section className="input-lab-section" aria-label="Custom form workflows">
      <h2>Custom form workflows</h2>
      <p>These examples use the individual Form helpers for specialized layouts, password reveal, prefixes, conditional questions, and asynchronous checks. They share the same cutout structure as TextField.</p>
      <InputSystemExamples/>
      <FieldCode code={systemSource}/>
    </section>
  </div>;
}
