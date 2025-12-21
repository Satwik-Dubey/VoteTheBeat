"use client"
import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import {
  AnimatedSpan,
  Terminal,
  TypingAnimation,
} from "@/components/ui/terminal"
import share from "../assets/share-2.png"

export default function SessionRules() {
  const { id } = useParams<{ id: string }>()
  const [copied, setCopied] = useState(false)

  const handleCopyLink = () => {
    const link = `${window.location.origin}/session/${id}`
    navigator.clipboard.writeText(link)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <>
      {/* Parent Flex Container */}
      <div className="flex mx-20 mt-24 gap-10">

        {/* LEFT: Session Info */}
        <div className="flex flex-col w-1/4">
          <div className="mb-5 flex items-center gap-4">
            <div className="relative inline-block w-fit border-2 bg-green-600 font-bold py-2.5 px-6 text-gray-800 border-solid border-black shadow-[-7px_7px_0px_#000000] font-mono">
              <span>Session</span>
            </div>

            <button
              onClick={handleCopyLink}
              title={copied ? "Copied!" : "Copy session link"}
              className="relative"
            >
              <img
                src={share}
                alt="Copy"
                className="h-12 w-12 border-2 p-2 cursor-pointer border-black shadow-[-3px_3px_0px_#000000] hover:bg-gray-100"
              />
              {copied && (
                <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                  Copied!
                </span>
              )}
            </button>
          </div>

          <div className="font-mono text-lg mt-5">
            <span className="font-bold">Session ID:</span>
            <br />
            <span className="text-sm text-gray-600 break-all">{id}</span>
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
              You can't vote for a song you added yourself.
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