"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowRight, 
  LayoutDashboard, 
  Trophy, 
  Swords, 
  User, 
  Zap, 
  ShieldCheck,
  TrendingUp,
  Gamepad2,
  Clock,
  ChevronRight,
  Terminal,
  Camera,
  ExternalLink
} from "lucide-react";
import { cn } from "@/lib/utils";
import Navbar from "@/components/Navbar";
import ConnectModal from "@/components/ConnectModal";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// --- RETRO TYPEWRITER COMPONENT ---
function Typewriter({ text, delay = 100, onComplete }: { text: string, delay?: number, onComplete?: () => void }) {
  const [displayed, setDisplayed] = useState("");
  const [complete, setComplete] = useState(false);

  const onCompleteRef = useRef(onComplete);
  useEffect(() => { onCompleteRef.current = onComplete; }, [onComplete]);

  useEffect(() => {
    let i = 0;
    const timer = setInterval(() => {
      setDisplayed(text.slice(0, i + 1));
      i++;
      if (i >= text.length) {
        clearInterval(timer);
        setComplete(true);
        if (onCompleteRef.current) onCompleteRef.current();
      }
    }, delay);
    return () => clearInterval(timer);
  }, [text, delay]);

  return (
    <span className="inline-flex items-center">
      {displayed}
      <span className="ml-1 w-2.5 h-8 md:h-12 bg-primary inline-block align-middle animate-cursor-blink" />
    </span>
  );
}

// --- LEADERBOARD ITEM COMPONENT ---
function LeaderboardItem({ rank, name, score, status, color }: any) {
  return (
    <motion.div 
      initial={{ x: -20, opacity: 0 }}
      whileInView={{ x: 0, opacity: 1 }}
      viewport={{ once: true }}
      className={cn(
        "flex items-center justify-between p-4 md:p-6 bg-black/40 border-l-4 backdrop-blur-sm group hover:bg-white/5 transition-all cursor-default overflow-hidden",
        color
      )}
    >
      <div className="flex items-center gap-4 md:gap-8 min-w-0">
        <span className="text-xl md:text-2xl font-black text-zinc-700 font-mono tracking-tighter w-6 md:w-8 flex-shrink-0">{rank}</span>
        <div className="min-w-0">
          <h4 className="text-sm md:text-lg font-black tracking-widest text-white group-hover:text-primary transition-colors truncate">{name}</h4>
          <p className="text-[8px] md:text-[10px] font-mono text-zinc-500 tracking-[0.2em] uppercase truncate">{status} // [RANK_ID]</p>
        </div>
      </div>
      <div className="text-right flex-shrink-0 ml-4">
        <p className="text-lg md:text-2xl font-black tracking-tighter text-white font-mono">{score}</p>
        <p className="text-[8px] md:text-[9px] font-mono text-zinc-600 tracking-widest uppercase">LEGACY_POINTS</p>
      </div>
    </motion.div>
  );
}

