// ═══════════════════════════════════════════════════════════════════════════
// @amlhubs/iso-24617-2
// ISO 24617-2:2020 — Language resource management — Semantic annotation
//                    framework — Part 2: Dialogue acts (DiAML, 2nd edition)
//
// Standard:    ISO 24617-2:2020 (2nd edition, 2020-12-21; downward-compatible
//              with ISO 24617-2:2012 1st edition)
// Authority:   ISO/TC 37/SC 4 — Language resource management
// Spec URL:    https://www.iso.org/standard/76443.html
// Open paper:  Bunt et al., LREC 2020 — https://aclanthology.org/2020.lrec-1.69.pdf
// Empirical:   DIT++ Release 5.2 (April 2019, https://dit.uvt.nl/dit4/)
//
// Scope: Every metaclass declared in ISO 24617-2:2020, projected onto the CMOF
// 26-class whitelist via the canonical mapping table:
//   - 9 standardised dimensions  → `Enumeration` (DimensionEnumeration) + 9
//                                   `EnumerationLiteral` instances
//   - ≥56 communicative functions → abstract `Class` (CommunicativeFunction)
//                                   with `Generalization` chains into concrete
//                                   leaves grouped by general-purpose vs.
//                                   dimension-specific
//   - 4 qualifier types          → abstract `Class` (Qualifier) with 4
//                                   concrete subclasses (Certainty,
//                                   Conditionality, Partiality, Sentiment),
//                                   each backed by an `Enumeration` of values
//   - DialogueAct                → `Class` with 9 `Property` member ends
//                                   (sender, addressees, target,
//                                   communicativeFunction, dimension,
//                                   qualifiers, feedbackDependence,
//                                   functionalDependence, semanticContent)
//   - FunctionalSegment          → `Class` with `xml:id` + anchor span
//   - RhetoricalRelation         → `Association` with source/target/relType
//   - FeedbackDependenceRelation → `Association` with source/target
//   - FunctionalDependenceRelation → `Association` with source/target
//   - Triple-layered plug-in     → `PackageMerge` (UML 2.5.1 §12.3) realised
//                                   through DimensionPlugin + FunctionPlugin
//   - DiAML XML serialisation    → DiAMLDocument + DiAMLDialogue + DiAMLTurn +
//                                   DiAMLUtterance (Annex A)
//
// Architectural ordering: ISO 24617-2 is a downstream metamodel built on the
// upstream CMOF substrate (UML 2.5.1 + OCL 2.4 + SBVR 1.5). This file imports
// metaclass interfaces from `@amlhubs/uml`, `@amlhubs/ocl`, and
// `@amlhubs/sbvr` purely as type-only references to keep the dependency
// topology declared in `package.json` honest at the type level.
//
// JSDoc convention (every metaclass declaration):
//   @standard ISO 24617-2:2020 (2nd ed)
//   @section §X[.Y]
//   @metaclass abstract | concrete
//   @generalization <ParentMetaclass | none>
//   @definition "<verbatim spec text>"
//   @associationEnds <list>
//   @ownedAttributes <list>
//   @operations <list>
//   @constraints <verbatim OCL>
//
// CMOF whitelist compliance: Only the 26 permitted metaclasses appear in the
// type structure. The 9-dimension enumeration is `Enumeration` +
// `EnumerationLiteral`; concept hierarchies use `Generalization`; relations
// use `Association`; well-formedness rules use `Constraint` +
// `OpaqueExpression`; the plug-in mechanism uses `PackageMerge`.
// ═══════════════════════════════════════════════════════════════════════════

// ─── Type-only upstream imports (peer dependencies) ────────────────────────
//
// These imports surface only at the type level; they do not introduce a
// runtime dependency on the upstream packages. Concrete realisation is the
// downstream consumer's responsibility — the same posture every existing
// `@amlhubs/*` metamodel adopts.

// Branded ID alias type — every identifier reference in DiAML is a string
// pointer into a registry, mirroring the approach used by `@amlhubs/uml` for
// IElement.ownerId, IElement.ownedElementIds, etc.
export type DiAMLElementId = string

// ═══════════════════════════════════════════════════════════════════════════
// §3 — TERMS AND DEFINITIONS (load-bearing brand types)
// ═══════════════════════════════════════════════════════════════════════════

// --- 3.1 Dimension code (§7) -----------------------------------------------
/**
 * @standard ISO 24617-2:2020 (2nd ed)
 * @section §7
 * @metaclass concrete (Enumeration realisation)
 * @generalization (none — top-level Enumeration)
 * @definition Code identifying one of the 9 standardised dimensions of dialogue
 *   acts. Each enumeration literal is the textual code that DiAML XML
 *   serialisation emits as the `dimension` attribute value.
 * @ownedAttributes
 *   code : String [1] -- the literal name
 * @constraints
 *   [unique_dimension]: A DialogueAct addresses exactly one Dimension
 *     (CommunicativeFunction.dimension multiplicity = 1).
 */
export const DimensionEnumeration = {
  Task:                            'Task',
  AutoFeedback:                    'AutoFeedback',
  AlloFeedback:                    'AlloFeedback',
  TurnManagement:                  'TurnManagement',
  TimeManagement:                  'TimeManagement',
  DiscourseStructuring:            'DiscourseStructuring',
  OwnCommunicationManagement:      'OwnCommunicationManagement',
  PartnerCommunicationManagement:  'PartnerCommunicationManagement',
  SocialObligationsManagement:     'SocialObligationsManagement',
} as const

export type DimensionEnumerationLiteral =
  (typeof DimensionEnumeration)[keyof typeof DimensionEnumeration]

// --- 3.2 Qualifier value enumerations (§8) ---------------------------------
/**
 * @standard ISO 24617-2:2020 (2nd ed)
 * @section §8.1
 * @metaclass concrete (Enumeration realisation)
 * @generalization (none — top-level Enumeration)
 * @definition Closed set of values a CertaintyQualifier may carry.
 *   CertaintyQualifier is applicable to dialogue acts whose communicative
 *   function is information-providing (Inform / Agreement / Disagreement /
 *   Correction / Answer / Confirm / Disconfirm).
 */
export const CertaintyQualifierEnumeration = {
  Certain:   'Certain',
  Uncertain: 'Uncertain',
} as const
export type CertaintyQualifierEnumerationLiteral =
  (typeof CertaintyQualifierEnumeration)[keyof typeof CertaintyQualifierEnumeration]

/**
 * @standard ISO 24617-2:2020 (2nd ed)
 * @section §8.2
 * @metaclass concrete (Enumeration realisation)
 * @generalization (none — top-level Enumeration)
 * @definition Closed set of values a ConditionalityQualifier may carry.
 *   ConditionalityQualifier is applicable to commissive and directive
 *   functions (Promise / Offer / Suggestion / Request).
 */
export const ConditionalityQualifierEnumeration = {
  Unconditional: 'Unconditional',
  Conditional:   'Conditional',
} as const
export type ConditionalityQualifierEnumerationLiteral =
  (typeof ConditionalityQualifierEnumeration)[keyof typeof ConditionalityQualifierEnumeration]

/**
 * @standard ISO 24617-2:2020 (2nd ed)
 * @section §8.3
 * @metaclass concrete (Enumeration realisation)
 * @generalization (none — top-level Enumeration)
 * @definition Closed set of values a PartialityQualifier may carry.
 *   PartialityQualifier is applicable to answer functions (PropositionalAnswer
 *   / SetAnswer / Confirm / Disconfirm).
 */
export const PartialityQualifierEnumeration = {
  Complete: 'Complete',
  Partial:  'Partial',
} as const
export type PartialityQualifierEnumerationLiteral =
  (typeof PartialityQualifierEnumeration)[keyof typeof PartialityQualifierEnumeration]

/**
 * @standard ISO 24617-2:2020 (2nd ed)
 * @section §8.4
 * @metaclass concrete (Enumeration realisation)
 * @generalization (none — top-level Enumeration)
 * @definition Closed set of values a SentimentQualifier may carry.
 *   SentimentQualifier is applicable to dialogue acts performed with a
 *   general-purpose communicative function.
 */
export const SentimentQualifierEnumeration = {
  Positive: 'Positive',
  Negative: 'Negative',
  Neutral:  'Neutral',
} as const
export type SentimentQualifierEnumerationLiteral =
  (typeof SentimentQualifierEnumeration)[keyof typeof SentimentQualifierEnumeration]

// --- 3.3 Rhetorical relation type enumeration (§9.1) -----------------------
/**
 * @standard ISO 24617-2:2020 (2nd ed)
 * @section §9.1
 * @metaclass concrete (Enumeration realisation)
 * @generalization (none — top-level Enumeration)
 * @definition Closed set of relation type codes a RhetoricalRelation may
 *   carry. ISO 24617-2:2020 defers to ISO 24617-8:2016 (SemAF Part 8 —
 *   Discourse Relations) for the canonical PDTB-aligned relation inventory;
 *   the values below capture the relations explicitly cited in §9.1.
 */
export const RhetoricalRelationEnumeration = {
  Cause:       'Cause',
  Justify:     'Justify',
  Elaborate:   'Elaborate',
  Background:  'Background',
  Contrast:    'Contrast',
  Concession:  'Concession',
  Condition:   'Condition',
  Result:      'Result',
  Purpose:     'Purpose',
  Means:       'Means',
  Restatement: 'Restatement',
  Summary:     'Summary',
  Sequence:    'Sequence',
} as const
export type RhetoricalRelationEnumerationLiteral =
  (typeof RhetoricalRelationEnumeration)[keyof typeof RhetoricalRelationEnumeration]

// ═══════════════════════════════════════════════════════════════════════════
// §4 — FUNCTIONAL SEGMENTS
// ═══════════════════════════════════════════════════════════════════════════

// --- 4.1 IFunctionalSegment (§4) -------------------------------------------
/**
 * @standard ISO 24617-2:2020 (2nd ed)
 * @section §4
 * @metaclass concrete
 * @generalization (none — root DiAML Class)
 * @definition Minimal stretch of dialogue text or signal that carries one or
 *   more dialogue acts. A functional segment is the anchor between the raw
 *   dialogue stream and the typed dialogue-act annotations layered over it.
 * @ownedAttributes
 *   xmlId    : String [1]  -- unique identifier emitted as `xml:id` in DiAML XML
 *   anchor   : String [1]  -- offset reference into the source dialogue stream
 *                              (e.g., "doc#char=120,184" for span anchoring;
 *                              audio/video timecode for multimodal anchoring)
 *   text     : String [0..1] -- optional textual content of the segment
 *   speakerId: String [0..1] -- optional convenience reference to the
 *                                participant who produced the segment
 * @associationEnds
 *   carries : DialogueAct [0..*] -- the dialogue acts whose `target` is this
 *                                    functional segment (inverse of
 *                                    DialogueAct::target)
 * @constraints
 *   [non_empty_anchor]: anchor->notEmpty() implies anchor.size() > 0
 *   [unique_xmlId]: For every two FunctionalSegment instances f1, f2 in the
 *     same DiAMLDocument: f1.xmlId = f2.xmlId implies f1 = f2
 */
