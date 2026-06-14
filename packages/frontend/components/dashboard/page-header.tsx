import { Button } from "@/components/ui/button";

interface PageHeaderProps {
  title: string;
  description: string;
  action?: {
    label: string;
    icon: React.ElementType;
    onClick?: () => void;
    disabled?: boolean; 
  };
}

export function PageHeader({ title, description, action }: PageHeaderProps) {
  const Icon = action?.icon;

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-2xl font-bold text-foreground">{title}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      </div>
      {action && Icon ? (
        <Button
          className="gap-2 self-start sm:self-auto"
          onClick={action.onClick}
          disabled={action.disabled}
        >
          <Icon className="h-4 w-4" />
          {action.label}
        </Button>
      ) : null}
    </div>
  );
}
