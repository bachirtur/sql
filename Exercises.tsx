import { useState, useRef } from 'react';
import { executeSQL, createDefaultDatabase, type Database, type QueryResult } from '../utils/sqlEngine';

interface Exercise {
  id: number;
  title: string;
  description: string;
  hint: string;
  points: number;
  solution: string;
  validate: (result: QueryResult, db: Database) => boolean;
}

interface Props {
  onFinish: (scores: number[]) => void;
  onPrev: () => void;
}

const EXERCISES: Exercise[] = [
  {
    id: 1,
    title: 'Afficher tous les livres',
    description: 'Écris une requête SQL qui affiche toutes les colonnes et toutes les lignes de la table LIVRES.',
    hint: 'Utilise SELECT * FROM pour sélectionner tout le contenu d\'une table.',
    points: 2,
    solution: 'SELECT * FROM livres',
    validate: (result) => {
      return result.success && result.rowCount === 8 && result.columns.length === 5;
    },
  },
  {
    id: 2,
    title: 'Afficher uniquement les titres',
    description: 'Écris une requête qui n\'affiche que la colonne "titre" de la table LIVRES.',
    hint: 'Remplace * par le nom de la colonne souhaitée.',
    points: 2,
    solution: 'SELECT titre FROM livres',
    validate: (result) => {
      return result.success && result.rowCount === 8 && 
        result.columns.length >= 1 && result.columns.some(c => c === 'titre');
    },
  },
  {
    id: 3,
    title: 'Livres publiés après 1940',
    description: 'Affiche tous les livres dont l\'année de publication est supérieure à 1940.',
    hint: 'Utilise WHERE avec l\'opérateur > pour filtrer selon l\'année.',
    points: 2.5,
    solution: 'SELECT * FROM livres WHERE annee > 1940',
    validate: (result) => {
      if (!result.success) return false;
      // Livres après 1940: Le Petit Prince (1943), L'Étranger (1942), 1984 (1949), Harry Potter (1997) = 4
      return result.rowCount === 4;
    },
  },
  {
    id: 4,
    title: 'Auteurs français',
    description: 'Affiche tous les auteurs dont la nationalité est "Français" (de la table AUTEURS).',
    hint: 'Utilise WHERE nationalite = \'Français\' (avec des guillemets simples autour de la valeur texte).',
    points: 2.5,
    solution: "SELECT * FROM auteurs WHERE nationalite = 'Français'",
    validate: (result) => {
      if (!result.success) return false;
      // Hugo, Saint-Exupéry, Camus, Zola = 4
      return result.rowCount === 4;
    },
  },
  {
    id: 5,
    title: 'Joindre livres et auteurs',
    description: 'Affiche le titre de chaque livre avec le nom et le prénom de son auteur, en utilisant un JOIN.',
    hint: 'Utilise JOIN ... ON livres.id_auteur = auteurs.id pour relier les deux tables.',
    points: 3,
    solution: 'SELECT titre, nom, prenom FROM livres JOIN auteurs ON livres.id_auteur = auteurs.id',
    validate: (result) => {
      if (!result.success) return false;
      return result.rowCount === 8 && 
        result.columns.some(c => c === 'titre') && 
        result.columns.some(c => c === 'nom');
    },
  },
  {
    id: 6,
    title: 'Livres bien notés',
    description: 'Affiche les livres ayant une note supérieure ou égale à 16.',
    hint: 'Utilise WHERE note >= 16 pour filtrer.',
    points: 2.5,
    solution: 'SELECT * FROM livres WHERE note >= 16',
    validate: (result) => {
      if (!result.success) return false;
      // Les Misérables (18), Le Petit Prince (17), L'Étranger (16), 1984 (19), Notre-Dame (16) = 5
      return result.rowCount === 5;
    },
  },
  {
    id: 7,
    title: 'Trier par année',
    description: 'Affiche les titres des livres et leur année, triés par année de publication (du plus ancien au plus récent).',
    hint: 'Utilise ORDER BY annee après la clause FROM.',
    points: 2.5,
    solution: 'SELECT titre, annee FROM livres ORDER BY annee',
    validate: (result) => {
      if (!result.success) return false;
      if (result.rowCount !== 8) return false;
      // Check ordering
      for (let i = 1; i < result.rows.length; i++) {
        const anneeIdx = result.columns.indexOf('annee');
        if (anneeIdx === -1) return result.rowCount === 8; // accept if no annee column but right count
        const prev = Number(result.rows[i - 1][anneeIdx]);
        const curr = Number(result.rows[i][anneeIdx]);
        if (curr < prev) return false;
      }
      return true;
    },
  },
  {
    id: 8,
    title: 'Défi : Requête libre',
    description: 'Écris ta propre requête SQL ! Elle doit être valide et retourner au moins un résultat. Sois créatif !',
    hint: 'Essaie une requête avec un WHERE original, un COUNT, ou un JOIN avec des conditions.',
    points: 3,
    solution: 'SELECT titre, nom FROM livres JOIN auteurs ON livres.id_auteur = auteurs.id WHERE note > 16',
    validate: (result) => {
      return result.success && result.rowCount > 0;
    },
  },
];