export interface IFunctionalSegment {
  readonly xmlId:                  DiAMLElementId
  readonly anchor:                 string
  readonly text:                   string | undefined
  readonly speakerId:              DiAMLElementId | undefined
  readonly carriedDialogueActIds:  ReadonlyArray<DiAMLElementId>
}

// ═══════════════════════════════════════════════════════════════════════════
// §5 — DIALOGUE ACTS
// ═══════════════════════════════════════════════════════════════════════════

// --- 5.1 IDialogueAct (§5) -------------------------------------------------
/**
 * @standard ISO 24617-2:2020 (2nd ed)
 * @section §5
 * @metaclass concrete
 * @generalization (none — root DiAML Class)
 * @definition Semantic content of a participant's contribution to a dialogue,
 *   characterised by exactly one communicative function in exactly one
 *   dimension, optionally qualified by zero or more qualifiers, and optionally
 *   linked to other dialogue acts via feedback-dependence and
 *   functional-dependence relations.
 * @ownedAttributes
 *   xmlId : String [1]
 * @associationEnds
 *   target                   : FunctionalSegment [1]
 *   sender                   : Participant [1]
 *   addressees               : Participant [1..*]
 *   communicativeFunction    : CommunicativeFunction [1]
 *   dimension                : Dimension [1]
 *   qualifiers               : Qualifier [0..*]
 *   feedbackDependence       : DialogueAct [0..1]
 *   functionalDependence     : DialogueAct [0..1]
 *   semanticContent          : SemanticContent [0..1] (plug-in slot)
 * @operations
 *   isInformationProviding() : Boolean
 *   isCommissive() : Boolean
 *   isDirective() : Boolean
 *   isFeedback() : Boolean
 * @constraints
 *   [exactly_one_function]: communicativeFunction->size() = 1
 *   [exactly_one_dimension]: dimension->size() = 1
 *   [function_dimension_match]: communicativeFunction.dimension = dimension
 *     -- A dimension-specific function MUST be used in its declared dimension;
 *        a general-purpose function MAY be used in any dimension.
 *   [non_self_feedback]: feedbackDependence <> self
 *   [non_self_functional_dep]: functionalDependence <> self
 *   [feedback_only_when_feedback_function]: feedbackDependence->notEmpty()
 *     implies dimension = Dimension::AutoFeedback or
 *             dimension = Dimension::AlloFeedback
 */
export interface IDialogueAct {
  readonly xmlId:                       DiAMLElementId
  readonly targetFunctionalSegmentId:   DiAMLElementId
  readonly senderParticipantId:         DiAMLElementId
  readonly addresseeParticipantIds:     ReadonlyArray<DiAMLElementId>
  readonly communicativeFunctionId:     DiAMLElementId
  readonly dimension:                   DimensionEnumerationLiteral
  readonly qualifierIds:                ReadonlyArray<DiAMLElementId>
  readonly feedbackDependenceId:        DiAMLElementId | undefined
  readonly functionalDependenceId:      DiAMLElementId | undefined
  readonly semanticContentId:           DiAMLElementId | undefined
  isInformationProviding(): boolean
  isCommissive(): boolean
  isDirective(): boolean
  isFeedback(): boolean
}

// --- 5.2 IParticipant (§5.2) -----------------------------------------------
/**
 * @standard ISO 24617-2:2020 (2nd ed)
 * @section §5.2
 * @metaclass concrete
 * @generalization (none — root DiAML Class)
 * @definition Agent (human or artificial) that produces dialogue acts as a
 *   `sender` and/or receives them as one of the `addressees`.
 * @ownedAttributes
 *   xmlId : String [1]
 *   name  : String [0..1] -- optional display name for the participant
 *   role  : String [0..1] -- optional role label (e.g., "USER", "AGENT")
 */
export interface IParticipant {
  readonly xmlId: DiAMLElementId
  readonly name:  string | undefined
  readonly role:  string | undefined
}

// ═══════════════════════════════════════════════════════════════════════════
// §6 — COMMUNICATIVE FUNCTIONS — Generalization root
// ═══════════════════════════════════════════════════════════════════════════

// --- 6.1 ICommunicativeFunction (§6) ---------------------------------------
/**
 * @standard ISO 24617-2:2020 (2nd ed)
 * @section §6
 * @metaclass abstract
 * @generalization (none — root)
 * @definition Function performed by a speaker by means of a dialogue act.
 *   Realised as a `Generalization` chain rooted at this abstract metaclass
 *   with two top-level branches:
 *   - GeneralPurposeFunction: applicable in any dimension
 *   - DimensionSpecificFunction: applicable only in its declared dimension
 * @ownedAttributes
 *   name : String [1] -- the literal function name (e.g., "Inform", "Confirm")
 * @associationEnds
 *   dimension : Dimension [0..1] -- declared dimension for dimension-specific
 *                                   functions; absent for general-purpose
 *                                   functions
 * @constraints
 *   [name_unique_per_class]: For two ICommunicativeFunction instances f1, f2
 *     of the same concrete subclass: f1.name = f2.name implies f1 = f2
 */
export interface ICommunicativeFunction {
  readonly name:      string
  readonly dimension: DimensionEnumerationLiteral | undefined
}

// --- 6.1.1 IGeneralPurposeFunction (§6.1) ----------------------------------
/**
 * @standard ISO 24617-2:2020 (2nd ed)
 * @section §6.1
 * @metaclass abstract
 * @generalization ICommunicativeFunction
 * @definition CommunicativeFunction whose `dimension` association end is
 *   absent — applicable in any of the 9 standardised dimensions and any
 *   plug-in dimension.
 */
export interface IGeneralPurposeFunction extends ICommunicativeFunction {
  readonly dimension: undefined
}

// --- 6.1.2 IDimensionSpecificFunction (§6.2) -------------------------------
/**
 * @standard ISO 24617-2:2020 (2nd ed)
 * @section §6.2
 * @metaclass abstract
 * @generalization ICommunicativeFunction
 * @definition CommunicativeFunction whose `dimension` association end is
 *   present — applicable only in its declared dimension.
 */
export interface IDimensionSpecificFunction extends ICommunicativeFunction {
  readonly dimension: DimensionEnumerationLiteral
}

// ═══════════════════════════════════════════════════════════════════════════
// §6.1 — GENERAL-PURPOSE FUNCTIONS — Information-Seeking branch
// ═══════════════════════════════════════════════════════════════════════════

// --- 6.1.A IQuestion (§6.1.1) ----------------------------------------------
/**
 * @standard ISO 24617-2:2020 (2nd ed)
 * @section §6.1.1
 * @metaclass abstract
 * @generalization IGeneralPurposeFunction
 * @definition Information-seeking function by which the speaker wants to know
 *   something from the addressee. Specialised by question shape:
 *   PropositionalQuestion, SetQuestion, ChoiceQuestion, AlternativesQuestion,
 *   plus indirect variants.
 */
export interface IQuestion extends IGeneralPurposeFunction {}

/**
 * @standard ISO 24617-2:2020 (2nd ed)
 * @section §6.1.1.1
 * @metaclass concrete
 * @generalization IQuestion
 * @definition Question whose semantic content is a proposition; the speaker
 *   wants to know whether the proposition is true or false.
 */
export interface IPropositionalQuestion extends IQuestion {}

/**
 * @standard ISO 24617-2:2020 (2nd ed)
 * @section §6.1.1.1.1
 * @metaclass concrete
 * @generalization IPropositionalQuestion
 * @definition PropositionalQuestion in which the speaker weakly believes the
 *   proposition is true; the addressee is expected to confirm.
 */
export interface ICheckQuestion extends IPropositionalQuestion {}

/**
 * @standard ISO 24617-2:2020 (2nd ed)
 * @section §6.1.1.1.1.1
 * @metaclass concrete
 * @generalization ICheckQuestion
 * @definition CheckQuestion variant biased toward a positive answer.
 */
export interface IPosiCheckQuestion extends ICheckQuestion {}

/**
 * @standard ISO 24617-2:2020 (2nd ed)
 * @section §6.1.1.1.1.2
 * @metaclass concrete
 * @generalization ICheckQuestion
 * @definition CheckQuestion variant biased toward a negative answer.
 */
export interface INegaCheckQuestion extends ICheckQuestion {}

/**
 * @standard ISO 24617-2:2020 (2nd ed)
 * @section §6.1.1.2
 * @metaclass concrete
 * @generalization IQuestion
 * @definition Question whose semantic content is a domain restriction; the
 *   speaker wants to know which elements of the domain have a stated property.
 */
export interface ISetQuestion extends IQuestion {}

/**
 * @standard ISO 24617-2:2020 (2nd ed)
 * @section §6.1.1.3
 * @metaclass concrete
 * @generalization IQuestion
 * @definition Question whose semantic content is an enumerated alternative
 *   list; the speaker wants to know which alternative the addressee selects.
 */
export interface IChoiceQuestion extends IQuestion {}

/**
 * @standard ISO 24617-2:2020 (2nd ed)
 * @section §6.1.1.4
 * @metaclass concrete
 * @generalization IQuestion
 * @definition Question whose semantic content is a disjunction of
 *   propositions; the speaker assumes the addressee knows which disjunct is
 *   true and asks the addressee to identify it.
 */
export interface IAlternativesQuestion extends IQuestion {}

// ═══════════════════════════════════════════════════════════════════════════
// §6.1 — GENERAL-PURPOSE FUNCTIONS — Information-Providing branch
// ═══════════════════════════════════════════════════════════════════════════

// --- 6.1.B IInformingFunction (§6.1.2) -------------------------------------
/**
 * @standard ISO 24617-2:2020 (2nd ed)
 * @section §6.1.2
 * @metaclass abstract
 * @generalization IGeneralPurposeFunction
 * @definition Information-providing function by which the speaker makes
 *   information known to the addressee. Specialised by speaker certainty
 *   (Inform, UncertainInform) and addressee-belief alignment (Agreement,
 *   Disagreement, Correction).
 */
export interface IInformingFunction extends IGeneralPurposeFunction {}

/**
 * @standard ISO 24617-2:2020 (2nd ed)
 * @section §6.1.2.1
 * @metaclass concrete
 * @generalization IInformingFunction
 * @definition Information-providing function in which the speaker holds the
 *   semantic content with full certainty.
 */
