import React, { useState } from "react";
import { Highlighter } from "@/components/ui/highlighter";
import shared from "../assets/friends.png"
import vote from "../assets/vote.png"
import music from "../assets/musical-note.png"
import real from "../assets/tasks.png"
function Hero(): JSX.Element {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  return (
    <>
      <section className="bg-white dark:bg-gray-900 mt-10">
        <div className="py-8 px-4 mx-auto max-w-screen-xl text-center lg:py-16 lg:px-12">

          <h1 className="mb-4 text-4xl font-mono tracking-tight leading-none text-gray-900 md:text-5xl lg:text-6xl dark:text-white">
            <Highlighter action="highlight" color="#059669">
              Real-Time
            </Highlighter>{" "}
            Collaborative Music{" "}
            <Highlighter action="underline" color="#87CEFA">
              Voting
            </Highlighter>{" "}
            Platform
          </h1>

          <p className="mb-8 text-lg font-sans text-gray-500 lg:text-xl sm:px-16 xl:px-48 dark:text-gray-400">
            Create sessions, add  music tracks & vote together to decide what plays next.
          </p>

          {/* Modal Section */}
          <div className="flex flex-col mb-8 lg:mb-16 space-y-4 sm:flex-row sm:justify-center sm:space-y-0 sm:space-x-4">
            {/* Modal toggle - Update the button styling */}
            <button
              onClick={() => setIsModalOpen(true)}
              className="relative border-2 bg-green-600 cursor-pointer font-extrabold py-2.5 px-10 text-gray-800 transition-colors before:absolute before:left-0 before:top-0 before:-z-10 before:h-full before:w-full before:origin-top-left before:scale-x-0 before:bg-gray-800 before:transition-transform before:duration-300 before:content-[''] hover:text-white before:hover:scale-x-100 border-solid border-black shadow-[-7px_7px_0px_#000000]"
              type="button"
            >
              Create a session
            </button>

            {/* Main modal - Update the modal styling */}
            {isModalOpen && (
              <div
                className="fixed inset-0 bg-transparent bg-opacity-20 backdrop-blur-xl flex justify-center items-center"
                onClick={() => setIsModalOpen(false)}
              >
                <div
                  className="bg-white p-8 relative w-96 border-2 border-black shadow-[-7px_7px_0px_#000000]"
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* Modal header with close button */}
                  <button
                    onClick={() => setIsModalOpen(false)}
                    aria-label="Close modal"
                    title="Close"
                    className="absolute top-2 right-2 border-solid border-2 text-black border-black shadow-[-3px_3px_0px_#000000] p-1 bg-white hover:bg-gray-100"
                  >
                    <svg className="w-5 cursor-pointer h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/>
                    </svg>
                  </button>
                  <h3 className="text-2xl font-extrabold font-mono mb-6">
                    Join Session
                  </h3>

                  {/* Modal body */}
                  <form className="space-y-4">
                    <div>
                      <label htmlFor="sessionName" className="block mb-5 text-xl text-gray-900 font-mono">
                        Session Name
                      </label>
                      <input
                        type="text"
                        id="sessionName"
                        className="w-full border-2 border-black p-2 font-mono focus:outline-none focus:shadow-[-5px_5px_0px_#000000] shadow-[-3px_3px_0px_#000000] text-gray-900 text-sm"
                        placeholder="Enter Session Name"
                        required
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full cursor-pointer relative border-2 bg-green-600 font-extrabold py-2.5 px-10 text-gray-800 transition-colors before:absolute before:left-0 before:top-0 before:-z-10 before:h-full before:w-full before:origin-top-left before:scale-y-0 before:bg-gray-800 before:transition-transform before:duration-300 before:content-[''] hover:text-white before:hover:scale-y-100 border-solid border-black shadow-[-7px_7px_0px_#000000] font-mono mt-6"
                    >
                      Create Session
                    </button>
                  </form>
                </div>
              </div>
            )}
          </div>

        </div>
      </section>

      {/* Key Features */}
      <section className="mb-20">
        <h2 className="text-5xl font-mono text-center mb-12">
          Key Features
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10 mx-20 mb-40">

          <div className="bg-white p-8 border-2 border-black shadow-[-7px_7px_0px_#000000] text-center">
            <img src={shared} alt="Shared sessions icon" className="h-15 w-15 mx-30 -mt-3 mb-4"/>
            <h3 className="text-2xl text-green-600 font-mono mb-4">Shared sessions</h3>
            <p className="font-mono text-gray-600">
              Create or join sessions with friends
            </p>
          </div>

          <div className="bg-white p-8 border-2 border-black shadow-[-7px_7px_0px_#000000] text-center">
            <img src={vote} alt="Real-time voting icon" className="h-15 w-15 mx-30 -mt-3 mb-4"/>
            <h3 className="text-2xl text-green-600 font-mono mb-4">Real-time voting</h3>
            <p className="font-mono text-gray-600">
              Vote on songs and see results instantly
            </p>
          </div>

          <div className="bg-white p-8 border-2 border-black shadow-[-7px_7px_0px_#000000] text-center">
            <img src={music} alt="Search songs icon" className="h-15 w-15 mx-30 -mt-3 mb-4"/>
            <h3 className="text-2xl text-green-600 font-mono mb-4">Search & Add songs</h3>
            <p className="font-mono text-gray-600">
              Find any song and add it to the session instantly
            </p>
          </div>

          <div className="bg-white p-8 border-2 border-black shadow-[-7px_7px_0px_#000000] text-center">
            <img src={real} alt="Live updates icon" className="h-15 w-15 mx-30 -mt-3 mb-4"/>
            <h3 className="text-2xl text-green-600 font-mono mb-4">Live updates</h3>
            <p className="font-mono text-gray-600">
              Everyone stays in sync automatically.
            </p>
          </div>

        </div>
      </section>
    </>
  );
}

export default Hero;
