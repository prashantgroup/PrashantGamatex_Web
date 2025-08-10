"use client";

import React from "react";
import { useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useInsertQuotationFollowup } from "@/hooks/useFollowup";
import { SalesFollowupInsert } from "@/types/followup";

const schema = z.object({
  FollowupDetails: z.string().min(1, "Details required"),
  ModeOfContact: z.enum(["Visit", "Phone", "Email"]),
  FollowupStatus: z.enum(["Not Now", "Fix in New Visit", "Close"]),
  FollowupDateTime: z.date(),
  NextVisitDateTime: z.date(),
  VisitTo: z.string().min(1, "Communication with required"),
  VisitorPerson: z.string().min(1, "Communication by required"),
});

type FormValues = z.infer<typeof schema>;

export default function AddFollowupPage() {
  const params = useParams<{ id: string }>();
  const id = Number(params.id);
  const insert = useInsertQuotationFollowup();

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      FollowupDetails: "",
      ModeOfContact: "Phone",
      FollowupStatus: "Not Now",
      FollowupDateTime: new Date(),
      NextVisitDateTime: new Date(),
      VisitTo: "",
      VisitorPerson: "",
    },
  });

  const onSubmit = async (values: FormValues) => {
    const payload: SalesFollowupInsert = {
      DocumentDate: new Date(),
      SalesInquiryId: 0,
      SalesInquiryDetailsId: 0,
      SalesQuotationId: id,
      SalesQuotationDetailsId: 0,
      FollowupDateTime: values.FollowupDateTime,
      FollowupEndDateTime: values.FollowupDateTime,
      VisitTo: values.VisitTo,
      FollowupDetails: values.FollowupDetails,
      ModeOfContact: values.ModeOfContact,
      documentSent: { offer: false, layout: false, pi: false },
      FollowupStatus: values.FollowupStatus,
      VisitorPerson: values.VisitorPerson,
      NextVisitDateTime: values.NextVisitDateTime,
      NextVisitPerson: "",
      NextVisitorPerson: "",
      AttentionDetails: "",
      OrderGoesParty: "",
      CloseReason: "",
      DetailDescription: "",
      Rating: "",
    };
    await insert.mutateAsync(payload);
  };

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Add Follow-up</h1>
        <p className="text-sm text-muted-foreground">Quotation #{params.id}</p>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
        <div className="grid gap-2">
          <Label>Communication With</Label>
          <Input placeholder="Person" {...register("VisitTo")} />
          {errors.VisitTo && <p className="text-destructive text-sm">{errors.VisitTo.message}</p>}
        </div>
        <div className="grid gap-2">
          <Label>Communication By</Label>
          <Input placeholder="Your name" {...register("VisitorPerson")} />
          {errors.VisitorPerson && <p className="text-destructive text-sm">{errors.VisitorPerson.message}</p>}
        </div>
        <div className="grid gap-2">
          <Label>Details</Label>
          <Input placeholder="Details" {...register("FollowupDetails")} />
          {errors.FollowupDetails && <p className="text-destructive text-sm">{errors.FollowupDetails.message}</p>}
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="grid gap-2">
            <Label>Mode</Label>
            <select className="border rounded h-10 px-3" {...register("ModeOfContact")}>
              <option value="Visit">Visit</option>
              <option value="Phone">Phone</option>
              <option value="Email">Email</option>
            </select>
          </div>
          <div className="grid gap-2">
            <Label>Status</Label>
            <select className="border rounded h-10 px-3" {...register("FollowupStatus")}>
              <option value="Not Now">Not Now</option>
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
        <Button type="submit" disabled={isSubmitting || insert.isPending}>
          {insert.isPending ? "Saving..." : "Save"}
        </Button>
      </form>
    </div>
  );
}