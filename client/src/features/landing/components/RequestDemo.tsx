"use client";

import Section from "@/components/layout/Section";

import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Field, FieldLabel } from "@/components/ui/field";


const labelStyle = "font-semibold";

export default function RequestDemo() {
  const [ name, setName ] = useState("");
  const [ email, setEmail ] = useState("");

  const handleSubmit = () => {
    console.log('request sent');
  };

  return (
    <Section id="request-demo" className={cn(
      "relative pt-0! before:w-full before:h-40 before:-z-10",
      "before:absolute before:bottom-0 before:left-0 before:bg-primary"
    )}>
      <div className={cn(
        "w-9/10 lg:w-4xl h-max lg:h-120 px-10 py-13 sm:p-16 gap-10",
        "bg-primary-gradient-vr mx-auto rounded-4xl font-medium",
        "grid grid-cols-1 lg:grid-cols-2 items-center",
        "shadow-lg shadow-shadow text-primary-foreground",
      )}>
        <div className="text-center">
          <h2 className={cn(
            "uppercase text-primary-foreground mb-6 sm:mb-4",
            "text-5xl sm:text-6xl/tight"
          )}>
            See Kita in Action
          </h2>
          <p>
            Request a personalized demo and discover how Kita 
            can help you track inventory effortlessly, reduce 
            waste, and boost profits—no commitment required.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="flex flex-col gap-5 max-w-md mx-auto">
            <Field>
              <FieldLabel htmlFor="demo-name"
                className={labelStyle}
              >
                Name
              </FieldLabel>
              <Input 
                id="demo-name" 
                type="text" 
                placeholder="Juan Dela Cruz" 
                value={name}
                className="text-foreground"
                onChange={(e) => setName(e.target.value)}
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="demo-email"
                className={labelStyle}
              >
                Email
              </FieldLabel>
              <Input
                id="demo-email"
                type="email"
                placeholder="juan.delacruz@kita.com"
                value={email}
                className="text-foreground"
                onChange={(e) => setEmail(e.target.value)}
              />
            </Field>

            <div className="flex flex-col items-center lg:items-start">
              <Button 
                variant={'secondary'}  
                size={'lg'}
                width={'lg'}
                type="submit" 
                className="mt-4 shadow-sm shadow-border"
              >
                Request Demo
              </Button>
            </div>
          </div>
        </form>
      </div>
    </Section>
  );
}