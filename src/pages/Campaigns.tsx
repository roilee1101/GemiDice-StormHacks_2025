
import { useState } from 'react'
import { motion } from 'framer-motion'
import {Plus, BookOpen, Users, Calendar, MapPin, Trash2, Play} from 'lucide-react'
import toast from 'react-hot-toast'

interface Campaign {
  id: string
  name: string
  description: string
  dm: string
  players: number
  sessions: number
  status: 'active' | 'completed' | 'paused'
  setting: string
  level: string
}

const Campaigns = () => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([
    {
      id: '1',
      name: 'The Lost Mines of Phandelver',
      description: 'A classic adventure for new heroes seeking fame and fortune in the dangerous mines.',
      dm: 'Alex Richardson',
      players: 4,
      sessions: 8,
      status: 'active',
      setting: 'Forgotten Realms',
      level: '1-5'
    },
    {
      id: '2',
      name: 'Curse of Strahd',
      description: 'A gothic horror adventure in the mist-shrouded realm of Barovia.',
      dm: 'Sarah Chen',
      players: 5,
      sessions: 15,
      status: 'active',
      setting: 'Ravenloft',
      level: '1-10'
    },
    {
      id: '3',
      name: 'Dragon Heist',
      description: 'Urban intrigue and treasure hunting in the city of Waterdeep.',
      dm: 'Mike Torres',
      players: 6,
      sessions: 12,
      status: 'completed',
      setting: 'Waterdeep',
      level: '1-5'
    }
  ])

  const [showForm, setShowForm] = useState(false)
  const [newCampaign, setNewCampaign] = useState({
    name: '',
    description: '',
    dm: '',
    setting: '',
    level: ''
  })

  const settings = [
    'Forgotten Realms', 'Eberron', 'Ravenloft', 'Greyhawk', 'Dark Sun', 'Planescape', 'Spelljammer', 'Custom Setting'
  ]

  const levelRanges = ['1-3', '1-5', '1-10', '1-15', '1-20', '5-10', '10-15', '15-20']

  const handleCreateCampaign = () => {
    if (!newCampaign.name || !newCampaign.description || !newCampaign.dm) {
      toast.error('Please fill in all required fields')
      return
    }

    const campaign: Campaign = {
      id: Date.now().toString(),
      ...newCampaign,
      players: 0,
      sessions: 0,
      status: 'active'
    }

    setCampaigns([...campaigns, campaign])
    setNewCampaign({ name: '', description: '', dm: '', setting: '', level: '' })
    setShowForm(false)
    toast.success(`Campaign "${campaign.name}" has been created!`)
  }

  const deleteCampaign = (id: string) => {
    setCampaigns(campaigns.filter(campaign => campaign.id !== id))
    toast.success('Campaign deleted')
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500'
      case 'completed': return 'bg-blue-500'
      case 'paused': return 'bg-yellow-500'
      default: return 'bg-gray-500'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'Active'
      case 'completed': return 'Completed'
      case 'paused': return 'Paused'
      default: return 'Unknown'
    }
  }

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-white">Campaigns</h1>
          <button
            onClick={() => setShowForm(true)}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            New Campaign
          </button>
        </div>

        {/* Campaign Creation Form */}
        {showForm && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-black/30 backdrop-blur-sm border border-purple-500/20 rounded-2xl p-6 mb-8"
          >
            <h2 className="text-2xl font-bold text-white mb-6">Create New Campaign</h2>
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-purple-300 mb-2">Campaign Name *</label>
                <input
                  type="text"
                  value={newCampaign.name}
                  onChange={(e) => setNewCampaign({ ...newCampaign, name: e.target.value })}
                  className="w-full bg-black/50 border border-purple-500/30 rounded-lg px-4 py-2 text-white focus:border-purple-500 focus:outline-none"
                  placeholder="Enter campaign name"
                />
              </div>
              <div>
                <label className="block text-purple-300 mb-2">Description *</label>
                <textarea
                  value={newCampaign.description}
                  onChange={(e) => setNewCampaign({ ...newCampaign, description: e.target.value })}
                  className="w-full bg-black/50 border border-purple-500/30 rounded-lg px-4 py-2 text-white focus:border-purple-500 focus:outline-none h-24 resize-none"
                  placeholder="Describe your campaign..."
                />
              </div>
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-purple-300 mb-2">Dungeon Master *</label>
                  <input
                    type="text"
                    value={newCampaign.dm}
                    onChange={(e) => setNewCampaign({ ...newCampaign, dm: e.target.value })}
                    className="w-full bg-black/50 border border-purple-500/30 rounded-lg px-4 py-2 text-white focus:border-purple-500 focus:outline-none"
                    placeholder="DM name"
                  />
                </div>
                <div>
                  <label className="block text-purple-300 mb-2">Setting</label>
                  <select
                    value={newCampaign.setting}
                    onChange={(e) => setNewCampaign({ ...newCampaign, setting: e.target.value })}
                    className="w-full bg-black/50 border border-purple-500/30 rounded-lg px-4 py-2 text-white focus:border-purple-500 focus:outline-none"
                  >
                    <option value="">Select Setting</option>
                    {settings.map(setting => (
                      <option key={setting} value={setting}>{setting}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-purple-300 mb-2">Level Range</label>
                  <select
                    value={newCampaign.level}
                    onChange={(e) => setNewCampaign({ ...newCampaign, level: e.target.value })}
                    className="w-full bg-black/50 border border-purple-500/30 rounded-lg px-4 py-2 text-white focus:border-purple-500 focus:outline-none"
                  >
                    <option value="">Select Level Range</option>
                    {levelRanges.map(range => (
                      <option key={range} value={range}>{range}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            <div className="flex gap-4">
              <button
                onClick={handleCreateCampaign}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 py-2 rounded-lg font-semibold transition-all duration-200"
              >
                Create Campaign
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

        {/* Campaigns Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {campaigns.map((campaign, index) => (
            <motion.div
              key={campaign.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-black/30 backdrop-blur-sm border border-purple-500/20 rounded-2xl p-6 hover:border-purple-500/40 transition-all duration-300"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center">
                    <BookOpen className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">{campaign.name}</h3>
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${getStatusColor(campaign.status)}`} />
                      <span className="text-purple-300 text-sm">{getStatusText(campaign.status)}</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => deleteCampaign(campaign.id)}
                  className="text-red-400 hover:text-red-300 transition-colors"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>

              <p className="text-gray-300 text-sm mb-4 line-clamp-3">{campaign.description}</p>

              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm">
                  <Users className="w-4 h-4 text-blue-400" />
                  <span className="text-white">DM: {campaign.dm}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Users className="w-4 h-4 text-green-400" />
                  <span className="text-white">Players: {campaign.players}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="w-4 h-4 text-purple-400" />
                  <span className="text-white">Sessions: {campaign.sessions}</span>
                </div>
                {campaign.setting && (
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="w-4 h-4 text-yellow-400" />
                    <span className="text-white">Setting: {campaign.setting}</span>
                  </div>
                )}
                {campaign.level && (
                  <div className="flex items-center gap-2 text-sm">
                    <Play className="w-4 h-4 text-red-400" />
                    <span className="text-white">Level: {campaign.level}</span>
                  </div>
                )}
              </div>

              {campaign.status === 'active' && (
                <button className="w-full bg-gradient-to-r from-purple-600/20 to-pink-600/20 border border-purple-500/30 text-purple-300 hover:bg-purple-500/10 py-2 rounded-lg font-semibold transition-all duration-200">
                  Manage Campaign
                </button>
              )}
            </motion.div>
          ))}
        </div>

        {campaigns.length === 0 && !showForm && (
          <div className="text-center py-20">
            <BookOpen className="w-16 h-16 text-purple-400 mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-white mb-4">No Campaigns Yet</h2>
            <p className="text-gray-300 mb-6">Create your first campaign to start your adventure!</p>
            <button
              onClick={() => setShowForm(true)}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg"
            >
              Create Your First Campaign
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default Campaigns
