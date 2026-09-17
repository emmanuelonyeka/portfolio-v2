import { readFile, readdir } from 'node:fs/promises'
import { extname, join, relative } from 'node:path'
import { fileURLToPath } from 'node:url'
import { gzipSync } from 'node:zlib'

const dist = fileURLToPath(new URL('../dist/', import.meta.url))
const limits = {
  largestJavaScript: 85 * 1024,
  totalJavaScript: 105 * 1024,
  totalCss: 15 * 1024,
  largestHtml: 5 * 1024,
}

async function walk(directory) {
  const entries = await readdir(directory, { withFileTypes: true })
  const nested = await Promise.all(
    entries.map((entry) => {
      const path = join(directory, entry.name)
      return entry.isDirectory() ? walk(path) : path
    }),
  )
  return nested.flat()
}

const files = await walk(dist)
const compressed = await Promise.all(
  files.map(async (path) => ({
    path,
    extension: extname(path),
    bytes: gzipSync(await readFile(path)).byteLength,
  })),
)
const javascript = compressed.filter((file) => file.extension === '.js')
const css = compressed.filter((file) => file.extension === '.css')
const html = compressed.filter((file) => file.extension === '.html')
const total = (items) => items.reduce((sum, item) => sum + item.bytes, 0)
const largestJs = javascript.reduce((largest, file) => Math.max(largest, file.bytes), 0)
const largestHtml = html.reduce((largest, file) => Math.max(largest, file.bytes), 0)
const problems = []

if (largestJs > limits.largestJavaScript) problems.push(`largest JavaScript chunk is ${(largestJs / 1024).toFixed(1)} KiB gzip (budget: 85 KiB)`)
if (total(javascript) > limits.totalJavaScript) problems.push(`total JavaScript is ${(total(javascript) / 1024).toFixed(1)} KiB gzip (budget: 105 KiB)`)
if (total(css) > limits.totalCss) problems.push(`total CSS is ${(total(css) / 1024).toFixed(1)} KiB gzip (budget: 15 KiB)`)
if (largestHtml > limits.largestHtml) problems.push(`largest HTML page is ${(largestHtml / 1024).toFixed(1)} KiB gzip (budget: 5 KiB)`)

for (const file of compressed.filter((item) => ['.js', '.css', '.html'].includes(item.extension))) {
  console.log(`${relative(dist, file.path)}: ${(file.bytes / 1024).toFixed(1)} KiB gzip`)
}

if (problems.length > 0) {
  console.error('\nBuild budget failed:')
  for (const problem of problems) console.error(`- ${problem}`)
  process.exitCode = 1
} else {
  console.log(`Build budgets pass: ${(total(javascript) / 1024).toFixed(1)} KiB total JS, ${(total(css) / 1024).toFixed(1)} KiB total CSS (gzip).`)
}
