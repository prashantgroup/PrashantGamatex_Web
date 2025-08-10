"use client";

import React, { useEffect, useMemo } from "react";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem } from "@/components/ui/select";
import { useParams, useRouter } from "next/navigation";
import { useConstants } from "@/hooks/useConstants";
import { useLeads, useUpdateLead } from "@/hooks/useLeads";
import { LeadData, LeadUpdateData } from "@/types/lead";

const schema = z.object({
  currency: z.string().min(1, "Currency is required"),
  customerCompanyName: z.string().min(1, "Customer Company Name is required"),
  contactPerson: z.string().min(1, "Contact Person is required"),
  designation: z.string().min(1, "Designation is required"),
  mobileNo: z.string().min(10, "Mobile must be at least 10 digits"),
  address: z.string().min(1, "Address is required"),
  emailId: z.string().email("Invalid email"),
  product: z.string().min(1, "Product is required"),
  leadSource: z.string().min(1, "Lead Source is required"),
  competition: z.string().min(1, "Competition is required"),
  timeFrame: z.string().min(1, "Time Frame is required"),
  leadRemindDate: z.date(),
  customerApplication: z.string().min(1, "Customer Application is required"),
  customerExistingMachine: z.string().min(1, "Customer Existing Machine is required"),
  leadNote: z.string().min(1, "Lead Note is required"),
});

type FormValues = z.infer<typeof schema>;

