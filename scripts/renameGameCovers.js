import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// Paths
const coversDir = path.join(__dirname, '../public/covers-code')
const mappingFile = path.join(coversDir, 'switchtdb.txt')
const renamedDir = path.join(__dirname, '../public/game-covers')

// Function to read and parse the mapping file
function readMappingFile() {
  try {
    const content = fs.readFileSync(mappingFile, 'utf8')
    const lines = content.split('\n')
    const mapping = {}

    for (const line of lines) {
      if (!line.trim() || line.startsWith('TITLES =')) continue
      const [code, name] = line.split(' = ')
      if (code && name) {
        mapping[code.trim()] = name.trim()
      }
    }

    return mapping
  } catch (error) {
    console.error('Error reading mapping file:', error.message)
    return {}
  }
}

// Function to create a safe filename
function createSafeFilename(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}

// Main function to rename files
async function renameGameCovers() {
  console.log('Starting to rename game covers...')

  // Read the mapping
  const mapping = readMappingFile()
  console.log(`Found ${Object.keys(mapping).length} game mappings`)

  // Get all PNG files in the covers directory
  const files = fs.readdirSync(coversDir)
  const imageFiles = files.filter(file => file.endsWith('.png'))

  console.log(`Found ${imageFiles.length} PNG files`)

  // Create the renamed directory if it doesn't exist
  if (!fs.existsSync(renamedDir)) {
    fs.mkdirSync(renamedDir, { recursive: true })
  }

  // Create a mapping for the AccountList component
  const gameImages = {}
  let renamedCount = 0
  let skippedCount = 0

  // Rename each file
  for (const file of imageFiles) {
    const code = path.parse(file).name
    const gameName = mapping[code]

    if (gameName) {
      const safeName = createSafeFilename(gameName)
      const newFilename = `${safeName}.png`
      
      // Move the file with the new name
      fs.renameSync(
        path.join(coversDir, file),
        path.join(renamedDir, newFilename)
      )

      // Add to the mapping
      gameImages[gameName] = `/game-covers/${newFilename}`
      
      renamedCount++
      if (renamedCount % 100 === 0) {
        console.log(`Processed ${renamedCount} files...`)
      }
    } else {
      skippedCount++
      if (skippedCount % 100 === 0) {
        console.log(`Skipped ${skippedCount} files without mapping...`)
      }
    }
  }

  // Save the mapping to a file
  fs.writeFileSync(
    path.join(__dirname, '../src/data/gameImages.js'),
    `export const gameImages = ${JSON.stringify(gameImages, null, 2)}`
  )

  // Remove the original directory if it's empty
  try {
    fs.rmdirSync(coversDir)
    console.log('Removed original directory')
  } catch (error) {
    console.log('Original directory not empty, keeping it')
  }

  console.log('Finished renaming game covers!')
  console.log(`Successfully renamed ${renamedCount} files`)
  console.log(`Skipped ${skippedCount} files without mapping`)
  console.log(`Created mapping for ${Object.keys(gameImages).length} games`)
}

renameGameCovers() 