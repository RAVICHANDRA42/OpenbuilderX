"use client";

import * as React from "react";
import Link from "next/link";
import {
  Zap,
  MessageSquare,
  Code,
  Image,
  FileText,
  Workflow,
  BookOpen,
  ArrowRight,
  Check,
  Star,
  ChevronRight,
  Sparkles,
  Brain,
  Cpu,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LandingLayout } from "@/components/layout/landing-layout";

const features = [
  {
    icon: MessageSquare,
    title: "AI Chat",
    description: "Intelligent conversations with context-aware AI that understands your codebase.",
    color: "text-violet-500",
    bg: "bg-violet-500/10",
    gradient: "from-violet-500 to-purple-500",
  },
  {
    icon: Code,
    title: "Code Generation",
    description: "Generate, explain, and debug code across 15+ programming languages.",
    color: "text-blue-500",
    bg: "bg-blue-500/10",
    gradient: "from-blue-500 to-cyan-500",
  },
  {
    icon: Image,
    title: "Image Generation",
    description: "Create stunning images from text prompts with multiple styles and sizes.",
    color: "text-pink-500",
    bg: "bg-pink-500/10",
    gradient: "from-pink-500 to-rose-500",
  },
  {
    icon: FileText,
    title: "Document Analysis",
    description: "Upload and analyze documents with AI-powered summarization and Q&A.",
    color: "text-amber-500",
    bg: "bg-amber-500/10",
    gradient: "from-amber-500 to-orange-500",
  },
  {
    icon: Workflow,
    title: "Workflow Builder",
    description: "Drag-and-drop interface to build complex AI-powered workflows.",
    color: "text-cyan-500",
    bg: "bg-cyan-500/10",
    gradient: "from-cyan-500 to-teal-500",
  },
  {
    icon: BookOpen,
    title: "Knowledge Base",
    description: "Create searchable knowledge bases from your documents and data.",
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
    gradient: "from-emerald-500 to-green-500",
  },
];

const steps = [
  {
    number: "01",
    title: "Choose Your Tool",
    description: "Select from AI Chat, Code, Images, Documents, Builder, or Knowledge.",
  },
  {
    number: "02",
    title: "Describe What You Need",
    description: "Tell the AI what you want to build or create in plain English.",
  },
  {
    number: "03",
    title: "Get Results Instantly",
    description: "Receive high-quality outputs you can use, modify, and deploy.",
  },
];

const plans = [
  {
    name: "Free",
    price: "$0",
    description: "Perfect for getting started",
    features: [
      "100 API calls/month",
      "1 GB storage",
      "Basic chat access",
      "Community support",
    ],
    cta: "Get Started",
    href: "/register",
    popular: false,
  },
  {
    name: "Pro",
    price: "$29",
    description: "For professionals and teams",
    features: [
      "5,000 API calls/month",
      "10 GB storage",
      "All features unlocked",
      "Priority support",
      "Custom workflows",
      "Advanced analytics",
    ],
    cta: "Start Free Trial",
    href: "/register",
    popular: true,
  },
  {
    name: "Enterprise",
    price: "$99",
    description: "For large organizations",
    features: [
      "Unlimited API calls",
      "100 GB storage",
      "Dedicated infrastructure",
      "24/7 phone support",
      "Custom integrations",
      "Team collaboration",
      "SSO & audit logs",
      "SLA guarantee",
    ],
    cta: "Contact Sales",
    href: "#",
    popular: false,
  },
];

