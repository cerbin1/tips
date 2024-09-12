export default function ValidationError({ content }) {
  let output;
  if (content) {
    output = <p className="py-3 my-3 px-12 text-red-600">{content}</p>;
  }
  return output;
}
