import { motion } from 'framer-motion'
import { Server, CheckCircle, AlertCircle, Clock } from 'lucide-react'

export function SystemStatusPage() {
  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center space-x-3"
      >
        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
          <Server className="w-6 h-6 text-blue-600" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">System Status</h1>
          <p className="text-gray-600">Monitor system health and performance</p>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { service: 'Database', status: 'operational', icon: CheckCircle, color: 'text-green-600' },
          { service: 'API', status: 'operational', icon: CheckCircle, color: 'text-green-600' },
          { service: 'Storage', status: 'degraded', icon: AlertCircle, color: 'text-yellow-600' },
        ].map((service, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
          >
            <div className="flex items-center space-x-3">
              <service.icon className={`w-6 h-6 ${service.color}`} />
              <div>
                <h3 className="font-semibold text-gray-900">{service.service}</h3>
                <p className="text-sm text-gray-600 capitalize">{service.status}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4">System Metrics</h3>
        <div className="text-center py-12">
          <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">System metrics will be displayed here</p>
        </div>
      </motion.div>
    </div>
  )
}