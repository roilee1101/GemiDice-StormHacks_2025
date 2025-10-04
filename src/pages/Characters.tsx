
import { useState } from 'react'
import { motion } from 'framer-motion'
import {Plus, Shield, Heart, User, Trash2} from 'lucide-react'
import toast from 'react-hot-toast'

interface Character {
  id: string
  name: string
  race: string
  class: string
  level: number
  hp: number
  ac: number
  stats: {
    strength: number
    dexterity: number
    constitution: number
    intelligence: number
    wisdom: number
    charisma: number
  }
}

const Characters = () => {
  const [characters, setCharacters] = useState<Character[]>([
    {
      id: '1',
      name: 'Thorin Ironbeard',
      race: 'Dwarf',
      class: 'Fighter',
      level: 5,
      hp: 52,
      ac: 18,
      stats: { strength: 16, dexterity: 12, constitution: 15, intelligence: 10, wisdom: 13, charisma: 8 }
    },
    {
      id: '2',
      name: 'Elara Moonwhisper',
      race: 'Elf',
      class: 'Wizard',
      level: 4,
      hp: 28,
      ac: 12,
      stats: { strength: 8, dexterity: 14, constitution: 12, intelligence: 17, wisdom: 15, charisma: 11 }
    }
  ])

  const [showForm, setShowForm] = useState(false)
  const [newCharacter, setNewCharacter] = useState({
    name: '',
    race: '',
    class: '',
    level: 1
  })

  const races = ['Human', 'Elf', 'Dwarf', 'Halfling', 'Dragonborn', 'Gnome', 'Half-Elf', 'Half-Orc', 'Tiefling']
  const classes = ['Fighter', 'Wizard', 'Rogue', 'Cleric', 'Ranger', 'Paladin', 'Barbarian', 'Bard', 'Druid', 'Monk', 'Sorcerer', 'Warlock']

  const generateStats = () => {
    const rollStat = () => {
      const rolls = Array.from({ length: 4 }, () => Math.floor(Math.random() * 6) + 1)
      rolls.sort((a, b) => b - a)
      return rolls.slice(0, 3).reduce((sum, roll) => sum + roll, 0)
    }

    return {
      strength: rollStat(),
      dexterity: rollStat(),
      constitution: rollStat(),
      intelligence: rollStat(),
      wisdom: rollStat(),
      charisma: rollStat()
    }
  }

  const calculateHP = (level: number, constitution: number, characterClass: string) => {
    const hitDie = {
      'Barbarian': 12, 'Fighter': 10, 'Paladin': 10, 'Ranger': 10,
      'Bard': 8, 'Cleric': 8, 'Druid': 8, 'Monk': 8, 'Rogue': 8, 'Warlock': 8,
      'Sorcerer': 6, 'Wizard': 6
    }
    const conModifier = Math.floor((constitution - 10) / 2)
    const baseHP = hitDie[characterClass as keyof typeof hitDie] || 8
    return baseHP + (level - 1) * (Math.floor(baseHP / 2) + 1) + (conModifier * level)
  }

  const calculateAC = (dexterity: number, characterClass: string) => {
    const dexModifier = Math.floor((dexterity - 10) / 2)
    const baseAC = {
      'Barbarian': 10, 'Monk': 10, 'Sorcerer': 10, 'Wizard': 10,
      'Bard': 11, 'Cleric': 11, 'Druid': 11, 'Rogue': 11, 'Warlock': 11,
      'Fighter': 16, 'Paladin': 16, 'Ranger': 13
    }
    return (baseAC[characterClass as keyof typeof baseAC] || 10) + (characterClass === 'Barbarian' || characterClass === 'Monk' ? dexModifier : Math.min(dexModifier, 2))
  }

  const handleCreateCharacter = () => {
    if (!newCharacter.name || !newCharacter.race || !newCharacter.class) {
      toast.error('Please fill in all fields')
      return
    }

    const stats = generateStats()
    const character: Character = {
      id: Date.now().toString(),
      ...newCharacter,
      hp: calculateHP(newCharacter.level, stats.constitution, newCharacter.class),
      ac: calculateAC(stats.dexterity, newCharacter.class),
      stats
    }

    setCharacters([...characters, character])
    setNewCharacter({ name: '', race: '', class: '', level: 1 })
    setShowForm(false)
    toast.success(`${character.name} has been created!`)
  }

  const deleteCharacter = (id: string) => {
    setCharacters(characters.filter(char => char.id !== id))
    toast.success('Character deleted')
  }

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-white">Your Characters</h1>
          <button
            onClick={() => setShowForm(true)}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Create Character
          </button>
        </div>

        {/* Character Creation Form */}
        {showForm && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-black/30 backdrop-blur-sm border border-purple-500/20 rounded-2xl p-6 mb-8"
          >
            <h2 className="text-2xl font-bold text-white mb-6">Create New Character</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div>
                <label className="block text-purple-300 mb-2">Character Name</label>
                <input
                  type="text"
                  value={newCharacter.name}
                  onChange={(e) => setNewCharacter({ ...newCharacter, name: e.target.value })}
                  className="w-full bg-black/50 border border-purple-500/30 rounded-lg px-4 py-2 text-white focus:border-purple-500 focus:outline-none"
                  placeholder="Enter character name"
                />
              </div>
              <div>
                <label className="block text-purple-300 mb-2">Race</label>
                <select
                  value={newCharacter.race}
                  onChange={(e) => setNewCharacter({ ...newCharacter, race: e.target.value })}
                  className="w-full bg-black/50 border border-purple-500/30 rounded-lg px-4 py-2 text-white focus:border-purple-500 focus:outline-none"
                >
                  <option value="">Select Race</option>
                  {races.map(race => (
                    <option key={race} value={race}>{race}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-purple-300 mb-2">Class</label>
                <select
                  value={newCharacter.class}
                  onChange={(e) => setNewCharacter({ ...newCharacter, class: e.target.value })}
                  className="w-full bg-black/50 border border-purple-500/30 rounded-lg px-4 py-2 text-white focus:border-purple-500 focus:outline-none"
                >
                  <option value="">Select Class</option>
                  {classes.map(cls => (
                    <option key={cls} value={cls}>{cls}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-purple-300 mb-2">Level</label>
                <input
                  type="number"
                  min="1"
                  max="20"
                  value={newCharacter.level}
                  onChange={(e) => setNewCharacter({ ...newCharacter, level: parseInt(e.target.value) })}
                  className="w-full bg-black/50 border border-purple-500/30 rounded-lg px-4 py-2 text-white focus:border-purple-500 focus:outline-none"
                />
              </div>
            </div>
            <div className="flex gap-4">
              <button
                onClick={handleCreateCharacter}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 py-2 rounded-lg font-semibold transition-all duration-200"
              >
                Create Character
              </button>
              <button
                onClick={() => setShowForm(false)}
                className="border border-purple-500/30 text-purple-300 hover:bg-purple-500/10 px-6 py-2 rounded-lg font-semibold transition-all duration-200"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        )}

        {/* Characters Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {characters.map((character, index) => (
            <motion.div
              key={character.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-black/30 backdrop-blur-sm border border-purple-500/20 rounded-2xl p-6 hover:border-purple-500/40 transition-all duration-300"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center">
                    <User className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">{character.name}</h3>
                    <p className="text-purple-300">Level {character.level} {character.race} {character.class}</p>
                  </div>
                </div>
                <button
                  onClick={() => deleteCharacter(character.id)}
                  className="text-red-400 hover:text-red-300 transition-colors"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="flex items-center gap-2">
                  <Heart className="w-4 h-4 text-red-400" />
                  <span className="text-white">HP: {character.hp}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-blue-400" />
                  <span className="text-white">AC: {character.ac}</span>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="text-purple-300 font-semibold">Ability Scores</h4>
                <div className="grid grid-cols-3 gap-2 text-sm">
                  <div className="text-center">
                    <div className="text-white font-bold">{character.stats.strength}</div>
                    <div className="text-gray-400">STR</div>
                  </div>
                  <div className="text-center">
                    <div className="text-white font-bold">{character.stats.dexterity}</div>
                    <div className="text-gray-400">DEX</div>
                  </div>
                  <div className="text-center">
                    <div className="text-white font-bold">{character.stats.constitution}</div>
                    <div className="text-gray-400">CON</div>
                  </div>
                  <div className="text-center">
                    <div className="text-white font-bold">{character.stats.intelligence}</div>
                    <div className="text-gray-400">INT</div>
                  </div>
                  <div className="text-center">
                    <div className="text-white font-bold">{character.stats.wisdom}</div>
                    <div className="text-gray-400">WIS</div>
                  </div>
                  <div className="text-center">
                    <div className="text-white font-bold">{character.stats.charisma}</div>
                    <div className="text-gray-400">CHA</div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {characters.length === 0 && !showForm && (
          <div className="text-center py-20">
            <User className="w-16 h-16 text-purple-400 mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-white mb-4">No Characters Yet</h2>
            <p className="text-gray-300 mb-6">Create your first character to begin your adventure!</p>
            <button
              onClick={() => setShowForm(true)}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg"
            >
              Create Your First Character
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default Characters
