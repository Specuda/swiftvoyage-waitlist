import { motion } from "framer-motion";
import { useState } from "react";
import TextBlur from "@/components/ui/text-blur";
import AnimatedShinyText from "@/components/ui/shimmer-text";
import ThreeLogo from "@/components/three-logo";
import { containerVariants, itemVariants } from "@/lib/animation-variants";

export default function CTA() {
  const [animationState, setAnimationState] = useState<'idle' | 'takingOff' | 'returning'>('idle');
  const [key, setKey] = useState(0);

  const handleTakeOff = () => {
    if (animationState !== 'idle') return;
    
    setAnimationState('takingOff');
  };

  const handleAnimationComplete = () => {
    if (animationState === 'takingOff') {
      setAnimationState('returning');
    } else if (animationState === 'returning') {
      setAnimationState('idle');
      setKey(prev => prev + 1);
    }
  };

  return (
    <motion.div
      className="flex w-full max-w-2xl flex-col gap-2"
      variants={containerVariants}
      initial="hidden"
      animate="visible">
      <motion.div variants={itemVariants}>
        <div className="flex items-center justify-center">
          <div className="flex w-fit items-center justify-center rounded-full bg-muted/80 text-center">
            <AnimatedShinyText className="px-4 py-1">
              <span>Coming soon!</span>
            </AnimatedShinyText>
          </div>
        </div>
      </motion.div>

      <motion.div 
        variants={itemVariants}
        className="flex justify-center"
      >
        <ThreeLogo
          key={key}
          modelPath="/airplane.glb" // Your 3D model path
          className="mx-auto"
          animationState={animationState}
        />
      </motion.div>

      <motion.div variants={itemVariants}>
        <TextBlur
          className="text-center text-3xl font-medium tracking-tighter sm:text-5xl"
          text="Tripli"
        />
      </motion.div> 

      <motion.div variants={itemVariants}>
        <TextBlur
          className="mx-auto max-w-[32rem] text-center text-xl font-medium tracking-tight text-zinc-200 sm:text-2xl"
          text="flying FINALLY made simple"
        />
      </motion.div>

      <motion.div variants={itemVariants}>
        <TextBlur
          className="mx-auto max-w-[27rem] pt-1.5 text-center text-base text-zinc-300 sm:text-lg"
          text="Join the waitlist to get early access of the product and recieve updates on the progress!"
          duration={0.8}
        />
      </motion.div>
    </motion.div>
  );
}