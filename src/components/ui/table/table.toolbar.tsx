

interface TableToolbarProps {
  children: ReactNode;
  className?: string;
  spacing?: 'compact' | 'normal' | 'relaxed';
}

const TableToolbar = ({
  children,
  className = '',
  spacing = 'normal',
}: TableToolbarProps) => {
  const spacingClasses = {
    compact: 'space-y-2',
    normal: 'space-y-4',
    relaxed: 'space-y-6',
  };

  return (
    <div className={`mb-6 ${spacingClasses[spacing]} ${className}`}>
      {children}
    </div>
  );
};

export default TableToolbar;