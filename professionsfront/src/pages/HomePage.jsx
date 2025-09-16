import React from "react";
import { Link } from "react-router-dom";
import BgImg from '../assets/images/Gemini_Generated_Image_uccqy2uccqy2uccq.png'

const HomePage = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">

      <div className="h-full w-full">
        <img src={BgImg} alt="bgImage" />
      </div>
      {/* Navbar */}
      {/* <nav className="w-full bg-white shadow-md py-4 px-8 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-indigo-600">THE PROFESSION</h1>
        <div className="space-x-6">
          <Link to="/login" className="text-gray-700 hover:text-indigo-600">
            Login
          </Link>
          <Link
            to="/signup"
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg shadow hover:bg-indigo-700 transition"
          >
            Sign Up
          </Link>
        </div>
      </nav> */}

      {/* Hero Section */}
      {/* <section className="flex flex-1 items-center justify-center px-8">
        <div className="max-w-4xl text-center">
          <h2 className="text-4xl md:text-6xl font-extrabold text-gray-800 leading-tight">
            Connect. Interact. Grow Together 🚀
          </h2>
          <p className="mt-6 text-lg md:text-xl text-gray-600">
            A community-driven platform to connect with people sharing your{" "}
            <span className="font-semibold text-indigo-600">
              interests, hobbies, and profession
            </span>{" "}
            - not just for jobs, but for guidance & collaboration.
          </p>

          <div className="mt-8 flex justify-center space-x-4">
            <Link
              to="/community"
              className="bg-indigo-600 text-white px-6 py-3 rounded-lg text-lg shadow hover:bg-indigo-700 transition"
            >
              Join Community
            </Link>
            <Link
              to="/about"
              className="border border-indigo-600 text-indigo-600 px-6 py-3 rounded-lg text-lg hover:bg-indigo-50 transition"
            >
              Learn More
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      {/* <section className="bg-white py-16 px-8">
        <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-8 text-center">
          <div className="p-6 rounded-xl shadow hover:shadow-lg transition">
            <h3 className="text-xl font-bold text-indigo-600">Personal Chats 💬</h3>
            <p className="mt-2 text-gray-600">
              Connect one-on-one with people sharing your interests.
            </p>
          </div>

          <div className="p-6 rounded-xl shadow hover:shadow-lg transition">
            <h3 className="text-xl font-bold text-indigo-600">Communities 🌍</h3>
            <p className="mt-2 text-gray-600">
              Join communities to learn, share, and grow together.
            </p>
          </div>

          <div className="p-6 rounded-xl shadow hover:shadow-lg transition">
            <h3 className="text-xl font-bold text-indigo-600">Guidance 🤝</h3>
            <p className="mt-2 text-gray-600">
              Find mentors and peers who can guide you in your journey.
            </p>
          </div>
        </div>
      </section> */} 

      {/* Footer */}
      {/* <footer className="bg-gray-100 py-6 text-center text-gray-600">
        © {new Date().getFullYear()} THE PROFESSION. Built with ❤️.
      </footer> */}
    </div>
  );
};

export default HomePage;