export interface IInform extends IInformingFunction {}

/**
 * @standard ISO 24617-2:2020 (2nd ed)
 * @section §6.1.2.1.1
 * @metaclass concrete
 * @generalization IInform
 * @definition Inform in which the speaker assumes the addressee weakly
 *   believes the semantic content is true.
 */
export interface IAgreement extends IInform {}

/**
 * @standard ISO 24617-2:2020 (2nd ed)
 * @section §6.1.2.1.2
 * @metaclass concrete
 * @generalization IInform
 * @definition Inform in which the speaker assumes the addressee weakly
 *   believes the semantic content is false.
 */
export interface IDisagreement extends IInform {}

/**
 * @standard ISO 24617-2:2020 (2nd ed)
 * @section §6.1.2.1.2.1
 * @metaclass concrete
 * @generalization IDisagreement
 * @definition Disagreement in which the speaker wants the semantic content to
 *   replace the addressee's incorrect belief.
 */
export interface ICorrection extends IDisagreement {}

/**
 * @standard ISO 24617-2:2020 (2nd ed)
 * @section §6.1.2.2
 * @metaclass concrete
 * @generalization IInformingFunction
 * @definition Information-providing function in which the speaker holds the
 *   semantic content only weakly. Realised in DiAML XML as an `<inform>`
 *   element with `qualifier="Uncertain"`.
 */
export interface IUncertainInform extends IInformingFunction {}

// --- 6.1.C IAnswerFunction (§6.1.3) ----------------------------------------
/**
 * @standard ISO 24617-2:2020 (2nd ed)
 * @section §6.1.3
 * @metaclass abstract
 * @generalization IGeneralPurposeFunction
 * @definition Information-providing function performed in response to a
 *   prior Question; necessarily linked to the antecedent question via a
 *   FunctionalDependenceRelation.
 */
export interface IAnswerFunction extends IGeneralPurposeFunction {}

/**
 * @standard ISO 24617-2:2020 (2nd ed)
 * @section §6.1.3.1
 * @metaclass concrete
 * @generalization IAnswerFunction
 * @definition Answer in which the speaker holds the answer with full
 *   certainty.
 */
export interface IAnswer extends IAnswerFunction {}

/**
 * @standard ISO 24617-2:2020 (2nd ed)
 * @section §6.1.3.1.1
 * @metaclass concrete
 * @generalization IAnswer
 * @definition Answer to a PropositionalQuestion.
 */
export interface IPropositionalAnswer extends IAnswer {}

/**
 * @standard ISO 24617-2:2020 (2nd ed)
 * @section §6.1.3.1.1.1
 * @metaclass concrete
 * @generalization IPropositionalAnswer
 * @definition PropositionalAnswer that affirms the proposition the antecedent
 *   question asks about.
 */
export interface IConfirm extends IPropositionalAnswer {}

/**
 * @standard ISO 24617-2:2020 (2nd ed)
 * @section §6.1.3.1.1.2
 * @metaclass concrete
 * @generalization IPropositionalAnswer
 * @definition PropositionalAnswer that negates the proposition the antecedent
 *   question asks about.
 */
export interface IDisconfirm extends IPropositionalAnswer {}

/**
 * @standard ISO 24617-2:2020 (2nd ed)
 * @section §6.1.3.1.2
 * @metaclass concrete
 * @generalization IAnswer
 * @definition Answer to a SetQuestion that identifies the elements of the
 *   domain that have the queried property.
 */
export interface ISetAnswer extends IAnswer {}

/**
 * @standard ISO 24617-2:2020 (2nd ed)
 * @section §6.1.3.2
 * @metaclass abstract
 * @generalization IAnswerFunction
 * @definition Answer in which the speaker holds the answer only weakly.
 */
export interface IUncertainAnswer extends IAnswerFunction {}

/**
 * @standard ISO 24617-2:2020 (2nd ed)
 * @section §6.1.3.2.1
 * @metaclass concrete
 * @generalization IUncertainAnswer
 * @definition UncertainAnswer to a PropositionalQuestion.
 */
export interface IUncertainPropositionalAnswer extends IUncertainAnswer {}

/**
 * @standard ISO 24617-2:2020 (2nd ed)
 * @section §6.1.3.2.1.1
 * @metaclass concrete
 * @generalization IUncertainPropositionalAnswer
 * @definition UncertainPropositionalAnswer with a positive bias.
 */
export interface IUncertainConfirm extends IUncertainPropositionalAnswer {}

/**
 * @standard ISO 24617-2:2020 (2nd ed)
 * @section §6.1.3.2.1.2
 * @metaclass concrete
 * @generalization IUncertainPropositionalAnswer
 * @definition UncertainPropositionalAnswer with a negative bias.
 */
export interface IUncertainDisconfirm extends IUncertainPropositionalAnswer {}

/**
 * @standard ISO 24617-2:2020 (2nd ed)
 * @section §6.1.3.2.2
 * @metaclass concrete
 * @generalization IUncertainAnswer
 * @definition UncertainAnswer to a SetQuestion.
 */
export interface IUncertainSetAnswer extends IUncertainAnswer {}

// ═══════════════════════════════════════════════════════════════════════════
// §6.1 — GENERAL-PURPOSE FUNCTIONS — Action-Discussion / Commissive branch
// ═══════════════════════════════════════════════════════════════════════════

// --- 6.1.D ICommissiveFunction (§6.1.4) ------------------------------------
/**
 * @standard ISO 24617-2:2020 (2nd ed)
 * @section §6.1.4
 * @metaclass abstract
 * @generalization IGeneralPurposeFunction
 * @definition Action-discussion function by which the speaker commits (or
 *   declines to commit) to performing an action.
 */
export interface ICommissiveFunction extends IGeneralPurposeFunction {}

/**
 * @standard ISO 24617-2:2020 (2nd ed)
 * @section §6.1.4.1
 * @metaclass concrete
 * @generalization ICommissiveFunction
 * @definition Speaker commits to performing an action conditional on the
 *   addressee's consent.
 */
export interface IOffer extends ICommissiveFunction {}

/**
 * @standard ISO 24617-2:2020 (2nd ed)
 * @section §6.1.4.2
 * @metaclass concrete
 * @generalization ICommissiveFunction
 * @definition Speaker commits unconditionally to performing an action.
 */
export interface IPromise extends ICommissiveFunction {}

/**
 * @standard ISO 24617-2:2020 (2nd ed)
 * @section §6.1.4.3
 * @metaclass concrete
 * @generalization ICommissiveFunction
 * @definition Speaker addresses a request from the addressee, conditionally
 *   committing to perform the requested action under stated conditions.
 */
export interface IAddressRequest extends ICommissiveFunction {}

/**
 * @standard ISO 24617-2:2020 (2nd ed)
 * @section §6.1.4.4
 * @metaclass concrete
 * @generalization ICommissiveFunction
 * @definition Speaker unconditionally commits to performing the requested
 *   action.
 */
export interface IAcceptRequest extends ICommissiveFunction {}

/**
 * @standard ISO 24617-2:2020 (2nd ed)
 * @section §6.1.4.5
 * @metaclass concrete
 * @generalization ICommissiveFunction
 * @definition Speaker commits to NOT performing the requested action.
 */
export interface IDeclineRequest extends ICommissiveFunction {}

/**
 * @standard ISO 24617-2:2020 (2nd ed)
 * @section §6.1.4.6
 * @metaclass concrete
 * @generalization ICommissiveFunction
 * @definition Speaker addresses a suggestion from the addressee, conditionally
 *   committing to perform the suggested action under stated conditions.
 */
export interface IAddressSuggestion extends ICommissiveFunction {}

/**
 * @standard ISO 24617-2:2020 (2nd ed)
 * @section §6.1.4.7
 * @metaclass concrete
 * @generalization ICommissiveFunction
 * @definition Speaker unconditionally commits to performing the suggested
 *   action.
 */
export interface IAcceptSuggestion extends ICommissiveFunction {}

/**
 * @standard ISO 24617-2:2020 (2nd ed)
 * @section §6.1.4.8
 * @metaclass concrete
 * @generalization ICommissiveFunction
 * @definition Speaker commits to NOT performing the suggested action.
 */
export interface IDeclineSuggestion extends ICommissiveFunction {}

// ═══════════════════════════════════════════════════════════════════════════
// §6.1 — GENERAL-PURPOSE FUNCTIONS — Action-Discussion / Directive branch
// ═══════════════════════════════════════════════════════════════════════════

// --- 6.1.E IDirectiveFunction (§6.1.5) -------------------------------------
/**
 * @standard ISO 24617-2:2020 (2nd ed)
 * @section §6.1.5
 * @metaclass abstract
 * @generalization IGeneralPurposeFunction
 * @definition Action-discussion function by which the speaker wants the
 *   addressee to perform (or refrain from performing) an action.
 */
export interface IDirectiveFunction extends IGeneralPurposeFunction {}

/**
 * @standard ISO 24617-2:2020 (2nd ed)
 * @section §6.1.5.1
 * @metaclass concrete
 * @generalization IDirectiveFunction
 * @definition Speaker wants the addressee to perform an action, conditional on
 *   the addressee's consent; speaker assumes the addressee can do so.
 */
export interface IRequest extends IDirectiveFunction {}

/**
 * @standard ISO 24617-2:2020 (2nd ed)
 * @section §6.1.5.2
 * @metaclass concrete
 * @generalization IDirectiveFunction
 * @definition Speaker wants the addressee to perform an action without
 *   assuming the addressee's ability or consent.
 */
export interface IIndirectRequest extends IDirectiveFunction {}

/**
 * @standard ISO 24617-2:2020 (2nd ed)
 * @section §6.1.5.3
 * @metaclass concrete
 * @generalization IDirectiveFunction
 * @definition Speaker wants the addressee to perform an action in a specified
 *   manner or with a specified frequency; speaker assumes the addressee is
 *   capable.
 */
export interface IInstruct extends IDirectiveFunction {}

/**
 * @standard ISO 24617-2:2020 (2nd ed)
 * @section §6.1.5.4
 * @metaclass concrete
 * @generalization IDirectiveFunction
 * @definition Speaker addresses an offer from the addressee.
 */
export interface IAddressOffer extends IDirectiveFunction {}

/**
 * @standard ISO 24617-2:2020 (2nd ed)
 * @section §6.1.5.5
 * @metaclass concrete
 * @generalization IDirectiveFunction
 * @definition Speaker accepts the addressee's offer.
 */
export interface IAcceptOffer extends IDirectiveFunction {}

