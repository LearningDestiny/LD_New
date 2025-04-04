"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

const SubmittedFormsPage = () => {
  const [selectedChip, setSelectedChip] = useState("Course");
  const [tableData, setTableData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage] = useState(10);
  const [selectedColumns, setSelectedColumns] = useState([]);
  const [showColumnSelector, setShowColumnSelector] = useState(false);

  const chips = [
    "Course",
    "Event",
    "Workshop",
    "Internship",
    "Graduate Career",
    "Professional Career",
  ];

  // All possible columns for each feature type
  const allPossibleColumns = {
    Course: {
      "User Info": ["Name", "Email", "Phone", "City", "State", "Country", "DOB", "Stream"],
      "Course Info": ["Course Name", "Description", "Price", "Instructor", "URL"],
      "Payment Info": ["Payment Status", "Payment ID", "Order ID", "Currency", "Payment Date"],
      "Application Info": ["Application Date"]
    },
    Event: {
      "User Info": ["Name", "Email", "Phone", "City", "State", "Country", "DOB", "Stream", "Source"],
      "Event Info": ["Event Name", "Description", "Price", "Organizer", "URL", "Location"],
      "Payment Info": ["Payment Status", "Payment ID", "Order ID", "Currency", "Payment Date"],
      "Application Info": ["Application Date"]
    },
    Workshop: {
      "User Info": ["Name", "Email", "Phone", "City", "State", "Country", "DOB", "Stream", "Source"],
      "Workshop Info": ["Workshop Name", "Description", "Price", "Instructor", "URL"],
      "Payment Info": ["Payment Status", "Payment ID", "Order ID", "Currency", "Payment Date"],
      "Application Info": ["Application Date"]
    },
    Internship: {
      "User Info": ["Name", "Email", "Phone", "City", "State", "Country", "DOB", "University", "Graduation Year", "LinkedIn", "Portfolio"],
      "Internship Info": ["Internship Name", "Description", "Location"],
      "Application Info": ["Cover Letter", "Resume", "Application Date"]
    },
    "Graduate Career": {
      "User Info": ["Name", "Email", "Phone", "City", "State", "Country", "DOB", "University", "Highest Qualification", "Graduation Year", "LinkedIn", "Portfolio"],
      "Role Info": ["Role Name", "Description", "Location"],
      "Application Info": ["Cover Letter", "Resume", "Expected Salary", "Available Start Date", "Source", "Application Date", "Status"]
    },
    "Professional Career": {
      "User Info": ["Name", "Email", "Phone", "City", "State", "Country", "DOB", "Experience", "Current Employer", "Skills", "LinkedIn", "Portfolio"],
      "Role Info": ["Role Name", "Description", "Location"],
      "Application Info": ["Cover Letter", "Resume", "Expected Salary", "Available Start Date", "Source", "Application Date", "Status"]
    }
  };

  // Default selected columns for each feature type
  const defaultSelectedColumns = {
    Course: ["Name", "Phone", "Stream", "Course Name", "Payment Status"],
    Event: ["Name", "Phone", "Stream", "Event Name", "Payment Status"],
    Workshop: ["Name", "Phone", "Stream", "Workshop Name", "Payment Status"],
    Internship: ["Name", "Email", "Phone", "University", "Graduation Year", "Resume"],
    "Graduate Career": ["Name", "Email", "Phone", "University", "Highest Qualification", "Resume"],
    "Professional Career": ["Name", "Email", "Experience", "Skills", "Expected Salary", "Resume"]
  };

  // Initialize selected columns when feature type changes
  useEffect(() => {
    setSelectedColumns(defaultSelectedColumns[selectedChip] || []);
    setShowColumnSelector(false); // Hide column selector when changing tabs
  }, [selectedChip]);

  // Map data to table rows based on selected columns
  const mapDataToRows = (data, feature) => {
    if (!data) return [];

    return data.map(item => {
      const row = [];
      
      selectedColumns.forEach(column => {
        switch (column) {
          // Common user fields
          case "Name":
            row.push(item.user?.fullname || "N/A");
            break;
          case "Email":
            row.push(item.user?.email || "N/A");
            break;
          case "Phone":
            row.push(item.user?.phone || "N/A");
            break;
          case "City":
            row.push(item.user?.city || "N/A");
            break;
          case "State":
            row.push(item.user?.state || "N/A");
            break;
          case "Country":
            row.push(item.user?.country || "N/A");
            break;
          case "DOB":
            row.push(item.user?.dob || "N/A");
            break;
          case "Stream":
            row.push(item.user?.stream || "N/A");
            break;
          case "Source":
            row.push(item.user?.source || "N/A");
            break;
          
          // Course/Event/Workshop specific
          case "Course Name":
          case "Event Name":
          case "Workshop Name":
            row.push(item.course?.name || item.event?.name || item.workshop?.name || "N/A");
            break;
          case "Description":
            row.push(item.course?.description || item.event?.description || item.workshop?.description || "N/A");
            break;
          case "Price":
            row.push(item.course?.price   || item.event?.price || item.workshop?.price || "N/A");
            break;
          case "Instructor":
            row.push(item.course?.instructor  || item.event?.instructor || item.workshop?.instructor || "N/A");
            break;
          case "Organizer":
            row.push(item.course?.organizer   || item.event?.organizer || item.workshop?.organizer || "N/A");
            break;
          case "URL":
            const url = item.course?.url || item.event?.url || item.workshop?.url;
            row.push(url ? (
              <Link 
                href={`/${url}`}
                target="_blank"
                className="text-blue-600 hover:underline"
              >
                View 
              </Link>
            ) : "N/A");
            break;
            
            break;
          case "Location":
            row.push(item.course?.location || item.internship?.location || item.role?.location || "N/A");
            break;
          
          // Payment info
          case "Payment Status":
            // make a chip structure for both completed and pending
            row.push(
              item.payment?.status === "completed" ? (
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                  <span className="text-green-500">Paid</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full" />
                  <span className="text-red-500">Pending</span>
                </div>
              )
              );
            // row.push(item.payment?.status === "completed" ? "Paid" : "Pending");
            break;
          case "Payment ID":
            row.push(item.payment?.paymentId || "N/A");
            break;
          case "Order ID":
            row.push(item.payment?.orderId || "N/A");
            break;
          case "Currency":
            row.push(item.payment?.currency || "N/A");
            break;
          case "Payment Date":
            row.push(item.payment?.date ? new Date(item.payment.date).toLocaleDateString() : "N/A");
            break;
          
          // Application info
          case "Application Date":
            row.push(item.applicationDate || item.application?.date || "N/A");
            break;
          
          // Internship/Graduate/Professional specific
          case "University":
            row.push(item.user?.university || "N/A");
            break;
          case "Graduation Year":
            row.push(item.user?.graduationYear || "N/A");
            break;
          case "Highest Qualification":
            row.push(item.user?.highestQualification || "N/A");
            break;
          case "Experience":
            row.push(item.user?.experience || "N/A");
            break;
          case "Current Employer":
            row.push(item.user?.currentEmployer || "N/A");
            break;
          case "Skills":
            row.push(Array.isArray(item.user?.skills) ? item.user.skills.join(", ") : item.user?.skills || "N/A");
            break;
          case "LinkedIn":
            const linkedinUrl = item.user?.linkedin;
            row.push(linkedinUrl ? (
              <Link 
                href={`/${linkedinUrl}`}
                target="_blank"
                className="text-blue-600 hover:underline"
              >
                View 
              </Link>
            ) : "N/A");
            break;
          case "Portfolio":
            const portfolioUrl = item.user?.portfolio;
            row.push(portfolioUrl ? (
              <Link 
                href={`/${portfolioUrl}`}
                target="_blank"
                className="text-blue-600 hover:underline"
              >
                View 
              </Link>
            ) : "N/A");
            break;
          case "Internship Name":
            row.push(item.internship?.name || "N/A");
            break;
          case "Role Name":
            row.push(item.role?.name || "N/A");
            break;
          case "Cover Letter":
            row.push(item.application?.coverLetter || "N/A");
            break;
          case "Resume":
            row.push(item.application?.resumePath ? (
              <Link 
                href={`/api/resume?path=${encodeURIComponent(item.application.resumePath)}`}
                target="_blank"
                className="text-blue-600 hover:underline"
              >
                View Resume
              </Link>
            ) : "N/A");
            break;
          case "Expected Salary":
            row.push(item.application?.expectedSalary ? `₹${item.application.expectedSalary}` : "N/A");
            break;
          case "Available Start Date":
            row.push(item.application?.availableStartDate || "N/A");
            break;
          case "Status":
            row.push(item.application?.status || "N/A");
            break;
          
          default:
            row.push("N/A");
        }
      });
      
      return row;
    });
  };

  // Fetch data based on selected feature
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      setCurrentPage(1);
      
      try {
        let fileName;
        switch (selectedChip) {
          case "Course":
            fileName = "courses";
            break;
          case "Event":
            fileName = "events";
            break;
          case "Workshop":
            fileName = "workshops";
            break;
          case "Internship":
            fileName = "internships";
            break;
          case "Graduate Career":
            fileName = "graduate";
            break;
          case "Professional Career":
            fileName = "professional";
            break;
          default:
            fileName = "courses";
        }

        const response = await fetch(`/api/form/${fileName}`);
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        const data = await response.json();
        setTableData(mapDataToRows(data, selectedChip));
      } catch (err) {
        console.error("Error fetching data:", err);
        // setError(err.message);
        setTableData([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [selectedChip, selectedColumns]);

  // Pagination logic
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = tableData.slice(indexOfFirstRow, indexOfLastRow);
  const totalPages = Math.ceil(tableData.length / rowsPerPage);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Go to next page
  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  // Go to previous page
  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Toggle column selection
  const toggleColumn = (column) => {
    setSelectedColumns(prev => 
      prev.includes(column) 
        ? prev.filter(c => c !== column) 
        : [...prev, column]
    );
  };

  // Get all column options for current feature type
  const getColumnOptions = () => {
    const columnGroups = allPossibleColumns[selectedChip] || {};
    return Object.entries(columnGroups).map(([groupName, columns]) => ({
      groupName,
      columns
    }));
  };

  return (
    <div className="p-4 min-h-1">
      {/* Header Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Submitted Forms</h1>
        <p className="text-gray-600">
          Select a category to view the corresponding submitted forms.
        </p>
      </div>

      {/* Filter Chips */}
      <div className="mb-8">
        <div className="flex flex-wrap gap-2">
          {chips.map((chip) => (
            <button
              key={chip}
              onClick={() => setSelectedChip(chip)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                selectedChip === chip
                  ? "bg-blue-600 text-white shadow-md"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {chip}
            </button>
          ))}
        </div>
      </div>

      {/* Column Selector Toggle Button */}
      <div className="mb-4 flex justify-end">
        <button
          onClick={() => setShowColumnSelector(!showColumnSelector)}
          className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md flex items-center gap-2 transition-colors"
        >
          <span>Customize Columns</span>
          <svg
            className={`w-4 h-4 transition-transform ${showColumnSelector ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>

      {/* Column Selection Panel - Only shown when toggled */}
      {showColumnSelector && (
        <div className="mb-6 bg-white p-4 rounded-lg shadow border border-gray-200">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-lg font-medium text-gray-800">Select Columns to Display</h3>
            <button 
              onClick={() => setShowColumnSelector(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="space-y-4">
            {getColumnOptions().map(({ groupName, columns }) => (
              <div key={groupName}>
                <h4 className="text-sm font-medium text-gray-700 mb-2">{groupName}</h4>
                <div className="flex flex-wrap gap-2">
                  {columns.map(column => (
                    <button
                      key={column}
                      onClick={() => toggleColumn(column)}
                      className={`px-3 py-1 rounded-full text-xs font-medium transition-all duration-200 ${
                        selectedColumns.includes(column)
                          ? "bg-blue-100 text-blue-800 border border-blue-300"
                          : "bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200"
                      }`}
                    >
                      {column}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-3 border-t border-gray-200 flex justify-between">
            <button
              onClick={() => setSelectedColumns(defaultSelectedColumns[selectedChip] || [])}
              className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
            >
              Reset to Default
            </button>
            <button
              onClick={() => setShowColumnSelector(false)}
              className="px-3 py-1 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700"
            >
              Apply Columns
            </button>
          </div>
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          Error loading data: {error}
        </div>
      )}

      {/* Table Section */}
      {!isLoading && !error && (
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {selectedColumns.map((column) => (
                    <th
                      key={column}
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      {column}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentRows.length > 0 ? (
                  currentRows.map((row, rowIndex) => (
                    <tr 
                      key={rowIndex} 
                      className={rowIndex % 2 === 0 ? 'bg-white' : 'bg-gray-50 hover:bg-gray-100'}
                    >
                      {row.map((cell, cellIndex) => (
                        <td
                          key={cellIndex}
                          className="px-6 py-4  text-sm text-gray-700"
                        >
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td 
                      colSpan={selectedColumns.length}
                      className="px-6 py-4 text-center text-sm text-gray-500"
                    >
                      No data available
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Table Footer */}
          {tableData.length > 0 && (
            <div className="bg-gray-50 px-6 py-3 flex items-center justify-between border-t border-gray-200">
              <div className="text-sm text-gray-500">
                Showing <span className="font-medium">{indexOfFirstRow + 1}</span> to{' '}
                <span className="font-medium">
                  {Math.min(indexOfLastRow, tableData.length)}
                </span> of{' '}
                <span className="font-medium">{tableData.length}</span> entries
              </div>
              <div className="flex space-x-2">
                <button 
                  onClick={prevPage}
                  disabled={currentPage === 1}
                  className={`px-3 py-1 rounded-md border text-sm font-medium ${
                    currentPage === 1
                      ? 'border-gray-300 text-gray-400 bg-gray-100 cursor-not-allowed'
                      : 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50'
                  }`}
                >
                  Previous
                </button>
                <div className="flex items-center space-x-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(number => (
                    <button
                      key={number}
                      onClick={() => paginate(number)}
                      className={`px-3 py-1 rounded-md text-sm font-medium ${
                        currentPage === number
                          ? 'bg-blue-600 text-white'
                          : 'bg-white text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {number}
                    </button>
                  ))}
                </div>
                <button 
                  onClick={nextPage}
                  disabled={currentPage === totalPages}
                  className={`px-3 py-1 rounded-md border text-sm font-medium ${
                    currentPage === totalPages
                      ? 'border-gray-300 text-gray-400 bg-gray-100 cursor-not-allowed'
                      : 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50'
                  }`}
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SubmittedFormsPage;