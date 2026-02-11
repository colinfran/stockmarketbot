import { currentModel } from "@/app/api/index"
import { Badge } from "@/components/ui/badge"
import { Github, Linkedin, Globe } from "lucide-react"
import Link from "next/link"
import { FC } from "react"

const Page: FC = async () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12 max-w-3xl">
        {/* Hero */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-4 text-balance">stockmarketbot</h1>
          <p className="text-xl text-muted-foreground leading-relaxed">
            A fully autonomous stock-market bot that turns cutting-edge AI reasoning into real
            (paper) trades - every single week, without any human intervention.
          </p>
        </div>

        {/* How It Works */}
        <div className="mb-12 space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-2">Every Friday at 8:00 PM PST</h3>
            <p className="text-muted-foreground leading-relaxed">
              {`The AI model (${currentModel}) analyzes the market using live data, financial reports, and
              social sentiment to generate stock recommendations (buys and possible sells) plus
              optional debit vertical spread ideas (bull call / bear put).`}
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">Every Monday at 6:30 AM PST</h3>
            <p className="text-muted-foreground leading-relaxed">
              Recommendations are executed automatically via the Alpaca paper-trading API: stock
              buys/sells first (using a $100 stock budget), then options vertical spreads (using a
              separate $100 options budget).
            </p>
          </div>
        </div>

        {/* Tech Stack */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Tech Stack</h2>
          <p className="text-muted-foreground leading-relaxed">
            {`Next.js, Vercel, PostgreSQL, Tailwind CSS, shadcn/ui, Grok API (${currentModel}),
            Alpaca Sandbox API`}
          </p>
        </div>

        {/* Built By */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Built by Colin Franceschini</h2>
          <div className="flex flex-wrap gap-4">
            <Link
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              href="https://github.com/colinfran"
              rel="noopener noreferrer"
              target="_blank"
            >
              <Badge>
                <Github className="h-4 w-4" />
                GitHub
              </Badge>
            </Link>
            <Link
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              href="https://www.linkedin.com/in/colinfranceschini/"
              rel="noopener noreferrer"
              target="_blank"
            >
              <Badge>
                <Linkedin className="h-4 w-4" />
                LinkedIn
              </Badge>
            </Link>
            <Link
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              href="https://x.com/colinfran"
              rel="noopener noreferrer"
              target="_blank"
            >
              <Badge>
                <svg
                  className="h-[10px]! w-[10px]! transition-all"
                  stroke="currentColor"
                  strokeWidth=".25px"
                  viewBox="0 0 24 24"
                  width="6px"
                >
                  <path
                    d="M14.095479,10.316482L22.286354,1h-1.940718l-7.115352,8.087682L7.551414,1H1l8.589488,12.231093L1,23h1.940717  l7.509372-8.542861L16.448587,23H23L14.095479,10.316482z M11.436522,13.338465l-0.871624-1.218704l-6.924311-9.68815h2.981339  l5.58978,7.82155l0.867949,1.218704l7.26506,10.166271h-2.981339L11.436522,13.338465z"
                    fill="currentColor"
                  />
                </svg>
                x.com
              </Badge>
            </Link>
            <Link
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              href="https://colinfran.com/"
              rel="noopener noreferrer"
              target="_blank"
            >
              <Badge>
                <Globe className="h-4 w-4" />
                Website
              </Badge>
            </Link>
          </div>
        </div>

        {/* Project Status */}
        <div className="mb-6">
          <p className="text-muted-foreground leading-relaxed">
            This project was started on November 24th, 2025. It's an experiment to see how well AI
            can autonomously generate stock trades over time. We'll continue to monitor its
            performance and share updates.
          </p>
        </div>

        {/* Disclaimer */}
        <p className="text-sm text-muted-foreground italic">
          This is not financial advice - it's an experiment in autonomous AI-driven investing, built
          for fun, learning, and transparency.
        </p>
      </div>
    </div>
  )
}

export default Page
