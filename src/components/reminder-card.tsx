import React from "react";
import { Calendar, CheckCircle, ChevronRight, Phone } from "lucide-react";
import { useRouter } from "next/navigation";
import { LeadReminderData } from "@/types/lead";
import { QuotationReminderData } from "@/types/followup";

interface ReminderCardProps {
  leadReminders: LeadReminderData[];
  followupReminders: QuotationReminderData[];
}

const ReminderCard = ({
  leadReminders,
  followupReminders,
}: ReminderCardProps) => {
  const router = useRouter();

  // Helper function to ensure we have a valid Date object
  const ensureDate = (date: Date | string) => {
    return date instanceof Date ? date : new Date(date);
  };

  // Helper function to get ISO string safely
  const getISOString = (date: Date | string) => {
    const dateObj = ensureDate(date);
    return isNaN(dateObj.getTime())
      ? new Date().toISOString()
      : dateObj.toISOString();
  };

  const formatDate = (date: Date | string) => {
    const dateObj = ensureDate(date);
    if (isNaN(dateObj.getTime())) return "Invalid Date";

    return dateObj.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatTime = (date: Date | string) => {
    const dateObj = ensureDate(date);
    if (isNaN(dateObj.getTime())) return "Invalid Time";

    return dateObj.toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getDaysUntil = (date: Date | string) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const reminderDate = ensureDate(date);

    if (isNaN(reminderDate.getTime())) return "Invalid Date";

    reminderDate.setHours(0, 0, 0, 0);
    const diffTime = reminderDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Tomorrow";
    if (diffDays < 0) return `${Math.abs(diffDays)} days ago`;
    return `${diffDays} days`;
  };

  const getPriorityColor = (date: Date | string) => {
    const today = new Date();
    const reminderDate = ensureDate(date);

    if (isNaN(reminderDate.getTime()))
      return "text-gray-700 bg-gray-100 border-gray-200";

    const diffTime = reminderDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return "text-red-700 bg-red-100 border-red-200";
    if (diffDays === 0)
      return "text-orange-700 bg-orange-100 border-orange-200";
    if (diffDays <= 2) return "text-yellow-700 bg-yellow-100 border-yellow-200";
    return "text-green-700 bg-green-100 border-green-200";
  };

  const getPriorityLabel = (date: Date | string) => {
    const today = new Date();
    const reminderDate = ensureDate(date);

    if (isNaN(reminderDate.getTime())) return "Invalid date";

    const diffTime = reminderDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return "Overdue";
    if (diffDays === 0) return "Due today";
    if (diffDays <= 2) return "Due soon";
    return "Upcoming";
  };

  const handleLeadClick = (leadId: string) => {
    // Uncomment when ready to implement navigation
    // router.push({
    //   pathname: "/(marketing)/m_lead/m_leadList/leadFollowupTimeline",
    //   params: { leadId: leadId },
    // });
  };

  const handleFollowupClick = () => {
    // Uncomment when ready to implement navigation
    // router.push({
    //   pathname: "/(marketing)/m_followup/m_followUpList",
    // });
  };

  return (
    <div className="w-full" role="main" aria-label="Reminders dashboard">
      {/* Lead Reminders Section */}
      {leadReminders.length > 0 && (
        <section className="mb-6" aria-labelledby="lead-reminders-heading">
          <div className="flex items-center mb-4">
            <div
              className="w-3 h-3 bg-blue-500 rounded-full mr-2"
              aria-hidden="true"
            />
            <h2
              id="lead-reminders-heading"
              className="text-lg font-bold text-gray-800"
            >
              Lead Reminders
            </h2>
            <span
              className="text-sm text-gray-500 ml-2"
              aria-label={`${leadReminders.length} lead reminders`}
            >
              ({leadReminders.length})
            </span>
          </div>

          <ul className="space-y-3" role="list">
            {leadReminders.map((reminder, index) => (
              <li
                key={`lead-${reminder.ReferenceTransaction_2361FollowupId}`}
                className="bg-white border-l-4 border-l-blue-500 rounded-r-lg shadow-sm overflow-hidden focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-2"
              >
                <article className="p-4">
                  <header className="flex justify-between items-start mb-3">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-semibold text-gray-800 truncate">
                        {reminder.CompanyName}
                      </h3>
                      <p className="text-xs text-gray-600 mt-1">
                        Visit to: {reminder.VisitTo}
                      </p>
                    </div>
                    <div
                      className={`px-2 py-1 rounded-full border text-xs font-medium ml-3 flex-shrink-0 ${getPriorityColor(
                        reminder.NextVisitDateTime
                      )}`}
                      aria-label={`${getPriorityLabel(
                        reminder.NextVisitDateTime
                      )}: ${getDaysUntil(reminder.NextVisitDateTime)}`}
                    >
                      {getDaysUntil(reminder.NextVisitDateTime)}
                    </div>
                  </header>

                  <div className="flex items-center mb-2 text-xs text-gray-600">
                    <Calendar
                      size={14}
                      className="mr-2 flex-shrink-0"
                      aria-hidden="true"
                    />
                    <time dateTime={getISOString(reminder.NextVisitDateTime)}>
                      {formatDate(reminder.NextVisitDateTime)} at{" "}
                      {formatTime(reminder.NextVisitDateTime)}
                    </time>
                  </div>

                  {reminder.FollowupDetails && (
                    <div className="bg-gray-50 p-3 rounded mt-3">
                      <p className="text-xs text-gray-700">
                        {reminder.FollowupDetails}
                      </p>
                    </div>
                  )}
                </article>

                <footer className="bg-blue-50 px-4 py-3 flex justify-between items-center border-t border-blue-100">
                  <span className="text-xs text-blue-700 font-medium">
                    Status: {reminder.FollowupStatus}
                  </span>
                  <button
                    onClick={() => handleLeadClick(reminder.LeadId?.toString())}
                    className="flex items-center text-xs text-blue-600 font-medium hover:text-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 rounded px-1 py-1 transition-colors"
                    aria-label={`View details for ${reminder.CompanyName} lead reminder`}
                  >
                    View Details
                    <ChevronRight
                      size={14}
                      className="ml-1"
                      aria-hidden="true"
                    />
                  </button>
                </footer>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Followup Reminders Section */}
      {followupReminders.length > 0 && (
        <section className="mb-6" aria-labelledby="followup-reminders-heading">
          <div className="flex items-center mb-4">
            <div
              className="w-3 h-3 bg-green-500 rounded-full mr-2"
              aria-hidden="true"
            />
            <h2
              id="followup-reminders-heading"
              className="text-lg font-bold text-gray-800"
            >
              Followup Reminders
            </h2>
            <span
              className="text-sm text-gray-500 ml-2"
              aria-label={`${followupReminders.length} followup reminders`}
            >
              ({followupReminders.length})
            </span>
          </div>

          <ul className="space-y-3" role="list">
            {followupReminders.map((reminder, index) => (
              <li
                key={`followup-${reminder.ReferenceTransaction_2361FollowupId}`}
                className="bg-white border-l-4 border-l-green-500 rounded-r-lg shadow-sm overflow-hidden focus-within:ring-2 focus-within:ring-green-500 focus-within:ring-offset-2"
              >
                <article className="p-4">
                  <header className="flex justify-between items-start mb-3">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-semibold text-gray-800 truncate">
                        {reminder.CompanyName}
                      </h3>
                      <p className="text-xs text-gray-600 mt-1">
                        Visit to: {reminder.VisitTo}
                      </p>
                    </div>
                    <div
                      className={`px-2 py-1 rounded-full border text-xs font-medium ml-3 flex-shrink-0 ${getPriorityColor(
                        reminder.NextVisitDateTime
                      )}`}
                      aria-label={`${getPriorityLabel(
                        reminder.NextVisitDateTime
                      )}: ${getDaysUntil(reminder.NextVisitDateTime)}`}
                    >
                      {getDaysUntil(reminder.NextVisitDateTime)}
                    </div>
                  </header>

                  <div className="flex items-center mb-2 text-xs text-gray-600">
                    <Calendar
                      size={14}
                      className="mr-2 flex-shrink-0"
                      aria-hidden="true"
                    />
                    <time dateTime={getISOString(reminder.NextVisitDateTime)}>
                      {formatDate(reminder.NextVisitDateTime)} at{" "}
                      {formatTime(reminder.NextVisitDateTime)}
                    </time>
                  </div>

                  <div className="flex items-center mb-2 text-xs text-gray-600">
                    <Phone
                      size={14}
                      className="mr-2 flex-shrink-0"
                      aria-hidden="true"
                    />
                    <span>{reminder.ModeofContact}</span>
                  </div>

                  {reminder.FollowupDetails && (
                    <div className="bg-gray-50 p-3 rounded mt-3">
                      <p className="text-xs text-gray-700">
                        {reminder.FollowupDetails}
                      </p>
                    </div>
                  )}
                </article>

                <footer className="bg-green-50 px-4 py-3 flex justify-between items-center border-t border-green-100">
                  <span className="text-xs text-green-700 font-medium">
                    Status: {reminder.FollowupStatus}
                  </span>
                  <button
                    onClick={handleFollowupClick}
                    className="flex items-center text-xs text-green-600 font-medium hover:text-green-800 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-1 rounded px-1 py-1 transition-colors"
                    aria-label={`View details for ${reminder.CompanyName} followup reminder`}
                  >
                    View Details
                    <ChevronRight
                      size={14}
                      className="ml-1"
                      aria-hidden="true"
                    />
                  </button>
                </footer>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Empty State */}
      {leadReminders.length === 0 && followupReminders.length === 0 && (
        <div
          className="bg-gray-50 rounded-lg p-8 text-center"
          role="status"
          aria-live="polite"
        >
          <CheckCircle
            size={48}
            className="mx-auto text-gray-400 mb-3"
            aria-hidden="true"
          />
          <h3 className="text-gray-500 font-medium mb-1">
            No upcoming reminders
          </h3>
          <p className="text-gray-400 text-sm">You're all caught up!</p>
        </div>
      )}
    </div>
  );
};

export default ReminderCard;
