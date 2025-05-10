import { PatternType } from './pattern-type';

export enum PatternCategory {
    CREATIONAL = 'creational',
    STRUCTURAL = 'structural',
    BEHAVIORAL = 'behavioral',
}

export const PatternCategories: Record<PatternType, PatternCategory> = {
    // Creational patterns
    [PatternType.Builder]: PatternCategory.CREATIONAL,
    [PatternType.Factory]: PatternCategory.CREATIONAL,
    [PatternType.Prototype]: PatternCategory.CREATIONAL,
    [PatternType.Singleton]: PatternCategory.CREATIONAL,

    // Structural patterns

    // Behavioral patterns
    [PatternType.Observer]: PatternCategory.BEHAVIORAL,
} as const;
