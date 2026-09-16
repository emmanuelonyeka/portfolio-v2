import { rm } from 'node:fs/promises'
import { basename, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const projectRoot = fileURLToPath(new URL('../', import.meta.url))
const outputDirectory = fileURLToPath(new URL('../dist/', import.meta.url))

if (basename(outputDirectory) !== 'dist' || dirname(outputDirectory) !== projectRoot.replace(/\/$/, '')) {
  throw new Error('Refusing to clean an unexpected build directory.')
}

await rm(outputDirectory, { recursive: true, force: true })
console.log('Cleared the generated dist directory.')
