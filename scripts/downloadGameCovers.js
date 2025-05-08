import fs from 'fs'
import path from 'path'
import axios from 'axios'
import { fileURLToPath } from 'url'
import { supabase } from '../src/supabaseClient.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// Function to get unique game names from database
async function getUniqueGames() {
  try {
    const { data, error } = await supabase
      .from('account_transactions')
      .select('item_name')
      .eq('type', 'game')
      .order('item_name')

    if (error) throw error

    // Get unique game names
    const uniqueGames = [...new Set(data.map(item => item.item_name))]
    console.log(`Found ${uniqueGames.length} unique games in the database`)
    return uniqueGames
  } catch (error) {
    console.error('Error fetching games:', error.message)
    return []
  }
}

// Create images directory if it doesn't exist
const imagesDir = path.join(__dirname, '../public/game-covers')
if (!fs.existsSync(imagesDir)) {
  fs.mkdirSync(imagesDir, { recursive: true })
}

// Function to download an image
async function downloadImage(url, filename) {
  try {
    const response = await axios({
      url,
      method: 'GET',
      responseType: 'stream'
    })

    const writer = fs.createWriteStream(path.join(imagesDir, filename))
    response.data.pipe(writer)

    return new Promise((resolve, reject) => {
      writer.on('finish', resolve)
      writer.on('error', reject)
    })
  } catch (error) {
    console.error(`Error downloading ${filename}:`, error.message)
  }
}

// Function to search for game cover
async function searchGameCover(gameName) {
  try {
    const searchQuery = `${gameName} nintendo switch game cover front`
    const response = await axios.get(`https://duckduckgo.com/?q=${encodeURIComponent(searchQuery)}&iax=images&ia=images&format=json`)
    
    if (response.data.ImageResults && response.data.ImageResults[0]) {
      const imageUrl = response.data.ImageResults[0].Image
      const filename = `${gameName.toLowerCase().replace(/[^a-z0-9]/g, '-')}.jpg`
      await downloadImage(imageUrl, filename)
      console.log(`Downloaded cover for ${gameName}`)
      return filename
    }
  } catch (error) {
    console.error(`Error searching for ${gameName}:`, error.message)
  }
  return null
}

// Main function to download all covers
async function downloadAllCovers() {
  console.log('Starting to download game covers...')
  
  const games = await getUniqueGames()
  const results = {}
  
  for (const game of games) {
    if (!game) continue // Skip null or undefined game names
    const filename = await searchGameCover(game)
    if (filename) {
      results[game] = `/game-covers/${filename}`
    }
  }

  // Save the mapping to a JSON file
  fs.writeFileSync(
    path.join(__dirname, '../src/data/gameImages.js'),
    `export const gameImages = ${JSON.stringify(results, null, 2)}`
  )

  console.log('Finished downloading game covers!')
}

downloadAllCovers() 