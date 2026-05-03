# @amlhubs/iso-24617-2 — DiAML as a Typed Metamodel

## Identity

| Field | Value |
|---|---|
| Standard | ISO 24617-2:2020 — Language resource management — Semantic annotation framework — Part 2: Dialogue acts |
| Edition | 2nd edition, 2020-12-21 (downward-compatible with the 2012 1st edition) |
| Authority | [ISO/TC 37/SC 4 — Language resource management](https://www.iso.org/committee/297592.html) |
| Spec URL | [iso.org/standard/76443.html](https://www.iso.org/standard/76443.html) |
| Open preprint | Bunt et al. — *Dialogue Act Annotation with the ISO 24617-2 Standard*, LREC 2020 — [aclanthology.org/2020.lrec-1.69](https://aclanthology.org/2020.lrec-1.69.pdf) |
| Spec format | XML schema + prose PDF + UML class diagrams |
| npm Package | `@amlhubs/iso-24617-2` |
| npm Version | `0.0.1` |
| Peer Dependencies | `@amlhubs/uml`, `@amlhubs/ocl`, `@amlhubs/sbvr` |
| License | MIT |

## Abstract

ISO 24617-2:2020 is the only normative international standard for dialogue act annotation. Standardised by ISO/TC 37/SC 4 (Language resource management), the 2nd edition consolidates the 2012 1st edition with the empirical experience accumulated across four DialogBank projects (English, Dutch, Mandarin, Hindi-English code-mixed) and the [TRINDI Tick](https://aclanthology.org/2020.lrec-1.69.pdf) feedback-modelling track. The standard defines DiAML — *Dialogue Act Markup Language* — a typed annotation taxonomy that decomposes every utterance in a recorded or synthetic dialogue into one or more `DialogueAct` instances, each anchored to a `FunctionalSegment`, classified by a `CommunicativeFunction` along exactly one `Dimension` of the 9-dimension taxonomy, optionally constrained by a `Qualifier`, and optionally linked to other dialogue acts through typed `RhetoricalRelation` and `FeedbackDependenceRelation` edges.

The `@amlhubs/iso-24617-2` npm package projects every metaclass declared in ISO 24617-2:2020 onto an extensible TypeScript surface. The package surfaces the abstract `CommunicativeFunction` root with its `Generalization` chain into the 9 `Dimension`-specific subtype hierarchies (Task, AutoFeedback, AlloFeedback, TurnManagement, TimeManagement, DiscourseStructuring, OwnCommunicationManagement, PartnerCommunicationManagement, SocialObligationsManagement), the `DialogueAct` aggregator with its `sender`/`addressee`/`communicativeFunction`/`semanticContent`/`qualifier` association ends, the `FunctionalSegment` text-anchor metaclass, the typed `RhetoricalRelation` association with `source`/`target` member ends, and the triple-layered plug-in mechanism that the 2nd edition introduces for application-specific dimensions and language-specific functions, realised as `PackageMerge` per UML 2.5.1 §12.3. Every interface carries a JSDoc header citing the precise ISO 24617-2:2020 clause that defines it, making each symbol an auditable projection of the standard rather than an internal invention.

## Business Value — Why Extending This Metamodel Pays Off

**Adopting DiAML through a typed package collapses agent-conversation analytics from bespoke rebuild to drop-in primitive.** Every agentic-software-development team that logs multi-turn conversations between a language model and a user (or between two language models) currently re-invents a string-keyed dialogue-act vocabulary — `{type: "askForClarification"}`, `{type: "ack"}`, `{type: "propose-tool-call"}` — and inevitably collides with neighbouring teams whose vocabularies have drifted. A model expressed against `IDialogueAct`, `ICommunicativeFunction`, and the 9-`Dimension` `Enumeration` of `@amlhubs/iso-24617-2` is, by construction, comparable to every other model expressed against the same standard, regardless of which vendor's harness emitted the trace. The marginal engineering cost of switching from a bespoke vocabulary to DiAML is one import statement; the cumulative benefit is cross-vendor analytics interoperability that no proprietary schema can deliver.

**ISO normative status turns conversation logs into regulator-recognized artifacts.** The European AI Act (Regulation (EU) 2024/1689), the US NIST AI Risk Management Framework (NIST AI 100-1), and ISO/IEC 42001 (AI Management Systems) all require agentic systems to retain auditable interaction records and to demonstrate the typed nature of the interactions they support. Because `@amlhubs/iso-24617-2` projects ISO 24617-2:2020 directly into the runtime type system, any agentic platform that emits DialogueAct-typed traces can cite the ISO standard in its compliance documentation and present the same surface to auditors that academic dialogue-systems researchers have presented for over a decade. The platform's compliance posture upgrades from "we built a custom annotation scheme" to "we annotate to the international standard for dialogue act annotation".

**Compounding reuse across the AML metamodeling stack.** DiAML composes upward with every other AML metamodel: `@amlhubs/uml` provides the `IClass`, `IAssociation`, `IEnumeration`, and `IPackage` substrate; `@amlhubs/ocl` provides the constraint expression language for the well-formedness rules ISO 24617-2:2020 declares (e.g., "every DialogueAct has exactly one CommunicativeFunction"); `@amlhubs/sbvr` provides the natural-language formulations that domain experts can use to extend the standard with application-specific dimensions. A platform that already depends on `@amlhubs/uml` for its model-driven backbone gets DiAML support for the cost of adding a single peer dependency, and the typed surface is consistent with everything else in the ageni metamodeling ecosystem.

**Agentic runtime leverage through the AML PRE engine.** Ageni's Probabilistic Reduction Engine consumes the DiAML metamodel as the deterministic substrate over which large-language-model dialogue-classification reasoning operates. When an agent classifies a user utterance as an `Inform` along the `Task` dimension, the TypeScript compiler evaluates whether the proposed classification is well-formed DiAML at the same moment the compiler evaluates whether the code itself is well-formed — the two correctness checks collapse into one `tsc` pass. Hallucinations that would slip past a natural-language review (inventing a dimension that does not exist, misattributing a function to the wrong dimension, violating the "exactly one dimension per dialogue act" constraint) are caught at compile time, and every surviving classification traces to a §-section of the standard through the JSDoc header.

## Scope — What the Package Surfaces

The package exports the metaclasses ISO 24617-2:2020 declares, grouped by the standard's clauses. The complete enumeration lives in `iso-24617-2.ts`; the table below summarizes the groups and cites the authoritative clause.

| ISO 24617-2 Clause | §Section | Metaclasses Surfaced |
|---|---|---|
| Functional Segments | §4 | `IFunctionalSegment` |
| Dialogue Acts | §5 | `IDialogueAct` |
| Communicative Functions | §6 | `ICommunicativeFunction`, `IGeneralPurposeFunction`, `IDimensionSpecificFunction` |
| Dimensions | §7 | `IDimension`, `DimensionEnumeration` (Task, AutoFeedback, AlloFeedback, TurnManagement, TimeManagement, DiscourseStructuring, OwnCommunicationManagement, PartnerCommunicationManagement, SocialObligationsManagement) |
| Qualifiers | §8 | `IQualifier`, `IUncertaintyQualifier`, `IConditionalQualifier`, `IPartialityQualifier`, `ISentimentQualifier` |
| Relations | §9 | `IRhetoricalRelation`, `IFeedbackDependenceRelation`, `IFunctionalDependenceRelation` |
| Plug-in Mechanism | §10 | `IDimensionPlugin`, `IFunctionPlugin` (realised as `PackageMerge` per UML 2.5.1 §12.3) |
| DiAML XML Serialization | Annex A | `IDiAMLDocument`, `IDiAMLDialogue`, `IDiAMLTurn`, `IDiAMLUtterance` |

Every interface is accompanied by an extensible base class with the same name minus the `I` prefix (e.g., `DialogueAct`, `CommunicativeFunction`, `FunctionalSegment`). The full list and the JSDoc headers citing each §-section live at [`iso-24617-2.ts`](./iso-24617-2.ts).

## Dependency Topology

`@amlhubs/iso-24617-2` is a downstream metamodel that depends on three upstream `@amlhubs/*` packages.

```
@amlhubs/uml  (zero deps)
      ▲
      ├── @amlhubs/ocl   (constraint expression substrate)
      │
      └── @amlhubs/sbvr  (vocabulary substrate)
                ▲
                └── @amlhubs/iso-24617-2  (this package — DiAML)
```

The edges are load-bearing. `@amlhubs/iso-24617-2` imports `IClass`, `IProperty`, `IAssociation`, `IEnumeration`, `IEnumerationLiteral`, `IPackage`, and `IPackageMerge` from `@amlhubs/uml` to type every metaclass it declares. It imports `IConstraint` and `IOpaqueExpression` from `@amlhubs/ocl` to encode the well-formedness rules ISO 24617-2:2020 declares as OCL invariants. It imports `IVocabulary` from `@amlhubs/sbvr` to express the controlled-vocabulary character of every `Dimension` and `CommunicativeFunction` enumeration.

## Installation & Usage

```bash
npm install @amlhubs/iso-24617-2
```

```typescript
import type {
  IDialogueAct,
  ICommunicativeFunction,
  IFunctionalSegment,
  IRhetoricalRelation,
} from '@amlhubs/iso-24617-2';

// Declare a typed dialogue act per ISO 24617-2:2020 §5.
const userAck: IDialogueAct = {
  elementId: 'DiAML_DialogueAct_USER_ACK_001',
  senderId: 'PARTY_USER',
  addresseeIds: ['PARTY_AGENT'],
  functionalSegmentId: 'DiAML_FunctionalSegment_USER_ACK_001',
  communicativeFunctionId: 'CF_AutoPositive',
  dimensionId: 'DIM_AutoFeedback',
  qualifierIds: [],
  semanticContentId: undefined,
};
```

The source artifact is [`iso-24617-2.ts`](./iso-24617-2.ts). Every interface JSDoc header declares `@standard ISO 24617-2:2020 (2nd ed)` and a `@section §x` reference.

## Provenance & Formal References

- [ISO 24617-2:2020 — Language resource management — Semantic annotation framework — Part 2: Dialogue acts](https://www.iso.org/standard/76443.html)
- [Bunt et al., LREC 2020 — *Dialogue Act Annotation with the ISO 24617-2 Standard*](https://aclanthology.org/2020.lrec-1.69.pdf)
- [ISO/TC 37/SC 4 — Language resource management](https://www.iso.org/committee/297592.html)
- [DialogBank — multi-language DiAML annotated corpora](https://dialogbank.uvt.nl/)
- [Bunt 2009 — *The DIT++ taxonomy for functional dialogue markup*, LREC](https://aclanthology.org/W09-3304/) — the empirical base for the 9 dimensions
- [OMG UML 2.5.1 §12.3 — PackageMerge](https://www.omg.org/spec/UML/2.5.1/) — the plug-in mechanism realisation

## Version History

| Version | Date | Change Summary |
|---|---|---|
| 0.0.1 | initial publish | DialogueAct + 9 Dimensions + CommunicativeFunction Generalization chain + FunctionalSegment + Qualifier + RhetoricalRelation + FeedbackDependenceRelation + Plug-in PackageMerge |

## License

MIT — citations to ISO 24617-2:2020 throughout the codebase reproduce normative §-section references for traceability only; the ISO standard itself remains the property of the International Organization for Standardization and is not redistributed by this package.