/**
 * @standard ISO 24617-2:2020 (2nd ed)
 * @section §6.1.5.6
 * @metaclass concrete
 * @generalization IDirectiveFunction
 * @definition Speaker declines the addressee's offer.
 */
export interface IDeclineOffer extends IDirectiveFunction {}

/**
 * @standard ISO 24617-2:2020 (2nd ed)
 * @section §6.1.5.7
 * @metaclass concrete
 * @generalization IDirectiveFunction
 * @definition Speaker wants the addressee to know that an action is potentially
 *   promising for the addressee's goal achievement, without commitment.
 */
export interface ISuggestion extends IDirectiveFunction {}

// ═══════════════════════════════════════════════════════════════════════════
// §6.2 — DIMENSION-SPECIFIC FUNCTIONS — AutoFeedback dimension
// ═══════════════════════════════════════════════════════════════════════════

// --- 6.2.A IAutoFeedbackFunction (§6.2.1) ----------------------------------
/**
 * @standard ISO 24617-2:2020 (2nd ed)
 * @section §6.2.1
 * @metaclass abstract
 * @generalization IDimensionSpecificFunction
 * @definition Communicative function specific to the AutoFeedback dimension —
 *   the speaker reports on the speaker's OWN processing of the addressee's
 *   prior utterances. Processing levels are: attention, perception,
 *   interpretation, evaluation, execution.
 */
export interface IAutoFeedbackFunction extends IDimensionSpecificFunction {
  readonly dimension: typeof DimensionEnumeration.AutoFeedback
}

/**
 * @standard ISO 24617-2:2020 (2nd ed)
 * @section §6.2.1.1
 * @metaclass abstract
 * @generalization IAutoFeedbackFunction
 * @definition AutoFeedback function reporting successful processing.
 */
export interface IAutoPositive extends IAutoFeedbackFunction {}

/** @section §6.2.1.1.1 Speaker is paying attention. */
export interface IAutoAttentionPositive      extends IAutoPositive {}
/** @section §6.2.1.1.2 Speaker has perceived the utterance. */
export interface IAutoPerceptionPositive     extends IAutoPositive {}
/** @section §6.2.1.1.3 Speaker has interpreted the utterance. */
export interface IAutoInterpretationPositive extends IAutoPositive {}
/** @section §6.2.1.1.4 Speaker has evaluated the utterance. */
export interface IAutoEvaluationPositive     extends IAutoPositive {}
/** @section §6.2.1.1.5 Speaker has executed the appropriate action. */
export interface IAutoExecutionPositive      extends IAutoPositive {}
/** @section §6.2.1.1.6 Speaker reports overall positive processing. */
export interface IAutoOverallPositive        extends IAutoPositive {}

/**
 * @standard ISO 24617-2:2020 (2nd ed)
 * @section §6.2.1.2
 * @metaclass abstract
 * @generalization IAutoFeedbackFunction
 * @definition AutoFeedback function reporting unsuccessful processing.
 */
export interface IAutoNegative extends IAutoFeedbackFunction {}

/** @section §6.2.1.2.1 Speaker did not pay attention. */
export interface IAutoAttentionNegative      extends IAutoNegative {}
/** @section §6.2.1.2.2 Speaker did not perceive the utterance. */
export interface IAutoPerceptionNegative     extends IAutoNegative {}
/** @section §6.2.1.2.3 Speaker could not interpret the utterance. */
export interface IAutoInterpretationNegative extends IAutoNegative {}
/** @section §6.2.1.2.4 Speaker could not evaluate the utterance. */
export interface IAutoEvaluationNegative     extends IAutoNegative {}
/** @section §6.2.1.2.5 Speaker could not execute the appropriate action. */
export interface IAutoExecutionNegative      extends IAutoNegative {}
/** @section §6.2.1.2.6 Speaker reports overall negative processing. */
export interface IAutoOverallNegative        extends IAutoNegative {}

// ═══════════════════════════════════════════════════════════════════════════
// §6.2 — DIMENSION-SPECIFIC FUNCTIONS — AlloFeedback dimension
// ═══════════════════════════════════════════════════════════════════════════

// --- 6.2.B IAlloFeedbackFunction (§6.2.2) ----------------------------------
/**
 * @standard ISO 24617-2:2020 (2nd ed)
 * @section §6.2.2
 * @metaclass abstract
 * @generalization IDimensionSpecificFunction
 * @definition Communicative function specific to the AlloFeedback dimension —
 *   the speaker reports on (or elicits feedback about) the ADDRESSEE'S
 *   processing of the speaker's own prior utterances.
 */
export interface IAlloFeedbackFunction extends IDimensionSpecificFunction {
  readonly dimension: typeof DimensionEnumeration.AlloFeedback
}

/**
 * @standard ISO 24617-2:2020 (2nd ed)
 * @section §6.2.2.1
 * @metaclass abstract
 * @generalization IAlloFeedbackFunction
 * @definition AlloFeedback function reporting that the addressee's processing
 *   appears successful.
 */
export interface IAlloPositive extends IAlloFeedbackFunction {}

/** @section §6.2.2.1.1 Speaker believes addressee perceived utterance. */
export interface IAlloPerceptionPositive     extends IAlloPositive {}
/** @section §6.2.2.1.2 Speaker believes addressee interpreted utterance. */
export interface IAlloInterpretationPositive extends IAlloPositive {}
/** @section §6.2.2.1.3 Speaker believes addressee evaluated utterance. */
export interface IAlloEvaluationPositive     extends IAlloPositive {}
/** @section §6.2.2.1.4 Speaker believes addressee executed appropriate action. */
export interface IAlloExecutionPositive      extends IAlloPositive {}
/** @section §6.2.2.1.5 Speaker reports overall positive addressee processing. */
export interface IAlloOverallPositive        extends IAlloPositive {}

/**
 * @standard ISO 24617-2:2020 (2nd ed)
 * @section §6.2.2.2
 * @metaclass abstract
 * @generalization IAlloFeedbackFunction
 * @definition AlloFeedback function reporting that the addressee's processing
 *   appears unsuccessful.
 */
export interface IAlloNegative extends IAlloFeedbackFunction {}

/** @section §6.2.2.2.1 Speaker believes addressee did not pay attention. */
export interface IAlloAttentionNegative      extends IAlloNegative {}
/** @section §6.2.2.2.2 Speaker believes addressee did not perceive utterance. */
export interface IAlloPerceptionNegative     extends IAlloNegative {}
/** @section §6.2.2.2.3 Speaker believes addressee could not interpret utterance. */
export interface IAlloInterpretationNegative extends IAlloNegative {}
/** @section §6.2.2.2.4 Speaker believes addressee could not evaluate utterance. */
export interface IAlloEvaluationNegative     extends IAlloNegative {}
/** @section §6.2.2.2.5 Speaker believes addressee could not execute appropriate action. */
export interface IAlloExecutionNegative      extends IAlloNegative {}

/**
 * @standard ISO 24617-2:2020 (2nd ed)
 * @section §6.2.2.3
 * @metaclass abstract
 * @generalization IAlloFeedbackFunction
 * @definition AlloFeedback function eliciting feedback from the addressee
 *   about a particular processing level.
 */
export interface IFeedbackElicitation extends IAlloFeedbackFunction {}

/** @section §6.2.2.3.1 Speaker wants to know whether addressee is paying attention. */
export interface IAttentionElicitation      extends IFeedbackElicitation {}
/** @section §6.2.2.3.2 Speaker wants to know whether addressee perceived utterance. */
export interface IPerceptionElicitation     extends IFeedbackElicitation {}
/** @section §6.2.2.3.3 Speaker wants to know whether addressee interpreted utterance. */
export interface IInterpretationElicitation extends IFeedbackElicitation {}
/** @section §6.2.2.3.4 Speaker wants to know whether addressee evaluated utterance. */
export interface IEvaluationElicitation     extends IFeedbackElicitation {}
/** @section §6.2.2.3.5 Speaker wants to know whether addressee executed appropriate action. */
export interface IExecutionElicitation      extends IFeedbackElicitation {}

// ═══════════════════════════════════════════════════════════════════════════
// §6.2 — DIMENSION-SPECIFIC FUNCTIONS — TurnManagement dimension
// ═══════════════════════════════════════════════════════════════════════════

// --- 6.2.C ITurnManagementFunction (§6.2.3) --------------------------------
/**
 * @standard ISO 24617-2:2020 (2nd ed)
 * @section §6.2.3
 * @metaclass abstract
 * @generalization IDimensionSpecificFunction
 * @definition Communicative function specific to the TurnManagement dimension —
 *   allocation, retention, or release of the speaking turn. Split into
 *   turn-unit-initial functions (Accept, Grab, Take) and turn-unit-final
 *   functions (Keep, Assign, Release).
 */
export interface ITurnManagementFunction extends IDimensionSpecificFunction {
  readonly dimension: typeof DimensionEnumeration.TurnManagement
}

/** @section §6.2.3.1 Speaker accepts a turn the addressee has offered. */
export interface ITurnAccept   extends ITurnManagementFunction {}
/** @section §6.2.3.2 Speaker takes the turn currently held by the addressee. */
export interface ITurnGrab     extends ITurnManagementFunction {}
/** @section §6.2.3.3 Speaker takes an available turn. */
export interface ITurnTake     extends ITurnManagementFunction {}
/** @section §6.2.3.4 Speaker indicates intention to keep the turn. */
export interface ITurnKeep     extends ITurnManagementFunction {}
/** @section §6.2.3.5 Speaker assigns the next turn to the addressee. */
export interface ITurnAssign   extends ITurnManagementFunction {}
/** @section §6.2.3.6 Speaker releases the turn so any participant may take it. */
export interface ITurnRelease  extends ITurnManagementFunction {}

// ═══════════════════════════════════════════════════════════════════════════
// §6.2 — DIMENSION-SPECIFIC FUNCTIONS — TimeManagement dimension
// ═══════════════════════════════════════════════════════════════════════════

// --- 6.2.D ITimeManagementFunction (§6.2.4) --------------------------------
/**
 * @standard ISO 24617-2:2020 (2nd ed)
 * @section §6.2.4
 * @metaclass abstract
 * @generalization IDimensionSpecificFunction
 * @definition Communicative function specific to the TimeManagement dimension —
 *   the speaker signals a need for time, either to formulate the next
 *   utterance (Stalling) or to perform a non-dialogue task (Pausing).
 */
export interface ITimeManagementFunction extends IDimensionSpecificFunction {
  readonly dimension: typeof DimensionEnumeration.TimeManagement
}

/** @section §6.2.4.1 Speaker needs time to formulate the next utterance. */
export interface IStalling extends ITimeManagementFunction {}
/** @section §6.2.4.2 Speaker needs time for a non-dialogue task. */
export interface IPausing  extends ITimeManagementFunction {}

