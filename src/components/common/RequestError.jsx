export default function RequestError({ content }) {
  let output;
  if (content) {
    output = (
      <p className="py-3 my-3 px-12 text-red-600 border border-red-300 border-dashed rounded">
        {content}
      </p>
    );
  }
  return output;
}
