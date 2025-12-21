"use client";

import { useState } from "react";
import { useNavigate } from 'react-router-dom'
import { createSession } from "@/services/api";
import { Highlighter } from "@/components/ui/highlighter";

import shared from "../assets/friends.png";
import vote from "../assets/vote.png";
import music from "../assets/musical-note.png";
import real from "../assets/tasks.png";

function Hero(): JSX.Element {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sessionName, setSessionName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleCreateSession = async () => {
    if (!sessionName.trim()) {
      setError("Session name is required");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const session = await createSession(sessionName);

      // Close modal and navigate
      setIsModalOpen(false);
      setSessionName("");
      navigate(`/session/${session.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong! Try again");
    } finally {
      setLoading(false);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSessionName("");
    setError("");
  };

  return (
    <>
      {/* HERO SECTION */}
      <section className="bg-white dark:bg-gray-900 mt-10">
        <div className="py-8 px-4 mx-auto max-w-screen-xl text-center lg:py-16 lg:px-12">

          <h1 className="mb-4 text-4xl font-mono tracking-tight leading-none md:text-6xl dark:text-white">
            <Highlighter action="highlight" color="#059669">
              Real-Time
            </Highlighter>{" "}
            Collaborative Music{" "}
            <Highlighter action="underline" color="#87CEFA">
              Voting
            </Highlighter>{" "}
            Platform
          </h1>

          <p className="mb-8 text-lg text-gray-500 dark:text-gray-400">
            Create sessions, add music tracks & vote together.
          </p>

          {/* CREATE SESSION BUTTON */}
          <button
            onClick={() => setIsModalOpen(true)}
            className="relative border-2 bg-green-600 font-extrabold py-2.5 px-10 border-black shadow-[-7px_7px_0px_#000000] font-mono"
          >
            Create a session
          </button>

          {/* MODAL */}
          {isModalOpen && (
            <div
              className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50"
              onClick={closeModal}
            >
              <div
                className="bg-white p-6 w-96 border-2 border-black shadow-[-7px_7px_0px_#000000]"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-2xl font-mono font-bold">
                    Create Session
                  </h3>
                  <button
                    onClick={closeModal}
                    className="text-gray-500 hover:text-black text-2xl"
                    aria-label="Close modal"
                  >
                    ×
                  </button>
                </div>

                <form
                  className="space-y-4"
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleCreateSession();
                  }}
                >
                  <div>
                    <label className="block mb-2 font-mono">
                      Session Name
                    </label>
                    <input
                      type="text"
                      value={sessionName}
                      onChange={(e) => setSessionName(e.target.value)}
                      className="w-full border-2 border-black p-2 shadow-[-3px_3px_0px_#000000]"
                      placeholder="Enter session name"
                      disabled={loading}
                    />
                  </div>

                  {error && (
                    <p className="text-red-600 text-sm">{error}</p>
                  )}

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={closeModal}
                      disabled={loading}
                      className="flex-1 bg-gray-300 border-2 border-black py-2 font-mono shadow-[-7px_7px_0px_#000000] hover:bg-gray-400 disabled:opacity-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex-1 bg-green-600 border-2 border-black py-2 font-mono shadow-[-7px_7px_0px_#000000] hover:bg-green-700 disabled:opacity-50"
                    >
                      {loading ? "Creating..." : "Create"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* FEATURES */}
      <section className="mb-20">
        <h2 className="text-5xl font-mono text-center mb-12">
          Key Features
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mx-20">
          {[
            { img: shared, title: "Shared Sessions", desc: "Create or join sessions" },
            { img: vote, title: "Real-time Voting", desc: "Vote instantly" },
            { img: music, title: "Search Songs", desc: "Add any song" },
            { img: real, title: "Live Updates", desc: "Everyone stays in sync" },
          ].map((item) => (
            <div
              key={item.title}
              className="bg-white p-6 border-2 border-black shadow-[-7px_7px_0px_#000000] text-center"
            >
              <img src={item.img as unknown as string} alt={item.title} className="mx-auto mb-4 w-12" />
              <h3 className="text-xl font-mono text-green-600 mb-2">
                {item.title}
              </h3>
              <p className="font-mono text-gray-600">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}

export default Hero;