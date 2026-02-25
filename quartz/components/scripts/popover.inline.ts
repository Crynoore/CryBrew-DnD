import { computePosition, flip, inline, shift } from "@floating-ui/dom"

// from micromorph/src/utils.ts
// https://github.com/natemoo-re/micromorph/blob/main/src/utils.ts#L5
export function normalizeRelativeURLs(el: Element | Document, base: string | URL) {
  const update = (el: Element, attr: string, base: string | URL) => {
    el.setAttribute(attr, new URL(el.getAttribute(attr)!, base).pathname)
  }

  el.querySelectorAll('[href^="./"], [href^="../"]').forEach((item) => update(item, "href", base))

  el.querySelectorAll('[src^="./"], [src^="../"]').forEach((item) => update(item, "src", base))
}

const p = new DOMParser()
let activeAnchor: HTMLAnchorElement | null = null

async function mouseEnterHandler(
  this: HTMLAnchorElement,
  { clientX, clientY }: { clientX: number; clientY: number },
) {
  const link = this
  async function setPosition(popoverElement: HTMLElement) {
    const { x, y } = await computePosition(link, popoverElement, {
      strategy: "fixed",
      middleware: [inline({ x: clientX, y: clientY }), shift(), flip()],
    })
    Object.assign(popoverElement.style, {
      transform: `translate(${x.toFixed()}px, ${y.toFixed()}px)`,
    })
  }

  // dont refetch if there's already a popover
  if ([...link.children].some((child) => child.classList.contains("popover"))) {
    return setPosition(link.lastChild as HTMLElement)
  }

  const targetUrl = new URL(link.href)
  const hash = decodeURIComponent(targetUrl.hash)
  targetUrl.hash = ""
  targetUrl.search = ""
  // prevent hover of the same page
  if (thisUrl.toString() === targetUrl.toString()) return

  const contents = await fetch(`${targetUrl}`)
    .then((res) => res.text())
    .catch((err) => {
      console.error(err)
    })

  if (!contents) return
  const html = p.parseFromString(contents, "text/html")
  normalizeRelativeURLs(html, targetUrl)
  const elts = [...html.getElementsByClassName("popover-hint")]
  if (elts.length === 0) return

  const popoverElement = document.createElement("div")
  popoverElement.id = popoverId
  popoverElement.classList.add("popover")
  const popoverInner = document.createElement("div")
  popoverInner.classList.add("popover-inner")
  popoverElement.appendChild(popoverInner)
  elts.forEach((elt) => popoverInner.appendChild(elt))

  if (!!document.getElementById(popoverId)) {
    return
  }

  document.body.appendChild(popoverElement)
  if (activeAnchor !== this) {
    return
  }

  showPopover(popoverElement)
}

function clearActivePopover() {
  activeAnchor = null
  const allPopoverElements = document.querySelectorAll(".popover")
  allPopoverElements.forEach((popoverElement) => popoverElement.classList.remove("active-popover"))
}

document.addEventListener("nav", () => {
  const links = [...document.querySelectorAll("a.internal")] as HTMLAnchorElement[]
  for (const link of links) {
    link.removeEventListener("mouseenter", mouseEnterHandler)
    link.addEventListener("mouseenter", mouseEnterHandler)
  }
})
