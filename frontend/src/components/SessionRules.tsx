"use client"
import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import toast from "react-hot-toast"
import {
  AnimatedSpan,
  Terminal,
  TypingAnimation,
} from "@/components/ui/terminal"
import { getSession } from "@/services/api"
import type { Session } from "@/services/api"
import logosec from "../assets/logosec.jpg"

export default function SessionRules() {
  const { id } = useParams<{ id: string }>()
  const [session, setSession] = useState<Session | null>(null)
  const [copied, setCopied] = useState(false)
  const [loading, setLoading] = useState(true)

  // Fetch session details
  useEffect(() => {
    if (!id) return

    const fetchSession = async () => {
      try {
        const data = await getSession(id)
        setSession(data)
      } catch (error) {
        console.error("Failed to fetch session:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchSession()
  }, [id])

  const handleCopyLink = () => {
    const link = `${window.location.origin}/session/${id}`
    navigator.clipboard.writeText(link)
    setCopied(true)
    toast.success("Link copied! ")
    setTimeout(() => setCopied(false), 2000)
  }

  // Format date helper
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <>
      {/* Parent Flex Container - Made responsive */}
      <div className="flex flex-col lg:flex-row mx-4 md:mx-10 lg:mx-20 mt-10 lg:mt-24 gap-6 lg:gap-10">

        {/* LEFT: Session Info */}
        <div className="flex flex-col w-full lg:w-1/4">
          {/* Logo Image */}
          <img 
            src={logosec} 
            alt="VoteTheBeat Logo"
            className="w-full max-w-[200px] lg:max-w-none border-2 border-black shadow-[-5px_5px_0px_#000000]"
          />

          {/* Session Details Card */}
          <div className="mt-5 p-4 border-2 border-black bg-white shadow-[-5px_5px_0px_#000000]">
            {/* Session Name */}
            <div className="font-mono mb-3">
              <span className="text-xs text-gray-500 uppercase tracking-wide">Session Name</span>
              <div className="font-bold text-lg text-black">
                {loading ? (
                  <span className="animate-pulse">Loading...</span>
                ) : (
                  session?.name || "Unnamed Session"
                )}
              </div>
            </div>

            {/* Created Date */}
            {session?.createdAt && (
              <div className="font-mono mb-3">
                <span className="text-xs text-gray-500 uppercase tracking-wide">Created</span>
                <div className="text-sm text-black">
                  {formatDate(session.createdAt)}
                </div>
              </div>
            )}

            {/* Session ID */}
            <div className="font-mono mb-4">
              <span className="text-xs text-gray-500 uppercase tracking-wide">Session ID</span>
              <div className="text-xs text-gray-600 break-all font-mono bg-gray-100 p-2 mt-1">
                {id}
              </div>
            </div>

            {/* Share Button */}
            <button
              onClick={handleCopyLink}
              className="w-full border-2 cursor-pointer border-black bg-green-600 text-white font-mono px-4 py-2 shadow-[-4px_4px_0px_#000000] hover:bg-black flex items-center justify-center gap-2"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              {copied ? "Copied!" : "Share Link"}
            </button>
          </div>
        </div>

        {/* RIGHT: Terminal */}
        <div className="w-full lg:w-3/4">
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
            <AnimatedSpan delay={6200} className="text-blue-500">
              5) No Deletion After Votes
            </AnimatedSpan>
            <AnimatedSpan delay={6600} className="text-black">
              You cannot delete your song once someone has voted for it.
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