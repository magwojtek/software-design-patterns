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
    [PatternType.Adapter]: PatternCategory.STRUCTURAL,
    [PatternType.Bridge]: PatternCategory.STRUCTURAL,
    [PatternType.Composite]: PatternCategory.STRUCTURAL,
    [PatternType.Decorator]: PatternCategory.STRUCTURAL,
    [PatternType.Facade]: PatternCategory.STRUCTURAL,
    [PatternType.Flyweight]: PatternCategory.STRUCTURAL,
    [PatternType.Proxy]: PatternCategory.STRUCTURAL,

    // Behavioral patterns
    [PatternType.Observer]: PatternCategory.BEHAVIORAL,
} as const;

export const CategoryPatterns: Record<PatternCategory, PatternType[]> = Object.entries(
    PatternCategories,
).reduce(
    (acc, [patternType, category]) => {
        if (!acc[category]) {
            acc[category] = [];
        }
        acc[category].push(patternType as PatternType);
        return acc;
    },
    {} as Record<PatternCategory, PatternType[]>,
);
