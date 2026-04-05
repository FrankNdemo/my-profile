import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { CheckCircle2, Loader2, Terminal } from "lucide-react";
import { usePortfolio } from "@/context/PortfolioContext";

interface SplashScreenProps {
  onComplete: () => void;
}

const SplashScreen = ({ onComplete }: SplashScreenProps) => {
  const {
    content: {
      hero: { firstName, lastName, specialties },
    },
  } = usePortfolio();
  const [visibleLines, setVisibleLines] = useState<number[]>([]);
  const [isExiting, setIsExiting] = useState(false);
  const primarySpecialty = specialties[0] ?? "Core";
  const secondarySpecialty = specialties[1] ?? "Creative";
  const bootLines = [
    { text: "$ system.init('portfolio')", type: "command", delay: 0 },
    { text: "[OK] Loading modules...", type: "success", delay: 400 },
    { text: `[OK] ${primarySpecialty}.module`, type: "success", delay: 700 },
    { text: `[OK] ${secondarySpecialty}.module`, type: "success", delay: 1000 },
    { text: "[OK] WebDev.module", type: "success", delay: 1300 },
    { text: `$ user.load('${firstName} ${lastName}')`, type: "command", delay: 1600 },
    { text: "[OK] Profile loaded", type: "success", delay: 1900 },
    { text: "$ portfolio.render()", type: "command", delay: 2200 },
    { text: "[READY] Launching...", type: "ready", delay: 2500 },
  ];

  useEffect(() => {
    const lineTimers = bootLines.map((line, index) =>
      window.setTimeout(() => {
        setVisibleLines((prev) => [...prev, index]);
      }, line.delay),
    );

    // Start exit animation after all lines are shown
    const exitTimer = setTimeout(() => {
      setIsExiting(true);
    }, 3000);

    // Complete after exit animation
    const completeTimer = setTimeout(() => {
      onComplete();
    }, 3800);

    return () => {
      lineTimers.forEach((timer) => clearTimeout(timer));
      clearTimeout(exitTimer);
      clearTimeout(completeTimer);
    };
  }, [firstName, lastName, onComplete, primarySpecialty, secondarySpecialty]);

  const getLineColor = (type: string) => {
    switch (type) {
      case "command": return "text-primary";
      case "success": return "text-secondary";
      case "ready": return "text-accent";
      default: return "text-muted-foreground";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: isExiting ? 0 : 1, scale: isExiting ? 1.1 : 1 }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
      className="fixed inset-0 z-50 bg-background flex items-center justify-center"
    >
      {/* Background grid effect */}
      <div className="absolute inset-0 grid-pattern opacity-30" />
      
      {/* Glowing orbs */}
      <motion.div
        className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/20 rounded-full blur-[100px]"
        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 3, repeat: Infinity }}
      />
      <motion.div
        className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-secondary/20 rounded-full blur-[80px]"
        animate={{ scale: [1.2, 1, 1.2], opacity: [0.4, 0.6, 0.4] }}
        transition={{ duration: 2.5, repeat: Infinity }}
      />

      <div className="relative z-10 w-full max-w-lg mx-4">
        {/* Terminal window */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-card/90 backdrop-blur-md border border-border rounded-xl overflow-hidden shadow-2xl"
        >
          {/* Terminal header */}
          <div className="flex items-center gap-3 px-4 py-3 bg-muted/50 border-b border-border">
            <div className="flex gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <div className="w-3 h-3 rounded-full bg-yellow-500" />
              <div className="w-3 h-3 rounded-full bg-green-500" />
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Terminal className="w-4 h-4" />
              <span className="font-mono text-sm">system_boot.sh</span>
            </div>
            <Loader2 className="w-4 h-4 text-primary animate-spin ml-auto" />
          </div>

          {/* Terminal body */}
          <div className="p-6 font-mono text-sm space-y-2 min-h-[280px]">
            {bootLines.map((line, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{
                  opacity: visibleLines.includes(index) ? 1 : 0,
                  x: visibleLines.includes(index) ? 0 : -20,
                }}
                transition={{ duration: 0.3 }}
                className={`flex items-center gap-2 ${getLineColor(line.type)}`}
              >
                {line.type === "success" && (
                  <CheckCircle2 className="w-4 h-4 text-secondary flex-shrink-0" />
                )}
                {line.type === "ready" && (
                  <CheckCircle2 className="w-4 h-4 text-accent flex-shrink-0" />
                )}
                <span>{line.text}</span>
              </motion.div>
            ))}

            {/* Blinking cursor */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2.8 }}
              className="text-primary"
            >
              $ <span className="animate-pulse">▌</span>
            </motion.div>
          </div>
        </motion.div>

        {/* Loading bar */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-6"
        >
          <div className="h-1 bg-muted rounded-full overflow-hidden">
            <motion.div
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: 2.8, ease: "easeInOut" }}
              className="h-full bg-gradient-to-r from-primary via-secondary to-accent"
            />
          </div>
          <p className="text-center text-muted-foreground font-mono text-xs mt-3">
            Initializing portfolio...
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default SplashScreen;
