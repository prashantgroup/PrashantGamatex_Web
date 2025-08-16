import React from "react";
import { ExpenseObject } from "@/types/expense";

interface ExpenseCardProps {
  expense: ExpenseObject;
  className?: string;
}

export function ExpenseCard({ expense, className }: ExpenseCardProps) {
  // Format date using built-in Date methods
  const formattedDate = new Date(expense.ExpDate).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  // Format currency using built-in Intl.NumberFormat
  const formattedAmount = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 2,
  }).format(expense.ExpAmount);

  return (
    <div className={`bg-white p-4 rounded-lg shadow-md mb-3 border border-gray-200 ${className}`}>
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-semibold text-gray-800">
          {expense.CustomerName}
        </h3>
        <span className="text-lg font-bold text-green-600">
          {formattedAmount}
        </span>
      </div>
      <div className="flex justify-between items-center">
        <span className="text-sm text-gray-500">{formattedDate}</span>
        <div className="bg-blue-100 px-2 py-1 rounded">
          <span className="text-xs text-blue-800 font-medium">Expense</span>
        </div>
      </div>
    </div>
  );
}
