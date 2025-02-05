

import { useState, useRef, useEffect } from "react"
import { UserCircleIcon } from "@heroicons/react/24/outline"

interface AccountProps {
  username: string
  onLogout: () => void
}

export default function Account({ username, onLogout }: AccountProps) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const toggleDropdown = (e: React.MouseEvent) => {
    console.log("toggleDropdown")
    e.stopPropagation()
    setIsOpen(!isOpen)
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  return (
    <div className="absolute left-0 bottom-0 m-4" ref={dropdownRef}>
      <button
        onClick={toggleDropdown}
        className="flex items-center space-x-2 focus:outline-none"
      >
        <UserCircleIcon className="h-8 w-8 text-gray-600 dark:text-gray-300" />
      </button>

      {isOpen && (
        <div className="absolute bottom-full left-0 mb-2 w-48 bg-white bg-opacity-95 dark:bg-gray-800 dark:bg-opacity-95 rounded-lg shadow-lg py-1 ring-1 ring-black ring-opacity-5 backdrop-blur-sm">
          <div className="px-4 py-2 text-sm text-gray-700 dark:text-gray-200 border-b border-gray-200 dark:border-gray-700">
            {username}
          </div>
          <a
            href="#"
            className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            Settings
          </a>
          <button
            onClick={onLogout}
            className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  )
}
