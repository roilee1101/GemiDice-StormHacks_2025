
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {Dice1, Dice2, Dice3, Dice4, Dice5, Dice6, RotateCcw, History, Plus, Minus} from 'lucide-react'
import toast from 'react-hot-toast'

interface DiceRoll {
  id: string
  dice: string
  count: number
  modifier: number
  results: number[]
  total: number
  timestamp: Date
}

const DiceRoller = () => {
  const [selectedDie, setSelectedDie] = useState('d20')
  const [diceCount, setDiceCount] = useState(1)
  const [modifier, setModifier] = useState(0)
  const [isRolling, setIsRolling] = useState(false)
  const [lastRoll, setLastRoll] = useState<DiceRoll | null>(null)
  const [rollHistory, setRollHistory] = useState<DiceRoll[]>([])
  const [showHistory, setShowHistory] = useState(false)

  const diceTypes = [
    { name: 'd4', sides: 4, color: 'from-red-400 to-red-600' },
    { name: 'd6', sides: 6, color: 'from-orange-400 to-orange-600' },
    { name: 'd8', sides: 8, color: 'from-yellow-400 to-yellow-600' },
    { name: 'd10', sides: 10, color: 'from-green-400 to-green-600' },
    { name: 'd12', sides: 12, color: 'from-blue-400 to-blue-600' },
    { name: 'd20', sides: 20, color: 'from-purple-400 to-purple-600' },
    { name: 'd100', sides: 100, color: 'from-pink-400 to-pink-600' }
  ]

  const getDiceIcon = (value: number) => {
    const icons = [Dice1, Dice2, Dice3, Dice4, Dice5, Dice6]
    const IconComponent = icons[Math.min(value - 1, 5)]
    return IconComponent || Dice6
  }

  const rollDice = (sides: number) => {
    return Math.floor(Math.random() * sides) + 1
  }

  const handleRoll = () => {
    if (isRolling) return

    setIsRolling(true)
    
    setTimeout(() => {
      const selectedDieData = diceTypes.find(d => d.name === selectedDie)
      if (!selectedDieData) return

      const results = Array.from({ length: diceCount }, () => rollDice(selectedDieData.sides))
      const total = results.reduce((sum, result) => sum + result, 0) + modifier

      const roll: DiceRoll = {
        id: Date.now().toString(),
        dice: selectedDie,
        count: diceCount,
        modifier,
        results,
        total,
        timestamp: new Date()
      }

      setLastRoll(roll)
      setRollHistory(prev => [roll, ...prev.slice(0, 19)]) // Keep last 20 rolls
      setIsRolling(false)

      // Special messages for critical rolls
      if (selectedDie === 'd20') {
        if (results[0] === 20) {
          toast.success('🎉 Natural 20! Critical Success!')
        } else if (results[0] === 1) {
          toast.error('💀 Natural 1! Critical Failure!')
        }
      }
    }, 1000)
  }

  const clearHistory = () => {
    setRollHistory([])
    toast.success('Roll history cleared')
  }

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">Digital Dice Roller</h1>
          <p className="text-xl text-gray-300">Roll the dice and let fate decide your adventure</p>
        </div>

        {/* Dice Selection */}
        <div className="bg-black/30 backdrop-blur-sm border border-purple-500/20 rounded-2xl p-6 mb-8">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">Choose Your Dice</h2>
          <div className="grid grid-cols-4 md:grid-cols-7 gap-4 mb-6">
            {diceTypes.map((die) => (
              <motion.button
                key={die.name}
                onClick={() => setSelectedDie(die.name)}
                className={`relative p-4 rounded-xl transition-all duration-200 ${
                  selectedDie === die.name
                    ? 'ring-2 ring-purple-500 bg-purple-500/20'
                    : 'hover:bg-white/10'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className={`w-12 h-12 bg-gradient-to-br ${die.color} rounded-lg flex items-center justify-center mx-auto mb-2 shadow-lg`}>
                  <span className="text-white font-bold text-lg">{die.name}</span>
                </div>
                <p className="text-white text-sm font-semibold">{die.name}</p>
              </motion.button>
            ))}
          </div>

          {/* Dice Count and Modifier */}
          <div className="flex flex-col md:flex-row gap-6 items-center justify-center">
            <div className="flex items-center gap-4">
              <label className="text-purple-300 font-semibold">Count:</label>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setDiceCount(Math.max(1, diceCount - 1))}
                  className="w-8 h-8 bg-purple-600 hover:bg-purple-700 rounded-lg flex items-center justify-center transition-colors"
                >
                  <Minus className="w-4 h-4 text-white" />
                </button>
                <span className="text-white font-bold text-xl w-8 text-center">{diceCount}</span>
                <button
                  onClick={() => setDiceCount(Math.min(10, diceCount + 1))}
                  className="w-8 h-8 bg-purple-600 hover:bg-purple-700 rounded-lg flex items-center justify-center transition-colors"
                >
                  <Plus className="w-4 h-4 text-white" />
                </button>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <label className="text-purple-300 font-semibold">Modifier:</label>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setModifier(modifier - 1)}
                  className="w-8 h-8 bg-purple-600 hover:bg-purple-700 rounded-lg flex items-center justify-center transition-colors"
                >
                  <Minus className="w-4 h-4 text-white" />
                </button>
                <span className="text-white font-bold text-xl w-12 text-center">
                  {modifier >= 0 ? `+${modifier}` : modifier}
                </span>
                <button
                  onClick={() => setModifier(modifier + 1)}
                  className="w-8 h-8 bg-purple-600 hover:bg-purple-700 rounded-lg flex items-center justify-center transition-colors"
                >
                  <Plus className="w-4 h-4 text-white" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Roll Button and Result */}
        <div className="text-center mb-8">
          <motion.button
            onClick={handleRoll}
            disabled={isRolling}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-12 py-6 rounded-2xl font-bold text-2xl transition-all duration-200 transform hover:scale-105 shadow-lg mb-8"
            whileTap={{ scale: 0.95 }}
          >
            {isRolling ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="flex items-center gap-3"
              >
                <RotateCcw className="w-8 h-8" />
                Rolling...
              </motion.div>
            ) : (
              `Roll ${diceCount}${selectedDie}${modifier !== 0 ? (modifier >= 0 ? `+${modifier}` : modifier) : ''}`
            )}
          </motion.button>

          {/* Last Roll Result */}
          <AnimatePresence>
            {lastRoll && (
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
                className="bg-black/30 backdrop-blur-sm border border-purple-500/20 rounded-2xl p-8"
              >
                <h3 className="text-2xl font-bold text-white mb-4">Roll Result</h3>
                <div className="flex flex-wrap justify-center gap-4 mb-6">
                  {lastRoll.results.map((result, index) => {
                    const DiceIcon = getDiceIcon(result)
                    return (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex flex-col items-center"
                      >
                        <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-pink-400 rounded-xl flex items-center justify-center mb-2 shadow-lg">
                          <DiceIcon className="w-8 h-8 text-white" />
                        </div>
                        <span className="text-white font-bold text-xl">{result}</span>
                      </motion.div>
                    )
                  })}
                </div>
                <div className="text-center">
                  <p className="text-gray-300 mb-2">
                    {lastRoll.count}{lastRoll.dice}
                    {lastRoll.modifier !== 0 && ` ${lastRoll.modifier >= 0 ? '+' : ''}${lastRoll.modifier}`}
                  </p>
                  <p className="text-4xl font-bold text-white">Total: {lastRoll.total}</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Roll History */}
        <div className="bg-black/30 backdrop-blur-sm border border-purple-500/20 rounded-2xl p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-bold text-white">Roll History</h3>
            <div className="flex gap-2">
              <button
                onClick={() => setShowHistory(!showHistory)}
                className="flex items-center gap-2 text-purple-300 hover:text-purple-200 transition-colors"
              >
                <History className="w-5 h-5" />
                {showHistory ? 'Hide' : 'Show'} History
              </button>
              {rollHistory.length > 0 && (
                <button
                  onClick={clearHistory}
                  className="text-red-400 hover:text-red-300 transition-colors"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {showHistory && (
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {rollHistory.length === 0 ? (
                <p className="text-gray-400 text-center py-8">No rolls yet. Start rolling to see your history!</p>
              ) : (
                rollHistory.map((roll) => (
                  <div
                    key={roll.id}
                    className="flex justify-between items-center bg-black/20 rounded-lg p-3"
                  >
                    <div className="flex items-center gap-4">
                      <span className="text-purple-300 font-semibold">
                        {roll.count}{roll.dice}
                        {roll.modifier !== 0 && ` ${roll.modifier >= 0 ? '+' : ''}${roll.modifier}`}
                      </span>
                      <span className="text-gray-400">
                        [{roll.results.join(', ')}]
                      </span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-white font-bold">= {roll.total}</span>
                      <span className="text-gray-500 text-sm">
                        {roll.timestamp.toLocaleTimeString()}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default DiceRoller
