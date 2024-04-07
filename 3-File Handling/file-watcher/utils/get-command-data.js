export function getCommandData(fileContent) {
  const prompts = fileContent.trim().toLowerCase().split(" ");
  const method = prompts.at(0);
  const file =
    method === "rename"
      ? prompts.at(-2)
      : method === "add"
      ? prompts.at(4)
      : prompts.at(-1);
  const payload =
    method === "rename"
      ? prompts.at(-1)
      : method === "add"
      ? prompts.slice(5).join(" ")
      : undefined;

  return { method, file, payload };
}
