export function getQuizUrl(shareCode: string): string {
  if (typeof window !== "undefined") {
    return `${window.location.origin}/quiz/${shareCode}`;
  }
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://knowme.app";
  return `${appUrl}/quiz/${shareCode}`;
}

export function getResultUrl(attemptId: string): string {
  if (typeof window !== "undefined") {
    return `${window.location.origin}/result/${attemptId}`;
  }
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://knowme.app";
  return `${appUrl}/result/${attemptId}`;
}

export function getWhatsAppQuizShareUrl(creatorName: string, shareCode: string): string {
  const url = getQuizUrl(shareCode);
  const text = `Hey! Let's see how well you really know me 😏 Take my KnowMe quiz:\n\n${url}`;
  return `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
}

export function getWhatsAppResultShareUrl(
  creatorName: string,
  playerName: string,
  score: number,
  total: number,
  attemptId: string,
  shareCode: string
): string {
  const url = getQuizUrl(shareCode);
  const text = `I just scored ${score}/${total} on ${creatorName}'s KnowMe quiz! 🎯 Can you beat my score? Take it here:\n\n${url}`;
  return `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
}

export function getTelegramShareUrl(text: string, url: string): string {
  return `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`;
}

export function getTwitterShareUrl(text: string, url: string): string {
  return `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
}

export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    if (navigator?.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    // fallback
  }

  try {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.position = "fixed";
    textArea.style.left = "-9999px";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    const success = document.execCommand("copy");
    document.body.removeChild(textArea);
    return success;
  } catch {
    return false;
  }
}

export async function triggerNativeShare(data: {
  title: string;
  text: string;
  url: string;
}): Promise<boolean> {
  if (typeof navigator !== "undefined" && navigator.share) {
    try {
      await navigator.share(data);
      return true;
    } catch (err) {
      if ((err as Error).name !== "AbortError") {
        console.error("Native share failed", err);
      }
      return false;
    }
  }
  return false;
}
