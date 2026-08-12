type InputProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
};

export default function Input({
  value,
  onChange,
  placeholder,
}: InputProps) {
  return (
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="
        w-full
        rounded-lg
        border
        px-4
        py-3
        outline-none
        focus:ring-2
        focus:ring-green-500
      "
    />
  );
}