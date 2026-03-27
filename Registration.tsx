import { useState } from 'react';

interface Props {
  onRegister: (info: { nom: string; prenom: string; classe: string }) => void;
}

export default function Registration({ onRegister }: Props) {
  const [nom, setNom] = useState('');
  const [prenom, setPrenom] = useState('');
  const [classe, setClasse] = useState('');
  const [errors, setErrors] = useState<{ nom?: string; prenom?: string; classe?: string }>({});

  const validate = () => {
    const errs: typeof errors = {};
    if (!nom.trim()) errs.nom = 'Le nom est requis';
    if (!prenom.trim()) errs.prenom = 'Le prénom est requis';
    if (!classe.trim()) errs.classe = 'La classe est requise';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onRegister({ nom: nom.trim(), prenom: prenom.trim(), classe: classe.trim() });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 p-4">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-500/5 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-lg animate-fade-in">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-2xl shadow-indigo-500/25 mb-6">
            <span className="text-4xl">🎓</span>
          </div>
          <h1 className="text-4xl font-bold text-white mb-3">
            SQL <span className="bg-gradient-to-r from-cyan-400 to-indigo-400 bg-clip-text text-transparent">Academy</span>
          </h1>
          <p className="text-slate-400 text-lg">
            Apprends le SQL en pratiquant !
          </p>
        </div>

        {/* Registration Card */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl">
          <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center text-indigo-400">📝</span>
            Inscription
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Prénom
              </label>
              <input
                type="text"
                value={prenom}
                onChange={e => setPrenom(e.target.value)}
                placeholder="Ex: Marie"
                className={`w-full px-4 py-3 bg-white/5 border rounded-xl text-white placeholder-slate-500 
                  focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all
                  ${errors.prenom ? 'border-rose-500' : 'border-white/10'}`}
              />
              {errors.prenom && <p className="mt-1 text-sm text-rose-400">{errors.prenom}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Nom
              </label>
              <input
                type="text"
                value={nom}
                onChange={e => setNom(e.target.value)}
                placeholder="Ex: Dupont"
                className={`w-full px-4 py-3 bg-white/5 border rounded-xl text-white placeholder-slate-500 
                  focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all
                  ${errors.nom ? 'border-rose-500' : 'border-white/10'}`}
              />
              {errors.nom && <p className="mt-1 text-sm text-rose-400">{errors.nom}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Classe
              </label>
              <input
                type="text"
                value={classe}
                onChange={e => setClasse(e.target.value)}
                placeholder="Ex: 1ère NSI"
                className={`w-full px-4 py-3 bg-white/5 border rounded-xl text-white placeholder-slate-500 
                  focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all
                  ${errors.classe ? 'border-rose-500' : 'border-white/10'}`}
              />
              {errors.classe && <p className="mt-1 text-sm text-rose-400">{errors.classe}</p>}
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold 
                rounded-xl hover:from-indigo-600 hover:to-purple-700 transition-all duration-300 
                shadow-lg shadow-indigo-500/25 hover:shadow-xl hover:shadow-indigo-500/40
                active:scale-[0.98] transform"
            >
              Commencer l'aventure SQL →
            </button>
          </form>
        </div>

        <p className="text-center text-slate-500 text-sm mt-6">
          📚 8 exercices pratiques · 💻 Console SQL interactive · 🏆 Note sur 20
        </p>
      </div>
    </div>
  );
}
