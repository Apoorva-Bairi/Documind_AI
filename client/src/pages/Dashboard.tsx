import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { uploadFile } from "../features/upload/uploadSlice";
import { logout } from "../features/auth/authSlice";
import { askQuestion, clearAnswer } from "../features/chat/chatSlice";
import { fetchHistory, clearHistory } from "../features/chat/historySlice";
import { useAppDispatch, useAppSelector } from "../store/hooks";

function Dashboard() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [showSources, setShowSources] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const { user } = useAppSelector((state) => state.auth);
  const { loading, success, error, fileName, chunksStored } = useAppSelector(
    (state) => state.upload
  );
  const { answer, sources, loading: chatLoading, error: chatError } =
    useAppSelector((state) => state.chat);
  const { history } = useAppSelector((state) => state.history);

  const [file, setFile] = useState<File | null>(null);
  const [question, setQuestion] = useState("");

  useEffect(() => {
    dispatch(fetchHistory());
  }, [dispatch]);

const handleUpload = async (e: React.FormEvent) => {
  e.preventDefault();

  if (!file) {
    return alert("Please select a file");
  }

  const allowedTypes = ["text/plain", "application/pdf"];

  if (!allowedTypes.includes(file.type)) {
    return alert("Only TXT and PDF files are allowed");
  }

  const maxSize = 5 * 1024 * 1024; // 5MB

  if (file.size > maxSize) {
    return alert("File size must be under 5MB");
  }

  if (fileName === file.name) {
    return alert("This file is already uploaded");
  }

  dispatch(clearAnswer());
  setShowSources(false);

  await dispatch(uploadFile(file));
};

  const handleAsk = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!success) return alert("Please upload a document first");
    if (!question.trim()) return alert("Please enter a question");

    await dispatch(askQuestion(question));
    await dispatch(fetchHistory());
    setQuestion("");
  };

  const handleClearHistory = () => {
    if (history.length === 0) return;
    setShowConfirm(true);
  };

  return (
    <div className="min-h-screen bg-[#070817] text-white p-6">
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,rgba(124,58,237,0.35),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(34,211,238,0.18),transparent_35%)]" />

      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-violet-400 to-cyan-300 bg-clip-text text-transparent">
              DocuMind AI
            </h1>
            <p className="text-slate-400 mt-1">Welcome, {user?.name}</p>
          </div>

          <button
            onClick={() => {
              dispatch(logout());
              navigate("/login");
            }}
            className="bg-white/10 hover:bg-red-500/80 border border-white/10 px-5 py-2 rounded-full"
          >
            Logout
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white/10 backdrop-blur-xl border border-white/10 p-6 rounded-3xl shadow-xl">
              <h2 className="text-xl font-semibold mb-2">Upload Document</h2>
              <p className="text-slate-400 mb-5">
                Upload a TXT or PDF file and start asking questions.
              </p>

              <form onSubmit={handleUpload} className="space-y-4">
                <label className="block border border-dashed border-violet-400/50 bg-black/20 rounded-2xl p-6 cursor-pointer hover:bg-white/5">
                  <input
                    type="file"
                    accept=".txt,.pdf"
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                    className="hidden"
                  />

                  <p className="text-slate-300">
                    {file ? file.name : "Click to choose a document"}
                  </p>
                </label>

                <button className="bg-gradient-to-r from-violet-600 to-cyan-500 hover:opacity-90 px-6 py-3 rounded-xl font-semibold">
                  {loading ? "Uploading..." : "Upload File"}
                  {loading && (
                    <p className="text-cyan-300 text-sm">
                      Reading file, creating chunks, and generating embeddings...
                    </p>
                  )}
                </button>
              </form>

              {success && (
                <div className="mt-4 bg-black/20 border border-emerald-400/20 rounded-2xl p-4">
                  <p className="text-emerald-400 font-medium">
                    File uploaded successfully!
                  </p>

                  <p className="text-slate-300 mt-2 text-sm">
                    Current Document: {fileName}
                  </p>

                  <p className="text-slate-400 text-sm">
                    Chunks Stored: {chunksStored}
                  </p>
                </div>
              )}

              {error && <p className="text-red-400 mt-4">{error}</p>}
            </div>

            <div className="bg-white/10 backdrop-blur-xl border border-white/10 p-6 rounded-3xl shadow-xl">
              <h2 className="text-xl font-semibold mb-4">Ask a Question</h2>

              <form onSubmit={handleAsk} className="flex gap-3">
                <input
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder="Ask something about your document..."
                  className="flex-1 p-4 rounded-xl bg-black/30 border border-white/10 text-white outline-none focus:border-cyan-400"
                />

                <button
                  disabled={!success || chatLoading}
                  className={`px-7 py-3 rounded-xl font-semibold ${
                    !success
                      ? "bg-white/10 text-slate-500 cursor-not-allowed"
                      : "bg-gradient-to-r from-violet-600 to-cyan-500 hover:opacity-90"
                  }`}
                >
                  {chatLoading ? "Thinking..." : "Ask"}
                </button>
              </form>

              {chatError && <p className="text-red-400 mt-4">{chatError}</p>}

              {answer && (
                <div className="mt-6">
                  <h3 className="font-semibold text-cyan-300 mb-2">Answer</h3>

                  <div className="bg-black/25 border border-white/10 rounded-2xl p-5">
                    <p className="text-slate-200 whitespace-pre-line">
                      {answer}
                    </p>
                  </div>

                  <div className="mt-6">
                    <button
                      onClick={() => setShowSources(!showSources)}
                      className="text-cyan-300 font-semibold mb-3"
                    >
                      {showSources ? "Hide Sources" : "Show Sources"}
                    </button>

                    {showSources && (
                      <div className="space-y-3">
                        {sources.map((source) => (
                          <div
                            key={source.id}
                            className="bg-black/25 border border-white/10 p-4 rounded-2xl"
                          >
                            <p className="text-sm text-violet-300">
                              {source.source} — Chunk {source.chunkIndex}
                            </p>
                            <p className="text-slate-300 mt-2 text-sm">
                              {source.text}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-xl border border-white/10 p-6 rounded-3xl h-fit shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Chat History</h2>

              <button
                onClick={handleClearHistory}
                disabled={history.length === 0}
                className={`px-3 py-2 rounded-lg text-sm ${
                  history.length === 0
                    ? "bg-white/10 text-slate-500 cursor-not-allowed"
                    : "bg-red-500/80 hover:bg-red-500"
                }`}
              >
                Clear
              </button>
            </div>

            {history.length === 0 ? (
              <p className="text-slate-400">No history yet.</p>
            ) : (
              <div className="space-y-3 max-h-[620px] overflow-y-auto pr-1">
                {history.map((item) => (
                  <div
                    key={item._id}
                    className="bg-black/25 border border-white/10 p-4 rounded-2xl"
                  >
                    <p className="text-cyan-300 font-medium">{item.question}</p>
                    <p className="text-slate-300 text-sm mt-2 line-clamp-4">
                      {item.answer}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {showConfirm && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4">
          <div className="bg-[#111327] border border-white/10 p-6 rounded-3xl w-full max-w-sm shadow-2xl">
            <h3 className="text-lg font-semibold mb-3">Clear Chat History?</h3>

            <p className="text-slate-400 text-sm mb-5">
              This action cannot be undone.
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20"
              >
                Cancel
              </button>

              <button
                onClick={() => {
                  dispatch(clearHistory());
                  setShowConfirm(false);
                }}
                className="px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600"
              >
                Clear
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;