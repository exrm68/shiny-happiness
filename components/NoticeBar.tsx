import React, { useState, useEffect } from 'react';
import { BellRing, MessageSquarePlus } from 'lucide-react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';

interface NoticeBarProps {
  channelLink?: string;        // Header/main channel (backup only)
  noticeChannelLink?: string;  // ✅ Notice REQ বাটনের জন্য আলাদা channel
}

const NoticeBar: React.FC<NoticeBarProps> = ({ noticeChannelLink }) => {
  const [noticeText, setNoticeText] = useState('🎬 New Content Added Daily! Enjoy High-Speed Streaming on Cineflix. ⚠️ আপনার পছন্দের মুভি বা সিরিজ খুঁজে পাচ্ছেন না? রিকোয়েস্ট বাটনে ক্লিক করুন।');
  const [noticeEnabled, setNoticeEnabled] = useState(true);
  const [reqLink, setReqLink] = useState('https://t.me/cineflixrequestcontent');

  useEffect(() => {
    // ✅ Firestore settings থেকে সব কিছু real-time লোড
    const unsubscribe = onSnapshot(doc(db, 'settings', 'config'), (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        if (data.noticeText) setNoticeText(data.noticeText);
        if (data.noticeEnabled !== undefined) setNoticeEnabled(data.noticeEnabled);
        // ✅ noticeChannelLink আলাদা field থেকে আসবে
        if (data.noticeChannelLink) {
          setReqLink(data.noticeChannelLink);
        } else if (data.channelLink) {
          // fallback: আলাদা না থাকলে main channel ব্যবহার
          setReqLink(data.channelLink);
        }
      }
    }, () => {});
    return () => unsubscribe();
  }, []);

  // Props override (যদি parent থেকে pass করা হয়)
  useEffect(() => {
    if (noticeChannelLink) setReqLink(noticeChannelLink);
  }, [noticeChannelLink]);

  if (!noticeEnabled) return null;

  const doubledText = `${noticeText}     •     ${noticeText}     •     `;

  return (
    <div className="w-full mb-6 px-1 relative z-20 overflow-hidden">
      <div className="relative overflow-hidden rounded-xl bg-[#111] border-l-4 border-gold shadow-lg shadow-gold/5 flex items-center py-2.5 px-3 gap-3">
         <div className="bg-gold/10 p-2 rounded-full shrink-0 animate-pulse">
           <BellRing size={16} className="text-gold" />
         </div>
         <div className="flex-1 overflow-hidden relative h-5 flex items-center mask-image-fade">
            <div className="animate-[marquee_25s_linear_infinite] whitespace-nowrap">
               <span className="text-xs font-medium text-gray-200">{doubledText}</span>
               <span className="text-xs font-medium text-gray-200">{doubledText}</span>
            </div>
         </div>
         <button
           onClick={() => window.open(reqLink, '_blank')}
           className="bg-white/10 text-gold text-[10px] font-bold px-3 py-1.5 rounded-lg hover:bg-gold hover:text-black transition-colors flex items-center gap-1 shrink-0 border border-gold/20"
         >
           <MessageSquarePlus size={12} />
           REQ
         </button>
      </div>
      <style>{`
        @keyframes marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
        .mask-image-fade { mask-image: linear-gradient(to right, transparent, black 5%, black 95%, transparent); }
      `}</style>
    </div>
  );
};

export default NoticeBar;
