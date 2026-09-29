type CardProps = {
  title: string;
  value: string;
  detail?: string;
  trend?: string;
};

export default function Card({ title, value, detail, trend }: CardProps) {
  return (
    <article className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
      <div className="flex min-h-28 flex-col justify-between gap-4">
        <div>
          <h3 className="text-sm font-medium text-gray-500">{title}</h3>
          <p className="mt-2 text-3xl font-bold text-gray-950">{value}</p>
          {detail && <p className="mt-1 text-sm text-gray-500">{detail}</p>}
        </div>
        {trend && <span className="w-fit rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">{trend}</span>}
      </div>
    </article>
  );
}
