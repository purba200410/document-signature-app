type Props = {
  title: string;
  value: string;
};

export default function StatCard({
  title,
  value,
}: Props) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm">
      <h3 className="text-gray-500">
        {title}
      </h3>

      <p className="text-4xl font-bold mt-3">
        {value}
      </p>
    </div>
  );
}