export default function Table({ head, body, title }) {
  return (
    <>
      {title && <h2 className="pt-3">{title}</h2>}
      <table>
        {head}
        {body}
      </table>
    </>
  );
}
