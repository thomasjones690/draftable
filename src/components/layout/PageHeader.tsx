interface Props {
  title: string;
  action?: React.ReactNode;
}

export const PageHeader: React.FC<Props> = ({ title, action }) => {
  return (
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-2xl sm:text-3xl font-bold dark:text-white">
        {title}
      </h1>
      {action}
    </div>
  );
}; 