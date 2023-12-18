import * as ts from "typescript";
import * as E from "../Errors";
import {
  DiagnosticsResult,
  err,
  ok,
  tsErr,
  tsRelated,
} from "../utils/DiagnosticError";

/**
 * Prevent using merged interfaces as GraphQL interfaces.
 * https://www.typescriptlang.org/docs/handbook/declaration-merging.html#merging-interfaces
 */
export function validateMergedInterfaces(
  checker: ts.TypeChecker,
  interfaces: ts.InterfaceDeclaration[],
): DiagnosticsResult<void> {
  const errors: ts.Diagnostic[] = [];

  for (const node of interfaces) {
    const symbol = checker.getSymbolAtLocation(node.name);
    if (
      symbol != null &&
      symbol.declarations != null &&
      symbol.declarations.length > 1
    ) {
      const otherLocations = symbol.declarations
        .filter(
          (d) =>
            d !== node &&
            (ts.isInterfaceDeclaration(d) || ts.isClassDeclaration(d)),
        )
        .map((d) => {
          const locNode = ts.getNameOfDeclaration(d) ?? d;
          return tsRelated(locNode, "Other declaration");
        });

      if (otherLocations.length > 0) {
        errors.push(tsErr(node.name, E.mergedInterfaces(), otherLocations));
      }
    }
  }

  if (errors.length > 0) {
    return err(errors);
  }
  return ok(undefined);
}
