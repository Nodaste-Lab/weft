// @vitest-environment jsdom
import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, within } from '@testing-library/react';
import { NavigationFileList, NavigationFileRename, useNavigationFileInteractions } from '../navigation-file-list';
import { expectA11yClean } from '../../test-support/ds-assert';
const row = (node: {label:string}, context: {depth:number}) => <button data-depth={context.depth}>{node.label}</button>;
const base = {label:'Files',expandedIds:[],onExpandedChange:vi.fn(),renderRow:row};

describe('NavigationFileList', () => {
 it('retains selected descendants and ancestors across local pages while paging siblings independently', async () => {
  const nodes=[{id:'one',label:'One'},{id:'parent',label:'Parent',children:[{id:'a',label:'A'},{id:'b',label:'B'}]},{id:'last',label:'Last'}];
  const {container}=render(<NavigationFileList {...base} nodes={nodes} pageSize={1} expandedIds={['parent']} selectedId="b" />);
  expect(screen.getByRole('button',{name:'B'})).toHaveAttribute('data-depth','1');
  expect(screen.queryByRole('button',{name:'Last'})).not.toBeInTheDocument();
  const child=screen.getByRole('list',{name:'Parent files'});
  expect(within(child).getByRole('button',{name:'Show more files'})).toBeInTheDocument();
  fireEvent.click(within(screen.getByRole('list',{name:'Files'})).getAllByRole('button',{name:'Show more files'}).at(-1)!);
  expect(screen.queryByRole('button',{name:'Last'})).not.toBeInTheDocument();
  await expectA11yClean(container);
 });
 it('renders branch loading/error feedback, Retry and server paging callbacks without changing data', () => {
  const retry=vi.fn(),more=vi.fn();const parent={id:'remote',label:'Remote',hasChildren:true};
  const {rerender}=render(<NavigationFileList {...base} nodes={[parent]} expandedIds={['remote']} getChildState={()=>'loading'} onRetry={retry} />);
  expect(screen.getByRole('status')).toHaveTextContent('Loading files');
  rerender(<NavigationFileList {...base} nodes={[parent]} expandedIds={['remote']} getChildState={()=>'error'} onRetry={retry} />);
  fireEvent.click(screen.getByRole('button',{name:'Retry'}));expect(retry).toHaveBeenCalledWith(parent);
  rerender(<NavigationFileList {...base} nodes={[]} hasMore={()=>true} onLoadMore={more} />);
  fireEvent.click(screen.getByRole('button',{name:'Show more files'}));expect(more).toHaveBeenCalledWith(null);
 });
 it('sends nested reorder once and does not intercept editing or normal keys', () => {
  const reorder=vi.fn(),move=vi.fn();const nodes=[{id:'parent',label:'Parent',children:[{id:'child',label:'Child'}]}];
  render(<NavigationFileList {...base} nodes={nodes} expandedIds={['parent']} onReorder={reorder} onMove={move} />);
  fireEvent.keyDown(screen.getByRole('button',{name:'Child'}),{key:'ArrowUp',altKey:true});expect(reorder).toHaveBeenCalledExactlyOnceWith(nodes[0].children[0],-1);
  fireEvent.keyDown(screen.getByRole('button',{name:'Child'}),{key:'m',altKey:true});expect(move).toHaveBeenCalledExactlyOnceWith(nodes[0].children[0]);
  fireEvent.keyDown(screen.getByRole('button',{name:'Child'}),{key:'ArrowDown'});expect(reorder).toHaveBeenCalledTimes(1);
 });
 it('rejects self/descendant drops and exposes valid placement without mutating nodes', () => {
  const drop=vi.fn();const nodes=[{id:'parent',label:'Parent',children:[{id:'child',label:'Child'}]},{id:'target',label:'Target'}];
  const {container}=render(<NavigationFileList {...base} nodes={nodes} expandedIds={['parent']} canDrag={()=>true} onDrop={drop} />);
  const transfer={setData:vi.fn(),effectAllowed:'',dropEffect:''};
  fireEvent.dragStart(container.querySelector('[data-file-id=parent]')!,{dataTransfer:transfer});
  fireEvent.drop(container.querySelector('[data-file-id=child]')!,{dataTransfer:transfer});expect(drop).not.toHaveBeenCalled();
  fireEvent.dragStart(container.querySelector('[data-file-id=parent]')!,{dataTransfer:transfer});
  fireEvent.dragOver(container.querySelector('[data-file-id=target]')!,{dataTransfer:transfer});expect(container.querySelector('[data-file-id=target]')).toHaveAttribute('data-drop','before');
  fireEvent.drop(container.querySelector('[data-file-id=target]')!,{dataTransfer:transfer});expect(drop).toHaveBeenCalledWith(nodes[0],nodes[1],'before');expect(nodes).toHaveLength(2);
 });
 it('selects the rename value, rejects blank commits and handles Escape', () => {
  const commit=vi.fn(),invalid=vi.fn(),cancel=vi.fn();const {rerender}=render(<NavigationFileRename label="Rename" value="File" onChange={()=>{}} onCommit={commit} onInvalid={invalid} onCancel={cancel} />);
  const input=screen.getByRole('textbox') as HTMLInputElement;expect(input.selectionStart).toBe(0);expect(input.selectionEnd).toBe(4);
  rerender(<NavigationFileRename label="Rename" value=" " onChange={()=>{}} onCommit={commit} onInvalid={invalid} onCancel={cancel} />);
  fireEvent.keyDown(input,{key:'Enter'});expect(invalid).toHaveBeenCalledOnce();expect(commit).not.toHaveBeenCalled();fireEvent.keyDown(input,{key:'Escape'});expect(cancel).toHaveBeenCalledOnce();
 });
 it('shares keyboard/context menu entry points and cancels touch long press on movement', () => {
  vi.useFakeTimers();const actions=vi.fn(),rename=vi.fn();
  function Row(){const props=useNavigationFileInteractions({onActions:actions,onRename:rename});return <div {...props}><button>File</button></div>;}
  const {unmount}=render(<Row />);const button=screen.getByRole('button');fireEvent.contextMenu(button);fireEvent.keyDown(button,{key:'F10',shiftKey:true});fireEvent.keyDown(button,{key:'F2'});expect(actions).toHaveBeenCalledTimes(2);expect(rename).toHaveBeenCalledOnce();
  const touch=()=>{const event=new Event('pointerdown',{bubbles:true});Object.defineProperty(event,'pointerType',{value:'touch'});fireEvent(button,event);};
  touch();fireEvent.pointerMove(button);vi.advanceTimersByTime(700);expect(actions).toHaveBeenCalledTimes(2);
  touch();vi.advanceTimersByTime(700);expect(actions).toHaveBeenCalledTimes(3);fireEvent.contextMenu(button);expect(actions).toHaveBeenCalledTimes(3);
  unmount();vi.useRealTimers();
 });
});
