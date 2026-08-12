type ButtonProps = {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "primary" | "danger" | "secondary";
};

export default function Button({
  children,
  onClick,
  variant = "primary",
}: ButtonProps) {
  const styles =
    variant === "danger"
      ? `
        rounded-lg
        bg-black-600
        px-4
        py-2
        font-medium
        text-white
        transition
        hover:bg-black-700
        focus:outline-none
        focus:ring-2
        focus:ring-black-500
      `
      : variant === "secondary"
      ? `
        rounded-lg
        bg-gray-600
        px-4
        py-2
        font-medium
        text-white
        transition
        hover:bg-gray-700
        focus:outline-none
        focus:ring-2
        focus:ring-gray-500
      `
      : `
        rounded-lg
        bg-green-600
        px-4
        py-2
        font-medium
        text-white
        transition
        hover:bg-green-700
        focus:outline-none
        focus:ring-2
        focus:ring-green-500
      `;

  return (
    <button
      type="button"
      onClick={onClick}
      className={styles}
    >
      {children}
    </button>
  );
}