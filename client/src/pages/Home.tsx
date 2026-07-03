import { Link } from "react-router-dom";
import { useAppSelector } from "../store/hooks";

function Home() {
  const { token } = useAppSelector((state) => state.auth);

  return (
    <div className="min-h-screen bg-[#070817] text-white">
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,rgba(124,58,237,0.35),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(34,211,238,0.18),transparent_35%)]" />

      <section className="max-w-6xl mx-auto px-6 py-24 text-center">
        <p className="text-cyan-300 font-semibold mb-4">
          AI-Powered Document Assistant
        </p>

        <h1 className="text-5xl font-bold leading-tight">
          Chat with your documents using{" "}
          <span className="bg-gradient-to-r from-violet-400 to-cyan-300 bg-clip-text text-transparent">
            DocuMind AI
          </span>
        </h1>

        <p className="mt-6 text-slate-400 text-lg max-w-2xl mx-auto">
          Upload TXT or PDF files, ask questions, and get AI-powered answers
          with source references using Retrieval-Augmented Generation.
        </p>

        <div className="mt-8 flex justify-center gap-4">
          {token ? (
            <Link to="/dashboard" className="bg-gradient-to-r from-violet-600 to-cyan-500 px-6 py-3 rounded-xl font-semibold">
              Go to Dashboard
            </Link>
          ) : (
            <>
              <Link to="/register" className="bg-gradient-to-r from-violet-600 to-cyan-500 px-6 py-3 rounded-xl font-semibold">
                Get Started
              </Link>
              <Link to="/login" className="border border-white/10 bg-white/10 px-6 py-3 rounded-xl font-semibold">
                Login
              </Link>
            </>
          )}
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold text-center mb-10">Features</h2>

        <div className="grid md:grid-cols-3 gap-6">
          {["Secure Authentication", "TXT & PDF Uploads", "AI Question Answering", "Source Transparency", "Chat History", "MongoDB Vector Search"].map((feature) => (
            <div key={feature} className="bg-white/10 backdrop-blur-xl p-6 rounded-3xl border border-white/10">
              <h3 className="text-lg font-semibold text-cyan-300">{feature}</h3>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 py-16 text-center">
        <h2 className="text-3xl font-bold mb-8">Built With</h2>

        <div className="flex flex-wrap justify-center gap-4 text-slate-300">
          {["React", "TypeScript", "Redux Toolkit", "Tailwind CSS", "Node.js", "MongoDB Atlas", "Groq API"].map((tech) => (
            <span key={tech} className="bg-white/10 px-4 py-2 rounded-full border border-white/10">
              {tech}
            </span>
          ))}
        </div>
      </section>

      <section className="text-center py-20">
        <h2 className="text-3xl font-bold mb-4">
          Start chatting with your documents today
        </h2>

        <Link to={token ? "/dashboard" : "/register"} className="bg-gradient-to-r from-violet-600 to-cyan-500 px-6 py-3 rounded-xl font-semibold">
          {token ? "Go to Dashboard" : "Try Now"}
        </Link>
      </section>
    </div>
  );
}

export default Home;