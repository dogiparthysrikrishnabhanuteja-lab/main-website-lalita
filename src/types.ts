/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface FAQ {
  id: string;
  category: 'all' | 'life' | 'health' | 'auto' | 'general' | 'investments' | 'tax';
  question: string;
  answer: string;
}

export interface Award {
  year: string;
  title: string;
  company: string;
  iconType: 'star' | 'medal' | 'award' | 'shield' | 'trophy';
}

export interface Partner {
  name: string;
  logoUrl: string;
  fallback: string;
}

export interface Testimonial {
  quote: string;
  author: string;
  role: string;
}

export interface ServiceElement {
  id: string;
  title: string;
  subtitle: string;
  iconName: 'heart' | 'doctor' | 'car' | 'umbrella' | 'piggy';
  description: string;
  bullets: string[];
  partners: string[];
  category: 'life' | 'health' | 'auto' | 'general' | 'investments';
}
