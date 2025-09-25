interface MediaItem {
  name: string
  video_url: string
}

const defaultMedia: MediaItem[] = [
  { name: 'Ankle Alphabet', video_url: 'https://videos.example.com/ankle-alphabet.mp4' },
  { name: 'Calf Raises', video_url: 'https://videos.example.com/calf-raises.mp4' },
  { name: 'Nordic Hamstring', video_url: 'https://videos.example.com/nordic.mp4' },
]

export function MediaLibrary({ onSelect }: { onSelect: (m: MediaItem) => void }) {
  return (
    <div className="space-y-2">
      {defaultMedia.map((m) => (
        <button key={m.name} onClick={() => onSelect(m)} className="w-full text-left p-2 border rounded hover:bg-gray-50">
          <div className="font-medium">{m.name}</div>
          <div className="text-xs text-blue-600">Attach video</div>
        </button>
      ))}
    </div>
  )
}

