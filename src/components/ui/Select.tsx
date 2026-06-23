type SelectProps = {
  value: string;
  onChange: (value: string) => void;
};

export default function Select({
  value,
  onChange,
}: SelectProps) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="
        w-full
        rounded-lg
        border
        px-4
        py-3
        outline-none
        focus:ring-2
        focus:ring-blue-500
      "
    >
      <option value="Active">
        Active
      </option>

      <option value="Inactive">
        Inactive
      </option>
    </select>
  );
}