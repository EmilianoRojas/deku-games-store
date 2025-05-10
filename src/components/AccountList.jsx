import { useState, useEffect } from 'react'
import { supabase } from '../supabaseClient'
import { Grid, Typography, Box, Button } from '@mui/material'
import './AccountList.css'

export default function AccountList() {
  const [accounts, setAccounts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedAccount, setSelectedAccount] = useState(null)
  const accountsPerPage = 12

  useEffect(() => {
    fetchAccounts()
  }, [])

  const getHighestPricedGame = (transactions) => {
    const games = transactions.filter(t => t.type === 'game')
    if (games.length === 0) return null
    return games.reduce((highest, current) => 
      current.price > highest.price ? current : highest
    )
  }

  const getGameImage = (gameName, coverImage) => {
    return `/game-covers-optimized/${coverImage}`
  }

  const fetchAccounts = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('nintendo_accounts')
        .select(`
          *,
          account_transactions (
            item_name,
            price,
            purchase_date,
            type,
            cover_image
          )
        `)

      if (error) throw error
      setAccounts(data)
    } catch (error) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  // Calculate pagination
  const indexOfLastAccount = currentPage * accountsPerPage
  const indexOfFirstAccount = indexOfLastAccount - accountsPerPage
  const currentAccounts = accounts.slice(indexOfFirstAccount, indexOfLastAccount)
  const totalPages = Math.ceil(accounts.length / accountsPerPage)

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber)
    window.scrollTo(0, 0)
  }

  const handleAccountClick = (e, account) => {
    e.preventDefault()
    e.stopPropagation()
    setSelectedAccount(account)
  }

  const closeModal = (e) => {
    if (e) {
      e.preventDefault()
      e.stopPropagation()
    }
    setSelectedAccount(null)
  }

  if (loading) return <div className="loading">Loading accounts...</div>
  if (error) return <div className="error">Error: {error}</div>

  return (
    <Box className="account-list">
      <Typography variant="h4" component="h1" gutterBottom>
        Nintendo Accounts
      </Typography>

      <Grid container spacing={3}>
        {currentAccounts.map(account => {
          const highestGame = getHighestPricedGame(account.account_transactions)
          const gameImage = highestGame ? getGameImage(highestGame.item_name, highestGame.cover_image) : null
          
          return (
            <Grid key={account.nickname} xs={12} sm={6} md={4} lg={3}>
              <div 
                className="account-card"
                onClick={(e) => handleAccountClick(e, account)}
              >
                {gameImage && (
                  <div className="game-cover">
                    <img src={gameImage} alt={highestGame?.item_name || 'No game name found'} />
                  </div>
                )}
                <div className="account-content">
                  <div className="account-header">
                    <Typography variant="h6">
                      {highestGame?.item_name || 'No game name found'}
                    </Typography>
                    <div className="account-prices">
                      <Typography variant="body2">
                        Price: ${account.final_price}
                      </Typography>
                    </div>
                  </div>
                </div>
              </div>
            </Grid>
          )
        })}
      </Grid>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <Box className="pagination">
          <Button 
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            variant="outlined"
          >
            Previous
          </Button>
          
          <Box className="page-numbers">
            {[...Array(totalPages)].map((_, index) => (
              <Button
                key={index + 1}
                onClick={() => handlePageChange(index + 1)}
                variant={currentPage === index + 1 ? "contained" : "outlined"}
              >
                {index + 1}
              </Button>
            ))}
          </Box>

          <Button 
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            variant="outlined"
          >
            Next
          </Button>
        </Box>
      )}

      {/* Account Details Modal */}
      {selectedAccount && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={closeModal}>×</button>
            <Typography variant="h5" gutterBottom>
              {selectedAccount.nickname}
            </Typography>
            
            <Box className="modal-section">
              <Typography variant="h6" gutterBottom>
                Games
              </Typography>
              <Grid container spacing={2}>
                {selectedAccount.account_transactions
                  .filter(t => t.type === 'game')
                  .map(game => (
                    <Grid key={game.item_name} xs={12} sm={6} md={4}>
                      <div className="game-item">
                        {game.cover_image && (
                          <div className="cover-container">
                            <img 
                              src={getGameImage(game.item_name, game.cover_image)} 
                              alt={game.item_name}
                            />
                          </div>
                        )}
                        <div className="game-info">
                          <Typography variant="subtitle1">
                            {game.item_name}
                          </Typography>
                          <Typography variant="body2">
                            Price: ${game.price}
                          </Typography>
                          <Typography variant="body2">
                            Purchased: {new Date(game.purchase_date).toLocaleDateString()}
                          </Typography>
                        </div>
                      </div>
                    </Grid>
                  ))}
              </Grid>
            </Box>

            <Box className="modal-section">
              <Typography variant="h6" gutterBottom>
                DLC
              </Typography>
              <Grid container spacing={2}>
                {selectedAccount.account_transactions
                  .filter(t => t.type === 'dlc')
                  .map(dlc => (
                    <Grid key={dlc.item_name} xs={12} sm={6} md={4}>
                      <div className="dlc-item">
                        <Typography variant="subtitle1">
                          {dlc.item_name}
                        </Typography>
                        <Typography variant="body2">
                          Price: ${dlc.price}
                        </Typography>
                        <Typography variant="body2">
                          Purchased: {new Date(dlc.purchase_date).toLocaleDateString()}
                        </Typography>
                      </div>
                    </Grid>
                  ))}
              </Grid>
            </Box>
          </div>
        </div>
      )}
    </Box>
  )
}