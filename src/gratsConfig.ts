import * as ts from "typescript";

export type ConfigOptions = {
  // Should all fields be typed as nullable in accordance with GraphQL best practices?
  // https://graphql.org/learn/best-practices/#nullability
  nullableByDefault?: boolean;

  // Should Grats report TypeScript type errors?
  // Defaults to `false`.
  reportTypeScriptTypeErrors?: boolean;

  // A string to prepend to the generated schema text. Useful for copyright headers or
  // other information to the generated file. Set to `null` to omit the default
  // header.
  schemaHeader?: string | null;

  // Unstable do not use
  EXPERIMENTAL_codegenPath?: string;
};

export type ParsedCommandLineGrats = ts.ParsedCommandLine & {
  raw: {
    grats: ConfigOptions;
  };
};

const DEFAULT_HEADER = `# Schema generated by Grats (https://grats.capt.dev)
# Do not manually edit. Regenerate by running \`npx grats\`.
# @generated`;

// TODO: Make this return diagnostics
export function validateGratsOptions(
  options: ts.ParsedCommandLine,
): ParsedCommandLineGrats {
  const gratsOptions = { ...(options.raw?.grats ?? {}) };
  if (gratsOptions.nullableByDefault === undefined) {
    gratsOptions.nullableByDefault = true;
  } else if (typeof gratsOptions.nullableByDefault !== "boolean") {
    throw new Error(
      "Grats: The Grats config option `nullableByDefault` must be a boolean if provided.",
    );
  }
  if (gratsOptions.reportTypeScriptTypeErrors === undefined) {
    gratsOptions.reportTypeScriptTypeErrors = false;
  } else if (typeof gratsOptions.reportTypeScriptTypeErrors !== "boolean") {
    throw new Error(
      "Grats: The Grats config option `reportTypeScriptTypeErrors` must be a boolean if provided.",
    );
  }
  if (gratsOptions.schemaHeader === undefined) {
    gratsOptions.schemaHeader = DEFAULT_HEADER;
  } else if (
    typeof gratsOptions.schemaHeader !== "string" &&
    gratsOptions.schemaHeader !== null
  ) {
    throw new Error(
      "Grats: The Grats config option `schemaHeader` must be a string or `null` if provided.",
    );
  }

  return {
    ...options,
    raw: { ...options.raw, grats: gratsOptions },
  };
}
