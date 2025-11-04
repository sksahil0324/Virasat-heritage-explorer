import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Globe, Headphones, Image, Map, Shield, Sparkles, Download } from "lucide-react";
import { useNavigate } from "react-router";
import ParticleBackground from "@/components/ParticleBackground";
import HolographicCard from "@/components/HolographicCard";
import FloatingElement from "@/components/FloatingElement";
import AnimatedSection from "@/components/AnimatedSection";
import { toast } from "sonner";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useState, useEffect } from "react";

export default function Landing() {
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Fetch all published sites with media
  const sites = useQuery(api.heritageSites.list, {});

  // Extract images from sites that have uploaded images
  const monumentImages = sites
    ?.flatMap((site) => 
      site.media
        ?.filter((m) => m.type === "image" && m.storageId)
        .map((m) => ({
          url: m.url,
          name: site.name,
          location: `${site.city}, ${site.state}`,
        }))
    )
    .filter(Boolean) || [];

  // Rotate images every 30 seconds
  useEffect(() => {
    if (monumentImages.length === 0) return;

    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % monumentImages.length);
    }, 30000); // 30 seconds

    return () => clearInterval(interval);
  }, [monumentImages.length]);

  const features = [
    {
      icon: Globe,
      title: "Immersive 3D Views",
      description: "Explore heritage sites with 360° panoramic views and interactive 3D models",
    },
    {
      icon: Headphones,
      title: "Audio Guides",
      description: "Listen to detailed audio summaries in multiple languages",
    },
    {
      icon: Map,
      title: "Interactive Maps",
      description: "Discover sites by location with integrated mapping",
    },
    {
      icon: Shield,
      title: "UNESCO Sites",
      description: "Browse World Heritage Sites recognized by UNESCO",
    },
    {
      icon: Image,
      title: "Rich Media",
      description: "High-quality images, videos, and historical documentation",
    },
    {
      icon: Sparkles,
      title: "Curated Content",
      description: "Expert-verified information and visitor guidelines",
    },
  ];

  return (
    <div className="min-h-screen relative overflow-hidden">
      <ParticleBackground />

      {/* Navigation */}
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="border-b glass-morph sticky top-0 z-50 relative"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo and Tagline */}
            <motion.div 
              className="flex flex-col cursor-pointer" 
              onClick={() => navigate("/")}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="flex items-center gap-3">
                <img src="./logo_bg.svg" alt="VIRASAT" className="h-10 w-10 animate-pulse-glow" />
                <div className="flex flex-col">
                  <span className="text-2xl font-bold tracking-tight gradient-text">VIRASAT</span>
                  <span className="text-xs text-muted-foreground">Where Heritage Meets Technology</span>
                </div>
              </div>
            </motion.div>

            {/* Navigation Menu */}
            <div className="hidden lg:flex items-center gap-1">
              {["Home", "Explore", "Heritage Map", "360° Experience", "Gallery", "Stories", "Community"].map((item, index) => (
                <motion.div
                  key={item}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Button 
                    variant="ghost" 
                    onClick={() => item === "Home" ? navigate("/") : navigate("/explore")} 
                    className="text-sm relative group px-3 py-2 hover:bg-primary/10 transition-colors duration-300"
                  >
                    <motion.span 
                      className="relative"
                      whileHover={{ scale: 1.1, color: "hsl(var(--primary))" }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {item}
                    </motion.span>
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300" />
                  </Button>
                </motion.div>
              ))}
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <Button 
                  variant="ghost" 
                  className="text-sm"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download Source
                </Button>
              </motion.div>
            </div>

            {/* Auth Buttons */}
            <div className="flex items-center gap-3">
              {!isLoading && (
                <>
                  {isAuthenticated ? (
                    <>
                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Button onClick={() => navigate("/explore")} size="sm" className="relative overflow-hidden group">
                          <span className="relative z-10">Dashboard</span>
                          <ArrowRight className="ml-2 h-4 w-4 relative z-10" />
                          <div className="absolute inset-0 bg-gradient-to-r from-primary to-accent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        </Button>
                      </motion.div>
                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Button onClick={() => navigate("/admin")} size="sm" variant="outline" className="border-primary/50">
                          <Shield className="mr-2 h-4 w-4" />
                          Admin
                        </Button>
                      </motion.div>
                    </>
                  ) : (
                    <>
                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Button variant="ghost" onClick={() => navigate("/auth")} size="sm">
                          Sign In
                        </Button>
                      </motion.div>
                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Button onClick={() => navigate("/auth")} size="sm" className="relative overflow-hidden group">
                          <span className="relative z-10">Get Started</span>
                          <ArrowRight className="ml-2 h-4 w-4 relative z-10" />
                          <div className="absolute inset-0 bg-gradient-to-r from-primary to-accent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        </Button>
                      </motion.div>
                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Button onClick={() => navigate("/auth?redirect=/admin")} size="sm" variant="outline" className="border-amber-500/50">
                          <Shield className="mr-2 h-4 w-4" />
                          Admin Login
                        </Button>
                      </motion.div>
                    </>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section with Rotating Background Images */}
      <section className="relative overflow-hidden">
        {/* Rotating Background Images */}
        <AnimatePresence mode="wait">
          {monumentImages.length > 0 && (
            <motion.div
              key={currentImageIndex}
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 1.5 }}
              className="absolute inset-0 z-0"
            >
              <img
                src={monumentImages[currentImageIndex]?.url}
                alt={monumentImages[currentImageIndex]?.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  console.error("Failed to load monument background image");
                  e.currentTarget.style.display = 'none';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/70 to-background" />
            </motion.div>
          )}
        </AnimatePresence>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex justify-center mb-6">
                <FloatingElement delay={0}>
                  <Badge className="glass-morph" variant="secondary">
                    Virtual Heritage Exploration
                  </Badge>
                </FloatingElement>
              </div>
              
              <motion.h1 
                className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight mb-6"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                Discover India's
                <br />
                <span className="gradient-text">Cultural Heritage</span>
              </motion.h1>
              
              <motion.p 
                className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                Immerse yourself in the rich history and culture of India's heritage sites through
                interactive 3D models, audio guides, and comprehensive information.
              </motion.p>
              
              <motion.div 
                className="flex flex-col sm:flex-row gap-4 justify-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button size="lg" onClick={() => navigate(isAuthenticated ? "/explore" : "/auth")} className="relative overflow-hidden group">
                    <span className="relative z-10">Start Exploring</span>
                    <ArrowRight className="ml-2 h-5 w-5 relative z-10" />
                    <div className="absolute inset-0 bg-gradient-to-r from-primary to-accent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </Button>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button size="lg" variant="outline" onClick={() => navigate("/explore")} className="glass-morph">
                    Browse Sites
                  </Button>
                </motion.div>
              </motion.div>

              {/* Image indicators */}
              {monumentImages.length > 0 && (
                <motion.div 
                  className="flex gap-2 justify-center mt-12"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1 }}
                >
                  {monumentImages.slice(0, 5).map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`w-2 h-2 rounded-full transition-all ${
                        index === currentImageIndex % 5
                          ? "bg-primary w-8"
                          : "bg-primary/30 hover:bg-primary/50"
                      }`}
                      aria-label={`Go to image ${index + 1}`}
                    />
                  ))}
                </motion.div>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4 gradient-text">
                Experience Heritage Like Never Before
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Cutting-edge technology meets cultural preservation
              </p>
            </div>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <HolographicCard key={feature.title} delay={index * 0.1}>
                <CardHeader>
                  <FloatingElement delay={index * 0.2} duration={5 + index}>
                    <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 animate-pulse-glow">
                      <feature.icon className="h-6 w-6 text-primary" />
                    </div>
                  </FloatingElement>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                  <CardDescription className="text-base">{feature.description}</CardDescription>
                </CardHeader>
              </HolographicCard>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <HolographicCard className="border-2">
              <CardContent className="p-12 text-center">
                <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4 gradient-text">
                  Ready to Begin Your Journey?
                </h2>
                <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                  Join thousands of heritage enthusiasts exploring India's magnificent cultural
                  treasures
                </p>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button size="lg" onClick={() => navigate(isAuthenticated ? "/explore" : "/auth")} className="relative overflow-hidden group">
                    <span className="relative z-10">Get Started Now</span>
                    <ArrowRight className="ml-2 h-5 w-5 relative z-10" />
                    <div className="absolute inset-0 bg-gradient-to-r from-primary to-accent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </Button>
                </motion.div>
              </CardContent>
            </HolographicCard>
          </AnimatedSection>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t glass-morph py-12 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-3">
              <img src="./logo.svg" alt="VIRASAT" className="h-6 w-6" />
              <span className="font-semibold gradient-text">VIRASAT</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2024 VIRASAT. Preserving heritage through technology.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}