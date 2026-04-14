export const Card = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 px-6 py-5">
      <p className="mb-5 text-sm font-semibold text-white/80 uppercase tracking-wider">
        {title}
      </p>
      <div className="space-y-4">{children}</div>
    </div>
  );
};