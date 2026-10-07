// @vitest-environment jsdom
import * as React from 'react';
import {render,screen,cleanup} from '@testing-library/react';
import {afterEach,expect,it} from 'vitest';
import {InputLab} from '../pages/InputLab';
afterEach(cleanup);
it('uses shared field examples and preserves the custom workflow lab',()=>{
 render(<InputLab/>);
 expect(screen.getByRole('region',{name:'Field examples with code'})).toBeVisible();
 expect(screen.getByRole('region',{name:'Custom form workflows'})).toBeVisible();
 expect(screen.getByRole('link',{name:'TextField',exact:true})).toHaveAttribute('href','#/components/text-field');
 expect(screen.getByRole('textbox',{name:'Workspace name'}).closest('.weft-text-field')).not.toBeNull();
});
