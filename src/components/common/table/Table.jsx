export default function Table({ head, body }) {
  return (
    <table className="mt-4">
      {head}
      <tbody>{body}</tbody>
    </table>
  );
}
