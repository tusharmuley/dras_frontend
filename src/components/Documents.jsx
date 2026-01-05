import { useState, useEffect } from "react";
import { getDocuments } from "../services/documentService";
import { getUser } from "../utils/auth";

function Documents() {
  const [documents, setDocuments] = useState([]);
  const [statusCounts, setStatusCounts] = useState({
    all: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
    draft: 0,
  });
  const [activeStatus, setActiveStatus] = useState("all");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [pageSize, setPageSize] = useState(10);
  const [pagination, setPagination] = useState({
    current_page: 1,
    total_pages: 1,
    total_objects: 0,
    next_page: null,
    previous_page: null,
  });
  const user = getUser();

  // Fetch documents
  const fetchDocuments = async (status = null, page = 1) => {
    setLoading(true);
    setError("");
    try {
      const params = {
        page: page,
        page_size: pageSize,
      };
      
      if (status && status !== "all") {
        params.status = status.toUpperCase();
      }
      
      if (searchQuery) {
        params.search = searchQuery;
      }

      const response = await getDocuments(params);
      const data = response.data.data;
      
      setDocuments(data.results || []);
      setStatusCounts(response.data.all_status_count || statusCounts);
      setPagination({
        current_page: data.current_page || 1,
        total_pages: data.total_pages || 1,
        total_objects: data.total_objects || 0,
        next_page: data.next_page,
        previous_page: data.previous_page,
      });
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch documents");
      setDocuments([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch documents on mount and when status/pageSize changes
  useEffect(() => {
    fetchDocuments(activeStatus, 1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeStatus, pageSize]);

  // Handle search with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchDocuments(activeStatus, 1);
    }, 500);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery]);

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Get status badge color
  const getStatusBadge = (status) => {
    const statusLower = status?.toLowerCase();
    const colors = {
      approved: "bg-green-100 text-green-800",
      pending: "bg-yellow-100 text-yellow-800",
      rejected: "bg-red-100 text-red-800",
      draft: "bg-gray-100 text-gray-800",
    };
    return colors[statusLower] || "bg-gray-100 text-gray-800";
  };

  // Get file URL
  const getFileUrl = (filePath) => {
    if (!filePath) return null;
    if (filePath.startsWith("http")) return filePath;
    return `http://127.0.0.1:8000${filePath}`;
  };

  // Handle page change
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.total_pages) {
      fetchDocuments(activeStatus, newPage);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Welcome, {user?.first_name || user?.username || "User"}! 👋
        </h1>
        <p className="text-gray-600">
          Manage and track your documents
        </p>
      </div>

      {/* Status Filter Tabs */}
      <div className="bg-white rounded-lg shadow-md border border-gray-200 p-4">
        <div className="flex flex-wrap gap-2 border-b border-gray-200 pb-4 mb-4">
          <button
            onClick={() => setActiveStatus("all")}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeStatus === "all"
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            All ({statusCounts.all})
          </button>
          <button
            onClick={() => setActiveStatus("pending")}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeStatus === "pending"
                ? "bg-yellow-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Pending ({statusCounts.pending})
          </button>
          <button
            onClick={() => setActiveStatus("approved")}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeStatus === "approved"
                ? "bg-green-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Approved ({statusCounts.approved})
          </button>
          <button
            onClick={() => setActiveStatus("rejected")}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeStatus === "rejected"
                ? "bg-red-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Rejected ({statusCounts.rejected})
          </button>
          <button
            onClick={() => setActiveStatus("draft")}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeStatus === "draft"
                ? "bg-gray-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Draft ({statusCounts.draft})
          </button>
        </div>

        {/* Search Bar and Page Size */}
        <div className="mb-4 flex gap-4 items-center">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search by title or UID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            />
          </div>
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-700 whitespace-nowrap">Items per page:</label>
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setPagination(prev => ({ ...prev, current_page: 1 }));
              }}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm mb-4">
            {error}
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="mt-2 text-gray-600">Loading documents...</p>
          </div>
        )}

        {/* Documents Table */}
        {!loading && documents.length > 0 && (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Title
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Project Code
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    UID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Uploaded By
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created At
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    File
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {documents.map((doc) => (
                  <tr key={doc.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{doc.title}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {doc.category?.category || "N/A"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {doc.project_code?.project_code || "N/A"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadge(
                          doc.current_status
                        )}`}
                      >
                        {doc.current_status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{doc.uid || "N/A"}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {doc.uploaded_by?.first_name} {doc.uploaded_by?.last_name}
                      </div>
                      <div className="text-xs text-gray-500">{doc.uploaded_by?.username}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{formatDate(doc.created_at)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {doc.file ? (
                        <a
                          href={getFileUrl(doc.file)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                        >
                          View File
                        </a>
                      ) : (
                        <span className="text-gray-400 text-sm">No file</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Empty State */}
        {!loading && documents.length === 0 && (
          <div className="text-center py-12">
            <div className="text-4xl mb-4">📄</div>
            <p className="text-gray-600 text-lg">No documents found</p>
            <p className="text-gray-500 text-sm mt-2">
              {searchQuery
                ? "Try adjusting your search query"
                : "There are no documents in this category"}
            </p>
          </div>
        )}

        {/* Pagination */}
        {!loading && documents.length > 0 && pagination.total_pages > 1 && (
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
            <div className="text-sm text-gray-700">
              Showing {((pagination.current_page - 1) * pageSize) + 1} to{" "}
              {Math.min(pagination.current_page * pageSize, pagination.total_objects)} of{" "}
              {pagination.total_objects} results
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handlePageChange(pagination.previous_page)}
                disabled={!pagination.previous_page}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Previous
              </button>
              
              {/* Page Numbers */}
              <div className="flex gap-1">
                {Array.from({ length: Math.min(5, pagination.total_pages) }, (_, i) => {
                  let pageNum;
                  if (pagination.total_pages <= 5) {
                    pageNum = i + 1;
                  } else if (pagination.current_page <= 3) {
                    pageNum = i + 1;
                  } else if (pagination.current_page >= pagination.total_pages - 2) {
                    pageNum = pagination.total_pages - 4 + i;
                  } else {
                    pageNum = pagination.current_page - 2 + i;
                  }
                  
                  return (
                    <button
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        pagination.current_page === pageNum
                          ? "bg-blue-600 text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>
              
              <button
                onClick={() => handlePageChange(pagination.next_page)}
                disabled={!pagination.next_page}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Documents;

