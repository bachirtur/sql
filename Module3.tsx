import { useState } from 'react';

interface Props {
  onNext: () => void;
  onPrev: () => void;
}

export default function Module3({ onNext, onPrev }: Props) {
  const [highlightedAuthor, setHighlightedAuthor] = useState<number | null>(null);
  const [showRelations, setShowRelations] = useState(false);

  const livres = [
    { id: 1, titre: 'Les Misérables', annee: 1862, id_auteur: 1 },
    { id: 2, titre: 'Le Petit Prince', annee: 1943, id_auteur: 2 },
    { id: 3, titre: "L'Étranger", annee: 1942, id_auteur: 3 },
    { id: 4, titre: 'Germinal', annee: 1885, id_auteur: 4 },
    { id: 5, titre: 'Harry Potter', annee: 1997, id_auteur: 5 },
    { id: 6, titre: '1984', annee: 1949, id_auteur: 6 },
    { id: 7, titre: 'Notre-Dame de Paris', annee: 1831, id_auteur: 1 },
    { id: 8, titre: 'Vol de Nuit', annee: 1931, id_auteur: 2 },
  ];

  const auteurs = [
    { id: 1, nom: 'Hugo', prenom: 'Victor', nationalite: 'Français' },
    { id: 2, nom: 'Saint-Exupéry', prenom: 'Antoine', nationalite: 'Français' },
    { id: 3, nom: 'Camus', prenom: 'Albert', nationalite: 'Français' },
    { id: 4, nom: 'Zola', prenom: 'Émile', nationalite: 'Français' },
    { id: 5, nom: 'Rowling', prenom: 'J.K.', nationalite: 'Britannique' },
    { id: 6, nom: 'Orwell', prenom: 'George', nationalite: 'Britannique' },
  ];

  const colors = [
    'bg-blue-200 text-blue-800 border-blue-400',
    'bg-purple-200 text-purple-800 border-purple-400',
    'bg-emerald-200 text-emerald-800 border-emerald-400',
    'bg-amber-200 text-amber-800 border-amber-400',
    'bg-pink-200 text-pink-800 border-pink-400',
    'bg-cyan-200 text-cyan-800 border-cyan-400',
  ];

  const getAuteurColor = (id: number) => colors[(id - 1) % colors.length];

  return (
    <div className="animate-fade-in space-y-8">
      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-600 to-pink-600 p-8 md:p-12">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="relative">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-white/80 text-sm mb-4">
            <span>🔗</span> Module 3
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Clé Étrangère et Relations
          </h1>
          <p className="text-lg text-purple-100 max-w-2xl">
            Une <strong>clé étrangère</strong> est un attribut qui fait référence à la clé primaire d'une autre table. 
            Elle crée un <strong>lien</strong> entre deux tables.
          </p>
        </div>
      </div>

      {/* Explanation */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-3">
          <span className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">🧩</span>
          Comment ça marche ?
        </h2>
        <div className="space-y-3 text-slate-600">
          <p>
            Dans notre base, la table <strong>LIVRES</strong> possède un attribut <code className="px-2 py-0.5 bg-purple-100 rounded text-purple-700 font-mono text-sm">id_auteur</code> 
            qui fait référence à l'attribut <code className="px-2 py-0.5 bg-indigo-100 rounded text-indigo-700 font-mono text-sm">id</code> de la table <strong>AUTEURS</strong>.
          </p>
          <p>
            Cela signifie que chaque livre est <strong>associé à un auteur</strong> grâce à cette clé étrangère.
          </p>
          <div className="flex items-center gap-3 p-3 rounded-lg bg-purple-50 mt-4">
            <span className="text-lg">💡</span>
            <p className="text-sm text-purple-800">
              <strong>Avantage :</strong> On évite de répéter les informations de l'auteur dans chaque livre. 
              C'est le principe de <strong>normalisation</strong> des bases de données.
            </p>
          </div>
        </div>
      </div>

      {/* Interactive button */}
      <div className="flex items-center gap-3 p-4 rounded-xl bg-indigo-50 border border-indigo-200">
        <span className="text-2xl">👆</span>
        <p className="text-indigo-800 flex-1">
          <strong>Interaction :</strong> Survole la colonne <code className="px-2 py-0.5 bg-indigo-100 rounded text-indigo-700 font-mono text-sm">id_auteur</code> 
          d'un livre pour voir la relation avec son auteur.
        </p>
        <button
          onClick={() => setShowRelations(!showRelations)}
          className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
            showRelations 
              ? 'bg-indigo-500 text-white' 
              : 'bg-white text-indigo-600 border border-indigo-300 hover:bg-indigo-100'
          }`}
        >
          {showRelations ? '🔗 Relations ON' : '🔗 Voir toutes les relations'}
        </button>
      </div>

      {/* Tables side by side */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* LIVRES table */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="bg-gradient-to-r from-indigo-500 to-blue-500 text-white py-3 px-4 font-bold flex items-center gap-2">
            📚 Table : LIVRES
          </div>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="bg-slate-50">
                  <th className="py-2.5 px-3 text-left font-semibold text-slate-700 border-b border-slate-200">
                    🔑 id
                  </th>
                  <th className="py-2.5 px-3 text-left font-semibold text-slate-700 border-b border-slate-200">
                    titre
                  </th>
                  <th className="py-2.5 px-3 text-left font-semibold text-slate-700 border-b border-slate-200">
                    annee
                  </th>
                  <th className="py-2.5 px-3 text-left font-semibold text-purple-600 border-b border-purple-200 bg-purple-50">
                    🔗 id_auteur
                  </th>
                </tr>
              </thead>
              <tbody>
                {livres.map((livre, i) => (
                  <tr 
                    key={i} 
                    className={`transition-all duration-300 ${
                      highlightedAuthor === livre.id_auteur 
                        ? 'bg-indigo-50' 
                        : showRelations 
                        ? '' 
                        : i % 2 === 0 ? 'bg-white' : 'bg-slate-50'
                    }`}
                  >
                    <td className="py-2.5 px-3 border-b border-slate-100 font-mono text-slate-600">{livre.id}</td>
                    <td className="py-2.5 px-3 border-b border-slate-100 text-slate-700">{livre.titre}</td>
                    <td className="py-2.5 px-3 border-b border-slate-100 font-mono text-slate-600">{livre.annee}</td>
                    <td 
                      className={`py-2.5 px-3 border-b font-mono cursor-pointer transition-all duration-300 ${
                        highlightedAuthor === livre.id_auteur
                          ? `font-bold border-2 rounded ${getAuteurColor(livre.id_auteur)}`
                          : showRelations
                          ? `${getAuteurColor(livre.id_auteur)} border-slate-100`
                          : 'border-slate-100 text-purple-600 hover:bg-purple-50'
                      }`}
                      onMouseEnter={() => setHighlightedAuthor(livre.id_auteur)}
                      onMouseLeave={() => !showRelations && setHighlightedAuthor(null)}
                    >
                      <div className="flex items-center gap-1">
                        {livre.id_auteur}
                        {(highlightedAuthor === livre.id_auteur || showRelations) && (
                          <span className="text-xs">→</span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* AUTEURS table */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 px-4 font-bold flex items-center gap-2">
            ✍️ Table : AUTEURS
          </div>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="bg-slate-50">
                  <th className="py-2.5 px-3 text-left font-semibold text-indigo-600 border-b border-indigo-200 bg-indigo-50">
                    🔑 id
                  </th>
                  <th className="py-2.5 px-3 text-left font-semibold text-slate-700 border-b border-slate-200">
                    nom
                  </th>
                  <th className="py-2.5 px-3 text-left font-semibold text-slate-700 border-b border-slate-200">
                    prenom
                  </th>
                  <th className="py-2.5 px-3 text-left font-semibold text-slate-700 border-b border-slate-200">
                    nationalite
                  </th>
                </tr>
              </thead>
              <tbody>
                {auteurs.map((auteur, i) => (
                  <tr 
                    key={i} 
                    className={`transition-all duration-300 ${
                      highlightedAuthor === auteur.id 
                        ? `${getAuteurColor(auteur.id)} font-medium` 
                        : showRelations 
                        ? `${getAuteurColor(auteur.id)}`
                        : i % 2 === 0 ? 'bg-white' : 'bg-slate-50'
                    }`}
                  >
                    <td className={`py-2.5 px-3 border-b font-mono transition-all duration-300 ${
                      highlightedAuthor === auteur.id 
                        ? 'font-bold border-indigo-200' 
                        : showRelations 
                        ? 'font-bold border-slate-100' 
                        : 'border-slate-100 text-indigo-600'
                    }`}>
                      <div className="flex items-center gap-1">
                        {(highlightedAuthor === auteur.id || showRelations) && (
                          <span className="text-xs">←</span>
                        )}
                        {auteur.id}
                      </div>
                    </td>
                    <td className="py-2.5 px-3 border-b border-slate-100 text-slate-700">{auteur.nom}</td>
                    <td className="py-2.5 px-3 border-b border-slate-100 text-slate-700">{auteur.prenom}</td>
                    <td className="py-2.5 px-3 border-b border-slate-100 text-slate-700">{auteur.nationalite}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Relation explanation */}
      {highlightedAuthor !== null && (
        <div className="animate-scale-in bg-white rounded-2xl border-2 border-purple-200 p-6 shadow-lg">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center text-2xl flex-shrink-0">
              🔗
            </div>
            <div>
              <h3 className="text-lg font-bold text-purple-700 mb-2">
                Relation : id_auteur = {highlightedAuthor} → {auteurs.find(a => a.id === highlightedAuthor)?.prenom} {auteurs.find(a => a.id === highlightedAuthor)?.nom}
              </h3>
              <p className="text-slate-600 mb-3">
                Les livres avec <code className="px-2 py-0.5 bg-purple-100 rounded text-purple-700 font-mono text-sm">id_auteur = {highlightedAuthor}</code> sont 
                liés à l'auteur <strong>{auteurs.find(a => a.id === highlightedAuthor)?.prenom} {auteurs.find(a => a.id === highlightedAuthor)?.nom}</strong> :
              </p>
              <div className="flex flex-wrap gap-2">
                {livres.filter(l => l.id_auteur === highlightedAuthor).map((l, i) => (
                  <span key={i} className="px-3 py-1 rounded-full bg-indigo-100 text-indigo-700 text-sm font-medium">
                    📖 {l.titre} ({l.annee})
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SQL JOIN preview */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-3">
          <span className="w-10 h-10 rounded-xl bg-cyan-100 flex items-center justify-center">💻</span>
          Requête SQL : Le JOIN
        </h2>
        <p className="text-slate-600 mb-4">
          Pour récupérer les données de deux tables liées, on utilise la commande <strong>JOIN</strong> :
        </p>
        <div className="bg-slate-900 rounded-xl p-4 font-mono text-sm mb-4 overflow-x-auto">
          <div>
            <span className="text-purple-400 font-bold">SELECT</span>
            <span className="text-cyan-300"> titre</span>
            <span className="text-white">, </span>
            <span className="text-cyan-300">nom</span>
            <span className="text-white">, </span>
            <span className="text-cyan-300">prenom</span>
          </div>
          <div>
            <span className="text-purple-400 font-bold">FROM</span>
            <span className="text-yellow-300"> livres</span>
          </div>
          <div>
            <span className="text-purple-400 font-bold">JOIN</span>
            <span className="text-yellow-300"> auteurs</span>
            <span className="text-purple-400 font-bold"> ON</span>
            <span className="text-cyan-300"> livres</span>
            <span className="text-white">.</span>
            <span className="text-cyan-300">id_auteur</span>
            <span className="text-white"> = </span>
            <span className="text-cyan-300">auteurs</span>
            <span className="text-white">.</span>
            <span className="text-cyan-300">id</span>
          </div>
        </div>
        <p className="text-slate-500 text-sm">
          👉 Tu pourras tester cette requête dans la console SQL au module suivant !
        </p>
      </div>

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
          Console SQL interactive <span>→</span>
        </button>
      </div>
    </div>
  );
}
