import { useState, useEffect } from 'react'
import { supabase } from '../supabaseClient'
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
        .order('nickname')

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

  const handleAccountClick = (account) => {
    setSelectedAccount(account)
  }

  const closeModal = () => {
    setSelectedAccount(null)
  }

  if (loading) return <div className="loading">Loading accounts...</div>
  if (error) return <div className="error">Error: {error}</div>

  return (
    <div className="account-list">
      <h1>Nintendo Accounts</h1>
      <div className="accounts-grid">
        {currentAccounts.map(account => {
          const highestGame = getHighestPricedGame(account.account_transactions)
          const gameImage = highestGame ? getGameImage(highestGame.item_name, highestGame.cover_image) : null
          
          return (
            <div 
              key={account.nickname} 
              className="account-card"
              onClick={() => handleAccountClick(account)}
            >
              {gameImage && (
                <div className="game-cover">
                  <img src={gameImage} alt={highestGame?.item_name || 'No game name found'} />
                </div>
              )}
              <div className="account-content">
                <div className="account-header">
                  <h2>{highestGame?.item_name || 'No game name found'}</h2>
                  <div className="account-prices">
                    <span>Price: ${account.final_price}</span>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="pagination">
          <button 
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="pagination-button"
          >
            Previous
          </button>
          
          <div className="page-numbers">
            {[...Array(totalPages)].map((_, index) => (
              <button
                key={index + 1}
                onClick={() => handlePageChange(index + 1)}
                className={`pagination-button ${currentPage === index + 1 ? 'active' : ''}`}
              >
                {index + 1}
              </button>
            ))}
          </div>

          <button 
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="pagination-button"
          >
            Next
          </button>
        </div>
      )}

      {/* Account Details Modal */}
      {selectedAccount && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={closeModal}>×</button>
            <h2>{selectedAccount.nickname}</h2>
            
            <div className="modal-section">
              <h3>Games</h3>
              <div className="games-grid">
                {selectedAccount.account_transactions
                  .filter(t => t.type === 'game')
                  .map(game => (
                    <div key={game.item_name} className="game-item">
                      { 
                        <div className="cover-container">
                          <img 
                            src={getGameImage(game.item_name, game.cover_image)} 
                            alt={game.item_name}
                          />
                        </div>
                      }
                      <div className="game-info">
                        <h4>{game.item_name}</h4>
                        <p>Price: ${game.price}</p>
                        <p>Purchased: {new Date(game.purchase_date).toLocaleDateString()}</p>
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            <div className="modal-section">
              <h3>DLC</h3>
              <div className="dlc-list">
                {selectedAccount.account_transactions
                  .filter(t => t.type === 'dlc')
                  .map(dlc => (
                    <div key={dlc.item_name} className="dlc-item">
                      <h4>{dlc.item_name}</h4>
                      <p>Price: ${dlc.price}</p>
                      <p>Purchased: {new Date(dlc.purchase_date).toLocaleDateString()}</p>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}