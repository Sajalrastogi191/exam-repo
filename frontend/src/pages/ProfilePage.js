"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"
import { paperService, solutionService } from "../services/api"
import Spinner from "../components/common/Spinner"

const ProfilePage = () => {
  const { user, updateProfile, updatePassword } = useAuth()

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [bio, setBio] = useState("")
  const [avatar, setAvatar] = useState("");
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  const [activeTab, setActiveTab] = useState("profile")
  const [userPapers, setUserPapers] = useState([])
  const [userSolutions, setUserSolutions] = useState([])

  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  useEffect(() => {
    if (user) {
      setName(user.name || "")
      setEmail(user.email || "")
      setBio(user.bio || "")
      setAvatar(user.avatar || "")
    }
  }, [user])

  useEffect(() => {
    const fetchUserData = async () => {
      if (activeTab === "myPapers") {
        try {
          setLoading(true)
          const response = await paperService.getUserPapers()
          setUserPapers(response.data)
        } catch (err) {
          console.error("Failed to fetch user papers", err)
        } finally {
          setLoading(false)
        }
      } else if (activeTab === "mySolutions") {
        try {
          setLoading(true)
          const response = await solutionService.getUserSolutions()
          setUserSolutions(response.data)
        } catch (err) {
          console.error("Failed to fetch user solutions", err)
        } finally {
          setLoading(false)
        }
      }
    }

    fetchUserData()
  }, [activeTab])

  const handleProfileSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setError("")
    setSuccess("")

    try {
      await updateProfile({ name, email, bio, avatar})
      setSuccess("Profile updated successfully")
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update profile")
    } finally {
      setSubmitting(false)
    }
  }

  const handlePasswordSubmit = async (e) => {
    e.preventDefault()

    if (newPassword !== confirmPassword) {
      setError("New passwords do not match")
      return
    }

    setSubmitting(true)
    setError("")
    setSuccess("")

    try {
      await updatePassword({ currentPassword, newPassword })
      setSuccess("Password updated successfully")
      setCurrentPassword("")
      setNewPassword("")
      setConfirmPassword("")
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update password")
    } finally {
      setSubmitting(false)
    }
  }

  if (!user) {
    return <Spinner />
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="lg:grid lg:grid-cols-12 lg:gap-x-5">
        <aside className="py-6 px-2 sm:px-6 lg:py-0 lg:px-0 lg:col-span-3">
          <nav className="space-y-1">
            <button
              onClick={() => setActiveTab("profile")}
              className={`${
                activeTab === "profile"
                  ? "bg-gray-50 text-blue-600 hover:bg-white"
                  : "text-gray-900 hover:text-gray-900 hover:bg-gray-50"
              } group rounded-md px-3 py-2 flex items-center text-sm font-medium w-full text-left`}
              aria-current={activeTab === "profile" ? "page" : undefined}
            >
              <svg
                className={`${
                  activeTab === "profile" ? "text-blue-500" : "text-gray-400 group-hover:text-gray-500"
                } flex-shrink-0 -ml-1 mr-3 h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
              <span className="truncate">Profile</span>
            </button>

            <button
              onClick={() => setActiveTab("security")}
              className={`${
                activeTab === "security"
                  ? "bg-gray-50 text-blue-600 hover:bg-white"
                  : "text-gray-900 hover:text-gray-900 hover:bg-gray-50"
              } group rounded-md px-3 py-2 flex items-center text-sm font-medium w-full text-left`}
            >
              <svg
                className={`${
                  activeTab === "security" ? "text-blue-500" : "text-gray-400 group-hover:text-gray-500"
                } flex-shrink-0 -ml-1 mr-3 h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
              <span className="truncate">Security</span>
            </button>

            <button
              onClick={() => setActiveTab("myPapers")}
              className={`${
                activeTab === "myPapers"
                  ? "bg-gray-50 text-blue-600 hover:bg-white"
                  : "text-gray-900 hover:text-gray-900 hover:bg-gray-50"
              } group rounded-md px-3 py-2 flex items-center text-sm font-medium w-full text-left`}
            >
              <svg
                className={`${
                  activeTab === "myPapers" ? "text-blue-500" : "text-gray-400 group-hover:text-gray-500"
                } flex-shrink-0 -ml-1 mr-3 h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <span className="truncate">My Papers</span>
            </button>

            <button
              onClick={() => setActiveTab("mySolutions")}
              className={`${
                activeTab === "mySolutions"
                  ? "bg-gray-50 text-blue-600 hover:bg-white"
                  : "text-gray-900 hover:text-gray-900 hover:bg-gray-50"
              } group rounded-md px-3 py-2 flex items-center text-sm font-medium w-full text-left`}
            >
              <svg
                className={`${
                  activeTab === "mySolutions" ? "text-blue-500" : "text-gray-400 group-hover:text-gray-500"
                } flex-shrink-0 -ml-1 mr-3 h-6 w-6`}
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
              <span className="truncate">My Solutions</span>
            </button>
          </nav>
        </aside>

        <div className="space-y-6 sm:px-6 lg:px-0 lg:col-span-9">
          {activeTab === "profile" && (
            <form onSubmit={handleProfileSubmit}>
              <div className="shadow sm:rounded-md sm:overflow-hidden">
                <div className="bg-white py-6 px-4 space-y-6 sm:p-6">
                  <div>
                    <h3 className="text-lg leading-6 font-medium text-gray-900">Profile Information</h3>
                    <p className="mt-1 text-sm text-gray-500">Update your personal information and profile details.</p>
                  </div>

                  {error && (
                    <div className="rounded-md bg-red-50 p-4">
                      <div className="flex">
                        <div className="ml-3">
                          <h3 className="text-sm font-medium text-red-800">{error}</h3>
                        </div>
                      </div>
                    </div>
                  )}

                  {success && (
                    <div className="rounded-md bg-green-50 p-4">
                      <div className="flex">
                        <div className="ml-3">
                          <h3 className="text-sm font-medium text-green-800">{success}</h3>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-6 gap-6">
                    <div className="col-span-6 sm:col-span-3">
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                        Full name
                      </label>
                      <input
                        type="text"
                        name="name"
                        id="name"
                        autoComplete="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        required
                      />
                    </div>

                    <div className="col-span-6 sm:col-span-3">
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                        Email address
                      </label>
                      <input
                        type="email"
                        name="email"
                        id="email"
                        autoComplete="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        required
                      />
                    </div>

                    <div className="col-span-6 sm:col-span-3">
                      <label htmlFor="avatar" className="block text-sm font-medium text-gray-700">
                        avatar url
                      </label>
                      <input
                        type="avatar"
                        name="avatar"
                        id="avatar"
                        autoComplete="avatar"
                        value={avatar}
                        placeholder="enter the url of your profile picture"
                        onChange={(e) => setAvatar(e.target.value)}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      />
                    </div>

                    <div className="col-span-6">
                      <label htmlFor="bio" className="block text-sm font-medium text-gray-700">
                        Bio
                      </label>
                      <div className="mt-1">
                        <textarea
                          id="bio"
                          name="bio"
                          rows={3}
                          className="shadow-sm focus:ring-blue-500 focus:border-blue-500 mt-1 block w-full sm:text-sm border border-gray-300 rounded-md"
                          placeholder="Brief description about yourself"
                          value={bio}
                          onChange={(e) => setBio(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="bg-blue-600 border border-transparent rounded-md shadow-sm py-2 px-4 inline-flex justify-center text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                  >
                    {submitting ? "Saving..." : "Save"}
                  </button>
                </div>
              </div>
            </form>
          )}

          {activeTab === "security" && (
            <form onSubmit={handlePasswordSubmit}>
              <div className="shadow sm:rounded-md sm:overflow-hidden">
                <div className="bg-white py-6 px-4 space-y-6 sm:p-6">
                  <div>
                    <h3 className="text-lg leading-6 font-medium text-gray-900">Change Password</h3>
                    <p className="mt-1 text-sm text-gray-500">Update your password to keep your account secure.</p>
                  </div>

                  {error && (
                    <div className="rounded-md bg-red-50 p-4">
                      <div className="flex">
                        <div className="ml-3">
                          <h3 className="text-sm font-medium text-red-800">{error}</h3>
                        </div>
                      </div>
                    </div>
                  )}

                  {success && (
                    <div className="rounded-md bg-green-50 p-4">
                      <div className="flex">
                        <div className="ml-3">
                          <h3 className="text-sm font-medium text-green-800">{success}</h3>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-6 gap-6">
                    <div className="col-span-6">
                      <label htmlFor="current-password" className="block text-sm font-medium text-gray-700">
                        Current Password
                      </label>
                      <input
                        type="password"
                        name="current-password"
                        id="current-password"
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        required
                      />
                    </div>

                    <div className="col-span-6 sm:col-span-3">
                      <label htmlFor="new-password" className="block text-sm font-medium text-gray-700">
                        New Password
                      </label>
                      <input
                        type="password"
                        name="new-password"
                        id="new-password"
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                      />
                    </div>

                    <div className="col-span-6 sm:col-span-3">
                      <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700">
                        Confirm New Password
                      </label>
                      <input
                        type="password"
                        name="confirm-password"
                        id="confirm-password"
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                </div>
                <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="bg-blue-600 border border-transparent rounded-md shadow-sm py-2 px-4 inline-flex justify-center text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                  >
                    {submitting ? "Updating..." : "Update Password"}
                  </button>
                </div>
              </div>
            </form>
          )}

          {activeTab === "myPapers" && (
            <div className="shadow sm:rounded-md sm:overflow-hidden">
              <div className="bg-white py-6 px-4 space-y-6 sm:p-6">
                <div>
                  <h3 className="text-lg leading-6 font-medium text-gray-900">My Papers</h3>
                  <p className="mt-1 text-sm text-gray-500">View and manage the exam papers you've uploaded.</p>
                </div>

                {loading ? (
                  <div className="text-center py-12">
                    <Spinner />
                  </div>
                ) : userPapers.length > 0 ? (
                  <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                    <table className="min-w-full divide-y divide-gray-300">
                      <thead className="bg-gray-50">
                        <tr>
                          <th
                            scope="col"
                            className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                          >
                            Title
                          </th>
                          <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                            Subject
                          </th>
                          <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                            Semester / Year
                          </th>
                          <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                            Uploaded
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200 bg-white">
                        {userPapers.map((paper) => (
                          <tr key={paper._id}>
                            <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6">
                              <Link
                                to={`/papers/${paper._id}`}
                                className="font-medium text-blue-600 hover:text-blue-500"
                              >
                                {paper.title}
                              </Link>
                            </td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{paper.subject}</td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                              {paper.semester} {paper.year}
                            </td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                              {new Date(paper.createdAt).toLocaleDateString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-12">
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
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No papers yet</h3>
                    <p className="mt-1 text-sm text-gray-500">Get started by uploading your first paper.</p>
                    <div className="mt-6">
                      <Link
                        to="/upload"
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
                        Upload Paper
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === "mySolutions" && (
            <div className="shadow sm:rounded-md sm:overflow-hidden">
              <div className="bg-white py-6 px-4 space-y-6 sm:p-6">
                <div>
                  <h3 className="text-lg leading-6 font-medium text-gray-900">My Solutions</h3>
                  <p className="mt-1 text-sm text-gray-500">View and manage the solutions you've submitted.</p>
                </div>

                {loading ? (
                  <div className="text-center py-12">
                    <Spinner />
                  </div>
                ) : userSolutions.length > 0 ? (
                  <div className="space-y-6">
                    {userSolutions.map((solution) => (
                      <div key={solution._id} className="bg-white shadow sm:rounded-lg border border-gray-200">
                        <div className="px-4 py-5 sm:px-6">
                          <div className="flex items-center justify-between">
                            <div>
                              <h3 className="text-lg font-medium text-gray-900">
                                <Link
                                  to={`/papers/${solution.paper._id}`}
                                  className="text-blue-600 hover:text-blue-500"
                                >
                                  {solution.paper.title}
                                </Link>
                              </h3>
                              <p className="text-sm text-gray-500">
                                {solution.paper.subject} • {solution.paper.semester} {solution.paper.year}
                              </p>
                              <p className="text-sm text-gray-500 mt-1">
                                Submitted on {new Date(solution.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                            <div className="flex items-center space-x-4">
                              <div className="text-center">
                                <p className="text-sm font-medium text-gray-900">{solution.upvotes?.length || 0}</p>
                                <p className="text-xs text-gray-500">Upvotes</p>
                              </div>
                              <div className="text-center">
                                <p className="text-sm font-medium text-gray-900">{solution.downvotes?.length || 0}</p>
                                <p className="text-xs text-gray-500">Downvotes</p>
                              </div>
                            </div>
                          </div>
                          <div className="mt-4 text-sm text-gray-700 whitespace-pre-line">{solution.content}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
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
                    <p className="mt-1 text-sm text-gray-500">Get started by submitting your first solution.</p>
                    <div className="mt-6">
                      <Link
                        to="/papers"
                        className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        Browse Papers
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ProfilePage
