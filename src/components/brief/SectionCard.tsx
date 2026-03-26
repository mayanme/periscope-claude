interface SectionCardProps {
  number: number;
  title: string;
  children: React.ReactNode;
  className?: string;
}

export default function SectionCard({
  number,
  title,
  children,
  className = "",
}: SectionCardProps) {
  return (
    <div className={`brief-section bg-white rounded-xl border border-gray-200 overflow-hidden ${className}`}>
      <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-100 bg-gray-50">
        <span className="flex-shrink-0 w-7 h-7 rounded-full bg-brand-600 text-white text-xs font-bold flex items-center justify-center">
          {number}
        </span>
        <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">
          {title}
        </h2>
      </div>
      <div className="p-6">{children}</div>
    </div>
  );
}
