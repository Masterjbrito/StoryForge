import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import { loadFromStorage, saveToStorage } from '@/lib/storage';
import type { Persona, BusinessRule, AcceptanceCriteriaSet, LibraryTestCase } from '@/types/domain';
import {
  initialPersonas,
  initialBusinessRules,
  initialAcceptanceCriteria,
  initialTestCases,
} from '@/data/mock-library';

interface LibraryContextValue {
  personas: Persona[];
  businessRules: BusinessRule[];
  acceptanceCriteria: AcceptanceCriteriaSet[];
  testCases: LibraryTestCase[];
  addPersona: (persona: Omit<Persona, 'id' | 'usedIn'>) => void;
  addBusinessRule: (rule: Omit<BusinessRule, 'id' | 'usedIn'>) => void;
  addAcceptanceCriteria: (criteria: Omit<AcceptanceCriteriaSet, 'id' | 'usedIn'>) => void;
  addTestCase: (testCase: Omit<LibraryTestCase, 'id' | 'usedIn'>) => void;
  deletePersona: (id: number) => void;
  deleteBusinessRule: (id: number) => void;
  deleteAcceptanceCriteria: (id: number) => void;
  deleteTestCase: (id: number) => void;
}

const LibraryContext = createContext<LibraryContextValue | null>(null);

export function LibraryProvider({ children }: { children: ReactNode }) {
  const [personas, setPersonas] = useState<Persona[]>(() =>
    loadFromStorage('library_personas', initialPersonas)
  );
  const [businessRules, setBusinessRules] = useState<BusinessRule[]>(() =>
    loadFromStorage('library_rules', initialBusinessRules)
  );
  const [acceptanceCriteria, setAcceptanceCriteria] = useState<AcceptanceCriteriaSet[]>(() =>
    loadFromStorage('library_ac', initialAcceptanceCriteria)
  );
  const [testCases, setTestCases] = useState<LibraryTestCase[]>(() =>
    loadFromStorage('library_tc', initialTestCases)
  );

  const persistAll = useCallback(
    (p: Persona[], r: BusinessRule[], a: AcceptanceCriteriaSet[], t: LibraryTestCase[]) => {
      saveToStorage('library_personas', p);
      saveToStorage('library_rules', r);
      saveToStorage('library_ac', a);
      saveToStorage('library_tc', t);
    },
    []
  );

  const addPersona = useCallback(
    (data: Omit<Persona, 'id' | 'usedIn'>) => {
      const newId = Math.max(0, ...personas.map((p) => p.id)) + 1;
      const updated = [...personas, { ...data, id: newId, usedIn: 0 }];
      setPersonas(updated);
      saveToStorage('library_personas', updated);
    },
    [personas]
  );

  const addBusinessRule = useCallback(
    (data: Omit<BusinessRule, 'id' | 'usedIn'>) => {
      const newId = Math.max(0, ...businessRules.map((r) => r.id)) + 1;
      const updated = [...businessRules, { ...data, id: newId, usedIn: 0 }];
      setBusinessRules(updated);
      saveToStorage('library_rules', updated);
    },
    [businessRules]
  );

  const addAcceptanceCriteria = useCallback(
    (data: Omit<AcceptanceCriteriaSet, 'id' | 'usedIn'>) => {
      const newId = Math.max(0, ...acceptanceCriteria.map((a) => a.id)) + 1;
      const updated = [...acceptanceCriteria, { ...data, id: newId, usedIn: 0 }];
      setAcceptanceCriteria(updated);
      saveToStorage('library_ac', updated);
    },
    [acceptanceCriteria]
  );

  const addTestCase = useCallback(
    (data: Omit<LibraryTestCase, 'id' | 'usedIn'>) => {
      const newId = Math.max(0, ...testCases.map((t) => t.id)) + 1;
      const updated = [...testCases, { ...data, id: newId, usedIn: 0 }];
      setTestCases(updated);
      saveToStorage('library_tc', updated);
    },
    [testCases]
  );

  const deletePersona = useCallback(
    (id: number) => {
      const updated = personas.filter((p) => p.id !== id);
      setPersonas(updated);
      saveToStorage('library_personas', updated);
    },
    [personas]
  );

  const deleteBusinessRule = useCallback(
    (id: number) => {
      const updated = businessRules.filter((r) => r.id !== id);
      setBusinessRules(updated);
      saveToStorage('library_rules', updated);
    },
    [businessRules]
  );

  const deleteAcceptanceCriteria = useCallback(
    (id: number) => {
      const updated = acceptanceCriteria.filter((a) => a.id !== id);
      setAcceptanceCriteria(updated);
      saveToStorage('library_ac', updated);
    },
    [acceptanceCriteria]
  );

  const deleteTestCase = useCallback(
    (id: number) => {
      const updated = testCases.filter((t) => t.id !== id);
      setTestCases(updated);
      saveToStorage('library_tc', updated);
    },
    [testCases]
  );

  return (
    <LibraryContext.Provider
      value={{
        personas,
        businessRules,
        acceptanceCriteria,
        testCases,
        addPersona,
        addBusinessRule,
        addAcceptanceCriteria,
        addTestCase,
        deletePersona,
        deleteBusinessRule,
        deleteAcceptanceCriteria,
        deleteTestCase,
      }}
    >
      {children}
    </LibraryContext.Provider>
  );
}

export function useLibrary() {
  const ctx = useContext(LibraryContext);
  if (!ctx) throw new Error('useLibrary must be used within LibraryProvider');
  return ctx;
}