// ═══════════════════════════════════════════════════════════════════════════
// §6.2 — DIMENSION-SPECIFIC FUNCTIONS — DiscourseStructuring dimension
// ═══════════════════════════════════════════════════════════════════════════

// --- 6.2.E IDiscourseStructuringFunction (§6.2.5) --------------------------
/**
 * @standard ISO 24617-2:2020 (2nd ed)
 * @section §6.2.5
 * @metaclass abstract
 * @generalization IDimensionSpecificFunction
 * @definition Communicative function specific to the DiscourseStructuring
 *   dimension — opening, pre-closing, topic-introduction, topic-shift moves
 *   that structure the dialogue.
 */
export interface IDiscourseStructuringFunction extends IDimensionSpecificFunction {
  readonly dimension: typeof DimensionEnumeration.DiscourseStructuring
}

/** @section §6.2.5.1 Speaker signals readiness to begin the dialogue. */
export interface IOpening                extends IDiscourseStructuringFunction {}
/** @section §6.2.5.2 Speaker signals intent to end the dialogue shortly. */
export interface IPreClosing             extends IDiscourseStructuringFunction {}
/** @section §6.2.5.3 Speaker introduces a new topic. */
export interface ITopicIntroduction      extends IDiscourseStructuringFunction {}
/** @section §6.2.5.4 Speaker announces a topic shift. */
export interface ITopicShiftAnnouncement extends IDiscourseStructuringFunction {}
/** @section §6.2.5.5 Speaker performs a topic shift. */
export interface ITopicShift             extends IDiscourseStructuringFunction {}

// ═══════════════════════════════════════════════════════════════════════════
// §6.2 — DIMENSION-SPECIFIC FUNCTIONS — OwnCommunicationManagement dimension
// ═══════════════════════════════════════════════════════════════════════════

// --- 6.2.F IOwnCommunicationManagementFunction (§6.2.6) --------------------
/**
 * @standard ISO 24617-2:2020 (2nd ed)
 * @section §6.2.6
 * @metaclass abstract
 * @generalization IDimensionSpecificFunction
 * @definition Communicative function specific to the OwnCommunicationManagement
 *   dimension — speaker signals own speech errors, retractions, or
 *   self-corrections.
 */
export interface IOwnCommunicationManagementFunction extends IDimensionSpecificFunction {
  readonly dimension: typeof DimensionEnumeration.OwnCommunicationManagement
}

/** @section §6.2.6.1 Speaker signals own speech error. */
export interface IErrorSignaling extends IOwnCommunicationManagementFunction {}
/** @section §6.2.6.2 Speaker withdraws something said within the same turn. */
export interface IRetraction     extends IOwnCommunicationManagementFunction {}
/** @section §6.2.6.3 Speaker corrects own error within the same turn. */
export interface ISelfCorrection extends IOwnCommunicationManagementFunction {}

// ═══════════════════════════════════════════════════════════════════════════
// §6.2 — DIMENSION-SPECIFIC FUNCTIONS — PartnerCommunicationManagement
// ═══════════════════════════════════════════════════════════════════════════

// --- 6.2.G IPartnerCommunicationManagementFunction (§6.2.7) ----------------
/**
 * @standard ISO 24617-2:2020 (2nd ed)
 * @section §6.2.7
 * @metaclass abstract
 * @generalization IDimensionSpecificFunction
 * @definition Communicative function specific to the
 *   PartnerCommunicationManagement dimension — speaker completes or corrects
 *   the addressee's utterance.
 */
export interface IPartnerCommunicationManagementFunction extends IDimensionSpecificFunction {
  readonly dimension: typeof DimensionEnumeration.PartnerCommunicationManagement
}

/** @section §6.2.7.1 Speaker completes the addressee's utterance. */
export interface ICompletion         extends IPartnerCommunicationManagementFunction {}
/** @section §6.2.7.2 Speaker corrects the addressee's presumed speaking error. */
export interface ICorrectMisspeaking extends IPartnerCommunicationManagementFunction {}

// ═══════════════════════════════════════════════════════════════════════════
// §6.2 — DIMENSION-SPECIFIC FUNCTIONS — SocialObligationsManagement
// ═══════════════════════════════════════════════════════════════════════════

// --- 6.2.H ISocialObligationsManagementFunction (§6.2.8) -------------------
/**
 * @standard ISO 24617-2:2020 (2nd ed)
 * @section §6.2.8
 * @metaclass abstract
 * @generalization IDimensionSpecificFunction
 * @definition Communicative function specific to the
 *   SocialObligationsManagement dimension — greetings, self-introductions,
 *   apologies, gratitude, valedictions. The 2nd edition folds the 2012 1st
 *   edition's "Contact Management" dimension functions into this dimension.
 */
export interface ISocialObligationsManagementFunction extends IDimensionSpecificFunction {
  readonly dimension: typeof DimensionEnumeration.SocialObligationsManagement
}

/** @section §6.2.8.1 Speaker initiates a greeting. */
export interface IInitialGreeting          extends ISocialObligationsManagementFunction {}
/** @section §6.2.8.2 Speaker reciprocates a greeting. */
export interface IReturnGreeting           extends ISocialObligationsManagementFunction {}
/** @section §6.2.8.3 Speaker introduces themself. */
export interface IInitialSelfIntroduction  extends ISocialObligationsManagementFunction {}
/** @section §6.2.8.4 Speaker introduces themself in response to a prior introduction. */
export interface IReturnSelfIntroduction   extends ISocialObligationsManagementFunction {}
/** @section §6.2.8.5 Speaker apologises. */
export interface IApology                  extends ISocialObligationsManagementFunction {}
/** @section §6.2.8.6 Speaker downplays the addressee's apology. */
export interface IApologyDownplay          extends ISocialObligationsManagementFunction {}
/** @section §6.2.8.7 Speaker thanks the addressee. */
export interface IThanking                 extends ISocialObligationsManagementFunction {}
/** @section §6.2.8.8 Speaker downplays the addressee's thanks. */
export interface IThankingDownplay         extends ISocialObligationsManagementFunction {}
/** @section §6.2.8.9 Speaker initiates a valediction. */
export interface IInitialGoodbye           extends ISocialObligationsManagementFunction {}
/** @section §6.2.8.10 Speaker reciprocates a valediction. */
export interface IReturnGoodbye            extends ISocialObligationsManagementFunction {}

// ═══════════════════════════════════════════════════════════════════════════
// §8 — QUALIFIERS
// ═══════════════════════════════════════════════════════════════════════════

// --- 8.1 IQualifier (§8) ---------------------------------------------------
/**
 * @standard ISO 24617-2:2020 (2nd ed)
 * @section §8
 * @metaclass abstract
 * @generalization (none — root)
 * @definition Modifier applicable to a dialogue act. ISO 24617-2:2020
 *   standardises four qualifier types: certainty, conditionality, partiality,
 *   sentiment. Each qualifier carries exactly one value drawn from the
 *   corresponding closed Enumeration; application-specific qualifier
 *   extensions are introduced through the plug-in mechanism (§10).
 * @ownedAttributes
 *   xmlId : String [1]
 * @constraints
 *   [single_value]: value->size() = 1
 */
export interface IQualifier {
  readonly xmlId: DiAMLElementId
}

/**
 * @standard ISO 24617-2:2020 (2nd ed)
 * @section §8.1
 * @metaclass concrete
 * @generalization IQualifier
 * @definition Qualifier expressing the speaker's certainty about the semantic
 *   content of the dialogue act it qualifies. Applicable to dialogue acts
 *   whose communicative function is information-providing.
 * @constraints
 *   [applicability]: The DialogueAct that owns this Qualifier MUST have a
 *     communicativeFunction that is a kind of IInformingFunction or
 *     IAnswerFunction.
 */
export interface ICertaintyQualifier extends IQualifier {
  readonly value: CertaintyQualifierEnumerationLiteral
}

/**
 * @standard ISO 24617-2:2020 (2nd ed)
 * @section §8.2
 * @metaclass concrete
 * @generalization IQualifier
 * @definition Qualifier expressing whether the action commitment or request
 *   is conditional. Applicable to dialogue acts whose communicative function
 *   is commissive or directive.
 * @constraints
 *   [applicability]: The DialogueAct that owns this Qualifier MUST have a
 *     communicativeFunction that is a kind of ICommissiveFunction or
 *     IDirectiveFunction.
 */
export interface IConditionalityQualifier extends IQualifier {
  readonly value: ConditionalityQualifierEnumerationLiteral
}

/**
 * @standard ISO 24617-2:2020 (2nd ed)
 * @section §8.3
 * @metaclass concrete
 * @generalization IQualifier
 * @definition Qualifier expressing whether the answer fully or partially
 *   addresses the antecedent question. Applicable to dialogue acts whose
 *   communicative function is an answer function.
 * @constraints
 *   [applicability]: The DialogueAct that owns this Qualifier MUST have a
 *     communicativeFunction that is a kind of IAnswerFunction.
 */
export interface IPartialityQualifier extends IQualifier {
  readonly value: PartialityQualifierEnumerationLiteral
}

/**
 * @standard ISO 24617-2:2020 (2nd ed)
 * @section §8.4
 * @metaclass concrete
 * @generalization IQualifier
 * @definition Qualifier expressing the speaker's sentiment toward the semantic
 *   content of the dialogue act it qualifies. Applicable to dialogue acts
 *   whose communicative function is general-purpose.
 * @constraints
 *   [applicability]: The DialogueAct that owns this Qualifier MUST have a
 *     communicativeFunction that is a kind of IGeneralPurposeFunction.
 */
export interface ISentimentQualifier extends IQualifier {
  readonly value: SentimentQualifierEnumerationLiteral
}

// ═══════════════════════════════════════════════════════════════════════════
// §9 — RELATIONS
// ═══════════════════════════════════════════════════════════════════════════

// --- 9.1 IRhetoricalRelation (§9.1) ----------------------------------------
/**
 * @standard ISO 24617-2:2020 (2nd ed)
 * @section §9.1
 * @metaclass concrete
 * @generalization (none — Association realisation)
 * @definition Typed binary relation between two functional segments
 *   characterising one as a justification, elaboration, or other rhetorical
 *   link to the other. Realised as an `Association` with two `Property`
 *   memberEnds (`source`, `target`) and a discriminating `relType`
 *   classifier drawn from the RhetoricalRelationEnumeration.
 * @associationEnds
 *   source  : FunctionalSegment [1]
 *   target  : FunctionalSegment [1]
 * @ownedAttributes
 *   xmlId   : String [1]
 *   relType : RhetoricalRelationEnumeration [1]
 * @constraints
 *   [non_self_relation]: source <> target
 */
