import React from 'react';

type HeadingLevel = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
type BodySize = 'lg' | 'md' | 'sm';
type LabelSize = 'lg' | 'md' | 'sm';

interface HeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
  level?: HeadingLevel;
  children: React.ReactNode;
}

interface BodyProps extends React.HTMLAttributes<HTMLParagraphElement> {
  size?: BodySize;
  children: React.ReactNode;
}

interface LabelProps extends React.HTMLAttributes<HTMLLabelElement> {
  size?: LabelSize;
  children: React.ReactNode;
  htmlFor?: string;
}

interface CaptionProps extends React.HTMLAttributes<HTMLSpanElement> {
  children: React.ReactNode;
}

const headingClasses: Record<HeadingLevel, string> = {
  h1: 'text-h1 font-bold text-neutral-900 dark:text-neutral-50',
  h2: 'text-h2 font-bold text-neutral-900 dark:text-neutral-50',
  h3: 'text-h3 font-bold text-neutral-900 dark:text-neutral-50',
  h4: 'text-h4 font-bold text-neutral-900 dark:text-neutral-50',
  h5: 'text-h5 font-semibold text-neutral-900 dark:text-neutral-50',
  h6: 'text-h6 font-semibold text-neutral-900 dark:text-neutral-50',
};

const bodyClasses: Record<BodySize, string> = {
  lg: 'text-body_lg text-neutral-700 dark:text-neutral-300',
  md: 'text-body_md text-neutral-700 dark:text-neutral-300',
  sm: 'text-body_sm text-neutral-600 dark:text-neutral-400',
};

const labelClasses: Record<LabelSize, string> = {
  lg: 'text-label_lg font-medium text-neutral-800 dark:text-neutral-200',
  md: 'text-label_md font-medium text-neutral-800 dark:text-neutral-200',
  sm: 'text-label_sm font-medium text-neutral-800 dark:text-neutral-200',
};

/**
 * Heading Component
 *
 * Semantic heading element with predefined typography scale.
 *
 * @example
 * <Heading level="h1">Main Title</Heading>
 * <Heading level="h2">Section Title</Heading>
 */
export const Heading = React.forwardRef<HTMLHeadingElement, HeadingProps>(
  ({ level = 'h1', className, children, ...props }, ref) => {
    const classes = [headingClasses[level], className].filter(Boolean).join(' ');

    const Component = level as React.ElementType;
    return (
      <Component ref={ref} className={classes} {...props}>
        {children}
      </Component>
    );
  }
);

Heading.displayName = 'Heading';

/**
 * Body Text Component
 *
 * Paragraph text with multiple size options.
 *
 * @example
 * <Body size="md">Regular paragraph text</Body>
 * <Body size="sm">Small supporting text</Body>
 */
export const Body = React.forwardRef<HTMLParagraphElement, BodyProps>(
  ({ size = 'md', className, children, ...props }, ref) => (
    <p ref={ref} className={[bodyClasses[size], className].filter(Boolean).join(' ')} {...props}>
      {children}
    </p>
  )
);

Body.displayName = 'Body';

/**
 * Label Component
 *
 * Form label with semantic HTML support.
 *
 * @example
 * <Label size="md" htmlFor="input">Input Label</Label>
 */
export const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
  ({ size = 'md', className, children, ...props }, ref) => (
    <label ref={ref} className={[labelClasses[size], className].filter(Boolean).join(' ')} {...props}>
      {children}
    </label>
  )
);

Label.displayName = 'Label';

/**
 * Caption Component
 *
 * Small supporting text for additional context.
 *
 * @example
 * <Caption>This is a helpful note</Caption>
 */
export const Caption = React.forwardRef<HTMLSpanElement, CaptionProps>(
  ({ className, children, ...props }, ref) => (
    <span
      ref={ref}
      className={['text-caption text-neutral-500 dark:text-neutral-400', className]
        .filter(Boolean)
        .join(' ')}
      {...props}
    >
      {children}
    </span>
  )
);

Caption.displayName = 'Caption';

/**
 * Typography namespace
 *
 * Convenient namespace for accessing all typography components.
 */
export const Typography = {
  Heading,
  Body,
  Label,
  Caption,
};

export default Typography;
