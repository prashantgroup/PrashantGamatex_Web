"use client";

import React from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { getLabelProps } from "@/lib/form-utils";
import { Card } from "@/components/ui/card";
import { useExpenseInsert } from "@/hooks/useExpense";
import { useConstants } from "@/hooks/useConstants";
import { useUserStore } from "@/store/store";
import { AuthGuard } from "@/components/auth-guard";
import { AppSidebar } from "@/components/app-sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Plus, Receipt, Calendar, Building, Package } from "lucide-react";

const itemSchema = z.object({
  type: z.string().min(1, "Type is required"),
  amount: z.string().min(1, "Amount is required"),
  description: z.string().min(1, "Description is required"),
  attachment: z.any().nullable(),
});

const schema = z.object({
  customerCompany: z.string().min(1, "Customer company is required"),
  visitDate: z.date(),
  expenseItems: z.array(itemSchema).min(1, "Add at least one item"),
});

type FormValues = z.infer<typeof schema>;

export default function ExpensesAddPage() {
  return (
    <AuthGuard>
      <ExpensesAddContent />
    </AuthGuard>
  );
}

function ExpensesAddContent() {
  const { user } = useUserStore();
  const constants = useConstants();
  const insert = useExpenseInsert();
  const { register, control, handleSubmit, watch, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      customerCompany: "",
      visitDate: new Date(),
      expenseItems: [{ type: "", amount: "", description: "", attachment: null }],
    },
  });

  const { fields, append, remove } = useFieldArray({ control, name: "expenseItems" });

  const onSubmit = async (values: FormValues) => {
    const formData = new FormData();
    formData.append("customerCompany", values.customerCompany);
    formData.append("visitDate", values.visitDate.toISOString());
    values.expenseItems.forEach((item, i) => {
      formData.append(`expenseItems[${i}][type]`, item.type);
      formData.append(`expenseItems[${i}][amount]`, item.amount);
      formData.append(`expenseItems[${i}][description]`, item.description || "");
      const fileList = (watch(`expenseItems.${i}.attachment`) as FileList | null) || null;
      const file = fileList?.[0];
      if (file) {
        formData.append(`expenseItems[${i}][attachment]`, file);
      }
    });

    await insert.mutateAsync(formData);
  };

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center border-b">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="/dashboard">
                    Dashboard
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbLink href="/expenses">
                    Expenses
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Add Expense</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>

        <div className="flex-1 overflow-auto p-4 md:p-6">
          <div className="mx-auto max-w-3xl space-y-6">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Expense Form</h1>
              <p className="text-sm text-muted-foreground">Add Your Expense Details</p>
            </div>

            <Separator className="bg-gray-500" />

            <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
        <div className="grid gap-2">
          <Label {...getLabelProps(schema, "customerCompany")}>Customer Company</Label>
          <Input placeholder="Company" {...register("customerCompany")} />
          {errors.customerCompany && (
            <p className="text-destructive text-sm">{errors.customerCompany.message}</p>
          )}
        </div>

        <div className="grid gap-2">
          <Label {...getLabelProps(schema, "visitDate")}>Date of Visit</Label>
          <Input type="date" {...register("visitDate", { valueAsDate: true })} />
        </div>

        <div className="grid gap-3">
          <div className="font-semibold">Expense Items</div>
          {fields.map((field, index) => (
            <Card key={field.id} className="p-4 grid gap-3">
              <div className="grid gap-2">
                <Label {...getLabelProps(itemSchema, "type")}>Type</Label>
                <select
                  className="border rounded h-10 px-3"
                  {...register(`expenseItems.${index}.type` as const)}
                >
                  <option value="">Select type</option>
                  {(constants.data?.ExpenseOutput.split(",") || []).map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
                {errors.expenseItems?.[index]?.type && (
                  <p className="text-destructive text-sm">
                    {typeof errors.expenseItems[index]?.type === 'object' && errors.expenseItems[index]?.type?.message}
                  </p>
                )}
              </div>
              <div className="grid gap-2">
                <Label {...getLabelProps(itemSchema, "amount")}>Amount</Label>
                <Input
                  placeholder="0"
                  {...register(`expenseItems.${index}.amount` as const)}
                />
                {errors.expenseItems?.[index]?.amount && (
                  <p className="text-destructive text-sm">
                    {errors.expenseItems[index]?.amount?.message as string}
                  </p>
                )}
              </div>
              <div className="grid gap-2">
                <Label {...getLabelProps(itemSchema, "description")}>Description</Label>
                <Input
                  placeholder="Description"
                  {...register(`expenseItems.${index}.description` as const)}
                />
              </div>
              <div className="grid gap-2">
                <Label>Attachment</Label>
                <Input type="file" accept="image/*" {...register(`expenseItems.${index}.attachment` as const)} />
              </div>
              {fields.length > 1 && (
                <div>
                  <Button type="button" variant="secondary" onClick={() => remove(index)}>
                    Remove Item
                  </Button>
                </div>
              )}
            </Card>
          ))}
          <Button type="button" variant="secondary" onClick={() => append({ type: "", amount: "", description: "", attachment: null })}>
            Add Item
          </Button>
        </div>

        <Button type="submit" disabled={insert.isPending}>
          {insert.isPending ? "Submitting..." : "Submit"}
        </Button>
      </form>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}