function Home() {
  return (
    <LandingLayout>
      <section className="relative overflow-hidden py-20 lg:py-32">
        <div className="absolute inset-0 hero-gradient pointer-events-none" />
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl animate-float pointer-events-none" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl animate-float pointer-events-none" style={{ animationDelay: "2s" }} />
        <div className="container mx-auto px-4 text-center relative">
          <Badge variant="secondary" className="mb-6 px-4 py-1.5 text-sm animate-in">
            <Sparkles className="h-3.5 w-3.5 mr-1 text-primary" />
            Powered by advanced AI
          </Badge>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight max-w-4xl mx-auto animate-in">
            Build Anything with{" "}
            <span className="gradient-text">
              AI
            </span>
          </h1>
          <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto animate-in" style={{ animationDelay: "0.1s" }}>
            One platform for AI-powered chat, code generation, image creation,
            document analysis, workflow automation, and knowledge management.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 animate-in" style={{ animationDelay: "0.2s" }}>
            <Button size="lg" className="glow-sm group" asChild>
              <Link href="/register">
                Get Started Free
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="/login">Sign In</Link>
            </Button>
          </div>
          <div className="mt-12 flex items-center justify-center gap-8 text-sm text-muted-foreground animate-in" style={{ animationDelay: "0.3s" }}>
            <span className="flex items-center gap-1">
              <Check className="h-4 w-4 text-green-500" /> No credit card
            </span>
            <span className="flex items-center gap-1">
              <Check className="h-4 w-4 text-green-500" /> Free tier included
            </span>
            <span className="flex items-center gap-1">
              <Check className="h-4 w-4 text-green-500" /> Cancel anytime
            </span>
          </div>
        </div>
      </section>

      <section id="features" className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 animate-in">
            <h2 className="text-3xl font-bold mb-3">
              Everything you need to build
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Six powerful tools in one platform. No switching between
              applications.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <Card key={feature.title} className="card-hover group" style={{ animationDelay: `${i * 0.1}s` }}>
                <CardHeader>
                  <div
                    className={`w-12 h-12 rounded-xl ${feature.bg} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}
                  >
                    <feature.icon className={`h-6 w-6 ${feature.color}`} />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                  <CardDescription>{feature.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Link
                    href="#"
                    className="text-sm font-medium text-primary flex items-center gap-1 group-hover:gap-2 transition-all"
                  >
                    Learn more <ChevronRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 animate-in">
            <h2 className="text-3xl font-bold mb-3">How It Works</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Three simple steps to supercharge your workflow with AI.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {steps.map((step, i) => (
              <div key={step.number} className="text-center group animate-in" style={{ animationDelay: `${i * 0.15}s` }}>
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary/20 to-purple-500/20 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 group-hover:shadow-lg transition-all duration-300">
                  <span className="text-2xl font-bold gradient-text">
                    {step.number}
                  </span>
                </div>
                <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                <p className="text-muted-foreground">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="pricing" className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 animate-in">
            <h2 className="text-3xl font-bold mb-3">
              Simple, Transparent Pricing
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Choose the plan that fits your needs. Upgrade or downgrade anytime.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {plans.map((plan, i) => (
              <Card
                key={plan.name}
                className={`relative card-hover ${
                  plan.popular
                    ? "border-primary glow"
                    : ""
                }`}
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
                    <Badge className="px-3 py-1 bg-gradient-to-r from-primary to-purple-500">
                      <Star className="h-3 w-3 mr-1 fill-current" />
                      Most Popular
                    </Badge>
                  </div>
                )}
                <CardHeader>
                  <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  <div className="mt-2">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    {plan.price !== "$0" && (
                      <span className="text-muted-foreground">/month</span>
                    )}
                  </div>
                  <CardDescription>{plan.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ul className="space-y-2">
                    {plan.features.map((feature) => (
                      <li
                        key={feature}
                        className="flex items-start gap-2 text-sm"
                      >
                        <Check className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Button
                    variant={plan.popular ? "default" : "outline"}
                    className={`w-full ${plan.popular ? "glow-sm" : ""}`}
                    asChild
                  >
                    <Link href={plan.href}>{plan.cta}</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 hero-gradient pointer-events-none" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
        <div className="container mx-auto px-4 text-center relative">
          <h2 className="text-3xl font-bold mb-4">
            Ready to build something{" "}
            <span className="gradient-text">amazing</span>?
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto mb-8">
            Join thousands of developers and creators using OpenBuilder to bring
            their ideas to life with AI.
          </p>
          <Button size="lg" className="glow group" asChild>
            <Link href="/register">
              Get Started Free
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
        </div>
      </section>
    </LandingLayout>
  );
}

export default Home;
