import { useEffect, useState } from "react";
import { paperService } from "../services/api";
import Spinner from "../components/common/Spinner";

const MyPapersPage = () => {
  const [papers, setPapers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchMyPapers = async () => {
      try {
        setLoading(true);
        const response = await paperService.getUserPapers();
        setPapers(response.data);
      } catch (err) {
        setError("Failed to fetch your papers.");
      } finally {
        setLoading(false);
      }
    };
    fetchMyPapers();
  }, []);

  if (loading) return <Spinner />;
  if (error) return <div className="text-red-600 text-center py-8">{error}</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h2 className="text-2xl font-bold mb-6">My Uploaded Papers</h2>
      {papers.length === 0 ? (
        <div className="text-gray-600">You have not uploaded any papers yet.</div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {papers.map((paper) => (
            <div
              key={paper._id}
              className="relative rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm flex flex-col hover:border-gray-400 cursor-pointer"
              onClick={() => window.location.href = `/papers/${paper._id}`}
            >
              <div className="flex-1">
                <h3 className="text-lg font-medium text-gray-900">{paper.title}</h3>
                <p className="text-sm text-gray-500">
                  {paper.subject} • {paper.semester} {paper.year} {paper.subjectCode} {paper.collegeName}
                </p>
              </div>
              <div className="mt-4 flex justify-between items-center">
                <div className="flex items-center">
                  <span className="text-xs font-medium text-gray-500">Uploaded by You</span>
                </div>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {paper.solutionCount} Solutions
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyPapersPage;