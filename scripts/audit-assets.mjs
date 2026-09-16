import { open, readdir, stat } from 'node:fs/promises'
import { extname, join, relative } from 'node:path'
import { fileURLToPath } from 'node:url'

const publicDir = fileURLToPath(new URL('../public/', import.meta.url))
const IMAGE_LIMIT = 100 * 1024
const PROJECT_VIDEO_LIMIT = 6 * 1024 * 1024
const MARQUEE_VIDEO_LIMIT = 2 * 1024 * 1024

async function walk(directory) {
  const entries = await readdir(directory, { withFileTypes: true })
  const files = await Promise.all(
    entries.map((entry) => {
      const path = join(directory, entry.name)
      return entry.isDirectory() ? walk(path) : path
    }),
  )
  return files.flat()
}

function signatureMatches(extension, bytes) {
  const ascii = bytes.toString('ascii')
  const hex = bytes.toString('hex')
  if (extension === '.png') return hex.startsWith('89504e470d0a1a0a')
  if (extension === '.jpg' || extension === '.jpeg') return hex.startsWith('ffd8ff')
  if (extension === '.webp') return ascii.startsWith('RIFF') && ascii.slice(8, 12) === 'WEBP'
  if (extension === '.mp4') return ascii.slice(4, 8) === 'ftyp'
  if (extension === '.webm') return hex.startsWith('1a45dfa3')
  if (extension === '.pdf') return ascii.startsWith('%PDF')
  return true
}

const files = await walk(publicDir)
const problems = []
let total = 0
let imageCount = 0
let videoCount = 0

for (const path of files) {
  const name = relative(publicDir, path).replaceAll('\\', '/')
  const extension = extname(name).toLowerCase()
  const info = await stat(path)
  total += info.size

  if (['.png', '.jpg', '.jpeg', '.webp'].includes(extension)) {
    imageCount += 1
    if (info.size > IMAGE_LIMIT) {
      problems.push(`${name}: ${(info.size / 1024).toFixed(0)} KiB exceeds the 100 KiB image budget`)
    }
  }

  if (extension === '.mp4' || extension === '.webm') {
    videoCount += 1
    const limit = name.startsWith('videos/marquee/') ? MARQUEE_VIDEO_LIMIT : PROJECT_VIDEO_LIMIT
    if (info.size > limit) {
      problems.push(`${name}: ${(info.size / 1024 / 1024).toFixed(1)} MiB exceeds its video budget`)
    }
  }

  if (['.png', '.jpg', '.jpeg', '.webp', '.mp4', '.webm', '.pdf'].includes(extension)) {
    const bytes = Buffer.alloc(16)
    const file = await open(path, 'r')
    try {
      await file.read(bytes, 0, bytes.length, 0)
    } finally {
      await file.close()
    }
    if (!signatureMatches(extension, bytes)) {
      problems.push(`${name}: file contents do not match the ${extension} extension`)
    }
  }
}

console.log(`Checked ${files.length} public files: ${imageCount} images, ${videoCount} videos, ${(total / 1024 / 1024).toFixed(2)} MiB total.`)
if (videoCount === 0) console.log('Video checks skipped: /public/videos is intentionally absent from this source package.')

if (problems.length > 0) {
  console.error('\nAsset audit failed:')
  for (const problem of problems) console.error(`- ${problem}`)
  process.exitCode = 1
} else {
  console.log('Asset formats and size budgets pass.')
}
