"use client"

import { useState, useEffect } from "react"
import { useParams, Link } from "react-router-dom"
import { paperService, solutionService} from "../services/api"
import { useAuth } from "../contexts/AuthContext"
import Spinner from "../components/common/Spinner"
import { Document, Page, pdfjs } from 'react-pdf';
pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.js";


const PaperDetailPage = () => {
  const { id } = useParams()
  const { isAuthenticated, user } = useAuth()

  const [paper, setPaper] = useState(null)
  const [solutions, setSolutions] = useState([])
  const [relatedPapers, setRelatedPapers] = useState([])
  const [newSolution, setNewSolution] = useState("")
  const [activeSolutionTab, setActiveSolutionTab] = useState("view") // 'view' or 'add'
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState("")
  //chatbot
  const [chatInput,setChatInput] = useState("")
  const [chatLoading,setChatLoading] = useState(false)
  const [chatAnswer,setChatAnswer] = useState("");
  const [numPages, setNumPages] = useState(null);
  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  console.log(paper);
  //chatbot handlesubmit 
  const handleChatSubmit = async (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    setChatLoading(true);
    setChatAnswer("");

    try {
      const res = await fetch('http://localhost:5000/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: chatInput })
      });

      const data = await res.json();
      const reply = data?.reply || "No response";
      setChatAnswer(reply);
    } catch (err) {
      console.error("Chat error:", err);
      setChatAnswer("Something went wrong.");
    } finally {
      setChatLoading(false);
      setChatInput("");
    }
  };





  useEffect(() => {
    const fetchPaperAndSolutions = async () => {
      try {
        setLoading(true)

        // Fetch paper details
        const paperResponse = await paperService.getPaperById(id)
        setPaper(paperResponse.data.paper)
        setRelatedPapers(paperResponse.data.relatedPapers)

        // Fetch solutions
        const solutionsResponse = await solutionService.getSolutions(id)
        setSolutions(solutionsResponse.data)
      } catch (err) {
        setError("Failed to fetch paper details. Please try again later.")
        
      } finally {
        setLoading(false)
      }
    }

    fetchPaperAndSolutions()
  }, [id])

  const handleDownload = () => {
    paperService.downloadPaper(id)
  }

  const handleSolutionSubmit = async (e) => {
    e.preventDefault()

    if (!newSolution.trim()) return

    try {
      setSubmitting(true)

      const response = await solutionService.addSolution(id, newSolution)

      // Add new solution to the list
      setSolutions([response.data, ...solutions])

      // Clear form and switch to view tab
      setNewSolution("")
      setActiveSolutionTab("view")
    } catch (err) {
      setError("Failed to submit solution. Please try again later.")
    } finally {
      setSubmitting(false)
    }
  }

  const handleVote = async (solutionId, voteType) => {
    if (!isAuthenticated) return

    try {
      const voteFunction = voteType === "upvote" ? solutionService.upvoteSolution : solutionService.downvoteSolution

      const response = await voteFunction(solutionId)

      // Update the solution in the list
      setSolutions(
        solutions.map((solution) =>
          solution._id === solutionId
            ? { ...solution, upvotes: response.data.upvotes, downvotes: response.data.downvotes }
            : solution,
        ),
      )
    } catch (err) {
    }
  }

  if (loading) return <Spinner />

  if (!paper) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
        <h2 className="text-2xl font-bold text-red-600">Paper not found</h2>
        <p className="mt-2 text-gray-600">The paper you're looking for doesn't exist or has been removed.</p>
        <Link to="/papers" className="mt-4 inline-block text-blue-600 hover:underline">
          Back to papers
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <Link to="/papers" className="inline-flex items-center text-sm text-blue-600 hover:text-blue-500">
          <svg
            className="h-5 w-5 mr-1"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to papers
        </Link>
      </div>

      {error && (
        <div className="rounded-md bg-red-50 p-4 mb-6">
          <div className="flex">
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">{error}</h3>
            </div>
          </div>
        </div>
      )}

      <div className="lg:grid lg:grid-cols-3 lg:gap-8">
        <div className="lg:col-span-2">
          <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-6">
            <div className="px-4 py-5 sm:px-6 flex justify-between items-start">
              <div>
                <h3 className="text-lg leading-6 font-medium text-gray-900">{paper.title}</h3>
                <p className="mt-1 max-w-2xl text-sm text-gray-500">
                  {paper.subject} • {paper.semester} {paper.year}
                </p>
              </div>
              <div className="flex gap-2">
                {/* Delete Button */}
                {isAuthenticated && user?._id === paper.author._id && (
                  <button
                    type="button"
                    onClick={async () => {
                      if (window.confirm("Are you sure you want to delete this paper?")) {
                        try {
                          await paperService.deletePaper(paper._id);
                          window.location.href = "/papers";
                        } catch (err) {
                          alert("Failed to delete paper.");
                        }
                      }
                    }}
                    className="inline-flex items-center px-4 py-2 border border-red-300 text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  >
                    <svg
                      className="-ml-1 mr-2 h-5 w-5"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                    Delete
                  </button>
                )}
                {/* Download Button */}
                <button
                  onClick={handleDownload}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <svg
                    className="-ml-1 mr-2 h-5 w-5"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                    />
                  </svg>
                  Download
                </button>
              </div>
            </div>
            
            <div className="h-[600px] w-full overflow-hidden">
            <iframe
              src={`http://localhost:5000${paper.fileUrl}`}
              className="h-full w-full"
              frameBorder="0"
              title="Paper PDF"
            ></iframe>
            </div>


            <div className="border-t border-gray-200">
              <dl>
                {paper.description && (
                  <>
                    <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                      <dt className="text-sm font-medium text-gray-500">Description</dt>
                      <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{paper.description}</dd>
                    </div>
                  </>
                )}
                <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Uploaded by</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{paper.author.name}</dd>
                </div>
                <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">File name</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{paper.fileName}</dd>
                </div>
                <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Subject Code</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{paper.subjectCode}</dd>
                </div>
                <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Semester</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{paper.semester}</dd>
                </div>
                <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Year</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{paper.year}</dd>
                </div>
                <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">College Name</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{paper.collegeName}</dd>
                </div>
              </dl>
            </div>
          </div>

          <div className="bg-white shadow sm:rounded-lg mb-6">
            <div className="px-4 pt-5 sm:px-6">
              <div className="border-b border-gray-200">
                <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                  <button
                    onClick={() => setActiveSolutionTab("view")}
                    className={`${
                      activeSolutionTab === "view"
                        ? "border-blue-500 text-blue-600"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                  >
                    Solutions ({solutions.length})
                  </button>
                  {isAuthenticated && (
                    <button
                      onClick={() => setActiveSolutionTab("add")}
                      className={`${
                        activeSolutionTab === "add"
                          ? "border-blue-500 text-blue-600"
                          : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                      } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                    >
                      Add Solution
                    </button>
                  )}
                </nav>
              </div>
            </div>

            <div className="px-4 py-5 sm:px-6">
              {activeSolutionTab === "view" && (
                <div>
                  {solutions.length > 0 ? (
                    <ul className="space-y-6">
                      {solutions.map((solution) => (
                        <li key={solution._id} className="bg-white shadow sm:rounded-lg border border-gray-200">
                          <div className="px-4 py-5 sm:px-6">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center">
                                <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                                  {solution.author.name.charAt(0)}
                                </div>
                                <div className="ml-3">
                                  <div className="text-sm font-medium text-gray-900">{solution.author.name}</div>
                                  <div className="text-sm text-gray-500">
                                    {new Date(solution.createdAt).toLocaleDateString()}
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center space-x-2">
                                <button
                                  onClick={() => handleVote(solution._id, "upvote")}
                                  disabled={!isAuthenticated}
                                  className={`flex items-center p-1 rounded-full ${
                                    isAuthenticated && solution.upvotes.includes(user?._id)
                                      ? "text-green-600"
                                      : "text-gray-400 hover:text-gray-500"
                                  }`}
                                >
                                  <svg
                                    className="h-5 w-5"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"
                                    />
                                  </svg>
                                  <span className="ml-1 text-xs font-medium">{solution.upvotes.length}</span>
                                </button>
                                <button
                                  onClick={() => handleVote(solution._id, "downvote")}
                                  disabled={!isAuthenticated}
                                  className={`flex items-center p-1 rounded-full ${
                                    isAuthenticated && solution.downvotes.includes(user?._id)
                                      ? "text-red-600"
                                      : "text-gray-400 hover:text-gray-500"
                                  }`}
                                >
                                  <svg
                                    className="h-5 w-5"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M10 14H5.236a2 2 0 01-1.789-2.894l3.5-7A2 2 0 018.736 3h4.018a2 2 0 01.485.06l3.76.94m-7 10v5a2 2 0 002 2h.095c.5 0 .905-.405.905-.905 0-.714.211-1.412.608-2.006L17 13V4m-7 10h2"
                                    />
                                  </svg>
                                  <span className="ml-1 text-xs font-medium">{solution.downvotes.length}</span>
                                </button>
                              </div>
                            </div>
                            <div className="mt-4 text-sm text-gray-900 whitespace-pre-line">{solution.content}</div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="text-center py-6">
                      <svg
                        className="mx-auto h-12 w-12 text-gray-400"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                        />
                      </svg>
                      <h3 className="mt-2 text-sm font-medium text-gray-900">No solutions yet</h3>
                      {isAuthenticated ? (
                        <div className="mt-6">
                          <button
                            type="button"
                            onClick={() => setActiveSolutionTab("add")}
                            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                          >
                            <svg
                              className="-ml-1 mr-2 h-5 w-5"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                              />
                            </svg>
                            Add Solution
                          </button>
                        </div>
                      ) : (
                        <p className="mt-1 text-sm text-gray-500">
                          <Link to="/login" className="text-blue-600 hover:text-blue-500">
                            Sign in
                          </Link>{" "}
                          to add a solution
                        </p>
                      )}
                    </div>
                  )}
                </div>
              )}

              {activeSolutionTab === "add" && (
                <form onSubmit={handleSolutionSubmit}>
                  <div>
                    <label htmlFor="solution" className="block text-sm font-medium text-gray-700">
                      Your Solution
                    </label>
                    <div className="mt-1">
                      <textarea
                        id="solution"
                        name="solution"
                        rows={8}
                        className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                        placeholder="Write your solution here..."
                        value={newSolution}
                        onChange={(e) => setNewSolution(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <div className="mt-4 flex justify-end">
                    <button
                      type="button"
                      onClick={() => setActiveSolutionTab("view")}
                      className="mr-4 inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={submitting || !newSolution.trim()}
                      className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                    >
                      {submitting ? "Submitting..." : "Submit Solution"}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>

        <div className="mt-6 lg:mt-0">
          <div className="bg-white shadow sm:rounded-lg overflow-hidden">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Related Papers</h3>
            </div>
            {relatedPapers.length > 0 ? (
              <ul className="divide-y divide-gray-200">
                {relatedPapers.map((relatedPaper) => (
                  <li key={relatedPaper._id}>
                    <Link to={`/papers/${relatedPaper._id}`} className="block hover:bg-gray-50">
                      <div className="px-4 py-4 sm:px-6">
                        <div className="text-sm font-medium text-blue-600 truncate">{relatedPaper.title}</div>
                        <div className="mt-1 text-xs text-gray-500">
                          {relatedPaper.semester} {relatedPaper.year}
                        </div>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="px-4 py-5 sm:px-6 text-sm text-gray-500">No related papers found</div>
            )}
          </div>

            <div className="mt-10 lg:mt-0 pt-10">
              <div className="bg-white shadow sm:rounded-lg overflow-hidden">
                <div className="px-4 py-5 sm:px-6">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">Chatbot</h3>
                </div>

                <div className="px-4 pb-4">
                  <form onSubmit={handleChatSubmit} className="flex gap-2">
                    <input
                      type="text"
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm"
                      placeholder="Ask a question..."
                    />
                    <button
                      type="submit"
                      disabled={!chatInput.trim() || chatLoading}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 text-sm"
                    >
                      Ask
                    </button>
                  </form>

                  {chatLoading && (
                    <p className="text-sm text-gray-500 mt-2 italic">Bot is thinking...</p>
                  )}

                  {chatAnswer && (
                    <div
                      className="mt-3 text-sm text-gray-800 bg-gray-100 p-3 rounded-md"
                      dangerouslySetInnerHTML={{ __html: chatAnswer }}
                    />
                  )}
                </div>
              </div>
            </div>

        </div>
      </div>
    </div>
  )
}

export default PaperDetailPage;