/**
 * Type definitions for solver weight configurations.
 * Weights control the importance of different objectives in the staff scheduling solver.
 */

/**
 * Available weight types for the solver objectives.
 * Each weight controls a specific optimization goal.
 */
export type WeightType =
  | 'free_weekend'
  | 'consecutive_nights'
  | 'hidden'
  | 'overtime'
  | 'consecutive_days'
  | 'rotate'
  | 'wishes'
  | 'after_night'
  | 'second_weekend';

/**
/** Metadata for a single weight configuration. */
export interface WeightMetadata {
  /** Unique identifier key for the weight */
  key: WeightType;
  /** Display label for the UI */
  label: string;
  /** Detailed description of what this weight controls */
  description: string;
}

/**
 * Complete weight configuration for the solver.
 * Maps weight types to their numeric values.
 */
export interface Weights {
  /** Free Days Near Weekend - Prioritizes having free days adjacent to weekends */
  free_weekend: number;
  /** Minimize Consecutive Night Shifts - Reduces consecutive night shift assignments */
  consecutive_nights: number;
  /** Minimize Hidden Employees - Ensures all qualified employees are utilized */
  hidden: number;
  /** Minimize Overtime - Reduces total overtime hours across all employees */
  overtime: number;
  /** Not Too Many Consecutive Days - Limits consecutive working days */
  consecutive_days: number;
  /** Rotate Shifts Forward - Encourages forward shift rotation (F→S→N) */
  rotate: number;
  /** Maximize Employee Wishes - Honors employee scheduling preferences */
  wishes: number;
  /** Free Day After Night Shift Phase - Ensures rest day after night shifts */
  after_night: number;
  /** Every Second Weekend Free - Aims for alternating free weekends */
  second_weekend: number;
}

/**
 * Metadaten für alle verfügbaren Gewichtungen.
 * Wird verwendet, um UI-Steuerelemente und Validierung zu generieren.
 */
export const WEIGHT_METADATA: WeightMetadata[] = [
  {
    key: 'free_weekend',
    label: 'Freie Tage am Wochenende',
    description: 'Freie Tage nahe am Wochenende bevorzugen',
  },
  {
    key: 'consecutive_nights',
    label: 'Aufeinanderfolgende Nachtschichten',
    description: 'Aufeinanderfolgende Nachtschichten minimieren',
  },
  {
    key: 'hidden',
    label: 'Versteckte Mitarbeiter',
    description: 'Sicherstellen, dass alle qualifizierten Mitarbeiter eingeplant werden',
  },
  {
    key: 'overtime',
    label: 'Überstunden',
    description: 'Überstunden aller Mitarbeiter minimieren',
  },
  {
    key: 'consecutive_days',
    label: 'Aufeinanderfolgende Arbeitstage',
    description: 'Aufeinanderfolgende Arbeitstage begrenzen',
  },
  {
    key: 'rotate',
    label: 'Schichten vorwärts rotieren',
    description: 'Vorwärtsrotation der Schichten fördern (F→S→N)',
  },
  {
    key: 'wishes',
    label: 'Mitarbeiterwünsche',
    description: 'Wünsche der Mitarbeiter berücksichtigen',
  },
  {
    key: 'after_night',
    label: 'Freier Tag nach Nachtschicht',
    description: 'Ruhetag nach Nachtschichtphase sicherstellen',
  },
  {
    key: 'second_weekend',
    label: 'Jedes zweite Wochenende frei',
    description: 'Abwechselnde freie Wochenenden anstreben',
  },
];

/**
 * Default weight values.
 * Used when initializing a new case without existing weights.
 */
export const DEFAULT_WEIGHTS: Weights = {
  free_weekend: 2,
  consecutive_nights: 2,
  hidden: 100,
  overtime: 4,
  consecutive_days: 1,
  rotate: 1,
  wishes: 3,
  after_night: 3,
  second_weekend: 1,
};
