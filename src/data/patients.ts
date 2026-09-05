/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Patient } from '../types';

// Clean clinical patient queue - zero predefined patients on intake
export const INITIAL_PATIENTS: Patient[] = [];

// Empty fallback array ensuring no sample patients are injected
export const DEMO_SAMPLE_PATIENTS: Patient[] = [];
