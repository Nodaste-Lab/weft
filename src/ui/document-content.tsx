import * as React from 'react';
import { cn } from './utils';

export type DocumentHeadingProps = React.HTMLAttributes<HTMLHeadingElement> & { level: 1 | 2 | 3 | 4 };
export function DocumentHeading({level,className,...props}:DocumentHeadingProps) {
 const Heading=`h${level}` as 'h1'|'h2'|'h3'|'h4';
 return <Heading {...props} data-level={level} className={cn('weft-doc-heading',className)}/>;
}
export type DocumentTextProps = React.ComponentPropsWithoutRef<'p'> & { tone?: 'default'|'muted'; size?: 'body'|'lede'|'caption' };
export function DocumentText({tone='default',size='body',className,...props}:DocumentTextProps){return <p {...props} data-tone={tone} data-size={size} className={cn('weft-doc-text',className)}/>;}
export type DocumentLabelProps = React.ComponentPropsWithoutRef<'span'>;
export function DocumentLabel({className,...props}:DocumentLabelProps){return <span {...props} className={cn('weft-doc-label',className)}/>;}
export type DocumentLinkProps = React.ComponentPropsWithoutRef<'a'>;
export function DocumentLink({className,...props}:DocumentLinkProps){return <a {...props} className={cn('weft-doc-link',className)}/>;}
export type DocumentReferenceProps = React.ComponentPropsWithoutRef<'span'>;
export function DocumentReference({className,...props}:DocumentReferenceProps){return <span {...props} className={cn('weft-doc-number',className)}/>;}
export type DocumentDividerProps = React.ComponentPropsWithoutRef<'hr'>;
export function DocumentDivider({className,...props}:DocumentDividerProps){return <hr {...props} className={cn('weft-doc-divider',className)}/>;}

export type DocumentCaptionProps = React.ComponentPropsWithoutRef<'figcaption'>;
export function DocumentCaption({className,...props}:DocumentCaptionProps){return <figcaption {...props} className={cn('weft-doc-caption',className)}/>;}
export type DocumentEvidenceProps = React.ComponentPropsWithoutRef<'p'>;
/** Authored provenance; never implies verification or approval. */
export function DocumentEvidence({className,...props}:DocumentEvidenceProps){return <DocumentText {...props} tone="muted" size="caption" className={cn('weft-doc-evidence',className)}/>;}
export type DocumentFactProps = { label: string; children?: React.ReactNode; className?: string };
export function DocumentFact({label,children,className}:DocumentFactProps){return <dl className={cn('weft-doc-fact',className)}><dt><DocumentLabel>{label}</DocumentLabel></dt><dd>{children ?? '—'}</dd></dl>;}
export type DocumentPromptProps = Omit<React.ComponentPropsWithoutRef<'blockquote'>,'title'> & { label: string };
export function DocumentPrompt({label,children,className,...props}:DocumentPromptProps){return <blockquote {...props} className={cn('weft-doc-prompt',className)}><DocumentLabel>{label}</DocumentLabel>{children}</blockquote>;}
export type DocumentHeaderProps = { title: string; summary?: React.ReactNode; titleId: string; headingLevel?: 1|2|3|4 };
export function DocumentHeader({title,summary,titleId,headingLevel=1}:DocumentHeaderProps){return <header className="weft-doc-header"><DocumentHeading level={headingLevel} id={titleId}>{title}</DocumentHeading>{summary && <DocumentText size="lede">{summary}</DocumentText>}</header>;}

