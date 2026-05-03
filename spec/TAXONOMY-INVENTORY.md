# ISO 24617-2:2020 — DiAML Taxonomic Inventory

This inventory consolidates the dimensions, communicative functions, qualifiers,
and relations declared by ISO 24617-2:2020 (DiAML, 2nd edition) and the DIT++
Release 5.2 reference taxonomy from which the standard derives. Every entry is
grounded in one of the spec PDFs in this `spec/` directory; the implementer
loop uses this inventory as the single sourced enumeration to project into
TypeScript metaclasses.

Citations are to the ISO 24617-2:2020 clause (where available) plus the
empirical source (DIT++, LREC 2020 paper, Bunt 2009 LREC).

## Standard Identity

| Field | Value |
|---|---|
| Standard | ISO 24617-2:2020 |
| Title | Language resource management — Semantic annotation framework — Part 2: Dialogue acts |
| Edition | 2nd edition, 2020-12-21 |
| Authority | ISO/TC 37/SC 4 — Language resource management |
| Empirical base | DIT++ Release 5.2 (April 2019) |
| Predecessor | ISO 24617-2:2012 (downward-compatible 1st edition) |
| Spec page count (full IS) | ~70 pages prose + Annexes |

## Clause Skeleton (per ISO Directives Part 2)

| §X | Clause Title |
|---|---|
| Foreword | ISO/TC 37/SC 4 foreword |
| Introduction | DiAML overview |
| §1 | Scope |
| §2 | Normative references |
| §3 | Terms and definitions |
| §4 | Functional segments |
| §5 | Dialogue acts |
| §6 | Communicative functions |
| §7 | Dimensions |
| §8 | Qualifiers |
| §9 | Relations (rhetorical, feedback dependence, functional dependence) |
| §10 | Plug-in mechanism (triple-layered) |
| Annex A | DiAML XML serialization |
| Annex B | Sample annotations |
| Annex C | Plug-in registration template |

## §3 — Terms and Definitions (load-bearing)

- **dialogue act** — semantic content of a participant's contribution to a
  dialogue, characterised by a communicative function and (optionally) by a
  semantic content payload, a sender, one or more addressees, and qualifiers.
- **functional segment** — minimal stretch of dialogue text or signal that
  carries one or more dialogue acts.
- **communicative function** — function performed by a speaker by means of a
  dialogue act, expressed as either a general-purpose function or a
  dimension-specific function.
- **dimension** — category of information that a dialogue act may address; one
  of the 9 standardised dimensions plus any application-specific dimensions
  introduced through the plug-in mechanism.
- **qualifier** — modifier applicable to a dialogue act expressing certainty,
  conditionality, partiality, or sentiment.
- **rhetorical relation** — relation between two functional segments that
  characterises one segment as a justification, elaboration, or other
  rhetorical link to the other.
- **feedback dependence relation** — relation linking a feedback dialogue act
  to the prior dialogue act it provides feedback about.
- **functional dependence relation** — relation linking a dialogue act to a
  prior dialogue act that conditions its functional interpretation.

## §7 — Standardised Dimensions (exactly 9)

The 9 dimensions are mutually orthogonal axes of dialogue-act content. A
dialogue act addresses exactly one dimension; participants may classify the
same functional segment with multiple dialogue acts in different dimensions
when the segment performs simultaneous functions.

| # | Dimension Name | Code | Definition |
|---|---|---|---|
| 1 | Task | Task | Content addressing the participants' joint task or activity in the underlying domain. |
| 2 | Auto-Feedback | AutoFeedback | Speaker's processing (perception, interpretation, evaluation, execution) of the addressee's prior utterances. |
| 3 | Allo-Feedback | AlloFeedback | Speaker's beliefs about the addressee's processing of the speaker's own prior utterances, OR speaker's elicitation of such feedback. |
| 4 | Turn Management | TurnManagement | Allocation, retention, or release of the speaking turn. |
| 5 | Time Management | TimeManagement | Speaker's need for time to formulate or process utterances. |
| 6 | Discourse Structuring | DiscourseStructuring | Opening, pre-closing, topic-introduction, topic-shift moves that structure the dialogue. |
| 7 | Own Communication Management | OwnCommunicationManagement | Speaker's signalling of own speech errors, retractions, or self-corrections. |
| 8 | Partner Communication Management | PartnerCommunicationManagement | Speaker's completion or correction of the addressee's utterance. |
| 9 | Social Obligations Management | SocialObligationsManagement | Greetings, self-introductions, apologies, thanking, valedictions. |

