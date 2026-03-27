import { useState } from 'react';

interface Props {
  onNext: () => void;
}

export default function Introduction({ onNext }: Props) {
  const [activeCard, setActiveCard] = useState<number | null>(null);

  const concepts = [
    {
      icon: '📊',
      title: 'Table (Relation)',
      description: 'Une table est un ensemble organisé de données structurées en lignes et colonnes. En base de données relationnelle, on appelle aussi une table une "relation".',
      example: 'Exemple : une table LIVRES contient toutes les informations sur les livres d\'une bibliothèque.',
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'bg-blue-500/10',
      borderColor: 'border-blue-500/30',
    },
    {
      icon: '📋',
      title: 'Attribut (Colonne)',
      description: 'Un attribut est une caractéristique, une propriété décrite dans la table. Chaque colonne de la table correspond à un attribut.',
      example: 'Exemple : titre, auteur, année de publication sont des attributs de la table LIVRES.',
      color: 'from-purple-500 to-pink-500',
      bgColor: 'bg-purple-500/10',
      borderColor: 'border-purple-500/30',
    },
    {
      icon: '📝',
      title: 'Tuple (Ligne)',
      description: 'Un tuple (ou n-uplet) est un enregistrement dans la table. Chaque ligne représente une entrée unique avec des valeurs pour chaque attribut.',
      example: 'Exemple : la ligne ("Les Misérables", "Hugo", 1862) est un tuple de la table LIVRES.',
      color: 'from-emerald-500 to-teal-500',
      bgColor: 'bg-emerald-500/10',
      borderColor: 'border-emerald-500/30',
    },
  ];

  return (
    <div className="animate-fade-in space-y-8">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-600 via-purple-600 to-indigo-700 p-8 md:p-12">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
        
        <div className="relative">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-white/80 text-sm mb-4">
            <span>📖</span> Introduction
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Les Bases de Données Relationnelles
          </h1>
          <p className="text-lg text-indigo-100 max-w-2xl">
            Une base de données relationnelle est un système qui organise les données sous forme de 
            <strong> tables </strong> reliées entre elles. C'est le modèle le plus utilisé au monde, 
            inventé par Edgar F. Codd en 1970.
          </p>
        </div>
      </div>

      {/* SQL Introduction */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8 shadow-sm">
        <h2 className="text-2xl font-bold text-slate-800 mb-4 flex items-center gap-3">
          <span className="w-10 h-10 rounded-xl bg-cyan-100 flex items-center justify-center">💻</span>
          Qu'est-ce que SQL ?
        </h2>
        <p className="text-slate-600 leading-relaxed mb-4">
          <strong>SQL</strong> (Structured Query Language) est le langage utilisé pour communiquer avec 
          une base de données. Il permet de <strong>lire</strong>, <strong>ajouter</strong>, 
          <strong>modifier</strong> et <strong>supprimer</strong> des données.
        </p>
        <div className="bg-slate-900 rounded-xl p-4 font-mono text-sm">
          <div className="text-slate-400 mb-2">-- Exemple de requête SQL :</div>
          <div>
            <span className="text-purple-400 font-bold">SELECT</span>
            <span className="text-cyan-300"> titre</span>
            <span className="text-white">, </span>
            <span className="text-cyan-300">auteur</span>
            <span className="text-white"> </span>
            <span className="text-purple-400 font-bold">FROM</span>
            <span className="text-yellow-300"> livres</span>
          </div>
          <div>
            <span className="text-purple-400 font-bold">WHERE</span>
            <span className="text-cyan-300"> annee</span>
            <span className="text-white"> {'>'} </span>
            <span className="text-orange-300">1900</span>
            <span className="text-white">;</span>
          </div>
        </div>
      </div>

      {/* Key Concepts */}
      <div>
        <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-3">
          <span className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center">🔑</span>
          Les 3 concepts clés
        </h2>
        <p className="text-slate-600 mb-6">
          Clique sur chaque carte pour en savoir plus :
        </p>

        <div className="grid md:grid-cols-3 gap-4">
          {concepts.map((concept, index) => (
            <button
              key={index}
              onClick={() => setActiveCard(activeCard === index ? null : index)}
              className={`text-left p-6 rounded-2xl border-2 transition-all duration-300 transform hover:scale-[1.02]
                ${activeCard === index 
                  ? `${concept.bgColor} ${concept.borderColor} shadow-lg` 
                  : 'bg-white border-slate-200 hover:border-slate-300 shadow-sm'}`}
            >
              <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br ${concept.color} text-2xl mb-4 shadow-lg`}>
                {concept.icon}
              </div>
              <h3 className="text-lg font-bold text-slate-800 mb-2">{concept.title}</h3>
              <p className="text-slate-600 text-sm leading-relaxed">{concept.description}</p>
              
              {activeCard === index && (
                <div className="mt-4 pt-4 border-t border-slate-200 animate-fade-in">
                  <div className="flex items-start gap-2">
                    <span className="text-amber-500 mt-0.5">💡</span>
                    <p className="text-slate-700 text-sm font-medium">{concept.example}</p>
                  </div>
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Visual Schema */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8 shadow-sm">
        <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-3">
          <span className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">🗂️</span>
          Visualisation d'une table
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th colSpan={4} className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-center py-3 px-4 rounded-t-xl text-lg font-bold">
                  📚 Table : LIVRES
                </th>
              </tr>
              <tr className="bg-indigo-50">
                <th className="py-3 px-4 text-left text-indigo-700 font-semibold border-b-2 border-indigo-200">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-indigo-500" />
                    id
                  </div>
                </th>
                <th className="py-3 px-4 text-left text-indigo-700 font-semibold border-b-2 border-indigo-200">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-purple-500" />
                    titre
                  </div>
                </th>
                <th className="py-3 px-4 text-left text-indigo-700 font-semibold border-b-2 border-indigo-200">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-cyan-500" />
                    annee
                  </div>
                </th>
                <th className="py-3 px-4 text-left text-indigo-700 font-semibold border-b-2 border-indigo-200">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    note
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              {[
                { id: 1, titre: 'Les Misérables', annee: 1862, note: 18 },
                { id: 2, titre: 'Le Petit Prince', annee: 1943, note: 17 },
                { id: 3, titre: "L'Étranger", annee: 1942, note: 16 },
              ].map((row, i) => (
                <tr key={i} className={`${i % 2 === 0 ? 'bg-white' : 'bg-slate-50'} hover:bg-indigo-50/50 transition-colors`}>
                  <td className="py-3 px-4 border-b border-slate-100 font-mono text-sm text-slate-700">{row.id}</td>
                  <td className="py-3 px-4 border-b border-slate-100 text-slate-700">{row.titre}</td>
                  <td className="py-3 px-4 border-b border-slate-100 font-mono text-sm text-slate-700">{row.annee}</td>
                  <td className="py-3 px-4 border-b border-slate-100 font-mono text-sm text-slate-700">{row.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="flex items-center gap-3 p-3 rounded-lg bg-indigo-50">
            <span className="text-lg">↕️</span>
            <div>
              <div className="font-semibold text-sm text-indigo-700">Colonnes = Attributs</div>
              <div className="text-xs text-slate-500">id, titre, annee, note</div>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 rounded-lg bg-emerald-50">
            <span className="text-lg">↔️</span>
            <div>
              <div className="font-semibold text-sm text-emerald-700">Lignes = Tuples</div>
              <div className="text-xs text-slate-500">Chaque livre est un tuple</div>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 rounded-lg bg-amber-50">
            <span className="text-lg">📍</span>
            <div>
              <div className="font-semibold text-sm text-amber-700">Cellule = Valeur</div>
              <div className="text-xs text-slate-500">L'intersection ligne × colonne</div>
            </div>
          </div>
        </div>
      </div>

      {/* Next button */}
      <div className="flex justify-end">
        <button
          onClick={onNext}
          className="px-8 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold 
            rounded-xl hover:from-indigo-600 hover:to-purple-700 transition-all duration-300 
            shadow-lg shadow-indigo-500/25 hover:shadow-xl active:scale-[0.98] transform
            flex items-center gap-2"
        >
          Module suivant : Comprendre une table
          <span>→</span>
        </button>
      </div>
    </div>
  );
}
