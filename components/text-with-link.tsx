import type { FC, JSX } from "react"

interface TextWithLinksProps {
  text: string
  className?: string
}

const TextWithLinks: FC<TextWithLinksProps> = ({ text, className = "" }) => {
  // Parse text with markdown-style links: [text: url] or [text](url)
  const parseLinks = (input: string): (string | JSX.Element)[] => {
    const parts: (string | JSX.Element)[] = []
    // Match [text: url], [text](url), or [url] patterns
    const linkPattern =
      /\[([^\]]+?):\s*(https?:\/\/[^\]]+)\]|\[([^\]]+?)\]$$(https?:\/\/[^)]+)$$|\[(https?:\/\/[^\]]+)\]/g

    let lastIndex = 0
    let match

    while ((match = linkPattern.exec(input)) !== null) {
      // Add text before the link
      if (match.index > lastIndex) {
        parts.push(input.substring(lastIndex, match.index))
      }

      // Extract link text and URL (handle all three formats)
      let linkText: string
      let linkUrl: string

      if (match[1] && match[2]) {
        // Format: [text: url]
        linkText = match[1]
        linkUrl = match[2]
      } else if (match[3] && match[4]) {
        // Format: [text](url)
        linkText = match[3]
        linkUrl = match[4]
      } else {
        // Format: [url] - just the URL, so display the domain
        linkUrl = match[5]
        try {
          const url = new URL(linkUrl)
          linkText = url.hostname.replace("www.", "")
        } catch {
          linkText = "link"
        }
      }

      // Add the link element
      parts.push(
        <a
          className="text-primary hover:text-primary/80 underline underline-offset-2 transition-colors"
          href={linkUrl}
          key={match.index}
          rel="noopener noreferrer"
          target="_blank"
        >
          {linkText}
        </a>,
      )

      lastIndex = match.index + match[0].length
    }

    // Add remaining text after last link
    if (lastIndex < input.length) {
      parts.push(input.substring(lastIndex))
    }

    return parts.length > 0 ? parts : [input]
  }

  return <span className={className}>{parseLinks(text)}</span>
}

export default TextWithLinks
