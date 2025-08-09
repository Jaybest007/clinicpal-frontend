import React, { useState, useEffect } from 'react';
import { BsSearch, BsDownload,  BsCalendar3, BsThreeDotsVertical, BsArrowLeft, BsPrinter, BsX } from 'react-icons/bs';

interface TransactionHeaderProps {
  onViewPatientHistory: () => void;
  title?: string;
  onSearch?: (searchTerm: string) => void;
  onExport?: (format: 'pdf' | 'csv' | 'excel') => void;
  onDateFilterChange?: (startDate: string, endDate: string) => void;
  onRefresh?: () => void;
}

const TransactionHeader: React.FC<TransactionHeaderProps> = ({ 
  onViewPatientHistory,
  title = "Hospital Transactions",
  onSearch,
  onExport,
  onDateFilterChange,
  onRefresh
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showDateFilter, setShowDateFilter] = useState(false);
  const [showActionsMenu, setShowActionsMenu] = useState(false);
  const [showSearchBox, setShowSearchBox] = useState(false);
  const [dateRange, setDateRange] = useState({
    startDate: '',
    endDate: ''
  });

  // Add keyboard shortcut for search (Ctrl+K or Cmd+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setShowSearchBox(true);
      }
      if (e.key === 'Escape') {
        setShowSearchBox(false);
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(searchTerm);
    }
  };

  const handleDateFilterSubmit = () => {
    if (onDateFilterChange && dateRange.startDate && dateRange.endDate) {
      onDateFilterChange(dateRange.startDate, dateRange.endDate);
      setShowDateFilter(false);
    }
  };

  const handleExport = (format: 'pdf' | 'csv' | 'excel') => {
    if (onExport) {
      onExport(format);
    }
    setShowActionsMenu(false);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      {/* Main header row */}
      <div className="px-4 sm:px-6 py-4 border-b border-gray-100">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-semibold text-blue-900">{title}</h1>
            
            {/* Refresh button - only visible if onRefresh is provided */}
            {onRefresh && (
              <button 
                onClick={onRefresh}
                className="text-gray-400 hover:text-gray-600 transition-colors"
                title="Refresh data"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </button>
            )}
          </div>
          
          {/* Primary action buttons - visible on all screens */}
          <div className="flex items-center gap-2">
            {/* Search button - opens search box */}
            {onSearch && (
              <button
                onClick={() => setShowSearchBox(true)}
                className="flex items-center gap-1 text-sm text-gray-600 hover:text-blue-600 transition-colors py-2 px-3 rounded-lg hover:bg-gray-50"
                aria-label="Search transactions"
                title="Search transactions (Ctrl+K)"
              >
                <BsSearch className="text-gray-500" />
                <span className="hidden sm:inline">Search</span>
              </button>
            )}
            
            <button
              onClick={() => setShowDateFilter(!showDateFilter)}
              className="flex items-center gap-1 text-sm text-gray-600 hover:text-blue-600 transition-colors py-2 px-3 rounded-lg hover:bg-gray-50"
              aria-label="Filter by date"
            >
              <BsCalendar3 className="text-gray-500" />
              <span className="hidden sm:inline">Date Range</span>
            </button>
            
            <button
              onClick={onViewPatientHistory}
              className="flex items-center gap-1 text-sm text-white bg-blue-600 hover:bg-blue-700 transition-colors py-2 px-3 rounded-lg"
              aria-label="View patient payment history"
            >
              <BsArrowLeft className="text-white" />
              <span className="hidden sm:inline">Patient History</span>
            </button>
            
            {/* Actions dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowActionsMenu(!showActionsMenu)}
                className="flex items-center gap-1 text-sm text-gray-600 hover:text-blue-600 transition-colors py-2 px-3 rounded-lg hover:bg-gray-50"
                aria-label="More actions"
              >
                <BsThreeDotsVertical className="text-gray-500" />
                <span className="hidden sm:inline">Actions</span>
              </button>
              
              {/* Actions dropdown menu */}
              {showActionsMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 py-1 border border-gray-200">
                  {onExport && (
                    <>
                      <button
                        onClick={() => handleExport('pdf')}
                        className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <BsDownload className="text-gray-500" />
                        Export as PDF
                      </button>
                      <button
                        onClick={() => handleExport('csv')}
                        className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <BsDownload className="text-gray-500" />
                        Export as CSV
                      </button>
                      <button
                        onClick={() => handleExport('excel')}
                        className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <BsDownload className="text-gray-500" />
                        Export as Excel
                      </button>
                      <hr className="my-1" />
                      <button
                        className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <BsPrinter className="text-gray-500" />
                        Print Transactions
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Search box - shown when search button is clicked or Ctrl+K pressed */}
      {showSearchBox && (
        <div className="px-4 sm:px-6 py-3 border-b border-gray-100 bg-blue-50">
          <div className="flex items-center gap-2">
            <form onSubmit={handleSearchSubmit} className="relative flex-1">
              <input
                type="text"
                placeholder="Search by patient name, ID, or transaction reference..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="py-2 pl-9 pr-9 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full bg-white"
                autoFocus
              />
              <BsSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <BsX className="h-4 w-4" />
                </button>
              )}
            </form>
            <button
              onClick={() => {
                if (searchTerm && onSearch) {
                  onSearch(searchTerm);
                }
              }}
              className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
              disabled={!searchTerm}
            >
              Search
            </button>
            <button
              onClick={() => setShowSearchBox(false)}
              className="px-3 py-2 text-gray-500 hover:text-gray-700 text-sm rounded-lg transition-colors"
            >
              Cancel
            </button>
          </div>
          {/* Search tips */}
          <div className="mt-2 text-xs text-blue-700 flex items-center">
            <span className="mr-2">Pro tip:</span>
            <kbd className="px-1 py-0.5 bg-white border border-gray-300 rounded mr-1">Ctrl</kbd>
            <span className="mr-1">+</span>
            <kbd className="px-1 py-0.5 bg-white border border-gray-300 rounded">K</kbd>
            <span className="ml-1">to search anytime</span>
          </div>
        </div>
      )}
      
      {/* Date filter dropdown */}
      {showDateFilter && (
        <div className="px-6 py-4 border-t border-gray-100 bg-gray-50">
          <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Start Date
              </label>
              <input
                type="date"
                value={dateRange.startDate}
                onChange={(e) => setDateRange({...dateRange, startDate: e.target.value})}
                className="py-2 px-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                End Date
              </label>
              <input
                type="date"
                value={dateRange.endDate}
                onChange={(e) => setDateRange({...dateRange, endDate: e.target.value})}
                className="py-2 px-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div className="flex gap-2">
              <button
                onClick={handleDateFilterSubmit}
                className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                disabled={!dateRange.startDate || !dateRange.endDate}
              >
                Apply Filter
              </button>
              
              <button
                onClick={() => {
                  setDateRange({ startDate: '', endDate: '' });
                  if (onDateFilterChange) {
                    onDateFilterChange('', '');
                  }
                  setShowDateFilter(false);
                }}
                className="px-4 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
              >
                Reset
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TransactionHeader;