'use client'

import { Card, CardContent } from "@/components/ui/card";
import { Users, Target, Award, Heart } from "lucide-react";

const About = () => {
  const values = [
    {
      icon: Users,
      title: "Community First",
      description: "We believe in building strong connections and fostering meaningful relationships through events.",
    },
    {
      icon: Target,
      title: "Innovation",
      description: "Constantly evolving our platform to provide the best event discovery and management experience.",
    },
    {
      icon: Award,
      title: "Excellence",
      description: "Committed to delivering high-quality events that exceed expectations and create lasting memories.",
    },
    {
      icon: Heart,
      title: "Passion",
      description: "Driven by our love for bringing people together and creating unforgettable experiences.",
    },
  ];

  const team = [
    {
      name: "Rahul Rathee",
      role: "CEO & Founder",
      image: "https://res.cloudinary.com/dgxwp0k8w/image/upload/v1755527278/RahulProfile-removebg-preview_xnc68n.png",
    },
    {
      name: "Ajay Bhanwala",
      role: "CTO",
      image: "https://res.cloudinary.com/dgxwp0k8w/image/upload/v1747459789/pduzxwmbbgafumdyv27e.jpg",
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1">
        <section className="bg-[url('/assets/event_HomePage.jpeg')] bg-cover bg-end w-full h-[40vh] py-20">
          <div className="container mx-auto px-4 text-center text-white">
            <h1 className="text-4xl md:text-5xl font-bold text-primary-foreground mb-6">
              About Eventify
            </h1>
            <p className="text-xl text-primary-foreground/90 max-w-3xl mx-auto">
              We're on a mission to connect people through amazing events and create memorable experiences
              that inspire, educate, and entertain.
            </p>
          </div>
        </section>
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl font-bold mb-6">Our Story</h2>
              <div className="prose prose-gray dark:prose-invert max-w-none space-y-4 text-muted-foreground">
                <p>
                  Founded in 2024, Eventify was born from a simple idea: make it easier for people to discover
                  and attend events that matter to them. We noticed that great events were happening everywhere,
                  but people often missed out because they didn't know about them.
                </p>
                <p>
                  Today, we're proud to serve thousands of event organizers and attendees, helping them connect,
                  learn, and grow together. Our platform has become the go-to destination for discovering everything
                  from tech conferences to networking meetups, workshops, and more.
                </p>
                <p>
                  We believe that events have the power to change lives, spark innovation, and build communities.
                  That's why we're committed to making event discovery and management as seamless as possible.
                </p>
              </div>
            </div>
          </div>
        </section>
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Our Values</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                These core principles guide everything we do
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {values.map((value) => (
                <Card key={value.title} className="text-center hover:shadow-elegant transition-all duration-300">
                  <CardContent className="pt-8 pb-6">
                    <div className="mx-auto mb-4 w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                      <value.icon className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="font-bold text-lg mb-2">{value.title}</h3>
                    <p className="text-sm text-muted-foreground">{value.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Meet Our Team</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                The passionate people behind Eventify
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {team.map((member) => (
                <Card key={member.name} className="text-center hover:shadow-card-hover transition-all">
                  <CardContent className="pt-6">
                    <img 
                      src={member.image} 
                      alt={member.name}
                      className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
                      loading="lazy"
                    />
                    <h3 className="font-bold text-lg mb-1">{member.name}</h3>
                    <p className="text-sm text-muted-foreground">{member.role}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
        <section className="pb-40 py-20 bg-gradient-card">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
              <div>
                <p className="text-4xl font-bold text-primary mb-2">10K+</p>
                <p className="text-muted-foreground">Events Hosted</p>
              </div>
              <div>
                <p className="text-4xl font-bold text-primary mb-2">50K+</p>
                <p className="text-muted-foreground">Active Users</p>
              </div>
              <div>
                <p className="text-4xl font-bold text-primary mb-2">500+</p>
                <p className="text-muted-foreground">Organizers</p>
              </div>
              <div>
                <p className="text-4xl font-bold text-primary mb-2">95%</p>
                <p className="text-muted-foreground">Satisfaction Rate</p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default About;