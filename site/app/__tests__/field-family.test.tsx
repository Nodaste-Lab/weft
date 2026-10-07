// @vitest-environment jsdom
import * as React from 'react';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { afterEach, expect, it } from 'vitest';
import { FieldFamilyGuide } from '../pages/FieldFamilyGuide';
afterEach(cleanup);
it('associates the multiline cutout label and durable help',()=>{render(<FieldFamilyGuide kind="textarea"/>);const field=screen.getByRole('textbox',{name:'Description'});expect(field.tagName).toBe('TEXTAREA');expect(field.closest('.weft-text-field')).toHaveAttribute('data-multiline','true');expect(document.getElementById(field.getAttribute('aria-describedby')!)).toHaveTextContent('Include the context');});
it('filters the search example and clearing restores results and focus',()=>{render(<FieldFamilyGuide kind="search-field"/>);const field=screen.getByRole('searchbox',{name:'Search example documents'});fireEvent.change(field,{target:{value:'unknown'}});expect(screen.getByRole('status')).toHaveTextContent('No documents match.');fireEvent.click(screen.getByRole('button',{name:'Clear example document search'}));expect(field).toHaveValue('');expect(field).toHaveFocus();expect(screen.getByRole('status')).toHaveTextContent('2 matching documents');});
it('labels native date entry and links the related field patterns',()=>{render(<FieldFamilyGuide kind="calendar"/>);const field=screen.getByLabelText('Due date (optional)');expect(field).toHaveAttribute('type','date');expect(field.closest('.weft-text-field')).toHaveAttribute('data-date','true');for(const name of ['TextField · forms','Textarea','Search field','Date entry and calendar'])expect(screen.getByRole('link',{name,exact:true})).toHaveAttribute('href');});
