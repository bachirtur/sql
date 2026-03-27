import { useState, useRef, useEffect } from 'react';
import { executeSQL, createDefaultDatabase, type Database, type QueryResult } from '../utils/sqlEngine';

interface Props {
  onNext: () => void;
  onPrev: () => void;
}

const EXAMPLE_QUERIES = [
  { label: 'Tous les livres', sql: 'SELECT * FROM livres' },
  { label: 'Titres des livres', sql: 'SELECT titre FROM livres' },
  { label: 'Livres notés > 15', sql: "SELECT * FROM livres WHERE note > 15" },
  { label: 'Auteurs français', sql: "SELECT * FROM auteurs WHERE nationalite = 'Français'" },
  { label: 'Livres + Auteurs (JOIN)', sql: 'SELECT titre, nom, prenom FROM livres JOIN auteurs ON livres.id_auteur = auteurs.id' },
  { label: 'Trier par année', sql: 'SELECT titre, annee FROM livres ORDER BY annee' },
  { label: 'Compter les livres', sql: 'SELECT COUNT(*) FROM livres' },
  { label: 'Note moyenne', sql: 'SELECT AVG(note) FROM livres' },
];

export default function SQLConsole({ onNext, onPrev }: Props) {
  const [db, setDb] = useState<Database>(() => createDefaultDatabase());
  const [sql, setSql] = useState('');
  const [result, setResult] = useState<QueryResult | null>(null);
  const [history, setHistory] = useState<{ sql: string; success: boolean }[]>([]);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  }, []);

  const handleExecute = () => {
    if (!sql.trim()) return;
    const res = executeSQL(sql, db);
    setResult(res);
    setHistory(prev => [{ sql: sql.trim(), success: res.success }, ...prev.slice(0, 19)]);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      handleExecute();
    }
  };

  const handleReset = () => {
    setDb(createDefaultDatabase());
    setResult(null);
    setSql('');
    setHistory([]);
  };

  const handleExampleClick = (query: string) => {
    setSql(query);
    setResult(null);
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  return (
    <div className="animate-fade-in space-y-6">
      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 p-8 md:p-12 border border-slate-700">
        <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-indigo-500/5 rounded-full translate-y-1/2 -translate-x-1/2" />
        <div className="relative">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 text-sm mb-4 border border-cyan-500/20">
            <span>⚡</span> Console SQL
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Console SQL Interactive
          </h1>
          <p className="text-lg text-slate-400 max-w-2xl">
            Écris tes requêtes SQL et vois les résultats en temps réel. 
            Utilise les exemples ci-dessous ou écris tes propres requêtes !
          </p>
        </div>
      </div>

      {/* Database Info */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
          <h3 className="font-bold text-slate-800 mb-3 flex items-center gap-2">
            📚 Table LIVRES
          </h3>
          <div className="flex flex-wrap gap-2">
            {['id', 'titre', 'annee', 'note', 'id_auteur'].map(col => (
              <span key={col} className="px-2.5 py-1 bg-indigo-50 text-indigo-700 rounded-lg text-sm font-mono border border-indigo-100">
                {col}
              </span>
            ))}
          </div>
          <p className="text-xs text-slate-500 mt-2">8 enregistrements</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
          <h3 className="font-bold text-slate-800 mb-3 flex items-center gap-2">
            ✍️ Table AUTEURS
          </h3>
          <div className="flex flex-wrap gap-2">
            {['id', 'nom', 'prenom', 'nationalite', 'annee_naissance'].map(col => (
              <span key={col} className="px-2.5 py-1 bg-purple-50 text-purple-700 rounded-lg text-sm font-mono border border-purple-100">
                {col}
              </span>
            ))}
          </div>
          <p className="text-xs text-slate-500 mt-2">6 enregistrements</p>
        </div>
      </div>

      {/* Example queries */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
        <h3 className="font-bold text-slate-800 mb-3 flex items-center gap-2">
          💡 Exemples de requêtes <span className="text-sm font-normal text-slate-500">(clique pour essayer)</span>
        </h3>
        <div className="flex flex-wrap gap-2">
          {EXAMPLE_QUERIES.map((q, i) => (
            <button
              key={i}
              onClick={() => handleExampleClick(q.sql)}
              className="px-3 py-1.5 bg-slate-50 hover:bg-indigo-50 text-slate-700 hover:text-indigo-700 
                rounded-lg text-sm border border-slate-200 hover:border-indigo-300 transition-all"
            >
              {q.label}
            </button>
          ))}
        </div>
      </div>

      {/* SQL Editor */}
      <div className="bg-slate-900 rounded-2xl overflow-hidden shadow-2xl border border-slate-700">
        {/* Editor header */}
        <div className="flex items-center justify-between px-4 py-3 bg-slate-800 border-b border-slate-700">
          <div className="flex items-center gap-2">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <div className="w-3 h-3 rounded-full bg-yellow-500" />
              <div className="w-3 h-3 rounded-full bg-green-500" />
            </div>
            <span className="text-slate-400 text-sm ml-2 font-mono">requete.sql</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-slate-500 text-xs">Ctrl+Entrée pour exécuter</span>
            <button
              onClick={handleReset}
              className="px-3 py-1.5 text-xs bg-slate-700 text-slate-300 rounded-lg 
                hover:bg-slate-600 transition-all flex items-center gap-1"
            >
              🔄 Réinitialiser
            </button>
          </div>
        </div>

        {/* Textarea */}
        <div className="relative">
          <textarea
            ref={textareaRef}
            value={sql}
            onChange={e => setSql(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Écris ta requête SQL ici...&#10;Exemple : SELECT * FROM livres"
            className="sql-editor w-full h-40 p-4 bg-transparent text-cyan-100 resize-none 
              focus:outline-none placeholder-slate-600"
            spellCheck={false}
          />
        </div>

        {/* Execute button */}
        <div className="flex items-center justify-between px-4 py-3 bg-slate-800/50 border-t border-slate-700">
          <div className="text-slate-500 text-sm">
            {sql.trim().length > 0 ? `${sql.trim().length} caractères` : 'En attente de requête...'}
          </div>
          <button
            onClick={handleExecute}
            disabled={!sql.trim()}
            className={`px-6 py-2.5 font-semibold rounded-xl transition-all duration-300 flex items-center gap-2
              ${sql.trim() 
                ? 'bg-gradient-to-r from-cyan-500 to-indigo-500 text-white shadow-lg shadow-cyan-500/25 hover:shadow-xl active:scale-[0.98]' 
                : 'bg-slate-700 text-slate-500 cursor-not-allowed'}`}
          >
            ▶ Exécuter
          </button>
        </div>
      </div>

      {/* Results */}
      {result && (
        <div className={`animate-scale-in rounded-2xl border-2 overflow-hidden shadow-lg ${
          result.success ? 'border-emerald-200 bg-white' : 'border-rose-200 bg-rose-50'
        }`}>
          {/* Result header */}
          <div className={`px-5 py-3 flex items-center justify-between ${
            result.success 
              ? 'bg-emerald-50 border-b border-emerald-200' 
              : 'bg-rose-100 border-b border-rose-200'
          }`}>
            <span className={`font-medium ${result.success ? 'text-emerald-700' : 'text-rose-700'}`}>
              {result.success ? result.message : result.error}
            </span>
            {result.success && (
              <span className="text-sm text-emerald-600">
                {result.rowCount} ligne(s)
              </span>
            )}
          </div>

          {/* Result table */}
          {result.success && result.rows.length > 0 && (
            <div className="overflow-x-auto max-h-96">
              <table className="w-full border-collapse result-table">
                <thead>
                  <tr>
                    {result.columns.map((col, i) => (
                      <th key={i} className="py-2.5 px-4 text-left font-semibold text-sm bg-slate-100 text-slate-700 border-b border-slate-200 whitespace-nowrap">
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {result.rows.map((row, i) => (
                    <tr key={i} className={`${i % 2 === 0 ? 'bg-white' : 'bg-slate-50'} hover:bg-indigo-50/50 transition-colors`}>
                      {row.map((val, j) => (
                        <td key={j} className="py-2.5 px-4 border-b border-slate-100 text-sm text-slate-700 whitespace-nowrap">
                          {val === null ? <span className="text-slate-400 italic">NULL</span> : String(val)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* History */}
      {history.length > 0 && (
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
          <h3 className="font-bold text-slate-800 mb-3 flex items-center gap-2">
            📜 Historique <span className="text-sm font-normal text-slate-500">({history.length} requête{history.length > 1 ? 's' : ''})</span>
          </h3>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {history.map((item, i) => (
              <button
                key={i}
                onClick={() => handleExampleClick(item.sql)}
                className="w-full text-left px-3 py-2 rounded-lg bg-slate-50 hover:bg-slate-100 transition-all flex items-center gap-2"
              >
                <span className={`text-xs ${item.success ? 'text-emerald-500' : 'text-rose-500'}`}>
                  {item.success ? '✅' : '❌'}
                </span>
                <code className="text-sm text-slate-600 font-mono truncate">{item.sql}</code>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="flex justify-between">
        <button
          onClick={onPrev}
          className="px-6 py-3 bg-slate-100 text-slate-700 font-semibold rounded-xl 
            hover:bg-slate-200 transition-all flex items-center gap-2"
        >
          <span>←</span> Précédent
        </button>
        <button
          onClick={onNext}
          className="px-8 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold 
            rounded-xl hover:from-indigo-600 hover:to-purple-700 transition-all duration-300 
            shadow-lg shadow-indigo-500/25 flex items-center gap-2"
        >
          Passer aux exercices notés 🏆 <span>→</span>
        </button>
      </div>
    </div>
  );
}
