/**
 * Sections marked `data-skippable` are only estimates in the layout until the
 * browser renders them. Before jumping to a section, render everything above
 * it (and the section itself) so the jump lands exactly where it should.
 */
export function prepareAnchor(id: string): HTMLElement | null {
  const target = document.getElementById(id);
  if (!target) return null;
  document.querySelectorAll<HTMLElement>("[data-skippable]").forEach((section) => {
    const before = section.compareDocumentPosition(target) & Node.DOCUMENT_POSITION_FOLLOWING;
    if (before || section.contains(target)) section.style.contentVisibility = "visible";
  });
  return target;
}

/** Scroll to a section by id, rendering what's above it first. */
export function jumpTo(id: string, behavior: ScrollBehavior = "auto") {
  const target = prepareAnchor(id);
  target?.scrollIntoView({ behavior, block: "start" });
}
