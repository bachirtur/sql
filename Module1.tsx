import { useState } from 'react';
import { createDefaultDatabase } from '../utils/sqlEngine';

interface Props {
  onNext: () => void;
  onPrev: () => void;
}

type HighlightType = 'none' | 'column' | 'row' | 'cell' | 'header';

interface Highlight {
  type: HighlightType;
  index: number;
  colIndex?: number;
}

export default function Module1({ onNext, onPrev }: Props) {
  const [highlight, setHighlight] = useState<Highlight>({ type: 'none', index: -1 });
  const [explanation, setExplanation] = useState<{ title: string; text: string; icon: string } | null>(null);

  const db = createDefaultDatabase();
  const table = db.livres;
  const columns = table.columns;
  const rows = table.rows;

  const handleHeaderClick = (colIndex: number) => {
    setHighlight({ type: 'column', index: colIndex });
    setExplanation({
      title: `Attribut : "${columns[colIndex]}"`,
      text: `Un attribut (ou colonne) définit un type d'information stockée dans la table. L'attribut "${columns[colIndex]}" contient ${
        colIndex === 0 ? "l'identifiant unique de chaque livre" :
        colIndex === 1 ? "le titre du livre" :
        colIndex === 2 ? "l'année de publication" :
        colIndex === 3 ? "la note attribuée au livre (sur 20)" :
        "la référence vers l'auteur du livre"
      }.`,
      icon: '📋',
    });
  };

  const handleRowClick = (rowIndex: number) => {
    setHighlight({ type: 'row', index: rowIndex });
    const row = rows[rowIndex];
    setExplanation({
      title: `Tuple n°${rowIndex + 1} : "${row.titre}"`,
      text: `Un tuple (ou n-uplet) est une ligne de la table. Ce tuple contient toutes les informations sur le livre "${row.titre}" : publié en ${row.annee}, avec une note de ${row.note}/20.`,
      icon: '📝',
    });
  };

  const handleCellClick = (rowIndex: number, colIndex: number) => {
    setHighlight({ type: 'cell', index: rowIndex, colIndex });
    const value = rows[rowIndex][columns[colIndex]];
    setExplanation({
      title: `Valeur : ${columns[colIndex]} = "${value}"`,
      text: `Cette cellule contient la valeur "${value}" pour l'attribut "${columns[colIndex]}" du livre "${rows[rowIndex].titre}". Chaque cellule se trouve à l'intersection d'une ligne (tuple) et d'une colonne (attribut).`,
      icon: '📍',
    });
  };

  const isHighlighted = (rowIndex: number, colIndex: number) => {
    if (highlight.type === 'column' && colIndex === highlight.index) return true;
    if (highlight.type === 'row' && rowIndex === highlight.index) return true;
    if (highlight.type === 'cell' && rowIndex === highlight.index && colIndex === highlight.colIndex) return true;
    return false;
  };

  const isHeaderHighlighted = (colIndex: number) => {
    if (highlight.type === 'column' && colIndex === highlight.index) return true;
    return false;
  };

  return (
    <div className="animate-fade-in space-y-8">
      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-600 p-8 md:p-12">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="relative">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-white/80 text-sm mb-4">
            <span>🧩</span> Module 1
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Comprendre une Table
          </h1>
          <p className="text-lg text-blue-100 max-w-2xl">
            Clique sur les éléments de la table ci-dessous pour comprendre leur rôle. 
            Chaque clic affiche une explication détaillée.
          </p>
        </div>
      </div>

      {/* Instruction */}
      <div className="flex items-center gap-3 p-4 rounded-xl bg-amber-50 border border-amber-200">
        <span className="text-2xl">👆</span>
        <p className="text-amber-800">
          <strong>Interaction :</strong> Clique sur un <strong>en-tête de colonne</strong> pour comprendre l'attribut, 
          sur un <strong>numéro de ligne</strong> pour comprendre le tuple, 
          ou sur une <strong>cellule</strong> pour voir la valeur.
        </p>
      </div>

      {/* Interactive Table */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm overflow-x-auto">
        <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
          📚 Table : LIVRES
          <span className="text-sm font-normal text-slate-500">({rows.length} tuples, {columns.length} attributs)</span>
        </h3>

        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="py-3 px-2 text-center text-slate-400 text-sm font-normal w-10">#</th>
              {columns.map((col, i) => (
                <th
                  key={i}
                  onClick={() => handleHeaderClick(i)}
                  className={`py-3 px-4 text-left font-semibold cursor-pointer transition-all duration-300
                    ${isHeaderHighlighted(i)
                      ? 'bg-indigo-500 text-white shadow-lg scale-[1.02]'
                      : 'bg-slate-100 text-slate-700 hover:bg-indigo-100 hover:text-indigo-700'
                    }
                    ${i === 0 ? 'rounded-tl-lg' : ''} ${i === columns.length - 1 ? 'rounded-tr-lg' : ''}`}
                >
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${
                      isHeaderHighlighted(i) ? 'bg-white' : 'bg-indigo-400'
                    }`} />
                    {col}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, rowIndex) => (
              <tr key={rowIndex} className="group">
                <td
                  onClick={() => handleRowClick(rowIndex)}
                  className={`py-3 px-2 text-center text-sm cursor-pointer transition-all duration-300 border-b border-slate-100
                    ${highlight.type === 'row' && highlight.index === rowIndex
                      ? 'bg-emerald-500 text-white font-bold'
                      : 'text-slate-400 hover:bg-emerald-100 hover:text-emerald-700'
                    }`}
                >
                  {rowIndex + 1}
                </td>
                {columns.map((col, colIndex) => (
                  <td
                    key={colIndex}
                    onClick={() => handleCellClick(rowIndex, colIndex)}
                    className={`py-3 px-4 border-b border-slate-100 cursor-pointer transition-all duration-300
                      ${isHighlighted(rowIndex, colIndex)
                        ? highlight.type === 'cell'
                          ? 'bg-amber-400 text-amber-900 font-bold shadow-inner'
                          : highlight.type === 'row'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-indigo-100 text-indigo-800'
                        : `${rowIndex % 2 === 0 ? 'bg-white' : 'bg-slate-50'} hover:bg-blue-50`
                      }
                      ${colIndex === 0 ? 'font-mono text-sm' : ''}
                      ${colIndex === 3 ? 'font-mono text-sm' : ''}`}
                  >
                    {String(row[col])}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Explanation Panel */}
      {explanation && (
        <div className="animate-scale-in bg-white rounded-2xl border-2 border-indigo-200 p-6 shadow-lg">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-indigo-100 flex items-center justify-center text-2xl flex-shrink-0">
              {explanation.icon}
            </div>
            <div>
              <h3 className="text-lg font-bold text-indigo-700 mb-2">{explanation.title}</h3>
              <p className="text-slate-600 leading-relaxed">{explanation.text}</p>
            </div>
          </div>
        </div>
      )}

      {/* Legend */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="flex items-center gap-3 p-3 rounded-lg bg-indigo-50 border border-indigo-100">
          <div className="w-4 h-4 rounded bg-indigo-500" />
          <span className="text-sm text-slate-700"><strong>Bleu</strong> = Attribut (colonne)</span>
        </div>
        <div className="flex items-center gap-3 p-3 rounded-lg bg-emerald-50 border border-emerald-100">
          <div className="w-4 h-4 rounded bg-emerald-500" />
          <span className="text-sm text-slate-700"><strong>Vert</strong> = Tuple (ligne)</span>
        </div>
        <div className="flex items-center gap-3 p-3 rounded-lg bg-amber-50 border border-amber-100">
          <div className="w-4 h-4 rounded bg-amber-400" />
          <span className="text-sm text-slate-700"><strong>Jaune</strong> = Valeur (cellule)</span>
        </div>
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
          Module suivant : Clé primaire <span>→</span>
        </button>
      </div>
    </div>
  );
}
