import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Zap, Target, Globe } from "lucide-react";
import { useLenis } from "@/hooks/useLenis";
import ConnectModal from "@/components/ConnectModal";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LandingPage() {
  useLenis();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();

  const handleConnect = (platform: string, id: string) => {
    // Store in localStorage for the dashboard to pick up
    localStorage.setItem(`gamesphere_${platform}_id`, id);
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen flex flex-col items-center">
      <ConnectModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onConnect={handleConnect}
      />

      {/* Hero Section */}
      <section className="relative w-full h-screen flex flex-col items-center justify-center px-6 overflow-hidden">

        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="text-left z-10 lg:w-1/2"
        >
          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-6xl md:text-9xl font-heading font-black tracking-tighter leading-none mb-8"
          >
            ASCEND TO THE <br /> <span className="text-white selection:bg-primary selection:text-black">NEXT_DIMENSION</span>
          </motion.h1>
          
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-zinc-400 text-lg md:text-xl max-w-2xl mx-auto mb-8 font-light"
          >
            Your ultimate command center for multi-platform mastery. <br />
            Connect Steam and Riot accounts for unified real-time analytics.
          </motion.p>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="flex flex-col md:flex-row gap-4 justify-center"
          >
            <button 
              onClick={() => setIsModalOpen(true)}
              className="bg-primary text-black px-12 py-5 rounded-full font-heading font-bold flex items-center gap-3 hover:bg-white transition-all group text-sm"
            >
              ESTABLISH_CONNECTION
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
            <Link 
              href="/leaderboard"
              className="bg-white/5 backdrop-blur-md border border-white/10 text-white px-8 py-4 rounded-full font-bold hover:bg-white/10 transition-all"
            >
              EXPLORE LEADERBOARD
            </Link>
          </motion.div>
        </motion.div>

        {/* Floating background elements */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/10 rounded-full filter blur-[100px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-secondary/10 rounded-full filter blur-[100px] animate-pulse delay-700" />
      </section>

      {/* Features Grid */}
      <section className="py-24 px-6 w-full max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <FeatureCard 
            icon={<Zap className="w-6 h-6 text-primary" />}
            title="REAL-TIME STATS"
            description="Live synchronization with Steam and Riot Games APIs. Every achievement, every win, tracked instantly."
          />
          <FeatureCard 
            icon={<Target className="w-6 h-6 text-secondary" />}
            title="POWER SCORING"
            description="Calculate your unified ranking across multiple titles using our proprietary performance algorithm."
          />
          <FeatureCard 
            icon={<Globe className="w-6 h-6 text-primary" />}
            title="GLOBAL RANKINGS"
            description="Compete with the best. Rise through the tiers from Recruit to Absolute Legend."
          />
        </div>
      </section>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="p-8 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-colors group">
      <div className="mb-4 p-3 bg-black/40 rounded-xl w-fit group-hover:scale-110 transition-transform">{icon}</div>
      <h3 className="text-xl font-space-grotesk font-bold mb-2 tracking-tight">{title}</h3>
      <p className="text-zinc-500 leading-relaxed font-light">{description}</p>
    </div>
  );
}