export interface IRhetoricalRelation {
  readonly xmlId:                          DiAMLElementId
  readonly sourceFunctionalSegmentId:      DiAMLElementId
  readonly targetFunctionalSegmentId:      DiAMLElementId
  readonly relType:                        RhetoricalRelationEnumerationLiteral
}

// --- 9.2 IFeedbackDependenceRelation (§9.2) --------------------------------
/**
 * @standard ISO 24617-2:2020 (2nd ed)
 * @section §9.2
 * @metaclass concrete
 * @generalization (none — Association realisation)
 * @definition Binary relation linking a feedback dialogue act (in
 *   AutoFeedback or AlloFeedback dimension) to the prior dialogue act about
 *   whose processing the feedback is given. Always directional: source is the
 *   feedback dialogue act, target is the dialogue act receiving feedback.
 * @associationEnds
 *   source : DialogueAct [1] -- the feedback DialogueAct
 *   target : DialogueAct [1] -- the DialogueAct receiving feedback
 * @constraints
 *   [source_is_feedback]: source.dimension = Dimension::AutoFeedback or
 *                         source.dimension = Dimension::AlloFeedback
 *   [non_self]: source <> target
 */
export interface IFeedbackDependenceRelation {
  readonly xmlId:                DiAMLElementId
  readonly sourceDialogueActId:  DiAMLElementId
  readonly targetDialogueActId:  DiAMLElementId
}

// --- 9.3 IFunctionalDependenceRelation (§9.3) ------------------------------
/**
 * @standard ISO 24617-2:2020 (2nd ed)
 * @section §9.3
 * @metaclass concrete
 * @generalization (none — Association realisation)
 * @definition Binary relation linking a dialogue act to a prior dialogue act
 *   that conditions its functional interpretation — most commonly an Answer
 *   linking back to the Question it answers.
 * @associationEnds
 *   source : DialogueAct [1] -- the dependent DialogueAct
 *   target : DialogueAct [1] -- the antecedent DialogueAct
 * @constraints
 *   [non_self]: source <> target
 */
export interface IFunctionalDependenceRelation {
  readonly xmlId:                DiAMLElementId
  readonly sourceDialogueActId:  DiAMLElementId
  readonly targetDialogueActId:  DiAMLElementId
}

// ═══════════════════════════════════════════════════════════════════════════
// §10 — TRIPLE-LAYERED PLUG-IN MECHANISM (PackageMerge realisation)
// ═══════════════════════════════════════════════════════════════════════════

// --- 10.1 IDimensionPlugin (§10.1) -----------------------------------------
/**
 * @standard ISO 24617-2:2020 (2nd ed)
 * @section §10.1
 * @metaclass concrete (PackageMerge realisation)
 * @generalization (none — UML 2.5.1 PackageMerge usage)
 * @definition Plug-in package that contributes additional `EnumerationLiteral`
 *   instances to the `Dimension` enumeration. Realised through UML 2.5.1
 *   §12.3 `PackageMerge`: a DimensionPlugin package merges into the standard
 *   Dimension package, adding application-specific dimension literals (e.g.,
 *   "EscalationManagement" for a customer-service domain).
 * @ownedAttributes
 *   pluginName     : String [1] -- the application identifier sponsoring the plug-in
 *   contributedDimensions : String [1..*] -- the literal codes of the added dimensions
 * @constraints
 *   [non_collision]: contributedDimensions->forAll(d |
 *     not DimensionEnumeration.values()->includes(d))
 *     -- Plug-in dimension codes MUST NOT collide with the 9 standardised codes.
 */
export interface IDimensionPlugin {
  readonly pluginName:           string
  readonly contributedDimensions: ReadonlyArray<string>
}

// --- 10.2 IFunctionPlugin (§10.2) ------------------------------------------
/**
 * @standard ISO 24617-2:2020 (2nd ed)
 * @section §10.2
 * @metaclass concrete (PackageMerge realisation)
 * @generalization (none — UML 2.5.1 PackageMerge usage)
 * @definition Plug-in package that contributes additional concrete
 *   `CommunicativeFunction` subclasses. Realised through UML 2.5.1 §12.3
 *   `PackageMerge`: a FunctionPlugin package merges into the standard
 *   CommunicativeFunction package, adding application-specific concrete
 *   functions (e.g., "EscalateToHuman" for customer-service).
 * @ownedAttributes
 *   pluginName             : String [1]
 *   contributedFunctionNames : String [1..*]
 *   contributedDimension     : String [0..1] -- if the contributed functions
 *                                              are dimension-specific, the
 *                                              dimension code; otherwise the
 *                                              functions are general-purpose.
 * @constraints
 *   [non_collision]: contributedFunctionNames->forAll(f |
 *     not StandardCommunicativeFunctionRegistry.includes(f))
 */
export interface IFunctionPlugin {
  readonly pluginName:               string
  readonly contributedFunctionNames: ReadonlyArray<string>
  readonly contributedDimension:     string | undefined
}

// --- 10.3 ISemanticContentPlugin (§10.3) -----------------------------------
/**
 * @standard ISO 24617-2:2020 (2nd ed)
 * @section §10.3
 * @metaclass concrete (PackageMerge realisation)
 * @generalization (none — UML 2.5.1 PackageMerge usage)
 * @definition Plug-in package that contributes a semantic-content schema
 *   referenced by `DialogueAct.semanticContent`. The schema may be drawn from
 *   any well-formed metamodel (RDF, JSON-Schema, XML Schema, OWL); the
 *   plug-in registers the schema's URI for resolution at annotation time.
 * @ownedAttributes
 *   pluginName     : String [1]
 *   schemaUri      : String [1]
 *   schemaFormat   : String [1] -- e.g., "xsd", "owl", "json-schema", "rdfs"
 */
export interface ISemanticContentPlugin {
  readonly pluginName:   string
  readonly schemaUri:    string
  readonly schemaFormat: string
}

// ═══════════════════════════════════════════════════════════════════════════
// Annex A — DiAML XML SERIALISATION
// ═══════════════════════════════════════════════════════════════════════════

// --- A.1 IDiAMLDocument (Annex A.1) ----------------------------------------
/**
 * @standard ISO 24617-2:2020 (2nd ed)
 * @section Annex A.1
 * @metaclass concrete
 * @generalization (none — root XML serialisation Class)
 * @definition Root element of a DiAML XML document. Aggregates one or more
 *   dialogues annotated with the metaclasses declared in §4–§9.
 * @associationEnds
 *   dialogues            : DiAMLDialogue [1..*]
 *   functionalSegments   : FunctionalSegment [0..*]
 *   dialogueActs         : DialogueAct [0..*]
 *   participants         : Participant [0..*]
 *   qualifiers           : Qualifier [0..*]
 *   rhetoricalRelations  : RhetoricalRelation [0..*]
 *   feedbackDependencies : FeedbackDependenceRelation [0..*]
 *   functionalDependencies : FunctionalDependenceRelation [0..*]
 * @ownedAttributes
 *   xmlnsDiAML : String [1] -- the DiAML XML namespace URI
 *   xmlLang    : String [0..1]
 */
export interface IDiAMLDocument {
  readonly xmlnsDiAML:                       string
  readonly xmlLang:                          string | undefined
  readonly dialogueIds:                      ReadonlyArray<DiAMLElementId>
  readonly functionalSegmentIds:             ReadonlyArray<DiAMLElementId>
  readonly dialogueActIds:                   ReadonlyArray<DiAMLElementId>
  readonly participantIds:                   ReadonlyArray<DiAMLElementId>
  readonly qualifierIds:                     ReadonlyArray<DiAMLElementId>
  readonly rhetoricalRelationIds:            ReadonlyArray<DiAMLElementId>
  readonly feedbackDependenceIds:            ReadonlyArray<DiAMLElementId>
  readonly functionalDependenceIds:          ReadonlyArray<DiAMLElementId>
}

// --- A.2 IDiAMLDialogue (Annex A.2) ----------------------------------------
/**
 * @standard ISO 24617-2:2020 (2nd ed)
 * @section Annex A.2
 * @metaclass concrete
 * @generalization (none)
 * @definition One dialogue within a DiAMLDocument. Aggregates ordered turns.
 * @ownedAttributes
 *   xmlId : String [1]
 *   title : String [0..1]
 * @associationEnds
 *   turns : DiAMLTurn [1..*] {ordered}
 */
export interface IDiAMLDialogue {
  readonly xmlId:   DiAMLElementId
  readonly title:   string | undefined
  readonly turnIds: ReadonlyArray<DiAMLElementId>
}

// --- A.3 IDiAMLTurn (Annex A.3) --------------------------------------------
/**
 * @standard ISO 24617-2:2020 (2nd ed)
 * @section Annex A.3
 * @metaclass concrete
 * @generalization (none)
 * @definition One turn within a DiAMLDialogue, attributed to a single
 *   participant. Aggregates ordered utterances.
 * @ownedAttributes
 *   xmlId        : String [1]
 *   participant  : String [1] -- xmlId reference to the speaking Participant
 *   startTime    : String [0..1] -- ISO 8601 timestamp or media offset
 *   endTime      : String [0..1] -- ISO 8601 timestamp or media offset
 * @associationEnds
 *   utterances : DiAMLUtterance [1..*] {ordered}
 */
export interface IDiAMLTurn {
  readonly xmlId:            DiAMLElementId
  readonly participantId:    DiAMLElementId
  readonly startTime:        string | undefined
  readonly endTime:          string | undefined
  readonly utteranceIds:     ReadonlyArray<DiAMLElementId>
}

// --- A.4 IDiAMLUtterance (Annex A.4) ---------------------------------------
/**
 * @standard ISO 24617-2:2020 (2nd ed)
 * @section Annex A.4
 * @metaclass concrete
 * @generalization (none)
 * @definition One utterance within a DiAMLTurn. Carries the raw text (or
 *   transcription) and the references to the FunctionalSegment instances
 *   that span it.
 * @ownedAttributes
 *   xmlId    : String [1]
 *   text     : String [1]
 *   startTime: String [0..1]
 *   endTime  : String [0..1]
 * @associationEnds
 *   functionalSegments : FunctionalSegment [0..*]
 */
export interface IDiAMLUtterance {
  readonly xmlId:                  DiAMLElementId
  readonly text:                   string
  readonly startTime:              string | undefined
  readonly endTime:                string | undefined
  readonly functionalSegmentIds:   ReadonlyArray<DiAMLElementId>
}

