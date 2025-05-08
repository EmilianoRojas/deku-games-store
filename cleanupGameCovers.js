import { createClient } from '@supabase/supabase-js'
import { promises as fs } from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import dotenv from 'dotenv'

// Load environment variables from .env file
dotenv.config()

// Get the directory name in ES modules
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('Error: Supabase URL and Key are required. Please check your .env file.')
  console.error('Make sure your .env file contains SUPABASE_URL and SUPABASE_ANON_KEY')
  process.exit(1)
}

console.log('Using Supabase URL:', supabaseUrl)
console.log('Using Supabase Key:', supabaseKey.substring(0, 10) + '...')

const supabase = createClient(supabaseUrl, supabaseKey)

async function cleanupGameCovers() {
  try {
    // Get all game cover images from the database
    const { data: accounts, error } = await supabase
      .from('nintendo_accounts')
      .select(`
        account_transactions (
          cover_image
        )
      `)

    if (error) throw error

    // Create a Set of all cover images referenced in the database
    const dbCoverImages = new Set()
    accounts.forEach(account => {
      account.account_transactions.forEach(transaction => {
        if (transaction.cover_image) {
          dbCoverImages.add(transaction.cover_image)
        }
      })
    })

    // Get all files in the game-covers directory
    const gameCoversDir = path.join(__dirname, 'public', 'game-covers')
    const files = await fs.readdir(gameCoversDir)

    // Find files that aren't referenced in the database
    const unusedFiles = files.filter(file => !dbCoverImages.has(file))

    if (unusedFiles.length === 0) {
      console.log('No unused game cover images found!')
      return
    }

    console.log(`Found ${unusedFiles.length} unused game cover images:`)
    unusedFiles.forEach(file => console.log(`- ${file}`))

    // Ask for confirmation before deleting
    console.log('\nDo you want to delete these files? (yes/no)')
    process.stdin.once('data', async (data) => {
      const answer = data.toString().trim().toLowerCase()
      
      if (answer === 'yes') {
        for (const file of unusedFiles) {
          const filePath = path.join(gameCoversDir, file)
          try {
            await fs.unlink(filePath)
            console.log(`Deleted: ${file}`)
          } catch (err) {
            console.error(`Error deleting ${file}:`, err.message)
          }
        }
        console.log('\nCleanup completed!')
      } else {
        console.log('Cleanup cancelled.')
      }
      process.exit(0)
    })

  } catch (error) {
    console.error('Error:', error.message)
    process.exit(1)
  }
}

cleanupGameCovers() 