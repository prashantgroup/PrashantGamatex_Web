"use client";

import React, { useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { useLeads, useLeadUpdates, useInsertLeadUpdate } from "@/hooks/useLeads";
import { LeadData } from "@/types/lead";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { LeadUpdate } from "@/types/lead";

const schema = z.object({
  FollowupDetails: z.string().min(1, "Details are required"),
  ModeOfContact: z.enum(["Visit", "Phone", "Email", "WhatsApp"]),
  FollowupStatus: z.enum(["Fix in New Visit", "Close"]),
  NextVisitDateTime: z.date(),
  FollowupDateTime: z.date(),
  CloseReason: z.string().min(1, "Close Reason is required"),
  DetailDescription: z.string().min(1, "Detail Description is required"),
  VisitTo: z.string().min(1, "Communication with is required"),
  VisitorPerson: z.string().min(1, "Visitor is required"),
});

type FormValues = z.infer<typeof schema>;

export default function AddNewLeadFollowup() {
  const params = useParams<{ leadId: string }>();
  const leadId = Number(params.leadId);
  const { data: leads } = useLeads();
  const lead = useMemo<LeadData | undefined>(
    () => leads?.find((l) => l.ReferenceTransaction_2361Id === leadId),
    [leads, leadId]
  );
  const updates = useLeadUpdates(leadId);
  const insertUpdate = useInsertLeadUpdate();
  const [tab, setTab] = useState<"add" | "timeline">("add");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      FollowupDetails: "",
      ModeOfContact: "Phone",
      FollowupStatus: "Fix in New Visit",
      NextVisitDateTime: new Date(),
      FollowupDateTime: new Date(),
      CloseReason: "",
      DetailDescription: "",
      VisitTo: "",
      VisitorPerson: lead?.UserName || "",
    },
  });

  const onSubmit = async (values: FormValues) => {
    const payload: LeadUpdate = {
      ReferenceTransaction_2361FollowupId: 0, // This will be set by the backend
      ReferenceTransaction_2361Id: leadId,
      ModeofContact: values.ModeOfContact,
      EntryDateTime: new Date(),
      ...values,
    };
    await insertUpdate.mutateAsync(payload);
  };

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Lead Follow-ups</h1>
          <p className="text-sm text-muted-foreground">Lead #{params.leadId}</p>
        </div>
        <div className="flex gap-2">
          <Button variant={tab === "add" ? "default" : "secondary"} onClick={() => setTab("add")}>
            Add Follow-up
          </Button>
          <Button variant={tab === "timeline" ? "default" : "secondary"} onClick={() => setTab("timeline")}>
            Timeline
          </Button>
        </div>
      </div>

      {tab === "add" && (
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
          <div className="grid gap-2">
            <Label>Communication With</Label>
            <Input placeholder="Person" {...register("VisitTo")} />
            {errors.VisitTo && <p className="text-destructive text-sm">{errors.VisitTo.message}</p>}
          </div>
          <div className="grid gap-2">
            <Label>Follow Up Details</Label>
            <Input placeholder="Details" {...register("FollowupDetails")} />
            {errors.FollowupDetails && (
              <p className="text-destructive text-sm">{errors.FollowupDetails.message}</p>
            )}
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label>Mode Of Contact</Label>
              <select className="border rounded h-10 px-3" {...register("ModeOfContact")}>
                <option value="Visit">Visit</option>
                <option value="Phone">Phone</option>
                <option value="Email">Email</option>
                <option value="WhatsApp">WhatsApp</option>
              </select>
            </div>
            <div className="grid gap-2">
              <Label>Status</Label>
              <select className="border rounded h-10 px-3" {...register("FollowupStatus")}>
                <option value="Fix in New Visit">Fix in New Visit</option>
                <option value="Close">Close</option>
              </select>
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label>Followup Date/Time</Label>
              <Input type="datetime-local" {...register("FollowupDateTime", { valueAsDate: true })} />
            </div>
            <div className="grid gap-2">
              <Label>Next Visit Date/Time</Label>
              <Input type="datetime-local" {...register("NextVisitDateTime", { valueAsDate: true })} />
            </div>
          </div>
          <div className="grid gap-2">
            <Label>Detail Description</Label>
            <Input placeholder="Description" {...register("DetailDescription")} />
          </div>
          <div className="grid gap-2">
            <Label>Close Reason</Label>
            <Input placeholder="Reason" {...register("CloseReason")} />
          </div>
          <div className="grid gap-2">
            <Label>Visitor</Label>
            <Input placeholder="Visitor person" {...register("VisitorPerson")} />
            {errors.VisitorPerson && (
              <p className="text-destructive text-sm">{errors.VisitorPerson.message}</p>
            )}
          </div>

          <Button type="submit" disabled={isSubmitting || insertUpdate.isPending}>
            {insertUpdate.isPending ? "Saving..." : "Save Follow-up"}
          </Button>
        </form>
      )}

      {tab === "timeline" && (
        <div className="grid gap-4">
          {updates.isLoading && <div>Loading timeline...</div>}
          {Array.isArray(updates.data) && updates.data.length > 0 ? (
            updates.data.map((u: LeadUpdate, idx: number) => (
              <Card key={idx} className="p-4">
                <div className="flex items-center justify-between">
                  <div className="font-semibold">{u.ModeofContact}</div>
                  <div className="text-xs text-muted-foreground">
                    {new Date(u.FollowupDateTime).toLocaleString("en-GB")}
                  </div>
                </div>
                <div className="text-sm mt-1">{u.FollowupDetails}</div>
                {u.FollowupStatus && (
                  <div className="text-xs text-muted-foreground mt-2">Status: {u.FollowupStatus}</div>
                )}
              </Card>
            ))
          ) : (
            !updates.isLoading && <div className="text-sm text-muted-foreground">No follow-ups yet.</div>
          )}
        </div>
      )}
    </div>
  );
}