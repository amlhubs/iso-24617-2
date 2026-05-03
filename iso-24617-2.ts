/**
 * @file @amlhubs/iso-24617-2 — TypeScript implementation of ISO 24617-2:2020
 *
 * Standard: ISO 24617-2:2020 — Language resource management — Semantic
 *           annotation framework — Part 2: Dialogue acts (2nd edition,
 *           2020-12-21; downward-compatible with 2012 1st edition).
 *
 * Authority: ISO/TC 37/SC 4 — Language resource management.
 * Spec URL: https://www.iso.org/standard/76443.html
 * Open preprint: Bunt et al., LREC 2020 —
 *   https://aclanthology.org/2020.lrec-1.69.pdf
 *
 * This module surfaces every metaclass, enumeration, and association declared
 * in ISO 24617-2:2020 as a typed TypeScript interface plus a concrete base
 * class. Every JSDoc header carries:
 *   @standard ISO 24617-2:2020 (2nd ed)
 *   @section §X
 *   @metaclass <Name>
 *   @generalization <ParentMetaclass | none>
 *   @definition "<verbatim spec text>"
 *   @associationEnds <list>
 *   @ownedAttributes <list>
 *   @operations <list>
 *   @constraints <verbatim OCL>
 *
 * The CMOF whitelist (26 metaclasses) is respected at every declaration:
 *   - Concept hierarchies → `Class` + `Generalization`
 *   - Closed taxonomies (the 9 Dimensions) → `Enumeration` + `EnumerationLiteral`
 *   - Typed relations (RhetoricalRelation, FeedbackDependenceRelation)
 *     → `Association` with `Property` member ends
 *   - Well-formedness rules → `Constraint` with `OpaqueExpression` body
 *   - Plug-in mechanism → `PackageMerge`
 */

// ─── Implementation declarations are inserted here by the implementation loop.
// Each implementer wave INSERTS new declarations without rewriting existing
// content or the file header. The 5:1 implementer:auditor cadence governs
// progress; see /metamodel deploy iso-24617-2 for the loop rules.

export {}
