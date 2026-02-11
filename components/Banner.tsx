import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Info, Star } from 'lucide-react';
import { Movie } from '../types';

interface BannerProps {
  movie: Movie;
  onClick: (movie: Movie) => void;
  onPlay: (movie: Movie) => void;
}

const Banner: React.FC<BannerProps> = ({ movie, onClick }) => {
  return (
    <div 
        onClick={() => onClick(movie)}
        className="relative w-full aspect-[16/9] overflow-hidden mb-6 group select-none cursor-pointer"
    >
      <AnimatePresence mode="wait">
        <motion.div 
          key={movie.id}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="absolute inset-0 w-full h-full"
        >
          {/* HD Background Image - 16:9 fixed */}
          <div className="absolute inset-0 w-full h-full">
            <img 
              src={movie.thumbnail} 
              alt={movie.title}
              className="w-full h-full object-cover pointer-events-none"
            />
            
            {/* Premium Gradient Overlays */}
            <div className="absolute top-0 inset-x-0 h-40 bg-gradient-to-b from-black via-black/60 to-transparent z-10" />
            <div className="absolute bottom-0 inset-x-0 h-[75%] bg-gradient-to-t from-black via-black/95 to-transparent z-10" />
            <div className="absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-black/80 to-transparent z-10" />
            <div className="absolute inset-y-0 right-0 w-1/3 bg-gradient-to-l from-black/80 to-transparent z-10" />
          </div>
          
          {/* Content */}
          <div className="absolute bottom-0 left-0 right-0 p-6 pb-16 z-20">
            <div className="max-w-2xl mx-auto text-center">
              
              {/* Clean Badges */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="flex items-center justify-center gap-3 mb-4"
              >
                <span className="bg-gradient-to-r from-amber-500 to-yellow-500 text-black text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest">
                  #1 TRENDING
                </span>
                
                <span className="text-[10px] font-bold text-white/90 uppercase bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20">
                  {movie.category}
                </span>
                
                {movie.videoQuality && (
                  <span className="text-[10px] font-bold text-blue-300 uppercase bg-blue-500/20 backdrop-blur-md px-3 py-1.5 rounded-full border border-blue-400/30">
                    {movie.videoQuality}
                  </span>
                )}
              </motion.div>
              
              {/* Title */}
              <motion.h1
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.6 }}
                className="text-5xl md:text-6xl font-black leading-[0.9] mb-4 text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-gray-400"
              >
                {movie.title}
              </motion.h1>
              
              {/* Metadata */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="flex items-center justify-center gap-4 mb-5 text-xs font-semibold text-gray-300"
              >
                {movie.rating && (
                  <div className="flex items-center gap-1.5">
                    <Star size={14} fill="#FFD700" className="text-yellow-500" />
                    <span className="text-white font-bold">{movie.rating}</span>
                  </div>
                )}
                {movie.year && (
                  <>
                    <span className="w-1 h-1 bg-gray-600 rounded-full" />
                    <span>{movie.year}</span>
                  </>
                )}
                {movie.duration && (
                  <>
                    <span className="w-1 h-1 bg-gray-600 rounded-full" />
                    <span>{movie.duration}</span>
                  </>
                )}
                {movie.audioLanguage && (
                  <>
                    <span className="w-1 h-1 bg-gray-600 rounded-full" />
                    <span className="text-blue-300">{movie.audioLanguage}</span>
                  </>
                )}
              </motion.div>
              
              {/* Description */}
              <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="text-gray-300 text-sm line-clamp-2 mb-8 font-medium max-w-xl mx-auto leading-relaxed opacity-90"
              >
                {movie.description}
              </motion.p>
              
              {/* Buttons */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.7 }}
                className="flex items-center justify-center gap-4"
              >
                <button 
                  className="relative overflow-hidden bg-white text-black px-8 py-3.5 rounded-xl font-black text-sm flex items-center gap-3 hover:scale-105 transition-all shadow-[0_0_30px_rgba(255,255,255,0.4)] active:scale-95 group/btn z-30"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700" />
                  <Play size={18} fill="black" className="relative z-10" />
                  <span className="relative z-10">PLAY NOW</span>
                </button>
                
                <button 
                  className="relative bg-white/10 backdrop-blur-md text-white px-6 py-3.5 rounded-xl font-bold text-sm flex items-center gap-2 border border-white/20 hover:bg-white/20 transition-all active:scale-95"
                >
                  <Info size={16} />
                  <span>More Info</span>
                </button>
              </motion.div>
              
              {/* Additional Details */}
              {(movie.fileSize || movie.subtitles) && (
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.8 }}
                  className="flex items-center justify-center gap-6 mt-6 text-[10px] text-gray-400 font-medium"
                >
                  {movie.fileSize && (
                    <div className="flex items-center gap-1.5">
                      <span>{movie.fileSize}</span>
                    </div>
                  )}
                  {movie.subtitles && (
                    <div className="flex items-center gap-1.5">
                      <span>Subs: {movie.subtitles}</span>
                    </div>
                  )}
                </motion.div>
              )}
              
            </div>
          </div>
          
          {/* Vignette */}
          <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_100px_rgba(0,0,0,0.6)] z-[5]" />
          
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default Banner;
