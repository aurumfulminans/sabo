import * as fs from 'fs';
import * as path from 'path';

export interface ValidBMITest {
  height: number;
  weight: number;
  unit: string;
  expectedBMI: number;
  category: string;
}

export interface InvalidInputTest {
  height: number | string;
  weight: number | string;
  description: string;
  requiresProgrammatic?: boolean;
  shouldCalculate?: boolean;
}

export interface BoundaryTest {
  height: number | string;
  weight: number | string;
  description: string;
  requiresProgrammatic?: boolean;
  shouldCalculate?: boolean;
}

export interface BMITestData {
  testData: {
    validBMITests: ValidBMITest[];
    invalidInputTests: InvalidInputTest[];
    boundaryTests?: BoundaryTest[];
  };
}

export function loadBMITestData(): BMITestData {
  // Resolve path relative to project root
  const filePath = path.resolve(process.cwd(), 'tests/fixtures/bmi-test-data.json');
  const fileContent = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(fileContent) as BMITestData;
}
