export default function FormInput({ label, id, type, ...props }) {
  return (
    <p className="flex flex-col gap-2 pt-4 border-t border-r border-l border-slate-200">
      <label htmlFor={id}>{label}</label>
      <input
        id={id}
        name={id}
        type={type ? type : "text"}
        className="bg-slate-200 rounded py-2 px-1"
        {...props}
      />
    </p>
  );
}
