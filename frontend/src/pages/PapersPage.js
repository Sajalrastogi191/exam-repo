"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { paperService } from "../services/api"
import Spinner from "../components/common/Spinner"

const PapersPage = () => {
  const [papers, setPapers] = useState([])
  const [filterOptions, setFilterOptions] = useState({
    subjects: [],
    semesters: [],
    years: [],
    subjectCodes: [],
    collegeNames: [],
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  // Filter state
  const [searchQuery, setSearchQuery] = useState("")
  const [subjectFilter, setSubjectFilter] = useState("")
  const [semesterFilter, setSemesterFilter] = useState("")
  const [subjectCodeFilter, setSubjectCodeFilter] = useState("")
  const [yearFilter, setYearFilter] = useState("")
  const [showFilters, setShowFilters] = useState(false)
  const [collegeNameFilter, setCollegeNameFilter] = useState("")
  useEffect(() => {
    const fetchPapers = async () => {
      try {
        setLoading(true)

        // Get filter options first
        const optionsResponse = await paperService.getFilterOptions()
        setFilterOptions(optionsResponse.data)

        // Fetch papers with any active filters
        const filters = {
          search: searchQuery,
          subject: subjectFilter,
          semester: semesterFilter,
          year: yearFilter,
          subjectCode: subjectCodeFilter,
          collegeName: collegeNameFilter,
        }

        const response = await paperService.getPapers(filters)
        setPapers(response.data)
      } catch (err) {
        setError("Failed to fetch papers. Please try again later.")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchPapers()
  }, [searchQuery, subjectFilter, semesterFilter, yearFilter, subjectCodeFilter, collegeNameFilter])

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    // The search is already triggered by the useEffect
  }

  if (loading) return <Spinner />

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="md:flex md:items-center md:justify-between mb-6">
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">Exam Papers</h1>
        </div>
        <div className="mt-4 flex md:mt-0 md:ml-4">
          <Link
            to="/upload"
            className="ml-3 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Upload Paper
          </Link>
        </div>
      </div>

      <div className="mb-6">
        <form onSubmit={handleSearchSubmit}>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-grow">
              <input
                type="text"
                placeholder="Search papers..."
                className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <button
              type="button"
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              onClick={() => setShowFilters(!showFilters)}
            >
              <svg
                className="-ml-1 mr-2 h-5 w-5 text-gray-500"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                />
              </svg>
              Filters
            </button>
          </div>

          {showFilters && (
            <div className="mt-4 grid grid-cols-1 gap-y-4 sm:grid-cols-3 sm:gap-x-4">
              <div>
                <label htmlFor="subject-filter" className="block text-sm font-medium text-gray-700">
                  Subject
                </label>
                <select
                  id="subject-filter"
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                  value={subjectFilter}
                  onChange={(e) => setSubjectFilter(e.target.value)}
                >
                  <option value="">All Subject</option>
                  {filterOptions.subjects.map((subject) => (
                    <option key={subject} value={subject}>
                      {subject}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="semester-filter" className="block text-sm font-medium text-gray-700">
                  Semester
                </label>
                <select
                  id="semester-filter"
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                  value={semesterFilter}
                  onChange={(e) => setSemesterFilter(e.target.value)}
                >
                  <option value="">All Semesters</option>
                  {filterOptions.semesters.map((semester) => (
                    <option key={semester} value={semester}>
                      {semester}
                    </option>
                  ))}
                </select>
              </div>


              <div>
                <label htmlFor="subject-code-filter" className="block text-sm font-medium text-gray-700">
                  Subject Code
                </label>
                <select
                  id="subject-code-filter"
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                  value={subjectCodeFilter}
                  onChange={(e) => setSubjectCodeFilter(e.target.value)}
                >
                  <option value="">All Subject Codes</option>
                  {filterOptions.subjectCodes.map((code) => (
                    <option key={code} value={code}>
                      {code}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="year-filter" className="block text-sm font-medium text-gray-700">
                  Year
                </label>
                <select
                  id="year-filter"
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                  value={yearFilter}
                  onChange={(e) => setYearFilter(e.target.value)}
                >
                  <option value="">All Years</option>
                  {filterOptions.years.map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="college-name-filter" className="block text-sm font-medium text-gray-700">
                  College Name
                </label>
                <select
                  id="college-name-filter"
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                  value={collegeNameFilter}
                  onChange={(e) => setCollegeNameFilter(e.target.value)}
                >
                  <option value="">All Colleges</option>
                  {filterOptions.collegeNames.map((college) => (
                    <option key={college} value={college}>
                      {college}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
          )}
        </form>
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

      {papers.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {papers.map((paper) => (
            <div
              key={paper._id}
              className="relative rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm flex flex-col hover:border-gray-400"
            >
              <div className="flex-1">
                <Link to={`/papers/${paper._id}`} className="focus:outline-none">
                  <span className="absolute inset-0" aria-hidden="true"></span>
                  <h3 className="text-lg font-medium text-gray-900">{paper.title}</h3>
                  <p className="text-sm text-gray-500">
                    {paper.subject} • {paper.semester} {paper.year} {paper.subjectCode} {paper.collegeName}
                  </p>
                </Link>
              </div>
              <div className="mt-4 flex justify-between items-center">
                <div className="flex items-center">
                  <span className="text-xs font-medium text-gray-500">Uploaded by {paper.author.name}</span>
                </div>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {paper.solutionCount} Solutions
                </span>
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
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No papers found</h3>
          <p className="mt-1 text-sm text-gray-500">Get started by uploading a new paper.</p>
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
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Upload Paper
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}

export default PapersPage
