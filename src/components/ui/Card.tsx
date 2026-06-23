type CardProps = {
  title: string;
  value: string;
};

export default function Card({ title, value }: CardProps) {
  return (
    <article className="rounded-xl bg-white p-6 shadow-sm border">
      <h3 className="text-sm text-gray-500">{title}</h3>

      <p className="mt-2 text-3xl font-bold">
        {value}
      </p>
    </article>
  );
}