const App = () => (
  <main className="mx-auto flex min-h-screen max-w-md flex-col gap-4 p-5">
    <h1 className="text-2xl font-extrabold text-night">Carnet Crédit</h1>
    <p className="text-muted">Projet initialisé.</p>
    <button className="h-16 rounded-2xl bg-night text-lg font-bold text-white">
      Il me doit
    </button>
    <button className="h-16 rounded-2xl bg-teal text-lg font-bold text-white">
      Il a payé
    </button>
  </main>
)

export default App