export default function LandingPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [heroStep, setHeroStep] = useState(0);
  const [isLeaping, setIsLeaping] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // 1. HERO TITLE KINETIC SPLIT
    gsap.to(".gsap-hero-split-left", {
        scrollTrigger: {
            trigger: ".gsap-hero-section",
            start: "top top",
            end: "bottom top",
            scrub: true
        },
        x: -400,
        opacity: 0,
        ease: "none"
    });

    gsap.to(".gsap-hero-split-right", {
        scrollTrigger: {
            trigger: ".gsap-hero-section",
            start: "top top",
            end: "bottom top",
            scrub: true
        },
        x: 400,
        opacity: 0,
        ease: "none"
    });


    // 3. STAT CARDS STAGGER
    gsap.from(".gsap-stat-card", {
        scrollTrigger: {
            trigger: ".gsap-dashboard-section",
            start: "top 70%",
        },
        y: 100,
        scale: 0.9,
        opacity: 0,
        duration: 1.2,
        ease: "expo.out",
        stagger: 0.2
    });

    // 4. LEGEND ASCENSION DUEL
    gsap.to(".gsap-warrior-frame", {
        scrollTrigger: {
            trigger: ".gsap-compare-section",
            start: "top 70%",
        },
        scale: 1,
        rotate: 0,
        duration: 2,
        ease: "expo.out",
        stagger: 0.5
    });

    gsap.to(".gsap-warrior-image", {
        scrollTrigger: {
            trigger: ".gsap-compare-section",
            start: "top 70%",
        },
        opacity: 1,
        scale: 1,
        duration: 1.5,
        ease: "power2.out",
        delay: 0.5,
        stagger: 0.5
    });

    gsap.to(".gsap-warrior-info", {
        scrollTrigger: {
            trigger: ".gsap-compare-section",
            start: "top 70%",
        },
        opacity: 1,
        y: -10,
        duration: 1,
        ease: "power2.out",
        delay: 1,
        stagger: 0.5
    });

    // 5. HUD CARD MECHANICAL REVEAL
    gsap.to(".gsap-hud-icon", {
        scrollTrigger: {
            trigger: ".gsap-dashboard-section",
            start: "top 70%",
        },
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "expo.out",
        stagger: 0.1
    });

    gsap.to(".gsap-hud-label", {
        scrollTrigger: {
            trigger: ".gsap-dashboard-section",
            start: "top 70%",
        },
        opacity: 1,
        x: 0,
        duration: 0.8,
        ease: "expo.out",
        delay: 0.2,
        stagger: 0.1
    });

    gsap.to(".gsap-hud-value", {
        scrollTrigger: {
            trigger: ".gsap-dashboard-section",
            start: "top 70%",
        },
        opacity: 1,
        duration: 1,
        ease: "none",
        delay: 0.4,
        stagger: 0.1
    });

    gsap.to(".gsap-swords-icon", {
        scrollTrigger: {
            trigger: ".gsap-compare-section",
            start: "top 60%",
        },
        opacity: 1,
        scale: 1,
        rotate: 0,
        duration: 2,
        ease: "expo.out"
    });
    // 7. COMPARISON GAUGES
    gsap.fromTo(".gsap-gauge-container", 
        { opacity: 0, y: 30 },
        {
            scrollTrigger: {
                trigger: ".gsap-compare-section",
                start: "top 60%",
            },
            opacity: 1,
            y: 0,
            duration: 1,
            ease: "expo.out",
            stagger: 0.2
        }
    );
  }, []);

  const handleConnect = (platform: string, id: string) => {
    if (platform === "steam") {
        localStorage.setItem(`gamesphere_${platform}_id`, id);
    }
    router.push("/dashboard");
  };

  const handleEnterGallery = () => {
    const steamId = typeof window !== "undefined" ? localStorage.getItem("gamesphere_steam_id") : null;
    if (steamId) {
      setIsLeaping(true);
      setTimeout(() => router.push("/dashboard"), 1500);
    } else {
      setIsModalOpen(true);
    }
  };

  return (
    <main className="min-h-screen bg-[#0d0f14] text-white selection:bg-primary/30 selection:text-black overflow-x-hidden">
      <Navbar isVisible={!isModalOpen} />

      {/* 1. HERO SECTION */}
      <section className="relative h-screen flex flex-col items-center justify-center pt-10 md:pt-0 text-center px-6 overflow-hidden gsap-hero-section">
        {/* Animated Background Orbs */}
        <div className="absolute inset-0 z-0">
          <motion.div 
            animate={{ 
              scale: [1, 1.1, 1],
              opacity: [0.05, 0.1, 0.05],
            }}
            transition={{ duration: 8, repeat: Infinity }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/20 rounded-full blur-[160px]" 
          />
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="relative z-20 max-w-5xl -mt-[15vh] md:-mt-[15vh] flex flex-col items-center justify-center w-full"
        >
          {/* Status Badge */}
          <div className="inline-flex items-center gap-3 px-4 py-1.5 bg-black/60 backdrop-blur-md border border-primary/20 rounded-md mb-8 md:mb-12">
            <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            <span className="text-[10px] font-bold tracking-[0.4em] text-primary/80 uppercase font-mono">Connection Established // 100% Sync</span>
          </div>

          {/* Title Area */}
          <div className="relative group gsap-hero-title w-full flex justify-center">
            <h1 className="text-[22vw] sm:text-[16vw] md:text-[14rem] font-heading font-black tracking-tighter mb-8 md:mb-12 leading-[0.75] uppercase text-white flex flex-col md:flex-row items-center justify-center gap-2 md:gap-8 select-none">
              <span className="gsap-hero-split-left inline-block">
                <Typewriter text="GAME" delay={150} />
              </span>
              <span className="gsap-hero-split-right inline-block text-primary">
                <Typewriter text="SPHERE" delay={150} onComplete={() => setHeroStep(1)} />
              </span>
            </h1>
          </div>

          {/* Subtitle with fade-in */}
          <AnimatePresence>
            {heroStep >= 1 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-10 md:mb-20 px-4"
              >
                <p className="text-base sm:text-lg md:text-xl font-black text-primary/60 tracking-[0.5em] md:tracking-[0.8em] uppercase leading-relaxed md:leading-relaxed">
                   Your Journey. Your Legacy. <br className="md:hidden" /> <span className="text-white mt-4 block md:inline">Transcended.</span>
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* CTAs */}
          <AnimatePresence>
            {heroStep >= 1 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="flex flex-col sm:flex-row items-center justify-center gap-6 w-full max-w-lg px-6"
              >
                <button 
                  onClick={handleEnterGallery}
                  className="w-full sm:w-auto px-10 md:px-12 py-5 md:py-6 bg-primary text-black font-black text-[10px] md:text-xs tracking-[0.3em] md:tracking-[0.4em] uppercase hover:bg-white transition-all flex items-center justify-center gap-4 rounded-lg group shadow-[0_0_30px_rgba(255,51,51,0.2)]"
                >
                  Enter Gallery <ArrowRight className="w-5 h-5 group-hover:translate-x-3 transition-transform" />
                </button>
                <button 
                  onClick={() => setIsModalOpen(true)}
                  className="w-full sm:w-auto px-10 md:px-12 py-5 md:py-6 bg-transparent border border-white/20 text-white font-black text-[10px] md:text-xs tracking-widest uppercase hover:bg-white/10 transition-all rounded-lg"
                >
                  Forge Identity
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Scroll Protocol Indicator */}
        <motion.div 
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-12 flex flex-col items-center gap-4 opacity-40"
        >
          <span className="text-[10px] uppercase font-bold tracking-[0.4em] font-mono opacity-80">Explore Dashboard</span>
          <motion.div 
            animate={{ y: [0, 5, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-1.5 h-1.5 rounded-full bg-primary/40 mt-4" 
          />
        </motion.div>
      </section>

      {/* 2. DASHBOARD FEATURE */}
      <section className="py-48 px-6 border-y border-white/5 bg-transparent gsap-dashboard-section relative overflow-hidden">

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-24 items-center relative z-10">
          <div className="space-y-10 gsap-dashboard-text">
            <h2 className="text-4xl md:text-8xl font-sans font-black tracking-tight leading-[0.85] uppercase text-white mix-blend-difference mb-12">
            YOUR GAMING <br /> <span className="text-primary">LEGACY</span>
          </h2>
            <p className="text-zinc-500 text-lg leading-relaxed max-w-xl font-bold tracking-tight">
              "Every journey has a story." Map your progress across the multi-verse of gaming history. From the peaks of high fantasy to the depths of sci-fi, your legacy is eternal.
            </p>
            <div className="pt-6">
                <button onClick={() => router.push("/dashboard")} className="group flex items-center gap-5 text-sm font-bold text-primary tracking-widest uppercase hover:text-white transition-all">
                  Access Dashboard <ChevronRight className="w-5 h-5 group-hover:translate-x-3 transition-all" />
                </button>
            </div>
          </div>

          <div className="gsap-stats-container grid grid-cols-1 sm:grid-cols-2 gap-8 relative items-stretch">
            <div className="absolute -inset-20 bg-primary/10 blur-[140px] pointer-events-none" />
            <div className="gsap-stat-card flex flex-col">
              <MockHUDCard icon={<Clock className="w-10 h-10" />} label="Service Hours // [LOG]" value="1.2K+" color="text-primary" />
            </div>
            <div className="gsap-stat-card flex flex-col">
              <MockHUDCard icon={<Gamepad2 className="w-10 h-10" />} label="Manifest Titles" value="86" color="text-zinc-500" />
            </div>
            <div className="sm:col-span-2 gsap-stat-card mt-8 flex flex-col">
                <MockHUDCard 
                    icon={<TrendingUp className="w-12 h-12" />} 
                    label="Active Engagement // [FOCUS]" 
                    value="GHOST_OF_TSUSHIMA" 
                    color="text-primary"
                    wide 
                />
            </div>
          </div>
        </div>
      </section>

      {/* 3. COMPARE FEATURE */}
      <section className="py-48 px-6 relative bg-transparent gsap-compare-section overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-40 gsap-compare-header">
            <h2 className="text-5xl md:text-[8.5rem] font-sans font-black tracking-tight uppercase leading-[0.8] text-white">
              Player <br /> <span className="text-primary">Comparison</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-16 items-center max-w-5xl mx-auto">
             <div className="gsap-warrior-left">
                <MockWarrior 
                  name="KRATOS" 
                  level="999" 
                  image="/assets/kratos_og.png"
                  isWinner={true}
                />
             </div>
             <motion.div 
               className="flex flex-col items-center gap-6"
             >
                <div className="w-24 h-24 rounded-full bg-white/5 border border-white/10 flex items-center justify-center gsap-swords-icon">
                    <Swords className="w-10 h-10 text-primary" />
                </div>
                <span className="text-4xl font-black text-primary font-mono tracking-[0.5em] uppercase italic opacity-0 gsap-swords-icon">VS</span>
             </motion.div>
             <div className="gsap-warrior-right">
                <MockWarrior 
                  name="ELLIE" 
                  level="67" 
                  image="/assets/ellie_og.png"
                />
             </div>
          </div>

          <div className="mt-24 max-w-xl mx-auto space-y-12">
            <ComparisonGauge label="Trophy Manifest" v1={98} v2={40} />
            <ComparisonGauge label="Skill Legacy" v1={95} v2={60} />
            <ComparisonGauge label="Combat Prowess" v1={99} v2={45} />
            <ComparisonGauge label="Story Impact" v1={97} v2={70} />
            <ComparisonGauge label="Universal Influence" v1={96} v2={30} />
          </div>
        </div>
      </section>

      {/* 4. LEADERBOARD SECTION */}
      <section className="py-48 px-6 relative bg-transparent">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-end justify-between mb-32 gap-10">
            <div className="space-y-6">
              <p className="text-primary text-[10px] font-bold tracking-[0.6em] uppercase font-mono">CHAMPION_TIERS // [GLOBAL_RANKINGS]</p>
              <h2 className="text-4xl md:text-7xl font-sans font-black tracking-tight uppercase leading-[0.85] text-white">
                HALL_OF <br /> <span className="text-primary">ETERNITY</span>
              </h2>
            </div>
            <p className="text-zinc-500 text-lg font-bold tracking-tight max-w-md opacity-60">
              Only the most resonant legends ascend to the Archive. Verification pending for current champions.
            </p>
          </div>

          <div className="gsap-leaderboard-container space-y-4">
            <div className="gsap-leaderboard-item">
              <LeaderboardItem rank={1} name="KRATOS_REBORN" score="12,450" status="ELITE" color="border-red-500/30" />
            </div>
            <div className="gsap-leaderboard-item">
              <LeaderboardItem rank={2} name="WOLF_SHADOW" score="11,920" status="VETERAN" color="border-primary/30" />
            </div>
            <div className="gsap-leaderboard-item">
              <LeaderboardItem rank={3} name="ELLIE_X" score="10,840" status="SURVIVOR" color="border-green-500/30" />
            </div>
            <div className="gsap-leaderboard-item">
              <LeaderboardItem rank={4} name="DRAKE_V" score="9,210" status="EXPLORER" color="border-blue-400/30" />
            </div>
            <div className="gsap-leaderboard-item">
              <LeaderboardItem rank={5} name="GHOST_J" score="8,760" status="LEGENDARY" color="border-zinc-500/30" />
            </div>
          </div>
        </div>
      </section>
      <footer className="py-40 px-6 border-t border-white/10 bg-transparent relative">
         <div className="max-w-[1850px] mx-auto px-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-end mb-32">
              <div className="space-y-8">
                  <h3 className="text-4xl md:text-5xl font-bold tracking-tight uppercase text-white">Contact Terminal</h3>
                  <p className="text-zinc-500 text-lg font-medium tracking-wide leading-relaxed max-w-md">
                     System nodes are active. Interface with the architect to expand the archive.
                  </p>
              </div>
              <div className="flex flex-wrap gap-4">
                  <SocialLink href="https://instagram.com/swastidsolankii" icon={<Camera className="w-5 h-5" />} label="Instagram" />
                  <SocialLink href="https://www.linkedin.com/in/swastidsolanki/" icon={<ExternalLink className="w-5 h-5" />} label="LinkedIn" />
                  <SocialLink href="https://github.com/SwastidSolanki" icon={<Terminal className="w-5 h-5" />} label="GitHub" />
              </div>
           </div>

           <div className="pt-16 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8 opacity-60">
              <p className="text-xs font-bold tracking-widest uppercase">GameSphere © 2026 // Distributed Intelligence</p>
              <div className="flex items-center gap-4">
                 <ShieldCheck className="w-4 h-4 text-primary" />
                 <span className="text-[10px] font-bold tracking-[0.2em] uppercase font-mono">Encryption established</span>
              </div>
           </div>
        </div>
      </footer>

      {/* Leap of Faith Transition */}
      <AnimatePresence>
        {isLeaping && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-black flex flex-col items-center justify-center gap-8"
          >
            <motion.div
              animate={{ 
                scale: [1, 1.2, 1],
                opacity: [0.5, 1, 0.5]
              }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-32 h-32 rounded-full border-2 border-primary/50 flex items-center justify-center"
            >
              <div className="w-24 h-24 rounded-full border border-primary animate-ping" />
            </motion.div>
            <div className="text-center space-y-8 w-full max-w-lg px-6">
              <h3 className="text-4xl md:text-5xl font-black tracking-tight uppercase text-white leading-tight">
                Leaping in <br className="md:hidden" /> <span className="text-primary italic">faith</span>
              </h3>
              
              <div className="w-64 h-1 bg-white/10 rounded-full overflow-hidden relative mx-auto">
                <motion.div 
                   initial={{ width: "0%" }}
                   animate={{ width: "100%" }}
                   transition={{ duration: 1.5, ease: "easeInOut" }}
                   className="h-full bg-primary"
                />
              </div>

              <p className="text-primary/60 text-[10px] font-mono tracking-[0.4em] uppercase animate-pulse">Initializing synchronization</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <ConnectModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onConnect={handleConnect}
      />
    </main>
  );
}

// --- HUMAN-CRAFTED COMPONENTS ---

function MockHUDCard({ icon, label, value, color, wide = false }: any) {
  return (
    <div
      className={cn(
        "relative p-8 bg-white/[0.03] border border-white/10 hover:border-primary/40 transition-all group overflow-hidden rounded-xl",
        wide && "sm:col-span-2"
      )}
    >
      <div className={cn("mb-8 transition-transform group-hover:scale-110 opacity-0 gsap-hud-icon", color)}>{icon}</div>
      <div className="space-y-2">
        <p className="text-[11px] font-bold tracking-widest text-zinc-500 uppercase font-mono group-hover:text-zinc-400 transition-colors opacity-0 gsap-hud-label">{label}</p>
        <p className="text-3xl font-bold tracking-tight uppercase group-hover:text-white transition-colors opacity-0 gsap-hud-value">{value}</p>
      </div>
    </div>
  );
}

function MockWarrior({ name, level, image, isWinner = false }: any) {
  return (
    <div className="flex flex-col items-center gap-8">
      <div className={cn(
        "w-40 h-52 md:w-56 md:h-72 bg-zinc-950 relative group rounded-2xl overflow-hidden scale-0 gsap-warrior-frame border-2 md:border",
        isWinner ? "border-primary/50 md:border-white/10 shadow-[0_0_40px_rgba(0,229,255,0.2)] md:shadow-2xl" : "border-white/10 shadow-2xl"
      )}>
         <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/10 transition-colors z-10" />
         {image ? (
           <img src={image} className="w-full h-full object-cover transition-all opacity-100 scale-100 gsap-warrior-image" alt={name} />
         ) : (
           <User className="absolute inset-0 m-auto w-12 h-12 text-zinc-800" />
         )}
         <div className="absolute inset-0 border-[0.5px] border-white/5 rounded-2xl pointer-events-none z-20" />
      </div>
      <div className="text-center opacity-0 gsap-warrior-info">
         <h4 className="text-xl font-bold tracking-tight mb-3 uppercase">{name}</h4>
         <span className="px-4 py-1 bg-primary/10 border border-primary/20 text-primary text-[9px] font-bold tracking-[0.3em] uppercase font-mono">Level {level}</span>
      </div>
    </div>
  );
}

function ComparisonGauge({ label, v1, v2 }: any) {
  return (
    <div 
      className="space-y-4 opacity-0 gsap-gauge-container"
    >
       <p className="text-xs font-bold text-center text-zinc-500 uppercase tracking-widest">{label}</p>
       <div className="flex items-center gap-1 h-2.5 rounded-full overflow-hidden">
          <motion.div 
            initial={{ flex: 0 }}
            whileInView={{ flex: v1 }}
            viewport={{ once: true }}
            className="h-full bg-primary" 
          />
          <div className="w-[1px] h-full bg-white/20" />
          <motion.div 
            initial={{ flex: 0 }}
            whileInView={{ flex: v2 }}
            viewport={{ once: true }}
            className="h-full bg-red-600/40" 
          />
       </div>
    </div>
  );
}

function SocialLink({ href, icon, label }: any) {
  return (
    <motion.a
      href={href}
      target="_blank"
      whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.08)" }}
      className="flex items-center gap-5 px-8 py-5 bg-white/5 border border-white/5 text-white/60 hover:text-white transition-all group rounded-xl"
    >
      <span className="group-hover:text-primary transition-colors">{icon}</span>
      <span className="text-sm font-bold tracking-wider uppercase">{label}</span>
    </motion.a>
  );
}
