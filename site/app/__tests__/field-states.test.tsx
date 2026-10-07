// @vitest-environment jsdom
import * as React from 'react';
import { render, screen, cleanup } from '@testing-library/react';
import { afterEach, expect, it } from 'vitest';
import { FieldExamples } from '../pages/FieldExamples';
afterEach(cleanup);
for(const kind of ['input','textarea','calendar'])it(`shows labelled states and producing code for ${kind}`,()=>{render(<FieldExamples kind={kind}/>);const article=(name:string)=>screen.getByRole('heading',{name,exact:true}).closest('article')!;expect(article('Disabled').querySelector('input,textarea')).toBeDisabled();expect(article('Read only').querySelector('input,textarea')).toHaveAttribute('readonly');expect(article('Error with durable help').querySelector('input,textarea')).toHaveAttribute('aria-invalid','true');expect(article('Pending check').querySelector('input,textarea')).toHaveAttribute('aria-busy','true');for(const example of screen.getAllByRole('article'))expect(example.querySelector('code')?.textContent).toContain('<TextField');});
it('shows underline as a TextField treatment, not a separate control',()=>{render(<FieldExamples kind="input"/>);const article=screen.getByRole('heading',{name:'Underline · contextual edit'}).closest('article')!;expect(article.querySelector('.weft-text-field')).toHaveAttribute('data-treatment','underline');expect(article.querySelector('code')?.textContent).toContain('treatment="underline"');});
