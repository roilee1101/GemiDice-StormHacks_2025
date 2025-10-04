
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import {Sword, Users, BookOpen, Dice6, Sparkles, Shield, Zap} from 'lucide-react'

const Home = () => {
  const features = [
    {
      icon: Users,
      title: 'Character Creation',
      description: 'Build epic heroes with detailed stats, backgrounds, and abilities',
      color: 'from-blue-400 to-purple-400'
    },
    {
      icon: BookOpen,
      title: 'Campaign Management',
      description: 'Organize your adventures, track progress, and manage your party',
      color: 'from-purple-400 to-pink-400'
    },
    {
      icon: Dice6,
      title: 'Digital Dice',
      description: 'Roll any combination of dice with beautiful animations',
      color: 'from-pink-400 to-red-400'
    },
    {
      icon: Shield,
      title: 'Equipment Tracker',
      description: 'Manage inventory, weapons, and magical items',
      color: 'from-green-400 to-blue-400'
    },
    {
      icon: Zap,
      title: 'Spell Database',
      description: 'Access comprehensive spell lists with detailed descriptions',
      color: 'from-yellow-400 to-orange-400'
    },
    {
      icon: Sparkles,
      title: 'Adventure Generator',
      description: 'Generate random encounters, NPCs, and plot hooks',
      color: 'from-indigo-400 to-purple-400'
    }
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 px-4">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-900/20 to-pink-900/20" />
        <div className="relative max-w-6xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
                Dungeons & Dragons
              </span>
              <br />
              <span className="text-white">Adventure Hub</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
              Your ultimate companion for epic adventures. Create characters, manage campaigns, 
              and roll dice in the most immersive D&D experience.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/characters"
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg"
              >
                Create Character
              </Link>
              <Link
                to="/campaigns"
                className="border-2 border-purple-500 text-purple-300 hover:bg-purple-500/10 px-8 py-4 rounded-xl font-semibold transition-all duration-200"
              >
                Start Campaign
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Everything You Need for Epic Adventures
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              From character creation to campaign management, we've got all the tools 
              to make your D&D sessions legendary.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -5 }}
                  className="bg-black/30 backdrop-blur-sm border border-purple-500/20 rounded-2xl p-6 hover:border-purple-500/40 transition-all duration-300"
                >
                  <div className={`w-12 h-12 bg-gradient-to-r ${feature.color} rounded-xl flex items-center justify-center mb-4`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                  <p className="text-gray-300">{feature.description}</p>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="bg-gradient-to-r from-purple-900/50 to-pink-900/50 backdrop-blur-sm border border-purple-500/30 rounded-3xl p-12"
          >
            <Sword className="w-16 h-16 text-purple-400 mx-auto mb-6" />
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Ready to Begin Your Adventure?
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Join thousands of adventurers who have already started their legendary journeys.
            </p>
            <Link
              to="/characters"
              className="inline-block bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-10 py-4 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg"
            >
              Start Your Journey
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default Home
