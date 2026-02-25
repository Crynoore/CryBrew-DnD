import { QuartzComponentConstructor, QuartzComponentProps } from "./types"
import legacyStyle from "./styles/legacyToc.scss"
import modernStyle from "./styles/toc.scss"

// @ts-ignore
import script from "./scripts/toc.inline"

interface Options {
  layout: "modern" | "legacy"
}

const defaultOptions: Options = {
  layout: "modern",
}

function TableOfContents({ fileData, displayClass }: QuartzComponentProps) {
  if (!fileData.toc) {
    return null
  }

  return (
    <div class={`toc ${displayClass}`}>
      <button type="button" id="toc">
        <h3>Table of Contents</h3>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="fold"
        >
          {fileData.toc.map((tocEntry) => (
            <li key={tocEntry.slug} class={`depth-${tocEntry.depth}`}>
              <a href={`#${tocEntry.slug}`} data-for={tocEntry.slug}>
                {tocEntry.text}
              </a>
            </li>
          ))}
        </OverflowList>
      </div>
    )
  }

  TableOfContents.css = modernStyle
  TableOfContents.afterDOMLoaded = concatenateResources(script, overflowListAfterDOMLoaded)

function LegacyTableOfContents({ fileData }: QuartzComponentProps) {
  if (!fileData.toc) {
    return null
  }

  return (
    <details id="toc" open>
      <summary>
        <h3>Table of Contents</h3>
      </summary>
      <ul>
        {fileData.toc.map((tocEntry) => (
          <li key={tocEntry.slug} class={`depth-${tocEntry.depth}`}>
            <a href={`#${tocEntry.slug}`} data-for={tocEntry.slug}>
              {tocEntry.text}
            </a>
          </li>
        ))}
      </ul>
    </details>
  )
}
LegacyTableOfContents.css = legacyStyle

  return layout === "modern" ? TableOfContents : LegacyTableOfContents
}) satisfies QuartzComponentConstructor
