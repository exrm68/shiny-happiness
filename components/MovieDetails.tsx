import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Play, Star, ShieldCheck, X, Download, Send, ExternalLink } from 'lucide-react';
import { Movie, Episode } from '../types';

interface MovieDetailsProps {
  movie: Movie;
  onClose: () => void;
  botUsername: string;
  channelLink: string;
}

const MovieDetails: React.FC<MovieDetailsProps> = ({ movie, onClose, botUsername, channelLink }) => {
  const [activeTab, setActiveTab] = useState<'episodes' | 'info'>('episodes');
  const [selectedSeason, setSelectedSeason] = useState<number>(1);

  // ✅ Watch হ্যান্ডলার - Stream/Watch এর জন্য
  const handleWatch = (code: string) => {
    const url = `https://t.me/${botUsername}?start=${code}`;
    
    // @ts-ignore
    if (window.Telegram?.WebApp) {
        // @ts-ignore
        window.Telegram.WebApp.openTelegramLink(url);
    } else {
        window.open(url, '_blank');
    }
  };

  // ✅ Download হ্যান্ডলার - Download এর জন্য
  const handleDownload = (downloadCode?: string, downloadLink?: string, fallbackCode?: string) => {
    if (downloadLink) {
      // যদি external link দেওয়া থাকে (Google Drive, Mega, etc)
      window.open(downloadLink, '_blank');
    } else if (downloadCode) {
      // যদি আলাদা download telegram code দেওয়া থাকে
      const url = `https://t.me/${botUsername}?start=${downloadCode}`;
      // @ts-ignore
      if (window.Telegram?.WebApp) {
          // @ts-ignore
          window.Telegram.WebApp.openTelegramLink(url);
      } else {
          window.open(url, '_blank');
      }
    } else if (fallbackCode) {
      // নাহলে watch code ই ব্যবহার করবে (backward compatibility)
      handleWatch(fallbackCode);
    }
  };

  const isSeries = movie.category === 'Series' || movie.category === 'Korean Drama' || (movie.episodes && movie.episodes.length > 0);

  // ✅ Group episodes by season - Fixed version
  const episodesBySeason = useMemo(() => {
      if (!movie.episodes) return {};
      const groups: Record<number, typeof movie.episodes> = {};
      movie.episodes.forEach(ep => {
          const s = ep.season || 1;
          if (!groups[s]) groups[s] = [];
          groups[s].push(ep);
      });
      // Sort episodes within each season by number
      Object.keys(groups).forEach(season => {
          groups[Number(season)].sort((a, b) => a.number - b.number);
      });
      return groups;
  }, [movie.episodes]);

  const availableSeasons = Object.keys(episodesBySeason).map(Number).sort((a,b) => a-b);
  const currentEpisodes = episodesBySeason[selectedSeason] || [];

  return (
      <motion.div
        initial={{ opacity: 0, y: '100%' }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: '100%' }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className="fixed inset-0 z-[100] bg-[#000] flex flex-col h-full font-sans"
      >
        {/* Parallax Background Layer - Fixed 16:9 */}
        <div className="absolute top-0 left-0 w-full aspect-[16/9] z-0">
             <img
              src={movie.detailBanner || movie.thumbnail}
              alt={movie.title}
              className="w-full h-full object-cover opacity-60"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#000] via-[#000]/80 to-transparent" />
        </div>

        {/* Fixed Header with Working Close Button */}
        <div className="absolute top-0 inset-x-0 z-[110] flex justify-between items-center p-4 pt-6 pointer-events-none">
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    onClose();
                }}
                className="pointer-events-auto w-10 h-10 rounded-full bg-black/50 backdrop-blur-xl border border-white/20 flex items-center justify-center text-white hover:bg-white/10 active:scale-90 transition-all shadow-lg"
            >
                <X size={22} />
            </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto no-scrollbar relative z-10 pt-[35vh]">
            <div className="px-6 pb-24 bg-gradient-to-t from-black via-black to-transparent min-h-[65vh]">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                {/* Tags */}
                <div className="flex flex-wrap items-center gap-2 mb-4">
                  <span className="bg-gold text-black px-2 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-widest shadow-[0_0_10px_rgba(255,215,0,0.3)]">
                    {movie.category}
                  </span>
                  <span className="bg-white/10 backdrop-blur-md px-2 py-0.5 rounded text-[10px] font-bold text-gray-200 border border-white/10">
                      {movie.quality || 'HD'}
                  </span>
                  {movie.year && (
                     <span className="text-gray-400 text-xs font-bold pl-1">• {movie.year}</span>
                  )}
                  {/* Download Available Badge */}
                  {(movie.downloadCode || movie.downloadLink) && (
                    <span className="bg-green-500/20 text-green-400 px-2 py-0.5 rounded text-[9px] font-bold border border-green-500/30">
                      ⬇ DOWNLOAD
                    </span>
                  )}
                </div>
                
                {/* Title */}
                <h1 className="text-4xl md:text-5xl font-serif font-black text-white leading-[1.0] mb-4 drop-shadow-2xl">
                  {movie.title}
                </h1>

                {/* Enhanced Metadata Row - Clean Professional */}
                {(movie.duration || movie.fileSize || movie.audioLanguage || movie.subtitles) && (
                  <div className="flex flex-wrap items-center gap-2 mb-6">
                    {movie.duration && (
                      <div className="flex items-center gap-1.5 bg-purple-500/10 px-3 py-1.5 rounded-lg border border-purple-500/20">
                        <span className="text-xs font-bold text-purple-300">{movie.duration}</span>
                      </div>
                    )}
                    {movie.fileSize && (
                      <div className="flex items-center gap-1.5 bg-green-500/10 px-3 py-1.5 rounded-lg border border-green-500/20">
                        <span className="text-xs font-bold text-green-300">{movie.fileSize}</span>
                      </div>
                    )}
                    {movie.audioLanguage && (
                      <div className="flex items-center gap-1.5 bg-blue-500/10 px-3 py-1.5 rounded-lg border border-blue-500/20">
                        <span className="text-xs font-bold text-blue-300">{movie.audioLanguage}</span>
                      </div>
                    )}
                    {movie.subtitles && (
                      <div className="flex items-center gap-1.5 bg-pink-500/10 px-3 py-1.5 rounded-lg border border-pink-500/20">
                        <span className="text-xs font-bold text-pink-300">{movie.subtitles}</span>
                      </div>
                    )}
                    {movie.videoQuality && (
                      <div className="flex items-center gap-1.5 bg-yellow-500/10 px-3 py-1.5 rounded-lg border border-yellow-500/20">
                        <span className="text-xs font-bold text-yellow-300">{movie.videoQuality}</span>
                      </div>
                    )}
                  </div>
                )}

                {/* Stats */}
                <div className="flex items-center gap-4 text-xs font-semibold text-gray-300 mb-8 border-b border-white/10 pb-6">
                  <div className="flex items-center gap-1.5 text-gold">
                    <Star size={14} fill="#FFD700" />
                    <span className="text-white">{movie.rating}</span>
                  </div>
                  <span className="w-1 h-1 bg-gray-600 rounded-full"></span>
                  <span>{movie.views} Views</span>
                  <span className="w-1 h-1 bg-gray-600 rounded-full"></span>
                  <span className="flex items-center gap-1"><ShieldCheck size={12} className="text-green-500"/> Verified</span>
                </div>

                {/* ✅ FIXED: Action Buttons for Movies - Now with SEPARATE functionality */}
                {!isSeries && (
                  <div className="flex flex-col gap-3 w-full mb-8">
                    <div className="flex gap-3">
                        {/* Watch/Stream Button */}
                        <button
                          onClick={() => handleWatch(movie.telegramCode)}
                          className="flex-1 bg-gold text-black py-4 px-6 rounded-2xl font-extrabold text-sm flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(255,215,0,0.2)] hover:bg-[#ffe033] active:scale-98 transition-all"
                        >
                          <Play size={20} fill="black" />
                          STREAM NOW
                        </button>
                        
                        {/* Download Button - NOW WITH SEPARATE FUNCTIONALITY */}
                        <button
                          onClick={() => handleDownload(movie.downloadCode, movie.downloadLink, movie.telegramCode)}
                          className="flex-1 bg-[#1a1a1a] border border-white/10 text-white py-4 px-6 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-[#222] active:scale-98 transition-all"
                        >
                          {movie.downloadLink ? <ExternalLink size={20} /> : <Download size={20} />}
                          DOWNLOAD
                        </button>
                    </div>
                    
                    {/* Telegram Join Box */}
                    <div 
                        onClick={() => window.open(channelLink, '_blank')}
                        className="mt-2 w-full p-3 rounded-xl bg-[#0088cc]/10 border border-[#0088cc]/30 flex items-center justify-center cursor-pointer active:scale-98 transition-transform"
                    >
                        <Send size={24} className="text-[#0088cc]" />
                    </div>
                  </div>
                )}

                {/* Tabs for Series */}
                {isSeries && (
                    <div className="flex items-center gap-6 mb-6 border-b border-white/10">
                    <button 
                        onClick={() => setActiveTab('episodes')}
                        className={`pb-3 text-xs font-bold tracking-wider uppercase transition-all ${activeTab === 'episodes' ? 'text-gold border-b-2 border-gold' : 'text-gray-500 hover:text-gray-300'}`}
                    >
                        Episodes
                    </button>
                    <button 
                        onClick={() => setActiveTab('info')}
                        className={`pb-3 text-xs font-bold tracking-wider uppercase transition-all ${activeTab === 'info' ? 'text-gold border-b-2 border-gold' : 'text-gray-500 hover:text-gray-300'}`}
                    >
                        About
                    </button>
                    </div>
                )}

                {/* Content Area */}
                <div className="min-h-[200px]">
                    {/* ✅ FIXED: Episodes Tab with SEPARATE Watch and Download buttons */}
                    {isSeries && activeTab === 'episodes' && (
                        <div>
                           {/* Season Selector */}
                           {availableSeasons.length > 0 && (
                               <div className="flex gap-2 mb-4 overflow-x-auto no-scrollbar pb-2">
                                   {availableSeasons.map(seasonNum => (
                                       <button
                                         key={seasonNum}
                                         onClick={() => setSelectedSeason(seasonNum)}
                                         className={`px-4 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-colors ${selectedSeason === seasonNum ? 'bg-gold text-black' : 'bg-white/10 text-gray-400 hover:text-white'}`}
                                       >
                                           Season {seasonNum}
                                       </button>
                                   ))}
                               </div>
                           )}

                           {/* Episode List - PREMIUM with Coming Soon Support */}
                           <div className="space-y-3">
                              {currentEpisodes.length > 0 ? currentEpisodes.map((ep, index) => {
                                const isLocked = ep.isComingSoon || ep.isUpcoming || (movie.comingSoonSeasons?.includes(ep.season));
                                return (
                                  <motion.div 
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    key={ep.id} 
                                    className={`group flex items-center gap-3 p-3 rounded-xl bg-[#111] border transition-all ${
                                      isLocked 
                                        ? 'border-yellow-500/20 cursor-not-allowed' 
                                        : 'border-white/5 hover:bg-[#1a1a1a] hover:border-gold/30'
                                    }`}
                                  >
                                    {/* Episode Thumbnail */}
                                    <div 
                                      onClick={() => !isLocked && handleWatch(ep.telegramCode)}
                                      className={`relative rounded-lg overflow-hidden shrink-0 ${
                                        isLocked ? 'cursor-not-allowed' : 'cursor-pointer hover:scale-105'
                                      } transition-transform ${ep.thumbnail ? 'w-24 h-14' : 'w-14 h-14'}`}
                                    >
                                        {ep.thumbnail ? (
                                          // Premium: Episode specific thumbnail
                                          <>
                                            <img 
                                              src={ep.thumbnail} 
                                              className={`absolute inset-0 w-full h-full object-cover ${isLocked ? 'blur-md' : ''}`} 
                                              alt={ep.title} 
                                            />
                                            {isLocked && (
                                              <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
                                                <div className="text-center">
                                                  <div className="text-2xl mb-1">🔒</div>
                                                  <div className="text-[8px] text-yellow-400 font-bold">LOCKED</div>
                                                </div>
                                              </div>
                                            )}
                                            {!isLocked && (
                                              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 flex items-center justify-center transition-all">
                                                <Play size={20} fill="white" className="text-white opacity-0 group-hover:opacity-100 transition-opacity drop-shadow-lg" />
                                              </div>
                                            )}
                                          </>
                                        ) : (
                                          // Default: Movie thumbnail with play icon or lock
                                          <>
                                            <img 
                                              src={movie.thumbnail} 
                                              className={`absolute inset-0 w-full h-full object-cover ${isLocked ? 'blur-md opacity-30' : 'opacity-40 blur-[2px]'}`} 
                                              alt="" 
                                            />
                                            {isLocked ? (
                                              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60">
                                                <div className="text-xl">🔒</div>
                                              </div>
                                            ) : (
                                              <Play size={18} fill="white" className="text-white z-10 drop-shadow-lg relative" />
                                            )}
                                          </>
                                        )}
                                    </div>

                                    {/* Episode Info */}
                                    <div 
                                      onClick={() => !isLocked && handleWatch(ep.telegramCode)}
                                      className={`flex-1 min-w-0 ${isLocked ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                                    >
                                        <div className="flex justify-between items-start mb-1">
                                            <h4 className={`text-sm font-bold truncate pr-2 leading-tight transition-colors ${
                                              isLocked ? 'text-gray-500' : 'text-gray-200 group-hover:text-gold'
                                            }`}>
                                                {ep.number}. {ep.title}
                                            </h4>
                                            {!isLocked && (
                                              <span className="text-[10px] font-mono text-gray-500 bg-black/50 px-1.5 py-0.5 rounded shrink-0">
                                                {ep.duration}
                                              </span>
                                            )}
                                        </div>
                                        
                                        {isLocked ? (
                                          // Coming Soon - NO metadata, only badge
                                          <div className="flex items-center gap-2">
                                            <span className="text-[10px] bg-yellow-500/20 text-yellow-400 px-2 py-0.5 rounded-full border border-yellow-500/30 font-bold">
                                              COMING SOON
                                            </span>
                                            {ep.releaseDate && (
                                              <span className="text-[9px] text-gray-500">{ep.releaseDate}</span>
                                            )}
                                          </div>
                                        ) : (
                                          // Available - Show metadata
                                          <div className="flex items-center gap-2 flex-wrap">
                                            <p className="text-[10px] text-gray-500">S{ep.season} • E{ep.number}</p>
                                            
                                            {ep.fileSize && (
                                              <span className="text-[9px] text-green-400">{ep.fileSize}</span>
                                            )}
                                            {ep.quality && (
                                              <span className="text-[9px] text-blue-400">{ep.quality}</span>
                                            )}
                                            {ep.audioLanguage && (
                                              <span className="text-[9px] text-purple-400">{ep.audioLanguage}</span>
                                            )}
                                            
                                            {(ep.downloadCode || ep.downloadLink) && (
                                              <span className="text-[9px] text-green-400 flex items-center gap-0.5">
                                                <Download size={8} />
                                                DL
                                              </span>
                                            )}
                                          </div>
                                        )}
                                    </div>

                                    {/* Action Buttons - Hidden for locked */}
                                    {!isLocked && (
                                      <div className="flex items-center gap-2 shrink-0">
                                        {/* Download Button */}
                                        <button
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            handleDownload(ep.downloadCode, ep.downloadLink, ep.telegramCode);
                                          }}
                                          className="p-2.5 border bg-[#1a1a1a] hover:bg-[#252525] border-white/10 rounded-lg active:scale-95 transition-all group/btn"
                                          title="Download Episode"
                                        >
                                          {ep.downloadLink ? (
                                            <ExternalLink size={14} className="text-gray-400 group-hover/btn:text-white transition-colors" />
                                          ) : (
                                            <Download size={14} className="text-gray-400 group-hover/btn:text-green-400 transition-colors" />
                                          )}
                                        </button>
                                        
                                        {/* Watch Button */}
                                        <button 
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            handleWatch(ep.telegramCode);
                                          }}
                                          className="p-2.5 border bg-gold/10 hover:bg-gold/20 border-gold/30 rounded-lg active:scale-95 transition-all"
                                          title="Watch Episode"
                                        >
                                          <Play size={14} fill="#FFD700" className="text-gold" />
                                        </button>
                                      </div>
                                    )}
                                  </motion.div>
                                );
                              })

                                    {/* Action Buttons - SEPARATE Watch and Download */}
                                    <div className="flex items-center gap-2 shrink-0">
                                        {/* Download Button */}
                                        <button
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            if (!isLocked) {
                                              handleDownload(ep.downloadCode, ep.downloadLink, ep.telegramCode);
                                            }
                                          }}
                                          disabled={isLocked}
                                          className={`p-2.5 border rounded-lg transition-all ${
                                            isLocked 
                                              ? 'bg-gray-800 border-gray-700 cursor-not-allowed opacity-40'
                                              : 'bg-[#1a1a1a] hover:bg-[#252525] border-white/10 active:scale-95'
                                          } group/btn`}
                                          title={isLocked ? "Coming Soon" : "Download Episode"}
                                        >
                                          {ep.downloadLink ? (
                                            <ExternalLink size={14} className="text-gray-400 group-hover/btn:text-white transition-colors" />
                                          ) : (
                                            <Download size={14} className="text-gray-400 group-hover/btn:text-green-400 transition-colors" />
                                          )}
                                        </button>
                                        
                                        {/* Watch Button */}
                                        <button 
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            if (!isLocked) {
                                              handleWatch(ep.telegramCode);
                                            }
                                          }}
                                          disabled={isLocked}
                                          className={`p-2.5 border rounded-lg transition-all ${
                                            isLocked 
                                              ? 'bg-gray-800 border-gray-700 cursor-not-allowed opacity-40'
                                              : 'bg-gold/10 hover:bg-gold/20 border-gold/30 active:scale-95'
                                          }`}
                                          title={isLocked ? "Coming Soon" : "Watch Episode"}
                                        >
                                          <Play size={14} fill={isLocked ? "gray" : "#FFD700"} className={isLocked ? "text-gray-600" : "text-gold"} />
                                        </button>
                                    </div>
                                  </motion.div>
                                );
                              }) : (
                                  <div className="text-center py-12 text-gray-500 text-sm">
                                    <div className="mb-2 text-2xl">📺</div>
                                    No episodes available for Season {selectedSeason}
                                  </div>
                              )}
                           </div>
                        </div>
                    )}

                    {/* Info Tab */}
                    {(!isSeries || activeTab === 'info') && (
                        <div className="space-y-6 animate-in fade-in zoom-in duration-300">
                             <p className="text-gray-300 text-sm leading-7 font-medium opacity-90">
                                {movie.description || 'No description available for this content.'}
                            </p>
                            
                            {/* Screenshots Gallery */}
                            {movie.screenshots && movie.screenshots.length > 0 && (
                              <div className="space-y-3">
                                <h3 className="text-sm font-bold text-white uppercase tracking-wider">Screenshots</h3>
                                <div className="grid grid-cols-2 gap-2 overflow-hidden">
                                  {movie.screenshots.slice(0, 8).map((screenshot, idx) => (
                                    <div 
                                      key={idx}
                                      className="relative aspect-video rounded-lg overflow-hidden bg-[#111] border border-white/5 group cursor-pointer"
                                      onClick={() => {
                                        // Open fullscreen preview
                                        const img = new Image();
                                        img.src = screenshot;
                                        const w = window.open('');
                                        w?.document.write(img.outerHTML);
                                      }}
                                    >
                                      <img 
                                        src={screenshot} 
                                        alt={`Screenshot ${idx + 1}`}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                      />
                                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center">
                                        <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-white/20 backdrop-blur-sm rounded-full p-2">
                                          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                                          </svg>
                                        </div>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                            
                            <div className="grid grid-cols-2 gap-3">
                                <div className="bg-[#111] p-3 rounded-xl border border-white/5">
                                    <span className="text-[10px] text-gray-500 uppercase block mb-1">Rating</span>
                                    <span className="text-xs text-white font-semibold flex items-center gap-1">
                                      <Star size={12} fill="#FFD700" className="text-gold" />
                                      {movie.rating}/10
                                    </span>
                                </div>
                                <div className="bg-[#111] p-3 rounded-xl border border-white/5">
                                    <span className="text-[10px] text-gray-500 uppercase block mb-1">Genre</span>
                                    <span className="text-xs text-white font-semibold">{movie.category}</span>
                                </div>
                                <div className="bg-[#111] p-3 rounded-xl border border-white/5">
                                    <span className="text-[10px] text-gray-500 uppercase block mb-1">Quality</span>
                                    <span className="text-xs text-white font-semibold">{movie.quality || 'HD'}</span>
                                </div>
                                <div className="bg-[#111] p-3 rounded-xl border border-white/5">
                                    <span className="text-[10px] text-gray-500 uppercase block mb-1">Year</span>
                                    <span className="text-xs text-white font-semibold">{movie.year || 'N/A'}</span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

              </motion.div>
            </div>
        </div>
      </motion.div>
  );
};

export default MovieDetails;
