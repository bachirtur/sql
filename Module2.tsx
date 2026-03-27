import { useState } from 'react';

interface Props {
  onNext: () => void;
  onPrev: () => void;
}

export default function Module2({ onNext, onPrev }: Props) {
  const [step, setStep] = useState<'initial' | 'identified' | 'corrected'>('initial');

  const initialData = [
    { id: 1, titre: 'Les Misérables', annee: 1862, note: 18 },
    { id: 2, titre: 'Le Petit Prince', annee: 1943, note: 17 },
    { id: 2, titre: "L'Étranger", annee: 1942, note: 16 },  // Doublon !
    { id: 4, titre: 'Germinal', annee: 1885, note: 15 },
    { id: 5, titre: 'Harry Potter', annee: 1997, note: 14 },
    { id: 5, titre: '1984', annee: 1949, note: 19 },          // Doublon !
  ];

  const correctedData = [
    { id: 1, titre: 'Les Misérables', annee: 1862, note: 18 },
    { id: 2, titre: 'Le Petit Prince', annee: 1943, note: 17 },
    { id: 3, titre: "L'Étranger", annee: 1942, note: 16 },
    { id: 4, titre: 'Germinal', annee: 1885, note: 15 },
    { id: 5, titre: 'Harry Potter', annee: 1997, note: 14 },
    { id: 6, titre: '1984', annee: 1949, note: 19 },
  ];

  const isDuplicate = (id: number, index: number) => {
    if (step === 'corrected') return false;
    return initialData.findIndex(r => r.id === id) !== index;
  };

  const data = step === 'corrected' ? correctedData : initialData;

  return (
    <div className="animate-fade-in space-y-8">
      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 p-8 md:p-12">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="relative">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-white/80 text-sm mb-4">
            <span>🔑</span> Module 2
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
            La Clé Primaire
          </h1>
          <p className="text-lg text-amber-100 max-w-2xl">
            La clé primaire est un attribut (ou ensemble d'attributs) qui identifie <strong>de manière unique</strong> chaque 
            tuple dans une table. Elle ne peut pas contenir de doublons ni de valeur nulle.
          </p>
        </div>
      </div>

      {/* Explanation */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-3">
          <span className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center">🎯</span>
          Pourquoi une clé primaire ?
        </h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
            <h3 className="font-semibold text-slate-700 mb-2">✅ Unicité</h3>
            <p className="text-sm text-slate-600">Chaque ligne doit pouvoir être identifiée de manière unique. Deux livres différents ne peuvent pas avoir le même identifiant.</p>
          </div>
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
            <h3 className="font-semibold text-slate-700 mb-2">✅ Non nulle</h3>
            <p className="text-sm text-slate-600">La clé primaire ne peut jamais être vide (NULL). Chaque enregistrement doit avoir un identifiant.</p>
          </div>
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
            <h3 className="font-semibold text-slate-700 mb-2">✅ Référence</h3>
            <p className="text-sm text-slate-600">Elle permet de créer des liens entre les tables grâce aux clés étrangères (module suivant).</p>
          </div>
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
            <h3 className="font-semibold text-slate-700 mb-2">✅ Performance</h3>
            <p className="text-sm text-slate-600">Le système utilise la clé primaire pour retrouver rapidement un enregistrement.</p>
          </div>
        </div>
      </div>

      {/* Interactive Exercise */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <h2 className="text-xl font-bold text-slate-800 mb-2 flex items-center gap-3">
          <span className="w-10 h-10 rounded-xl bg-rose-100 flex items-center justify-center">🔍</span>
          Exercice interactif : Trouvez les erreurs !
        </h2>
        <p className="text-slate-600 mb-6">
          La table ci-dessous contient des erreurs de clé primaire. La colonne <strong>"id"</strong> est 
          la clé primaire mais contient des <strong>doublons</strong>.
        </p>

        {/* Status Badge */}
        <div className="mb-4">
          {step === 'initial' && (
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-rose-100 text-rose-700 font-medium">
              ⚠️ La table contient des erreurs de clé primaire
            </div>
          )}
          {step === 'identified' && (
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-100 text-amber-700 font-medium animate-scale-in">
              🔍 Doublons identifiés ! (id = 2 et id = 5 apparaissent deux fois)
            </div>
          )}
          {step === 'corrected' && (
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-100 text-emerald-700 font-medium animate-scale-in">
              ✅ Table corrigée ! Chaque id est maintenant unique
            </div>
          )}
        </div>

        {/* Table */}
        <div className="overflow-x-auto mb-6">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className={`py-3 px-4 text-left font-semibold rounded-tl-lg ${
                  step === 'corrected' ? 'bg-emerald-500 text-white' : 'bg-slate-800 text-white'
                }`}>
                  🔑 id <span className="text-xs font-normal opacity-75">(clé primaire)</span>
                </th>
                <th className="py-3 px-4 text-left font-semibold bg-slate-800 text-white">titre</th>
                <th className="py-3 px-4 text-left font-semibold bg-slate-800 text-white">annee</th>
                <th className="py-3 px-4 text-left font-semibold bg-slate-800 text-white rounded-tr-lg">note</th>
              </tr>
            </thead>
            <tbody>
              {data.map((row, i) => {
                const duplicate = isDuplicate(row.id, i);
                return (
                  <tr key={i} className={`transition-all duration-500 ${
                    step === 'corrected' && (i === 2 || i === 5)
                      ? 'bg-emerald-50'
                      : duplicate && step === 'identified'
                      ? 'bg-rose-50'
                      : i % 2 === 0 ? 'bg-white' : 'bg-slate-50'
                  }`}>
                    <td className={`py-3 px-4 border-b font-mono text-sm transition-all duration-500 ${
                      step === 'corrected' && (i === 2 || i === 5)
                        ? 'border-emerald-200 text-emerald-700 font-bold'
                        : duplicate && step === 'identified'
                        ? 'border-rose-200 text-rose-600 font-bold'
                        : duplicate
                        ? 'border-slate-100 text-rose-500'
                        : 'border-slate-100 text-slate-700'
                    }`}>
                      <div className="flex items-center gap-2">
                        {row.id}
                        {duplicate && step === 'identified' && (
                          <span className="animate-scale-in text-rose-500 text-lg">❌</span>
                        )}
                        {step === 'corrected' && (i === 2 || i === 5) && (
                          <span className="animate-scale-in text-emerald-500 text-lg">✅</span>
                        )}
                      </div>
                    </td>
                    <td className={`py-3 px-4 border-b text-slate-700 ${
                      duplicate && step === 'identified' ? 'border-rose-200' : 
                      step === 'corrected' && (i === 2 || i === 5) ? 'border-emerald-200' : 'border-slate-100'
                    }`}>{row.titre}</td>
                    <td className={`py-3 px-4 border-b font-mono text-sm text-slate-700 ${
                      duplicate && step === 'identified' ? 'border-rose-200' : 
                      step === 'corrected' && (i === 2 || i === 5) ? 'border-emerald-200' : 'border-slate-100'
                    }`}>{row.annee}</td>
                    <td className={`py-3 px-4 border-b font-mono text-sm text-slate-700 ${
                      duplicate && step === 'identified' ? 'border-rose-200' : 
                      step === 'corrected' && (i === 2 || i === 5) ? 'border-emerald-200' : 'border-slate-100'
                    }`}>{row.note}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3">
          {step === 'initial' && (
            <button
              onClick={() => setStep('identified')}
              className="px-6 py-3 bg-gradient-to-r from-rose-500 to-orange-500 text-white font-semibold 
                rounded-xl hover:from-rose-600 hover:to-orange-600 transition-all duration-300 
                shadow-lg shadow-rose-500/25 active:scale-[0.98] flex items-center gap-2"
            >
              🔍 Identifier les doublons
            </button>
          )}
          {step === 'identified' && (
            <button
              onClick={() => setStep('corrected')}
              className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold 
                rounded-xl hover:from-emerald-600 hover:to-teal-600 transition-all duration-300 
                shadow-lg shadow-emerald-500/25 active:scale-[0.98] flex items-center gap-2 animate-scale-in"
            >
              🔧 Corriger les erreurs
            </button>
          )}
          {step === 'corrected' && (
            <button
              onClick={() => setStep('initial')}
              className="px-6 py-2.5 bg-slate-100 text-slate-700 font-medium rounded-xl 
                hover:bg-slate-200 transition-all flex items-center gap-2"
            >
              🔄 Recommencer
            </button>
          )}
        </div>
      </div>

      {/* Key takeaway */}
      {step === 'corrected' && (
        <div className="animate-fade-in bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl border border-emerald-200 p-6">
          <h3 className="text-lg font-bold text-emerald-800 mb-3 flex items-center gap-2">
            💡 À retenir
          </h3>
          <ul className="space-y-2 text-slate-700">
            <li className="flex items-start gap-2">
              <span className="text-emerald-500 mt-1">▸</span>
              La <strong>clé primaire</strong> identifie de manière unique chaque enregistrement
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-500 mt-1">▸</span>
              Elle <strong>ne peut pas contenir de doublons</strong>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-500 mt-1">▸</span>
              Souvent c'est un <strong>nombre entier auto-incrémenté</strong> (1, 2, 3, ...)
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-500 mt-1">▸</span>
              On la note souvent <strong>id</strong> ou <strong>PK</strong> (Primary Key)
            </li>
          </ul>
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
          Module suivant : Clé étrangère <span>→</span>
        </button>
      </div>
    </div>
  );
}
