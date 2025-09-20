import { z } from "zod";

/**
 * Determines if a field is required based on a Zod schema
 * @param schema - The Zod schema object
 * @param fieldName - The name of the field to check
 * @returns boolean - true if the field is required, false if optional
 */
export function isFieldRequired<T extends z.ZodTypeAny>(
  schema: z.ZodObject<any>,
  fieldName: string
): boolean {
  try {
    const shape = schema.shape;
    if (!shape || !shape[fieldName]) {
      return false;
    }

    const field = shape[fieldName];
    
    // Check if the field is optional
    if (field instanceof z.ZodOptional) {
      return false;
    }

    // Check if the field is nullable (which usually means optional)
    if (field instanceof z.ZodNullable) {
      return false;
    }

    // Check if it's a union with undefined (another way to make optional)
    if (field instanceof z.ZodUnion) {
      const options = field._def.options;
      if (options.some((option: any) => option instanceof z.ZodUndefined)) {
        return false;
      }
    }

    // If none of the above, consider it required
    return true;
  } catch (error) {
    // If we can't determine, assume it's required for safety
    return true;
  }
}

/**
 * Creates a props object for Label component with automatic required detection
 * @param schema - The Zod schema object
 * @param fieldName - The name of the field
 * @param additionalProps - Any additional props to merge
 * @returns Props object with required field set appropriately
 */
export function getLabelProps<T extends z.ZodTypeAny>(
  schema: z.ZodObject<any>,
  fieldName: string,
  additionalProps: any = {}
) {
  return {
    required: isFieldRequired(schema, fieldName),
    ...additionalProps,
  };
}
