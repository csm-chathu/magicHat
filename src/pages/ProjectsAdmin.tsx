import React, { useState } from "react"
import projectsData from "@/lib/projects.json"

export default function ProjectsAdmin() {
  const [json, setJson] = useState(() => JSON.stringify(projectsData, null, 2))

  const handleDownload = () => {
    const blob = new Blob([json], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "projects.json"
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-semibold mb-4">Projects Admin</h1>
      <p className="mb-4 text-muted-foreground">Edit the projects JSON below and download to update `lib/projects.json` in the repo.</p>
      <textarea
        value={json}
        onChange={(e) => setJson(e.target.value)}
        className="w-full h-72 p-3 border border-border rounded-md bg-background text-foreground font-mono text-sm"
      />
      <div className="flex gap-2 mt-4">
        <button onClick={handleDownload} className="px-4 py-2 bg-accent text-accent-foreground rounded">Download JSON</button>
        <button
          onClick={() => setJson(JSON.stringify(projectsData, null, 2))}
          className="px-4 py-2 border rounded"
        >
          Reset
        </button>
      </div>
      <div className="mt-8">
        <h2 className="text-lg font-medium mb-2">Preview</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {projectsData.map((p: any) => (
            <div key={p.id} className="border border-border p-4 rounded">
              <h3 className="font-semibold mb-2">{p.title}</h3>
              <img src={p.image} alt={p.title} className="w-full h-40 object-cover rounded mb-2" />
              <div className="flex gap-2 flex-wrap">
                {p.gallery?.map((g: string, i: number) => (
                  <img key={i} src={g} alt={`${p.title}-${i}`} className="h-12 w-12 object-cover rounded" />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
