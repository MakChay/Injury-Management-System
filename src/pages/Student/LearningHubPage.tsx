export function LearningHubPage() {
  const resources = [
    { title: 'Preventing Ankle Sprains', link: 'https://example.com/ankle-prevention' },
    { title: 'Sport-specific Warm-up Protocols', link: 'https://example.com/warmups' },
    { title: 'Hamstring Injury Education', link: 'https://example.com/hamstring' },
  ]
  return (
    <div className="p-6 max-w-3xl">
      <h1 className="text-2xl font-bold mb-4">Learning Hub</h1>
      <div className="bg-white border rounded-lg divide-y">
        {resources.map((r) => (
          <a key={r.title} href={r.link} target="_blank" rel="noreferrer" className="p-4 block hover:bg-gray-50">
            <div className="font-medium">{r.title}</div>
            <div className="text-sm text-blue-600">Open resource</div>
          </a>
        ))}
      </div>
    </div>
  )
}