export type DocumentFigureProps = Omit<React.ComponentPropsWithoutRef<'figure'>,'children'> & {src:string;alt:string;caption:React.ReactNode};
export function DocumentFigure({src,alt,caption,className,...props}:DocumentFigureProps){return <figure {...props} className={cn('weft-doc-figure',className)}><img src={src} alt={alt}/><DocumentCaption>{caption}</DocumentCaption></figure>;}
export type DocumentFindingProps = React.ComponentPropsWithoutRef<'section'> & { heading: string; headingId: string; reference?: string; headingLevel?: 2|3|4 };
export function DocumentFinding({heading,headingId,reference,headingLevel=2,children,className,...props}:DocumentFindingProps){return <section {...props} className={cn('weft-doc-finding',className)} aria-labelledby={headingId}><DocumentHeading level={headingLevel} id={headingId}>{reference && <><DocumentReference>{reference}</DocumentReference>{' · '}</>}{heading}</DocumentHeading>{children}</section>;}
export type DocumentComparisonProps = React.ComponentPropsWithoutRef<'div'>;
export function DocumentComparison({className,...props}:DocumentComparisonProps){return <div {...props} className={cn('weft-doc-columns',className)}/>;}
export type DocumentTableProps = React.ComponentPropsWithoutRef<'table'> & { label: string; caption: React.ReactNode };
export function DocumentTable({label,caption,children,className,...props}:DocumentTableProps){return <div className="weft-doc-table" role="region" aria-label={label} tabIndex={0}><table {...props} className={className}><caption>{caption}</caption>{children}</table></div>;}
export type DocumentDisclosureProps = Omit<React.ComponentPropsWithoutRef<'details'>,'children'> & {summary:string;children:React.ReactNode};
export function DocumentDisclosure({summary,children,className,...props}:DocumentDisclosureProps){return <details {...props} className={cn('weft-doc-disclosure',className)}><summary>{summary}</summary><div>{children}</div></details>;}
export type DocumentCanvasProps = React.ComponentPropsWithoutRef<'article'>;
export function DocumentCanvas({className,...props}:DocumentCanvasProps){return <article {...props} className={cn('weft-doc',className)}/>;}

export type DocumentCodeProps = React.ComponentPropsWithoutRef<'code'>;
export function DocumentCode({className,...props}:DocumentCodeProps){return <code {...props} className={cn('weft-doc-code',className)}/>;}
export type DocumentCodeBlockProps = React.ComponentPropsWithoutRef<'pre'> & {label:string};
export function DocumentCodeBlock({label,children,className,...props}:DocumentCodeBlockProps){return <pre {...props} aria-label={label} tabIndex={0} className={cn('weft-doc-code-block',className)}><DocumentCode>{children}</DocumentCode></pre>;}
export type DocumentListProps = React.HTMLAttributes<HTMLOListElement | HTMLUListElement> & {ordered?:boolean};
export function DocumentList({ordered=false,className,...props}:DocumentListProps){return ordered?<ol {...props} className={cn('weft-doc-list',className)}/>:<ul {...props} className={cn('weft-doc-list',className)}/>;}
export type DocumentStatusProps = React.ComponentPropsWithoutRef<'p'> & {label:string};
/** Author-supplied status text, never a live workflow state or alert. */
export function DocumentStatus({label,children,className,...props}:DocumentStatusProps){return <DocumentText {...props} className={cn('weft-doc-status',className)}><DocumentLabel>{label}:</DocumentLabel>{' '}{children}</DocumentText>;}
export type DocumentCalloutProps = React.ComponentPropsWithoutRef<'aside'> & {label:string};
export function DocumentCallout({label,children,className,...props}:DocumentCalloutProps){return <aside {...props} role="note" aria-label={label} className={cn('weft-doc-callout',className)}><DocumentLabel>{label}</DocumentLabel>{children}</aside>;}
export type DocumentSectionProps = React.ComponentPropsWithoutRef<'section'> & {heading:string;headingId:string;headingLevel?:2|3|4};
export function DocumentSection({heading,headingId,headingLevel=2,children,className,...props}:DocumentSectionProps){return <section {...props} aria-labelledby={headingId} className={cn('weft-doc-section',className)}><DocumentHeading level={headingLevel} id={headingId}>{heading}</DocumentHeading>{children}</section>;}