export default function Exercises({ onFinish, onPrev }: Props) {
  const [currentEx, setCurrentEx] = useState(0);
  const [sql, setSql] = useState('');
  const [result, setResult] = useState<QueryResult | null>(null);
  const [scores, setScores] = useState<(number | null)[]>(new Array(EXERCISES.length).fill(null));
  const [showHint, setShowHint] = useState(false);
  const [showSolution, setShowSolution] = useState(false);
  const [validated, setValidated] = useState<boolean[]>(new Array(EXERCISES.length).fill(false));
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const db = createDefaultDatabase();

  const exercise = EXERCISES[currentEx];
  const totalPoints = EXERCISES.reduce((sum, ex) => sum + ex.points, 0);
  const earnedPoints = scores.reduce((sum: number, s) => sum + (s || 0), 0);

  const handleExecute = () => {
    if (!sql.trim()) return;
    const res = executeSQL(sql, db);
    setResult(res);

    if (res.success && exercise.validate(res, db) && !validated[currentEx]) {
      const newScores = [...scores];
      // Full points if no hint/solution shown, 75% with hint, 50% with solution
      let pts = exercise.points;
      if (showSolution) pts = exercise.points * 0.5;
      else if (showHint) pts = exercise.points * 0.75;
      newScores[currentEx] = Math.round(pts * 10) / 10;
      setScores(newScores);
      
      const newValidated = [...validated];
      newValidated[currentEx] = true;
      setValidated(newValidated);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      handleExecute();
    }
  };

  const goToExercise = (index: number) => {
    setCurrentEx(index);
    setSql('');
    setResult(null);
    setShowHint(false);
    setShowSolution(false);
  };

  const handleFinish = () => {
    const finalScores = scores.map(s => s || 0);
    onFinish(finalScores);
  };

  const allCompleted = validated.every(v => v);

  return (
    <div className="animate-fade-in space-y-6">
      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-700 p-8 md:p-10">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="relative">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-white/80 text-sm mb-4">
            <span>🏆</span> Exercices notés
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
            Exercices Pratiques
          </h1>
          <p className="text-lg text-emerald-100 max-w-2xl">
            8 exercices pour mettre en pratique tes connaissances SQL. 
            Ta note finale sera sur <strong>20 points</strong>.
          </p>
        </div>
      </div>

      {/* Progress bar */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium text-slate-700">
            Progression : {validated.filter(v => v).length}/{EXERCISES.length} exercices
          </span>
          <span className="text-sm font-bold text-indigo-600">
            {earnedPoints} / {totalPoints} points
          </span>
        </div>
        <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-500"
            style={{ width: `${(validated.filter(v => v).length / EXERCISES.length) * 100}%` }}
          />
        </div>
        {/* Exercise dots */}
        <div className="flex gap-2 mt-3 flex-wrap">
          {EXERCISES.map((_ex, i) => (
            <button
              key={i}
              onClick={() => goToExercise(i)}
              className={`w-9 h-9 rounded-lg font-bold text-sm transition-all flex items-center justify-center ${
                i === currentEx
                  ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/30 scale-110'
                  : validated[i]
                  ? 'bg-emerald-100 text-emerald-700 border border-emerald-300'
                  : 'bg-slate-100 text-slate-600 border border-slate-200 hover:bg-slate-200'
              }`}
            >
              {validated[i] ? '✓' : i + 1}
            </button>
          ))}
        </div>
      </div>

      {/* Current Exercise */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <div className="flex items-start justify-between mb-4 flex-wrap gap-3">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 font-bold text-sm">
                {exercise.id}
              </span>
              <h2 className="text-xl font-bold text-slate-800">{exercise.title}</h2>
              {validated[currentEx] && (
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-sm font-medium">
                  ✅ Validé
                </span>
              )}
            </div>
            <p className="text-slate-600">{exercise.description}</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-indigo-600">
              {scores[currentEx] !== null ? scores[currentEx] : '?'} <span className="text-sm text-slate-400">/ {exercise.points} pts</span>
            </div>
          </div>
        </div>

        {/* Hint & Solution buttons */}
        <div className="flex flex-wrap gap-2 mb-4">
          <button
            onClick={() => setShowHint(!showHint)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              showHint
                ? 'bg-amber-100 text-amber-700 border border-amber-300'
                : 'bg-slate-50 text-slate-600 border border-slate-200 hover:bg-amber-50 hover:text-amber-700'
            }`}
          >
            💡 {showHint ? 'Masquer l\'indice' : 'Voir un indice'} 
            {!validated[currentEx] && <span className="text-xs ml-1 opacity-75">(-25%)</span>}
          </button>
          <button
            onClick={() => setShowSolution(!showSolution)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              showSolution
                ? 'bg-rose-100 text-rose-700 border border-rose-300'
                : 'bg-slate-50 text-slate-600 border border-slate-200 hover:bg-rose-50 hover:text-rose-700'
            }`}
          >
            👁️ {showSolution ? 'Masquer la solution' : 'Voir la solution'}
            {!validated[currentEx] && <span className="text-xs ml-1 opacity-75">(-50%)</span>}
          </button>
        </div>

        {/* Hint */}
        {showHint && (
          <div className="animate-scale-in mb-4 p-4 rounded-xl bg-amber-50 border border-amber-200">
            <p className="text-amber-800 flex items-start gap-2">
              <span className="text-lg">💡</span>
              <span>{exercise.hint}</span>
            </p>
          </div>
        )}

        {/* Solution */}
        {showSolution && (
          <div className="animate-scale-in mb-4 p-4 rounded-xl bg-slate-900">
            <div className="flex items-center justify-between mb-2">
              <span className="text-slate-400 text-sm">Solution :</span>
              <button
                onClick={() => setSql(exercise.solution)}
                className="text-xs text-cyan-400 hover:text-cyan-300 transition-colors"
              >
                📋 Copier dans l'éditeur
              </button>
            </div>
            <code className="text-cyan-300 font-mono text-sm">{exercise.solution}</code>
          </div>
        )}

        {/* SQL Editor */}
        <div className="bg-slate-900 rounded-xl overflow-hidden border border-slate-700">
          <div className="flex items-center justify-between px-4 py-2 bg-slate-800 border-b border-slate-700">
            <div className="flex items-center gap-2">
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
                <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
              </div>
              <span className="text-slate-500 text-xs ml-2 font-mono">exercice_{exercise.id}.sql</span>
            </div>
            <span className="text-slate-600 text-xs">Ctrl+Entrée</span>
          </div>
          <textarea
            ref={textareaRef}
            value={sql}
            onChange={e => setSql(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={`Écris ta requête SQL pour : "${exercise.title}"`}
            className="sql-editor w-full h-32 p-4 bg-transparent text-cyan-100 resize-none focus:outline-none placeholder-slate-600"
            spellCheck={false}
          />
          <div className="flex items-center justify-between px-4 py-2 bg-slate-800/50 border-t border-slate-700">
            <div />
            <button
              onClick={handleExecute}
              disabled={!sql.trim()}
              className={`px-5 py-2 font-semibold rounded-lg transition-all duration-300 flex items-center gap-2 text-sm
                ${sql.trim()
                  ? 'bg-gradient-to-r from-cyan-500 to-indigo-500 text-white shadow-lg active:scale-[0.98]'
                  : 'bg-slate-700 text-slate-500 cursor-not-allowed'}`}
            >
              ▶ Tester ma requête
            </button>
          </div>
        </div>

        {/* Results */}
        {result && (
          <div className={`animate-scale-in mt-4 rounded-xl border-2 overflow-hidden ${
            result.success 
              ? validated[currentEx] 
                ? 'border-emerald-300 bg-emerald-50'
                : 'border-amber-300 bg-amber-50'
              : 'border-rose-300 bg-rose-50'
          }`}>
            <div className={`px-4 py-2.5 flex items-center gap-2 ${
              result.success 
                ? validated[currentEx]
                  ? 'bg-emerald-100 text-emerald-700'
                  : 'bg-amber-100 text-amber-700'
                : 'bg-rose-100 text-rose-700'
            }`}>
              <span className="font-medium text-sm">
                {result.success 
                  ? validated[currentEx]
                    ? `🎉 Bravo ! Exercice validé ! (+${scores[currentEx]} pts)`
                    : '⚠️ La requête fonctionne mais ne correspond pas au résultat attendu.'
                  : result.error
                }
              </span>
            </div>
            
            {result.success && result.rows.length > 0 && (
              <div className="overflow-x-auto max-h-64 bg-white">
                <table className="w-full border-collapse">
                  <thead>
                    <tr>
                      {result.columns.map((col, i) => (
                        <th key={i} className="py-2 px-3 text-left font-semibold text-xs bg-slate-100 text-slate-600 border-b border-slate-200 whitespace-nowrap">
                          {col}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {result.rows.map((row, i) => (
                      <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                        {row.map((val, j) => (
                          <td key={j} className="py-2 px-3 border-b border-slate-100 text-sm text-slate-700 whitespace-nowrap">
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
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex gap-2">
          <button
            onClick={onPrev}
            className="px-5 py-2.5 bg-slate-100 text-slate-700 font-medium rounded-xl 
              hover:bg-slate-200 transition-all flex items-center gap-2 text-sm"
          >
            <span>←</span> Console SQL
          </button>
          {currentEx > 0 && (
            <button
              onClick={() => goToExercise(currentEx - 1)}
              className="px-5 py-2.5 bg-slate-100 text-slate-700 font-medium rounded-xl 
                hover:bg-slate-200 transition-all flex items-center gap-2 text-sm"
            >
              ← Exercice {currentEx}
            </button>
          )}
        </div>

        <div className="flex gap-2">
          {currentEx < EXERCISES.length - 1 && (
            <button
              onClick={() => goToExercise(currentEx + 1)}
              className="px-5 py-2.5 bg-indigo-100 text-indigo-700 font-medium rounded-xl 
                hover:bg-indigo-200 transition-all flex items-center gap-2 text-sm"
            >
              Exercice {currentEx + 2} →
            </button>
          )}
          {(allCompleted || validated.filter(v => v).length >= 5) && (
            <button
              onClick={handleFinish}
              className="px-6 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold 
                rounded-xl hover:from-emerald-600 hover:to-teal-600 transition-all duration-300 
                shadow-lg shadow-emerald-500/25 flex items-center gap-2 text-sm"
            >
              🏆 Voir ma note finale →
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
