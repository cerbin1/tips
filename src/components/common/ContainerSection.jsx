export default function ContainerSection({ children, ...props }) {
  return (
    <section
      {...props}
      className="flex flex-col text-center justify-center items-center mx-auto py-12"
    >
      {children}
    </section>
  );
}
