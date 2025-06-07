import { motion } from "framer-motion";
import { useState } from "react";
import TextBlur from "@/components/ui/text-blur";
import AnimatedShinyText from "@/components/ui/shimmer-text";
import { containerVariants, itemVariants } from "@/lib/animation-variants";

export default function CTA() {
  const [animationState, setAnimationState] = useState('idle'); // 'idle', 'takingOff', 'returning'
  const [key, setKey] = useState(0);

  const handleTakeOff = () => {
    if (animationState !== 'idle') return; // Prevent clicks during animation
    
    setAnimationState('takingOff');
    
    // After takeoff, start return journey
    setTimeout(() => {
      setAnimationState('returning');
    }, 1500);
    
    // After return landing, reset to idle
    setTimeout(() => {
      setAnimationState('idle');
      setKey(prev => prev + 1); // Reset for next cycle
    }, 3500); // Total cycle: 1.5s takeoff + 2s return
  };

  const getAnimationProps = () => {
    switch (animationState) {
      case 'takingOff':
        return {
          y: -500,
          x: 200,
          rotate: -30,
          scale: 0.3,
          opacity: 0,
          transition: {
            duration: 1.5,
            ease: "easeIn"
          }
        };
      case 'returning':
        return {
          y: 0,
          x: 0,
          rotate: 90,
          scale: 1,
          opacity: 1,
          transition: {
            duration: 2,
            ease: "easeOut"
          }
        };
      default: // 'idle'
        return {};
    }
  };

  const getInitialProps = () => {
    if (animationState === 'returning') {
      return {
        y: -600,
        x: -300,
        rotate: 45,
        scale: 0.2,
        opacity: 0
      };
    }
    return {
      y: 0,
      x: 0,
      rotate: 0,
      scale: 1,
      opacity: 1
    };
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

      <motion.img
        key={`${key}-${animationState}`} // Unique key for return animation
        src="/airplane_3d.png"
        alt="logo"
        className="mx-auto h-24 w-24 drop-shadow-lg cursor-pointer select-none"
        variants={itemVariants}
        whileHover={animationState === 'idle' ? { 
          scale: 1.1, 
          rotate: [0, -5, 5, 0],
          transition: { duration: 0.3 }
        } : {}}
        initial={getInitialProps()}
        animate={getAnimationProps()}
        onClick={handleTakeOff}
        style={{
          transform: animationState === 'idle' ? "translateZ(0)" : undefined
        }}
      />

      <motion.div variants={itemVariants}>
        <TextBlur
          className="text-center text-3xl font-medium tracking-tighter sm:text-5xl"
          text="Swiftvoyages"
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