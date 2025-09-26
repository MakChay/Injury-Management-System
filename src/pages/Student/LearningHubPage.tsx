import { useState } from 'react'
import { motion } from 'framer-motion'
import { BookOpen, Play, Download, Search, Filter } from 'lucide-react'

const learningResources = [
  {
    id: 1,
    title: 'Injury Prevention Fundamentals',
    type: 'Video',
    duration: '15 min',
    category: 'Prevention',
    description: 'Learn the basics of preventing common athletic injuries',
    thumbnail: '/api/placeholder/300/200',
  },
  {
    id: 2,
    title: 'Recovery Nutrition Guide',
    type: 'PDF',
    duration: '10 min read',
    category: 'Nutrition',
    description: 'Essential nutrition tips for optimal recovery',
    thumbnail: '/api/placeholder/300/200',
  },
  {
    id: 3,
    title: 'Mental Health in Sports',
    type: 'Video',
    duration: '20 min',
    category: 'Psychology',
    description: 'Managing mental health during injury recovery',
    thumbnail: '/api/placeholder/300/200',
  },
  {
    id: 4,
    title: 'Rehabilitation Exercises',
    type: 'Video',
    duration: '25 min',
    category: 'Exercise',
    description: 'Safe exercises for common injuries',
    thumbnail: '/api/placeholder/300/200',
  },
]

const categories = ['All', 'Prevention', 'Nutrition', 'Psychology', 'Exercise', 'Recovery']

export function LearningHubPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')

  const filteredResources = learningResources.filter(resource => {
    const matchesSearch = resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         resource.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'All' || resource.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center space-x-3"
      >
        <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
          <BookOpen className="w-6 h-6 text-purple-600" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Learning Hub</h1>
          <p className="text-gray-600">Educational resources for injury prevention and recovery</p>
        </div>
      </motion.div>

      {/* Search and Filter */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
      >
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search resources..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Filter className="w-5 h-5 text-gray-400" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
        </div>
      </motion.div>

      {/* Resources Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredResources.map((resource, index) => (
          <motion.div
            key={resource.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + index * 0.1 }}
            className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
          >
            <div className="aspect-video bg-gray-200 flex items-center justify-center">
              {resource.type === 'Video' ? (
                <Play className="w-12 h-12 text-gray-400" />
              ) : (
                <BookOpen className="w-12 h-12 text-gray-400" />
              )}
            </div>
            
            <div className="p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                  {resource.type}
                </span>
                <span className="text-sm text-gray-500">{resource.duration}</span>
              </div>
              
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {resource.title}
              </h3>
              
              <p className="text-gray-600 text-sm mb-4">
                {resource.description}
              </p>
              
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">{resource.category}</span>
                <button className="flex items-center space-x-1 text-blue-600 hover:text-blue-700 text-sm font-medium">
                  {resource.type === 'Video' ? (
                    <>
                      <Play className="w-4 h-4" />
                      <span>Watch</span>
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4" />
                      <span>Download</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {filteredResources.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-200"
        >
          <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No resources found</h3>
          <p className="text-gray-600">
            Try adjusting your search terms or filter criteria.
          </p>
        </motion.div>
      )}
    </div>
  )
}