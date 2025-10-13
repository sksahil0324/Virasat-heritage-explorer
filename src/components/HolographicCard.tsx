import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface HolographicCardProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

export default function HolographicCard({ children, className, delay = 0 }: HolographicCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay }}
      whileHover={{ scale: 1.02, rotateY: 2 }}
      style={{ transformStyle: "preserve-3d" }}
    >
      <Card className={cn("glass-morph holo-border relative overflow-hidden group", className)}>
        <div className="absolute inset-0 shimmer opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <div className="relative z-10">{children}</div>
      </Card>
    </motion.div>
  );
}
