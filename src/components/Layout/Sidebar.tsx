import { motion } from 'framer-motion'
import { NavLink } from 'react-router-dom'
import {
  Home,
  Plus,
  Users,
  Calendar,
  MessageSquare,
  FileText,
  BarChart3,
  Settings,
  Stethoscope,
  Activity,
  ClipboardList
} from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'

export function Sidebar() {
  const { profile, isAdmin, isPractitioner, isStudent } = useAuth()

  const getNavItems = () => {
    const common = [
      { to: '/dashboard', icon: Home, label: 'Dashboard' },
      { to: '/appointments', icon: Calendar, label: 'Appointments' },
      { to: '/messages', icon: MessageSquare, label: 'Messages' },
      { to: '/files', icon: FileText, label: 'Files' },
    ]

    if (isStudent) {
      return [
        ...common,
        { to: '/report-injury', icon: Plus, label: 'Report Injury' },
        { to: '/my-injuries', icon: Activity, label: 'My Injuries' },
        { to: '/recovery', icon: Stethoscope, label: 'Recovery Plans' },
      ]
    }

    if (isPractitioner) {
      return [
        ...common,
        { to: '/assigned-athletes', icon: Users, label: 'My Athletes' },
        { to: '/recovery-logs', icon: ClipboardList, label: 'Recovery Logs' },
        { to: '/treatment-plans', icon: Stethoscope, label: 'Treatment Plans' },
      ]
    }

    if (isAdmin) {
      return [
        ...common,
        { to: '/manage-users', icon: Users, label: 'Manage Users' },
        { to: '/assign-practitioners', icon: Users, label: 'Assignments' },
        { to: '/analytics', icon: BarChart3, label: 'Analytics' },
        { to: '/all-injuries', icon: Activity, label: 'All Injuries' },
      ]
    }

    return common
  }

  const navItems = getNavItems()

  return (
    <motion.aside
      initial={{ x: -250, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 bg-white shadow-sm border-r border-gray-200 z-40"
    >
      <nav className="p-6 space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                isActive
                  ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`
            }
          >
            <item.icon className="w-5 h-5" />
            <span className="font-medium">{item.label}</span>
          </NavLink>
        ))}

        <div className="pt-6 mt-6 border-t border-gray-200">
          <NavLink
            to="/settings"
            className={({ isActive }) =>
              `flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                isActive
                  ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`
            }
          >
            <Settings className="w-5 h-5" />
            <span className="font-medium">Settings</span>
          </NavLink>
        </div>
      </nav>

      {/* Role indicator */}
      <div className="absolute bottom-6 left-6 right-6">
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-sm font-medium text-gray-700 capitalize">
              {profile?.role} Account
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            {profile?.email}
          </p>
        </div>
      </div>
    </motion.aside>
  )
}