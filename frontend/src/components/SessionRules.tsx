"use client"
import {
  AnimatedSpan,
  Terminal,
  TypingAnimation,
} from "@/components/ui/terminal"
import share from "../assets/share-2.png"

export default function SessionRules() {
  return (
    <>
      {/* Parent Flex Container */}
      <div className="flex mx-20 mt-10 gap-10">

        {/* LEFT: Navbar / Session Info */}
        <div className="flex flex-col w-1/4">
          <div className="mb-5 flex items-center gap-4">
            <div className="relative inline-block w-fit border-2 bg-green-600 cursor-pointer font-bold py-2.5 px-6 text-gray-800 transition-colors before:absolute before:left-0 before:top-0 before:-z-10 before:h-full before:w-full before:origin-top-left before:scale-x-0 before:bg-gray-800 before:transition-transform before:duration-300 before:content-[''] hover:text-white before:hover:scale-x-100 border-solid border-black shadow-[-7px_7px_0px_#000000] font-mono">
              <span>Test Session</span>
            </div>

            <img
              src={share}
              alt="Copy"
              className="h-12 w-12 border-2 p-2 cursor-pointer border-black shadow-[-3px_3px_0px_#000000]"
            />
          </div>

          <div className="font-mono text-xl mt-5">
            Created at:
          </div>

          <div className="font-mono text-xl mt-5">
            Songs in Queue:
          </div>
        </div>

        {/* RIGHT: Terminal */}
        <div className="w-3/4">
          <Terminal>
            <TypingAnimation delay={0}>$ vote-the-beat --rules</TypingAnimation>

            <AnimatedSpan delay={600} className="text-green-600">
              Loading session rules...
            </AnimatedSpan>

            <TypingAnimation delay={1200}>$ cat RULES.md</TypingAnimation>

            <AnimatedSpan delay={2000} className="text-blue-500">
              1) One Vote Per Song
            </AnimatedSpan>
            <AnimatedSpan delay={2400} className="text-black">
              Each user can vote for a song only once in a session.
            </AnimatedSpan>

            <AnimatedSpan delay={3000} className="text-blue-500">
              2) No Self-Voting
            </AnimatedSpan>
            <AnimatedSpan delay={3400} className="text-black">
              You can’t vote for a song you added yourself.
            </AnimatedSpan>

            <AnimatedSpan delay={4000} className="text-blue-500">
              3) Live Updates
            </AnimatedSpan>
            <AnimatedSpan delay={4400} className="text-black">
              Votes update in real-time for everyone in the session.
            </AnimatedSpan>

            <AnimatedSpan delay={5000} className="text-blue-500">
              4) Session-Based Voting
            </AnimatedSpan>
            <AnimatedSpan delay={5400} className="text-black">
              Votes are counted only within the current session.
            </AnimatedSpan>
            <AnimatedSpan delay={5800} className="text-black">
              New session = fresh votes.
            </AnimatedSpan>

            <TypingAnimation delay={6400}>$ echo "Rules loaded"</TypingAnimation>
            <AnimatedSpan delay={7000} className="text-green-600">
              These are the rules. Enjoy music with your friends :)
            </AnimatedSpan>
          </Terminal>
        </div>
      </div>

      <div className="sr-only">Session rules displayed in terminal animation.</div>
    </>
  )
}
