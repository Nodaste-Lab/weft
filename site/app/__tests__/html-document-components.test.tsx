// @vitest-environment jsdom
import * as React from 'react';
import {render,screen,cleanup,fireEvent} from '@testing-library/react';
import {afterEach,it,expect} from 'vitest';
import {HtmlDocumentComponents} from '../pages/HtmlDocumentComponents';
afterEach(cleanup);
it('offers authoring guidance and concrete layout comparisons without a wrapper catalog',()=>{
 render(<HtmlDocumentComponents/>);
 expect(screen.getByRole('button',{name:'Authoring guide'})).toHaveAttribute('aria-pressed','true');
 for(const name of ['Elements','Content examples','Specimen document'])expect(screen.queryByRole('button',{name})).toBeNull();
 expect(screen.getByRole('heading',{name:'Compose freely'})).toBeVisible();
 fireEvent.click(screen.getByRole('button',{name:'Layout examples'}));
 expect(screen.getByRole('heading',{name:'Pair callout colors'})).toBeVisible();
 expect(screen.getAllByRole('heading',{name:'Don’t'})).toHaveLength(11);
 expect(screen.getAllByRole('heading',{name:'Do'})).toHaveLength(11);
 expect(screen.getByText(/Local failure fixture/)).toBeVisible();
});