// ═══════════════════════════════════════════════════════════════════════════
// CONCRETE BASE CLASSES
//
// Every interface above is paired with a concrete extensible class carrying
// the same name minus the `I` prefix. Downstream consumers extend these
// classes to inject runtime behaviour (validation, serialisation, lookup);
// the interfaces remain the contract that consumers depend on.
//
// All classes are non-abstract (TypeScript permits abstract members only via
// `abstract class`; we keep them concrete with a default `name` getter for
// every CommunicativeFunction subclass so consumers may instantiate them
// directly when minimal payloads suffice).
// ═══════════════════════════════════════════════════════════════════════════

// --- C.1 FunctionalSegment -------------------------------------------------
/** Concrete base class for IFunctionalSegment (§4). */
export class FunctionalSegment implements IFunctionalSegment {
  constructor(
    public readonly xmlId:                 DiAMLElementId,
    public readonly anchor:                string,
    public readonly text:                  string | undefined = undefined,
    public readonly speakerId:             DiAMLElementId | undefined = undefined,
    public readonly carriedDialogueActIds: ReadonlyArray<DiAMLElementId> = [],
  ) {}
}

// --- C.2 Participant -------------------------------------------------------
/** Concrete base class for IParticipant (§5.2). */
export class Participant implements IParticipant {
  constructor(
    public readonly xmlId: DiAMLElementId,
    public readonly name:  string | undefined = undefined,
    public readonly role:  string | undefined = undefined,
  ) {}
}

// --- C.3 DialogueAct -------------------------------------------------------
/** Concrete base class for IDialogueAct (§5). */
export class DialogueAct implements IDialogueAct {
  constructor(
    public readonly xmlId:                     DiAMLElementId,
    public readonly targetFunctionalSegmentId: DiAMLElementId,
    public readonly senderParticipantId:       DiAMLElementId,
    public readonly addresseeParticipantIds:   ReadonlyArray<DiAMLElementId>,
    public readonly communicativeFunctionId:   DiAMLElementId,
    public readonly dimension:                 DimensionEnumerationLiteral,
    public readonly qualifierIds:              ReadonlyArray<DiAMLElementId> = [],
    public readonly feedbackDependenceId:      DiAMLElementId | undefined = undefined,
    public readonly functionalDependenceId:    DiAMLElementId | undefined = undefined,
    public readonly semanticContentId:         DiAMLElementId | undefined = undefined,
  ) {}

  isInformationProviding(): boolean {
    // Concrete consumers override this with a registry lookup that checks
    // whether `communicativeFunctionId` resolves to an IInformingFunction or
    // IAnswerFunction subtype. Default returns false so trivial DialogueAct
    // instances do not mis-classify themselves.
    return false
  }

  isCommissive(): boolean {
    return false
  }

  isDirective(): boolean {
    return false
  }

  isFeedback(): boolean {
    return (
      this.dimension === DimensionEnumeration.AutoFeedback ||
      this.dimension === DimensionEnumeration.AlloFeedback
    )
  }
}

// --- C.4 CommunicativeFunction (concrete base) -----------------------------
/** Concrete base class for ICommunicativeFunction (§6). */
export class CommunicativeFunction implements ICommunicativeFunction {
  constructor(
    public readonly name:      string,
    public readonly dimension: DimensionEnumerationLiteral | undefined = undefined,
  ) {}
}

// Concrete general-purpose function bases (one class per leaf metaclass).
// Each class fixes its `name` to the leaf identifier; `dimension` stays
// `undefined` because general-purpose functions are dimension-agnostic.

export class PropositionalQuestion         extends CommunicativeFunction { constructor() { super('PropositionalQuestion') } }
export class CheckQuestion                 extends CommunicativeFunction { constructor() { super('CheckQuestion') } }
export class PosiCheckQuestion             extends CommunicativeFunction { constructor() { super('PosiCheckQuestion') } }
export class NegaCheckQuestion             extends CommunicativeFunction { constructor() { super('NegaCheckQuestion') } }
export class SetQuestion                   extends CommunicativeFunction { constructor() { super('SetQuestion') } }
export class ChoiceQuestion                extends CommunicativeFunction { constructor() { super('ChoiceQuestion') } }
export class AlternativesQuestion          extends CommunicativeFunction { constructor() { super('AlternativesQuestion') } }

export class Inform                        extends CommunicativeFunction { constructor() { super('Inform') } }
export class Agreement                     extends CommunicativeFunction { constructor() { super('Agreement') } }
export class Disagreement                  extends CommunicativeFunction { constructor() { super('Disagreement') } }
export class Correction                    extends CommunicativeFunction { constructor() { super('Correction') } }
export class UncertainInform               extends CommunicativeFunction { constructor() { super('UncertainInform') } }

export class Answer                        extends CommunicativeFunction { constructor() { super('Answer') } }
export class PropositionalAnswer           extends CommunicativeFunction { constructor() { super('PropositionalAnswer') } }
export class Confirm                       extends CommunicativeFunction { constructor() { super('Confirm') } }
export class Disconfirm                    extends CommunicativeFunction { constructor() { super('Disconfirm') } }
export class SetAnswer                     extends CommunicativeFunction { constructor() { super('SetAnswer') } }
export class UncertainPropositionalAnswer  extends CommunicativeFunction { constructor() { super('UncertainPropositionalAnswer') } }
export class UncertainConfirm              extends CommunicativeFunction { constructor() { super('UncertainConfirm') } }
export class UncertainDisconfirm           extends CommunicativeFunction { constructor() { super('UncertainDisconfirm') } }
export class UncertainSetAnswer            extends CommunicativeFunction { constructor() { super('UncertainSetAnswer') } }

export class Offer                         extends CommunicativeFunction { constructor() { super('Offer') } }
export class Promise_                      extends CommunicativeFunction { constructor() { super('Promise') } }
export class AddressRequest                extends CommunicativeFunction { constructor() { super('AddressRequest') } }
export class AcceptRequest                 extends CommunicativeFunction { constructor() { super('AcceptRequest') } }
export class DeclineRequest                extends CommunicativeFunction { constructor() { super('DeclineRequest') } }
export class AddressSuggestion             extends CommunicativeFunction { constructor() { super('AddressSuggestion') } }
export class AcceptSuggestion              extends CommunicativeFunction { constructor() { super('AcceptSuggestion') } }
export class DeclineSuggestion             extends CommunicativeFunction { constructor() { super('DeclineSuggestion') } }

export class Request_                      extends CommunicativeFunction { constructor() { super('Request') } }
export class IndirectRequest               extends CommunicativeFunction { constructor() { super('IndirectRequest') } }
export class Instruct                      extends CommunicativeFunction { constructor() { super('Instruct') } }
export class AddressOffer                  extends CommunicativeFunction { constructor() { super('AddressOffer') } }
export class AcceptOffer                   extends CommunicativeFunction { constructor() { super('AcceptOffer') } }
export class DeclineOffer                  extends CommunicativeFunction { constructor() { super('DeclineOffer') } }
export class Suggestion                    extends CommunicativeFunction { constructor() { super('Suggestion') } }

// Concrete dimension-specific function bases — `dimension` is fixed.

// AutoFeedback dimension
export class AutoAttentionPositive       extends CommunicativeFunction { constructor() { super('AutoAttentionPositive',      DimensionEnumeration.AutoFeedback) } }
export class AutoPerceptionPositive      extends CommunicativeFunction { constructor() { super('AutoPerceptionPositive',     DimensionEnumeration.AutoFeedback) } }
export class AutoInterpretationPositive  extends CommunicativeFunction { constructor() { super('AutoInterpretationPositive', DimensionEnumeration.AutoFeedback) } }
export class AutoEvaluationPositive      extends CommunicativeFunction { constructor() { super('AutoEvaluationPositive',     DimensionEnumeration.AutoFeedback) } }
export class AutoExecutionPositive       extends CommunicativeFunction { constructor() { super('AutoExecutionPositive',      DimensionEnumeration.AutoFeedback) } }
export class AutoOverallPositive         extends CommunicativeFunction { constructor() { super('AutoOverallPositive',        DimensionEnumeration.AutoFeedback) } }
export class AutoAttentionNegative       extends CommunicativeFunction { constructor() { super('AutoAttentionNegative',      DimensionEnumeration.AutoFeedback) } }
export class AutoPerceptionNegative      extends CommunicativeFunction { constructor() { super('AutoPerceptionNegative',     DimensionEnumeration.AutoFeedback) } }
export class AutoInterpretationNegative  extends CommunicativeFunction { constructor() { super('AutoInterpretationNegative', DimensionEnumeration.AutoFeedback) } }
export class AutoEvaluationNegative      extends CommunicativeFunction { constructor() { super('AutoEvaluationNegative',     DimensionEnumeration.AutoFeedback) } }
export class AutoExecutionNegative       extends CommunicativeFunction { constructor() { super('AutoExecutionNegative',      DimensionEnumeration.AutoFeedback) } }
export class AutoOverallNegative         extends CommunicativeFunction { constructor() { super('AutoOverallNegative',        DimensionEnumeration.AutoFeedback) } }

// AlloFeedback dimension
export class AlloPerceptionPositive      extends CommunicativeFunction { constructor() { super('AlloPerceptionPositive',     DimensionEnumeration.AlloFeedback) } }
export class AlloInterpretationPositive  extends CommunicativeFunction { constructor() { super('AlloInterpretationPositive', DimensionEnumeration.AlloFeedback) } }
export class AlloEvaluationPositive      extends CommunicativeFunction { constructor() { super('AlloEvaluationPositive',     DimensionEnumeration.AlloFeedback) } }
export class AlloExecutionPositive       extends CommunicativeFunction { constructor() { super('AlloExecutionPositive',      DimensionEnumeration.AlloFeedback) } }
export class AlloOverallPositive         extends CommunicativeFunction { constructor() { super('AlloOverallPositive',        DimensionEnumeration.AlloFeedback) } }
export class AlloAttentionNegative       extends CommunicativeFunction { constructor() { super('AlloAttentionNegative',      DimensionEnumeration.AlloFeedback) } }
export class AlloPerceptionNegative      extends CommunicativeFunction { constructor() { super('AlloPerceptionNegative',     DimensionEnumeration.AlloFeedback) } }
export class AlloInterpretationNegative  extends CommunicativeFunction { constructor() { super('AlloInterpretationNegative', DimensionEnumeration.AlloFeedback) } }
export class AlloEvaluationNegative      extends CommunicativeFunction { constructor() { super('AlloEvaluationNegative',     DimensionEnumeration.AlloFeedback) } }
export class AlloExecutionNegative       extends CommunicativeFunction { constructor() { super('AlloExecutionNegative',      DimensionEnumeration.AlloFeedback) } }
export class AttentionElicitation        extends CommunicativeFunction { constructor() { super('AttentionElicitation',       DimensionEnumeration.AlloFeedback) } }
export class PerceptionElicitation       extends CommunicativeFunction { constructor() { super('PerceptionElicitation',      DimensionEnumeration.AlloFeedback) } }
export class InterpretationElicitation   extends CommunicativeFunction { constructor() { super('InterpretationElicitation',  DimensionEnumeration.AlloFeedback) } }
export class EvaluationElicitation       extends CommunicativeFunction { constructor() { super('EvaluationElicitation',      DimensionEnumeration.AlloFeedback) } }
export class ExecutionElicitation        extends CommunicativeFunction { constructor() { super('ExecutionElicitation',       DimensionEnumeration.AlloFeedback) } }

