import { PlusCircleIcon } from "@heroicons/react/24/solid"

interface NewChatButtonProps {
  onClick: () => void
}

export default function NewChatButton({ onClick }: NewChatButtonProps) {
  return (
    <button
      onClick={onClick}
      className="flex items-center justify-center w-full p-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
    >
      <PlusCircleIcon className="h-5 w-5 mr-2" />
      New Chat
    </button>
  )
}

