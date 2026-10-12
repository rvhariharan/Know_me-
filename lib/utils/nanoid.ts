export function generateShareCode(length: number = 6): string {
  const chars = "23456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz"; // removed lookalikes 0, O, 1, I, l
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export function generateCreatorToken(): string {
  return "cr_" + Math.random().toString(36).substring(2, 12) + Date.now().toString(36);
}
