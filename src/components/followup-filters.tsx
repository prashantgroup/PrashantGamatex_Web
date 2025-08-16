import React, { useState, useEffect } from "react";
import { X, Calendar, ChevronDown, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useLeadFilters } from "@/hooks/useLeads";
import { LeadFilterData } from "@/types/lead";

export interface FollowupFilterOptions {
  person?: { UserName: string; UserCode: string };
  partyName?: string;
  machineName?: string;
  fromDate?: Date;
  toDate?: Date;
}

interface FollowupFilterDialogProps {
  isVisible: boolean;
  onClose: () => void;
  onApplyFilter: (filters: FollowupFilterOptions) => void;
  onClearFilter: () => void;
  currentFilters: FollowupFilterOptions;
  title?: string;
}



const SimpleDropdown = ({ 
  options, 
  placeholder, 
  value, 
  onChange 
}: {
  options: { value: string; label: string }[];
  placeholder: string;
  value?: string;
  onChange: (value: string) => void;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectedOption = options.find(opt => opt.value === value);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full h-12 border border-gray-300 rounded-lg px-4 bg-gray-50 flex items-center justify-between text-left"
      >
        <span className={selectedOption ? "text-black" : "text-gray-600"}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown size={16} color="#666666" />
      </button>
      
      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-20 max-h-48 overflow-y-auto">
            {options.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
                className="w-full px-4 py-3 text-left hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
              >
                {option.label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

const FollowupFilterDialog: React.FC<FollowupFilterDialogProps> = ({
  isVisible,
  onClose,
  onApplyFilter,
  onClearFilter,
  currentFilters,
  title = "Filter Followups",
}) => {
  const [filters, setFilters] = useState<FollowupFilterOptions>(currentFilters);
  const associatedUsers = useLeadFilters();

  // Generate dropdown options from users
  const associatedUsersOptions = (associatedUsers.data as LeadFilterData[])?.map((user) => ({
    value: user.UserCode,
    label: user.UserIdentification,
  })) || [];

  useEffect(() => {
    setFilters(currentFilters);
  }, [currentFilters]);

  const handleApplyFilter = () => {
    onApplyFilter(filters);
    onClose();
  };

  const handleClearFilter = () => {
    const emptyFilters: FollowupFilterOptions = {};
    setFilters(emptyFilters);
    onClearFilter();
    onClose();
  };

  const hasActiveFilters = () => {
    return Object.values(filters).some(value => 
      value !== undefined && 
      value !== null && 
      value !== "" && 
      (typeof value !== 'number' || !isNaN(value))
    );
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 p-4 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50" 
        onClick={onClose}
      />
      <div className="bg-white rounded-lg w-full max-w-md max-h-[90vh] flex flex-col shadow-2xl border border-gray-200 relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-xl font-bold">{title}</h2>
          <button onClick={onClose}>
            <X size={24} color="black" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {associatedUsers.isLoading ? (
            <div className="flex-1 flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              <span className="text-gray-500 mt-2 ml-2">Loading filter options...</span>
            </div>
          ) : associatedUsers.error ? (
            <div className="flex-1 flex justify-center items-center py-8">
              <span className="text-red-500 text-center">
                Error loading filters: {(associatedUsers.error as any)?.errorMessage || "Failed to load filter options"}
              </span>
            </div>
          ) : (
            <>
              {/* Person Filter */}
              <div className="mb-4">
                <label className="block text-lg mb-2 text-gray-700">
                  Person
                </label>
                <SimpleDropdown
                  options={associatedUsersOptions}
                  placeholder="Select Person"
                  value={filters.person?.UserCode}
                  onChange={(value) => {
                    const selectedUser = (associatedUsers.data as LeadFilterData[])?.find(user => user.UserCode === value);
                    if (selectedUser) {
                      setFilters((prev) => ({ 
                        ...prev, 
                        person: { 
                          UserName: selectedUser.UserIdentification, 
                          UserCode: selectedUser.UserCode 
                        } 
                      }));
                    }
                  }}
                />
              </div>

              {/* Party Name Filter */}
              <div className="mb-4">
                <label className="block text-lg mb-2 text-gray-700">Party Name</label>
                <Input
                  type="text"
                  className="h-12 bg-gray-50"
                  placeholder="Enter party name..."
                  value={filters.partyName || ""}
                  onChange={(e) => setFilters(prev => ({ ...prev, partyName: e.target.value }))}
                />
              </div>

              {/* Machine Name Filter */}
              <div className="mb-4">
                <label className="block text-lg mb-2 text-gray-700">Machine Name</label>
                <Input
                  type="text"
                  className="h-12 bg-gray-50"
                  placeholder="Enter machine name..."
                  value={filters.machineName || ""}
                  onChange={(e) => setFilters(prev => ({ ...prev, machineName: e.target.value }))}
                />
              </div>

              {/* Date Range Filter */}
              <div className="mb-4">
                <label className="block text-lg mb-2 text-gray-700">Document Date Range</label>
                
                {/* From Date */}
                <div className="mb-2">
                  <Input
                    type="date"
                    className="h-12 bg-gray-50"
                    value={filters.fromDate ? filters.fromDate.toISOString().split('T')[0] : ""}
                    onChange={(e) => {
                      const date = e.target.value ? new Date(e.target.value) : undefined;
                      setFilters(prev => ({ ...prev, fromDate: date }));
                    }}
                  />
                </div>

                {/* To Date */}
                <div>
                  <Input
                    type="date"
                    className="h-12 bg-gray-50"
                    value={filters.toDate ? filters.toDate.toISOString().split('T')[0] : ""}
                    onChange={(e) => {
                      const date = e.target.value ? new Date(e.target.value) : undefined;
                      setFilters(prev => ({ ...prev, toDate: date }));
                    }}
                  />
                </div>
              </div>
            </>
          )}
        </div>

        {/* Action Buttons */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex gap-3">
            <Button
              onClick={handleClearFilter}
              disabled={!hasActiveFilters()}
              variant="outline"
              className="flex-1 h-12"
            >
              Clear All
            </Button>

            <Button
              onClick={handleApplyFilter}
              className="flex-1 h-12"
            >
              Apply Filter
            </Button>
          </div>

          {/* Active filters count */}
          {hasActiveFilters() && (
            <p className="text-center text-sm text-gray-500 mt-2">
              {Object.values(filters).filter(v => 
                v !== undefined && 
                v !== null && 
                v !== "" && 
                (typeof v !== 'number' || !isNaN(v))
              ).length} filter(s) active
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

// Main filter component that shows the filter button and active filters
interface FollowupFiltersProps {
  currentFilters: FollowupFilterOptions;
  onApplyFilter: (filters: FollowupFilterOptions) => void;
  onClearFilter: () => void;
}

export const FollowupFilters: React.FC<FollowupFiltersProps> = ({
  currentFilters,
  onApplyFilter,
  onClearFilter,
}) => {
  const [isDialogVisible, setIsDialogVisible] = useState(false);

  const hasActiveFilters = () => {
    return Object.values(currentFilters).some(value => 
      value !== undefined && 
      value !== null && 
      value !== "" && 
      (typeof value !== 'number' || !isNaN(value))
    );
  };

  const getActiveFiltersCount = () => {
    return Object.values(currentFilters).filter(v => 
      v !== undefined && 
      v !== null && 
      v !== "" && 
      (typeof v !== 'number' || !isNaN(v))
    ).length;
  };

  const getFilterSummary = () => {
    const summary: string[] = [];
    
    if (currentFilters.person) {
      summary.push(`Person: ${currentFilters.person.UserName}`);
    }
    if (currentFilters.partyName) {
      summary.push(`Party: ${currentFilters.partyName}`);
    }
    if (currentFilters.machineName) {
      summary.push(`Machine: ${currentFilters.machineName}`);
    }
    if (currentFilters.fromDate) {
      summary.push(`From: ${currentFilters.fromDate.toLocaleDateString()}`);
    }
    if (currentFilters.toDate) {
      summary.push(`To: ${currentFilters.toDate.toLocaleDateString()}`);
    }
    
    return summary;
  };

  return (
    <div className="space-y-4">
      {/* Filter Button */}
      <div className="flex items-center gap-3">
        <Button
          onClick={() => setIsDialogVisible(true)}
          variant="outline"
          className="flex items-center gap-2"
        >
          <Filter className="h-4 w-4" />
          Filters
          {hasActiveFilters() && (
            <Badge variant="secondary" className="ml-1">
              {getActiveFiltersCount()}
            </Badge>
          )}
        </Button>

        {hasActiveFilters() && (
          <Button
            onClick={onClearFilter}
            variant="ghost"
            size="sm"
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            Clear All
          </Button>
        )}
      </div>

      {/* Active Filters Display */}
      {hasActiveFilters() && (
        <div className="flex flex-wrap gap-2">
          {getFilterSummary().map((summary, index) => (
            <Badge key={index} variant="outline" className="text-sm">
              {summary}
            </Badge>
          ))}
        </div>
      )}

      {/* Filter Dialog */}
      <FollowupFilterDialog
        isVisible={isDialogVisible}
        onClose={() => setIsDialogVisible(false)}
        onApplyFilter={onApplyFilter}
        onClearFilter={onClearFilter}
        currentFilters={currentFilters}
      />
    </div>
  );
};
