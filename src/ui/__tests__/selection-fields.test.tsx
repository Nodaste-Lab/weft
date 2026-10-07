// @vitest-environment jsdom
import * as React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { expect, it, vi } from 'vitest';
import { Combobox } from '../combobox';
import { MultiSelect } from '../multi-select';
import { axe } from 'jest-axe';
const options=[{value:'a',label:'Avery',description:'Designer'},{value:'j',label:'Jordan'},{value:'x',label:'Unavailable',disabled:true}];
it('commits a known single value, submits its ID, and restores trigger focus',async()=>{
 function Demo(){const [value,setValue]=React.useState<string|null>(null);return <form aria-label="Demo"><Combobox label="Person" name="person" options={options} value={value} onValueChange={setValue} clearable/></form>;}
 render(<Demo/>);const trigger=screen.getByRole('button',{name:'Person Choose an option'});fireEvent.click(trigger);await waitFor(()=>expect(screen.getByRole('combobox')).toHaveFocus());fireEvent.change(screen.getByRole('combobox'),{target:{value:'Jordan'}});fireEvent.keyDown(screen.getByRole('combobox'),{key:'Enter'});await waitFor(()=>expect(trigger).toHaveTextContent('Jordan'));expect(new FormData(screen.getByRole('form') as HTMLFormElement).get('person')).toBe('j');await waitFor(()=>expect(trigger).toHaveFocus());fireEvent.click(trigger);expect(screen.getByRole('combobox')).toHaveValue('');fireEvent.click(screen.getByRole('button',{name:'Clear selection'}));expect(trigger).toHaveTextContent('Choose an option');
});
it('keeps selected values while filtering a multi-choice list and exposes checked states',async()=>{
 function Demo(){const [value,setValue]=React.useState<string[]>(['a']);return <form aria-label="Demo"><MultiSelect label="People" name="people" options={options} value={value} onValueChange={setValue}/></form>;}
 render(<Demo/>);const trigger=screen.getByRole('button',{name:'People Avery'});fireEvent.click(trigger);expect(screen.getByRole('checkbox',{name:'Avery'})).toBeChecked();expect(screen.getByRole('checkbox',{name:'Unavailable'})).toBeDisabled();fireEvent.change(screen.getByRole('searchbox'),{target:{value:'Jordan'}});fireEvent.click(screen.getByRole('checkbox',{name:'Jordan'}));expect(new FormData(screen.getByRole('form') as HTMLFormElement).getAll('people')).toEqual(['a','j']);fireEvent.click(screen.getByRole('button',{name:'Done'}));await waitFor(()=>expect(trigger).toHaveFocus());expect(trigger).toHaveTextContent('Avery, Jordan');
});
it('associates errors before durable help and omits absent help',()=>{render(<Combobox label="Person" options={options} value={null} onValueChange={()=>{}} error="Choose a person." description="Only members appear."/>);const trigger=screen.getByRole('button');expect(trigger).toHaveAttribute('aria-invalid','true');expect(trigger.getAttribute('aria-describedby')?.split(' ').map(id=>document.getElementById(id)?.textContent)).toEqual(['Choose a person.','Only members appear.']);});
it('has accessible open searchable single and multiple pickers',async()=>{const {unmount}=render(<Combobox label="Person" options={options} value="a" onValueChange={()=>{}}/>);fireEvent.click(screen.getByRole('button'));expect((await axe(document.body, {rules:{region:{enabled:false}}})).violations).toEqual([]);unmount();render(<MultiSelect label="People" options={options} value={['a']} onValueChange={()=>{}}/>);fireEvent.click(screen.getByRole('button'));expect((await axe(document.body, {rules:{region:{enabled:false}}})).violations).toEqual([]);});

it('keeps a valid listbox relationship during loading',async()=>{render(<Combobox label="Person" options={[]} value={null} onValueChange={()=>{}} loading/>);fireEvent.click(screen.getByRole('button'));const input=screen.getByRole('combobox');expect(document.getElementById(input.getAttribute('aria-controls')!)).toHaveAttribute('role','listbox');await waitFor(()=>expect(screen.getByRole('status')).toHaveTextContent('Loading options'));expect((await axe(document.body,{rules:{region:{enabled:false}}})).violations).toEqual([]);});

