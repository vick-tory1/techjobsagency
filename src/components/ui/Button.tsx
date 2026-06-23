type ButtonProps = {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "primary" | "danger";
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
        bg-red-600
        px-4
        py-2
        font-medium
        text-white
        transition
        hover:bg-red-700
        focus:outline-none
        focus:ring-2
        focus:ring-red-500
      `
      : `
        rounded-lg
        bg-blue-600
        px-4
        py-2
        font-medium
        text-white
        transition
        hover:bg-blue-700
        focus:outline-none
        focus:ring-2
        focus:ring-blue-500
      `;

  return (
    <button
      onClick={onClick}
      className={styles}
    >
      {children}
    </button>
  );
}