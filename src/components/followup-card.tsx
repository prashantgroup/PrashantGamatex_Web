import React from "react";
import { 
  Package, 
  ChevronRight
} from "lucide-react";
import Link from "next/link";
import { SalesQuotationFollowup } from "@/types/followup";

export function FollowupCard({
  followup,
  className,
}: {
  followup: SalesQuotationFollowup;
  className?: string;
}) {
  return (
    <div className={`w-full flex flex-col justify-between bg-white shadow-md rounded-lg overflow-hidden border ${className}`}>
      <div className="p-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs text-gray-500 font-semibold">
            #{followup.DocumentNo}
          </span>
          <span className="text-xs text-gray-500">
            {new Date(followup.DocumentDate).toLocaleDateString("en-GB")}
          </span>
        </div>
        
        <h3 className="text-lg font-bold text-gray-800 mb-2">
          {followup.PartyName}
        </h3>
        
        <p className="text-md text-gray-700 mb-2">{followup.MachineName}</p>
        
        <div className="flex items-center">
          <Package size={16} color="#4B5563" />
          <span className="text-sm text-gray-600 ml-1">
            Quantity: {followup.Quantity} {followup.Unit}
          </span>
        </div>
      </div>
      
      <div className="bg-gray-100 p-3 flex justify-between items-center">
        <span className="text-sm text-blue-600 font-semibold">
          {followup.UserName || 'N/A'}
        </span>
        <Link 
          href={`/followups/${followup.SalesQuotationId}`}
          className="flex items-center"
        >
          <span className="text-sm text-blue-600 font-semibold">
            Followup Details
          </span>
          <ChevronRight size={20} color="#2563EB" />
        </Link>
      </div>
    </div>
  );
}
