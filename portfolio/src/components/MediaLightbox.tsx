import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";

interface MediaLightboxProps {
  alt: string;
  onClose: () => void;
  open: boolean;
  src: string;
  title?: string;
}

const MediaLightbox = ({ alt, onClose, open, src, title }: MediaLightboxProps) => {
  useEffect(() => {
    if (!open) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose, open]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          aria-modal="true"
          className="fixed inset-0 z-[80] flex items-center justify-center p-4 md:p-8"
          initial={{ opacity: 0 }}
          role="dialog"
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="absolute inset-0 bg-background/88 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          <motion.div
            className="relative z-10 w-full max-w-5xl overflow-hidden rounded-[32px] border border-primary/20 bg-card/95 shadow-[0_30px_100px_rgba(4,8,18,0.62)]"
            initial={{ opacity: 0, scale: 0.94, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 16 }}
            transition={{ duration: 0.24, ease: "easeOut" }}
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center justify-between gap-4 border-b border-border/70 px-5 py-4 md:px-6">
              <div className="min-w-0">
                <p className="text-xs uppercase tracking-[0.3em] text-primary/80">Media Preview</p>
                {title && <p className="mt-2 truncate text-lg font-semibold text-foreground">{title}</p>}
              </div>

              <button
                type="button"
                onClick={onClose}
                className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-border/70 bg-background/70 text-muted-foreground transition-colors hover:border-primary/35 hover:text-primary"
              >
                <span className="sr-only">Close preview</span>
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="bg-[radial-gradient(circle_at_top,hsl(38_48%_62%_/_0.08),transparent_42%)] p-4 md:p-6">
              <div className="overflow-hidden rounded-[24px] border border-border/70 bg-background/70">
                <img
                  src={src}
                  alt={alt}
                  className="max-h-[78vh] w-full object-contain"
                />
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default MediaLightbox;