export default function LeadEditPage() {
  const params = useParams<{ leadId: string }>();
  const router = useRouter();
  const id = Number(params.leadId);
  const { data: leads } = useLeads();
  const constants = useConstants();
  const updateLead = useUpdateLead();

  const current = useMemo<LeadData | undefined>(
    () => leads?.find((l) => l.ReferenceTransaction_2361Id === id),
    [leads, id]
  );

  const {
    control,
    register,
    setValue,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  useEffect(() => {
    if (!current) return;
    setValue("currency", current.CurrencyName || "");
    setValue("customerCompanyName", current.UDF_CompanyName_2361 || "");
    setValue("contactPerson", current.UDF_ContactPerson_2361 || "");
    setValue("designation", current.UDF_Designation_2361 || "");
    setValue("mobileNo", current.UDF_MobileNo_2361 || "");
    setValue("address", current.UDF_CustomerAdd_2361 || "");
    setValue("emailId", current.UDF_EmailId_2361 || "");
    setValue("product", current.UDF_Product_2361 || "");
    setValue("leadSource", current.UDF_LeadSource_2361 || "");
    setValue("competition", current.UDF_CompetitionWith_2361 || "");
    setValue("timeFrame", current.UDF_TimeFrame_2361 || "");
    setValue(
      "leadRemindDate",
      new Date(current.UDF_LeadRemindDate_2361 || new Date())
    );
    setValue(
      "customerApplication",
      current.UDF_CustomerApplication_2361 || ""
    );
    setValue(
      "customerExistingMachine",
      current.UDF_CustomerExistingMachine_2361 || ""
    );
    setValue("leadNote", current.UDF_LeadNotes_2361 || "");
  }, [current, setValue]);

  const onSubmit = async (values: FormValues) => {
    const payload: LeadUpdateData & { RecordId: number; category: string } = {
      ...values,
      RecordId: current?.ReferenceTransaction_2361Id || 0,
      category: current?.CategoryName || "",
    };
    await updateLead.mutateAsync(payload);
  };

  return (
    <div className="max-w-3xl mx-auto p-4 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Edit Lead</h1>
        <p className="text-sm text-muted-foreground">
          Update details for lead #{params.leadId}
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
        <div className="grid gap-2">
          <Label>Currency</Label>
          <Controller
            name="currency"
            control={control}
            render={({ field }) => (
              <Select {...field}>
                <SelectContent>
                  {(constants.data?.CurrencyOutput.split(",") || []).map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {errors.currency && (
            <p className="text-destructive text-sm">{errors.currency.message}</p>
          )}
        </div>

        <div className="grid gap-2">
          <Label>Customer Company</Label>
          <Input placeholder="Company name" {...register("customerCompanyName")} />
          {errors.customerCompanyName && (
            <p className="text-destructive text-sm">{errors.customerCompanyName.message}</p>
          )}
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="grid gap-2">
            <Label>Contact Person</Label>
            <Input placeholder="Contact person" {...register("contactPerson")} />
            {errors.contactPerson && (
              <p className="text-destructive text-sm">{errors.contactPerson.message}</p>
            )}
          </div>
          <div className="grid gap-2">
            <Label>Designation</Label>
            <Input placeholder="Designation" {...register("designation")} />
            {errors.designation && (
              <p className="text-destructive text-sm">{errors.designation.message}</p>
            )}
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="grid gap-2">
            <Label>Mobile</Label>
            <Input placeholder="Phone" {...register("mobileNo")} />
            {errors.mobileNo && (
              <p className="text-destructive text-sm">{errors.mobileNo.message}</p>
            )}
          </div>
          <div className="grid gap-2">
            <Label>Email</Label>
            <Input placeholder="Email" {...register("emailId")} />
            {errors.emailId && (
              <p className="text-destructive text-sm">{errors.emailId.message}</p>
            )}
          </div>
        </div>

        <div className="grid gap-2">
          <Label>Address</Label>
          <Input placeholder="Address" {...register("address")} />
          {errors.address && (
            <p className="text-destructive text-sm">{errors.address.message}</p>
          )}
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="grid gap-2">
            <Label>Product</Label>
            <Controller
              name="product"
              control={control}
              render={({ field }) => (
                <Select {...field}>
                  <SelectContent>
                    {(constants.data?.ProductOutput.split(",") || []).map((p) => (
                      <SelectItem key={p} value={p}>
                        {p}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.product && (
              <p className="text-destructive text-sm">{errors.product.message}</p>
            )}
          </div>
          <div className="grid gap-2">
            <Label>Lead Source</Label>
            <Controller
              name="leadSource"
              control={control}
              render={({ field }) => (
                <Select {...field}>
                  <SelectContent>
                    {(constants.data?.LeadSourceOutput.split(",") || []).map((s) => (
                      <SelectItem key={s} value={s}>
                        {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.leadSource && (
              <p className="text-destructive text-sm">{errors.leadSource.message}</p>
            )}
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="grid gap-2">
            <Label>Time Frame</Label>
            <Controller
              name="timeFrame"
              control={control}
              render={({ field }) => (
                <Select {...field}>
                  <SelectContent>
                    {(constants.data?.TimeFrameOutput.split(",") || []).map((t) => (
                      <SelectItem key={t} value={t}>
                        {t}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.timeFrame && (
              <p className="text-destructive text-sm">{errors.timeFrame.message}</p>
            )}
          </div>
          <div className="grid gap-2">
            <Label>Application</Label>
            <Controller
              name="customerApplication"
              control={control}
              render={({ field }) => (
                <Select {...field}>
                  <SelectContent>
                    {(constants.data?.ApplicationOutput.split(",") || []).map((a) => (
                      <SelectItem key={a} value={a}>
                        {a}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.customerApplication && (
              <p className="text-destructive text-sm">{errors.customerApplication.message}</p>
            )}
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="grid gap-2">
            <Label>Competition</Label>
            <Input placeholder="Competitor" {...register("competition")} />
          </div>
          <div className="grid gap-2">
            <Label>Existing Machine</Label>
            <Input placeholder="Existing machine" {...register("customerExistingMachine")} />
          </div>
        </div>

        <div className="grid gap-2">
          <Label>Lead Note</Label>
          <Input placeholder="Notes" {...register("leadNote")} />
        </div>

        <div className="flex gap-3">
          <Button type="submit" disabled={isSubmitting || updateLead.isPending}>
            {updateLead.isPending ? "Updating..." : "Update"}
          </Button>
          <Button type="button" variant="secondary" onClick={() => router.back()}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}