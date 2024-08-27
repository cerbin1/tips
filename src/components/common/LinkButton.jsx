export default function LinkButton({ children, ...props }) {
  return (
    <p className="text-blue-to-light cursor-pointer" {...props}>
      {children}
    </p>
  );
}
