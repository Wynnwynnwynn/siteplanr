import React from 'react';

type CardVariant = 'elevated' | 'outlined' | 'filled';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant;
  clickable?: boolean;
  children: React.ReactNode;
}

interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

interface CardBodyProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

const variantClasses: Record<CardVariant, string> = {
  elevated: 'bg-neutral-0 dark:bg-neutral-800 shadow-md hover:shadow-lg',
  outlined:
    'bg-neutral-0 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700',
  filled: 'bg-neutral-100 dark:bg-neutral-800',
};

/**
 * Card Component
 *
 * Flexible container component for grouping related content.
 * Supports multiple variants, clickable state, and composable sections.
 *
 * @example
 * <Card variant="elevated">
 *   <Card.Header>Title</Card.Header>
 *   <Card.Body>Content</Card.Body>
 *   <Card.Footer>Footer</Card.Footer>
 * </Card>
 */
export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ variant = 'elevated', clickable = false, className, children, ...props }, ref) => {
    const classes = [
      'rounded-lg transition-all duration-200',
      variantClasses[variant],
      clickable && 'cursor-pointer hover:scale-105',
      className,
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <div ref={ref} className={classes} {...props}>
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';

/**
 * Card.Header - Header section of the card
 */
const CardHeader = React.forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={`px-lg py-md border-b border-neutral-200 dark:border-neutral-700 ${className || ''}`}
      {...props}
    >
      {children}
    </div>
  )
);

CardHeader.displayName = 'Card.Header';

/**
 * Card.Body - Main content section of the card
 */
const CardBody = React.forwardRef<HTMLDivElement, CardBodyProps>(
  ({ className, children, ...props }, ref) => (
    <div ref={ref} className={`px-lg py-lg ${className || ''}`} {...props}>
      {children}
    </div>
  )
);

CardBody.displayName = 'Card.Body';

/**
 * Card.Footer - Footer section of the card
 */
const CardFooter = React.forwardRef<HTMLDivElement, CardFooterProps>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={`px-lg py-md border-t border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 rounded-b-lg ${className || ''}`}
      {...props}
    >
      {children}
    </div>
  )
);

CardFooter.displayName = 'Card.Footer';

// Attach sub-components
Card.Header = CardHeader;
Card.Body = CardBody;
Card.Footer = CardFooter;

export default Card;