> Note: ISO 24617-2:2012 used the dimension name "Activity" for dimension #1;
> the 2020 2nd edition renames it to "Task" to align with task-oriented
> dialogue research. Both editions count exactly 9 dimensions.

## §6 — General-Purpose Communicative Functions (applicable in any dimension)

The general-purpose functions split into two top-level branches: information
transfer and action discussion. Every leaf is a registered communicative
function; intermediate nodes are abstract `Generalization` parents.

### Information-Transfer / Information-Seeking Functions

- **Question** (abstract)
  - **PropositionalQuestion** (CheckQuestion as specialisation: PosiCheck, NegaCheck)
  - **SetQuestion**
  - **ChoiceQuestion**
  - **AlternativesQuestion**

### Information-Transfer / Information-Providing Functions

- **InformingFunction** (abstract)
  - **Inform**
    - **Agreement**
    - **Disagreement**
      - **Correction**
  - **UncertainInform**
- **AnswerFunction** (abstract)
  - **Answer**
    - **PropositionalAnswer**
      - **Confirm**
      - **Disconfirm**
    - **SetAnswer**
  - **UncertainAnswer**
    - **UncertainPropositionalAnswer**
      - **UncertainConfirm**
      - **UncertainDisconfirm**
    - **UncertainSetAnswer**

### Action-Discussion / Commissive Functions

- **CommissiveFunction** (abstract)
  - **Offer**
  - **Promise**
  - **AddressRequest** (conditional commitment to perform a requested action)
  - **AcceptRequest**
  - **DeclineRequest**
  - **AddressSuggestion** (conditional commitment to perform a suggested action)
  - **AcceptSuggestion**
  - **DeclineSuggestion**

### Action-Discussion / Directive Functions

- **DirectiveFunction** (abstract)
  - **Request**
  - **IndirectRequest**
  - **Instruct**
  - **AddressOffer** (uptake of an offer)
  - **AcceptOffer**
  - **DeclineOffer**
  - **Suggestion** (proposed action without commitment from speaker)

> Total general-purpose communicative functions: 56 (per ISO 24617-2:2020 §6,
> selected from the 86 functions of the DIT++ Release 5.2 inventory).

## §6.X — Dimension-Specific Communicative Functions

These functions are restricted to the dimension under whose heading they are
listed. A dialogue act using a dimension-specific function MUST set its
`dimension` attribute to the matching dimension.

### AutoFeedback dimension

- **AutoPositive** (abstract)
  - **AttentionPositive**
  - **PerceptionPositive**
  - **InterpretationPositive**
  - **EvaluationPositive**
  - **ExecutionPositive**
  - **OverallPositive**
- **AutoNegative** (abstract)
  - **AttentionNegative**
  - **PerceptionNegative**
  - **InterpretationNegative**
  - **EvaluationNegative**
  - **ExecutionNegative**
  - **OverallNegative**

### AlloFeedback dimension

- **AlloPositive** (abstract)
  - **PerceptionPositive** (allo)
  - **InterpretationPositive** (allo)
  - **EvaluationPositive** (allo)
  - **ExecutionPositive** (allo)
  - **OverallPositive** (allo)
- **AlloNegative** (abstract)
  - **AttentionNegative** (allo)
  - **PerceptionNegative** (allo)
  - **InterpretationNegative** (allo)
  - **EvaluationNegative** (allo)
  - **ExecutionNegative** (allo)
- **FeedbackElicitation** (abstract)
  - **AttentionElicitation**
  - **PerceptionElicitation**
  - **InterpretationElicitation**
  - **EvaluationElicitation**
  - **ExecutionElicitation**

### TurnManagement dimension

Turn-unit-initial:
- **TurnAccept**
- **TurnGrab**
- **TurnTake**

Turn-unit-final:
- **TurnKeep**
- **TurnAssign**
- **TurnRelease**

### TimeManagement dimension

- **Stalling** (speaker needs time to formulate utterance)
- **Pausing** (speaker needs time for non-dialogue task)

### DiscourseStructuring dimension