it('shows loading beneath a closed picker even when a value is selected',async()=>{const {rerender}=render(<Combobox label="Person" options={options} value="a" onValueChange={()=>{}} loading/>);expect(screen.getByRole('button')).toHaveTextContent('Avery');await waitFor(()=>expect(screen.getByRole('status')).toHaveTextContent('Loading options'));rerender(<MultiSelect label="People" options={options} value={['a']} onValueChange={()=>{}} loading/>);expect(screen.getByRole('button')).toHaveTextContent('Avery');await waitFor(()=>expect(screen.getByRole('status')).toHaveTextContent('Loading options'));});

it('retains closed loading feedback when an open field becomes disabled',async()=>{const props={label:'Person',options,value:'a',onValueChange:()=>{},loading:true};const {rerender}=render(<Combobox {...props}/>);fireEvent.click(screen.getByRole('button'));rerender(<Combobox {...props} disabled/>);await waitFor(()=>expect(screen.queryByRole('dialog')).toBeNull());await waitFor(()=>expect(screen.getByRole('status')).toHaveTextContent('Loading options'));});

it('names search and results and reopens on the committed choice',async()=>{
 const changed=vi.fn();render(<Combobox label="Person" options={options} value="j" onValueChange={changed}/>);
 fireEvent.keyDown(screen.getByRole('button'),{key:'ArrowDown'});
 const search=await screen.findByRole('combobox',{name:'Search Person'});
 expect(screen.getByRole('listbox',{name:'Person'})).toBeInTheDocument();
 await waitFor(()=>expect(screen.getByRole('option',{name:/Jordan.*Selected/})).toHaveAttribute('data-selected','true'));
 fireEvent.keyDown(search,{key:'Enter'});expect(changed).toHaveBeenCalledWith('j');
});
it('moves focus to multi search before clearing the selection',()=>{
 function Demo(){const [value,setValue]=React.useState(['a']);return <MultiSelect label="People" options={options} value={value} onValueChange={setValue}/>;}
 render(<Demo/>);fireEvent.click(screen.getByRole('button'));const clear=screen.getByRole('button',{name:'Clear selection'});clear.focus();fireEvent.click(clear);expect(screen.getByRole('searchbox')).toHaveFocus();expect(clear).toBeDisabled();
});
it.each(['single','multiple'])('does not reopen %s after disabling and enabling',async(kind)=>{
 const props={label:'People',options,onValueChange:()=>{}};
 const field=(disabled:boolean)=>kind==='single'?<Combobox {...props} value="a" disabled={disabled}/>:<MultiSelect {...props} value={['a']} disabled={disabled}/>;
 const {rerender}=render(field(false));fireEvent.click(screen.getByRole('button'));rerender(field(true));rerender(field(false));expect(screen.queryByRole('dialog')).toBeNull();
});
it('does not search opaque IDs and distinguishes an empty catalog from no matches',()=>{
 render(<Combobox label="Person" options={options} value={null} onValueChange={()=>{}}/>);fireEvent.click(screen.getByRole('button'));fireEvent.change(screen.getByRole('combobox'),{target:{value:'j'}});expect(screen.queryByRole('option',{name:/Avery/})).toBeNull();fireEvent.change(screen.getByRole('combobox'),{target:{value:'opaque-id'}});expect(screen.getByText('No matching options.')).toBeInTheDocument();
});
it('uses honest missing-label and empty-catalog feedback',()=>{
 const {rerender}=render(<Combobox label="Person" options={[]} value="secret-id" onValueChange={()=>{}} loading/>);expect(screen.getByRole('button')).toHaveTextContent('1 selected');expect(screen.queryByText('secret-id')).toBeNull();rerender(<Combobox label="Person" options={[]} value={null} onValueChange={()=>{}}/>);fireEvent.click(screen.getByRole('button'));expect(screen.getByText('No options available.')).toBeInTheDocument();
});
it('excludes opaque IDs from substring matching',()=>{
 render(<Combobox label="Person" options={[{value:'opaque-id',label:'Avery'}]} value={null} onValueChange={()=>{}}/>);fireEvent.click(screen.getByRole('button'));fireEvent.change(screen.getByRole('combobox'),{target:{value:'opaque'}});expect(screen.queryByRole('option')).toBeNull();expect(screen.getByText('No matching options.')).toBeInTheDocument();
});
