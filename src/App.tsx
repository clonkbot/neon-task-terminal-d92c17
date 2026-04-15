import { useState, useEffect } from 'react'
import './styles.css'

interface Task {
  id: string
  text: string
  completed: boolean
  priority: 'LOW' | 'MED' | 'HIGH'
  createdAt: number
}

function App() {
  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem('neon-tasks')
    return saved ? JSON.parse(saved) : []
  })
  const [newTask, setNewTask] = useState('')
  const [priority, setPriority] = useState<'LOW' | 'MED' | 'HIGH'>('MED')
  const [filter, setFilter] = useState<'ALL' | 'ACTIVE' | 'DONE'>('ALL')
  const [glitchId, setGlitchId] = useState<string | null>(null)

  useEffect(() => {
    localStorage.setItem('neon-tasks', JSON.stringify(tasks))
  }, [tasks])

  const addTask = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTask.trim()) return

    const task: Task = {
      id: `PROC-${Date.now().toString(16).toUpperCase()}`,
      text: newTask.trim(),
      completed: false,
      priority,
      createdAt: Date.now()
    }
    setTasks([task, ...tasks])
    setNewTask('')
  }

  const toggleTask = (id: string) => {
    setGlitchId(id)
    setTimeout(() => setGlitchId(null), 500)

    setTasks(tasks.map(t =>
      t.id === id ? { ...t, completed: !t.completed } : t
    ))
  }

  const deleteTask = (id: string) => {
    setGlitchId(id)
    setTimeout(() => {
      setTasks(tasks.filter(t => t.id !== id))
      setGlitchId(null)
    }, 300)
  }

  const filteredTasks = tasks.filter(t => {
    if (filter === 'ACTIVE') return !t.completed
    if (filter === 'DONE') return t.completed
    return true
  })

  const stats = {
    total: tasks.length,
    active: tasks.filter(t => !t.completed).length,
    done: tasks.filter(t => t.completed).length
  }

  return (
    <div className="min-h-screen bg-black relative overflow-hidden flex flex-col">
      {/* Scanline overlay */}
      <div className="scanlines pointer-events-none fixed inset-0 z-50" />

      {/* Grid background */}
      <div className="grid-bg fixed inset-0 opacity-20" />

      {/* CRT vignette */}
      <div className="crt-vignette fixed inset-0 pointer-events-none z-40" />

      <main className="relative z-10 flex-1 p-4 md:p-8 max-w-4xl mx-auto w-full">
        {/* Header */}
        <header className="mb-6 md:mb-8">
          <div className="flex items-center gap-2 md:gap-3 mb-2">
            <div className="w-2 h-2 md:w-3 md:h-3 bg-cyan-400 rounded-full animate-pulse shadow-glow-cyan" />
            <span className="text-cyan-400 font-mono text-xs md:text-sm tracking-widest">SYSTEM ONLINE</span>
          </div>
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-fuchsia-500 to-amber-400 font-display glitch-text pb-1">
            NEON TASK TERMINAL
          </h1>
          <p className="font-mono text-cyan-400/60 text-xs md:text-sm mt-2">
            &gt; TASK MANAGEMENT SYSTEM v2.0.85 // NEXUS CORPORATION
          </p>
        </header>

        {/* Stats bar */}
        <div className="flex flex-wrap gap-3 md:gap-6 mb-6 md:mb-8 font-mono text-xs md:text-sm">
          <div className="flex items-center gap-2">
            <span className="text-cyan-400/50">PROCESSES:</span>
            <span className="text-cyan-400 text-glow-cyan">{stats.total}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-amber-400/50">RUNNING:</span>
            <span className="text-amber-400 text-glow-amber">{stats.active}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-fuchsia-400/50">TERMINATED:</span>
            <span className="text-fuchsia-400 text-glow-fuchsia">{stats.done}</span>
          </div>
        </div>

        {/* Input form */}
        <form onSubmit={addTask} className="mb-6 md:mb-8">
          <div className="terminal-box p-3 md:p-4">
            <div className="flex items-center gap-2 mb-3 font-mono text-xs text-cyan-400/70">
              <span className="text-fuchsia-400">&gt;</span>
              NEW_PROCESS.INIT
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                placeholder="Enter task designation..."
                className="flex-1 bg-black/50 border border-cyan-400/30 px-3 md:px-4 py-3 font-mono text-cyan-400 placeholder:text-cyan-400/30 focus:outline-none focus:border-cyan-400 focus:shadow-glow-cyan transition-all text-sm md:text-base"
              />
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as 'LOW' | 'MED' | 'HIGH')}
                className="bg-black/50 border border-cyan-400/30 px-3 md:px-4 py-3 font-mono text-cyan-400 focus:outline-none focus:border-cyan-400 cursor-pointer text-sm md:text-base min-w-[100px]"
              >
                <option value="LOW">PRI:LOW</option>
                <option value="MED">PRI:MED</option>
                <option value="HIGH">PRI:HIGH</option>
              </select>
              <button
                type="submit"
                className="btn-neon px-4 md:px-6 py-3 font-mono text-sm md:text-base font-bold tracking-wider whitespace-nowrap"
              >
                EXECUTE
              </button>
            </div>
          </div>
        </form>

        {/* Filter tabs */}
        <div className="flex gap-1 md:gap-2 mb-4 md:mb-6 font-mono text-xs md:text-sm overflow-x-auto pb-2">
          {(['ALL', 'ACTIVE', 'DONE'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 md:px-4 py-2 border transition-all whitespace-nowrap ${
                filter === f
                  ? 'border-cyan-400 text-cyan-400 bg-cyan-400/10 shadow-glow-cyan'
                  : 'border-cyan-400/30 text-cyan-400/50 hover:border-cyan-400/60 hover:text-cyan-400/80'
              }`}
            >
              [{f === 'ALL' ? 'ALL PROC' : f === 'ACTIVE' ? 'RUNNING' : 'TERMINATED'}]
            </button>
          ))}
        </div>

        {/* Task list */}
        <div className="space-y-2 md:space-y-3">
          {filteredTasks.length === 0 ? (
            <div className="terminal-box p-6 md:p-8 text-center">
              <div className="font-mono text-cyan-400/40 text-xs md:text-sm">
                <div className="mb-2">&gt; NO PROCESSES FOUND</div>
                <div className="text-fuchsia-400/40">INITIALIZE NEW TASK TO BEGIN_</div>
              </div>
            </div>
          ) : (
            filteredTasks.map((task, index) => (
              <div
                key={task.id}
                className={`task-item terminal-box p-3 md:p-4 ${task.completed ? 'opacity-50' : ''} ${glitchId === task.id ? 'glitch-effect' : ''}`}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="flex items-start gap-3 md:gap-4">
                  <button
                    onClick={() => toggleTask(task.id)}
                    className={`w-5 h-5 md:w-6 md:h-6 border-2 flex-shrink-0 mt-0.5 transition-all flex items-center justify-center ${
                      task.completed
                        ? 'border-fuchsia-400 bg-fuchsia-400/20 text-fuchsia-400'
                        : 'border-cyan-400/50 hover:border-cyan-400 hover:shadow-glow-cyan'
                    }`}
                  >
                    {task.completed && (
                      <span className="text-xs md:text-sm font-mono">X</span>
                    )}
                  </button>

                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className="font-mono text-cyan-400/50 text-xs">{task.id}</span>
                      <span className={`px-1.5 md:px-2 py-0.5 font-mono text-xs border ${
                        task.priority === 'HIGH'
                          ? 'border-red-500/50 text-red-400 bg-red-500/10'
                          : task.priority === 'MED'
                          ? 'border-amber-500/50 text-amber-400 bg-amber-500/10'
                          : 'border-green-500/50 text-green-400 bg-green-500/10'
                      }`}>
                        {task.priority}
                      </span>
                    </div>
                    <p className={`font-mono text-sm md:text-base break-words ${
                      task.completed
                        ? 'text-cyan-400/40 line-through'
                        : 'text-cyan-400'
                    }`}>
                      {task.text}
                    </p>
                  </div>

                  <button
                    onClick={() => deleteTask(task.id)}
                    className="text-red-500/50 hover:text-red-400 font-mono text-xs md:text-sm px-2 py-1 border border-transparent hover:border-red-500/30 transition-all flex-shrink-0"
                  >
                    [DEL]
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Command line decoration */}
        <div className="mt-8 md:mt-12 font-mono text-xs text-cyan-400/30">
          <div>&gt; AWAITING INPUT...</div>
          <div className="inline-block w-2 h-4 bg-cyan-400/50 animate-blink ml-1" />
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 py-4 md:py-6 text-center font-mono">
        <p className="text-cyan-400/30 text-xs tracking-wider">
          Requested by @web-user · Built by @clonkbot
        </p>
      </footer>
    </div>
  )
}

export default App
