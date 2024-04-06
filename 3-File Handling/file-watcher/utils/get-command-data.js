export function getCommandData(fileContent) {
  const prompts = fileContent.trim().toLowerCase().split(" ");
  const method = prompts.at(0);
  const file =
    method === "add" || method === "rename" ? prompts.at(-2) : prompts.at(-1);
  const payload =
    method === "add" || method === "rename" ? prompts.at(-1) : undefined;

  return { method, file, payload };
}
