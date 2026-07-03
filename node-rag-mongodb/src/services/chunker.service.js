export function chunkText(
  text,
  chunkSize = 500
) {

  const chunks = [];

  for (
    let i = 0;
    i < text.length;
    i += chunkSize
  ) {

    chunks.push({
      text: text.slice(i, i + chunkSize),
      chunkIndex: chunks.length,
    });

  }

  return chunks;
}