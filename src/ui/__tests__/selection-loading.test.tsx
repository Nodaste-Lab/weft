// @vitest-environment jsdom
import * as React from 'react';
import {render,screen,act} from '@testing-library/react';
import {it,expect,vi} from 'vitest';
import {SelectionLoading} from '../../internal/selection-loading';
it('avoids short-request flashes, explains long waits and clears timers',()=>{
 vi.useFakeTimers();try{const {rerender,unmount}=render(<SelectionLoading active/>);expect(screen.getByRole('status')).toBeEmptyDOMElement();act(()=>vi.advanceTimersByTime(199));expect(screen.queryByText('Loading options…')).toBeNull();rerender(<SelectionLoading active={false}/>);act(()=>vi.advanceTimersByTime(1000));expect(screen.queryByRole('status')).toBeNull();rerender(<SelectionLoading active/>);act(()=>vi.advanceTimersByTime(200));expect(screen.getByRole('status')).toHaveTextContent('Loading options');act(()=>vi.advanceTimersByTime(9800));expect(screen.getByRole('status')).toHaveTextContent('taking longer than usual');rerender(<SelectionLoading active={false}/>);expect(screen.queryByRole('status')).toBeNull();unmount();expect(vi.getTimerCount()).toBe(0);}finally{vi.useRealTimers();}
});

it('keeps compact feedback out of layout during the flash guard',()=>{vi.useFakeTimers();try{const {container}=render(<SelectionLoading active compact/>);expect(container).toBeEmptyDOMElement();act(()=>vi.advanceTimersByTime(200));expect(screen.getByRole('status')).toHaveTextContent('Loading options');}finally{vi.useRealTimers();}});
