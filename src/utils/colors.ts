import chalk from 'chalk';

// Heading styles
export const heading = (text: string): string => chalk.bold.blue.underline(text);
export const subHeading = (text: string): string => chalk.cyan(text);

// Pattern type styles
export const antiPattern = (text: string): string => chalk.red(text);
export const properPattern = (text: string): string => chalk.green(text);

// Log type styles
export const success = (text: string): string => chalk.green(text);
export const error = (text: string): string => chalk.bold.red(text);
export const warning = (text: string): string => chalk.yellow(text);
export const info = (text: string): string => chalk.blue(text);

// Code styles
export const code = (text: string): string => chalk.gray(text);

// Shape styles
export const shapeRectangle = (text: string): string => chalk.magenta(text);
export const shapeCircle = (text: string): string => chalk.cyan(text);
export const shapeTriangle = (text: string): string => chalk.yellow(text);
export const shapeValue = (text: string): string => chalk.bold.white(text);

// Observer styles
export const weatherStation = (text: string): string => chalk.blue(text);
export const phoneDisplay = (text: string): string => chalk.green(text);
export const webDisplay = (text: string): string => chalk.cyan(text);
export const smartHome = (text: string): string => chalk.yellow(text);
export const emailAlert = (text: string): string => chalk.red(text);
