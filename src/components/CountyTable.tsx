"use client";
import { useEffect, useState, Fragment } from "react";
import { CountyAuction } from "@prisma/client";
import { US_STATES, getStateCode } from "@/lib/us-states";

export default function Counties() {
  const [counties, setCounties] = useState<CountyAuction[]>([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 50,
    totalPages: 1,
    total: 0,
  });
  const [sortConfig, setSortConfig] = useState({ field: "countyName", order: "asc" });
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [filters, setFilters] = useState({
    state: "",
    county: "",
    auctionFormat: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      // Convert full state name to code for API
      const stateCode = filters.state ? getStateCode(filters.state) : undefined;

      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
        sort: sortConfig.field,
        order: sortConfig.order,
        ...(stateCode && { state: stateCode }),
        ...(filters.county && { county: filters.county }),
        ...(filters.auctionFormat && { auctionFormat: filters.auctionFormat }),
      });

      const res = await fetch(`/api/counties?${params}`);
      const json = await res.json();
      setCounties(json.data);
      setPagination((prev) => ({
        ...prev,
        totalPages: json.pagination.totalPages,
        total: json.pagination.total,
      }));
    };
    fetchData();
  }, [pagination.page, pagination.limit, sortConfig, filters]);

  const handlePageChange = (pageNumber: number) => {
    setPagination((prev) => ({ ...prev, page: pageNumber }));
  };

  const handleSort = (field: string) => {
    setSortConfig((prev) => {
      if (prev.field === field) {
        return { field, order: prev.order === "asc" ? "desc" : "asc" };
      }
      return { field, order: "asc" };
    });
  };

  const toggleRowExpansion = (id: string) => {
    setExpandedRows((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const clearFilters = () => {
    setFilters({
      state: "",
      county: "",
      auctionFormat: "",
    });
  };

  const getBadgeClasses = (format: string | null) => {
    const baseClasses = "inline-block px-2.5 py-1 rounded-xl text-xs font-semibold";
    if (format?.toLowerCase() === "online") {
      return `${baseClasses} bg-neutral-100 text-neutral-900`;
    }
    return `${baseClasses} bg-neutral-200 text-neutral-700`;
  };

  const startIndex = (pagination.page - 1) * pagination.limit + 1;
  const endIndex = Math.min(pagination.page * pagination.limit, pagination.total);

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <header className="bg-white border-b border-neutral-200 px-8 py-4 flex justify-between items-center sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-neutral-900 text-white rounded-md flex items-center justify-center font-extrabold text-base">
            TA
          </div>
          <span className="text-xl font-semibold text-neutral-900 tracking-tight">
            TaxAuction Hub
          </span>
        </div>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 cursor-pointer px-3 py-2 rounded-md hover:bg-neutral-50 transition-colors">
            <div className="w-8 h-8 bg-neutral-900 text-white rounded-full flex items-center justify-center font-semibold text-sm">
              JD
            </div>
            <span className="text-sm font-medium text-neutral-900">John Doe</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-neutral-900 mb-2 tracking-tight">
            County Tax Auction Database
          </h1>
          <p className="text-[15px] text-neutral-600">
            Search and filter property tax auctions across all US counties
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white border border-neutral-200 rounded-lg p-6 mb-6">
          <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold text-neutral-600 uppercase tracking-wider">
                State
              </label>
              <select
                className="px-3 py-2.5 border border-neutral-300 rounded-md text-sm text-neutral-900 bg-white cursor-pointer transition-all hover:border-neutral-400 focus:outline-none focus:border-neutral-900 focus:ring-[3px] focus:ring-neutral-900/5"
                value={filters.state}
                onChange={(e) => setFilters({ ...filters, state: e.target.value })}
              >
                <option value="">All States</option>
                {US_STATES.map((state) => (
                  <option key={state.code} value={state.name}>
                    {state.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold text-neutral-600 uppercase tracking-wider">
                County
              </label>
              <select
                className="px-3 py-2.5 border border-neutral-300 rounded-md text-sm text-neutral-900 bg-white cursor-pointer transition-all hover:border-neutral-400 focus:outline-none focus:border-neutral-900 focus:ring-[3px] focus:ring-neutral-900/5 disabled:bg-neutral-100 disabled:text-neutral-400 disabled:cursor-not-allowed disabled:border-neutral-200"
                value={filters.county}
                onChange={(e) => setFilters({ ...filters, county: e.target.value })}
                disabled={!filters.state}
              >
                <option value="">All Counties</option>
              </select>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold text-neutral-600 uppercase tracking-wider">
                Auction Format
              </label>
              <select
                className="px-3 py-2.5 border border-neutral-300 rounded-md text-sm text-neutral-900 bg-white cursor-pointer transition-all hover:border-neutral-400 focus:outline-none focus:border-neutral-900 focus:ring-[3px] focus:ring-neutral-900/5"
                value={filters.auctionFormat}
                onChange={(e) => setFilters({ ...filters, auctionFormat: e.target.value })}
              >
                <option value="">All Formats</option>
                <option value="Online">Online</option>
                <option value="In-Person">In-Person</option>
                <option value="Hybrid">Hybrid</option>
              </select>
            </div>

            <button
              className="px-4 py-2.5 bg-transparent text-neutral-600 border border-neutral-300 rounded-md text-sm font-medium cursor-pointer transition-all hover:bg-neutral-50 hover:text-neutral-700 self-end"
              onClick={clearFilters}
            >
              Clear Filters
            </button>
          </div>
        </div>

        {/* Table Container */}
        <div className="bg-white border border-neutral-200 rounded-lg overflow-hidden">
          {/* Table Header */}
          <div className="flex justify-between items-center px-6 py-4 border-b border-neutral-200">
            <div className="text-sm text-neutral-600">
              Showing <strong className="text-neutral-900 font-semibold">{endIndex}</strong> of{" "}
              <strong className="text-neutral-900 font-semibold">{pagination.total}</strong> counties
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead className="bg-neutral-50 sticky top-[72px] z-10">
                <tr>
                  <th className="w-10"></th>
                  <th
                    className="text-left px-6 py-3.5 text-xs font-bold text-neutral-600 uppercase tracking-wider border-b border-neutral-200 whitespace-nowrap cursor-pointer select-none hover:text-neutral-900"
                    onClick={() => handleSort("countyName")}
                  >
                    County
                  </th>
                  <th
                    className="text-left px-6 py-3.5 text-xs font-bold text-neutral-600 uppercase tracking-wider border-b border-neutral-200 whitespace-nowrap cursor-pointer select-none hover:text-neutral-900"
                    onClick={() => handleSort("state")}
                  >
                    State
                  </th>
                  <th className="text-left px-6 py-3.5 text-xs font-bold text-neutral-600 uppercase tracking-wider border-b border-neutral-200 whitespace-nowrap cursor-pointer select-none hover:text-neutral-900">
                    Website
                  </th>
                  <th className="text-left px-6 py-3.5 text-xs font-bold text-neutral-600 uppercase tracking-wider border-b border-neutral-200 whitespace-nowrap cursor-pointer select-none hover:text-neutral-900">
                    Contact
                  </th>
                  <th
                    className="text-left px-6 py-3.5 text-xs font-bold text-neutral-600 uppercase tracking-wider border-b border-neutral-200 whitespace-nowrap cursor-pointer select-none hover:text-neutral-900"
                    onClick={() => handleSort("auctionFormat")}
                  >
                    Auction Format
                  </th>
                </tr>
              </thead>
              <tbody>
                {counties.map((county) => (
                  <Fragment key={county.id}>
                    <tr
                      className={`border-b border-neutral-200 transition-colors hover:bg-neutral-50 ${
                        expandedRows.has(county.id) ? "bg-neutral-100" : ""
                      }`}
                    >
                      <td className="px-6 py-4">
                        <button
                          className="w-6 h-6 bg-transparent border-none cursor-pointer flex items-center justify-center text-neutral-600 transition-all rounded hover:bg-neutral-200 hover:text-neutral-700"
                          onClick={() => toggleRowExpansion(county.id)}
                        >
                          <div
                            className={`w-0 h-0 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-t-[6px] border-t-current transition-transform ${
                              expandedRows.has(county.id) ? "rotate-0" : "-rotate-90"
                            }`}
                          />
                        </button>
                      </td>
                      <td className="px-6 py-4 text-sm text-neutral-700">
                        <div className="font-semibold text-neutral-900">{county.countyName}</div>
                      </td>
                      <td className="px-6 py-4 text-sm text-neutral-700">
                        <div className="text-neutral-600 text-xs">{county.state}</div>
                      </td>
                      <td className="px-6 py-4 text-sm text-neutral-700">
                        {county.urlMain && (
                          <a
                            href={county.urlMain}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-neutral-900 no-underline transition-all border-b border-neutral-300 hover:border-neutral-900"
                          >
                            {county.urlMain}
                          </a>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm text-neutral-700">
                        <div>{county.phone}</div>
                        {county.email && (
                          <div className="text-xs text-neutral-500">{county.email}</div>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm text-neutral-700">
                        <span className={getBadgeClasses(county.auctionFormat)}>
                          {county.auctionFormat}
                        </span>
                      </td>
                    </tr>

                    {/* Expanded Content */}
                    {expandedRows.has(county.id) && (
                      <tr key={`${county.id}-expanded`} className="border-b border-neutral-200">
                        <td colSpan={6} className="p-0 bg-neutral-50">
                          <div className="px-6 py-6 border-t border-neutral-200">
                            <div className="grid grid-cols-2 gap-6">
                              {/* Additional Information */}
                              <div className="flex flex-col gap-3">
                                <h4 className="text-xs font-bold text-neutral-600 uppercase tracking-wider mb-1">
                                  Additional Information
                                </h4>
                                <div className="flex flex-col gap-1">
                                  <span className="text-xs text-neutral-600 font-medium">
                                    Next Auction Date
                                  </span>
                                  <span className="text-sm text-neutral-900">
                                    {county.nextAuctionDate
                                      ? new Date(county.nextAuctionDate).toLocaleDateString()
                                      : "N/A"}
                                  </span>
                                </div>
                                <div className="flex flex-col gap-1">
                                  <span className="text-xs text-neutral-600 font-medium">
                                    Auction Format
                                  </span>
                                  <span className="text-sm text-neutral-900">
                                    {county.auctionFormat}
                                  </span>
                                </div>
                                <div className="flex flex-col gap-1">
                                  <span className="text-xs text-neutral-600 font-medium">
                                    Created
                                  </span>
                                  <span className="text-sm text-neutral-900">
                                    {new Date(county.createdAt).toLocaleDateString()}
                                  </span>
                                </div>
                              </div>

                              {/* Third Party Platforms */}
                              <div className="flex flex-col gap-3">
                                <h4 className="text-xs font-bold text-neutral-600 uppercase tracking-wider mb-1">
                                  Third Party Platforms
                                </h4>
                                {county.urlTaxOffice && (
                                  <div className="flex flex-col gap-1">
                                    <span className="text-xs text-neutral-600 font-medium">
                                      Tax Office
                                    </span>
                                    <a
                                      href={county.urlTaxOffice}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-sm text-neutral-900 no-underline transition-all border-b border-neutral-300 hover:border-neutral-900"
                                    >
                                      {county.urlTaxOffice}
                                    </a>
                                  </div>
                                )}
                                {county.urlTaxOther && (
                                  <div className="flex flex-col gap-1">
                                    <span className="text-xs text-neutral-600 font-medium">
                                      Other Platform
                                    </span>
                                    <a
                                      href={county.urlTaxOther}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-sm text-neutral-900 no-underline transition-all border-b border-neutral-300 hover:border-neutral-900"
                                    >
                                      {county.urlTaxOther}
                                    </a>
                                  </div>
                                )}
                              </div>

                              {/* Notes Section */}
                              {county.notes && (
                                <div className="col-span-2 pt-3 border-t border-neutral-200">
                                  <h4 className="text-xs font-bold text-neutral-600 uppercase tracking-wider mb-2">
                                    Notes
                                  </h4>
                                  <div className="text-sm text-neutral-700 leading-relaxed bg-white px-3 py-3 rounded border border-neutral-200">
                                    {county.notes}
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </Fragment>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex justify-between items-center px-6 py-4 border-t border-neutral-200">
            <div className="flex items-center gap-2 text-sm text-neutral-600">
              <span>Rows per page:</span>
              <select
                className="px-2.5 py-1.5 border border-neutral-300 rounded text-sm bg-white cursor-pointer"
                value={pagination.limit}
                onChange={(e) =>
                  setPagination({ ...pagination, limit: Number(e.target.value), page: 1 })
                }
              >
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-sm text-neutral-600">
                {startIndex}-{endIndex} of {pagination.total}
              </span>
              <button
                className="px-3 py-2 bg-white border border-neutral-300 rounded text-sm font-medium text-neutral-700 cursor-pointer transition-all hover:bg-neutral-50 hover:border-neutral-400 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={pagination.page === 1}
                onClick={() => handlePageChange(pagination.page - 1)}
              >
                Previous
              </button>
              <button
                className="px-3 py-2 bg-white border border-neutral-300 rounded text-sm font-medium text-neutral-700 cursor-pointer transition-all hover:bg-neutral-50 hover:border-neutral-400 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={pagination.page === pagination.totalPages}
                onClick={() => handlePageChange(pagination.page + 1)}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}