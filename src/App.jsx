/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useMemo, useEffect } from 'react';
import { 
  Search, Gamepad2, X, Maximize2, Minimize2, ExternalLink, 
  TrendingUp, Clock, Star, LayoutGrid, Trophy, 
  Flame, Zap, Target, Car, Sword, Ghost, MousePointer2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import gamesData from './games.json';

const CATEGORIES = [
  { name: 'All', icon: LayoutGrid },
  { name: 'Action', icon: Flame },
  { name: 'Shooter', icon: Target },
  { name: 'Sports', icon: Trophy },
  { name: 'Driving', icon: Car },
  { name: 'Adventure', icon: Sword },
  { name: 'Simulation', icon: Zap },
  { name: 'Idle', icon: MousePointer2 },
];

export default function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedGame, setSelectedGame] = useState(null);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [recentlyPlayed, setRecentlyPlayed] = useState([]);

  // Load recently played from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('hcgames_recent');
    if (saved) {
      setRecentlyPlayed(JSON.parse(saved));
    }
  }, []);

  // Update recently played
  const addToRecent = (game) => {
    const updated = [game, ...recentlyPlayed.filter(g => g.id !== game.id)].slice(0, 6);
    setRecentlyPlayed(updated);
    localStorage.setItem('hcgames_recent', JSON.stringify(updated));
  };

  const filteredGames = useMemo(() => {
    return gamesData.filter((game) => {
      const matchesSearch = game.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || game.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  const featuredGame = useMemo(() => {
    return gamesData.find(g => g.id === '1v1-lol') || gamesData[0];
  }, []);

  const relatedGames = useMemo(() => {
    if (!selectedGame) return [];
    return gamesData
      .filter(g => g.category === selectedGame.category && g.id !== selectedGame.id)
      .slice(0, 4);
  }, [selectedGame]);

  const toggleFullScreen = () => {
    setIsFullScreen(!isFullScreen);
  };

  const playRandomGame = () => {
    const randomGame = gamesData[Math.floor(Math.random() * gamesData.length)];
    setSelectedGame(randomGame);
    addToRecent(randomGame);
  };

  const handleGameSelect = (game) => {
    setSelectedGame(game);
    addToRecent(game);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 font-sans selection:bg-emerald-500/30">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#020617]/90 backdrop-blur-xl border-b border-slate-800/50">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          <div 
            className="flex items-center gap-3 cursor-pointer group shrink-0"
            onClick={() => {
              setSelectedGame(null);
              setSearchQuery('');
              setSelectedCategory('All');
            }}
          >
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform duration-300">
              <Gamepad2 className="text-white w-6 h-6" />
            </div>
            <h1 className="text-2xl font-black tracking-tighter text-white hidden sm:block">
              HC<span className="text-emerald-500">GAMES</span>
            </h1>
          </div>

          <div className="flex-1 max-w-2xl relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-emerald-500 transition-colors" />
            <input
              type="text"
              placeholder="Search 100+ unblocked games..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-900/50 border border-slate-800 rounded-2xl py-2.5 pl-11 pr-4 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500/50 transition-all placeholder:text-slate-600"
            />
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button 
              onClick={playRandomGame}
              className="hidden md:flex items-center gap-2 px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-xl text-sm font-bold transition-all shadow-lg shadow-emerald-500/20 active:scale-95"
            >
              <Zap className="w-4 h-4 fill-current" />
              Random
            </button>
            <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center cursor-pointer hover:bg-slate-700 transition-colors">
              <Ghost className="w-5 h-5 text-slate-400" />
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-[1600px] mx-auto flex gap-6 px-4 sm:px-6 py-6">
        {/* Sidebar - Desktop Only */}
        <aside className="hidden lg:flex flex-col gap-2 w-64 shrink-0 sticky top-[88px] h-[calc(100vh-112px)] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-slate-800">
          <div className="px-3 mb-2">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Categories</h3>
          </div>
          {CATEGORIES.map((cat) => (
            <button
              key={cat.name}
              onClick={() => {
                setSelectedCategory(cat.name);
                setSelectedGame(null);
              }}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                selectedCategory === cat.name 
                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                : 'text-slate-400 hover:bg-slate-900 hover:text-white border border-transparent'
              }`}
            >
              <cat.icon className={`w-5 h-5 ${selectedCategory === cat.name ? 'text-emerald-400' : 'text-slate-500 group-hover:text-slate-300'}`} />
              <span className="font-semibold">{cat.name}</span>
              {selectedCategory === cat.name && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]" />}
            </button>
          ))}

          {recentlyPlayed.length > 0 && (
            <div className="mt-8">
              <div className="px-3 mb-4 flex items-center gap-2">
                <Clock className="w-3 h-3 text-slate-500" />
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Recent</h3>
              </div>
              <div className="flex flex-col gap-2">
                {recentlyPlayed.map(game => (
                  <button
                    key={game.id}
                    onClick={() => handleGameSelect(game)}
                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-900 transition-colors group"
                  >
                    <img src={game.thumbnail} className="w-10 h-10 rounded-md object-cover" alt="" referrerPolicy="no-referrer" />
                    <span className="text-sm font-medium text-slate-400 group-hover:text-white truncate">{game.title}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </aside>

        {/* Main Content */}
        <main className="flex-1 min-w-0">
          {selectedGame ? (
            /* Game View */
            <motion.div 
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className={`relative flex flex-col gap-6 ${isFullScreen ? 'fixed inset-0 z-[100] bg-black p-0' : ''}`}
            >
              <div className={`flex items-center justify-between ${isFullScreen ? 'p-4 bg-slate-900/80 backdrop-blur' : ''}`}>
                <div className="flex items-center gap-4">
                  <button 
                    onClick={() => setSelectedGame(null)}
                    className="p-2.5 bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white rounded-xl transition-all border border-slate-800"
                  >
                    <X className="w-5 h-5" />
                  </button>
                  <div>
                    <h2 className="text-2xl font-black text-white leading-none">{selectedGame.title}</h2>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs font-bold text-emerald-500 uppercase tracking-wider">{selectedGame.category}</span>
                      <span className="text-slate-700">•</span>
                      <div className="flex items-center gap-1">
                        <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                        <span className="text-xs font-bold text-slate-400">{selectedGame.rating}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={toggleFullScreen}
                    className="p-2.5 bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white rounded-xl transition-all border border-slate-800"
                    title={isFullScreen ? "Exit Fullscreen" : "Fullscreen"}
                  >
                    {isFullScreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
                  </button>
                  <a 
                    href={selectedGame.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="p-2.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-500 rounded-xl transition-all border border-emerald-500/20"
                  >
                    <ExternalLink className="w-5 h-5" />
                  </a>
                </div>
              </div>

              <div className={`relative w-full bg-slate-950 rounded-3xl overflow-hidden shadow-2xl border border-slate-800/50 ${isFullScreen ? 'h-full rounded-none border-none' : 'aspect-video'}`}>
                <iframe
                  src={selectedGame.url}
                  className="w-full h-full border-none"
                  allowFullScreen
                  title={selectedGame.title}
                />
              </div>
              
              {!isFullScreen && (
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                  <div className="xl:col-span-2 space-y-6">
                    <div className="p-8 bg-slate-900/50 rounded-3xl border border-slate-800/50">
                      <h3 className="text-xl font-black text-white mb-4">Description</h3>
                      <p className="text-slate-400 leading-relaxed text-lg">
                        {selectedGame.description}
                      </p>
                      <div className="mt-8 p-4 bg-emerald-500/5 rounded-2xl border border-emerald-500/10 flex items-start gap-4">
                        <div className="p-2 bg-emerald-500/20 rounded-lg">
                          <Zap className="w-5 h-5 text-emerald-500" />
                        </div>
                        <div>
                          <h4 className="font-bold text-emerald-400">Pro Tip</h4>
                          <p className="text-sm text-slate-500 mt-1">Use Fullscreen mode for the best experience. If the game doesn't load, try disabling your ad-blocker.</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest px-2">Related Games</h3>
                    <div className="grid grid-cols-1 gap-3">
                      {relatedGames.map(game => (
                        <div 
                          key={game.id}
                          onClick={() => handleGameSelect(game)}
                          className="flex items-center gap-4 p-3 bg-slate-900/30 hover:bg-slate-900 rounded-2xl border border-slate-800/50 transition-all cursor-pointer group"
                        >
                          <img src={game.thumbnail} className="w-16 h-16 rounded-xl object-cover" alt="" referrerPolicy="no-referrer" />
                          <div>
                            <h4 className="font-bold text-white group-hover:text-emerald-400 transition-colors">{game.title}</h4>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{game.category}</span>
                              <div className="flex items-center gap-1">
                                <Star className="w-2.5 h-2.5 text-yellow-500 fill-yellow-500" />
                                <span className="text-[10px] font-bold text-slate-500">{game.rating}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          ) : (
            /* Home View */
            <div className="space-y-12">
              {/* Featured Hero */}
              {selectedCategory === 'All' && !searchQuery && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="relative h-[400px] rounded-[40px] overflow-hidden group cursor-pointer border border-slate-800/50 shadow-2xl"
                  onClick={() => handleGameSelect(featuredGame)}
                >
                  <img src={featuredGame.thumbnail} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt="" referrerPolicy="no-referrer" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-[#020617]/40 to-transparent" />
                  <div className="absolute bottom-0 left-0 p-10 w-full md:w-2/3">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="px-3 py-1 bg-emerald-500 text-slate-950 text-[10px] font-black uppercase tracking-widest rounded-full">Featured</span>
                      <span className="px-3 py-1 bg-white/10 backdrop-blur-md text-white text-[10px] font-black uppercase tracking-widest rounded-full">{featuredGame.category}</span>
                    </div>
                    <h2 className="text-5xl font-black text-white tracking-tighter mb-4">{featuredGame.title}</h2>
                    <p className="text-slate-300 text-lg line-clamp-2 mb-8 max-w-xl">
                      {featuredGame.description}
                    </p>
                    <button className="flex items-center gap-3 px-8 py-4 bg-white text-slate-950 rounded-2xl font-black text-lg hover:bg-emerald-400 transition-all active:scale-95">
                      <Zap className="w-6 h-6 fill-current" />
                      Play Now
                    </button>
                  </div>
                </motion.div>
              )}

              {/* Games Grid Section */}
              <section>
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-3">
                    <div className="w-1.5 h-8 bg-emerald-500 rounded-full" />
                    <h2 className="text-3xl font-black text-white tracking-tight">
                      {searchQuery ? 'Search Results' : selectedCategory === 'All' ? 'Popular Games' : `${selectedCategory} Games`}
                    </h2>
                  </div>
                  <div className="flex items-center gap-2 text-slate-500 font-bold text-sm">
                    <TrendingUp className="w-4 h-4" />
                    <span>{filteredGames.length} Games</span>
                  </div>
                </div>

                {filteredGames.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-5">
                    <AnimatePresence mode="popLayout">
                      {filteredGames.map((game) => (
                        <motion.div
                          layout
                          key={game.id}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.9 }}
                          whileHover={{ y: -8 }}
                          className="group relative bg-slate-900/40 rounded-3xl overflow-hidden border border-slate-800/50 hover:border-emerald-500/50 transition-all duration-300 cursor-pointer shadow-lg"
                          onClick={() => handleGameSelect(game)}
                        >
                          <div className="aspect-[4/3] overflow-hidden relative">
                            <img
                              src={game.thumbnail}
                              alt={game.title}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                              referrerPolicy="no-referrer"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80 group-hover:opacity-60 transition-opacity" />
                            <div className="absolute top-3 right-3 px-2 py-1 bg-black/60 backdrop-blur-md rounded-lg border border-white/10 flex items-center gap-1">
                              <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                              <span className="text-[10px] font-black text-white">{game.rating}</span>
                            </div>
                          </div>
                          
                          <div className="p-5">
                            <h3 className="font-black text-white text-lg group-hover:text-emerald-400 transition-colors truncate">
                              {game.title}
                            </h3>
                            <div className="flex items-center justify-between mt-2">
                              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{game.category}</span>
                              <div className="w-8 h-8 rounded-xl bg-slate-800 flex items-center justify-center group-hover:bg-emerald-500 group-hover:rotate-12 transition-all duration-300">
                                <Zap className="w-4 h-4 text-white fill-current" />
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                ) : (
                  <div className="text-center py-32 bg-slate-900/20 rounded-[40px] border border-dashed border-slate-800">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-slate-900 border border-slate-800 mb-6">
                      <Search className="w-10 h-10 text-slate-700" />
                    </div>
                    <h3 className="text-2xl font-black text-white">No games found</h3>
                    <p className="text-slate-500 mt-2 max-w-sm mx-auto font-medium">We couldn't find any games matching your request. Try a different category or search term.</p>
                    <button 
                      onClick={() => {
                        setSearchQuery('');
                        setSelectedCategory('All');
                      }}
                      className="mt-8 px-8 py-3 bg-emerald-500 text-slate-950 rounded-2xl font-black hover:bg-emerald-400 transition-all active:scale-95"
                    >
                      Browse All Games
                    </button>
                  </div>
                )}
              </section>
            </div>
          )}
        </main>
      </div>

      {/* Footer */}
      <footer className="mt-20 border-t border-slate-800/50 py-16 bg-[#010413]">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center">
                  <Gamepad2 className="text-white w-6 h-6" />
                </div>
                <span className="text-2xl font-black text-white tracking-tighter">HCGAMES</span>
              </div>
              <p className="text-slate-500 font-medium leading-relaxed">
                The ultimate destination for unblocked games at school or work. 
                Fast, free, and always updated with the latest titles.
              </p>
            </div>
            
            <div>
              <h4 className="text-white font-black uppercase tracking-widest text-sm mb-6">Quick Links</h4>
              <ul className="space-y-4 text-slate-500 font-bold">
                <li><a href="#" className="hover:text-emerald-500 transition-colors">New Games</a></li>
                <li><a href="#" className="hover:text-emerald-500 transition-colors">Trending</a></li>
                <li><a href="#" className="hover:text-emerald-500 transition-colors">Top Rated</a></li>
                <li><a href="#" className="hover:text-emerald-500 transition-colors">Random Game</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-black uppercase tracking-widest text-sm mb-6">Support</h4>
              <ul className="space-y-4 text-slate-500 font-bold">
                <li><a href="#" className="hover:text-emerald-500 transition-colors">Contact Us</a></li>
                <li><a href="#" className="hover:text-emerald-500 transition-colors">FAQ</a></li>
                <li><a href="#" className="hover:text-emerald-500 transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-emerald-500 transition-colors">Terms of Use</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-black uppercase tracking-widest text-sm mb-6">Newsletter</h4>
              <p className="text-slate-500 text-sm mb-4 font-medium">Get the latest unblocked games in your inbox.</p>
              <div className="flex gap-2">
                <input type="email" placeholder="Email address" className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-emerald-500 w-full" />
                <button className="bg-emerald-500 text-slate-950 px-4 py-2 rounded-xl font-black text-sm hover:bg-emerald-400 transition-all">Join</button>
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-slate-800/50 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-slate-600 font-bold">
              © 2026 HCGAMES. Built for gamers, by gamers.
            </p>
            <div className="flex gap-6">
              <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center hover:bg-slate-800 cursor-pointer transition-colors">
                <Ghost className="w-4 h-4 text-slate-500" />
              </div>
              <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center hover:bg-slate-800 cursor-pointer transition-colors">
                <Zap className="w-4 h-4 text-slate-500" />
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
