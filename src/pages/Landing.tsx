import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";
import { motion } from "framer-motion";
import { ArrowRight, Globe, Headphones, Image, Map, Shield, Sparkles, Download } from "lucide-react";
import { useNavigate } from "react-router";
import ParticleBackground from "@/components/ParticleBackground";
import HolographicCard from "@/components/HolographicCard";
import FloatingElement from "@/components/FloatingElement";
import AnimatedSection from "@/components/AnimatedSection";

export default function Landing() {
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();

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
    <div className="min-h-screen bg-background relative overflow-hidden">
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
              {["Home", "Explore", "Heritage Map", "360° Experience", "Gallery", "Stories", "Community", "About"].map((item, index) => (
                <motion.div
                  key={item}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Button 
                    variant="ghost" 
                    onClick={() => item === "Home" ? navigate("/") : navigate("/explore")} 
                    className="text-sm relative group"
                  >
                    {item}
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300" />
                  </Button>
                </motion.div>
              ))}
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <Button variant="ghost" className="text-sm">
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
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button onClick={() => navigate("/explore")} size="sm" className="relative overflow-hidden group">
                        <span className="relative z-10">Dashboard</span>
                        <ArrowRight className="ml-2 h-4 w-4 relative z-10" />
                        <div className="absolute inset-0 bg-gradient-to-r from-primary to-accent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </Button>
                    </motion.div>
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
                    </>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section className="relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center relative z-10"
          >
            <FloatingElement delay={0}>
              <Badge className="mb-4 glass-morph" variant="secondary">
                Virtual Heritage Exploration
              </Badge>
            </FloatingElement>
            
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
          </motion.div>
        </div>

        {/* Decorative gradient */}
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(45rem_50rem_at_top,theme(colors.primary/10),transparent)]" />
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