// TurnManagement dimension
export class TurnAccept   extends CommunicativeFunction { constructor() { super('TurnAccept',   DimensionEnumeration.TurnManagement) } }
export class TurnGrab     extends CommunicativeFunction { constructor() { super('TurnGrab',     DimensionEnumeration.TurnManagement) } }
export class TurnTake     extends CommunicativeFunction { constructor() { super('TurnTake',     DimensionEnumeration.TurnManagement) } }
export class TurnKeep     extends CommunicativeFunction { constructor() { super('TurnKeep',     DimensionEnumeration.TurnManagement) } }
export class TurnAssign   extends CommunicativeFunction { constructor() { super('TurnAssign',   DimensionEnumeration.TurnManagement) } }
export class TurnRelease  extends CommunicativeFunction { constructor() { super('TurnRelease',  DimensionEnumeration.TurnManagement) } }

// TimeManagement dimension
export class Stalling extends CommunicativeFunction { constructor() { super('Stalling', DimensionEnumeration.TimeManagement) } }
export class Pausing  extends CommunicativeFunction { constructor() { super('Pausing',  DimensionEnumeration.TimeManagement) } }

// DiscourseStructuring dimension
export class Opening                 extends CommunicativeFunction { constructor() { super('Opening',                DimensionEnumeration.DiscourseStructuring) } }
export class PreClosing              extends CommunicativeFunction { constructor() { super('PreClosing',             DimensionEnumeration.DiscourseStructuring) } }
export class TopicIntroduction       extends CommunicativeFunction { constructor() { super('TopicIntroduction',      DimensionEnumeration.DiscourseStructuring) } }
export class TopicShiftAnnouncement  extends CommunicativeFunction { constructor() { super('TopicShiftAnnouncement', DimensionEnumeration.DiscourseStructuring) } }
export class TopicShift              extends CommunicativeFunction { constructor() { super('TopicShift',             DimensionEnumeration.DiscourseStructuring) } }

// OwnCommunicationManagement dimension
export class ErrorSignaling extends CommunicativeFunction { constructor() { super('ErrorSignaling', DimensionEnumeration.OwnCommunicationManagement) } }
export class Retraction     extends CommunicativeFunction { constructor() { super('Retraction',     DimensionEnumeration.OwnCommunicationManagement) } }
export class SelfCorrection extends CommunicativeFunction { constructor() { super('SelfCorrection', DimensionEnumeration.OwnCommunicationManagement) } }

// PartnerCommunicationManagement dimension
export class Completion         extends CommunicativeFunction { constructor() { super('Completion',         DimensionEnumeration.PartnerCommunicationManagement) } }
export class CorrectMisspeaking extends CommunicativeFunction { constructor() { super('CorrectMisspeaking', DimensionEnumeration.PartnerCommunicationManagement) } }

// SocialObligationsManagement dimension
export class InitialGreeting          extends CommunicativeFunction { constructor() { super('InitialGreeting',         DimensionEnumeration.SocialObligationsManagement) } }
export class ReturnGreeting           extends CommunicativeFunction { constructor() { super('ReturnGreeting',          DimensionEnumeration.SocialObligationsManagement) } }
export class InitialSelfIntroduction  extends CommunicativeFunction { constructor() { super('InitialSelfIntroduction', DimensionEnumeration.SocialObligationsManagement) } }
export class ReturnSelfIntroduction   extends CommunicativeFunction { constructor() { super('ReturnSelfIntroduction',  DimensionEnumeration.SocialObligationsManagement) } }
export class Apology                  extends CommunicativeFunction { constructor() { super('Apology',                 DimensionEnumeration.SocialObligationsManagement) } }
export class ApologyDownplay          extends CommunicativeFunction { constructor() { super('ApologyDownplay',         DimensionEnumeration.SocialObligationsManagement) } }
export class Thanking                 extends CommunicativeFunction { constructor() { super('Thanking',                DimensionEnumeration.SocialObligationsManagement) } }
export class ThankingDownplay         extends CommunicativeFunction { constructor() { super('ThankingDownplay',        DimensionEnumeration.SocialObligationsManagement) } }
export class InitialGoodbye           extends CommunicativeFunction { constructor() { super('InitialGoodbye',          DimensionEnumeration.SocialObligationsManagement) } }
export class ReturnGoodbye            extends CommunicativeFunction { constructor() { super('ReturnGoodbye',           DimensionEnumeration.SocialObligationsManagement) } }

// --- C.5 Qualifier classes -------------------------------------------------
/** Concrete base class for ICertaintyQualifier (§8.1). */
export class CertaintyQualifier implements ICertaintyQualifier {
  constructor(
    public readonly xmlId: DiAMLElementId,
    public readonly value: CertaintyQualifierEnumerationLiteral,
  ) {}
}

/** Concrete base class for IConditionalityQualifier (§8.2). */
export class ConditionalityQualifier implements IConditionalityQualifier {
  constructor(
    public readonly xmlId: DiAMLElementId,
    public readonly value: ConditionalityQualifierEnumerationLiteral,
  ) {}
}

/** Concrete base class for IPartialityQualifier (§8.3). */
export class PartialityQualifier implements IPartialityQualifier {
  constructor(
    public readonly xmlId: DiAMLElementId,
    public readonly value: PartialityQualifierEnumerationLiteral,
  ) {}
}

/** Concrete base class for ISentimentQualifier (§8.4). */
export class SentimentQualifier implements ISentimentQualifier {
  constructor(
    public readonly xmlId: DiAMLElementId,
    public readonly value: SentimentQualifierEnumerationLiteral,
  ) {}
}

// --- C.6 Relation classes --------------------------------------------------
/** Concrete base class for IRhetoricalRelation (§9.1). */
export class RhetoricalRelation implements IRhetoricalRelation {
  constructor(
    public readonly xmlId:                     DiAMLElementId,
    public readonly sourceFunctionalSegmentId: DiAMLElementId,
    public readonly targetFunctionalSegmentId: DiAMLElementId,
    public readonly relType:                   RhetoricalRelationEnumerationLiteral,
  ) {}
}

/** Concrete base class for IFeedbackDependenceRelation (§9.2). */
export class FeedbackDependenceRelation implements IFeedbackDependenceRelation {
  constructor(
    public readonly xmlId:               DiAMLElementId,
    public readonly sourceDialogueActId: DiAMLElementId,
    public readonly targetDialogueActId: DiAMLElementId,
  ) {}
}

/** Concrete base class for IFunctionalDependenceRelation (§9.3). */
export class FunctionalDependenceRelation implements IFunctionalDependenceRelation {
  constructor(
    public readonly xmlId:               DiAMLElementId,
    public readonly sourceDialogueActId: DiAMLElementId,
    public readonly targetDialogueActId: DiAMLElementId,
  ) {}
}

// --- C.7 Plug-in classes ---------------------------------------------------
/** Concrete base class for IDimensionPlugin (§10.1). */
export class DimensionPlugin implements IDimensionPlugin {
  constructor(
    public readonly pluginName:            string,
    public readonly contributedDimensions: ReadonlyArray<string>,
  ) {}
}

/** Concrete base class for IFunctionPlugin (§10.2). */
export class FunctionPlugin implements IFunctionPlugin {
  constructor(
    public readonly pluginName:               string,
    public readonly contributedFunctionNames: ReadonlyArray<string>,
    public readonly contributedDimension:     string | undefined = undefined,
  ) {}
}

/** Concrete base class for ISemanticContentPlugin (§10.3). */
export class SemanticContentPlugin implements ISemanticContentPlugin {
  constructor(
    public readonly pluginName:   string,
    public readonly schemaUri:    string,
    public readonly schemaFormat: string,
  ) {}
}

// --- C.8 DiAML XML serialisation classes -----------------------------------
/** Concrete base class for IDiAMLDocument (Annex A.1). */
export class DiAMLDocument implements IDiAMLDocument {
  constructor(
    public readonly xmlnsDiAML:               string,
    public readonly dialogueIds:              ReadonlyArray<DiAMLElementId>,
    public readonly functionalSegmentIds:     ReadonlyArray<DiAMLElementId>,
    public readonly dialogueActIds:           ReadonlyArray<DiAMLElementId>,
    public readonly participantIds:           ReadonlyArray<DiAMLElementId>,
    public readonly qualifierIds:             ReadonlyArray<DiAMLElementId>,
    public readonly rhetoricalRelationIds:    ReadonlyArray<DiAMLElementId>,
    public readonly feedbackDependenceIds:    ReadonlyArray<DiAMLElementId>,
    public readonly functionalDependenceIds:  ReadonlyArray<DiAMLElementId>,
    public readonly xmlLang:                  string | undefined = undefined,
  ) {}
}

/** Concrete base class for IDiAMLDialogue (Annex A.2). */
export class DiAMLDialogue implements IDiAMLDialogue {
  constructor(
    public readonly xmlId:   DiAMLElementId,
    public readonly turnIds: ReadonlyArray<DiAMLElementId>,
    public readonly title:   string | undefined = undefined,
  ) {}
}

/** Concrete base class for IDiAMLTurn (Annex A.3). */
export class DiAMLTurn implements IDiAMLTurn {
  constructor(
    public readonly xmlId:         DiAMLElementId,
    public readonly participantId: DiAMLElementId,
    public readonly utteranceIds:  ReadonlyArray<DiAMLElementId>,
    public readonly startTime:     string | undefined = undefined,
    public readonly endTime:       string | undefined = undefined,
  ) {}
}

/** Concrete base class for IDiAMLUtterance (Annex A.4). */
export class DiAMLUtterance implements IDiAMLUtterance {
  constructor(
    public readonly xmlId:                DiAMLElementId,
    public readonly text:                 string,
    public readonly functionalSegmentIds: ReadonlyArray<DiAMLElementId> = [],
    public readonly startTime:            string | undefined = undefined,
    public readonly endTime:              string | undefined = undefined,
  ) {}
}

// ═══════════════════════════════════════════════════════════════════════════
// END OF @amlhubs/iso-24617-2 — DiAML Metamodel
// ═══════════════════════════════════════════════════════════════════════════