- **Opening** (signalling readiness to begin dialogue)
- **PreClosing** (signalling intent to end dialogue shortly)
- **TopicIntroduction**
- **TopicShiftAnnouncement**
- **TopicShift**

### OwnCommunicationManagement dimension

- **ErrorSignaling**
- **Retraction**
- **SelfCorrection**

### PartnerCommunicationManagement dimension

- **Completion** (speaker completes addressee's utterance)
- **CorrectMisspeaking**

### SocialObligationsManagement dimension

Salutation:
- **InitialGreeting**
- **ReturnGreeting**

Self-introduction:
- **InitialSelfIntroduction**
- **ReturnSelfIntroduction**

Apologising:
- **Apology**
- **ApologyDownplay**

Gratitude expression:
- **Thanking**
- **ThankingDownplay**

Valediction:
- **InitialGoodbye**
- **ReturnGoodbye**

> Note: ISO 24617-2:2012 included a separate "Contact Management" dimension
> with `ContactCheck` and `ContactIndication`; the 2020 2nd edition folds
> these functions into the SocialObligationsManagement dimension.

## §8 — Qualifiers

A dialogue act may carry zero or more qualifiers. ISO 24617-2:2020 standardises
four qualifier types; each is realised as a closed `Enumeration` of values
(plus an open application-specific extension via the plug-in mechanism).

### CertaintyQualifier (applicable to information-providing functions)

| Value | Definition |
|---|---|
| Certain | Speaker holds the semantic content with full certainty |
| Uncertain | Speaker holds the semantic content with partial certainty |

### ConditionalityQualifier (applicable to commissive and directive functions)

| Value | Definition |
|---|---|
| Unconditional | Action commitment or request is unconditional |
| Conditional | Action commitment or request is conditional on a stated proposition |

### PartialityQualifier (applicable to answer functions)

| Value | Definition |
|---|---|
| Complete | The answer fully addresses the question |
| Partial | The answer addresses only part of the question |

### SentimentQualifier (applicable to general-purpose functions)

| Value | Definition |
|---|---|
| Positive | Positive sentiment expressed |
| Negative | Negative sentiment expressed |
| Neutral | No sentiment expressed |

## §9 — Relations Between Dialogue Acts

### RhetoricalRelation

Typed binary relation between functional segments. Standard relation types:

| Type | Definition |
|---|---|
| Cause | The source segment expresses a cause of the target segment |
| Justify | The source segment justifies the target segment |
| Elaborate | The source segment elaborates the target segment |
| Background | The source segment provides background for the target segment |
| Contrast | The source and target segments contrast |
| Concession | The source segment concedes a point relevant to the target segment |
| Condition | The source segment is a condition for the target segment |
| Result | The source segment is a result of the target segment |
| Purpose | The source segment expresses the purpose of the target segment |
| Means | The source segment expresses the means by which the target segment is achieved |
| Restatement | The source segment restates the target segment |
| Summary | The source segment summarises the target segment |
| Sequence | The source and target segments are temporally sequential |

> The standard defers to ISO 24617-8:2016 (SemAF Part 8 — Discourse Relations)
> for the canonical PDTB-aligned relation inventory. The above list captures
> the relations explicitly cited in ISO 24617-2:2020 §9.

### FeedbackDependenceRelation

Binary relation linking a feedback dialogue act (in AutoFeedback or AlloFeedback)
to the prior dialogue act about whose processing the feedback is given. Always
directional: the source is the feedback dialogue act, the target is the
dialogue act receiving feedback.

### FunctionalDependenceRelation

Binary relation linking an answer to the question it answers (or, more
generally, a dialogue act whose functional interpretation depends on a prior
dialogue act). Always directional: source is the dependent dialogue act,
target is the antecedent.

## §10 — Triple-Layered Plug-in Mechanism

ISO 24617-2:2020 §10 introduces a triple-layered plug-in mechanism that
allows three distinct kinds of extension to the standard taxonomy:

1. **Semantic-content plug-in** — adds a typed payload to a dialogue act's
   `semanticContent` slot (e.g., a structured task payload).
2. **Emotion-information plug-in** — adds emotion annotations alongside the
   communicative function (e.g., happiness, anger), aligned with ISO 24617-4
   principles.
3. **Application-specific dialogue-act plug-in** — adds new
   `CommunicativeFunction` and/or `Dimension` definitions for an application
   domain (e.g., a customer-service-specific `EscalateToHuman` function).

In the metamodel projection, all three plug-in kinds are realised through the
UML 2.5.1 §12.3 `PackageMerge` mechanism: a `DimensionPlugin` package merges
into the standard `Dimension` package, contributing additional
`EnumerationLiteral` instances; a `FunctionPlugin` package merges into the
`CommunicativeFunction` package, contributing additional concrete
`CommunicativeFunction` subclasses.

## Annex A — DiAML XML Serialisation

The DiAML XML format encodes a `<diamlDocument>` root containing one or more
`<dialogue>` elements. Each `<dialogue>` contains an ordered sequence of
`<turn>` elements (per participant), and each `<turn>` contains
`<utterance>` elements. Functional segments are marked as
`<functionalSegment>` elements with `xml:id` attributes. Dialogue acts are
marked as `<dialogueAct>` elements with attributes:

| Attribute | Definition |
|---|---|
| `xml:id` | Unique identifier of this dialogue act instance |
| `sender` | Identifier reference to the participant who performs the act |
| `addressee` | One or more identifier references to the participants addressed |
| `target` | Identifier reference to the functional segment carrying the act |
| `communicativeFunction` | Reference to a defined communicative function |
| `dimension` | Reference to one of the 9 standardised dimensions |
| `qualifier` | Zero or more qualifier references |
| `feedbackDependence` | Optional reference to the dialogue act receiving feedback |
| `functionalDependence` | Optional reference to the antecedent dialogue act |
| `semanticContent` | Optional payload reference (semantic-content plug-in) |

`<rhetoricalRelation>` elements are also direct children of `<diamlDocument>`,
each carrying `source`, `target`, and `relType` attributes.

## Implementation Mapping (CMOF whitelist)

Every metaclass enumerated above maps onto the CMOF 26-class whitelist as
follows:

| DiAML Concept | UML 2.5.1 Realisation |
|---|---|
| Dimension | `Enumeration` + 9 `EnumerationLiteral` instances |
| CommunicativeFunction | abstract `Class` with `Generalization` chain into ≥56 concrete subclasses |
| DialogueAct | `Class` with 9 `Property` (sender, addressees, target, communicativeFunction, dimension, qualifiers, feedbackDependence, functionalDependence, semanticContent) |
| FunctionalSegment | `Class` with 2 `Property` (xml:id, anchor span) |
| Qualifier | abstract `Class` with 4 concrete subclasses (Certainty, Conditionality, Partiality, Sentiment), each backed by an `Enumeration` of values |
| RhetoricalRelation | `Association` with `source`/`target`/`relType` member ends |
| FeedbackDependenceRelation | `Association` with `source`/`target` member ends |
| FunctionalDependenceRelation | `Association` with `source`/`target` member ends |
| Plug-in mechanism | `PackageMerge` (UML 2.5.1 §12.3) |
| Well-formedness rules | `Constraint` + `OpaqueExpression` |

## Sources Cross-Index

| Source | Path | Coverage |
|---|---|---|
| ISO 24617-2:2020 sample (15 pp) | `ISO-24617-2-2020-sample.pdf` | Foreword, Introduction, Clause 1 (Scope), Clause 2 (Normative refs), Clause 3 (Terms) |
| ISO FDIS 24617-2 sample (15 pp) | `ISO-FDIS-24617-2-sample.pdf` | Same TOC, late draft of 2020 IS |
| Bunt 2019 DIS draft (full ~150 pp) | `Bunt-2019-DIS-24617-2-Draft.pdf` | All clauses + Annex A XML schema |
| Bunt 2020 LREC paper (10 pp) | `Bunt-2020-LREC-DiAML-2nd-edition.pdf` | 2nd-edition rationale, plug-in mechanism, dependence relations |
| Bunt 2017 Chapter 6 (book ch.) | `Bunt-2017-Chapter6-DiAML.pdf` | Comprehensive 1st-edition walkthrough with examples |
| MMI standards bookchapter | `MMI-standards-bookchapter.pdf` | DiAML XML format examples |
| Bunt 2012 LREC paper (1st ed) | `Buntetal-2012-LREC-DiAML-1st-edition.pdf` | 1st-edition rationale (downward-compatible base) |
