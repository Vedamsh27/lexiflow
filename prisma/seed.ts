import 'dotenv/config'
import prisma from '../lib/prisma'

const words = [
  "abandon", "ability", "absence", "absolute", "abstract", "abundant", "academic", "accept",
  "access", "accident", "accomplish", "accurate", "achieve", "acquire", "adapt", "adequate",
  "adjacent", "advocate", "affirm", "aggressive", "agile", "allocate", "ambiguous", "ambitious",
  "analyze", "ancient", "apparent", "appreciate", "appropriate", "approximate", "arbitrary",
  "articulate", "assert", "assess", "assign", "assist", "assume", "attain", "attribute",
  "audacious", "authentic", "autonomous", "aware", "balance", "barrier", "benefit", "bias",
  "bizarre", "boisterous", "candid", "capable", "catalyst", "cautious", "chronic", "clarify",
  "coherent", "collaborate", "compelling", "competent", "complex", "concise", "confident",
  "conflict", "conform", "conscious", "consistent", "construct", "contemplate", "contrast",
  "controversial", "convenient", "conventional", "convince", "creative", "criterion", "crucial",
  "cultivate", "curious", "cynical", "decisive", "dedicate", "defend", "deliberate", "demonstrate",
  "depict", "derive", "determine", "diligent", "diminish", "diverse", "dominant", "dynamic",
  "efficient", "eloquent", "emerge", "empathy", "enhance", "enormous", "enterprise", "essential",
  "evaluate", "evident", "evolve", "explicit", "exploit", "facilitate", "flexible", "flourish",
  "formulate", "fragile", "fundamental", "generate", "genuine", "global", "gradual", "harmony",
  "hierarchy", "highlight", "hypothesis", "identify", "illustrate", "implement", "implicit",
  "improve", "incentive", "independent", "indicate", "inevitable", "influence", "innovate",
  "integrity", "intense", "interpret", "investigate", "justify", "logical", "maintain", "manifest",
  "meticulous", "minimize", "modify", "monitor", "motivate", "navigate", "negotiate", "objective",
  "obtain", "obvious", "optimistic", "organize", "overcome", "parameter", "perceive", "persistent",
  "perspective", "phenomenon", "pragmatic", "precise", "predict", "prioritize", "proactive",
  "profound", "promote", "propose", "rational", "reinforce", "relevant", "resilient", "resolve",
  "restrict", "retain", "reveal", "robust", "scrutinize", "significant", "simplify", "stimulate",
  "strategy", "subjective", "substantial", "subtle", "sufficient", "summarize", "sustainable",
  "systematic", "tenacious", "theoretical", "tolerate", "transform", "transparent", "ultimate",
  "undermine", "utilize", "validate", "variable", "versatile", "viable", "vigorous", "vulnerable",
  "ambivalent", "benevolent", "brevity", "circumspect", "clandestine", "cogent", "complacent",
  "conciliatory", "condescending", "convoluted", "copious", "credible", "daunting", "debilitate",
  "deceptive", "deference", "deliberate", "deplete", "discern", "disparate", "dissent",
  "divergent", "empathetic", "ephemeral", "equivocal", "eradicate", "esoteric", "exacerbate",
  "exemplify", "exhaustive", "expedite", "fervent", "formidable", "frugal", "futile", "gregarious",
  "hamper", "harbinger", "hubris", "imminent", "impartial", "impede", "inadvertent", "incisive",
  "incongruous", "indifferent", "indulge", "inefficient", "inherent", "innovative", "insightful",
  "intrepid", "intrinsic", "intuitive", "irrelevant", "juxtapose", "lucid", "meager", "methodical",
  "meticulous", "mitigate", "mundane", "negligent", "nuanced", "obscure", "obstinate", "paradox",
  "peripheral", "perpetuate", "pervasive", "plausible", "pragmatic", "precarious", "prevalent",
  "prodigious", "profound", "proliferate", "provisional", "prudent", "redundant", "refute",
  "relentless", "remedy", "repercussion", "resilience", "reticent", "rhetoric", "rigorous",
  "serendipity", "skeptical", "spontaneous", "steadfast", "stoic", "superficial", "suppress",
  "tangible", "tenacity", "tentative", "thorough", "transparent", "turbulent", "ubiquitous",
  "unambiguous", "undermine", "unprecedented", "vague", "verbose", "vindicate", "volatile",
  "whimsical", "zealous"
]

async function fetchDefinition(word: string): Promise<{ definition: string; example?: string } | null> {
  try {
    const res = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`)
    if (!res.ok) return null
    const data = await res.json()
    const meanings = data[0]?.meanings || []

    // Prefer adjective > verb > noun > anything else
    const preferred = ['adjective', 'verb', 'noun']
    let best = null

    for (const pos of preferred) {
      const match = meanings.find((m: { partOfSpeech: string }) => m.partOfSpeech === pos)
      if (match?.definitions?.[0]) {
        best = match.definitions[0]
        break
      }
    }

    if (!best && meanings[0]?.definitions?.[0]) {
      best = meanings[0].definitions[0]
    }

    if (!best?.definition) return null

    return {
      definition: best.definition,
      example: best.example || undefined,
    }
  } catch {
    return null
  }
}

async function main() {
  const uniqueWords = [...new Set(words)]
  let added = 0
  let skipped = 0

  for (const word of uniqueWords) {
    const result = await fetchDefinition(word)
    if (!result) {
      console.log(`⚠️  Skipped: ${word}`)
      skipped++
      continue
    }

    await prisma.word.upsert({
  where: { word },
  update: {
    definition: result.definition,
    example: result.example,
  },
  create: {
    word,
    definition: result.definition,
    example: result.example,
  },
})

    console.log(`✅ Added: ${word}`)
    added++

    // Small delay to avoid rate limiting
    await new Promise(r => setTimeout(r, 500))
  }

  console.log(`\n🎉 Done! Added: ${added}, Skipped: ${skipped}`)
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())