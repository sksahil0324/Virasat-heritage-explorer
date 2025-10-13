import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";
import { motion } from "framer-motion";
import { ArrowRight, Globe, Headphones, Image, Map, Shield, Sparkles } from "lucide-react";
import { useNavigate } from "react-router";

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
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate("/")}>
              <img src="./logo.svg" alt="VIRASAT" className="h-8 w-8" />
              <span className="text-xl font-bold tracking-tight">VIRASAT</span>
            </div>
            <div className="flex items-center gap-4">
              {!isLoading && (
                <>
                  {isAuthenticated ? (
                    <Button onClick={() => navigate("/explore")}>
                      Explore Sites
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  ) : (
                    <>
                      <Button variant="ghost" onClick={() => navigate("/auth")}>
                        Sign In
                      </Button>
                      <Button onClick={() => navigate("/auth")}>
                        Get Started
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <Badge className="mb-4" variant="secondary">
              Virtual Heritage Exploration
            </Badge>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight mb-6">
              Discover India's
              <br />
              <span className="text-primary">Cultural Heritage</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
              Immerse yourself in the rich history and culture of India's heritage sites through
              interactive 3D models, audio guides, and comprehensive information.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" onClick={() => navigate(isAuthenticated ? "/explore" : "/auth")}>
                Start Exploring
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button size="lg" variant="outline" onClick={() => navigate("/explore")}>
                Browse Sites
              </Button>
            </div>
          </motion.div>
        </div>

        {/* Decorative gradient */}
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(45rem_50rem_at_top,theme(colors.primary/10),transparent)]" />
      </section>

      {/* Features Grid */}
      <section className="py-24 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
              Experience Heritage Like Never Before
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Cutting-edge technology meets cultural preservation
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="h-full border-border/50 hover:border-primary/50 transition-colors">
                  <CardHeader>
                    <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                      <feature.icon className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                    <CardDescription className="text-base">{feature.description}</CardDescription>
                  </CardHeader>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Card className="border-2">
              <CardContent className="p-12 text-center">
                <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
                  Ready to Begin Your Journey?
                </h2>
                <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                  Join thousands of heritage enthusiasts exploring India's magnificent cultural
                  treasures
                </p>
                <Button size="lg" onClick={() => navigate(isAuthenticated ? "/explore" : "/auth")}>
                  Get Started Now
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-3">
              <img src="./logo.svg" alt="VIRASAT" className="h-6 w-6" />
              <span className="font-semibold">VIRASAT</span>
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