import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const testimonials = [
  {
    name: "Sarah M.",
    role: "Parent",
    content: "Grifyn made it so easy to start a college fund for my daughter. Family members loved contributing to something meaningful instead of just buying more toys.",
    initials: "SM"
  },
  {
    name: "James L.",
    role: "Uncle",
    content: "I always struggled with what to get my nephew. Contributing to his piano lessons through Grifyn felt like a real gift that he'll appreciate forever.",
    initials: "JL"
  },
  {
    name: "Emily R.",
    role: "Parent",
    content: "The interface is beautiful and simple. We set up a 'Disney Trip' fund and our friends were so excited to help us make that memory happen.",
    initials: "ER"
  }
];

const Testimonials = () => {
  return (
    <section className="py-24 bg-muted/30 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      <div className="absolute -left-4 top-1/4 w-72 h-72 bg-blue-100/40 rounded-full blur-3xl -z-10" />
      <div className="absolute -right-4 bottom-1/4 w-72 h-72 bg-purple-100/40 rounded-full blur-3xl -z-10" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight">
            Loved by Families
          </h2>
          <p className="text-lg text-muted-foreground">
            See how parents are using Grifyn to build a better financial future for their children.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="border-border/50 shadow-sm hover:shadow-md transition-all duration-300 bg-card/50 backdrop-blur-sm">
              <CardContent className="pt-8 pb-8 px-6">
                <div className="flex flex-col items-center text-center space-y-6">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-tr from-blue-500 to-purple-500 rounded-full blur opacity-20 transform scale-110"></div>
                    <Avatar className="h-16 w-16 border-2 border-background relative">
                      <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${testimonial.initials}`} />
                      <AvatarFallback>{testimonial.initials}</AvatarFallback>
                    </Avatar>
                  </div>

                  <blockquote className="text-lg text-foreground/80 leading-relaxed">
                    "{testimonial.content}"
                  </blockquote>

                  <div className="pt-2">
                    <div className="font-semibold text-foreground text-base">{testimonial.name}</div>
                    <div className="text-sm text-primary font-medium">{testimonial.role}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;