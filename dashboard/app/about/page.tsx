import { Github, Linkedin, Globe, Twitter } from "lucide-react"
import { FC } from "react"

const Page: FC = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12 max-w-3xl">
        {/* Hero */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-4 text-balance">trader-bot</h1>
          <p className="text-xl text-muted-foreground leading-relaxed">
            A fully autonomous stock-market bot that turns cutting-edge AI reasoning into real
            (paper) trades – every single week, without any human intervention.
          </p>
        </div>

        {/* How It Works */}
        <div className="mb-12 space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-2">Every Friday at 8:00 PM PST</h3>
            <p className="text-muted-foreground leading-relaxed">
              Grok-4-fast-reasoning analyzes the market using live data, financial reports, and
              social sentiment to generate a $100 stock allocation.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">Every Monday at 6:30 AM PST</h3>
            <p className="text-muted-foreground leading-relaxed">
              Those recommendations are automatically executed via the Alpaca paper-trading API.
            </p>
          </div>
        </div>

        {/* Tech Stack */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Tech Stack</h2>
          <p className="text-muted-foreground leading-relaxed">
            Next.js, Vercel, PostgreSQL, Tailwind CSS, shadcn/ui, Grok API (grok-4-fast-reasoning),
            Alpaca Sandbox API
          </p>
        </div>

        {/* Built By */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Built by Colin Franceschini</h2>
          <div className="flex flex-wrap gap-4">
            <a
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              href="https://github.com/colinfran"
              rel="noopener noreferrer"
              target="_blank"
            >
              <Github className="h-4 w-4" />
              GitHub
            </a>
            <a
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              href="https://www.linkedin.com/in/colinfranceschini/"
              rel="noopener noreferrer"
              target="_blank"
            >
              <Linkedin className="h-4 w-4" />
              LinkedIn
            </a>
            <a
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              href="https://colinfran.com/"
              rel="noopener noreferrer"
              target="_blank"
            >
              <Globe className="h-4 w-4" />
              Website
            </a>
            <a
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              href="https://x.com/colinfran"
              rel="noopener noreferrer"
              target="_blank"
            >
              <Twitter className="h-4 w-4" />X
            </a>
          </div>
        </div>

        {/* Disclaimer */}
        <p className="text-sm text-muted-foreground italic">
          This is not financial advice – it's an experiment in autonomous AI-driven investing, built
          for fun, learning, and transparency.
        </p>
      </div>
    </div>
  )
}

export default Page
