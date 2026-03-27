interface Props {
  student: { nom: string; prenom: string; classe: string };
  scores: number[];
  onRestart: () => void;
}

const EXERCISE_NAMES = [
  'Afficher tous les livres',
  'Afficher uniquement les titres',
  'Livres publiés après 1940',
  'Auteurs français',
  'Joindre livres et auteurs (JOIN)',
  'Livres bien notés (≥ 16)',
  'Trier par année',
  'Défi : Requête libre',
];

const MAX_POINTS = [2, 2, 2.5, 2.5, 3, 2.5, 2.5, 3];

export default function Results({ student, scores, onRestart }: Props) {
  const totalScore = scores.reduce((a, b) => a + b, 0);
  const maxScore = MAX_POINTS.reduce((a, b) => a + b, 0);
  const percentage = (totalScore / maxScore) * 100;

  const getGrade = () => {
    if (percentage >= 90) return { emoji: '🏆', text: 'Excellent !', color: 'text-amber-500', bg: 'from-amber-400 to-yellow-500' };
    if (percentage >= 75) return { emoji: '🌟', text: 'Très bien !', color: 'text-emerald-500', bg: 'from-emerald-400 to-teal-500' };
    if (percentage >= 60) return { emoji: '👍', text: 'Bien !', color: 'text-blue-500', bg: 'from-blue-400 to-indigo-500' };
    if (percentage >= 40) return { emoji: '📚', text: 'Peut mieux faire', color: 'text-orange-500', bg: 'from-orange-400 to-amber-500' };
    return { emoji: '💪', text: 'Continue tes efforts !', color: 'text-rose-500', bg: 'from-rose-400 to-pink-500' };
  };

  const grade = getGrade();

  const getScoreColor = (score: number, max: number) => {
    const pct = (score / max) * 100;
    if (pct >= 90) return 'text-emerald-600 bg-emerald-50';
    if (pct >= 50) return 'text-amber-600 bg-amber-50';
    return 'text-rose-600 bg-rose-50';
  };

  return (
    <div className="animate-fade-in space-y-8">
      {/* Celebration Header */}
      <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${grade.bg} p-8 md:p-12`}>
        <div className="absolute inset-0 overflow-hidden">
          {Array.from({ length: 20 }).map((_, i) => (
            <div
              key={i}
              className="absolute text-2xl opacity-20"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                transform: `rotate(${Math.random() * 360}deg)`,
              }}
            >
              {['⭐', '🎉', '✨', '🏆', '💎'][Math.floor(Math.random() * 5)]}
            </div>
          ))}
        </div>
        <div className="relative text-center">
          <div className="text-7xl mb-4">{grade.emoji}</div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
            {grade.text}
          </h1>
          <p className="text-xl text-white/80">
            {student.prenom} {student.nom} — {student.classe}
          </p>
        </div>
      </div>

      {/* Score Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-lg text-center">
        <h2 className="text-lg text-slate-500 mb-2 uppercase tracking-wide font-medium">Note finale</h2>
        <div className="flex items-baseline justify-center gap-2 mb-6">
          <span className={`text-7xl font-black ${grade.color}`}>
            {totalScore.toFixed(1)}
          </span>
          <span className="text-3xl text-slate-300 font-light">/ {maxScore}</span>
        </div>

        {/* Circular progress */}
        <div className="relative inline-flex items-center justify-center mb-6">
          <svg className="w-32 h-32 -rotate-90" viewBox="0 0 120 120">
            <circle
              cx="60" cy="60" r="50"
              fill="none"
              stroke="#e2e8f0"
              strokeWidth="10"
            />
            <circle
              cx="60" cy="60" r="50"
              fill="none"
              stroke="url(#gradient)"
              strokeWidth="10"
              strokeLinecap="round"
              strokeDasharray={`${percentage * 3.14} 314`}
              className="transition-all duration-1000 ease-out"
            />
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#6366f1" />
                <stop offset="100%" stopColor="#a855f7" />
              </linearGradient>
            </defs>
          </svg>
          <span className="absolute text-2xl font-bold text-slate-700">
            {Math.round(percentage)}%
          </span>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 max-w-md mx-auto">
          <div className="p-3 rounded-xl bg-indigo-50">
            <div className="text-2xl font-bold text-indigo-600">{scores.filter(s => s > 0).length}</div>
            <div className="text-xs text-slate-500">Exercices réussis</div>
          </div>
          <div className="p-3 rounded-xl bg-emerald-50">
            <div className="text-2xl font-bold text-emerald-600">{scores.filter((s, i) => s === MAX_POINTS[i]).length}</div>
            <div className="text-xs text-slate-500">Score parfait</div>
          </div>
          <div className="p-3 rounded-xl bg-amber-50">
            <div className="text-2xl font-bold text-amber-600">{8 - scores.filter(s => s > 0).length}</div>
            <div className="text-xs text-slate-500">Non complétés</div>
          </div>
        </div>
      </div>

      {/* Detailed scores */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-3">
          <span className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center">📊</span>
          Détail des résultats
        </h2>
        <div className="space-y-3">
          {EXERCISE_NAMES.map((name, i) => (
            <div
              key={i}
              className="flex items-center gap-4 p-3 rounded-xl bg-slate-50 border border-slate-100"
            >
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold ${
                scores[i] === MAX_POINTS[i]
                  ? 'bg-emerald-500 text-white'
                  : scores[i] > 0
                  ? 'bg-amber-400 text-white'
                  : 'bg-slate-300 text-white'
              }`}>
                {scores[i] > 0 ? '✓' : i + 1}
              </div>
              <div className="flex-1">
                <div className="font-medium text-slate-700 text-sm">{name}</div>
              </div>
              <div className={`px-3 py-1 rounded-full font-bold text-sm ${getScoreColor(scores[i], MAX_POINTS[i])}`}>
                {scores[i]} / {MAX_POINTS[i]}
              </div>
              {/* Mini progress bar */}
              <div className="w-20 h-2 bg-slate-200 rounded-full overflow-hidden hidden sm:block">
                <div
                  className={`h-full rounded-full transition-all ${
                    scores[i] === MAX_POINTS[i]
                      ? 'bg-emerald-500'
                      : scores[i] > 0
                      ? 'bg-amber-400'
                      : 'bg-slate-300'
                  }`}
                  style={{ width: `${(scores[i] / MAX_POINTS[i]) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tips */}
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl border border-indigo-200 p-6">
        <h3 className="text-lg font-bold text-indigo-800 mb-4 flex items-center gap-2">
          💡 Pour aller plus loin
        </h3>
        <ul className="space-y-2 text-slate-700 text-sm">
          <li className="flex items-start gap-2">
            <span className="text-indigo-500 mt-0.5">▸</span>
            Pratique les requêtes JOIN pour bien comprendre les relations entre tables
          </li>
          <li className="flex items-start gap-2">
            <span className="text-indigo-500 mt-0.5">▸</span>
            Explore les fonctions d'agrégation : COUNT, SUM, AVG, MIN, MAX
          </li>
          <li className="flex items-start gap-2">
            <span className="text-indigo-500 mt-0.5">▸</span>
            Apprends à combiner WHERE avec AND et OR pour des filtres complexes
          </li>
          <li className="flex items-start gap-2">
            <span className="text-indigo-500 mt-0.5">▸</span>
            Utilise ORDER BY avec ASC (croissant) et DESC (décroissant)
          </li>
        </ul>
      </div>

      {/* Restart */}
      <div className="text-center">
        <button
          onClick={onRestart}
          className="px-8 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold 
            rounded-xl hover:from-indigo-600 hover:to-purple-700 transition-all duration-300 
            shadow-lg shadow-indigo-500/25 hover:shadow-xl active:scale-[0.98] transform"
        >
          🔄 Recommencer depuis le début
        </button>
      </div>
    </div>
  );
}
