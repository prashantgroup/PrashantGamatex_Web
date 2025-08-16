import React from "react";
import { Package, Clock, User, ChevronRight } from "lucide-react";
import Link from "next/link";

export function LeadCard({ lead }: { lead: any }) {
  return (
    <div className="w-full bg-white shadow-md rounded-lg overflow-hidden flex flex-col justify-between border cursor-pointer hover:shadow-lg transition-shadow">
      <div className="p-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs text-gray-500 font-semibold">
            #{lead.ReferenceTransaction_2361Id}
          </span>
          <span className="text-xs text-gray-500">
            {new Date(lead.DocumentDate).toLocaleDateString("en-GB")}
          </span>
        </div>

        <h3 className="text-lg font-bold text-gray-800 mb-2">
          {lead.UDF_CompanyName_2361}
        </h3>

        <div className="flex items-center mb-2">
          <Package size={16} color="#4B5563" />
          <span className="text-md text-gray-700 ml-2">
            {lead.UDF_Product_2361}
          </span>
        </div>

        {lead.UDF_LeadSource_2361 && (
          <div className="flex items-center mb-2">
            <Clock size={16} color="#4B5563" />
            <span className="text-sm text-gray-600 ml-2">
              {lead.UDF_LeadSource_2361}
            </span>
          </div>
        )}

        <div className="flex items-center">
          <User size={16} color="#4B5563" />
          <span className="text-sm text-gray-600 ml-2">
            {lead.UDF_ContactPerson_2361}
          </span>
        </div>
      </div>

      <div className="bg-gray-100 p-3 flex justify-between items-center">
        <Link
          href={`/leads/${lead.ReferenceTransaction_2361Id}`}
          className="text-sm text-blue-600 font-semibold"
        >
          View / Edit
        </Link>
        <Link
          href={`/leads/${lead.ReferenceTransaction_2361Id}/edit`}
          className="text-sm text-blue-600 font-semibold flex"
        >
          Lead Updates
          <ChevronRight size={20} color="#2563EB" />
        </Link>
      </div>
    </div>
  );
}
