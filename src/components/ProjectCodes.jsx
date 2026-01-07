import { useEffect, useState } from "react";
import {
  getProjectCodes,
  createProjectCode,
  updateProjectCode,
  deleteProjectCode,
} from "../services/documentService";

function ProjectCodes() {
  const [projectCodes, setProjectCodes] = useState([]);
  const [pagination, setPagination] = useState({
    current_page: 1,
    total_pages: 1,
    total_objects: 0,
    next_page: null,
    previous_page: null,
  });
  const [pageSize, setPageSize] = useState(10);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [formValue, setFormValue] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [formLoading, setFormLoading] = useState(false);

  const fetchProjectCodes = async (page = 1) => {
    setLoading(true);
    setError("");
    try {
      const res = await getProjectCodes({ page, page_size: pageSize });
      const data = res.data?.data || {};
      const results = data.results || [];
      setProjectCodes(Array.isArray(results) ? results : []);
      setPagination({
        current_page: data.current_page || 1,
        total_pages: data.total_pages || 1,
        total_objects: data.total_objects || 0,
        next_page: data.next_page,
        previous_page: data.previous_page,
      });
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to fetch project codes."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjectCodes(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageSize]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formValue.trim()) return;

    setFormLoading(true);
    setError("");
    setSuccess("");

    try {
      if (editingId) {
        await updateProjectCode(editingId, { project_code: formValue.trim() });
        setSuccess("Project code updated successfully.");
      } else {
        await createProjectCode({ project_code: formValue.trim() });
        setSuccess("Project code created successfully.");
      }

      setFormValue("");
      setEditingId(null);
      await fetchProjectCodes(1);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to save project code. Check your permissions."
      );
    } finally {
      setFormLoading(false);
    }
  };

  const handleEdit = (pc) => {
    setEditingId(pc.id);
    setFormValue(pc.project_code);
    setSuccess("");
    setError("");
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this project code?")) {
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");
    try {
      await deleteProjectCode(id);
      setSuccess("Project code deleted successfully.");
      await fetchProjectCodes(1);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to delete project code. Check your permissions."
      );
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.total_pages) {
      fetchProjectCodes(newPage);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Project Code Management
        </h1>
        <p className="text-gray-600">
          Create, update, and manage project codes.
        </p>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 space-y-4">
        <form
          onSubmit={handleSubmit}
          className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-end"
        >
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {editingId ? "Edit Project Code" : "New Project Code"}
            </label>
            <input
              type="text"
              value={formValue}
              onChange={(e) => setFormValue(e.target.value)}
              placeholder="Enter project code"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            />
          </div>
          <button
            type="submit"
            disabled={formLoading || !formValue.trim()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-60 whitespace-nowrap"
          >
            {formLoading
              ? "Saving..."
              : editingId
              ? "Update Project Code"
              : "Add Project Code"}
          </button>
        </form>

        {(error || success) && (
          <div className="space-y-2">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded-lg text-sm">
                {error}
              </div>
            )}
            {success && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-2 rounded-lg text-sm">
                {success}
              </div>
            )}
          </div>
        )}

        <div className="flex items-center justify-between mt-2">
          <div className="text-sm text-gray-700">
            Total project codes: {pagination.total_objects}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-700">Items per page:</span>
            <select
              value={pageSize}
              onChange={(e) => setPageSize(Number(e.target.value))}
              className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto mt-4">
          {loading ? (
            <div className="text-center py-6 text-gray-600">Loading...</div>
          ) : projectCodes.length === 0 ? (
            <div className="text-center py-6 text-gray-500">
              No project codes found.
            </div>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Project Code
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created At
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {projectCodes.map((pc) => (
                  <tr key={pc.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {pc.project_code}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {pc.created_datetime
                        ? new Date(
                            pc.created_datetime
                          ).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })
                        : "N/A"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                      <button
                        type="button"
                        onClick={() => handleEdit(pc)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(pc.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {pagination.total_pages > 1 && (
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={() => handlePageChange(pagination.previous_page)}
              disabled={!pagination.previous_page}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            >
              Previous
            </button>
            <div className="text-sm text-gray-700">
              Page {pagination.current_page} of {pagination.total_pages}
            </div>
            <button
              type="button"
              onClick={() => handlePageChange(pagination.next_page)}
              disabled={!pagination.next_page}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProjectCodes;


