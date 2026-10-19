/** Fire-and-forget confirmation messages, rendered by <Toaster />. */
export type ToastDetail = { message: string };

export function toast(message: string) {
  window.dispatchEvent(new CustomEvent<ToastDetail>("toast", { detail: { message } }));
}

export async function copyText(text: string, confirmation: string) {
  try {
    await navigator.clipboard.writeText(text);
    toast(confirmation);
    return true;
  } catch {
    toast("Copy isn’t available here. Select the text instead.");
    return false;
  }
}
