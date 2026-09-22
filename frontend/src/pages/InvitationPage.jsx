import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { Feather, KeyRound, Sparkles, CheckCircle, ArrowRight, BookOpen } from 'lucide-react';
import confetti from 'canvas-confetti';

export const InvitationPage = () => {
  const { verifyInvitation, isInvitationUnlocked } = useAuth();
  const { t, lang, toggleLanguage } = useLanguage();
  const navigate = useNavigate();

  const [username, setUsername] = useState('Kim Suu Ah');
  const [password, setPassword] = useState('20-09-2026');
  const [errorMsg, setErrorMsg] = useState('');
  
  // Animation Sequence Stages:
  // 0 = Initial Invitation Card
  // 1 = Envelope Appears
  // 2 = Wax Seal Cracks
  // 3 = Envelope Flap Opens
  // 4 = Letter Slides Out
  // 5 = Letter Unfolds with Typography
  // 6 = Transitioning into Home Sanctuary
  const [sequenceStage, setSequenceStage] = useState(0);

  const handleOpenInvitation = (e) => {
    e?.preventDefault();
    setErrorMsg('');

    const res = verifyInvitation(username, password);
    if (!res.success) {
      setErrorMsg(res.message);
      return;
    }

    // Trigger fireworks/sparkles
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#C8A27A', '#4B2633', '#F3E9DD']
      });
    } catch (e) {}

    // Begin cinematic sequence
    setSequenceStage(1); // Envelope appears
    setTimeout(() => {
      setSequenceStage(2); // Wax seal cracks
    }, 600);

    setTimeout(() => {
      setSequenceStage(3); // Flap opens
    }, 1200);

    setTimeout(() => {
      setSequenceStage(4); // Letter slides out
    }, 1800);

    setTimeout(() => {
      setSequenceStage(5); // Letter typography unfolds
    }, 2500);
  };

  const handleEnterSanctuary = () => {
    setSequenceStage(6);
    setTimeout(() => {
      navigate('/home');
    }, 800);
  };

  return (
    <div className="invitation-container position-relative overflow-hidden">
      
      {/* Background Ambience */}
      <div 
        className="position-absolute top-0 start-0 w-100 h-100"
        style={{
          backgroundImage: 'radial-gradient(circle at center, rgba(75, 38, 51, 0.4) 0%, rgba(20, 10, 15, 0.95) 100%), url("/assets/huluaththa-landscape.jpg")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'blur(8px) brightness(0.4)',
          transform: 'scale(1.05)',
          zIndex: 0
        }}
      />

      {/* Language Switcher in top corner */}
      <div className="position-absolute top-0 end-0 p-4" style={{ zIndex: 10 }}>
        <div className="lang-switcher bg-dark bg-opacity-50 text-white">
          <button
            onClick={() => toggleLanguage('si')}
            className={`lang-btn ${lang === 'si' ? 'active' : ''}`}
          >
            සිං
          </button>
          <button
            onClick={() => toggleLanguage('en')}
            className={`lang-btn ${lang === 'en' ? 'active' : ''}`}
          >
            EN
          </button>
        </div>
      </div>

      <div className="envelope-wrapper position-relative" style={{ zIndex: 5 }}>
        
        {/* ============================================================== */}
        {/* STAGE 0: VINTAGE INVITATION CARD                               */}
        {/* ============================================================== */}
        {sequenceStage === 0 && (
          <div 
            className="card-literary p-4 p-md-5 text-center animate-fade-in shadow-2xl"
            style={{
              background: 'linear-gradient(135deg, #FCF8F3 0%, #F5ECE1 100%)',
              border: '2px solid #C8A27A',
              boxShadow: '0 25px 60px rgba(0,0,0,0.5), inset 0 0 20px rgba(200, 162, 122, 0.25)',
              color: '#241C1E',
              position: 'relative'
            }}
          >
            {/* Lotus & Mandala Motif */}
            <div className="mb-3 d-flex justify-content-center">
              <div className="position-relative">
                <img 
                  src="/assets/red-mandala.png" 
                  alt="Mandala" 
                  style={{ width: '90px', height: '90px', opacity: 0.85 }} 
                  className="animate-spin-slow"
                />
                <img 
                  src="/assets/pink-lotus.png" 
                  alt="Lotus" 
                  style={{ 
                    width: '45px', 
                    height: '45px', 
                    position: 'absolute', 
                    top: '50%', 
                    left: '50%', 
                    transform: 'translate(-50%, -50%)' 
                  }} 
                />
              </div>
            </div>

            <p className="text-uppercase tracking-widest text-muted small fw-bold mb-1" style={{ letterSpacing: '0.2em' }}>
              Personal Literary Invitation
            </p>

            <h1 className="font-editorial display-6 fw-bold mb-2" style={{ color: '#4B2633' }}>
              {t('invitation.title')}
            </h1>

            <p className="font-sinhala-title text-muted mb-4 small">
              {t('invitation.subtitle')}
            </p>

            {/* VISIBLE CREDENTIALS DISPLAY BOX (Explicit requirement) */}
            <div 
              className="p-3 mb-4 rounded-3 text-start"
              style={{
                background: 'rgba(75, 38, 51, 0.06)',
                border: '1px dashed #C8A27A'
              }}
            >
              <div className="d-flex align-items-center gap-2 mb-2 text-primary fw-bold small" style={{ color: '#4B2633' }}>
                <KeyRound size={16} />
                <span>{t('invitation.hint_title')}</span>
              </div>
              <div className="d-flex justify-content-between align-items-center mb-1">
                <span className="small text-muted">Username:</span>
                <span className="fw-bold font-monospace px-2 py-1 bg-white rounded border small">Kim Suu Ah</span>
              </div>
              <div className="d-flex justify-content-between align-items-center">
                <span className="small text-muted">Password:</span>
                <span className="fw-bold font-monospace px-2 py-1 bg-white rounded border small">20-09-2026</span>
              </div>
            </div>

            {/* Interactive Invitation Form */}
            <form onSubmit={handleOpenInvitation} className="text-start">
              <div className="mb-3">
                <label className="form-label small fw-bold text-muted mb-1">
                  {t('invitation.username_label')}
                </label>
                <input 
                  type="text" 
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="form-control form-control-lg font-monospace text-center fs-6"
                  style={{ border: '1.5px solid #C8A27A', background: '#fff' }}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label small fw-bold text-muted mb-1">
                  {t('invitation.password_label')}
                </label>
                <input 
                  type="text" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="form-control form-control-lg font-monospace text-center fs-6"
                  style={{ border: '1.5px solid #C8A27A', background: '#fff' }}
                  required
                />
              </div>

              {errorMsg && (
                <div className="alert alert-danger py-2 small mb-3">
                  {errorMsg}
                </div>
              )}

              <button
                type="submit"
                className="btn w-100 py-3 rounded-pill fw-bold text-white d-flex align-items-center justify-content-center gap-2 shadow"
                style={{
                  background: 'linear-gradient(135deg, #4B2633 0%, #7A4A56 100%)',
                  letterSpacing: '0.04em',
                  fontSize: '1rem'
                }}
              >
                <Sparkles size={18} />
                <span>{t('invitation.open_btn')}</span>
                <ArrowRight size={18} />
              </button>
            </form>

            <div className="mt-4 pt-3 border-top text-muted small fst-italic">
              Suchetha Kapuarachchi • Novelist & Storyteller
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* STAGES 1 TO 4: PHYSICAL ENVELOPE OPENING ANIMATION            */}
        {/* ============================================================== */}
        {sequenceStage >= 1 && sequenceStage <= 4 && (
          <div 
            className="p-4 p-md-5 text-center animate-fade-in text-white"
            style={{
              minHeight: '440px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              perspective: '1200px'
            }}
          >
            {/* 3D Envelope Representation */}
            <div 
              className="position-relative"
              style={{
                width: '320px',
                height: '210px',
                background: '#4B2633',
                borderRadius: '8px',
                boxShadow: '0 30px 60px rgba(0,0,0,0.6)',
                border: '2px solid #C8A27A',
                overflow: 'visible'
              }}
            >
              {/* Envelope Flap */}
              <div 
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '110px',
                  background: '#3E1C27',
                  clipPath: 'polygon(0 0, 100% 0, 50% 100%)',
                  transformOrigin: 'top',
                  transform: sequenceStage >= 3 ? 'rotateX(180deg)' : 'rotateX(0deg)',
                  transition: 'transform 0.9s cubic-bezier(0.4, 0, 0.2, 1)',
                  zIndex: sequenceStage >= 3 ? 1 : 4
                }}
              />

              {/* Red Wax Seal */}
              <div 
                className="position-absolute"
                style={{
                  top: '80px',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  zIndex: 5,
                  transition: 'all 0.6s ease',
                  opacity: sequenceStage >= 2 ? 0 : 1,
                  transformOrigin: 'center'
                }}
              >
                <div className="wax-seal">
                  <span className="font-editorial fw-bold text-white fs-5">SK</span>
                </div>
              </div>

              {/* Physical Letter Sliding Out */}
              <div 
                style={{
                  position: 'absolute',
                  bottom: '10px',
                  left: '15px',
                  width: '290px',
                  height: '180px',
                  background: '#FDFBF7',
                  borderRadius: '4px',
                  boxShadow: '0 -4px 15px rgba(0,0,0,0.2)',
                  transform: sequenceStage >= 4 ? 'translateY(-140px) scale(1.05)' : 'translateY(0)',
                  transition: 'transform 0.9s cubic-bezier(0.16, 1, 0.3, 1)',
                  zIndex: 3,
                  padding: '16px',
                  color: '#241C1E',
                  textAlign: 'left'
                }}
              >
                <div style={{ height: '4px', width: '40px', background: '#C8A27A', marginBottom: '8px' }} />
                <p className="font-cormorant small fw-bold mb-1" style={{ color: '#4B2633' }}>
                  A message from Suchetha Kapuarachchi...
                </p>
                <p className="font-sinhala-title text-muted" style={{ fontSize: '0.75rem', lineHeight: '1.4' }}>
                  මගේ අකුරු ලෝකයට ඔබව සාදරයෙන් පිළිගනිමි...
                </p>
              </div>

              {/* Envelope Body Overlay */}
              <div 
                style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  background: 'linear-gradient(to top, #4B2633 60%, rgba(75,38,51,0.9) 100%)',
                  clipPath: 'polygon(0 0, 50% 50%, 100% 0, 100% 100%, 0 100%)',
                  zIndex: 4,
                  borderRadius: '0 0 8px 8px'
                }}
              />
            </div>

            <p className="mt-5 font-cormorant fs-5 tracking-wide text-light animate-pulse">
              {sequenceStage === 1 && "The royal envelope is presented..."}
              {sequenceStage === 2 && "Unsealing the wax insignia..."}
              {sequenceStage === 3 && "Opening the envelope..."}
              {sequenceStage === 4 && "The author's letter emerges..."}
            </p>
          </div>
        )}

        {/* ============================================================== */}
        {/* STAGE 5: UNFOLDED LETTER TYPOGRAPHY EXPERIENCE                 */}
        {/* ============================================================== */}
        {sequenceStage >= 5 && (
          <div 
            className="card-literary p-4 p-md-5 animate-fade-in shadow-2xl"
            style={{
              background: '#FAF6EE',
              border: '2px solid #C8A27A',
              color: '#241C1E',
              boxShadow: '0 30px 80px rgba(0,0,0,0.6)',
              opacity: sequenceStage === 6 ? 0 : 1,
              transform: sequenceStage === 6 ? 'scale(1.08)' : 'scale(1)',
              transition: 'all 0.8s ease'
            }}
          >
            {/* Letter Header */}
            <div className="d-flex justify-content-between align-items-center pb-3 mb-4 border-bottom" style={{ borderColor: 'rgba(200, 162, 122, 0.4)' }}>
              <div className="d-flex align-items-center gap-2">
                <img src="/assets/pink-lotus.png" alt="Lotus" style={{ width: '36px', height: '36px' }} />
                <div>
                  <h5 className="font-editorial fw-bold mb-0" style={{ color: '#4B2633' }}>
                    Suchetha Kapuarachchi
                  </h5>
                  <span className="small text-muted font-monospace">Pen Name: Kim Suu Ah</span>
                </div>
              </div>
              <span className="badge px-3 py-2 rounded-pill font-monospace" style={{ background: 'rgba(75, 38, 51, 0.1)', color: '#4B2633' }}>
                20-09-2026
              </span>
            </div>

            {/* Letter Greeting */}
            <h3 className="font-cormorant display-6 fw-bold mb-3" style={{ color: '#4B2633' }}>
              {t('invitation.welcome_letter_heading')}
            </h3>

            {/* Sinhala Primary Letter Prose */}
            <p className="font-sinhala-title fs-5 mb-4" style={{ lineHeight: '1.9', color: '#241C1E' }}>
              {lang === 'si'
                ? "මගේ අකුරු ලෝකයට ඔබව සාදරයෙන් පිළිගනිමි. මේ පිටු අතර රැඳී ඇත්තේ මගේ හුස්ම, සිතුවිලි සහ වචන බවට පත් වූ නොකියූ හැඟීම්ය. හුළු අත්ත නිම්නයේ නිහඬතාවත්, අරුංගල් මඟුලේ පාරම්පරික රිද්මයත් ඔබ සමග බෙදාගන්නට ලැබීම මගේ භාග්‍යයකි. විඳින්න... ඔබේම ආත්මය මෙහි සොයාගන්න."
                : "Welcome into the sanctuary of my words. Between these digital pages live my quietest breaths, whispered dreams, and emotions that found their home in ink. It is my deepest honor to share the tranquil mists of Hulu Aththa and the sacred heritage of Arungal with you. Breathe gently... and may you discover a piece of your own soul here."}
            </p>

            {/* Author Signature & Seal */}
            <div className="d-flex justify-content-between align-items-end pt-3 border-top mb-4" style={{ borderColor: 'rgba(200, 162, 122, 0.3)' }}>
              <div>
                <p className="small text-muted mb-0">With literary affection,</p>
                <p className="font-editorial fs-4 fw-bold mb-0" style={{ color: '#4B2633' }}>
                  Suchetha Kapuarachchi
                </p>
                <span className="font-sinhala-title text-muted small">සුචේතා කපුආරච්චි</span>
              </div>
              <img 
                src="/assets/arungal-jhumka.png" 
                alt="Adornment" 
                style={{ width: '48px', height: '48px', objectFit: 'contain' }} 
              />
            </div>

            {/* Enter Sanctuary Button */}
            <button
              onClick={handleEnterSanctuary}
              className="btn btn-literary w-100 py-3 fs-5 justify-content-center"
            >
              <BookOpen size={20} />
              <span>{t('invitation.enter_sanctuary')}</span>
              <ArrowRight size={20} />
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
