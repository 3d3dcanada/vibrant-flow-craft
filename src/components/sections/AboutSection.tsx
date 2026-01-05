import { Handshake, Copyright } from "lucide-react";
import { GlowCard } from "../ui/GlowCard";

export const AboutSection = () => {
  return (
    <section id="about" className="py-24 relative overflow-hidden">
      {/* Decorative skew */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-secondary/5 skew-x-12 hidden lg:block" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left content */}
          <div className="animate-fade-in">
            <span className="text-primary font-bold tracking-widest uppercase text-sm mb-2 block">
              Our Mission
            </span>
            <h2 className="text-4xl md:text-5xl font-tech font-bold text-foreground mb-6">
              Making 3D Printing Practical and Local in Atlantic Canada
            </h2>
            <p className="text-muted-foreground text-lg mb-6 leading-relaxed">
              3D3D.ca is more than a website; it's a{" "}
              <strong className="text-foreground">cooperative infrastructure project</strong>. We
              connect 50+ local makers in New Brunswick, Nova Scotia, and PEI into a single
              distributed factory.
            </p>
            <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
              Our goal is to outperform corporate monopolies like Amazon and Xometry by being{" "}
              <strong className="text-foreground">faster, fairer, and cleaner</strong>. When you
              order from us, the money stays in your community, not an offshore bank account.
            </p>

            {/* Feature cards */}
            <div className="grid grid-cols-2 gap-6">
              <div
                className="bg-muted/30 p-4 rounded-xl border border-border/50 hover:border-secondary/50 transition-all hover:scale-[1.02] hover:-translate-y-0.5"
              >
                <div className="text-secondary text-3xl mb-2">
                  <Handshake />
                </div>
                <h4 className="font-bold text-foreground">Cooperative Model</h4>
                <p className="text-xs text-muted-foreground mt-1">
                  Makers keep 75% of revenue. We take a flat fee to run the platform.
                </p>
              </div>

              <div
                className="bg-muted/30 p-4 rounded-xl border border-border/50 hover:border-primary/50 transition-all hover:scale-[1.02] hover:-translate-y-0.5"
              >
                <div className="text-primary text-3xl mb-2">
                  <Copyright />
                </div>
                <h4 className="font-bold text-foreground">Designer Ethics</h4>
                <p className="text-xs text-muted-foreground mt-1">
                  We automatically pay 25¢ royalties to file creators.
                </p>
              </div>
            </div>
          </div>

          {/* Right - Team card */}
          <div className="relative animate-fade-in" style={{ animationDelay: '200ms' }}>
            {/* Glow background */}
            <div className="absolute inset-0 bg-gradient-to-br from-secondary/20 to-primary/20 rounded-2xl blur-xl opacity-50 transform rotate-3" />

            <GlowCard variant="teal" hover="glow" className="relative">
              <h3 className="text-2xl font-bold text-foreground mb-6 font-tech">
                The Core Team
              </h3>

              <div className="space-y-6">
                {/* Team members */}
                {[
                  {
                    icon: "🚀",
                    role: "The Founder",
                    title: "Vision & Strategy",
                    desc: "Building the rails for the next industrial revolution.",
                    color: "secondary",
                  },
                  {
                    icon: "💻",
                    role: "Lead Engineer",
                    title: "Platform Architecture",
                    desc: "Ensuring 100% uptime for our distributed nodes.",
                    color: "primary",
                  },
                  {
                    icon: "👥",
                    role: "Maker Success",
                    title: "Quality Assurance",
                    desc: "Vetting every printer to guarantee industrial quality.",
                    color: "success",
                  },
                ].map((member, index) => (
                  <div
                    key={member.role}
                    className="flex items-center gap-4 group cursor-default transition-transform hover:translate-x-1"
                  >
                    <div
                      className={`w-16 h-16 rounded-full bg-card border-2 flex items-center justify-center text-2xl overflow-hidden transition-transform hover:scale-110 hover:rotate-[5deg]`}
                      style={{
                        borderColor:
                          member.color === "secondary"
                            ? "hsl(var(--secondary))"
                            : member.color === "primary"
                            ? "hsl(var(--primary))"
                            : "hsl(var(--success))",
                      }}
                    >
                      {member.icon}
                    </div>
                    <div>
                      <h4 className="font-bold text-foreground transition-colors group-hover:text-secondary">
                        {member.role}
                      </h4>
                      <p className="text-xs text-muted-foreground uppercase tracking-wider">
                        {member.title}
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">{member.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Join CTA */}
              <div className="mt-8 pt-6 border-t border-border/30">
                <p className="text-sm text-muted-foreground mb-3">
                  Have a 3D printer? Join our maker network and earn money.
                </p>
                <button className="text-secondary font-tech font-bold text-sm animated-underline hover:scale-105 transition-transform">
                  Become a Maker →
                </button>
              </div>
            </GlowCard>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
