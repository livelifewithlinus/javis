export async function getTime(): Promise<string> {
  return new Date().toISOString();
}

export async function echo(input: string): Promise<string> {
  return input;
}
