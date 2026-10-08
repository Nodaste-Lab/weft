// @vitest-environment jsdom
import * as React from 'react';
import {render,screen,cleanup} from '@testing-library/react';
import {afterEach,it,expect} from 'vitest';
import {renderToStaticMarkup} from 'react-dom/server';
import * as D from '../document-content';
import {expectA11yClean} from '../../test-support/ds-assert';
afterEach(cleanup);
it('keeps semantic heading levels, native links and explicit unknown facts',()=>{
 render(<><D.DocumentHeading level={3}>Finding</D.DocumentHeading><D.DocumentLink href="#source">Evidence</D.DocumentLink><D.DocumentFact label="Deployment"/></>);
 expect(screen.getByRole('heading',{level:3})).toHaveTextContent('Finding');
 expect(screen.getByRole('link',{name:'Evidence'})).toHaveAttribute('href','#source');expect(screen.getByText('—')).toBeVisible();
});
it('renders the same static structure for React and authored HTML without application controls',()=>{
 const html=renderToStaticMarkup(<D.DocumentCanvas><D.DocumentHeader title="Review" titleId="audit-title"/><D.DocumentFinding headingId="finding-title" heading="Hierarchy" reference="Existing 03"><D.DocumentText>Independent actions.</D.DocumentText><D.DocumentPrompt label="Feedback"><D.DocumentText>Which action?</D.DocumentText></D.DocumentPrompt></D.DocumentFinding></D.DocumentCanvas>);
 expect(html).toContain('class="weft-doc"');expect(html).toContain('aria-labelledby="finding-title"');expect(html).toContain('<blockquote');expect(html).not.toMatch(/<(button|script|input|form)\b/);
});
it('preserves host focus on mount and native disclosure semantics',()=>{
 const input=document.createElement('input');document.body.append(input);input.focus();
 const {container}=render(<D.DocumentDisclosure summary="Context"><D.DocumentText>Background</D.DocumentText></D.DocumentDisclosure>);
 expect(document.activeElement).toBe(input);expect(container.querySelector('details')).not.toHaveAttribute('open');expect(container.querySelector('summary')).toHaveTextContent('Context');input.remove();
});
it('composes accessible figures, finding regions and semantic data tables',async()=>{
 const {container}=render(<D.DocumentCanvas><D.DocumentHeader title="Review" titleId="a11y-title"/><D.DocumentFinding headingId="a11y-finding" heading="Existing sidebar"><D.DocumentFigure src="/capture.jpg" alt="Sidebar with document tree" caption="Reference capture"/><D.DocumentTable label="Evidence" caption="Observed results"><thead><tr><th scope="col">Criterion</th></tr></thead><tbody><tr><td>Keyboard access</td></tr></tbody></D.DocumentTable></D.DocumentFinding></D.DocumentCanvas>);
 expect(screen.getByRole('region',{name:'Existing sidebar'})).toBeVisible();expect(screen.getByRole('img')).toHaveAccessibleName('Sidebar with document tree');expect(screen.getByRole('columnheader')).toHaveTextContent('Criterion');await expectA11yClean(container);
});
it('keeps ordered steps, code and authored status accessible',async()=>{
 const {container}=render(<D.DocumentCanvas><D.DocumentHeading level={1}>Review notes</D.DocumentHeading><D.DocumentStatus label="Status">Open</D.DocumentStatus><D.DocumentSection heading="Review steps" headingId="steps"><D.DocumentList ordered><li>Open document</li><li>Review evidence</li></D.DocumentList><D.DocumentCodeBlock label="Example configuration">{'title: Review notes\nstatus: draft'}</D.DocumentCodeBlock><D.DocumentCallout label="Evidence limit"><D.DocumentText>Additional evidence is pending.</D.DocumentText></D.DocumentCallout></D.DocumentSection></D.DocumentCanvas>);
 expect(container.querySelector('ol')).toBeTruthy();expect(screen.getAllByRole('listitem')).toHaveLength(2);
 expect(screen.getByRole('region',{name:'Review steps'})).toBeVisible();
 expect(screen.getByLabelText('Example configuration')).toHaveAttribute('tabindex','0');
 expect(screen.queryByRole('alert')).toBeNull();await expectA11yClean(container);
});
